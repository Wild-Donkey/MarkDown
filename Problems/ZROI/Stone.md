# 合并石子 (初探二项式反演)

排序不亏, 将 $a$ 和 $b$ 从小到大排序.

枚举第 $k$ 大值 $x$, 将方案数乘上 $x$ 求和, 最后乘上 $n!$ 的逆元.

对于每个 $x$ 设 $f_{i, j}$ 表示后 $i$ 个 $a$, 选择了 $j$ 个和 $b$ 配对, 这 $j$ 对的和都 $\leq x$ 的方案数.

设有 $Pos_i$ 个 $b$ 满足 $\leq i$.

则写出 $f$ 的方程:

$$
f_{i, j} = f_{i - 1, j} + f_{i - 1, j - 1} * (Pos_{x - a_{n - i + 1}} - j + 1)
$$

因为我们只需要 $f_{n, i}$, 所以对于二维数组, 用形如 $f_i$ 表示 $f_{n, i}$.

$f_i$ 的方案中, 有 $n - i$ 个 $a$ 还没有配对. 所以 $((n - i)!)f_i$, 相当于将没有配对的 $n - i$ 个 $a$ 随意配对, 记为 $g_i$.

$$
g_i = ((n - i)!)f_i
$$

因为已经有 $i$ 对 $\leq x$, 剩下 $n - i$ 对不知道是否 $\leq x$, 所以 $g_i$ 表示的方案中, 至少有 $i$ 对 $\leq x$.

但是这时对于实际有 $p$ 个对 $\leq x$ 的方案, $p$ 对中有 $i$ 对是一开始强制 $\leq x$ 的, 所以这个方案的 $p$ 对 $\leq x$ 的元素, 任何一个大小为 $i$ 的子集都会使它在 $g_i$ 中会被统计 $1$ 次. 所以这个方案一共被统计了 $\binom{p}{j}$ 次.

设 $h_i$ 表示恰好 $i$ 对 $\leq x$ 的方案数.

根据定义容易写出式子:

$$
g_i = \sum_{j = i}^n h_j\binom{j}{i}
$$

符合二项式反演公式, 所以可以求 $h$:

$$
h_j = \sum_{i = j}^{n} (-1)^{i - j}\binom{i}{j}g_{i}
$$

接下来考虑求 $x$ 为第 $k$ 大的数的情况数.

$\displaystyle{\sum_{j = i}^{n} h_j}$ 表示至少有 $i$ 对 $\leq x$ 的方案数.

将 $h_i$ 中的方案分成两种情况, 第 $k$ 大的是 $x$ 和第 $k$ 大的 $< x$.

前一种情况需要统计, 后一种需要舍弃.

因为 $x$ 为第 $k$ 大的方案中, 一定至少有 $n - k + 1$ 对 $\leq x$, 所以 $\displaystyle{\sum_{j = n - k + 1}^{n} h_j}$ 一定包含了所有要统计的情况.

接下来考虑如何去掉剩下的情况.

记 $x - 1$ 那一轮的 $h$ 数组为 $h'$.

