# Day7

又是只整了一道题的一天

## Tree

给一棵点带权的树, 分成两个集合 $A$ 和 $B$, $A$ 的权值是集合中 $i$ 是 $j$ 的祖先, 且 $V_i > V_j$ 的无序点对数加 $i$ 和 $j$ 无直系关系 (不存在一个点是另一个点的祖先) 的无序点对数加集合中点的深度之和 (根深为 $0$), $B$ 的权值是集合中 $i$ 是 $j$ 的祖先, 满足 $V_i < V_j$ 的无需点对数.

考场上以为写出正解, 每个节点开了三棵可持久化线段树合并, 最后不会维护, 弃了正解.

然后发现貌似每个答案都是由上一个答案的基础上再从 $A$ 中拿一个点放入 $B$ 的, 事实证明赌对了, 可以贪心, 写了个 $n^2$ 的暴力, 痛苦收场:

```cpp
unsigned n, m, Vmax(0), A, B, Standard;
long long Ans(0), Distur(0), AnsDou(0);
char flg(0);
struct Edge;
struct Node {
  char Deleted;
  Edge *Fst;
  Node *Fa;
  unsigned Val, Dep, Size, Contri, Ace, DeceRo, DeceLe;
  inline const char operator<(const Node &x) const{
    return this->Contri < x.Contri;
  }
}N[500005];
struct Edge {
  Node *To;
  Edge *Nxt;
}E[1000005], *CntE(E);
priority_queue<Node> Q;
inline void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst;
  x->Fst = CntE;
  CntE->To = y;
} 
void DFS(Node *x) {
  register Edge *Sid(x->Fst);
  x->Size = 1;
  while (Sid) {
    if(Sid->To != x->Fa) {
      Sid->To->Dep = x->Dep + 1;
      Sid->To->Fa = x;
      DFS(Sid->To);
      x->Size += Sid->To->Size;
    }
    Sid = Sid->Nxt;
  }
  return;
}
unsigned DFS1(Node *x) {
  register Edge *Sid(x->Fst);
  register unsigned TmpDe((x->Val < Standard) ? 1 : 0);
  while (Sid) {
    if(Sid->To != x->Fa)
      TmpDe += DFS1(Sid->To);
    Sid = Sid->Nxt;
  }
  return TmpDe;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    N[i].Val = RD(), Vmax = (Vmax < N[i].Val) ? N[i].Val : Vmax;
  for (register unsigned i(1); i < n; ++i) {
    A = RD(), B = RD();
    Link(N + A, N + B);
    Link(N + B, N + A);
  }
  A = N[1].Val, N[1].Dep = 0;
  DFS(N + 1);
  for (register unsigned i(1); i <= n; ++i) {
    Standard = N[i].Val;
    Ans += (N[i].DeceRo = DFS1(N + i));
    AnsDou += n + N[i].Dep - N[i].Size;
  }
  Ans += (AnsDou >> 1);
  printf("%lld\n", Ans);
  for (register unsigned i(1); i <= n; ++i) { // i th
    register Node *Choice, *now;
    register long long Con;
    Distur = -0x3f3f3f3f3f3f3f3f;
    for (register unsigned j(1); j <= n; ++j) { // Del j
      if(N[j].Deleted) {continue;}
      now = N[j].Fa;
      Con = (long long)n - i + 1 - N[j].Size + N[j].DeceRo - N[j].DeceLe;
      while (now) {
        if(!now->Deleted) if (now->Val > N[j].Val) ++Con;
        else {++Con; if (now->Val < N[j].Val) --Con;}
        now = now->Fa;
      }
      if(Con > Distur) Distur = Con, Choice = N + j;
    }
    Choice->Deleted = 1;
    now = Choice->Fa;
    while (now) {
      --(now->Size);
      if (now->Val < Choice->Val) ++(now->DeceLe);
      if (now->Val > Choice->Val) --(now->DeceRo);
      now = now->Fa;
    }
    Ans -= Distur;
    printf("%lld\n", Ans);
  }
  return 0;
}
```

下面是正解:

首先发现这些 $B$ 中计入权值的点对数, 在所有点对中的补就是 $A$ 中计入权值的点数.

