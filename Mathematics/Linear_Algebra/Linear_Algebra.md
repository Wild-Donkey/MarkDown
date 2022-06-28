# Linear Algebra

> 线性代数 (linear algebra) 是关于向量空间和线性映射的一个数学分支. 它包括对线, 面和子空间的研究, 同时也涉及到所有的向量空间的一般性质.  ----Wikipedia

## Vector

任意 $n$ 维向量 (Vector) $(a_0, a_1, a_2,...,a_{n - 1})$, $(b_0, b_1, b_2,...,b_{n - 1})$, 其点乘定义为 $\prod_{i = 0}^{n - 1} a_i + \prod_{i = 0}^{n - 1} b_i$.

对于三维向量 $(x_0, y_0, z_0)$, $(x_1, y_1, z_1)$, 其叉乘定义为两个向量所在平面的法向量, 模长是两个向量决定的平行四边形的面积. 即为 $(y_0z_1 - z_0y_1, z_0x_1 - x_0z_1, x_0y_1 - y_0x_1)$. 在右手系内, 对于法向量的方向, 可以用右手定则判断. 如果是左手系则用左手定则判断. 如果是二维向量, 可以将其作为第三维为 $0$ 的向量做叉乘, 得到的向量关于两个向量所在平面垂直, 也就是关于 $x$ 轴, $y$ 轴所在平面垂直, 所以它的前两维一定是 $0$, 我们取它的第三维坐标作为二维向量叉乘的结果.

叉乘的反交换律可以表示为:

$$
\vec a \times \vec b = -\vec a \times \vec b
$$

## System of linear equations

主要用高斯消元 (Gaussian Elimination) 来求解线性方程组(System of linear equations).

一个 $n$ 未知数的线性方程组有唯一解, 需要存在 $n$ 个线性无关的方程.

对于有 $n$ 个未知数, $n$ 个方程的线性方程组, 我们使得矩阵的第 $i$ 行第 $n + 1$ 列为第 $i$ 个方程等号右边的常数. 前 $n$ 列中, 第 $i$ 行第 $j$ 列表示第 $i$ 个方程中第 $j$ 个未知数的系数.

对于线性方程组的增广矩阵, 我们可以进行如下变换并且解不变:

- 交换两行

- 某行乘以某数

- 两行相加减

我们把除第一行以外的行都减去第一行的特定倍数, 使得除第一行以外的每一行的第一项都为 $0$. 用同样的方法把 $[3, n]$ 的第 $2$ 项变成 $0$. 最后得到了第 $i$ 行的前 $i - 1$ 项为 $0$ 的矩阵.

然后反过来, 把前 $n - 1$ 行减去对应倍数的第 $n$ 行, 就可以消掉前 $n - 1$ 行的第 $n$ 项. 以此类推可以让第 $i$ 行只剩下第 $i$ 列和第 $n + 1$ 列. 最后只需要把所有行乘以对应倍数使得第 $i$ 列为 $1$, 这时第 $i$ 行的第 $n + 1$ 列就是解中第 $i$ 个未知数的值了.

