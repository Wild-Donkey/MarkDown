# Day4

## Gp

原题: Joi 2012 Kangaroo

$300$ 个套娃, 容量 $Contain$ 一定小于体积 $Size$, 一个匹配是指不存在还有套娃能放在另一个套娃中的情况. 给出每个套娃的 $Size$ 和 $Contain$, 求合法的不同的匹配情况数量对 $10^9 + 7$ 取模的结果.

考场思路: 把每个套娃拆成两个点, 一个是它的 $Size$, 一个是它的 $Contain$, 形成一个二分图, 每个 $Size$ 点向能装下它的 $Contain$ 点连边.

排序不亏: 分别排序 $Size$ 和 $Contain$, 由于排序后, $Size$ 自增, 所以可以直接将 $Size$ 小的点的边的后继连到相邻的 $Size$ 比它大的点的 $Fst$ 上, 这样实际连接的边数就是 $O(n)$ 条, 就能完成 $O(n^2)$ 种转移.

大暴搜: 枚举每个 $Size$ 点, 在当前能选的转移边里选一个来匹配, 当然什么都不选也是一种情况, 每次到边界的时候, 判断是否有可用的边没连, 如果有, 则匹配情况不合法, 否则统计一次.

欣赏一下考场大暴搜:

```cpp
unsigned n, m, Ans(0), The(0), Sq;
char flg(0), Ed[305];
struct WN {
  unsigned Size, Contain; 
  const inline char operator<(const WN &x) const{
    return this->Size > x.Size; }
}W[305];
struct Node {
  Node *Fst, *Nxt; char Have;
}N[605];
char Judge () {
  for (register unsigned i(n); i; --i)
    if(!(N[i].Have)) {
      register Node *now(N[i].Fst);
      while (now) {
        if(!(now->Have)) return 0;
        now = now->Nxt; }
      return 1; }
  return 1;
}
unsigned long long BigDFS(Node *x) {
  if(x > N + n) return Judge();
  register unsigned long long CntCases(BigDFS(x + 1));
  register Node *now(x->Fst);
  x->Have = 1;
  while(now) {
    if(!(now->Have))
      now->Have = 1, CntCases += BigDFS(x + 1), now->Have = 0;
    now = now->Nxt; }
  x->Have = 0;
  return CntCases % MOD;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    W[i].Size = RD(), W[i].Contain = RD();
  sort(W + 1, W + n + 1);
  for (register unsigned i(1); i <= n; ++i) {
    N[i].Fst = N[i - 1].Fst;
    for (register unsigned j(1); j <= n; ++j)
      if(!Ed[j]) if(W[j].Contain > W[i].Size)
          N[j + n].Nxt = N[i].Fst, N[i].Fst = N + j + n, Ed[j] = 1; }
  printf("%llu\n", BigDFS(N + 1));
  return 0;
}
```

考试结束的时候发现, 由于连边单调性, 用数组代替边表, 左部点右部点分别存入不同的数组, 只存 $Size_i$ 能连接的 $Contain$ 最小的右部点.

```cpp
unsigned n, m, Ans(0), The(0), Sq;
char flg(0);
struct NodeS; 
struct Node {
  NodeS *Fst; unsigned Size; char Have;
  const inline char operator <(const Node &x) const {
    return this->Size < x.Size;}
}N[305];
struct NodeS {
  unsigned Contain; char Have;
  const inline char operator <(const NodeS &x) const{
    return this->Contain < x.Contain;}
}NS[305];
char Judge () {
  for (register unsigned i(1); i <= n; ++i)
    if(!(N[i].Have)) {
      for (register NodeS *j(N[i].Fst); j <= NS + n; ++j)
        if(!(j->Have)) return 0;
      return 1; }
  return 1;
}
unsigned long long BigDFS(Node *x) {
  if(x == N) return Judge();
  register unsigned long long CntCases(BigDFS(x - 1));
  x->Have = 1;
  for (register NodeS *i(x->Fst); i <= NS + n; ++i) if(!(i->Have))
    i->Have = 1, CntCases += BigDFS(x - 1), i->Have = 0;
  x->Have = 0;
  return CntCases % MOD;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    N[i].Size = RD(), NS[i].Contain = RD();
  sort(N + 1, N + n + 1), sort(NS + 1, NS + n + 1);
  N[n + 1].Fst = NS + n + 1, NS[n + 1].Contain = 0x3f3f3f3f;
  for (register Node *i(N + n); i > N; --i) {
    i->Fst = (i + 1)->Fst;
    while((i->Fst - 1)->Contain > i->Size) --(i->Fst);
  }
  printf("%llu\n", BigDFS(N + n));
  return 0;
}
```

接下来是正解: DP

仍然是一个套娃拆成两个独立的点, $Size$ 和 $Contain$ 分别排序.

定义 $CntAfter_{i, j, k}$ 指的是在 $[i, j]$ 中可供 $Size_k$ 选用匹配的 $Contain$ 数量, 也就是满足 $Contain_x > Size_k, x \in [i, j]$ 的 $x$ 数量.

