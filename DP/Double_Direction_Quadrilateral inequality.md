# [Luogu4767-IOI2000 邮局](https://www.luogu.com.cn/problem/P4767)

二维四边形不等式, 这里是有关[四边形不等式](https://www.luogu.com.cn/blog/Wild-Donkey/si-bian-xing-fou-deng-shi-optimization-of-quadrilateral-inequality)的内容

## 题意

有 $n$ 个村庄, 选其中 $m$ 个建邮局, 给出村庄的坐标 $x_i$, 问村庄到最近邮局的距离总和的最小值

$1 \leq m \leq 300, m \leq n \leq 3000, 1 \leq x_i \leq 10000$

## 推导

### 状态转移

设计状态 $f_{i, j}$ 表示前 $i$ 个村庄建 $j$ 个邮局的距离和. $g_{i, j}$ 表示在区间 $[i, j]$ 内放一个邮局的最小距离和, 写出方程

$$
f_{i, j} = min(f_{k, j - 1} + g_{k + 1, i})
$$

无论坐标如何, 在村庄 $[i, j]$ 中, 邮局在村庄 $\frac{i + j}2$ 时, (本篇内不特殊说明, 除法向下取整)

简单证明: 如果不在 $\frac{i + j}2$, 不失一般性, 假设邮局左边村庄多, 则放在更靠左一个村庄, 左边村庄到邮局总距离减小的值比右边村庄到邮局总距离增大的值之比就是左边村庄数和右边村庄数 (包括原来邮局所在村庄) 之比, 所以越靠中间一定会越优

很容易写出 $O(n^2)$ 的递推式, 

$$
g_{i, j} = g_{i, j - 1} + a_j - a_{\frac{i + j}2}
$$

### 四边形不等式

用 $Dec_{i, j}$ 表示状态 $(i, j)$ 的最优决策. 打表发现, $Dec_{i, j} \geq max(Dec_{i - 1, j}, Dec_{i, j - 1})$

**首先证明 $g_{i, j}$ 满足四边形不等式 (边界情况下, $g_{i, i} = 0$)**

设 $i < j$, 根据递推式得到

$$
g_{i, j + 1} = g_{i, j} + a_{j + 1} - a_{\frac{i + j + 1}2}\\
g_{i + 1, j + 1} = g_{i + 1, j} + a_{j + 1} - a_{\frac{i + j}2 + 1}
$$

由此推出

$$
g_{i + 1, j} + g_{i, j + 1} = g_{i + 1, j} + g_{i, j} + a_{j + 1} - a_{\frac{i + j + 1}2}\\
g_{i, j} + g_{i + 1, j + 1} = g_{i + 1, j} + g_{i, j} + a_{j + 1} - a_{\frac{i + j}2 + 1}
$$

由于 $a$ 的单调性, 一定有 $a_{\frac{i + j + 1}2} \leq a_{\frac{i + j}2 + 1}$, 所以有

$$
g_{i + 1, j} + g_{i, j + 1} \geq g_{i, j} + g_{i + 1, j + 1}
$$

结合之前[这篇博客](https://www.luogu.com.cn/blog/Wild-Donkey/si-bian-xing-fou-deng-shi-optimization-of-quadrilateral-inequality)证明过的定理, $g_{i, j}$ 满足四边形不等式, 即对于 $a \leq b \leq c \leq d$, 有

$$
g_{a, d} + g_{b, c} \geq g_{a, c} + g_{b, d}
$$

**然后, 再来证明 $f_{i, j}$ 满足四边形不等式**

因为不存在 $i < j$ 的情况, 所以设 $f_{i, j} = \infin (i < j)$, 且一定有 $f_{i, i} = g_{i, i} = 0$

由题意得, 对于 $a \leq b \leq c \leq d$, 有

$$
g_{a, d} \geq g_{b, c}\\
f_{b, c} \geq f_{a, c} \geq f_{a, d}\\
f_{b, c} \geq f_{b, d} \geq f_{a, d}
$$


一开始用李煜东的 `进阶指南` 上证区间 DP 的方法证明, 一个上午都没证出来, 因为使用数学归纳法必须**从递推边界开始**, 否则是空中楼阁, 无论如何都证不出来.

因为在 $j = 1$ 时, $f_{i, j} = g_{1, i}$, 所以

$$
f_{i, j} = g_{1, i}\\
f_{i, j + 1} = g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i}\\
f_{i + 1, j} = g_{1, i + 1}\\
f_{i + 1, j + 1} = g_{1, Dec_{i + 1, 2}} + g_{Dec_{i + 1, 2} + 1, i + 1}\\
$$

因为 $Dec_{i + 1, 2}$ 是最优决策, 所以 $Dec_{i, 2}$ 对于状态 $(i + 1, 2)$ 不一定最优

$$
f_{i + 1, j + 1} \leq g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i + 1}\\
$$

