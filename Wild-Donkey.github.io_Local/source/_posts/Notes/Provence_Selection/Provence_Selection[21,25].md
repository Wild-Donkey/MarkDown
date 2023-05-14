---
title: 省选日记 Day21~25
date: 2022-04-28 20:38
categories: Notes
tags:
  - Dynamic_Programming_on_Tree
  - Combinatorial_Mathematics
  - Knuth_Morris_Pratt_Algorithm
  - Inclusion_Exclusion_Principle
  - Lagrange_Polynomial
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/MC9.png
---

# 省选日记 Day $21$ - Day $25$

## Day $21$ Apr 24, 2022, Sunday

模拟赛发病了上来去搞 T3, 结果发现 T1, T2 都很简单.

### T1

给一棵边带权的 $n$ 个点的树. 与此同时, 有 $m$ 个互不相同的左部点, $m$ 个互不相同的右部点, 每个点可以出现在树上 $n$ 个点中任何一个点上. (树上一点可以存在多个左部点和右部点)

我们以每对点在树上距离总和最长为原则, 将左右部点配对. 求所有可能的分布情况, 按前面的原则配对之后, 每对点的距离总和的总和.

一开始在纠结已知分布情况的配对策略, 但是发现我们不需要关心具体是如何配对的, 只要按边考虑贡献即可.

一条边把树分成两个部分, 如果一个部分大小为 $x$, 有 $i$ 个左部点, $m - j$ 个右部点, 另一部分大小为 $n - x$, 有 $m - i$ 个左部点, $j$ 个右部点. 我们一定是尽可能让更多的点经过这条边, 防止每个部分内部的匹配, 因此贡献次数就是 $\min(i, j) + \min(m - i, m - j)$. 有 $x^{m - j + i}(n - x)^{m - i + j}\binom{m}{i}\binom{m}{j}$ 种情况可以造成这个贡献. 只要预处理所有 $x$ 和 $n - x$ 的每个次方, 枚举每条边和 $i$, $j$, 就可以 $O(n^3)$ 计算答案了.

接下来考虑优化, 重新审视我们的式子:

$$
x^{m - j + i}(n - x)^{m - i + j}\binom{m}{i}\binom{m}{j}\\
= (nx - x^2)^m x^{i - j}(n - x)^{j - i} \binom{m}{i}\binom{m}{j}\\
= (nx - x^2)^m (\frac{x}{n - x})^{i - j}\binom{m}{i}\binom{m}{j}
$$

贡献次数是对称的, 因此我们只要计算 $\min(i, j)(nx - x^2)^m (\frac{x}{n - x})^{i - j}\binom{m}{i}\binom{m}{j}$, 最后乘以 $2$ 即可.

我们可以把情况分为两种以去掉 $\min$, 也就是计算:

$$
2\sum_{i = 0}^m \sum_{j = i}^m i(nx - x^2)^m (\frac{x}{n - x})^{i - j}\binom{m}{i}\binom{m}{j}\\
+2\sum_{i = 0}^{m - 1} \sum_{j = i + 1}^m i(nx - x^2)^m (\frac{x}{n - x})^{j - i}\binom{m}{i}\binom{m}{j}\\
= 2(nx - x^2)^m\left(\sum_{i = 0}^m i\binom{m}{i}(\frac{x}{n - x})^i\sum_{j = i}^m (\frac{n - x}{x})^j\binom{m}{j} + \sum_{i = 0}^m i\binom{m}{i}(\frac{n - x}{x})^i\sum_{j = i}^m (\frac{x}{n - x})^j\binom{m}{j}\right)\\
$$

对每个 $x$ 进行计算时, 我们倒序枚举 $i$, 然后同时维护 $(\frac{n - x}{x})^j\binom{m}{j}$, $(\frac{x}{n - x})^j\binom{m}{j}$ 的后缀和.

