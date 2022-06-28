# 风暴之眼

这道题的状态设计真是千奇百怪，有的做法每个点开了 $8$ 个状态，有的做法开了 $4$ 个，我一直尝试使这个数字变得更少，叉了几个做法还是没有成功，所以仍然是 $4$ 个状态。

传送门: [风暴之眼](https://www.luogu.com.cn/problem/P7727)

## 性质

每种类型都有一个稳定颜色，也就是说一个类型的点一旦变成某个颜色就再也不能变化了，因此每个点从开始到结束最多变化一次。

因为输入的终态是稳态，所以我们可以确定一些点的类型: 如果一个点的邻居存在和它颜色不一样的点，那么可以证明如果这个点是某种类型则这个状态下一刻还会发生变化。

接下来设计状态开始 DP。树形 DP 的核心就是把每棵子树作为子问题，并且通过子树的结果推得自己的结果。

或许可以记录每个点的初态和类型作为状态，但是只记录点的颜色或类型作为状态无法考虑颜色传递的方向，导致同色连通块陷入囚徒困境，即所有点都在等待他人更新。

因此转移需要记录每个点对父亲的要求和可以为父亲做出的贡献。

讨论一个点的不同状态，点的状态可以分为四种: 

- 需要父亲的颜色传递到自己
- 无需父亲即可变成自己的终态
- 自始至终都可以独自保持自己的终态
- 禁止父亲出现终态以外的颜色

这四个状态互不重合且覆盖了所有情况，分别用 $0, 1, 2, 3$ 表示它们。其中 $0, 1$ 状态初态和终态相反，类型也已确定。$2, 3$ 的初态和终态相同。状态 $3$ 是要求邻居始终为自己终态的类型，$0, 1, 2$ 是另一种类型。

设计状态 $f_{i, j}$ 表示第 $i$ 个点为状态 $j$，它子树合法的方案数。前三个状态的转移是:

$$
\begin{aligned}
f_{i, 0} &= \prod_{j \in Son_i} (f_{j, 0}[a_j = a_i] + f_{j, 2}[a_j \neq a_i])\\
f_{i, 1} &= \prod_{j \in Son_i} (f_{j, 0} + f_{j, 1} + f_{j, 2}) - f_{i, 0}\\
f_{i, 2} &= \prod_{j \in Son_i} (f_{j, 0}[a_j = a_i] + f_{j, 1} + f_{j, 2} + f_{j, 3})\\
f_{i, 3} &= [a_{Fa} = a_i]\prod_{j \in Son_i} (f_{j, 2} + f_{j, 3})[a_i = a_j]
\end{aligned}
$$

我们设一个新的根 $R$ 作为原来根 $r$ 的父亲，使它们终态相同。对于 $r$ 初态不变的状态，答案即为 $f_{r, 3} + f_{r, 2}$，对于 $r$ 初态改变的状态，取 $f_{r, 1}$ 即可。

```cpp
const unsigned long long Mod(998244353);
inline void Mn(unsigned& x) { x -= (x >= Mod) ? Mod : 0; }
unsigned long long Ans(1);
unsigned m, n, A, B;
struct Node {
  vector<Node*> E;
  unsigned f[4], Size;
  char Final;
}N[200005];
inline void DFS(Node* x, Node* Fa) {
  unsigned long long C1(1), C2(1), C3(1), C4(Fa->Final ^ x->Final ^ 1);
  for (auto i : x->E) if (i != Fa) {
    DFS(i, x);
    C1 = C1 * i->f[(x->Final ^ i->Final) << 1] % Mod;
    C2 = C2 * (i->f[0] + i->f[1] + i->f[2]) % Mod;
    C3 = C3 * (((i->Final == x->Final) ? i->f[0] : 0) + i->f[1] + i->f[2] + i->f[3]) % Mod;
    if (C4) C4 = C4 * ((i->Final == x->Final) ? (i->f[2] + i->f[3]) : 0) % Mod;
  }
  x->f[0] = C1;
  x->f[1] = Mod + C2 - C1, Mn(x->f[1]);
  x->f[2] = C3;
  x->f[3] = C4;
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) N[i].Final = RD();
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  N[0].Final = N[1].Final, DFS(N + 1, N), Ans = N[1].f[1] + N[1].f[2] + N[1].f[3];
  printf("%llu\n", Ans % Mod);
  return Wild_Donkey;
}
```

不是现场选手，是朋友退役前推荐我做的，这绝对是我做过最困难的蓝题。