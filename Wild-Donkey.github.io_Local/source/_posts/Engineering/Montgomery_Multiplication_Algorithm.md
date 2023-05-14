---
title: 蒙哥马利模乘算法
date: 2022-07-01 16:19
categories: Engineering
tags:
  - Mathematics
  - Optimization
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/Photo6.jpg
---

# 蒙哥马利模乘 (Montgomery Modular Multiplication)

对于大整数的取模乘法, 我们需要对乘积做除法, 如果程序中有大量的取模乘法, 常数必然是极大的, 所以我们考虑如何优化这个常数, 这样就引入了一个算法, 蒙哥马利模乘算法.

由于中文 wiki 词条十分简短, 所以我只能去啃生肉, 进行基本的原理解释.

前情提要: 算法竞赛无需如此卡常, 只是感觉比较有趣, 所以进行理论介绍.

## 蒙哥马利形式 (Montgomery Form)

我们尝试用一个范围内的整数, 映射到 $[0, Mod)$ 范围中的每个整数中.

这就需要引入一个数字 $R > Mod$, 满足 $\gcd(Mod, R) = 1$. 设 $R$ 模 $Mod$ 意义下的乘法逆元为 $R'$. 这时我们知道对于所有 $a \in [0, Mod)$, 模 $Mod$ 意义下 $\frac aR$ 都是互不相同的.

尝试证明之, 假设有 $a, b \in [0, Mod), a \neq b$, 则 $\frac aR \equiv aR' \pmod {Mod}$, $\frac bR \equiv bR' \pmod {Mod}$. 如果 $\frac aR \equiv \frac bR \pmod {Mod}$, 则:

$$
\begin{aligned}
aR' &\equiv bR' &\pmod {Mod}\\
aR' - bR' &\equiv 0 &\pmod {Mod}\\
(a - b)R' &\equiv 0 &\pmod {Mod}\\
\end{aligned}
$$

因为 $\gcd(R, Mod) = 1$, 因此 $R' \in [1, Mod)$, 所以 $a - b = 0$, 和一开始假设的 $a \neq b$ 矛盾, 所以假设不成立. 也就是说可以通过模 $Mod$ 意义下 $\frac aR$ 的值唯一地确定 $a$.

我们称模 $Mod$ 意义下的 $aR$ 为 $a$ 的蒙哥马利形式, 可以通过 $a$ 的蒙哥马利形式唯一地确定 $a$.

## 蒙哥马利形式的乘法

如果我们需要计算 $ab$, 则可以先考虑计算结果的蒙哥马利形式, 即 $abR$, 然后再得到 $ab$.

先提前将所有数字转化为蒙哥马利形式, 也就是 $aR$, $bR$, 然后把它们相乘, 得到 $abR^2$, 然后把它当作 $abR$ 的蒙哥马利形式, 即可求出 $abR$.

## REDC 算法

这个算法是帮助我们根据 $x \in [0, (R - 1)(Mod - 1))$ 计算模 $Mod$ 意义下 $\frac xR$ 的算法. 提前处理出 $Mod'$ 表示模 $R$ 意义下 $Mod$ 的乘法逆元的相反数, 即 $Mod'Mod \equiv -1 \pmod R$.

其基本思想是把 $x$ 转化为 $x' \equiv x \pmod {Mod}$, $R|x'$, 这样我们就可以直接除以 $R$ 得到结果了. 把 $x$ 拆成 $x = qR + r$ 来考虑. $(r \in [0, R))$

如果把模 $R$ 意义下的 $- \frac x{Mod}$ 乘以 $Mod$, 记为 $r' = - \frac x{Mod} \times Mod$, 那么它在模 $R$ 意义下就是 $-x$ 了, 而且因为有因数 $Mod$ 所以在模 $Mod$ 意义下为 $0$.

这时我们发现 $x + r'$ 在模 $Mod$ 意义下仍然是 $x$, 但是在模 $R$ 意义下就变成了 $0$, 也就是说 $x' = x + r'$. 直接把 $x'$ 除以 $R$ 得到答案.

可能看到这里很多人疑惑了, 这样更多的取模和除法不会让常数更大吗. 但是我们可以通过将 $2$ 的整数幂当作 $R$, 借此可以把取模和除法用位运算代替. 而关于 $Mod$ 的取模和除法就这样被省略掉了.

## 蒙哥马利形式的转化

为了快速地将整数转化为蒙哥马利形式, 我们需要处理出 $R^2$ 模 $Mod$ 意义下的结果, 也就是 $R$ 的蒙哥马利形式, 这样只需要把 $x$ 和 $R^2$ 进行蒙哥马利乘法, 就可以得到 $xR$ 模 $Mod$ 意义下的结果了.

## 总结

数字小的时候优化不明显, 但是随着数字的二进制位数增加, 这个优化力度会加大. 但是算法竞赛中很少对整数取模乘法的效率进行很过分的要求, 所以仅作理论了解. (我懒得写)

## 参考

[Montgomery modular multiplication, Wikipedia](https://en.wikipedia.org/wiki/Montgomery_modular_multiplication)

所以 Wikipedia 快出中文词条吧.