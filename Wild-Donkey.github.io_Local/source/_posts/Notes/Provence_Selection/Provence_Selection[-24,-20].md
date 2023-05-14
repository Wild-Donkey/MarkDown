---
title: 省选日记 Day-24~-20
date: 2022-03-20 12:03
categories: Notes
tags:
  - Data_Structure
  - Segment_Tree
  - Computational_Geometry
  - Scanline
  - Self_Balancing_Binary_Search_Tree
  - Mathematics
  - Combinatorial_Mathematics
  - Dynamic_Programming
  - Lucas_Theorem
  - Dynamic_Programming_on_Tree
  - Mo_Algorithm
  - Mo_Algorithm_Rollback
  - Linking_Table
thumbnail: /images/Photo1.JPG
---

# 省选日记 Day $-24$ - Day $-20$

## Day $-24$ Mar 10, 2022, Thursday

### [IOI2014 Wall](https://www.luogu.com.cn/problem/P4560)

维护一个初始全为 $0$ 的序列, 支持两种操作: 区间推平和区间填平.

推平是把 $\geq h$ 的部分变成 $h$, 填平是把所有 $\leq h$ 的部分变成 $h$.

先考虑如果初始不全为 $0$, 操作区间都是 $[1, n]$ 的问题如何解决. 发现可以把所有元素看成是一堆点, 填平是拿一条直线从 $-\infin$ 推到 $h$, 推平是拿一条直线从 $\infin$ 推到 $h$. 我们只要记录一个区间 $[L, R]$ 表示当前有效值域区间, 每次填平就移动 $L$, 推平就移动 $R$, 为了避免 $L > R$ 的情况, 每次出现这种情况, 就同时移动另一个端点使得 $L = R$ 即可. 这样进行一系列操作后, 就等价于进行一次 $L$ 的填平和一次 $R$ 的推平.

我们用线段树记录每个区间的填平和推平操作, 每次下传操作相当于对儿子做一次填平和一次推平. 过程中一定有每个节点记录的操作时间在它的父亲之前, 因为要想操作这个节点, 一定会把它的父亲的操作先下传.

最后 DFS 将所有节点的操作都下传到叶子, 得到每个点的元素最后的值 $L$.

```cpp
unsigned a[10005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node {
  Node* LS, * RS;
  unsigned Mn, Mx;
  inline void PsDw() {
    if(Mn || (Mx ^ 0x3f3f3f3f)) {
      LS->Mn = max(Mn, LS->Mn), LS->Mx = max(LS->Mx, LS->Mn);
      RS->Mn = max(Mn, RS->Mn), RS->Mx = max(RS->Mx, RS->Mn);
      LS->Mx = min(Mx, LS->Mx), LS->Mn = min(LS->Mn, LS->Mx);
      RS->Mx = min(Mx, RS->Mx), RS->Mn = min(RS->Mn, RS->Mx);
      Mn = 0, Mx = 0x3f3f3f3f;
    }
  }
  inline void Add (unsigned L, unsigned R){
    if((A <= L) && (R <= B)) {Mn = max(Mn, C), Mx = max(Mn, Mx); return;}
    PsDw();
    unsigned Mid((L + R) >> 1);
    if(A <= Mid) LS->Add(L, Mid);
    if(B > Mid) RS->Add(Mid + 1, R);
  }
  inline void Rem (unsigned L, unsigned R){
    if((A <= L) && (R <= B)) {Mx = min(Mx, C), Mn = min(Mx, Mn); return;}
    PsDw();
    unsigned Mid((L + R) >> 1);
    if(A <= Mid) LS->Rem(L, Mid);
    if(B > Mid) RS->Rem(Mid + 1, R);
  }
  inline void Prt () {
    if(!LS) {printf("%u\n", Mn); return;}
    PsDw(), LS->Prt(), RS->Prt();
  }
}N[4000005], *CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  x->Mn = 0, x->Mx = 0x3f3f3f3f;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
}
signed main() {
  n = RD(), m = RD(), Build(N, 1, n); 
  for (unsigned i(1); i <= m; ++i) {
    D = RD(), A = RD() + 1, B = RD() + 1, C = RD();
    if(D & 1) N->Add(1, n);
    else N->Rem(1, n);
  }
  N->Prt(), putchar(0x0A);
  return Wild_Donkey;
}
```

### [COCI2009-2010 XOR](https://www.luogu.com.cn/problem/P4515)

求同一个方向的等腰直角三角形的面积异或和. (也就是被奇数个三角形覆盖区域的面积和)

显然这是一个扫描线问题, 我们想办法把整个局面竖直分成若干段, 分别对每一段求解.

一段是可求解的, 要求在这一段里的三角形竖直的边界线只能出现在边界处, 且斜着的和水平的边界线只能在边界处相交, 在内部不相交. (可重合)

我们先考虑如何对满足上述要求的一段进行求解. 边界分为两种, 一种是右下-左上方向的斜边, 另一种是水平的直角边. 我们知道两个边界会围出一个矩形或梯形或三角形甚至是线段, 我们可以把三角形看成上底为 $0$ 的梯形, 把线段看成宽为 $0$ 的矩形.

我们把出现在这一段的所有边界线都按它们在左边界的高度排好序, 两条边界线的类型确定了中间围出来的是什么图形, 知道了这一段的宽度和左边界的高度差, 结合中间图形的类型就可以算出这一块的面积. 在扫描过程中将一个布尔值不断异或 $1$ 表示这一块是否计算即可.

这样计算一段就是 $O(n)$ 条边界线, 加上排序复杂度就是 $O(n\log n)$.

注意排序时遇到两条类型不同, 左边界高度相同的边界线时, 把水平的边界线放在前面, 否则会出现负数面积的图形.

