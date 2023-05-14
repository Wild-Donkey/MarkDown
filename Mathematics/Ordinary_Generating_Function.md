# 数列展示架: 母函数(Generating Function)
## 普通母函数篇

> A generating function is a clothesline on which we hang up a sequence of numbers for display.
> ----Herbert Wilf

## 定义

GF 有很多不同的形式, 在解决不同的问题时我们按需选择合适的形式, 常用的一般有 OGF (Ordinary GF), EGF (Exponential GF).

假设序列 $a_i$ 的 OGF 为 $F(x)$, EGF 为 $G(x)$, 则:

$$
F(x) = \sum_{i = 0}^{\infin} a_ix^i\\
G(x) = \sum_{i = 0}^{\infin} \dfrac{a_ix^i}{i!}
$$

级数的价值一般体现在它们收敛的时候, 这时候就可以用一个有限的值或表达式表达一个无穷的东西. GF 也是一样, 我们找到令含有 GF 的表达式收敛的 $x$ 取值, 借此找到我们想要的性质.

## 等比数列求和

问题: 对于 $q \neq 1$, 求:

$$
\sum_{i = 0}^n aq^i
$$

假设 $a_i$ 为常数序列, $a_i = a$, 它的 GF 为 $F(x)$.

$$
\begin{aligned}
F(x) &= \sum_{i = 0}^{\infin} ax^i\\
a + xF(x) &= ax^0 + \sum_{i = 1}^{\infin} ax^i\\
a + xF(x) &= \sum_{i = 0}^{\infin} ax^i\\
a + xF(x) &= F(x)\\
a &= (1 - x)F(x)\\
\frac a{1 - x} &= F(x)
\end{aligned}
$$

结合中学知识, 我们知道当 $x\in (-1,1)$ 时, 和式 $\displaystyle{\sum_{i = 0}^{\infin} x^i}$ 收敛. 根据上面的式子, 我们可以直接读出收敛值 $\frac 1{1 - x}$.

当 $x$ 超出此范围, 我们仍可以借助这个式子求出前 $n$ 项和.

$$
F(x) - x^{n + 1}F(x) = \sum_{i = 0}^{n} ax^i\\
(1 - x^{n + 1})F(x) = \sum_{i = 0}^{n} ax^i\\
\frac{a(1 - x^{n + 1})}{1 - x} = \sum_{i = 0}^{n} ax^i\\
\frac{(1 - x^{n + 1})}{1 - x} = \sum_{i = 0}^{n} x^i\\
$$

因此, 对于所有 $q \neq 1$, 我们得到了等比数列的前 $n$ 项和公式:

$$
\sum_{i = 0}^n q^i = \frac{(1 - q^{n + 1})}{1 - q}\\
\sum_{i = 1}^n a_1q^{i - 1} = \frac{a_1(1 - q^{n})}{1 - q}
$$

思考在这个过程中 GF 帮我们做了什么. 在传统推到中, 我们使用到了错位相减法:

$$
(1 - x)\sum_{i = 0}^{n} = 1 - x^{n + i}\\
\sum_{i = 0}^{n} = \frac{1 - x^{n + i}}{(1 - x)}
$$

而 GF 则是把这种方法推广到了无穷项, 更加普适, 更加形式化.

## 等差乘等比

既然 GF 可以帮我们进行错位相减, 那么等差乘等比这个经典错位相减问题自然也可以从这个角度思考.

问题: 对于 $q \neq 1$, 求:

$$
\sum_{i = 0}^n (a + id)q^i
$$

假设等差数列 $a_i = a + id$, 设它的 OGF 为 $F(x)$.

$$
\begin{aligned}
F(x) &= \sum_{i = 0}^{\infin} (a + id)x^i\\
xF(x) &= \sum_{i = 1}^{\infin} (a + (i - 1)d)x^i\\
(1 - x)F(x) &= a + \sum_{i = 1}^{\infin} dx^i\\
(1 - x)F(x) &= a + \frac{dx}{1 - x}\\
F(x) &= \frac a{1 - x} + \frac{dx}{(1 - x)^2}\\
\sum_{i = 0}^n (a + id)q^i &= (1 - x^{n + 1})F(x) - \sum_{i = n + 1}^{\infin} (n + 1)dx^i\\
\sum_{i = 0}^n (a + id)q^i &= (1 - x^{n + 1})(\frac a{1 - x} + \frac{dx}{(1 - x)^2}) - \frac{(n + 1)dx^{n + 1}}{1 - x}\\
\sum_{i = 0}^n (a + id)q^i &= \frac {(1 - x^{n + 1})a}{1 - x} + \frac{(1 - x^{n + 1})dx}{(1 - x)^2} - \frac{(n + 1)dx^{n + 1}}{1 - x}\\
\sum_{i = 0}^n (a + id)q^i &= \frac a{1 - x} + \frac{dx}{(1 - x)^2} - \frac{x^{n + 1}}{1 - x}(a + \frac{dx}{1 - x} + (n + 1)d)\\
\sum_{i = 0}^n (a + id)q^i &= \frac a{1 - x} + \frac{dx}{(1 - x)^2} - \frac{x^{n + 1}}{1 - x}(a + \frac{d}{1 - x} + nd)\\
\end{aligned}
$$

因此, 我们得到了差比数列的前 $n$ 项和公式:

$$
\sum_{i = 0}^n (a + id)q^i = \frac a{1 - q} + \frac{dq}{(1 - q)^2} - \frac{q^{n + 1}}{1 - q}(a + \frac{d}{1 - q} + nd)\\
\sum_{i = 1}^n (a + (i - 1)d)q^{i - 1} = \frac a{1 - q} + \frac{dq}{(1 - q)^2} - \frac{q^n}{1 - q}(a + \frac{d}{1 - q} + (n - 1)d)
$$

如果进行二次或多次地错位相减, 将上面的操作进行多次, 还可以解决二阶甚至多阶差比数列的求和, 如求:

$$
\sum_{i = 0}^{n} q^i \sum_{j = 0}^m a_ji^j
$$

$\displaystyle{A_i = \sum_{j = 0}^m a_ji^j}$ 是一个 $m$ 阶差比数列 则需要 $m$ 次错位相减可以求和.

## 斐波那契数列

斐波那契数列 $F_{i + 2} = F_i + F_{i + 1}$, 是一个线性递推数列, 其中 $F_0 = 0$, $F_1 = 1$.

我们设它的 OGM 为 $F(x)$, 由定义式可得:

$$
\begin{aligned}
F(x) &= x + xF(x) + x^2F(x)\\
(1 - x - x^2)F(x) &= x\\
F(x) &= \frac x{1 - x - x^2}
\end{aligned}
$$

解一元二次方程 $1 - x - x^2 = 0$, 得 $x_1 = -\frac{1 + \sqrt 5}2$, $x_2 = -\frac{1 - \sqrt 5}2$, 因此:

$$
\begin{aligned}
&1 - x - x^2\\
=&-(x + \frac{1 + \sqrt 5}2)(x + \frac{1 - \sqrt 5}2)\\
=&(\frac{1 + \sqrt 5}2)(\frac{1 - \sqrt 5}2)(x + \frac{1 + \sqrt 5}2)(x + \frac{1 - \sqrt 5}2)\\
=&(\frac{1 - \sqrt 5}2x - 1)(\frac{1 + \sqrt 5}2x - 1)
\end{aligned}
$$

代回原式:

$$
\begin{aligned}
F(x) &= \frac x{(\frac{1 - \sqrt 5}2x - 1)(\frac{1 + \sqrt 5}2x - 1)}\\
F(x) &= \frac 1{\sqrt5} \left(\frac 1{\frac{1 - \sqrt 5}2x - 1} - \frac 1{\frac{1 + \sqrt 5}2x - 1}\right)
\end{aligned}
$$

- GF 的线性运算
  这里假设两个序列 $a$, $b$ 的 OGF 分别为 $F(x)$, $G(x)$, 定义 $c_i = a_i + b_i$, 那么显然 $c$ 的 OGF $H(x)$ 满足 $H(x) = F(x) + G(x)$.
  定义序列 $a$, $b$ 的 OGF 分别为 $F(x)$, $G(x)$, 其中 $b_i = qa_i$, 那么显然有满足 $G(x) = qF(x)$.

引入了线性运算, 我们定义 $F_i = \frac 1{\sqrt 5} (f_i - g_i)$, 其中 $f_i$, $g_i$ 的生成函数分别为 $G_1(x)$, $G_2(x)$, 则有 $F(x) = \frac 1{\sqrt 5}(G_1(x) - G_2(x))$.

刚好满足前面我们得到的形式:

$$
\begin{aligned}
F(x) &= \frac 1{\sqrt5} \left(\frac 1{\frac{1 - \sqrt 5}2x - 1} - \frac 1{\frac{1 + \sqrt 5}2x - 1}\right)\\
\frac 1{\sqrt 5} (G_1(x) - G_2(x)) &= \frac 1{\sqrt5} \left(\frac 1{\frac{1 - \sqrt 5}2x - 1} - \frac 1{\frac{1 + \sqrt 5}2x - 1}\right)\\
G_1(x) &= \frac 1{\frac{1 - \sqrt 5}2x - 1}\\
G_2(x) &= \frac 1{\frac{1 + \sqrt 5}2x - 1}
\end{aligned}
$$

接下来用 $G_1(x)$ 求出序列 $f$:

$$
\begin{aligned}
G_1(x) &= \frac 1{\frac{1 - \sqrt 5}2x - 1}\\
\left(\frac{1 - \sqrt 5}2x - 1\right)G_1(x) &= 1\\
-f_0 + \sum_{i = 1}^{\infin} \left(\frac{1 - \sqrt 5}2f_{i - 1} - f_i\right)x^i &= 1\\
\end{aligned}
$$

由每一项系数分别相等得:

$$
\left\{
\begin{aligned}
&f_0 = -1\\
&\frac{1 - \sqrt 5}2f_{i - 1} - f_i = 0
\end{aligned}
\right.
$$

解得:

$$
f_i = -\left(\frac{1 - \sqrt 5}2\right)^i
$$

同理可得:

$$
g_i = -\left(\frac{1 + \sqrt 5}2\right)^i
$$

因此:

$$
\begin{aligned}
F_i &= \frac 1{\sqrt 5} (f_i - g_i)\\
F_i &= \frac 1{\sqrt 5} \left(\left(\frac{1 + \sqrt 5}2\right)^i - \left(\frac{1 - \sqrt 5}2\right)^i\right)
\end{aligned}
$$

同样地, 对于其它线性递推数列, 也存在类似的方法, 常见的仍然是二阶齐次线性递推的数列. 请读者思考一般形式的二阶齐次线性递推数列 $a_{i + 2} = \lambda a_{i + 1} + \phi a_i$ 的通项公式.