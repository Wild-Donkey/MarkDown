# 再探傅里叶变换

## 从离散傅里叶变换到随机游走变换

> 一个优美的假做法罢了 ----Wild_Donkey

## 前置知识

[离散傅里叶变换](Mathematics/Polynomial/Convolution)

## 灵感: [量子通信](https://www.luogu.com.cn/problem/P7738)

题意是给一堆 $256$ 位的二进制串, 我们称其为单词. 给出的单词组成一个字典, 每次询问给一个单词, 输出它是否可以取反至多 $k$ 位后得到一个字典内的单词. 这个 $k$ 不大于 $15$.

我一上来就发现, 因为序列进行离散傅里叶变换之后的函数的每一个点值都是根据整个序列的每一个位置的值求出来的, 所以当两个序列长得很像的时候, 他们离散傅里叶变换之后的点值被认为是差别不大的. 更好的性质是, 本题字典是通过给出的生成器随机生成的, 可以考虑非确定性算法. 所以我最初的想法是这样的:

把字典里的所有序列拿出来, 进行离散傅里叶变换, 对于每个频率建一个复平面, 每个单词在这个频率的变换后的点值在这个复平面里是一个点. 每次询问, 在每个复平面里找到询问串的坐标, 然后判断这个坐标附近的点对应的单词和询问串相差几位. 实现上在复平面里找欧氏距离最短的几个点很困难, 所以我们选择取某一维相近的点, 控制这个参数 有几个可控的参数, 比如我们不用判断所有复平面, 可以选择部分复平面, 所以选择的复平面数量可以控制. 我们还可以控制每个复平面判断多少个点. 通过调参可以找到准确率和效率之间的平衡.

我选择的是选择最后两个复平面, 各判断 $200$ 个点, 可以得到 $16$ 分, 下面是代码:

