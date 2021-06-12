# Day9

~~博物馆半日游~~

## Tree

这是第几个 `tree` 了...

规定合法的移动是从一个点走到它的子树中任意一个除它以外的点或是停止移动.

对一棵 $n$ 个点的树 $T$, 设 $f_i$ 为一个节点的合法移动种类数, 求 $\displaystyle{\sum_{i}f_i}$. 为了方便, 我们设 $Sum_i$ 为 $i$ 的子树上的所有点的 $f$ 值总和.

推式子, 尝试一边 `DFS` 求出初始 $Sum_1$.

对于一个节点 $i$, 对它的每个儿子 $j$, 设 $k$ 是 $j$ 子树中的点, 则一定存在某些走法, `k-...`, 这些走法是统计到 $Sum_j$ 中的方案. 因为 $k$ 是 $i$ 的后代, 所以将 `k-...` 中的 `k-` 换成 `i-` 的走法一定合法, 所以有多少 `k-...` 的方案, 就一定有多少 `i-...` 的方案, 所以在 $Sum_j$ 中的一种合法走法, 在 $Sum_i$ 中会出现两种. 再加上一种特殊走法, 走到 $i$ 直接就停下的 `i-End`, 那么就有:

$$
Sum_i = 1 + 2\sum_j^{j 是 i 的儿子}Sum_j
$$

接下来考虑修改.

修改要求将待求树 $T$ 中的权值为 $x$ 的所有点上都挂上一棵 $m$ 个点的模板树 $S$ 中的编号 $y$ 的点的子树. 挂上的子树在 $S$ 中的编号变成在 $T$ 中的权值. 显然, $T$ 树一开始给出的和过程中会出现的权值的值域都是 $[1, m]$.

因为模板树 $S$ 不修改, 所以我们可以 $O(m)$ 地 `DFS` 出 $Sum_y$ 和其它可能用到的值.

先考虑在某个点 $i$ 下面挂一个 $y$ 的子树会对 $Sum_1$ 产生什么贡献. 它会修改它的所有祖先的 $f$ 值和 $Sum$ 值, 并且给答案贡献它自己的 $Sum$ 值. 考虑它的祖先的 $f$ 值如何变化.

对于 $i$, 它是 $y$ 的父亲, 所以对每一种 $Sum_y$ 中的走法 `-...`, 都有 `i-...`, 所以 $f_i$ 会增加 $Sum_y$. 对于 $i$ 的父亲 $i'$, 每个 $Sum_y$ 中的走法 `-...`, 会对应 `i'-...`, `i'-i-...`, 所以 $f_{i'}$ 会增加 $2Sum_y$.

接着枚举发现对于 $i$ 和 $i$ 的祖先 $i'$, $f_i'$ 的增加量就是 $2^{Dep_i - Dep_{i'}}Sum_y$.

然后看 $Sum_1$ 的变化, 从 $i$ 往上走, 每个点 $i'$ 的 $f$ 值都增加 $2^{Dep_i - Dep_{i'}}Sum_y$, 则这些 $f$ 对 $Sum$ 的贡献是 $(2^{Dep_i} - 1)Sum_y$, 再加上 $y$ 的加入自己带着的 $Sum_y$ 的贡献, 一共是 $2^{Dep_i}Sum_y$ 的贡献.

然后考虑如何快速求一个操作对结果的影响. 因为对于每个 $Val_i = x$ 的 $i$, 它们挂的 $y$ 的子树对答案的贡献一定是 $Sum_y$ 的整数倍, 所以我们只要求这个倍数就好了. 发现每个 $i$ 贡献的倍数 $2^{Dep_i}$ 只和它的深度有关, 所以开一个定义域 $[1, m]$ 的数组 $DSS$ (DeepSumSum), 规定:

$$
DSS_i = \sum_{j}^{Val_j = i} 2^{Dep_j}
$$

