# Llama 代码阅读

Llama 是基于 Decoder only 架构的语言模型。

## 结构

```py
def __init__(self, config: LlamaConfig):
  super().__init__(config)
  self.padding_idx = config.pad_token_id
  self.vocab_size = config.vocab_size

  self.embed_tokens = nn.Embedding(config.vocab_size, config.hidden_size, self.padding_idx)
  self.layers = nn.ModuleList(
      [LlamaDecoderLayer(config, layer_idx) for layer_idx in range(config.num_hidden_layers)]
  )
  self.norm = LlamaRMSNorm(config.hidden_size, eps=config.rms_norm_eps)
  self.rotary_emb = LlamaRotaryEmbedding(config=config)
  self.gradient_checkpointing = False

  self.post_init()
```

一个将词汇转化成向量的嵌入层，若干个 Decoder 层，一个归一化层，一个旋转嵌入层。

## Rotary Embedding

Rotary Position Embedding (RoPE), 是为注意力模型引入位置信息的位置编码。

基于不同频率的单位旋转向量, 编码数字的不同的位的值. (有点像钟表不同的指针有不同的旋转频率, 但是组合起来是一个独一无二的时间)

```py
class LlamaRotaryEmbedding(nn.Module):
  def __init__(self, config: LlamaConfig, device=None):
    super().__init__()
    # BC: "rope_type" was originally "type" 
    if hasattr(config, "rope_scaling") and config.rope_scaling is not None:
        self.rope_type = config.rope_scaling.get("rope_type", config.rope_scaling.get("type"))
    else:
        self.rope_type = "default"
    self.max_seq_len_cached = config.max_position_embeddings
    self.original_max_seq_len = config.max_position_embeddings

    self.config = config
    self.rope_init_fn = ROPE_INIT_FUNCTIONS[self.rope_type]

    inv_freq, self.attention_scaling = self.rope_init_fn(self.config, device)
    self.register_buffer("inv_freq", inv_freq, persistent=False)
    self.original_inv_freq = self.inv_freq
```

`inv_freq` 是一个一轴张量, 存储了不同的频率, 长度 (频率的数量) 是 $\lfloor \frac {head\_dim}{2} \rfloor$, 这里 `head_dim` 是注意力向量的维数, 因为只有注意力模块内需要进行位置编码.

这是为了将位置信息存储到每个向量的每个分量中, 而每个频率需要用到两个分量来分别存储 $\sin$ 和 $\cos$.

它的值由这个公式给出:

$$
\text{inv\_freq}_i = \frac {1}{10000^{\frac {2i}{\text{head\_dim}}}}
$$

前面的频率高, 后面的频率低.

```py
def _dynamic_frequency_update(self, position_ids, device):
  """
  dynamic RoPE layers should recompute `inv_freq` in the following situations:
  1 - growing beyond the cached sequence length (allow scaling)
  2 - the current sequence length is in the original scale (avoid losing precision with small sequences)
  """
  seq_len = torch.max(position_ids) + 1
  if seq_len > self.max_seq_len_cached:  # growth
    inv_freq, self.attention_scaling = self.rope_init_fn(self.config, device, seq_len=seq_len)
    self.register_buffer("inv_freq", inv_freq, persistent=False)  # TODO joao: may break with compilation
    self.max_seq_len_cached = seq_len

  if seq_len < self.original_max_seq_len and self.max_seq_len_cached > self.original_max_seq_len:  # reset
    # This .to() is needed if the model has been moved to a device after being initialized (because
    # the buffer is automatically moved, but not the original copy)
    self.original_inv_freq = self.original_inv_freq.to(device)
    self.register_buffer("inv_freq", self.original_inv_freq, persistent=False)
    self.max_seq_len_cached = self.original_max_seq_len
```

`position_ids` 是一个二轴张量 `(batch, seq_len)`, 记录了每个向量的位置编号.  从中间插了长度为 $1$ 的一轴, 是为了在后面的计算中利用广播机制.

`inv_freq` 原本只有一轴, 在前后各加一轴, `expand` 操作中, 第一个轴扩展到和 $position_ids$ 的首个轴相同 (`batch`), 第二个轴的 `-1` 表示大小不变.

