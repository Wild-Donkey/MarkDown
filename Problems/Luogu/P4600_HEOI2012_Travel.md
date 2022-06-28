# HEOI2012 旅行问题

这题没有必要用树剖呀，这里有一篇线段树的题解。

## 题意简述

给 $n$ 个字符串，每个询问在这些字符串中选两个前缀，要求输出它们满足要求的公共后缀的哈希值。这个公共后缀必须在给出的 $n$ 个字符串的前缀中出现，并且要求尽可能长。

## 思路

对给出的字符串建立 AC 自动机。

发现每个前缀都对应着确定的节点，而每个节点一定能代表一个出现过的前缀。只要在构造时将每个前缀对应的哈希值存到对应节点上，这样问题就从找一个前缀的哈希值变成了找一个节点了。

发现每个节点在后缀链接树上的祖先就是它最长的非自身的后缀。也就是说两个前缀的节点在后缀链接树上的公共祖先就是他们的公共后缀，而满足条件的最长后缀就是他们的最近公共祖先。

所以本题就是构造 AC 自动机然后在后缀链接树上求 LCA。

### 查询 LCA

最终代码使用了线段树在欧拉序上查询区间最浅点，没有使用树链剖分（因为我不会）

### 防止误导，先放 AC 代码

由于本题空间卡得比较紧，所以我选择在后面放出优化过程。

```cpp
const unsigned MOD(1000000007);
const char _0(0), _26(26);
unsigned Nn, CntS(0), Len, m, n, Cnt(0), A, B, C, D, FindL, FindR, t, Ans(0), Tmp[2000005];
char b, Addx;
struct Node {
  unsigned Dep, Hash, DFSr, SubDFSr, To[26], Fa, Fail, Son, Bro;
}N[1000005], *CntN(N), *Now(N);
struct Sg {
  unsigned LS, RS, Val;
}S[4000005];
void Qry(Sg *x, unsigned L, unsigned R) {
  if((FindL <= L) && (R <= FindR)) {
    if(Now->Dep > N[x->Val].Dep) Now = N + x->Val; 
    return; 
  }
  register unsigned Mid((L + R) >> 1);
  if(Mid >= FindL) Qry(S + x->LS, L, Mid);
  if(Mid < FindR) Qry(S + x->RS, Mid + 1, R);
}
void BuildSg(Sg *x, unsigned L, unsigned R) {
  if(L == R) {x->Val = Tmp[L];return;}
  register unsigned Mid((L + R) >> 1);
  BuildSg(S + (x->LS = ++CntS), L, Mid);
  BuildSg(S + (x->RS = ++CntS), Mid + 1, R);
  if(N[S[x->LS].Val].Dep < N[S[x->RS].Val].Dep) x->Val = S[x->LS].Val;
  else x->Val = S[x->RS].Val;
}
unsigned Pool[20000005], *Pos[1000005], Top(0);
struct Quu {
  unsigned P; char Chr;
}TmpQ;
queue<Quu> Q;
void Add() {
  if(!Now->To[Addx]) Now->To[Addx] = ++CntN - N, CntN->Fa = Now - N, CntN->Son = 0x3f3f3f40;
  N[Now->To[Addx]].Hash = (((unsigned long long)26 * Now->Hash) + Addx) % MOD, Now = N + Now->To[Addx];
}
void Build() {
  TmpQ.P = 0;
  Q.push(TmpQ);
  register Node *x, *Back;
  register char c; 
  while (Q.size()) {
    TmpQ = Q.front(), Q.pop();
    x = N + TmpQ.P, c = TmpQ.Chr;
    if(x->Fa < 0x3f3f3f3f) {
      Back = N + N[x->Fa].Fail;
      while (Back < N + 0x3f3f3f3f) {
        if(Back->To[c]) {
          x->Fail = Back->To[c];
          x->Bro = N[Back->To[c]].Son;
          N[Back->To[c]].Son = x - N;
          break; 
        }
        Back = N + Back->Fail;
      }
      if(!(x->Fail)) {
        x->Fail = 0;
        x->Bro = N->Son;
        N->Son = x - N;
      }
    }
    for (register char i(_0); i < _26; ++i) if(x->To[i]) TmpQ.P = x->To[i], TmpQ.Chr = i, Q.push(TmpQ);
  }
}
void DFS(Node *x) {
  Tmp[++Cnt] = x - N, x->DFSr = Cnt;
  register Node *So(N + x->Son);
  while (So < N + 0x3f3f3f3f) So->Dep = x->Dep + 1, DFS(So), So = N + So->Bro;
  Tmp[++Cnt] = x - N, x->SubDFSr = Cnt;
  return;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    while ((b = getchar()) < 'a');
    Now = N, Pos[i] = Pool + Top + 1;
    while (b >= 'a') Addx = b - 'a', Add(), Pool[++Top] = Now - N, b = getchar();
  }
  N[0].Son = N[0].Fa = N[0].Fail = 0x3f3f3f40, Build(), N->Dep = 1, DFS(N), Nn = CntN - N + 1, Nn <<= 1, BuildSg(S, 1, Nn);
  m = RD(), N[Nn + 1].Dep = 0x3f3f3f3f;
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    FindL = N[Pos[A][B - 1]].DFSr, FindR = N[Pos[C][D - 1]].DFSr;
    if(FindL > FindR) swap(FindL, FindR);
    if(N[Tmp[FindL]].SubDFSr > FindR) Now = N + Tmp[FindL];
    else Now = N + Nn + 1, Qry(S, 1, Nn), Now = N + Now->Fail;
    printf("%u\n", Now->Hash);
  }
  return Wild_Donkey;
}
```