接下来考虑如何分段. 因为水平和竖直边界线都是整数位置, 所以所有交点也都是整点, 因此最简单的分段方法就是每个坐标看成一段, 一个单位一个单位地计算. 因此复杂度为 $O(V_xn\log n)$.

但是我们只要把每个三角形的左端点和右端点加入分段边界. 然后把斜边和水平边两两相交的横坐标加入分段边界, 理论最多有 $O(n^2)$ 的分段. 因此复杂度为 $O(n^3\log n)$. 如果 $V_y$ 较小, 我们还可以用桶排去掉 $\log n$, 变成 $O(n^2(n + V_y))$.

```cpp
unsigned long long b[202], Ans;
unsigned ECnt(0), m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
struct Trian {
  unsigned long long Beg, Dir, Low;
  inline const char operator < (const Trian& x) const {  return (Low ^ (x.Low)) ? (Low < x.Low) : (Beg < x.Beg);  }
}a[12];
struct Edit {
  unsigned long long Pos;
  char Ty;
  inline const char operator < (const Edit& x) const {  return (Pos ^ x.Pos) ? (Pos < x.Pos) : (Ty > x.Ty);  }
}E[22];
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) 
    b[++Cnt] = a[i].Beg = RD(), a[i].Low = RD(), b[++Cnt] = a[i].Beg + (a[i].Dir = RD());
  sort(a + 1, a + n + 1);
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(i + 1); j <= n; ++j) if(a[j].Low < a[i].Low + a[i].Dir) {
      unsigned long long Cur(a[i].Beg + a[i].Dir - (a[j].Low - a[i].Low));
      if(a[j].Beg < Cur && a[j].Beg + a[j].Dir > Cur) b[++Cnt] = Cur;
    }
  }
  sort(b + 1, b + Cnt + 1), Cnt = unique(b + 1, b + Cnt + 1) - b - 1;
  for (unsigned i(1); i < Cnt; ++i) {
    ECnt = 0;
    for (unsigned j(1); j <= n; ++j) if (a[j].Beg == b[i]) {
      E[++ECnt] = {a[j].Low, 0};
      E[++ECnt] = {a[j].Low + a[j].Dir, 1};
      if(b[i + 1] == a[j].Beg + a[j].Dir) swap(a[j], a[n]), --j, --n;
      else a[j].Beg = b[i + 1], a[j].Dir -= b[i + 1] - b[i];
    }
    sort(E + 1, E + ECnt + 1);
    for (unsigned j(1), k(0); j < ECnt; ++j) {
      k ^= 1;
      if(k) {
        Ans += (((E[j + 1].Pos - E[j].Pos) * (b[i + 1] - b[i])) << 1);
        if(E[j].Ty ^ E[j + 1].Ty) {
          if(E[j].Ty) Ans += (b[i + 1] - b[i]) * (b[i + 1] - b[i]);
          else Ans -= (b[i + 1] - b[i]) * (b[i + 1] - b[i]);
        }
      }
    }
  }
  printf("%.1lf\n", (double)Ans / 2);
  return Wild_Donkey;
}

```

## Day $-23$ Mar 11, 2022, Friday

### [CQOI2011 动态逆序对](https://www.luogu.com.cn/problem/P3157)

树套树.

外层线段树, 内层平衡树. 每个节点存它表示的区间的逆序对个数, 每次删除的时候从下往上考虑和兄弟的逆序对个数减少了多少, 上传到父亲上.

从去年 $5$ 月写 LCT 时碰过 Splay 之后, 我便再没有写过 Splay. 今天回忆一下 Splay. (三天之后才写)

