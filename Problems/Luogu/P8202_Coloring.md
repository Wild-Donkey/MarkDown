# P8202 染色

树形 DP，是无需求逆元的版本。

$\tiny{验题人题解(?)}$

我们设 $Lim = \lfloor \frac n3 \rfloor + 2$，约束 $3$ 就变成所有颜色出现次数都不大于等于 $Lim$。

## 容斥

先算出忽略限制 $3$ 的方案数。然后减去规定某个颜色出现大于等于 $Lim$ 的方案数，这时两个颜色大于等于 $Lim$ 的方案被减去了两次，所以最后加上两个颜色大于等于 $Lim$ 的方案数。

## 设计

每个点的状态 $f_{i, j, 0/1/2}$ 表示这个点的子树中颜色 $1$ 的点有 $i$ 个，颜色 $2$ 的点有 $j$ 个，这个点的颜色为其它确定的颜色/颜色 $1$/颜色 $2$ 的方案数。

注意这个状态所计算的是当前节点颜色确定的方案数，转移到父亲时要枚举这个点的颜色。

因为 $i$ 或 $j$ 大于 $Lim$ 就失去意义了，所以我们把转移到某一维大于 $Lim$ 的状态转移到对应维度等于 $Lim$ 的状态即可。

下面的 $f$ 特指根节点的 DP 数组，那么总方案就可以表示为:

$$
\sum_{i, j \leq Lim} \max(m - 2, 0) \times f_{i, j, 0} + f_{i, j, 1} + f_{i, j, 2}
$$

表示枚举了所有组合情况下，根节点为所有 $m$ 种颜色的方案数总和。

接下来我们求强制使某个颜色出现次数大于等于 $Lim$ 的方案数。因为每个颜色是等价的，所以不管强制哪个颜色，它的方案数一定等于强制颜色 $1$ 出现次数大于等于 $Lim$，我们只要先强制颜色 $1$ 出现多次，然后乘以 $m$ 即可。

$$
m \sum_{i \leq Lim} \max(m - 2, 0) \times f_{Lim, i, 0} + f_{Lim, i, 1} + f_{Lim, i, 2}
$$

最后求强制某两个颜色出现次数大于等于 $Lim$ 的方案数。仍然是因为每个颜色等价，所以我们求强制颜色 $1$ 和 $2$ 出现次数大于等于 $Lim$ 的方案数最后乘 $\dfrac{m(m - 1)}2$。

$$
\frac{m(m - 1)}2 \max(m - 2, 0) \times f_{Lim, Lim, 0} + f_{Lim, Lim, 1} + f_{Lim, Lim, 2}
$$

## 转移

最后我们只要解决转移的问题就可以了。

对于 $x.f_{i, j, 0}$, 它的每个儿子有颜色 $1$, $2$, 和 $m - 3$ 种其它颜色可选，枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 0} = \text{Old}x.f_{i1, j1, 0} (\max(m - 3, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 1} + Son.f_{i2, j2, 2})
$$

对于 $x.f_{i, j, 1}$，它的每个儿子有颜色 $2$，和 $m - 2$ 种其它颜色可选，枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 1} = \text{Old}x.f_{i1, j1, 1} (\max(m - 2, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 2})
$$

对于 $x.f_{i, j, 2}$，它的每个儿子有颜色 $1$，和 $m - 2$ 种其它颜色可选，枚举两部分 $1$ 和 $2$ 的数量做树上背包合并即可:

$$
\text{New}x.f_{i1 + i2, j1 + j2, 2} = \text{Old}x.f_{i1, j1, 2} (\max(m - 2, 0) \times Son.f_{i2, j2, 0} + Son.f_{i2, j2, 1})
$$

复杂度类似于树上背包，是 $O(n^4)$ 的。

## 代码实现

```cpp
unsigned long long Mod(998244353);
unsigned long long Ans(0), m, m1, m2, m3;
unsigned n, Tp;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
struct Node {
  vector <Node*> E;
  unsigned f[36][36][3], Size;
}N[105];
inline void DFS(Node* x, Node* Fa) {
  x->Size = x->f[0][0][0] = x->f[1][0][1] = x->f[0][1][2] = 1;
  for (auto i : x->E) if (i != Fa) {
    DFS(i, x);
    unsigned To(x->Size + i->Size);
    unsigned Tmpf[min(To, Tp) + 1][36][3];
    memset(Tmpf, 0, sizeof(Tmpf));
    for (unsigned j1(min(Tp, x->Size)); ~j1; --j1) for (unsigned j2(min(Tp, x->Size)); ~j2; --j2) {
      unsigned* J(x->f[j1][j2]);
      if (!(J[0] || J[1] || J[2])) continue;
      for (unsigned k1(min(Tp, i->Size)); ~k1; --k1) for (unsigned k2(min(Tp, i->Size)); ~k2; --k2) {
        unsigned* K(i->f[k1][k2]), * T(Tmpf[min(j1 + k1, Tp)][min(j2 + k2, Tp)]);
        if (!(K[0] || K[1] || K[2])) continue;
        T[0] = (T[0] + J[0] * (K[0] * m3 % Mod + K[1] + K[2])) % Mod;
        T[1] = (T[1] + J[1] * (K[0] * m2 % Mod + K[2])) % Mod;
        T[2] = (T[2] + J[2] * (K[0] * m2 % Mod + K[1])) % Mod;
      }
    }
    memcpy(x->f, Tmpf, sizeof(Tmpf));
    x->Size = To;
  }
}
signed main() {
  n = RD(), m = RD(), Tp = (n / 3) + 2, m1 = m - 1, m2 = (m1 ? (m1 - 1) : 0), m3 = (m2 ? (m2 - 1) : 0);
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  DFS(N + 1, NULL);
  for (unsigned i(0); i <= Tp; ++i) for (unsigned j(0); j <= Tp; ++j) 
    Ans = (Ans + N[1].f[i][j][0] * m2 + N[1].f[i][j][1] + N[1].f[i][j][2]) % Mod;
  for (unsigned i(0); i <= Tp; ++i) Ans = (Ans + (Mod - m) * ((N[1].f[Tp][i][0] * m2 + N[1].f[Tp][i][1] + N[1].f[Tp][i][2]) % Mod)) % Mod;
  Ans = (Ans + ((N[1].f[Tp][Tp][0] * m2 + N[1].f[Tp][Tp][1] + N[1].f[Tp][Tp][2]) % Mod) * ((m * m1 >> 1) % Mod)) % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```