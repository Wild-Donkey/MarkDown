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
