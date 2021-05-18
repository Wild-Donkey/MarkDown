# 带修莫队

[莫队算法](https://www.luogu.com.cn/blog/Wild-Donkey/pian-fen-dai-shi-mu-dui)只能解决区间查询问题, 但是如果在查询过程中加上单点修改, 一般的莫队就不能做了, 因为这种问题不能简单地将询问离线. 为了能用莫队解决带修改的区间查询问题, 在之前两个维度 (区间左 / 右端点) 的基础上加一个时间维, 对所有询问和修改离线处理.

## 基本思想

每个修改打一个时间戳, 这样当前区间就有三个属性: 左端点, 右端点, 时间戳. 表示为 $(L, R, Ti)$

存储所有的修改, 每个修改也由三个属性组成: 修改位置, 修改前的值, 修改后的值. 表示为 $(Add, Ori, Val)$. 这里的修改记录 $Ori$ 就是为了撤销操作, 为了得到正确的 $Ori$, 在读入时对 $a$ 数组同步修改, 保证每个位置在第 $i$ 次修改前的状态就是经过前面 $i - 1$ 次修改的状态. 这就导致在读入完毕之后, $a$ 数组的状态是所有修改完成后的状态. 为了优化常数, 在排序的时候要从时间较晚的查询开始回答, 防止一开始就对 $Time$ 进行 $O(m)$ 次增量.

使用带修莫队的前提是可以从 $(L \pm 1, R, Ti)$ 或 $(L, R \pm 1, Ti)$ 或 $(L, R, Ti \pm 1)$ 在 $O(1)$ 的时间内增量到 $(L, R, Ti)$.

这样, 对询问的原数组分块, 对所有的询问, 以左端点所在块为第一关键字, 以右端点所在块为第二关键字, 时间为第三关键字.

## 例题: [数颜色](https://www.luogu.com.cn/problem/P1903)

一个序列, 每个点有颜色属性, 每次可以单点修改, 将选中点改成另一种颜色, 也可以区间查询不同的颜色的数目.

这是一个带修莫队的模板题, 但是由于颜色的值域很大, 总数却很有限, 所以对颜色进行离散化处理.

作为一个模板题, 算法之外需要处理的细节主要是离散化:

离散化的对象是颜色, 出现新颜色的位置不只是一开始的 $a$ 数组, 每次修改操作也有可能修改成一个新的颜色. 充分发挥离线的优势, 用数组 $b$ 作为调色板, 先将未经修改的 $a$ 数组复制进去, 并且把每次操作的目标颜色存在 $b$ 的后面. 这样, $b$ 就包含了数据中的所有颜色, 长度最多为 $n + m$. 对 $b$ 排序并且去重, 得到了每个正整数对原颜色的映射. 扫一遍 $a$ 数组和所有修改的 $Ori$, $Val$, 使用 `lower_bound()` 得到对应颜色离散化后的正整数.

核心代码:

```cpp
unsigned a[140005], b[280005], m, n, N, CntQ(0), Cnt[280005], C, D, t, Ans[140005], Tmp(0), Time(1), BlockLen, Num(0), List[280005];
char B;
struct Query {
  unsigned L, R, Ti, LBelongBlock, RBelongBlock, Rank;
  inline const char operator<(const Query &x) {
    return (this->LBelongBlock ^ x.LBelongBlock) ? (this->LBelongBlock < x.LBelongBlock) : ((this->RBelongBlock ^ x.RBelongBlock) ? (this->RBelongBlock < x.RBelongBlock) : x.Ti < this->Ti);
  }
}Q[140005];
struct Edit {
  unsigned Address, Value, Origin;
}E[140005];
int main() {
  N = n = RD(), m = RD(); // N 是调色板的大小, 之后会在 n 的基础上增加 
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  memcpy(b, a, (n + 1) * sizeof(unsigned)); // 这时的 a[] 还没有没修改 
  for (register unsigned i(1); i <= m; ++i) {
    scanf("\n"), B = getchar();
    if(B ^ 'Q') {
      E[++Time].Address = RD();
      b[++N] = E[Time].Value = RD();        // 将颜色填入调色板 
      E[Time].Origin = a[E[Time].Address];  // 记录修改前的颜色 
      a[E[Time].Address] = E[Time].Value;   // 在 a[] 上修改颜色 
    } else {
      Q[++CntQ].L = RD();
      Q[CntQ].R = RD();
      Q[CntQ].Rank = CntQ;
      Q[CntQ].Ti = Time;
    }
  }
  BlockLen = (pow((unsigned long long)n * n * Time / m, 1.0/3) * 3.125) + 1; // 最优块长 
//  printf("BlockLen %u\n", BlockLen); 
  sort(b + 1, b + N + 1);
  for (register unsigned i(1); i <= N; ++i) // 离散化的去重 
    if(b[i] ^ b[i - 1])
      List[++Num] = b[i];
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = lower_bound(List + 1, List + Num + 1, a[i]) - List;
  }
  for (register unsigned i(1); i <= Time; ++i) {
    E[i].Origin = lower_bound(List + 1, List + Num + 1, E[i].Origin) - List;
    E[i].Value = lower_bound(List + 1, List + Num + 1, E[i].Value) - List;
  }
  for (register unsigned i(1); i <= CntQ; ++i) {
    Q[i].LBelongBlock = (Q[i].L + BlockLen - 1) / BlockLen;
    Q[i].RBelongBlock = (Q[i].R + BlockLen - 1) / BlockLen;
  }
  sort(Q + 1, Q + CntQ + 1);
  Q[0].Ti = Time, Q[0].L = 1, Q[0].R = 1, Ans[0] = 1, Cnt[a[1]] = 1;
  for (register unsigned i(1); i <= CntQ; ++i) {
    while(Q[0].Ti < Q[i].Ti) {  // 时间流逝 
      if(E[++Q[0].Ti].Address <= Q[0].R && E[Q[0].Ti].Address >= Q[0].L) {
        Ans[0] -= !(--Cnt[a[E[Q[0].Ti].Address]]); // 最后一个颜色 a[E[Q[0].Ti].Address]
        a[E[Q[0].Ti].Address] = E[Q[0].Ti].Value;
        Ans[0] += !(Cnt[a[E[Q[0].Ti].Address]]++);// 首个颜色 a[E[Q[0].Ti].Address]
      } else {
        a[E[Q[0].Ti].Address] = E[Q[0].Ti].Value;
      }
    }
    while(Q[0].Ti > Q[i].Ti) {  // 时间倒流 
      if(E[Q[0].Ti].Address <= Q[0].R && E[Q[0].Ti].Address >= Q[0].L){
        Ans[0] -= !(--Cnt[a[E[Q[0].Ti].Address]]);
        a[E[Q[0].Ti].Address] = E[Q[0].Ti].Origin;
        Ans[0] += !(Cnt[a[E[Q[0].Ti].Address]]++);
      }
      else {
        a[E[Q[0].Ti].Address] = E[Q[0].Ti].Origin;
      }
      --(Q[0].Ti); 
    }
    while(Q[0].L > Q[i].L) Ans[0] += !(Cnt[a[--Q[0].L]]++); // 左端点左移
    while(Q[0].R < Q[i].R) Ans[0] += !(Cnt[a[++Q[0].R]]++); // 右端点右移
    while(Q[0].L < Q[i].L) Ans[0] -= !(--Cnt[a[Q[0].L++]]); // 左端点右移
    while(Q[0].R > Q[i].R) Ans[0] -= !(--Cnt[a[Q[0].R--]]); // 右端点左移
    Ans[Q[i].Rank] = Ans[0];  // 统计答案 
  }
  for (register unsigned i(1); i <= CntQ; ++i) {
    printf("%u\n", Ans[i]);
  }
  return Wild_Donkey;
}
```

## 复杂度证明

仍然假设块长, 对最优复杂度进行证明.

设左端点的块长为 $x$, 右端点块长为 $y$, 它们的块数分别是 $\frac nx$ 和 $\frac ny$, 时间的复杂度是 $O(m)$, 为了~~卡块长~~更加严谨, 我们用 $t$ 来代表时间.

左端点的块长作为第一关键字, 所以询问中左端点是波动着上升的, 所以单次询问增量复杂度是 $O(x)$, 对左端点总增量复杂度是 $O(mx)$

右端点是第二关键字, 波动上升 $\frac nx$ 轮. 每轮衔接处 (从 $n$ 增量到 $1$) 的复杂度是 $O(n)$, 其他情况复杂度 $O(y)$, 总复杂度是 $O(my + \frac {n^2}x)$

最后是时间, 因为在左右端点在同一个块中时, 时间从接近 $t$ 增量到接近 $1$, 每次左右端点的所在块变化又会使时间回到接近 $t$, 所以时间的总增量复杂度应该是 $\frac {n^2t}{xy}$.

综上, 带修莫队的复杂度应该是 $O(m(x + y) + \frac {n^2}x + \frac {n^2t}{xy}) = O(m(x + y) + \frac {n^2(t + y)}{xy})$

然后进行一系列的变形, 因为 $t = O(m)$, 所以 $y \neq O(t)$, 否则复杂度中的 $my$ 可以卡到 $O(m^2)$. 所以 $y$ 的复杂度一定小于 $O(t)$, 所以 $(t + y)$ 中的 $y$ 可以省略.

$$
m(x + y) + \frac {n^2(t + y)}{xy}\\
m(x + y) + \frac {n^2t}{xy}\\
$$

使用均值不等式

$$
m(x + y) + \frac {n^2t}{xy} \geq 2\sqrt { \frac {n^2tm(x + y)}{xy}}\\
= 2n \sqrt{\frac{tm(x + y)}{xy}}\\
\geq 2n \sqrt{\frac{2tm\sqrt{xy}}{xy}}\\
= 2n \sqrt{\frac{2tm}{\sqrt{xy}}}
$$

当 $x = y$, $m(x + y) = \frac {n^2t}{xy}$ 取等, 所以将 $y$ 替换为 $x$

$$
2n \sqrt{\frac{2tm}{\sqrt{xy}}} = 2n \sqrt{\frac{2tm}{x}}
$$

所以原条件变成 $2mx = \frac {n^2t}{x^2}$

$$
2mx^3 = n^2t\\
x^3 = \frac{n^2t}{2m}\\
x = \sqrt [3]{\frac{n^2t}{2m}}\\
$$

所以最优块长是 $\sqrt [3]{\frac{n^2t}{2m}}$, 带回:

$$
2n \sqrt{\frac{2tm}{\sqrt{xy}}}\\
= 2n \sqrt{\frac{2tm}{x}}\\
= \frac{2n\sqrt{2tm}}{\sqrt [6]{\frac{n^2t}{2m}}}\\
= \frac{2n\sqrt{2tm}\sqrt [6]{2m}}{\sqrt [6]{n^2t}}\\
= 2\sqrt{2}\sqrt [6]{2}n^{\frac 23}m^{\frac 23}t^{\frac 13}\\
= O(n^{\frac 23}m^{\frac 23}t^{\frac 13})
$$

当 $n$, $m$ 同阶时, 复杂度为 $O(n^{\frac 43}t^{\frac 13})$

但是在实际测试中, 使用这种计算方式的块长会导致程序运行时间从 $x = \sqrt [3]{n^2}$ 的 `3.61s` 变成了 `6.61s`, 反向优化成功.

分析原因发现每次对于时间的增量常数远大于对于端点的增量, 所以对式子进行常数上的修正, 得到 $x = 2\sqrt [3]{\frac{n^2t}{m}}$ 的 `2.24s`. 但是当块长继续增大, 来到了 $x = 3\sqrt [3]{\frac{n^2t}{m}}$ 的 `1.96s`.

但是我貌似把操作数 $m$ 当成了询问数 $CntQ$, 但是 $m = t + CntQ$.

接下来是统计数据:

| 块长                                | 时间 (s) |
| ----------------------------------- | -------- |
| $\sqrt [3]{n^2}$                    | 3.61     |
| $\sqrt [3]{\frac{n^2t}{2m}}$        | 6.61     |
| $1.5\sqrt [3]{\frac{n^2t}{m}}$      | 2.88     |
| $2\sqrt [3]{\frac{n^2t}{m}}$        | 2.24     |
| $3\sqrt [3]{\frac{n^2t}{m}}$        | 1.96     |
| $3.125\sqrt [3]{\frac{n^2t}{m}}$    | 1.95     |
| $3.25\sqrt [3]{\frac{n^2t}{m}}$     | 1.96     |
| $3.5\sqrt [3]{\frac{n^2t}{m}}$      | 1.98     |
| $4\sqrt [3]{\frac{n^2t}{m}}$        | 2.03     |
| $2\sqrt [3]{\frac{n^2t}{CntQ}}$     | 2.07     |
| $2.5\sqrt [3]{\frac{n^2t}{CntQ}}$   | 1.98     |
| $2.625\sqrt [3]{\frac{n^2t}{CntQ}}$ | 1.99     |
| $2.75\sqrt [3]{\frac{n^2t}{C ntQ}}$ | 2.00     |
| $3.125\sqrt [3]{\frac{n^2t}{CntQ}}$ | 2.06     |

一不小心进了最优解第一页, 但是不知道为什么, 我的程序只得了第二快莫队. 我看了看[最快的莫队](https://www.luogu.com.cn/record/42652473), 它的块长是固定的 `2610`. 我尝试使用它的固定块长, 结果被卡到了 `3.27s`. 我觉得是它的常数优, 但是很遗憾, 这个程序在使用我的最优块长后也只跑了 `2.75s`.

所以对于现在的评测机状态, 我就是最快的莫队 (当然有人用 CDQ 分治跑进 `1s`).