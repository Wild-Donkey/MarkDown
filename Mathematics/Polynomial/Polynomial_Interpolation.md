# 多项式插值

> Keep away from polynomial.  ---- Wild_Donkey

给 $(x_0, y_0), (x_1, y_1),...,(x_n, y_n)$, 共 $n + 1$ 个点. 求一个 $n$ 次 $n + 1$ 项的多项式 $L$, 使得多项式的图像过每一个点. 这个多项式 $L$ 便是拉格朗日多项式 (Lagrange polynomial).

## 拉格朗日基本多项式 (插值基函数)

$\ell_i$ 是一个多项式, 满足 $\ell(x_i) = 1$, 且 $\ell(x_j) = 0\ (j \neq i)$.

$$
\ell_i(x) = \prod_{j = 0, j \neq i}^{n} \frac{x - x_j}{x_i - x_j}
$$

这样当 $x = x_i$ 时, 所有 $\dfrac{x - x_j}{x_i - x_j}$ 的分子等于分母. 当 $x \neq x_i$ 时, 一定存在一个项分子为 $0$, 所以乘起来还是 $0$.

## 拉格朗日多项式

因为每个拉格朗日基本多项式 $\ell_i$ 在除了 $x_i$ 点以外的给定的横坐标上都是 $0$, 所以我们把所有拉格朗日多项式加权求和就能得到符合要求的多项式 $L$.

$$
L(x) = \sum_{i = 0}^{n} y_i\ell_i(x)
L(x) = \sum_{i = 0}^{n} y_i\prod_{j = 0, j \neq i}^{n} \frac{x - x_j}{x_i - x_j}
$$

## 重心拉格朗日插值法

为了方便计算, 预处理一个 $n + 1$ 次多项式 $\ell$:

$$
\ell(x) = \prod_{i = 0}^n (x - x_i)
$$

这个多项式可以进行 $O(n)$ 次耗时 $O(n)$ 的 $O(n)$ 项式和二项式乘法得到, 总耗时 $O(n^2)$.

定义重心权 $w_i$:

$$
w_i = \frac 1{\displaystyle{\prod_{j = 0, j \neq i}^n (x_i - x_j)}}
$$

这样就可以得到:

$$
\begin{aligned}
\ell_i(x) &= \frac{\ell(x)w_i}{x - x_i}\\
L(x) &= \sum_{i = 0}^{n} \frac{\ell(x)w_iy_i}{x - x_i}\\
L(x) &= \ell(x) \sum_{i = 0}^{n} \frac{w_iy_i}{x - x_i}\\
\end{aligned}
$$

我们可以 $O(n)$ 地算出 $w_iy_i$, 然后 $O(n)$ 地算出 $\dfrac {\ell(x)}{x - x_i}$, 在除法过程中就可以直接统计 $\ell_i$ 堆 $L$ 的贡献. 所以在预处理之后, 计算 $L(x)$ 需要 $O(n^2)$ 的时间.

### 代码实现

