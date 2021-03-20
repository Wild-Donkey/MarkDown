# 四边形不等式 (Optimization of Quadrilateral Inequality)

最近有一外国小伙发明了一种动态规划的优化方式, 称之为 `四边形不等式优化`, 小编也不知道为什么它叫四边形不等式, 但是事实就是这样, 小编也很疑惑, 本篇记录线性 DP 的优化方式

## 定义

定义某函数 $f_{i, j}$, 使其满足

$$
f_{a, c} + f_{b, d} \leq f_{a, d} + f_{b, c}
$$

其中, $a \leq b \leq c \leq d$ 则称这个函数满足四边形不等式

用数学归纳法可以由以下式子推得

$$
f_{a, b} + f_{a + 1, b + 1} \leq f_{a, b + 1} + f_{a + 1, b}
$$

推导过程略

## 应用

如果有 DP 方程

$$
f_i = min(f_j + g_{i, j})
$$

只要 $g_{i, j}$ 满足四边形不等式, 则这个问题具有决策单调性

决策单调性即对于阶段 $i$, 假设其最优决策为 $j$ 则一定有阶段 $i + 1$ 的最优决策 $j' \geq j$

## 证明

引入辅助数组 $p_i$ 表示第 $i$ 个阶段的最优决策

则对 $j \in [1, p_i)$ 有

$$
f_{p_i} + g_{p_i, i} \leq f_{j} + g_{j, i}
$$

设 $i' \in (i, n]$, 则 $j \leq p_i \leq i \leq i'$, 由四边形不等式得:

$$
g_{j, i} + g_{p_i, i'} \leq g_{j, i'} + g_{p_i, i}
$$

整理得

$$
g_{p_i, i'} - g_{p_i, i} \leq g_{j, i'} - g_{j, i}
$$

于是有

$$
f_{p_i} + g_{p_i, i'} \leq f_{j} + g_{j, i'}
$$

说明对于阶段 $i'$, 决策 $p_i$ 由于其前面的所有决策, 也就是说一次决策后, 所有候选决策 $j \in [1, p_i)$ 都变成无用决策

## 实现

维护数组 $p_i$, 第 $i$ 阶段选择最优决策 $p_i$ 后修改 $i' \in (i, n]$ 的 $p_{i'}$ 值为 $p_i$

由于决策单调性, 数组 $p$ 单调递增, 一个决策 $j$ 作为最优决策的阶段一定是连续的区间, 所以为了优化时间复杂度, 只按区间记录数组 $p$

对于每个阶段 $i$, 由于前面 $[1, i)$ 的决策作为最优决策的阶段已经被记录在 $p$ 内了, 所以当前 $p_i$ 一定是 $i$ 的最优决策, 直接转移, O(1)

接下来, 尝试寻找 $i$ 作为最优决策的阶段, 已经记录了若干区间的最优决策. 由决策单调性可知, 一定存在一个断点 $k$, 使得它前面的阶段, 最优决策在 $[1, i)$; $k$ 和它后面的阶段, $i$ 不劣于 $[1, i)$ 的任意决策

所以这时区间分为三类

* 第一类, 整个区间在 $k$ 之前, 这种区间无需操作, $O(0)$
* 第二类, 整个区间在 $k$ 之后, 即起点以 $i$ 为决策不会更劣, 这种区间直接删除. 由于共有 $n$ 个决策, 每个决策之多入队一次, 所以均摊 $O(1)$
* 第三类, 区间包含 $k$, 即起点以 $i$ 为决策更劣, 终点以 $i$ 为决策不会更劣. 二分查找 $k$, 将右端点改为 $k - 1$, 在它后面新建一个区间 $[k, n]$, 最优决策暂时赋值为 $i$, $O(logn)$

## 例题 [P1912-NOI2009 诗人小G](https://www.luogu.com.cn/problem/P1912)

$n$ 个长度不超过 $30$ 的句子, 若干句子写在一行, 空格隔开 (长度为 $1$). 每首诗有属性 $L$, $P$. 定义不协调度为每行的实际长度和 $L$ 的差的绝对值的 $P$ 次方的总和, 即

