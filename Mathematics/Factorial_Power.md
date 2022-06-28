# 阶乘幂 (Factorial Power)

主要有递进阶乘和递降阶乘两种. 分别记为:

$$
\begin{aligned}
x^{\overline{n}} = \prod_{i = 0}^{n - 1} (x + i) &= \frac{(x + n - 1)!}{(x - 1)!}\\
x^{\underline{n}} = \prod_{i = 0}^{n - 1} (x - i) &= \frac{x!}{(x - n)!}
\end{aligned}
$$

一般常用的是递降阶乘, 也就是 OI 中经常提到的下降幂.

## 第一类斯特林数

我们定义第一类斯特林数 $s(a, b)$ 为:

$$
x^{\underline n} = \sum_{i = 0}^n s(n, i)x^i
$$

我们记:

$$
\left [\begin{matrix}a\\b\end{matrix}\right] = \left|s(a, b)\right|\\
s(a, b) = (-1)^{a - b}\left [\begin{matrix}a\\b\end{matrix}\right]
$$

$\left[\begin{matrix}a\\b\end{matrix}\right]$ 即为无符号斯特林数. 无符号斯特林数有性质:

$$
x^{\overline n} = \sum_{i = 0}^n \left[\begin{matrix}n\\i\end{matrix}\right]x^i
$$

## 圆排列

圆排列指从全集中取特定数量元素排成一个环而不是一个序列的总方案数. 记 $Q(a, b)$ 表示把大小为 $a$ 的全集中取 $b$ 个元素排成一个环的方案数. 因为对于 $Q(a, b)$, 每个方案对应了 $b!\binom ab$ 中的 $b$ 个方案, 因此有:

$$
Q(a, b) = \frac {b!\binom ab}{b} = \frac {a!}{(a - b)!b}
$$

无符号斯特林数 $\left[\begin{matrix}a\\b\end{matrix}\right]$ 的组合意义是把 $a$ 个元素分成 $b$ 个子集, 并且将每个子集圆排列的方案数.

根据组合意义, 我们可以得到无符号斯特林数的递推式:

$$
\left[\begin{matrix}a\\b\end{matrix}\right] = (a - 1)\left[\begin{matrix}a - 1\\b\end{matrix}\right] + \left[\begin{matrix}a - 1\\b - 1\end{matrix}\right]
$$

其意义为: $\left[\begin{matrix}a\\b\end{matrix}\right]$ 中的方案, 由两种情况组成: 第一种是任意 $\left[\begin{matrix}a - 1\\b - 1\end{matrix}\right]$ 中的情况, 加上第 $a$ 个元素自成一环; 第二种是将 $\left[\begin{matrix}a - 1\\b\end{matrix}\right]$ 中的每种方案, 将第 $a$ 个元素插入到前 $a - 1$ 个元素中任意一个的后面形成的方案.

根据 $s(a, b)$ 和 $\left[\begin{matrix}a\\b\end{matrix}\right]$ 的互推式可以得到 $s(a, b)$ 的递推式:

$$
s(a, b) = (1 - a)s(a - 1, b) + s(a - 1, b - 1)
$$

## 第二类斯特林数

定义第二类斯特林数 $\left\{\begin{matrix}a\\b\end{matrix}\right\}$ 为:

$$
x^n = \sum_{i = 0}^n \left\{\begin{matrix}n\\i\end{matrix}\right\} x^{\underline i}
$$

第二类斯特林数有定义式:

$$
\left\{\begin{matrix}a\\b\end{matrix}\right\} = \frac {1}{b!}\sum_{i = 0}^b  (-1)^i\binom{b}{i}(b - i)^a = \sum_{i = 0}^b  (-1)^i\frac{(b - i)^a}{i!(b - i)!}
$$

第二类斯特林数 $\left\{\begin{matrix}a\\b\end{matrix}\right\}$ 的组合意义是将 $a$ 个元素分成 $k$ 个非空子集的方案数. 因此有递推式:

$$
\left\{\begin{matrix}a\\b\end{matrix}\right\} = b\left\{\begin{matrix}a - 1\\b\end{matrix}\right\} + \left\{\begin{matrix}a - 1\\b - 1\end{matrix}\right\}
$$

对于 $\left\{\begin{matrix}a\\b\end{matrix}\right\}$ 的所有方案, 可以分为两种情况. 一种是元素 $a$ 独自分到第 $a$ 个集合, 和 $\left\{\begin{matrix}a - 1\\b - 1\end{matrix}\right\}$ 中的方案一一对应; 另一种是元素 $a$ 加入到 $\left\{\begin{matrix}a - 1\\b\end{matrix}\right\}$ 任意方案中的 $b$ 个集合之一, 所以一个 $\left\{\begin{matrix}a - 1\\b\end{matrix}\right\}$ 的方案对应 $b$ 个 $\left\{\begin{matrix}a\\b\end{matrix}\right\}$ 的元素.

## 下降幂多项式

我们把形如下式的多项式称为下降幂多项式.

$$
f(x) = \sum_{i = 0}^n a_ix^{\underline i}
$$

如果我们有多项式 $f(x) = \displaystyle\sum_{i = 0}^n a_ix^i$, 需要求出一组系数 $b$, 使得 $f(x) = g(x) = \displaystyle \sum_{i = 0}^n b_ix^{\underline i}$, 可以尝试使用第二类斯特林数:

$$
\begin{aligned}
\sum_{i = 0}^n b_ix^{\underline i} &= \sum_{i = 0}^n a_ix^i\\
\sum_{i = 0}^n b_ix^{\underline i} &= \sum_{i = 0}^n a_i\sum_{j = 0}^i\left\{\begin{matrix}i\\j\end{matrix}\right\}x^{\underline j}\\
\sum_{i = 0}^n b_ix^{\underline i} &= \sum_{j = 0}^n x^{\underline j}\sum_{i = j}^n a_i\left\{\begin{matrix}i\\j\end{matrix}\right\}\\
b_i &= \sum_{j = i}^n a_j\left\{\begin{matrix}j\\i\end{matrix}\right\}\\
\end{aligned}
$$

## 下降幂和组合数

如果有组合数 $\binom ab$, 那么它乘以 $b$ 的下降幂有如下式子:

$$
\begin{aligned}
&b^{\underline x}\binom ab\\
= &\frac{a!}{b!(a - b)!} \times \frac{b!}{(b - x)!}\\
= &\frac{a!}{(a - b)!(b - x)!}\\
= &\frac{(a - x)!}{(a - b)!(b - x)!} a^{\underline x}\\
= &\binom{a - x}{b - x}a^{\underline x}
\end{aligned}
$$
