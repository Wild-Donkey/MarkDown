# ARC068F Solitaire

这个做法一开始的转化和别的题解是一样的。但是 DP 比较特别，属于是把 $O(n^4)$ 的 DP 强行二维前缀和优化到 $O(n^2)$。

## 性质与转化

容易知道双端队列是单谷的。

首先先考虑一种名为双重递减排列的东西，这种排列可以被分成两个递减的子序列。这个约束相当于序列的 LIS 长度不超过 $2$。

容易发现这种序列一定是合法的删除序列，我们只要把两个递减的子序列一个正向一个反向组成一个单谷的序列作为双端队列，然后按照我们想要的顺序取就可以得到目标序列。

我们还发现，当 $1$ 取出之后，队列中如果还剩 $x$ 个元素，那么它们一定属于同一个递减子序列，这是因为 $1$ 一定是其中某个子序列的最后一个元素。这时我们有 $2^{x - 1}$ 种取法，也就是说无论先取小的还是先取大的都是合法的序列。因此对于一个双重递减排列，在 $1$ 后面有 $x$ 个元素，那么它就对应着 $2^{x - 1}$ 种合法的删除序列。特别地，当 $x = 0$ 时，这个序列对应 $1$ 个合法删除序列。

本题要求 $1$ 在第 $K$ 次取出，所以我们只要求 $1$ 在第 $K$ 位的双重递减排列的数量，最后乘 $2^{max(0, n - K - 1)}$ 即可。

对于一个排列，它 LIS 的长度应该等于它逆排列的 LIS 长度，因此我们不妨把问题转化为求 $K$ 在第 $1$ 位的双重递减排列的数量。

接下来考虑 DP 求出这种排列数量。

## 动态规划

设 $f_{i, j}$ 表示长度为 $i$，其中 $j$ 在位置 $1$ 的双重递减排列的数量。

边界情况: $1$ 在第 $1$ 个位置，这时第一个递减子序列只能是 $1$ 本身，另一个递减子序列为其它 $i - 1$ 个数，所以 $f_{i, 1} = 1$。

接下来考虑一般情况，我们假设第 $1$ 个位置是 $j$，那么 $j$ 一定是第一个下降子序列的首个元素。因此大于 $j$ 的元素都是另一个下降子序列的元素。

假设最靠前的小于 $j$ 的元素 $a$ 在位置 $n - k + 1$，那么 $(1, n - k]$ 区间内的 $n - k - 1$ 个数一定是 $(k + 1, n]$ 的连续递减的数。

因此后 $k$ 位包含了 $[1, k]$ 的数，所以我们把后 $k$ 位看成一个新的子问题。也就是求第 $1$ 位为 $a$，长度为 $k$ 的双重递减排列的数量。

$k$ 的范围是 $[j - 1, i)$，因为有 $j - 1$ 个比 $j$ 小的数，且 $a$ 最早出现在第二位。我们枚举 $k$ 和 $a = l$ 进行转移。状态 $O(nm)$，转移 $O(nm)$，总复杂度 $O(n^2m^2)$，因为 $n$，$m$ 同阶，所以认为复杂度为 $O(n^4)$。

$$
f_{i, j} = \sum_{k = j - 1}^{i - 1} \sum_{l = 1}^{j - 1} f_{k, l}
$$

```cpp
for (unsigned i(1); i <= n; ++i) {
  f[i][1] = 1;
  for (unsigned j(min(m, i)); j > 1; --j) {
    for (unsigned k(j - 1); k < i; ++k) {
      for (unsigned l(1); l < j; ++l) {
        f[i][j] += f[k][l], Mn(f[i][j]);
      }
    }
  }
}
```

$O(n^4)$，$26$ 个点过了 $14$ 个。用前缀和优化可以干到 $O(n^3)$。

```cpp
for (unsigned i(1), l; i <= n; ++i) {
  f[i][1] = 1, l = min(m, i);
  for (unsigned j(2); j <= l; ++j) {
    f[i][j] = f[i][j - 1];
    for (unsigned k(j - 1); k < i; ++k) {
      f[i][j] += f[k][j - 1], Mn(f[i][j]);
    }
  }
}
```

优化后 $26$ 个点过了 $17$ 个。不过我可以再次使用前缀和，用二维前缀和把 DP 变成 $O(n^2)$。然后顺利通过了此题。

```cpp
const unsigned long long Mod(1000000007);
inline void Mn (unsigned& x) {x -= (x >= Mod) ? Mod : 0;}
unsigned f[2005][2005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1), l; i <= n; ++i) {
    f[i][1] = 1, l = min(m, i);
    for (unsigned j(2); j <= l; ++j)
      f[i][j] = f[i][j - 1] + f[i - 1][j - 1] - f[j - 2][j - 1] + Mod, Mn(f[i][j]), Mn(f[i][j]);
    for (unsigned j(1); j <= l; ++j) f[i][j] += f[i - 1][j], Mn(f[i][j]); 
  }
  Ans = (Mod + Mod + f[n][m] - f[n][m - 1] - f[n - 1][m] + f[n - 1][m - 1]) % Mod;
  for (unsigned i(m + 1); i < n; ++i) Ans <<= 1, Mn(Ans);
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```