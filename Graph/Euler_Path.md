# Euler Path

欧拉路径, 即为一个有向图中, 能遍历整个图的所有边, 并且每条边只经过一次的路径.

因为看到[二gou子](https://www.luogu.com.cn/user/306982)学习了此内容, 所以我的博客才能在 NOIP 前一周内出现一篇学习笔记.

## 解存在的判定

不证自明地, 要想一条路径遍历所有边, 必须保证将有向边看成无向边后, 图是连通的.

就是除了起点和终点, 每个点的入度和出度都应该相等, 因为这些点每进入一次, 就要离开一次, 每次从不同的来边进入, 也从不同的出边离开.

如果起点和终点不同, 那么起点的出度比入度大 $1$, 终点的出度比入度大 $1$.

如果起点和终点相同, 那么所有点的出度应该等于入度.

## 求解

如果判定有解, 那么考虑构造一组解.

如果所有点出度等于入度, 随意找个点做起点, 新建一个点作为终点, 从起点往终点连一条边, 这样就可以正常构造了, 而这条边一定是路径最后一条边, 因为终点没有出度, 走到这个点就走到头了. 因此构造完删掉这条边即可.

如果不是, 那么选择那个出度比入度大 $1$ 的点作为起点.

从起点开始 DFS, 接下来会分别遍历所有出边, 每条出边会有两个结果, 第一个是回到这个点, 第二个是不会走回来, 走到死路返回了.

对于最终回到这个点的出边, 它会消耗一条入边和一条出边. 而不回来的边, 它会消耗一条出边, 所以显然, 一定是最后走这条出边.

所以我们只要维护一个栈, 把死路的边从末端开始都堆进去, 倒序一个一个出栈便是欧拉路的最后一段.

当删掉一段死路之后, 这段死路的起点的出度一定会比入度多减少 $1$, 原本出度等于入度, 删除死路之后, 出度少 $1$, 这个点变成新的终点, 变成新的死路末端.

## 代码实现

因为和一般 DFS 不同, 这里的 DFS 不是遇到已经遍历过的节点就跳过, 而是根据边是否经过来遍历, 所以一个点可能在调用栈中出现多次, 所以写法也略有不同.

朴素的做法是每次进入一个新点, 把对应入边打标记, 下次不能再走了. 当一个点所有出边都打上标记, 并且所有边打标记进入别的点后都返回了, 则找到了死路, 便将这个点加入栈中.

但是发现如果按顺序枚举出边, 一定不存在排在前面的出边未经过, 而排在后面的边已经过的情况, 所以考虑当前弧优化, 每个点记录当前有多少出边已经使用了, 每次按顺序使用一个即可.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0), ATop(0);
unsigned Ans[200005], Top(0);
struct Node;
struct Edge {
  Node* To;
}E[200005];
inline char Cmp(Edge* x, Edge* y) {return x->To < y->To;}
struct Node {
  vector <Edge*> To; 
  unsigned Last, Idg, Odg;
}N[100005], *S, *T;
inline void DFS(Node* x) {
  for (;x->Last < x->To.size();) DFS(x->To[(x->Last)++]->To);
  Ans[Top--] = x - N;
}
signed main() {
  n = RD(), Top = (m = RD() + 1);
  for (unsigned i(1); i < m; ++i) {
    ++(N[A = RD()].Odg), ++(N[B = RD()].Idg);
    E[i].To = N + B;
    N[A].To.push_back(E + i);
  }
  for (Node* i(N + n); i > N; --i) {
    sort(i->To.begin(), i->To.end(), Cmp);
    if(i->Idg == i->Odg) continue;
    if(i->Idg == (i->Odg + 1)) {
      if(T){printf("No\n"); return 0;}
      T = i; continue;
    }
    if((i->Idg + 1) == i->Odg) {
      if(S){printf("No\n"); return 0;}
      S = i; continue;
    }
    printf("No\n"); return 0;
  }
  if(!S) S = N + 1, T = N + n + 1, E[m + 1].To = T, S->To.push_back(E + m + 1);
  DFS(S);
  if(Ans[0]) for (unsigned i(0); i < m; ++i) printf("%u ", Ans[i]);
  else for (unsigned i(1); i <= m; ++i) printf("%u ", Ans[i]);
  putchar(0x0A);
  return Wild_Donkey;
}
```