然后将其两两相加

$$
f_{i, j} + f_{i + 1, j + 1} \leq g_{1, i} + g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i + 1}\\
f_{i, j + 1} + f_{i + 1, j} = g_{1, i + 1} + g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i}
$$

因为 $g_{i, j}$ 满足四边形不等式, $1 < Dec_{i, 2} + 1 < i < i + 1$, 所以

$$
g_{1, i + 1} + g_{Dec_{i, 2} + 1, i} \geq g_{1, i} + g_{Dec_{i, 2} + 1, i + 1}
$$

两边同时加上 $g_{1, Dec_{i, 2}}$, 得到不等式

$$
f_{i, j} + f_{i + 1, j + 1}\\ \leq g_{1, i} + g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i + 1}\\ \leq g_{1, i + 1} + g_{1, Dec_{i, 2}} + g_{Dec_{i, 2} + 1, i}\\ = f_{i, j + 1} + f_{i + 1, j}
$$

则对于 $j = 1$, $f_{i, j}$ 满足四边形不等式

接下来, 假设 $j < k$ 时, $f_{i, j}$ 满足四边形不等式, 用数学归纳法证明 $j = k$ 时, $f_{i, j}$ 满足四边形不等式


根据状态转移方程, 有

$$
f_{i, j} = f_{Dec_{i, j}, j - 1} + g_{Dec_{i, j} + 1, i}\\
f_{i, j + 1} = f_{Dec_{i, j + 1}, j} + g_{Dec_{i, j + 1} + 1, i}\\
f_{i + 1, j} = f_{Dec_{i + 1, j}, j - 1} + g_{Dec_{i + 1, j} + 1, i + 1}\\
f_{i + 1, j + 1} = f_{Dec_{i + 1, j + 1}, j} + g_{Dec_{i + 1, j + 1} + 1, i + 1}
$$

相加得

$$
f_{i, j + 1} + f_{i + 1, j} = f_{Dec_{i, k + 1}, k} + g_{Dec_{i, k + 1} + 1, i} + f_{Dec_{i + 1, k}, k - 1} + g_{Dec_{i + 1, k} + 1, i + 1}\\
f_{i, j} + f_{i + 1, j + 1} = f_{Dec_{i, k}, k - 1} + g_{Dec_{i, k} + 1, i} + f_{Dec_{i + 1, k + 1}, k} + g_{Dec_{i + 1, k + 1} + 1, i + 1}
$$

仍然利用决策的最优性, 得到不等式

$$
f_{i, j} + f_{i + 1, j + 1} \leq f_{Dec_{i + 1, k}, k - 1} + g_{Dec_{i + 1, k} + 1, i} + f_{Dec_{i, k + 1}, k} + g_{Dec_{i, k + 1} + 1, i + 1}\\
f_{i, j} + f_{i + 1, j + 1} \leq f_{Dec_{i, k + 1}, k - 1} + g_{Dec_{i, k + 1} + 1, i} + f_{Dec_{i + 1, k}, k} + g_{Dec_{i + 1, k} + 1, i + 1}
$$

