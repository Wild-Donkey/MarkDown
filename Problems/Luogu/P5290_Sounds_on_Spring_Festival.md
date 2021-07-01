# ["春" 节 $12$ 响](https://www.luogu.com.cn/problem/P5290)

## 题意

给一棵有根树, 点带权, 将点分成若干点集, 要求一个点不能和它子树中的其它节点在同一个集合中. 每个点集的权值是这个集合中点权最大值.

求点集权值最小值.

## 分析

既然点集权值是点权最大值, 这就说明一个点加入一个点集的答案一定不会比单独新建一个点集劣, 所以我们需要先保证点击数量最少.

点集数量最小值很显然是树的深度, 因为最深的点到根节点的路径上的点两两不能在一个集合中, 这保证了不会有更少的点集数; 并且每一层作为一个点集是合法的, 这保证了这个点集数量的可行性.

## $15'$

考虑部分分, 树呈一条链的情况.

一个根有两个儿子, 一个儿子接了一条链, 这两条链中的点互相可以放入一个点集, 根节点一定是单独一个点集. 其中, 包含两个点的点集的数量一定是两条链中较短的一条的长度.

因为答案就是所有点权总和减去所有包含两个点的点集中点权较小的那个点的点权, 最优方案一定是尽量让包含两个点的点集中最小点权尽量大. 因为点集中较大点权一定小于较小点权, 所以应该把每个链的最大值放在一个点集中, 次大值放在一个点集中, 以此类推.

用排序或优先队列做, 复杂度 $O(n \log n)$.

## $15'$ 推广

上面的做法是根节点挂 $2$ 条链的情况, 思考如果让根节点挂 $k$ 条链, 如何解决?

类似地, 将每一条链的点权排序, 长度比最长链小的, 缺少的元素当 $0$ 处理. 每次取每条链第 $i$ 大的点权中最大值计入答案.

实现比较麻烦, 需要对 $k$ 个序列进行排序, 我们可以将它们线性排列在一个长度 $n - 1$ 的数组中, 然后记录每条链的头指针, 分段用 $sort$ 进行排序, 效率不会低于直接排序长度 $n - 1$ 的数组.

还有一个细节, 较短的链后面补 $0$ 的操作只是为了方便理解, 实现起来需要判断下标是否超出链长, 超出了就按 $0$ 处理, 避免了访问别的链的内存.

这样就可以做一个根挂 $k$ 条链的数据了, 复杂度 $O(n \log n)$

## $75'$

我们发现叶子节点符合我们可处理的要求, 单独考虑一个点, 答案一定是它的权值. (废话)

这种情况是我们的边界情况.

然后对于只有单点做儿子的节点也可以处理. (你都能处理挂链的点了, 挂几个单点还用说?)

这种情况就是我们转化问题后需要处理的情况.

然后如果再往上走, 一个点挂几个子树, 是否也能这样做?

首先, 既然一个子树中的一些点已经在同一个点集中了, 对于只包含另一棵子树的节点的点集, 这两个点集是可以合并成一个的. (~~读者自证~~这还用证)

假设我们求出了每个子树的每个点集的权值, 这时在处理别的子树的关系时, 可以把自己的每个点集当成一个点, 然后把自己这棵子树当成一条挂在父亲上的链. 这时我们发现这就是前面 $15'$ 推广的想法需要解决的问题.

这样我们就可以每个点作为一个单点组成的堆, 合并所有的兄弟, 将合并结果加入父亲的堆中. 假设我们已经求出一个节点的儿子节点的堆, 每次将每个儿子堆顶取出, 这些堆顶的最大值加入当前节点的堆, 弹出每个儿子的堆顶, 直到所有堆都变空为止.

合并到根节点后, 将堆中元素一个一个弹出, 统计总和.

分析时间复杂度.

一个 $n$ 个节点的堆, 全部插入并弹出的复杂度是 $O(n \log n)$, 最坏的情况是链, 从下合并到根需要 $O(n^2\log n)$ 的时间. 加上前面的 $15'$, 现在我们能拿到 $75'$ 了.