### 代码实现

构造 AC 自动机，用 ST 求 LCA，可以做到 $O(1)$ 查询，但是卡空间只能得 $80'$。

```cpp
const unsigned MOD(1000000007);
const char _0(0), _26(26);
unsigned Log[1000005], Bin[25], ST[2000005][22], Nn, Len, m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
char b;
struct Node {
  unsigned Dep, Hash, DFSr;
  Node *To[26], *Fa, *Fail, *Son, *Bro;
}N[1000005], *CntN(N), *Now(N);
vector <unsigned> Pos[1000005];
struct Quu {
  Node *P;char Chr;
}Q[1000005], *Hd(Q), *Tl(Q);
void Add(char x) {
  if(!(Now->To[x])) Now->To[x] = ++CntN, CntN->Fa = Now;
  Now->To[x]->Hash = (((unsigned long long)26 * Now->Hash) + x) % MOD, Now = Now->To[x];
}
void Build() {
  (++Tl)->P = N;
  register Node *x, *Back;
  register char c; 
  while (Tl != Hd) {
    x = (++Hd)->P, c = Hd->Chr;  
    if(x->Fa) {
      Back = x->Fa->Fail;
      while (Back) {
        if(Back->To[c]) {
          x->Fail = Back->To[c];
          x->Bro = Back->To[c]->Son;
          Back->To[c]->Son = x;
          break; 
        }
        Back = Back->Fail;
      }
      if(!(x->Fail)) {
        x->Fail = N;
        x->Bro = N->Son;
        N->Son = x;
      }
    }
    for (register char i(_0); i < _26; ++i) if(x->To[i]) (++Tl)->P = x->To[i], Tl->Chr = i;
  }
}
void DFS(Node *x) {
  ST[++Cnt][0] = x - N, x->DFSr = Cnt;
  register Node *So(x->Son);
  while (So) So->Dep = x->Dep + 1, DFS(So), So = So->Bro;
  ST[++Cnt][0] = x - N;
  return;
}
inline Node *LCA(Node *x, Node *y) {
  if(x->DFSr > y->DFSr) swap(x, y);
  register unsigned TmpL(Log[y->DFSr - x->DFSr + 1]);
  register Node *TmpP;
  if(N[ST[x->DFSr][TmpL]].Dep < N[ST[y->DFSr - Bin[TmpL] + 1][TmpL]].Dep) TmpP = N + ST[x->DFSr][TmpL];
  else TmpP = N + ST[y->DFSr - Bin[TmpL] + 1][TmpL];
  if(TmpP == x) return x;
  return TmpP->Fail;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    while ((b = getchar()) < 'a');
    Now = N;
    while (b >= 'a') Add(b - 'a'), Pos[i].push_back(Now - N), b = getchar();
  }
  Build(), N->Dep = 1, DFS(N), Nn = CntN - N + 1, Nn <<= 1;
  for (register unsigned i(1), j(0); i <= Nn; i <<= 1, ++j) Bin[j] = i, Log[i] = j;
  for (register unsigned i(3); i <= Nn; ++i) Log[i] = max(Log[i - 1], Log[i]);
  for (register unsigned i(1), j(0); i < Nn; i <<= 1, ++j) {
    for (register unsigned k(1); k + (i << 1) <= Nn + 1; ++k) {
      if(N[ST[k][j]].Dep < N[ST[k + i][j]].Dep) ST[k][j + 1] = ST[k][j];
      else ST[k][j + 1] = ST[k + i][j];
    }
  }
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    printf("%u\n", LCA(N + Pos[A][B - 1], N + Pos[C][D - 1])->Hash);
  }
  return Wild_Donkey;
}
```

### 线段树 LCA + `unordered_map` 优化

发现 ST 表本质上是在欧拉序上求区间深度最小点。做到了 $O(1)$ 查询，代价是 $O(tot\log tot)$。

这时时间尚有结余，但是空间吃紧，所以本题特殊之处在于用空间换时间。

思考区间查询最值还可以使用线段树在 $O(\log tot)$ 的时间内查询，空间只需要 $O(tot)$。

