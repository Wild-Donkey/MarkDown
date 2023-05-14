---
title: 多项式指数函数和对数函数
date: 2022-07-02 14:49
categories: Mathematics
tags:
  - Polynomial
  - Number_Theory_Transform
  - Derivative
  - Integral
  - Polynomial_Multiplication_Inverse_Element
  - Polynomial_Logarithm
  - Tylor_Series
  - Newtons_Method
  - Polynomial_Exponentiation
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/Photo5.jpg
---

# 多项式对数函数和指数函数

我们分别要对一个多项式 $f(x)$ 求 $\ln f(x)$ 和 $e^{f(x)}$.

## 前置知识

在此之前我们需要学习导数的相关知识, 接下来是一些可能会用到的公式:

$$
\begin{aligned}
\ln' x &= \frac 1x\\
h(x) &= f(g(x)), \\
h'(x) &= f'(g(x))g'(x)
\end{aligned}
$$

## 对数函数 (Logarithm)

假设 $g(x) \equiv \ln f(x) \pmod{x^n}$, 则有:

$$
\begin{aligned}
g(x) &\equiv \ln f(x) &\pmod{x^n}\\
g'(x) &\equiv \ln'(f(x))f'(x) &\pmod{x^n}\\
g'(x) &\equiv \frac{f'(x)}{f(x)} &\pmod{x^n}\\
g'(x) &\equiv \int \frac{f'(x)}{f(x)} &\pmod{x^n}\\
\end{aligned}
$$

这里保证 $x$ 的零次项为 $1$, 如果是别的情况, 那么 $g(x)$ 的零次项不收敛. 所以我们只要使得 $g(x)$ 的零次项为 $\ln(1) = 0$ 即可.