```cpp
double Pie(3.141592653589793238462643383279502884197169399);
const char HexList[17] = "084C2A6E195D3B7F";
char Debug(0);
char Pp[65536], Hex[256];
inline void Mn(unsigned& x) { x -= ((x >= 256) ? 256 : 0); }
inline const double Sqr(const double& x) { return x * x; }
inline unsigned long long myRand(unsigned long long& k1,
                                 unsigned long long& k2) {
  unsigned long long k3(k1), k4(k2);
  k1 = k4;
  k3 ^= (k3 << 23);
  k2 = k3 ^ k4 ^ (k3 >> 17) ^ (k4 >> 26);
  return k2 + k4;
}
inline unsigned PopC(unsigned long long x) {
  if (Debug) printf("Popc %llu\n", x);
  return Pp[x >> 48] + Pp[(x >> 32) & 65535] + Pp[(x >> 16) & 65535] +
         Pp[x & 65535];
}
struct Comp {
  double Rel, Vir;
  inline const Comp operator+(const double& x) const { return {Rel + x, Vir}; }
  inline const Comp operator-(const double& x) const { return {Rel - x, Vir}; }
  inline const Comp operator*(const double& x) const {
    return {Rel * x, Vir * x};
  }
  inline const Comp operator/(const double& x) const {
    return {Rel / x, Vir / x};
  }
  inline void operator+=(const double& x) { Rel += x; }
  inline void operator-=(const double& x) { Rel -= x; }
  inline void operator*=(const double& x) { Rel *= x, Vir *= x; }
  inline void operator/=(const double& x) { Rel /= x, Vir /= x; }
  inline const Comp operator+(const Comp& x) const {
    return {Rel + x.Rel, Vir + x.Vir};
  }
  inline const Comp operator-(const Comp& x) const {
    return {Rel - x.Rel, Vir - x.Vir};
  }
  inline const Comp operator*(const Comp& x) const {
    return {x.Rel * Rel - x.Vir * Vir, x.Rel * Vir + x.Vir * Rel};
  }
  inline const Comp operator/(const Comp& x) const {
    const double Mother(Sqr(x.Rel) + Sqr(x.Vir));
    return Comp{(x.Rel * Rel + x.Vir * Vir), (x.Vir * Rel - x.Rel * Vir)} /
           Mother;
  }
  inline const char operator<(const Comp& x) const { return Rel < x.Rel; }
  inline void operator+=(const Comp& x) { Rel += x.Rel, Vir += x.Vir; }
} W[256];
unsigned long long A, B;
char a[256], Flg(0);
unsigned n, m;
unsigned C, D, t;
struct Word {
  unsigned long long Val[4];
  inline void Rd() {
    scanf("%s", a), C = RD();
    for (unsigned i(63); ~i; --i) Val[i >> 4] <<= 4, Val[i >> 4] |= Hex[a[i]];
    if (Flg)
      for (unsigned i(0); i < 4; ++i) Val[i] ^= 0xFFFFFFFFFFFFFFFF;
    for (unsigned i(0); i < 256; ++i) a[i] = ((Val[i >> 6] >> (i & 63)) & 1);
  }
  inline const unsigned Diff(const Word& x) const {
    unsigned Rt(0);
    for (unsigned i(0); i < 4; ++i) Rt += PopC(Val[i] ^ x.Val[i]);
    return Rt;
  }
} Wd[400005], Q;
struct Plane {
  pair<Comp, unsigned> Pnt[400005];
  inline void Print() {
    for (unsigned i(1); i <= n; ++i)
      printf("(%lf,%lf) %u\n", Pnt[i].first.Rel, Pnt[i].first.Vir,
             Pnt[i].second);
  }
  inline void Init() { sort(Pnt + 1, Pnt + n + 1); }
  inline char Find(Comp x, Word& y) {
    unsigned L, R;
    pair<Comp, unsigned> Fd({x, 0});
    L = lower_bound(Pnt + 1, Pnt + n + 1, Fd) - Pnt;
    R = min(L + 100, n), L = ((L <= 100) ? 1 : (L - 100));
    for (unsigned i(L); i <= R; ++i)
      if (y.Diff(Wd[Pnt[i].second]) <= C) return 1;
    return 0;
  }
} P[2];
inline Comp DFT(unsigned Fre, char* Ori) {
  Comp Rt;
  Rt = {0, 0};
  for (unsigned i(0), j(0); i < 256; ++i, Mn(j += Fre))
    if (Ori[i]) Rt += W[j];
  return Rt;
}
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  for (unsigned i(0); i < 65536; ++i) Pp[i] = Pp[i >> 1] + (i & 1);
  for (unsigned i(0); i < 16; ++i) Hex[HexList[i]] = i;
  for (unsigned i(0); i < 256; ++i)
    W[i] = {cos(i * Pie / 128), sin(i * Pie / 128)};
  n = RD(), m = RD(), A = RDll(), B = RDll();
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(0); j < 256; ++j)
      a[j] = (myRand(A, B) & ((unsigned long long)1 << 32)) ? 1 : 0;
    for (unsigned j(255); ~j; --j)
      Wd[i].Val[j >> 6] <<= 1, Wd[i].Val[j >> 6] |= a[j];
    for (unsigned j(0); j < 2; ++j) P[j].Pnt[i] = {DFT(255 - j, a), i};
  }
  for (unsigned i(0); i < 2; ++i) P[i].Init();
  for (unsigned i(1); i <= m; ++i) {
    Q.Rd(), Flg = 0;
    for (unsigned j(0); j < 2; ++j)
      if (P[j].Find(DFT(255 - j, a), Q)) {
        Flg = 1;
        break;
      }
    printf("%u\n", Flg);
  }
  return Wild_Donkey;
}
```

## 重回傅里叶

我们发现求离散傅里叶变换的点值的函数就是把一些单位向量加起来得到的和向量, 这是因为傅里叶变换是由积分定义的, 而离散时间傅里叶变换是由加和式定义的, 而加和的每一个元素都是一个由所求的频率和取样时间决定辐角的单位向量和取样处函数值的乘积.

我们重新审视傅里叶变换定义式:

