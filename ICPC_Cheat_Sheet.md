$$
\Huge{\text{ICPC    Cheat   Sheet}}\\
$$

$$
\large{\text{2024-11-01 By Micheal}}
$$

[TOC]

# Out of template

## Compile Command

```
g++ a.cpp -Wall -std=gnu++20 -O2 -o a
```

## RD

```cpp
inline unsigned RD() {
  unsigned intmp(0);
  char rdch(getchar());
  while (rdch < '0' || rdch > '9') rdch = getchar();
  while (rdch >= '0' && rdch <= '9')
    intmp = (intmp << 3) + (intmp << 1) + rdch - '0', rdch = getchar();
  return intmp;
}
inline int RDsg() {
  int rdtp(0), rdsg(1);
  char rdch(getchar());
  while ((rdch < '0' || rdch > '9') && (rdch != '-')) rdch = getchar();
  if (rdch == '-') rdsg = -1, rdch = getchar();
  while (rdch >= '0' && rdch <= '9')
    rdtp = (rdtp << 3) + (rdtp << 1) + rdch - '0', rdch = getchar();
  return rdtp * rdsg;
}
```

## cin

```cpp
ios::sync_with_stdio(false);
cin.tie(nullptr);
```

## include

```cpp
#include<bits/stdc++.h>
```

# Math

## Convolution

```cpp
const unsigned long long Mod(998244353);
unsigned W[21], IW[21];
inline void Init() {
  IW[20] = Pow(W[20] = Pow(3, 952), Mod - 2);
  for (unsigned i(20); i; --i)
    W[i - 1] = (unsigned long long)W[i] * W[i] % Mod;
  for (unsigned i(20); i; --i)
    IW[i - 1] = (unsigned long long)IW[i] * IW[i] % Mod;
}
```

```cpp
inline void DIT(unsigned *f, unsigned N) {
  for (unsigned i(1), I(1); !(i >> N); i <<= 1, ++I) {
    unsigned long long w(W[I]), Cur(1);
    for (unsigned j(0); !(j >> N); ++j, Cur = Cur * w % Mod)
      if (!(j & i)) {
        unsigned long long TmpA(f[j]), TmpB(f[j ^ i] * Cur % Mod);
        Mn(f[j] = TmpA + TmpB);
        Mn(f[j ^ i] = (Mod + TmpA - TmpB));
      }
  }
}
```

```cpp
inline void DIF(unsigned *f, unsigned N) {
  for (unsigned i(1 << (N - 1)), I(N); i; i >>= 1, --I) {
    unsigned long long w(IW[I]), Cur(1);
    for (unsigned j(0); !(j >> N); ++j, Cur = Cur * w % Mod)
      if (!(j & i)) {
        unsigned long long TmpA(f[j]), TmpB(f[j ^ i]);
        Mn(f[j] = TmpA + TmpB);
        f[j ^ i] = (Mod + TmpA - TmpB) * Cur % Mod;
      }
  }
}
```

```cpp
inline void Mul(unsigned *A, unsigned *B, unsigned Ln, unsigned Rn) {
  unsigned Len(Ln + Rn - 1), N(0);
  while ((1 << N) < Len) ++N;
  unsigned long long InvN(Pow(1 << N, Mod - 2));
  DIF(A, N), DIF(B, N);
  for (unsigned i((1 << N) - 1); ~i; --i)
    Tmp[i] = (unsigned long long)A[i] * B[i] % Mod;
  DIT(Tmp, N);
  for (unsigned i(0); i < Len; ++i) A[i] = A[i] * InvN % Mod;
}
```

## ExGCD

```cpp
long long Exgcd(long long x, long long y, long long &X, long long &Y) {
  if(y) {
    long long ExTmp(Exgcd(y, x % y, Y, X));
    Y -= X * (x/y);
    return tmp; 
  }
  X = 1, Y = 0;
  return x;
}
```

## Calculate Number Theory Inverse in Linear Time

