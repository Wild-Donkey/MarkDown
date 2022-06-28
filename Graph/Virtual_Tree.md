# Virtual Tree

> 揭开华丽的外衣, 关注问题的本质. 
> 这就是虚树在做的事情, 所以虚树不虚, 反而是虚伪原树中最实在的部分, 所以它更应该被称作 "实树". 它在实际问题中常常回答完问题后就转瞬即逝, 所以给人的印象就是镜花水月一般的虚无飘渺, 现实中敢讲真话的人也有很多就这虚树一样消失了, 这或许就是人们称其为 "虚树" 的原因吧.

## 定义

一棵树, 多次询问, 每次询问给出一些关键点, 需要对整棵树遍历才能找到答案, 但是所有询问的关键点总数有限制.

这时就可以每次关于关键点建立原树的虚树, 只保留和关键点数量同阶数量的节点, 对虚树进行遍历求得询问的结果.

结合一道经典题展开对虚树的学习.

## [SDOI2011 消耗战](https://www.luogu.com.cn/problem/P2495)

简化为一棵边带权的树, 每次询问把根节点和 $k$ 个关键点断开所需要的最小花费.

朴素的做法是每个点 $i$ 有一个值 $f_i$ 表示把 $i$ 子树中所有关键点和 $i$ 断开连接的最小花费, 每次决策是否断开 $i$ 到它每个儿子的边. 总复杂度 $O(nm)$.

接下来引入虚树的做法. 首先把根节点也设为关键点, 因为询问是关于它的, 假设我们只把关键点和关键点两两的 LCA 提出来, 将剩下的点都删掉, 没有删除的点向自己最近的没有删除的祖先连边, 边权就是两点间路径的最小边权, 那么这棵树就是原树关于给出的关键点建立的一棵虚树. 我们从这棵树上求得的答案和原树上求的是等价的.

容易发现, 每次在关键点之外增加一个点加入虚树, 这个点一定有至少两个子树含有关键点, 它的出现合并了至少两个含有关键点的连通块. 因此如果有 $x$ 个关键点, 那么最多会额外增加 $x - 1$ 个点加入虚树, 所以虚树的规模是和关键点数量同阶的.

## 虚树的建立

其实我虽然没写过, 但是听说过虚树的建法, 看看是否能根据印象胡出来.

如果希望建立虚树, 需要提前预处理出每个点的 DFS 序, 根据虚树的定义, 容易发现虚树中各节点的 DFS 序就是原树中 DFS 序的相对顺序.

所以考虑增量构造, 把关键点关于 DFS 序排序, 假设已经建立好了前 $i$ 个关键点的虚树, 这时需要加入后面的关键点, 我们希望把新加入的关键点和前 $i$ 个关键点的 LCA 都加入虚树. 因为后面加入的关键点的 DFS 序递增, 因此它们和已经加入的第 $x$ 个点的 LCA 的 DFS 序一定也是单调不降的. 因为 LCA 是最低公共祖先, 所以它怎么样都是第 $x$ 个关键点的祖先, 一个点的祖先的 DFS 序单调不降, 也就是这些祖先的深度单调不降.

根据定义暴力构造就是两两求出 LCA, 把这些点按 DFS 序排序, 直接构造出一棵树, 如果有 $k$ 个关键点, 复杂度 $O(k^2\log n)$.

所以假设 $x$ 后面加入的某个点和 $x$ 的 LCA 深度是 $D$, 那么 $x$ 的深度大于 $D$ 的祖先都永远不会作为后面点和 $x$ 的 LCA. 因此朴素的做法是每个已经加入的点都处理一个单调栈, 一开始压入它所有的祖先, 每次加入新的关键点, 枚举前面所有关键点, 将 LCA 加入虚树, 弹出所有比 LCA 深的点. 如果有 $k$ 个关键点, 这样做的复杂度是 $O(k (n + k\log n))$ 的, 貌似更劣了.

发现加入了 $i$ 个关键点的时候, 已经加入的点的单调栈的并是一个从根节点到第 $i$ 个关键点的路径. 这是因为对于所有前 $i - 1$ 个关键点, 比它和 $i$ 的 LCA 深的祖先都被弹出了. 换句话说, 所有栈中不是第 $i$ 个关键点的祖先的点都被弹出了.

我们可以尝试不维护所有的栈, 全局只维护一个栈, 也就是这条路径. 加入点 $i + 1$ 的时候, 设它和第 $i$ 个关键点的 LCA 为 $u$. 将栈中 $u$ 到关键点 $i$ 的路径弹出, 压入 $u$ 到关键点 $i + 1$ 的路径. 对于已经插入的关键点, 它们和关键点 $i + 1$ 的 LCA 不会比 $u$ 深, 因此这些关键点和关键点 $i + 1$ 的 LCA 也就是它们和 $u$ 的 LCA, 也就是它们和关键点 $i$ 的 LCA, 这些点显然已经加入虚树了, 所以无需讨论, 每次插入时只要把 $u$ 加入虚树即可. 如果有 $k$ 个关键点, 这样做的复杂度是 $O(k\log n + n)$ 的.

