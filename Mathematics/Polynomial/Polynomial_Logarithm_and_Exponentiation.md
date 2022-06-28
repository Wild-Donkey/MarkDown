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

假设 $g(x) = \ln f(x)$, 则有:

$$
\begin{aligned}
g(x) &= \ln f(x)\\
g'(x) &= \ln'(f(x))f'(x)\\
g'(x) &= \frac{f'(x)}{f(x)}\\
g'(x) &= \int \frac{f'(x)}{f(x)}\\
\end{aligned}
$$

这里保证 $x$ 的零次项为 $1$, 所以我们只要使得 $g(x)$ 的零次项为 $0$ 即可. 这样做的原因玄之又玄, 我们只能暂时认为这样做是对的.

```cpp

```

## 指数函数 (Exponentiation)

假设 $g(x) = e^{f(x)}$, 则有:

$$
\begin{aligned}
g(x) &= x^{f(x)}\\
g(x) &= x^{f(x)}\\
g(x) &= x^{f(x)}
\end{aligned}
$$