$$
\sum_{i = 1}^{n} |L - L_i|^P
$$

求最小的不协调度并输出方案, $T$ 组数据

$T \leq 5, n \leq 10^5, L \leq 3*10^6, P \leq 10$

## 推导

设计状态 $f_i$ 表示考虑句子 $[1, i]$ 的不协调度. 设 $sum_i$ 为从长度前缀和, 则有

$$
f_i = min(f_j + |sum_i - sum_j + i - j - 1 - L|^P)
$$

设 $g_{j, i} = |sum_i - sum_j + i - j - 1 - L|^P$, 若 $Sum_i = sum_i + i$, 则有 $g_{i, j} = |Sum_i - Sum_j - 1 - L|^P$

**证明 $g_{j, i}$ 满足四边形不等式**

即证明式子

$$
g_{j, i} + g_{j + 1, i + 1} \leq g_{j, i + 1} + g_{j + 1, i}
$$

设 $a = Sum_i - Sum_j - L - 1$, $b = Sum_i - Sum_{j + 1} - L - 1 = a - L_j - 1 < a$, 则 $g_{j, i} = |a|^P$, $g_{j + 1, i} = |b|^P$, $g_{j + 1, i + 1} = |b + L_{i + 1} + 1|^P$, $g_{j, i + 1} = |a + L_{i + 1} + 1|^P$, 将原式整理成

$$
|a|^P + |b + L_{i + 1} + 1|^P \leq |b|^P + |a + L_{i + 1} + 1|^P
$$

移项

$$
|a|^P - |a + L_{i + 1} + 1|^P \leq |b|^P - |b + L_{i + 1} + 1|^P
$$

由于 $a > b$, 转化为证明函数 $|x|^P - |x + k|^P$ 的单调性, 只要单调递减, 说明 $g_{j, i}$ 满足四边形不等式

数形结合, 很形象地看出指数为正的幂函数的斜率随着 $|x|$ 的增长而增长, 所以对于正值 $p$, 有 $|x + k|^P - |x|^P$ 单增, 即 $|x|^P - |x + k|^P$ 单减.

现在主流的证法是求导, 分类讨论较为复杂, 所以导数证明本篇略

因此 $g_{j, i}$ 满足四边形不等式, 本题满足单调性

### 代码

本题有多组数据, 首先预处理 + 清数组

```cpp
inline void Clr() {
  n = RD();
  L = RD();
  P = RD();
  flg = 0;
  He = 1;  // 队列
  Ta = 1;
  Li[1].Adre = 0;  // 从 0 转移
  Li[1].l = 1;
  Li[1].r = n;
  f[0] = 0;  // 阶段 0 是 0
  Sum[0] = 0;
  char chtmp(getchar());
  for (register unsigned i(1); i <= n; ++i) {
    while (chtmp < 33 || chtmp > 127) {
      chtmp = getchar();
    }
    a[i] = 0;
    while (chtmp >= 33 && chtmp <= 127) {
      Poem[i][a[i]++] = chtmp;
      chtmp = getchar();
    }
  }
  return;
}
```

这里用了逐字符输入, 就可以在输入的同时统计长度, 不用再用 `strlen()` 再扫一遍. 这里避免了对数组的 `memset()` 虽然已经处理了边界, 但是在比赛中不建议省略

然后是快速幂和转移

```cpp
#define Abs(x) ((x) > 0 ? (x) : -(x))
#define Do(x, y) (f[(x)] + Power(Abs(Sum[y] - Sum[x] - 1 - L), P))
inline long double Power(long double x, unsigned y) {
  if (!y) {
    return 1;
  }
  if (y & 1) {
    return Power(x * x, y >> 1) * x;
  }
  return Power(x * x, y >> 1);
}
```

$p$ 数组区间的维护, 检查新转移的 $x$ 作为最优决策的阶段, 删除被 $x$ 淘汰的区间, 并且把过时的区间删除