[模板题](https://www.luogu.com.cn/problem/P4781)

代码还是很好理解的, 只需要把前面的式子用程序实现就可以了.

```cpp
const unsigned long long Mod(998244353);
unsigned long long Pnt[2005][2], La[2005], L[2005], Ans(0), m, Now(1);
unsigned n;
unsigned A, B, C, D, t;
unsigned Cnt(0);
inline unsigned long long Inv(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(998244351);
  while (y) { if (y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1; }
  return Rt;
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(0); i < n; ++i) Pnt[i][0] = RD(), Pnt[i][1] = RD();
  La[1] = 1, La[0] = Mod - Pnt[0][0];
  for (unsigned i(1); i < n; ++i) {
    for (unsigned j(i + 1); j; --j)
      La[j] = (La[j] * (Mod - Pnt[i][0]) + La[j - 1]) % Mod;
    La[0] = La[0] * (Mod - Pnt[i][0]) % Mod;
  }
  for (unsigned i(0); i < n; ++i) {
    unsigned long long Mul(1), Tmp(La[n]);
    for (unsigned j(0); j < n; ++j) if (j ^ i) Mul = Mul * (Mod + Pnt[i][0] - Pnt[j][0]) % Mod;
    Mul = Inv(Mul) * Pnt[i][1] % Mod;
    for (unsigned j(n - 1); ~j; --j) {
      L[j] = (L[j] + Mul * Tmp) % Mod;
      Tmp = (La[j] + Tmp * Pnt[i][0]) % Mod;
    }
  }
  for (unsigned i(0); i < n; ++i) {
    Ans = (Ans + L[i] * Now) % Mod;
    Now = Now * m % Mod;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

### 加点

如果我们需要对已经插值的 $n$ 个点加入一个点, 如果重新插值, 需要 $O(n^2)$ 的时间.

考虑插入一个点 $(x_{n + 1}, y_{n + 1})$ 对 $L(x)$ 的影响, 它会使插入后 $\ell'(x) = \ell(x)(x - x_{n + 1})$. 会使每个满足 $i \leq n$ 的 $w_i$ 都乘以 $\frac 1{x_i - x_{n + 1}}$. 还会使 $L(x)$ 加上 $\frac{\ell'(x)w_{n + 1}y_{n + 1}}{x - x_{n + 1}}$.

$$
L'(x) = \ell'(x) (\sum_{i = 0}^{n + 1} \frac{w_i'y_i}{x - x_i})
$$

我们用 $O(n)$ 处理出 $w_i'\ (i \leq n)$, 然后 $O(n)$ 直接算出 $w_{n + 1}'$. 我们可以在 $O(n)$ 的时间内做乘法得到 $\ell'(x)$. 维护了 $w$ 数组和多项式 $\ell(x)$ 就实现了对 $L(x)$ 的维护. 需要时 $O(n^2)$ 可以求出多项式 $L(x)$.

如果问题只需要维护多项式 $L(x)$ 的一个点值 $y$, 那么问题就更简单了, 我们可以直接维护 $\ell(x)$ 的点值, 这样就可以把多项式除法变成整数乘除, 实现直接维护 $y$ 并实现 $O(n)$ 插入.

### 第二型重心拉格朗日插值法

现在有另一组点, 每个点和我们要插值的点一一对应, 每一对点的横坐标相同, 而新给出的这些点纵坐标是 $1$. 我们对新点进行插值, 得到多项式 $g(x)$, 无论 $x$ 取什么值, $g(x) = 1$. 如果我们代入拉格朗日插值公式, 可以得到:

$$
g(x) = \ell(x) \sum_{i = 0}^{n} \frac{w_i}{x - x_i}
$$

因为任何数除以 $1$ 还是它本身, 所以 $L(x) = \dfrac{L(x)}{g(x)}$. 将 $L(x)$, $g(x)$ 都用拉格朗日插值公式表示, 则得到:

$$
\begin{aligned}
L(x) &= \frac{L(x)}{g(x)}\\
&= \frac {\ell(x) \displaystyle{\sum_{i = 0}^{n} \frac{w_iy_i}{x - x_i}}}{\ell(x) \displaystyle{\sum_{i = 0}^{n} \frac{w_i}{x - x_i}}}\\
&= \frac {\displaystyle{\sum_{i = 0}^{n} \frac{w_iy_i}{x - x_i}}}{\displaystyle{\sum_{i = 0}^{n} \frac{w_i}{x - x_i}}}\\
\end{aligned}
$$

我们可以只维护 $w$ 数组, 实现 $O(n)$ 求值, $O(n)$ 插入.

## 差商/均差 (Divided Diffrences)

对于点 $(x_i, y_i), (x_{i + 1}, y_{i + 1}),...,(x_{i + j}, y_{i + j})$, 用 $[y_]$

对于函数 $f(x)$, 用 $f[x_i, x_{i + 1},...,x_{i + j}]$ 表示函数的点 $(x_i, f(x_i)), (x_{i + 1}, f(x_{i + 1})),..., (x_{i + j}, f(x_{i + j}))$ 的均差.

均差的预算规则是这样的:

单点的均差就是这个点的纵坐标: $f[x_i] = f(x_i)$

多点均差有递归定义: $f[x_i, x_{i + 1},...,x_{i + j}] = \dfrac{f[x_{i + 1},...,x_{i + j}] - f[x_i,...,x_{i + j - 1}]}{x_{i + j} - x_{i}}$

均差有前向和后向之分, 一般只会用到前向均差, 后向均差是把元素顺序倒过来写, 计算上也有一部分需要翻转.

我们可以递推地在 $O(n^2)$ 的时间内求出 $n$ 个点的序列的每个子串的均差.

均差的展开形式是这样的:

$$
f[x_l, x_{l + 1},...,x_{r}] = \sum_{i = l}^{r} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r} x_i - x_j}}
$$

用归纳法证明, 单点的均差符合 $f[x_l] = \dfrac{f(x_l)}{1} = f(x_l)$. 假设大小小于 $r - l + 1$ 的点集都满足这个式子, 验证大小为 $r - l + 1$ 的点集是否满足.

$$
\begin{aligned}
f[x_l, x_{l + 1},...,x_{r}] &= \dfrac{f[x_{i + 1},...,x_{i + j}] - f[x_i,...,x_{i + j - 1}]}{x_{i + j} - x_{i}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r} x_i - x_j}} - \sum_{i = l}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r} x_i - x_j}} - \sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r - 1} x_i - x_j}} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l + 1}^{r - 1} x_r - x_j}} - \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r - 1} x_l - x_j}}}}{x_r - x_l}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r} x_i - x_j}} - \sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r} x_i - x_j}} - \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{\dfrac{f(x_i)}{x_i - x_r} - \dfrac{f(x_i)}{x_i - x_l}}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{\dfrac{f(x_i)((x_i - x_l) - (x_i - x_r))}{(x_i - x_r)(x_i - x_l)}}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \frac{\displaystyle{\sum_{i = l + 1}^{r - 1} \dfrac{\dfrac{f(x_i)(x_r - x_l)}{(x_i - x_r)(x_i - x_l)}}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r - 1} x_i - x_j}}}}{x_r - x_l} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \sum_{i = l + 1}^{r - 1} \dfrac{\dfrac{f(x_i)}{(x_i - x_r)(x_i - x_l)}}{\displaystyle{\prod_{j = l + 1, j \neq i}^{r - 1} x_i - x_j}} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \sum_{i = l + 1}^{r - 1} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r} x_i - x_j}} + \dfrac{f(x_r)}{\displaystyle{\prod_{j = l}^{r - 1} x_r - x_j}} + \dfrac{f(x_l)}{\displaystyle{\prod_{j = l + 1}^{r} x_l - x_j}}\\
f[x_l, x_{l + 1},...,x_{r}] &= \sum_{i = l}^{r} \dfrac{f(x_i)}{\displaystyle{\prod_{j = l, j \neq i}^{r} x_i - x_j}}\\
\end{aligned}
$$

展开式得证.

## 牛顿基本多项式

设多项式 $n_i(x)$ 满足在 $x_0, x_1,...,x_{j - 1}$ 处都取 $0$ 的多项式. 显然有:

$$
n_i(x) = \prod_{j = 0}^{i - 1} (x - x_j)
$$

## 牛顿多项式

我们只要给每个牛顿基本多项式加权求和, 就能构造一个 $n$ 次多项式, 过全部 $n + 1$ 个点. 这个总和便是牛顿多项式 $N(x)$.

假设给 $n_i(x)$ 加的权为 $a_i$, 写出定义式:

$$
\begin{aligned}
N(x) &= \sum_{i = 0}^{n} a_in_i(x)\\
&= \sum_{i = 0}^{n}a_i\prod_{j = 0}^{i - 1} (x - x_j)
\end{aligned}
$$

因为 $n + 1$ 个横坐标不同的点可以唯一地确定一个 $n$ 次多项式, 因此相同点集满足 $L(x) = N(x)$. 我们可以用拉格朗日插值公式来求 $a$. 已经求出已经插了 $(x_0, y_0),...,(x_{n - 1}, y_{n - 1})$ 的拉格朗日多项式 $L(x)$. 我们尝试给 $a_n$ 赋值, 使得 $L(x_n) + a_nn_n(x_n)$ 为 $y_n$.

$$
\begin{aligned}
y_n &= L(x_n) + a_nn_n(x_n)\\
y_n &= \sum_{i = 0}^{n - 1} y_i\prod_{j = 0, j \neq i}^{n - 1} \frac{x_n - x_j}{x_i - x_j} + a_n\prod_{i = 0}^{n - 1} (x_n - x_i)\\
a_n\prod_{i = 0}^{n - 1} (x_n - x_i) &= y_n - \sum_{i = 0}^{n - 1} y_i\prod_{j = 0, j \neq i}^{n - 1} \frac{x_n - x_j}{x_i - x_j}\\
a_n &= \dfrac{y_n}{\displaystyle{\prod_{i = 0}^{n - 1} (x_n - x_i)}} - \sum_{i = 0}^{n - 1} \frac{y_i}{x_n - x_i} \prod_{j = 0, j \neq i}^{n - 1} \frac 1{x_i - x_j}\\
a_n &= \dfrac{y_n}{\displaystyle{\prod_{i = 0}^{n - 1} (x_n - x_i)}} + \sum_{i = 0}^{n - 1} \frac{y_i}{x_i - x_n} \prod_{j = 0, j \neq i}^{n - 1} \frac 1{x_i - x_j}\\
a_n &= \dfrac{y_n}{\displaystyle{\prod_{i = 0}^{n - 1} (x_n - x_i)}} + \sum_{i = 0}^{n - 1} y_i \prod_{j = 0, j \neq i}^{n} \frac 1{x_i - x_j}\\
a_n &= \dfrac{y_n}{\displaystyle{\prod_{i = 0}^{n - 1} (x_n - x_i)}} + \sum_{i = 0}^{n - 1} \frac {y_i}{\displaystyle {\prod_{j = 0, j \neq i}^{n} x_i - x_j}}\\
a_n &= \sum_{i = 0}^{n} \frac {y_i}{\displaystyle {\prod_{j = 0, j \neq i}^{n} x_i - x_j}}\\
\end{aligned}
$$

我们发现 $a_n = \displaystyle{\sum_{i = 0}^{n} \frac {y_i}{\displaystyle {\prod_{j = 0, j \neq i}^{n} x_i - x_j}}} = [y_0, y_1,...,y_n]$.

所以牛顿多项式便是:

$$
\begin{aligned}
N(x) &= \sum_{i = 0}^{n} a_in_i(x)\\
&= \sum_{i = 0}^{n}a_i\prod_{j = 0}^{i - 1} (x - x_j)\\
&= \sum_{i = 0}^{n}[y_0, y_1,...,y_i]\prod_{j = 0}^{i - 1} (x - x_j)\\
&= \sum_{i = 0}^{n} \Big(\displaystyle{\sum_{j = 0}^{i} \frac {y_j}{\displaystyle {\prod_{k = 0, k \neq j}^{i} x_j - x_k}}\Big)}\prod_{j = 0}^{i - 1} (x - x_j)\\
\end{aligned}
$$

## 例题

有一个 $n$ 次以内的多项式 $f(x)$, 给 $n + 1$ 个点值, $f(0), f(1),..., f(n)$. 求 $f(m), f(m + 1),..., f(m + n)$.

这个题 $O(n^2)$ 无法通过, 而且由于询问也是 $n + 1$ 个点值, 所以插出系数来也无法用正确的复杂度询问. 发现横坐标很特殊, $x_i = i$, 询问也很特殊, 横坐标也是连续的. 我们需要求出所以先把横坐标往插值公式里面带. 首先化简 $\displaystyle{\prod_{j = 0, j \neq i}^{n} (i - j)}$.

$$
\begin{aligned}
\prod_{j = 0, j \neq i}^{n} (i - j) &= \Big(\prod_{j = 0}^{i - 1} (i - j)\Big)\Big(\prod_{j = i + 1}^n (i - j)\Big)\\
&= \Big(\prod_{j = 0}^{i - 1} (i - j)\Big)\Big(\prod_{j = i + 1}^n (j - i)\Big) (-1)^{n - i}\\
&= i!(n - i)!(-1)^{n - i}
\end{aligned}
$$

如果默认 $x$ 为自然数且 $x > n$, 还可以化简 $\displaystyle{\prod_{i = 0}^{n}} (x - i) = \dfrac {x!}{(x - n - 1)!}$.

$$
\begin{aligned}
L(x) &= \sum_{i = 0}^{n} \frac{x!f(i)}{(x - n - 1)!i!(n - i)!(-1)^{n - i}(x - i)}\\
&= \frac {x!}{(x - n - 1)!} \sum_{i = 0}^{n} \frac{f(i)}{i!(n - i)!(-1)^{n - i}(x - i)}\\
&= \frac {x!}{(x - n - 1)!} \sum_{i = 0}^{n}\frac {f(i)}{i!(n - i)!(-1)^{n - i}}\frac 1{x - i}\\
\end{aligned}
$$

我们可以 $O(n)$ 处理 $\dfrac{f(i)}{i!(n - i)!(-1)^{n - i}}$, 和对于所有 $x$ 的 $\dfrac{x!}{(x - n - 1)!}$. 注意 $x$ 较大, 无法直接计算 $x!$, 所以我们可以先把 $x - n$ 到 $x$ 的数字相乘, 得到 $\dfrac{x!}{(x - n - 1)!}$ 然后枚举 $x$ 来递推.

但是我们要想计算一个点值, 仍然需要 $O(n)$ 枚举 $i$.

定义序列 $A_i = \dfrac{f(i)}{i!(n - i)!(-1)^{n - i}}$, $B_i = \dfrac 1{m + i - n}$, $C_i = \displaystyle \sum_{j = 0}^{i} A_jB_{i - j}$, 三个序列长度为 $2(n + 1)$, $A_i = 0\ (i > n)$.

$$
L(x) = \frac{x!}{(x - n - 1)!}C_{x - m + n}
$$

我们用 $O(n\log n)$ 卷积算出 $C$, 然后就可以 $O(1)$ 查询点值.

```cpp
const unsigned long long Mod(998244353);
unsigned long long C1[160005], IFac[160005], MFac[160005], A[530000], B[530000];
unsigned long long Tmp(1), w;
unsigned m, n, N(1);
unsigned D, t;
unsigned Cnt(0), Ans(0);
inline void Mn(unsigned long long& x) { x -= ((x >= Mod) ? Mod : 0); }
inline unsigned long long W(unsigned x) {
  unsigned long long Now(3), Rt(1);
  while (x) { if (x & 1) Rt = Rt * Now % Mod;  Now = Now * Now % Mod, x >>= 1; }
  return Rt;
}
inline unsigned long long Inv(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(998244351);
  while (y) { if (y & 1) Rt = Rt * x % Mod;y >>= 1, x = x * x % Mod; }
  return Rt;
}
inline void DIT(unsigned long long* f) {
  unsigned long long Now(1), Tmpw[20];
  unsigned Lg(0);
  Tmpw[0] = w;
  for (unsigned i(1); i < N; i <<= 1, ++Lg) Tmpw[Lg + 1] = Tmpw[Lg] * Tmpw[Lg] % Mod; --Lg;
  for (unsigned i(1); i < N; i <<= 1, --Lg) {
    for (unsigned j(0); j < N; ++j, Now = Now * Tmpw[Lg] % Mod) if (!(i & j)) {
      unsigned long long TmpA(f[j]), TmpB(f[j ^ i] * Now % Mod);
      f[j] = TmpA + TmpB, Mn(f[j]);
      f[j ^ i] = Mod + TmpA - TmpB, Mn(f[j ^ i]);
    }
  }
}
inline void DIF(unsigned long long* f) {
  unsigned long long Now(1);
  for (unsigned i(N >> 1); i; i >>= 1, w = w * w % Mod) {
    for (unsigned j(0); j < N; ++j, Now = Now * w % Mod) if (!(i & j)) {
      unsigned long long TmpA(f[j]), TmpB(f[j ^ i]);
      f[j] = TmpA + TmpB, Mn(f[j]);
      f[j ^ i] = (Mod + TmpA - TmpB) * Now % Mod;
    }
  }
}
signed main() {
  n = RD(), m = RD();
  while (N <= n) { N <<= 1; } N <<= 1;
  for (unsigned i(0); i <= n; ++i) A[i] = RD();
  for (unsigned i(1); i <= n; ++i) Tmp = Tmp * i % Mod;
  IFac[n] = Inv(Tmp);
  for (unsigned i(n - 1); ~i; --i) IFac[i] = IFac[i + 1] * (i + 1) % Mod;
  for (unsigned i(0); i <= n; ++i)
    A[i] = ((((n - i) & 1) ? (Mod - A[i]) : A[i]) * IFac[n - i] % Mod) * IFac[i] % Mod;
  C1[0] = 1;
  for (unsigned i(m - n); i <= m; ++i) C1[0] = C1[0] * i % Mod;
  for (unsigned i(1); i <= n; ++i) C1[i] = (C1[i - 1] * Inv(m - n + i - 1) % Mod) * (m + i) % Mod;
  for (unsigned i(n << 1); ~i; --i) B[i] = Inv(m + i - n);
  w = W(998244352 / N), DIF(A), w = W(998244352 / N), DIF(B);
  for (unsigned i(0); i < N; ++i) A[i] = A[i] * B[i] % Mod;
  w = Inv(W(998244352 / N)), DIT(A), w = Inv(N), N = (n << 1);
  for (unsigned i(n); i <= N; ++i) printf("%llu ", (C1[i - n] * A[i] % Mod) * w % Mod); putchar(0x0A);
  return Wild_Donkey;
}
```
