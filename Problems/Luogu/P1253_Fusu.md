# yLOI2018 扶苏的问题

线段树训练题

## 题意

维护序列，要求支持区间赋值，区间增量，查询区间最值。

## 线段树

前置知识: [线段树](https://www.luogu.com.cn/problem/P3372)

区间修改，区间查询问题首先想到线段树，只是这里的线段树和普通的线段树不同，因为它有两种修改。

每个节点对区间赋值维护一个标记 $Val$，如果它不是 $\infty$ 那么就表示这个节点所代表的区间全部被赋成 $Val$ 了。

每个节点对区间增量维护一个标记 $Tag$，表示这个点的区间在上一次下传后被增加了 $Tag$。

两个标记优先级不同，新打的 $Val$ 可以覆盖掉之前的 $Tag$，但是新打的 $Tag$ 不能覆盖之前的 $Val$，只能叠加在 $Val$ 上，使实际权值变成 $Val + Tag$。

上面两个值是通过标记下传维护的。

接下来需要有一个值 $Mx$，表示这个节点表示区间的最大值，这个值需要通过上传维护，一个叶节点的 $Mx$ 就是它代表单点的值，一个非叶节点的 $Mx$ 是它两个儿子的 $Mx$ 的最大值。

## 代码实现

这三种操作的递归方式和普通线段树完全相同。过程中一定要注意两个标记的优先顺序。

值得注意的是，本题的数据中，$x$ 的绝对值是 $10^9$ 的，操作数是 $10^6$，也就是说单点的值可能会爆 `int`，所以用 `long long` 存储。

这种数据结构非常适合用指针写，所以这里的代码使用了指针，不要抗拒指针，学会指针对于之后学高级数据结构来说是一劳永逸的。

接下来是代码，省略了头文件和快读。

```cpp
#define Wild_Donkey 0
#define INF 0x3f3f3f3f3f3f3f3f
long long Ans(0), C, a[2000005];
unsigned m, n, A, B, D;
struct Node {
  Node* LS, * RS;
  long long Mx, Val, Tag;
  inline void PsDw () {
    if(Val != INF) {
      LS->Mx = RS->Mx = LS->Val = RS->Val = Val + Tag;
      LS->Tag = RS->Tag = Tag = 0;
      Val = INF;
    } else {
      if(Tag) {
        LS->Mx += Tag, RS->Mx += Tag;
        LS->Tag += Tag, RS->Tag += Tag;
        Tag = 0;
      }
    }
  }
  inline void Chg (unsigned L, unsigned R) {
    if((A <= L) && (R <= B)) {Tag = 0, Mx = Val = C;return;}
    unsigned Mid((L + R) >> 1);
    PsDw();
    if(A <= Mid) LS->Chg(L, Mid);
    if(B > Mid) RS->Chg(Mid + 1, R);
    Mx = max(LS->Mx, RS->Mx);
  }
  inline void Inc (unsigned L, unsigned R) {
    if((A <= L) && (R <= B)) {Mx += C, Tag += C;return;}
    unsigned Mid((L + R) >> 1);
    PsDw();
    if(A <= Mid) LS->Inc(L, Mid);
    if(B > Mid) RS->Inc(Mid + 1, R);
    Mx = max(LS->Mx, RS->Mx);
  }
  inline void Qry (unsigned L, unsigned R) {
    if((A <= L) && (R <= B)) {Ans = max(Ans, Mx);return;}
    unsigned Mid((L + R) >> 1);
    PsDw();
    if(A <= Mid) LS->Qry(L, Mid);
    if(B > Mid) RS->Qry(Mid + 1, R);
  }
}N[2000005], * CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  x->Val = INF, x->Tag = 0;
  if(L == R) {x->Mx = x->Val = a[L]; return;}
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  x->Mx = max(x->LS->Mx, x->RS->Mx);
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) a[i] = RDsg();
  Build(N, 1, n);
  for (unsigned i(1); i <= m; ++i) {
    D = RD(), A = RD(), B = RD();
    if(D ^ 3) {
      C = RDsg();
      if(D ^ 1) N->Inc(1, n);
      else N->Chg(1, n);
    } else {
      Ans = -INF, N->Qry(1, n);
      printf("%lld\n", Ans);
    }
  }
  return Wild_Donkey;
}
```