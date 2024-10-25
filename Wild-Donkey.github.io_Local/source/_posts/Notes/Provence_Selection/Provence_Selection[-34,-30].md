---
title: 省选日记 Day-34~-30
date: 2022-03-07 16:54
categories: Notes
tags:
  - State_Compression
  - Dynamic_Programming
  - Expected_Value_and_Probability
  - Inclusion_Exclusion_Principle
  - Divide_and_Conquer
  - Kruskal
  - Decomposition_Techniques
  - Game_Theory
  - Dynamic_Programming_on_Tree
  - Cactus_Graph
  - Heavy_Light_Decomposition
  - Tarjan_Algorithm
  - Round_Square_Tree
thumbnail: /images/Photo3.JPG
---

# 省选日记 Day $-34$ - Day $-30$

## Day $-34$ Feb 28, 2022, Monday

今天是 USACO 金组的结算日.

### T1 Redistributing Gifts

这题的规则和背景均基于银组 T1, 仍然是像银组 T1 一样建一个有向图. 每次交换相当于沿着简单环交换, 因为每一个方案都需要让每一头牛更加满意, 所以我们可以认为任何最终状态都可以通过每头牛直接得到自己最后的礼物来得到, 不需要经过中间过程.

所以不考虑点集限制, 一个输入的最终状态数量等价于我们选择若干边把整个图划分成不同的环的方案数, 两个方案不同当且仅当一个方案中存在选择了的边在另一个方案中没有被选择. 最终答案即为对于两个点集求这个方案数然后相乘.

状压 DP, 提前写的时候只处理了一个点集是否可以成环, 没有考虑这个点集有多少成环方式, 所以交上就 WA 了.

记录 $Ed_{i, j}$ 表示 $i$ 到 $j$ 是否有边. 设 $F(S)$ 为集合 $S$ 的编号最大的元素, 用 $h_{S, i}$ 表示以 $F(S)$ 为起点, 以 $i$ 为终点, $S$ 点集成一条链的方案数.

$$
h_{S, i} = \sum_{j \in (S - i), j < F(S)} h_{S - i, j}Ed_{j, i}
$$

设 $g_S$ 表示 $S$ 点集连成一条环的方案数.

$$
g_S = \sum_{j \in S, j < F(S)} h_{S, j}Ed_{j, F(S)}
$$

设 $f_S$ 表示把 $S$ 连成若干环的方案数. 枚举子集 $S'$ 作为一个环, 其余部分连成若干环. 为了防止重复, 我们使得每种组合方案都有 $F(S) \in S'$.

$$
f_S = \sum_{S' \subseteq S, F(S) \in S'} g_Sf_{S - S'}
$$

最后直接询问两个点集 $A$, $B$ 的 $f_Af_B$ 即可.

```cpp
unsigned long long h[263005][18], g[263005], f[263005];
unsigned Ed[18], m, n, N;
char IO[20];
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  N = (1 << (n = RD()));
  for (unsigned i(0); i < n; ++i) {
    char Flg(1);
    for (unsigned j(0); j < n; ++j) {
      Tmp = RD() - 1;
      if (Flg) Ed[i] |= (1 << Tmp);
      if (Tmp == i) Flg = 0;
    }
  }
  for (unsigned i(0); i < n; ++i) h[1 << i][i] = 1; h[0][0] = 1;
  for (unsigned i(1); i < N; ++i) {
    unsigned Low(0);
    while ((1 << Low) <= (i >> 1)) ++Low;
    for (unsigned End(0); End <= Low; ++End) if (((i >> End) & 1)) {
      if ((Ed[End] >> Low) & 1) g[i] += h[i][End];
      for (unsigned To(0); To < Low; ++To) if ((!((i >> To) & 1)) && ((Ed[End] >> To) & 1)) {
        h[i | (1 << To)][To] += h[i][End];
      }
    }
  }
  f[0] = g[0] = 1;
  for (unsigned i(0); i < N; ++i) {
    unsigned Low(0);
    while ((1 << Low) <= (i >> 1)) ++Low;
    for (unsigned j(i); j >> Low; j = (j - 1) & i) {
      f[i] += f[i ^ j] * g[j];
    }
  }
  m = RD(), --N;
  for (unsigned i(1); i <= m; ++i) {
    scanf("%s", IO), Cnt = 0;
    for (unsigned j(0); j < n; ++j) if (IO[j] == 'G') Cnt |= (1 << j);
    printf("%llu\n", f[Cnt] * f[N ^ Cnt]);
  }
  return Wild_Donkey;
}
```

### T2 Cow Camp

这是一道期望 DP, 设交 $i$ 次期望得分为 $f_i$, 显然还剩 $i$ 次机会时的策略应该是: 如果倒数第 $i$ 次得到了比 $f_i$ 大的结果, 那么就见好就收, 停止提交, 如果没有达到 $f_i$, 则继续交会期望得到更多的分. 因为除样例外所有测试点的结果相互独立, 成二项分布, 则有方程:

$$
f_i = \frac {\displaystyle{\sum_{j = 1}^{\lceil f_{i - 1} \rceil - 1} \binom {T - 1}{j - 1}}}{2^{T - 1}}f_{i - 1} + \frac{\displaystyle{\sum_{j = \lceil f_{i - 1} \rceil}^T j\binom {T - 1}{j - 1}}}{2^{T - 1}}
$$

这样我们得到了 $O(K)$ 的算法, 但是这样显然过不了, 所以继续优化.

> 哪里有取整, 哪里就有整数分块(bushi) ----Wild_Donkey

我们发现 $\lceil f_i \rceil$ 的取值是 $O(T)$ 的, 而且当 $\lceil f_i \rceil$ 相同时, 转移是十分有趣的. 假设对于 $j \in [i, i + x)$ 的所有 $\lceil f_{j - 1} \rceil$ 都是 $Trs$, 设 $Pre_j = \dfrac {\displaystyle{\sum_{i = 1}^{j} \binom {T - 1}{i - 1}}}{2^{T - 1}}$, $Suf_j = \dfrac {\displaystyle{\sum_{i = j}^T j\binom {T - 1}{i - 1}}}{2^{T - 1}}$, 那么就有方程:

$$
\begin{aligned}
f_{i + x} &= (...(f_iPre_{Trs - 1} + Suf_{Trs})Pre_{Trs - 1} + Suf_{Trs})...)\\
f_{i + x} &= f_i{Pre_{Trs - 1}}^x + Suf_{Trs}\sum_{i = 0}^{x - 1} {Pre_{Trs - 1}}^i 
\end{aligned}
$$