复杂度 $O(n^3)$. 下面是[模板题](https://www.luogu.com.cn/problem/P3389)代码:

```cpp
double a[105][105];
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline char Zer(double& x) { return (x <= 0.00000001) && (x >= -0.00000001); }
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n + 1; ++j) a[i][j] = RDsg();
  for (unsigned i(1); i <= n; ++i) {
    unsigned Do(i);
    while ((Zer(a[Do][i])) && (Do <= n)) ++Do;
    if (Do > n) { printf("No Solution\n");return 0; }
    if (Do ^ i) for (unsigned j(i); j <= n + 1; ++j) swap(a[i][j], a[Do][j]);
    for (unsigned j(i + 1); j <= n; ++j) {
      double Tms(-a[j][i] / a[i][i]);
      for (unsigned k(i); k <= n + 1; ++k) a[j][k] += a[i][k] * Tms;
    }
  }
  for (unsigned i(n); i; --i) {
    if (Zer(a[i][i])) { printf("No Solution\n");return 0; }
    for (unsigned j(i - 1); j; --j)
      a[j][n + 1] -= (a[j][i] / a[i][i]) * a[i][n + 1], a[j][i] = 0;
  }
  for (unsigned i(1); i <= n; ++i) printf("%.2lf\n", a[i][n + 1] / a[i][i]);
  return Wild_Donkey;
}
```

## Determinant

对于一个 $n$ 阶方阵 (行列相等的矩阵) $A$, 定义 $\det(A)$ 表示它的行列式 (Determinant). 如果认为 $S_n$ 是 $[1, n]$ 中正整数的所有 $n!$ 种置换的集合. $\mathrm{sgn}(\sigma)$ 在 $\sigma$ 为奇排列时为 $-1$, 是偶排列时是 $1$, 那么方阵 $A$ 的行列式可以表示为:

$$
\det(A) = \sum_{\sigma \in S_n} \mathrm{sgn}(\sigma) \prod_{i = 1}^n A_{i, \sigma(i)}
$$

如果直接求那复杂度将是 $O(n!n)$ 的, 我们仍然使用高斯消元. 其原理是:

- 任意两行(列)交换, 结果取反

- 某行(列)加减另一行(列), 结果不变

- 某行(列)乘以 $k$ 倍, 结果乘以 $k$

我们用前面的变换将矩阵只留下第 $i$ 行后 $i$ 项的过程中记一下结果会变成之前的多少倍即可.

然后是求行列式, 发现所有第 $i$ 项不是 $i$ 的置换都不需要枚举了, 因为它的 $\prod$ 中一定有至少一项是 $0$, 对结果没有贡献. 我们只要对这个矩阵对角线上的元素求积即可.

当需要取模时, 模数任意的情况下我们可能无法找到所需的逆元, 所以我们采用辗转相减法进行消元. 两行之间的减法是 $O(n)$ 的, 每次消掉一个位置的元素需要 $O(\log p)$ 次减法. 一共需要消 $O(n^2)$ 个元素, 所以复杂度是 $O(n^3\log p)$. 但是因为我们是连续消掉一列的元素, 每次相减后, 对应位置剩下的元素是上面所有元素的 GCD, 所以消掉一列元素均摊需要 $O(n + \log p)$ 次减法, 因此更精确的复杂度应该是 $O(n^2(n + \log p))$.

下面是[模板题](https://www.luogu.com.cn/problem/P7112)代码:

```cpp
unsigned long long Gcd(unsigned long long x, unsigned long long y) {
  unsigned long long SwT;
  while (y) SwT = x, x = y, y = SwT % y;
  return x;
}
unsigned long long a[605][605], Mod, G, Tms(1), Ans(1);
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0);
inline void Dec(unsigned long long* f, unsigned long long* g, unsigned x) {
  while (g[x]) {
    unsigned long long Tmp(Mod - (f[x] / g[x]));
    for (unsigned i(x); i <= n; ++i) f[i] = (f[i] + g[i] * Tmp) % Mod;
    for (unsigned i(x); i <= n; ++i) swap(f[i], g[i]);
    Tms = Mod - Tms;
  }
}
signed main() {
  n = RD(), Mod = RD();
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j) a[i][j] = RD() % Mod;
  if (n == 1) { printf("%llu\n", a[1][1]);return 0; }
  for (unsigned i(1); i <= n; ++i) {
    G = Gcd(a[i][1], a[i][2]);
    for (unsigned j(3); j <= n; ++j) G = Gcd(G, a[i][j]);
    if (G > 1) for (unsigned j(1); j <= n; ++j) a[i][j] /= G;
    Tms = Tms * G % Mod;
  }
  for (unsigned i(1); i <= n; ++i) {
    G = Gcd(a[1][i], a[2][i]);
    for (unsigned j(3); j <= n; ++j) G = Gcd(G, a[j][i]);
    if (G > 1) for (unsigned j(1); j <= n; ++j) a[j][i] /= G;
    Tms = Tms * G % Mod;
  }
  for (unsigned i(1); i <= n; ++i) for (unsigned j(n); j > i; --j) if (a[j][i]) Dec(a[j - 1], a[j], i);
  for (unsigned i(1); i <= n; ++i) Ans = Ans * a[i][i] % Mod;
  printf("%llu\n", Ans * Tms % Mod);
  return Wild_Donkey;
}
```

## Matrix Multiplication

对于 $m$ 行 $n$ 列的矩阵 $A$, $n$ 行 $o$ 列的矩阵 $B$, 定义矩阵乘法运算为:

$$
[AB]_{i,j} = \sum_{k = 1}^n A_{i,k}B_{k,j}
$$

$AB$ 是一个 $m$ 行 $o$ 列的矩阵, 矩阵乘法不满足交换律, 满足分配律和结合律.

矩阵乘法的单位矩阵 $I_n$ 是一个 $n * n$ 的矩阵, 其左上右下对角线为 $1$, 其余部分为 $0$. 满足对于任意有 $n$ 列的矩阵 $A$, $AI = A$, 对于任意有 $n$ 行的矩阵 $B$, $IB = B$.

## Inverse Matrix

一个矩阵的乘法逆元是它的逆矩阵 (Inverse Matrix), 只有方阵存在逆矩阵, 定义 $A^{-1}A = I$.

我们把 $A$ 和 $I$ 并排放在一起, 组成 $n$ 行, $2n$ 列的矩阵. 用高斯消元把第 $i$ 行除第 $i$ 项和后 $n$ 项以外的项变成 $0$. 然后第 $i$ 行乘以相应的倍数把第 $i$ 项变成 $1$. 只要得到的左边 $n$ 列是 $I$, 那么右边 $n$ 列就是 $A^{-1}$.

求逆矩阵的过程就是高斯消元的过程, 复杂度 $O(n^3)$. 下面是[模板题](https://www.luogu.com.cn/problem/P4783)代码:

```cpp
const unsigned long long Mod(1000000007);
unsigned long long a[405][805];
unsigned A, B, C, D, t, m, n;
unsigned Cnt(0), Ans(0), Tmp(0);
unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if (y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
signed main() {
  m = ((n = RD()) << 1);
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j) a[i][j] = RD();
  for (unsigned i(1); i <= n; ++i) for (unsigned j(n + 1); j <= m; ++j) a[i][j] = 0;
  for (unsigned i(1); i <= n; ++i) a[i][n + i] = 1;
  for (unsigned i(1); i <= n; ++i) {
    unsigned No(i);
    while ((!a[No][i]) && (No <= n)) ++No;
    if (No > n) { printf("No Solution\n");return 0; }
    if (No ^ i) for (unsigned j(i); j <= m; ++j) swap(a[No][j], a[i][j]);
    for (unsigned j(i + 1); j <= n; ++j) {
      unsigned long long Tms(a[j][i] * (Mod - Pow(a[i][i], Mod - 2)) % Mod);
      for (unsigned k(i); k <= m; ++k) a[j][k] = (a[j][k] + a[i][k] * Tms) % Mod;
    }
  }
  for (unsigned i(n); i; --i) {
    if (!a[i][i]) { printf("No Solution\n");return 0; }
    unsigned long long Chg(Pow(a[i][i], Mod - 2));
    if (Chg != 1) for (unsigned j(i); j <= m; ++j) a[i][j] = a[i][j] * Chg % Mod;
    for (unsigned j(i - 1); j; --j) {
      for (unsigned k(n + 1); k <= m; ++k) a[j][k] = (a[j][k] + a[i][k] * (Mod - a[j][i])) % Mod;
      a[j][i] = 0;
    }
  }
  for (unsigned i(1); i <= n; ++i) { for (unsigned j(n + 1); j <= m; ++j) printf("%llu ", a[i][j]); putchar(0x0A); }
  return Wild_Donkey;
}
```

## Rank

矩阵的秩 (Rank) 定义为最多找出多少行使得它们两两线性无关. 一个矩阵的秩等于它转置矩阵的秩. 把一个矩阵高斯消元后不全为 $0$ 的行的数量就是这个矩阵的秩.

## Kirchhoff's Theorem

基尔霍夫定理 (Kirchhoff's Theorem), 因为是用矩阵求无向图的所有本质不同的生成树的数量, 所以又叫矩阵树定理 (Matrix Tree Theorem):

构造一个矩阵, 对角线上 $(i, i)$ 是第 $i$ 个点的度, 两个点 $i$, $j$ 之间连边就将 $(i, j)$ 和 $(j, i)$ 设为 $-1$. 钦定一个点为根, 则删掉这个点对应的行和列, 矩阵的行列式就是需要求的答案.

对于有向图, $(i, i)$ 记录出度, 每条从 $i$ 到 $j$ 的有向边将 $(i, j)$ 置为 $-1$. 需要枚举每个点作为根求行列式, 然后求和.

如果存在自环, 直接忽略这种边, 因为无论什么生成树都不可能包含自环边. 如果有重边, 我们可以认为这两个点之间有边的情况都要被计数两次, 分别给两个点的度数在之前的基础上再加一, 邻接矩阵上也再减一. 如果把重边看成是带权的边, 有几条重边边权就是几, 那么求得的行列式就是所有生成树的边权之积的总和. 发现两种情况是等价的.

对于带权图, 只要把 $-1$ 设为负的两点间边权总和, 让每条边对度数的共献为边权, 就可以求出每棵生成树的边权积之和了. 有向图也存在类似的结论.

下面是[模板题](https://www.luogu.com.cn/problem/P6178)代码:

```cpp
const unsigned long long Mod(1000000007);
unsigned long long a[305][305], Tms(1);
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(1);
char Opt;
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if (y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
signed main() {
  n = RD() - 1, m = RD(), Opt = RD();
  for (unsigned i(1); i <= m; ++i) {
    A = RD() - 1, B = RD() - 1, C = RD();
    if (A ^ B) {
      a[B][B] += C, a[A][B] += Mod - C;
      if (!Opt) a[A][A] += C, a[B][A] += Mod - C;
    }
  }
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j) a[i][j] %= Mod;
  for (unsigned i(1); i <= n; ++i) {
    unsigned No(i);
    while ((No <= n) && (!a[No][i])) ++No;
    if (No > n) { printf("0\n"); return 0; }
    if (No ^ i) { for (unsigned j(i); j <= n; ++j) swap(a[No][j], a[i][j]); Tms = Mod - Tms; }
    for (unsigned j(i + 1); j <= n; ++j) {
      unsigned long long Tmp(a[j][i] * (Mod - Pow(a[i][i], Mod - 2)) % Mod);
      for (unsigned k(i); k <= n; ++k) a[j][k] = (a[j][k] + a[i][k] * Tmp) % Mod;
    }
  }
  for (unsigned i(1); i <= n; ++i) Ans = Ans * a[i][i] % Mod;
  printf("%llu\n", Ans * Tms % Mod);
  return Wild_Donkey;
}
```