```cpp
#define Inv(x) Pow(x,998244351)
const unsigned long long Mod(998244353);
unsigned long long MulIn[262145], WPool[1048576], * W[2][19], * PTp(WPool);
unsigned a[262144], n, Lgn(0), m(1);
inline void Mn(unsigned& x) { x -= (x >= Mod ? Mod : 0); }
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) { if (y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
inline void CalcW(unsigned long long** x, unsigned long long w) {
  (x[Lgn] = PTp)[0] = 1, PTp += m;
  for (unsigned i(1); i < m; ++i) x[Lgn][i] = x[Lgn][i - 1] * w % Mod;
  for (unsigned i(Lgn - 1), j(m >> 1); ~i; --i, j >>= 1) {
    x[i] = PTp, PTp += j;
    for (unsigned k(0); k < j; ++k) x[i][k] = x[i + 1][k << 1];
  }
}
inline void Init() {
  n = RD();
  for (unsigned i(0);i < n; ++i) a[i] = RD();
  while (m < n) { m <<= 1, ++Lgn; }
  unsigned long long w(Pow(3, 998244352 / (m <<= 1)));
  ++Lgn, CalcW(W[0], w), CalcW(W[1], Inv(w)), --Lgn, MulIn[0] = MulIn[1] = 1;
  for (unsigned i(2); i <= m; ++i) MulIn[i] = (Mod - MulIn[Mod % i]) * (Mod / i) % Mod;
}
inline void DIT(unsigned* f, unsigned Lg) {
  unsigned Len(1 << Lg);
  for (unsigned i(1), j(1), k(Len >> 1); i <= Lg; ++i, j <<= 1, k >>= 1) {
    for (unsigned Ot(0); Ot < k; ++Ot) {
      unsigned long long* w(W[1][i]);
      unsigned* F(f + (Ot << i));
      for (unsigned In(0); In < j; ++In, ++w) {
        unsigned long long TmpA(F[In]), TmpB(F[In ^ j] * (*w) % Mod);
        Mn(F[In] = TmpA + TmpB);
        Mn(F[In ^ j] = Mod + TmpA - TmpB);
      }
    }
  }
}
inline void DIF(unsigned* f, unsigned Lg) {
  unsigned Len(1 << Lg);
  for (unsigned i(Lg), j(1), k(Len >> 1); i; --i, j <<= 1, k >>= 1) {
    for (unsigned Ot(0); Ot < j; ++Ot) {
      unsigned long long* w(W[0][i]);
      unsigned* F(f + (Ot << i));
      for (unsigned In(0); In < k; ++In, ++w) {
        unsigned long long TmpA(F[In]), TmpB(F[In ^ k]);
        Mn(F[In] = TmpA + TmpB);
        F[In ^ k] = (Mod + TmpA - TmpB) * (*w) % Mod;
      }
    }
  }
}
unsigned InvPool[786432];
inline void Inver(unsigned* f, unsigned Lg) {
  unsigned M(1 << (Lg + 1));
  unsigned* g(InvPool), * Dbg(InvPool + M), * F(InvPool + (M << 1));
  memset(F, 0, M << 2), memset(g, 0, M << 2), g[0] = Inv(f[0]);
  for (unsigned i(1), j(2); i <= Lg; ++i, j <<= 1) {
    unsigned Len(j << 1);
    unsigned long long IvL(Mod - MulIn[Len]);
    for (unsigned k(0); k < j; ++k) Mn(Dbg[k] = g[k] << 1);
    memcpy(F, f, j << 2), memset(F + j, 0, j << 2);
    DIF(g, i + 1), DIF(F, i + 1);
    for (unsigned k((j << 1) - 1); ~k; --k) F[k] = F[k] * ((unsigned long long)g[k] * g[k] % Mod) % Mod;
    DIT(F, i + 1);
    for (unsigned k(0); k < j; ++k) g[k] = (Dbg[k] + F[k] * IvL) % Mod;
    memset(g + j, 0, j << 2);
  }
}
inline void Derivative(unsigned* f, unsigned Len) {
  for (unsigned long long i(1); i < Len; ++i) f[i - 1] = f[i] * i % Mod;
  f[Len - 1] = 0;
}
inline void Integral(unsigned* f, unsigned Len) {
  for (unsigned i(Len - 1); i; --i) f[i] = (unsigned long long)f[i - 1] * MulIn[i] % Mod;
  f[0] = 0;
}
inline void Ln(unsigned* f, unsigned Lg) {
  unsigned Len(1 << Lg), M(Len << 1);
  Inver(f, Lg), Derivative(f, Len);
  DIF(f, Lg + 1), DIF(InvPool, Lg + 1);
  for (unsigned i(0); i < M; ++i) f[i] = (unsigned long long)f[i] * InvPool[i] % Mod;
  DIT(f, Lg + 1);
  unsigned long long InvM(MulIn[M]);
  for (unsigned i(0); i < M; ++i) f[i] = f[i] * InvM % Mod;
  Integral(f, Len), memset(f + Len, 0, Len << 2);
}
signed main() {
  Init();
  Exp(a, Lgn);
  for (unsigned i(0); i < n; ++i) printf("%u ", a[i]); putchar(0x0A);
  return Wild_Donkey;
}
```

## 泰勒级数 (Taylor Series)

如果有一个光滑函数 (Smooth Function), 也就是可以无穷次求导的函数, 我们可以用幂级数去拟合这个函数在某个位置 $a$ 的邻域上的函数值, 这种幂级数就叫做泰勒级数. 从 $f(a)$ 处展开后 $f(x)$ 的值可以拟合为:

$$
\sum_{n = 0}^{\infin} \frac {f^{(n)}(a)}{n!}(x - a)^n
$$

这里 $f^{(n)}(x)$ 特指 $f(x)$ 处的 $n$ 阶导数.

对于不同的函数, $a$ 的邻域大小也有所不同. 对于 $a = 0$ 的特殊情况, 我们把这种泰勒级数称为麦克劳林级数, 它的一般形式为:

$$
\sum_{n = 0}^{\infin} \frac {f^{(n)}(0)}{n!}x^n
$$

在 OI 中, 最常用的麦克劳林级数就是这个经典的 $e^x$:

$$
e^x = \sum_{n = 0}^{\infin} \frac {x^n}{n!}~~~~\forall x
$$

