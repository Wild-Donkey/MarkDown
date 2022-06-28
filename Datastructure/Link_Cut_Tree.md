# Link/Cut Tree (动态树)

动态树问题, 维护一个森林, 支持但不仅限于如下操作:

- Query

  查询路径信息.

- Link

  连接两个不同树上的点.

- Cut

  断开两点之间的连边.

- Change

  单点修改

给出的解决方案是 Link/Cut Tree, 基于 Splay 的数据结构, 简称 LCT.

关于 [Splay](https://www.luogu.com.cn/blog/Wild-Donkey/ren-lun-zhi-guang-splay) 的内容.

LCT 是对原树进行树链剖分后用 Splay 树 (以下简称 Splay) 维护树链的数据结构, 这里的树链剖分指实链剖分, 如果你还不会轻重链剖分, 请先学习[轻重链剖分](https://www.luogu.com.cn/blog/Wild-Donkey/qing-zhong-lian-pou-fen), 因为轻重链剖分是最简单的树链剖分.

## LCT

对于一棵树, 对它建立 LCT. LCT 也是一棵树, 是由若干 Splay 组成的.

原树上的边划分为两种, 实边和虚边. 在原树中, 每个节点最多只能有一条连接自己和儿子的实边 (注意, 也可以没有, 这里是区别于轻重链剖分的地方), 其余都是虚边. 原树可以被分成若干实链 (实边连接的极大链, 也就是将虚边去掉后剩下的若干连通块).

LCT 就是对每个实链建立 Splay, 然后用虚边将 Splay 连接起来. 根据树链剖分的原理得, 原树每个实链是竖直的, 即两端点的 LCA 必然是其中一个. 所以对于一条实链, 它的节点的深度是连续的, 从链顶到链底递增.

规定 Splay 的中序遍历递增的权值为 Splay 的性质权值, 也就是 Splay 的 BST 的 Key. LCT 中每个 Splay 的性质权值就是每个节点在原树中的深度. 

对于 LCT 上的虚边, 可以理解成单向边, 从一棵 Splay 的根引出, 连向另一棵 Splay 的节点. 连边的原则是: LCT 中的一棵 Splay 的根连向它在原树中所在实链链顶的连接父亲的虚边连接的那个节点在 LCT 中的节点. 可能有些绕, 换个角度理解. 先规定父端点指虚边深度大的端点, 另一个端点即为子端点. 原树的虚边和 LCT 中的虚边一一对应, 原树虚边的父端点在 LCT 中不变, LCT 中父端点还是原树父端点在 LCT 中对应的点. 子端点发生改变, LCT 中, 一条虚边的子端点是原树的子端点对应节点所在的 Splay 的根.

根据一棵 LCT 可以构造出唯一的一棵树. 这是因为每个 Splay 构造出的实链是唯一的, 而实链的连接方式, 即虚边也是确定的. 因为它的父端点是确定的, 就是 LCT 中虚边父端点对应的节点, 子节点也是确定的, 因为实链的链顶是确定的.

因此我们完全可以用 LCT 来存原树, 无需再保存原树. 对于原树链上的信息, 直接通过 LCT 查询, 修改. 后面说的关于原树的操作只是一个模型便于理解, 至于实现, 则完全是在 LCT 上的操作.

使 LCT 强于轻重链剖分和并查集的是它可以使原树的边在虚实间变换, 来实现两棵树的连接, 树的换根等操作.

本文默认读者已经掌握了 [Splay](https://www.luogu.com.cn/blog/Wild-Donkey/ren-lun-zhi-guang-splay) 的所有操作.

## 虚实

对于存边的方式, 由于不存原树, 所以只要考虑 LCT 上的实虚边怎么存即可.

对于实边, 就像 Splay 中那样, 每个点保存 $Fa$, $LS$, $RS$ 三个指针. 但是虚边就很特殊, 因为每个点可以和若干虚边相连, 这就要用到邻接表.

但是懒出名的我曾经在写 AC 自动机的时候都坚决不写邻接表 (结果最后还是不得不写), 这次必然会想办法偷懒. 先说结论, 因为 LCT 上的每个操作需要通过虚边走到别的点的时候, 都是从下到上访问的, 所以可以之存指向父亲的单向边. 而每个节点只有一个父亲, 所以每个点存一个指针就能避免边表.

你的虚边指针, 何必额外定义, 思考实边中指向父亲的指针是否能够胜任. 首先, 指向父亲的边非实即虚, 也就是虚实不会冲突. 其次, 可以判断一个指向父亲的边是虚还是实, 只要一个节点不是父亲的左儿子也不是右儿子, 那么就可以鉴定这个指针是实还是虚.

所以一个边是虚边, 只要存儿子的 $Fa$ 指针即可. 这种做法不仅节省空间, 优化常数, 在虚实转换时只要连/断儿子指针即可, 非常方便.

接下来介绍操作原理, 先从结构操作讲起, 这一部分是 LCT 的形态结构的各种变换.

## Access

LCT 的核心, 可以将原树中根到某点 $x$ 的路径变成实链. 在 LCT 中体现就是 $x$ 出现在了根所在的 Splay 的右端. 这里提到的 Splay 的端点即为性质权值的最值对应的节点, LCT 中 Splay 的右端点就是原树中实链的链底.

考虑原树上的改变. 先把所有 $Root-x$ 路径上的边变实, 然后变虚多余的边. 多余的边指妨碍到满足 LCT 性质的实边. 即为将实连通分量 (又是自己造的名词, 指极大的实边连通块) 中除了 $Root-x$ 路径上的其它实边.

考虑从树上从根出发寻找到达某节点的路径的困难, 所以选择从节点 $x$ 出发寻找前往根的路径 (闷头朝浅的地方走, 一定简单).

$x$ 所在的实链中, 在 `Access(x)` 后仍在 $x$ 的实链中的是 $x$ 和它的祖先们, 当 `Splay(x)` 后, 这一部分在 LCT 中就是 $x$ 和它的左子树, 而右子树则变成一条新的实链. 因为 $x$ 到儿子的实链 (如果是虚链, 则 $x$ 本来就是链底, 也就没有右子树了) 必须变虚, 否则 `Access(x)` 后, $x$ 所在的实链链底就不是 $x$ 了.

当对 $x$ 所在的 Splay 操作完后, $x$ 成为了实链底, 然后从 $x$ 所在的实链继续往上连接. 设 $x'$ 为 $x$ 当前所在实链链顶. 因为 $x'$ 和父亲以虚边连接, 而 `Access(x)` 要求这条虚边变实, 首先要将 $Fa_{x'}$ 的已经连接的连向儿子的实边变虚, 即对 $Fa_{x'}$ 进行 Splay 后, 分离右子树. 这时将 $x'$ 的实边连过去, 也就是将 $x'$ 所在 Splay 的根节点 $x$ 变成 $Fa_{x'}$ 的右儿子. 这样一来, 整个的这一棵 Splay 代表实链的就是 $x$ 到原来 $Fa_{x'}$ 链顶的一条链了. 以此类推, 直到链顶变成树根为止.

## Make_Root

换根操作是基于 Access 的操作, 它也是 LCT 各种操作的基础.

先看 $Root-x$ 链上的, 都是 $x$ 的直系祖先, 它们的父子关系直接反转, 变成 $x-Root$ 链, 剩下的点都是 $Root-x$ 链上节点的子树, 而原来它们是谁的子树, `Make_Root(x)` 后还是谁的子树.

总结起来就是: 除了 $Root-x$ 链的边的父子关系发生改变, 其余节点都不受影响.

LCT 上实现做法很简单, 如果想要将 $x$ 设为根, 首先 `Access(x)`, 然后 `Splay(x)`. 好的 $x$ 就变成 LCT 的根了, 操作结束. (自欺欺人行为)

上面的操作只是将 $x$ 变成 LCT 的根, 但是 `Make_Root(x)` 的目的是把 $x$ 变成原树的根, 所以还没有结束.

这时 $x$ 作为所在 Splay 的右端点, 又是根节点, 所以一定没有右子树, 假设 $x$ 有左子树. (如果没有左子树, 说明整个实链只有 $x$ 一个点, $x$ 本来就是原树根, 直接跳出就可以了), 如果希望反转整个 $Root-x$ 链, 可以像文艺平衡树中的操作一样, 反转整个 Splay.

对于 Splay 的反转, 为了保证复杂度, 需要一个 $Tag$, 每次调用这个节点的时候再反转它的两个儿子, 这就牵扯到下面几个操作了.

## Tag Management

反转标记和线段树的累加标记不同, 它类似于按动开关, 按一下是开, 再按一下是关, 所以使用位运算对 Tag 进行操作.

一共有两种实现方式, 一种是在 Tag 存在时已经交换了两棵子树, 一种是 Tag 在的时候还没有交换两棵子树. 体现在程序中就是在 `Make_Tag` 时交换子树, 和在 `Push_Down` 中交换子树的区别.

为了常数, 我选择后者.

### `Make_Tag(x)`

对某个点的整个子树进行反转, 需要对每个点的子树进行交换. 这时只在 $x$ 上打上标记, 剩下的都不用管.

打标记就是将原来的 $Tag$ 亦或 $1$, 每次改变 $Tag$ 的状态.

### `Push_Down(x)`

- 对于 $Tag = 0$ 的 $x$
  
  无需操作.

- 对于 $Tag = 1$ 的 $x$

  交换 $x$ 左右儿子的指针, 然后对两个儿子 $Make_Tag$

## Find_Root

寻根, 用来判断两点的连通性, 只要所在原树树根相同, 则两点在一棵树上. 这颇似用并查集维护的集合, 只要对比并查集的编号就可查询两个元素是否在同一集合内.

操作也很简单, 寻找节点 $x$ 的根时, `Access(x)`, `Splay(x)`, 这时 $x$ 和它的根在同一棵 Splay 内. 根一定是深度最小的, 所以一定位于 Splay 左端. 所以从 $x$ 出发一直左转, 直到没有左儿子为止, 这个点就是 $x$ 的根.

## Link

对两个节点 $x$, $y$ 执行 `Link(x, y)` 操作, 分两种情况讨论.

对两点是否连通的判断可以通过 `Make_Root(x)` 后判断 `Find_Root(y)` 是否等于 $x$ 来实现.

- 两点在同一棵树上

  这时两点连通, 无需操作.

- 两点在不在同一棵树上

  在两点间连边, 考虑如何在连边时维护 LCT 性质. 这时, 因为判断重复时用到了 `Make_Root(x)`, `Find_Root(y)` 所以这时 $x$ 是原树的树根, 也是对应 LCT 的树根. 这时将 $x$ 连一条虚边向 $y$, 因为这样不用考虑 $y$ 的儿子分布. 并且也满足原树中边 $x-y$ 的出现.

  所以操作就是判断 $x$, $y$ 不连通后, 直接将 $y$ 置为 $x$ 的父亲.

## Cut

这个操作只针对有直接连边的两点, 所以仍然首先讨论连通性.

- 两点在不在同一棵树上

  这时根本就不连通, 无需操作.

- 两点在同一棵树上

  这时 $x$ 是原树根, $y$ 是 $x$ 所在 Splay 的根, 两点在原树中是某实链的两端. 如果有直接连边, 则两点在 Splay 中, $x$ 是 $y$ 的左儿子, 且没有其它的点在这个 Splay 中(可能存在 $x$ 有右子树的情况, 这时, $x$ 的右子树在实链上就夹在 $x$, $y$ 之间), 否则没有连边, 直接跳出.

  对于有连边的情况, 直接断开 $x$, $y$ 的实边连接, 将点数为 $2$ 的 Splay 分成两棵点数为 $1$ 的 Splay, $x$, $y$ 分别为两棵新的原树的根节点, 操作完成.

接下来是信息操作, 这一部分是运用 LCT 维护数据的操作.

在每个节点上维护 $Value$, $Sum$, 分别表示这个点的数据权值 (相对于性质权值而言), 和这个点子树上数据权值之和. 

至于变换时维护 $Sum$ 的数值, 则留在了代码实现的部分, 我们默认在调用时 $Sum$ 的值已经 Up to date 就可以了.

## Query

查询路径 $x-y$ 上的权值和, 保证两点连通.

首先要 `Make_Root(x)`, `Access(y)`, 这时 $x$, $y$ 在一个 Splay 内, 查询这个 Splay 的根的 $Sum$ 即可.

## Change

为了方便维护 Sum, 直接 `Splay(x)`, 修改 $Value$, $Sum$.

## 代码实现 [模板 Luogu P3690](https://www.luogu.com.cn/problem/P3690)

维护一个森林, 支持四个操作:

- Query

  为了考虑精度, 查询路径异或和.

- Change

  直接修改单点的权值.

- Link

  判断连通, 如果不连通就连边.

- Cut

  判断是否有连边, 有连边就断开.

一开始给 $n$ 个单点, $1 \leq n \leq 10^5$.

分函数分别解析, 虽然有些函数和 Splay 同名, 但是有部分不同点.

### `Update()`

用一个点的儿子更新这个点的 $Sum$, 注意考虑儿子为空的情况.

```cpp
inline void Update(Node *x) {
  x->Sum = x->Value;
  if(x->Son[0]) {
    x->Sum ^= x->Son[0]->Sum;
  }
  if(x->Son[1]) {
    x->Sum ^= x->Son[1]->Sum;
  }
  return;
}
```

### `Push_Down()`

下传标记, 前面提到过, 选取常数较小的写法. 每次打 $Tag$ 之前, 只改变 $Tag$, 不交换儿子.

```cpp
inline void Push_Down(Node *x) {  // Push_Down the spliting tag
  if(x->Tag) {
    register Node *TmpSon(x->Son[0]);
    x->Tag = 0, x->Son[0] = x->Son[1], x->Son[1] = TmpSon; 
    if(x->Son[0]) {
      x->Son[0]->Tag ^= 1;
    }
    if(x->Son[1]) {
      x->Son[1]->Tag ^= 1;
    }
  }
}
```

### `Rotate()`

和单独的 Splay 中的写法差别不大, 将 Splay 维护的 `Size` 转换为 LCT 中维护的 `Sum` 即可.

```cpp
inline void Rotate(Node *x) {
  register Node *Father(x->Fa);
  x->Fa = Father->Fa; // x link to grandfather
  if(Father->Fa) {
    if(Father->Fa->Son[0] == Father) {
      Father->Fa->Son[0] = x;  // grandfather link to x
    }
    if(Father->Fa->Son[1] == Father) {
      Father->Fa->Son[1] = x;  // grandfather link to x
    }
  }
  x->Sum = 0, Father->Fa = x;
  if(Father->Son[0] == x) {
    Father->Son[0] = x->Son[1];
    if(Father->Son[0]) {
      Father->Son[0]->Fa = Father;
    }
    x->Son[1] = Father;
    if(x->Son[0]) {
      x->Sum = x->Son[0]->Sum;
    }
  }
  else {
    Father->Son[1] = x->Son[0];
    if(Father->Son[1]) {
      Father->Son[1]->Fa = Father;
    }
    x->Son[0] = Father;
    if(x->Son[1]) {
      x->Sum = x->Son[1]->Sum;
    }
  }
  Update(Father);
  x->Sum ^= x->Value ^ Father->Sum;
  return;
}
```

### `Splay()`

和纯 Splay 中的写法有很大不同, 因为 LCT 中的 Splay 是带有 $Split_Tag$ 的, 所以需要在 Splay 之前提前从上到下 `Push_Down()` 所经历的链. 为了从上到下遍历, 用栈存储回溯路径.

```cpp
void Splay (Node *x) {
  register unsigned Head(0);
  while (x->Fa) {                                       // 父亲没到头
    if(x->Fa->Son[0] == x || x->Fa->Son[1] == x) {      // x is the preferred-edge linked son (实边连接的儿子)
      Stack[++Head] = x;
      x = x->Fa;
      continue;
    }
    break;
  }
  Push_Down(x);
  if(Head) {
    for (register unsigned i(Head); i > 0; --i) {//Must be sure there's no tags alone Root-x, and delete Root->Fa for a while 
      Push_Down(Stack[i]);
    }
    x = Stack[1];
    while (x->Fa) {                                     // 父亲没到头
      if(x->Fa->Son[0] == x || x->Fa->Son[1] == x) {  // x is the preferred-edge linked son (实边连接的儿子)
        if (x->Fa->Fa) {
          if (x->Fa->Fa->Son[0] == x->Fa || x->Fa->Fa->Son[1] == x->Fa) { // Father
  			    Rotate((x->Fa->Son[0] == x)^(x->Fa->Fa->Son[0] == x->Fa) ? x : x->Fa);
          }                      // End
        }
        Rotate(x);               //最后一次旋转
      }
      else {
        break;
      }
    }
  }
  return;
}
```

### `Access()`

这个操作在变量写得合理的情况下, 可以把一开始的边界情况处理到循环里去, 一个循环解决问题. 但是为了逻辑清晰, 这次还是写得麻烦了一些.

```cpp
void Access (Node *x) {     // Let x be the bottom of the chain where the root at
  Splay(x), x->Son[1] = NULL, Update(x);         // Delete x's right son
  Node *Father(x->Fa);
  while (Father) {
    Splay(Father), Father->Son[1] = x; // Change the right son
    x = Father, Father = x->Fa, Update(x);     // Go up
  }
  return;
}
```

### `Find_Root()`

结构很简单的函数, 有人说找到根节点 (原树) 后, `Splay(x)`, 维护复杂度, 实验证明, 最后的 `Splay(x)` 存在与否不影响效率.

```cpp
Node *Find_Root(Node *x) {  // Find the root
  Access(x), Splay(x), Push_Down(x);
  while (x->Son[0]) {
    x = x->Son[0], Push_Down(x);
  }
  return x;
}
```

### 实现操作的接口

```cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <iostream>
#include <map>
#include <queue>
#include <vector>
#define Wild_Donkey 0
using namespace std;
inline unsigned RD() {
  unsigned intmp = 0;
  char rdch(getchar());
  while (rdch < '0' || rdch > '9') {
    rdch = getchar();
  }
  while (rdch >= '0' && rdch <= '9') {
    intmp = intmp * 10 + rdch - '0';
    rdch = getchar();
  }
  return intmp;
}
unsigned a[10005], n, m, Cnt(0), Tmp(0), Mx;
bool flg(0);
char inch, List[155][75];
struct Node {
  Node *Son[2], *Fa;
  char Tag;
  unsigned Value, Sum;
}N[100005], *Stack[100005];
int main() {
  n = RD();
  m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    N[i].Value = RD();
  }
  register unsigned A, B, C;
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    B = RD();
    C = RD();
    switch (A) {
      case 0: { // Query
        Access(N + B), Splay(N + B), N[B].Tag ^= 1; // x 为根 
        Access(N + C);    // y 和 x 为同一实链两端
        Splay(N + C);     // y 为所在实链的 Splay 的根 
        printf("%u\n", N[C].Sum);
        break;
      }
      case 1: { // Link
        Access(N + B), Splay(N + B), N[B].Tag ^= 1;         // x 为根, 也是所在 Splay 的根
        if(Find_Root(N + C) != N + B) {// x, y 不连通, x 在 Fink_Root 时已经是它所在 Splay 的根了, 也是它原树根所在实链顶, 左子树为空 
          N[B].Fa = N + C;        // 父指针
        }
        break;
      }
      case 2: { // Cut
        Access(N + B), Splay(N + B), N[B].Tag ^= 1;                         // x 为根, 也是所在 Splay 的根
        if(Find_Root(N + C) == N + B) {           // x, y 连通 
          if(N[B].Fa == N + C && !(N[B].Son[1])) {
            N[B].Fa = N[C].Son[0] = NULL;         // 断边
            Update(N + C);
          }
        }
        break;
      }
      case 3: { // Change
        Splay(N + B);   // 转到根上 
        N[B].Value = C; // 改权值 
        break;
      }
    }
  }
  return Wild_Donkey;
}
```

## 复杂度分析

因为贡献复杂度的是 $m$ 次操作, 所以考虑单次操作复杂度. 因为每个操作都是基于 LCT 的, 所以 LCT 的复杂度决定了单次操作复杂度.

因为一开始的点都是独立的, 所以这时什么操作复杂度都是 $O(1)$.

随着连通块的增大, LCT 的单个 Splay 的复杂度是 $O(logn)$, 而虚边的个数决定了单次操作 $O(logn)$ 的系数. 由于每次虚边的产生只出现在 Link 操作中, 而一次 Link 最多增加一个虚边, 这种情况只出现在 Link 过程中没有将任何虚边变实的情况下, 复杂度是 $O(logn)$. 所以假设有 $k$ 次这样的 Link 操作, 那么接下来的 $m - k$ 次操作会比 $O((m - k)logn)$ 的总复杂度多出 $O(klogn)$ 的时间. 每次多用的时间是 $Access$ 贡献的, 但是每次 $Access$ 多用 $O(logn)$ 的时间, 虚边就会少 $1$, 所以均摊 $O(2mlogn)$, 也就是 $O(mlogn)$.

## 后记

LCT 作为顶级树上数据结构, 在代码结构独特如此的情况下着实难调, 坑也不少, 希望考场上能吸取这几天 Debug 的教训.

由于时间线拉的比较长, 后半部分是在写完前半部分后花了 $3$ 天的 Debug 才写的, 所以可能会有错误和前后矛盾, 希望指正.