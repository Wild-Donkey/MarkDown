# 亚线性筛法

求积性函数 $f(x)$ 的前 $n$ 项和, 我们可以通过线性筛解决 $n$ 数量在 $10^7$ 级别的情况, 当 $n$ 更大时, 线性算法就不足以求出答案了. 杜教筛就是一种对于特定积性函数能够在小于线性的复杂度内求出前 $n$ 项和的方法.

## 前置知识

- 线性筛

- 狄利克雷卷积

- 莫比乌斯反演

- 积分

[这里面 Day28 有数论相关内容](https://www.luogu.com.cn/blog/Wild-Donkey/zroi-day21-day30-bi-ji)

## 杜教筛

我们定义 $Sum(n) = \displaystyle{\sum_{i = 1}^n f(i)}$, $g(x)$ 表示一个数论函数. 用 $(f * g)(x)$ 表示 $f(x)$ 和 $g(x)$ 的狄利克雷卷积. 也就是 $(f * g)(x) = \displaystyle{\sum_{i | x} f(i)g(\dfrac xi)}$.

开始推式子:

$$
\begin{aligned}
\sum_{i = 1}^n (g * f)(i) &= \sum_{i = 1}^n \sum_{j | i} g(j)f(\dfrac ij)\\
&= \sum_{j = 1}^n \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(j)f(i)\\
&= \sum_{j = 1}^n g(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} f(i)\\
&= \sum_{j = 1}^n g(j) Sum(\lfloor \frac nj \rfloor)\\
&= \sum_{j = 2}^n g(j) Sum(\lfloor \frac nj \rfloor) + g(1)Sum(n)\\
\sum_{i = 1}^n (g * f)(i) - \sum_{j = 2}^n g(j) Sum(\lfloor \frac nj \rfloor) &= g(1)Sum(n)\\
\end{aligned}
$$

如果我们可以快速求出 $\displaystyle{\sum_{i = 1}^n (g * f)(i)}$, $\displaystyle{\sum_{i = 1}^n g(i)}$, 并且使用整除分块优化 $\displaystyle{\sum_{j = 2}^n g(j) Sum(\lfloor \frac nj \rfloor)}$, 那么就可以快速求出 $Sum(n)$.

## 复杂度分析

如果我们假设求 $Sum(n)$ 所需的 $Sum$ 值, $\displaystyle{\sum_{i = 1}^n (g * f)(i)}$, $\displaystyle{\sum_{i = 1}^n g(i)}$ 都求出来了, 可以 $O(1)$ 查询, 那么求 $Sum(n)$ 的时间复杂度 $T(n) = \sqrt n$, 解决问题的总时间是 $T$. 由于我们每次询问 $Sum(x)$ 的一定可以表示为 $x = \lfloor \dfrac ni \rfloor$, 所以求 $Sum$ 的复杂度也很显然, 用积分可以算出 $T = n^{\frac 34}$:

$$
\begin{aligned}
T &= \sum_{i = 1}^{\sqrt n} \sqrt i + \sum_{i = 2}^{\sqrt n} \sqrt {\frac ni}\\
&= n^{\frac 34} + n^{\frac 34}\\
&= n^{\frac 34}\\
\end{aligned}
$$

只要所需的 $O(\sqrt n)$ 个不同的 $\displaystyle{\sum_{i = 1}^n (g * f)(i)}$, $\displaystyle{\sum_{i = 1}^n g(i)}$ 值可以在 $O(n^{\frac 34})$ 的总时间内算出, 那么就可以在 $O(n^{\frac 34})$ 求出总和.

## 优化

如果我们用线性筛算出前 $i \leq n^{\frac 23}$ 的 $Sum(i)$, 然后再求解, 复杂度 $T'$ 就会优化到 $O(n^{\frac 23})$.

$$
\begin{aligned}
T' &= \sqrt n + \sum_{i = 2}^{n^{\frac 13}} \sqrt {\frac ni}\\ 
&= \sqrt n + n^{\frac 23}\\
&= n^{\frac 23}
\end{aligned}
$$

## 求 $\mu(x)$ 的前缀和

首先知道一个定理 $\epsilon = \mu * I$, 我们可以选择 $g = I$, 这样 $(f * g) = \epsilon$, $g = I$ 的前缀和都可以 $O(1)$ 得到. 接下来杜教筛求 $Sum$ 就可以了.

```cpp
inline int CalcM(unsigned x) {
  if (x <= 10000000) return Mu[x];
  if (SMu.find(x) != SMu.end()) return SMu[x];
  int TmpS(1);
  for (unsigned L, R(1), Now; R < x; ) {
    L = R + 1, Now = x / L, R = x / Now;
    TmpS -= CalcM(Now) * (R - L + 1);
  }
  return SMu[x] = TmpS;
}
```

## 求 $\phi(x)$ 的前缀和

依然是定理 $(\phi * I)(x) = x$, 所以仍使 $g = I$, 这样仍然可以 $O(1)$ 求 $f * g$, $g$ 的前缀和. 可以直接杜教筛.

值得一提的是, 我们可以使用莫比乌斯反演实现 $O(\sqrt n)$ 的做法.

$$
\begin{aligned}
\sum_{i = 1}^n \phi(i) &= \sum_{i = 1}^n \sum_{j = 1}^{i} [gcd(i, j) = 1]\\
2 \sum_{i = 1}^n \phi(i) - 1 &= \sum_{i = 1}^n \sum_{j = 1}^n [gcd(i, j) = 1]\\
&= \sum_{i = 1}^n \sum_{j = 1}^n \sum_{d | i, d | j} \mu(d)\\
&= \sum_{d = 1}^n \sum_{i = 1}^{\lfloor \frac nd \rfloor} \sum_{j = 1}^{\lfloor \frac nd \rfloor} \mu(d)\\
&= \sum_{d = 1}^n \lfloor \frac nd \rfloor^2 \mu(d)\\
\end{aligned}
$$

利用整除分块, 我们已经可以求出 $\mu(d)$ 前缀和, 接下来只需要用 $\mu(d)$ 来求, 最后加 $1$ 除以 $2$ 即可.

```cpp
inline long long CalcP() {
  long long TmpS(0), Now(0);
  for (unsigned L, R(0); R < n; ) {
    L = R + 1, Now = n / L, R = n / Now;
    TmpS += Now * Now * (CalcM(R) - CalcM(L - 1));
  }
  return (TmpS + 1) >> 1;
}
```

## 代码实现

[模板题](https://www.luogu.com.cn/problem/P4213)

```cpp
int Mu[10000005];
unsigned Pri[1000005], CntP(0);
unsigned n, A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
unordered_map<unsigned, int> SMu;
bitset<10000005> Ava;
signed main() {
  for (unsigned i(2); i <= 10000000; ++i) {
    if (!Ava[i]) Pri[++CntP] = i, Mu[i] = -1;
    for (unsigned j(1); (i * Pri[j] <= 10000000) && (j <= CntP); ++j) {
      unsigned Cur(i * Pri[j]);
      Ava[Cur] = 1, Mu[Cur] = Mu[i] * Mu[Pri[j]];
      if (!(i % Pri[j])) { Mu[Cur] = 0; break; }
    }
  }
  t = RD(), Mu[1] = 1;
  for (unsigned i(2); i <= 10000000; ++i) Mu[i] += Mu[i - 1];
  for (unsigned T(1); T <= t; ++T) {
    n = RD(), printf("%lld %d\n", CalcP(), CalcM(n));
  }
  return Wild_Donkey;
}
```

## Powerful Nunber 筛

把所有质因数次数至少为 $2$ 的数字称为 Powerful Number (PN).

每个 PN $x$ 都可以表示为 $x = a^2b^3$. 对于次数 $\alpha$ 为偶数的质因数, $a$ 中这个质因数次数为 $\frac \alpha 2$, $b$ 中这个数的次数为 $0$; 如果 $\alpha$ 为奇数, 则 $b$ 中这个质因数次数为 $1$, $a$ 中的次数为 $\frac {\alpha - 3}2$.

任意一组 $a$, $b$ 也可以用同样的对应方式得到相应的 PN. 这样我们就可以通过枚举 $a$, $b$ 证明 $n$ 以内 PN 数量的复杂度了.

$$
\begin{aligned}
|PN| &= \sum_{a = 1}^{\sqrt n}\sum_{b = 1}^{{(\frac n{a^2}})^{\frac 13}} 1\\
&= \sum_{a = 1}^{\sqrt n} {(\frac n{a^2}})^{\frac 13}\\
&= O(n^{\frac 13} n^{\frac 16})\\
&= O(\sqrt n)\\
\end{aligned}
$$

$n$ 以内的 PN 只包含 $\sqrt n$ 以内的质因数, 所以线性筛出 $\sqrt n$ 以内的质数. 暴力枚举每个质数的指数, 可以 $O(\sqrt n)$ 找出所有 $n$ 以内的 PN, 这样做有利于求一些积性函数在 $PN$ 处的取值.

如果我们需要求积性函数 $f$ 的前缀和, 那么构造积性函数 $g$ 使得对于任意质数 $p$, 有 $g(p) = f(p)$. 这个 $g$ 需要方便地求前缀和. 构造积性函数 $h$ 使得 $f = g * h$ (狄利克雷卷积).

对于任意质数 $p$, 有 $f(p) = g(p)h(1) + g(1)h(p) = g(p) + h(p)$, 又因为 $f(p) = g(p)$, 因此 $h(p) = 0$. 由积性函数性质可得对于非 PN 的 $x$, 都有 $h(x) = 0$. 结合上面的定义和推论, 开始推式子:

$$
\begin{aligned}
\sum_{i = 1}^n f(i) &= \sum_{i = 1}^n \sum_{j | i} h(j)g(\frac ij)\\ 
&= \sum_{j = 1}^n \sum_{i = 1}^{\lfloor \frac nj \rfloor}  h(j)g(i)\\ 
&= \sum_{j = 1}^n h(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\ 
&= \sum_{j \in PN}^n h(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\ 
\end{aligned}
$$

我们需要做的是快速求出 $g$ 的前缀和, 并且计算 $h$ 对于 $n$ 以内所有 PN 的取值. 然后即可快速得到 $f$ 的前缀和.

为了获取 $h$ 对于质数 $p$ 的幂 $p^{\alpha}$ 的取值, 我们既可以通过推导得到公式, 也可以根据狄利克雷卷积的式子, 

$$
\begin{aligned}
f(p^{\alpha}) &= \sum_{i = 0}^\alpha g(p^{i})h(p^{\alpha - i})\\
f(p^{\alpha}) &= g(1)h(p^c) + \sum_{i = 1}^\alpha g(p^{i})h(p^{\alpha - i})\\
g(1)h(p^c) &= f(p^{\alpha}) - \sum_{i = 1}^\alpha g(p^{i})h(p^{\alpha - i})\\
h(p^c) &= f(p^{\alpha}) - \sum_{i = 1}^\alpha g(p^{i})h(p^{\alpha - i})\\
\end{aligned}
$$

$f$, $g$ 有公式可以直接求, $h$ 可以记录用来查询, 可以在 $\log$ 的时间内得到 $h(p^\alpha)$. 得到所有 $p^\alpha \leq n$ 的 $h(p^\alpha)$ 后, $h$ 对 PN 的取值可以通过搜索过程中根据积性函数的性质推得, $g$ 则是通过代入 $O(1)$ 公式或者是杜教筛求出的.

复杂度: 如果需要杜教筛, 求 $g$ 的复杂度是 $n^{\frac 23}$ 的, 如果不需要杜教筛, 则不会有这个 $n^{\frac 23}$. 别的部分都是 $O(n^{\frac 12})$, 可能会加个 $\log$ (狄利克雷卷积求 $h(p^\alpha)$ 时引入的) ,所以结论是 PN 筛不会比杜教筛慢.

## [例题](https://www.luogu.com.cn/problem/P3768)

这本是 Min_25 筛模板, 但是可以使用 PN 筛做.

对于积性函数 $f(p^\alpha) = p^\alpha(p^\alpha - 1)$, 求 $\displaystyle{\sum_{i = 1}^n} f(i)$.

构造 $g(x) = \phi(x)x$, 则 $g(p) = p(p - 1) = f(p)$.

$$
\begin{aligned}
\sum_{i = 1}^n f(i) &= \sum_{i = 1}^n \sum_{j | i} h(j)g(\frac ij)\\
&= \sum_{j = 1}^n h(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{j \in PN}^n h(j) \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
\end{aligned}
$$

为了求所有 $\lfloor \frac nx \rfloor$ 位置上, $g$ 的前缀和, 设 $id(x) = x$, 用 $D(x)$ 表示 $x$ 的因数个数, 使用杜教筛:

$$
\begin{aligned}
\sum_{i = 1}^n (g * id)(i) &= \sum_{i = 1}^n \sum_{j | i} g(\frac ij)j\\
&= \sum_{j = 1}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n g(i) + \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
\sum_{i = 1}^n g(i) &= \sum_{i = 1}^n (g * id)(i) - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n \sum_{j | i} g(j)\frac ij - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n \sum_{j | i} j\phi(j)\frac ij - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n i \sum_{j | i} \phi(j) - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n i(I * \phi)(i) - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \sum_{i = 1}^n i^2 - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
&= \frac{2n^3 + 3n^2 + n}6 - \sum_{j = 2}^n j \sum_{i = 1}^{\lfloor \frac nj \rfloor} g(i)\\
\end{aligned}
$$

结合线性筛可以在 $O(n^{\frac 23})$ 时间内筛出所有所需的 $g(\lfloor \frac nx \rfloor)$.

接下来求所有 PN 处 $h$ 的取值, 首先解决 $h(p^\alpha)$:

$$
\begin{aligned}
f(p^{\alpha}) &= \sum_{i = 0}^\alpha g(p^i)h(p^{\alpha - i})\\
p^\alpha(p^\alpha - 1) &= \sum_{i = 0}^\alpha p^i\phi(p^i)h(p^{\alpha - i})\\
p^\alpha(p^\alpha - 1) &= h(p^{\alpha}) + \sum_{i = 1}^\alpha p^i\phi(p^i)h(p^{\alpha - i})\\
p^\alpha(p^\alpha - 1) &= h(p^{\alpha}) + \sum_{i = 1}^\alpha p^ip^{i - 1}(p - 1)h(p^{\alpha - i})\\
p^\alpha(p^\alpha - 1) &= h(p^{\alpha}) + \sum_{i = 1}^\alpha p^{2i - 1}(p - 1)h(p^{\alpha - i})\\
h(p^{\alpha}) &= p^\alpha(p^\alpha - 1) - \sum_{i = 1}^\alpha p^{2i - 1}(p - 1)h(p^{\alpha - i})\\
\frac {h(p^{\alpha})}{p^\alpha} &= (p^\alpha - 1) - \sum_{i = 1}^\alpha p^{2i - \alpha - 1}(p - 1)h(p^{\alpha - i})\\
\frac {h(p^{\alpha})}{p^\alpha} &= (p^\alpha - 1) - \sum_{i = 1}^\alpha p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}}\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{ph(p^{\alpha - 1})}{p^{\alpha - 1}} &= (p^\alpha - 1) - \sum_{i = 1}^\alpha p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}} - p(p^{\alpha - 1} - 1) + \sum_{i = 1}^{\alpha - 1} p^i(p - 1)\frac{h(p^{\alpha - i - 1})}{p^{\alpha - i - 1}}\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{ph(p^{\alpha - 1})}{p^{\alpha - 1}} &= p - 1 - \sum_{i = 1}^\alpha p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}} + \sum_{i = 1}^{\alpha - 1} p^i(p - 1)\frac{h(p^{\alpha - i - 1})}{p^{\alpha - i - 1}}\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{ph(p^{\alpha - 1})}{p^{\alpha - 1}} &= p - 1 - \sum_{i = 1}^\alpha p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}} + \sum_{i = 2}^{\alpha} p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}}\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{ph(p^{\alpha - 1})}{p^{\alpha - 1}} &= p - 1 - \sum_{i = 2}^\alpha (p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}} + p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}}) - (p - 1)\frac{h(p^{\alpha - 1})}{p^{\alpha - 1}}\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{h(p^{\alpha - 1})}{p^{\alpha - 1}} &= p - 1 - \sum_{i = 2}^\alpha (p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}} + p^{i - 1}(p - 1)\frac{h(p^{\alpha - i})}{p^{\alpha - i}})\\
\frac {h(p^{\alpha})}{p^\alpha} - \frac{h(p^{\alpha - 1})}{p^{\alpha - 1}} &= p - 1\\
\frac {h(p^{\alpha})}{p^\alpha} &= \frac{h(p^{\alpha - 1})}{p^{\alpha - 1}} + p - 1\\
\end{aligned}
$$

