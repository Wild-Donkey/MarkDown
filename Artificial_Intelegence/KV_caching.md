# KV caching

## prefill & decode

对于一条 promt, 生成第一个预测 token 的阶段可以称为: prefill 阶段. 后面的一条接一条预测的过程称为 decode 阶段.

在最简单的代码中, prefill 和 decode 阶段是本质相同的, 只有定义上的区别.

```py
for i in range(10000):
  with torch.no_grad():
    outputs = model(**inputs)
    next_token_logits = outputs.logits[0, -1, :]  # 形状: (vocab_size,)
    next_token = torch.argmax(next_token_logits, dim=-1).unsqueeze(0)
    generated_token = tokenizer.decode(next_token, skip_special_tokens=True)
    print(generated_token, end="", flush=True)  # 逐 token 打印
    inputs["input_ids"] = torch.cat([inputs["input_ids"], next_token.unsqueeze(0)], dim=-1)
    inputs["attention_mask"] = torch.cat([inputs["attention_mask"], torch.ones((1, 1), device=device)], dim=-1)
      
    # 如果生成了结束符，则停止生成
    if next_token == tokenizer.eos_token_id:
      break
```

## 注意力模块的复杂度分析

注意力模块一般被认为是计算效率的瓶颈。

- $t$ for tokens
- $d$ for head dimensions
- $D$ for token dimensions
- $b$ for batches
- $l$ for layers (decoder layers)
- $h$ for heads

每个注意力头, 需要对 $t$ 个 token 互相计算注意力得分, 结果会是一个 $t \times t$ 的矩阵. 矩阵的每个元素的值是两个 $d$ 维的向量的内积, 所以计算出一个注意力头的注意力得分需要 $O(dt^2)$. 共 $lhb$ 次计算, 所以注意力得分的计算复杂度是 $O(lhbdt^2)$. 注意力加权和需要对每个 token 执行注意力得分的 softmax 运算, 然后加权平均, softmax 是 $O(t^2)$ 的, 加权平均是 $O(Dt^2)$ 的. 

在常规的推理中, 注意力模块的计算量是关于 $t$ 平方增长的. 

我们希望将 decode 阶段, 每次推理的注意力模块复杂度降低到关于 $t$ 线性增长而不是平方增长.

## 被浪费的计算

发现前 $t - 1$ 个 token 是本来就存在的, 它们之间的注意力得分已经计算过了, 互相对各自的加权和的贡献也计算过了, 所以可以 cache 下来, 避免重复计算.

需要计算的是: 前 $t - 1$ 个 token 到第 $t$ 个 token 的贡献. 由于 decode 的 mask 机制, 所以第 $t$ 个 token 到前 $t - 1$ 个 token 的贡献都是 $0$.

假设原本要计算的计算量是 $t^2$ 级别的, 那么在上一次推理已经计算过的计算量就是 $(t - 1)^2$. 做差可以得到, 剩下的需要新计算的计算量是和 $t$ 线性相关的.

## 需要被缓存的量

对于每个注意力头, 思考需要保存什么中间变量. 可以避免重复计算.

仍然需要明确: 注意力模块需要的就是获取 $t$ 个输入 token 的 $t$ 个线性组合. 而我们只需要保证输出正确.

发现前 $t - 1$ 个加权和 (value) 在这一轮推理中不会改变. (mask 机制, 第 $t$ 个 token 不会对前面的 token 造成影响) 这部分的结果可以直接缓存下来输出出去.

考虑注意力分数的计算. 前面提到了我们只关心第 $t$ 个 token 的注意力分数, 所以需要用第 $t$ 个 token 在前面对 $t - 1$ 个 key 进行查询. 这部分需要知道前 $t - 1$ 个 key. 以及前 $t - 1$ 个 value, 用于计算它们的线性组合.

综上, 只需要保存前 $t - 1$ 个 key 和 value, 就可以把注意力模块复杂度降低到和 $t$ 线性相关, 也就是 $O(lhb(d + D)t)$.

这种策略又被称作 KV-cache. 是一种空间换时间的策略, 也遵循了 "没有免费午餐" 的原则.