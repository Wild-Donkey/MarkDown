---
title: 省选日记 Day-19~-15
date: 2022-03-20 12:05
categories: Notes
tags:
  - Network_Flow
  - Decomposition_Techniques
  - Persistent_Segment_Tree
  - Binary_Lifting
  - Heuristic_Merging
  - Binary_Search_on_Segment_Tree
  - Binary_Indexed_Tree
  - Two_Dimensional_Segment_Tree
  - Expected_Value_and_Probability
  - Kruskal
  - Kruskal_Tree
  - Fast_Fourier_Transform_with_Divide_and_Conquer
  - Number_Theory_Transform
  - Sieve_Theory
  - Du_Sieve
thumbnail: /images/MC17.png
---

# 省选日记 Day $-19$ - Day $-15$

## Day $-19$ Mar 15, 2022, Tuesday

今天的模拟赛特别离谱, 三道题里面两道多项式.

In my opinion, problem A, C is supposed to be exist in a math book, not in a fucking contest.

### B

这个题还稍微亲民一些, 我想到了一个无法写也无法 Hack 的轮廓线, 即使是对的, 写出来码量也十分恐怖.

我们先使理论值最大, 然后假设所有额外值都取绝对值, 这样就会存在一些统计错误的额外值, 我们需要思考如何要么改变选择使这个额外值合法, 要么正确统计这个额外值. 毫无疑问, 使答案合法一定会减少某个数, 我们只要想办法尽可能减少减去的数字. 为了计算这个差值的最小值, 我们使用最小割.

连边很简单, 只要从源点开始向选择的值为正的点连对应理论值的两倍的边, 然后从选择的值为负的点向汇点连理论值两倍的边, 最后在相邻的格子的点之间相互连额外值连接对应额外值绝对值两倍的边.

在这个图上, 如果有从源点到汇点的增广路, 那么说明这里面的每条边至少有一条是不合法的, 我们需要割掉一条来使得它合法. 所以这个图的最小割便是我们使答案合法需要减去的最小的值.

```cpp
int a[1005][1005];
unsigned c[205];
unsigned char b[1005][1005];
int C;
unsigned m, n, P;
unsigned A, B, D, t;
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
inline void Clr() {
  memset(b, 0, sizeof(b));
  for (Node* i(N + P + 1); i >= N; --i) i->E.clear();
  n = RD(), m = RD(), P = RD(), Ans = Tmp = 0;
}
inline void Link (Node* x, Node* y, unsigned Val) {
  x->E.push_back({y, y->E.size(), Val});
  y->E.push_back({x, x->E.size() - 1, 0});
}
inline void Judge (int z, unsigned x, unsigned y) {
  if(!x) return;
  unsigned TMul(c[x] * c[y]);
  Link(N + x, N + y, TMul), Link(N + y, N + x, TMul), Ans += TMul;
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
  for (unsigned &i(x->Frm); Come && (i < x->E.size()); ++i) if(x->E[i].Con && (x->E[i].To->Dep > x->Dep)) {
    unsigned Succ(DFS(x->E[i].To, min(Come, x->E[i].Con)));
    Come -= Succ, x->E[i].Con -= Succ, x->E[i].To->E[x->E[i].Inv].Con += Succ, Gone += Succ;
  }
  return Gone;
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= m; ++j) a[i][j] = RDsg();
    for (unsigned i(1); i <= P; ++i) {
      A = RD(), B = RD(), b[A][B] = i, C = a[A][B] * (int)(c[i] = RD());
      if(a[A][B] > 0) Link(N, N + i, C), Ans += C;
      else Link(N + i, N + P + 1, -C), Ans += -C;
      C = a[A][B];
      Judge(a[A - 1][B], b[A - 1][B], i), Judge(a[A][B - 1], b[A][B - 1], i);
      Judge(a[A + 1][B], b[A + 1][B], i), Judge(a[A][B + 1], b[A][B + 1], i);
    }
    while (BFS()) Tmp += DFS(N, 0x3f3f3f3f);
    printf("%u\n", Ans - (Tmp << 1));
  }
  return Wild_Donkey;
}
```

## Day $-18$ Mar 16, 2022, Wednesday

今天的题, 我搞出了个 T1 的乱搞 $100'$, 但是事后叉掉了. 这个问题是等价于传递闭包的, 所以我的做法如果是真的, 就可以拿图灵奖了.

I'm supposed to judge the connection between two points on a DAG.

Calculate the topological order.

Calculate the DFS order.

Compare the orders and make a judgement.

正解当然是 bitset 优化分块查询了.

### [SDOI2013 森林](https://www.luogu.com.cn/problem/P3302)

先考虑静态的问题:

我们知道, 线段树一旦可持久化了, 它就变成了好多线段树. 在这些线段树上面二分, 可以解决区间第 $k$ 大问题.

对于树上的路径, 可以拆成两个点到 LCA 的路径. 为了在两个路径上二分, 我们以 DFS 序为时间轴, 建立可持久化权值线段树. 每个点所在的版本存储它到根节点路径上不同权值的出现次数. 我们可以通过差分来完成可持久化权值线段树的建立.

查询时, 先找到路径的 LCA, 然后在两个点的版本和 LCA 的父亲的版本这三个版本的基础上进行线段树上二分, 即可找到我们想要的权值.

接下来考虑动态版本. 因为这个东西它只有连边没有删边, 所以我们可以进行启发式合并. 直接把较小的树接到较大的下面去即可. 每个点重构 LCA 的倍增数组需要 $O(\log n)$ 复杂度, 总共最多合并 $O(n\log n)$ 个点, 所以总复杂度 $O(n\log^2 n)$. 询问的复杂度是 $O(\log n)$, 因此总复杂度是 $O(n\log^2 n)$.

