# CERC2014 Outer space invaders

这个题为什么没有写分治的呀？

## 题意

先把题意抽象一下。

$n$ 条水平线段，坐标 $\leq 10000$，要求选一些横坐标，花费 $v$ 使得所有包含这个坐标的高度 $\leq v$ 的线段被覆盖，求所有 $n$ 条线段被覆盖的最小花费。

## 解法

因为 $n$ 比较小，所以离散化横坐标。

因为对于一组数据，必须先覆盖最高的线段，而覆盖它可以选择横坐标区间内的任何一个点，假设选的是 $Mid$，那么这些线段就会分成 $3$ 类，包含 $Mid$ 的，完全在 $Mid$ 左边的，完全在 $Mid$ 右边的。

其中包含 $Mid$ 的会被直接覆盖，不需要关心。剩下的两种线段就变成了两个子问题。

接下来就可以递归求解了。

$O(n)$ 枚举 $Mid$，$O(n)$ 给线段分类，所以每一个子问题递归之前是 $O(n^2)$。可以构造数据使得每次有 $n - 1$ 个线段在其中一个子问题中，这样就把算法卡到了 $O(n^n)$。

所以我们使用记忆化搜索，对于一个子问题，它的左端点的最小值和右端点最大值组成的区间最多有 $n^2$ 种，所以我们可以使 $f_{i, j}$ 表示 $[i, j]$ 内完全包含的线段都覆盖最少需要多少花费 (和区间 DP 的状态设计相同)。然后记忆化搜索即可，复杂度 $O(n^4)$。

从官网下载数据进行分析，发现除了样例以外，剩下的两个点一个 $n \in [10, 20]$，$T = 240$，另一个 $n \in [299, 300]$，$T = 9$。$O(n^4)$ 可以搞一下。

随便写了一发可以过 $n \leq 20$。

算出来复杂度是 $7*10^{10}$，看起来相当吓人，但是因为在 $n$ 较小的子问题中，包含 $Mid$ 的线段数量相对于 $n$ 是非常可观的，所以实际复杂度和理论复杂度相差甚远，所以基本上卡卡常就能过。

算法的复杂度主要是枚举 $Mid$ 时分类线段贡献的。

发现给线段分类的时候，随着 $Mid$ 增加，$Mid$ 左边的线段集合会不断加入元素，$Mid$ 右边的线段集合会不断减少元素，这样在 $Mid$ 改变的时候，只要遍历左边的集合以外的线段，将线段加入左边，遍历右边的集合，将线段踢出右边，就将常数减少了一倍。

这时的程序总时间已经可以跑到 $1.09s$ 了，所以已经可以 AC 了。

但是发现程序仍可以优化，之前计算子问题的坐标区间的时候，是将原来的区间递归下去，这样算出的区间边界不紧，导致同一个子问题被多次求解。将递归传参改为根据每条线段取左端点最小值和右端点最大值可以避免这种情况。将总时间压到了 $874ms$。

下面给出代码，已经比部分 $O(n^3)$ 的 DP 要快了。

```cpp
unsigned b[605], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0);
unsigned f[605][605];
struct Alien {
  unsigned L, R, Val;
}a[305];
inline unsigned Do (const unsigned Fr, const unsigned To) {
  unsigned U(0x3f3f3f3f), D(0);
  for (unsigned i(Fr); i <= To; ++i) U = min(U, a[i].L), D = max(D, a[i].R);
  if(Fr == To) f[U][D] = a[Fr].Val;
  if(f[U][D] < 0x3f3f3f3f) return f[U][D];
  unsigned Mid(Fr), Mdl, Mdr, Mdv, Ri(To), Le(Fr);
  for (unsigned i(Fr); i <= To; ++i) if(a[Mid].Val < a[i].Val) Mid = i;
  Mdl = a[Mid].L, Mdr = a[Mid].R, Mdv = a[Mid].Val, Mid = 0x3f3f3f3f;
  for (unsigned j(To); j >= Fr; --j) if(a[j].L > Mdl) swap(a[j], a[Ri--]);
  for (unsigned i(Mdl); i <= Mdr; ++i) {
    unsigned Tmp(0);
    for (unsigned j(Le); j <= To; ++j) if(a[j].R < i) swap(a[j], a[Le++]);
    for (unsigned j(To); j > Ri; --j) if(a[j].L == i) swap(a[j++], a[++Ri]);
    if(Le > Fr) Tmp = Do(Fr, Le - 1);
    if(Ri < To) Tmp += Do(Ri + 1, To);
    Mid = min(Mid, Tmp);
  }
  f[U][D] = Mid + Mdv;
  return f[U][D];
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    n = RD();
    for (unsigned i(0); i < n; ++i) {
      a[i + 1].L = b[i << 1] = RD();
      a[i + 1].R = b[(i << 1) ^ 1] = RD(); 
      a[i + 1].Val = RD();
    }
    sort(b, b + (n << 1));
    m = unique(b, b + (n << 1)) - b;
    if(m <= 40) {
      for (unsigned i(0); i < m; ++i)
        for (unsigned j(i); j < m; ++j) 
          f[i][j] = 0x3f3f3f3f;
    } else memset(f, 0x3f, sizeof(f));
    for (unsigned i(1); i <= n; ++i) {
      a[i].L = lower_bound(b, b + m, a[i].L) - b;
      a[i].R = lower_bound(b, b + m, a[i].R) - b;
    }
    printf("%u\n", Do(1, n));
  }
  return Wild_Donkey;
}
```