# 李超线段树

用来处理线段的数据结构, 可以解决有这两种操作的在线问题:

- 插入一条线段

- 查询某个横坐标的最高线段

## 原理

线段树维护的是横坐标, 每个节点存储节点表示的区间的最优线段, 最优线段需要满足:

- 横坐标完全覆盖这个区间.

- 满足上一个条件的线段中, 在区间中点处, 最高的那一条.

这里的最优线段可以理解为特殊的永久化标记.

## 插入

规定横坐标的规模是 $O(Mx)$ 的整数.

我们像一般线段树一样, 把待插入的线段分成 $O(O(\log Mx))$ 段, 分别进行插入.

对于某一段, 它对应着一个节点, 我们先计算新线段对这个节点最优线段的影响.

直接计算新线段和原来最优线段在中点的取值比较得到本区间的最优线段.

+ 如果新线段不是最优线段:

如果新线段和最优线段没有交点, 那么直接结束插入, 因为它处处都比最优线段要低.

如果有交点, 那么在交点的一侧, 新线段在最优线段之上, 我们递归到交点所在的儿子继续处理, 把新线段插入这个儿子.

+ 如果新线段是最优线段:

如果新线段和最优线段没有交点, 那么直接修改掉最优线段, 因为原最优线段在这个区间可以完全被代替.

如果有交点, 那么在交点的一侧, 新线段在原线段之下, 我们递归到交点所在的儿子继续处理, 把原线段插入这个儿子.

## 查询

查询到时候需要注意综合查询路径上的所有节点信息, 这是标记永久化最大的特点, 对于每个最优线段计算目标横坐标的纵坐标, 取最大的一条.

## 复杂度

每插入一条线段时对 $O(\log Mx)$ 段进行插入, 每一段插入时, 递归 $O(\log Mx)$ 层, 每层有唯一分支, 所以插入复杂度是 $O(\log^2 Mx)$.

查询时只需要递归 $O(\log Mx)$ 层找到答案即可, 所以是 $O(\log Mx)$ 的.

## 正确性

先说结论: 李超树的每个节点存的不一定是最优线段, 但是它真正的最优线段一定是根到这个节点路径上至少一个节点的最优线段. 并且, 李超树的查询结果是正确的.

这个结论和标记永久化的精神十分符合. 结合插入的过程, 我们对于线段处处高于原最优线段的情况, 选择了只修改一个节点的最优线段, 然后返回. 其意义是对于在这个节点区间内的一切查询, 都可以把原线段替换为新线段计算.

这样的过程会导致一些线段在插入的过程中没有更新自己所有儿子的最优线段. 这就是为什么说每个节点存的线段不一定是最优线段.

我们用归纳法说明查询的正确性, 假设插入之前, 李超树上所有坐标的查询都正确. 插入后, 因为当前区间中的查询的答案已经不可能是原线段了, 所以原线段的存在便失去了意义, 我们将这个节点的最优线段变成新线段之后, 使得区间中每个查询所递归的可能会作为答案的 $O(\log Mx)$ 个线段中, 原线段替换为新线段. 因为原来的查询是正确的, 所以答案一定在这些线段中, 又因为在这个区间中新线段一定优于原线段, 因此答案一定正确.

## 代码实现

由于计算交点的常数较大, 我们可以根据待插入线段是否是最优线段和两条线段的斜率来定性判断交点的位置, 而斜率是可以预处理的.

由于判断是否相交的常数较大, 所以我们有两种选择, 第一种是判断是否相交来剪枝, 第二种是不判断是否相交, 因为多余的递归不影响正确性, 且不判断可以减少代码难度.

