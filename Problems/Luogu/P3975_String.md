# TJOI2016/HEOI2016 字符串

后缀自动机 + 线段树合并怎么能少了指针呢?

虽然都说指针被卡空间，但是这个题只有 $10^5$ 的字符串，所以空间比较轻松。

## 题意

给一个字符串，每次询问子串 $[a, b]$ 的子串和 $[c, d]$ 的 LCP 长度。

> 注意，这里并不是求 $[a, b]$ 的子串和 $[c, d]$ 的子串的 LCP，而是求 $[a, b]$ 的子串和 $[c, d]$ 本身的 LCP，我一开始读错题了，以至于无论如何都是 $O(qn\log n)$。

## 前置知识

后缀自动机，安利一下[自己的博客](https://www.luogu.com.cn/blog/Wild-Donkey/hou-zhui-zi-dong-ji-suffix-automaton)。

线段树合并，同样安利[自己的博客](https://www.luogu.com.cn/blog/Wild-Donkey/p4556-vani-you-yue-kuai-yu-tian-di-wei-ba-mu-ban-xian-duan-shu-ge-b)。

## 解法

建立后缀自动机，记 $Pos_i$ 为前缀 $[1, i]$ 对应的节点的指针。

二分答案，判断 LCP 是 $x$ 时是否成立。

如果 LCP 大于等于 $x$，则子串 $[c, c + x - 1]$ 一定是 $[a, b]$ 的子串。

这样就把二分答案的判断转化为了查询一个字符串是否是另一个字符串的子串的问题。

我们可以倍增找到 $[c, c + x - 1]$ 所在的节点，判断它 $EndPos$ 集合中 (也就是一些说法中的 $Right$ 集合)，区间 $[a + x - 1, b]$ 中是否有值。如果有，说明它在对应的地方出现并且被 $[a, b]$ 完全包含。

对于 $EndPos$ 的计算，区间查询，就用线段树合并来解决。但是这里的线段树合并和前面链接中提到的线段树合并的不同之处在于: 这里线段树合并之后还是有用的，需要保护原树信息不被破坏，而模板中的线段树合并之后不会访问，所以只需要保证合并后的新树是正确的。

## 复杂度分析

线段树合并，对于后缀树上 $EndPos$ 合并的问题，线段树合并的时空复杂度是 $O(\log n)$ 的，接下来是证明:

首先一开始会在每个前缀所在的节点的线段树中插入一个值，一共是 $n$ 个节点，插入需要 $O(\log n)$ 的时空。

接下来是合并:

对于本问题，只有合并的两棵线段树的交，才会新建一个点，而两棵线段树的并就是合并后的线段树。定义一个点的 $Size$ 是它子树中叶子的数量。

通过链接中对 $EndPos$ 集合的几个性质的介绍，我们知道合并的两棵线段树的叶子的交为 $0$。

两树的交中，找出位置相同的两个点，$x$，$y$，假设我们把 $y$ 的信息合并到 $x$ 上，这时需要对 $x$ 新建一个点 $x'$ 存储两点合并后的信息，然后将 $x'$ 接到 $x$ 的父亲上。

那么 $Size_{x'}$ 就是 $Size_x + Size_y$，因为 $Size_y > 0$，所以 $Size_{x'}$ 一定大于 $Size_x$。对于 $x$ 所在的这个位置，一共需要的点的数量最多就是这个位置在合并满的线段树上的 $Size$。

对于线段树上的每一层，$Size$ 之和都是 $n$。所以每一层需要的点数之和就是 $n$，线段树一共有 $O(\log n)$ 层，所以一共需要 $O(n \log n)$ 个点。因为每次执行 $Merge$ 操作都是在新建节点之后，所以时间复杂度等于空间复杂度。

最后是查询，因为每次二分答案判断时需要 $O(\log n)$ 地倍增找对应节点，也需要 $O(\log n)$ 对线段树进行区间查询，所以一次询问的复杂度是 $O(\log^2n)$。

加上一开始的构造自动机的 $O(n)$ 和初始化倍增数组的 $O(n \log n)$，本题总复杂度 $O(n \log n + q \log^2 n)$。

## 代码实现

[这份代码](https://www.luogu.com.cn/record/57389429)达到了 $110.5MB$ 的内存使用，已经和数组版本的内存差不多了。

在线段树中只使用了两个儿子的指针，没有存值，因为我们只需要查询区间中是否有元素，而动态开点线段树只要有节点就是有值，所以我们只要判断有没有点，不需要再存一个 $Value$。

另外后缀树的构造使用了 `父亲-儿子-兄弟` 表示法，避免了 $Edge$ 数组的使用，节省了时间空间。

```cpp
unsigned m, n, Cnt(0), A, B, C, D, Ans(0), QrL, QrR;
char aP[100005], * a(aP), Tmp(0);
struct Seg {
  Seg* LS, * RS;
}S[5000005], * CntS(S);
void Insert(Seg* x, unsigned L, unsigned R) {
  if (L == R) return;
  unsigned Mid((L + R) >> 1);
  if (A <= Mid) Insert(x->LS = ++CntS, L, Mid);
  else Insert(x->RS = ++CntS, Mid + 1, R);
}
void Qry(Seg* x, unsigned L, unsigned R) {
  if ((QrL <= L) && (R <= QrR)) { Tmp |= 1;  return; }
  unsigned Mid((L + R) >> 1);
  if ((QrL <= Mid) && (x->LS)) Qry(x->LS, L, Mid);
  if (Tmp) return;
  if ((Mid < QrR) && (x->RS)) Qry(x->RS, Mid + 1, R);
}
void Merge(Seg* x, Seg* y, unsigned L, unsigned R) {
  unsigned Mid((L + R) >> 1);
  if (y->LS) {
    if (x->LS) *(++CntS) = *(x->LS), x->LS = CntS, Merge(CntS, y->LS, L, Mid);
    else x->LS = y->LS;
  }
  if (y->RS) {
    if (x->RS) *(++CntS) = *(x->RS), x->RS = CntS, Merge(CntS, y->RS, Mid + 1, R);
    else x->RS = y->RS;
  }
}
struct Node {
  Node* To[26], * Son, * Bro, * Fa[16];
  Seg* Root;
  unsigned Len;
}N[200005], * CntN(N), * Last(N), * Pos[100005];
void Add(const char x) {
  (++CntN)->Len = Last->Len + 1;
  Node* Back(Last);
  Last = CntN;
  while (Back) {
    if (!(Back->To[x])) Back->To[x] = Last;
    else break;
    Back = Back->Fa[0];
  }
  if (!Back) Last->Fa[0] = N;
  else {
    if (Back->Len + 1 == Back->To[x]->Len) Last->Fa[0] = Back->To[x];
    else {
      Node* Bfr(Back->To[x]);
      /*注意这里, Root 也会被复制, 要记得清除, 调了一上午的教训*/
      *(++CntN) = *Bfr, Bfr->Fa[0] = CntN, Last->Fa[0] = CntN, CntN->Len = Back->Len + 1, CntN->Root = NULL;
      while (Back) {
        if (Back->To[x] == Bfr) Back->To[x] = CntN;
        else break;
        Back = Back->Fa[0];
      }
    }
  }
}
void DFS(Node* x) {
  Node* Now(x->Son);
  if (!(x->Root)) x->Root = ++CntS;
  while (Now) {
    for (int i = 0; Now->Fa[i]; ++i) Now->Fa[i + 1] = Now->Fa[i]->Fa[i];
    DFS(Now);
    Merge(x->Root, Now->Root, 1, n);
    Now = Now->Bro;
  }
}
signed main() {
  // freopen("P3975_21.in", "r", stdin);
  // freopen("P3975.out", "w", stdout);
  n = RD(), m = RD(), scanf("%s", a + 1), Pos[0] = N;
  while (a[1] < 'a') ++a;
  for (unsigned i(1); i <= n; ++i) Add(a[i] -= 'a'), Pos[i] = Last, A = i, Insert(Last->Root = ++CntS, 1, n);
  for (Node* i(N + 1); i <= CntN; ++i) i->Bro = i->Fa[0]->Son, i->Fa[0]->Son = i;
  DFS(N);
  for (unsigned i(1); i <= m;++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    unsigned BL(1), BR(min(D - C + 1, B - A + 1)), BMid;
    while (BL ^ BR) {
      BMid = (BL + BR + 1) >> 1;
      Node* Jump(Pos[C + BMid - 1]);
      for (char i(15); i >= 0; --i) if ((Jump->Fa[i]) && (Jump->Fa[i]->Len >= BMid)) Jump = Jump->Fa[i];
      Tmp = 0, QrL = A + BMid - 1, QrR = B, Qry(Jump->Root, 1, n);
      if (Tmp) BL = BMid;
      else BR = BMid - 1;
    }
    printf("%u\n", BL);
  }
  // system("pause");
  return Wild_Donkey;
}
```