这是发现还是 MLE，瓶颈在转移边，于是使用 `unordered_map` 优化空间。

为了优化空间，不存储线段树节点表示的区间，而是在递归过程中作为参数传进函数中。

但是因为常数过大，程序从 MLE 变成了 TLE。仍然是 $80'$。

```cpp
const unsigned MOD(1000000007);
const char _0(0), _26(26);
unsigned Nn, CntS(0), Len, m, n, Cnt(0), A, B, C, D, FindL, FindR, t, Ans(0), Tmp[2000005];
char b, Addx;
struct Node {
  unsigned Dep, Hash, DFSr, SubDFSr, To[26], Fa, Fail, Son, Bro;
}N[1000005], *CntN(N), *Now(N);
struct Sg {
  unsigned LS, RS, Val;
}S[4000005];
void Qry(Sg *x, unsigned L, unsigned R) {
  if((FindL <= L) && (R <= FindR)) {
    if(Now->Dep > N[x->Val].Dep) Now = N + x->Val; 
    return; 
  }
  register unsigned Mid((L + R) >> 1);
  if(Mid >= FindL) Qry(S + x->LS, L, Mid);
  if(Mid < FindR) Qry(S + x->RS, Mid + 1, R);
}
void BuildSg(Sg *x, unsigned L, unsigned R) {
  if(L == R) {x->Val = Tmp[L];return;}
  register unsigned Mid((L + R) >> 1);
  BuildSg(S + (x->LS = ++CntS), L, Mid);
  BuildSg(S + (x->RS = ++CntS), Mid + 1, R);
  if(N[S[x->LS].Val].Dep < N[S[x->RS].Val].Dep) x->Val = S[x->LS].Val;
  else x->Val = S[x->RS].Val;
}
unsigned Pool[20000005], *Pos[1000005], Top(0);
struct Quu {
  unsigned P; char Chr;
}TmpQ;
queue<Quu> Q;
void Add() {
  if(!Now->To[Addx]) Now->To[Addx] = ++CntN - N, CntN->Fa = Now - N, CntN->Son = 0x3f3f3f40;
  N[Now->To[Addx]].Hash = (((unsigned long long)26 * Now->Hash) + Addx) % MOD, Now = N + Now->To[Addx];
}
void Build() {
  TmpQ.P = 0;
  Q.push(TmpQ);
  register Node *x, *Back;
  register char c; 
  while (Q.size()) {
    TmpQ = Q.front(), Q.pop();
    x = N + TmpQ.P, c = TmpQ.Chr;
    if(x->Fa < 0x3f3f3f3f) {
      Back = N + N[x->Fa].Fail;
      while (Back < N + 0x3f3f3f3f) {
        if(Back->To[c]) {
          x->Fail = Back->To[c];
          x->Bro = N[Back->To[c]].Son;
          N[Back->To[c]].Son = x - N;
          break; 
        }
        Back = N + Back->Fail;
      }
      if(!(x->Fail)) {
        x->Fail = 0;
        x->Bro = N->Son;
        N->Son = x - N;
      }
    }
    for (register char i(_0); i < _26; ++i) if(x->To[i]) TmpQ.P = x->To[i], TmpQ.Chr = i, Q.push(TmpQ);
  }
}
void DFS(Node *x) {
  Tmp[++Cnt] = x - N, x->DFSr = Cnt;
  register Node *So(N + x->Son);
  while (So < N + 0x3f3f3f3f) So->Dep = x->Dep + 1, DFS(So), So = N + So->Bro;
  Tmp[++Cnt] = x - N, x->SubDFSr = Cnt;
  return;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    while ((b = getchar()) < 'a');
    Now = N, Pos[i] = Pool + Top + 1;
    while (b >= 'a') Addx = b - 'a', Add(), Pool[++Top] = Now - N, b = getchar();
  }
  N[0].Son = N[0].Fa = N[0].Fail = 0x3f3f3f40, Build(), N->Dep = 1, DFS(N), Nn = CntN - N + 1, Nn <<= 1, BuildSg(S, 1, Nn);
  m = RD(), N[Nn + 1].Dep = 0x3f3f3f3f;
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    FindL = N[Pos[A][B - 1]].DFSr, FindR = N[Pos[C][D - 1]].DFSr;
    if(FindL > FindR) swap(FindL, FindR);
    if(N[Tmp[FindL]].SubDFSr > FindR) Now = N + Tmp[FindL];
    else Now = N + Nn + 1, Qry(S, 1, Nn), Now = N + Now->Fail;
    printf("%u\n", Now->Hash);
  }
  return Wild_Donkey;
}
```

### 信仰崩塌

$64$ 位机的指针比整形大一倍，所以将所有指针换成数组，然后成功在没有 `unordered_map` 的前提下将内存压到可接受的范围内。

代码就是一开始的那份代码。