我们发现, 只需要在第二种的写法的基础上加两行 (就是判断两条线段在端点的高低的那两句), 就可以变成第一种写法. 而第一种写法可以让[模板题](https://www.luogu.com.cn/problem/P4097)的效率提高一倍以上. ($1.29s \rightarrow 579ms$)

```cpp
const double Ep(0.0000000001);
const unsigned Mod(39989), Inf(1000000000);
double Now(0);
unsigned A, B, Ans(0);
inline char Eq(double x, double y) { return (x + Ep >= y) && (y + Ep >= x); }
struct Seg {
  double K;
  unsigned Lx, Ly, Rx, Ry;
  inline void In() {
    Lx = ((RD() + Ans - 1) % Mod) + 1, Ly = ((RD() + Ans - 1) % Inf) + 1;
    Rx = ((RD() + Ans - 1) % Mod) + 1, Ry = ((RD() + Ans - 1) % Inf) + 1;
    if (Lx > Rx) swap(Lx, Rx), swap(Ly, Ry);
    K = ((double)Ry - Ly) / (Rx - Lx);
  }
  inline double Get(unsigned x) {
    if (Rx == Lx) return max(Ly, Ry);
    return Ly + ((((double)Ry - Ly)) * (x - Lx) / (Rx - Lx));
  }
}S[100005], * Best;
struct Node {
  Seg* Mx;
  Node* LS, * RS;
  inline void Insert(unsigned L, unsigned R, Seg* Cur) {
    if (L == R) {
      if (Mx > S + 100000) { Mx = Cur; return; }
      double CM(Cur->Get(L)), XM(Mx->Get(L));
      if (Eq(CM, XM)) { Mx = min(Mx, Cur); return; }
      if (CM > XM) Mx = Cur; return;
    }
    unsigned Mid((L + R) >> 1);
    if ((A <= L) && (R <= B)) {
      if (Mx > S + 100000) { Mx = Cur; return; }
      double CM(Cur->Get(Mid)), XM(Mx->Get(Mid));
      if (Eq(CM, XM)) {
        if (Eq(Cur->K, Mx->K)) { Mx = min(Mx, Cur); return; }
        if (Cur < Mx) {
          if (Cur->K > Mx->K) LS->Insert(L, Mid, Mx);
          else RS->Insert(Mid + 1, R, Mx);
        }
        else {
          if (Cur->K > Mx->K) RS->Insert(Mid + 1, R, Cur);
          else LS->Insert(L, Mid, Cur);
        }
        Mx = min(Mx, Cur);
        return;
      }
      if (CM > XM) {
        if((Cur->Get(L) + Ep > Mx->Get(L)) && (Cur->Get(R) + Ep > Mx->Get(L))) {Mx = Cur;return;}
        if (Cur->K > Mx->K) LS->Insert(L, Mid, Mx);
        else RS->Insert(Mid + 1, R, Mx);
        Mx = Cur;return;
      }
      if((Mx->Get(L) + Ep > Cur->Get(L)) && (Mx->Get(R) + Ep > Cur->Get(L))) return;
      if (Cur->K > Mx->K) return RS->Insert(Mid + 1, R, Cur);
      else return LS->Insert(L, Mid, Cur);
    }
    if (A <= Mid) LS->Insert(L, Mid, Cur);
    if (Mid < B) RS->Insert(Mid + 1, R, Cur);
  }
  inline void Qry(unsigned L, unsigned R) {
    double Tmp((Mx <= S + 100000) ? Mx->Get(A) : -1);
    if (Eq(Tmp, Now)) Best = min(Best, Mx);
    else if (Tmp > Now) Best = Mx, Now = Tmp;
    if (L == R) return;
    unsigned Mid((L + R) >> 1);
    if (A <= Mid) LS->Qry(L, Mid);
    else RS->Qry(Mid + 1, R);
  }
}N[80000], * CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  x->Mx = S + 2000000;
  if (L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
}
unsigned m, n, Cnt(0);
signed main() {
  n = RD(), Build(N, 1, Mod);
  for (unsigned i(1); i <= n; ++i)
    if (RD()) S[++Cnt].In(), A = S[Cnt].Lx, B = S[Cnt].Rx, N->Insert(1, Mod, S + Cnt);
    else A = ((RD() + Ans - 1) % Mod) + 1, Best = NULL, Now = 0, N->Qry(1, Mod), Ans = Best - S, printf("%u\n", Ans = ((Ans > 0x3f3f3f3f) ? 0 : Ans));
  return Wild_Donkey;
}
```

## 推广到直线

如果把直线看成横坐标最小值和最大值为线段树根节点区间的线段, 再用李超树维护, 这个问题的插入就变成了 $O(\log Mx)$. 因为每个线段只被分成一段来插入.

下面是直线版李超树的[模板题](https://www.luogu.com.cn/problem/P4254). 这道题有个坑, 就是给出直线的截距其实是 $x = 1$ 时的 $y$ 值, 所以输入数据需要减掉一个斜率才能当成截距来用.

小知识: 浮点数强转成整形, 会直接把绝对值的小数点之后的部分抹掉, 也就是 $2.9 \rightarrow 2$, $2.1 \rightarrow 2$, $-2.9 \rightarrow -2$, $-2.1 \rightarrow 2$.

这道题判断相交的优化力度就很有限了 ($767ms \rightarrow 626ms$), 主要原因还是插入操作的时间占比变低.
```cpp
const double Ep(0.0000001);
double Ans(0);
unsigned a[10005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
char IO[10];
struct Seg {
  double Y0, K;
  inline void Inp() { scanf("%lf%lf", &Y0, &K), Y0 -= K; }
  inline double Get(unsigned x) { return Y0 + K * x; }
}S[100005];
struct Node {
  Seg* Mx;
  Node* LS, * RS;
  inline void Insert(unsigned L, unsigned R, Seg* x) {
    if (!Mx) { Mx = x; return; }
    if (L == R) { if (x->Get(L) > Mx->Get(L)) Mx = x; return; }
    unsigned Mid((L + R) >> 1);
    if (x->Get(Mid) > Mx->Get(Mid)) {
      if ((x->Get(L) + Ep < Mx->Get(L)) || (x->Get(R) + Ep < Mx->Get(R))) {
        if (x->K > Mx->K) LS->Insert(L, Mid, Mx);
        else RS->Insert(Mid + 1, R, Mx);
      }
      Mx = x;
    }
    else {
      if ((Mx->Get(L) + Ep < x->Get(L)) || (Mx->Get(R) + Ep < x->Get(R))) {
        if (x->K > Mx->K) RS->Insert(Mid + 1, R, x);
        else LS->Insert(L, Mid, x);
      }
    }
  }
  inline void Find(unsigned L, unsigned R) {
    if (Mx) Ans = max(Ans, Mx->Get(A));
    if (L == R) return;
    unsigned Mid((L + R) >> 1);
    if (A <= Mid) LS->Find(L, Mid);
    else RS->Find(Mid + 1, R);
  }
}N[100005], * CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  if (L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
}
signed main() {
  Build(N, 1, 50000);
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    scanf("%s", IO);
    if (*IO == 'P') S[++Cnt].Inp(), N->Insert(1, 50000, S + Cnt);
    else A = RD(), Ans = 0, N->Find(1, 50000), printf("%d\n", (int)(Ans / 100));
  }
  return Wild_Donkey;
}
```