```cpp
void Best(unsigned x) {
  while (He < Ta && Do(Li[Ta].Adre, Li[Ta].l) >=
                        Do(x, Li[Ta].l)) {  // 决策 x 对于区间起点表示的阶段更优
    --Ta;                                   // 整个区间无用
  }
  if (Do(Li[Ta].Adre, Li[Ta].r) >=
      Do(x, Li[Ta].r)) {  // 决策 x 对于区间终点更优 (至少一个阶段给 x)
    Bin(x, Li[Ta].l, Li[Ta].r);
  } else {
    if (Li[Ta].r != n) {
      ++Ta;
      Li[Ta].l = Li[Ta - 1].r + 1;
      Li[Ta].r = n;
      Li[Ta].Adre = x;
    }
  }
  while (He < Ta && Li[He].r <= x) {  // 过时决策
    ++He;
  }
  Li[He].l = x + 1;
  return;
}
```

二分查找, 查找断点, 并且建立 $x$ 对应的区间

```cpp
inline void Bin(unsigned x /*新决策下标*/, unsigned le,
                unsigned ri) {  // 区间内二分查找
  if (le == ri) {               // 新增一个区间
    Li[Ta].r = le - 1;
    Li[++Ta].l = le;
    Li[Ta].r = n;
    Li[Ta].Adre = x;
    return;
  }
  unsigned m((le + ri) >> 1);
  if (Do(x, m) <= Do(Li[Ta].Adre, m)) {  // x 作为阶段 mid 的决策更优
    return Bin(x, le, m);
  }
  return Bin(x, m + 1, ri);
}
```

输出, 递归的方式倒序输出, `Prt[x]` 是转移时记录的路径, 由于每组测试数据没有对 `Poem` 进行 `memset`, 所以必须根据记录的长度进行输出, 否则会输出过长, `short` 控制内层循环对常数进行优化

```cpp
inline void Print() {
  Cnt = 0;
  Prt[0] = 0;
  Back(n);
  return;
}
inline void Back(unsigned x) {
  if (Prt[x]) {
    Back(Prt[x]);
  }
  for (register unsigned i(Prt[x] + 1); i < x; ++i) {
    for (register short j(0); j < a[i]; ++j) {
      putchar(Poem[i][j]);
    }
    putchar(' ');
  }
  for (register short i(0); i < a[x]; ++i) {
    putchar(Poem[x][i]);
  }
  putchar('\n');
}
```

最后是注释相对充足的主函数

```cpp
int main() {
  t = RD();
  for (register unsigned T(1); T <= t; ++T) {
    Clr();
    for (register unsigned i(1); i <= n; ++i) {
      Sum[i] = Sum[i - 1] + a[i] + 1;
    }
    for (register unsigned i(1); i < n; ++i) {
      f[i] = Do(Li[He].Adre, i);  // 从已经求出的最优决策转移
      Prt[i] = Li[He].Adre;
      Best(i);  // 更新数组 p
    }
    f[n] = Do(Li[He].Adre, n);  // 从已经求出的最优决策转移
    Prt[n] = Li[He].Adre;
    if (f[n] > 1000000000000000000) {  // 直接溢出
      printf("Too hard to arrange\n");
    } else {
      printf("%lld\n", (long long)f[n]);
      Print();
    }
    for (register short i(1); i <= 20; ++i) {
      putchar('-');
    }
    if (T < t) {
      putchar('\n');
    }
  }
  return Wild_Donkey;
}
```

由于调试用了较长时间, 所以本题代码一度达到 $5.32KB$ [(记录)](https://www.luogu.com.cn/record/48058572), 第一次 AC 时也有足足 $5.15KB$, 时间达到 $3.14s$, 行业里一般用 "[屎山](https://www.luogu.com.cn/record/48096505)" 形容此类代码. 随后, 无所不用其极地优化, 提交了一页多, 最终优化到了 $626ms$, 坐上了最优解的[榜首](https://www.luogu.com.cn/record/48102166) (03-19-2021)