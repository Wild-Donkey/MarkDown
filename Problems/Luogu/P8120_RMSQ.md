# 分块 RMSQ

[传送门](https://www.luogu.com.cn/problem/P8120)

题面已经很清楚了，所以就不复述了。

## 转化

我们发现排列不需要存储，只要存储每个元素的位置 $Pos_i$ 即可，读入 $a$ 的时候，我们把输入的第 $i$ 数字在 $b$ 中的位置 $Pos_i$ 存入 $a_i$。这样问题就变成了在新的 $a$ 数组中查询区间的最长连续上升子序列。

## 离线

对于离线算法，我们想到莫队。通过存储当前区间内，以 $a$ 的每个位置结尾和开头的子序列长度 $Len_{i, 0/1}$，可以进行 $O(1)$ 的边界伸长。利用回滚莫队，设置块长为 $\dfrac n{\sqrt q}$ 可以做到 $O(m + n\sqrt q)$ 的总复杂度。

## 在线

同样是分块，设块长为 $B$，块数记为 $A = \lfloor \frac nB \rfloor$。

这个算法和出题人的官方算法不同，我预处理了 $f$，$g$，$Mx$ 三个数组。

$f_{i, j, k}$ 表示从第 $i$ 个到第 $j$ 个整块，外加右边紧挨着的 $k$ 个零散元素组成的区间 $[iB + 1, (j + 1)B + k]$ 内，以 $k$ 为结尾的最长的满足条件的子序列长度。

$g_{i, j, k}$ 表示从第 $i$ 个到第 $j$ 个整块，外加左边紧挨着的 $k$ 个零散元素组成的区间 $[iB + 1 - k, (j + 1)B]$ 内，以 $k$ 为开头的最长的满足条件的子序列长度。

$Mx_{i, j}$ 表示从第 $i$ 个到第 $j$ 个整块组成的区间 $[iB + 1, (j + 1)B]$ 内最长满足条件的子序列的长度。

预处理的过程和莫队区间伸长是一样的。复杂度 $O(\frac {n^2}B)$。

询问的时候把查询的子序列分为 $3$ 种:

- 只存在于整块区间内  
  直接查询 $Mx$ 即可。复杂度 $O(1)$。
- 包含整块右边零散元素
  因为这样的子序列右端一定在右边零散元素中，我们枚举右边的零散元素作为子序列结尾，一开始预处理的 $f$ 便是这些子序列去掉左边零散元素的长度 $TheL$，根据它们的值和它们对应的 $f$ 值算出开头元素 $Le$，把长度插入辅助数组 $Len_{Le}$。表示去掉左边零散元素的区间内以 $Le$ 为开头的最长符合条件的子序列长度为 $TheL$。然后在 $Len$ 中只存在刚刚插入的 $O(B)$ 个元素，当前区间和待查区间右端点相同的情况下，将当前区间左端点伸长到待查的区间的左端点。此时用 $Len$ 中最大值更新答案。最后将 $Len$ 回滚到空数组。复杂度 $O(B)$。
- 不包含整块右边零散元素，包含整块左边零散元素  
  这个时候枚举每个左边的零散元素作为左端点，查询它们对应的 $g$ 值即可。复杂度 $O(B)$。

这样可以在 $O(B)$ 内完成一次查询。块长取 $\dfrac n{\sqrt q}$ 的时候可以得到 $O(m + n\sqrt q)$ 的复杂度。

## 代码实现

这里我把 $n$，$m$ 的意义反过来了，这里提醒一下避免误会。

对于 $f$ 和 $g$，由于空间不够，所以采用了公用空间的手段。发现所有 $i > j$ 的 $f_{i, j, k}$ 和 $g_{i, j, k}$ 都不存在。对于 $f$ 来说，$i$ 的取值为 $[0, A)$。而 $g$ 的 $i$ 取值为 $(1, A)$。所以我们可以把 $g_{i, j, k}$ 的值存到 $f_{A - i, A - j, k}$ 中去。为了防止 $i = j$ 的时候，$f$ 和 $g$ 冲突的情况，我们把原本 $f_{i, j, k}$ 的值存到 $f_{i, j + 1, k}$ 中去。这样第 $i$ 行，$f$ 占用第 $(i, j]$ 列，$g$ 占用第 $(0, i]$ 列。不产生冲突。

但是随着块长的变化，定义全局变量三维数组的行为无法满足灵活变化的块长的需求，频繁的访问寻址也会增加常数，所以我们只开一个内存池，然后灵活地查询我们想要的位置的指针，在连续访问的时候只移动指针而避免了三个下标的寻址。

```cpp
unsigned fPool[300000000], Len[300005], Mx[1005][1005];
unsigned a[300005], Pos[300005], m, n, q;
unsigned Stack[2005], STop(0);
unsigned A, B, C, D, TmpM;
unsigned PrA, PrB;
unsigned Cnt(0), Ans(0), Tmp(0);
char Use(0);
inline unsigned* f(const unsigned x, const unsigned y, const unsigned z) {
  return fPool + x * PrA + y * PrB + z;
}
signed main() {
  n = RD(), m = RD(), q = RD(), Use = RD(), B = min(m, (unsigned)max((double)m * m / 300001000, (m / sqrt(q))) + 1), A = m / B;
  PrB = B + 1, PrA = PrB * (A + 1);
  for (unsigned i(1); i <= n; ++i) Pos[RD()] = i;
  for (unsigned i(1); i <= m; ++i) a[i] = Pos[RD()];
  for (unsigned i(0); i < A; ++i) {
    memset(Len, 0, ((n + 1) << 2)), TmpM = 0;
    for (unsigned j(i), k = (i * B + 1); j < A; ++j) {
      unsigned* CuPo(f(i, j, 1));
      for (unsigned Cou(1); Cou <= B; ++Cou, ++k, ++CuPo) {
        unsigned Cur(a[k]), Pre(Len[Cur - 1] + 1);
        Len[Cur] = max(Pre, Len[Cur]), TmpM = max(TmpM, Len[Cur]);
        if (j > i) (*CuPo) = Len[Cur];
      }
      Mx[i][j] = TmpM;
    }
    unsigned* CuPo(f(i, A, 1));
    for (unsigned k(A* B + 1); k <= m; ++k, ++CuPo) {
      unsigned Cur(a[k]), Pre(Len[Cur - 1] + 1);
      Len[Cur] = max(Pre, Len[Cur]), (*CuPo) = Len[Cur];
    }
  }
  for (unsigned i(A - 1); i; --i) {
    memset(Len, 0, ((n + 1) << 2));
    for (unsigned j(i), k = ((i + 1) * B); ~j; --j) {
      unsigned* CuPo(f(A - j - 1, A - i, 1));
      for (unsigned Cou(1); Cou <= B; ++Cou, --k, ++CuPo) {
        unsigned Cur(a[k]), Pre(Len[Cur + 1] + 1);
        Len[Cur] = max(Pre, Len[Cur]);
        if (j < i) (*CuPo) = Len[Cur];
      }
    }
  }
  memset(Len, 0, ((n + 1) << 2));
  for (unsigned i(1); i <= q; ++i) {
    if (!Use) Ans = 0;
    C = (RD() ^ Ans), D = (RD() ^ Ans), Ans = 0;
    unsigned L((C + B - 2) / B), R(D / B);
    if (L >= R) {
      for (unsigned i(C); i <= D; ++i) {
        unsigned Cur(a[i]), Pre(Len[Cur - 1] + 1);
        Stack[++STop] = Cur, Ans = max(Ans, Len[Cur] = max(Len[Cur], Pre));
      }
      while (STop) Len[Stack[STop--]] = 0;
      printf("%u\n", Ans); continue;
    }
    --R, Ans = max(Ans, Mx[L][R]), C = (L * B) - C + 1, D -= (R + 1) * B;
    unsigned* CuPo(f(L, R + 1, 1));
    for (unsigned j(1), p(((R + 1)* B) + 1); j <= D; ++j, ++p, ++CuPo) {
      unsigned TheL(*CuPo), Le(a[p] - TheL + 1);
      Ans = max(Ans, TheL);
      Stack[++STop] = Le, Len[Le] = max(Len[Le], TheL);
    }
    for (unsigned j(1), p(L* B); j <= C; ++j, --p) {
      unsigned Cur(a[p]), Pre(Len[Cur + 1] + 1);
      Stack[++STop] = Cur, Ans = max(Ans, Len[Cur] = max(Len[Cur], Pre));
    }
    while (STop) Len[Stack[STop--]] = 0;
    CuPo = f(A - L, A - R, 1);
    for (unsigned j(1); j <= C; ++j, ++CuPo) Ans = max(Ans, *CuPo);
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```