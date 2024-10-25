---
title: 省选日记 Day36~40
date: 2022-05-13 21:37
categories: Notes
tags:
  - Game_Theory
  - Dynamic_Programming
  - Combinatorial_Mathematics
  - Data_Structure
  - Computational_Geometry
  - Self_Balancing_Binary_Search_Tree
  - Suffix_Array
  - ST_Table
  - Segment_Tree_Edges_Construction_Optimization
  - Mobius_Inversion
  - Divide_and_Conquer
  - Three_Membered_Ring
  - Cantor_Expansion
  - Cartesian_Tree
  - System_of_Difference_Constraints
thumbnail: /images/MC1.png
---

# 省选日记 Day $36$ - Day $40$

## Day $36$ May 9, 2022, Monday

### [SDOI2019 移动金币](https://www.luogu.com.cn/problem/P5363)

发现这是一个典型的阶梯 NIM, 如果 $m$ 个金币把没有金币的空格分为 $m + 1$ 段, 那么后手必胜当且仅当从右往左数的偶数段的长度异或起来为零.

所以可以想到一个 $O(n^3m)$ 的算法, 也就是设 $f_{i, j, k}$ 表示如果 $j$ 个物品分成 $i$ 组, 异或和为 $k$ 的方案数. 那么答案便是:

$$
\sum_{i = 0}^{n - m} \binom{n - m - i + \lceil \frac{m + 1}2 \rceil - 1}{\lceil \frac{m + 1}2 \rceil - 1} f_{\lfloor \frac {m + 1}2 \rfloor, i, 0}
$$

转移也很简单:

$$
f_{i + 1, j + l, k \oplus l} += f_{i, j, k}
$$