因此 `inv_freq_expanded` 和 `position_ids_expanded` 的形状分别为: `(batch, head_dim // 2, 1)` 和 `(batch, 1, seq_len)`. 这两个张量在 `@` 运算符下做矩阵乘法，其实就是对最后两轴的矩阵乘法, 即做 `batch` 次矩阵乘法, 每次矩阵乘法是 `(head_dim // 2, 1)` 和 `(1, seq_len)` 两个张量运算, 结果是 `(head_dim // 2, seq_len)`, 作为结果的后两轴, 第一轴则是 `batch`.

所以 `freqs` 的形状在转置后两轴 (轴 $1$ 和轴 $2$) 后, 形状是 `(batch, seq_len, head_dim // 2)`. 而 `emb` 是两个 `freqs` 在最后一轴上的连接, 形状是 `(batch, seq_len, head_dim)`.

`fraqs[i][j][k]` 的意义可以这样理解: 第 `i` 个序列的第 `j` 个元素在第 `k mod (head_dim // 2)` 频率下旋转的角度.

> 有一个比较迷惑的点在于命名中 `inv` 的意义. 因为把 `position_id` 看作旋转的时间 $t$, 把 `inv_freq` 的值和 `position_id` 的值相乘, 得到旋转角度 $\theta$, 所以在 $\theta = t\omtga$ 里, `inv_freq` 相当于角速度 $\omega$. 而频率 $f = \frac {\omega}{2\pi}$. 所以 `inv_freq` 无论是什么都应该是和频率 $f$ 成正比的, `inv` 的存在没有道理.

```py
@torch.no_grad()
def forward(self, x, position_ids):
  if "dynamic" in self.rope_type:
      self._dynamic_frequency_update(position_ids, device=x.device)

  # Core RoPE block
  inv_freq_expanded = self.inv_freq[None, :, None].float().expand(position_ids.shape[0], -1, 1)
  position_ids_expanded = position_ids[:, None, :].float()
  # Force float32 (see https://github.com/huggingface/transformers/pull/29285)
  device_type = x.device.type
  device_type = device_type if isinstance(device_type, str) and device_type != "mps" else "cpu"
  with torch.autocast(device_type=device_type, enabled=False):
    freqs = (inv_freq_expanded.float().to(x.device) @ position_ids_expanded.float()).transpose(1, 2)
    emb = torch.cat((freqs, freqs), dim=-1)
    cos = emb.cos()
    sin = emb.sin()

  # Advanced RoPE types (e.g. yarn) apply a post-processing scaling factor, equivalent to scaling attention
  cos = cos * self.attention_scaling
  sin = sin * self.attention_scaling

  return cos.to(dtype=x.dtype), sin.to(dtype=x.dtype)
```

输出两个张量, 表示了每个位置在每个频率的 $\sin$ 和 $\cos$. 接下来是在注意力模块中, 应用 `sin` 和 `cos` 进行位置编码.

```py
def apply_rotary_pos_emb(q, k, cos, sin, position_ids=None, unsqueeze_dim=1):
  """Applies Rotary Position Embedding to the query and key tensors.

  Args:
    q (`torch.Tensor`): The query tensor.
    k (`torch.Tensor`): The key tensor.
    cos (`torch.Tensor`): The cosine part of the rotary embedding.
    sin (`torch.Tensor`): The sine part of the rotary embedding.
    position_ids (`torch.Tensor`, *optional*):
      Deprecated and unused.
    unsqueeze_dim (`int`, *optional*, defaults to 1):
      The 'unsqueeze_dim' argument specifies the dimension along which to unsqueeze cos[position_ids] and
      sin[position_ids] so that they can be properly broadcasted to the dimensions of q and k. For example, note
      that cos[position_ids] and sin[position_ids] have the shape [batch_size, seq_len, head_dim]. Then, if q and
      k have the shape [batch_size, heads, seq_len, head_dim], then setting unsqueeze_dim=1 makes
      cos[position_ids] and sin[position_ids] broadcastable to the shapes of q and k. Similarly, if q and k have
      the shape [batch_size, seq_len, heads, head_dim], then set unsqueeze_dim=2.
  Returns:
    `tuple(torch.Tensor)` comprising of the query and key tensors rotated using the Rotary Position Embedding.
  """
  cos = cos.unsqueeze(unsqueeze_dim)
  sin = sin.unsqueeze(unsqueeze_dim)
  q_embed = (q * cos) + (rotate_half(q) * sin)
  k_embed = (k * cos) + (rotate_half(k) * sin)
  return q_embed, k_embed
```

