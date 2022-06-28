# k-d tree

## 定义

一种平衡树, 维护 $k$ 维空间中的点的信息.

每个节点表示一个点, 每个子树表示对应的 $k$ 维超长方体. 这样说可能过于抽象, 那就先分析特殊情况, 因为 $k = 1$ 的时候, 维护的信息是序列上的, 所以这时的 `1-d Tree` 就是普通平衡树.

$k = 2$ 的情况, 维护的是平面上的点, 每次选一个点, 将平面分成两半, 左右子树各占存一半的点. 每次选点之前, 首先确定要分割的这个四边形, 将要存入这个子树中的所有点的横纵坐标最大值和最小值都求出来, 这 $4$ 个坐标围起来的四边形就是要分割的四边形.

然后选择这个点, 看这个四边形是横着比较长还是竖着比较长, 也就是说我们要尽量保证这个四边形的长宽差越小越好. 不失一般性, 假设这个四边形是躺着的, 也就是横着比较长. 这时需要把它竖着劈成两半, 将这些点按横坐标排序, 选中间的点作为割点, 以它的横坐标为标准划一根竖直线, 将四边形分成两个部分, 左边的部分就是这个点的左子树; 右边的部分就是右子树.

## 实现

由于每一个节点的分割方向都可以不同, 所以不能保证中序遍历的点以某种规律单调, 因此没法用基于旋转的平衡树维护, 这时我们就想到了[替罪羊树](https://www.luogu.com.cn/blog/Wild-Donkey/gai-pu-li-shi-jiu-pu-li-ti-zui-yang-shu).

因为没法以中序遍历出的序列为重构之后的树的序, 因此没法想一般替罪羊的重构方式一样重构, 需要重新求每一维坐标的极差, 然后以某个维度的坐标为序排序. 所以一次重构相比一般的替罪羊是增加了一个 $log$ 的, 但是根据前面链接中文章的证明, 重构加一个 $log$ 并不会影响复杂度. (其实还可以使用神奇的 `nth_element()` 避免排序, $O(n)$ 找到中位数, 使一次重构还是线性的).

一般来说, 在大部分需要 k-d tree 的题目中, $k = 2$, 结合具体题目分析:

**[简单题](https://www.luogu.com.cn/problem/P4148)**

## 题意

这道题要求维护一个 $n * n$ 的网格的信息, 这个网格初始都是 $0$, 支持:

* 单点修改

将点 $(x, y)$ 的权值加 $a$, 数量不超过 $2 * 10^5$.

* 矩形查询

查询点 $(x_1, y_1)$ 和点 $(x_2, y_2)$ 确定的矩形的权值总和.

$n \leq 5 * 10^5, Ans \leq 2^{31} - 1$

## 题解

因为网格一开始是空的, 所以不用存储, 权值只能增加, 可以看成 `Insert` $a$ 个点 $(x, y)$.

建一棵 2-d tree, 每个节点保存 $x$, $y$ 表示坐标, $val$ 表示这个点的权值, 每次修改的时候做单点插入.

每个点还需要存 $Min_x$, $Min_y$, $Max_x$, $Max_y$, $Sum$ 来进行查询. 其中 $Min$ 和 $Max$ 描述了包含这个节点的子树中所有节点的最小矩形, 也就是这棵子树对应的矩形, 而 $Sum$ 表示这个节点的子树的权值和.

查询的时候, 如果这个点的子树覆盖的矩形被查询的矩形完全包含, 则将这个节点的 $Sum$ 统计到答案中, 如果不然, 递归两个儿子.

这样做类似于线段树, 只不过是二维的, 接下来分析询问的复杂度. 假设有 $n$ 个点.

因为建立了 2-d tree, 所以原来的网格规模就和复杂度无关了.

首先分析点的分布对复杂度的影响, 当点的坐标在一维上十分集中, 在另一维上十分分散, 那么这棵 2-d tree 就越来越像一棵线段树了, 而线段树的单次询问复杂度是 $O(logn)$.

然后就是两维同样离散, 则一次查询可能访问到的节点数取决于询问矩形的边界分割了多少节点的矩形.

因为一个节点的矩形被分割, 它的祖先的矩形也一定被分割. 所以考虑有多少最小的矩形 (暂时叫它们 "元矩形") 被分割.

这样, 问题转化成了求按 2-d tree 分割后, 一条直线最多经过多少元矩形.

首先, 元矩形的数量是 $O(n)$ 的, 对于两维离散程度相同的情况, 网格应该被分成 $\sqrt n * \sqrt n$ 的元矩形, 则单次查询 $O(\sqrt n)$.

接下来是一般情况, 可能出现的最劣情况.

尝试构造 $\frac n2$ 个横坐标为 $1$ 的点, 然后有 $\frac n2$ 个横坐标为 $2$ 的点, 纵坐标和前面的点一一对应相等. 如果询问所有横坐标为 $1$ 的点, 则需要访问 $O(n)$ 个点, 复杂度 $O(n)$.

但是显然出题人强制在线卡掉 CDQ, $20M$ 空间卡掉树套树, 他应该不会构造这种神奇数据卡掉 k-d tree, 所以就按 k-d tree 来写好了.

## <主   流>

二级标题源自张业琛的温馨提示:

> 按照极差划分的是上世纪的策略啦! 现在, 我们都用这个:

虽然听起来有点像卫生巾广告, 但是这种切法的稳定性确实比原来的切法要强.

对于复杂度是错误的使用广泛的算法 (如快速排序, SPFA等), 一般只有特定的数据才能构造出最劣情况, 所以往往随机化可以减少这种数据的影响.

对于 2-d tree, 本题中貌似不需要矩形都趋近于正方形, 所以在寻找切点的时候可以无视极差, 按照节点深度交替切分. $Dep % 2 = 0$ 时, 找横坐标中位数; $Dep % 2 = 1$ 时, 找纵坐标中位数.

## 时间复杂度的证明:

考虑把原策略卡掉的那组数据, 这种操作下, 一次询问貌似只需要访问 $4$ 个节点 (貌似换一下交替的顺序就是 $2$ 个), 单次复杂度 $O(1)$.

坐标系中的点分布成一个⚪, 切两刀之后, 无论是哪种策略, 点都被分成了 $4$ 个 $\frac 14$ ⚪. 这种图形因为单调性, 无论按哪一维划分, 切点都是一定的, 我们称之为 "众生平等⚪".

众生平等⚪告诉我们, 什么划分的方法都不能改变复杂度, 只能减少被卡的几率. K-D Tree 就是假数据结构, 因为比较好用才流传至今.

数据都是人造的, 俗话说得好, 人卡人, 卡死人, 所以就不管什么维度, 相信随机化的力量. 随机切一维, 可以保证不会被恶意构造数据卡到 $O(n)$, 期望复杂度 $O(\sqrt n)$.

## 实现

由于不需要删除, 所以不需要判断空节点, 也不用写惰性删除, 在每个节点上记录一个 $Size$, 表示这个子树的节点数, 当两个子树极度不平衡时 (左右子树相差 $3$ 倍以上), 重构替罪羊.

对于询问, 根据当前节点的矩形和询问的矩形分类讨论:

* 如果自己的矩形被完全包含, 记录 $Sum$ 到答案中

* 如果自己的矩形和询问矩形无交, 跳出递归

* 其余情况, 判断自己的点是否在询问矩形内, 统计答案, 然后递归左右子树

## 代码

代码方面比替罪羊的逻辑简单, 但是因为多了一维, 所以细节会更多. 但是因为空间限制 $20MB$, 总是 MLE 的我调试的方向一直向着奇怪的地方发展, 从指针改到数组, 结果从 BZOJ 下了数据跑 $m = 100$ 的数据都爆 $500MB$, 恍然大悟重构的时候没有清空叶子节点的左右儿子, 于是改过来以后成功 TLE.

我一开始是按 $y$ 切的, 因为第一篇题解按 $x$ 切都没有被卡, 所以一气之下使用了随机化, 这时, 已经没有随机数据能卡掉我了.

```cpp
unsigned CntN(1), Rbd(0), RbFa(0), Root(1), List[200005], m, n, Cnt(0), A, B, Hd, t, Ans(0), Tmp(0), Opx, Opy, Opx_, Opy_, Opv;
char flg(1), nowDir(1), SonDir(0);
struct Node {
  unsigned LS, RS, Val, Sum, Size, x, y, Minx, Miny, Maxx, Maxy;
  char Dir;
}N[200005];
struct Stack {
  unsigned Val, x, y;
  inline const char operator <(const Stack &sx) const{
    return (nowDir) ? ((this->x ^ sx.x) ? (this->x < sx.x) : (this->y < sx.y)) : ((this->y ^ sx.y) ? (this->y < sx.y) : (this->x < sx.x));
  }
}S[200005];
inline void Clr() {}
unsigned Build(unsigned L, unsigned R) {
  register unsigned now(List[Hd--]);
  if(L == R) {
    N[now].Minx = N[now].Maxx = N[now].x = S[L].x;
    N[now].Miny = N[now].Maxy = N[now].y = S[L].y;
    N[now].Sum = N[now].Val = S[L].Val;
    N[now].Size = 1;
    N[now].LS = N[now].RS = 0;
    return now;
  }
  register unsigned Mid((L + R) >> 1);
   nowDir = rand() % 2;
  N[now].Dir = nowDir;
  nth_element(S + L, S + Mid, S + R + 1);
  N[now].Minx = N[now].Maxx = N[now].x = S[Mid].x;
  N[now].Miny = N[now].Maxy = N[now].y = S[Mid].y;
  N[now].Sum = N[now].Val = S[Mid].Val;
  N[now].Size = 1;
  if(Mid ^ L) {
    N[now].LS = Build(L, Mid - 1);
    N[now].Sum += N[N[now].LS].Sum;
    N[now].Size += N[N[now].LS].Size;
    N[now].Minx = min(N[now].Minx, N[N[now].LS].Minx);
    N[now].Maxx = max(N[now].Maxx, N[N[now].LS].Maxx);
    N[now].Miny = min(N[now].Miny, N[N[now].LS].Miny);
    N[now].Maxy = max(N[now].Maxy, N[N[now].LS].Maxy);
  } else {
    N[now].LS = 0;
  }
  N[now].RS = Build(Mid + 1, R);
  N[now].Sum += N[N[now].RS].Sum;
  N[now].Size += N[N[now].RS].Size;
  N[now].Minx = min(N[now].Minx, N[N[now].RS].Minx);
  N[now].Maxx = max(N[now].Maxx, N[N[now].RS].Maxx);
  N[now].Miny = min(N[now].Miny, N[N[now].RS].Miny);
  N[now].Maxy = max(N[now].Maxy, N[N[now].RS].Maxy);
  return now;
}
void DFS(unsigned now) {
  if(N[now].LS) DFS(N[now].LS);
  List[++Hd] = now, S[Hd].Val = N[now].Val, S[Hd].x = N[now].x, S[Hd].y = N[now].y;
  if(N[now].RS) DFS(N[now].RS);
}
unsigned Rebuild(unsigned now) {
  Hd = 0, DFS(now);
  return Build(1, Hd);
}
void Insert(unsigned now, unsigned Fa, const char Dire) {
  N[now].Sum += Opv;
  if(!((N[now].x ^ Opx) | (N[now].y ^ Opy))) {
    N[now].Val += Opv;
    return;
  }
  if(N[now].Dir) {
    if(Opx < N[now].x) {
      if(N[now].LS){
        N[now].Size -= N[N[now].LS].Size;
        Insert(N[now].LS, now, 0);
        N[now].Size += N[N[now].LS].Size;
      } else {
        ++(N[now].Size);
        N[now].LS = ++CntN;
        N[N[now].LS].Sum = N[N[now].LS].Val = Opv;
        N[N[now].LS].Size = 1;
        N[N[now].LS].Maxx = N[N[now].LS].Minx = N[N[now].LS].x = Opx;
        N[N[now].LS].Maxy = N[N[now].LS].Miny = N[N[now].LS].y = Opy;
      }
      N[now].Minx = min(N[now].Minx, N[N[now].LS].Minx);
      N[now].Miny = min(N[now].Miny, N[N[now].LS].Miny);
      N[now].Maxy = max(N[now].Maxy, N[N[now].LS].Maxy);
    } else {
      if(N[now].RS){
        N[now].Size -= N[N[now].RS].Size;
        Insert(N[now].RS, now, 1);
        N[now].Size += N[N[now].RS].Size;
      } else {
        ++(N[now].Size);
        N[now].RS = ++CntN;
        N[N[now].RS].Sum = N[N[now].RS].Val = Opv;
        N[N[now].RS].Size = 1;
        N[N[now].RS].Maxx = N[N[now].RS].Minx = N[N[now].RS].x = Opx;
        N[N[now].RS].Maxy = N[N[now].RS].Miny = N[N[now].RS].y = Opy;
      }
      N[now].Miny = min(N[now].Miny, N[N[now].RS].Miny);
      N[now].Maxy = max(N[now].Maxy, N[N[now].RS].Maxy);
      N[now].Maxx = max(N[now].Maxx, N[N[now].RS].Maxx); 
    }
  } else {
    if(Opy < N[now].y) {
      if(N[now].LS){
        N[now].Size -= N[N[now].LS].Size;
        Insert(N[now].LS, now, 0);
        N[now].Size += N[N[now].LS].Size;
      } else {
        ++(N[now].Size);
        N[now].LS = ++CntN;
        N[N[now].LS].Sum = N[N[now].LS].Val = Opv;
        N[N[now].LS].Size = 1;
        N[N[now].LS].Maxx = N[N[now].LS].Minx = N[N[now].LS].x = Opx;
        N[N[now].LS].Maxy = N[N[now].LS].Miny = N[N[now].LS].y = Opy;
      }
      N[now].Miny = min(N[now].Miny, N[N[now].LS].Miny);
      N[now].Minx = min(N[now].Minx, N[N[now].LS].Minx);
      N[now].Maxx = max(N[now].Maxx, N[N[now].LS].Maxx);
    } else {
      if(N[now].RS){
        N[now].Size -= N[N[now].RS].Size;
        Insert(N[now].RS, now, 1);
        N[now].Size += N[N[now].RS].Size;
      } else {
        ++(N[now].Size);
        N[now].RS = ++CntN;
        N[N[now].RS].Sum = N[N[now].RS].Val = Opv;
        N[N[now].RS].Size = 1;
        N[N[now].RS].Maxx = N[N[now].RS].Minx = N[N[now].RS].x = Opx;
        N[N[now].RS].Maxy = N[N[now].RS].Miny = N[N[now].RS].y = Opy;
      }
      N[now].Maxy = max(N[now].Maxy, N[N[now].RS].Maxy);
      N[now].Minx = min(N[now].Minx, N[N[now].RS].Minx);
      N[now].Maxx = max(N[now].Maxx, N[N[now].RS].Maxx); 
    }
  }
  if(N[now].Size > 3) {
    if(!((N[now].LS) && (N[now].RS))) {
      Rbd = now, RbFa = Fa, SonDir = Dire;
      return;
    }
    if((N[N[now].LS].Size * 3 < N[N[now].RS].Size) || (N[N[now].LS].Size > N[N[now].RS].Size * 3)){
      Rbd = now, RbFa = Fa, SonDir = Dire;
    }
  }
  return;
}
void Qry(unsigned now) {
  if(N[now].Minx >= Opx && N[now].Miny >= Opy && N[now].Maxx <= Opx_ && N[now].Maxy <= Opy_) {
    Ans += N[now].Sum;
    return;
  }
  if(N[now].Minx > Opx_ || N[now].Miny > Opy_ || N[now].Maxx < Opx || N[now].Maxy < Opy) {
    return;
  }
  if(N[now].x >= Opx && N[now].y >= Opy && N[now].x <= Opx_ && N[now].y <= Opy_) {
    Ans += N[now].Val;
  }
  if(N[now].LS) Qry(N[now].LS);
  if(N[now].RS) Qry(N[now].RS);
  return;
}
int main() {
  srand(time(0));
  n = RD();
  N[1].Minx = N[1].Miny = N[1].Maxx = N[1].Maxy = N[1].Size = N[1].y = N[1].x = 1, N[1].Sum = N[1].Val = 0;
  while (1) {
    A = RD();
    ++Cnt;
    if(A & 1) {
      if(A ^ 3) {
        Opx = RD() ^ Ans, Opy = RD() ^ Ans, Opv = RD() ^ Ans;
        Rbd = 0, Insert(Root, 0, false);
        if(Rbd) {
          if(!RbFa) {
            Root = Rebuild(Rbd);
          }
          else {
            if(SonDir) {
              N[RbFa].RS = Rebuild(Rbd);
            } else {
              N[RbFa].LS = Rebuild(Rbd);
            }
          }
        }
      } else break;
    } else {
      Opx = RD() ^ Ans, Opy = RD() ^ Ans, Opx_ = RD() ^ Ans, Opy_ = RD() ^ Ans;
      Ans = 0, Qry(Root);
      printf("%u\n", Ans);
    }
  }
  return Wild_Donkey;
}
```

## 指针神教

前面提到, MLE 并不是指针的问题, 所以作为指针神教徒, 还是要把指针请回来的, 发现仅比数组多了 $1MB$, 并且总时间比数组快了 $1s$.

```cpp
unsigned List[200005], m, n, Cnt(0), Rand(time(0)), A, B, Hd, t, Ans(0), Tmp(0), Opx, Opy, Opx_, Opy_, Opv;
char flg(1), nowDir(0), SonDir(0);
struct Node {
  Node *LS, *RS;
  unsigned Val, Sum, Size, x, y, Minx, Miny, Maxx, Maxy;
  char Dir;
}N[200005], *CntN(N), *Rbd(NULL), *RbFa(NULL), *Root(N);
struct Stack {
  unsigned Val, x, y;
  inline const char operator <(const Stack &sx) const{
    return (nowDir) ? ((this->x ^ sx.x) ? (this->x < sx.x) : (this->y < sx.y)) : ((this->y ^ sx.y) ? (this->y < sx.y) : (this->x < sx.x));
  }
}S[200005];
inline void Clr() {}
Node *Build(unsigned L, unsigned R) {
  register Node *now(N + List[Hd--]);
  if(L == R) {
    now->Minx = now->Maxx = now->x = S[L].x;
    now->Miny = now->Maxy = now->y = S[L].y;
    now->Sum = now->Val = S[L].Val;
    now->Size = 1;
    now->LS = now->RS = NULL;
    return now;
  }
  register unsigned Mid((L + R) >> 1);
  Rand = Rand * MOD1;
  nowDir = (Rand >> 1) % 2;
  now->Dir = nowDir;
  nth_element(S + L, S + Mid, S + R + 1);
  now->Minx = now->Maxx = now->x = S[Mid].x;
  now->Miny = now->Maxy = now->y = S[Mid].y;
  now->Sum = now->Val = S[Mid].Val;
  now->Size = 1;
  if(Mid ^ L) {
    now->LS = Build(L, Mid - 1);
    now->Sum += now->LS->Sum;
    now->Size += now->LS->Size;
    now->Minx = min(now->Minx, now->LS->Minx);
    now->Maxx = max(now->Maxx, now->LS->Maxx);
    now->Miny = min(now->Miny, now->LS->Miny);
    now->Maxy = max(now->Maxy, now->LS->Maxy);
  } else {
    now->LS = NULL; 
  }
  now->RS = Build(Mid + 1, R);
  now->Sum += now->RS->Sum;
  now->Size += now->RS->Size;
  now->Minx = min(now->Minx, now->RS->Minx);
  now->Maxx = max(now->Maxx, now->RS->Maxx);
  now->Miny = min(now->Miny, now->RS->Miny);
  now->Maxy = max(now->Maxy, now->RS->Maxy);
  return now;
}
void DFS(Node *now) {
  if(now->LS) DFS(now->LS);
  List[++Hd] = now - N, S[Hd].Val = now->Val, S[Hd].x = now->x, S[Hd].y = now->y;
  if(now->RS) DFS(now->RS);
}
Node *Rebuild(Node *now) {
  Hd = 0, DFS(now);
  return Build(1, Hd);
}
void Insert(Node *now, Node *Fa, const char Dire) {
  now->Sum += Opv;
  if(!((now->x ^ Opx) | (now->y ^ Opy))) {
    now->Val += Opv;
    return;
  }
  if(now->Dir) {
    if(Opx < now->x) {
      if(now->LS){
        now->Size -= now->LS->Size;
        Insert(now->LS, now, 0);
        now->Size += now->LS->Size;
      } else {
        ++(now->Size);
        now->LS = ++CntN;
        now->LS->Sum = now->LS->Val = Opv;
        now->LS->Size = 1;
        now->LS->Maxx = now->LS->Minx = now->LS->x = Opx;
        now->LS->Maxy = now->LS->Miny = now->LS->y = Opy;
      }
      now->Minx = min(now->Minx, now->LS->Minx);
      now->Miny = min(now->Miny, now->LS->Miny);
      now->Maxy = max(now->Maxy, now->LS->Maxy);
    } else {
      if(now->RS){
        now->Size -= now->RS->Size;
        Insert(now->RS, now, 1);
        now->Size += now->RS->Size;
      } else {
        ++(now->Size);
        now->RS = ++CntN;
        now->RS->Sum = now->RS->Val = Opv;
        now->RS->Size = 1;
        now->RS->Maxx = now->RS->Minx = now->RS->x = Opx;
        now->RS->Maxy = now->RS->Miny = now->RS->y = Opy;
      }
      now->Miny = min(now->Miny, now->RS->Miny);
      now->Maxy = max(now->Maxy, now->RS->Maxy);
      now->Maxx = max(now->Maxx, now->RS->Maxx); 
    }
  } else {
    if(Opy < now->y) {
      if(now->LS){
        now->Size -= now->LS->Size;
        Insert(now->LS, now, 0);
        now->Size += now->LS->Size;
      } else {
        ++(now->Size);
        now->LS = ++CntN;
        now->LS->Sum = now->LS->Val = Opv;
        now->LS->Size = 1;
        now->LS->Maxx = now->LS->Minx = now->LS->x = Opx;
        now->LS->Maxy = now->LS->Miny = now->LS->y = Opy;
      }
      now->Miny = min(now->Miny, now->LS->Miny);
      now->Minx = min(now->Minx, now->LS->Minx);
      now->Maxx = max(now->Maxx, now->LS->Maxx);
    } else {
      if(now->RS){
        now->Size -= now->RS->Size;
        Insert(now->RS, now, 1);
        now->Size += now->RS->Size;
      } else {
        ++(now->Size);
        now->RS = ++CntN;
        now->RS->Sum = now->RS->Val = Opv;
        now->RS->Size = 1;
        now->RS->Maxx = now->RS->Minx = now->RS->x = Opx;
        now->RS->Maxy = now->RS->Miny = now->RS->y = Opy;
      }
      now->Maxy = max(now->Maxy, now->RS->Maxy);
      now->Minx = min(now->Minx, now->RS->Minx);
      now->Maxx = max(now->Maxx, now->RS->Maxx); 
    }
  }
  if(now->Size > 3) {
    if(!((now->LS) && (now->RS))) {
      Rbd = now, RbFa = Fa, SonDir = Dire;
      return;
    }
    if((now->LS->Size * 3 < now->RS->Size) || (now->LS->Size > now->RS->Size * 3)){
      Rbd = now, RbFa = Fa, SonDir = Dire;
    }
  }
  return;
}
void Qry(Node *now) {
  if(now->Minx >= Opx && now->Miny >= Opy && now->Maxx <= Opx_ && now->Maxy <= Opy_) {
    Ans += now->Sum;
    return;
  }
  if(now->Minx > Opx_ || now->Miny > Opy_ || now->Maxx < Opx || now->Maxy < Opy) {
    return;
  }
  if(now->x >= Opx && now->y >= Opy && now->x <= Opx_ && now->y <= Opy_) {
    Ans += now->Val;
  }
  if(now->LS) Qry(now->LS);
  if(now->RS) Qry(now->RS);
  return;
}
int main() {
  n = RD();
  N[0].Minx = N[0].Miny = N[0].Maxx = N[0].Maxy = N[0].Size = N[0].y = N[0].x = 1, N[0].Sum = N[0].Val = 0;
  while (1) {
    A = RD();
    if(A & 1) {
      if(A ^ 3) {
        ++Cnt;
        Opx = RD() ^ Ans, Opy = RD() ^ Ans, Opv = RD() ^ Ans;
        Rbd = NULL, Insert(Root, NULL, false);
        if(Rbd) {
          if(!RbFa) {
            Root = Rebuild(Rbd);
          }
          else {
            if(SonDir) {
              RbFa->RS = Rebuild(Rbd);
            } else {
              RbFa->LS = Rebuild(Rbd);
            }
          }
        }
      } else break;
    } else {
      Opx = RD() ^ Ans, Opy = RD() ^ Ans, Opx_ = RD() ^ Ans, Opy_ = RD() ^ Ans;
      Ans = 0, Qry(Root);
      printf("%u\n", Ans);
    }
  }
  return Wild_Donkey;
}
```
