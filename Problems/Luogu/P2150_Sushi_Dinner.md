# NOI2015 寿司晚宴

为什么没有人用容斥呢? 本做法复杂度 $O(3^8n)$。

## 题意

[Link](https://www.luogu.com.cn/problem/P2150)

给正整数 $[2, n]$，选两个不交子集，使得两个子集中任意两个数互质。求方案数。

## 题目转化

分析性质，发现对于每个质数 $p$，两个数集中只有一个数集存在整除 $p$ 的元素。所以状态就是两个集合分别包含的质因数集合即可，必须要求两个集合 $\And$ 后是 $0$。

设 $n$ 以内有 $m$ 个质数，则复杂度是 $O(2^{2m}n)$。

## 根号分治

发现 $500$ 以内的数，大于 $19$ 的质因数最多有一个。

小于等于 $19$ 的质数只有 $2, 3, 5, 7, 11, 13, 17, 19$，共 $8$ 个。如果我们把包含大于 $19$ 质因数的数字先剔除不计，仅分配剩下这些质因数，那么每个人的集合有 $2^8$ 种情况，两个人的状态数是 $4^8$ 种，因为两个人的集合不交，每个元素的状态只有三种，在第一个集合中，在第二个集合中，不存在，所以一共是 $3^8$ 种有效状态。

假设我们现在确定了决策完未剔除的数字后，两个人的质因数集合。那么对于剔除的数字，我们可以枚举 $19$ 后面的质数，将所有以这个质数为最大质因数的数同时考虑，枚举三种情况，分别是把这些数按 $19$ 以内的质因数约束分配到第一个人的集合里，分配到第二个人的集合里，不分配。因为是按照确定的集合分配的，所以 $19$ 以内质因数是确定的，$19$ 以后的质因数也不会在待处理的数中出现，所以是正确的。

### 枚举 $S$ 直接求 $f_S$

我们把状态压成三进制，称为集合 $S$。每个 $S$ 唯一对应一个有序二进制集合二元组 $(A, B)$。其中 $A \And B = 0$ 表示两个人 $19$ 以内的因数情况。$S$ 的第 $i$ 位是 $0$，则 $A$，$B$ 的第 $i$ 位都为 $0$，如果 $S$ 的第 $i$ 位是 $1$ 或 $2$，则分别对应 $A$ 的第 $i$ 位为 $1$ 和 $B$ 的第 $i$ 位为 $1$。

对于每个 $S$，我们把 $[2, n]$ 每个数按照除以 $19$ 以内所有质因数的结果分类，可以算出 $f_S$ 表示选出的两个不交子集各自的质因数，分别是由 $S$ 确定的 $A$，$B$ 的子集的方案数。

定义三进制集合的 PopCnt 为这个集合不为 $0$ 的元素个数。我们发现对于一个方案 $x$，这个方案两个人的 $19$ 以内的质因数集合分别是 $A_x$ 和 $B_x$，这两个集合可以表示为三进制集合 $S_x$。那么它不仅会被 $f_{S_x}$ 统计，还会被 $S_x$ 的真超集的 $f$ 值所统计。

那么对于一个满足自己对应的 $S_x$ 的 PopCnt 为 $i$ 的方案，被 PopCnt 为 $j$ 的 $S$ ($j \geq i$) 所统计的次数，也就是 $S_x$ 的 PopCnt 为 $j$ 超集数量，即为:

$$
g_{j, i} = \binom{8 - i}{8 - j} * 2^{j - i}
$$

式子很容易理解，组合数就是枚举哪些在 $S_x$ 中为 $0$ 的位置在 $S$ 中也为 $0$，后面的 $2^{j - i}$ 则是讨论在 $S_x$ 中为 $0$ 但是在 $S$ 中不为 $0$ 的位置，到底取 $1$ 还是取 $2$，互相独立，满足乘法原理条件。

## 容斥

由上面的式子我们发现如果简单给 $f_S$ 求和，一个方案会被统计多次。所以考虑用容斥把答案凑出来。

因为方案 $x$ 的统计次数只和 $S_x$ 的 PopCnt 有关，所以 PopCnt 相同的 $S$ 的 $f_i$ 应当是同时考虑的，所以我们定义

$$
Sum_i = \sum_{PopCnt(S) = i} f_S
$$

也就是说我们希望能有一个数列 $a$，使得

$$
Ans = \sum_{i = 0}^8 a_iSum_i
$$

结合前面 $g$ 的表达式，那么对 $a$ 的要求就是: 可以使得对于所有 $i$，有

$$
\sum_{j = i}^8 a_ig_{j, i} = 1
$$

$g$ 的形式一眼会让人联想到二项式反演，但是在无聊的合格考过程中，我惊奇地发现:

$$
\sum_{j = i}^n \binom{n - i}{n - j} * 2^{j - i} * (-1)^{n - j} = 1
$$

也就是说

$$
\sum_{j = i}^8 (-1)^{j}g_{j, i} = 1\\
a_i = (-1)^i
$$

至于原因，我百思不得其解，但是只需要对每个 $S$ 求方案数，然后根据 $S$ 的元素数乘上相应的 $a$ 对答案进行统计即可。

## 代码实现

```cpp
const unsigned M(6561);
const unsigned Tri[10] = { 1,3,9,27,81,243,729,2187,6561 };
const unsigned Prime[10] = { 2,3,5,7,11,13,17,19 };
vector <unsigned> Bel[505];
unsigned long long Tmp(0), Mod(998244353), Ans(0);
unsigned PopCnt[7005], Need[7005][2];
unsigned Stack[505], STop(0), Have[505];
unsigned m, n;
unsigned A, B, D, t;
unsigned Cnt(0);
signed main() {
  n = RD(), Mod = RD();
  for (unsigned i(2); i <= n; ++i) {
    unsigned Ti(i);
    for (unsigned j(0); j < 8; ++j) {
      if (!(Ti % Prime[j])) Have[i] |= (1 << j);
      while (!(Ti % Prime[j])) Ti /= Prime[j];
    }
    if (Ti > 1) Stack[++STop] = Ti;
    Bel[Ti].push_back(i);
  }
  for (unsigned i(0); i < M; ++i) {
    for (unsigned j(0); j < 8; ++j) {
      unsigned Jth((i / Tri[j]) % 3);
      if (Jth) Need[i][(Jth & 1) ? 0 : 1] |= (1 << j);
    }
  }
  sort(Stack + 1, Stack + STop + 1);
  STop = unique(Stack + 1, Stack + STop + 1) - Stack - 1;
  for (unsigned i(0); i < M; ++i) PopCnt[i] = PopCnt[i / 3] + (bool)(i % 3);
  for (unsigned i(0); i < M; ++i) {
    Tmp = 1;
    for (auto j : Bel[1]) {
      if ((Have[j] & Need[i][0]) == Have[j]) { Tmp <<= 1; if (Tmp >= Mod) Tmp -= Mod; }
      if ((Have[j] & Need[i][1]) == Have[j]) { Tmp <<= 1; if (Tmp >= Mod) Tmp -= Mod; }
    }
    for (unsigned j(1); j <= STop; ++j) {
      A = 1, B = 1;
      for (auto k : Bel[Stack[j]]) {
        if ((Have[k] & Need[i][0]) == Have[k]) { A <<= 1; if (A >= Mod) A -= Mod; }
        if ((Have[k] & Need[i][1]) == Have[k]) { B <<= 1; if (B >= Mod) B -= Mod; }
      }
      Tmp = Tmp * (A + B - 1) % Mod;
    }
    Ans += (PopCnt[i] & 1) ? (Mod - Tmp) : Tmp;
    if (Ans >= Mod) Ans -= Mod;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```