用 `unsqueeze` 给两个张量插入一个轴, `unsqueeze_dim` 指定了新轴的位置, 将张量的形状变成 `(batch, 1, seq_len, head_dim)`, 以便在接下来的计算中利用广播机制.

`rotate_half` 函数的操作类似于平面向量 $(x, y)$ 旋转 $90^{\circ}$ 到 $(-y, x)$ 的操作. 只不过这里的 $x$ 和 $y$ 是张量沿最后一轴切开的前一半和后一半. 这里 `q` 的形状是 `(batch, att_heads, seq_len, head_dim)`, 那么将它沿最后一轴切开, 前半部分是 `ql`, 后半部分是 `qr`, 形状都是 `(batch, att_heads, seq_len, head_dim // 2)`, 然后将 `-qr` 和 `ql` 沿最后一轴连结, 形状还原, 这就是 `rotate_half(q)` 的结果.

将 `rotate_half(q)` 利用广播机制, 逐元素和 `sin` 相乘, 加上 `q` 本身逐元素和 `cos` 相乘. 微观地考察新的 `(batch, att_heads, seq_len, head_dim)` 张量的每个 `head_dim` 维向量 `q_embed[i][j][k]` 的意义, 应当是第 $i$ 个序列的第 $j$ 个注意力头上, 序列上第 $k$ 个向量, 叠加了位置信息的结果.

将这个向量记为 $y$, 原向量 `q_{i, j, k}` 记为 $x$.

假设这个向量的位置是 $Pos$, 那么它在 $\omega_i$ 上旋转的角度就是 $\theta_i = \omega_i Pos$. 共 $\frac{head\_dim}2$ 个频率, 这里枚举变量 $i$ 的范围也是 $[0, \frac{head\_dim}2)$. 接下来分析每一个分量的意义:

$$
y_i = \cos(\theta_i)x_i - \sin(\theta_i) x_{\frac{head\_dim}2 + i}\\
y_{\frac {head\_dim}2 + i} = \cos(\theta_i)x_{\frac {head\_dim}2 + i} + \sin(\theta_i) x_i
$$

分析几何意义, 将 $(x_i, x_{\frac{head\_dim}2 + i})$ 逆时针旋转角度 $\theta_i$ 恰好就是 $(y_i, y_{\frac{head\_dim}2 + i})$.

所以旋转嵌入实际做的事情就是将输入张量沿最后一轴分成两半, 将前后两半对应的元素当成是二维向量的坐标, 然后将所有二维向量逆时针旋转对应的角度. 由于输入向量共 `head_dim` 维, 所以恰好可以看成是 `head_dim // 2` 个二维向量, 又存在 `head_dim // 2` 个频率, 和位置信息一起, 规定了每个向量旋转的角度.

## Normalization

规范化, 是保持数值传递过程中的稳定性的. 通过仿射变换将数值的均值和方差控制在一个预设的值上. 这里的规范化没有将均值置零, 而是直接将隐藏状态乘以一个倍数.

```py
class LlamaRMSNorm(nn.Module):
  def __init__(self, hidden_size, eps=1e-6):
    """
    LlamaRMSNorm is equivalent to T5LayerNorm
    """
    super().__init__()
    self.weight = nn.Parameter(torch.ones(hidden_size))
    self.variance_epsilon = eps

  def forward(self, hidden_states):
    input_dtype = hidden_states.dtype
    hidden_states = hidden_states.to(torch.float32)
    variance = hidden_states.pow(2).mean(-1, keepdim=True)
    hidden_states = hidden_states * torch.rsqrt(variance + self.variance_epsilon)
    return self.weight * hidden_states.to(input_dtype)

  def extra_repr(self):
    return f"{tuple(self.weight.shape)}, eps={self.variance_epsilon}"

ALL_LAYERNORM_LAYERS.append(LlamaRMSNorm)
```

`variance` 是隐藏状态的每一个向量的 L2 范数. 其中 `mean(-1, keepdim = True)` 指沿最后一轴求均值, 结果张量轴数不变, 但是最后一轴的大小变成 $1$. 

