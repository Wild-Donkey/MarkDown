---
title: AKS 素性检验的简要介绍
date: 2022-07-8 10:54
categories: Mathematics
tags:
  - Mathematics
  - Number_Theory
  - AKS_Primality_Test
  - Primality_Test
thumbnail: /images/Photo12.JPG
---

# AKS Primality Test

AKS 素性测试的基于这样一个结论:

对于 $n \geq 2$, 有同余多项式:

$$
(x + a)^n \equiv (x^n + a) \pmod n
$$

当且仅当 $n$ 为质数时, 对所有 $\gcd(a, n) = 1$ 的 $a$ 成立.

## 组合数和质数

为了说明上面这个式子的正确性, 我们需要先证明如下式子, 对 $n \geq 2$ 当且仅当 $n$ 为质数时成立:

$$
\binom nk \equiv 0 \pmod n ~~~~ (0 < k < n)
$$

整理式子:

$$
\begin{aligned}
\binom nk &\equiv 0 \pmod n\\
\frac{n^{\underline{k}}}{k!} &\equiv 0 \pmod n\\
\end{aligned}
$$

对于质数 $n$, 我们知道 $k!$ 一定不含因数 $n$, 而 $n^{\underline{k}}$ 一定含因数 $n$, 因此对于所有 $k$ 都有 $n | \dfrac{n^{\underline{k}}}{k!}$. 因此该结论成立是 $n$ 是质数的必要条件.

对于合数 $n$, 我们取它的一个质因子 $p$, 假设 $n$ 中有 $s$ 个 $p$, 那么一定有 $k = p^s$ 时, 上式不成立. 我们知道 $p^s!$ 中 $p$ 的次数为 $\displaystyle{\sum_{i = 0}^{s - 1} p^i}$, 而 $n^{\underline{k}}$ 中 $p$ 的次数也是 $\displaystyle{\sum_{i = 0}^{s - 1} p^i}$, 因此 $\dfrac{n^{\underline{k}}}{k!}$ 中 $p$ 的次数为 $0$, 而 $n$ 中 $p$ 的次数为 $s$, 因为 $p$ 是 $n$ 的质因数, 所以 $s > 0$. 因此这时 $\dfrac{n^{\underline{k}}}{k!} \equiv 0 \pmod n$ 不成立, 该结论成立时 $n$ 是质数的必要条件.

综上, 对于 $n \geq 2$. 对所有 $0 < k < n$, 满足 $\dbinom nk \equiv 0 \pmod n$ 是 $n$ 为质数的充要条件.

## AKS 的基础推论

因此可以证明一开始的结论:

$$
\begin{aligned}
(x + a)^n &\equiv (x^n + a) \pmod n\\
\sum_{i = 0}^n \binom ni x^ia^{n - i} &\equiv (x^n + a) \pmod n\\
x^n + a^n + \sum_{i = 1}^{n - 1} \binom ni x^ia^{n - i} &\equiv (x^n + a) \pmod n\\
a^n + \sum_{i = 1}^{n - 1} \binom ni x^ia^{n - i} &\equiv a \pmod n\\
\end{aligned}
$$

当 $n$ 是质数的时候, 这个式子的正确性是显然的, 因为我们已经证明了这些二项式系数在 $n$ 为质数的时候为 $0$, 而且根据费马小定理有 $a^n \equiv a \pmod n$, 因此满足这个结论是 $n$ 为质数的必要条件.

当 $n$ 不是质数的时候, 情况有些复杂, 我思考了好久也没有证明出来. 而且这个证明在中英文维基百科上都没有写, 所以去《信息安全数学基础》上试图找到合理的解释.

对于同余多项式, 它们相等当且仅当 $x$ 每一个次方的系数在模对应模数意义下相等, 所以我们只要对于某一个满足 $\gcd(a, n) = 1$ 的 $a$, 在某一项 $x^i, i \in (0, n)$ 中说明它的系数不为 $0$, 就可以说明对于合数 $n$ 这个条件不成立.

