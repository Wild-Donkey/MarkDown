# NWRRC2015 Insider’s Information

## 题意

对于 $[1, n]$ 的排列，给 $m$ 个限制，第 $i$ 个限制描述 $b_i$ 出现在 $a_i$，$c_i$ 之间。保证存在一个排列满足所有限制。

构造一个 $n$ 的排列至少满足 $\lceil \frac m2 \rceil$ 个限制。

## 分析

每个限制连接两条有向边 $(a_i，b_i)$，$(c_i，b_i)$，因为所有限制都可以被满足，所以在原序列中的端点一定入度为 $0$。

这个图虽然存在环，但是我们对这个图进行拓扑排序，一次删除一个约束的两条边，仍然是可以将所有点入队出队的，但是排序后仅能保证其中每个约束中，$b$ 点不会同时排在 $a$，$c$ 前面。但是这已经足够做此题了。

证明很简单，如果一个 $b$ 的度变成 $0$，一定是它的所有入边都被删除了，所以不存在 $b$ 被删除，$a$，$c$ 都仍未删除的情况。

我们按拓扑序考虑将点加入最左边还是最右边，从两边往中间堆元素，直到填满排列为止。

对于一个约束，第一个放入的如果是 $b$，则无论 $a$，$b$ 怎么放，都不可能满足约束，而我们的拓扑排序不存在 $b$ 第一个放的情况。

如果第一个放的是 $a$ 或 $c$，第二个放的点的位置就决定了该约束是否能满足。

如果第二个放的是 $b$，那么它放在第一个放的元素同侧，则最后一个元素无论怎么放，约束都满足。如果放在异侧，则无论最后一个元素怎么放，约束都不满足。

如果第二个放的是 $a$ 或 $c$ 那么第三个放的一定是 $b$，所以第一个和第二个放的 $a$，$c$ 只要在异侧，约束一定满足，在同侧则一定不满足。

我们对于每个枚举的元素，统计它属于的约束中，有多少次是第二个放的元素，然后统计这些情况中，是放在左端满足的约束多还是放在右端满足的约束多，放到满足约束多的一侧，这样就保证了一定满足 $\lceil \frac m2 \rceil$ 个限制。

## 代码实现

因为每个约束会给 $b_i$ 带来两个入度，而拓扑排序时我们需要给 $b_i$ 减去两个入度，所以为了方便，不如直接用一个入度表示一个约束。

过程中我们一遍拓扑排序一边处理，因为每个点的位置只和已经放入排列中的点有关，所以这样处理也是正确的。

实现还是很短的，指针轻喷。

```cpp
unsigned m, n, M;
unsigned Top(0), Tl(0), Hd(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans[100005], Tmp(0), BdL(0), BdR;
struct Que;
struct Node {
  vector<Que*> Bel; 
  unsigned Deg;
  char Vis, Le;
}N[100005], * Queue[100005];
struct Que {
  Node* Le, * Ri, * Mid;
  Que* Nxt;
}Q[100005];
signed main() {
  BdR = (n = RD()) + 1, m = RD();
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), ++N[B].Deg;
    Q[i].Le = N + A, N[A].Bel.emplace_back(Q + i);
    Q[i].Mid = N + B, N[B].Bel.emplace_back(Q + i);
    Q[i].Ri = N + C, N[C].Bel.emplace_back(Q + i);
  }
  for (unsigned i(1); i <= n; ++i) if(!N[i].Deg) Queue[++Tl] = N + i;
  while (Tl ^ Hd) {//Topo and Solve 
    Node* Cur(Queue[++Hd]);
    unsigned PutLeft(100000);
    Cur->Vis = 1;
    for (auto Prs:Cur->Bel) {
      if(Cur == Prs->Le) {//Cur is A
        if(Prs->Ri->Vis) {//2nd or 3rd
          if(!(Prs->Mid->Vis)) {if(Prs->Ri->Le) --PutLeft; else ++PutLeft;}//2nd Add
        } else if(!(--(Prs->Mid->Deg))) Queue[++Tl] = Prs->Mid;//1st Add
      } else {//Cur is C or B
        if(Cur == Prs->Ri) {//Cur is C
          if(Prs->Le->Vis) {//2nd or 3rd
            if(!(Prs->Mid->Vis)) {if(Prs->Le->Le) --PutLeft; else ++PutLeft;}//2nd Add
          } else if(!(--(Prs->Mid->Deg)))Queue[++Tl] = Prs->Mid; //1st Add
        } else {//Cur is B
          if(!((Prs->Ri->Vis) & (Prs->Le->Vis))) {//2nd Add
            if(Prs->Ri->Vis) {if(Prs->Ri->Le) ++PutLeft;else --PutLeft;}//1st is C
            else {if(Prs->Le->Le) ++PutLeft;else --PutLeft;}//1st is A
          }
        }
      }
    }
    Cur->Le = (PutLeft >= 100000);
    Ans[(PutLeft < 100000) ? (--BdR) : (++BdL)] = Cur - N; 
  }
  for (unsigned i(1); i <= n; ++i) printf("%u ", Ans[i]);
  return Wild_Donkey;
}
```