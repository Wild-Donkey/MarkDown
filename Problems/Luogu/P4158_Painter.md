# [粉刷匠](https://www.luogu.com.cn/problem/P4158)

## 题意

这道题要求将 $n$ 块长 $m$ 的木板染色, 每次将一块木板的一个连续区域染成蓝色或红色, 最多染 $t$ 次, 给出每个位置的目标颜色, 求染色后最多有多少位置符合目标颜色.

$n, m \leq 50, t \leq 2500$

## 分析

首先看到这道题每块木板之间没有联系, 只是共用 $t$ 的染色次数, 所以一定是将每块木板处理出的信息进行 DP.

既然木板之间唯一的联系是共用总染色次数, 那么就关于染色次数 DP, 假设我们求出了每个木板 $i$ 染 $k$ 次的符合要求的最多位置数 $g_{i, k}$, 设计状态 $f_{i, j}$ 表示前 $i$ 块板染 $j$ 次符合要求的最多位置数. 转移很简单, 只要枚举当前木板染几次即可. 边界条件是第一块木板, $f_{1, j} = g_{1, j}$

$$
f_{i, j} = \max(f_{i - 1, j - k} + g_{i, k})
$$

容易发现, $i$ 和 $n$ 同阶, $j$ 和 $nm$ 同阶, $k$ 和 $m$ 同阶, 状态 $O(n^2m)$, 转移 $O(m)$, 总复杂度 $O(n^2m^2)$.

## 求 $g_{i, j}$

先思考一个上界, 使得无论目标如何, 都可以在这个上界之内的次数染成目标状态.

极限数据是红蓝一格一格交替, 这时可以从左到右每次染一格, 需要 $m$ 次.

发现这个东西也可以 DP, 如果某种决策中这个位置和上一个位置颜色相同, 就不会增加次数, 如果不同, 就会增加一个次数, 这时, 就可以设计状态 $dp_{i, j, 0/1}$ 表示当前木板前 $i$ 个位置染色 $j$ 次, 第 $i$ 个位置是蓝或红的情况的最多合法位置数量, 写出方程.

$$
dp_{i, j, k} = \max(dp_{i - 1, j, k}, dp_{i - 1, j - 1, k \land 1}) + if(第 i 个位置目标是 k)
$$

$i$, $j$ 和 $m$ 同阶, $k$ 是 $O(1)$, 状态 $O(m^2)$, 转移 $O(1)$, 复杂度 $O(m^2)$, 对于所有 $n$ 块木板的总复杂度 $O(nm^2)$, 加上 $f$ DP 的 $O(n^2m^2)$ 一共 $O(n^2m^2)$.

于是 $g_{i, j} = \max(dp_{m, j, 0}, dp_{m, j, 1})$.

## 实现

发现可以滚动数组, 将 $f$ 和 $g$ 滚到 $1$ 维.

没有玄学优化的 DP 还是很好写的.

```cpp
unsigned m, n, t, Ans(0), f[2505], dp[55][55][2];
char Inch, a[55];
int main() {
  srand(time(0));
  n = RD(), m = RD(), t = RD();
  for (register unsigned i(1); i <= n; ++i) {
    while ((Inch ^ '0') && (Inch ^ '1')) Inch = getchar();
    for (register unsigned j(1); j <= m; ++j) {
      a[j] = Inch - '0', Inch = getchar();
    }
    for (register unsigned j(1); j <= m; ++j) {
      for (register unsigned k(1); k <= m; ++k) {
        dp[j][k][a[j]] = max(dp[j - 1][k][a[j]], dp[j - 1][k - 1][a[j] ^ 1]) + 1;
        dp[j][k][a[j] ^ 1] = max(dp[j - 1][k][a[j] ^ 1], dp[j - 1][k - 1][a[j]]);
      }
    }
    for (register unsigned j(min(t, m * i)); j < 0x3f3f3f3f; --j) {
      for (register unsigned k(1); k <= min(m, j); ++k) {
        f[j] = max(f[j], f[j - k] + max(dp[m][k][0], dp[m][k][1]));
      }
    }
  }
  if(t >= n * m) Ans = n * m;
  else Ans = f[t];
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

另外, 这貌似是 luogu 上本题最优解, 好久没有最优解了, 开心.