$$
\hat f(\xi) = \int_{-\infin}^{+\infin} f(x) e^{-2\pi ix\xi}dx
$$

先假设 $f$ 是一个定义域和值域都是实数的函数, 如果我们定义一个极坐标方程 $r(\theta) = f(-\frac {\theta}{\xi})$, 会发现这个方程的图像就是把函数 $f$ 的图像按每圈 $\frac {1}{\xi}$ 的速度, 顺时针缠绕在原点上, 比如原图像上的点 $(x, f(x))$, 在极坐标系中映射到的就是点 $(\cos(-x\xi)f(x), \sin(-x\xi)f(x))$, 如果我们把坐标当成复数, 则这个点就是 $f(x)e^{-2\pi ix\xi}$. 这样就可以把 $f$ 的值域推广到复数了.

定义一个定义域为实数, 值域为复数的函数 $g(x) = f(x)e^{-2\pi ix\xi}$.

发现了什么, 我们傅里叶变换所求的 $\hat f$ 在 $\xi$ 处的点值, 也就是 $g(x)$ 的积分. 这个值的几何意义是把 $f$ 用这种方式映射到复平面上得到的曲线的重心所对应的复数乘以积分区间的长度在积分区间趋于 $[-\infin, +\infin]$ 的极限.

为什么说是极限呢, 我们考虑在 $f$ 取值非零的区间长度是有限的, 而 $f$ 的定义域区间长度趋于无限, 因此重心的模长是一个极小值. 又因为积分区间的长度取一个极大值, 所以二者的乘积只能求一个极限, 而无法计算确切的 $0 \times \infin$.

这样我们就知道了为什么傅里叶变换可以完美地分离出特定频率的信号. 因为对于频率不是 $\xi$ 的信号, 它以每圈 $\frac 1{\xi}$ 缠绕在原点上, 每个角度上每次缠绕上的函数值的平均值的期望是相同的, 也就是说当取样长度趋于无穷时, 相当于每个角度都有相同长度的向量加和, 结果当然是 $0$. 这就代表了这些信号在 $\int_{-\infin}^{+\infin} f(x) e^{-2\pi ix\xi}dx$ 里, 其贡献是趋于 $0$ 的, 注意这里是对积分结果的贡献趋于 $0$, 而不是对重心模长贡献趋于 $0$. 因此只要积分区间足够长, 那么频率不是 $\xi$ 的信号对 $\hat f(\xi)$ 的影响就足够小.

我们考虑在时间上离散取样, 这样就可以把积分变成加和, 这就是离散时间傅里叶变换: 

$$
\hat f(\xi) = \sum_{x = -\infin}^{+\infin} f(x) e^{-2\pi ix\xi}
$$

其理论和傅里叶变换一样, 只是用取样代替了难以处理的积分. 然后重新审视我们针对本题的离散时间傅里叶变换式子, 会发现因为 $f$ 的值只有 $0$ 和 $1$ 两种:

$$
\hat f(\xi) = \sum_{x = 0}^{255} [a[x]]e^{-2\pi ix\xi}
$$

## 做法的原理

这里有一个结论, 在平面上从原点开始, 每次随机选择方向, 走单位向量, 随机游走 $n$ 步的终点的期望模长是 $\sqrt n$ 的.

也就是说, 二进制串 `a` 的每一个 $1$, 都对应了一个单位向量被累加到结果中, 那么这个结果最后的落点模长的最大值就是 $256$, 而整个复平面. 在频率很高的时候, 辐角的选择就渐渐失去规律了, 我们可以大概地认为这是在平面里随机游走, 加上这个串是随机生成的, 也就是说它的 Popcount 的期望是 $128$, 因此我们可以认为它的结果的模长期望是 $8\sqrt 2$, 实际可能要更小, 因为它是每个 Popcount 的出现概率是二项分布的, 我们根据这个概率乘以对应的 Popcount 的根号值, 而根号函数是增长越来越慢的.

