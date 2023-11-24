$$
\Huge{\text{ICPC~Cheat~Sheet}}\\
$$

$$
\large{\text{2023-11-24 By Micheal}}
$$

$$
\text{Before ICPC2023 Hefei}
$$

# Compile Command

```
g++ a.cpp -Wall -std=gnu++20 -O2 -o a
```

# Convolution

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

# Suffix Array

```cpp
unsigned n, t, A, B;
unsigned SA[2000005], RK[2000005], BucSize;
unsigned Tmp[(n + 1) << 1], Bucket[max((unsigned)256, n + 1)], Cnt(0), Cons(1);
char a[2000005];

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

# Suffix Automaton

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

# Max Flow

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

Link(N, N + i, C); // Add Edges
while (BFS()) Tmp += DFS(N, 0x3f3f3f3f);
//Tmp is Answer
```

# ExGCD

```cpp
long long Exgcd(long long x, long long y, long long &X, long long &Y) {
  if(y) {
    long long ExTmp(Exgcd(y, x % y, Y, X));
    Y -= X * (x/y);
    return tmp; 
  }
  X = 1;
  Y = 0;
  return x;
}
```

# Calculate Number Theory Inverse in Linear Time

```cpp
Inv[1] = 1;
Inv[i] = (Mod - Mod / i) * Inv[Mod % i] % Mod;
```

# Lichao Tree

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