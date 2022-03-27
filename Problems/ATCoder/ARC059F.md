# ARC059F Unhappy Hacking

看到这里的题解都是二维 DP，我是从卡特兰数的方面考虑的此题。

如果这个题的模数换成 $998244343$ 或是别的 NTT 模数，那么复杂度就可以通过分治 FFT 做到 $O(n\log^2 n)$。可惜换不得。但是貌似存在某神奇的多项式科技任意模数 NTT，那么理论上还是可以 $O(n\log^2 n)$ 的。

但是本题解只对 $O(n^2)$ 的做法进行实现。

[AtCoder 传送门](https://atcoder.jp/contests/arc059/tasks/arc059_d)

前置知识: 可以在[这里](https://www.luogu.com.cn/blog/Wild-Donkey/zroi-day11-day20-bi-ji) Day19 的 C 题笔记中找到卡特兰数的推导和变形，也可以查看 [Wiki](https://zh.wikipedia.org/zh-hans/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B0)。

## 简要题意

给一个 0/1 串 $S$，每次可以选择在末尾插入一个 `0` 或 `1`，或删除最后一个字符。求进行 $n$ 次操作之后得到 $S$ 的方案数。

## 无效退格

注意到一个比较头疼的事情是在没有字符的时候按退格，这样的退格不会删除任何东西，且一旦出现无效退格，一定不存在任何字符。(废话) 所以可以认为是一个新的子问题。

设操作 $i$ 次，操作 $i$ 是无效退格的方案数为 $f_i$。

为了求这个 $f$，我们需要计算从 $0$ 个字符开始，不断进行操作，但是禁止无效退格。进行 $2i$ 次操作的方案数为 $g_i$。这样会打出 $i$ 个字符，并且这 $i$ 个字符会被 $i$ 个有效退格删掉。这个问题等价于将 `0` 和 `1` 压入栈并且弹出。可以看出 $g_i$ 等于卡特兰数第 $i$ 项乘 $2^i$。$2^i$ 枚举了每个插入的字符是 `0` 还是 `1`，卡特兰数第 $1$ 项枚举了每个退格的时刻。

求出了 $g$，我们枚举倒数第二次无效空格的时刻 $i - 1 - 2j$，则 $f_i$ 可以表示为:

$$
f_i = \sum_{j = 0}^{\lfloor \frac {i - 1}2 \rfloor} f_{i - 1 - 2j}g_j
$$

这是卷积的形式，我们可以使得 $g'_{2i + 1} = g_i$，然后让 $g'$ 其余项为 $0$，那么式子就变成:

$$
f_i = \sum_{j = 1}^{i} f_{i - j}g'_{j}
$$

可以用分治 FFT 优化到 $O(n\log^2 n)$，所以这个题理论上是可以 $O(n \log^2 n)$ 的。有需要的人可以拿去出个加强版，把模数换成 $998244353$ 然后把 $n$ 开到 $10^5$ 什么的。

我们枚举最后一个无效退格的时刻 $x$。那么相当于是在禁止无效退格的情况下用 $n - x$ 次操作得到目标串。所以我们枚举 $x$，对不同的 $x$ 算 $n - x$ 答案即可。

## 退格有效的情况

接下来考虑禁止无效退格，用 $x$ 次操作凑出目标串的方案数。

设 $S$ 的长度为 $m$，那么我们知道会有 $\dfrac{x + m}2$ 次插入操作，剩下的是删除操作。所以需要 $x$，$m$ 奇偶性相同。否则方案数为 $0$。

我们先不管 $x$ 次操作后的串是什么，求出只存在 `0` 的情况下，$x$ 次操作后留下 $m$ 个 `0` 的方案数。显然是卡特兰数的变形，也就是 $\dbinom x{\frac {x + m}2} - \dbinom x{\frac {x + m}2 + 1}$。

最后我们考虑既有 `0` 也有 `1` 的情况。对于被删除了的 $\dfrac {x - m}{2}$ 次插入，我们允许它们是任何数字，剩下的 $m$ 个未被删除的插入，它们必须是目标位置的数字。因此只要在原来只有 `0` 的方案数的基础上乘以 $2^{\frac{x - m}2}$ 即可。

## 代码实现

这里没有对分治 FFT 进行任意模数 NTT 的实现。只写了暴力卷积:

```cpp
const unsigned long long Mod(1000000007);
unsigned long long Fac[5005], Inv[5005], Two[5005], g[5005], f[5005], Ans(0);
unsigned m, n;
inline unsigned long long Inver(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(1000000005);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1;}
  return Rt;
}
inline unsigned long long Solve(unsigned x) {
  unsigned Typ((x + m) >> 1);
  unsigned long long A(Two[Typ - m]), B(Inv[Typ] * Inv[x - Typ] % Mod);
  A = A * Fac[x] % Mod;
  B = B * A % Mod, Typ = x - Typ;
  if(Typ) --Typ, A = A * Inv[Typ] % Mod, A = A * Inv[x - Typ] % Mod;
  else A = 0;
  return Mod + B - A;
}
signed main() {
  n = RD(), f[0] = g[0] = Fac[0] = Two[0] = 1;
  while (getchar() >= '0') ++m;
  for (unsigned i(1); i <= n; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[n] = Inver(Fac[n]);
  for (unsigned i(n); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  for (unsigned i(1); i <= n; ++i) Two[i] = (Two[i - 1] << 1), Two[i] -= (Two[i] >= Mod) ? Mod : 0;
  for (unsigned i(n >> 1); i; --i)
    g[i] = (((Fac[i << 1] * Inv[i + 1] % Mod) * Inv[i] % Mod) * Two[i]) % Mod;
  for (unsigned i(1); i <= n; ++i) for (unsigned j((i - 1) >> 1); ~j; --j)
    f[i] = (f[i] + f[i - 1 - (j << 1)] * g[j]) % Mod;
  for (unsigned i(n - m); ~i; --i) if(!(((n - i) ^ m) & 1))
    Ans = (Ans + f[i] * Solve(n - i)) % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```