我们继续考虑一个串的某些位取反对离散傅里叶变换结果的影响. 我们知道傅里叶变换是线性变换, 所以如果改变 $15$ 位, 相当于从原来的值的基础上再随机游走 $15$ 步, 变化前后的结果在复平面上的距离不超过 $15$, 也就是说我们把搜索范围从所有点确定性地缩小到了直径 $15$ 的圆内.

如果根据那个随机游走的结论, 那么我们可以只查询更小范围的临近点, 就可以在很大几率上找到要找的点. 假设可以快速找到临近半径为 $3$ 的点, 那么就可以有接近一半的几率找到目标点. 我们多找几个复平面, 就可以把找不到的概率降到 $1\%$ 以下. 当然这个准确率还是不足以 AC 的. 但是如果取反的位数少一些, 准确率就会大大升高, 甚至可以得到确定性算法.

因为本题询问过多, 所以准确率要经受住 $10^5$ 次考验才能通过一个测试点, 这要求准确率 $x$ 满足 $x^{10^5}$ 也是一个非常高的概率才可以, 这无疑是困难的, 因为我们最多进行 $256$ 次指数放大, 但是需要进行 $10^5$ 次指数缩小. 因此出现两条路: 要么增加指数放大次数, 要么用确定性算法.

## 改进

首先因为我们利用的是离散时间傅里叶变换随机游走的性质, 因此可以把傅里叶变换直接改成随机游走, 每个复平面定义一个随机的辐角序列, 规定每一位的单位向量的辐角. 这样不仅可以使得假随机更加随机, 还可以使得复平面数更多, 增加指数放大的次数.

接下来我们又发现对于找临近点我的处理方式是非常粗放的, 只是把横坐标相近的点拿出来, 相当于是复平面上取了一个长条. 其实为了更有效地找临近的点, 可以给复平面分块. 但是因为点的分部是辐射对称的, 所以我们不像一般的平面分块, 把横纵坐标分别分成根号段, 而是分别把辐角和模长分别分为根号段, 每次取这个段里面的点拿来比较, 这样甚至不用存储每个点的具体坐标, 提升了效率.

因为没有查阅到相关记载, 所以我们把这种判断方式称为 "随机游走变换" (Random Wandering Transform), 简称 RWT.

