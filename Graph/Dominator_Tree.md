# 支配树 (Dominator Tree)

## 小贴士

由于一些原因, 支配树的中文条目和英文条目有一些出入, 不同的地方在中文词条是不能自恰的, 在这里提醒一下. 写这段文字时的版本是[这个 (可能要复制链接访问而不是单击访问)](https://zh.wikipedia.org/w/index.php?title=%E6%94%AF%E9%85%8D_(%E5%9C%96%E8%AB%96)&oldid=70026716), 表格中 $5$ 号点没有 idom, 而按照左边的定义和英文条目来看, $5$ 号点的 idom 是 $2$, 也应该是 $2$.

## 一些定义

对于 $i$ 支配 $j$, 我们称 $i$ 是 $j$ 的必经点 (dom). 点 $i$ 的最近必经点 (idom) 必须满足除了它本身外不支配任何支配 $i$ 的节点. 记 $Fa_i$ 表示 $i$ 的 idom.

## 预处理

我们一开始从 $1$ 点开始 DFS, 记录每个点的 DFS 序 (DFN).

## 半必经点

定义 $y$ 为 $x$ 的半必经点 (semi), 需要存在 $y$ 到 $x$ 的一条路径上除了两端的 $x$, $y$, 剩下的任何点 $i$ 都满足 $DFN_i > DFN_x$. 我们记 $Sem_i$ 表示 $i$ 的 DFN 最小的 semi.

每个点 DFS 树上的父亲一定是它的一个 semi. 这样就可以推出 $Sem_i$ 一定是 $i$ 的一个祖先. 如果 $Sem_i$ 不是 $i$ 的父亲, 则它不是 $i$ 的祖先就是和 $i$ 无直系关系, 在另一棵更先搜索的子树上. 但是后者矛盾是因为如果存在一条路径从更先搜索的 $Sem_i$ 到 $i$, 那么 $i$ 也会比它的父亲更先搜索. 因此 $Sem_i$ 一定是祖先.  

如果存在边 $x \rightarrow y$, 并且 $DFN_x < DFN_y$, 也就是说这是一条 DFS 树上的树边, $x$ 是 $y$ 的父亲, 则 $x$ 显然是 $y$ 的一个 semi.

如果 $DFN_x > DFN_y$, 那么这是横叉边或回边, 那么 $x$ 和它满足 $DFN_i > DFN_y$ 的祖先 $i$ 的 $Sem$ 也是 $y$ 的 semi.

设点 $i$ 是 $x$ 或它的祖先, 满足 $DFN_i > DFN_y$. 我们一定可以找到一条 $i$ 到 $x$ 的树边路径, 然后接上 $x \rightarrow y$ 变成 $i$ 到 $y$ 的路径, 根据定义能找到一条 $Sem_i$ 到 $i$ 的路径, 路径上其它点 $j$ 的 $DFN_j > DFN_i$. 拼接起来得到 $Sem_i$ 到 $y$ 的路径. 如果存在环, 那么我们只截取 $Sem_i$ 到 $y$ 的部分. 无论 $x \rightarrow y$ 是回边还是横叉边, 那么这路径中间的节点 $j$ 一定满足 $DFN_j > DFN_y$, 所以也是 $y$ 的 semi.

推论可以简化为: $x$, $y$ 的 LCA 的子树中的 $x$ 的祖先 (包含 $x$, 不包含 LCA) 的 $Sem$ 中 DFN 最小的一个.

## 求每个点 DFN 最小的 semi

为了求出每个点的 $Sem$, 我们按 DFS 序倒着枚举, 对每个点枚举它的所有入边, 如果是父亲, 那么就直接更新 $Sem$, 如果是横叉边或回边, 那么这个前驱点一直到 LCA 路径上所有点 (不包含 LCA) 的 $Sem$ 应该已经算完了, 并且 LCA 和它祖先的 $Sem$ 一定没算, 我们用并查集维护每个点到根的路径上, 所有确定 $Sem$ 值的点的 $Sem$ 最小值, 这样可以 $O(\log n)$ 对横叉边和回边进行查询.

## 求每个点的 idom

$Fa_i$ 一定是 $Sem_i$ 或它的祖先. 因为 $Fa_i$ 支配 $i$, 因此一定是 $i$ 的祖先.

当 $Sem_i$ 是 $i$ 在 DFS 树上的父亲的时候, 同为 $i$ 祖先的 $Fa_i$ 一定满足不是 $Sem_i$ 就是它的祖先的条件.

当 $Sem_i$ 不是 $i$ DFS 树上的父亲的时候, $Sem_i$ 可以找到包含非树边的路径到 $i$, 因此这时 $Fa_i$ 不可能是 $Sem_i$ 的后代.

我们找到 $Sem_i$ 到 $i$ 路径上, 除 $Sem_i$ 以外的所有点, $Sem$ 最小的是 $j$.

如果能够找到路径绕开 $Sem_i$, 则一定有 $DFN_{Sem_j} < DFN_{Sem_i}$. 所以如果 $Sem_j = Sem_i$ 的情况, 就有 $DFN_{Fa_i} \geq DFN_{Sem_i}$, 又因为 $Fa_i$ 是 $Sem_i$ 或它的祖先, 因此 $Fa_i = Sem_i$.

如果真的可以绕开, 那么支配 $i$ 的必要条件就是支配 $j$. 又因为 $Sem_j$ 一定是绕开 $Sem_i$ 的路径中, 离开树边最早的点, 因此支配 $j$ 也是支配 $i$ 的充分条件. 综上, $Fa_i = Fa_j$.

## 快速求 $j$

我们发现在求 $Sem$ 的时候我们也维护了树上一条链的 $DFN_{Sem_i}$ 最小的 $i$. 每次求 $x$ 的 $Sem$ 之前, 一定已经求出了 DFS 树上 $x$ 的所有后代的 $Sem$, 也就是说所有以 $x$ 作为 $Sem$ 的点都被求出来了. 这时遍历所有 $Sem_y = x$ 的 $y$, 用并查集查到的便是 $y$ 的 $j$ 值.

最后通过每个点的 $j$ 值按 DFN 从小到大扫一遍, 进行上面对 $Sem$ 的判断然后给 $Fa$ 赋值即可.

最后是代码, 这就是面向 `vector` 编程.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node;
struct Set {
  Set* Fa;
  Node* Val;
}S[200005], *Stack[200005], **STop(Stack);
struct Node {
  vector<Node*> E, IE, DFSSon, SemSon, Son;
  Node *Sem, *Fa, *J;
  unsigned DFN, Size;
  inline void DFSforDFN();
  inline void DFSforSize();
  inline char Les(Node* x) {return Sem->DFN < x->Sem->DFN;}
}N[200005], *Rk[200005];
inline Node* Find(Set* x) {
  while (x != x->Fa) *(++STop) = x, x = x->Fa;
  Node* Cur(x->Val);
  while (STop > Stack)
    Cur = ((*STop)->Val = (Cur->Les((*STop)->Val)) ? Cur : (*STop)->Val), (*(STop--))->Fa = x;
  return Cur;
}
inline void Node::DFSforDFN() {
  Rk[DFN = ++Cnt] = this;
  for (auto i:E) if(!(i->DFN)) DFSSon.push_back(i), i->DFSforDFN();
}
inline void Node::DFSforSize() {
  Size = 1;
  for (auto i:Son) i->DFSforSize(), Size += i->Size;
}
signed main() {
  n = RD(), m = RD(); 
  for (unsigned i(1); i <= m; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].IE.push_back(N + A); 
  N[1].DFSforDFN(), N[n + 1].DFN = 0x3f3f3f3f;
  for (unsigned i(1); i <= n; ++i) S[i] = {S + i, N + i};
  for (unsigned i(1); i <= n; ++i) N[i].J = N + i;
  for (unsigned i(n); i; --i) {
    Node* Cur(Rk[i]);
    for (auto j:Cur->SemSon) {
      Node* Get(Find(S + (j - N)));
      if(Get->Les(j->J)) j->J = Get;
    }
    Cur->Sem = N + n + 1;
    for (auto j:Cur->IE) {
      if(j->DFN < Cur->DFN) Cur->Sem = (Cur->Sem->DFN > j->DFN) ? j : Cur->Sem;
      else {
        Node* Get(Find(S + (j - N)));
        Cur->Sem = (Get->Les(Cur)) ? Get->Sem : Cur->Sem;
      }
    }
    Cur->Sem->SemSon.push_back(Cur);
    for (auto j:Cur->DFSSon) S[j - N].Fa = S + (Cur - N);
  }
  for (unsigned i(1); i <= n; ++i) {
    Node* Cur(Rk[i]);
    if(Cur->J->Sem == Cur->Sem) Cur->Fa = Cur->Sem;
    else Cur->Fa = Cur->J->Fa;
  }
  for (unsigned i(2); i <= n; ++i) N[i].Fa->Son.push_back(N + i);
  N[1].DFSforSize();
  for (unsigned i(1); i <= n; ++i) printf("%u ", N[i].Size); putchar(0x0A);
  return Wild_Donkey;
}
```