## $75'$ 改

实际上堆的使用是聪明反被聪明误, 其实可以用数组将 $O(\log n)$ 砍掉.

我们用 DFS 序存储每个节点, 然后假设某个点 $x$ 的所有子树的集合已经求出从大到小排在以它们各自的 DFS 序为头指针的位置. 这时, 从左到右同时扫描所有儿子的序列, 每次取最大值放到 $x$ 后面 (空出 $x$ 的位置). 这就能 $O(n)$ 将求出的子树合并, 存储到以 $x + 1$ 为头指针的位置.

然后对 $x$ 的权值进行一轮冒泡排序, 因为除了 $x$, 序列是有序的, 所以只需 $O(n)$. 这样一来, $x$ 的集合就递减排列再以 $x$ 为头指针的位置了.

每棵子树都需要 $O(n)$ 来合并, 所以总复杂度是 $O(n^2)$, 达到时间复杂度上限的数据是一条从根到叶子权值递增的链.

很遗憾, 还是 $75'$.

## $100'$

发现 $75'$ 的 $O(n^2 \log n)$ 的最坏情况的大部分时间是在将元素从一个堆取出, 再全部插入另一个堆中, 相当于拿 $n$ 个元素插入一个大小为 $1$ 的集合中, 这时发现如果遵从少数服从多数的原则, 事情就会变得简单得多.

"少数服从多数" 翻译成算法: 将小集合加入大集合.

取 $x$ 的最大的儿子 $Son$ 的集合作为目标, 仍然是每次弹出每个兄弟和自己的最大值, 插入一个数组 $Tmp$ 中, 等到只剩下 $Son$ 有元素的时候, 将 $Tmp$ 中的所有元素插回 $Son$ 的集合, 然后将 $x$ 插入 $Son$, 接着把 $Son$ 的指针赋给 $x$.

这一套操作中, 设 $Son$ 的集合大小为 $m$, 则结果中 $x$ 的集合大小一定是 $m + 1$. 设 $Son$ 的大小和它所有兄弟的大小之和为 $n$, 则 $O(n \log m)$ 就是本次对 $x$ 的操作的复杂度.

接下来分析算法复杂度. $x$ 单次合并复杂度是 $O(n \log m)$, 构成复杂度的这些操作分为两种:

- 兄弟集合节点弹出的复杂度

  这些节点弹出后, 就不会再插入了, 总复杂度 $O((n - m) \log m)$.

- $Son$ 的节点弹出以及 $Tmp$ 和 $x$ 插回 $Son$ 的复杂度.

  因为弹出前堆的大小是 $m$ 插回后堆的大小是 $m + 1$, 所以再劣也不过 $O(m \log m)$. 但是一次 $Son$ 的弹出才会导致一次 $Tmp$ 的插入, 而一次 $Son$ 的弹出必定伴随着至少一个兄弟的弹出.

容易发现, 无论是第一种还是第二种, 每次 $O(2 \log m)$ 复杂度后, 至少有一个点被删除, 也就是说, 对于整个递归问题, 每个点的均摊复杂度是 $O(\log m)$, 因此算法总复杂度是 $O(n \log m)$.

因为 $m$ 和 $n$ 同阶, 我们的复杂度是 $O(n \log n)$.

## 实现

因为不想使用 STL, 所以我还特意写了生涯第一个手写堆 (第一个指针堆, 因为要动态开点).

其中堆 `Heap` 要开 $2n$ 个点, 是因为最后最多留下 $n$ 个点, 但是过程中最多有 $n - 1$ 个点被删除, 所以过程中最多会生成 $2n - 1$ 个点, 我们不必垃圾回收, 所以直接开两倍内存池即可.

细节很少, 非常好调, 第一次写手写堆, 但是连写带调不到 $30min$, 一遍过; 然后下面的代码一个字一个字重写堆, 连写带调不到 $1H$, 一遍过. 这是一道非常好的数据结构题, 主要考察思维建模能力而不是代码能力, 值得一写. (当然如果你用 STL 能更短). 