可以用等比数列求和公式 $Sum_n = a_1 \dfrac{1 - q^n}{1 - q}$, 在 $O(\log x)$ 的时间内完成 $x$ 次相同 $\lceil f_i \rceil$ 的转移.

我们每次确定一个 $\lceil f_i \rceil$, 二分查找下一个 $\lceil f_i \rceil$ 值的位置. 这样既可 $O(T\log^2 K)$ 求出答案.

```cpp
double C[1005][1005], Pre[1005], P[1005], Cur;
unsigned m, n;
unsigned A, B, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline unsigned Ceil(double x) { return (unsigned)(x + 0.99999999); }
inline double Pow(double x, unsigned y, double z) { while (y) { if (y & 1) z *= x; x *= x, y >>= 1; }return z; }
inline double Calc(double x, unsigned y, double pre, double p) {
  double pp(pre / (1 - p));
  return pp - Pow(p, y, pp - x);
}
signed main() {
  n = RD(), m = RD();
  C[0][0] = 1;
  for (unsigned i(1); i < n; ++i) {
    C[i][i] = C[i][0] = C[i - 1][0] / 2;
    for (unsigned j(1); j < i; ++j) {
      C[i][j] = (C[i - 1][j] + C[i - 1][j - 1]) / 2;
    }
  }
  for (unsigned i(n); i; --i) Pre[i] = Pre[i + 1] + C[n - 1][i - 1] * i;
  for (unsigned i(1); i <= n; ++i) P[i] = P[i - 1] + C[n - 1][i - 1];
  Cur = Pre[1];
  for (unsigned i(Ceil(Cur)), j(1); j <= m; ) {
    unsigned L(1), R(m - j + 1), Mid;
    while (L ^ R) {
      Mid = ((L + R) >> 1);
      if (Calc(Cur, Mid, Pre[i], P[i - 1]) > i) R = Mid;
      else L = Mid + 1;
    }
    if (L == m - j + 1) { printf("%.10lf\n", Calc(Cur, L - 1, Pre[i], P[i - 1])); return 0; }
    Cur = Calc(Cur, L, Pre[i], P[i - 1]), i = Ceil(Cur), j += L;
  }
  return Wild_Donkey;
}
```

### T3 Moo Network

把平面上两个点的距离的平方作为这两个点之间的边权, 给出一些点求最小生成树权值和. 

由于点数过多, 不能直接连 $O(n^2)$ 条边. 所以考虑优化, 尝试删边使得边数在可接受的范围内.

接下来引入一个最小生成树常用 Trick:

如果存在 $a, b, c$ 三个点, 边权满足 $ab < ac$, $bc < ac$. 当我们对这个图直接跑 Kruskal 算法时, 在考虑 $ac$ 边时, 一定已经考虑过 $ab$, $bc$ 两条边了, 考虑完 $ab$ 边之后, 无论是否加入, 一定有 $a, b$ 连通, 同理考虑完 $bc$ 边, 一定有 $b, c$ 连通. 所以在考虑 $ac$ 边之前已经有 $a, b, c$ 连通了, 因此 $ac$ 边无意义.

如果我们选一个点做根节点, 用 Dijkstra 最小化根节点到其它点路径上边权最大值, 并且在过程中记录松弛的边的边权和, 即可得到最小生成树. 人们一般把这个过程称为 Prim 算法. (不过这样做复杂度没有优化, 无法完成此题)

对于本题来说, 幸运的是: 点是整点, 且纵坐标只有 $[0, 10]$. 我们可以按行来考虑.

对于同一行内的点, 只有相邻的点之间的边有用, 这是显然的, 对于一行内从左到右排列的三个点 $a, b, c$, 一定有 $ab < ac$, $bc < ac$, 所以所有跨过节点的路径都没有意义.