发现 $\displaystyle{\sum_{j = i}^{n} h'_j}$ 里统计的所有情况, 都会被 $\displaystyle{\sum_{j = i}^{n} h_j}$ 包含, 因为至少 $i$ 对 $< x$ 的方案中, $\leq x$ 的对数肯定不会更少, 也就是说所有这些方案中 $\leq x$ 的对数不会少于 $i$, 都会被 $\displaystyle{\sum_{j = i}^{n} h_j}$ 统计.

而 $\displaystyle{\sum_{j = n - k + 1}^{n} h'_j}$ 的第 $k$ 大的数一定 $< x$, 所以这些方案都应该被舍弃.

而所有应该被舍弃的方案中, 都有至少 $n - k + 1$ 对 $< x$, 所以 $\displaystyle{\sum_{j = n - k + 1}^{n} h'_j}$ 包含了所有需要被舍弃的方案.

因此, $x$ 为第 $k$ 大的数的所有情况应该是

$$
\sum_{i = n - k + 1}^{n} h_i - \sum_{i = n - k + 1}^{n} h'_i\\
= \sum_{i = n - k + 1}^{n} (h_i - h'_i)
$$

```cpp
const unsigned long long Mod(1000000007);
unsigned long long Fac[405], Inv[405], Pow, Poi(Mod - 2);
unsigned long long Cnt(0), Ans(0);
unsigned long long C[405][405];// Binom
unsigned long long DP[405]; // chosed i pairs to <= x 
unsigned long long f[405];  // x = x - 1, h
unsigned long long g[405];  // at least i pairs <= x
unsigned long long h[405];  // i pairs  <= x
unsigned a[405], b[405], Pos[805], m, n;
unsigned MA(0), MB(0), A, B;
char Flg (0);
signed main() {
  n = RD(), m = RD(), Inv[n] = Fac[0] = 1;
  for (unsigned i(1); i <= n; ++i) MA = max(a[i] = RD(), MA);
  for (unsigned i(1); i <= n; ++i) MB = max(b[i] = RD(), MB);
  sort(a + 1, a + n + 1);
  sort(b + 1, b + n + 1);
  MA += MB;
  for (unsigned i(1); i <= n; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Pow = Fac[n]; while (Poi) {if(Poi & 1) Inv[n] = Inv[n] * Pow % Mod; Poi >>= 1, Pow = Pow * Pow % Mod;}
  for (unsigned i(n - 1); ~i; --i) Inv[i] = Inv[i + 1] * (i + 1) % Mod;
  b[n + 1] = 0x3f3f3f3f;
  for (unsigned i(1), j(1); i <= n; ++i)
    while (j < b[i]) Pos[j++] = i - 1;
  for (unsigned i(MA); !(Pos[i]); --i) Pos[i] = n;
  for (unsigned i(1); i <= n; ++i) {
    C[i][0] = C[i][i] = 1;
    for (unsigned j(1); j < i; ++j){
      C[i][j] = C[i - 1][j] + C[i - 1][j - 1];
      if(C[i][j] >= Mod) C[i][j] -= Mod;
    }
  }
  m = n - m + 1;
  for (unsigned x(1); x <= MA; ++x) {
    memset(DP, 0, sizeof(DP));
    memcpy(f, h, sizeof(h));
    Cnt = 0, DP[0] = 1;
    for (unsigned i(1); i <= n; ++i)
      for (unsigned j(i); j; --j)
        if((x > a[n - i + 1]) && (Pos[x - a[n - i + 1]] >= j))
          DP[j] = (DP[j] + DP[j - 1] * (Pos[x - a[n - i + 1]] - j + 1)) % Mod;
    for (unsigned i(1); i <= n; ++i) g[i] = DP[i] * Fac[n - i] % Mod;
    memset(h, 0, sizeof(h));
    for (unsigned i(1); i <= n; ++i)
      for (unsigned j(i); j <= n; ++j)
        if((j + i) & 1) {h[i] = (h[i] + Mod - ((C[j][i] * g[j]) % Mod)); if(h[i] >= Mod) h[i] -= Mod;}
        else h[i] = (h[i] + C[j][i] * g[j]) % Mod;
    for (unsigned i(m); i <= n; ++i) {
      Cnt += Mod + h[i] - f[i];
      while(Cnt >= Mod) Cnt -= Mod;
    }
    Ans = (Ans + Cnt * x) % Mod;
  }
  Ans = Ans * Inv[n] % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## 证明

二项式反演中最常用的式子, 以下两式可互推:

$$
\begin{aligned}
f_i &= \sum_{j = i}^n \binom{j}{i} g_j\\
g_i &= \sum_{j = i}^n (-1)^{j - i} \binom{j}{i} f_j
\end{aligned}
$$

其中, $f_i$ 一般表示用 DP 求出的, 在 $n$ 个元素中, 至少 $i$ 个元素满足某条件的方案数, 但是因为计算过程会将实际有 $p$ 个元素满足条件的方案计算 $\binom{p}{i}$ 次.

而 $g_i$ 则表示恰有 $i$ 个元素满足某条件, 没有重复统计的方案数.

所以一般我们需要做的就是通过上边的式子, 得到下面的式子, 用来给 $f_i$ 去重.

接下来假设已知上边的式子成立, 证明下面的式子.

根据上式, 知道 $g_i$ 的方案会在 $f_j$ 中统计 $\binom{i}{j}$ 次 ($j \leq i$), 所以代入原式:

$$
\begin{aligned}
g_i &= \sum_{j = i}^n (-1)^{j - i} \binom{j}{i} (\sum_{k = j}^n \binom{k}{j} g_k)\\
g_i &= \sum_{j = i}^n (-1)^{j - i} \frac{j!}{i!(j - i)!} (\sum_{k = j}^n \frac{k!}{j!(k - j)!} g_k)\\
g_i &= \frac{1}{i!} \sum_{j = i}^n (-1)^{j - i} \frac{1}{(j - i)!} (\sum_{k = j}^n \frac{k!}{(k - j)!} g_k)
\end{aligned}
$$

将 $k$ 放到外层循环.

$$
g_i = \frac{1}{i!} \sum_{k = i}^n g_kk! \sum_{j = i}^k \frac{(-1)^{j - i}}{(j - i)!(k - j)!}
$$

当 $k - i$ 是奇数的时候

$$
\begin{aligned}
&\sum_{j = i}^k \frac{(-1)^{j - i}}{(j - i)!(k - j)!}\\
=& \sum_{j = 0}^{\frac{k - i - 1}{2}} \frac{(-1)^{j}}{j!(k - i - j)!} + \frac{(-1)^{k - j - i}}{(k - j - i)!j!}\\
=& \sum_{j = 0}^{\frac{k - i - 1}{2}} (-1)^j (\frac{1}{j!(k - i - j)!} + \frac{(-1)^{k - 2j - i}}{(k - j - i)!j!})\\
=& \sum_{j = 0}^{\frac{k - i - 1}{2}} \frac{(-1)^j(1 + (-1)^{k - 2j - i})}{j!(k - i - j)!}\\
=& \sum_{j = 0}^{\frac{k - i - 1}{2}} \frac{(-1)^j(1 + (-1)^{k - i})}{j!(k - i - j)!}\\
=& \sum_{j = 0}^{\frac{k - i - 1}{2}} \frac{(-1)^j(1 - 1)}{j!(k - i - j)!}\\
=& 0
\end{aligned} 
$$

所以, 满足 $k - i$ 是奇数的 $g_k$ 不会被统计到 $g_i$ 中.

如果 $k - i$ 是偶数.

$$
\begin{aligned}
&\sum_{j = i}^k \frac{(-1)^{j - i}}{(j - i)!(k - j)!}\\
=& \frac{(-1)^{\frac{k - i}{2}}}{(\frac{k - i}{2})!(k - \frac{k + i}{2})!} + \sum_{j = 0}^{\frac{k - i}{2} - 1} \frac{2(-1)^j}{j!(k - i - j)!}\\
=& \frac{(-1)^{\frac{k - i}{2}}}{((\frac{k - i}{2})!)^2} + \sum_{j = 0}^{\frac{k - i}{2} - 1} \frac{2(-1)^j}{j!(k - i - j)!}\\
=& \frac{(-1)^{\frac{k - i}{2}}}{((\frac{k - i}{2})!)^2} + 2\sum_{j = 0}^{\frac{k - i}{2} - 1} \frac{(-1)^j}{j!(k - i - j)!}\\
\end{aligned} 
$$

草化不动了, 打表发现这个式子在 $k - i \geq 2$ 的时候都是 $0$, 综上, 所有 $k > i$ 的 $g_k$ 都不会统计到 $g_i$ 中.

对于 $g_i$, 有:

$$
\frac{1}{i!} g_ii! \frac{(-1)^{0}}{1} = g_i
$$

所以最后只剩一个 $g_i$, 等式两边相等, 定理得证.