这样, 假设我们已经维护了正确的 $DSS$ 数组, 那么对于操作 $(x, y)$, $Sum_1$ 就会增加 $DSS_xSum_y$. 对于已经得到正确 $DSS$ 值的前提下, 一次询问的复杂度是 $O(1)$.

维护 $DSS$ 是最后要解决的问题.

每次操作后, 每个 $y$ 子树中的点都会在 $T$ 中增加一些. 考虑对于 $(x, y)$ 操作, 对 $DSS_i, i \in y 的子树$ 的影响.

发现因为 $i$ 在 $S$ 中是编号, 所以在 $y$ 的子树中只出现一次, 所以操作前 $T$ 有多少点 $Val = x$, 就会增加多少 $i$. 先看 $DSS_y$ 增加量. 对于每个点 $j, Val_j = x$, 它对 $DSS_x$ 的贡献是 $2^{Dep_j}$, 而每个 $j$ 后面会跟一个 $Val = y$ 的点, 它是 $j$ 的儿子, $Dep = Dep_j + 1$, 所以它对 $DSS_y$ 的贡献是 $2 * 2^{Dep_j}$. 因为对每个 $j, Val_j = x$ 都是这样, 所以 $DSS_y$ 一共会增加 $2DSS_x$.

以此类推, 对于 $y$ 的子树中的任意点 $z$, $DSS_z$ 的增量是 $2^{Dep_z - Dep_y + 1}DSS_x$.

考场上也在为如何快速维护这个信息发愁, 最后没办法了, 只能一个一个 $DSS$ 慢慢改.

期间想到了一些区间修改, 单点查询的数据结构, 如树状数组, 也将 $S$ 树的一些信息改成了以 `DFS序` 寻址, 将子树信息拍扁到序列上, 但是因为修改的值和深度有关, 不是定值, 所以最后没能实现, 只能用一个循环 $O(Size_y)$ 地维护 $DSS$, 总复杂度 $O(n + m + qm)$.

> tree-44'.cpp

算的复杂度是 $44'$, 但是没想到考场上得了 $96'$, 最后一个点被卡了 $15ms$. 然后在 Luogu 上交, 不开 `-O2` 得了 $80'$, 结果开了 `-O2` 就过了, 最慢的点还剩 $800ms$ 才 `TLE`, 所以按说这就算是 $n^2$ 过百万了. (可能只是数据水, 如果每个 $y$ 都是 $1$, 我就不好受了)

