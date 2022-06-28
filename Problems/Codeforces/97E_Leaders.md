# CF97E Leaders

## 简要题意

给一个简单无向图，询问两个点之间是否存在长度为奇数的简单路径。简单路径定义为没有重复点的路径，路径长度定义为边数。

## 点双

这里简单路径的定义是每个点出现最多一次的路径，所以优先考虑点双。发现点双里面，只要有至少一个奇环，任意两点间都存在奇路径。

## 点的类型

继续探索发现如果每个点双对应的方点的父亲称为 "主割点"，那么一个点双内，除了主割点，一个点到主割点有三种状态，没有奇路径，存在奇偶路径，仅有奇路径。分别称三种类型的节点为偶点，奇偶点，奇点。

## 求每个点的类型

发现有奇环的点双里，任意两点间都既有奇路径，也有偶路径，所以除主割点外的点都是奇偶点。

如果没有奇环，则 BFS 找到每个点到主点的最短路，最短路的奇偶性就是这个点的奇偶性。

对于找奇环和最短路，为了保证不会被菊花图卡到 $O(n^2)$，借助 [Calvincheng1231](https://www.luogu.com.cn/user/253946) 的题解中的方法，每个点双连通分量建一个新的点双连通图。

## 点双内的路径

对于点双内的情况，两个非主割点的点之间有简单奇路径，当且仅当有至少一个点是奇偶点，或有一个点是奇点。

因为这种情况可以取两个点到主割点的路径，使得路径总和为奇数，把重合部分删除，因为删除一条边，相当于它两次经过的贡献都删除了，所以奇偶性不变。

对于点双内，除主割点外的一点到主割点的路径，这个点只要是奇偶点或奇点，就能找到一条简单奇路径。

## 点双间的路径

接下来讨论一般情况，也就是点双间的路径，因为两点间路径上的割点已经确定了，所以我们只需要依次讨论端点和割点间路径的情况即可。这些点将路径分成了几段。

因为这几段分别在不同的点双内，所以每一段的情况就可以当作点双内部的情况来讨论，对于既有奇数又有偶数路径的段，我们称其为奇偶段，对于只有奇数路径的段，称奇段，没有奇数路径的段，称偶段。

类似地，整条路经存在奇路径，当且仅当这些段中有奇偶段，或者这些段中的奇段数量为奇数。

对于一段路径，如果它的两端有一端是路径所在点双的主割点，那么另一个端点的类型就是这一段的类型。

如果两端都不是路径所在点双的主割点，那么这一段分成两端，两段类型分别是两个点的类型。

## 树链剖分

所以我们需要做的就是查询圆方树上两点间路径上不同类型的圆点数量 (除去 LCA)。就能得到这些段的类型数量，然后 $O(1)$ 判断即可。

用树链剖分维护圆方树，支持查询路径三种类型的点的数量 (其实偶点数量和答案无关，无需维护)。由于无需修改，所以只需要用前缀和查询区间和即可。

总复杂度 $O(n + m + q\log n)$。

## 代码实现

```cpp
unsigned m, M, n, q, Bd;
unsigned A, B, C, D, t;
unsigned STop(0), ETop(0), Hd, Tl;
unsigned Cnt(0), CntCo(0), Ans[3];
unsigned Sum[200005][2], Tmp(0);
struct Node;
struct NNode;
struct Edge {
  Node* To, * Frm;
  Edge* Nxt;
}E[200005], *EStack[200005];
struct Node {
  Edge* Fst;
  NNode* Last;
  Node* Fa, * Bro, * Son, * Heavy, * Top;
  unsigned DFSr, Low, Dep, Size, BelC;
  char Type;
}N[200005], * Stack[100005], * CntN;
struct NEdge {
  NNode* To;
  NEdge* Nxt;
}NE[400005], *CntNE(NE);
struct NNode{
  NEdge* Fst;
  Node* Old;
  char Col, Dist;
}NN[200005], * Q[200005], *CntNN(NN);
inline void Tarjan(Node* x) {
  x->Low = x->DFSr = ++Cnt, x->BelC = CntCo, Stack[++STop] = x;
  Edge* Sid(x->Fst);
  while (Sid) {
    EStack[++ETop] = Sid;
    if(Sid->To->DFSr) {
      if(Sid->To->Fa) --ETop;
      x->Low = min(x->Low, Sid->To->DFSr);
    }
    else {
      unsigned LastTop(ETop);
      Tarjan(Sid->To), x->Low = min(x->Low, Sid->To->Low);
      if(Sid->To->Low == x->DFSr) {
        Node* Cur(++CntN);
        Cur->Fa = x, Cur->Bro = x->Son, x->Son = Cur;
        x->Last = Cur->Last = ++CntNN, CntNN->Old = x; 
        do {
          Stack[STop]->Bro = Cur->Son, Cur->Son = Stack[STop];
          Stack[STop]->Last = ++CntNN, (CntNN->Old = Stack[STop])->Fa = Cur;
        } while (Stack[STop--] != Sid->To);
        NNode * LiF, * LiT;
        do {
          LiF = EStack[ETop]->Frm->Last, LiT = EStack[ETop]->To->Last;
          (++CntNE)->Nxt = LiF->Fst, LiF->Fst = CntNE, CntNE->To = LiT;
          (++CntNE)->Nxt = LiT->Fst, LiT->Fst = CntNE, CntNE->To = LiF;
        } while ((ETop--) ^ LastTop);
      }
    }
    Sid = Sid->Nxt;
  }
}
inline void BFS(Node* x) {
  char Flg(0);
  Hd = Tl = 0, (Q[++Tl] = x->Last)->Col = 1, x->Last->Dist = 1;
  while (Hd ^ Tl) {
    NNode* Cur(Q[++Hd]);
    NEdge* Sid(Cur->Fst);
    while (Sid) {
      Sid->To->Col |= (Cur->Col ^ 3);
      if(Sid->To->Col == 3) {Flg = 1; break;}
      if(!(Sid->To->Dist)) (Q[++Tl] = Sid->To)->Dist = Cur->Dist + 1;
      Sid = Sid->Nxt;
    }
    if(Flg) break;
  } 
  if(Flg) x->Type = 2;
  else
    for (unsigned i(2); i <= Hd; ++i)
      Q[i]->Old->Type = ((Q[i]->Dist & 1) ? 0 : 1);
}
inline void PreDFS (Node* x) {
  x->Size = 1;
  Node* Cur(x->Son);
  unsigned Mx(0);
  while (Cur) {
    Cur->Dep = x->Dep + 1, PreDFS(Cur), x->Size += Cur->Size;
    if(Cur->Size > Mx) x->Heavy = Cur, Mx = Cur->Size;
    Cur = Cur->Bro;
  }
}
inline void DFS (Node* x) {
  x->DFSr = ++Cnt;
  if(x->Type) Sum[Cnt][x->Type - 1] = 1;
  if(!(x->Heavy)) return;
  x->Heavy->Top = x->Top, DFS(x->Heavy);
  Node* Cur(x->Son);
  while (Cur) {
    if(Cur != x->Heavy) Cur->Top = Cur, DFS(Cur);
    Cur = Cur->Bro;
  }
}
inline char Ask(Node* x, Node* y) {
  Ans[1] = Ans[2] = 0;
  while (x->Top != y->Top) {
    if(x->Top->Dep < y->Top->Dep) swap(x, y);
    C = x->Top->DFSr, D = x->DFSr, x = x->Top->Fa;
    Ans[1] += Sum[D][0] - Sum[C - 1][0];
    Ans[2] += Sum[D][1] - Sum[C - 1][1];
  }
  if(x->Dep < y->Dep) swap(x, y);
  C = y->DFSr, D = x->DFSr, x = y;
  Ans[1] += Sum[D][0] - Sum[C - 1][0];
  Ans[2] += Sum[D][1] - Sum[C - 1][1];
  --Ans[x->Type];
  if(Ans[2] || (Ans[1] & 1)) return 1;
  return 0;
}
signed main() {
  n = RD(), M = ((m = RD()) << 1), CntN = N + n;
  for (unsigned i(0); i < M; i += 2) {
    A = RD(), B = RD();
    E[i].Nxt = N[A].Fst, N[A].Fst = E + i;
    E[i ^ 1].Nxt = N[B].Fst, N[B].Fst = E + (i ^ 1);
    E[i].To = N + B, E[i].Frm = N + A;
    E[i ^ 1].To = N + A, E[i ^ 1].Frm = N + B;
  }
  for (unsigned i(1); i <= n; ++i) if(!(N[i].DFSr)) ++CntCo, Tarjan(N + i);
  Cnt = 0;
  for (Node* i(N + n + 1); i <= CntN; ++i) BFS(i);
  for (unsigned i(1); i <= n; ++i) if(N[i].Fa && N[i].Fa->Type) N[i].Type = 2;
  for (unsigned i(1); i <= n; ++i) if(!N[i].Size) N[i].Dep = 1, PreDFS(N + i);
  for (unsigned i(1); i <= n; ++i) if(!N[i].Top) N[i].Top = N + i, DFS(N + i);
  for (unsigned i(1); i <= Cnt; ++i) Sum[i][0] += Sum[i - 1][0], Sum[i][1] += Sum[i - 1][1];
  for (unsigned i(RD()); i; --i) {
    A = RD(), B = RD(), --q;
    if(A == B) {printf("No\n");continue;}
    if(N[A].BelC ^ N[B].BelC) {printf("No\n");continue;}
    printf(Ask(N + A, N + B) ? "Yes\n" : "No\n");
  } 
  return Wild_Donkey;
}
```