```cpp
unsigned n, Stack[200005], Pos, Bin[20], Log[200005], A;
unsigned long long Ans(0);
struct Heap {
  Heap *LS, *RS, *Fa;
  unsigned Value;
}H[400005], *CntH(H), *HP;
struct Node {
  Node *Son, *Bro;
  Heap *Value;
  unsigned Size;
}N[200005];
void Up (Heap *x) {
  if(x->Fa) {
    if(x->Fa->Value < x->Value) {
      swap(x->Fa->Value, x->Value);
      Up(x->Fa);
    }
  }
}
void Down(Heap *x) {
  if(x->RS) {
    if(x->LS->Value < x->RS->Value) {
      if(x->RS->Value > x->Value) {
        swap(x->Value, x->RS->Value);
        Down(x->RS);
      }
    } else {
      if(x->LS->Value > x->Value) {
        swap(x->Value, x->LS->Value);
        Down(x->LS);
      }
    }
  } else {
    if(x->LS) {
      if(x->LS->Value > x->Value) {
        swap(x->Value, x->LS->Value);
        Down(x->LS);
      }
    }
  }
}
Heap *Find(Heap *x, unsigned L, unsigned R) {
  if(L == R) return x;
  register unsigned Mid((L + R) >> 1);
  if(Pos <= Mid) {
    if(!x->LS) x->LS = ++CntH, x->LS->Value = 0, x->LS->Fa = x;
    return Find(x->LS, L, Mid);
  } else {
    if(!x->RS) x->RS = ++CntH, x->RS->Value = 0, x->RS->Fa = x;
    return Find(x->RS, Mid + 1, R); 
  }
}
void DFS(Node *x) {
  if(!(x->Son)) return;
  register Node *now(x->Son), *Tmp(now);
  register unsigned Pop(0);
  while (now) {
    DFS(now);
    if(now->Size > Tmp->Size) {
      Pop = max(Pop, Tmp->Size);
      Tmp = now;
    }
    if(Tmp != now) Pop = max(Pop, now->Size);
    now = now->Bro;
  }
  now = x->Son;
  for (register unsigned i(1); i <= Pop; ++i) {
    Stack[i] = 0;
  }
  while (now) {
    for (register unsigned i(1); i <= Pop && now->Size; ++i) {
      Stack[i] = max(Stack[i], now->Value->Value);
      Pos = now->Size - Bin[Log[now->Size]];
      HP = Find(now->Value, 0, Bin[Log[now->Size]] - 1);
      swap(HP->Value, now->Value->Value);
      HP->Value = 0;
      Down(now->Value);
      --(now->Size);
    }
    now = now->Bro;
  }
  Stack[++Pop] = x->Value->Value;
  for (register unsigned i(1); i <= Pop; ++i) {
    ++(Tmp->Size);
    Pos = Tmp->Size - Bin[Log[Tmp->Size]];
    HP = Find(Tmp->Value, 0, Bin[Log[Tmp->Size]] - 1);
    HP->Value = Stack[i];
    Up(HP);
  }
  x->Value = Tmp->Value;
  x->Size = Tmp->Size;
  return;
}
int main() {
  n = RD();
  for (register unsigned i(1), j(0); i <= n; i <<= 1, ++j) {
    Bin[j] = i, Log[i] = j;
  }
  for (register unsigned i(1); i <= n; ++i) {
    Log[i] = max(Log[i - 1], Log[i]);
  }
  for (register unsigned i(1); i <= n; ++i) {
    N[i].Value = ++CntH;
    N[i].Value->Value = RD();
    N[i].Size = 1;
  }
  for (register unsigned i(2); i <= n; ++i) {
    A = RD();
    N[i].Bro = N[A].Son;
    N[A].Son = N + i;
  }
  DFS(N + 1);
  while (N[1].Size) {
    Pos = N[1].Size - Bin[Log[N[1].Size]];
    Ans += Find(N[1].Value, 0, Bin[Log[N[1].Size]] - 1)->Value;
    --N[1].Size;
  }
  printf("%llu\n", Ans);
  return 0;
}
```