```cpp
const double Pie(3.141592653589793238462643383279502884197169399);
const unsigned Num(6), Side(10);
const char HexList[17] = "084C2A6E195D3B7F";
unsigned long long A, B;
unsigned Blc(1), BlcLen[512];
char Debug(0);
char Pp[65536], Hex[256];
inline unsigned long long myRand() {
  unsigned long long k3(A), k4(B);
  A = k4, k3 ^= (k3 << 23);
  B = k3 ^ k4 ^ (k3 >> 17) ^ (k4 >> 26);
  return B + k4;
}
inline double RandomAng() { return ((myRand() % 1048576) * Pie) / 524288; }
struct Comp {
  inline double Angle() {
    double Rt(atan(Vir / Rel));
    return Rt + ((Vir < 0) ? Pie : ((Rel < 0) ? (Pie * 2) : 0));
  }
  inline double Model() { return sqrt(Sqr(Vir) + Sqr(Rel)); }
};
char a[256], Flg(0);
unsigned n, m;
inline void Build(unsigned L, unsigned R, unsigned x, unsigned y) {
  BlcLen[x] = L;
  if (y == 1) return;
  unsigned Mid((L + R) >> 1);
  Build(L, Mid, x, y >> 1);
  Build(Mid + 1, R, x + (y >> 1), y >> 1);
}
unsigned C, D, t;
pair<double, double> List[400005];
pair<unsigned short, unsigned short> Bel[400005];
struct Word {
  inline pair<double, double> RWT(Comp* W) {
    Comp Rt;
    Rt = {0, 0};
    for (unsigned i(0); i < 256; ++i)
      if ((Val[i >> 6] >> (i & 63)) & 1) Rt += W[i];
    return {Rt.Angle(), Rt.Model()};
  }
} Wd[400005], Q;
struct Plane {
  Comp Ang[256];
  double ALi[512], BLi[512];
  vector<unsigned> Table[512][512];
  inline void Init() {
    double TmpA;
    pair<double, unsigned> TmpB[n + 1];
    for (unsigned i(0); i < 256; ++i)
      TmpA = RandomAng(), Ang[i] = {cos(TmpA), sin(TmpA)};
    for (unsigned i(1); i <= n; ++i) List[i] = Wd[i].RWT(Ang);
    for (unsigned i(1); i <= n; ++i) TmpB[i] = {List[i].first, i};
    sort(TmpB + 1, TmpB + n + 1), ALi[0] = 0;
    for (unsigned i(1), j(0); i <= n; ++i) {
      if (i >= BlcLen[j + 1]) ALi[++j] = TmpB[i].first;
      Bel[TmpB[i].second].first = j;
    }
    for (unsigned i(1); i <= n; ++i) TmpB[i] = {List[i].second, i};
    sort(TmpB + 1, TmpB + n + 1), BLi[0] = 0;
    for (unsigned i(1), j(0); i <= n; ++i) {
      if (i >= BlcLen[j + 1]) BLi[++j] = TmpB[i].first;
      Bel[TmpB[i].second].second = j;
    }
    for (unsigned i(1); i <= n; ++i)
      Table[Bel[i].first][Bel[i].second].push_back(i);
  }
  inline char Find() {
    pair<double, double> Fd(Q.RWT(Ang));
    unsigned Mid1(lower_bound(ALi, ALi + Blc, Fd.first) - ALi);
    unsigned L2, Mid2(lower_bound(BLi, BLi + Blc, Fd.first) - BLi), R2;
    Mid1 = min(Blc - 1, Mid1), Mid2 = min(Blc - 1, Mid2);
    L2 = ((Mid2 >= Side) ? (Mid2 - Side) : 0),
    R2 = ((Mid2 + Side < Blc) ? (Mid2 + Side) : Blc - 1);
    for (unsigned k(0), K(Mid1); k <= Side;
         ++k, K = ((K == Blc - 1) ? 0 : (K + 1)))
      for (unsigned j(L2); j <= R2; ++j)
        for (auto i : Table[k][j])
          if (Q.Diff(Wd[i]) <= C) return 1;
    for (unsigned k(1), K(Mid1 - 1); k <= Side; ++k, --K) {
      K = ((K > 0x3f3f3f3f) ? (Blc - 1) : K);
      for (unsigned j(L2); j <= R2; ++j)
        for (auto i : Table[k][j])
          if (Q.Diff(Wd[i]) <= C) return 1;
    }
    return 0;
  }
} P[Num];
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  for (unsigned i(0); i < 65536; ++i) Pp[i] = Pp[i >> 1] + (i & 1);
  for (unsigned i(0); i < 16; ++i) Hex[HexList[i]] = i;
  n = RD(), m = RD(), A = RDll(), B = RDll();
  while ((Blc * Blc) <= n) Blc <<= 1;
  Blc >>= 1, Build(1, n, 0, Blc);
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(0); j < 256; ++j)
      a[j] = (myRand() & ((unsigned long long)1 << 32)) ? 1 : 0;
    for (unsigned j(255); ~j; --j)
      Wd[i].Val[j >> 6] <<= 1, Wd[i].Val[j >> 6] |= a[j];
  }
  for (unsigned i(0); i < Num; ++i) P[i].Init();
  for (unsigned i(1); i <= m; ++i) {
    Q.Rd(), Flg = 0;
    for (unsigned j(0); j < Num; ++j)
      if (P[j].Find()) {
        Flg = 1;
        break;
      }
    printf("%u\n", Flg);
  }
  return Wild_Donkey;
}
```

虽然稍稍调参仍然只可以得到 $16$ 分, 但是和前面的做法通过的测试点可以互补得到 $24$ 分.

## 常数优化: 升维与降维

我们发现随机游走是没有任何意义的, 它只是为了使得相差不大的两个单词在平面上距离不远, 那么我们有两个改良方向: 升维和降维. 

