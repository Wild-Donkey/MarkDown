# SP9070&P3515 避雷针

[直通车](https://www.luogu.com.cn/problem/SP9070)

## 前言

做 DP 最爽的不是 AC，而是不断地优化程序，每次达到更高的效率，都能收获非常浓烈的成就感。接下来的每代码, 至少能在某个 OJ 上 AC, 所以没有错误解法, 只有效率优劣之分.

## 题意

一个序列 $a$，求所有最小的自然数 $f_{i}$ 使得 $f_{i} + a_{i} \geq a_{j} + \sqrt{|i - j|}$。

## $O(n \sqrt n)$

这个题看起来像是 DP，但是式子里面有根号还是很不常见的。 有过几次根号分治的经验后，我觉得可以根号分治。

整理式子，$f_{i} + a_{i} - \sqrt{|i - j|} \geq a_{j}$，这时如果能每一个 $\sqrt{|i - j|}$ 值对应的应该是关于 $i$ 对称的连续区间，我们只要使得 $f_{i} + a_{i} - \sqrt{|i - j|}$ 的值大于等于这个区间的最大值即可，而这种区间的数量是 $O(\sqrt n)$ 个，提前 $O(n \log n)$ 预处理出 ST 表后，区间查询复杂度是 $O(1)$，总复杂度 $O(n \sqrt n)$，看了看 $5 * 10^5$，有概率能过。

虽然在 `Libre OJ` 上在 `-Ofast` 加持下拿到了 [AC](https://loj.ac/s/1171002)，在洛谷上开 `-O2` 却只有 [$70'$](https://www.luogu.com.cn/record/52290305)，只比不开 `-O2` 多了 $10'$。 因为 ST 表的常数比那个同为 $O(n \sqrt n)$ 的题解差的太多，所以无论如何也卡不到 $70'$ 以上。

(接近) 极限卡常代码:

```cpp
unsigned ST[20][500005], Square[1005], Bin[20], Log[500005], m, n;
const unsigned _1(1);
inline unsigned Qry(unsigned L, unsigned R) {
  register unsigned LogLen(Log[R - L + _1]);
  return std::max(ST[LogLen][L], ST[LogLen][R - Bin[LogLen] + 1]);
}
int main() {
  n = RD();
  for (register unsigned i(_1); i <= n; ++i) ST[0][i] = RD();
  for (register unsigned i(_1), j(0); i <= n; i <<= 1, ++j) Bin[j] = i, Log[i] = j;
  for (register unsigned i(_1); i <= n; ++i) Log[i] = std::max(Log[i], Log[i - _1]);
  for (register short i(_1); Square[i - _1] <= n; ++i) Square[i] = i * i;
  for (register unsigned i(_1); i <= Log[n]; ++i)
    for (register unsigned j(_1); j + Bin[i - _1] <= n; ++j) 
      ST[i][j] = std::max(ST[i - _1][j], ST[i - _1][j + Bin[i - _1]]);
  for (register unsigned i(_1), j, Tmp, Ans; i <= n; ++i) {
    Ans = ST[0][i];
    if(i ^ _1) {
      j = _1, Tmp = i - _1;
      for (; Square[j] < i - _1; Tmp = i - Square[j] - _1, ++j)
        Ans = std::max(Ans, j + Qry(i - Square[j], Tmp));
      Ans = std::max(Ans, j + Qry(_1, Tmp));
    }
    if(i ^ n) {
      j = _1, Tmp = i + _1;
      for (; i + Square[j] < n; Tmp = i + Square[j] + _1, ++j)
        Ans = std::max(Ans, j + Qry(Tmp, i + Square[j]));
      Ans = std::max(Ans, j + Qry(Tmp, n));
    }
    printf("%u\n", ((Ans < ST[0][i]) ? 0 : Ans - ST[0][i]));
  }
  return Wild_Donkey;
}
```

## $O(n\sqrt n)$-改

重新审视这个约束式子:

$$
f_{i} + a_{i} \geq a_{j} + \sqrt{|i - j|}
$$

我们发现如果要求 $f_{i}$，只需要求 $f_i + a_i$ 即可，而这样我们需要知道所有 $j \in [1, n]$ 的 $a_j + \sqrt{|i - j|}$ 的最大值,分为两种情况来求:

- $j \in [1, i]$

- $j \in (i, n]$

拿第一种情况举例子，因为问题对称所以不失一般性，我们可以在第二种情况使用同样的方法。

我们发现 $i$ 变成 $i + 1$，$a_{j} + \sqrt{|i - j|}$ 的值会有 $\sqrt i$ 个发生改变 ($+1$)，所以每次 $i$ 的移动我们在原数组的副本中修改这 $\sqrt i$ 个值，与此同时维护最大值即可。

对于 $i + 1$ 来说，最大值可以由 $i$ 那里继承过来，因为所有 $j \in [1, i]$ 的值在 $i + 1$ 这一轮都不会变小，而且变大的情况我们在维护时就考虑了，唯一一个增加元素 $j = i + 1$ 也可以 $O(1)$ 统计。 

就在我绞尽脑汁优化把我的技能榨干还只能在 `-Ofast` 加持下在 `Libre OJ` 上超时挂到 [76'](https://loj.ac/s/1171077) 的时候，我在洛谷就以相同的代码仅开 `-O2` 以极高的效率 AC 了此题，只用了 [$1.85s$](https://www.luogu.com.cn/record/52305336)，不过关上 `-O2` 直接 TLE 到 [$60'$](https://www.luogu.com.cn/record/52305408)。

即使如此，SPOJ 把时间丧心病狂地开到了 $205ms$，一个 $O(n \sqrt n)$ 的算法铁定是过不了的......吗?

[但是上面的代码过于头铁还是 AC 了](https://www.luogu.com.cn/record/52305568)，甚至只用了 $3.70s$ 就过了 $20$ 个点 (又交了一发 $3.65s$，发现 SP 上时限是 $1s$，洛谷管理有看到的更新一下 Remote Judge 信息)，最离谱的是 SP 没有 `-O2` 选项，真是太恐怖了。 (可能是因为我晚上交的，这时候西方貌似是上午，而清晨一般是评测机最闲的时候)

$$
信息学奥赛果然是玄学
$$

所以接下来短短 $23$ 行，你们将看到一个工程学奇迹，这是实实在在顶着上限跑，一点枝没剪，暴力地枚举 $5e8$ 只用 $500ms$ 的怪物 ($\approx 2n \sqrt n$):

```cpp
unsigned a[500005], Fst[500005], Scd[500005], Square[1005], Ans[500005], m, n;
signed main() {
  n = RD();
  for (register unsigned i(0x1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(0x1); Square[i - 0x1] <= n; ++i) Square[i] = i * i;
  memcpy(Fst, a, (n + 0x1) << 0x2);
  for (register unsigned i(0x1), j; i <= n; ++i) {
    Scd[i] = std::max(Scd[i - 0x1], Fst[i]), j = 0x0;
    for (; Square[j] + 0x1 < i; ++j)
      Scd[i] = std::max(Scd[i], ++Fst[i - Square[j] - 0x1]);
  }
  memcpy(Fst, a, (n + 0x1) << 0x2);
  memcpy(Ans, Scd, (n + 0x1) << 0x2);
  for (register unsigned i(n), j; i; --i) {
    Scd[i] = Scd[i + 0x1], j = 0x0;
    for (; i + Square[j] < n; ++j)
      Scd[i] = std::max(Scd[i], ++Fst[i + Square[j] + 0x1]);
    Ans[i] = std::max(Scd[i], Ans[i]);
  }
  for (register unsigned i(0x1); i <= n; ++i)
    printf("%u\n", Ans[i] - a[i]);
  return Wild_Donkey;
}
```

跳着阅读的同学注意了，如果你希望通过这道题，那么你可以止步于此了，因为上面的代码最慢的点可以在时间限制的一半左右跑完。

## $O(n \sqrt n)$-Pro

仍然分析这两种情况:

- $j \in [1, i]$

  假设这时取到 $a_{j} + \sqrt{i - j}$ 的最大值的 $j = k$，则 $a_{j} + \sqrt{i - j + 1}$ 最大值的 $j \geq k$，这是因为对于越接近 $i$ 的 $j$，$\sqrt{i - j}$ 的大小随 $i$ 的增长而增长的速率越快，所以更大的 $j$，$\sqrt{i - j}$ 增长更快，才可能成为最大值。

- $j \in (i, n]$

  同样地，对于使得 $a_{j} + \sqrt{j - i + 1}$ 取最大值的 $j$ 一定不大于使得 $a_{j} + \sqrt{j - i}$ 取最大值的 $j$。

对于同一个 $j < i$，如果有 $i' > i$，那么一定有 $\sqrt{|i - j|} < \sqrt{|i' - j|}$。这时可以断定，对于在 $i$ 左边的所有 $j$，$a_{j} + \sqrt{|i - j|}$ 的最大值一定不比 $a_{j} + \sqrt{|i' - j|}$ 大。

同样的，如果有 $i' < i$，那么对一切 $j > i$，一定有 $a_{j} + \sqrt{|i - j|}$ 的最大值一定不比 $a_{j} + \sqrt{|i' - j|}$ 大。

这就是我们所说的决策单调性。

剪枝，枚举时维护一个指针 $But$，每次从这里作为维护的边界，虽说复杂度没变，但是应付随机数据大概率能比 $O(n \log n)$ 跑满都快。

加上剪枝，LOJ 还是过不了，不过拿了 $86'$，多了 $10'$，但是洛谷这边总时间优化到了 $1.4s$，最慢的点已经能控制在时限一半以下了。

```cpp
unsigned a[500005], Fst[500005], Scd[500005], Square[1005], Ans[500005], m, n;
signed main() {
  n = RD();
  for (register unsigned i(0x1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(0x1); Square[i - 0x1] <= n; ++i) Square[i] = i * i;
  memcpy(Fst, a, (n + 0x1) << 0x2);
  for (register unsigned i(0x1), j, But(1); i <= n; ++i) {
    Scd[i] = std::max(Scd[i - 0x1], Fst[i]), j = 0x0;
    for (; But + Square[j] < i; ++j)
      if(Scd[i] < ++Fst[i - Square[j] - 0x1])
        But = i - Square[j] - 0x1, Scd[i] = Fst[But];      
    if(Fst[i] == Scd[i]) But = i;
  }
  memcpy(Fst, a, (n + 0x1) << 0x2);
  memcpy(Ans, Scd, (n + 0x1) << 0x2);
  for (register unsigned i(n), j, But(n); i; --i) {
    Scd[i] = Scd[i + 0x1], j = 0x0;
    for (; i + Square[j] < But; ++j)
      if(Scd[i] < ++Fst[i + Square[j] + 0x1])
        But = i + Square[j] + 0x1, Scd[i] = Fst[But];
    Ans[i] = std::max(Scd[i], Ans[i]);
  }
  for (register unsigned i(0x1); i <= n; ++i)
    printf("%u\n", Ans[i] - a[i]);
  return Wild_Donkey;
}
```

## $O(n \log n)$

虽然能过，但是复杂度终究是王道，接下来参考[这篇题解](https://www.luogu.com.cn/blog/wby1427421659/lightning-conductort-ti-xie)，介绍一下 $O(n \log n)$ 的做法。

根据前面得到的决策单调性，我们可以分治来 $O(n \log n)$ 地解决本题，仍然只讨论左边的情况。

规定一个状态 $i$ 的决策是对于 $j \in [1, i)$ 使得 $a_{j} + \sqrt{|i - j|}$ 取最大值的 $j$。

假设这时已知 $L$ 的决策 $l$ 和 $R$ 的决策 $r$，这时对于所有 $i \in [L, R]$，他们的决策 $j$ 一定满足 $\in [l, r]$。

这时我们取 $L$，$R$ 的中点 $Mid$，$O(n)$ 枚举所有 $j \in [l, r]$ 求出 $Mid$ 的决策 $m$，这时就可以向下递归下去了。

由主定理得总复杂度 $O(n \log n)$。

```cpp
unsigned a[500005], SqRoot[500005], Ans[500005], m, n;
double Max[500005];
char Flg(0); 
void Merge(unsigned L, unsigned R, unsigned DL, unsigned DR) {
  if(L == R) {
    if(Flg) {
      DL = std::max(L, DL);
      for (register unsigned i(DL); i <= DR; ++i)
        Max[L] = std::max(Max[L], a[i] + sqrt(i - L));
    } else {
      DR = std::min(L, DR);
      for (register unsigned i(DL); i <= DR; ++i)
        Max[L] = std::max(Max[L], a[i] + sqrt(L - i));
    }
    Ans[L] = std::max((unsigned)(Max[L] + 0.999999), Ans[L]);
  } else {
    register unsigned Mid((L + R) >> 0x1), mid, Border;
    if(Flg) {
      Border = std::max(Mid, DL);
      for (register unsigned i(Border); i <= DR; ++i)
        if(Max[Mid] < a[i] + sqrt(i - Mid))
          Max[Mid] = a[i] + sqrt(i - Mid), mid = i;
    } else {
      Border = std::min(Mid, DR);
      for (register unsigned i(Border); i >= DL; --i)
        if(Max[Mid] < a[i] + sqrt(Mid - i))
          Max[Mid] = a[i] + sqrt(Mid - i), mid = i;
    }
    Ans[Mid] = std::max((unsigned)(Max[Mid] + 0.999999), Ans[Mid]);
    if(L ^ Mid) Merge(L, Mid - 0x1, DL, mid);
    Merge(Mid + 0x1, R, mid, DR);
  }
}
signed main() {
  n = RD();
  for (register unsigned i(0x1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(0x1); i * i <= n; ++i) SqRoot[i * i + 0x1] = i + 0x1;
  for (register unsigned i(0x1); i <= n;++i) SqRoot[i] = std::max(SqRoot[i - 0x1], SqRoot[i]);
  Merge(0x1, n, 0x1, n);
  memset(Max, 0x00, (n + 0x1) << 0x3);
  Flg = 0x1;
  Merge(0x1, n, 0x1, n);
  for (register unsigned i(0x1); i <= n; ++i)
    printf("%u\n", Ans[i] - a[i]);
  return Wild_Donkey;
}
```

洛谷不开 `-O2` 的总时间是 $547ms$，非常大的进步。

## 后记

这时我 AC 的第 $30$ 和 $31$ 道紫题 (可能更多，因为不少紫题掉蓝了)，也是我在洛谷做的第 $332$，$333$ 道题，最后给出[双倍经验](https://www.luogu.com.cn/problem/P3515)。

$$
撒花
$$