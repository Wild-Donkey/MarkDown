---
title: 省选日记 Day1~5
date: 2022-04-09 14:32
categories: Notes
tags:
  - Data_Structure
  - Segment_Tree
  - Binary_Search_on_Segment_Tree
  - Binary_Search
  - Binary_Indexed_Tree
  - Combinatorial_Mathematics
  - Factorial_Power
  - Stirling_Number
  - Hanging_Line_Method
  - General_Suffix_Automaton
  - Greatest_Common_Divisor
  - Mobius_Inversion
  - Inclusion_Exclusion_Principle
  - Sieve_Theory
  - Hash
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/MC13.png
---

# 省选日记 Day $1$ - Day $5$

## Day $1$ Apr 4, 2022, Monday

按照原计划, 今天省选, 而我于 $12$ 点起床, 因此错过了省选. (?)

由于疫情, 不知道需要等到 Day 多少才能省选了.

### [PrSl2020 冰火战士](https://www.luogu.com.cn/problem/P6619)

发现无论场地如何, 参赛者都是当前序列的一个前缀. 双方消耗的总能量即为两个前缀的总和的较小值. 发现只要温度相同, 则两个战士可以合并, 因为无论场地如何他们都同时上场或不上场.

因为温度上升可以使冰系前缀和增加, 使火系前缀和减少, 所以总能量随场地温度变化是单峰的. 我们可以二分温度使二者总和的差尽可能地小.

我们可以维护两个动态开点线段树, 分别将双方每个温度此时此刻的能量总和维护出来, 然后线段树上二分, 复杂度是 $O(q\log V)$.

为了方便二分, 我们把火系温度上调 $1$.

其实如果只查询消耗的最大能量, 一个普通的二分就可以解决, 但是我们要求的是最大温度, 这就很难受. 分两类讨论, 如果答案方案中 $ Ice < Fire$, 则我们对每个 $Mid$ 遇到 $Ice \leq Fire$ 就往右走, 最后单点时的位置一定是方案温度 $+1$. 如果答案方案中 $Ice \leq Fire$, 那么我们记录这个答案 $Ans$, 在火系上再二分一遍, 遇到 $Fire \geq Ans$ 就往右走, 最后一定可以得到最小的 $Fire < Ans$ 的点, 也就是方案温度 $+1$.

```cpp
struct Infor {
  unsigned x, y;
  char Ty;
}Tip[2000005];
struct Node {
  Node *LS, *RS;
  unsigned Val;
  inline void Add (unsigned L, unsigned R);
  inline void Del (unsigned L, unsigned R);
}N[20000005], *CntN(N + 1);
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Node::Add(unsigned L, unsigned R) {
  Val += B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) {if(!LS) LS = ++CntN; LS->Add(L, Mid);}
  else { if(!RS) RS = ++CntN; RS->Add(Mid + 1, R);}
}
inline void Node::Del(unsigned L, unsigned R) {
  Val -= B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->Del(L, Mid);
  else RS->Del(Mid + 1, R);
}
inline void Qry1(Node* x, Node* y, unsigned L, unsigned R) {
  if(L == R) {
    unsigned L1(min(A, B + (y ? y->Val : 0))), L0(min(A + (x ? x->Val : 0), B));
    if(L1 > L0) D = 1, Ans = L - 1, C = L1;
    else D = 0, Ans = L, C = L0;
    return;
  }
  unsigned Mid((L + R) >> 1), CurA(A), CurB(B);
  if(x && x->LS) CurA += x->LS->Val;
  if(y && y->RS) CurB += y->RS->Val;
  if(CurA <= CurB) A = CurA, Qry1(x ? x->RS : NULL, y ? y->RS : NULL, Mid + 1, R);
  else B = CurB, Qry1(x ? x->LS : NULL, y ? y->LS : NULL, L, Mid);
}
inline void Qry2(Node* x, unsigned L, unsigned R) {
  if(L == R) {Ans = L - 1; return;}
  unsigned Mid((L + R) >> 1), CurA(A + ((x && (x->RS)) ? (x->RS->Val) : 0));
  if(CurA < C) A = CurA, Qry2(x ? x->LS : NULL, L, Mid);
  else Qry2(x ? x->RS : NULL, Mid + 1, R);
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    if(RD() & 1) {
      C = Tip[i].Ty = RD(), A = Tip[i].x = (RD() + C), B = Tip[i].y = RD();
      (N + C)->Add(1, 2000000001);
    } else {
      C = Tip[D = RD()].Ty, A = Tip[D].x, B = Tip[D].y;
      (N + C)->Del(1, 2000000001);
    }
    A = B = C = Ans = 0;
    Qry1(N, N + 1, 1, 2000000001);
    if(!D) A = 0, Qry2(N + 1, 1, 2000000001);
    if(!C) printf("Peace\n");
    else printf("%u %u\n", Ans, C << 1);
  }
  return Wild_Donkey;
}
```

交上去发现 TLE 了一个点, 不过没有关系, 打开 `-O2` 之后最慢一个点连时限的一半都没跑到. 

为了不开 `-O2` 通过, 我们可以把两棵线段树合并成一棵, 节省不必要的浪费. 