```cpp
const unsigned long long MOD(998244353);
unsigned n, m, q, A, B, Cnt(0), DfsrOrderDep[500005];
unsigned long long Ans(0), DepSumSum[500005], Bin[500005];
struct Node {
  Node *Fa, *Son, *Bro;
  unsigned long long Dep, Sum, Size, Num;
}N[500005];
struct Nodes {
  Nodes *Fa, *Son, *Bro;
  unsigned long long Sum, Size, DFSr, Dep;
}S[500005];
unsigned DFSn(Node *x) {
  Node *now(x->Son);
  while (now) {
    now->Dep = x->Dep + 1;
    DepSumSum[S[now->Num].DFSr] += Bin[now->Dep];
    if(DepSumSum[S[now->Num].DFSr] >= MOD) DepSumSum[S[now->Num].DFSr] -= MOD;
    x->Sum += DFSn(now);
    now = now->Bro;
  }
  x->Sum = (x->Sum << 1) ^ 1;
  return x->Sum %= MOD;
}
unsigned DFSs(Nodes *x) {
  x->Size = 1;
  x->DFSr = ++Cnt;
  Nodes *now(x->Son);
  while (now) {
    now->Dep = x->Dep + 1;
    x->Sum += DFSs(now);
    DfsrOrderDep[now->DFSr] = now->Dep;
    x->Size += now->Size;
    now = now->Bro;
  }
  x->Sum = (x->Sum << 1) ^ 1;
  return x->Sum %= MOD;
}
int main() {
  n = RD();
  Bin[0] = 1;
  for (register unsigned i(1); i <= 500000; ++i) {
    Bin[i] = (Bin[i - 1] << 1);
    if(Bin[i] >= MOD) Bin[i] -= MOD;
  }
  for (register unsigned i(2); i <= n; ++i)
    N[i].Fa = N + RD(), N[i].Bro = N[i].Fa->Son, N[i].Fa->Son = N + i;
  for (register unsigned i(1); i <= n; ++i) N[i].Num = RD();
  m = RD();
  for (register unsigned i(2); i <= m; ++i)
    S[i].Fa = S + RD(), S[i].Bro = S[i].Fa->Son, S[i].Fa->Son = S + i;
  S[1].Dep = 1;
  DfsrOrderDep[1] = 1;
  DFSs(S + 1);
  N[1].Dep = 1;
  DepSumSum[S[N[1].Num].DFSr] = 2;
  DFSn(N + 1);
  Ans = N[1].Sum;
  q = RD();
  printf("%llu\n", Ans);
  register unsigned long long TmpDSS;
  for (register unsigned i(1); i <= q; ++i) {
    A = RD(), B = RD();
    TmpDSS = DepSumSum[S[A].DFSr];
    Ans = (Ans + TmpDSS * S[B].Sum) % MOD;
    register unsigned long long Delta;
    for (register unsigned i(1); i <= S[B].Size; ++i) {
      Delta = DfsrOrderDep[S[B].DFSr + i - 1] - S[B].Dep + 1;
      DepSumSum[S[B].DFSr + i - 1] = (DepSumSum[S[B].DFSr + i - 1] + (TmpDSS * Bin[Delta])) % MOD; 
    }
    printf("%llu\n", Ans);
  }
  return 0;
}
```

> tree_Express.cpp

虽然过了题, 但是我的复杂度是错的, 能过是因为随机数据下, 树的任意一点子树的 $Size$ 的复杂度是 $log_m$ 的级别.

尝试利用 $DSS$ 值的更改和 $Dep$ 的关系, 发现只要是 $DSS_i$ 和 $DSS_j$ 同时修改, 一定有 $DSS_i$ 的变化值是 $DSS_j$ 的 $2^{Dep_i - Dep_j}$ 倍.

因为 $S$ 的确定性, 这个倍率是永远不变的, 所以可以规定一个类似于物理学零势能面的基准, 每次查询计算这个倍率即可.

定义 $DSSO$ 数组 (DeepSumSumOrigin), 规定零势能面是根的父亲. 使得 $DSS_i = DSSO_i * 2^{Dep_i}$, 因为 $Dep$ 不变, 所以只维护 $DSSO$ 即可.

考虑一个 $DSS_i$ 应该增加 $2^{Dep_i - Dep_y + 1}DSS_x$ 那么 $DSSO_i$ 就应该增加 $\frac{2^{Dep_i - Dep_y + 1}DSS_x}{2^{Dep_i}} = 2^{1 - Dep_y}DSS_x$, 这个值显然是和修改的点是哪个点是无关的, 可以区间修改.