发现 $h(p^\alpha)$ 可以递推, 

## 不忘初心

在学习了高级算法后, 不要忘记朴素的算法, 防止杀鸡用牛刀, 失去了代码复杂度和时空常数.

比如下面的题目, 我们如果要求 $(I * I * I)(x)$ 的前缀和, 当然可以使用杜教筛.

$$
\begin{aligned}
\sum_{i = 1}^n (I * I * I * \phi)(i) &= \sum_{i = 1}^n (I * I * I)(i) + \sum_{i = 2}^n \phi(i) \sum_{j}^{\lfloor \frac ni \rfloor} (I * I * I)(j)\\
\sum_{i = 1}^n (I * I * I)(i) &= \sum_{i = 1}^n (I * I * I * \phi)(i) - \sum_{i = 2}^n \phi(i) \sum_{j}^{\lfloor \frac ni \rfloor} (I * I * I)(j)\\
\end{aligned}
$$

线性筛:

```cpp
for (unsigned i(2); i <= m; ++i) {
  if (!Ava[i]) Pri[++CntP] = i, Mu[i] = -1, D[i] = 2, Cp[i] = 1;
  for (unsigned j(1); (Pri[j] * i <= m) && (j <= CntP); ++j) {
    unsigned Cur(Pri[j] * i);
    Ava[Cur] = 1;
    if (!(i % Pri[j])) { Mu[Cur] = 0, D[Cur] = D[i] / (Cp[i] + 1) * ((Cp[Cur] = Cp[i] + 1) + 1); break; }
    Mu[Cur] = -Mu[i], D[Cur] = D[i] * 2, Cp[Cur] = 1;
  }
}
```

