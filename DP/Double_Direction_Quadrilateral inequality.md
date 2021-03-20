# [Luogu4767-IOI2000 邮局](https://www.luogu.com.cn/problem/P4767)

二维四边形不等式, 这里是有关[四边形不等式](https://www.luogu.com.cn/blog/Wild-Donkey/si-bian-xing-fou-deng-shi-optimization-of-quadrilateral-inequality)的内容

## 题意

有 $n$ 个村庄, 选其中 $m$ 个建邮局, 给出村庄的坐标 $x_i$, 问村庄到最近邮局的距离总和的最小值

$1 \leq m \leq 300, m \leq n \leq 3000, 1 \leq x_i \leq 10000$

## 推导

### 状态转移

设计状态 $f_{i, j}$ 表示前 $i$ 个村庄建 $j$ 个邮局, 第 $j$ 个邮局在第 $i$ 个村庄的距离和. $g_{i, j}$ 表示在 $[i, j]$ 内放一个邮局的最小距离和, $sum_i$ 表示村庄坐标前缀和, 写出方程

$$
f_{i, j} = min(f_{i, k} + g_{k + 1, j})
$$

$$
g_{i, j} = min((sum_j - sum_{k - 1} - (j - (k - 1))x_k) +\\ (k - (i - 1))(x_k - x_{i - 1}) - (sum_k - sum_{i - 1} - (k - (i - 1))x_i))
$$

展开

$$
g_{i, j} = min(sum_j - sum_{k - 1} - jx_k + (k - 1)x_k +\\ kx_k - (i - 1)x_k - kx_{i -1} + (i - 1)x_{i - 1} - sum_k + sum_{i - 1} + kx_i - (i - 1)x_i)
$$

合并同类项

$$
g_{i, j} = min(sum_j - sum_{k - 1} - jx_k + (k - 1)x_k +\\ kx_k - (i - 1)x_k - kx_{i -1} + (i - 1)x_{i - 1} - sum_k + sum_{i - 1} + kx_i - (i - 1)x_i)
$$

无论坐标如何, 在村庄 $[i, j]$ 中, 邮局在奇数个村庄的中间一个和偶数个村庄的中间两个中任意一个时, 总距离最优

简单证明: 如果不在中间, 不失一般性, 假设邮局左边村庄多, 则放在更靠左一个村庄, 左边村庄到邮局总距离减小的值比右边村庄到邮局总距离增大的值之比就是左边村庄数和右边村庄数 (包括原来邮局所在村庄) 之比, 所以越靠中间一定会越优

所以将 $k$ 替换为 $\frac{i + j}{2}$ (不加说明皆向下取整)

$$
g_{i, j} = sum_i + sum_j - 2sum_{\frac{i + j}{2}} - if((i + j) \& 1)x_{\frac{i + j}{2}}
$$

### 四边形不等式

