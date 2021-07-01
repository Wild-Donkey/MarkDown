# [NOI-Online 2020 跑步](https://www.luogu.com.cn/problemnew/show/P6189)

## 题意

求整数可重复划分方案数, $n \leq 10^5$.

## $50'$

状态 $f_{i, j}$ 的表示数字 $i$ 的划分中, 最大的数是 $j$ 的方案数.

如 `5 5 2 1` 就是一个包括在 $f_{13, 5}$ 中的一个划分方案.

$$
f_{i, j} = \sum_{k = 1}^{k \leq j} f_{i - j, k}
$$

每个状态 $f_{i, j}$ 由所有 $f_{i - j, k},~k \in [1, j]$ 的总和组成. 可以理解成在 $f_{i - j, k}$ 的每一个划分方案中加上一个元素 $j$ 得到一个对应的 $i$ 的划分.

$O(n^2)$ 的状态, $O(n)$ 的转移, 复杂度 $O(n ^ 3)$.

```cpp
for (register unsigned i(1); i <= n; ++i) {
  f[i][i] = 1;
}
for (register unsigned i(2); i <= n; ++i) {
  for (register unsigned j(1); j < i; ++j) {
    for (register unsigned k(1); k <= j; ++k) {
      f[i][j] += f[i - j][k];
      if(f[i][j] >= p) f[i][j] -= p;
    }
  }
}
for (register unsigned i(1); i <= n; ++i) {
  Ans += f[n][i];
  if(Ans >= p) Ans -= p;
}
```

## $70'$

改变状态的定义, $f_{i, j}$ 表示所有元素小于等于 $j$ 的 $i$ 的方案数, 也就是 $50'$ 状态的前缀和.

$$
f_{i, j} = f_{i, j - 1} + f_{i - j, j}
$$

这时转移可以理解为, $f_{i, j - 1}$ 表示的单个元素小于等于 $j - 1$, 组成 $i$ 的方案中, 其元素一定小于 $j$, 所以也应该统计入 $f_{i, j}$ 中.

而 $f_{i - j, j}$ 则是将元素在 $j$ 以内的 $i - j$ 的划分中, 加入一个元素 $j$ 得到的方案.

这样可以把转移优化到 $O(1)$, 状态仍是 $O(n^2)$, 时间复杂度 $O(n^2)$.

```cpp
f[1][1] = 1;
for (register unsigned i(1); i <= n; ++i) {
  f[0][i] = 1;
}
for (register unsigned i(1); i <= n; ++i) {
  for (register unsigned j(1); j <= i; ++j) {
    f[i][j] = f[i][j - 1] + f[i - j][j];
    if(f[i][j] >= p) f[i][j] -= p;
  }
  for (register unsigned j(i + 1); j <= n; ++j) {
    f[i][j] = f[i][j - 1];
  }
  if(f[i][i] >= p) f[i][i] -= p;
}
printf("%u\n", f[n][n]);
```

## $80'$

发现对于第二维只会用到 $j$ 和 $j - 1$ 可以滚动数组, 只保留第一维, 对整个数组进行 $O(n)$ 次转移.

$(本次)f_i = (上次)f_i + (本次)f_{i - j}$

状态 $O(n^2)$, 空间复杂度 $O(n)$, 转移 $O(1)$, 时间复杂度 $O(n^2)$.

之所以能多得 $10'$, 是因为时空复杂度同阶的时候, 往往空间更容易炸, 于是优化了空间.

```cpp
f[0] = 1;
for (register unsigned j(1); j <= n; ++j) {
  for (register unsigned i(j); i <= n; ++i) {
    f[i] += f[i - j];
    if(f[i] >= p) f[i] -= p;
  }
}
printf("%u\n", f[n]);
```

## $100'$