```cpp
Inv[1] = 1;
Inv[i] = (Mod - Mod / i) * Inv[Mod % i] % Mod;
```

## Euler's Sieve

```cpp
bitset<100000005> Isnt;
for (unsigned i(2); i <= n; ++i) {
  if(!(Isnt[i])) Prime[++Cnt] = i;
  for (unsigned j(1); (Prime[j] * i < n) && (j <= Cnt); ++j) {
    Isnt[i * Prime[j]] = 1;
    if(!(i % Prime[j])) break;
  }
}
```

## Du's Sieve

$$
Sum(n) = \sum_{i = 1}^n f(i)\\
\sum_{i = 1}^n (g * f)(i) - \sum_{j = 2}^n g(j) Sum(\lfloor \frac nj \rfloor) = g(1)Sum(n)\\
$$

如果我们可以快速求出 $\displaystyle{\sum_{i = 1}^n (g * f)(i)}$, $\displaystyle{\sum_{i = 1}^n g(i)}$, 并且使用整除分块优化 $\displaystyle{\sum_{j = 2}^n g(j) Sum(\lfloor \frac nj \rfloor)}$, 那么就可以 $O(n^{\frac 34})$ 求出 $Sum(n)$.

如果我们用线性筛算出前 $i \leq n^{\frac 23}$ 的 $Sum(i)$, 然后再求解, 复杂度就会优化到 $O(n^{\frac 23})$.

- 求 $\mu$ 前缀和.

$g = I$, $f = \mu$. $\epsilon = \mu * I$.

```cpp
inline int CalcM(unsigned x) {
  if (x <= 10000000) return Mu[x]; //前缀和
  if (SMu.find(x) != SMu.end()) return SMu[x];
  int TmpS(1);
  for (unsigned L, R(1), Now; R < x; ) {
    L = R + 1, Now = x / L, R = x / Now;
    TmpS -= CalcM(Now) * (R - L + 1);
  }
  return SMu[x] = TmpS;
}
```

## 整除分块

- 求 $\phi$ 前缀和.

$$
2 \sum_{i = 1}^n \phi(i) - 1 = \sum_{d = 1}^n \lfloor \frac nd \rfloor^2 \mu(d)\\
$$

利用 $\mu$ 的前缀和直接求.

```cpp
long long TmpS(0), Now(0);
for (unsigned L, R(0); R < n; ) {
  L = R + 1, Now = n / L, R = n / Now;
  TmpS += Now * Now * (CalcM(R) - CalcM(L - 1));
}
return (TmpS + 1) >> 1;
```

## Powerful Number Seive

把所有质因数次数至少为 $2$ 的数字称为 Powerful Number, 可以表示为 $x = a^2b^3$, $b$ 中无平方因子. 则满足条件的数对 $(a, b)$ 和 $x$ 一一对应. 数量为 $O(\sqrt N)$.

求 $f$ 的前缀和, 构造 $g$, $h$, 使得 $f = g * h$, 且对于任意质数 $p$, 有 $g(p) = f(p)$, 且 $g$ 可以方便地求前缀和.

推论: 对于非 powerful number 的 $x$, $h(x) = 0$.

