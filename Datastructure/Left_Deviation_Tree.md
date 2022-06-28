# 左偏树

~~左倾树 (Left Deviation Tree)~~

左偏树 (Leftist Trees)

是最常见的可并堆, 初始 $n$ 个单点作为 $n$ 个堆, 可以均摊 $O(logn)$ 地维护 $n$ 个堆的关系.

不失一般性, 本文只分析小根堆.

## 外节点

一棵二叉树, 如果把每个节点的空儿子都补上一个叶子, 这些加入的叶子称为 `外结点` (`External Node`). 其余节点称为 `内节点` (`Internal Node`).

对于左偏树来说, 存储值的点是内节点, 外节点因为不存值, 所以没必要实际存在.

## 形态

保证左偏树具有堆的性质, 即儿子的 $Val$ 大于等于父亲的 $Val$.

每个点维护一个值 $s_i$ 指它到最近的外节点的距离. 规定外节点的 $s$ 值是 $0$, 内节点组成的树中, 叶子的 $s$ 值就是 $1$. 易证, 一个内节点的 $s$ 值是它两个儿子 $s$ 值的最小值加 $1$.

一个左偏树必须保证一个节点左儿子 $s$ 大于等于右儿子的 $s$ 值, 如果不满足, 直接交换左右儿子.

## 规模

因为右儿子的 $s$ 值较小, 所以容易发现从根一直往右儿子走出的链的一端的深度, 这个深度往上的点构成一棵满二叉树. 而这个链的长度就是根的 $s$ 值.

对于一个左偏树, 它的根的 $s$ 值是 $s$, 它的内部点数一定大于等于 $2^s - 1$.

证明: 因为单内部点的 $s$ 是 $1$, 它的子树规模是 $1 = 2^1 - 1$. 又因为它作为右儿子时, 它父亲的 $s$ 是 $2$, 则它的右兄弟的 $s$ 至少是 $1$, 子树至少是 $1$, 所以它父亲的子树至少是 $3 = 2^2 - 1$. 用归纳法可证明.

因此, 一个 $n$ 个点的左偏树, 它的根的 $s$ 值至多是 $log_2(n + 1)$.

## 合并

合并操作, 不然也不叫可并堆了.

两个堆, 两个根, 最小的那个做根, 它的左子树是新树的左子树. 对于它的右子树和另一个堆, 二者进行相同的操作, 作为新树的右子树, 以此类推, 直到根 $Val$ 较小的树没有右儿子, 这时另一棵树直接变成右儿子.

因为每次合并, 都使树从根一直往右走的链增长 $1$, 所以合并的复杂度就是新树的根的 $s$ 值, 也就是在新树节点数为 $n$ 的前提下的 $O(log_2(n + 1))$ 

## 删除

对一棵左偏树的最小值的查询并且删除. 根节点的 $Val$ 就是最小值, 删除根节点后, 合并两棵子树, 复杂度 $O(logn)$.

## 加入

加入左偏树一个值, 只要新建一个单点左偏树, 使 $Val$ 等于待加入的数, 然后合并单点左偏树和它要加入的左偏树, 复杂度 $O(logn)$

## 初始化

如果一开始要建立一个 $n$ 个点的左偏树, 一种方法是第 $2$ 个点到第 $n$ 个点依次并入第一个点的树. 这样的复杂度显然是 $O(nlogn)$.

如果用一个左偏树队列, 取队首两棵树合并, 插入队尾, 这样, 两个单点合并的有 $\frac n2$ 次, 复杂度 $O(\frac n2)$; 两个双点合并的有 $\frac n4$ 次, 复杂度为 $O(\frac n4)$; 四个点合并的有 $\frac n8$ 次, 复杂度为 $O(\frac n4)$; 八个点合并的有 $\frac n{16}$ 次, 复杂度为 $O(\frac {3n}{16})$.

总复杂度表达式为:

$$
\frac n2 + \frac n4 + \frac {2n}8 + \frac {3n}{16} + \frac {4n}{32} + \frac {5n}{64} + ... + \frac {nlogn}{2n}\\
= \frac{n + \frac n2 + \frac {2n}4 + \frac {3n}8 + \frac {4n}{16} + \frac {5n}{32} + ... + \frac {nlogn}{n}}{2}\\
= n + \frac n2 + \frac {2n}4 + \frac {3n}8 + ... + \frac {nlogn}{n} - (\frac n2 + \frac n4 + \frac {2n}8 + \frac {3n}{16} + ... + \frac {nlogn}{2n})\\
= n + \frac n4 + \frac n8 + ... + \frac {n}n - \frac {nlogn}{2n}\\
= n(1 + \frac 14 + \frac 18 + ... + \frac 1n) - \frac {logn}{2}\\
= O(n)
$$

## 查询堆顶

给一个点, 查询它的堆顶, 可以一个一个点跳, 复杂度 $O(n)$ (因为左偏树的左子树深度为 $O(n)$ 是合法的).

也可以用并查集维护, 使复杂度变成 $O(logn)$ 以内. 由于并查集是不支持删除的, 所以对于根的删除, 不用在并查集里删除, 只要并查集的每个根保存一个值, 在查到这个集合时, 通过这个值找到这棵左偏树的根的指针即可. (意思是: 每个并查集的根有一个指向左偏树的根的指针).

## [模板](https://www.luogu.com.cn/problem/P3377)

维护 $n$ 个小根堆, 支持:

- 合并元素 $x$, $y$ 所在的堆.

- 删除 $x$ 所在的堆顶, 输出这个堆顶.

操作共 $m$ 次, $n, m \leq 10^5$.

写一个并查集维护的左偏树森林.

```cpp
unsigned m, n, A, B, t, Ans(0);
char Exist[100005];
struct Node {
  Node *LS, *RS;
  unsigned s, Val;
}N[100005], *C, *D; 
struct Set {
  Set *Fa;
  Node *Root;
}S[100005];
Node *Find(Set *x) {
  Set *Tmpx(x);
  while(Tmpx->Fa != Tmpx) Tmpx = Tmpx->Fa;
  return (x->Fa = Tmpx)->Root;
}
Node *Meld (Node *x, Node *y) {
  if(x->Val > y->Val || (x->Val == y->Val && x - N > y - N)) swap(x, y);
  if(x->RS) x->RS = Meld(x->RS, y);
  else x->RS = y;
  if(x->LS) {
    if(x->LS->s < x->RS->s) swap(x->LS, x->RS); // 右倾 
    x->s = x->RS->s + 1;
  } else x->LS = x->RS, x->RS = NULL, x->s = 1; // 只有一个儿子 
  return x;
}
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) N[i].Val = RD();
  for (register unsigned i(1); i <= n; ++i) N[i].s = 1;
  for (register unsigned i(1); i <= n; ++i) S[i].Root = N + i;
  for (register unsigned i(1); i <= n; ++i) S[i].Fa = S + i;
  for (register unsigned i(1); i <= m; ++i) if(RD() & 1) {
    A = RD(), B = RD();
    if(Exist[A] || Exist[B]) continue;// 已删除 
    C = Find(S + A), D = Find(S + B);
    if(C != D) S[B].Fa->Fa = S[A].Fa, S[A].Fa->Root = Meld(C, D);  // 两根不同, 合并, 更新并查集
  } else {
    A = RD();
    if(Exist[A]) {printf("-1\n");continue;}
    C = Find(S + A);  // 根
    printf("%u\n", C->Val); 
    Exist[C - N] = 1; // 删除
    if(C->LS && C->RS) S[A].Fa->Root = Meld(C->LS, C->RS);  // 合并左右子树
    else if(C->LS) S[A].Fa->Root = C->LS;                   // 没有右子树 
    else S[A].Fa->Root = NULL;                              // 没有左子树就没有右子树 
  }
  return Wild_Donkey;
}
```

## 参考文献

[Leftist Trees by Sartaj Sahni from University of Florida](http://web.onda.com.br/abveiga/capitulo5-ingles.pdf)