```cpp
unsigned a[100005], b[100005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Set {
  Set *Son[2], *Fa;
  unsigned Val, Size;
  inline void Prt() {
    if(Son[0]) Son[0]->Prt();
    printf("%u ", Val);
    if(Son[1]) Son[1]->Prt();
  }
  inline void PsUp() {
    Size = 1;
    if(Son[0]) Size += Son[0]->Size;
    if(Son[1]) Size += Son[1]->Size;
  }
  inline void Rotate() {
    Set* Cur(Fa);
    Fa = Cur->Fa;
    char Ty(Cur->Son[1] == this);
    if(Cur->Fa) Cur->Fa->Son[Cur->Fa->Son[1] == Cur] = this;
    if(Cur->Son[Ty] = Son[Ty ^ 1]) Son[Ty ^ 1]->Fa = Cur;
    (Son[Ty ^ 1] = Cur)->Fa = this;
    Size = Cur->Size, Cur->PsUp();
  }
  inline void Splay() {
    Set* Cur(Fa), *Grd;
    while (Cur) {
      if(!(Grd = Cur->Fa)) return Rotate();
      char Tym(Cur->Son[1] == this), Tyf(Grd->Son[1] == Cur);
      if(Tym ^ Tyf) Rotate(), Rotate(); 
      else Cur->Rotate(), Rotate();
      Cur = Fa;
    }
  }
  inline Set* Rank () {
    if(A == Val) {++B; if(Son[0]) B += Son[0]->Size; Splay(); return this;}
    if(A > Val) {
      ++B;
      if(Son[0]) B += Son[0]->Size;
      if(Son[1]) return Son[1]->Rank();
      else {Splay(); return this;}
    }
    if(Son[0]) return Son[0]->Rank();
    else { Splay(); return this;}
  }
  inline Set* Find() {
    if(Son[0]) {
      if(B <= Son[0]->Size) return Son[0]->Find();
      else B -= Son[0]->Size;
    }
    if(B == 1) return this;
    --B;
    return Son[1]->Find();
  }
  inline Set* Delete() {
    Set* Rot;
    B = 0, Rot = Rank(), C = B;
    Set* Me(Rot->Find()), *Nxt;
    if(Rot->Size ^ C) {
      B = C + 1, (Nxt = Rot->Find())->Splay(), Me->Splay();
      Nxt->Son[0] = Me->Son[0], Nxt->PsUp(), Nxt->Fa = NULL;
      if(Nxt->Son[0]) Nxt->Son[0]->Fa = Nxt;
      return Nxt;
    }
    Me->Splay();
    if(Me->Son[0]) Me->Son[0]->Fa = NULL;
    return Me->Son[0];
  }
}Pool[2000005], *CntS(Pool);
inline void Detail(Set *x) {
  printf("Set %u(%u) Sons %u %u Size %u Fa %u\n", x - Pool, x->Val, x->Son[0] - Pool, x->Son[1] - Pool, x->Size, x->Fa - Pool);
}
inline Set* Cnstr(unsigned* x, const unsigned y, Set* Fa) {
  if(!y) return NULL;
  if(y == 1) {
    *(++CntS) = {NULL, NULL, Fa, x[1], 1};
    return CntS;
  }
  unsigned Mid(y >> 1);
  Set* Rt(++CntS);
  *Rt = {Cnstr(x, Mid - 1, Rt), Cnstr(x + Mid, y - Mid, Rt), Fa, x[Mid], 1};
  Rt->PsUp();
  return Rt;
}
struct Node {
  Set *S;
  Node *LS, *RS;
  unsigned long long Inv, Sum;
  inline void Del(unsigned L, unsigned R) {
    if(L == R) {S = NULL; return;}
    unsigned Mid((L + R) >> 1);
    if(D <= Mid) {
      if(RS->S) B = 0, RS->S = RS->S->Rank(), Inv -= B;
      LS->Del(L, Mid);
    }
    else {
      if(LS->S) B = 0, LS->S = LS->S->Rank(), Inv -= LS->S->Size - B;
      RS->Del(Mid + 1, R);
    }
    Sum = LS->Sum + RS->Sum + Inv;
    S = S->Delete();
  }
}N[200005], *CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  if(L == R) {x->Inv = x->Sum = 0, *(x->S = (++CntS)) = {NULL, NULL, NULL, a[L] = RD(), 1}, b[a[L]] = L; return;}
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  for (unsigned i(L); i <= Mid; ++i)
    A = a[i], B = 0, x->RS->S = x->RS->S->Rank(), x->Inv += B;
  unsigned Ta[R - L + 1];
  for (unsigned i(L), j(Mid + 1), k(0); (i <= Mid) || (j <= R); ++k) {
    if(i > Mid) {Ta[k] = a[j++];continue;}
    if(j > R) {Ta[k] = a[i++];continue;}
    if(a[i] < a[j]) Ta[k] = a[i++];
    else Ta[k] = a[j++];
  }
  memcpy(a + L, Ta, (R - L + 1) << 2);
  x->S = Cnstr(a + L - 1, R - L + 1, NULL);
  x->Sum = x->LS->Sum + x->RS->Sum + x->Inv;
}
signed main() {
  n = RD(), m = RD();
  Build(N, 1, n);
  printf("%llu\n", N->Sum);
  for (unsigned i(1); i < m; ++i) {
    D = b[A = RD()];
    N->Del(1, n);
    printf("%llu\n", N->Sum);
  }
  return Wild_Donkey;
}
```

这个题可以转化为三位偏序问题, 设 $t_i$ 表示元素 $i$ 删除的时间, 求出 $(i, j)$ 的数量满足, $t_i \geq t_j$, $i < j$, $a_i > a_j$. 设未被删除的元素在 $m + 1$ 时刻被删除.

由于本题需要求每个时刻的答案, 所以我们设 $Ans_i$ 表示时刻 $i$ 比时刻 $i + 1$ 多的答案. 这要求我们对于 $(i, j)$, 将它统计入 $Ans_{t_i - 1}$ 即可.

最后只要求后缀和即可得到答案.

当然这个题还有树状数组套线段树等奇妙算法.

### THUPC 模拟赛

我躺了, 复制儒略历做了个大模拟. 全靠学弟带, 之后会补几道题.

### [THUPC2019 鸽鸽的分割](https://www.luogu.com.cn/problem/P5377)

这个题被学弟场上秒了.

后来我补题, 手玩了几组样例.

> 嘿, 这不就是输出 $2^{n - 1}$ 吗? 什么傻逼题.

交上发现有问题, 想到欧拉公式, 也就是大名鼎鼎的欧拉-笛卡尔公式:

$$
\chi = F - E + V
$$

$\chi$ 是欧拉示性数, 它是一个拓扑不变量, 对于所有和球面同胚的多面体, 有 $\chi = 2$.

$F$ 表示 Face, 也就是面数; $E$ 表示 Edge, 即边数; $V$ 表示 Vertex, 即点数.

我们这个题求的是面数减 $1$, 因为不算蛋糕之外的那个大面, 所以要减去.有式子:

$$
Ans = F - 1 = 1 + E - V
$$

$i$ 条线段在圆内交于一点, 相对于它们两两相交于不同的点, 会减少 $i(i - 2)$ 条线段和 $\dfrac{i(i - 1)}2 - 1$ 个节点, 发现 $i > 2$ 时都有 $i(i - 2) > \dfrac{i(i - 1)}2 - 1$, 因此最优策略一定需要不存在三条及以上的线段在圆内交于同一点的情况.

考虑计算点数和边数, 我们把一开始选择的 $n$ 个点称为初始点. 除了每个初始点以外, 线段两两相交也会带来点. 对于圆上被初始点分成的 $n$ 段, 我们也暂时不考虑, 接下来只计算圆内的段数和点数.