$$
\sum_{i = 1}^n f(i) = \sum_{j \in PN}^n h(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
h(p^c) = f(p^c) - \sum_{i = 1}^\alpha g(p^{i})h(p^{c - i}) \text{这行可能不需要}\\
$$

- 模板

求 $f(p^\alpha) = p^\alpha(p^\alpha - 1)$ 的前缀和.

构造 $g(x) = \phi(x)x$.

$g$ 前缀和使用线性筛优化的杜教筛 $O(n^{\frac 23})$ 求出.

递推求 $h$.

$$
\frac {h(p^{\alpha})}{p^\alpha} = \frac{h(p^{\alpha - 1})}{p^{\alpha - 1}} + p - 1\\
$$

用 DFS 枚举 powerful number.

```cpp
inline void DFS(unsigned Dep) {//Dep_th Prime
  if ((Dep > CntP) || ((n / Now) < (unsigned long long)Pri[Dep] * Pri[Dep])) {
    unsigned long long Cur(n / Now);
    Ans = (Ans + H * ((Cur <= m) ? G[Cur] : GM[n / Cur])) % Mod;
    return;
  }
  unsigned long long Cur(Pri[Dep]), PriP(1), LaH(H), HPA(0), LaN(Now);
  unsigned Poi(0);
  DFS(Dep + 1);
  while ((n / Now) >= Cur) {
    Now *= Pri[Dep], PriP *= Pri[Dep], ++Poi;
    H = LaH * (HPA * PriP % Mod) % Mod, HPA += Cur - 1;
    if (Poi ^ 1) DFS(Dep + 1);
  }
  H = LaH, Now = LaN;
  return;
}
DFS(1);
```

## 容斥反演式

$$
f(n) = \sum_{i = 0}^{n} \binom ni g(i) \Leftrightarrow g(n) = \sum_{i = 0}^{n} (-1)^{n - i} \binom ni f(i)\\
f(n) = \sum_{i = n}^{m} \binom in g(i) \Leftrightarrow g(n) = \sum_{i = n}^{m} (-1)^{n - i} \binom in f(i)\\
f(n) = \sum_{d|n} g(d) \Leftrightarrow g(n) = \sum_{d|n} \mu(d) f(\frac nd)\\
f(n) = \sum_{n|d} g(d) \Leftrightarrow g(n) = \sum_{n|d} \mu(\frac d n) f(d)\\
\mu * 1 = \epsilon
$$

恒等式: $\phi(i) = \sum_{j = 1}^{i} [gcd(i, j) = 1]$.

## Linear Basis

将 $2^i$ 预处理为 $Bin[i]$. (也可以不处理)

- 插入数字 A 到线性空间.

```cpp
A = RD();
for (unsigned j(50); ~j; --j) if (A & Bin[j]) {
  if (B[j]) A ^= B[j];
  else { B[j] = A; break; }
}
```

- 求线性空间 Max.

```cpp
for (unsigned i(50); ~i; --i) if ((B[i]) && (!(Ans & Bin[i]))) Ans ^= B[i];
```

- 求线性空间 Min.

即为基的最小元素.

- 第 k 小元素.

将基高斯消元. 然后二分查找即可.

# String

## Suffix Array

```cpp
unsigned n, t, A, B;
unsigned SA[2000005], RK[2000005], BucSize;
unsigned Tmp[(n + 1) << 1], Bucket[max((unsigned)256, n + 1)], Cnt(0), Cons(1);
char a[2000005];
```

```cpp
memset(RK, 0, (n + 1) << 3);
BucSize = 255;
memset(Bucket, 0, (BucSize + 1) << 2);
for (unsigned i(1); i <= n; ++i) ++Bucket[RK[i] = x[i]];
for (unsigned i(1); i <= BucSize; ++i) Bucket[i] += Bucket[i - 1];
for (unsigned i(1); i <= n; ++i) SA[Bucket[RK[i]]--] = i;
while (Cnt < n) {
  memset(Bucket, 0, (BucSize + 1) << 2);
  for (unsigned i(1); i <= n; ++i) ++Bucket[RK[i]];
  for (unsigned i(1); i <= BucSize; ++i) Bucket[i] += Bucket[i - 1];
  unsigned Top(0);
  for (unsigned i(n); i; --i) if(SA[i] > Cons) Tmp[++Top] = SA[i] - Cons;
  for (unsigned i(n - Cons + 1); i <= n; ++i) Tmp[++Top] = i;
  for (unsigned i(1); i <= n; ++i) SA[Bucket[RK[Tmp[i]]]--] = Tmp[i];
  memcpy(Tmp, RK, (n + 1) << 3);
  RK[SA[1]] = 1, Cnt = 1;
  for (unsigned i(2); i <= n; ++i)
    if((Tmp[SA[i]] ^ Tmp[SA[i - 1]]) || (Tmp[SA[i] + Cons] ^ Tmp[SA[i - 1] + Cons])) 
      RK[SA[i]] = ++Cnt;
    else RK[SA[i]] = Cnt;
  Cons <<= 1, BucSize = Cnt;
}
```

## Suffix Automaton

```cpp
unsigned m, n, Len;
char SPool[1100005], *S(SPool);
struct Node{
  Node *E[26], *Fail;
  unsigned Len;
  inline Node*Add(char c);
}N[2200005], *CntN(N);
inline Node* Node::Add(char c) { // Input the last Node, Return the next Node
  if(E[c]) {
    if(E[c]->Len == Len + 1) return E[c];
    Node* Copy(++CntN), *Back(this), *Ori(E[c]);
    *Copy = *E[c], Copy->Len = Len + 1, Ori->Fail = Copy;
    while (Back && (Back->E[c] == Ori)) Back->E[c] = Copy, Back = Back->Fail;
    return Copy;
  }
  Node*Cur(++CntN), *Back(this);
  Cur->Len = Len + 1;
  while (Back && (!Back->E[c])) Back->E[c] = Cur, Back = Back->Fail;
  if(!Back) {Cur->Fail = N; return Cur;}
  if(Back->E[c]->Len == Back->Len + 1) {Cur->Fail = Back->E[c]; return Cur;}
  Node*Copy(++CntN), *Ori(Back->E[c]);
  *Copy = *Ori, Copy->Len = Back->Len + 1;
  Cur->Fail = Ori->Fail = Copy;
  while (Back && (Back->E[c] == Ori)) Back->E[c] = Copy, Back = Back->Fail;
  return Cur;
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= m; ++i) {
    scanf("%s", S), Len = strlen(S);
    Node* Cur(N);
    for (unsigned j(0); j < Len; ++j) Cur = Cur->Add(S[j] - 'a');
    S = S + Len;
  }
  return Wild_Donkey;
}
```

## Palindrome Automaton

```cpp
struct Node {
  unsigned To[26];
  Node *Link;
  vector<Node *> Sons;
  unsigned Dep;
  int Len;
} N[500005], *CntN(N + 1), *Last(N + 1);
void Add(int Cur) {
  char c = a[Cur];
  Node *Jump(Last), *Nw;
  while (Jump->Len + 1 > Cur) Jump = Jump->Link;
  while (a[Cur - 1 - Jump->Len] != a[Cur]) Jump = Jump->Link;
  if (Jump->To[c] ^ 0xffffffff) Nw = N + Jump->To[c];
  else {
    Jump->To[c] = (Nw = ++CntN) - N, Nw->Len = Jump->Len + 2;
    Jump = Jump->Link;
    memset(Nw->To, 0xff, 104);
    while (Jump && (!((Jump->To[c] ^ 0xffffffff) &&
                      (a[Cur - Jump->Len - 1] == a[Cur]))))
      Jump = Jump->Link;
    if (!Jump) Nw->Link = N + 1;
    else Nw->Link = N + Jump->To[c];
    Nw->Dep = Nw->Link->Dep + 1;
  }
  Last = Nw;
}
```

```cpp
n = strlen(a), N[0].Len = -1;
N[1].Link = N, N[1].Len = 0;
memset(N[0].To, 0xff, 104);
memset(N[1].To, 0xff, 104);
for (unsigned i(0); i < n; ++i) Add(i);
```

# Graph

## Dinic

```cpp
int a[1005][1005];
unsigned c[205];
unsigned char b[1005][1005];
int C;
unsigned m, n, P;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node;
struct Edge {
  Node* To;
  unsigned Inv, Con;
};
struct Node {
  vector<Edge> E;
  unsigned Frm, Dep;
}N[205];
inline void Link (Node* x, Node* y, unsigned Val) {
  x->E.push_back({y, y->E.size(), Val});
  y->E.push_back({x, x->E.size() - 1, 0});
}
inline char BFS() {
  Node* Que[P + 2], **Hd(Que), **Tl(Que);
  for (Node* i(N + P + 1); i >= N; --i) i->Frm = 0, i->Dep = 0x3f3f3f3f;
  (*(++Hd) = N)->Dep = 0;
  while (Tl != Hd) {
    Node* Cur(*(++Tl));
    for (auto i:Cur->E) if((i.Con) && (i.To->Dep >= 0x3f3f3f3f)) 
      (*(++Hd) = i.To)->Dep = Cur->Dep + 1;
  }
  return N[P + 1].Dep < 0x3f3f3f3f;
}
inline unsigned DFS(Node* x, unsigned Come) {
  if(x == N + P + 1) return Come;
  unsigned Gone(0);
  for (unsigned &i(x->Frm); Come && (i < x->E.size()); ++i)
    if (x->E[i].Con && (x->E[i].To->Dep > x->Dep)) {
      unsigned Succ(DFS(x->E[i].To, min(Come, x->E[i].Con)));
      Come -= Succ, x->E[i].Con -= Succ;
      x->E[i].To->E[x->E[i].Inv].Con += Succ, Gone += Succ;
    }
  return Gone;
}
```

```cpp
Link(N, N + i, C); // Add Edges
while (BFS()) Tmp += DFS(N, 0x3f3f3f3f); //Tmp is Answer
```

## HLPP

```cpp
unsigned Hd(0), Tl(0), Gap[1205];
struct Node; 
struct Edge {
  Node *To;
  Edge *Nxt;
  unsigned Contain;
}E[240005], *CntE(E - 1);
struct Node {
  Edge *Fst;
  unsigned Dep, Contain;
}N[1205], *Qu[1205], *A, *B, *S, *T;
struct Que {
  Node *P;
  inline const char operator<(const Que &x) const {
    return this->P->Dep < x.P->Dep;
  }
};
priority_queue <Que> Q;
```

```cpp
for (register unsigned i(1); i <= m; ++i) {
  //A to B, value C
  if(A == B) continue;
  (++CntE)->Nxt = A->Fst, A->Fst = CntE;
  CntE->To = B, CntE->Contain = C;
  (++CntE)->Nxt = B->Fst, B->Fst = CntE;
  CntE->To = A, CntE->Contain = 0;
}
T->Dep = 1, Qu[++Tl] = T;
Node *x;
while(Hd < Tl) {
  x = Qu[++Hd];
  register Edge *Sid(x->Fst);
  while (Sid) {
    if((!(Sid->To->Dep)) && (!(Sid->Contain))) {
      ++Gap[Sid->To->Dep = x->Dep + 1];
      Qu[++Tl] = Sid->To;
    }
    Sid = Sid->Nxt;
  }
}
--Gap[S->Dep], ++Gap[S->Dep = n + 1];
Que Pu;
Edge *Sid(S->Fst);
while (Sid) {
  if(Sid->Contain) { 
    if(Sid->To != T && (!(Sid->To->Contain)))
      Pu.P = Sid->To, Q.push(Pu);
    Sid->To->Contain += Sid->Contain;
    (Sid + 1)->Contain = Sid->Contain;
    Sid->Contain = 0;
  }
  Sid = Sid->Nxt;
}
while(Q.size()) {
  x = (Q.top()).P, Q.pop();
  register unsigned Real;
  Sid = x->Fst, Tmp = 0x3f3f3f3f;
  while(Sid) {
    if(Sid->Contain) {
      if(Sid->To->Dep + 1 == x->Dep) {
        Real = min(x->Contain, Sid->Contain);
        if(!Real) {Sid = Sid->Nxt; continue;}
        x->Contain -= Real, Sid->Contain -= Real;
        E[(Sid - E) ^ 1].Contain += Real;
        if(Sid->To != S && Sid->To != T && (!(Sid->To->Contain)))
          Pu.P = Sid->To, Q.push(Pu);
        Sid->To->Contain += Real;
        if(!(x->Contain)) break;
      } else Tmp = min(Tmp, Sid->To->Dep);
    }
    Sid = Sid->Nxt;
  }
  if(x->Contain) {
    if(!(--Gap[x->Dep]))
      for (register unsigned i(1); i <= n; ++i)
        if(N + i != S && N + i != T && N[i].Dep > x->Dep) 
          N[i].Dep = n + 2;
    ++Gap[x->Dep = Tmp + 1];
    Pu.P = x, Q.push(Pu);
  }
}
printf("%u\n", T->Contain);
```

# Data structure

## Lichao Tree

```cpp
unsigned a[10005], l[10005], L[10005];
unsigned long long f[10005], N, D, Ans(0x3f3f3f3f3f3f3f3f);
unsigned m, n(0), C, t;
unsigned Cnt(0), Tmp(0);
struct Line { // y = Kx + B
  unsigned long long K, B;
  inline unsigned long long F(const unsigned long long y) const {return B + y * K;}
  inline const char Com (const Line &x, const unsigned long long y) const {
    return F(y) < x.F(y);
  }
}A;
struct Node {
  Node *LS, *RS;
  Line Val;
}T[100005], *CntT(T);
inline void Ins(Node* x, unsigned L, unsigned R) {//Insert Line A
  if(L == R) {if(A.Com(x->Val, L)) x->Val = A; return; }
  unsigned Mid((L + R) >> 1);
  if(A.Com(x->Val, Mid)) swap(x->Val, A);
  if(A.K > x->Val.K) {
    if(!(x->LS)) x->LS = ++CntT, x->LS->Val = x->Val, x->LS->LS = x->LS->RS = NULL;
    Ins(x->LS, L, Mid);
  } else {
    if(!x->RS) x->RS = ++CntT, x->RS->Val = x->Val, x->RS->LS = x->RS->RS = NULL;
    Ins(x->RS, Mid + 1, R);
  }
  return;
}
inline void Find(Node* x, unsigned L, unsigned R) { // Find f(C)
  D = min(D, x->Val.F(C));
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(C <= Mid) {if(x->LS) Find(x->LS, L, Mid);}
  else {if(x->RS) Find(x->RS, Mid + 1, R);}
}
```

##   Tree

下标从 $1$ 到 $n$.

```cpp
unsigned long long T[262144], Tag[262144];  //>= 2 (n + 2)
void Build() {
  for (unsigned i(N - 1); ~i; --i) T[i] = T[i << 1] + T[(i << 1) + 1];
}
void Edit(unsigned L, unsigned R, unsigned long long V) { //[L, R] += V;
  L = L - 1 + N, R = R + 1 + N;
  unsigned long long LLen(0), RLen(0);
  for (unsigned Len(1); L ^ R ^ 1; L >>= 1, R >>= 1, Len <<= 1) {
    T[L] += V * LLen, T[R] += V * RLen;
    if (!(L & 1)) Tag[L ^ 1] += V, LLen += Len;
    if (R & 1) Tag[R ^ 1] += V, RLen += Len;
  }
  while (L) T[L] += LLen * V, T[R] += RLen * V, L >>= 1, R >>= 1;
}
unsigned long long Qry(unsigned L, unsigned R) { // Qry Sum [L, R]
  L = L - 1 + N, R = R + 1 + N;
  unsigned long long Rt(0), LLen(0), RLen(0);
  for (unsigned Len(1); L ^ R ^ 1; L >>= 1, R >>= 1, Len <<= 1) {
    Rt += Tag[L] * LLen, Rt += Tag[R] * RLen;
    if (!(L & 1)) Rt += T[L ^ 1] + Tag[L ^ 1] * Len, LLen += Len;
    if (R & 1) Rt += T[R ^ 1] + Tag[R ^ 1] * Len, RLen += Len;
  }
  while (L) Rt += Tag[L] * LLen, Rt += Tag[R] * RLen, L >>= 1, R >>= 1;
  return Rt;
}
signed main() {
  n = RD(), N = 1;
  while (N < n + 2) N <<= 1;
  memset(T + N, N << 3, 0), memset(Tag, N << 4, 0);
  for (unsigned i(1); i <= n; ++i) T[N + i] = RD();
  Build();
}
```

## Link Cut Tree

- 0 Query: 查询 B, C 路径异或和, 保证联通

- 1 Link: 若 B, C 不连通, 则加边 B-C

- 2 Cut: 若存在 B-C 边, 断之

- 3 Change: 将 B 的权值修改为 C

Link: 若 B, C 未

```cpp
unsigned n, m;
unsigned A, B, C;
void *Stack[100005];
struct Node {
  Node *Son[2], *Fa;
  char Tag;
  unsigned Value, Sum;
  inline char RealFather() {
    return Fa && (Fa->Son[0] == this || Fa->Son[1] == this);
  }
  inline char Side() { return Fa->Son[1] == this; }
  void Update() {
    Sum = Value;
    if (Son[0]) Sum ^= Son[0]->Sum;
    if (Son[1]) Sum ^= Son[1]->Sum;
    return;
  }
  void Push_Down() {
    if (Tag) {
      Tag = 0, swap(Son[0], Son[1]);
      if (Son[0]) Son[0]->Tag ^= 1;
      if (Son[1]) Son[1]->Tag ^= 1;
    }
  }
  void Rotate() {
    Node *Father(Fa);
    char xSide(Side());
    if ((Fa = Father->Fa) && Father->RealFather()) Fa->Son[Father->Side()] = this;
    Father->Fa = this;
    if (Father->Son[xSide] = Son[xSide ^ 1]) Father->Son[xSide]->Fa = Father;
    Son[xSide ^ 1] = Father;
    Father->Update(), Update();
  }
  void Splay() {
    unsigned Head(0);
    Node *Cur(this);
    while (Cur->RealFather()) Stack[++Head] = Cur, Cur = Cur->Fa;
    Cur->Push_Down();
    if (!Head) return;
    for (unsigned i(Head); i; --i) ((Node *)Stack[i])->Push_Down();
    Cur = this;
    while (Cur->RealFather()) {
      if (Cur->Fa->RealFather())
        ((Cur->Side() ^ Cur->Fa->Side()) ? Cur : Cur->Fa)->Rotate();
      Cur->Rotate();
    }
  }
  void Access() {
    // printf("Access %u\n", this);
    Splay(), Son[1] = NULL, Update();  // Delete x's right son
    Node *Cur(this), *Father(Fa);
    while (Father) {
      Father->Splay(), Father->Son[1] = Cur;          // Change the right son
      Cur = Father, Father = Cur->Fa, Cur->Update();  // Go up
    }
    return Splay();
  }
  Node *Find_Root() {  // Find the root
    Access(), Push_Down();
    Node *Cur(this);
    while (Cur->Son[0]) Cur = Cur->Son[0], Cur->Push_Down();
    return Cur;
  }
} N[100005];
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) N[i].Value = N[i].Sum = RD();
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD();
    switch (A) {
      case 0: {                        // Query
        N[B].Access(), N[B].Tag ^= 1;  // Makeroot(B)
        N[C].Access();
        printf("%u\n", N[C].Sum);
        break;
      }
      case 1: {                        // Link
        N[B].Access(), N[B].Tag ^= 1;  // Makeroot(B)
        if (N[C].Find_Root() != N + B) N[B].Fa = N + C;
        break;
      }
      case 2: {                        // Cut
        N[B].Access(), N[B].Tag ^= 1;  // Makeroot(B)
        if (N[C].Find_Root() == N + B) {
          if (N[B].Fa == N + C && !(N[B].Son[1]))
            N[B].Fa = N[C].Son[0] = NULL, N[C].Update();
        }
        break;
      }
      case 3: {  // Change
        N[B].Splay(), N[B].Value = C, N[B].Update();
        break;
      }
    }
  }
  return Wild_Donkey;
}
```

## ST table

求区间最大值.

```cpp
unsigned ST[20][1000005], Lg2[1000005];
Lg2[0] = 0xffffffff;
for (unsigned i(1); i <= Cnt; ++i) Lg2[i] = Lg2[i >> 1] + 1;
for (unsigned i(1), I(2); I <= Cnt; ++i, I <<= 1) {
  for (unsigned j(1), J(j + (I >> 1)); j + I - 1 <= Cnt; ++j, ++J)
    ST[i][j] = max(ST[i - 1][j], ST[i - 1][J]);
}
unsigned Mx(unsigned x, unsigned y) {
  unsigned Del(Lg2[y - x + 1]);
  return max(ST[Del][x], ST[Del][y - (1 << Del) + 1]);
}
```

# DP

## wqs 二分

如果答案关于限制指标 $k$ 有凸性, 且 $k$ 是 dp 的状态. 则删掉这一维的限制, 可以求出凸函数的顶点.

这时修改转移方程, 改变 dp 数组的定义, 如: 每次 $k$ 增加 $1$ 就使 dp 值增加 $c$, 这时 dp 值关于 $k$ 的凸函数就相当于叠加了一个斜率为 $c$ 的一次函数, 斜率和顶点的位置相关. 为了得到特定的 $k$ 对应的答案, 二分 $c$, 约束顶点的 $k$ 符合询问要求即可.

```cpp
long long L(0), R(100000000), Mid, TmpD;
while (L < R) {
  TmpD = DP(Mid = ((L + R + 1) >> 1));
  if (TmpD < m)
    R = Mid - 1;
  else
    L = Mid;
}
DP(L), printf("%lld\n", f[N] - L * m);
```

## 决策单调性

当状态转移方程形如 $f_i = \min_{j = 0}^i w_{j, i}$ 时, 如果 $w$ 满足对于 $a \leq b \leq c \leq d$ 有 $w_{a, c} + w_{b, d} \leq w_{b, c} + w_{a, d}$, dp 具有决策单调性.

- 如果 $w_{i, j}$ 可以不依赖于 $f$ 快速求出, 则可以直接分治, 求 $f_{mid}$, 根据 $opt_{mid}$ 缩小左右两边决策范围.

```cpp
void Split(unsigned L, unsigned R, unsigned OpL, unsigned OpR) {
  if (R < L) return;
  unsigned Mid((L + R) >> 1), CurMn(2000000000), MnPos(0), Tmp;
  for (unsigned i(OpL); i <= OpR && i < Mid; ++i) {
    Tmp = Calc(i, Mid);
    if (Tmp <= CurMn) CurMn = Tmp, MnPos = i;
  }
  Ans = min(Ans, CurMn);
  Split(L, Mid - 1, OpL, MnPos);
  Split(Mid + 1, R, MnPos, OpR);
}
```

- 维护队列 $q$, 维护每个决策点作为最优决策的状态区间. 代码中队列元素的 `first` 是决策点, `second` 是决策点作为最优决策点的区间左端点, 且默认决策点小于状态.

```cpp
deque<pair<unsigned, unsigned> > Best;
Best.push_back({ 1, 2 });
for (unsigned i(2); i <= n; ++i) {
  while (Best.size() > 1)
    if (Best[1].second <= i) Best.pop_front();
    else break;
  Ans = min(Ans, Calc(Best.front().first, i));
  while (Best.size() && Best.back().second > i &&
    Calc(i, Best.back().second) <
    Calc(Best.back().first, Best.back().second))
    Best.pop_back();//i 优于 back
  if (Best.size()) {
    unsigned L(i + 1), R(n + 1), Mid;
    while (L < R) {
      Mid = ((L + R) >> 1);
      if (Calc(i, Mid) < Calc(Best.back().first, Mid)) R = Mid;
      else L = Mid + 1;
    }
    if(L == n + 1) ;//处理决策点 i 不会作为任何状态最优决策的情况.
    Best.push_back({ i, L });
  } else
    Best.push_back({ i, i + 1 });
}
```