`torch.rsqrt` 是对值求平方根倒数, 为了防止除零错误, 还会加一个 `variance_epsilon`. 和 `hidden_states` 相乘会触发广播机制, 使得每个向量的每个分量乘以对应的倍数, 保持向量的方向不变, L2 范数都变成 $1$. 相当于把每个向量都变成了单位超球上的点坐标.

最后乘以可学习的权值 `self.weight`, 这个权值被初始化为全 $1$. 这是为了强调或削弱某些维度分量的影响. 这个值对所有向量都是相同的, 所以它应当只有一轴, 长度为 $dim$, 也就是向量长度, 表示每一个分量的权值.

## MLP

多层感知机 (MultiLayer Perceptron), 在 transformer 中一般是带非线性激活函数的一个全连接的隐藏层. 

`hidden_size` 就是隐藏状态的大小, 也就是向量序列的每个向量的维数. `intermediate_size` 是隐藏层的大小, 也就是通过激活函数的一层的向量的维数, 一般来说, 为了提取更多信息, `intermediate_size` 会比 `hidden_size` 大.

对于激活函数的选择, 这部分代码没有规定, 而是读取了 `config` 中指定的函数.

```py
class LlamaMLP(nn.Module):
  def __init__(self, config):
    super().__init__()
    self.config = config
    self.hidden_size = config.hidden_size
    self.intermediate_size = config.intermediate_size
    self.gate_proj = nn.Linear(self.hidden_size, self.intermediate_size, bias=config.mlp_bias)
    self.up_proj = nn.Linear(self.hidden_size, self.intermediate_size, bias=config.mlp_bias)
    self.down_proj = nn.Linear(self.intermediate_size, self.hidden_size, bias=config.mlp_bias)
    self.act_fn = ACT2FN[config.hidden_act]

  def forward(self, x):
    down_proj = self.down_proj(self.act_fn(self.gate_proj(x)) * self.up_proj(x))
    return down_proj
```

发现这里共有三组线性全连接参数, 但是如果仅仅是 `线性组合-激活函数-线性组合` 的过程, 则只需要两组全连接参数. 阅读 `forward` 部分发现, 对于每个向量, 除了进行 `线性组合-激活函数`, 同时进行另一组线性组合. 这两个并行的操作的结果应当都是 `intermediate_size` 维的向量, 接着把两个向量逐分量相乘, 得到的结果仍是一个 `intermediate_size` 维的向量, 最后进行线性组合, 将向量维数还原.

结果流向激活函数的线性全连接参数在这里是 `gate_proj`, 仅进行线性全连接升维的参数是 `up_proj` (上投影), 最后还原维数的是 `down_proj` (下投影).

MLP 的操作是基于向量的, 对于流过同一个 MLP 的向量, 共享同一组参数, 互相独立.

## 自注意力模块

Attention is all you need. 

在自注意力模块中, 键, 值, 查询均来自输入的隐藏层. 而且由于是 decoder 的自注意力模块, 所以注意力存在 mask, 使得序列后面的元素无法对前面的元素产生影响.

这是一个多头注意力模块, 会将输入的向量拆分成若干个维度低的小向量, 分给不同的注意力头, 最后合并, 将维度还原.

```py
class LlamaAttention(nn.Module):
  """Multi-headed attention from 'Attention Is All You Need' paper"""

  def __init__(self, config: LlamaConfig, layer_idx: int):
    super().__init__()
    self.config = config
    self.layer_idx = layer_idx
    self.head_dim = getattr(config, "head_dim", config.hidden_size // config.num_attention_heads)
    self.num_key_value_groups = config.num_attention_heads // config.num_key_value_heads
    self.scaling = self.head_dim**-0.5
    self.attention_dropout = config.attention_dropout
    self.is_causal = True

    self.q_proj = nn.Linear(
      config.hidden_size, config.num_attention_heads * self.head_dim, bias=config.attention_bias
    )
    self.k_proj = nn.Linear(
      config.hidden_size, config.num_key_value_heads * self.head_dim, bias=config.attention_bias
    )
    self.v_proj = nn.Linear(
      config.hidden_size, config.num_key_value_heads * self.head_dim, bias=config.attention_bias
    )
    self.o_proj = nn.Linear(
      config.num_attention_heads * self.head_dim, config.hidden_size, bias=config.attention_bias
    )
```

`getattr` 的作用是获取某个对象的某个属性值, 第一个参数是获取属性的对象, 第二个参数是字符串类型的属性名, 第三个参数是如果属性不存在, 则返回的默认值. 初始化时用这一句来规定每个注意力头的维度数量.

