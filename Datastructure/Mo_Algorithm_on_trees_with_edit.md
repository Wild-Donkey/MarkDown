# 树上带修莫队

前置当然是[莫队算法](https://www.luogu.com.cn/blog/Wild-Donkey/pian-fen-dai-shi-mu-dui), [带修莫队](https://www.luogu.com.cn/blog/Wild-Donkey/dai-xiu-pian-fen-mu-dui-post), [树上莫队](https://www.luogu.com.cn/blog/Wild-Donkey/shu-shang-pian-fen-mu-dui-post). 树上带修莫队是这三者的结合体.

因为已经掌握了带修莫队和树上莫队, 所以需要阐述的东西不多, 直接结合经典题[糖果公园](https://www.luogu.com.cn/problem/P4074)分析该算法.

## 题面简述

一棵树, $n$ 个点, 每点颜色为 $m$ 中颜色中的一种. $V_i$ 表示第 $i$ 种颜色的权值. $W_i$ 表示一种颜色出现第 $i$ 次的权值. 两种操作, 一种是将单点的颜色修改为已有的 $m$ 种颜色中的另一种. 第二种操作是对这棵树上的路径进行查询. 如果用 $Cnt_i$ 表示路径上颜色为 $i$ 的点的出现次数, 则一个路径的权值是这个路径上的所有颜色的权值乘它们的出现次数对应的权值的前缀和的总和. 可能语言表述有些绕, 接下来用公式表示. 

$$
\sum_{i = 1}^{m}(V_i\sum_{j = 1}^{Cnt_i}(W_j))
$$

## 思路

首先考虑不带修改的做法: 把树拍扁成一个 $2n$ 长度的括号序列, 然后对序列上的颜色出现的数量进行查询, 同时维护 $Ans$.

然后考虑加上修改, 保存修改序列, 然后对欧拉序跑带修莫队即可.

分析块长, 我们知道对于一个序列长为 $n$, 查询 $m$ 次, 修改 $t$ 次的问题, 最佳块长是 $\sqrt [3]{\frac{n^2t}{2m}}$, 但是我们的序列长度是 $2n$, 所以带修莫队的最优块长是 $\sqrt [3]{\frac{2n^2t}{m}}$, 考虑代码写完之后修正一下对时间增量的常数和对端点增量的常数差距, 所以将块长暂时规定为 $2\sqrt [3]{\frac{n^2t}{m}}$.

进行块长常数修正:

| 块长                           | 时间   |
| ------------------------------ | ------ |
| $2\sqrt [3]{\frac{n^2t}{m}}$   | 15.49s |
| $3\sqrt [3]{\frac{n^2t}{m}}$   | 13.87s |
| $3.5\sqrt [3]{\frac{n^2t}{m}}$ | 12.63s |
| $4\sqrt [3]{\frac{n^2t}{m}}$   | 13.92s |
| $4.5\sqrt [3]{\frac{n^2t}{m}}$ | 14.13s |

所以对本代码来说, 最优块长是 $3.5\sqrt [3]{\frac{n^2t}{m}}$

值得一提的是, 这个题不需要离散化.

虽然是已经学过的算法的结合体, 但是仍然有一些新的细节, 新东西不多, 已经放在代码注释里.

为了减少代码难度, 将增量封装成函数 `Turb()`, 意为 `扰动`, 用来改变一个点的贡献状态 (改变包含或不包含在答案中的状态).

接下来放出主体代码:

```cpp
unsigned m, n, q, CntEu(0), CntQ(0), A, B, C, D, t, Tmp(0), Time, Cnt[100005], BlockLen, Block[200005];
unsigned long long W[100005], V[100005], Ans[100005];
struct Edge;
struct Node {
  Edge *Fst;
  Node *Fa[20];
  unsigned Dep, Frnt, Back, Col;
  char Have;
}N[100005], *Euler[200005], *Ace(N);
struct Edge {
  Edge *Nxt;
  Node *To;
}E[200005], *CntE(E);
inline void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst;
  x->Fst = CntE;
  CntE->To = y;
  return;
}
void DFS(Node *x) {
  x->Frnt = ++CntEu;
  Euler[CntEu] = x;
  Edge *Sid(x->Fst);
  while (Sid) {
    if(Sid->To != x->Fa[0]) {
      Sid->To->Fa[0] = x;
      Sid->To->Dep = x->Dep + 1;
      for(register unsigned i(0); Sid->To->Fa[i]; ++i) {
        Sid->To->Fa[i + 1] = Sid->To->Fa[i]->Fa[i];
      }
      DFS(Sid->To);
    }
    Sid = Sid->Nxt;
  }
  x->Back = ++CntEu;
  Euler[CntEu] = x;
}
Node *LCA(Node *x, Node *y) {
  if(x->Dep < y->Dep) {
    Node *TmpNd(x); x = y, y = TmpNd;
  }
  for (register unsigned i(19); x->Dep > y->Dep; --i) {
    if(x->Fa[i]) {
      x = (x->Fa[i]->Dep >= y->Dep) ? x->Fa[i] : x;
    }
  }
  if (x == y) {
    return x;
  }
  for (register unsigned i(19); x->Fa[0] != y->Fa[0]; --i) {
    if(x->Fa[i] != y->Fa[i]) {
      x = x->Fa[i], y = y->Fa[i];
    }
  }
  return x->Fa[0];
}
struct Qry {
  unsigned L, R, Ti, Num;
  inline const char operator<(const Qry &x) const {
    return (Block[this->L] ^ Block[x.L]) ? (Block[this->L] < Block[x.L]) : ((Block[this->R] ^ Block[x.R]) ? (Block[this->R] < Block[x.R]) : this->Ti < x.Ti);
  }
}Q[100005];
struct Change{
  Node *Addre;
  unsigned Value;
}Chg[100005];
inline void Turb(Node *x) { // 对某个节点进行状态改变 (没统计就统计, 已经统计就删去) 
  if(x->Have ^= 1) {  // 之前没统计 
    Ans[0] += W[++Cnt[x->Col]] * V[x->Col];
  } else {            // 之前统计过一次 
    Ans[0] -= W[Cnt[x->Col]--] * V[x->Col];
  }
  return;
}
int main() {
  n = RD(), m = RD(), q = RD(); 
  for (register unsigned i(1); i <= m; ++i) {
    V[i] = RD();
  }
  for (register unsigned i(1); i <= n; ++i) {
    W[i] = RD();
  }
  for (register unsigned i(1); i < n; ++i) {
    A = RD();
    B = RD();
    Link(N + A, N + B);
    Link(N + B, N + A);
  }
  N[1].Dep = 1;
  N[1].Fa[0] = NULL;
  DFS(N + 1);
  Time = 1; // 没有修改, 最初的时刻 
  for (register unsigned i(1); i <= n; ++i) {
    N[i].Col = RD();
  }
  for (register unsigned i(1); i <= q; ++i) {
    if(RD()) {      // 询问, 将路径转化为区间 
      A = RD();
      B = RD();
      if (N[A].Frnt <= N[B].Frnt) {
        if (N[A].Back <= N[B].Frnt) {
          Q[++CntQ].L = N[A].Back;
          Q[CntQ].R = N[B].Frnt;
        } else {
          Q[++CntQ].L = N[A].Frnt;
          Q[CntQ].R = N[B].Frnt;
        }
      } else {
        if (N[A].Back <= N[B].Back) {
          Q[++CntQ].L = N[B].Frnt;
          Q[CntQ].R = N[A].Frnt;
        } else {
          Q[++CntQ].L = N[B].Back;
          Q[CntQ].R = N[A].Frnt;
        }
      }
      Q[CntQ].Ti = Time;
      Q[CntQ].Num = CntQ;
    }
    else {          // 修改 
      Chg[++Time].Addre = N + RD();
      Chg[Time].Value = RD();
    }
  }
  BlockLen = (pow(((unsigned long long)n * n * Time / CntQ), 1.0/3) * 3.5) + 1; // 经过计算和修正的块长 (不同代码常数不同, 需要自行修正) 
  for (register unsigned i(1); i <= CntEu; ++i) { // 预处理不同坐标属于的块的编号 
    Block[i] = i / BlockLen;
  }
  sort(Q + 1, Q + CntQ + 1);
  Q[0].Ti = 1;
  Q[0].L = 1;
  Q[0].R = 1;
  Ans[0] = V[Euler[1]->Col] * W[++Cnt[Euler[1]->Col]];
  Euler[1]->Have ^= 1;  // 初始化, 开始增量 
  for (register unsigned i(1), TmpSw; i <= CntQ; ++i) {
    while (Q[0].Ti < Q[i].Ti) { // 时间正流 
      ++Q[0].Ti;
      if (Chg[Q[0].Ti].Addre->Have) {
        Turb(Chg[Q[0].Ti].Addre);
        TmpSw = Chg[Q[0].Ti].Addre->Col, Chg[Q[0].Ti].Addre->Col = Chg[Q[0].Ti].Value, Chg[Q[0].Ti].Value = TmpSw;
        Turb(Chg[Q[0].Ti].Addre);
      }
      else {
        TmpSw = Chg[Q[0].Ti].Addre->Col, Chg[Q[0].Ti].Addre->Col = Chg[Q[0].Ti].Value, Chg[Q[0].Ti].Value = TmpSw;
      }
    }
    while (Q[0].Ti > Q[i].Ti) { // 时间倒流 
      if (Chg[Q[0].Ti].Addre->Have) {
        Turb(Chg[Q[0].Ti].Addre);
        TmpSw = Chg[Q[0].Ti].Addre->Col, Chg[Q[0].Ti].Addre->Col = Chg[Q[0].Ti].Value, Chg[Q[0].Ti].Value = TmpSw;
        Turb(Chg[Q[0].Ti].Addre);
      }
      else {
        TmpSw = Chg[Q[0].Ti].Addre->Col, Chg[Q[0].Ti].Addre->Col = Chg[Q[0].Ti].Value, Chg[Q[0].Ti].Value = TmpSw;
      }
      --Q[0].Ti;
    }
    while (Q[0].L > Q[i].L) {Turb(Euler[--Q[0].L]);}  // 左端点左移 
    while (Q[0].R < Q[i].R) {Turb(Euler[++Q[0].R]);}  // 右端点右移 
    while (Q[0].L < Q[i].L) {Turb(Euler[Q[0].L++]);}  // 左端点右移 
    while (Q[0].R > Q[i].R) {Turb(Euler[Q[0].R--]);}  // 右端点左移 
    Ace = LCA(Euler[Q[0].L], Euler[Q[0].R]);
    if(Ace == Euler[Q[0].L] || Ace == Euler[Q[0].R]) {  // 垂直的链, LCA 是两点之一 
      Ans[Q[i].Num] = Ans[0];
    } else {                                            // 需要单独考虑 LCA 的贡献 
      Turb(Ace);
      Ans[Q[i].Num] = Ans[0];
      Turb(Ace);
    }
  }
  for (register unsigned i(1); i <= CntQ; ++i) {
    printf("%llu\n", Ans[i]);
  }
  return Wild_Donkey;
}
```