重新审视我们的过程, 发现维护这个路径只是为了求边权, 所以根本不需要维护这条路径, 有用的只有栈中所有被加入虚树的点, 我们每次弹出点的时候, 用各种树上数据结构来求出路径信息作为边权即可. 假设求路径信息的复杂度是 $t$, 有 $k$ 个关键点, 那么复杂度可以优化到 $O(k(\log n + t))$.

## 代码实现

我们用倍增求 LCA, 顺便求路径最小值. 可以做到 $O((n + \sum k)\log n)$. 代码还是很清晰的, 调完了样例就过了, 好久没有一遍过的感觉了.

这是我第一次写虚树, 所以代码还没有那么成熟.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Tree {
  vector<pair<Tree*, unsigned> > E;
  Tree* Fa[19];
  unsigned Min[19], Dep, DFSr;
  inline void DFS() {
    DFSr = ++Cnt, memset(Min + 1, 0x3f, 72);
    for (unsigned i(0); Fa[i]; ++i)
      Fa[i + 1] = Fa[i]->Fa[i], Min[i + 1] = min(Min[i], Fa[i]->Min[i]);
    for (auto i:E) if(Fa[0] != i.first) 
      i.first->Dep = Dep + 1, i.first->Fa[0] = this, i.first->Min[0] = i.second, i.first->DFS();
  }
  inline unsigned Qry(Tree* Ac) {
    Tree* x(this);
    unsigned Rt(0x3f3f3f3f);
    for (unsigned i(17); ~i; --i)
      if((x->Fa[i]) && (x->Fa[i]->Dep >= Ac->Dep)) Rt = min(Rt, x->Min[i]), x = x->Fa[i];
    return Rt;
  }
}T[250005];
inline Tree* LCA(Tree* x, Tree* y) {
  if(x->Dep < y->Dep) swap(x, y);
  for (unsigned i(17); ~i; --i) 
    if((x->Fa[i]) && (x->Fa[i]->Dep >= y->Dep)) x = x->Fa[i];
  if(x == y) return x;
  for (unsigned i(17); ~i; --i)
    if(x->Fa[i] != y->Fa[i]) x = x->Fa[i], y = y->Fa[i];
  return x->Fa[0];
}
struct Node {
  vector<Node*> Son;
  Tree* Ori;
  unsigned long long f;
  unsigned ToFa;
  inline const char operator< (const Node& x) const {return Ori->DFSr < x.Ori->DFSr;}
  inline void AddSon(Node* x) {
    Son.push_back(x);
    x->ToFa = x->Ori->Qry(this->Ori);
  }
  inline void DFS() {
    for (auto i:Son) i->DFS(), f += min((unsigned long long)i->ToFa, i->f);
  }
}N[250005], *Stack[250005], *CntN(N), **STop(Stack);
signed main() {
  n = RD();
  for (unsigned i(1); i < n; ++i) {
    A = RD(), B = RD(), C = RD();
    T[A].E.push_back({T + B, C});
    T[B].E.push_back({T + A, C});
  }
  T[1].Min[0] = 0x3f3f3f3f, T[1].Dep = 1, T[1].DFS(), m = RD();
  for (unsigned i(1); i <= m; ++i) {
    while (CntN > N) (CntN--)->Son.clear();
    A = RD(), CntN = A + N + 1, STop = Stack;
    for (unsigned j(1); j <= A; ++j) 
      N[j].f = 0x3f3f3f3f3f3f3f3f, N[j].Ori = T + RD(), N[j].Son.clear(), N[j].ToFa = 0;
    N[++A].Ori = T + 1, N[A].f = 0, sort(N + 1, N + A + 1), *(++STop) = N + 1;
    for (unsigned j(2); j <= A; ++j) {
      Tree* Lca(LCA(N[j].Ori, N[j - 1].Ori));
      while((STop > Stack + 1) && ((*(STop - 1))->Ori->Dep >= Lca->Dep))
        (*(STop - 1))->AddSon(*STop), --STop;
      Tree* Top((*STop)->Ori);
      if (Top == Lca) {*(++STop) = N + j; continue;}
      Node* Cur(++CntN);
      Cur->Ori = Lca, Cur->f = 0;
      if (Top->Dep > Lca->Dep) Cur->AddSon(*(STop--));
      *(++STop) = Cur, *(++STop) = N + j;
    }
    while (STop > Stack + 1) (*(STop - 1))->AddSon(*STop), --STop;
    N[1].DFS();
    printf("%llu\n", N[1].f);
  }
  return Wild_Donkey;
}
```