我们知道, 多项式本身就是一个多项式, 所以用它本身就可以完美地拟合它自己, 但是我们还是希望研究一下对于个多项式进行泰勒展开得到的结果是怎样的. 由于互联网上很难找到相关的记载, 所以我们决定自己推式子:

$$
\begin{aligned}
f(x) &= \sum_{i = 0}^{\infin} a_ix^i\\
f(x) &= \sum_{i = 0}^{\infin} \frac{f^{(i)}(\alpha)}{i!}(x - \alpha)^i\\
f(x) &= \sum_{i = 0}^{\infin} \frac{\displaystyle{\sum_{j = i}^{\infin}j^{\underline{i}}a_j{\alpha}^{j - i}}}{i!}(x - \alpha)^i\\
f(x) &= \sum_{i = 0}^{\infin} (x - \alpha)^i \sum_{j = i}^{\infin}\binom{i}{j}a_j{\alpha}^{j - i}\\
f(x) &= \sum_{j = 0}^{\infin} a_j \sum_{i = 0}^j \binom{i}{j}{\alpha}^{j - i}(x - \alpha)^i\\
f(x) &= \sum_{j = 0}^{\infin} a_j (\alpha + (x - \alpha))^j\\
f(x) &= \sum_{j = 0}^{\infin} a_jx^j\\
\end{aligned}
$$

我们发现, 无论从哪里展开, 多项式都可以在有限项内被完美的拟合. 我们做了一些优美的无用功, 所以多项式的泰勒展开的用处如何体现呢?

## 牛顿法 (Newton's Method)

其实在高中数学课本的导数部分, 我们就可以看到对牛顿法求高次方程近似解的介绍. 如果我们要求 $f(x)$ 的一个近似解, 选择 $x_0$ 作为初始结果, 那么一次迭代之后, 我们会得到一个 $x_1$, 这个 $x_1$ 通常要比 $x_0$ 更接近零点. $x_1$ 是 $x_0$ 处 $f(x)$ 的切线和 $x$ 轴的交点横坐标, 可以这样表示:

$$
x_{i + 1} = x_i - \frac{f(x_i)}{f'(x_i)}
$$

这个方法也可以推广到多项式, 假设已知多项式 $g(x)$, 对 $f(x)$ 满足 $g(f(x)) \equiv 0 \pmod {x^n}$. 可以尝试使用牛顿法求出 $f(x) \pmod {x^n}$.

假设我们已经知道了对 $x^{\lceil \frac n2 \rceil}$ 取模意义下的结果 $f_0(x)$, 用倍增求出 $f(x)$.

我们前面推式子知道, 在多项式的任何位置泰勒展开, 都可以完美拟合这个多项式, 因此有:

$$
g(f(x)) = \sum_{i = 0}^{\infin} \frac{g^{(i)}(f_0(x))}{i!} (f(x) - f_0(x))^i
$$

分析 $g(f(x))$ 的前 $i$ 项, 因为 $g(x)$ 是给定的, 所以 $g(f(x))$ 的前 $i$ 项只和 $f(x)$ 的前 $i$ 项有关. 通过解线性方程也可以根据 $g(f(x))$ 的前 $i$ 项唯一地确定 $f(x)$ 的前 $i$ 项. 因此对于 $g(f(x)) \equiv g(h(x)) \pmod {x^i}$, 一定有 $f(x) \equiv h(x) \pmod {x^i}$.

所以如果 $g(f_0(x))$ 和 $g(f(x))$ 的前 $\lceil \frac n2 \rceil$ 项都是 $0$, 那么 $f(x)$ 的前 $\lceil \frac n2 \rceil$ 项一定和 $f_0(x)$ 相等. 因此有 $f(x) - f_0(x)$ 的前 $\lceil \frac n2 \rceil$ 项都为 $0$:

$$
\begin{aligned}
f(x) - f_0(x) &\equiv 0 &\pmod {x^{\lceil \frac n2 \rceil}}\\
(f(x) - f_0(x))^i &\equiv 0 &\pmod {x^{i\lceil \frac n2 \rceil}}\\
(f(x) - f_0(x))^i &\equiv 0 &\pmod {x^n} (i \geq 2)\\
\end{aligned}
$$

有了这个式子, 就可以对前面的泰勒展开进行一个化简:

$$
\begin{aligned}
g(f(x)) &= \sum_{i = 0}^{\infin} \frac{g^{(i)}(f_0(x))}{i!} (f(x) - f_0(x))^i\\
g(f(x)) &\equiv \sum_{i = 0}^1 \frac{g^{(i)}(f_0(x))}{i!} (f(x) - f_0(x))^i &\pmod {x^n}\\
g(f(x)) &\equiv g(f_0(x)) + g'(f_0(x)) (f(x) - f_0(x)) &\pmod {x^n}\\
g(f(x)) - g(f_0(x)) &\equiv g'(f_0(x)) (f(x) - f_0(x)) &\pmod {x^n}\\
-g(f_0(x)) &\equiv g'(f_0(x)) (f(x) - f_0(x)) &\pmod {x^n}\\
g(f_0(x)) &\equiv g'(f_0(x)) (f_0(x) - f(x)) &\pmod {x^n}\\
\frac{g(f_0(x))}{g'(f_0(x))} &\equiv f_0(x) - f(x) &\pmod {x^n}\\
f_0(x) - \frac{g(f_0(x))}{g'(f_0(x))} &\equiv f(x) &\pmod {x^n}\\
f(x) &\equiv f_0(x) - \frac{g(f_0(x))}{g'(f_0(x))} &\pmod {x^n}
\end{aligned}
$$

发现得到了一个牛顿迭代的式子, 这样我们只要知道了 $[x^0]f(x)$, 就可以通过牛顿迭代倍增出 $f(x)$ 了.

## 指数函数 (Exponentiation)

假设 $g(x) = e^{f(x)}$, 则有:

$$
\begin{aligned}
g(x) &\equiv x^{f(x)} &\pmod{x^n}\\
\ln(g(x)) &\equiv f(x) &\pmod{x^n}\\
\ln(g(x)) - f(x) &\equiv 0 &\pmod{x^n}\\
\end{aligned}
$$

根据多项式牛顿迭代的原理, 有:

$$
\begin{aligned}
g(x) &\equiv g_0(x) - g_0(x)(\ln(g_0(x)) - f(x)) &\pmod{x^n}\\
g(x) &\equiv g_0(x)(1 - \ln(g_0(x)) + f(x)) &\pmod{x^n}\\
\end{aligned}
$$

每次迭代需要进行一次求对数函数, 加法和乘法, 复杂度 $T(n) = T(\frac n2) + O(n\log n) = O(n\log n)$.

```cpp
/*Here is Polynomial Ln Code*/
unsigned ExpPool[524288];
inline void Exp(unsigned* f, unsigned Lg) {
  unsigned Len(1 << Lg), M(Len << 1);
  unsigned* g(ExpPool), * g0(ExpPool + M);
  memset(g0, 0, M << 2), g[0] = 1;
  for (unsigned i(1), j(2); i <= Lg; ++i, j <<= 1) {
    unsigned long long InvM(MulIn[j << 1]);
    memcpy(g0, g, j << 2), Ln(g, i);
    for (unsigned k(0); k < j; ++k) Mn(g[k] = f[k] + Mod - g[k]); Mn(g[0] += 1);
    DIF(g, i + 1), DIF(g0, i + 1);
    for (unsigned k((j << 1) - 1); ~k; --k) g[k] = (unsigned long long)g[k] * g0[k] % Mod;
    DIT(g, i + 1);
    for (unsigned k(0); k < j; ++k) g[k] = g[k] * InvM % Mod;
    memset(g + j, 0, j << 2);
  }
  for (unsigned i(0); i < n; ++i) printf("%u ", g[i]); putchar(0x0A);
}
signed main() {
  Init();
  Exp(a, Lgn);
  return Wild_Donkey;
}
```