对于一条连接两个初始点的线段, 假设它们一侧有 $i$ 个初始点, 那么另一侧就有 $n - 2 - i$ 个初始点, 如果两两线段交于不同的点, 则这条线段在圆内有 $i(n - 2 - i)$ 个分界点, 被分成了 $i(n - 2 - i) + 1$ 段.

因为每个点是等价的, 我们只要计算一个点的值, 乘以 $n$ 就可以算出来.

因为一条初始点之间的线段有两个端点, 同样的信息我们会统计两次, 所以我们要把段数除以 $2$, 又因为两条线段相交才能得到一个点, 所以我们需要把计算出来的点数除以 $4$.

最后边数点数各自加上 $n$ 即可, 表示圆周上的点和边.

$$
\begin{aligned}
E &= n + \frac n2 \sum_{i = 0}^{n - 2} ((n - 2 - i)i + 1)\\
V &= n + \frac n4 \sum_{i = 0}^{n - 2} (n - 2 - i)i\\
Ans &= 1 + E - V\\
&= 1 + n + \frac n2 \sum_{i = 0}^{n - 2} ((n - 2 - i)i + 1) - n - \frac n4 \sum_{i = 0}^{n - 2} (n - 2 - i)i\\
&= 1 + \frac n2 \sum_{i = 0}^{n - 2} ((n - 2 - i)i + 1) - \frac n4 \sum_{i = 0}^{n - 2} (n - 2 - i)i\\
&= 1 + \frac {n(n - 1)}2 + \frac n2 \sum_{i = 0}^{n - 2} (n - 2 - i)i - \frac n4 \sum_{i = 0}^{n - 2} (n - 2 - i)i\\
&= 1 + \frac {n(n - 1)}2 + \frac n4 \sum_{i = 0}^{n - 2} (n - 2 - i)i\\
&= 1 + \frac {n(n - 1)}2 + \frac {n(n - 2)}4 \sum_{i = 0}^{n - 2} i - \frac n4 \sum_{i = 0}^{n - 2} i^2\\
&= 1 + \frac {n(n - 1)}2 + \frac {n(n - 1)(n - 2)^2}8 - \frac {n(n - 1)(n - 2)(2n - 3)}{24}\\
&= 1 + \frac {n(n - 1)}2(1 + \frac {(n - 2)^2}4 - \frac{(n - 2)(2n - 3)}{12})\\
&= 1 + \frac {n(n - 1)}2(1 + \frac{(n - 2)(n - 3)}{12})\\
\end{aligned}
$$

对于每个询问 $O(1)$ 地计算该式子即可.

```cpp
unsigned a[10005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  while (scanf("%u", &A) == 1) {
    if(A <= 1) {printf("1\n"); continue; }
    if(A == 2) {printf("2\n"); continue; }
    Ans = 1 + (B = (((A - 1) * A) >> 1));
    B *= (A - 2) * (A - 3), B >>= 2, B /= 3;
    printf("%u\n", Ans + B);
  }
  return Wild_Donkey;
}
```

### [THUPC2019 过河卒二](https://www.luogu.com.cn/problem/P5376)

以前做过一道这种题, 是容斥.

先求出往右走 $i$ 单位, 往上走 $j$ 单位的方案数 $f_{i, j}$.

因为只有直着走的方案数是容易求的, 即为 $\dbinom {i + j}i$ 枚举斜着走的数量 $Ob$, 横纵坐标在没有障碍的时候是本质相同的, 所以不失一般性, 我们认为 $i \leq j$. 方案数可以表示为:

$$
\begin{aligned}
\sum_{Ob = 0}^{i} \binom{i + j - Ob}{Ob}\binom{i + j - 2Ob}{i - Ob}
\end{aligned}
$$

由于本题的模数较小, 所以进行预处理之后可以结合卢卡斯定理 $O(\log n)$ 查询组合数.

接下来考虑容斥, 我们设 $g_i$ 表示从起点不经过任何障碍到达第 $i$ 个障碍的方案数.

枚举满足 $x_k < x_i$, $y_k < y_i$ 的 $k$ 作为从起点到 $k$ 路径上最先到达的障碍.

$$
g_i = f_{x_i - 1, y_i - 1} - \sum_k g_kf_{x_i - x_k, y_x - y_k}
$$

可行的终点分为 $3$ 类, 分别为: 上边界, 右边界, 角点.

计算到角点 $(n + 1, m + 1)$ 的方案数很简单, 因为我们需要的是离开棋盘的第一步就结束, 所以倒数第二步一定到达的是 $(n, m)$, 最后一步也只有一种走法, 我们求的是到达 $(n, m)$ 的方案数. 我们只要先无视障碍算一遍, 然后枚举所有的障碍作为首个遇到的障碍进行容斥即可.

上边界和右边界是差不多的, 所以这里只讨论上边界.

首先需要计算无视障碍从高 $i$ 宽 $j$ 的矩形的左下角出发, 离开上边界, 且终点横坐标不能超出 $j$ 的方案数. 假设这个矩形左下角为 $(1, 1)$. 注意这个离开上边界的过程到离开上边界为止, 所以离开边界后继续走的就不算了.

发现这种路径和我们走到点 $(j, i + 1)$ 的方案是一一对应的, 因此这个值便是 $f_{j - 1, i}$.

最后统计答案是只要把无视障碍的方案数减去枚举每个障碍作为首个经过的障碍, 乘以这个障碍到达边界的方案数即可.