假设合数 $n$ 有质因子 $p$, $n$ 中一共有 $s$ 个 $p$ 相乘. 那么 $x^p$ 的系数为 $\dbinom np a^{n - p}$. 前面已经得出了相关的结论, 得到 $\dbinom np$ 中 $p$ 的次数为 $s - 1$, 而因为 $a$ 和 $n$ 互质所以 $a$ 也不能提供因子 $p$, 因此 $\dbinom np a^{n - p}$ 中 $p$ 的次数也为 $s - 1$, 也就是模 $n$ 意义下不为 $0$. 所以满足这个结论是 $n$ 为质数的充分条件.

综上, 满足这个结论是 $n$ 为质数的充要条件. AKS 的原理就是从这个推论中导出的.

但是如果每次计算这个多项式会发现, 多项式有 $n$ 项, 所以需要 $O(n)$ 的时间复杂度, 所以为了得到更优的复杂度, 有更强的推论.

## 定理的推广

如果我们把上面的式子对 $x^r - 1$ 这样形式的多项式进行取模, 然后判断是否成立, 一定可以判断出不成立的情况. 也就是说对于任意 $x^r - 1$, 满足下面的式子是满足前面提出的式子的必要条件.

$$
(x + a)^n \equiv x^n + a \pmod {x^r − 1, n}
$$

AKS 得出了结论, 我们只要在 $r$ 是多项式 $\log n$ 的情况下, 判断对于多项式 $\log n$ 个 $a$, 是否满足上面的同余式成立, 即可判断 $n$ 是否是质数的幂.

对互质的 $n$ 和 $r$ 定义 $n$ 模 $r$ 的阶 $ord_r(n)$ 表示满足 $n^b \equiv 1 \pmod r$ 的最小的正整数 $b$. 根据欧拉定理 (数论) 显然有 $ord_r(n) | \phi(r)$.

在论文中, 作者证明了 $r$ 可以在 $\log^5 n$ 的级别内找到, 而 $a$ 也可以仅判断前 $\sqrt {\phi(r)} \log n$ 级别的数.

关于这个结论的证明, 需要用到大量抽象代数的知识, 但是我不想学抽象代数, 怎么办呢?

所以略过这部分的证明.

## AKS Algorithm

首先需要判断 $n$ 是整数 $m$ 的整数 $k$ 次方的情况. 我们可以枚举 $k$, 容易发现只有 $O(\log n)$ 个 $k$, 然后用[牛顿法](https://wild-donkey.github.io/Mathematics/Polynomial/Polynomial_Logarithm_and_Exponentiation/)开 $\sqrt[k]n$. 这个过程可以在多项式 $\log n$ 的时间内进行.

我们找到最小的正整数 $r$, 使得 $ord_r(n) > \log^2(n)$, 并且试除 $r$ 以内的数字. 如果 $r \geq n$, 判定 $n$ 为质数.

对 $\sqrt {\phi(r)} \log n$ 以内的 $a$ 判断 $(x + a)^n \equiv x^n + a \pmod {x^r − 1, n}$ 是否成立, 成立则 $n$ 为质数, 否则是合数.

这个算法最朴素的实现可以达到 $O(\log^{12} n \text{poly}(\log \log n))$.

之后出现了优化到 $O(\log^6 n \text{poly}(\log \log n))$ 的变体.

## 参考文献

- [Wikipedia - AKS 素性测试](https://zh.wikipedia.org/wiki/AKS%E8%B3%AA%E6%95%B8%E6%B8%AC%E8%A9%**A6**)
- [Wikipedia - AKS primality test](https://en.wikipedia.org/wiki/AKS_primality_test)
- 清华大学出版社 - 信息安全数学基础
- [AKS - Primes is in P](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/primality_journal.pdf)
- [Shanlunjiajian - 关于素数的杂谈](https://shanlunjiajian.github.io/2021/11/03/primes/)
- [Wikipedia - Multiplicative Order](https://en.wikipedia.org/wiki/Multiplicative_order)