定义 $CntBefore_{i, j, k}$ 指的是在 $[i, j]$ 中可以匹配 $Contain_{k}$ 的 $Size$ 数量, 也就是满足 $Contain_k > Size_x, x \in [i, j]$ 的 $x$ 数量.

枚举一个分界点 $Mid$, 作为从从左到右第一个没有匹配的 $Size$, $Size_{Mid}$ 没有任何匹配, 这时, $Contain_i > Size_{Mid}$ 都应该有匹配, 否则如果有 $Contain_i  > Size_{Mid}$ 且没有匹配, 那么 $Size_{Mid}$ 和 $Contain_i$ 就可以匹配, 原方案不合法. 对于 $Size_x, x \in [1, Mid - 1]$, 都一定有匹配, 这是 $Mid$ 的定义.

对于 $i, j \in [1, Mid - 1]$, $Size_i$ 和 $Contain_j$ 互相匹配后的方案数可以通过 $O(Mid^2)$ 的 DP 求出, 设 $f_{i, j}$ 表示对于 $[i, Mid - 1]$ 的 $Size$ 和 $[1, Mid]$ 的 $Contain$ 一共有 $j$ 对匹配的方案数, 写出方程:

$$
f_{i, j} = f_{i + 1, j} + f_{i + 1, j - 1} * (CntAfter_{1, Mid, i} - j + 1)
$$

解释: $f_{i + 1, j}$ 是第 $Size_i$ 不进行匹配的贡献, $CntAfter_{1, Mid, i} - j + 1$ 是可供选择的数量减去已经选择的数量, 也就是当前的选择数量, 乘法原理是因为不管是 $f_{i + 1, j - 1}$ 包含的哪种情况, 都有这么多选择.

接下来, 设 $Left$ 为满足 $Contain_{Left} > Size_{Mid}$ 的最小下标. 接下来是 $g_{i, j}$ 表示对于 $[Left, i]$ 的 $Contain$ 和 $[Mid + 1, n]$ 的 $Size$ 一共有 $j$ 对匹配的方案数, 写出方程:

$$
g_{i, j} = g_{i - 1, j} + g_{i - 1, j -  1} * (CntBefore_{Mid + 1, n, i} - j + 1)
$$

解释: 和 $f_{i, j}$ 对称, 非常漂亮.

好了, 求得了 $f$ 和 $g$, 接下来对于枚举到的 $Mid$ 对答案进行计算. 枚举一个 $i$, 表示 $Size_x, x \in [1, Mid - 1]$ 匹配 $Contain_y, y \in [Left, n]$ 的对数. 这时的合法情况的数量应该是 $f_{1, Mid - i - 1} * g_{n, n - Left + 1 - i} * i!$, 因为 $[1, Mid - 1]$ 中, 有匹配的 $Size$ 应该是 $Mid - 1$ 也就是全部匹配, 所以需要和 $Contain_x, x \in [Left, n]$ 匹配, 而这根据单调性是可以随便连的, 而 $i$ 的全排列恰好是 $i!$, 所以加入 $Ans$ 即可.

被改得面目全非的 AC 代码:

```cpp
unsigned n, Size[305], Contain[305], CntAfter[305], CntBefore[305], f[305][305], g[305][305], Left, Factorial[305];
unsigned long long Ans(0);
char flg(0);
int main() {
  n = RD(), Factorial[0] = 1;
  for (register unsigned i(1); i <= n; ++i) Size[i] = RD(), Contain[i] = RD();
  for (register unsigned i(1); i <= n; ++i) Factorial[i] = (unsigned long long)Factorial[i - 1] * i % MOD;
  sort(Size + 1, Size + n + 1); sort(Contain + 1, Contain + n + 1);
  f[n][0] = 1; 
  g[1][0] = 1;
  Contain[n + 1] = 0x3f3f3f3f;
  Left = 1;
  for (register unsigned Mid(1); Mid <= n; ++Mid) {
    memset(f, 0, sizeof(f));
    memset(g, 0, sizeof(g));
    CntAfter[Mid] = CntBefore[Left - 1] = 0;
    for (; Contain[Left] <= Size[Mid]; ++Left) {}
    for (register unsigned i(Mid - 1); i; --i) {
      CntAfter[i] = CntAfter[i + 1];
      while (Size[i] < Contain[Left - CntAfter[i] - 1]) ++CntAfter[i];
    }
    for (register unsigned i(Left); i <= n; ++i) {
      CntBefore[i] = CntBefore[i - 1];
      while(Size[Mid + 1 + CntBefore[i]] < Contain[i]) ++CntBefore[i];
    }
    f[Mid][0] = 1;
    for (register unsigned i(Mid - 1); i; --i) {
      f[i][0] = f[i + 1][0];
      for (register unsigned j(1); j <= CntAfter[i]; ++j) {
        f[i][j] = f[i + 1][j]; // 不拿 
        f[i][j] += (unsigned long long)f[i + 1][j - 1] * (CntAfter[i] - j + 1) % MOD; // 拿
        if(f[i][j] >= MOD) f[i][j] -= MOD;
      }
    }
    g[Left - 1][0] = 1;
    for (register unsigned i(Left); i <= n; ++i) {
      g[i][0] = g[i - 1][0];
      for (register unsigned j(1); j <= CntBefore[i]; ++j) {
        g[i][j] = g[i - 1][j];
        g[i][j] += (unsigned long long)g[i - 1][j - 1] * (CntBefore[i] - j + 1) % MOD;
        if(g[i][j] >= MOD) g[i][j] -= MOD;
      }
    }
    for (register unsigned i(min(n - Left + 1, Mid - 1)); i < 0x3f3f3f3f; --i)
      Ans += ((unsigned long long)f[1][Mid - 1 - i] * g[n][n - Left + 1 - i] % MOD) * Factorial[i] % MOD;
  }
  printf("%llu\n", Ans % MOD);
  return 0;
}
```