```cpp
unsigned b[80005], m, n, Q, Top(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
char Op[3];
struct Seg {
  Seg *LS, *RS;
  unsigned Val;
  inline void Find(Seg* x, Seg* y, Seg* z, unsigned L, unsigned R) {
    if(L == R) {D = L;return;}
    unsigned Tot(LS->Val + x->LS->Val - y->LS->Val - z->LS->Val), Mid((L + R) >> 1);
    if(C <= Tot) LS->Find(x->LS, y->LS, z->LS, L, Mid);
    else C -= Tot, RS->Find(x->RS, y->RS, z->RS, Mid + 1, R);
  }
}S[10000005], *CntS(S);
inline void Pls(Seg* x, Seg* y, unsigned L, unsigned R) {
  y->Val = x->Val + 1;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(C <= Mid) Pls(x->LS, y->LS = ++CntS, L, Mid), y->RS = x->RS;
  else Pls(x->RS, y->RS = ++CntS, Mid + 1, R), y->LS = x->LS;
}
struct Node {
  vector <Node*> E;
  Node* Fa[18];
  Seg* Root;
  unsigned Dep, Val, Size;
  inline void Construct() {
    Node* Fa0(Fa[0]);
    Dep = Fa0->Dep + 1, Size = 1, C = Val, Pls(Fa0->Root, Root, 1, Top);
    memset(Fa, 0, sizeof(Fa)), Fa[0] = Fa0;
    for (unsigned i(0); Fa[i]; ++i) Fa[i + 1] = Fa[i]->Fa[i];
    for (auto i:E) if(i != Fa[0]) i->Fa[0] = this, i->Construct(), Size += i->Size;
  }
}N[80005];
signed main() {
  RD(), n = RD(), m = RD(), Q = RD(), N->Root = S;
  for (unsigned i(1); i <= n; ++i) b[i] = N[i].Val = RD(), N[i].Root = ++CntS;
  sort(b + 1, b + n + 1), Top = unique(b + 1, b + n + 1) - b;
  for (unsigned i(1); i <= n; ++i) N[i].Val = lower_bound(b + 1, b + Top, N[i].Val) - b;
  --Top, S->LS = S->RS = S, N->Fa[0] = N;
  for (unsigned i(1); i <= m; ++i) A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  for (unsigned i(1); i <= n; ++i) if(!N[i].Fa[0]) N[i].Fa[0] = N, N[i].Construct();
  for (unsigned i(1); i <= Q; ++i) {
    scanf("%s", Op), A = (RD() ^ Ans), B = (RD() ^ Ans);
    if(Op[0] == 'Q') {
      C = (RD() ^ Ans);
      Node *CurA(N + A), *CurB(N + B);
      if(CurA->Dep < CurB->Dep) swap(CurA, CurB), swap(A, B);
      for (unsigned j(16); ~j; --j) {
        if(CurA->Fa[j] && (CurA->Fa[j]->Dep >= CurB->Dep)) CurA = CurA->Fa[j];
      }
      if(CurA == CurB) S->Find(N[A].Root, N[B].Fa[0]->Root, S, 1, Top);
      else {
        for (unsigned j(16); ~j; --j) if(CurA->Fa[j] != CurB->Fa[j]) CurA = CurA->Fa[j], CurB = CurB->Fa[j];
        N[A].Root->Find(N[B].Root, CurA->Fa[0]->Root, CurA->Fa[1]->Root, 1, Top);
      }
      printf("%u\n", Ans = b[D]);
    } else {
      Node *RtA(N + A), *RtB(N + B);
      for (unsigned j(16); ~j; --j) if((RtA->Fa[j]) && (RtA->Fa[j] != N)) RtA = RtA->Fa[j];
      for (unsigned j(16); ~j; --j) if((RtB->Fa[j]) && (RtB->Fa[j] != N)) RtB = RtB->Fa[j];
      if(RtA->Size < RtB->Size) swap(A, B), swap(RtA, RtB);
      N[B].Fa[0] = N + A, N[B].Construct(), RtA->Size += N[B].Size;
      N[B].E.push_back(N + A), N[A].E.push_back(N + B);
    }
  }
  return Wild_Donkey;
}
```

## Day $-17$ Mar 17, 2022, Thursday

今天的模拟赛可以说是二分大赛了.

T1 是个大水题, 二分答案即可.

T2 首先是分颜色讨论, 接下来求答案的过程就大同小异了. 其实有线性, 原理也很简单, 就是双指针扫描保证花费在限制内且长度尽可能大即可. 也有不同的二分的做法, 可以二分最终的长度, 每次用双指针直接判断是否存在花费合理的. 也可以枚举中点, 然后二分半径, 对每个中点求出答案, 取最大值.

### [ZJOI2017 树状数组](https://www.luogu.com.cn/problem/P3688)

这个题建立的树状数组相当于是维护和查询后缀和, 所以查询结果错误当且仅当 $L - 1$ 和 $R$ 两个元素不相同的时候.

接下来考虑概率.

一开始我是这样想的: 这简单啊, 我维护每个点变成 $1$ 的概率, 查询的时候直接查不就好了吗.

但是如果两个点被同一次操作改变了概率, 那么两个点的概率就不独立了, 也就是说, 两个点不能同时被这个操作修改, 所以根据各自的概率不能计算出结果.

对某个询问有影响的操作有三种情况: 只修改左端点, 只修改右端点, 两个端点都修改.

前两种操作可以进行 CDQ 分治, 解决 $4$ 维偏序问题. 每个元素记录四个值 $L, R, Time, Type$. 前两个值是询问的 $L - 1$ 和 $R$ 两个点, 修改是记录两个端点 $L$, $R$, $Time$ 就是操作的时间, $Type = 0$ 表示这个操作是修改, 否则是查询. 第一个类型的修改中对询问 $i$ 有贡献的修改是满足 $L_j \leq L_i$, $R_j < R_i$, $Time_j < Time_i$, $Type_j < Type_i$ 的 $j$. 我们对 $Time$ 进行分治, 对 $R$ 排序, 对 $L$ 用带回滚的线段树维护. 由于 $Type$ 只有两个可能的取值, 所以可以扫描时直接判断. 第二个类型的贡献将上面的过程对称一下即可.

现在已经算出了两个贡献使每个询问的两个端点独立变成 $1$ 的概率了, 接下来我们需要对每个询问计算两个端点被第三个贡献修改其中一个的概率. 对于每个询问 $i$, 产生贡献的修改为满足 $L_j \leq L_i$, $R_j \geq R_i$, $Time_j < Time_i$, $Type_j < Type_i$ 的 $j$.