```cpp
struct Infor {
  unsigned x, y;
  char Ty;
}Tip[2000005];
struct Node {
  Node *LS, *RS;
  unsigned ValI, ValF;
  inline void AddI (unsigned L, unsigned R);
  inline void AddF (unsigned L, unsigned R);
  inline void DelI (unsigned L, unsigned R);
  inline void DelF (unsigned L, unsigned R);
}N[19000005], *CntN(N);
unsigned n, A, B, C, D;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Node::AddI(unsigned L, unsigned R) {
  ValI += B; if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) {if(!LS) LS = ++CntN; LS->AddI(L, Mid);}
  else { if(!RS) RS = ++CntN; RS->AddI(Mid + 1, R);}
}
inline void Node::AddF(unsigned L, unsigned R) {
  ValF += B; if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) {if(!LS) LS = ++CntN; LS->AddF(L, Mid);}
  else { if(!RS) RS = ++CntN; RS->AddF(Mid + 1, R);}
}
inline void Node::DelI(unsigned L, unsigned R) {
  ValI -= B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->DelI(L, Mid);
  else RS->DelI(Mid + 1, R);
}
inline void Node::DelF(unsigned L, unsigned R) {
  ValF -= B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->DelF(L, Mid);
  else RS->DelF(Mid + 1, R);
}
inline void Qry1(Node* x, unsigned L, unsigned R) {
  if(L == R) {
    unsigned L1(min(A, B + (x ? x->ValF : 0))), L0(min(A + (x ? x->ValI : 0), B));
    if(L1 > L0) D = 1, C = L1;
    else D = 0, C = L0;
    Ans = L;
    return;
  }
  unsigned Mid((L + R) >> 1), CurA(A), CurB(B);
  if(x) {
    if(x->LS) CurA += x->LS->ValI;
    if(x->RS) CurB += x->RS->ValF;
  }
  if(CurA <= CurB) A = CurA, Qry1(x ? x->RS : NULL, Mid + 1, R);
  else B = CurB, Qry1(x ? x->LS : NULL, L, Mid);
}
inline void Qry2(Node* x, unsigned L, unsigned R) {
  if(L == R) {Ans = L; return;}
  unsigned Mid((L + R) >> 1), CurA(A + ((x && (x->RS)) ? (x->RS->ValF) : 0));
  if(CurA < C) A = CurA, Qry2(x ? x->LS : NULL, L, Mid);
  else Qry2(x ? x->RS : NULL, Mid + 1, R);
}
char buf[300000], *Top(buf + 300000),*P3(buf);
inline void pc(char c){
	if(P3==Top) fwrite(buf,1,300000,stdout),P3=buf;
	*(P3++)=c;
}
inline void print(unsigned x){
	if(!x){pc('0');return;}
	static char st[20],tp;
	while(x)st[++tp]=x%10,x/=10;
	while(tp)pc('0'+st[tp--]);
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    if(RD() & 1) {
      C = Tip[i].Ty = RD(), A = Tip[i].x = (RD() + C), B = Tip[i].y = RD();
      if(C) N->AddF(1, 2000000001);
      else N->AddI(1, 2000000001);
    } else {
      C = Tip[D = RD()].Ty, A = Tip[D].x, B = Tip[D].y;
      if(C) N->DelF(1, 2000000001);
      else N->DelI(1, 2000000001);
    }
    A = B = C = Ans = 0;
    Qry1(N, 1, 2000000001);
    if(!D) A = 0, Qry2(N, 1, 2000000001);
    if(!C) pc('P'), pc('e'), pc('a'), pc('c'), pc('e');
    else print(Ans - 1), pc(' '), print(C << 1);
    pc(0x0A);
  }
  fwrite(buf,1,P3 - buf,stdout);
  return Wild_Donkey;
}
```

缩起来以后做还是未遂. 不过我们发现, 这个问题没有强制在线, 我们把所有操作都离线然后然后离散化, 可以避免动态开点带来的不便.