考后从 $19:00$ 写到 $24:00$, 第二天从 $5:30$ 写到 $7:00$, 中午又写了 $30min$ 才过, 本来无脑 DP 竟然有这么多细节...

其实这个题能 $O(4n^2)$ 做, 将拆点后的 $O(2n)$ 个点放到一起排序. 然后在这上面跑序列 DP, $O(n^2)$ 状态, $O(1)$, 转移.

## Of

在 $n*m$ 网格上选择尽量多的格点 (必须包含 $(0,0)$ 和 $(n, m)$), 依次连接形成下凸包, 求点数.

考场上一眼看到这个题可以剪枝暴搜. 正解想推式子 $O(n^2)$ 预处理, $O(1)$ 回答询问. 答案的分布看起来像是反比例函数, 可是连 $Geogebra$ 都找不到规律.

最后还是交的暴搜:

```cpp
unsigned n, m, t;char flg(0);
unsigned DFS(unsigned x, unsigned y, unsigned Beforex, unsigned Beforey) {
  if(x == 1 || y == 1) if((x * (Beforey - y)) > (y * (Beforex - x)))
      return ((x * (Beforey - y)) > (y * (Beforex - x))) ? 2 : 0;
  unsigned CntPnt(2);
  for(register unsigned i(x - 1), Top(y - 1), Bot(y - 1); i; --i) {
    while (((y - Top) * x) <= ((x - i) * y)) --Top;
    while (Bot && (((x - i) * (Beforey - y)) > ((y - Bot) * (Beforex - x)))) --Bot;
    ++Bot;
    if(((x - i) * (Beforey - y)) <= ((y - Bot) * (Beforex - x))) break;
    for (register unsigned j(Bot), TmpD; j <= Top; ++j) {
      TmpD = DFS(i, j, x, y) + 1;
      if(TmpD > CntPnt) CntPnt = TmpD;
    }
  }
  return CntPnt;
}
int main() {
  t = RD();
  for (register unsigned T(1); T <= t; ++T) {
    n = RD(), m = RD();
    if(((m * (m + 1)) >> 1) <= n) {printf("%u\n", m + 1); continue;}
    printf("%u\n", DFS(n, m, n + 1, 6000));
  }
  return 0;
}
```

正解是枚举 $O(n^2)$ 个横纵坐标互质的二维向量, 然后枚举选择哪些向量, 让它们的和等于 $(n, m)$, 直接写是 $O(n^4)$. 通过剪枝将向量数量压到 $O(n^{\frac 23})$ 这样复杂度就压到了 $O(n^{\frac 73})$.

## Dls

一个序列, 两端是 $\infin$, 每个元素有对应的点, 每个元素 $i$ 的点向它左边第一个值 $\geq a_i$ 的元素或右边第一个 $> a_i$ 的元素连无向边.

支持单点修改, 每次修改求无向图上不同的六元环个数.

由于此题难度过于离谱, 以至于手玩都不会求静态六元环, 更别说带修计数了, 所以直接就没写.

## Bitset Master

一棵集合构成的树, 一开始每个节点对应的集合之有一个元素, 也就是这个点, 支持:

查询包含点 $x$ 的集合数

将树上的某条边两端的集合设为这两个集合的并

考虑一个集合 $x$ 包含点 $y$ 的条件. 必须存在一个操作序列, 依次合并 $y$ 到 $x$ 路径上每条边.

离线. 从上往下, 用 DP 求出每个点被根的集合包含的最早时间, 自己最早到根的时刻是到父亲之后, 父亲的最早的到根的操作序列的时刻.

将每个点按到根时间排序, 容易知道后代一定不会比祖先提前到达. 根不同的子树中的节点要想包含对方, 必须先到达根. 使用点分治 + 扫描线 + DFS 维护, 总复杂度 $O((n + m)log^2n)$

## Cyclic Distance

边带权的树, 求一个包含 $k$ 个点的点集, 求一个点集中点的排序, 使相邻两点的距离和的最小值 (规定点 $1$ 和点 $k$ 相邻).

枚举点集的重心, 再构造出以这个点为重心的点集, 然后再求最小距离和.

考虑优化, 一个节点的子树大小超过这个点的子树的一半, 则要重心在这个子树中不会使答案更劣. 用数据结构可以优化到 $O(nlogn)$.