这样做是麻烦且大常数的, 还有一个东西也可以维护三维偏序问题: 二维线段树. 我们用它对平面上不同的点 $(L, R)$ 进行维护即可.

如果一个操作有 $a$ 的概率使得 $L$ 点和 $R$ 点之一的状态发生改变, 那么 $(L, R)$ 不同的概率 $x$ 就会变成:

$$
\begin{aligned}
x' &= a(1 - x) + (1 - a)x\\
&= a - ax + x - ax\\
&= (1 - 2a)x + a\\
\end{aligned}
$$

如果先后进行改变概率为 $a$, $b$ 的两次操作, 那么 $x$ 会变成:

$$
\begin{aligned}
x' &= (1 - 2b)((1 - 2a)x + a) + b\\
x' &= (1 - 2a)x + a - 2b((1 - 2a)x + a) + b\\
x' &= (1 - 2a - 2b + 4ab)x + a - 2ab + b\\
\end{aligned}
$$

容易发现, 交换 $a$, $b$ 的顺序不会影响结果, 所以我们不必关心操作的顺序. 在内层线段树每个叶子上存这个线段上的值经过操作后会乘多少加多少, 最后直接合并即可.

```cpp
#define Mn(x) (x)-=(((x)>=Mod)?Mod:0)
const unsigned long long Mod(998244353); 
unsigned Inv[100005];
unsigned long long OpM, OpP, Ans;
unsigned m, n, A, B, C, D, E, F, t;
inline unsigned long long Udt(const unsigned& x) {unsigned Rt(((Mod - x) << 1) + 1); Mn(Rt); return Rt; }
struct Inner {
  unsigned LS, RS, Opt;
}I[41225005], *CntI(I), *Border(I);
inline void PsDw(Inner* x) {
  unsigned long long Tmp(Udt(x->Opt));
  if(!(x->LS)) I[x->LS = ++CntI - I] = {0, 0, 0};
  I[x->LS].Opt = (I[x->LS].Opt * Tmp + x->Opt) % Mod;
  if(!(x->RS)) I[x->RS = ++CntI - I] = {0, 0, 0};
  I[x->RS].Opt = (I[x->RS].Opt * Tmp + x->Opt) % Mod;
  x->Opt = 0;
}
inline void Chg(Inner* x, unsigned L, unsigned R) {
  if((C <= L) && (R <= D)) {
    x->Opt = (x->Opt * OpM + OpP) % Mod;
    return;
  }
  PsDw(x);
  unsigned Mid((L + R) >> 1);
  if(C <= Mid) Chg(I + x->LS, L, Mid);
  if(D > Mid) Chg(I + x->RS, Mid + 1, R);
}
inline void Find(Inner* x, unsigned L, unsigned R) {
  if(!(x->LS)) {Ans = (Ans * Udt(x->Opt) + x->Opt) % Mod; return;}
  PsDw(x);
  unsigned Mid((L + R) >> 1);
  if(B <= Mid) Find(I + x->LS, L, Mid);
  else Find(I + x->RS, Mid + 1, R);
}
struct Node {
  unsigned LS, RS, My;
}N[200005], *CntN(N);
inline void Chg(Node*x, unsigned L, unsigned R) {
  if((A <= L) && (R <= B)) {Chg(I + x->My, 1, n);return;}
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) Chg(N + x->LS, L, Mid);
  if(B > Mid) Chg(N + x->RS, Mid + 1, R);
}
inline void Find(Node*x, unsigned L, unsigned R) {
  Find(I + x->My, 1, n);
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) Find(N + x->LS, L, Mid);
  else Find(N + x->RS, Mid + 1, R);
}
inline void Build(Node* x, unsigned L, unsigned R) {
  I[x->My = ++CntI - I] = {0, 0, 0};
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(N + (x->LS = ++CntN - N), L, Mid);
  Build(N + (x->RS = ++CntN - N), Mid + 1, R);
}
signed main() {
  n = RD(), m = RD(), Build(N, 0, n), Inv[1] = 1, *Border = {0, 0, 0};
  for (unsigned i(2); i <= n; ++i) Inv[i] = (Mod - (Mod / i)) * Inv[Mod % i] % Mod;
  for (unsigned i(1); i <= m; ++i) {
    t = RD(), A = RD(), B = RD();
    if(t & 1) {
      OpP = Inv[B - A + 1], OpM = Udt(OpP), E = A, F = B;
      if(F < n) A = E, B = F, C = F + 1, D = n, Chg(N, 1, n);
      if(E > 1) A = 1, B = E - 1, C = E, D = F, Chg(N, 1, n);
      C = A = E, D = B = F, OpP <<= 1, Mn(OpP), OpM = Udt(OpP), Chg(N, 1, n);
      OpP = (OpP * 499122177 % Mod) * (F - E) % Mod, OpM = Udt(OpP), C = E, D = F, Chg(Border, 1, n);
      OpP = 1, OpM = 998244352;
      if(E > 1) C = 1, D = E - 1, Chg(Border, 1, n);
      if(F < n) C = F + 1, D = n, Chg(Border, 1, n);
    }
    else {--A, Ans = 1; if(A) Find(N, 1, n); else Find(Border, 1, n); printf("%llu\n", Ans);}
  }
  return Wild_Donkey;
}
```

事情远没有这么简单, 空间卡死了!!!! $500MB$ 的空间, 人们一般都用了 $460MB$ 以上. 当然, 作为高贵的指针用户我一定是寄了.

