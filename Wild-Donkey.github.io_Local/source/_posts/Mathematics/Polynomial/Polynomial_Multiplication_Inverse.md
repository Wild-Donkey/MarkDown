---
title: 多项式乘法逆
date: 2022-06-21 19:31
categories: Mathematics
tags:
  - Polynomial
  - Polynomial_Multiplication_Inverse_Element
  - Number_Theory_Transform
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/Photo9.jpg
---

# 多项式乘法逆

## 定义

对于 $n - 1$ 次的多项式 $f$, 找出一个 $g$ 使得 $f \times g \equiv 1 \pmod {x^n}$.

## 理论

当 $n = 0$ 的时候, 显然 $g_0 = \frac 1{f_0}$.

现在对 $n > 0$ 的情况设有已知的 $g'$ 使得 $f \times g' \equiv 1 \pmod {x^{\lceil \frac n2\rceil}}$, 则有:

$$
\begin{aligned}
f \times g &\equiv 1 \pmod {x^n}\\
f \times g &\equiv 1 \pmod {x^{\lceil \frac n2\rceil}}\\
f \times g' &\equiv 1 \pmod {x^{\lceil \frac n2\rceil}}\\
f \times (g - g') &\equiv 0 \pmod {x^{\lceil \frac n2\rceil}}
\end{aligned}
$$

我们知道, 如果 $f_0 = 0$, 那么 $g$ 就不存在, 因为无法凑出 $f \times g$ 的零次项. 因此 $g - g' \equiv 0 \pmod {x^{\lceil \frac n2\rceil}}$.

接下来通过平方, 把模 $x^{\lceil \frac n2\rceil}$ 意义下转化成模 $x^n$ 意义下:

$$
\begin{aligned}
g - g' &\equiv 0 \pmod {x^{\lceil \frac n2\rceil}}\\
(g - g')^2 &\equiv 0 \pmod {x^n}\\
g^2 - 2g'g + {g'}^2 &\equiv 0 \pmod {x^n}\\
\end{aligned}
$$

两边同时乘以 $f$:

$$
\begin{aligned}
g - 2g' + f{g'}^2 &\equiv 0 \pmod {x^n}\\
g &\equiv 2g' - f{g'}^2 \pmod {x^n}\\
\end{aligned}
$$

通过 FFT 进行两次乘法操作然后加减可以求出 $g$, 我们需要递归求解, 一共是 $\log n$ 层, 每层复杂度是 $O(n\log n)$, 总复杂度是 $T(n) = T(\frac n2) + O(n \log n)$, 根据主定理, $T(n) = O(n \log n)$.

## 实现

仍然是将多项式乘法浅封装一下, 然后直接递归即可.

```cpp
const unsigned long long Mod(998244353);
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
inline unsigned long long Pow(unsigned long long x, unsigned y) {
  unsigned long long Rt(1);
  while (y) {if(y & 1)Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1;}
  return Rt;
}
unsigned long long W[20], IW[20];
unsigned a[262150], b[262150], Two[20], m(1), n, Lgn(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void DIT(unsigned* f, unsigned Lg, unsigned long long* Curw) {
  unsigned Len(Two[Lg]);
  unsigned long long W_i(1);
  for (unsigned i(1), j(1); i <= Lg; ++i, j <<= 1, W_i = 1) {
    for (unsigned k(0); k < Len; ++k, W_i = W_i * Curw[i] % Mod) if (!(k & j)) {
      unsigned long long TmA(f[k]), TmB(f[k | j] * W_i % Mod);
      f[k] = TmA + TmB, Mn(f[k]);
      f[k | j] = Mod + TmA - TmB, Mn(f[k | j]);
    }
  }
}
inline void DIF(unsigned* f, unsigned Lg, unsigned long long* Curw) {
  unsigned Len(Two[Lg]);
  unsigned long long W_i(1);
  for (unsigned i(Lg), j(1 << (Lg - 1)); i; --i, j >>= 1, W_i = 1) {
    for (unsigned k(0); k < Len; ++k, W_i = W_i * Curw[i] % Mod) if (!(k & j)) {
      unsigned long long TmA(f[k]), TmB(f[k | j]);
      f[k] = TmA + TmB, Mn(f[k]);
      f[k | j] = (Mod + TmA - TmB) * W_i % Mod;
    }
  }
}
inline void Multi(unsigned* f, unsigned* g, unsigned* Rt, unsigned Lg) {
  unsigned Len(Two[Lg]);
  DIF(f, Lg, W), DIF(g, Lg, W);
  for (unsigned i(0); i < Len; ++i) 
    Rt[i] = ((unsigned long long)f[i] * g[i] % Mod) * g[i] % Mod;
  DIT(Rt, Lg, IW);
  unsigned long long InvLen(Pow(Len, 998244351));
  for (unsigned i(0); i < Len; ++i) Rt[i] = Rt[i] * InvLen % Mod;
}
inline void Inv(unsigned* f, unsigned* Rt, unsigned Lg) {
  if(Lg == 0) {Rt[0] = Pow(f[0], 998244351); return;}
  unsigned Len(1 << Lg);
  unsigned g[Len << 1];
  Inv(f, g, Lg - 1), memset(g + (Len >> 1), 0, (Len + (Len << 1)) << 1);
  memcpy(Rt, f, Len << 2), memset(Rt + Len, 0, Len << 2);
  Multi(Rt, g, Rt, Lg + 1);
  unsigned long long InvLen(Pow(1 << (Lg + 1), 998244351));
  DIT(g, Lg + 1, IW);
  for (unsigned i(0); i < Len; ++i) g[i] = g[i] * InvLen % Mod;
  for (unsigned i(0); i < Len; ++i) Rt[i] = ((g[i] << 1) + Mod - Rt[i]) % Mod;
}
signed main() {
  n = RD(), Two[0] = 1;
  for (unsigned i(1); i < 20; ++i) Two[i] = (Two[i - 1] << 1);
  while (m < n) m <<= 1, ++Lgn;
  W[19] = Pow(3, 998244352 >> 19), IW[19] = Pow(W[19], 998244351);
  for (unsigned i(19); i; --i) W[i - 1] = W[i] * W[i] % Mod;
  for (unsigned i(19); i; --i) IW[i - 1] = IW[i] * IW[i] % Mod;
  for (unsigned i(0); i < n; ++i) a[i] = RD();
  for (unsigned i(n); i < m; ++i) a[i] = 0;
  Inv(a, b, Lgn);
  for (unsigned i(0); i < n; ++i) printf("%u ", b[i]); putchar(0x0A);
  return Wild_Donkey;
}
```