如果我们升维到三维, 那么就相当于把可能存在点的范围变成半径为 $256$ 的一个球体, 而我们的搜寻范围是一个半径为 $15$ 的球体. 我们把球体内每一个坐标定义一个函数 $f(X)$, 其中 $X$ 是一个三维向量, 表示位置 $X$ 出现一个点的可能性相对值. 因为字典是随机给出的, 所以 $X$ 空间朝向是不影响 $f(X)$ 的值的. 因此定义实数函数 $f'(x)$, 表示 $|X| = x$ 时 $f(X)$ 的值. 理论上 $f'(x)$ 应当是根号函数复合一个正态分布函数, 但是因为询问不是随机给出的, 所以我们不能通过这个函数来分析.

但是仅通过体积来看, 如果存在目标单词, 它确定的范围体积是总体积的 $0.0201165676116943359375\%$, 比二维的 $0.3\%$ 小得多. 这里确定的范围没有删除在总体积外的部分, 不过这部分体积对结论影响不大, 因此忽略不计. 又因为点的总数不变, 所以需要验证的点就少了. 理论上我们用 $k$ 维的随机游走变换需要验证的体积占总体积的比例是 $(\frac {15}{256})^k$.

这么说升维确实可以得到很可观的收益, 不过现在没有有效的查询临近点的算法. 因此还是要进行 $O(nm)$ 的预处理. 剪枝是把点按照第一维存到桶里, 每次只查询可能的第一维. 虽然优化了常数, 并且对绝大部分单词省去了对比两个串的过程, 但是复杂度相比暴力也没有变化. 所以这方面的前途也不大, 不过因为是基于 RWT 的首个确定性算法, 所以还是可以说一说的.

这里有一个实现上的细节, 因为三维的空间方向是不能用一个实数确定的, 所以我们采用随机任意一个三维向量, 然后通过拉伸变成一个随机单位向量.

```cpp
const char HexList[17] = "084C2A6E195D3B7F";
unsigned long long A, B;
unsigned Blc(1), BlcLen[512];
unsigned C, D, t;
char Debug(0);
char Pp[65536], Hex[256];
inline double RandomDouble() { return double(myRand() % 1048576) - 524288; }
struct Vec {
  double Val[3];
  inline double Model() {
    double Rt(0);
    for (unsigned i(0); i < 3; ++i) Rt += Sqr(Rt);
    return sqrt(Rt);
  }
  inline void Random() {
    for (unsigned i(0); i < 3; ++i) Val[i] = RandomDouble();
    double Rt(Model());
    for (unsigned i(0); i < 3; ++i) Val[i] /= Rt;
  }
  inline void operator+=(const Vec& x) {
    for (unsigned i(0); i < 3; ++i) Val[i] += x.Val[i];
  }
  inline const char Dist(const Vec& x) {
    if (abs(Val[1] - x.Val[1]) > C) return 0;
    if (abs(Val[2] - x.Val[2]) > C) return 0;
    return 1;
  }
} Ang[256];
char a[256], Flg(0);
unsigned n, m, N;
struct Word {
  Vec Pos;
  unsigned long long Val[4];
  inline void RWT(Vec* W) {
    Pos = {0, 0, 0};
    for (unsigned i(0); i < 256; ++i)
      if ((Val[i >> 6] >> (i & 63)) & 1) Pos += W[i];
  }
} Wd[400005], Q;
vector<unsigned> List[512];
inline char Find() {
  Q.RWT(Ang);
  unsigned L(256 + (unsigned)Q.Pos.Val[0]), R(L + C);
  L = ((L >= C) ? (L - C) : 0), R = ((R < 512) ? R : 511);
  for (unsigned j(L); j <= R; ++j)
    for (auto i : List[j])
      if (Q.Pos.Dist(Wd[i].Pos) && (Q.Diff(Wd[i]) <= C)) return 1;
  return 0;
}
signed main() {
  for (unsigned i(0); i < 65536; ++i) Pp[i] = Pp[i >> 1] + (i & 1);
  for (unsigned i(0); i < 16; ++i) Hex[HexList[i]] = i;
  N = n = RD(), N += ((m = RD()) << 1), A = RDll(), B = RDll();
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(0); j < 256; ++j)
      a[j] = (myRand() & ((unsigned long long)1 << 32)) ? 1 : 0;
    for (unsigned j(255); ~j; --j)
      Wd[i].Val[j >> 6] <<= 1, Wd[i].Val[j >> 6] |= a[j];
  }
  for (unsigned i(0); i < 256; ++i) Ang[i].Random();
  for (unsigned i(1); i <= n; ++i)
    Wd[i].RWT(Ang), List[256 + (unsigned)Wd[i].Pos.Val[0]].push_back(i);
  for (unsigned i(1); i <= m; ++i) {
    Q.Rd(), Flg = 0;
    Flg = Find();
    printf("%u\n", Flg);
  }
  return Wild_Donkey;
}
```