根号分治, 设 $Sq = \sqrt n$, 先将所有 $j \leq Sq$ 的 $f_i$ 求出来, 这时的 $f_i$ 表示单个元素不超过 $j$ 的 $i$ 的划分方案数. (除了 $j$ 的上界以外和 $80'$ 完全相同)

```cpp
n = RD(), p = RD(), Sq = sqrt(n) + 1;
f[0] = 1;
for (register unsigned j(1); j <= Sq; ++j) {
  for (register unsigned i(j); i <= n; ++i) {
    f[i] += f[i - j];
    if(f[i] >= p) f[i] -= p;
  }
}
```

然后再定义一个数组 $g_{i, j}$, 表示包含 $i$ 个非 $0$ 元素的 $j$ 的划分, 其中, $i \leq Sq$.

$$
g_{i, j} = g_{i - 1, j - 1} + g_{i, j - i}
$$

转移也很简单 $g_{i - 1, j - 1}$ 是 $i - 1$ 个元素的 $j - 1$ 的划分, 所有这种划分加上一个元素 $1$ 就是一个 $i$ 个元素, $j$ 的划分. $g_{i, j - 1}$ 是 $i$ 个元素, $j - i$ 的划分, 给这种划分的每个元素加 $1$, 得到的就是一个最小元素大于 $1$ 的 $i$ 个元素的 $j$ 的划分. 这两种情况互不重复, 因为前者最小元素是 $1$, 后者最小元素大于 $1$. 也不会遗漏, 因为任何可行的划分都是可以由 $1$ 的划分和这两种转移转移而来的.

```cpp
g[0][0] = 1;
for (register unsigned i(1); i <= Sq; ++i) {
  for (register unsigned j(i); j <= n; ++j) {
    g[i][j] = g[i - 1][j - 1] + g[i][j - i];
    if(g[i][j] >= p) g[i][j] -= p;
  }
}
```

然后统计答案.

我们把一个划分中的元素分成两类: $\leq Sq$ 和 $> Sq$.

枚举 $i$ 作为 $> Sq$ 的元素个数, 因此 $(Sq + 1)i \leq n$, $i = O(\sqrt n)$. 

枚举 $j$ 作为 $> Sq$ 的元素总和, 因此 $j \in [(Sq + 1)i, n]$.

对于每一个 $i$, $j$ 作为约束, 求合法 $n$ 的划分方案数.

分别讨论两种元素, 首先是 $\leq Sq$ 的元素, 它们的总和应该是 $n - j$, 前面求出了 $f$ 数组, 因此元素不大于 $Sq$ 的 $n - j$ 的划分就是 $f_{n - j}$.

接下来是 $> Sq$ 的元素, 因为每个元素都大于 $Sq$, 所以我们可以只考虑它们比 $Sq$ 多出来的部分. 所以相当于求包含 $i$ 个元素的 $j - Sq \times i$ 的划分, 也就是 $g_{i, j - Sq \times j}$.

因为两种元素对 $j$ 和 $n - j$ 的划分中, 不同种类的元素大小一定不同, 所以互不干扰, 使用乘法原理统计答案即可:

$$
Ans = \sum_{i = 0}^{(Sq + 1)i \leq n} \Bigg( \sum_{j = (Sq + 1)i}^{j \leq n}\bigg(f_{n - j} \times g_{i, j - Sq \times i} \bigg) \Bigg)
$$

```cpp
for (register unsigned i(0); i * (Sq + 1) <= n; ++i) {
  for (register unsigned j(i * (Sq + 1)); j <= n; ++j) {
    Ans = ((unsigned long long)g[i][j - Sq * i] * f[n - j] + Ans) % p;
  }
}
```

对于 $f$, 状态数 $O(n\sqrt n)$, 转移 $O(1)$, 时间复杂度 $O(n\sqrt n)$.

对于 $g$, 状态数 $O(n\sqrt n)$, 转移 $O(1)$, 时间复杂度 $O(n\sqrt n)$.

对于 $Ans$, 时间复杂度 $O(n\sqrt n)$.

总复杂度 $O(n \sqrt n)$.