```cpp
#define Mn(x) (x)-=(((x)>=Mod)?Mod:0)
const unsigned long long Mod(998244353); 
unsigned Inv[100005];
unsigned long long OpM, OpP, Ans;
unsigned m, n, A, B, C, D, E, F, t;
inline unsigned long long Udt(const unsigned& x) {unsigned Rt(((Mod - x) << 1) + 1); Mn(Rt); return Rt; }
struct Inner {
  unsigned LS, RS, Opt;
}I[41225005], *CntI(I), *Border(I);
inline void PsDw(Inner* x) {
  unsigned long long Tmp(Udt(x->Opt));
  if(!(x->LS)) I[x->LS = ++CntI - I] = {0, 0, 0};
  I[x->LS].Opt = (I[x->LS].Opt * Tmp + x->Opt) % Mod;
  if(!(x->RS)) I[x->RS = ++CntI - I] = {0, 0, 0};
  I[x->RS].Opt = (I[x->RS].Opt * Tmp + x->Opt) % Mod;
  x->Opt = 0;
}
inline void Chg(Inner* x, unsigned L, unsigned R) {
  if((C <= L) && (R <= D)) {
    x->Opt = (x->Opt * OpM + OpP) % Mod;
    return;
  }
  PsDw(x);
  unsigned Mid((L + R) >> 1);
  if(C <= Mid) Chg(I + x->LS, L, Mid);
  if(D > Mid) Chg(I + x->RS, Mid + 1, R);
}
inline void Find(Inner* x, unsigned L, unsigned R) {
  if(!(x->LS)) {Ans = (Ans * Udt(x->Opt) + x->Opt) % Mod; return;}
  PsDw(x);
  unsigned Mid((L + R) >> 1);
  if(B <= Mid) Find(I + x->LS, L, Mid);
  else Find(I + x->RS, Mid + 1, R);
}
struct Node {
  unsigned LS, RS, My;
}N[200005], *CntN(N);
inline void Chg(Node*x, unsigned L, unsigned R) {
  if((A <= L) && (R <= B)) {Chg(I + x->My, 1, n);return;}
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) Chg(N + x->LS, L, Mid);
  if(B > Mid) Chg(N + x->RS, Mid + 1, R);
}
inline void Find(Node*x, unsigned L, unsigned R) {
  Find(I + x->My, 1, n);
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) Find(N + x->LS, L, Mid);
  else Find(N + x->RS, Mid + 1, R);
}
inline void Build(Node* x, unsigned L, unsigned R) {
  I[x->My = ++CntI - I] = {0, 0, 0};
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(N + (x->LS = ++CntN - N), L, Mid);
  Build(N + (x->RS = ++CntN - N), Mid + 1, R);
}
signed main() {
  n = RD(), m = RD(), Build(N, 0, n), Inv[1] = 1, *Border = {0, 0, 0};
  for (unsigned i(2); i <= n; ++i) Inv[i] = (Mod - (Mod / i)) * Inv[Mod % i] % Mod;
  for (unsigned i(1); i <= m; ++i) {
    t = RD(), A = RD(), B = RD();
    if(t & 1) {
      OpP = Inv[B - A + 1], OpM = Udt(OpP), E = A, F = B;
      if(F < n) A = E, B = F, C = F + 1, D = n, Chg(N, 1, n);
      if(E > 1) A = 1, B = E - 1, C = E, D = F, Chg(N, 1, n);
      C = A = E, D = B = F, OpP <<= 1, Mn(OpP), OpM = Udt(OpP), Chg(N, 1, n);
      OpP = (OpP * 499122177 % Mod) * (F - E) % Mod, OpM = Udt(OpP), C = E, D = F, Chg(Border, 1, n);
      OpP = 1, OpM = 998244352;
      if(E > 1) C = 1, D = E - 1, Chg(Border, 1, n);
      if(F < n) C = F + 1, D = n, Chg(Border, 1, n);
    }
    else {--A, Ans = 1; if(A) Find(N, 1, n); else Find(Border, 1, n); printf("%llu\n", Ans);}
  }
  return Wild_Donkey;
}
```

## Day $-16$ Mar 18, 2022, Friday

### [IOI2018 狼人](https://www.luogu.com.cn/problem/P4899)

想了半天没思路, 去偷瞄了一眼题解, 看到了 `Kruskal` 字样, 看到这道题有标签 `主席树` 便有了点想法.

我们根据点的编号正序倒序建两棵树, 在第一棵树上倍增找到 $< R_i$ 的极大连通块 (也就是一个子树), 在第二棵树上找对应的 $> L_i$ 的子树. 问题转化为两个子树内是否存在相同编号的点. 这个点既可以被起点合法到达, 也可以合法到达终点, 我们就可以在这个点上变身了.

对第一棵树求 DFS 序, 我们在第二棵树上同样编号的节点上存储这个 DFS 序作为权值. 相当于求一棵子树是否存在权值在特定区间内的点, 可以用可持久化权值线段树来查询.

