# 仙人掌 (Cactus)

仙人掌图是任意一条边至多只出现在一个简单环的无向连通图. 这是当时写圆方树的时候学弟推荐我学的.

结合之前点双建立的圆方树, 发现仙人掌图是圆方树的弱化版本, 两环之间有割点连接, 每个点双连通分量都是一个简单环. 所以我们称仙人掌建出来的圆方树为狭义圆方树.

## 问题引入

我们需要在仙人掌上多次询问两点最短路. 

解决方案是建立圆方树, 然后作为树上问题进行查询.

## 构造

从任意点开始 DFS, 每次来到一个点就把这个点加入栈中, 每次遇到已经来过的点, 说明找到了环, 那么就不断把栈顶弹出直到这个已经来过的点变成栈顶, 弹出的这些点加上弹出后的栈顶就变成了一个环, 也就是点双连通分量.

对于链上的点来说, 它不会被上面的过程弹出, 所以在回溯的时候, 如果一个点仍未被弹出, 那么回溯时弹出这个点, 将其本身作为新的点双.

对于环上两点的最短距离可以处理环上每个点沿同一方向到第一个点的距离, 相当于前缀和, 这样就可以查询两点沿某一个方向的最短路, 然后用环长减去这个最短路.

## 算法

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

## 其余部分

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

