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

## Rotary Embedding

Rotary Position Embedding (RoPE), Llama 特有的位置编码。(看起来还是基于不同频率的单位旋转向量)

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

`inv_freq` 是一个一轴张量, 存储了不同的频率, 长度 (频率的数量) 是 $\lfloor \frac {dim}{2} \rfloor$, 这里 `dim` 是词向量的维数.

这是为了将位置信息存储到每个向量的每个分量中, 而每个频率需要用到两个分量来分别存储 $\sin$ 和 $\cos$.

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

在层内部采用了

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