```cpp
unsigned Lst[200005], FS[200005], Stack[200005], STop(0);
inline unsigned FindS(unsigned x) {
  while (FS[x] ^ x) Stack[++STop] = x, x = FS[x];
  while (STop) FS[Stack[STop--]] = x;
  return x;
}
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Seg {
  Seg *LS, *RS;
  unsigned Val;
}S[8000005], *Ver[200005], *CntS(S);
inline void Build(Seg* x, unsigned L, unsigned R) {
  x->Val = 0, x->LS = x->RS = NULL;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntS, L, Mid);
  Build(x->RS = ++CntS, Mid + 1, R);
}
inline void Add(Seg* x, Seg* y, unsigned L, unsigned R){
  y->Val = x->Val + 1;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) y->RS = x->RS, Add(x->LS, y->LS = ++CntS, L, Mid);
  else y->LS = x->LS, Add(x->RS, y->RS = ++CntS, Mid + 1, R);
}
inline unsigned Find(Seg* x, Seg* y, unsigned L, unsigned R) {
  if((A <= L) && (R <= B)) return y->Val - x->Val;
  unsigned Mid((L + R) >> 1);
  if((A <= Mid) && (Find(x->LS, y->LS, L, Mid))) return 1;
  if((B > Mid) && (Find(x->RS, y->RS, Mid + 1, R))) return 1;
  return 0;
}
struct Tree {
  vector<Tree*> Son;
  Tree* Fa[18];
  unsigned DFSr, Size;
  inline void GetF() { for (unsigned i(0); Fa[i]; ++i) Fa[i + 1] = Fa[i]->Fa[i]; }
  inline void DFS() {
    DFSr = ++Cnt, Size = 1;
    for (auto i:Son) i->DFS(), Size += i->Size;
  }
}T[400005], *T2;
struct Node {
  vector <Node*> E;
}N[200005];
inline Tree* Get1(Tree*x, unsigned y) {
  for (unsigned i(17); ~i; --i) if((x->Fa[i]) && (x->Fa[i] - T <= y)) x = x->Fa[i];
  return x;
}
inline Tree* Get2(Tree*x, unsigned y) {
  for (unsigned i(17); ~i; --i) if((x->Fa[i]) && (x->Fa[i] - T2 >= y)) x = x->Fa[i];
  return x;
}
unsigned m, n, Q;
signed main() {
  n = RD(), m = RD(), Q = RD(), T2 = T + n, Build(Ver[0] = S, 1, n);
  for (unsigned i(1); i <= m; ++i) A = RD() + 1, B = RD() + 1, N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  for (unsigned i(1); i <= n; ++i) {
    FS[i] = i;
    for (auto j:N[i].E) if((j < (N + i)) && (FindS(j - N) ^ i)) 
      T[FS[j - N]].Fa[0] = T + i, FS[FS[j - N]] = i;
  }
  for (unsigned i(n - 1); i; --i) T[i].GetF();
  for (unsigned i(1); i < n; ++i) T[i].Fa[0]->Son.push_back(T + i);
  Cnt = 0, T[n].DFS();
  for (unsigned i(n); i; --i) {
    FS[i] = i;
    for (auto j:N[i].E) if((j > (N + i)) && (FindS(j - N) ^ i))
      T2[FS[j - N]].Fa[0] = T2 + i, FS[FS[j - N]] = i;
  }
  for (unsigned i(2); i <= n; ++i) T2[i].GetF();
  for (unsigned i(2); i <= n; ++i) T2[i].Fa[0]->Son.push_back(T2 + i);
  Cnt = 0, T2[1].DFS();
  for (unsigned i(1); i <= n; ++i) Lst[T2[i].DFSr] = i;
  for (unsigned i(1); i <= n; ++i) A = T[Lst[i]].DFSr, Add(Ver[i - 1], Ver[i] = ++CntS, 1, n);
  for (unsigned i(1); i <= Q; ++i) {
    A = RD() + 1, B = RD() + 1, C = RD() + 1, D = RD() + 1;
    Tree *Fr(Get2(T2 + A, C)), *To(Get1(T + B, D));
    A = To->DFSr, B = To->DFSr + To->Size - 1;
    printf(Find(Ver[Fr->DFSr - 1], Ver[Fr->DFSr + Fr->Size - 1], 1, n) ? "1\n" : "0\n");
  }
  return Wild_Donkey;
}
```

好久没写这么爽的 DS 题了, 从开始到结束, 手上的速度始终没跟上脑子的感觉真是太带劲了. 样例很强, 好评.

### [分治 FFT](https://www.luogu.com.cn/problem/P4721)

给出 $g$, 求 $f$ 使得:

$$
f_i = \sum_{j = 1}^i f_{i - j}g_j
$$

已知 $f_0 = 1$, 我们设 $g_0 = 0$, 则

$$
f_i = \sum_{j = 0}^i f_{i - j}g_j
$$

我们分治计算, 每次计算子区间 $f_{[L, R)}$ 内, $f_{[L, Mid)}$ 对于 $f_{[Mid, R)}$ 的贡献. 设区间长度都为 $2$ 的自然数幂. 对于 $i \in [Mid, R)$.

$$
f_i += \sum_{j = 0}^{Mid - L - 1} g_{i - L - j}f_{L + j} 
$$

这里相当于计算 $g_{[0, R - L)}$ 和 $f_{[L, Mid)}$ 的卷积, 取结果的区间 $[Mid - L, R - L)$ 加到 $f_{[Mid, R)}$ 上去.

每次用一个区间计算它对右侧的贡献时, 必须满足这个区间所有贡献都被算完了. 我们计算整个式子时相当于建立了一棵完全二叉树, 一个节点是一个长度为 $2$ 的自然数次幂的区间, 一个节点的两个儿子代表的区间平均分开了这个节点的区间. 我们在这个二叉树上进行中序遍历, 左儿子回溯时计算它对它兄弟的贡献, 容易发现一个节点回溯时所有对它的区间的贡献就被计算完了.

我们需要进行 $O(2^i)$ 次长度为 $O(\frac n{2^i})$ 的多项式乘法, 复杂度为 $O(2^i \times \frac n{2^i} \times (\log n - i)) = O(n (\log n - i))$. $i \in [0, \log n)$, 因此总复杂度是 $O(n\log^2 n)$.

我们把一个 $n$ 项的多项式和一个 $2n$ 项的多项式相乘, 得到了一个 $3n - 1$ 项的多项式. 如果我们进行 DFT 时把这个东西当成 $2n$ 项的多项式, 最后 $n - 1$ 项就会被加到前面 $n - 1$ 项去, 不过我们不需要这些位置, 所以可以这样做.

