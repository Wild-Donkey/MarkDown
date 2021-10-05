
### [P6965](https://www.luogu.com.cn/problem/P6965) + [LOJ6036](https://loj.ac/p/6036)

树链剖分优化建图，复杂度 $O(n\log^2n)$，[开了 `-O2` 跑得真不慢](https://www.luogu.com.cn/record/58780653)。

## 题意

有 $n$ 个二进制串，每个串最多有一位是 `?`。

你要给 `?` 填上 `0/1`，使得不存在 $i$，$j$ 使 $s_i$ 是 $s_j$ 的前缀。

洛谷上要输出方案，而 LOJ 只需要判断可行性，相当于弱化版，所以这里只放 P6965 的做法。

## 做法 

将每个字符串 `?` 取 `0` 和 `1` 的情况都存到 Trie 里。

我们发现，如果选了一个节点，那么它子树上的节点都不能选，它到根的路径上的节点也不能选，所以我们要往这些点的对应点上连边。

我们知道有线段树优化建边，当线段树从序列上放到 Trie 上，就需要树链剖分了，(显然我没有想到可以只连父子)

树链剖分建边是 $O(n\log^2n)$，对于常数极大的线性算法，这个算法增加的 $\log^2n$ 的复杂度没有明显地比别的算法慢，只是不开 `-O2` 会超时，但是开了 `-O2` 便跑到了最优解第一页的前半部分。

建边之后跑 2-SAT 即可。

## 代码实现

我觉得这份代码最妙的地方莫过于在递归过程中计算线段树区间长度，然后用 `vector` 存图，实现了线段树和有向图的无缝衔接，这虽然对数组来说是很正常的事，但是对于指针来说，少定义两个结构体 (存边和存线段树) 确实大大减少了代码难度。

```cpp
unsigned m, n, n2;
unsigned A, B, C, D, t;
unsigned Tmp(0);
unsigned DFSCnt(1), STop(0), SCC(0);
char TmpI[500005], UnSur[500005], Cr(0), Flg(0);
vector<char> Ans[500005];
struct Trie;
struct Node {
  vector<Node*> To;
  Trie* Tr;
  unsigned Bel, Low, DFSr;
  char InS;
}N[2000005], * List[2000005], * CntN, * Frm, * Root;
struct Trie {
  Trie* Son[2], * Top, * Fa;
  unsigned RL, RR, Size, Cnt;
  char Heavy;
  inline void PreDFS() {
    unsigned Mx(0);
    if (Son[0]) Son[0]->Fa = this, Son[0]->PreDFS(), Heavy = 0, Mx = Son[0]->Size;
    if (Son[1]) {
      Son[1]->Fa = this, Son[1]->PreDFS();
      if (Son[1]->Size > Mx) Heavy = 1;
    }
  }
  inline void DFS() {
    RL = DFSCnt, RR = RL + Cnt - 1, DFSCnt += Cnt;
    if (!Son[Heavy]) return;
    Son[Heavy]->Top = Top, Son[Heavy]->DFS();
    Trie* Cur(Son[Heavy ^ 1]);
    if (Cur) Cur->Top = Cur, Cur->DFS();
  }
}T[1000005], * CntT(T), * Lst1, * Lst2;
inline void Link(Node* x, unsigned L, unsigned R) {
  if ((A <= L) && (R <= B)) { Frm->To.emplace_back(x);return; }
  unsigned Mid((L + R) >> 1);
  if (A <= Mid) Link(x->To[0], L, Mid);
  if (B > Mid) Link(x->To[1], Mid + 1, R);
}
inline Node* Build(unsigned L, unsigned R) {
  if (L == R) { return N + ((List[L] - N) ^ 1); }
  unsigned Mid((L + R) >> 1);
  Node* Cur(++CntN);
  Cur->To.emplace_back(Build(L, Mid));
  Cur->To.emplace_back(Build(Mid + 1, R));
  return Cur;
}
inline void Tarjan(Node* x) {
  x->DFSr = x->Low = ++DFSCnt, List[++STop] = x, x->InS = 1;
  for (auto Cur : x->To) {
    if (Cur->DFSr) { if (Cur->InS) x->Low = min(x->Low, Cur->Low); }
    else Tarjan(Cur), x->Low = min(x->Low, Cur->Low);
  }
  if (x->DFSr == x->Low) {
    ++SCC;
    do List[STop]->Bel = SCC, List[STop]->InS = 0;
    while (List[STop--] != x);
  }
}
signed main() {
  CntN = N + (n2 = ((n = RD()) << 1)) - 1;
  for (unsigned i(0), j(1); i < n; ++i) {
    scanf("%s", TmpI + 1), Lst1 = Lst2 = T, j = 1;
    while (TmpI[j] >= '0') {
      ++(Lst1->Size), ++(Lst2->Size);
      Ans[i].push_back(TmpI[j]);
      if (TmpI[j] == '?') {
        UnSur[i] = 1;
        if (!(Lst1->Son[0])) Lst1->Son[0] = ++CntT;
        if (!(Lst2->Son[1])) Lst2->Son[1] = ++CntT;
        Lst1 = Lst1->Son[0];
        Lst2 = Lst2->Son[1];
      }
      else {
        Cr = TmpI[j] - '0';
        if (!(Lst1->Son[Cr])) Lst1->Son[Cr] = ++CntT;
        if (!(Lst2->Son[Cr])) Lst2->Son[Cr] = ++CntT;
        Lst1 = Lst1->Son[Cr];
        Lst2 = Lst2->Son[Cr];
      }
      ++j;
    }
    ++(Lst1->Cnt), ++(Lst1->Size), N[i << 1].Tr = Lst1;
    ++(Lst2->Cnt), ++(Lst2->Size), N[(i << 1) ^ 1].Tr = Lst2;
  }
  T->PreDFS(), T->Top = T, T->DFS();
  for (unsigned i(0); i < n2; ++i) List[(N[i].Tr)->RL + (--((N[i].Tr)->Cnt))] = N + i;
  for (unsigned i(1); i <= n2; ++i) List[i]->DFSr = i;
  Root = Build(1, n2);
  for (Frm = N + n2 - 1; Frm >= N; --Frm) {
    Trie* Cur(Frm->Tr);
    A = Frm->DFSr + 1, B = Cur->RL + Cur->Size - 1;
    if (A <= B) Link(Root, 1, n2);
    A = Cur->Top->RL, B = Frm->DFSr - 1;
    if (A <= B) Link(Root, 1, n2);
    Cur = Cur->Top->Fa;
    while (Cur) {
      A = Cur->Top->RL, B = Cur->RR;
      if (A <= B) Link(Root, 1, n2);
      Cur = Cur->Top->Fa;
    }
  }
  for (unsigned i(1); i <= n2; ++i) List[i]->DFSr = 0;
  DFSCnt = 0, Tarjan(Root);
  for (unsigned i(0); i < n; ++i)
    if (N[i << 1].Bel == N[(i << 1) ^ 1].Bel) { Flg = 1;break; }
    else UnSur[i] = (N[i << 1].Bel > N[(i << 1) ^ 1].Bel ? 1 : 0);
  if (Flg) { printf("NO\n"); return 0; }
  printf("YES\n");
  for (unsigned i(0); i < n; ++i) {
    for (auto j : Ans[i]) {
      if (j == '?') putchar(UnSur[i] + '0');
      else putchar(j);
    }
    putchar('\n');
  }
  return Wild_Donkey;
}
```