这份代码在原来的基础上又多 AC 了两个点. 但是发现这样的本质也不过是扫描了三维空间中的第一维坐标落在某个区间内的切片, 所以我们不妨把这些繁杂的外衣褪去, 向另一个方向发展: 降维.

如果把这个问题变成一维, 就会变得好处理多了. 只是复杂度仍然是纯暴力的 $O(nm)$ 除以一个常数, 优点是代码简单.

```cpp
const char HexList[17] = "084C2A6E195D3B7F";
unsigned long long A, B;
unsigned Blc(1), BlcLen[512];
unsigned C, D, t;
char Debug(0);
char Pp[65536], Hex[256];
char a[256], Ang[256], Flg(0);
unsigned n, m, N;
struct Word {
  unsigned long long Val[4];
  inline unsigned RWT() {
    unsigned Rt(256);
    for (unsigned i(0); i < 256; ++i)
      if ((Val[i >> 6] >> (i & 63)) & 1) Rt = (Ang[i] ? (Rt + 1) : (Rt - 1));
    return Rt;
  }
} Wd[400005], Q;
vector<unsigned> List[513];
inline char Find() {
  unsigned L(Q.RWT()), R(L + C);
  L = ((L >= C) ? (L - C) : 0), R = ((R < 513) ? R : 512);
  for (unsigned j(L); j <= R; ++j)
    for (auto i : List[j])
      if (Q.Diff(Wd[i]) <= C) return 1;
  return 0;
}
signed main() {
  for (unsigned i(0); i < 65536; ++i) Pp[i] = Pp[i >> 1] + (i & 1);
  for (unsigned i(0); i < 16; ++i) Hex[HexList[i]] = i;
  N = n = RD(), N += ((m = RD()) << 1), A = RDll(), B = RDll();
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(0); j < 256; ++j)
      a[j] = (myRand() & ((unsigned long long)1 << 32)) ? 1 : 0;
    for (unsigned j(255); ~j; --j)
      Wd[i].Val[j >> 6] <<= 1, Wd[i].Val[j >> 6] |= a[j];
  }
  for (unsigned j(0); j < 256; ++j)
    Ang[j] = (myRand() & ((unsigned long long)1 << 32)) ? 1 : 0;
  for (unsigned i(1); i <= n; ++i) List[Wd[i].RWT()].push_back(i);
  for (unsigned i(1); i <= m; ++i) {
    Q.Rd(), Flg = 0, Flg = Find();
    printf("%u\n", Flg);
  }
  return Wild_Donkey;
}
```

得分情况和三维是一样的, 不过省去这些东西之后要比三维快.

## 和本篇没有太大关系的正解

因为 $15$ 这个数字比较特殊, 恰好是 $16 - 1$.