```cpp
#define Inv(x) Pow(x,998244351)
#define Mn(x) (x)-=(((x)>=Mod)?Mod:0)
const unsigned long long Mod(998244353);
unsigned long long a[131105], b[131105];
unsigned long long PriR[524300], *PR[20][2], W, Inv[20];
unsigned m(1), Lgm(0), n, CurLen, CurLg;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0);
char Tp(0);
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;  
}
inline void DIT(unsigned long long* f) {
  for (unsigned i(1), j(1), l(1); i < CurLen; i <<= 1, ++j, l = ((l << 1) | 1)) {
    for (unsigned k(0); k < CurLen; ++k) if(!(i & k)) {
      unsigned long long TmA(f[k]), TmB(f[k ^ i] * PR[j][Tp][k & l] % Mod);
      f[k] = TmA + TmB, Mn(f[k]);
      f[k ^ i] = Mod + TmA - TmB, Mn(f[k ^ i]);
    }
  }
}
inline void DIF(unsigned long long* f) {
  for (unsigned i(CurLen >> 1), j(CurLg), l((1 << CurLg) - 1); i; i >>= 1, --j, l >>= 1) {
    for (unsigned k(0); k < CurLen; ++k) if(!(i & k)) {
      unsigned long long TmA(f[k]), TmB(f[k ^ i]);
      f[k] = TmA + TmB, Mn(f[k]);
      f[k ^ i] = PR[j][Tp][k & l] * (Mod + TmA - TmB) % Mod;
    }
  }
}
inline void Mul (unsigned long long* f, unsigned long long* g, unsigned long long* fg) {
  //Optimize: Small Block
  if(CurLen <= 32) {
    memset(fg + (CurLen >> 1), 0, CurLen << 2);
    for (unsigned i(CurLen >> 1); i < CurLen; ++i)
      for (unsigned j((CurLen >> 1) - 1); ~j; --j)
        fg[i] = (fg[i] + g[j] * f[i - j]) % Mod;
    return;
  }
  unsigned long long G[CurLen];
  memset(G, 0, CurLen << 3);
  memcpy(G, g, CurLen << 2);
  memcpy(fg, f, CurLen << 3);
  Tp = 0, DIF(G), DIF(fg);
  for (unsigned i(0); i < CurLen; ++i) fg[i] = fg[i] * G[i] % Mod;
  Tp = 1, DIT(fg);
  for (unsigned i(0); i < CurLen; ++i) fg[i] = fg[i] * Inv[CurLg] % Mod;
}
inline void Solve(unsigned L, unsigned Len) {
  if(Len == 1) {CurLg = 1; return;}
  Len >>= 1, Solve(L, Len);
  unsigned long long STm[CurLen = (Len << 1)], *Rt(STm + Len), *G(b + L + Len);
  Mul(a, b + L, STm);
  for (unsigned i(0); i < Len; ++i) G[i] += Rt[i], Mn(G[i]);
  Solve(L + Len, Len);
  ++CurLg;
}
signed main() { 
  n = RD(), a[0] = 0, b[0] = 1;
  while (m < n) m <<= 1, ++Lgm;
  W = Pow(3, 998244352 / m);
  *(PR[Lgm][0] = PriR) = 1,  *(PR[Lgm][1] = PR[Lgm][0] + m) = 1;
  for (unsigned i(1), j(0); i <= m; i <<= 1, ++j) Inv[j] = Inv(i);
  for (unsigned i(1); i < m; ++i) PriR[i] = PriR[i - 1] * W % Mod;
  for (unsigned i(1); i < m; ++i) PR[Lgm][1][i] = PriR[m - i] % Mod;
  for (unsigned i(m >> 1), k(Lgm - 1); ~k; i >>= 1, --k) {
    PR[k][0] = PR[k + 1][1] + (i << 1);
    for (unsigned l(0); l < i; ++l) PR[k][0][l] = PR[k + 1][0][l << 1];
    PR[k][1] = PR[k][0] + i;
    for (unsigned l(0); l < i; ++l) PR[k][1][l] = PR[k + 1][1][l << 1];
  }
  for (unsigned i(1); i < n; ++i) a[i] = RD();
  CurLen = m, Solve(0, m);
  for (unsigned i(0); i < n; ++i) printf("%llu ", b[i]); putchar(0x0A);
  return Wild_Donkey;
}
```

尝试了新的写法, 因为需要做多次 NTT, 并且需要灵活地进行乘法, 所以这次 NTT 写得很封装, 所以很好调. 一遍过了. 循环内单次取模优化了常数.

## Day $-15$ Mar 19, 2022, Saturday

### [简单的数学题](https://www.luogu.com.cn/problem/P3768)

取模意义下, 求

$$
\begin{aligned}
&\sum_{i = 1}^n \sum_{j = 1}^n ij\gcd(i, j)\\
=& \sum_{d = 1}^n d^3 \sum_{k = 1}^{\lfloor \frac nd \rfloor} \mu(k) k^2 \sum_{i = 1}^{\lfloor \frac n{dk} \rfloor} \sum_{j = 1}^{\lfloor \frac n{dk} \rfloor} ij\\
=& \sum_{d = 1}^n d^3 \sum_{k = 1}^{\lfloor \frac nd \rfloor} \mu(k) k^2 \frac{\lfloor \frac n{dk} \rfloor^2(\lfloor \frac n{dk} \rfloor + 1)^2}4\\
=& \sum_{d = 1}^n d^3 \sum_{k = 1}^{\lfloor \frac nd \rfloor} \mu(k) k^2 \sum_{i = 1}^{\lfloor \frac n{dk} \rfloor} i^3\\
=& \sum_{d = 1}^n d^3 \sum_{k = 1}^{\lfloor \frac nd \rfloor} \mu(k) k^2 \frac{\lfloor \frac{\lfloor \frac nd \rfloor}k \rfloor^2(\lfloor \frac{\lfloor \frac nd \rfloor}k \rfloor + 1)^2}4\\
\end{aligned}
$$

#### 法1 $O(n^{\frac 34})$

设 $G(x)$ 表示

$$
\sum_{i = 1}^x \mu(i)i^2\frac{\lfloor \frac{x}i \rfloor^2(\lfloor \frac xi \rfloor + 1)^2}4
$$

则问题转化为:

$$
\sum_{d = 1}^n d^3 G(\lfloor \frac nd \rfloor)
$$

如果可以快速计算 $G$, 便可以整除分块算出答案.

容易发现 $\lfloor \frac xi \rfloor$ 可以计算, 设 $f(i) = \mu(i)i^2$, $f$ 是积性函数, 可以亚线性筛法筛出来.

考虑到:

$$
\begin{aligned}
\epsilon(i) &= [i = 1]\\
\epsilon(i) &= i[i = 1]\\
\epsilon(i) &= i \sum_{j | i} \mu(j)\\
\epsilon(i) &= \sum_{j | i} \mu(j)j^2 \big(\frac ij\big) ^2\\
\epsilon &= f * Id_2\\
\end{aligned}
$$

这里 $*$ 表示狄利克雷卷积. 所以可以使用杜教筛:

$$
\begin{aligned}
\sum_{i = 1}^n (f * Id_2)(i) &= \sum_{i = 1}^n \sum_{j | i} f(\frac ij) j^2\\
&= \sum_{j = 1}^n j^2 \sum_{i = 1}^{\lfloor \frac nj \rfloor} f(i)\\
&= \sum_{i = 1}^n f(i) + \sum_{j = 2}^n j^2 \sum_{i = 1}^{\lfloor \frac nj \rfloor} f(i)\\
\sum_{i = 1}^n f(i) &= \sum_{i = 1}^n (f * Id_2)(i) - \sum_{j = 2}^n j^2 \sum_{i = 1}^{\lfloor \frac nj \rfloor} f(i)\\
\end{aligned}
$$