接下来, 针对 $Dec_{i + 1, k}$ 和 $Dec_{i, k + 1}$ 的大小关系分类讨论

* $Dec_{i + 1, k} \leq Dec_{i, k + 1}$

因为 $Dec_{i + 1, k} \leq Dec_{i, k + 1} < i < i + 1$, 且 $j_{i, j}$ 满足四边形不等式, 所以在原不等式基础上, 有

$$
f_{i, j} + f_{i + 1, j + 1}\\
\leq f_{Dec_{i + 1, k}, k - 1} + f_{Dec_{i, k + 1}, k} + g_{Dec_{i + 1, k} + 1, i} + g_{Dec_{i, k + 1} + 1, i + 1}\\
\leq f_{Dec_{i + 1, k}, k - 1} + f_{Dec_{i, k + 1}, k} + g_{Dec_{i + 1, k} + 1, i + 1} + g_{Dec_{i, k + 1} + 1, i}\\
= f_{i, j + 1} + f_{i + 1, j}
$$

* $Dec_{i, k + 1} \leq Dec_{i + 1, k}$

因为 $k - 1 < k \leq Dec_{i, k + 1} \leq Dec_{i + 1, k}$, 且 $j = k - 1$ 时, f_{i, j} 满足四边形不等式, 所以有

$$
f_{i, j} + f_{i + 1, j + 1}\\
\leq f_{Dec_{i, k + 1}, k - 1} + f_{Dec_{i + 1, k}, k} + g_{Dec_{i, k + 1} + 1, i} + g_{Dec_{i + 1, k} + 1, i + 1}\\
\leq f_{Dec_{i, k + 1}, k} + f_{Dec_{i + 1, k}, k - 1} + g_{Dec_{i, k + 1} + 1, i} + g_{Dec_{i + 1, k} + 1, i + 1}\\
= f_{i, j + 1} + f_{i + 1, j}
$$

所以, 在 $j \leq k$ 时, $f_{i, j}$ 满足四边形不等式, 由此可以推出 $f_{i, j}$ 满足四边形不等式

### 决策单调性

现在已经知道了对于 $a \leq b \leq c \leq d$, 满足

$$
f_{d, a} + f_{c, b} \geq f_{c, a} + f_{d, b}\\
g_{a, d} + g_{b, c} \geq g_{a, c} + g_{b, d}\\
g_{a, d} \geq g_{b, c}
$$

希望证明对于任意 $i \geq j$, 有

$$
Dec_{i, j} \leq Dec_{i + 1, j}\tag{1}
$$

$$
Dec_{i, j} \leq Dec_{i, j + 1}\tag{2}
$$

先证明 $(1)$ 式

设 $0 \leq D < Dec_{i, j}$, $i < i' \leq n$

由 $Dec_{i, j}$ 最优得