```cpp
struct Infor {
  unsigned x, y;
  char Ty;
}Tip[2000005];
struct Node {
  Node *LS, *RS;
  unsigned ValI, ValF;
  inline void Build(unsigned L, unsigned R);
  inline void AddI (unsigned L, unsigned R);
  inline void AddF (unsigned L, unsigned R);
  inline void DelI (unsigned L, unsigned R);
  inline void DelF (unsigned L, unsigned R);
}N[4000005], *CntN(N);
unsigned Li[2000005], *CntL(Li);
unsigned n, m, A, B, C, D;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Node::Build(unsigned L, unsigned R) {
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  (LS = ++CntN)->Build(L, Mid);
  (RS = ++CntN)->Build(Mid + 1, R);
}
inline void Node::AddI(unsigned L, unsigned R) {
  ValI += B; if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->AddI(L, Mid);
  else RS->AddI(Mid + 1, R);
}
inline void Node::AddF(unsigned L, unsigned R) {
  ValF += B; if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->AddF(L, Mid);
  else RS->AddF(Mid + 1, R);
}
inline void Node::DelI(unsigned L, unsigned R) {
  ValI -= B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->DelI(L, Mid);
  else RS->DelI(Mid + 1, R);
}
inline void Node::DelF(unsigned L, unsigned R) {
  ValF -= B;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) LS->DelF(L, Mid);
  else RS->DelF(Mid + 1, R);
}
inline void Qry1(Node* x, unsigned L, unsigned R) {
  if(L == R) {
    unsigned L1(min(A, B + x->ValF)), L0(min(A + x->ValI, B));
    if(L1 > L0) D = 1, C = L1;
    else D = 0, C = L0;
    Ans = L;
    return;
  }
  unsigned Mid((L + R) >> 1), CurA(A), CurB(B);
  CurA += x->LS->ValI, CurB += x->RS->ValF;
  if(CurA <= CurB) A = CurA, Qry1(x->RS, Mid + 1, R);
  else B = CurB, Qry1(x->LS, L, Mid);
}
inline void Qry2(Node* x, unsigned L, unsigned R) {
  if(L == R) {Ans = L; return;}
  unsigned Mid((L + R) >> 1), CurA(A + x->RS->ValF);
  if(CurA < C) A = CurA, Qry2(x->LS, L, Mid);
  else Qry2(x->RS, Mid + 1, R);
}
char buf[300000], *Top(buf + 300000),*P3(buf);
inline void pc(char c){
	if(P3==Top) fwrite(buf,1,300000,stdout),P3=buf;
	*(P3++)=c;
}
inline void print(unsigned x){
	static char st[10],tp;
	while(x) st[++tp]=x%10, x/=10;
	while(tp)pc('0'+st[tp--]);
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    if(RD() & 1) C = Tip[i].Ty = RD(), *(CntL++) = Tip[i].x = (RD() + C), Tip[i].y = RD();
    else Tip[i] = Tip[D = RD()], Tip[i].Ty |= 2;
  }
  sort(Li, CntL), CntL = unique(Li, CntL), N->Build(1, m = CntL - Li);
  for (unsigned i(1); i <= n; ++i) {
    A = lower_bound(Li, CntL, Tip[i].x) - Li + 1, B = Tip[i].y;
    if(Tip[i].Ty & 2) {if(Tip[i].Ty & 1) N->DelF(1, m); else N->DelI(1, m);}
    else              {if(Tip[i].Ty) N->AddF(1, m);     else N->AddI(1, m);}
    A = B = C = Ans = 0;
    Qry1(N, 1, m);
    if(!D) A = 0, Qry2(N, 1, m);
    if(!C) pc('P'), pc('e'), pc('a'), pc('c'), pc('e');
    else print(Li[Ans - 1] - 1), pc(' '), print(C << 1);
    pc(0x0A);
  }
  fwrite(buf,1,P3 - buf,stdout);
  return Wild_Donkey;
}
```

去掉动态开点一身轻松, 但是却没有那么轻松, 因为排序是坏的, 所以反而更慢了. 重新审视需要进行的操作, 发现单点修改, 前后缀求和, 最后还是需要请出树状数组. 但是为了在树状数组上进行后缀和查询, 我们在单点 $y$ 增加 $x$ 时, 从 $1$ 坐标增加 $x$, 然后在坐标 $y + 1$ 减少 $x$, 就可以实现前缀和查到的是后缀和了.

```cpp
#define Lbt(x) ((x)&((~(x))+1))
struct Infor {
  unsigned x;
  int y;
  char Ty;
}Tip[2000005];
int Tree[2000005][2];
unsigned Li[2000005], *CntL(Li);
unsigned n, m, Lgm(0), C;
int A, B, D;
unsigned Cnt(0), Ans(0), Tmp(0);
char buf[300000], *Top(buf + 300000),*P3(buf);
inline void pc(char c){
	if(P3==Top) fwrite(buf,1,300000,stdout),P3=buf;
	*(P3++)=c;
}
inline void print(unsigned x){
	static char st[10],tp;
	while(x) st[++tp]=x%10, x/=10;
	while(tp)pc('0'+st[tp--]);
}
inline void ChgI(unsigned x) {while (x <= m) Tree[x][0] += B, x += Lbt(x);}
inline void ChgF(unsigned x) {while (x <= m) Tree[x][1] += B, x += Lbt(x);}
inline void Calc(unsigned x) {while (x) A += Tree[x][0], B += Tree[x][1], x -= Lbt(x);}
inline void Qry() {
  unsigned Cur;
  int TmA(0), TmB(0);
  for (unsigned i(Lgm); ~i; --i) if((Cur = Ans + (1 << i)) <= m) {
    TmA = A + Tree[Cur][0], TmB = B + Tree[Cur][1];
    if(TmA < TmB) Ans = Cur, A = TmA, B = TmB;
  }
  C = A, A = 0, B = 0, Calc(Ans + 1);
  if(B < C) return;
  Ans = 0, TmA = A = 0, C = B;
  for (unsigned i(Lgm); ~i; --i) if((Cur = Ans + (1 << i)) <= m) {
    TmA = A + Tree[Cur][1];
    if(TmA >= B) Ans = Cur, A = TmA;
  }
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    if(RD() & 1) C = Tip[i].Ty = RD(), *(CntL++) = Tip[i].x = (RD() + C), Tip[i].y = RD();
    else Tip[i] = Tip[RD()], Tip[i].y = -(Tip[i].y);
  }
  sort(Li, CntL), CntL = unique(Li, CntL), m = CntL - Li, Li[m] = Li[m - 1] + 1, ++m; 
  while ((1 << Lgm) <= m) ++Lgm; --Lgm;
  for (unsigned i(1); i <= n; ++i) {
    B = Tip[i].y;
    if(Tip[i].Ty) ChgF(1), B = -B, ChgF(lower_bound(Li, CntL, Tip[i].x) - Li + 1);
    else ChgI(lower_bound(Li, CntL, Tip[i].x) - Li + 1);
    A = B = D = Ans = 0, Qry();
    if(!C) pc('P'), pc('e'), pc('a'), pc('c'), pc('e');
    else print(Li[Ans] - 1), pc(' '), print(C << 1);
    pc(0x0A);
  }
  fwrite(buf,1,P3 - buf,stdout);
  return Wild_Donkey;
}
```