对于不同行的点, 假设存在某个点 $a$, 另一行存在 $b, c$ 点, 且横坐标不在 $a$ 的异侧, 则 $a, b, c$ 可以围成一个钝角 (直角) 三角形. 不失一般性, 设 $ba < ca$, 则有 $b$ 作为钝角 (直角) 顶点, 也就是说 $bc < ac$. 这时 $ac$ 无意义. 因此对于 $a$ 所在行外的某一行, $a$ 只需要连接和它横坐标相同的点, 如果不存在这个点, 则连接左右最近的点. $a$ 到其余点的连边都无效.

为了防止重复连边, 我们枚举每个点, 然后只往左侧的和横坐标相同的点连边. 具体过程是先对每一行连接内部的边. 然后对于每一行, 枚举除它所在行以外的其它 $10$ 行, 使用双指针连接两行之间的边.

每个点会向左或竖直连出 $11$ 条边. 所以边数是 $1e7$ 级别的, 所以 $O(m \log m)$ 级别的 $4s$ 可以过.

```cpp
vector <pair<unsigned, unsigned> > a[11];
vector <pair<unsigned long long, pair<unsigned, unsigned> > > E;
unsigned Fa[1000005], Stack[1000005], STop(0), m, n;
unsigned long long Ans(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
unsigned long long Sq(unsigned x) { return (unsigned long long)x * x; }
unsigned Find(unsigned x) {
  while (x ^ Fa[x]) Stack[++STop] = x, x = Fa[x];
  while (STop) Fa[Stack[STop--]] = x;
  return x;
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) A = RD(), B = RD(), a[B].push_back({ A, ++Cnt });
  for (unsigned i(0); i <= 10; ++i) if (a[i].size()) {
    sort(a[i].begin(), a[i].end());
    for (unsigned j(a[i].size() - 1); j; --j)
      E.push_back({ Sq(a[i][j].first - a[i][j - 1].first) ,{a[i][j].second, a[i][j - 1].second} });
  }
  for (unsigned i(0); i < 10; ++i) if (a[i].size()) for (unsigned j(i + 1); j <= 10; ++j) if (a[j].size()) {
    unsigned Pls(Sq(j - i));
    for (unsigned fi(a[i].size() - 1), fj(a[j].size() - 1); (~fi) && (~fj); ) {
      if (a[i][fi].first >= a[j][fj].first)
        E.push_back({ Pls + Sq(a[i][fi].first - a[j][fj].first) ,{a[i][fi].second, a[j][fj].second} }), --fi;
      else
        E.push_back({ Pls + Sq(a[j][fj].first - a[i][fi].first) ,{a[j][fj].second, a[i][fi].second} }), --fj;
    }
  }
  sort(E.begin(), E.end()), Cnt = 0;
  for (unsigned i(1); i <= n; ++i) Fa[i] = i;
  for (auto i : E) {
    A = Find(i.second.first), B = Find(i.second.second);
    if (A ^ B) {
      Fa[A] = B;
      ++Cnt, Ans += i.first;
      if (Cnt == n - 1) break;
    }
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## Day $-33$ Mar 01, 2022, Tuesday

> 我好不容易 AK 一次, 你却让我输得, 这么彻底. ----Wild_Donkey

今天模拟赛特别简单, 但是有一个地方挂了 $10'$, 痛失 AK 机会.

读入字符串之前, 一定要特判它的长度是否是 $0$, 否则某些弱智快读收不到有意义的字符可能会一直等待读入字符而超时.

### [YNOI2019](https://www.luogu.com.cn/problem/P5048)

区间众数, 就是 [Day -35](/Notes/Provence_Selection/Provence_Selection%5B-38,-35%5D) 提到的空间 $O(n)$, 时间 $O(n \sqrt n)$ 的区间众数.

思考好久还是不会, 即使有唐爷爷的点拨也不会, 所以今天毅然看题解.

好了现在看完题解再次对自己的智商产生了怀疑. 首先离散化. 对每个权值 $i$ 建一个 `vector` $List_i$ 存储它每次出现的位置. 对于原序列, 我们记录每个元素 $a_i$ 在它所属 `vector` 中的下标 $Pos_i$. 这些我这些天都想到了, 但是查询的手段真是过于巧妙.

对于询问区间 $[L, R]$. 查询整块得到一个答案 $Ans$, 用 $B$ 表示块长. 我们知道散点最多使答案变成 $Ans + 2B$. 而众数只会出现在散点和整块众数这 $O(2B)$ 个值中, 而整块的众数不需要单独枚举. 以左边散点为例, 枚举每个散点 $a_i$, 如果它可以作为众数, 那么必须满足 $List_{a_i, Pos_i + Ans - 1} \leq R$. 我们从 $Pos_i + Ans - 1$, 开始往后遍历 $List_{a_i}$, 只要在 $[L, R]$, 就增加 $Ans$, 并且移动遍历 $List$ 所用的指针. 右侧的散点对称操作即可. 因为 $Ans$ 最多增加 $2B$, 其它的操作都是 $O(1)$, 因此一次查询是 $O(B)$ 的.

```cpp
vector<unsigned> List[500005];
unsigned a[500005], Pos[500005], Cond[1005000], m, n;
unsigned A, B, C, L, R, BL, BR;
unsigned Cnt(0), Ans(0);
inline unsigned* Pnt(unsigned x, unsigned y) { return Cond + x * (A + 1) + y; }
signed main() {
  n = RD(), m = RD(), B = max((n / 1000) + 1, (unsigned)(n / (sqrt(m) + 1)) + 1), A = n / B;
  for (unsigned i(1); i <= n; ++i) Pos[i] = a[i] = RD();
  sort(Pos + 1, Pos + n + 1), C = unique(Pos + 1, Pos + n + 1) - Pos - 1;
  for (unsigned i(1); i <= n; ++i) a[i] = lower_bound(Pos + 1, Pos + C + 1, a[i]) - Pos;
  for (unsigned i(0); i < A; ++i) {
    memset(Pos, 0, (C + 1) << 2);
    unsigned* To(Pnt(i, i)), * Cur(a + i * B + 1), Tmp(0);
    for (unsigned j(i); j < A; ++j, ++To) {
      for (unsigned k(1); k <= B; ++k, ++Cur) Tmp = max(++Pos[*Cur], Tmp);
      (*To) = Tmp;
    }
  }
  for (unsigned i(1); i <= n; ++i) List[a[i]].push_back(i), Pos[i] = List[a[i]].size() - 1;
  for (unsigned i(1); i <= m; ++i) {
    L = (RD() ^ Ans), R = (RD() ^ Ans);
    if (L > R) swap(L, R);
    if (R > n) return 0;
    BL = (L + B - 2) / B, BR = (R / B);
    if (BL >= BR) {
      Ans = 0;
      for (unsigned k(L); k <= R; ++k) {
        unsigned Cur(Pos[k] + Ans), Now(a[k]);
        while ((Cur < List[Now].size()) && (List[Now][Cur] <= R)) ++Cur, ++Ans;
      }
      printf("%u\n", Ans);
      continue;
    }
    Ans = *Pnt(BL, BR - 1), BL = (B - ((L - 1) % B)) % B, BR = R % B;
    for (unsigned j(0), k(L); j < BL; ++j, ++k) {
      unsigned Cur(Pos[k] + Ans), Now(a[k]);
      while ((Cur < List[Now].size()) && (List[Now][Cur] <= R)) ++Cur, ++Ans;
    }
    for (unsigned j(0), k(R); j < BR; ++j, --k) {
      unsigned Cur(Pos[k] - Ans), Now(a[k]);
      while ((Cur < 0x3f3f3f3f) && (List[Now][Cur] >= L)) --Cur, ++Ans;
    }
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

知道这个做法后我十分激动, 高速敲键盘, 半个小时就写完了. 但是一来忘记了强制在线要异或, 二来忘记了最靠右的整块编号可能算出负数, `unsigned` 炸成正无穷导致 RE.

## Day $-32$ Mar 02, 2022, Wednesday

今天巨难, 比 Ynoi 都难.

### T1 博弈论

这道题还是比较简单的.

先考虑只有 $1$ 的情况, 根据 Sg 函数的定义, 可以认为 $\{1,1,...,1\}$ 这种局面的 Sg 值是 $a_1 \And 1$.

如果只有 $2$, 那么它有两种操作, 我们可以选择取一个 $2$ 分裂成两个 $1$, 或者按规则删除对应数量的 $2$.

目标局面中可能既有 $1$ 也有 $2$, 每次可以选择对 $1$ 操作, 也可以选择对 $2$ 操作. 显然这是一个 Nim 的形式, 所以我们可以单独计算 $1$ 的 Sg 值和 $2$ 的 Sg 值, 异或起来就是当前局面的 Sg 值.

由于形如 $\{2,2,...,2\}$ 的局面一步只能生成 $2$ 个 $1$, 而 $\{1,1\}$ 的 Sg 值为 $0$, 所以这等价于直接将这个 $2$ 删除. 所以我们可执行的操作变成了删除 $1$ 个 $2$ 或删除 $2$ 个 $2$. 这样便可以得到仅包含 $2$ 的局面的 Sg 值, $a_2 \% 3$.

这里需要证明两个结论: 对于任何正整数 $x$, $Sg\{x\} = 1$; 对于任何奇数 $x$, $Sg\{x, x\} = 0$.

用归纳法, 假设对 $i < x$ 都满足上面的结论. 对于 $\{x\}$ 有两种操作, 一个是把它分成 $j + k$, 另一个是删除它自己.

对于第一个操作得到的局面 $\{j, k\}$. 如果 $j = k$, 则 $j$ 为奇数且 $j < x$, 根据假设 $Sg\{j, k\} = Sg\{j, j\} = 0$. 如果 $j \neq k$, 则 $j < x$, $k < x$, 有 $Sg\{j, k\} = Sg\{j\} \oplus Sg\{k\} = 1 \oplus 1 = 0$.

对于第二个操作得到的局面 $\varnothing$, 有 $Sg\varnothing = 0$.

因此 $Sg\{x\} = 1$.

如果 $x$ 是奇数, $\{x, x\}$ 可以变成 $\{x\}$ 或者是 $\{x, j, k\}$. 已经知道 $Sg\{x\} = 1$, 根据前面也知道 $Sg\{j, k\} = 0$, 因此 $Sg\{x, j, k\} = Sg\{x\} \oplus Sg\{j, k\} = 1 \oplus 0 = 1$, 所以 $Sg\{x, x\} = 0$.

边界条件为 $\{1\}$ 和 $\{1, 1\}$ 都满足这两个结论, 两个结论得证.

继续讨论更多的仅包含一个数字的局面 $\{x, x,...,x\}$, 发现如果选择一个 $x$, 将其分裂为 $j$, $k$. 当 $j = k$ 时, 必须有 $j$ 是奇数, 有 $Sg\{j, k\} = Sg\{j, j\} = 0$; 当 $j \neq k$ 时, 有 $Sg\{j, k\} = Sg\{j\} \oplus Sg\{k\} = 1 \oplus 1 = 0$. 因此对于任意 $x$, 分裂一个 $x$ 到达的局面的 Sg 值和删除一个 $x$ 到达的局面的 Sg 值是相等的. 规则可以改为每次选择数字 $x$, 可以选择删除 $x$ 个 $x$ 或 $1$ 个 $x$, 得到等价问题.

如果用 $f_{i, j}$ 表示由 $j$ 个 $i$ 组成的局面的 Sg 值, 那么有 $f_{i, j}$ 为最小的没有在 $f_{i, j - i} (j \geq i)$ 和 $f_{i, j - 1}$ 中出现的自然数. 边界条件为 $f_{i, 0} = 0, f_{i, 1} = 1$.

对于奇数 $i$, 有 $f_{i, j} = j \And 1$.

同样使用归纳法证明, 先考虑 $0 < j < i$ 的情况. 如果对于 $k < j$ 都有 $f_{i, k} = k \And 1$. 当 $j \And 1 = 0$ 时, 有 $(j - 1) \And 1 = 1$. 则 $f_{i, j} = 0$. 当 $j \And 1 = 1$ 时, 有 $(j - 1) \And 1 = 0$, 则 $f_{i, j} = 1$. 边界 $f_{i, 0} = 0$ 满足该结论, $0 < j < i$ 的情况得证.

对于 $j \geq i$ 的情况. 当 $j \And 1 = 0$ 时, 有 $(j - 1) \And 1 = (j - i) \And 1 = 1$. 则 $f_{i, j} = 0$. 当 $j \And 1 = 1$ 时, 有 $(j - 1) \And 1 = (j - i) \And 1 = 0$, 则 $f_{i, j} = 1$. 已证明 $0 \leq j < i$ 时结论成立, 因此结论得证.

对于偶数 $i$, 有 $f_{i, j} = j \% (i + 1) \And 1 + 2[j \% (i + 1) = i]$.

仍然是先考虑 $0 < j < i$ 的情况, 这种情况下 $j \% (i + 1) = j \neq i$, 所以我们可以简化结论为 $f_{i, j} = j \And 1$. 因为这些情况的转移和 $i$ 无关, 所以证明和前面 $i$ 为奇数时相同.

当 $j = i$ 时, $j \% (i + 1) = j = i$, 又因为 $j \And 1 = i \And 1 = 0$, 所以结论可以写成 $f_{i, j} = 2$. 因为 $f_{i, j - 1} = (j - 1) \And 1 = (i - 1) \And 1 = 1$, $f_{i, j - i} = f_{i, 0} = 0$, 所以 $f_{i, j} = 2$, $j = i$ 时结论得证.

接下来讨论 $j > i$ 的情况.

当 $j \% (i + 1) < i$ 时, 如果 $(j \% (i + 1)) \And 1 = 1$, 则 $((j - i) \% (i + 1)) \And 1 = 0$, $((j - 1) \% (i + 1)) \And 1 = 0$, 所以 $f_{i, j - i}$, $f_{i, j - 1}$ 没有出现 $1$, 因为每 $i + 1$ 个 $j$ 才会出现一个 $2$, 所以 $f_{i, j - i}$, $f_{i, j - 1}$ 至多有一个 $2$, 至少有一个 $0$. 因此 $f_{i, j} = 1$.

如果 $(j \% (i + 1)) \And 1 = 0$, 则 $((j - 1) \% (i + 1)) \And 1 = 1$, $((j - i) \% (i + 1)) \And 1 = 1$, 则 $f_{i, j - 1} = f_{i, j - i} = 1$, 因此 $f_{i, j} = 0$.

当 $j \% (i + 1) = i$ 时, 我们知道 $(j - i) \% (i + 1) = 0$, $((j - 1) \% (i + 1) = i - 1) \And 1 = 1$, 因此 $f_{i, j} = 2$.

结论得证. 因此有:

$$
f_{i, j} =
\begin{cases}
j \And 1 & \text{if } i \And 1 = 1\\
j \% (i + 1) \And 1 + 2[j \% (i + 1) = i] & \text{if } i \And 1 = 0
\end{cases}
$$

这样我们便可以 $O(1)$ 得到任意 $f_{i, j}$. 先手必胜当且仅当 $f_{1, a_1} \oplus f_{2, a_2} \oplus ... \oplus f_{n, a_n} \neq 0$.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    A = RD() % (i + 1);
    if ((A == i) && (!(i & 1))) Ans ^= 2;
    else Ans ^= (A & 1);
  }
  printf((Ans ? "tomato fish+%us\n" : "rainy day+%us\n"), 1);
  return Wild_Donkey;
}
```

注意不要在洛谷里直接出现有关 `+ 1 s` 之类的子串, 会传不上去, 原因不可描述.

### T2 LCT

发现自己已经忘记只写过一遍的 LCT 了, 但是现在不是写 LCT 的时候, 放掉.

### T3 数论

这是一道十分困难的反演题, 是 [SDOI2018 旧试题](https://www.luogu.com.cn/problem/P4619)加强版. 目前实力不允许我进行如此大胆的尝试.

### [风暴之眼](https://www.luogu.com.cn/problem/P7727)

LSQ 在 NOIP 之前给我推荐的题, 我那时还是在床上想出来的. 如今重新看, 发现实力降低了, 不会做了, 被蓝题虐了. 临近省选终于搞出这道题, 这道题是个树上计数 DP.

因为两种类型的特殊性, 它们都有一个稳定颜色, 也就是说一个状态的点一旦变成某个颜色就再也不能变化了, 因此每个点从开始到结束最多变化一次.

因为输入的是稳态, 所以我们可以确定一些点的类型: 如果一个点的邻居存在和它颜色不一样的点, 那么可以证明如果这个点是某种类型则这个状态下一刻还会发生变化. 对于剩下的点, 它周围的点颜色都和它相同, 它无论是什么类型都有可能使稳态建立.

接下来设计状态开始 DP. 树形 DP 的核心就是把每棵子树作为子问题, 并且通过子树的结果推得自己的结果.

考虑如果是链, 如何由长度 $i$ 的链的方案数计算在链顶增加一个点的方案数.

如果我们加入的点的儿子和它不同色, 那么这个点的类型确定了, 只要它和儿子的初态有一个是它的终态即可, 或者仰仗父亲给我们提供终态颜色.

如果这个点和儿子同色, 那么先考虑它的状态要求它和邻居全是一种颜色的情况, 这时我们需要让它和儿子没有任何时刻是另一种颜色, 也就是它和儿子初态终态需要相同, 对儿子的类型不作要求, 但是需要警告父亲不能有任意时刻出现别的颜色; 再考虑它的状态要求它和邻居至少有一个是这种颜色的情况, 这时儿子的类型也不重要, 只要儿子和自己初始颜色有一个是自己终态颜色即可, 或是仰仗父亲提供.

讨论完了链, 发现转移需要记录两个状态: 初态和对父亲的要求. 初态容易表示, 但是对父亲的要求有两种: 父亲需要至少有一个时刻为自己的终态, 父亲不能有任意时刻不为自己的终态. 因为每个点最多变一次色, 所以我们可以通过要求父亲的初态来表示. 这样既可设计出状态: $f_{i, 0/1, 0/1}$ 表示点 $i$ 的子树在强制限定 $i$ 的初态和父亲的初态时的方案数.

接下来设计转移, 先考虑边界, 对于叶子 $i$ 来说:

$$
\begin{aligned}
f_{i, a_i, a_{Fa}} &= 1 + [a_{Fa} = a_i]\\
f_{i, a_i, a_{Fa} \oplus 1} &= 1\\
f_{i, a_i \oplus 1, a_{Fa}} &= [a_{Fa} = a_i]\\
f_{i, a_i \oplus 1, a_{Fa} \oplus 1} &= 1
\end{aligned}
$$

非叶子节点有亿点点麻烦:

$$
\begin{aligned}
f_{i, a_i, a_{Fa}} &= f_{i, a_i, a_{Fa} \oplus 1} + [a_{Fa} = a_i] \prod_{j \in Son_i} f_{j, a_i, a_i}[a_j = a_i]\\
f_{i, a_i, a_{Fa} \oplus 1} &= \prod_{j \in Son_i} (f_{j, 0, a_i} + f_{j, 1, a_i})\\
f_{i, a_i \oplus 1, a_{Fa}} &= f_{i, a_i \oplus 1, a_{Fa} \oplus 1} - [a_{Fa} \neq a_i]\prod_{j \in Son_i}f_{j, a_i \oplus 1, a_i \oplus 1}[a_j \neq a_i]\\
f_{i, a_i \oplus 1, a_{Fa} \oplus 1} &= \prod_{j \in Son_i} (f_{j, 0, a_i \oplus 1} + f_{j, 1, a_i \oplus 1})\\
\end{aligned}
$$

我们发现这个算法没有考虑传递的方向, 导致同色连通块陷入囚徒困境, 即所有点都在等待他人更新, 所以它 CW 了. (Completely Wrong)

接下来讨论一个点的情况, 和父亲颜色相同的点的状态有四种: 需要父亲的颜色传递到自己, 无需父亲即可变成自己的终态, 自始至终都可以独自保持自己的终态, 禁止父亲出现终态以外的颜色. 这四个状态互不重合且覆盖了所有情况, 分别用 $0, 1, 2, 3$ 表示它们, 其中 $0, 1$ 状态初态和终态相反, 类型也已确定. $2, 3$ 的初态和终态相同, 其中 $3$ 是要求邻居始终为自己终态的类型, $2$ 是另一种类型.

设计状态 $f_{i, j}$ 表示第 $i$ 个点为状态 $j$, 它子树合法的方案数. 前三个状态的转移是:

$$
\begin{aligned}
f_{i, 0} &= \prod_{j \in Son_i} (f_{j, 0}[a_j = a_i] + f_{j, 2}[a_j \neq a_i])\\
f_{i, 1} &= \prod_{j \in Son_i} (f_{j, 0} + f_{j, 1} + f_{j, 2}) - f_{i, 0}\\
f_{i, 2} &= \prod_{j \in Son_i} (f_{j, 0}[a_j = a_i] + f_{j, 1} + f_{j, 2} + f_{j, 3})\\
f_{i, 3} &= [a_{Fa} = a_i]\prod_{j \in Son_i} (f_{j, 2} + f_{j, 3})[a_i = a_j]
\end{aligned}
$$

我们设一个新的根 $R$ 作为原来根 $r$ 的父亲, 使它们终态相同. 对于 $r$ 初态不变的状态, 答案即为 $f_{r, 3} + f_{r, 2}$, 对于 $r$ 初态改变的状态, 取 $f_{r, 1}$ 即可.

```cpp
const unsigned long long Mod(998244353);
inline void Mn(unsigned& x) { x -= (x >= Mod) ? Mod : 0; }
unsigned long long Ans(1);
unsigned m, n, A, B;
struct Node {
  vector<Node*> E;
  unsigned f[4], Size;
  char Final;
}N[200005];
inline void DFS(Node* x, Node* Fa) {
  unsigned long long C1(1), C2(1), C3(1), C4(Fa->Final ^ x->Final ^ 1);
  for (auto i : x->E) if (i != Fa) {
    DFS(i, x);
    C1 = C1 * i->f[(x->Final ^ i->Final) << 1] % Mod;
    C2 = C2 * (i->f[0] + i->f[1] + i->f[2]) % Mod;
    C3 = C3 * (((i->Final == x->Final) ? i->f[0] : 0) + i->f[1] + i->f[2] + i->f[3]) % Mod;
    if (C4) C4 = C4 * ((i->Final == x->Final) ? (i->f[2] + i->f[3]) : 0) % Mod;
  }
  x->f[0] = C1;
  x->f[1] = Mod + C2 - C1, Mn(x->f[1]);
  x->f[2] = C3;
  x->f[3] = C4;
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) N[i].Final = RD();
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  N[0].Final = N[1].Final, DFS(N + 1, N), Ans = N[1].f[1] + N[1].f[2] + N[1].f[3];
  printf("%llu\n", Ans % Mod);
  return Wild_Donkey;
}
```

这绝对是我做过最难的蓝题.

## Day $-31$ Mar 03, 2022, Thursday

光是风暴之眼就给我做吐了.

今天的内容是仙人掌.

仙人掌图是任意一条边至多只出现在一个简单环的无向连通图. 这是当时写圆方树的时候学弟推荐我学的.

结合之前点双建立的圆方树, 发现仙人掌图是圆方树的弱化版本, 两环之间有割点连接, 每个点双连通分量都是一个简单环. 所以我们称仙人掌建出来的圆方树为狭义圆方树.

然后这个任务一直延续了三天.

## Day $-30$ Mar 04, 2022, Friday

今天模拟赛十分的不爽. 早上又双叒叕没报上名.

### T1

从 $(0, 0)$ 跳马最少步数到 $(x, y)$, 有 $1000$ 个询问, $x, y \leq 10^9$.

不要在 $n$ 组询问的时候从 $0$ 循环到 $n$, 不要让等待, 成为遗憾.

算法十分简单, 整个图密集分布着可以 $O(1)$ 查询的点, 我们把它们称为传送门. 密集到任意坐标搜 $4$ 步就可以到达至少一个传送门. 而从传送门到 $(0, 0)$ 的路径是最优的, 因此我们用终点搜出它 $4$ 步之内能到达的所有点, $O(1)$ 地判断是否是传送门, 如果是, 就把搜索步数加传送门到 $(0, 0)$ 的步数更新答案.

这个算法是双向搜索的变体, 被我称为二段跳算法. 单次询问需要 $O(8^4)$, 如果我想, 还可以记搜, 变成 $O(8^2)$.

### 仙人掌的完成

我们需要在仙人掌上多次询问两点最短路.

解决方案是建立圆方树, 然后作为树上问题进行查询.

从任意点开始 DFS, 每次来到一个点就把这个点加入栈中, 每次遇到已经来过的点, 说明找到了环, 那么就不断把栈顶弹出直到这个已经来过的点变成栈顶, 弹出的这些点加上弹出后的栈顶就变成了一个环, 也就是点双连通分量.

对于链上的点来说, 它不会被上面的过程弹出, 所以在回溯的时候, 如果一个点仍未被弹出, 那么回溯时弹出这个点, 将其本身作为新的点双.

对于环上两点的最短距离可以处理环上每个点沿同一方向到第一个点的距离, 相当于前缀和, 这样就可以查询两点沿某一个方向的最短路, 然后用环长减去这个最短路.

这个算法是基于 Tarjan 算法的, 但是略有不同, 无需记录 DFS 序和 Low 值. 姑且叫它 Jantar 算法 (误).

一些细节会在代码中体现, 建圆方树时不需要给单点也分配一个方点, 这是和广义圆方树不同的地方. 每个点出栈的时候, 记录.

```cpp
inline void Jantar(Node* x, Node* Co) {
  x->Istk = 1, * (++STop) = x;
  for (auto i : x->E) if (i.second != Co) {
    Node* Cur(i.second);
    if (!(x->Istk)) x->Istk = 1, * (++STop) = x;
    if (Cur->Istk) {
      Tr* Mid(++CntT);
      Mid->Fa = Get(Cur), Mid->Cir = i.first, Mid->Pre = 0;
      while (*STop != Cur) {
        (*STop)->Istk = 0;
        Tr* Sn(Get(*STop));
        Sn->Pre = Mid->Cir;
        Mid->Cir += (*(STop--))->From;
        Sn->Fa = Mid;
      }
    }
    else if (!(Get(i.second)->Fa)) Cur->From = i.first, Jantar(Cur, x);
  }
  if (!(Get(x)->Fa)) Get(x)->Fa = Get(Co), Get(x)->Pre = x->From;
  if (x->Istk) --STop, x->Istk = 0;
}
```

我们建出来的圆方树中, 每个环有一个点作为父亲, 它有一个方点作为儿子, 这个方点的其它儿子是这个环上其它的点.

对于每个方点到儿子的边权, 定义为儿子在原图上到方点的父亲的点的最短距离, 通过每个点记录前缀和和方点记录环长来计算.

我们用树链剖分完成查询最短路的任务. 注意最后同一个环上任意两点的距离需要对前缀和做差, 然后结合环长比较两个方向的距离得到.

```cpp
unsigned long long Ans(0);
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
struct Tr {
  vector<Tr*> Son;
  Tr* Fa, * Heavy, * Top;
  unsigned long long ToFa, Pre, Cir, Dep;
  unsigned Size, DFSr, Deep;
}T[20005], * CntT, * List[20005];
struct Node {
  vector<pair<unsigned, Node*> > E;
  unsigned From;
  char Istk;
}N[10005], * Stack[10005], ** STop(Stack);
inline Tr* Get(Node* x) { return T + (x - N); }
inline void PreDFS(Tr* x) {
  x->Size = 1;
  unsigned Mx(0);
  for (auto i : x->Son) {
    i->Dep = x->Dep + i->ToFa, i->Deep = x->Deep + 1, PreDFS(i);
    x->Size += i->Size;
    if (Mx < i->Size) Mx = i->Size, x->Heavy = i;
  }
}
inline void DFS(Tr* x) {
  List[x->DFSr = ++Cnt] = x;
  if (x->Heavy) x->Heavy->Top = x->Top, DFS(x->Heavy);
  for (auto i : x->Son) if (i != x->Heavy) i->Top = i, DFS(i);
}
inline void Qry(Tr* x, Tr* y) {
  Tr* Lx(NULL), * Ly(NULL);
  while (x->Top != y->Top) {
    if (x->Top->Deep > y->Top->Deep) swap(x, y), swap(Lx, Ly);
    Ly = y->Top, Ans += y->Dep - y->Top->Fa->Dep, y = y->Top->Fa;
  }
  if (x->Deep > y->Deep) swap(x, y), swap(Lx, Ly);
  if (y->Deep > x->Deep) Ans += y->Dep - x->Dep, Ly = List[(y = x)->DFSr + 1];
  if ((Lx && Ly) && (x > T + n)) {
    Ans -= Lx->Dep - x->Dep;
    Ans -= Ly->Dep - y->Dep;
    unsigned long long Del((Lx->Pre > Ly->Pre) ? (Lx->Pre - Ly->Pre) : (Ly->Pre - Lx->Pre));
    Ans += min(Del, x->Cir - Del);
  }
  return;
}
signed main() {
  n = RD(), m = RD(), t = RD(), CntT = T + n;
  for (unsigned i(1); i <= n; ++i) T[i].Cir = 0x3f3f3f3f3f3f3f3f;
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD();
    N[A].E.push_back({ C, N + B });
    N[B].E.push_back({ C, N + A });
  }
  Jantar(N + 1, NULL);
  for (Tr* i(T + 2); i <= CntT; ++i) i->Fa->Son.push_back(i), i->ToFa = min(i->Pre, i->Fa->Cir - i->Pre);
  T[1].Top = T + 1, PreDFS(T + 1), DFS(T + 1);
  for (unsigned i(1); i <= t; ++i) {
    A = RD(), B = RD(), Ans = 0;
    Qry(T + A, T + B);
    printf("%llu\n", Ans);
  }
  return Wild_Donkey;
}
```
