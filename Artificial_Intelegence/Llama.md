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

## Decoder Layer

由自注意力模块，多层感知机构成，和 encoder 的区别是，自注意力模块带掩码。

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