`q_proj`, `k_proj`, `v_proj` 三个线性全连接层分别是从输入的向量提取查询, 键, 值的, 它们的输出向量的维数是 `num_heads*head_dim` 的, 也对应了每个注意力头都能分到 `head_dim` 的向量. `o_proj` 则是将所有注意力头的输出汇总到输入规格的向量中.

在经典的 transformer 中, 一个注意力头就具有一组询问, 键, 值, 但是发现 `num_attention_heads` 和 `num_key_value_heads` 同为注意力头, 却使用了两个不同的变量存储. 这是因为在现代的注意力机制中, 存在不同查询头共享键-值的情况, 这样可以优化性能, 所以就有了键-值头和查询头的数量不同的情况.

```py
def forward(
  self,
  hidden_states: torch.Tensor,
  position_embeddings: Tuple[torch.Tensor, torch.Tensor],
  attention_mask: Optional[torch.Tensor],
  past_key_value: Optional[Cache] = None,
  cache_position: Optional[torch.LongTensor] = None,
  **kwargs: Unpack[FlashAttentionKwargs],
) -> Tuple[torch.Tensor, Optional[torch.Tensor], Optional[Tuple[torch.Tensor]]]:
  input_shape = hidden_states.shape[:-1]
  hidden_shape = (*input_shape, -1, self.head_dim)

  query_states = self.q_proj(hidden_states).view(hidden_shape).transpose(1, 2)
  key_states = self.k_proj(hidden_states).view(hidden_shape).transpose(1, 2)
  value_states = self.v_proj(hidden_states).view(hidden_shape).transpose(1, 2)

  cos, sin = position_embeddings
  query_states, key_states = apply_rotary_pos_emb(query_states, key_states, cos, sin)
```

先看前面这部分, `hidden_states.shape[:-1]` 提取了隐藏状态的形状, `hidden_states` 的形状应当是 `(batch, seq_len, dim)` 的. 但是 `[:-1]` 删掉了最后一轴, 得到 `(batch, seq_len)`. 然后用 `*` 将元组 `input_shape` 解包, 在后面加上两个轴. 其中倒数第二个轴规定的 `-1` 表示这一轴的大小自动计算, 维持张量的元素数不变. 这样计算的 `hidden_shape` 也就是 `(batch, seq_len, -1, head_dim)`.

根据前面的分析, `q_proj` 的结果的形状应当是 `(batch, seq_len, att_heads * head_dim)`, 而 `k_proj` 和 `v_proj` 的形状是 `(batch, seq_len, kv_heads * head_dim)`. 通过 `view` 在不改变元素存储位置的情况下, 自动计算的第三个轴显然应该是对应的注意力头数, 最后转置中间两个轴, 得到的张量形状应该分别是: `(batch, att_heads, seq_len, head_dim)`, `(batch, kv_heads, seq_len, head_dim)`. 每个头应该处理的也便是后两轴的信息, 长度为 `seq_len` 的 `head_dim` 维向量的序列.

通过旋转嵌入, 将位置信息加入到查询和键中.

```py
if past_key_value is not None:
  # sin and cos are specific to RoPE models; cache_position needed for the static cache
  cache_kwargs = {"sin": sin, "cos": cos, "cache_position": cache_position}
  key_states, value_states = past_key_value.update(key_states, value_states, self.layer_idx, cache_kwargs)

attention_interface: Callable = eager_attention_forward
if self.config._attn_implementation != "eager":
  if self.config._attn_implementation == "sdpa" and kwargs.get("output_attentions", False):
    logger.warning_once(
      "`torch.nn.functional.scaled_dot_product_attention` does not support `output_attentions=True`. Falling back to "
      'eager attention. This warning can be removed using the argument `attn_implementation="eager"` when loading the model.'
    )
  else:
    attention_interface = ALL_ATTENTION_FUNCTIONS[self.config._attn_implementation]

attn_output, attn_weights = attention_interface(
  self,
  query_states,
  key_states,
  value_states,
  attention_mask,
  dropout=0.0 if not self.training else self.attention_dropout,
  scaling=self.scaling,
  **kwargs,
)

attn_output = attn_output.reshape(*input_shape, -1).contiguous()
attn_output = self.o_proj(attn_output)
return attn_output, attn_weights
```

