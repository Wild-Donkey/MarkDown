# 莫队算法入门

离线算法, 解决多次区间询问问题. 算法的条件是一个问题区间 $[L, R]$ 询问的答案可以由 $[L - 1, R]$, $[L, R - 1]$, $[L + 1, R]$, $[L, R + 1]$ 中的任意某个区间的答案以 $O(1)$ 的复杂度求出. 通过将区间排序, 然后暴力地用上一个答案求下一个答案. 复杂度为 $O(n\sqrt n)$.

结合莫队的经典模板题[小Z的袜子](https://www.luogu.com.cn/problem/P1494)来讲解.

## 题面简述

一行 $n$ 只袜子, 求区间 $[L, R]$ 中随机挑出两只后, 这两只袜子颜色相同的几率, $m$ 次询问.

$n, m \leq 50000$

## 算法框架

开一个数组 $Cnt$ 存储当前区间每种袜子数量, $Cnt_i$ 表示当前区间第 $i$ 个颜色的袜子个数.

开一个数组 $Ans$ 存每个询问的答案, 用于按询问的输入顺序输出答案. 由于要输出最简分数, 所以每个答案是两个整数, 分别代表分子和分母.

分块, 以 $L$ 的块数为第一关键字, $R$ 为第二关键字排序. 依次枚举所有的询问, 暴力地从上一个答案推得本次答案.

## 增量

增量就是用相邻区间 (即只有一个端点相差为 $1$, 另一个端点相同的两个区间) 的答案求目标区间答案的操作. 莫队算法复杂度的正确性要求增量操作复杂度为 $O(1)$.

设第 $i$ 只袜子颜色为 $a_i$, 区间长度为 $Len$.

暴力维护 $Cnt$ 数组, 用 $[L - 1, R]$ 的 $Cnt$ 求 $[L, R]$ 的 $Cnt$ 时, 需要将 $Cnt_{a_i}$ 减少 $1$. 复杂度 $O(1)$. 已知 $[L \pm 1, R]$ 或 $[L, R \pm 1]$ 求 $[L, R]$ 的情况同理.

保证了 $Cnt$ 数组的 up to date, 接下来求概率. 考虑某种颜色的袜子被选中一双的概率. 第一只被选中的袜子颜色为 $Col$ 的几率为 $\frac{Cnt_{Col}}{Len}$, 第二只仍为 $Col$ 的几率为 

$$
\frac{Cnt_{Col}(Cnt_{Col} - 1)}{Len(Len - 1)} = \frac{{Cnt_{Col}}^2 - Cnt_{Col}}{{Len}^2 - Len}
$$

但是如果每个颜色单独算, 单次查询时间复杂度 $O(n)$, 一定会超时. 所以考虑一起计算. 如果一次增量中, 区间长度从 $Len'$ 变成了 $Len$ (当然, $Len' = Len \pm 1$). $Cnt$ 没有变化的某种颜色 $Col$ 的袜子被选中一双的概率从 $\frac{{Cnt_{Col}}^2 - Cnt_{Col}}{{Len'}^2 - Len'}$ 变成 $\frac{{Cnt_{Col}}^2 - Cnt_{Col}}{{Len}^2 - Len}$.

所以对于每个 $Cnt$ 没有变化的颜色, 被选中一双的概率都会变成原来的 $\frac{{Len'}^2 - Len'}{{Len}^2 - Len}$.

那么对于被加入或删除了一个袜子的颜色 $Col$, 选中一双颜色为 $Col$ 的袜子的概率从原来的 $\frac{{{Cnt_{Col}}'}^2 - {Cnt_{Col}}'}{{Len'}^2 - Len'}$ 变成 $\frac{{Cnt_{Col}}^2 - Cnt_{Col}}{{Len}^2 - Len}$.

因此, 设原答案为 $\frac{Ans0'}{Ans1'}$ 新的答案 $\frac{Ans0}{Ans1}$ 就是:

$$
(\frac{Ans0'}{Ans1'} - \frac{{{Cnt_{Col}}'}^2 - {Cnt_{Col}}'}{{Len'}^2 - Len'})\frac{{Len'}^2 - Len'}{{Len}^2 - Len} + \frac{{Cnt_{Col}}^2 - Cnt_{Col}}{{Len}^2 - Len}\\
= \frac{Ans0'({Len'}^2 - Len')}{Ans1'({Len}^2 - Len)} - \frac{{{Cnt_{Col}}'}^2 - {Cnt_{Col}}' - {Cnt_{Col}}^2 + Cnt_{Col}}{{Len}^2 - Len}\\
= \frac{Ans0'({Len'}^2 - Len') - Ans1'({{Cnt_{Col}}'}^2 - {Cnt_{Col}}' - {Cnt_{Col}}^2 + Cnt_{Col})}{Ans1'({Len}^2 - Len)}
$$

分类讨论, 推式子

* 当区间增长了 $1$, 即 $Len = Len' + 1$

$$
\frac{Ans0}{Ans1} = \frac{Ans0'((Len - 1)^2 - Len + 1) - Ans1'((Cnt_{Col} + 1)^2 - Cnt_{Col} - 1 - {Cnt_{Col}}^2 + Cnt_{Col})}{Ans1'({Len}^2 - Len)}\\
= \frac{Ans0'(Len^2 - 3Len + 2) - 2Ans1'Cnt_{Col}}{Ans1'({Len}^2 - Len)}\\
$$

* 当区间缩短了 $1$, 即 $Len = Len' - 1$

$$
\frac{Ans0}{Ans1} = \frac{Ans0'((Len + 1)^2 - Len - 1) - Ans1'(({Cnt_{Col}} - 1)^2 - {Cnt_{Col}} + 1 - {Cnt_{Col}}^2 + Cnt_{Col})}{Ans1'({Len}^2 - Len)}\\
= \frac{Ans0'(Len^2 + Len) + 2Ans1'({Cnt_{Col}} - 1)}{Ans1'({Len}^2 - Len)}
$$

考虑约分的操作. 因为分数的计算需要大量的乘积, 所以需要随时约分. 答案都是真分数, 分母最多是 $Len^2 - Len$, 分子不大于分母, 所以答案的分子分母不超过 $2.5*10^{9}$, 不超过 `unsigned` 的范围.

使用 `unsigned long long` 进行中间计算, 在每次计算后约分. 使用欧几里得算法求分子分母的 gcd, 然后分子分母一起除以这个 gcd.

特别地, 在 $Len = 1$ 的情况下, $Len^2 - Len = 0$, 分母为零无意义, 也存在概率为零的情况, 样例表明, 概率为 $0$ 时, 输出 $0/1$.

当概率为 $1$ 时, 答案为整数, 同样有样例表明, 这时输出 $1/1$.

但是这样的复杂度外面就会乘上一个 $O(log(n^2))$, 变成 $O(n\sqrt n log(n^2))$, 因为每次增量要求 GCD. 所以考虑更优的解法. 考虑从一开始单个颜色袜子选中一双的概率入手, 推得一个式子, 整理.

$$
\frac{Ans0}{Ans1} = \frac{\displaystyle{\sum_{i = L}^{R}{Cnt_{a_i}}^2 − Cnt_{a_i}}}{Len^2 - Len}\\
= \frac{\displaystyle{\sum_{i = L}^{R}{Cnt_{a_i}}^2} - \displaystyle{\sum_{i = L}^{R}Cnt_{a_i}}}{Len^2 - Len}\\
= \frac{(\displaystyle{\sum_{i = L}^{R}{Cnt_{a_i}}^2}) - Len}{Len^2 - Len}\\
$$

这样, 只要维护区间袜子数量平方和即可 $O(1)$ 求答案. 由于平方和, 区间长度的平方不大于 $2.5 * 10^9$, 所以无需每次增量约分, 只要约分 $O(m)$ 次即可.

维护平方和, 对于某个 $Cnt$ 的变化对平方和的影响, 如果 $Cnt$ 在原来的基础上增加了 $1$, 即 $Cnt = Cnt' + 1$, 则

$$
Cnt^2 = (Cnt' + 1)^2 = Cnt'^2 + 2Cnt' + 1 = Cnt'^2 + 2Cnt - 1
$$

对于 $Cnt = Cnt' - 1$ 的情况, 有

$$
Cnt^2 = (Cnt' - 1)^2 = Cnt'^2 - 2Cnt' + 1 = Cnt'^2 - 2Cnt - 1
$$

## 复杂度证明

因为莫队的前提是一次增量时间复杂度 O(1), 所以只要证明莫队对长度为 $n$ 的序列的 $m$ 次区间查询的复杂度是 $O(n \sqrt m)$.

在分块的块长选择 $\frac{n}{\sqrt m}$ 的前提下, 块数就是 $\sqrt{m}$. 使用 `algorithm` 中自带的排序, 复杂度是 $O(logm)$.

接下来对当前答案进行增量, 对于左端点和上一个询问同块的情况, 左端点最多增量 $\frac{n}{\sqrt m}$ 次. 对于左端点在新的块的询问, 最多增量 $\frac{2n}{\sqrt m}$ 次, 也是 $O(\frac{n}{\sqrt m})$. 所有左端点增量次数复杂度为 $O(\frac{nm}{\sqrt m}) = O(n \sqrt m)$. 左端点这个块内的所有询问, 右端点递增, 所以这些询问右端点总共增量最多 $n$ 次. 所以右端点总共的增量数应该是 $O(n \sqrt m)$. 综上, 左右端点增量数复杂度为 $O(n \sqrt m)$

分析更一般的情况, 如果块长选 $x$, 块数就是 $\frac {n}{x}$. 用上面的方式分析, 左端点的增量数复杂度是 $O(xm)$, 右端点的增量数复杂度是 $O(\frac{n^2}{x})$, 总复杂度为 $O(xm + \frac{n^2}{x})$. 使用均值不等式, 最优复杂度为 $xm + \frac{n^2}{x} \geq 2\sqrt{mn^2} = 2n\sqrt m = O(n\sqrt{m})$, 当 $xm = \frac{n^2}{x}$ 时取到等号. 整理求块长:

$$
xm = \frac{n^2}{x}\\
x^2m = n^2\\
x^2 = \frac{n^2}{m}\\
x = \frac{n}{\sqrt m}
$$

所以, 一般莫队的最优块长是 $n\sqrt m$

## 代码实现

细节不多, 码量短小, 把推的式子写成代码就好了, 是骗分的好工具.

```cpp
unsigned m, n, Cnt[50005], BlockLen, BlockCnt;
long long a[50005], Ans[50005][2], Tmp0(0), Tmp1(1), TmpG, TmpSquare(1);
struct Query{
  unsigned L, R, Num, BelongToBlocks;
  inline const char operator <(const Query &x) {  // 按左端点所在块排序 
    return (this->BelongToBlocks ^ x.BelongToBlocks) ? this->BelongToBlocks < x.BelongToBlocks : this->R < x.R;
  }
}Q[50005];
inline unsigned GCD(register unsigned x, register unsigned y) {
  register unsigned tmp;
  while(y) tmp = x, x = y, y = tmp % y;
  return x;
}
int main() {
  n = RD(), m = RD();
  BlockLen = (m ^ 0) ? (n / sqrt(m)) + 1 : sqrt(n) + 1;
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD();
  }
  for (register unsigned i(1); i <= m; ++i) {
    Q[i].L = RD(), Q[i].R = RD(), Q[i].Num = i, Q[i].BelongToBlocks = (Q[i].L + BlockLen - 1) / BlockLen;
  }
  sort(Q + 1, Q + m + 1);
  Tmp0 = 0, Tmp1 = 1, Q[0].L = 1, Q[0].R = 1, Cnt[a[1]] = 1; // 初始化当前区间为 [1, 1] 
  for (register unsigned i(1); i <= m; ++i) {
    if(Q[i].L == Q[i].R) {      // 特判, 单点查询 
      Ans[Q[i].Num][0] = 0, Ans[Q[i].Num][1] = 1;
      continue;
    }
    register unsigned Col, Len(Q[i].R - Q[i].L + 1);
    while (Q[0].L > Q[i].L) {   // 左端点左移 
      ++Cnt[Col = a[--Q[0].L]];
      TmpSquare += (Cnt[Col] << 1) - 1; // Cnt[Col] 增加, 维护方差, 下同 
    }
    while (Q[0].R < Q[i].R) {   // 右端点右移 
      ++Cnt[Col = a[++Q[0].R]];
      TmpSquare += (Cnt[Col] << 1) - 1;
    }
    while (Q[0].L < Q[i].L) {   // 左端点右移
      --Cnt[Col = a[Q[0].L++]];
      TmpSquare -= (Cnt[Col] << 1) + 1;
    }
    while (Q[0].R > Q[i].R) {   // 右端点左移
      --Cnt[Col = a[Q[0].R--]];
      TmpSquare -= (Cnt[Col] << 1) + 1;
    }
    Ans[Q[i].Num][0] = TmpSquare - Len;
    Ans[Q[i].Num][1] = Len * Len - Len;
    TmpG = GCD(Ans[Q[i].Num][0], Ans[Q[i].Num][1]);
    Ans[Q[i].Num][0] /= TmpG;
    Ans[Q[i].Num][1] /= TmpG;
  }
  for (register unsigned i(1); i <= m; ++i) {
    printf("%u/%u\n", Ans[i][0], Ans[i][1]);
  }
  return Wild_Donkey;
}
```