```cpp
#define Inver(x) Pow(x,1000000005)
using namespace std;
const unsigned long long Mod(1000000007);
inline void Mn(unsigned long long& x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
unsigned C[2505][2505], *CC, m, n;
unsigned PreAns[2505];
unsigned A, B, D, t;
unsigned long long Ans(0);
struct Node {
  vector<pair<Node*, unsigned> > E;
  inline unsigned DFS(Node* Fa) {
    unsigned Size(1), Val(0);
    for (auto i:E) if((i.first) != Fa) Size += i.first->DFS(this); else Val = i.second;
    Ans = (Ans + (unsigned long long)PreAns[Size] * Val) % Mod;
    return Size;
  }
}N[2505];
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i < n; ++i) {
    A = RD(), B = RD(), D = RD();
    N[A].E.push_back({N + B, D});
    N[B].E.push_back({N + A, D});
  }
  for (unsigned i(0); i <= m; ++i) {
    C[i][0] = 1;
    for (unsigned j(1); j <= i; ++j) 
      C[i][j] = C[i - 1][j] + C[i - 1][j - 1], Mn(C[i][j]);
  }
  CC = C[m];
  for (unsigned i(1); i <= n; ++i) {
    unsigned long long CnC(i * Inver(n - i) % Mod), CnCI((n - i) * Inver(i) % Mod);
    unsigned long long CnCm(Pow(CnC, m)), CnCIm(Pow(CnCI, m));
    unsigned long long CnC2(Pow((unsigned long long)i * (n - i) % Mod, m));
    unsigned long long CnCPow(CnCm), CnCInv(CnCIm), SumAf(0); 
    for (unsigned j(m); ~j; --j) {
      SumAf = (SumAf + CnCInv * CC[j]) % Mod, CnCInv = CnCInv * CnC % Mod;
      PreAns[i] = (PreAns[i] + ((j * CnCPow % Mod) * (CC[j] % Mod) % Mod) * SumAf) % Mod;
      CnCPow = CnCPow * CnCI % Mod;
    }
    CnCPow = CnCm * CnCI % Mod, CnCInv = CnCIm * CnC % Mod, SumAf = CnCm * CC[m] % Mod;
    for (unsigned j(m - 1); ~j; --j) {
      PreAns[i] = (PreAns[i] + ((j * CnCInv % Mod) * (CC[j] % Mod) % Mod) * SumAf) % Mod;
      SumAf = (SumAf + CnCPow * CC[j]) % Mod;
      CnCPow = CnCPow * CnCI % Mod, CnCInv = CnCInv * CnC % Mod;
    }
    PreAns[i] = PreAns[i] * CnC2 % Mod;
  }
  N[1].DFS(NULL), Ans <<= 1, Mn(Ans);
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

### T2

这个题更简单, 从一个字符串环上删除连续的长度为 $x$ 一段, 得到一个新的环, 问是否可以使得这个新环不存在相邻的相同字符. 对每个 $x$ 回答这个询问.

首先删除连续的一段就是留下连续的一段, 所以我们要找的就是一个长度为 $x$ 的子串, 它里面不能有相邻的相同字符, 并且首尾不能相同.

我们需要找到原来环上相邻相同的字符, 在这些位置断开, 把这个环断成一些段.

现在假设一定有一个位置断开, 这样我们对每一段分别处理即可. 如果长度为 $Len$ 的一段里面不能找到一个长度为 $x$ 的符合要求的子串, 那么一定是所有长度为 $x$ 的子串首尾都相同, 它的充要条件是这一段字符串长度为 $Len - x + 1$ 的前缀等于它长度为 $Len - x + 1$ 的后缀.

找到一段的所有相等的前缀和后缀的方法很简单, 只要跑 KMP, 然后跳 Border 即可, 除了这些 $x$ 不能得到, 其它长度的合法子串都能找到.

最后考虑特殊情况, 也就是没法断开的情况. 我们需要考虑这个环的所有子串, 因此将环在任意位置断开, 然后复制一遍, 仍然跑 KMP 即可.

```cpp
bitset<10000005> OK;
unsigned Bd[5000005];
char a[10000005];
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Clr() {
  memset(a, 0, (n << 1) + 1);
  for (unsigned i(1); i <= (n << 1); ++i) OK[i] = 0;
}
inline void KMP(char* x, unsigned y) {
  if(y <= 1) return;
  Bd[1] = 0;
  for (unsigned i(2); i <= y; ++i) {
    unsigned Jump(Bd[i - 1]);
    while (Jump && (x[Jump + 1] ^ x[i])) Jump = Bd[Jump];
    if(x[Jump + 1] == x[i]) Bd[i] = Jump + 1;
    else Bd[i] = 0;
  }
  unsigned Len(Bd[y]), Cur(2);
  while (Len) {
    while (Cur <= y - Len) OK[Cur++] = 1; ++Cur;
    Len = Bd[Len];
  }
  while (Cur <= y) OK[Cur++] = 1;
}
signed main() {
  while(scanf("%s", a + 1) == 1) {
    n = strlen(a + 1), a[n + 1] = a[1];
    vector<unsigned> Cut;
    for (unsigned i(1); i <= n; ++i) if(a[i] == a[i + 1]) Cut.push_back(i);
    if(!(Cut.size())) memcpy(a + n + 1, a + 1, n), KMP(a, n << 1);
    else {
      Cut.push_back(Cut[0] + n);
      memcpy(a + n + 1, a + 1, Cut[0]);
      unsigned Len(Cut.size() - 1);
      for (unsigned i(0); i < Len; ++i) KMP(a + Cut[i], Cut[i + 1] - Cut[i]);
    }
    for (unsigned i(n); i; --i) putchar(OK[i] + '0'); putchar(0x0A);
    Clr();
  }
  return Wild_Donkey;
}
```

## Day $22$ Apr 25, 2022, Monday

没打模拟赛, 补了补题, 颓了颓.

## Day $23$ Apr 26, 2022, Tuesday

### [PrSl2022 填树](https://www.luogu.com.cn/problem/P8290)

[场上](/Notes/Provence_Selection/Provence_Selection%5B11,15%5D)的 $O(Vn)$ 确实拿到了 $40'$.

正解需要离散化值域, 然后考虑范围边界在关键值之间时的变化.

## Day $24$ Apr 27, 2022, Wednesday

接昨天.

我们发现, 对于一个区间的方案数, 就是对于每一条路径, 把每个节点的方案数乘起来, 最后统统加和. 每个点可能的取值数量是关于区间左端点的分段一次函数, 因此方案数也就是关于区间左端点的分段 $n$ 次函数.

因为每个点的一次函数最多分 $5$ 段, 有四个分界点, 那么所有点的分界点最多就有 $4n$ 个, 最多分为 $4n + 1$ 段. 我们可以 $O(n)$ 地求一个点值, 对于每一段求 $n$ 个点值, 也就是 $O(n^2)$. 最后可以通过拉格朗日插值法 $O(n^2)$ 求出一段的多项式. 但是我们要求的是这个多项式的前缀和, 多项式的前缀和一定是一个比原来高一次的多项式, 因此我们只要 $O(n^2)$ 求出新的多项式的前 $O(n)$ 项然后插出来直接 $O(n)$ 求出的点值就是原多项式的前缀和.

总复杂度 $O(n^3)$.

接下来考虑第二问, 每个点的贡献就是包含它的每一条路径除它以外的点的方案数相乘然后乘上这个点所有可能的取值, 相当于一堆 $O(n)$ 次的分段多项式乘以一个二次的分段多项式, 所有方案权值总和也就是关于左端点的, 比第一问高一维的多项式, 所以同样方式求即可.

## Day $25$ Apr 28, 2022, Thursday

接上一天.

```cpp
const unsigned long long Mod(1000000007);
inline void Mn(unsigned &x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned long long &x) {x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Inv(unsigned long long x) {
  unsigned y(1000000005);
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
unsigned FrTo(unsigned long long x, unsigned long long y) {return (((x + y) * (y - x + 1)) >> 1) % Mod;}
unsigned a[405], b[805], Dot[2][205], Coe[205];
unsigned n, m, Cnt(0), Cond(0), A, B, Mx;
unsigned long long ClT[2], Tmp[2], Ans[2];
struct Node {
  vector<Node*> E;
  unsigned long long f, g;
  unsigned Lim[2];
  inline void DFS(Node* Fa) {
    unsigned L(max(Lim[0], A)), R(min(Lim[1], B));
    unsigned long long T1(R - L + 1), T2(FrTo(L, R));
    for (auto i:E) if(i != Fa) i->DFS(this);
    if(L > R) {f = g = 0; return;}
    Mn(ClT[0] += (f = T1)), Mn(ClT[1] += (g = T2));
    for (auto i:E) if(i != Fa) {
      ClT[0] = (ClT[0] + i->f * f) % Mod;
      ClT[1] = (ClT[1] + i->g * f + i->f * g) % Mod;
      f = (f + i->f * T1) % Mod, g = (g + i->f * T2 + T1 * i->g) % Mod;
    }
  }
}N[205];
inline unsigned long long Qry(unsigned* x, unsigned y, unsigned Len) {
  unsigned long long Rt(x[Len]);
  for (unsigned i(Len - 1); ~i; --i) Rt = (x[i] + Rt * y) % Mod;
  return Rt;
}
inline void Lagrange(unsigned* x, unsigned* y, unsigned Len) {
  unsigned long long F[Len + 2];
  memset(y, 0, (Len + 1) << 2), memset(F, 0, (Len + 2) << 3), F[1] = 1;
  for (unsigned i(1); i <= Len; ++i) for (unsigned j(i + 1); j; --j)
    F[j] = (F[j] * (Mod - i) + F[j - 1]) % Mod;
  for (unsigned i(0); i <= Len; ++i) {
    unsigned long long Mul(Inv(x[i])), Lst(F[Len + 1]);
    for (unsigned j(0); j <= Len; ++j) if(i ^ j) Mul = Mul * (i + Mod - j) % Mod;
    Mul = Inv(Mul);
    for (unsigned j(Len); ~j; --j)
      y[j] = (y[j] + Lst * Mul) % Mod, Lst = (F[j] + Lst * i) % Mod;
  }
}
inline void Calc(unsigned x, unsigned L, unsigned R) {
  if(R < L) return;
  if(R <= n + 2 + L) {
    ClT[0] = ClT[1] = 0;
    for (A = L; A <= R; ++A) B = A + x, N[1].DFS(NULL);
    Mn(Tmp[0] += ClT[0]), Mn(Tmp[1] += ClT[1]);
    return;
  }
  for (unsigned i(0); i <= n + 2; ++i) {
    ClT[0] = ClT[1] = 0, A = L + i, B = A + x, N[1].DFS(NULL);
    Dot[0][i] = ClT[0], Dot[1][i] = ClT[1];
  }
  for (unsigned i(1); i <= n + 1; ++i) Mn(Dot[0][i] += Dot[0][i - 1]);
  Lagrange(Dot[0], Coe, n + 1), Mn(Tmp[0] += Qry(Coe, R - L, n + 1));
  for (unsigned i(1); i <= n + 2; ++i) Mn(Dot[1][i] += Dot[1][i - 1]);
  Lagrange(Dot[1], Coe, n + 2), Mn(Tmp[1] += Qry(Coe, R - L, n + 2));
}
inline void Solve(unsigned x, unsigned L, unsigned R) {
  unsigned Nc(Cnt);
  for (unsigned i(Cnt); i && (a[i] >= x); --i) b[++Nc] = a[i] - x;
  memcpy(b + 1, a + 1, Cnt << 2), sort(b + 1, b + Nc + 1), Nc = unique(b + 1, b + Nc + 1) - b - 1;
  if(b[1]) Calc(x, L, b[1] - 1);
  for (unsigned i(1); i < Nc; ++i) Calc(x, b[i], b[i + 1] - 1);
  Calc(x, b[Nc], R);
}
int main() {
  n = RD(), m = RD(), Cnt = (n << 1);
  for (unsigned i(1); i <= n; ++i)
    a[(i << 1) - 1] = N[i].Lim[0] = RD(), a[i << 1] = (N[i].Lim[1] = RD()) + 1;
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  sort(a + 1, a + Cnt + 1), Cnt = unique(a + 1, a + Cnt + 1) - a - 1, m = min(m, Mx = a[Cnt]);
  Tmp[1] = Tmp[0] = 0, Solve(m, 1, Mx - m), Mn(Ans[0] += Tmp[0]), Mn(Ans[1] += Tmp[1]);
  Tmp[1] = Tmp[0] = 0, Solve(m - 1, 2, Mx - m), Mn(Ans[0] += Mod - Tmp[0]), Mn(Ans[1] += Mod - Tmp[1]);
  printf("%llu\n%llu\n", Ans[0], Ans[1]);
}
```

我们可以不求出系数, 直接求我们需要的点值.

```cpp
const unsigned long long Mod(1000000007);
inline void Mn(unsigned &x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned long long &x) {x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Inv(unsigned long long x) {
  unsigned y(1000000005);
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
unsigned FrTo(unsigned long long x, unsigned long long y) {return (((x + y) * (y - x + 1)) >> 1) % Mod;}
unsigned a[405], b[805], Dot[2][205];
unsigned n, m, Cnt(0), Cond(0), A, B, Mx;
unsigned long long ClT[2], Tmp[2], Ans[2];
struct Node {
  vector<Node*> E;
  unsigned long long f, g;
  unsigned Lim[2];
  inline void DFS(Node* Fa) {
    unsigned L(max(Lim[0], A)), R(min(Lim[1], B));
    unsigned long long T1(R - L + 1), T2(FrTo(L, R));
    for (auto i:E) if(i != Fa) i->DFS(this);
    if(L > R) {f = g = 0; return;}
    Mn(ClT[0] += (f = T1)), Mn(ClT[1] += (g = T2));
    for (auto i:E) if(i != Fa) {
      ClT[0] = (ClT[0] + i->f * f) % Mod;
      ClT[1] = (ClT[1] + i->g * f + i->f * g) % Mod;
      f = (f + i->f * T1) % Mod, g = (g + i->f * T2 + T1 * i->g) % Mod;
    }
  }
}N[205];
inline unsigned long long Lagrange(unsigned* x, unsigned Len, unsigned Qry) {
  unsigned long long F(1), SumI(0);
  for (unsigned i(0); i <= Len; ++i) F = F * (Qry + Mod - i) % Mod;
  for (unsigned i(0); i <= Len; ++i) {
    unsigned long long Mul(Inv(x[i]) * (Qry + Mod - i) % Mod);
    for (unsigned j(0); j <= Len; ++j) if(i ^ j) Mul = Mul * (i + Mod - j) % Mod;
    Mn(SumI += Inv(Mul));
  }
  return F * SumI % Mod;
}
inline void Calc(unsigned x, unsigned L, unsigned R) {
  if(R < L) return;
  if(R <= n + 2 + L) {
    ClT[0] = ClT[1] = 0;
    for (A = L; A <= R; ++A) B = A + x, N[1].DFS(NULL);
    Mn(Tmp[0] += ClT[0]), Mn(Tmp[1] += ClT[1]);
    return;
  }
  for (unsigned i(0); i <= n + 2; ++i) {
    ClT[0] = ClT[1] = 0, A = L + i, B = A + x, N[1].DFS(NULL);
    Dot[0][i] = ClT[0], Dot[1][i] = ClT[1];
  }
  for (unsigned i(1); i <= n + 1; ++i) Mn(Dot[0][i] += Dot[0][i - 1]);
  Mn(Tmp[0] += Lagrange(Dot[0], n + 1, R - L));
  for (unsigned i(1); i <= n + 2; ++i) Mn(Dot[1][i] += Dot[1][i - 1]);
  Mn(Tmp[1] += Lagrange(Dot[1], n + 2, R - L));
}
inline void Solve(unsigned x, unsigned L, unsigned R) {
  unsigned Nc(Cnt);
  for (unsigned i(Cnt); i && (a[i] >= x); --i) b[++Nc] = a[i] - x;
  memcpy(b + 1, a + 1, Cnt << 2), sort(b + 1, b + Nc + 1), Nc = unique(b + 1, b + Nc + 1) - b - 1;
  if(b[1]) Calc(x, L, b[1] - 1);
  for (unsigned i(1); i < Nc; ++i) Calc(x, b[i], b[i + 1] - 1);
  Calc(x, b[Nc], R);
}
int main() {
  n = RD(), m = RD(), Cnt = (n << 1);
  for (unsigned i(1); i <= n; ++i)
    a[(i << 1) - 1] = N[i].Lim[0] = RD(), a[i << 1] = (N[i].Lim[1] = RD()) + 1;
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  sort(a + 1, a + Cnt + 1), Cnt = unique(a + 1, a + Cnt + 1) - a - 1, m = min(m, Mx = a[Cnt]);
  Tmp[1] = Tmp[0] = 0, Solve(m, 1, Mx - m), Mn(Ans[0] += Tmp[0]), Mn(Ans[1] += Tmp[1]);
  Tmp[1] = Tmp[0] = 0, Solve(m - 1, 2, Mx - m), Mn(Ans[0] += Mod - Tmp[0]), Mn(Ans[1] += Mod - Tmp[1]);
  printf("%llu\n%llu\n", Ans[0], Ans[1]);
}
```