我们考虑把整个单词分成 $16$ 段长度为 $16$ 的二进制串. 如果两个单词相差 $15$ 位以内, 发现根据抽屉原理, 至少有一段是两个单词相同的. 所以可以枚举这个相同的段. 我们发现不同的长度为 $16$ 的二进制串有 $65536$ 个, 字典是随即给出的, 所以如果我们指定一个段是某个特定的二进制串, 那么字典里符合条件的单词期望有 $6.103515625$ 个. 所以对于所有段, 总的判断次数期望是 $97.65625$ 个, 每次判断需要 $16$ 的常数, 因此单词询问的常数是 $1562.5$. $m \leq 1.2 \times 10^5$, 所以询问的运行时间大约是 $1.875 \times 10^8$, 可以通过此题.

```cpp
const char HexList[17] = "084C2A6E195D3B7F";
unsigned long long A, B;
unsigned C, D, t;
char Pp[65536], Hex[256], a[256], Flg(0);
unsigned n, m;
struct Word {
  unsigned short Val[16];
  inline void Rd() {
    scanf("%s", a), C = RD();
    for (unsigned i(63); ~i; --i) Val[i >> 2] <<= 4, Val[i >> 2] |= Hex[a[i]];
    if (Flg)
      for (unsigned i(0); i < 16; ++i) Val[i] ^= 0xFFFF;
  }
  inline const unsigned Diff(const Word& x) const {
    unsigned Rt(0);
    for (unsigned i(0); i < 16; ++i) Rt += Pp[Val[i] ^ x.Val[i]];
    return Rt;
  }
} Wd[400005], Q;
vector<unsigned> List[16][65536];
inline char Find() {
  for (unsigned j(0); j <= C; ++j)
    for (auto i : List[j][Q.Val[j]])
      if (Q.Diff(Wd[i]) <= C) return 1;
  return 0;
}
signed main() {
  for (unsigned i(0); i < 65536; ++i) Pp[i] = Pp[i >> 1] + (i & 1);
  for (unsigned i(0); i < 16; ++i) Hex[HexList[i]] = i;
  n = RD(), m = RD(), A = RDll(), B = RDll();
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(0); j < 256; ++j)
      a[j] = (myRand() & ((unsigned long long)1 << 32)) ? 1 : 0;
    for (unsigned j(255); ~j; --j)
      Wd[i].Val[j >> 4] <<= 1, Wd[i].Val[j >> 4] |= a[j];
    for (unsigned j(0); j < 16; ++j) List[j][Wd[i].Val[j]].push_back(i);
  }
  for (unsigned i(1); i <= m; ++i) Q.Rd(), printf("%u\n", Flg = Find());
  return Wild_Donkey;
}
```

这个正解是我本题提交的代码中最短的, 真是乐死了.

## 加强

因为本题本来就不是给 RWT 出的, 所以它的表现没有那么出色, 不过如果我们加强一下此题, 就可以得到一个 RWT 的模板.

发现本题的强制在线没有完全强制, 假设有一个复杂度正确的离线做法, 我们完全可以把询问串和询问串的反串都存下来, 离线询问结束之后, 从头开始把询问扫一遍, 上一次答案是 $0$ 就输出原串答案, 否则输出反串答案. 因此我们索性直接去掉强制在线.

因为 RWT 的核心是判断 "相似", 但是原题更多的利用的是部分 "相同" 的性质, 所以我们把单词的定义改为整数序列. 当然仍然利用题目字典随机的性质, 只不过每一位是从 $0$ 到 $1000000000$ 均匀随机, 相似则定义为每一位上两个串差的绝对值的总和小于等于 $10000$, 发现这样抽屉原理就不攻自破了, 因为可以构造出两个相似的串, 使它们每一位都不同.

但是因为我们的方法时间瓶颈在于找距离小的点, 而判断两个点距离的常数和计算两个串是否相似的常数相似. 我们减少了后者的调用次数, 所以为了体现算法的长处, 需要增加后者的优势, 这一点上我们把每个单词变成 $512$ 的长度. 一下子判断距离的常数就比后者小得多了. 为了匹配 $nm$ 的复杂度, 我们使得 $n$ 和 $m$ 都在 $10000$ 以内. 但即使是这样, 原做法也无法通过了.