杜教筛是 $O(n^{\frac 23})$ 的. 因为 $G$ 不是积性函数, 所以在求小于等于 $n^{\frac 23}$ 项的前缀和时无法直接递推. 因此求 $G$ 的总复杂度是 $O(n^{\frac 34})$.

算了算大概是 $3*10^7$, 时限 $4s$ 的情况下每秒不到 $10^7$ 应该没什么问题吧. 交上去发现只能得 $80'$, 无论怎么卡常, 本地两秒跑完上去还是 TLE, 所以考虑优化.

```cpp
#define Inv(x) Pow(x,Mod-2)
bitset<5000000> No;
unsigned Prime[1000000], CntP(0), F[5000000], FL[2200], Cub[5000000], CuL[2200], Sq[5000000], SqL[2200], G[100005], GL[100005];
unsigned long long Mod, m, n, p, P, Inv6, Inv4, Ans(0);
inline void Mn(unsigned& x) {x -= (x >= Mod) ? Mod : 0;}
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
inline unsigned long long CG(unsigned long long x) {
  unsigned Rt(0);
  for (unsigned long long L, R(0), Cur, Lst(0), Tis; R < x; ) {
    L = R + 1, R = x / (Cur = x / L), Tis = ((R > m) ? FL[n / R] : F[R]);
    Rt = (Rt + ((Cur > m) ? (CuL[n / Cur]) : Cub[Cur]) * (Mod + Tis - Lst)) % Mod;
    Lst = Tis;
  }
  return Rt;
}
unsigned M, A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  Mod = RD(), n = RDll();
  if(!n) return printf("0\n"), 0;
  if(n == 1) return printf("1\n"), 0;
  if(n == 2) return printf("13\n"), 0;
  m = pow(n, ((double)2)/3), M = n / m, Inv6 = Inv(6), Inv4 = Inv(4);
  p = sqrt(n), P = n / p;
  while ((n / (M + 1)) > m) ++M; while ((n / M) <= m) --M;
  while ((n / (P + 1)) > p) ++P; while ((n / P) <= p) --P;
  F[1] = 1;
  for (unsigned long long i(1); i <= m; ++i) Cub[i] = (Cub[i - 1] + (i * i % Mod) * i) % Mod;
  for (unsigned long long i(1); i <= m; ++i) Sq[i] = (Sq[i - 1] + i * i) % Mod;
  for (unsigned i(1); i <= M; ++i) {
    unsigned long long Nw((n / i) % Mod);
    CuL[i] = ((Nw * (Nw + 2) + 1) % Mod) * ((Inv4 * Nw % Mod) * Nw % Mod) % Mod;
  }
  for (unsigned i(1); i <= M; ++i) {
    unsigned long long Nw((n / i) % Mod);
    SqL[i] = (((Nw * Nw % Mod) * ((Nw << 1) + 3) % Mod) + Nw) * Inv6 % Mod;
  }
  for (unsigned i(2); i <= m; ++i) {
    if(!No[i]) Prime[++CntP] = i, F[i] = (Mod - i) * i % Mod;
    for (unsigned j(1), Cur(i << 1); (Cur <= m) && j <= CntP; ++j, Cur = Prime[j] * i) {
      F[Cur] = (unsigned long long)F[i] * F[Prime[j]] % Mod, No[Cur] = 1;
      if(!(i % Prime[j])) {F[Cur] = 0;break;}
    }
  }
  for (unsigned i(1); i <= m; ++i) F[i] += F[i - 1], Mn(F[i]);
  for (unsigned long long i(M), j(n / M); i; --i) {
    j = n / i, FL[i] = 1;
    for (unsigned long long L, R(1), Cur, Lst(1), Tis; R < j; ) {
      L = R + 1, R = j / (Cur = j / L), Tis = ((R > m) ? (SqL[n / R]) : Sq[R]);
      FL[i] = (FL[i] + ((Cur > m) ? FL[n / Cur] : F[Cur]) * (Mod + Lst - Tis)) % Mod;
      Lst = Tis;
    }
  }
  for (unsigned i(1); i <= p; ++i) G[i] = CG(i);
  for (unsigned i(1); i <= P; ++i) GL[i] = CG(n / i);
  for (unsigned long long L, R(0), Cur, Lst(0), Tis; R < n; ) {
    L = R + 1, R = n / (Cur = n / L), Tis = ((R > m) ? (CuL[n / R]) : Cub[R]);
    Ans = (Ans + (((Cur <= p) ? G[Cur] : GL[n / Cur]) * (Mod + Tis - Lst))) % Mod;
    Lst = Tis;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

#### 法2 $O(n^{\frac 23})$

重新审视我们的式子:

$$
\begin{aligned}
&\sum_{i = 1}^n \sum_{j = 1}^n ij\gcd(i, j)\\
=&\sum_{i = 1}^n \sum_{j = 1}^n ij \sum_{d | i, d | j} d \sum_{k | \frac id, k | \frac jd} \mu(k)\\
=&\sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} d^3 \frac{\lfloor \frac n{dk} \rfloor^2(\lfloor \frac n{dk} \rfloor + 1)^2}4\\
=&\sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} d^3 \sum_{j = 1}^{\lfloor \frac n{dk} \rfloor} j^3\\
=&\sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} \sum_{j = 1}^{\lfloor \frac n{dk} \rfloor} (dj)^3\\
=&\sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} d^3 (I*I)(d)\\
\end{aligned}
$$

现在 $g(x) = x^3 (I*I)(x)$ 也成了积性函数. 

$$
\begin{aligned}
(g * (Id_3 \cdot \mu))(x) =& \sum_{i | x} i^3 (I*I)(i)\mu(\frac xi)\big(\frac xi\big)^3\\
=&x^3\sum_{i | x} (I*I)(i)\mu(\frac xi)\\
=&x^3\\
g * (Id_3 \cdot \mu) =& Id_3\\
\end{aligned}
$$

发现需要求 $Id_3 \cdot \mu$ 的前缀和, 仍然可以进行杜教筛.

$$
\epsilon = (Id_3 \cdot \mu) * Id_3
$$

三遍杜教筛算出需要的前缀和最后求答案即可. 时间复杂度 $O(n^{\frac 23})$.

#### 法3 $O(n^{\frac 23})$

法2 这样做确实可以把时间做到 $O(n^{\frac 23})$, 但是做三次杜教筛是我们不希望的. 重新审视我们的式子

$$
\begin{aligned}
Ans =& \sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} d^3 \sum_{j = 1}^{\lfloor \frac n{dk} \rfloor} j^3\\
=&\sum_{k = 1}^n \mu(k)k^2 \sum_{d = 1}^{\lfloor \frac nk \rfloor} d^3 (I*I)(d)\\
\end{aligned}
$$

第一个式子可以整除分块, 第二个式子可以线性筛, 所以对于 $g(x)$ 小于等于 $n^{\frac 23}$ 项的前缀和, 我们用第二个式子通过线性筛求出. 对于大于 $n^{\frac 23}$ 项的前缀和, 我们用第一个式子整除分块地求.

这样杜教筛就只需要处理 $f(k) = \mu(k)k^2$ 的前缀和即可. $O(n^{\frac 23})$ 的复杂度可以痛快地通过此题.

```cpp
#define Inv(x) Pow(x,Mod-2)
bitset<5000000> No;
unsigned Prime[1000000], CtB[5000000], CntP(0), D[5000000], F[5000000], FL[2200], Cub[5000000], CuL[2200], Sq[5000000], SqL[2200], GL[2205];
unsigned long long Mod, m, n, p, P, Inv6, Inv4, Ans(0);
inline void Mn(unsigned& x) {x -= (x >= Mod) ? Mod : 0;}
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
inline unsigned long long CG(unsigned long long x) {
  unsigned Rt(0);
  for (unsigned long long L, R(0), Cur, Lst(0), Tis; R < x; ) {
    L = R + 1, R = x / (Cur = x / L), Tis = ((R > m) ? CuL[n / R] : Cub[R]);
    Rt = (Rt + ((Cur > m) ? (CuL[n / Cur]) : Cub[Cur]) * (Mod + Tis - Lst)) % Mod;
    Lst = Tis;
  }
  return Rt;
}
unsigned M, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  Mod = RD(), n = RDll();
  if(!n) return printf("0\n"), 0;
  if(n == 1) return printf("1\n"), 0;
  if(n == 2) return printf("13\n"), 0;
  m = pow(n, ((double)2)/3), M = n / m, Inv6 = Inv(6), Inv4 = Inv(4);
  p = sqrt(n), P = n / p;
  while ((n / (M + 1)) > m) ++M; while ((n / M) <= m) --M;
  while ((n / (P + 1)) > p) ++P; while ((n / P) <= p) --P;
  F[1] = 1, D[1] = 1;
  for (unsigned long long i(1); i <= m; ++i) Cub[i] = (Cub[i - 1] + (i * i % Mod) * i) % Mod;
  for (unsigned long long i(1); i <= m; ++i) Sq[i] = (Sq[i - 1] + i * i) % Mod;
  for (unsigned i(1); i <= M; ++i) {
    unsigned long long Nw((n / i) % Mod);
    CuL[i] = ((Nw * (Nw + 2) + 1) % Mod) * ((Inv4 * Nw % Mod) * Nw % Mod) % Mod;
  }
  for (unsigned i(1); i <= M; ++i) {
    unsigned long long Nw((n / i) % Mod);
    SqL[i] = (((Nw * Nw % Mod) * ((Nw << 1) + 3) % Mod) + Nw) * Inv6 % Mod;
  }
  for (unsigned i(2); i <= m; ++i) {
    if(!No[i]) Prime[++CntP] = i, F[i] = (Mod - i) * i % Mod, D[i] = 2, CtB[i] = 2;
    for (unsigned j(1), Cur(i << 1); (Cur <= m) && j <= CntP; ++j, Cur = Prime[j] * i) {
      F[Cur] = (unsigned long long)F[i] * F[Prime[j]] % Mod, D[Cur] = D[i] * D[Prime[j]], CtB[Cur] = 2, No[Cur] = 1;
      if(!(i % Prime[j])) {F[Cur] = 0, D[Cur] = (D[i] / CtB[i]) * (CtB[Cur] = CtB[i] + 1);break;}
    }
  }
  for (unsigned long long i(1); i <= m; ++i) D[i] = (D[i - 1] + ((D[i] * i % Mod) * i % Mod) * i) % Mod;
  for (unsigned i(1); i <= m; ++i) F[i] += F[i - 1], Mn(F[i]);
  for (unsigned long long i(M), j(n / M); i; --i) {
    j = n / i, FL[i] = 1;
    for (unsigned long long L, R(1), Cur, Lst(1), Tis; R < j; ) {
      L = R + 1, R = j / (Cur = j / L), Tis = ((R > m) ? (SqL[n / R]) : Sq[R]);
      FL[i] = (FL[i] + ((Cur > m) ? FL[n / Cur] : F[Cur]) * (Mod + Lst - Tis)) % Mod;
      Lst = Tis;
    }
  }
  for (unsigned i(1); i <= M; ++i) GL[i] = CG(n / i);
  for (unsigned long long L, R(0), Cur, Lst(0), Tis; R < n; ) {
    L = R + 1, R = n / (Cur = n / L), Tis = ((R > m) ? (FL[n / R]) : F[R]);
    Ans = (Ans + (((Cur <= m) ? D[Cur] : GL[n / Cur]) * (Mod + Tis - Lst))) % Mod;
    Lst = Tis;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

#### 法4 $O(n^{\frac 23})$

简单看了看题解, 有个挺妙的做法在这里写一下.

我们知道有 $\phi * I = Id$. 因此

$$
\begin{aligned}
&\sum_{i = 1}^n \sum_{j = 1}^n ij\gcd(i, j)\\
&\sum_{i = 1}^n \sum_{j = 1}^n ij\sum_{d | i, d | j} \phi(d)\\
&\sum_{d = 1}^n d^2\phi(d) \frac{\lfloor \frac nd \rfloor^2(\lfloor \frac nd \rfloor + 1)^2}4\\
\end{aligned}
$$

我们可以仍然根据 $\phi * I = Id$, 用杜教筛求出 $\phi(d)$ 的前缀和然后直接整除分块.