总算过了, 码量还减少了, 但是显然不如线段树好写.

## Day $2$ Apr 5, 2022, Tuesday

### [PrSl2020 组合数问题](https://www.luogu.com.cn/problem/P6620)

给定 $m$ 次多项式 $f(x) = \displaystyle\sum_{i = 0}^m a_ix^i$, 在模 $p$ 意义下求:

$$
\sum_{i = 0}^n f(i)c^i\binom ni
$$

注意到 $m$ 只有 $1000$, 可以尝试对每一项分别计算.

$$
\begin{aligned}
&\sum_{i = 0}^n f(i)c^i\binom ni\\
=&\sum_{j = 0}^m a_j\sum_{i = 0}^n i^jc^i\binom ni
\end{aligned}
$$

然后就不会了, 因为朋友说我没有学习前置知识根本无法正常解决这道题, 为我节省了不少精力.

现学了[下降幂相关知识](/Mathematics/Factorial_Power), 现在回来看这道题.

我们希望可以把 $f(x)$ 改成这样的形式:

$$
f(x) = \sum_{i = 0}^m b_ix^{\underline i}
$$

接下来用斯特林数知识求出新的系数序列 $b$, 我们知道:

$$
x^n = \sum_{i = 0}^n \left\{\begin{matrix}n\\i\end{matrix}\right\} x^{\underline i}
$$

其中 $\left\{\begin{matrix}a\\b\end{matrix}\right\}$ 是第二类斯特林数, 有递推式:

$$
\left\{\begin{matrix}a\\b\end{matrix}\right\} = b\left\{\begin{matrix}a - 1\\b\end{matrix}\right\} + \left\{\begin{matrix}a - 1\\b - 1\end{matrix}\right\}
$$

边界条件: $\left\{\begin{matrix}a\\0\end{matrix}\right\} = [a = 0]$.

因此可以推得 $O(m^2)$ 算系数的方法.

$$
\begin{aligned}
\sum_{i = 0}^m b_ix^{\underline i} &= \sum_{i = 0}^m a_ix^i\\
b_i &= \sum_{j = i}^m a_j\left\{\begin{matrix}j\\i\end{matrix}\right\}\\
\end{aligned}
$$

然后我们就可以拆成这样:

$$
\begin{aligned}
&\sum_{i = 0}^n f(i)c^i\binom ni\\
=&\sum_{j = 0}^m b_j\sum_{i = 0}^n i^{\underline j}c^i\binom ni
\end{aligned}
$$

把组合数拆成阶乘相乘除, 可以得到式子:

$$
b^{\underline x}\binom ab = a^{\underline x}\binom{a - x}{b - x}
$$

所以式子可以变成:

$$
\begin{aligned}
&\sum_{j = 0}^m b_j\sum_{i = 0}^n i^{\underline j}c^i\binom ni\\
= &\sum_{j = 0}^m b_j\sum_{i = 0}^n n^{\underline j}c^i\binom {n - j}{i - j}\\
= &\sum_{j = 0}^m n^{\underline j}b_j\sum_{i = 0}^n c^i\binom {n - j}{i - j}\\
= &\sum_{j = 0}^m n^{\underline j}b_j\sum_{i = j}^n c^i\binom {n - j}{i - j}\\
= &\sum_{j = 0}^m n^{\underline j}b_j\sum_{i = 0}^{n - j} c^{i + j}\binom {n - j}{i}\\
= &\sum_{j = 0}^m n^{\underline j}b_jc^j \sum_{i = 0}^{n - j} c^{i}\binom {n - j}{i}\\
\end{aligned}
$$

发现后面是一个二项式定理的形式, 也就是:

$$
(x + 1)^n = \sum_{i = 0}^n x^i\binom ni
$$

所以式子变成:

$$
\begin{aligned}
&\sum_{j = 0}^m n^{\underline j}b_jc^j \sum_{i = 0}^{n - j} c^{i}\binom {n - j}{i}\\
= &\sum_{j = 0}^m n^{\underline j}b_jc^j (c + 1)^{n - j}\\
\end{aligned}
$$

现在直接 $O(m)$ 求出答案即可, 由于只有简单的加减和乘法算术操作, 连逆元都不用求, 所以可以对任意模数取模.