很显然需要求 $2^i$ 的逆元, 考虑 $Inv_{2^i} * 2^{i} \equiv 1 \pmod {MOD}$, $Inv_{2^{i + 1}} * 2^{i + 1} \equiv 1 \pmod {MOD}$, 则 $Inv_{2^i} * 2^{i + 1} \equiv 2 \pmod {MOD}$, 所以 $Inv_{2^i} \equiv 2Inv_{2^{i + 1}} \pmod {MOD}$. 结合前面对[阶乘的逆元的线性递推](https://www.luogu.com.cn/blog/Wild-Donkey/xing-dui-ji-xun-day8-post), 发现逆元的递推的内核就是 $Inv_a = bInv_{ab}$, 所以只要是原数都有连续的乘法关系, 逆元就能线性递推.

解决了这个问题, 对 $[1, m]$ 的 `DFS序` 建立树状数组维护 $DSSO$, 对于每次询问 $(x, y)$, 将区间 $[DFSr_y, DFSr_y + Size_y - 1]$ 的 $DSSO$ 同时加 $Inv_{2^{Dep_y - 1}}DSS_x$. 每次询问时, 求出对应的 $2^{Dep_x}DSSO_xSum_y$ 就是答案.

考虑到 $DSS$ 有初值, 又存在 $Size \leq 40$ 的情况线性更快, 直接在初值数组操作, 所以仍然保留 $DSS$ 数组, 并且查询的时候乘上这个 $DSS$ 初值.

这份代码的复杂度是 $O(n + qlogm)$. 实践证明, 貌似分治卡到 $100$ 更快, 也就是说 $Size \leq 100$ 的暴力, $Size > 100$ 的用树状数组区间修改.

```cpp
#define Lowbit(x) ((x)&(-(x)))
const unsigned long long MOD(998244353);
unsigned n, m, q, nm, A, B, Cnt(0), DfsrOrderDep[500005];
long long Ans(0), DSS[500005], Bin[500005], Inv[500005], DSSO[500005];
struct Node {
  Node *Fa, *Son, *Bro;
  unsigned Dep, Num;
  long long Sum;
}N[500005];
struct Nodes {
  Nodes *Fa, *Son, *Bro;
  long long Sum;
  unsigned DFSr, Dep, Size;
}S[500005];
unsigned DFSn(Node *x) {
  Node *now(x->Son);
  while (now) {
    now->Dep = x->Dep + 1;
    DSS[S[now->Num].DFSr] += Bin[now->Dep];
    if(DSS[S[now->Num].DFSr] >= MOD) DSS[S[now->Num].DFSr] -= MOD;
    x->Sum += DFSn(now);
    now = now->Bro;
  }
  x->Sum = (x->Sum << 1) ^ 1;
  return x->Sum %= MOD;
}
unsigned DFSs(Nodes *x) {
  x->Size = 1;
  x->DFSr = ++Cnt;
  Nodes *now(x->Son);
  while (now) {
    now->Dep = x->Dep + 1;
    x->Sum += DFSs(now);
    DfsrOrderDep[now->DFSr] = now->Dep;
    x->Size += now->Size;
    now = now->Bro;
  }
  x->Sum = (x->Sum << 1) ^ 1;
  return x->Sum %= MOD;
}
inline void Chg(unsigned Pos, long long Val) {
  while (Pos <= m) {
    DSSO[Pos] += Val;
    if(DSSO[Pos] < 0) DSSO[Pos] += MOD;
    if(DSSO[Pos] >= MOD) DSSO[Pos] -= MOD;
    Pos += Lowbit(Pos);
  }
}
inline long long Qry(unsigned Pos) {
  long long TmpDSSO(0);
  while(Pos)
    TmpDSSO += DSSO[Pos], Pos -= Lowbit(Pos);
  TmpDSSO %= MOD;
  if(TmpDSSO < 0) TmpDSSO += MOD;
  return TmpDSSO;
}
int main() {
  n = RD(), Bin[0] = 1;
  for (register unsigned i(2); i <= n; ++i)
    N[i].Fa = N + RD(), N[i].Bro = N[i].Fa->Son, N[i].Fa->Son = N + i;
  for (register unsigned i(1); i <= n; ++i) N[i].Num = RD();
  m = RD();
  for (register unsigned i(2); i <= m; ++i)
    S[i].Fa = S + RD(), S[i].Bro = S[i].Fa->Son, S[i].Fa->Son = S + i;
  nm = max(n, m), Inv[nm] = 1;
  for (register unsigned i(1); i <= nm; ++i) {
    Bin[i] = (Bin[i - 1] << 1);
    if(Bin[i] >= MOD) Bin[i] -= MOD;
  }
  register unsigned TmpTms(MOD - 2);
  register long long TmpPo(Bin[nm]);
  while(TmpTms) {
    if(TmpTms & 1) Inv[nm] = Inv[nm] * TmpPo % MOD;
    TmpTms >>= 1, TmpPo = TmpPo * TmpPo % MOD;
  }
  for (register unsigned i(nm - 1); i < 0x3f3f3f3f; --i) {
    Inv[i] = (Inv[i + 1] << 1);
    if(Inv[i] >= MOD) Inv[i] -= MOD;
  } 
  S[1].Dep = 1, DfsrOrderDep[1] = 1, DFSs(S + 1), N[1].Dep = 1, DSS[S[N[1].Num].DFSr] = 2, DFSn(N + 1), Ans = N[1].Sum, q = RD(), printf("%u\n", Ans);
  register long long TmpDSS;
  for (register unsigned i(1); i <= q; ++i) {
    A = RD(), B = RD();
    TmpDSS = ((Qry(S[A].DFSr) * Bin[DfsrOrderDep[S[A].DFSr]]) + DSS[S[A].DFSr]) % MOD;
    Ans = (Ans + TmpDSS * S[B].Sum) % MOD;
    if(S[B].Size <= 20) {
      register unsigned long long Delta;
      for (register unsigned i(1); i <= S[B].Size; ++i)
        Delta = DfsrOrderDep[S[B].DFSr + i - 1] - S[B].Dep + 1,
        DSS[S[B].DFSr + i - 1] = (DSS[S[B].DFSr + i - 1] + (TmpDSS * Bin[Delta])) % MOD;
    } else
      Chg(S[B].DFSr, Inv[DfsrOrderDep[S[B].DFSr] - 1] * TmpDSS % MOD),
      Chg(S[B].DFSr + S[B].Size, - (Inv[DfsrOrderDep[S[B].DFSr] - 1] * TmpDSS % MOD));
    printf("%u\n", Ans);
  }
  return 0;
}
```

## SDOI2013

一个棋盘, 每个点有一块金子, 每个点 $(i, j)$ 的金子放到 $(f_i, f_j)$ 处, $f_x$ 表示把 $x$ 的十进制的各位数字乘积, 求变化后, 金子最多的 $k$ 个格子的金子数量和.

我们发现, $f_x$ 一定可以表示成 $2^{a_1}3^{a_2}5^{a_3}7^{a_4}$, 因为每位数字是 $[0, 9]$ 的, 不存在更大的质因数. 所以对于 $[1, 10^{12}]$ 的定义域只存在规模 $10^4$ 左右的可能的值域.

因为横纵坐标相互独立互不影响, 所以可以分开考虑, 一个点 $(x, y)$ 的金子数就是

$$ 
\sum_{i, j}[f_i = x \& f_j = y]\\
=\sum_{i}[f_i = x] * \sum_{j}[f_j = y]
$$

可以横纵坐标分开考虑. 定义 $g_x = \sum_{i}[f_i = x]$ 首先将这约 $1^4$ 的值域离散化. 跑数位 DP, 对约 $1^4$ 个 $x$ 求出所有 $g_x$.

接下来将所有的 $g_x * g_y$ 进行枚举, 开一个堆, 一开始存进去 $g_{minx} * g_{maxy}$, $g_{minx'} * g_{maxy}$, ..., $g_{maxx} * g_{maxy}$. 这里的 $maxx$, $maxy$ 指 $x$ 或 $y$ 值域中使得 $g$ 最大的自变量值, $minx$ 同理, $minx'$ 指 $x$ 值域中使得 $g$ 值次小 (不严格) 的自变量值. 每次弹出最大值 $g_i * g_j$, 然后插入 $g_i * g_{j'}$, 这个 $j'$, 就是在 $y$ 的定义域中, 除 $j$ 以外, 使得 $g_{j'}$ 是比 $g_j$ 小 (不严格) 的最大的 $g$ 值的自变量值.

重复这个操作 $k$ 次, 即可得到答案.