先讨论节点权值互不相同的情况, 考虑一个点 $x$ 从 $A$ 放到 $B$ 中, 它对答案的贡献是:

$$
\sum_{i \in B}[i 是 x 的祖先, V_i < V_x] + \sum_{i \in B}[x 是 i 的祖先, V_i > V_x] - \sum_{i \in A}[i 是 x 的祖先, V_i > V_x] - \sum_{i \in A}[x 是 i 的祖先, V_x > V_i] - \sum_{i \in A}[i 不是 x 的祖先, x 不是 i 的祖先] - Dep_i
$$

因为

$$
|A| - 1 = \sum_{i \in A}[i 是 x 的祖先, V_i > V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x > V_i] + \sum_{i \in A}[i 是 x 的祖先, V_i < V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x < V_i] + \sum_{i \in A}[i 不是 x 的祖先, x 不是 i 的祖先]
$$

所以贡献变成了:

$$
\sum_{i \in B}[i 是 x 的祖先, V_i < V_x] + \sum_{i \in B}[x 是 i 的祖先, V_i > V_x] - Dep_i - |A| + \sum_{i \in A}[i 是 x 的祖先, V_i < V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x < V_i]
$$

因为 $A$, $B$ 关于全部节点互补, 所以转化为:

$$
\sum_{i}[i 是 x 的祖先, V_i < V_x] + \sum_{i}[x 是 i 的祖先, V_i > V_x] - Dep_i - |A| + 1
$$

$|A|$ 和选哪个点无关, 而 $\displaystyle{\sum_{i}[i 是 x 的祖先, V_i < V_x] + \sum_{i}[x 是 i 的祖先, V_i > V_x] - Dep_i}$ 和 $A$, $B$ 的元素无关, 所以可以预处理, 然后贪心选择这个值最小的.

接下来考虑有权值相同的情况. 如果 $V_i = V_j$, 但是 $i$, $j$ 互不是对方的祖先, 这时它们的权值相对大小对答案无影响. 不失一般性, 不妨设 $i$ 是 $j$ 的祖先, 这时 $\sum_{k}[k 是 i 的祖先, V_k < V_i]$ 一定不大于 $\sum_{k}[k 是 j 的祖先, V_k < V_j]$, $\sum_{k}[i 是 k 的祖先, V_k > V_i]$ 一定不小于 $\sum_{k}[j 是 k 的祖先, V_k > V_j]$. 而造成 $\sum_{k}[k 是 j 的祖先, V_k < V_j] - \sum_{k}[k 是 i 的祖先, V_k < V_i]$ 差值的, 一定是 $i$, $j$ 中间的点, 数量不超过 $Dep_j - Dep_i - 1$ 个, 所以, $i$ 的贡献一定不如 $j$ 的小, 所以选 $j$.

考虑权值相同, 则:

$$
|A| - 1 = \sum_{i \in A}[i 是 x 的祖先, V_i > V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x > V_i] + \sum_{i \in A}[i 是 x 的祖先, V_i < V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x < V_i] +  \sum_{i \in A}[i 是 x 的祖先, V_i = V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x = V_i] + \sum_{i \in A}[i 不是 x 的祖先, x 不是 i 的祖先]
$$

贡献值变成:

$$
\sum_{i}[i 是 x 的祖先, V_i < V_x] + \sum_{i}[x 是 i 的祖先, V_i > V_x]  +  \sum_{i \in A}[i 是 x 的祖先, V_i = V_x] + \sum_{i \in A}[x 是 i 的祖先, V_x = V_i] - Dep_i - |A| + 1
$$

但是前面说了, 权值相同的祖先和后代, 先选后代更优, 也就是说, 在权值相等时, 一定是先选后代, 再选祖先, 所以不能存在 $i$ 是 $j$ 的祖先, $V_i = V_j$, 且 $i \in B$, $j \in A$ 的情况.

所以对于 $x \in A$, 所有的 $V_i = V_x$, 只要 $i$ 是 $x$ 的祖先, 一定有 $i \in A$;