```cpp
unsigned Str[1005][1005], a[1005], b[1005], C1P[1005], m, n;
unsigned long long C, Mod, Fac(1), CP(1), Ans(0);
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1); 
  while (y) {if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1;}
  return Rt;
}
signed main() {
  n = RD(), C = RD(), Mod = RD(), m = RD(), Str[0][0] = 1;
  for (unsigned i(0); i <= m; ++i) a[i] = RD();
  for (unsigned i(1); i <= m; ++i) {
    Str[i][0] = 0;
    for (unsigned long long j(1); j <= i; ++j)
      Str[i][j] = (j * Str[i - 1][j] + Str[i - 1][j - 1]) % Mod;
  }
  memset(b, 0, (m + 1) << 2);
  for (unsigned i(0); i <= m; ++i) for (unsigned j(i); j <= m; ++j)
    b[i] = (b[i] + (unsigned long long)a[j] * Str[j][i]) % Mod;
  C1P[m] = Pow(C + 1, n - m);
  for (unsigned i(m); i; --i) C1P[i - 1] = C1P[i] * (C + 1) % Mod;
  for (unsigned i(0); i <= m; ++i) {
    Ans = (Ans + (((CP * C1P[i] % Mod) * b[i] % Mod) * Fac)) % Mod;
    CP = CP * C % Mod, Fac = Fac * (n - i) % Mod;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

### 模拟赛又双叒叕爆大零

给一个 0/1 矩阵, 求面积 $\geq k$ 的全 $0$ 子矩阵数量.

首先想到 $O(n^2 \log^2 n)$ 的分治法:

分治, 仅计算跨过子问题中线的矩阵对答案的贡献, 我们对于每个中线, 设其长度为 $l$, $O(l^2)$ 地枚举子矩阵的两端, 然后 $O(\log t)$ 地二分找到这个范围分别最多可以向中线两侧延伸多长仍是全 $0$, 乘法统计答案即可.

但是显然 $2000$ 的数据不是为这个做法准备的.

然后听说有人做出了 $O(n^2)$ 的做法, 我十分的惊恐, 于是开始思考. 后面的故事就变成: 一场模拟赛就这样过去了.

其实我的做法可以做到 $O(n^2\log n)$, 只要对于每个块预处理上下左右第一个 $1$ 的位置, 然后用单调栈可以 $O(1)$ 得到当前区间的两端最长延伸长度. 这个复杂度也是能过的, 但是无论是代码难度还是优美程度再或者是评测机速度都驱使我去理解线性做法.

这需要引入一个东西叫做 "悬线法". 我们枚举一个下边界, 然后线性地找出每个纵坐标 $i$ 从这个下边界上面遇到的首个 $1$ 的高度, 记作 $H_i$. 用单调栈线性地找出每个 $i$ 左边第一个比它矮的 $Le_i$, 反着做一遍求出右边第一个比它矮的 $Rg_i$.

对于这个轮廓线 $H$, 我们竖着将上面凸起的部分计算子矩形上边界落在这里的贡献, 然后削平, 这样最多计算 $O(n)$ 次.

从左到右扫一遍, 每次我们对上边界完全在横坐标 $(Le_i, Rg_i)$, 纵坐标 $[\max(H_{Le_i}, H_{Rg_i}), H_i)$ 内的子矩阵统计贡献.

预处理数组 $Ava_{i, j}$ 表示高度为 $i$, 宽度为 $j$ 的全 $0$ 矩阵中, 下边界顶着底部, 面积不小于 $k$ 的子矩阵数量. 这样就可以 $O(1)$ 地查询下边界固定, 高度在某个范围内, 横坐标在某个范围内的矩形的贡献了.

```cpp
unsigned Ava[2005][2005];
short Lst[2005], Lf[2005], Rg[2005];
short Stk[2005], *STop(Stk);
bitset<2005> No;
unsigned long long Ans(0);
unsigned A, B, C, D, t, m, n, K;
signed main() {
  n = RD(), m = RD(), K = RD();
  for (unsigned i(1); i <= n; ++i) {
    unsigned Lim((K + i - 1) / i);
    for (unsigned j(Lim); j <= m; ++j)
      Ava[i][j] = Ava[i - 1][j] + (((j - Lim + 1) * (j - Lim + 2)) >> 1);
  }
  Lst[0] = Lst[m + 1] = 0x3f3f;
  for (short i(1); i <= n; ++i) {
    for (short j(1); j <= m; ++j) if(RD()) Lst[j] = i;
    No = 0;
    *(STop = Stk) = 0;
    for (short j(1); j <= m; ++j) {
      while (Lst[*STop] <= Lst[j]) {if(Lst[*STop] == Lst[j]) No[*STop] = 1; --STop;}
      Lf[j] = *STop, *(++STop) = j;
    }
    *(STop = Stk) = m + 1;
    for (short j(m); j; --j) {
      while (Lst[*STop] <= Lst[j]) --STop;
      Rg[j] = *STop, *(++STop) = j;
    }
    for (short j(1); j <= m; ++j) if(!No[j]) {
      short Low(min(i, min(Lst[Lf[j]], Lst[Rg[j]])) - Lst[j]), Del(i - Lst[j]), Wid(Rg[j] - Lf[j] - 1);
      Ans += Ava[Del][Wid] - Ava[Del - Low][Wid];
    }
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## Day $3$ Apr 6, 2022, Wednesday

### 模拟赛爆大零 (习惯了)

今天只看了 T2, 提前知道是 GSAM, 但是没有做出来, 其实离正解就差一点了.

给一系列串, 把它们的子串分到最少的集合里, 保证一个集合里面的串两两不包含也不相同.

我上来就建了一棵 GSAM, 然后卡了两个小时. 我遇到的问题是如何在 GSAM 上求一条最长的路径. 因为一个节点被不同的入边走进来之后它所代表的字符串集合是不同的. 如果是 $O(n^2)$ 的 ACAM, 我们可以轻松地求出这个长度, 因为它的一个节点对应的是一个串. 而 GSAM 的一个节点表示的是一堆串.

解决方案是这样的, 我们每次来到一个新的点, 都默认选择可以选择的所有串, 因为在没有选完所有我们可以选择的串之前离开这个点一定不如选完再离开优.

最后大力卡常过掉了此题.

```cpp
unsigned m, n, t, nn;
unsigned Cnt(0), Ans(0), Tmp(0);
char a[100005];
struct Node {
  vector<Node*> Son;
  Node* To[26], *Fa;
  unsigned Len;
}N[200005], *CntN(N), *Last(N);
vector<unsigned> M[200005];
unsigned Size[200005], Str[200005], List[200005], *LTop(List);
inline void Clr() {
  memset(N, 0, sizeof(Node) * (CntN - N + 1));
  memset(Size, 0, (nn + 1) << 2);
  memset(Str, 0, (nn + 1) << 2);
  memset(List, 0, (nn + 1) << 2);
  for (unsigned i(0); i <= nn; ++i) M[i].clear();
  n = RD(), Ans = 0, CntN = N, LTop = List; 
}
inline void Add(char x) {
  if (Last->To[x]) {
    if (Last->To[x]->Len == Last->Len + 1) { Last = Last->To[x]; return; }
    Node* Bfr(Last->To[x]), * Cur(++CntN);
    *Cur = *Bfr;
    Cur->Fa = Bfr->Fa, Bfr->Fa = Cur, Cur->Len = Last->Len + 1, Last = Last;
    while (Last && (Last->To[x] == Bfr)) Last->To[x] = Cur, Last = Last->Fa;
    Last = Cur; return;
  }
  Node* Cur(++CntN);
  Cur->Len = Last->Len + 1;
  while (Last && (!Last->To[x])) Last->To[x] = Cur, Last = Last->Fa;
  if (Last) {
    if (Last->To[x]->Len == Last->Len + 1) { Cur->Fa = Last->To[x], Last = Cur; return; }
    Node* Bfr(Last->To[x]), *Copy(++CntN);
    *Copy = *Bfr;
    Copy->Len = Last->Len + 1, Copy->Fa = Bfr->Fa, Bfr->Fa = Cur->Fa = Copy;
    while (Last && (Last->To[x] == Bfr)) Last->To[x] = Copy, Last = Last->Fa;
  }
  else Cur->Fa = N;
  Last = Cur;
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (unsigned i(1); i <= n; ++i) {
      memset(a, 0, m + 1), scanf("%s", a), m = strlen(a), Last = N;
      for (unsigned j(0); j < m; ++j) Add(a[j] - 'a'), ++Size[Last - N];
    }
    nn = CntN - N;
    for (Node* j(N); j <= CntN; ++j) for (unsigned k(0); k < 26; ++k) if(j->To[k])
      ++Str[j->To[k] - N], M[j - N].push_back(j->To[k] - N);
    for (Node* j(N + 1); j <= CntN; ++j) ++Str[j - N], M[j->Fa - N].push_back(j - N);
    unsigned *LBut(List);
    *(++LTop) = 0;
    while (LBut < LTop) {
      unsigned Cur(*(++LBut));
      for (auto i:M[Cur]) if(!(--(Str[i]))) *(++LTop) = i;
    }
    for (unsigned *i(LTop); i > List + 1; --i) Size[N[*i].Fa - N] += Size[*i];
    while (LTop > List + 1) {
      unsigned Cur(*(LTop--));
      unsigned &Mx(Str[Cur]);
      for (auto i:M[Cur]) Mx = max(Mx, Str[i] + Size[i] * (N[i].Len - N[Cur].Len));
    }
    for (unsigned i(0); i < 26; ++i) if(N->To[i]) Ans = max(Ans, Str[N->To[i] - N] + Size[N->To[i] - N] * N->To[i]->Len);
    printf("%llu\n", Ans);
  }
  return Wild_Donkey;
}
```

## Day $4$ Apr 7, 2022, Thursday

### [PrSl2020 魔法商店](https://www.luogu.com.cn/problem/P6621)

看出 $A$, $B$ 都是给出的 $n$ 条向量张成的线性空间的基.

$n$ 有 $1000$, 但是向量最多 $64$ 维, 所以线性相关的向量非常多是不可避免的. 同样地, 张成的线性空间一定是高达 $2^{64}$ 级别的, 因此基的数量也是十分可观的, 暴力枚举所有的基是不可行的.

很长时间没有头绪, 看了题解.

#### 拟阵

拟阵是一个数学结构, 它有一个定义是一个二元组 $(E, \mathcal{B})$, $E$ 是一个有限集合作为基础集, $E$ 所有基底组成的集族 $\mathcal{B}$.

对于 $A \in \mathcal{B}$, $B \in \mathcal{B}$. 假设 $x \in A$, $x \notin B$, 那么一定可以找到一个 $y \in B$, $y \notin A$, 使得 $A - x + y \in \mathcal{B}$.

不止是线性代数有这个结构. 在图论中, 一个无向连通图的边集就是 $E$, 它所有的生成树组成的集族就是 $\mathcal{B}$.

我们类比最小生成树来理解. 对于每个合法的基, 我们可以删除一个元素并且插入一个元素来得到一个新的基. 这个调整可以理解为将生成树的一条边删掉, 加入一条边来得到一棵新的生成树. 记和一个元素 $i$ 有边的集合为 $S_i$.

这道题的一个结论是对于 $x \in A$, $y \notin A$, 如果 $A$ 删除 $x$ 可以插入 $y$, 则从 $y$ 向 $x$ 连边表示 $y$ 的权值不小于 $x$ 的.

如果要求每棵生成树都不比规定的生成树大, 我们就需要让删一条边 $x$ 后能加的边 $y \in S_x$ 的权值都不比 $x$ 小. 正如我们要求在 $A$ 中删一个元素 $x$ 之后可以加的元素 $y \in S_x$ 权值都不比 $x$ 的小一样. 证明了这个条件的必要性.

交换 $y \notin A$, $x \in S_y$ 后, 会有一些连边情况发生变化. 这个变化的原因是 $y \oplus S_y = 0$, 因此 $x = (S_y - x) \oplus y$. 原本 $x$ 参与凑成的 $X = x \oplus (S_X - x)$, 一定有 $X \in S_x$, 需要 $X = (S_y - x) \oplus y \oplus (S_X - x)$ 凑成.

如果 $z \in ((S_y - x) \cap (S_X - x))$, 则原本 $(X,z)$ 的边会被删掉.

如果有 $z \in (S_y - x), z \notin (S_X - x)$, 则会增加一条边 $(X,z)$.

这个问题转化为是否可以找到一个方案, 使得一定能够以某种顺序将 $A$ 中的元素替换到任意基 $C$, 并且只交换已经连边的元素.

但是我们考虑先交换 $(x, y)$, 再交换 $(z, X)$ 的情况是否可以转化为只交换一开始连边的情况. 我们知道 $x \in S_X$, $z \in S_y$ 而 $z \notin S_X$. 所以我们交换 $(x, X)$ 不会对 $z$ 的连边产生任何影响. 

所以可以这样把本来不是一开始连边的交换方案转化为符合一开始的连边的交换方案. 所以权值满足我们的连边约束是充分条件. 综上, 是充要条件.

注意这里不可以认为只要是按连边交换就一定是基, 比如我们的基础集合是 $\{1,2,5,6,7\}$, 初始基为 $\{1,2,5\}$, 存在连边 $(2,6)$, $(5,7)$, 但是交换这两对元素得到的 $\{1,6,7\}$ 却不是一个合法的基底. ($1 \oplus 6 \oplus 7 = 0$)

#### 注

由于本题转化为的保序回归问题超出了本阶段我能掌握的范围. (注意是掌握) 学习该内容对本阶段的能力培养意义不高, 所以不予学习.

## Day $5$ Apr 8, 2022, Friday

### [CF1043F](https://codeforces.com/problemset/problem/1043/F)

模拟赛 T1 可以转化为这道题.

我场上的想法是 $O(Vn)$ 的, 记一个序列 $f_i$, 表示 Gcd 为 $i$ 的最小子集大小. 初始 $f$ 的所有位置都是 $\infin$, 按顺序考虑所有的数字 $x$, 一个个把它们插入 $f$, 插入的方式就是枚举 $f$ 中的每个数, 使得 $f_{Gcd(i, x)} = min(f_{Gcd(i, x)}, f_i + 1)$, 最后使得 $f_x = 1$.

我们发现在 $4000000$ 里面的所有数, 它们质因数之多有 $7$ 个, 因此集合大小最多是 $7$. 于是我们就枚举集合大小 $x$. 设 $f_i$ 表示有多少不同的大小为 $x$ 的集合的 Gcd 是 $i$ 的倍数. 这个很简单, 只要预处理每个数 $i$ 的倍数的个数 $Cnt_i$ 就可以了, 集合数为 $\binom {Cnt_i}{x}$. 为了方便, 对大于 $n$ 的质数 (如 $998244353$) 取模, 可以在错误率极小的前提下算出这个集合数量. 可以 $O(1)$ 求出这个集合数量.

对于 $f$ 序列, 我们对它进行容斥可以求出序列 $g$, 使得 $g_i$ 表示大小为 $x$ 的集合, Gcd 为 $i$ 的数量. 容斥系数显然是 $\mu$. 我们不需要算出所有的 $g$ 值, 只需要判断 $g_1$ 是否为 $0$ 即可.

$x$ 最多枚举到 $6$, 因为如果前 $6$ 个 $x$ 不行, 那么答案一定是 $7$. 计算一次 $g$ 是 $O(V)$ 的, 这个 $x$ 可以看成是 $\log V$, 如果我们肯对 $x$ 进行二分, 这个复杂度还能降到 $\log\log V$, 但是显然 $\log 6$ 和 $6$ 的差距不大, 所以可以认为是一个常数的差距.

前面的预处理计算 $Cnt$ 的时候有一个调和级数的复杂度, 也就是 $O(V\log V)$. 其它部分如求整个序列公因数的 $O(\log V)$, 线性筛 $\mu$ 的 $O(V)$, 预处理阶乘和阶乘的逆元 $O(V)$, 都不超过线性. 其实这道题的 $O(V \log V + n)$ 已经可以通过了, 但是发现我们求 $Cnt$ 的过程是一个狄利克雷前缀和, 这个东西相当于把每一个质数看成一维, 做高维前缀和, 均摊是 $O(V \log \log V)$ 的, 最后对 $x$ 二分, 总复杂度是 $O(V \log\log V)$.

接下来是 $O(V \log V)$ 的代码:

```cpp
const unsigned long long Mod(998244353);
bitset<4000005> No;
unsigned a[4000005], b[4000005], Fac[4000005], Inv[4000005], Mu[4000005];
unsigned Pri[1000005], CntP(0);
unsigned A, B(0), D, t, n;
unsigned Cnt(0), Ans(0), Tmp(0);
inline unsigned Gcd(unsigned x, unsigned y) {
  unsigned TmpG;
  while (y) { TmpG = x, x = y, y = TmpG % y; }
  return x;
}
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
inline unsigned C (unsigned x, unsigned y) {
  if(y > x) return 0;
  return ((unsigned long long)Fac[x] * Inv[y] % Mod) * Inv[x - y] % Mod;
}
signed main() {
  n = RD(), Mu[1] = Fac[0] = 1;
  for (unsigned i(1); i <= n; ++i) B = Gcd(a[i] = RD(), B);
  if(B ^ 1) {printf("-1\n"); return 0;}
  for (unsigned i(1); i <= n; ++i) b[a[i]] = 1;
  for (unsigned i(2); i <= 4000000; ++i) {
    if(!No[i]) Mu[Pri[++CntP] = i] = 998244352;
    for (unsigned j(1), k(2); (k * i <= 4000000) && (j <= CntP); k = Pri[++j]) {
      No[k * i] = 1;
      if(!(i % k)) {Mu[k * i] = 0; break;}
      Mu[k * i] = (unsigned long long)Mu[k] * Mu[i] % Mod;
    }
  }
  for (unsigned long long i(1); i <= 4000000; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[4000000] = Pow(Fac[4000000], 998244351);
  for (unsigned long long i(4000000); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  for (unsigned i(1); i <= 2000000; ++i)
    for (unsigned j(4000000 / i); j > 1; --j) b[i] += b[i * j];
  for (unsigned i(1); i <= 6; ++i) {
    Ans = 0;
    for (unsigned j(1); j <= 4000000; ++j) Ans = (Ans + (unsigned long long)Mu[j] * C(b[j], i)) % Mod;
    if(Ans ^ 0) {printf("%u\n", i); return 0;}
  }
  printf("7\n");
  return Wild_Donkey;
}
```

### 模拟赛爆大零 (好在我会两个 $O(n^2)$)

第二题有代表元容斥的感觉, 我们枚举第一个断的地方, 然后把问题转化为链上问题. 每个地方可断, 当且仅当它和上一个边界之间的数字集合相等. 我们每次枚举在哪里断开, 然后扫描左边界判断那些位置可以断, 直接统计数量即可做到 $O(n^2)$.

对于正解, 我们考虑合法的方案是如何的. 对于不切的时候, 我们单独考虑, 只要局面有解则不切永远都有一种合法方案. 对于至少切一刀的情况, 我们一定可以把环变成一些段, 这些段目标串和原串都具有相同的权值集合. 也就是说我们如果有一个多项式 $f(x, A, Pos) = Cnt_ix^i$ 表示 $A$ 序列前 $Pos$ 个元素的集合, 则每一对断点 $(a, b)$ 都满足 $f(x, S, b) - f(x, S, a) = f(x, T, b) - f(x, T, a)$, 可以转化为 $f(x, S, b) - f(x, T, b) = f(x, S, a) - f(x, T, a)$. 这时候我们取 $g(x, A, B, Pos) = f(x, A, Pos) - f(x, B, Pos)$, 就可以将式子简化为 $g(x, S, T, b) = g(x, S, T, a)$.

既然合法的方案需要满足对于断点集合 $Cut$ 的每对元素 $a \in Cut, b \in Cut$ 都满足 $g(x, S, T, b) = g(x, S, T, a) = G$, 那么我们不妨枚举 $G$. 对于 $g(x, S, T, a) = G$ 的 $a$, 都可以断或不断. 也就是说 $G$ 对答案的贡献为 $2^{\big|a|g(x, S, T, a) = G\big|}$. 发现对于每个 $G$, 一个点都不断的情况都会被统计, 所以我们将它减去, 也就是说答案是:

$$
[g(x, S, T, a) = 0] * (1 + \sum_G (2^{\big|a|g(x, S, T, a) = G\big|} - 1))
$$

我们用哈希值来代替多项式, 可以在极小出错率下方便地解决这个问题.

```cpp
const unsigned long long Mod(998244353);
unsigned long long Hash[1000005], Sum[1000005], Seed(1238476);
unordered_map<unsigned long long, unsigned> Map;
unsigned Two[1000005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Mn(unsigned &x) {x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Random() {
  return Seed = Seed * 998244353 + 19260817;
}
signed main() {
  n = RD(), Two[0] = 1;
  for (unsigned i(1); i <= 1000000; ++i) Hash[i] = Random();
  for (unsigned i(1); i <= n; ++i) Sum[i] += Hash[RD()];
  for (unsigned i(1); i <= n; ++i) Sum[i] -= Hash[RD()];
  for (unsigned i(1); i <= n; ++i) ++Map[Sum[i] += Sum[i - 1]];
  for (unsigned i(1); i <= n; ++i) Mn(Two[i] += (Two[i - 1] << 1));
  for (auto i:Map) Mn(Ans += Two[i.second]);
  Mn(Ans += (Mod - Map.size() + 1));
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```