这样可以得到 $50'$ 的好成绩.

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned& x) { x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Inver(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(1000000007);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
unsigned Fac[150005], Inv[150005], f[255][255], g[255][255];
inline unsigned long long C(unsigned x, unsigned y) {
  return ((unsigned long long)Fac[x] * Inv[y] % Mod) * Inv[x - y] % Mod;
}
unsigned (*F)[255](f), (*G)[255](g), mm, m, n;
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  n = RD(), m = RD() + 1, mm = m >> 1, f[0][0] = Fac[0] = 1;
  for (unsigned long long i(1); i <= n; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[n] = Inver(Fac[n]);
  for (unsigned long long i(n); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  n = n - m + 1;
  for (unsigned i(1); i <= mm; ++i) {
    swap(G, F);
    memset(F, 0, 260100);
    for (unsigned j(0); j <= n; ++j) for (unsigned k(0); k <= j; ++k)
      for (unsigned l(n - j); ~l; --l) Mn(F[j + l][k ^ l] += G[j][k]);
  }
  mm = m - mm - 1;
  for (unsigned i(0); i <= n; ++i) Ans = (Ans + F[i][0] * C(n - i + mm, mm)) % Mod;
  Ans = C(n + m - 1, m - 1) + Mod - Ans, Mn(Ans);
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

不过这道题作为 D2T3 有 $50'$ 白给相对这一年的染色来说已经友好多了.

看了一眼题解, 貌似是要按位考虑. 如果我们需要这些段异或和必须为 $0$, 那么充要条件是对于每一个二进制位, 它们的异或和为 $0$. 如果按位考虑那么情况会简单很多, 因为状态中总长度这一维会变成 $O(m)$, 异或值这一维可以根据总长度推算, 所以不用记.

重新设计 DP, 设 $g_{i, j, k}$ 表示考虑第 $i$ 位, 共 $j$ 段, 其中 $k$ 段为 $1$, 异或和为 $k \And 1$ 的方案数, 转移是这样的:

$$
g_{i, j + 1, k} += g_{i, j, k}\\
g_{i, j + 1, k + 1} += g_{i, j, k}\\
$$

$O(m^2\log n)$ 状态, $O(1)$ 转移, 复杂度 $O(m^2\log n)$.

发现 $g_{i, j, k}$ 就是一个二项式系数, 组合意义为从 $j$ 个物品中选 $k$ 个, 即 $\dbinom jk$.

改变 $f$ 的定义为 $f_{i, j}$ 表示仅考虑前 $i$ 位, 分成 $\lfloor \frac {m + 1}2 \rfloor$ 段, 总长度为 $2^{\lfloor \log n \rfloor - i}j$, 各位异或和为 $0$ 的方案数.

$$
f_{i + 1, 2j + 2k} += f_{i, j} * \binom{\lfloor \frac {m + 1}2 \rfloor}{2k}
$$

状态数 $O(n\log n)$, 转移 $O(m)$, 复杂度 $O(mn\log n)$.

统计答案是这样的, 仍然是 $O(n)$:

$$
\sum_{i = 0}^{n - m} \binom{n - m - i + \lceil \frac{m + 1}2 \rceil - 1}{\lceil \frac{m + 1}2 \rceil - 1} f_{\lfloor\log n\rfloor, i}
$$

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned& x) { x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Inver(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(1000000007);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
unsigned Fac[150005], Inv[150005], f[20][150005], Bn[30][30];
inline unsigned long long C(unsigned x, unsigned y) {
  return ((unsigned long long)Fac[x] * Inv[y] % Mod) * Inv[x - y] % Mod;
}
unsigned mm, m, n, Lgn(0);
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  n = RD(), m = RD() + 1, mm = m >> 1, Bn[0][0] = f[0][0] = Fac[0] = 1;
  for (unsigned long long i(1); i <= n; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[n] = Inver(Fac[n]);
  for (unsigned long long i(n); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  Tmp = n = n - m + 1;
  while (Tmp) Tmp >>= 1, ++Lgn; --Lgn;
  for (unsigned i(1); i <= mm; ++i) {
    Bn[i][0] = 1;
    for (unsigned j(1); j <= mm; ++j)
      Bn[i][j] = Bn[i - 1][j] + Bn[i - 1][j - 1], Mn(Bn[i][j]);
  }
  f[0][0] = 1;
  for (unsigned i(1); i <= Lgn; ++i) {
    unsigned N(n >> (Lgn - i)), N2(N >> 1);
    for (unsigned j(0); j <= N2; ++j)
      for (unsigned k(min(mm >> 1, N2 - j) << 1), *To(f[i] + (j << 1) + k); k < 0x3f3f3f3f; k -= 2, To -= 2)
        *To = (*To + (unsigned long long)f[i - 1][j] * Bn[mm][k]) % Mod;
  }
  mm = m - mm - 1;
  for (unsigned i(0); i <= n; ++i) Ans = (Ans + f[Lgn][i] * C(n - i + mm, mm)) % Mod;
  Ans = C(n + m - 1, m - 1) + Mod - Ans, Mn(Ans);
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

## Day $37$ May 10, 2022, Tuesday

### [SDOI2018 物理实验](https://www.luogu.com.cn/problem/P4605)

把给出的导轨变成 $x$ 轴, 将每个挡板都变成带权的线段, 权值就是一个单位宽度的激光会覆盖这个挡板的长度, 在导轨上方的挡板, 只有最低的部分有意义, 也就是说我们需要求出两个数组, 分别表示每个位置的导轨上方最低的挡板权值和导轨下方最高的挡板权值. 把两个数组每个位置对应相加得到一个数组 $a$. 我们需要找到 $a$ 的一个长为 $L$ 的子段使得这个段最大.

有一个贪心策略是我们选出的子段的左端点或右端点至少有一个是挡板端点的横坐标, 也就是说我们需要求 $O(n)$ 个区间的总和.

问题集中在了求出 $a$. 其实如果是较小的整数坐标的话可以用李超树求, 但是这时既是实数坐标有需要离散化, 所以不宜使用李超树. 发现一个非常重要的条件, 所有挡板不相交, 这蕴涵着一个信息, 如果用一条和 $y$ 轴平行的直线沿 $x$ 轴扫描, 所有和这条直线相交的线段的焦点的纵坐标相对关系不会改变, 由于我们只是希望知道相对关系, 所以可以只维护这个关系, 用平衡树实现.

旋转的方式每次都忘, 需要重新画图推导, $(x, y)$ 绕中心顺时针旋转 $\theta$ 后的坐标变成 $(y \sin \theta + x \cos \theta, y \cos \theta - x \sin \theta)$. (如果是逆时针则只要改变含有 $\sin \theta$ 的项的正负即可)

为了把导轨作为 $x$ 轴, 计算出导轨到原来原点的距离, 然后将所有点水平平移这个距离, 直线 $y = kx + b$ 到原点的距离为 $\sqrt{\dfrac{b^2}{1 + k^2}}$, 平移方向由导轨在原点上还是原点下决定, 也就是 $b$ 的正负, 也就是向下平移 $\dfrac b{\sqrt{1 + k^2}}$.

根据给出的导轨标准线段端点 $(x_1, y_1)$, $(x_2, y_2)$, 不失一般性, 设 $x_1 < x_2$. 可以直接求出 $\sin \theta$ 和 $\cos \theta$. 设标准线段的长度为 $Len$, 则 $\sin \theta = \dfrac {y_2 - y_1}{Len}$, $\cos \theta = \dfrac {x_2 - x_1}{Len}$.

虽然算法简单, 但是真的不好写. 而且据说卡精度需要 `long double`.
```cpp
const long double Ep(1e-12);
inline long double Squ (long double x) {return x * x;}
inline char Neq(long double x, long double y) {return (x + Ep < y) || (y + Ep < x); }
unsigned m, n, t;
unsigned Cnt(0), Tmp(0);
long double L, Sin, Cos, Move, Len, Scaning;
long double Ans;
struct Line {
  long double X1, X2, Y1, Y2, b, k, Val;
  inline void Rotate() {
    long double TmX, TmY;
    TmX = Y1 * Sin + X1 * Cos;
    TmY = Y1 * Cos - X1 * Sin - Move;
    X1 = TmX, Y1 = TmY;
    TmX = Y2 * Sin + X2 * Cos;
    TmY = Y2 * Cos - X2 * Sin - Move;
    X2 = TmX, Y2 = TmY;
    Val = sqrt((Squ(X2 - X1) + Squ(Y2 - Y1)) / Squ(X2 - X1));
    if(X1 > X2) swap(X1, X2), swap(Y1, Y2);
    k = (Y2 - Y1) / (X2 - X1), b = Y1 - (X1 * k);
  }
  inline void Prt() {
    printf("(%LF,%LF) (%LF,%LF) k %LF b %LF\n", X1, Y1, X2, Y2, k, b);
  }
  inline void Flip() {Y1 = -Y1, Y2 = -Y2, k = -k, b = -b;}
  inline long double Calc () const {return Scaning * k + b;}
  inline const char operator< (const Line& x) const{return Calc() < x.Calc();}
}Up[10005], Down[10005];
struct Range {
  long double Pos, Val;
  inline const char operator< (const Range& x) const{ return Pos < x.Pos;}
}UpR[20005], DownR[20005], Tot[40005];
struct Operate {
  long double Pos;
  Line* Val;
  char Type;
  inline const char operator< (const Operate& x) const{ return Pos < x.Pos;}
};
struct Node {
  Node* LS, * RS;
  Line* Mn, * Mx;
  unsigned Size;
  inline void Udt() {
    Size = LS->Size + RS->Size;
    Mn = LS->Mn, Mx = RS->Mx;
  }
  inline Node *Rotate() {
    if(!LS) return RS;
    if(!RS) return LS;
    if(Size <= 5) {if(LS) Udt(); return this;}
    if((LS->Size << 1) < RS->Size) {
      Node* Cur(RS);
      RS = Cur->RS, Cur->RS = Cur->LS, Cur->LS = LS, LS = Cur;
      Cur->Udt();
    }
    if((RS->Size << 1) < LS->Size) {
      Node* Cur(LS);
      LS = Cur->LS, Cur->LS = Cur->RS, Cur->RS = RS, RS = Cur;
      Cur->Udt();
    }
    Udt();
    return this;
  }
  inline Node *Insert(Line *x);
  inline Node *Delete(Line *x) {
    --Size;
    if((!LS) && (!RS)) { if(Mn != x) printf("Cao\n"); return NULL;}
    if(RS->Mn == x || *(RS->Mn) < *x) RS = RS->Delete(x);
    else LS = LS->Delete(x);
    return Rotate();
  }
}N[20005], *Root(N), *CntN(N);
inline Node* Node::Insert (Line *x) {
  ++Size;
  if((!LS) && (!RS)) {
    if((*Mn) < (*x)) Mx = x; else Mn = x;
    *(LS = ++CntN) = {NULL, NULL, Mn, Mn, 1};
    *(RS = ++CntN) = {NULL, NULL, Mx, Mx, 1};
    Udt();
    return this;
  }
  if(*(RS->Mn) < *x) RS = RS->Insert(x);
  else LS = LS->Insert(x);
  return Rotate();
}
inline void Build(Line* x, unsigned Lenx, Range* y, unsigned& Leny) {
  memset(N, 0, (CntN - N + 1) * sizeof(Node));
  Root = NULL, CntN = N, Leny = 0;
  Operate Op[Lenx << 1 + 2];
  for (unsigned i(1); i <= Lenx; ++i) {
    Op[(i << 1) - 1] = {x[i].X1, x + i, 0};
    Op[i << 1] = {x[i].X2, x + i, 1};
  }
  sort(Op + 1, Op + (Lenx = (Lenx << 1)) + 1);
  Scaning = -1e10;
  for (unsigned i(1); i <= Lenx; ++i) {
    long double Fill(0);
    if(Root && Root->Size) Fill = (Root->Mn)->Val;
    if(Neq(Scaning, Op[i].Pos) && (Scaning > -9e9)) y[++Leny] = {Scaning, Fill};
    Scaning = Op[i].Pos;
    if(Op[i].Type) Root = Root->Delete(Op[i].Val);
    else {
      if(!Root) *(Root = ++CntN) = {NULL, NULL, Op[i].Val, Op[i].Val, 1};
      else Root = Root->Insert(Op[i].Val);
    }
  }
  y[++Leny] = {Scaning, 0};
  return;
}
inline void Clr() {
  Ans = 0, n = RD();
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (unsigned i(1); i <= n; ++i) {
      Up[i].X1 = RDsg(), Up[i].Y1 = RDsg();
      Up[i].X2 = RDsg(), Up[i].Y2 = RDsg();
    }
    long double Len, StanB, StanK, StanX1, StanY1, StanX2, StanY2;
    StanX1 = RDsg(), StanY1 = RDsg();
    StanX2 = RDsg(), StanY2 = RDsg();
    if(StanX1 > StanX2) swap(StanX1, StanX2), swap(StanY1, StanY2); 
    Len = sqrt(Squ(StanX2 - StanX1) + Squ(StanY2 - StanY1));
    Sin = (StanY2 - StanY1) / Len;
    Cos = (StanX2 - StanX1) / Len;
    StanK = (StanY2 - StanY1) / (StanX2 - StanX1);
    StanB = StanY1 - (StanX1 * StanK);
    Move = StanB / sqrt(1 + StanK * StanK);
    L = RD();
    unsigned Cntu(0), Cntd(0);
    for (unsigned i(1); i <= n; ++i) {
      Up[i].Rotate();
      if(Up[i].Y1 < 0) Down[++Cntd] = Up[i];
      else Up[++Cntu] = Up[i];
    }
    for (unsigned i(1); i <= Cntd; ++i) Down[i].Flip();
    Build(Up, Cntu, UpR, Cntu), Build(Down, Cntd, DownR, Cntd), n = 0;
    for (unsigned i(1), j(1); i <= Cntu || j <= Cntd;) {
      if(i > Cntu) {Tot[++n] = DownR[j++]; continue;}
      if(j > Cntd) {Tot[++n] = UpR[i++]; continue;}
      if(Neq(UpR[i].Pos, DownR[j].Pos)) {
        if(UpR[i].Pos < DownR[j].Pos) Tot[++n] = {UpR[i].Pos, UpR[i].Val + DownR[j - 1].Val}, ++i;
        else Tot[++n] = {DownR[j].Pos, DownR[j].Val + UpR[i - 1].Val}, ++j;
      } else Tot[++n] = {DownR[j].Pos, DownR[j].Val + UpR[i].Val}, ++j, ++i;
    }
    long double Cur(0);
    for (unsigned i(1), j(1); i < n; ++i) {
      while ((j < n) && (Tot[j + 1].Pos - Tot[i].Pos <= L)) 
        Cur += Tot[j].Val * (Tot[j + 1].Pos - Tot[j].Pos), ++j;
      Ans = max(Ans, Cur + (L - Tot[j].Pos + Tot[i].Pos) * Tot[j].Val);
      Cur -= Tot[i].Val * (Tot[i + 1].Pos - Tot[i].Pos);
    }
    Cur = 0;
    for (unsigned i(n), j(n); j > 1; --j) {
      while ((i > 1) && (Tot[j].Pos - Tot[i - 1].Pos <= L)) 
        Cur += Tot[i - 1].Val * (Tot[i].Pos - Tot[i - 1].Pos), --i;
      Ans = max(Ans, Cur + (L - Tot[j].Pos + Tot[i].Pos) * Tot[i - 1].Val);
      Cur -= Tot[j - 1].Val * (Tot[j].Pos - Tot[j - 1].Pos);
    }
    printf("%.10LF\n", Ans);
  }
  return Wild_Donkey;
}
```

## Day $38$ May 11, 2022, Wednesday

感觉应该打板子了, 字符串那一套已经好久没碰了, 所以找一道字符串来做:

### [12OI2019 字符串问题](https://www.luogu.com.cn/problem/P5284)

题意一眼没看懂, 仔细分析发现是将 A 类串和 B 类串为节点, 从 A 类串向它支配的 B 类串连边, 从 B 类串向以它为前缀的 A 类串连边, A 类点的点权是 A 类串的长度, B 类点的点权是 $0$. 如果这个有向图有环, 输出 $-1$, 否则输出这个 DAG 的最长链.

A 类点向 B 类点的连边是输入给定的, 直接连即可. 但是 B 类点向 A 类点的连边则需要处理. 先求出 $SA$ 和 $Height$, 假设这时所有 A 类串都比 B 类串长, 对于每个 B 类串我们可以找出一个区间 $[L, R]$, 使得所有 $RK_{l_i} \in [L, R]$ 的 A 类串都以这个 B 类串为前缀, 这个区间可以在 $Height$ 上二分得到.

我们发现 B 类点向 A 类点可以有 $O(n^2)$ 条边, 所以不可能真的将这个图建出来. 由于每次都是在连续的一段区间里连边, 所以考虑线段树优化建图, 我们在 $A$ 串根据 $RK_l$ 排序后的序列上建立线段树, 每次区间连边即可.

接下来考虑不保证 A 类串都比 B 类串长的情况.

我们把 A 类串按长度排序, 将 A 类串从短到长加入可持久化线段树, 每个 B 类串在对应的线段树上连边即可.

$SA$ 和 $Height$ 的板子有大半年没打了, $Height$ 已经忘记怎么求了, 查看了当时的代码才明白.

我们从 $Suff_1$ 开始求 $Height$, 如果 $Height_i$ 已经求出并且非零, 那么 $Height_{SA_{RK_i - 1}}$ 至少为 $Height_i - 1$, 在这个基础上继续暴力求 $Height_{SA_{RK_i - 1}}$ 即可, 均摊可做到 $O(n)$, 原因是每次最多减 $1$ 所以减是线性的, 因此加也是线性的.

## Day $39$ May 12, 2022, Thursday

这道题虽然被我在睡觉的时候想出来了, 但是代码是真的难写, 从 $06:30$ 开始写, 中间有一段时间在调后缀数组, 之前说我可以半小时出 $SA$ 还是没有考虑到半年没碰 $SA$ 的现实. 这时发现的锅是原来是计算新的 $RK$ 的时候, 没有拿到新的数组中导致新旧数据混淆.

到 $10:30$ 过样例, 发现没清数组导致全 RE 也是有点牛逼.

$10:51$ 过了一个数据, 拿到 $10'$ 的好成绩.

不知道为什么出锅的我把倍增找和后缀 $SA_{Pos}$ 的 LCP 大于等于 $Len$ 的后缀数组上的区间的函数改成暴力了, 发现还是不对. 事后发现这个函数是正确的:

```cpp
inline void Find(unsigned Pos, unsigned Len) {
  A = B = Pos;
  B = Pos + 1;
  for (unsigned i(17); ~i; --i)
    if((B + (1 << i) - 1 <= n) && (ST[i][B] >= Len)) 
      B += (1 << i);
  --B;
  A = Pos;
  for (unsigned i(17); ~i; --i) 
    if((A > (1 << i)) && (ST[i][A - (1 << i)] >= Len)) A -= (1 << i);
  --A;
  if(ST[0][Pos] < Len) A = Pos;
}
```

怀疑自己后缀数组还是不对, 遂提交模板题, 发现是先赋值 $RK_{SA_1} = 1$, 然后再复制 $RK$ 数组, 导致 $SA_1$ 的 $RK$ 值错误. 改过来便在 $11:37$ AC 了后缀排序模板.
接下来附上求 $SA$ 并且把 $Height$ 建立 ST 表的最终代码:

```cpp
inline void Init(char* x) {
  memset(RK, 0, (n + 1) << 3);
  unsigned Tmp[(n + 1) << 1], Bucket[max((unsigned)27, n + 1)], Cnt(0), Cons(1);
  BucSize = 26;
  memset(Bucket, 0, (BucSize + 1) << 2);
  for (unsigned i(1); i <= n; ++i) ++Bucket[RK[i] = x[i] - 'a' + 1];
  for (unsigned i(1); i <= BucSize; ++i) Bucket[i] += Bucket[i - 1];
  for (unsigned i(1); i <= n; ++i) SA[Bucket[RK[i]]--] = i;
  while (Cnt < n) {
    memset(Bucket, 0, (BucSize + 1) << 2);
    for (unsigned i(1); i <= n; ++i) ++Bucket[RK[i]];
    for (unsigned i(1); i <= BucSize; ++i) Bucket[i] += Bucket[i - 1];
    unsigned Top(0);
    for (unsigned i(n); i; --i) if(SA[i] > Cons) Tmp[++Top] = SA[i] - Cons;
    for (unsigned i(++Top); i <= n; ++i) Tmp[i] = i;
    for (unsigned i(1); i <= n; ++i) SA[Bucket[RK[Tmp[i]]]--] = Tmp[i];
    memcpy(Tmp, RK, (n + 1) << 3);
    RK[SA[1]] = 1, Cnt = 1;
    for (unsigned i(2); i <= n; ++i)
      if((Tmp[SA[i]] ^ Tmp[SA[i - 1]]) || (Tmp[SA[i] + Cons] ^ Tmp[SA[i - 1] + Cons])) 
        RK[SA[i]] = ++Cnt;
      else RK[SA[i]] = Cnt;
    Cons <<= 1, BucSize = Cnt;
  }
  memset(ST[0], 0, (n + 1) << 2);
  for (unsigned i(1); i < n; ++i) if(RK[i] > 1) {
    unsigned& H(ST[0][RK[i]]);
    while (x[i + H] == x[SA[RK[i] - 1] + H]) ++H;
    if(H) ST[0][RK[i + 1]] = H - 1;
  }
  ST[0][1] = 0, Lg = 1;
  for (unsigned j(1); (j << 1) <= n; ++Lg, j <<= 1)
    for (unsigned k(n - j); k; --k)
      ST[Lg][k] = min(ST[Lg - 1][k], ST[Lg - 1][k + j]);
}
```

后缀数组改过来还是错, 突然意识到自己将 A 类串排序了再连的支配关系, 而这时连边是完全乱套的, 怒, 吃饭.

修改为每个 A 类串的结构体中存一个节点指针表示这个串对应的节点, 实现排序不改变点的位置.

```cpp
struct String {
  Node* Nd;
  unsigned Len, L;
  inline const char operator< (const String& x) const { 
    return (Len ^ x.Len) ? (Len > x.Len) : (Su_Ar.RK[L] < Su_Ar.RK[x.L]);
  }
  inline void Input() { L = RD(), Len = RD() - L + 1;}
}TpA[200005], TpB[200005];
```

结构体 `String` 的错误也被清零了, 于 $12:28$ 提交, 但是只能拿到 $30'$.

这时问题就出现在线段树上了, 对于一个叶子, 它需要合并历史版本这个位置上叶子的信息和这个版本新加入的信息, 我的做法是认为每个 A 类串都是不同的, 因此每个版本的每个叶子最多会增加 $1$ 个点, 因此将叶子对应的 DAG 上的节点直接设为这个 A 类串对应的节点. 对于以前的版本, 我们从这个点向那些版本的点连边即可. 这样做的坏处就是让一些有前缀关系的 A 类串之间有连边, 而这种连边会导致有不合法的链被统计, 所以每个叶子还是要有自己对应的 DAG 上的节点, 然后从这个节点向 A 类点和历史版本的节点连边.

$12:46$ 提交后发现这样做可以拿到 $60'$, 剩下的点 TLE, 正当我准备大力卡常的时候, 发现之前改成暴力的数组没有改回来.

改过来之后本地跑大数据飞快, 心想这不就能过了吗, 结果提交之后还是 $60'$. 发现有一个 TLE 和三个 WA.

WA 的地方比答案小一点点, 我开始疑惑, 对着下载的巨大数据开始各种操作, 排除了数组开小, 多测不清空各种地方的锅, 最后发现是因为数据存在两个 A 类串左右端点相同的情况, 也就是说之前我认为的每个版本每个叶子只会增加一个点的想法错了.

把这里改过来之后, 于 $14:01$ 在 LOJ 上怒拿 $90'$, 看来等待我的只有卡常了. 侥幸心理让我打开了 `-Ofast`, 反而变成了 $80'$. 因为洛谷 $10s$ 的时限比 LOJ $6s$ 时限宽松多了, 摆烂心理让我在洛谷提交, 然后发现它不光过了, 而且每个点都跑进了 LOJ 的 $6s$ 时限.

但是强迫症的我怎么能允许这种事情发生呢, 发现线段树的结构和 DAG 的一部分重合了, 也就是说我们完全可以拿 DAG 当成线段树来用, 把线段树删掉. 由于我们访问线段树的时候都是从任意版本的根递归向下, 所以可以保证经过的点都是线段树上的点, 将线段树上的点的第 $0$ 条出边认为是左儿子, 第 $1$ 条出边认为是右儿子, 没有儿子的情况用一个哨兵来占位. 这样就可以大大减少代码细节. 在 $14:35$ 完成了这份代码. 不知是不是大量无效边的缘故, 这份代码在本地和洛谷都变得更慢了, 但是它在 LOJ 上却奇迹般地 AC 了, 至此我也得到了一份可以在两边都 AC 的代码:

```cpp
unsigned n, t, A, B, Lg;
struct Suffix_Array {
  unsigned SA[200005], RK[400005], ST[18][200005], BucSize;
  inline void Prt() {
    printf("RK:"); for (unsigned i(1); i <= n; ++i) printf("%u ", RK[i]); putchar(0x0A);
    printf("SA:"); for (unsigned i(1); i <= n; ++i) printf("%u ", SA[i]); putchar(0x0A);
    printf("Ht:"); for (unsigned i(1); i <= n; ++i) printf("%u ", ST[0][i]); putchar(0x0A);
  }
  inline void Init(char* x) { /*前面已经给出*/ }
  inline void Find(unsigned Pos, unsigned Len) { /*前面已经给出*/ }
}Su_Ar;
char a[200005];
struct String;
struct Node {
  vector<Node*> E;
  unsigned long long Val;
  unsigned Idg;
  inline void LinkTo(Node* x);
  inline void Insert(unsigned L, unsigned R, Node *x, String **List, unsigned Len);
  inline void Link(unsigned L, unsigned R);
}N[5000005], *Ver[200005], *From, *NB, *CntN(N);
struct String { /*前面已经给出*/ };
inline void Node::LinkTo(Node* x) { 
  E.push_back(x), ++(x->Idg);
}
inline void Node::Link(unsigned L, unsigned R) {
  if(A <= L && R <= B) {From->LinkTo(this); return;}
  unsigned Mid((L + R) >> 1);
  if(A <= Mid && E[0] != N) E[0]->Link(L, Mid);
  if(B > Mid && E[1] != N) E[1]->Link(Mid + 1, R);
}
inline void Node::Insert(unsigned L, unsigned R, Node *x, String **List, unsigned Len) {
  if(L == R) {
    for (unsigned i(1); i <= Len; ++i) LinkTo(List[i]->Nd);
    if(x != N) LinkTo(x);
    return;
  }
  unsigned Mid((L + R) >> 1), LenR(0);
  while (Len && Su_Ar.RK[List[Len]->L] > Mid) ++LenR, --Len;
  if(Len) LinkTo(++CntN), E[0]->Insert(L, Mid, x->E[0], List, Len);
  else LinkTo(x->E[0]);
  if(LenR) LinkTo(++CntN), E[1]->Insert(Mid + 1, R, x->E[1], List + Len, LenR);
  else LinkTo(x->E[1]);
}
unsigned long long Ans(0);
unsigned m, ma, mb;
inline void Clr() {
  memset(N, 0, (m + 1) * sizeof(Node));
  memset(Ver, 0, (n + 2) << 3);
  N->E.push_back(N), N->E.push_back(N); 
  CntN = N, Ans = 0;
  memset(a, 0, n + 1);
  scanf("%s", a + 1); 
  n = strlen(a + 1);
  Su_Ar.Init(a);
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    CntN = N + (ma = RD());
    for (unsigned i(1); i <= ma; ++i)
      TpA[i].Input(), (TpA[i].Nd = N + i)->Val = TpA[i].Len;
    sort(TpA + 1, TpA + ma + 1);
    String* Ins[ma + 1];
    Ver[n + 1] = N;
    for (unsigned i(1), j(n + 1); i <= ma; ) {
      unsigned CntI(0), Cur(TpA[i].Len);
      while (TpA[i].Len == Cur) Ins[++CntI] = TpA + (i++);
      (Ver[Cur] = ++CntN)->Insert(1, n, Ver[j], Ins, CntI);
      j = Cur;
    }
    for (unsigned i(n); i; --i) if(!Ver[i]) Ver[i] = Ver[i + 1];
    NB = CntN, mb = RD();
    for (unsigned i(1); i <= mb; ++i) {
      TpB[i].Input(), From = NB + i;
      Su_Ar.Find(Su_Ar.RK[TpB[i].L], TpB[i].Len);
      if(Ver[TpB[i].Len]) Ver[TpB[i].Len]->Link(1, n);
    }
    m = RD();
    for (unsigned i(1); i <= m; ++i) 
      A = RD(), B = RD(), N[A].LinkTo(NB + B);
    m = CntN - N + mb;
    Node* Que[m + 1], **Hd(Que), **Tl(Que);
    for (Node* i(N + m); i > N; --i) if(!(i->Idg)) *(++Tl) = i;
    while (Hd < Tl) {
      Node* Cur(*(++Hd));
      for (auto i:Cur->E) if(!(--(i->Idg))) *(++Tl) = i;
    }
    if(Tl - Que != m + 1) {printf("-1\n"); continue;}
    for (Node**i(Tl); i > Que; --i) {
      Node* Cur(*i);
      unsigned long long Mx(0);
      for (auto j:Cur->E) Mx = max(Mx, j->Val);
      Cur->Val += Mx, Ans = max(Ans, Cur->Val);
    }
    printf("%llu\n", Ans);
  }
  return Wild_Donkey;
}
```

### [SDOI2018 旧试题](https://www.luogu.com.cn/problem/P4619)

早就听说莫比乌斯反演在 SDOI 的地位, 所以决定做一下这道德高望重的题.

$$
\sum_{i = 1}^A \sum_{j = 1}^B \sum_{k = 1}^C d(ijk)
$$

一眼看出可以直接求 $O(n^3)$, 可以得到 $0'$ 的好成绩.

听说以我的实力, 绝无可能想出该题. 推了一张纸发现只是把 $\sum$ 变多了好几个, 没有什么进展.

其实之前我用到过这个 Trick, 就是有关几个数乘积的因数计数问题, 其中的关键点是如果我们把因数分成几个部分, 那么这时同一个数可以存在多种不同的分配方式. 为了防止这个情况, 我们将因数尽量分配到靠前的数里面, 如果一个数被分到了一个质因子 $p$, 那么必须保证它前面的数字没有 $p$ 可分了.

如果我们把这种策略中除了最后一个选了 $p$ 的数以外所有含 $p$ 的数的所有因子 $p$ 都删掉, 就可以得到一个每个数的选中部分两两互质的分配方式, 而这种方案和可以凑出的因数是一一对应的, 因此我们可以把问题转化为:

$$
\sum_{i = 1}^A \sum_{j = 1}^B \sum_{k = 1}^C \sum_{a | i} \sum_{b | j} \sum_{c | k} [(a, b) = (a, c) = (b, c) = 1]
$$

为了求这个式子, 仍然是移动 $\sum$ 符号.

$$
\sum_{a = 1}^A\lfloor \frac Aa \rfloor \sum_{b = 1}^B\lfloor \frac Bb \rfloor \sum_{c = 1}^C\lfloor \frac Cc \rfloor [(a, b) = (a, c) = (b, c) = 1] 
$$

然后我们就得到了极为先进的 $O(n^3)$ 算法, 还是 $0'$.

这个式子的核心是 $[(a, b) = (a, c) = (b, c) = 1]$ 这个东西可以转化为 $[(a, b) = 1][(a, c) = 1][(b, c) = 1]$ 三个式子相乘. 然后简单进行一个反演:

$$
\left(\sum_{d | a, d | b} \mu(d)\right)\left(\sum_{e | a, e | c} \mu(e)\right)\left(\sum_{f | b, f | c} \mu(f)\right)
$$

这个时候仍然移动 $\sum$, 得到这样的式子:

$$
\sum_{d = 1}^{\min(A, B)} \mu(d) \sum_{e = 1}^{\min(A, C)} \mu(e) \sum_{f = 1}^{\min(B, C)} \mu(f) \sum_{a = 1}^{\lfloor\frac A{\text{lcm}(d, e)}\rfloor}\lfloor \frac{A}{a\text{lcm}(d, e)} \rfloor \sum_{b = 1}^{\lfloor\frac B{\text{lcm}(d, f)}\rfloor}\lfloor \frac{B}{b\text{lcm}(d, f)} \rfloor \sum_{c = 1}^{\lfloor\frac C{\text{lcm}(e, f)}\rfloor}\lfloor \frac{C}{c\text{lcm}(e, f)} \rfloor
$$

如果认为 $g(x) = \sum_{i = 1}^x \lfloor \frac xi\rfloor$, 可以 $O(n\sqrt n)$ 预处理出整个 $g$. 然后就可以得到极为先进的 $O(n^3)$ 算法, 还是 $0'$.

$$
\sum_{d = 1}^{\min(A, B)} \mu(d) \sum_{e = 1}^{\min(A, C)} \mu(e) \sum_{f = 1}^{\min(B, C)} \mu(f) g(\lfloor\frac A{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac B{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac C{\text{lcm}(e, f)}\rfloor)
$$

接下来就到了人类智慧的时间了, 发现复杂度高是因为枚举了太多无用的三元组 $(d, e, f)$. 为了剪枝, 首先我们不枚举所有 $\mu$ 为 $0$ 的数字, 然后因为 $g(0) = 0$ 因此所有包含有两个数字 $\text{lcm}$ 大于 $\max(A, B, C)$ 的三元组也不能被枚举. 所以给每个 $\max(A, B, C)$ 以内的 $\mu$ 非零的自然数建一个点, 然后在满足 $\text{lcm}(a, b) \leq \max(A, B, C)$ 的点之间连边. 这时图上的三元环就是我们可能枚举的三元组, 而其它的三元组一定是没有贡献的.

## Day $40$ May 13, 2022, Friday

发现我们还不会无向图三元环计数, 所以来做一下这个模板题

### [P1989 无向图三元环计数](https://www.luogu.com.cn/problem/P1989)

一个比较暴力的方法是 $O(m\log m)$ 将所有点的边按对面点的编号排序, 然后 $O(m)$ 枚举每条边, 对于每条边的两个端点 $O(n)$ 地双指针求出它们的公共邻居数量, 也就是三元环数量. 但是这样会使得每个三元环被统计三次, 所以最后答案需要除以 $3$, 复杂度 $O(mn)$.

为了防止重复统计, 我们用某种偏序关系给这些边定向, 得到一个 DAG, 然后就可以每个环只记一次地求出来. 我一开始不知道正解的时候是这样做的:

将每条无向边变成从编号小的到编号大的点之间的边, 然后按出边数量给点分类, 如果一个点出边大于 $\sqrt m$, 那么把它记到出边终点内的 `set` 里, 由于出边大于 $\sqrt m$ 条的点最多 $\sqrt m$ 个, 因此每个点 `set` 里的点最多 $O(\sqrt m)$ 个. 因为每条边最多将一个点插入到一个 `set` 中, 所以所有 `set` 总元素数量不超过 $m$.

查询的时候, 假设枚举了一条边. 如果两个点的出边数量都不大于 $\sqrt m$, 那么直接暴力双指针 $O(\sqrt m)$, 如果有一个点出边数量大于 $\sqrt m$, 那么对另一个点的出边和出边指向的点的 `set` 内查询, $O(\sqrt m \log \sqrt m)$, 如果两个点出度都大于 $\sqrt m$, 还是暴力查询 $O(n)$.

所以复杂度没有优化, 是 $O(m(n + \sqrt m \log m))$.

正解是这样的: 将偏序关系定义为第一关键字是度数, 第二关键字是编号. 度数少的点向度数多的点连边, 度数相等就从编号小的点向编号大的点连边.

这样就导致度数大于 $\sqrt m$ 的点的出边不会大于 $\sqrt m$, 所以所有点的出度都不大于 $\sqrt m$, 因此暴力双指针的复杂度就是 $O(\sqrt m)$ 的, 总复杂度 $O(m\sqrt m)$.

```cpp
unsigned a[200005][2], m, n;
unsigned C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node {
  vector<Node*> E; 
  unsigned Dgr, Num;
  inline const char operator< (const Node& x) { return Dgr < x.Dgr; }
}N[100005], *List[100005], *A, *B;
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) N[i].Num = i; 
  for (unsigned i(1); i <= m; ++i)
    ++(N[a[i][0] = RD()].Dgr), ++(N[a[i][1] = RD()].Dgr);
  sort(N + 1, N + n + 1);
  for (unsigned i(1); i <= n; ++i) List[N[i].Num] = N + i;
  for (unsigned i(1); i <= m; ++i) {
    A = List[a[i][0]], B = List[a[i][1]];
    if(A < B) A->E.push_back(B);
    else B->E.push_back(A); 
  }
  for (unsigned i(1); i <= n; ++i) sort(N[i].E.begin(), N[i].E.end());
  for (unsigned i(1); i <= n; ++i) {
    unsigned Bot(0);
    for (auto j:N[i].E) {
      unsigned Lim(N[i].E.size() - 1), l(Bot++); 
      for (auto k:j->E) {
        while (N[i].E[l] < k && l < Lim) ++l;
        if(N[i].E[l] == k) ++Ans;
      }
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

### [SDOI2018 旧试题](https://www.luogu.com.cn/problem/P4619)

仍然是那个问题, 我们发现由于只考虑 $\mu$ 不为 $0$ 的数, 显然它们的 $\text{lcm}$ 也不为 $0$, 所以每个质因子只会出现一次, $100000$ 以内, 质因子最多的数有 $6$ 个, 它是 $30030$.

我们枚举每个合法的 $\text{lcm}$, 枚举它的质因数集合的子集作为边的一端, 然后枚举这个集合的一个子集作为边的两端的 $\text{gcd}$, 一个比较宽松的复杂度是 $100000 \times 3^6$, 但是实际上只连了不到 $8 \times 10^5$ 条边, 有大约 $1.4 \times 10^6$ 个三元环.

我们把 $\text{lcm}$ 作为边权, 用前面提到的算法枚举三元环 $(d, e, f)$, 然后 $O(1)$ 计算这个式子:

$$
\begin{aligned}
&\mu(d) \mu(e) \mu(f)\left(
\begin{matrix}
&g(\lfloor\frac A{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac B{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac C{\text{lcm}(e, f)}\rfloor)\\
&g(\lfloor\frac A{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac C{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac B{\text{lcm}(e, f)}\rfloor)\\
&g(\lfloor\frac B{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac A{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac C{\text{lcm}(e, f)}\rfloor)\\
&g(\lfloor\frac B{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac C{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac A{\text{lcm}(e, f)}\rfloor)\\
&g(\lfloor\frac C{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac A{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac B{\text{lcm}(e, f)}\rfloor)\\
&g(\lfloor\frac C{\text{lcm}(d, e)}\rfloor)g(\lfloor\frac B{\text{lcm}(d, f)}\rfloor)g(\lfloor\frac A{\text{lcm}(e, f)}\rfloor)\\
\end{matrix}
\right)
\end{aligned}
$$

现在终于得到了一个极为先进的 $O(m \sqrt m)$ 算法, 期望可以得到 $100'$.

但是过程非常的曲折, 有很多地方出锅, 但是好在过了样例就 AC 了, 听说是个卡常题, $5s$ 时限非常吃紧, 但是我跑得飞快, 最慢的点只用了 $1.78s$.

```cpp
const unsigned long long Mod(1000000007);
bitset<100005> NO;
unsigned a[761000][3], Mu[100005], Dev[100005];
unsigned Deg[100005], Pri[10005], CntP(0);
vector<pair<unsigned, unsigned> > E[100005];
unsigned g[100005];
unsigned CntE(0), A, B, C, t;
unsigned n, m, Ans(0);
unsigned Lcm1, Lcm2, Lcm3, MulMu;
unsigned Lcm, Cur1(1), Cur2(1);
inline void Clr() {
  for(unsigned i(1); i <= n; ++i) E[i].clear();
  memset(Deg, 0, (n + 1) << 2);
  A = RD(), B = RD(), C = RD();
  n = max(A, max(B, C)), Ans = m = 0;
}
inline void DFS2(unsigned x) {
  if(x == 1) {
    unsigned To((Lcm / Cur1) * Cur2);
    if(Cur1 >= To) return;
    ++Deg[a[++m][0] = Cur1];
    ++Deg[a[m][1] = To];
    a[m][2] = Lcm;
    return;
  }
  Cur2 *= Dev[x];
  DFS2(x / Dev[x]);
  Cur2 /= Dev[x];
  DFS2(x / Dev[x]);
}
inline void DFS(unsigned x) {
  if(x == 1) {return DFS2(Cur1);}
  Cur1 *= Dev[x];
  DFS(x / Dev[x]);
  Cur1 /= Dev[x];
  DFS(x / Dev[x]);
}
inline unsigned long long Calc() {
  unsigned long long A1(g[A / Lcm1]), A2(g[A / Lcm2]), A3(g[A / Lcm3]);
  unsigned long long B1(g[B / Lcm1]), B2(g[B / Lcm2]), B3(g[B / Lcm3]);
  unsigned long long C1(g[C / Lcm1]), C2(g[C / Lcm2]), C3(g[C / Lcm3]);
  return (A1 * ((B2 * C3 + B3 * C2) % Mod)
        + A2 * ((B1 * C3 + B3 * C1) % Mod)
        + A3 * ((B1 * C2 + B2 * C1) % Mod)) % Mod;
}
signed main() {
  Mu[1] = 1;
  for (unsigned i(2); i <= 100000; ++i) {
    if(!NO[i]) Mu[i] = 1000000006, Dev[i] = Pri[++CntP] = i;
    for (unsigned j(1), k(2); (k * i <= 100000) && (j <= CntP); k = Pri[++j]) {
      NO[k * i] = 1, Dev[k * i] = k;
      if(Mu[i]) Mu[k * i] = ((Mu[i] ^ 1) ? 1 : 1000000006);
      if(!(i % k)) {Mu[i * k] = 0; break;}
    }
  }
  for (unsigned i(1); i <= 100000; ++i) {
    unsigned &Tmp(g[i]);
    for (unsigned long long L, R(Tmp = 0), Cur; R < i; ) {
      L = R + 1, Cur = i / L, R = i / Cur;
      Tmp = (Tmp + (R - L + 1) * Cur) % Mod;
    }
  }
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (Lcm = 1; Lcm <= n; ++Lcm) if(Mu[Lcm]) Cur1 = 1, DFS(Lcm);
    for (unsigned i(1); i <= m; ++i) {
      unsigned Ta(a[i][0]), Tb(a[i][1]);
      if(Deg[Ta] < Deg[Tb]) {E[Ta].push_back({Tb, a[i][2]}); continue;}
      if(Deg[Ta] > Deg[Tb]) {E[Tb].push_back({Ta, a[i][2]}); continue;}
      if(Ta > Tb) E[Tb].push_back({Ta, a[i][2]});
      else E[Ta].push_back({Tb, a[i][2]});
    }
    for (unsigned i(1); i <= n; ++i) sort(E[i].begin(), E[i].end());
    for (unsigned i(1); i <= n; ++i) if(Mu[i]) {
      Ans = (Ans + ((((unsigned long long)Mu[i] * g[A / i] % Mod) * g[B / i] % Mod) * g[C / i])) % Mod;
      unsigned long long Ai(g[A / i]), Bi(g[B / i]), Ci(g[C / i]);
      for (auto j:E[i]) {
        unsigned long long Aj(g[A / j.second]), Bj(g[B / j.second]), Cj(g[C / j.second]);
        unsigned long long Tmp((Aj * Bj % Mod) * Ci % Mod);
        Tmp = (Tmp + (Aj * Cj % Mod) * Bi) % Mod;
        Tmp = (Tmp + (Bj * Cj % Mod) * Ai) % Mod;
        Ans = (Ans + Mu[j.first] * Tmp) % Mod;
        Tmp = ((Aj * Bj % Mod) * g[C / j.first] + (Aj * Cj % Mod) * g[B / j.first]) % Mod;
        Tmp = (Tmp + (Bj * Cj % Mod) * g[A / j.first]) % Mod;
        Ans = (Ans + Mu[i] * Tmp) % Mod;
      }
    }
    for (unsigned i(1); i <= n; ++i) if(Mu[i]) {
      unsigned Lim(E[i].size() - 1);
      for (auto j:E[i]) {
        unsigned l(0);
        Lcm1 = j.second, MulMu = Mu[i];
        if(Mu[j.first] ^ 1) MulMu = ((MulMu ^ 1) ? 1 : 1000000006);
        for (auto k:E[j.first]) {
          while ((l < Lim) && (E[i][l].first < k.first)) ++l;
          if((E[i][l].first) ^ (k.first)) continue;
          unsigned MulMuk(MulMu);
          if(Mu[k.first] ^ 1) MulMuk = ((MulMuk ^ 1) ? 1 : 1000000006);
          Lcm2 = k.second, Lcm3 = E[i][l].second;
          Ans = (Ans + MulMuk * Calc()) % Mod;
        }
      }
    }
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

### [P5367 康托展开](https://www.luogu.com.cn/problem/P5367)

开始打板子了, 发现还有个绿板子没做, 之前就胡出来了只是没写.

其实输出的是一个阶乘多项式, 我们只需要每次关心首位, 统计为最高项的系数, 然后加上后面 $n - 1$ 个数中, 大于首位的同时减 $1$, 变成的 $n - 1$ 排列的编号即可.

发现可以不用真的去给那些数字减 $1$, 只要统计每个数后面比它小的数字数量即可. 果断使用树状数组维护.

```cpp
#define Lbt(x) (((~(x))+1)&(x)) 
const unsigned long long Mod(998244353);
unsigned a[1000005], Tr[1000005], n;
unsigned long long Fac(1), Ans(1);
inline void Add(unsigned x) {while(x <= n) ++Tr[x], x += Lbt(x);}
inline unsigned Qry(unsigned x) {
  unsigned Rt(0);
  while (x) Rt += Tr[x], x -= Lbt(x);
  return Rt;
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) a[i] = RD();
  for (unsigned i(n), j(1); i; --i, ++j)
    Ans = (Ans + Qry(a[i]) * Fac) % Mod, Add(a[i]), Fac = Fac * j % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

### [P5854 笛卡尔树](https://www.luogu.com.cn/problem/P5854)

初赛的时候看到指针我是很惊喜的, 笛卡尔树我了解它的结构, 却不会构造, 然后把大小搞反了导致没得几分.

我们发现可以用 ST 表做到 $O(n\log n)$, 奈何 $10^7$ 过不了.

定义 "右链" 表示二叉树上从根开始一直往右儿子走直到没有右儿子所经过的点组成的链.

构造时发现如果从左到右增量构造, 每次插入的点的父亲是它左边第一个比它小的数字. 我们只要维护一个单调栈即可找到父亲. 如果父亲已经有右儿子了, 那就将这个儿子作为插入的点的左儿子, 然后使这个点变成它父亲的新的右儿子. 特殊情况是这个点左边没有更小的点, 那么它就是根, 原树整个变成它的左子树.

由于每个点只会入栈一次, 所以这个算法是 $O(n)$ 的.

代码很简单, 但是为什么模板只要求建出树来, 没有解决任何问题.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node {
  Node* LS, * RS;
  unsigned Val; 
}N[10000005], *Stack[10000005], **STop(Stack), *Root(NULL);
inline void Print() {
  for (unsigned i(1); i <= n; ++i)
    printf("%u LS %u RS %u\n", i, N[i].LS - N, N[i].RS - N);
}
inline void Prt() {
  unsigned long long LXor(0), RXor(0);
  for (unsigned long long i(1); i <= n; ++i) LXor ^= i * (N[i].LS ? (N[i].LS - N + 1) : 1);
  for (unsigned long long i(1); i <= n; ++i) RXor ^= i * (N[i].RS ? (N[i].RS - N + 1) : 1);
  printf("%llu %llu\n", LXor, RXor);
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    N[i] = {NULL, NULL, RD()};
    while ((STop > Stack) && ((*STop)->Val > N[i].Val)) --STop;
    if(STop > Stack) N[i].LS = (*STop)->RS, (*STop)->RS = N + i, *(++STop) = N + i;
    else N[i].LS = Root, Root = *(++STop) = N + i;
  }
  Prt();
  return Wild_Donkey;
}
```

### [P5960 差分约束算法](https://www.luogu.com.cn/problem/P5960)

给每个变量建一个点, 还有一个超级源点 $0$ 号点. 问题中的每个变量 $x_i$ 都可以认为是点 $0$ 到点 $i$ 的最短路. 将约束 $x_a - x_b \leq c$ 变形为 $x_a \leq x_b + c$, 其意义是在图上点 $0$ 到点 $a$ 的最短路不会比 $x_b + c$ 长, 有点像三角形不等式. 为了保证只要 $0$ 到 $b$ 有足够短的路径, $0$ 到 $a$ 的路径就不会特别长, 我们在 $b$ 到 $a$ 连一条权值为 $c$ 的边. 最后从点 $0$ 开始跑单源最短路即可.

需要给每个点赋一个上界, 这个上界就是超级原点向每个点连的边权.

如果有负环, 则无法构造一个合法的解. 如果没有, 那么每个点的最短路就是一组解.

看了这个题的数据范围, 我又想到了那个关于 SPFA 的悲伤的故事, 突然不懂为什么有负边但是没有负环的图不能用 Dijkstra 来跑, 这并不会导致死循环啊. 发现 Dijkstra 的正确性是建立在每次松弛的点是所有未松弛的点中最短路最小的之上的, 但是有负边的情况会使得每次松弛一个点之后, 还有可能出现最短路更小的未松弛的点, 正确性不复存在. 因此 Dijkstra 不能处理负边.

但是为什么费用流里面可以用 Dijkstra 代替 SPFA 呢? 这是因为我们已经用 SPFA 求了一次正确的最短路, 而之后每个点的最短路不会变小, 所以我们用 Dijkstra 求的是每个点的最短路增量, 而增量是非负的, 所以是正确的.

```cpp
unsigned m, n, A, B;
char Flg;
struct Node {
  vector<pair<Node*, int> > E;
  int Dis, Tms;
  char Iq;
}N[5005], *Que[25000005], **Hd(Que), **Tl(Que);
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) N->E.push_back({N + i, 0x3f3f3f3f});
  for (unsigned i(1); i <= n; ++i) N[i].Dis = 0x7f7f7f7f;
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD();
    N[B].E.push_back({N + A, RDsg()});
  }
  *(++Tl) = N;
  while (Hd < Tl) {
    Node* Cur(*(++Hd));
    Cur->Iq = 0;
    for (auto i:Cur->E) {
      int To(i.second + Cur->Dis);
      if((i.first)->Dis > To) {
        (i.first)->Dis = To;
        if(!((i.first)->Iq)) {
          ((i.first)->Iq) = 1, *(++Tl) = i.first;
          if(++((i.first)->Tms) > n) {Flg = 1; break;}
        }
      }
    }
    if(Flg) break;
  }
  if(Flg) {printf("NO\n"); return 0;}
  for (unsigned i(1); i <= n; ++i) printf("%d ", N[i].Dis); putchar(0x0A);
  return Wild_Donkey;
}
```