对于 $x \in B$, 所有的 $V_i = V_x$, 只要 $x$ 是 $i$ 的祖先, 一定有 $i \in B$

所以 $x$ 放入 $B$ 的时候, 有:

$$
\sum_{i \in A}[x 是 i 的祖先, V_x = V_i] = 0\\
\sum_{i \in A}[i 是 x 的祖先, V_i = V_x] = \sum_{i}[i 是 x 的祖先, V_i = V_x]
$$

所以 $x$ 的贡献值就是:

$$
\sum_{i}[i 是 x 的祖先, V_i < V_x] + \sum_{i}[x 是 i 的祖先, V_i > V_x]  +  \sum_{i}[i 是 x 的祖先, V_i = V_x] - Dep_i - |A| + 1\\
= \sum_{i}[i 是 x 的祖先, V_i \leq V_x] + \sum_{i}[x 是 i 的祖先, V_i > V_x] - Dep_i - |A| + 1
$$

上代码:

```cpp
#define Lowbit(x) ((x)&(-(x)))
unsigned n, m, Vmax(0), A, B, FaTr[500005], DeTr[500005];
int Con[500005];
long long Ans(0);
char flg(0);
struct Edge;
struct Node {
  char Deleted;Edge *Fst;Node *Fa;
  unsigned Val, Dep, Size, Ace, Dece;
  int Contri;
  inline const char operator<(const Node &x) const{return this->Contri < x.Contri;}
}N[500005];
struct Edge {Node *To; Edge *Nxt;}E[1000005], *CntE(E);
priority_queue<Node> Q;
inline void Link(Node *x, Node *y) {(++CntE)->Nxt = x->Fst, x->Fst = CntE, CntE->To = y;}
inline void FaAdd(unsigned Pos) {while (Pos <= Vmax) ++FaTr[Pos], Pos += Lowbit(Pos);}
inline void FaMinu(unsigned Pos) {while (Pos <= Vmax) --FaTr[Pos], Pos += Lowbit(Pos);}
inline int FaQry(unsigned Pos) {
  register int TmpA(0);
  while (Pos) TmpA += FaTr[Pos], Pos -= Lowbit(Pos);
  return TmpA;
}
inline void DeAdd(unsigned Pos) {while (Pos <= Vmax) ++DeTr[Pos], Pos += Lowbit(Pos);}
inline void DeMinu(unsigned Pos) {while (Pos <= Vmax) --DeTr[Pos], Pos += Lowbit(Pos);}
inline int DeQry(unsigned Pos) {
  register int TmpA(0);
  while (Pos) TmpA += DeTr[Pos], Pos -= Lowbit(Pos);
  return TmpA;
}
void DFS(Node *x) {
  register Edge *Sid(x->Fst);
  x->Size = 1, x->Contri = FaQry(x->Val), FaAdd(x->Val), DeAdd(x->Val);
  Ans += ((FaQry(Vmax) - FaQry(x->Val)) << 1);
  register unsigned TmpSum(DeQry(Vmax) - DeQry(x->Val));
  while (Sid) {
    if(Sid->To != x->Fa) {
      Sid->To->Dep = x->Dep + 1, Sid->To->Fa = x;
      DFS(Sid->To);
      x->Size += Sid->To->Size, Ans += n + Sid->To->Dep - Sid->To->Size;
    }
    Sid = Sid->Nxt;
  }
  x->Contri = x->Contri + (DeQry(Vmax) - DeQry(x->Val) - TmpSum) - x->Dep;
  FaMinu(x->Val);
  return;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    N[i].Val = RD(), Vmax = (Vmax < N[i].Val) ? N[i].Val : Vmax;
  for (register unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), Link(N + A, N + B), Link(N + B, N + A);
  A = N[1].Val, N[1].Dep = 0;
  DFS(N + 1);
  Ans = Ans >> 1;
  printf("%lld\n", Ans);
  for (register unsigned i(1); i <= n; ++i) Con[i] = N[i].Contri;
  sort(Con + 1, Con + n + 1);
  for (register int i(1); i <= n; ++i) Ans += Con[i], Ans -= (int)n - i, printf("%lld\n", Ans);
  return 0;
}
```