$$
f_{i, j}\\
= f_{Dec_{i, j}, j - 1} + g_{Dec_{i, j} + 1, i}\\
\leq f_{D, j - 1} + g_{D + 1, i}\\
f_{i', j}\\
\leq f_{Dec_{i, j}, j - 1} + g_{Dec_{i, j} + 1, i'}
\leq f_{D, j - 1} + g_{Dec_{i, j} + 1, i'}
$$

因为 $i' > i$, 所以 $g$

<!--
两式相加

$$
2f_{b, c} \geq f_{a, c} + f_{b, d} \geq 2f_{a, d}
$$

只要证明 $f_{b, c} - f_{a, d} \leq 2f_{b, c} - f_{a, c} - f_{b, d}$

$- f_{a, d} \leq f_{b, c} - f_{a, c} - f_{b, d}$

* $Dec_{j + 1, j} = j$

$$
f_{i, j + 1} + f_{i + 1, j} = f_{Dec_{i, j + 1}, j} + g_{Dec_{i, j + 1} + 1, i} + f_{Dec_{i + 1, j}, j - 1} + g_{Dec_{i + 1, j} + 1, i + 1}\\
f_{i, j} + f_{i + 1, j + 1} = f_{Dec_{i, j}, j - 1} + g_{Dec_{i, j} + 1, i} + f_{Dec_{i + 1, j + 1}, j} + g_{Dec_{i + 1, j + 1} + 1, i + 1}
$$

$$
f_{i, j} = f_{Dec_{i, j}, j - 1} + g_{Dec_{i, j} + 1, i}\\
f_{i, j + 1} = f_{Dec_{i, j + 1}, j} + g_{Dec_{i, j + 1} + 1, i}\\
f_{i + 1, j} = f_{Dec_{i + 1, j}, j - 1} + g_{Dec_{i + 1, j} + 1, i + 1}\\
f_{i + 1, j + 1} = f_{Dec_{i + 1, j + 1}, j} + g_{Dec_{i + 1, j + 1} + 1, i + 1}\\
$$

$$
g_{i, j} = g_{i, j - 1} + a_j - a_{\frac{i + j}2}\\
g_{i, j + 1} = g_{i, j} + a_{j + 1} - a_{\frac{i + j + 1}2}\\
g_{i + 1, j} = g_{i + 1, j - 1} + a_{j} - a_{\frac{i + j + 1}2}\\
g_{i + 1, j + 1} = g_{i + 1, j} + a_{j + 1} - a_{\frac{i + j}2 + 1}
$$

```
git config --global http.proxy 'socks5://127.0.0.1:8000'
git config --global https.proxy 'socks5://127.0.0.1:8000'
```
在 $i - j = 1$ 时, 有

$$
f_{i, j + 1} + f_{i + 1, j} = f_{Dec_{j + 1, j + 1}, j} + g_{Dec_{j + 1, j + 1} + 1, j + 1} + f_{Dec_{j + 2, j}, j - 1} + g_{Dec_{j + 2, j} + 1, j + 2}\\
= f_{Dec_{j + 2, j}, j - 1} + g_{Dec_{j + 2, j} + 1, j + 2}\\
f_{i, j} + f_{i + 1, j + 1} = f_{Dec_{j + 1, j}, j - 1} + g_{Dec_{j + 1, j} + 1, j + 1} + f_{Dec_{j + 2, j + 1}, j} + g_{Dec_{j + 2, j + 1} + 1, j + 2}
$$

考虑 $Dec_{i, j}$ 的范围, 根据决策的顺序得到 $Dec_{i, j} < i$, 在前 $Dec_{i, j}$ 个村庄内放 $j - 1$ 个邮局, 所以 $Dec_{i, j} \geq j - 1$, 于是对 $Dec_{j + 2, j} \in [j - 1, i)$ 进行分类讨论

* $Dec_{j + 2, j} = j - 1$

$$
f_{i, j + 1} + f_{i + 1, j} = f_{j - 1, j - 1} + g_{j, j + 2} = g_{j, j + 2} \geq f_{j + 2, j}
$$

$$
f_{i, j} + f_{i + 1, j + 1} = f_{Dec_{j + 1, j}, j - 1} + g_{Dec_{j + 1, j} + 1, j + 1} + f_{Dec_{j + 2, j + 1}, j} + g_{Dec_{j + 2, j + 1} + 1, j + 2}
$$

* * $Dec_{j + 2, j} = j - 1$

$$
f_{i + 1, j} = f_{j - 1, j - 1} + g_{j, j + 2} = g_{j, j + 2} = g_{j, j + 1} + a_{j + 1} - a_{j} 
$$

又因为 $j - 1 \geq Dec_{j + 2, j} \leq j + 1$

$$
\\
\\
\\
g_{j + 1, j + 2} = f_{j + 2, j}\\
f_{j, j} + g_{j + 1, j + 2} = f_{j + 2, j} + g_{j + 2, j + 2}\\
$$
f_{i, j} + f_{i + 1, j + 1} \leq f_{i, j + 1} + f_{i + 1, j}
$$

Dec_{j + 1}
$$
-->