更新了 kv_cache, 然后选择了注意力计算函数 `attention_interface`, 这部分是外部定义的, 作用是根据给定的查询, 键-值, 掩码, 给出对应的注意力输出.

通过 `attention_interface` 函数得到注意力输出后, 将 `attn_output` 的形状从 `(batch, att_heads, seq_len, head_dim)` 变成 `(batch, seqlen, -1)`, 最后一轴的大小经过自动计算后应当是 `att_heads * head_dim`. `contiguous` 则是将张量的内存重新整理, 使得元素的存储连续. 最后通过 `o_proj` 将 `att_heads * head_dim` 维的向量恢复成 `dim` 维的向量.

## Decoder Layer

由自注意力模块，多层感知机构成，和 encoder 的区别是，decoder 的自注意力模块带掩码。

```py
class LlamaDecoderLayer(nn.Module):
  def __init__(self, config: LlamaConfig, layer_idx: int):
    super().__init__()
    self.hidden_size = config.hidden_size

    self.self_attn = LlamaAttention(config=config, layer_idx=layer_idx)

    self.mlp = LlamaMLP(config)
    self.input_layernorm = LlamaRMSNorm(config.hidden_size, eps=config.rms_norm_eps)
    self.post_attention_layernorm = LlamaRMSNorm(config.hidden_size, eps=config.rms_norm_eps)
```

采用了残差连接, 输出为输入和残差的和.

```py
residual = hidden_states

hidden_states = self.input_layernorm(hidden_states)

# Self Attention
hidden_states, self_attn_weights = self.self_attn(
  hidden_states=hidden_states,
  attention_mask=attention_mask,
  position_ids=position_ids,
  past_key_value=past_key_value,
  output_attentions=output_attentions,
  use_cache=use_cache,
  cache_position=cache_position,
  position_embeddings=position_embeddings,
  **kwargs,
)
hidden_states = residual + hidden_states

# Fully Connected
residual = hidden_states
hidden_states = self.post_attention_layernorm(hidden_states)
hidden_states = self.mlp(hidden_states)
hidden_states = residual + hidden_states

outputs = (hidden_states,)
if output_attentions:
    outputs += (self_attn_weights,)

return outputs
```


## 传递

初始化: 

- 初始化掩码
- 输入的张量作为第一轮的隐藏状态
- 由旋转嵌入层计算的位置信息
- 根据超参数配置是否要输出隐藏状态和自注意力。

```py
causal_mask = self._update_causal_mask(
  attention_mask, inputs_embeds, cache_position, past_key_values, output_attentions
)
hidden_states = inputs_embeds
position_embeddings = self.rotary_emb(hidden_states, position_ids)
all_hidden_states = () if output_hidden_states else None
all_self_attns = () if output_attentions else None
```

接下来就是在所有 decoder 中依次传递：

中间区分了是否记录梯度检查点两种传递方式，但是流程都是将现有的数据放进解码器中，然后得到对应的 `layer_outputs`.

```py
for decoder_layer in self.layers[: self.config.num_hidden_layers]:
  if output_hidden_states:
    all_hidden_states += (hidden_states,)

  if self.gradient_checkpointing and self.training:
    layer_outputs = self._gradient_checkpointing_func(
      decoder_layer.__call__,
      hidden_states,
      causal_mask,
      position_ids,
      past_key_values,
      output_attentions,
      use_cache,
      cache_position,
      position_embeddings,
    )
  else:
    layer_outputs = decoder_layer(
      hidden_states,
      attention_mask=causal_mask,
      position_ids=position_ids,
      past_key_value=past_key_values,
      output_attentions=output_attentions,
      use_cache=use_cache,
      cache_position=cache_position,
      position_embeddings=position_embeddings,
      **flash_attn_kwargs,
    )

  hidden_states = layer_outputs[0]

  if output_attentions:
    all_self_attns += (layer_outputs[1],)
```

在传递经过所有层后再归一化，输出。

```py
# add hidden states from the last decoder layer
hidden_states = self.norm(hidden_states)
if output_hidden_states:
  all_hidden_states += (hidden_states,)

output = BaseModelOutputWithPast(
  last_hidden_state=hidden_states,
  past_key_values=past_key_values if use_cache else None,
  hidden_states=all_hidden_states,
  attentions=all_self_attns,
)
```