```cpp
const unsigned Mod(59393);
unsigned Fac[60000], Inv[60000], m, n, K;
unsigned A, B, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline unsigned Mdd(const unsigned x){return (x >= Mod) ? (x - Mod) : x;}
inline unsigned Inver(unsigned x) {
  unsigned y(59391), Rt(1);
  while (y) {if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1;}
  return Rt;
}
inline unsigned Lucas(unsigned x, unsigned y) {
  if(x < y) return 0;
  if(x < Mod) return (Fac[x] * Inv[y] % Mod) * Inv[x - y] % Mod;
  return Lucas(x / Mod, y / Mod) * Lucas(x % Mod, y % Mod) % Mod;
}
inline unsigned F(unsigned x, unsigned y) {
  if(x > y) swap(x, y);
  unsigned Rt(0);
  for (unsigned i(0); i <= x; ++i) Rt = (Rt + Lucas(x + y - i, x) * Lucas(x, i)) % Mod;
  return Rt;
}
inline unsigned G(unsigned x, unsigned y) {return F(y - 1, x);}
struct NotAva{
  unsigned X, Y, g;
  const inline char operator<(const NotAva& x) {return (X ^ x.X) ? (X < x.X) : (Y < x.Y);}
  inline unsigned F() {return ::F(X - 1, Y - 1); }
  inline unsigned F(const NotAva& x) const {return ::F(X - x.X, Y - x.Y);}
}a[21];
signed main() {
  Fac[0] = 1;
  for (unsigned i(1); i < Mod; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[Mod - 1] = Inver(Fac[Mod - 1]);
  for (unsigned i(Mod - 1); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  n = RD(), m = RD(), K = RD();
  for (unsigned i(1); i <= K; ++i) a[i].X = RD(), a[i].Y = RD();
  sort(a + 1, a + K + 1);
  a[0] = {n, m, 0}, a[0].g = a[0].F();
  for (unsigned i(1); i <= K; ++i) {
    a[i].g = a[i].F();
    for (unsigned j(1); j < i; ++j) if(a[j].Y <= a[i].Y) a[i].g = (a[i].g + (Mod - a[i].F(a[j])) * a[j].g) % Mod;
    a[i].g %= Mod;
    a[0].g = (a[0].g + (Mod - a[0].F(a[i])) * a[i].g) % Mod;
  }
  Ans = (G(n, m) + G(m, n) + a[0].g) % Mod;
  for (unsigned i(1); i <= K; ++i) {
    A = n - a[i].X + 1, B = m - a[i].Y + 1;
    Ans = (Ans + Mdd(G(B, A) + G(A, B)) * (Mod - a[i].g)) % Mod;
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

事后发现无需分类讨论, 因为所有的方案都和到达 $(n + 1, m + 1)$ 的路径一一对应. 所以我们求到达 $(n + 1, m + 1)$ 的方案数, 程序后半部分可以改为:

```cpp
a[0] = {n + 1, m + 1, 0}, a[0].g = a[0].F();
for (unsigned i(1); i <= K; ++i) {
  a[i].g = a[i].F();
  for (unsigned j(1); j < i; ++j) if(a[j].Y <= a[i].Y) a[i].g = (a[i].g + (Mod - a[i].F(a[j])) * a[j].g) % Mod;
  a[i].g %= Mod;
  a[0].g = (a[0].g + (Mod - a[0].F(a[i])) * a[i].g) % Mod;
}
printf("%u\n", a[0].g);
```

### 关于某个组合数公式

$$
\dbinom{j + i + 1}{j + 1} = \sum_{k = 0}^i \dbinom {j + k}{j}
$$

关于组合数公式的组合意义.

如果求 $\dbinom{j + i + 1}{j + 1}$, 意义是从 $j + i + 1$ 歌元素中取 $j + 1$ 个元素的方案数. 所有方案中, 最后一个选中的元素的编号区间为 $[j + 1, j + i + 1]$. 如果我们对每个方案设它最后一个选中元素坐标为 $j + k + 1$, 其中 $k \in [0, i]$, 那么这个方案的前 $j + k$ 个元素的选择情况便一定对应唯一的在 $j + k$ 个元素中选择 $j$ 个的方案. 而每个 $\dbinom{j + k}{j}$ 的方案也能对应唯一的 $\dbinom{j + i + 1}{j + 1}$ 中的方案. 所以 $\dbinom{j + i + 1}{j + 1}$ 和 $\displaystyle {\sum_{k = 0}^i \dbinom {j + k}{j}}$ 的方案一一对应, 因此它们想等.

## Day $-22$ Mar 12, 2022, Saturday

### THUPC2022 初赛

窝囊的地方在于最后有两道题没有调出来. J, K 小模拟很无脑, 但是只调出来一道. 中途下楼做核酸也是无奈之举.

### THUPC D

学弟考场降智了, 认为需要的寄存器数量为置换环数量的两倍. 我思考后也降智了, 认为环长超过 $2$ 的环数不超过 $1$ 的情况下可以两个寄存器解决, 环长超过 $3$ 的环数不超过 $3$ 的时候可以三个寄存器解决, 其它情况都可以 $4$ 个寄存器解决.

正解是除了一开始就有序的情况, 都是两个寄存器解决一切问题. 所以这个题就是降智题.

### THUPC A

这个题仍然应用了前两天遇到的 Trick, 如果 $AB$ 边和 $BC$ 边都比 $AC$ 边短, 那么 $AC$ 边可以删掉而不影响答案.

对于每个数 $d$, 我们只要连接范围内最小的 $d$ 的倍数和其它 $d$ 的倍数之间的边即可, 无需再每个数之间连边.

枚举 $d$ 进行连边, 边数为调和级数, 即 $O(n \ln n)$. 最后跑 Kruskal 即可.

### THUPC B

期望概率的 DP, 学弟的方程已经是对的了, 但是没有调出来... 样例太弱了啊.

## Day $-21$ Mar 13, 2022, Sunday

### [P8202 染色](https://www.luogu.com.cn/problem/P8202)

树形 DP, 是无需求逆元的版本.

$\tiny{验题人题解(?)}$

我们设 $Lim = \lfloor \frac n3 \rfloor + 2$, 约束 $3$ 就变成所有颜色出现次数都不大于等于 $Lim$.

先算出忽略限制 $3$ 的方案数. 然后减去规定某个颜色出现大于等于 $Lim$ 的方案数, 这时两个颜色大于等于 $Lim$ 的方案被减去了两次, 所以最后加上两个颜色大于等于 $Lim$ 的方案数.

每个点的状态 $f_{i, j, 0/1/2}$ 表示这个点的子树中颜色 $1$ 的点有 $i$ 个, 颜色 $2$ 的点有 $j$ 个, 这个点的颜色为其它确定的颜色/颜色 $1$/颜色 $2$ 的方案数.

注意这个状态所计算的是当前节点颜色确定的方案数, 转移到父亲时要枚举这个点的颜色.

因为 $i$ 或 $j$ 大于 $Lim$ 就失去意义了, 所以我们把转移到某一维大于 $Lim$ 的状态转移到对应维度等于 $Lim$ 的状态即可.

下面的 $f$ 特指根节点的 DP 数组, 那么总方案就可以表示为:

$$
\sum_{i, j \leq Lim} \max(m - 2, 0) \times f_{i, j, 0} + f_{i, j, 1} + f_{i, j, 2}
$$

表示枚举了所有组合情况下, 根节点为所有 $m$ 种颜色的方案数总和.

接下来我们求强制使某个颜色出现次数大于等于 $Lim$ 的方案数. 因为每个颜色是等价的, 所以不管强制哪个颜色, 它的方案数一定等于强制颜色 $1$ 出现次数大于等于 $Lim$, 我们只要先强制颜色 $1$ 出现多次, 然后乘以 $m$ 即可.

$$
m \sum_{i \leq Lim} \max(m - 2, 0) \times f_{Lim, i, 0} + f_{Lim, i, 1} + f_{Lim, i, 2}
$$

最后求强制某两个颜色出现次数大于等于 $Lim$ 的方案数. 仍然是因为每个颜色等价, 所以我们求强制颜色 $1$ 和 $2$ 出现次数大于等于 $Lim$ 的方案数最后乘 $\dfrac{m(m - 1)}2$.

$$
\frac{m(m - 1)}2 \max(m - 2, 0) \times f_{Lim, Lim, 0} + f_{Lim, Lim, 1} + f_{Lim, Lim, 2}
$$

最后我们只要解决转移的问题就可以了.

对于 $x.f_{i, j, 0}$, 它的每个儿子有颜色 $1$, $2$, 和 $m - 3$ 种其它颜色可选, 枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 0} = \text{Old}x.f_{i1, j1, 0} (\max(m - 3, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 1} + Son.f_{i2, j2, 2})
$$

对于 $x.f_{i, j, 1}$, 它的每个儿子有颜色 $2$, 和 $m - 2$ 种其它颜色可选, 枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 1} = \text{Old}x.f_{i1, j1, 1} (\max(m - 2, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 2})
$$

对于 $x.f_{i, j, 2}$, 它的每个儿子有颜色 $1$, 和 $m - 2$ 种其它颜色可选, 枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 2} = \text{Old}x.f_{i1, j1, 2} (\max(m - 2, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 1})
$$

复杂度类似于树上背包, 是 $O(n^4)$ 的.

```cpp
unsigned long long Mod(998244353);
unsigned long long Ans(0), m, m1, m2, m3;
unsigned n, Tp;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
struct Node {
  vector <Node*> E;
  unsigned f[36][36][3], Size;
}N[105];
inline void DFS(Node* x, Node* Fa) {
  x->Size = x->f[0][0][0] = x->f[1][0][1] = x->f[0][1][2] = 1;
  for (auto i : x->E) if (i != Fa) {
    DFS(i, x);
    unsigned To(x->Size + i->Size);
    unsigned Tmpf[min(To, Tp) + 1][36][3];
    memset(Tmpf, 0, sizeof(Tmpf));
    for (unsigned j1(min(Tp, x->Size)); ~j1; --j1) for (unsigned j2(min(Tp, x->Size)); ~j2; --j2) {
      unsigned* J(x->f[j1][j2]);
      if (!(J[0] || J[1] || J[2])) continue;
      for (unsigned k1(min(Tp, i->Size)); ~k1; --k1) for (unsigned k2(min(Tp, i->Size)); ~k2; --k2) {
        unsigned* K(i->f[k1][k2]), * T(Tmpf[min(j1 + k1, Tp)][min(j2 + k2, Tp)]);
        if (!(K[0] || K[1] || K[2])) continue;
        T[0] = (T[0] + J[0] * (K[0] * m3 % Mod + K[1] + K[2])) % Mod;
        T[1] = (T[1] + J[1] * (K[0] * m2 % Mod + K[2])) % Mod;
        T[2] = (T[2] + J[2] * (K[0] * m2 % Mod + K[1])) % Mod;
      }
    }
    memcpy(x->f, Tmpf, sizeof(Tmpf));
    x->Size = To;
  }
}
signed main() {
  n = RD(), m = RD(), Tp = (n / 3) + 2, m1 = m - 1, m2 = (m1 ? (m1 - 1) : 0), m3 = (m2 ? (m2 - 1) : 0);
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  DFS(N + 1, NULL);
  for (unsigned i(0); i <= Tp; ++i) for (unsigned j(0); j <= Tp; ++j) 
    Ans = (Ans + N[1].f[i][j][0] * m2 + N[1].f[i][j][1] + N[1].f[i][j][2]) % Mod;
  for (unsigned i(0); i <= Tp; ++i) Ans = (Ans + (Mod - m) * ((N[1].f[Tp][i][0] * m2 + N[1].f[Tp][i][1] + N[1].f[Tp][i][2]) % Mod)) % Mod;
  Ans = (Ans + ((N[1].f[Tp][Tp][0] * m2 + N[1].f[Tp][Tp][1] + N[1].f[Tp][Tp][2]) % Mod) * ((m * m1 >> 1) % Mod)) % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## Day $-20$ Mar 14, 2022, Monday

### [WC2022 秃子酋长](https://www.luogu.com.cn/problem/P8078)

对排列进行区间查询, 每次询问区间内的数字排序后相邻的元素在原序列中的距离之和. 距离定义为坐标差的绝对值.

考虑离线算法, 莫队.

我们发现需要用 `set` 维护当前区间. 所以我们拥有了一个 $O(n\sqrt n \log n)$ 的算法. 奇偶排序可以做到 $50'$.

```cpp
unsigned long long Ans[500005], Cur;
unsigned a[500005], m, n, A, B;
unsigned C, D, Beg;
unsigned Cnt(0), Tmp(0);
set <pair<unsigned, unsigned> > S;
struct Qry {
  unsigned L, R, Nu;
  const inline char operator < (const Qry& x) const {
    unsigned BL((x.L + B - 2) / B);
    return (((L + B - 2) / B) ^ BL) ? (((L + B - 2) / B) < BL) : ((BL & 1) ? (R > x.R) : (R < x.R));
  }
}Q[500005];
inline void Add(unsigned x) {
  set <pair<unsigned, unsigned> >::iterator It(S.insert(make_pair(a[x], x)).first), Ti(It), Tii(It);
  unsigned TA(x), TB, TC;
  if (((++Tii) != S.end()) && (Ti != S.begin())) {
    TB = (--Ti)->second, TC = Tii->second;
    Cur -= (TB < TC) ? (TC - TB) : (TB - TC);
    Cur += (TA < TC) ? (TC - TA) : (TA - TC);
    Cur += (TA < TB) ? (TB - TA) : (TA - TB);
  }
  else {
    if (Ti != S.begin()) TB = (--Ti)->second, Cur += (TB < TA) ? (TA - TB) : (TB - TA);
    if (Tii != S.end()) TC = Tii->second, Cur += (TC < TA) ? (TA - TC) : (TC - TA);
  }
}
inline void Del(unsigned x) {
  set <pair<unsigned, unsigned> >::iterator It(S.find(make_pair(a[x], x))), Ti(It), Tii(It);
  unsigned TA(x), TB, TC;
  if (((++Tii) != S.end()) && (Ti != S.begin())) {
    TB = (--Ti)->second, TC = Tii->second;
    Cur += (TB < TC) ? (TC - TB) : (TB - TC);
    Cur -= (TA < TC) ? (TC - TA) : (TA - TC);
    Cur -= (TA < TB) ? (TB - TA) : (TA - TB);
  }
  else {
    if (Ti != S.begin()) TB = (--Ti)->second, Cur -= (TB < TA) ? (TA - TB) : (TB - TA);
    if (Tii != S.end()) TC = Tii->second, Cur -= (TC < TA) ? (TA - TC) : (TC - TA);
  }
  S.erase(It);
}
signed main() {
  n = RD(), m = RD(), B = (n / sqrt(m)) + 1;
  for (unsigned i(1); i <= n; ++i) a[i] = RD();
  for (unsigned i(1); i <= m; ++i) Q[i].L = RD(), Q[i].R = RD(), Q[i].Nu = i;
  sort(Q + 1, Q + m + 1);
  unsigned NL(1), NR = (0);
  for (unsigned i(1); i <= m; ++i) {
    while (NR < Q[i].R) Add(++NR);
    while (NL > Q[i].L) Add(--NL);
    while (NL < Q[i].L) Del(NL++);
    while (NR > Q[i].R) Del(NR--);
    Ans[Q[i].Nu] = Cur;
  }
  for (unsigned i(1); i <= m; ++i) printf("%llu\n", Ans[i]);
  return Wild_Donkey;
}
```

如果我们使用链表代替 `set` 来维护滑动窗口, 会无法插入, 但是删除可以做到 $O(1)$.

所以我们可以进行回滚, 仅删除, 插入靠回滚. 只能得 $95'$:

```cpp
unsigned long long Ans[500005], Tmp, Cur;
unsigned a[500005], m, n, B, NL, NR;
unsigned C, D, STop(0);
char Flg(0), Ava[500005];
struct Qry {
  unsigned L, R, Nu;
  const inline char operator < (const Qry& x) const {
    unsigned BL(x.L / B);
    return ((L / B) ^ BL) ? ((L / B) < BL) : (R > x.R);
  }
}Q[500005];
struct Link {
  Link* Pre, * Aft;
  unsigned Pos;
}N[500005];
struct Back {
  Link Val;
  Link* Pos;
}Stack[1000005];
inline void Init(unsigned Le, unsigned Ri) {
  for (unsigned i(Le); i <= Ri; ++i) Ava[a[i]] = 1;
  Link* Hd(NULL), * Tl(NULL);
  for (unsigned i(1); i <= n; ++i)
    if (Ava[i]) { N[i].Pre = Hd, Hd = N + i, Ava[i] = 0; if (!Tl) Tl = Hd; else Hd->Pre->Aft = Hd; }
  Tl->Pre = Hd->Aft = NULL, Cur = 0;
  while (Tl) {
    if (Tl->Pre) Cur += (Tl->Pos < Tl->Pre->Pos) ? (Tl->Pre->Pos - Tl->Pos) : (Tl->Pos - Tl->Pre->Pos);
    Tl = Tl->Aft;
  }
}
inline void Del(Link* x) {
  unsigned TA(x->Pos), TB(0), TC(0);
  if (x->Pre) {
    if (Flg) Stack[++STop] = Back{ *(x->Pre), x->Pre };
    TB = x->Pre->Pos, x->Pre->Aft = x->Aft;
  }
  if (x->Aft) {
    if (Flg) Stack[++STop] = Back{ *(x->Aft), x->Aft };
    TC = x->Aft->Pos, x->Aft->Pre = x->Pre;
  }
  if (TB) Cur -= (TB < TA) ? (TA - TB) : (TB - TA);
  if (TC) Cur -= (TC < TA) ? (TA - TC) : (TC - TA);
  if (TB && TC) Cur += (TB < TC) ? (TC - TB) : (TB - TC);
}
signed main() {
  n = RD(), m = RD(), B = (n / sqrt(m)) + 1;
  for (unsigned i(0); i < n; ++i) N[a[i] = RD()].Pos = i + 1;
  for (unsigned i(1); i <= m; ++i) Q[i].L = RD() - 1, Q[i].R = RD() - 1, Q[i].Nu = i;
  sort(Q + 1, Q + m + 1);
  for (unsigned i(1); i <= n; ++i) N[i].Pre = N + i - 1, N[i].Aft = N + i + 1;
  N[1].Pre = N[n].Aft = NULL;
  for (unsigned i(1), j(0); i <= m; ++j) {
    if ((Q[i].L / B) ^ j) continue;
    unsigned Le(j * B);
    Init(NL = Le, NR = Q[i].R), Tmp = Cur, STop = 0;
    while ((Q[i].L / B) == j) {
      while (STop) *(Stack[STop].Pos) = Stack[STop].Val, --STop;
      Cur = Tmp, Flg = 0, NL = Le;
      while (NR > Q[i].R) Del(N + a[NR--]);
      Flg = 1, Tmp = Cur;
      while (NL < Q[i].L) Del(N + a[NL++]);
      Ans[Q[i].Nu] = Cur, ++i;
    }
  }
  for (unsigned i(1); i <= m; ++i) printf("%llu\n", Ans[i]);
  return Wild_Donkey;
}
```

进行卡常即可通过此题.

卡常交了一面多, 这个故事告诉我们, 远离指针是最好的选择.

```cpp
const inline unsigned Dif(const unsigned &x, const unsigned &y) { return (x < y) ? (y - x) : (x - y); }
bitset<500005> Ava;
unsigned long long Ans[500005], Tmp, Cur;
unsigned a[500005], m, n, B, NL, NR;
unsigned C, D;
char Flg(0);
struct Qry {
  unsigned L, R, Nu, Bl;
  const inline char operator < (const Qry& x) const {
    return (Bl ^ x.Bl) ? (Bl < x.Bl) : (R > x.R);
  }
}Q[500005];
struct Link {
  unsigned Pre, Aft, Pos;
}N[500005];
struct Back{
  unsigned *Pos, Val;
}Stack[1000005], *STop(Stack);
inline void Init(unsigned Le, unsigned Ri) {
  for (unsigned i(Le); i <= Ri; ++i) Ava[a[i]] = 1;
  unsigned Hd(0), Tl(0);
  Cur = 0;
  for (unsigned i(1); i <= n; ++i) 
    if (Ava[i]) {N[Hd].Aft = i, N[i].Pre = Hd; if(!Hd) Tl = i; else Cur += Dif(N[i].Pos, N[Hd].Pos); Hd = i, Ava[i] = 0; }
  N[Hd].Aft = 0;
}
inline void Del(Link* x) {
  unsigned TA(x->Pos), TB(N[x->Pre].Pos), TC(N[x->Aft].Pos);
  if (TB) {
    if (Flg) *(++STop) = Back{&(N[x->Pre].Aft), N[x->Pre].Aft};
    N[x->Pre].Aft = x->Aft, Cur -= Dif(TB, TA);
  }
  if (TC) {
    if (Flg) *(++STop) = Back{&(N[x->Aft].Pre), N[x->Aft].Pre};
    N[x->Aft].Pre = x->Pre, Cur -= Dif(TC, TA);
  }
  if (TB && TC) Cur += Dif(TB, TC);
}
signed main() {
  n = RD(), m = RD(), B = (n / sqrt(m)) + 1;
  for (unsigned i(0); i < n; ++i) N[a[i] = RD()].Pos = i + 1;
  for (unsigned i(1); i <= m; ++i) Q[i].L = RD() - 1, Q[i].R = RD() - 1, Q[i].Nu = i, Q[i].Bl = Q[i].L / B;
  sort(Q + 1, Q + m + 1);
  for (unsigned i(1), j(0); i <= m; ++j) {
    if ((Q[i].L / B) ^ j) continue;
    unsigned Le(j * B);
    Init(NL = Le, NR = Q[i].R), Tmp = Cur, STop = Stack;
    while ((Q[i].L < (j + 1) * B) && (i <= m)) {
      while (STop > Stack) *(STop->Pos) = STop->Val, --STop;
      Cur = Tmp, Flg = 0, NL = Le;
      while (NR > Q[i].R) Del(N + a[NR--]);
      Flg = 1, Tmp = Cur;
      while (NL < Q[i].L) Del(N + a[NL++]);
      Ans[Q[i].Nu] = Cur, ++i;
    }
  }
  for (unsigned i(1); i <= m; ++i) print(Ans[i]), pc(0x0A);
	fwrite(buf1,1,P3-buf1,stdout);
  return Wild_Donkey;
}
```