先筛 $\phi$:

```cpp
inline void GM() {
  for (unsigned long long xx(n / (m + 1)); xx; --xx) {
    unsigned long long x(n / xx);
    long long Rt(1);
    for (unsigned long long L, R(1), Cur; R < x;) {
      L = R + 1, Cur = x / L, R = x / Cur;
      Rt -= (R - L + 1) * ((Cur <= m) ? Mu[Cur] : PM[n / Cur]);
    }
    PM[xx] = Rt;
  }
}
```

再筛 $d$:

```cpp
inline void GD() {
  for (unsigned long long xx(n / (m + 1)); xx; --xx) {
    unsigned long long x(n / xx);
    long long Rt(x), LM(1), NM(1);
    for (unsigned long long L, R(1), Cur; R < x;) {
      L = R + 1, Cur = x / L, R = x / Cur, NM = ((R <= m) ? Mu[R] : PM[n / R]);
      Rt -= (NM - LM) * ((Cur <= m) ? D[Cur] : PD[n / Cur]), LM = NM;
    }
    PD[xx] = Rt;
  }
}
```

最后一个整除分块统计答案:

```cpp
bitset<22000005> Ava;
unsigned Pri[1400005], CntP(0);
unsigned char Cp[22000005];
int Mu[22000005], D[22000005];
long long PM[5005], PD[5005];
unsigned long long n;
long long Ans(0), H(1);
unsigned m, A, B, C, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  n = RD(), m = pow(n, (double)2 / 3) + 1, D[1] = Mu[1] = 1;
  for (unsigned i(2); i <= m; ++i) D[i] += D[i - 1];
  for (unsigned i(2); i <= m; ++i) Mu[i] += Mu[i - 1];
  GM(), GD();
  for (unsigned long long L, R(0), Cur; R < n;) {
    L = R + 1, Cur = n / L, R = n / Cur;
    Ans += (R - L + 1) * ((Cur <= m) ? D[Cur] : PD[R]);
  }
  printf("%lld\n", Ans);
  return Wild_Donkey;
}
```

但是转过来想, 这个题其实是求 $\displaystyle{\sum_{i = 1}^n \sum_{j | i} d(j)}$, 也就是 $\displaystyle{\sum_{i = 1}^n \sum_{j | i} \sum_{k | j} 1}$, 可以转化为求有序三元组 $(x, y, z)$ 的数量, 使得 $i = xyz$, $j = yz$, $k = z$. 并且有 $xyz \leq n$.

如果我们求出 $x < y < z$ 的情况数, 把这个数量乘以 $3!$, 然后计算 $x = y < z$, $x < y = z$ 的情况数, 乘以 $\binom 32 = 3$, 最后是 $x = y = z$ 的情况, 什么都不乘. 最后把这些答案加起来即为所求.

复杂度可以积出来, 是 $O(n^{\frac 23})$, 发现这个复杂度和杜教筛一样, 但是做到了 $O(1)$ 的空间复杂度和 $\frac 1{20}$ 的常数, 代码难度大大降低.

```cpp
unsigned long long n, Ans6(0), Ans3(0);
unsigned m, A, B, C, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  n = RD(), m = pow(n, (double)1 / 3);
  for (unsigned i(1); i <= m; ++i) {
    unsigned long long nn(n / i);
    unsigned mm(sqrt(nn));
    for (unsigned j(i + 1); j <= mm; ++j) Ans6 += (nn / j) - j;
  }
  for (unsigned i(1); i <= m; ++i) Ans3 += ((n / i) / i) - i;
  for (unsigned i(1); i <= m; ++i) Ans3 += (unsigned)sqrt(n / i) - i;
  printf("%lld\n", Ans6 * 6 + Ans3 * 3 + m);
  return Wild_Donkey;
}
```