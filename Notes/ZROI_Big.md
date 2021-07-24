# ZROI

## Day1: 倍增

令人疑惑的一天, 我还不如去卷题.

### RMQ (Range Maximum/Minimum Query)

区间查询最大/小值.

* ST (Sparse Table)

  过水已隐藏

* 线段树

  过水已隐藏

### 快速幂

过水已隐藏

### LCA (Lowest Common Ancestor)

#### 查询

* 倍增

  过水已隐藏

* ST

  把树拍成欧拉序 (Euler Tour), 然后用 ST 表维护并查询最小深度的节点.

  每个点第一次出现是第一次 DFS 遍历到它的时候, 每个点后面的出现次数是它儿子的子树 DFS 结束的时候. 每次查询 LCA, 求欧拉序种两个点第一次出现的位置这个区间中深度最小的节点.
  
  正确性是因为这两个点中间的位置分别是前一个点的子树中的节点和它们 LCA 的部分子树还有这两点之间的路径, 其中, 这条路径包含 LCA, 并且 LCA 是最浅的节点, 并且其它节点都在 LCA 子树内, 深度都比它大, 所以这个深度最小的点就是 LCA.

  根据这个结论, 我们不必将两个点第一次出现作为左右端点, 只要随便找出某个这两个点出现的位置即可.

  复杂度分析: 每个点遍历到和遍历完都会给欧拉序贡献一个长度, 所以欧拉序长度是 $O(n)$, DFS 遍历建立欧拉序的复杂度同样是 $O(n)$, 并且 ST 表的复杂度是 $O(n\log n)$ 预处理, $O(1)$ 查询, 所以算法复杂度是 $O(n\log n + q)$.

#### 应用

* 树上两点距离

  过水已隐藏

* 树上两点间路径信息统计

  过水已隐藏

### 树上路径修改

用 LCA + 树上差分维护, DFS 统计权值.

细节过水已隐藏.

### [AT2693](https://atcoder.jp/contests/abc070/tasks/abc070_d)

给一棵边带权的树, 规定根为 $K$, 每次询问 $x$, $y$ 经过 $K$ 的最短距离. 这时规定一个点的深度为到 $K$ 的路径的边权和. 每次查询输出 $x$, $y$ 的深度和即可.

### 例2

给定一棵边带权的树, 询问 $x$ 到 $y$ 路径上边权的最小值.

$n, m \leq 10^5$, $边权 \leq 10^9$

求 LCA 的同时统计信息 (貌似只能倍增), 过水已隐藏.

### 例3: [CF609E](https://codeforces.ml/contest/609/problem/E)

给一个边带权无向图, 求强制选择某条边的时候, 最小生成树边权总和.

先求最小生成树, 如果选定边本来就在树中, 则直接输出最小生成树权值. 否则选一点为根, 求选定边的两端点在最小生成树上的路径中权值的最大值, 删除这个权值, 将选定边的权值统计入答案即可.

### 例4: [HDU3183](https://acm.hdu.edu.cn/showproblem.php?pid=3183)

每个测试点给一个 $1000$ 位以内的整数, 要求删除 $m$ 位, 使得结果最小.

每次从左往右扫, 如果当前位比下一位大, 删除这一位, 删完 $m$ 位为止. 如果当前位更小, 则当前位往后移一位, 继续判断.

错误: 我竟然再次用 `char` 存整数...

### 例5: [POJ3419](http://poj.org/problem?id=3419)

[LOJ 传送门](https://loj.ac/p/10121)

询问区间最长无重复元素的子段长度.

首先可以用双指针, 线性地处理出每个位置为左端点, 不重复的极长连续段长度 $f_{i, 0}$.

然后对 $f$ 建立最大值 ST 表.

接下来, 使用二分答案, 二分最长段的长度 $x$. `Judge()` 函数很简单, 只要查询 $[L, R - x + 1]$ 区间内的长度最大值是否大于 $x$ 即可.

## Day2: 线段树&树状数组

### 区间查询-不修改-线段树

过水已隐藏 (还不如前缀和)

### 区间查询-单点修改-线段树

过水已隐藏 (还不如树状数组)

### 区间查询-区间修改-线段树

过水已隐藏

### 树状数组 (BIT)

其实就是线段树将右子树统统删除.

功能: 区间查询, 单点修改; 单点查询, 区间修改

过水已隐藏

### 例1

给定一个长度为 $n$ 的排列 $p$, 求将其冒泡排序所需要交换的次数.

$n \leq 10^5$

这题就是求数字右边比它小的数字数量和, 需要从右往左扫描并维护右边的不同数字出现个数, 进行单点修改, 并且区间查询.

使用权值树状数组, 值域如果较大, 可以使用动态开点线段树或离散化 + 树状数组.

### 例2: [P4868](https://www.luogu.com.cn/problem/P4868)

定义 "前前缀和" 为前缀和的前缀和, 维护一个序列, 要求:

- 单点修改

- 单点查询前前缀和

单点修改相当于对前缀和的区间修改, 单点查前前缀和相当于对前缀和区间查询, 所以我们可以直接对前缀和建立线段树, 然后进行区间修改和查询.

### 例3: [POJ2155](http://poj.org/problem?id=2155)

给一个 0/1 矩阵, 实现:

- 矩形取反

- 单点查询

显然, 这个题需要差分+前缀和, 但是如何维护二维前缀和呢?

维护一个差分数组 $f_{i, j}$ 表示点 $(i, j)$ 后面所有的数取反次数, 所以这个数字是 $0$ 或 $1$.

一个点 $(x, y)$ 当前的值就是初始值取反 $\displaystyle{(\sum_{i = 1}^{x}\sum_{j = 1}^{y} f_{i, j}) \% 2}$ 次.

发现只要求异或和即可.

使用二维树状数组, 其每一维的定义和一维树状数组一样, 相当于树状数组套树状数组. $Tr_{i, j}$ 表示 $(i - lowbit(i), i]$ 行的 $(j - lowbit(j), j]$.

### 例4: [CF1527E](https://codeforces.com/contest/1527/problem/E)

给一个序列, 要求将其分成 $m$ 段, 使得每段权值和最小.

一个段的权值定义为: 一个段的所有出现过的元素第一次出现和最后一次出现的权值和, 如 `1 1 2 1` 的权值是 $3$. 长度 $n \leq 3.5 * 10^4$, 段数 $m \leq 100$

设计状态 $f_{i, j}$ 表示前 $i$ 位, 分成 $j$ 段的最小权值. 设 $g_{i, j}$ 表示区间 $[i, j]$ 这一段的权值.

这样就能写出方程:

$$
f_{i, j} = \min (f_{k, j - 1} + g_{k + 1, i})
$$

$O(n)$ 处理数组 $Pre_i$ 表示 $a_i$ 前面第一个和 $a_i$ 相同的元素下标.

这样, $g_{i, j}$ 可以递推地 $O(n^2)$ 求出, 状态 $O(nm)$, 转移 $O(n)$, 复杂度 $O(n^2m)$.

### 例5

维护一个长度为 $n$ 的数组 $a$, 支持:

- 单点修改

- 给定 $l$, $r$, 查询 $max(a_y - a_x) (l \leq x < y \leq r)$

$n \leq 10^5$

非常容易想到 $O(nm\log n)$ 的方法, 线段树维护最大/小值, 每次询问枚举区间断点.

在维护最小/大值的时候, 发现可以顺便维护答案 $Val$, 对于叶子节点, $Val$ 显然等于 $0$, 因为没有合法 $x, y$, 对于一般节点, $Val = \max(Val_{LS}, Val_{RS}, Max_{RS} - Min_{LS}$.

这棵线段树可以做到 $O(n)$ 预处理, $O(logn)$ 修改.

询问可以优化到 $O(logn)$. 像普通查询一样, 查询三个值, 分别是 $[l, r]$ 区间内的 $Min$, $Max$ 和 $Val$, 合并方式和前面预处理相同.

### 例5-Plus: [POJ3728](http://poj.org/problem?id=3728)

给一棵点带权树, 每次查询 $(l, r)$ 路径上的点对 $(x, y)$ 的 $max(a_y - a_x)$ (路径上 $x$ 在 $y$ 之前).

首先根据上一个题的思路推广, 因为我们只要判断两个点在路径上的相对方向, 不用判断距离, 所以可以使用树链剖分, 细节非常复杂, 需要判断这一段重链在路径中的方向是向上还是向下, 还需要合并重链信息, 复杂度 $O(mlog^2n)$.

发现此题不需要修改, 所以可以使用倍增求 LCA 的过程, 维护路径信息, 合并方式和线段树一样, 细节数骤降. 不过仍然需要分辨垂直链的方向, 维护双份的 $Val$.

### 例6: [HDU6315](http://acm.hdu.edu.cn/showproblem.php?pid=6315)

给两个序列, 长度都是 $n$, $a$ 一开始都是 $0$, $b$ 是 $[1, n]$ 的排列, 要求支持: 

- $a$ 区间加 $1$

- 区间查询 $\lfloor \frac{a_i}{b_i} \rfloor$

询问明显需要维护一个序列 $c$, 使得 $c_i = \lfloor \frac{a_i}{b_i} \rfloor$.

$c$ 数组的单点修改次数最多只有 $\displaystyle{q\sum_{i = 1}^n \frac 1i}$ 次, 在 $n \to \infin$ 时, 这个数的数量级小于等于 $m \log m$.

假设我们可以知道每一次修改会导致 $c$ 的哪些点发生变化, 就可以对这些点进行单点修改, 使用树状数组查询区间和即可, 因为最多修改 $m\log m$ 次, 每次单点修改复杂度 $O(\log n)$, 复杂度 $O(m \log m \log n)$.

接下来考虑如何知道哪些点会变化, 维护一个等待数组 $d$, $d_i$ 表示使得 $c_i$ 变化还需要的操作数. 显然, 初始 $a_i$ 都是 $0$, 所以 $d_i = b_i$, 接下来, 每次 $a_i$ 增加 $1$ 转化为 $d_i$ 减少 $1$. 线段树维护 $d_i$ 区间最小值, 如果有 $0$, 说明这时存在 $c$ 的元素应该增加 $1$ 了, 递归这个节点, 否则没有 $c$ 中元素需要改变.

复杂度方面可以将递归 $b$ 的最小值为 $0$ 的节点的复杂度分担到 $c$ 的单点修改上, 同样是单次 $O(\log n)$, 复杂度不变.

这样就可以总复杂度 $O(m \log m \log n)$ 地解决问题了.

### 例7: [HDU5634](http://acm.hdu.edu.cn/showproblem.php?pid=5634)

维护一个序列, 支持:

- 区间修改, 将区间中 $a_i$ 变成 $\phi(a_i)$.

- 区间赋值, $a_i$ 都变成整数 $x$.

- 区间求和

首先只考虑区间负赋值: 线段树维护最大/小值, 这样就能判断区间是否相等, 如果相等, 每个点用 $Val$ 表示自己区间的共同的元素. 这样一次赋值复杂度是 $O(\log n)$, 查询复杂度是 $O(log n)$.

既然值域是 $10^7$, 我们可以先线性求出所有 $\phi$ 备用, 这样就可以 $O(1)$ 查询 $\phi$.

接下来是区间取 $\phi$, 对于元素都相同的区间, 直接将 $Val$ 改成 $\phi(Val)$, 对于不同的区间, 打标记 $Tag$, 表示这个区间一共需要统一取 $Tag$ 次 $\phi$. 标记的下传也很简单, 只要对儿子做 $Tag$ 次打标记的操作即可. 单次修改仍然是 $O(\log n)$

最后是区间求和, 我们在元素统一的节点上直接统计, 否则下传标记, 直到统一元素为止.

复杂度的证明需要用到势能分析.

首先, 一个数 $x$ 连续取 $x = \phi(x)$ 直到 $x = 1$ 的次数的量级是 $\log x$. 证明如下:

- 对于偶数 $x$

  这时, 一定有 $\frac x2$ 的数字和 $x$ 有公因数 $2$, 所以 $\phi(x)$ 至多是 $\frac x2$

- 对于奇数 $x$

  我们回到定义式 $\displaystyle{\phi(x) = x\prod_i^{p_i | x}\frac {p_i - 1}{p_i}}$, 进行变形, $\displaystyle{\phi(x) = \bigg(x\prod_i^{p_i | x} \frac 1{p_i}\bigg)\bigg(\prod_i^{p_i | x}(p_i - 1)\bigg)}$. 我们知道, $\displaystyle{x\prod_i^{p_i | x} \frac 1{p_i}}$ 一定是奇数, 而 $\displaystyle{\prod_i^{p_i | x}(p_i - 1)}$ 一定是偶数, 所以 $\phi(x)$ 一定是偶数.

综上, 一个数 $x$ 连续取 $\phi$ 的次数最多是 $\log x$ 级别的.

势能的定义是这个节点一次查询最多消耗的时间复杂度, 而一个节点最多进行 $\log Max$ 次取 $\phi$, 就能变成最低势能. 而每次暴力取 $\phi$ (指查询的标记下传) 的复杂度是 $O(n)$, 所以初始势能应该是 $O(n \log Max)$. 而每次进行区间赋值, 会有 $\log n$ 级别的节点变成统一元素, 它的势能最多增加 $O(\log n\log Max)$. 这种操作最多会出现 $m$ 次, 所以算法复杂度是 $O((n + m \log n) \log Max)$.

### 例8: [CF1149C](https://codeforces.com/contest/1149/problem/C)

$n$ 个点, $m$ 个询问.

给你一棵树的括号序列, 输出它的直径.

有 $m$ 次询问, 每次询问表示交换两个括号, 输出交换两个括号后的直径 (保证每次操作后都为一棵树)

输出共 $m + 1$ 行.

$3 \leq n \leq 10^5$, $1 \leq q \leq 10^5$

定义括号序子段权值为它去掉匹配的括号后剩下的形如 `)))...)(...(((` 的序列长度.

将直径转化为括号序的权值最大的子段的权值, 因为括号序表示的是先序遍历这棵树的移动方向, `(` 表示向当前点的新的儿子移动, `)` 表示回到这个点的父亲. 一个括号序表示在树上的一条可重复经过每边的路径, 去掉匹配的括号相当于转化为从这个子段表示的路径起点移动到终点的路径, 它的长度也就是起点到终点简单路径长度. 权值最大的子段的权值也就是树上最长简单路径, 也就是树的直径.

线段树维护这个权值, 一个节点维护三个值: `LPls`, `RPls`, `LDif`, `RDif`. 其中, $LDif$ 表示节点区间 $[L, R]$ 的前缀 $[L, i]$ 中左括号减右括号的最大值, $RDif$ 指后缀 $[i, R]$ 的右括号减左括号的最大值; $LPls$ 和 $RPls$ 表示在 $LDif$ 或 $RDif$ 取最大值时的前/后缀长度.

接下来还需要维护一个指 $SumL$, 表示区间左括号总数, 这样就可以 $O(1)$ 推算出 $SumR$.

维护这 $4$ 个值也很简单：

- $LDif_{LS} \geq SumL_{LS} - SumR_{LS} + LDif_{RS}$ 

这时 $LDif = LDif_{LS}$, $LPls = LPls_{LS}$.

- $LDif_{LS} < SumL_{RS} - SumR_{LS} + LDif_{RS}$ 

这时 $LDif = SumL_{LS} - SumR_{LS} + LDif_{RS}$, $LPls = Len_{LS} + LPls_{RS}$.

对于 $RDif$ 和 $RPls$, 直接对称即可.

接下来, 统计答案, 一个节点的答案是 $Ans$, 转移需要讨论两种情况:

- 目标区间跨越了左右儿子

这时答案就是 $LDif_{RS} + RDif_{LS}$.

- 目标区间被某个儿子彻底包含

直接使 $Ans = max(Ans, Ans_{LS}, Ans_{RS})$ 即可.

这些值不是可以直接 $O(1)$ 推出, 就是可以直接用线段树维护, 所以总复杂度是 $O(m \log n)$, 代码也很简单, 因为查询区间都是 $[1, n]$, 所以无需写查询函数. 并且只需要单点修改即可, 所以无需使用 $Tag$.

## Day3: 模拟赛: Ⅰ

### T1: 模拟

一个字符矩阵, 从 $(1, 1)$ 走到 $(n, m)$, 只能往右和往下两个方向走, 也就是和 $(n, m)$ 的曼哈顿距离只能缩短.

求路径上的字符连成的字典序最小的字符串.

这道题类似于数字三角形, 将矩形的数组转化成三角形, 将矩阵分成 $n + m - 1$ 层, 每层只有最小值可以经过, 递推即可, 复杂度 $O(nm)$.

考场代码 $24'$:

```cpp
unsigned m, n, Cnt(0), A, B, C, D, t;
char a[2005][2005], b[2005][2005], Ans[4005], Min;
inline void Clr() {}
int main() {
  n = RD(), m = RD(); 
  for (register unsigned i(1); i <= n; ++i) {
    scanf("%s", a[i] + 1);
  }
  b[1][1] = 1;
  Ans[0] = a[1][1];
  for (register unsigned i(2), Tmp; i <= n; ++i) {
    Tmp = min(i, m), Min = 0x7f;
    for (register unsigned j(1); j <= Tmp; ++j) {
      if(b[i - j + 1][j - 1] | b[i - j][j]) {
        Min = min(a[i - j + 1][j], Min);
      }
    }
    Ans[i - 1] = Min;
    for (register unsigned j(1); j <= Tmp; ++j) {
      if(a[i - j + 1][j] == Min) {
        b[i - j + 1][j] = 1;
      }
    }
  }
  for (register unsigned i(2), Tmp; i <= m; ++i) {
    Tmp = (n + i > m) ? (n - m + i) : 1, Min = 0x7f;
    for (register unsigned j(n); j >= Tmp; --j) {
//      c[j][i - j + n] = i;
      if(b[j - 1][i - j + n] | b[j][i - j + n - 1]) {
        Min = min(Min, a[j][i - j + n]);
      }
    }
    Ans[n + i - 2] = Min;
    for (register unsigned j(n); j >= Tmp; --j) {
      if(a[j][i - j + n] == Min) {
        b[j][i - j + n] = 1;
      }
    }
  }
  printf("%s\n", Ans);
  return Wild_Donkey;
}
```

挂掉了, 原因是每层只是取了最小值, 但是没有考虑是否可以走, 加一个特判就过了.

死因:

```cpp
if(a[i - j + 1][j] == Min && (b[i - j + 1][j - 1] | b[i - j][j])) {
```

正解 $100'$:

```cpp
unsigned m, n, Cnt(0), A, B, C, D, t;
char a[2005][2005], b[2005][2005], Ans[4005], Min;
inline void Clr() {}
int main() {
  n = RD(), m = RD(); 
  for (register unsigned i(1); i <= n; ++i) {
    scanf("%s", a[i] + 1);
  }
  b[1][1] = 1;
  Ans[0] = a[1][1];
  for (register unsigned i(2), Tmp; i <= n; ++i) {
    Tmp = min(i, m), Min = 0x7f;
    for (register unsigned j(1); j <= Tmp; ++j) {
      if(b[i - j + 1][j - 1] | b[i - j][j]) {
        Min = min(a[i - j + 1][j], Min);
      }
    }
    Ans[i - 1] = Min;
    for (register unsigned j(1); j <= Tmp; ++j) {
      if(a[i - j + 1][j] == Min && (b[i - j + 1][j - 1] | b[i - j][j])) {
        b[i - j + 1][j] = 1;
      }
    }
  }
  for (register unsigned i(2), Tmp; i <= m; ++i) {
    Tmp = (n + i > m) ? (n - m + i) : 1, Min = 0x7f;
    for (register unsigned j(n); j >= Tmp; --j) {
      if(b[j - 1][i - j + n] | b[j][i - j + n - 1]) {
        Min = min(Min, a[j][i - j + n]);
      }
    }
    Ans[n + i - 2] = Min;
    for (register unsigned j(n); j >= Tmp; --j) {
      if(a[j][i - j + n] == Min && (b[j - 1][i - j + n] | b[j][i - j + n - 1])) {
        b[j][i - j + n] = 1;
      }
    }
  }
  printf("%s\n", Ans);
  return Wild_Donkey;
}
```

### T2: ~~贪心~~ 状压DP

$n$ 个杯子, 每个杯子都有水, 将水倒入别的杯子的花费不同, 要求使得 $m$ 个杯子有水, 也就是使 $n - m$ 个杯子无水.

由于数据范围很小, 一看就知道是 $O(2^n)$ 的算法. 但是突然想到贪心, 于是就放弃了状压. 排序所有边, 然后从小到大连接边, 暴力判断环的出现, 能得 $60'$.

但是

贪心假了, 参见这个数据:

```
5 2
0 58 69 23 64 
10 0 88 3 82 
73 48 0 42 12 
36 4 24 0 71 
36 97 72 100 0
```

答案应该是 `4->2`, `2->1`, `3->5`, 一共花费 $26$, 但是贪心 (消环) 的选择是 `2->4`, `3->5`, `1->4`, 结果是 $38$.

考场代码 $60'$:

```cpp
unsigned c[105][105], Contain[105][105], To[105], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
char Flg(0);
struct Edge {
  unsigned Value, From, To;
  const inline char operator <(const Edge &x) const{
    return this->Value < x.Value;
  }
}E[1005];
inline void Clr() {}
int main() {
  n = RD(), m = n - RD();
  for (register unsigned i(1); i <= n; ++i) {
    for (register unsigned j(1); j <= n; ++j) {
      if(i ^ j) {
        E[++Cnt].From = i, E[Cnt].To = j, E[Cnt].Value = RD();
      } else {
        RD();
      }
    }
  }
  for (register unsigned i(1); i <= n; ++i) {
    Contain[i][0] = 1, Contain[i][1] = i;
  }
  sort(E + 1, E + Cnt + 1);
  for (register unsigned i(1); (i <= Cnt) && m; ++i) {
    Flg = 0;
    if(!To[E[i].From]) {
      for (register unsigned j(1); j <= Contain[E[i].From][0]; ++j) {
        if(Contain[E[i].From][j] == E[i].To) {
          Flg = 1;
          break;
        }
      }
      if(!Flg) {
        To[E[i].From] = E[i].To, --m, Ans += E[i].Value;
        for (register unsigned j(Contain[E[i].To][0] + 1); j <= Contain[E[i].To][0] + Contain[E[i].From][0]; ++j) {
          Contain[E[i].To][j] = Contain[E[i].From][j - Contain[E[i].To][0]];
        }
        Contain[E[i].To][0] += Contain[E[i].From][0];
      }
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

状压的状态是用 $i$ 的某个二进制位是 $1$ 表示这个杯子无水, $0$ 表示有水, 边界条件是 $i = 0$.

一个状态 $i$ 只能从满足 $i|j = i$, $i ^ j = 2^q$ 的状态 $j$ 转移得到, 而容易知道这种 $j$ 一定满足 $j < i$.

从小到大枚举 $i$ 然后不断取 $i$ 的 $lowbit$, 和 $i$ 做 `^` 得到 $j$, 一共是 $O(n)$ 的状态可以转移到 $i$.

用合法的 $j$ 转移到 $i$ 的方式是枚举所有 $i$ 的 $0$ 位 $k$, 尝试将 $\log(j ^ i)$ 的水, 倒入 $k$ 位置, 这个位置有 $O(n)$ 种可能.

最后是用求好的 $f$ 数组求答案, 暴力枚举所有含有 $n - m$ 个 $1$ 的状态, 取最小值, $O(2^n)$.

所以转移是 $O(n^2)$, 状态数是 $O(2^n)$, 所以复杂度是 $O(n^22^n)$.

正解 $100'$:

```cpp
unsigned Log[4500000], N, c[105][105], f[4500000], m, n, Cnt(0), A, B, C, D, t, Ans(0x3f3f3f3f), Tmp(0);
char Flg(0);
inline void Clr() {}
inline unsigned Count (unsigned x) {
  register unsigned y(0);
  while (x) {
    x ^= lowbit(x), ++y;
  }
  return y;
}
int main() {
  n = RD(), m = n - RD(), N = (1 << n) - 1; 
  for (register unsigned i(0); i < n; ++i) {
    for (register unsigned j(0); j < n; ++j) {
      c[i][j] = RD();
    }
  }
  for (register unsigned i(1), j(0); j <= n; ++j, i <<= 1) {
    Log[i] = j;
  }
  memset(f, 0x3f, sizeof(f));
  f[0] = 0;
  for (register unsigned i(1), Tmp, Lbt; i <= N; ++i) {
    Tmp = i, Lbt = lowbit(Tmp);
    while (Tmp) {
      register unsigned j(i ^ Lbt), Tmpj((j ^ N) ^ Lbt), Lbtj = lowbit(Tmpj), Min(0x3f3f3f3f);
      while (Tmpj) {
        Min = min(Min, c[Log[Lbt]][Log[Lbtj]]);
        Tmpj ^= Lbtj, Lbtj = lowbit(Tmpj);
      }
      f[i] = min(f[i], f[j] + Min);
      Tmp ^= Lbt, Lbt = lowbit(Tmp);
    }
  }
  for (register unsigned i(0); i <= N; ++i) {
    if(Count(i) == m) {
      Ans = min(Ans, f[i]);
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

### T3: ~~组合数学~~ 又是 DP

一些数字随意插入到双端队列中, 问最长的上升子序列长度和得到这个长度的上升子序列的方案数 (每种放法的这个长度的上升序列数之和).

本来以为是插入排序那样的, 可以将数字随意组合, 所以写错了.

先考虑求长度.

我们假设一个数 $x$ 在上升子序列中, 尝试求仅考虑它和它后面插入的数字形成的最长的上升子序列. 这时尝试将序列分为三部分:

- 排在 $x$ 前面的数 (比 $x$ 小)

- 排在 $x$ 后面的数 (比 $x$ 大)

- $x$ 本身

求这三部分都很简单, 我们只要以插入顺序为下标, 求 $x$ 后面的比 $x$ 大的数的最长上升子序列和比 $x$ 小的数的最长下降子序列即可. (也就是倒着求以 $x$ 结尾的最长上升/下降子序列)

为了能够避免冗余计算, 我们按插入顺序倒序地枚举 $x$, 这样就能做到 $O(n \log n)$ 求了.

(获得成就: 又双叒叕重学 $O(n \log n)$ 求最长上升子序列)

对每一个 $x$ 求出这个值之后, 一定不影响得到正确答案, 因为答案中的最长上升子序列中第一个插入的值一定会被考虑到, 而这个 $x$ 仅考虑比它晚插入的元素的最长上升子序列就是答案.

接下来考虑方案数.

我们在枚举过程中考虑一个 $Cnt_i$, 表示长度为 $i$ 的序列一共有 $Cnt_i$ 种不同的情况.

最后将最长的 $i$ 对应的 $Cnt_i$ 乘上一个 $2^{n - i}$, 因为剩下的不在这个序列中的元素在插入时是随便放的.

### T4: 计算几何

一个棋盘上有一些点, 有一个多边形, 所有点都在整点上, 问这个多边形在棋盘内整点位置中, 不会覆盖任何点的位置数量. (覆盖包括边界接触)

知识盲区, 暂不整理.

## Day4: 线段树-Pro

### 乱炖

维护区间, 支持:

- 区间加

- 区间乘

- 区间赋值

- 查询区间立方和

只考虑查询区间加和, 需要维护三个 $Tag$, 加法, 乘法, 赋值, 每次打 $Tag$ 在维护区间的各种权值的同时更新那些优先级比它小的 $Tag$, 详情参见[线段树2](https://www.luogu.com.cn/problem/P3373).

[先考虑平方和](), 发现乘法 $Tag$ 和赋值 $Tag$ 可以直接维护, 所以只考虑加法 $Tag$.

$$
\sum(a_i + x)^2 = \sum {a_i}^2 + \sum x^2 + 2\sum a_ix
$$

所以每个区间维护两个值, $\sum a_i^2$ 和 $\sum a_i$, 每次下传时更新标记.

接下来, 考虑区间立方和, 同样是只需要考虑加法 $Tag$.

$$
\sum(a_i + x)^3 = \sum {a_i}^3 + 3\sum {a_i}^2x + 3 \sum a_ix^2 + \sum x^3
$$

所以每个节点维护三个值, $\sum {a_i}^3$, $\sum {a_i}^2$, $\sum a_i$.

我们甚至可以在树上维护链的这些信息, 参见 ICPC-2019-Shanghai-Outside-F.

### HDU 2019-MU-Day6-E 

二维平面内 $n$ 个点, 框一个矩阵, 使得框内权值最大. $n \leq 2000$

先离散化, 变成一个 $n * n$ 以内的矩阵.

很容易想到枚举 $y_1$, $y_2$ 作为纵坐标上下界, 在横坐标上线性求最大子段和, 所以复杂度为 $O(n^3)$.

尝试用线段树求最大子段和, 在枚举边界时, 在线段树上加入每一行的元素复杂度从 $O(1)$ 变成 $O(\log n)$. 但是我们可以同时维护区间和的最大子段和, 这样就不用 $O(n)$ 求最大子段和了, 可以在一行插入之后直接得到最大子段和.

### 线段树求 LIS

权值线段树, 维护对应权值为结尾的最长 LIS 长度. 每次插入一个数 $a_i$ 之前查询区间 $[1, a_i)$ 的最大值 $Max$, 尝试使用 $Max + 1$ 更新位置 $a_i$.

权值线段树一般伴随着离散化, 如果强制在线, 还可以结合动态开点.

复杂度 $O(n\log n)$.
<!-- 
### Nowcoder-2019-MU-Day1-I

平面上的点分成两部分 $A$, $B$, 每个点 $i \in A$ 的权值是 $a_i$, $i \in B$ 的权值是 $b_i$. 对于任意 $i \in A$, $j \in B$, 一定不存在 $x_i \geq x_j$ 并且 $y_i \leq y_j$. 也就是说 $A$ 中的点一定不会在 $B$ 中的点的右下方.

这样就能维护一条单调不降的折线, 划分整个矩阵, 左上是 $A$, 右下是 $B$, 尝试 DP.

设计状态 $f_{i, j}$ 表示纵坐标到了 $i$, 折线高度为 $j$ 的最大权值.

提前处理每一列 $a$, $b$ 的前/后缀和. 转移时 $O(1)$ 查询.

$$
f_{i, j} = \max (f_{i - 1, k} + \sum^{q \in [j, n]}a_q + \sum^{q \in [1, j)}b_q)
$$

状态数 $O(n^2)$, 转移复杂度 $O(n)$, 总复杂度 $O(n^3)$.

首先滚动数组, 因为 $f_{i, j}$ 只能由 $k \leq j$ 的状态 $f_{i - 1, k}$ 转移而来.

接下来考虑优化, 用线段树维护以 $j$ 为序的 $f_{j}$ 最大值, 每次转移时, 查询 $[1, j]$ 的最大值尝试更新 $f_{i}$. -->

### [P1486](https://www.luogu.com.cn/problem/P1486)

维护一个集合, 支持:

- 加入一个数字

- 全局加减

- 查询排名第 $k$ 的元素

- 将低于下界的元素删除

典型的权值线段树.

### HDU 2019-MU-Day3-G

一个序列, 求对于每一个 $i$, 第 $i$ 位保留, 在前缀 $[1, i)$ 中取尽量少的位置变成 $0$, 使得前缀 $[1, i]$ 的和不大于一个常数 $k$.

权值线段树上二分, 二分选择线段树上最右边的部分, 求总和 $SumBig$, 使得前缀和 $Sum - SumBig \leq k$. 统计这个部分的元素数量.

二分复杂度 $O(\log n)$, 线段树维护的复杂度也是 $O(\log n)$, 总复杂度 $O(n\log n)$.

### 动态开点线段树

过水已隐藏

### Nowcoder-2019-MU-Day7-E

维护一个集合, 支持:

- 插入 $[l, r]$ 的所有整数

- 查询中位数

动态开点权值线段树上二分.

### 矩形求并

过水已隐藏

### 线段树合并

过水已隐藏

### [CF600E](https://www.luogu.com.cn/problem/CF600E)

$n$ 个点的树, 每个点有颜色, 求每个节点的子树的出现最多的颜色的编号之和.

以颜色为序建立权值线段树, 从叶子往上合并, 同时统计答案, 均摊复杂度 $O(n \log^2 n)$.

也可以用数组 + 树上启发式合并来操作, 能达到 $O(n \log n)$ 的复杂度.

注意开 `long long`.

```cpp
unsigned m, n, Cnt(0), A, B, t, Tmp(0);
struct Tr; 
struct Edge {
  Tr *To;
  Edge *Nxt;
}E[200005], *CntE(E);
struct Node {
  Node *LS, *RS;
  unsigned Val;
  unsigned long long Pos;
}N[4000005], *CntN(N);
struct Tr {
  Node *Seg;
  Edge *Fst;
  Tr *Fa;
}T[100005], *C, *D;
void Link(Tr *x, Tr *y) {
  (++CntE)->Nxt = x->Fst;
  x->Fst = CntE;
  CntE->To = y;
}
void Insert (Node *x, unsigned L, unsigned R) {
  x->Val = 1, x->Pos = A;
  if(L == R) return;
  register unsigned Mid((L + R) >> 1);
  if(A <= Mid) Insert(x->LS = ++CntN, L, Mid);
  else Insert(x->RS = ++CntN, Mid + 1, R);
}
void AddUp(Node *x, Node *y) {
  if(!((x->LS)||(x->RS)||(y->LS)||(y->RS))) {
    x->Val += y->Val;
    return;
  }
  if(x->LS && y->LS) {
    AddUp(x->LS, y->LS);
  } else {
    if(y->LS) {
      x->LS = y->LS;
    }
  }
  if(x->RS && y->RS) {
    AddUp(x->RS, y->RS);
  } else {
    if(y->RS) {
      x->RS = y->RS;
    }
  }
  if(x->LS && x->RS) {
    if(x->LS->Val == x->RS->Val) {
      x->Pos = x->LS->Pos + x->RS->Pos;
      x->Val = x->LS->Val;
    } else {
      if(x->LS->Val < x->RS->Val) {
        x->Val = x->RS->Val, x->Pos = x->RS->Pos;
      } else {
        x->Val = x->LS->Val, x->Pos = x->LS->Pos;
      }
    }
  } else {
    if(x->LS) {
      x->Val = x->LS->Val, x->Pos = x->LS->Pos;
    } else {
      x->Val = x->RS->Val, x->Pos = x->RS->Pos;
    }
  }
}
void DFS(Tr *x) {
  Edge *Sid(x->Fst);
  while (Sid) {
    if(Sid->To != x->Fa) {
      Sid->To->Fa = x;
      DFS(Sid->To);
      AddUp(x->Seg, Sid->To->Seg);
    }
    Sid = Sid->Nxt;
  }
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    A = RD();
    Insert(T[i].Seg = ++CntN, 1, n);
  }
  for (register unsigned i(1); i < n; ++i) {
    C = T + RD(), D = T + RD();
    Link(C, D), Link(D, C);
  }
  DFS(T + 1);
  for (register unsigned i(1); i <= n; ++i) {
    printf("%llu ", T[i].Seg->Pos);
  }
  putchar('\n');
  return Wild_Donkey;
}
```

## Day5: 字符串哈希 & ACAM

### String-Hash

字符串哈希, 一般用于 $O(n)$ 预处理后 $O(1)$ 地询问两个 (子) 串是否相同.

处理一个数组 $Hash$, 作为字符串的前缀哈希值. 在查询一个子串 $[L, R]$ 的哈希值的时候, 需要使得 $Hash_R$ 减去 $Hash_L * Base^{R - L + 1}$, 模意义下就是加上它的减法逆元, 一个数 $x$ 在模 $p$ 意义下的减法逆元是 $p - x$.

用区间哈希值匹配子串可以做到 $O(n)$ 预处理, $O(1)$ 查询.

### [CF955D](https://www.luogu.com.cn/problem/CF955D)

给两个字符串 $A$, $B$, 长度分别是 $n$, $m$. 试图找出 $A$ 中两个长度为 $q$ 的不相交子串, 使得两个字串按顺序拼起来之后包含 $B$ 作为子串. 

正反跑两遍 kmp, 求出 $Pos1_i$ 表示字符串 $B$ 的前缀 $[1, i]$ 在 $A$ 中最早出现的, 不小于 $q$ 的位置的末尾下标, $Pos2_i$ 表示字符串 $B$ 的后缀 $[i, m]$ 在 $A$ 中最后出现的, 不大于 $n - q + 1$ 的开头下标.

过程中保存两个量, $L$ 表示 $B$ 在 $A$ 中第一次出现位置的末尾, $R$ 表示 $B$ 在 $A$ 中最后一次出现的开头下标, 注意, 这两个量不受 $q$ 的约束.

首先特判 $m \leq q$, $B$ 被选取的两个子串之一单独包含的情况, 利用 $L$, $R$ 处理. 

剩下的情况只能是 $B$ 被分成左右两部分, 左部分作为 $A$ 的左边子串的后缀, 右部分作为右边子串的前缀. 枚举 $[1, m]$ 作为 $B$ 的分界点, 然后判断是否可行即可.

代码:

```cpp
unsigned Bd[500005], Pos1[500005], Pos2[500005], m, n, q, Cnt(0), A, B, C, D, t, Ans(0);
char a[500005], b[500005];
inline void Clr() {}
int main() {
  n = RD(), m = RD(), q = RD();
  scanf("%s%s", a + 1, b + 1);
  Bd[0] = -1;
  for (register unsigned i(2), Tmp; i <= m; ++i) {
    Tmp = Bd[i - 1];
    while ((b[i] ^ b[Tmp + 1]) &&(Tmp < 0x3f3f3f3f)) {
      Tmp = Bd[Tmp]; 
    }
    Bd[i] = Tmp + 1;
  }
  for (register unsigned i(1), j(0); i <= n; ++i) {
    while ((a[i] ^ b[j + 1]) && (j < 0x3f3f3f3f)) {
      j = Bd[j];
    }
    if(j > 0x3f3f3f3f) {
      j = 0;
      continue;
    } else {
      ++j;
      if(Pos1[j] < q){
        Pos1[j] = i;
      }
      if((j == m) && (!A)) {
        A = i;
      }
    }
  }
  for (register unsigned i(m - 1); i; --i) {
    if((Pos1[i + 1] > q) && Pos1[i + 1]) {
      Pos1[i] = min(Pos1[i], Pos1[i + 1] - 1);
    }
  }
  for (register unsigned i(m); i; --i) {
    if(Pos1[i] < q) {Pos1[i] = 0; continue;}
    if(Pos1[Bd[i]] < q) Pos1[Bd[i]] = Pos1[i];
    else Pos1[Bd[i]] = min(Pos1[Bd[i]], Pos1[i]);
  }
  Bd[m + 1] = -1;
  Bd[m] = 0;
  for (register unsigned i(m - 1), Tmp; i; --i) {
    Tmp = Bd[i + 1];
    while ((b[i] ^ b[m - Tmp]) && (Tmp < 0x3f3f3f3f)) {
      Tmp = Bd[m - Tmp + 1];
    }
    Bd[i] = Tmp + 1;
  }
  for (register unsigned i(n), j(0); i; --i) {
    while ((j < 0x3f3f3f3f) && (a[i] ^ b[m - j])) {
      j = Bd[m - j + 1];
    }
    if(j > 0x3f3f3f3f) {
      j = 0;
      continue;
    } else {
      if((n - Pos2[m - j] + 1 < q) || (!Pos2[m - j])) {
        Pos2[m - j] = i;
      }
      ++j;
      if((j == m) && (!B)) {
        B = i;
      }
    }
  }
  for (register unsigned i(2); i <= m; ++i) {
    if((n - Pos2[i - 1] + 1 > q) && (Pos2[i - 1])) {
      Pos2[i] = max(Pos2[i], Pos2[i - 1] + 1);
    }
  }
  for (register unsigned i(1); i <= m; ++i) {
    if(n - Pos2[i] + 1 < q) {Pos2[i] = 0; continue;}
    if(n - Pos2[m - Bd[i] + 1] + 1 < q) Pos2[m - Bd[i] + 1] = Pos2[i];
    else Pos2[m - Bd[i] + 1] = max(Pos2[i], Pos2[m - Bd[i] + 1]); 
  }
  if(q >= m) {
    if(A && (n >= q + max(A, q))) {
      printf("Yes\n%u %u\n", max(A, q) - q + 1, max(A, q) + 1);
      return 0;
    }
    if(B && (min(B, n - q + 1) > q)) {
      printf("Yes\n%u %u\n", min(B, n - q + 1) - q, min(B, n - q + 1));
      return 0; 
    }
  }
  for (register unsigned i(m - min(m - 1, q)); i <= min(m - 1, q); ++i) {
    if(Pos1[i] && Pos2[i + 1] && (Pos1[i] < Pos2[i + 1])) {
      printf("Yes\n%u %u\n", Pos1[i] - q + 1, Pos2[i + 1]);
      return 0;
    }
  }
  printf("No\n");
  return Wild_Donkey;
}
```

### [CF985F](https://www.luogu.com.cn/problem/CF985F)

给一个 $26$ 个小写字母字符串 $A$, 有 $m$ 个询问, 每个询问给出两个位置 $a$, $b$, 和一个长度 $Len$, 表示询问 $A$ 的两个子串 $[a, a + Len - 1]$ 和 $[b, b + Len - 1]$ 的信息.

对于查询中的两个子串, 判断两个子串是否同构.

同构定义为两个字符串的字符可以互相单射, 如 `aacbbbc` 和 `uuklllk` 同构.

将开 $26$ 个长度相同的 `0/1` 串, 分别存储每个字母的出现情况, 分别计算前缀哈希值, 对于每个询问查询区间哈希值, 然后排序后匹配两个哈希值数组.

### Aho_Corasick_Algorithm

过水已隐藏

### [JSOI2007](https://www.luogu.com.cn/problem/P4052)

一个未知字符串 $A$, 我们知道它的长度 $m$, 由 $26$ 个大写字母组成, 有 $n$ 个模式串.

$A$ 一个情况是合法的, 定义为它有至少一个模式串作为子串. 输出在 $26^m$ 种情况中所有合法的情况数对 $10007$ 取模的结果.

对模式串建立 ACAM, 然后从 ACAM 每个节点上建一个数组 $f_{i, j}$ 表示走到第 $i$ 个点时还剩 $j$ 步时的可行情况数, 用记忆化搜索, 每次遇到有结尾标记的点就走 $Fail$ 边, 最后统计根节点的 $f_{0, 100}$. 状态数 $O(nm)$, 转移 $O(1)$, 总复杂度 $O(nm)$.

### [HEOI2021](https://www.luogu.com.cn/problem/P4600)

给 $n$ 个字符串, 由 $26$ 个小写字母组成.

给出 $m$ 个询问, 每个询问给出 $a$, $b$ 表示两个字符串的编号, $Posa$, $Posb$ 是两个字符串的下标, 描述了 $a$ 的前缀 $[1, Posa]$, $b$ 的前缀 $[1, Posb]$. 回答这两个前缀最长的公共后缀的权值.

规定一个字符串的权值是将它看成 $26$ 进制数后转化为 $10$ 进制后对 $10^9 + 7$ 取模的结果.

解法比较简单, 可以说是 ACAM 裸题, 对输入的字符串构造 ACAM, 每次取前缀对应的节点, 两个节点在后缀链接树上的 LCA 就是答案.

实现上略有难度, 因为据说卡倍增 ($n \approx 2*10^7$, 倍增所需空间大约 $2GB$), 所以需要树剖实现. 求前缀所在节点的时候, 需要求树上第 $k$ 级祖先, 我们可以同样使用轻重链剖分, 也可以用长链剖分实现 $O(1)$ 查询.

## Day6: KMP & ExKMP & Manacher

### KMP

过水已隐藏

### [HDU3336](https://acm.hdu.edu.cn/showproblem.php?pid=3336)

求一个字符串的前缀出现的次数之和对 $10007$ 取模的结果.

建立 KMP $Next$ 数组, 处理 $Next$ 链长度 $Len$, 对于所有不为 $0$ 的位置都给答案增加当前 $Next$ 链长度.

代码非常简单:

```cpp
unsigned Nxt[200005], Dep[200005], n, Ans(0), t;
const unsigned MOD(10007);
char A[200005];
inline void Clr() {
  memset(A, 0, n + 2);
  memset(Nxt, 0, ((n + 2) << 2));
  memset(Dep, 0, ((n + 2) << 2));
  n = RD(), Ans = n % MOD;
  scanf("%s", A + 1);
}
int main() {
  t = RD();
  for (register unsigned T(1); T <= t; ++T){
    Clr();
    for (register unsigned i(2), k(1); i <= n; ++i)  { // Origin_Len
      while (((A[k] ^ A[i]) && k > 1) || k > i) {
        k = Nxt[k - 1] + 1;
      }
      if(A[k] == A[i]) {
        Nxt[i] = k;
        Dep[i] = Dep[k] + 1;
        Ans = (Ans + Dep[i]) % MOD;
        ++k;
      }
    }
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

### ZOJ1905

求一个字符串最小循环节, $S$ 的循环节 $A$ 定义为 $S$ 可以表示为 $AA...A$.

一个合法循环节的长度 $x$ 一定能整除字符串长度 $n$. 所以我们可以枚举 $O(\sqrt n)$ 个长度的前缀, 和整个字符串进行匹配, 复杂度 $O(n \sqrt n)$.

然后发现可以 $O(n)$ 解决, 建立 KMP $Next$ 数组, 如果 $n - Next_n$ 整除 $n$, 则 $n - Next_n$ 即为所求; 否则最短循环节是 $n$.

### ZOJ_Pro

求一个字符串最小周期, $S$ 的周期 $A$ 定义为 $S$ 是 $AAAA...AAA$ 的子串.

在前面的基础上, 省略判断整除的部分即可.

### [POI2006](https://www.luogu.com.cn/problem/P3435)

求字符串的每个前缀的, 除本身之外的最大周期之和, 周期定义和上一题相同, 即 `aaaaaa` 的最大周期是 `aaaaa` (如果除本身之外无周期, 则按 $0$ 统计答案).

对于每个前缀 $[1, i]$ 判断 $i - Next_i$ 是否整除 $i$, 如果整除, 则将 $Next_i$ 计入答案.

### [POJ2752](Seek the Name, Seek the Fame)

求一个字符串前缀和后缀相匹配的数量.

求 $Next_n$ 的 $Next$ 链长度即可.

### [EXKMP](https://www.luogu.com.cn/problem/P5410)

$ZT_i$ 定义为模式串 $T$ 第 $i$ 位后面的子串 $[i, i + ZT_i)$ 和前缀 $[1, ZT_i]$ 匹配.

假设我们求出了 $ZT$, 在母串 $S$ 上定义一个数组 $ZS_i$ 表示 $S[i, i + ZS_i) = T[1, ZS_i]$ 匹配. 

首先仍然是像 KMP 一样从左往右匹配 $S$ 和 $T$, 假设这时 $S[a, p) = T[1, p - a + 1)$, $S_p \neq T_{p - a + 1}$, 

接下来求 $i \in [a, p)$ 中的 $ZS_i$ 数组需要分类讨论.

- $i + ZT_{i - a + 1} < p$

  这时, 知道 $S[a, p) = T[1, p - a + 1)$, $T[1, ZT_{i - a + 1}) = T[i - a + 1, i - a + 1 + ZT_{i - a + 1})$, 所以 $T[1, ZT_{i - a + 1}) = T[i - a + 1, i - a + 1 + ZT_{i - a + 1}) = S[i, i + ZT_{i - a + 1})$ 所以 $ZS_i \geq ZT_{i - a + 1}$. 
  
  接下来, 证明 $ZS_i \leq ZT_{i - a + 1}$. 我们知道 $S_{i + ZT_{i - a + 1}} = T_{i - a + 1 + ZT_{i - a + 1}} \neq T_{ZT_{i - a + 1}}$, 所以 $ZS_i \leq ZT_{i - a + 1}$.

  综上 $ZT_{i - a + 1} \leq ZS_i \leq ZT_{i - a + 1}$, 也就是 $ZT_{i - a + 1} = ZS_i$

- $i + ZT_{i - a + 1} = p$

  其实证明 $ZS_i \geq ZT_{i - a + 1}$ 的过程和上一种情况一样, 但是这时不一定保证 $ZS_i \leq ZT_{i - a + 1}$.
  
  这是因为我们不知道 $S_{i + ZT_{i - a + 1}} = T_{i - a + 1 + ZT_{i - a + 1}}$ 是否成立, 所以既然 $T[1, ZT_{i - a + 1}) = T[i - a + 1, i - a + 1 + ZT_{i - a + 1})$, 不如直接将 $a$ 右移至 $i$ 的位置, 继续匹配, 找出新的 $p$, 重复之前的步骤即可.

- $i + ZT_{i - a + 1} > p$

  类似地, 我们知道 $T[1, p - a + 1) = S[a, p)$, 而且 $T[1, ZT_{i - a + 1}) = T[i - a + 1, i - a + 1 + ZT_{i - a + 1})$, 所以 $T[1, p - a + 1) = S[i, p)$, 所以 $ZS_i \geq p - i$.

  这时有 $S_p \neq T_{p - a + 1} = T_{ZT_{i - 1 + 1}}$, 因此 $ZS_i \leq p - i$, 所以 $ZS_i = p - i$.

求 $ZT$ 的时候, 边界条件是 $ZT_1 = LenT$, 因为 $T$ 和 $T$ 自己的 LCP 一定是它本身.

接下来, 将 $T$ 作为母串, $a = 2$, 用模板串 $T$ 对它本身进行匹配. 假设我们知道 $ZT_{i}$ 前面所有 $ZT$ 值, 也就是我们求 $ZT_{i}$ 所需的所有 $ZT$ 值, 这样就可以用相同的方法求出 $ZT$ 了.

代码实现:

```cpp
using namespace std;
unsigned ZS[20000005], ZT[20000005], m, n, Cnt(0);
unsigned long long Ans1(0), Ans2(0);
char S[20000005], T[20000005];
void ExKMP(char *Mot, char *Mod, unsigned *Zot, unsigned *Zod, unsigned Lenot) {
  register unsigned i(1), a(1), p(1);
  while (i <= Lenot) {
    while (Mot[p] == Mod[p - a + 1]) ++p;
    if (p == a) {
      Zot[i] = 0, ++i, ++a, ++p;
      continue;
    }
    if(i >= p) {
      a = i;
      continue;
    }
    if (i + Zod[i - a + 1] == p) {
      if(p - i == m) Zot[i] = m, ++i, p = i;
      a = i;
      continue;
    }
    if(i + Zod[i - a + 1] < p) {
      Zot[i] = Zod[i - a + 1];
    } else {
      Zot[i] = p - i;
    }
    ++i;
  }
  return;
}
int main() {
  scanf("%s%s", S + 1, T + 1);
  n = strlen(S + 1), m = strlen(T + 1); 
  ZT[1] = m;
  ExKMP(T + 1, T, ZT + 1, ZT, m - 1);
  for (register unsigned long long i(1); i <= m; ++i) {
    Ans1 ^= i * (ZT[i] + 1);
  }
  ExKMP(S, T, ZS, ZT, n);
  for (register unsigned long long i(1); i <= n; ++i) {
    Ans2 ^= i * (ZS[i] + 1);
  }
  printf("%llu\n%llu\n", Ans1, Ans2); 
  return Wild_Donkey;
}
```

<!-- ### [HDU2594](https://acm.hdu.edu.cn/showproblem.php?pid=2594)

每个测试数据给两个字符串 $S$, $T$.

求 $S$ 的最长的作为 $T$ 的子串的前缀.

### HDU 2019-MU-Day5-D

给一个字符串 $S$, 用如下代码求每个后缀和 $S$ 本身的 LCP (Longest Common Prefix), 求比较语句执行次数.

```pascal
for i from 1 to len - 1
  k = 0
  while i + k < len
    if s[k] = tos[i+ k]
      k is increased by 1
    otherwise
      exit while loop
  an[i] = k
```

容易发现, 比较次数是所求的 $LCP$ 长度 $+1$ 之和. -->

### ManacherehcanaM

过水已隐藏

### PAM

过水已隐藏

### SAM

过水已隐藏

### GSAM

过水已隐藏

### SGAM

过水已隐藏

<!-- ### ICPC2018-Nanjing-Regional-Contest-M

给两个字符串 $S$, $T$, 有多少有序 $(i, j, k)$ 满足 $S_i,..., S_j, T_1,..., T_k$ 是回文串.

用 $T$ 的前缀倒序匹配 $S$, 然后对 $S$ 求 Manacher $P$ 数组.

设 $T'$ 是倒序的 $T$.

枚举 $T'$ 的每个后缀和 $S$ 的每个后缀的 LCP, 然后求以 $LCP$ 末尾为起始的 $S$ 的回文子串, 统计入答案 $O(n^3)$. -->

<!-- ### Nowcoder14894

从字符串 $A$ 中取可空子串 $[l1, r1]$, 从 $B$ 中取 $[l2, r2]$ 要求 $r1 = l2$. -->

### POI2007

给一个多边形, 求有多少对称轴.

每个点求两个临边夹角, 按顺序破环为链跑 Manacher, 只要存在对于某个中心的回文串长度为 $n$, 则找到一个对称轴.

## Day7: 模拟赛 Ⅱ

模拟赛!

### A

给 $n$ 个点, 用长为 $k$ 的窗口覆盖, 求最少窗口数.

红题中的红题, 简称红中红.

```cpp
unsigned a[100005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
char b[10005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD();
  }
  sort(a + 1, a + n + 1);
  for (register unsigned i(1), j(0); i <= n; ++i) {
    if(j < a[i]) {
      ++Ans, j = a[i] + m;
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

### B

给一个山谷, 谷底之前高度递减, 谷底之后高度递增. 现在下雨, 水会优先往下流, 求最后的水位高度.

将山谷片成 $n$ 片. 然后按高度为第一关键字, 以位置为第二关键字排序. 扫一遍排序后的数组处理出 $Width_i$ 表示高度 $i$ 的山谷宽度.

我们可以从低到高枚举高度, 每次减去宽度, 直到水量不足填满一层, 然后约分即可.

不要忘记判断整数部分为 $0$ 的情况!!! (不要问我为什么知道, $100' \rightarrow 99'$)

```cpp
unsigned Width[1005], Min, m, n, Cnt(0), C, D, t, Ans(-1), Tmp(0), W;
char Exist[1005];
struct Hill {
  unsigned Hight, Pos;
  inline const char operator<(const Hill &x) const{
    return (this->Hight ^ x.Hight) ? (this->Hight < x.Hight) : (this->Pos < x.Pos);
  }
}H[1005], A, B;
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    Exist[H[i].Hight = RD()] = 1, H[i].Pos = i;
  }
  H[++n].Hight = 0x3f3f3f3f, H[n].Pos = 0;
  H[++n].Hight = 0x3f3f3f3f, H[n].Pos = n - 1;
  sort(H + 1, H + n + 1);
  Min = H[1].Hight; 
  for (register unsigned i(Min), L(0x3f3f3f3f), R(0); i <= 1000; ++i) {
    if(Exist[i]) {
      A.Hight = i;
      B.Hight = i + 1;
      L = min(L, upper_bound(H + 1, H + n + 1, A)->Pos);
      R = max(R, (lower_bound(H + 1, H + n + 1, B) - 1)->Pos);
      Width[i] = R - L + 1;
    } else {
      Width[i] = Width[i - 1];
    }
  }
  for (register unsigned i(Min); i <= 1000; ++i) {
    if(m < Width[i]) {
      W = Width[i];
      break;
    }
    m -= Width[i];
    Ans = i, W = Width[i];
  }
  ++Ans;
  if(m >= (n - 2)) {
    W = n - 2;
    Ans += m / W;
    m %= W;
  }
  Tmp = __gcd(W, m);
  if(!Ans) {
    printf("%u/%u\n", m / Tmp, W / Tmp);
    return 0;
  }
  if(!m) {
    printf("%u\n", Ans);
    return 0;
  }
  printf("%u+%u/%u\n", Ans, m / Tmp, W / Tmp);
  return Wild_Donkey;
}
```

### C

给两个序列 $A$, $B$, 每次选择一个数列整体修改, 然后查询两个数列所有数的中位数.

其实考场上用的是复杂度错误的算法 $O(n + m + q\log n \log m)$, 但是因为 $\color{red}传统艺能$, 仍然过掉了此题.

因为是全局修改, 所以可以打一个 $Tag$, 然后在询问的.

二分答案 $a_i$, 然后二分查找 $a_i$ 在 $b$ 中的排名, 判断它们的和, 每次询问是 $O(\log n \log m)$.

```cpp
long long a[100005], b[100005], A, B, C, D, Ans(0);
unsigned m, n, q, Tmp(0), Dest(0);
unsigned Judge (unsigned x) {
  return x + upper_bound(b + 1, b + m + 1, a[x] + C - D) - 1 - b < Dest;
}
unsigned Judge2 (unsigned x) {
  return x + upper_bound(a + 1, a + n + 1, b[x] + D - C) - 1 - a < Dest;
}
int main() {
  n = RD(), m = RD(), q = RD();
  Dest = ((m + n + 1) >> 1);
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD() - a[1];
  }
  a[0] = -1000000000000000, A = a[1] + 1000000000000000, a[1] = 0, a[n + 1] = 0x3f3f3f3f3f3f3f3f;
  for (register unsigned i(1); i <= m; ++i) {
    b[i] = RD() - b[1];
  }
  b[0] = -1000000000000000, B = b[1] + 1000000000000000, b[1] = 0, b[m + 1] = 0x3f3f3f3f3f3f3f3f;
  for (register unsigned i(1); i <= q; ++i) {
    if(RD() & 1) {
      C = A + RDsg();
      D = B;
    } else {
      D = B + RDsg();
      C = A; 
    }
    register unsigned L(0), R(n), Mid;
    while (L ^ R) {
      Mid = ((L + R + 1) >> 1);
      if(Judge(Mid)) {
        L = Mid;
      } else {
        R = Mid - 1;
      }
    }
    Tmp = L;
    L = upper_bound(b + 1, b + m + 1, a[Tmp] + C - D) - 1 - b, R = upper_bound(b + 1, b + m + 1, a[Tmp + 1] + C - D) - 1 - b;
    while (L ^ R) {
      Mid = ((L + R + 1) >> 1);
      if(Judge2(Mid)) {
        L = Mid;
      } else {
        R = Mid - 1;
      }
    }
    while (Tmp + L >= Dest) {
      if(a[Tmp - 1] + C > b[L - 1] + D) {
        --Tmp;
      } else {
        --L;
      }
    }
    while (Tmp + L + 1 < Dest) {
      if(a[Tmp + 1] + C < b[L + 1] + D) {
        ++Tmp;
      } else {
        ++L;
      }
    }
    Ans = min(a[Tmp + 1] + C, b[L + 1] + D);
    if (!((n + m) & 1)) {
      if(a[Tmp + 1] + C < b[L + 1] + D) {
        Ans += min(a[Tmp + 2] + C, b[L + 1] + D); 
      } else {
        Ans += min(a[Tmp + 1] + C, b[L + 2] + D);
      }
      if(Ans & 1) {
        printf("%lld.5\n", (Ans >> 1) - 1000000000000000);
      } else {
        printf("%lld\n", (Ans >> 1) - 1000000000000000);
      }
      continue;
    }
    printf("%lld\n", Ans - 1000000000000000);
  }
  return Wild_Donkey;
}
```

事实上, $O(n + m + q \log n)$ 的算法很容易实现. 只要在二分一个 $a_i$ 的时候, 直接判断 $b_{\frac{n + m}2 - i}$ 的大小是否紧贴 $a_i$ 即可.

```cpp
long long a[100005], b[100005], A, B, C, D, Ans(0);
unsigned m, n, q, Tmp(0), Dest(0);
unsigned Judge (unsigned x) {
  if(a[x] + C < b[Dest - x + 1] + D) return 1;
  return 0;
}
int main() {
  n = RD(), m = RD(), q = RD();
  Dest = ((m + n + 1) >> 1);
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD() - a[1];
  }
  a[0] = -1000000000000000, A = a[1] + 1000000000000000, a[1] = 0, a[n + 1] = 0x3f3f3f3f3f3f3f3f;
  for (register unsigned i(1); i <= m; ++i) {
    b[i] = RD() - b[1];
  }
  b[0] = -1000000000000000, B = b[1] + 1000000000000000, b[1] = 0, b[m + 1] = 0x3f3f3f3f3f3f3f3f;
  for (register unsigned i(1); i <= q; ++i) {
    if(RD() & 1) {
      C = A + RDsg();
      D = B;
    } else {
      D = B + RDsg();
      C = A; 
    }
    register unsigned L((Dest >= m) ? (Dest - m) : 0), R(min(n, Dest)), Mid;
    while (L ^ R) {
      Mid = ((L + R + 1) >> 1);
      if(Judge(Mid)) {
        L = Mid;
      } else {
        R = Mid - 1;
      }
    }
    Ans = max(a[L] + C, b[Dest - L] + D);
    if (!((n + m) & 1)) {
      Ans += min(a[L + 1] + C, b[Dest - L + 1] + D); 
      if(Ans & 1) {
        printf("%lld.5\n", (Ans >> 1) - 1000000000000000);
      } else {
        printf("%lld\n", (Ans >> 1) - 1000000000000000);
      }
      continue;
    }
    printf("%lld\n", Ans - 1000000000000000);
  }
  return Wild_Donkey;
}
```

### D

给两个 $10^{100}$ 以内的十进制数 $L$, $R$, 给出 $n$ 个位数总和在 $100$ 以内的十进制数, 求 $[L, R]$ 中满足包含所有 $n$ 个数作为子串的整数的数量.

"ACAM + 状压DP + 数位DP" 大杂烩

建立 $n$ 个数的 ACAM, 然后在 ACAM 上跑 DP, 每个节点 $i$ 存一个数组 $f_{j, pos, 0/1}$, 表示走到第 $Pos$ 位的时候, 包含了状压状态为 $j$ 表示的子串的, 是否顶着上界的情况数, 记忆化搜索即可.

## Day8

<!-- ### 例题

一张无向图, 每次询问 $a$, $b$ 不经过 $c$ 的最短路, $n \leq 200$, $q \leq 10^5$.

数据范围提示了 $Floyd$,  -->

### ZJOI2016

给一个正边权的网格图和若干询问, 每次询问两点间最短路.

$nm \leq 2*10^4$, $q \leq 10^5$

网格图的边权为正, 则答案路径保证经过边数是两点曼哈顿距离, 即为一个单调不上升或不下降的折线. 而这条折线一定在以这两点为顶点的矩形内部.

所以我们只要询问这个矩形的最短路即可, 我们将矩形分割成两个矩形, 分别求两个矩形的最短路, 然后 $O(n)$ 合并即可.

### 例题

给 $n$ 个物品, 每个物品 $c_i$ 个, 定义 $\displaystyle{m = \sum_i^n c_i}$, 初始代价是 $a_i$, 每次选代价会减少 $b_i$, 对于不同的 $k$, 选择 $k$ 件物品的最小价值是多少.

固定一个 $k$, 在选了的物品中, 至多有一种物品没有选完, 所以每种物品一旦选就选完 $c_i$ 或 $k$ 为止. 但是 $k$ 的方案一定不是从 $k - 1$ 的方案的基础上转移而来的.

$O(n)$ 枚举选了, 但没完全选的物品, $O(nm)$ 剩下的 $n - 1$ 的物品跑 0/1 背包求出全部选了的物品, 背包所需总复杂度 $O(n^2m)$.

分治加物品, 每个物品加入背包需要 $O(m)$, 总的问题需要每个物品执行 $O(\log n)$ 次加入操作. 因此背包总的复杂度是 $O(nm\log n)$.

### 例题

给长为 $n$ 的序列, 再给单调不增的数组 $f$, 求最长的 $[l, r]$, 使得区间中数字出现次数 $\geq f_{r - l + 1}$, $n \leq 10^6$.

$O(n)$ 预处理每个数字出现次数, 扫描出整个数列任意一个出现次数小于 $f_n$ 的数字 $Mid$, 那么它不可能再答案中出现, 因为随着长度缩小, $f$ 不会缩小, 而 $Mid$ 出现数量不会增大, 所以我们可以将 $Mid$ 从数列中删除, $Cnt_Mid = Cnt_Mid - 1$, 也就是将数列分成两段.

从左右两端双指针同时扫描, 这样可以在两段中较小的一段的长度 $l$ 的复杂度下找到任意一个不合法的数字, 而我们只要求出了较小的一段的出现次数 $CntMin_i$, 就可以结合 $Cnt_i$ 求出较长的一段的出现次数 $Cnt_i - CntMin_i$.

### 例题 (交互)

给 $2n$ 个, $n$ 种糖果, 每种糖果出现 $2$ 次, 排成一行. 有两种操作:

- 往序列中放一颗糖

- 从序列里拿一颗糖

每次操作后可以知道有多少不同种类的糖在序列中.

我们可以从左往右拿, 如果糖还在, 则拿走它, 如果有一个种类的不见了, 那我们就放回去, 然后继续扫描整个序列, 这时整个序列每个种类都出现了 $1$ 次.

然后分段

### 例题

给 $n$ 个二元组 $(a_i, b_i)$, 需要对每个 $k$ 选出 $k$ 个二元组使得 $(\sum a_i) * (\sum b_i)$ 最小.

$n \leq 200$

我们将所有选择 $k$ 个二元组的方案中 $\sum a_i$ 最小的情况

### CDQ 分治解决三维偏序问题

第一维排序, 第二维分治, 第三维树状数组, 细节过水已隐藏

### 最长偏序链

就是多了一维的 LIS.

一个三元组定义一个值 $f$, 表示它为结尾的最长偏序链长度.

按 $a$ 排序.

将序列分成两半, 左右两边分别按 $b$ 排序, 假设左边的 $f$ 已经求出, 我们用双指针扫描.

### 例题

一个长度为 $n$ 的排列, 有些位置上的数字已经确定了, 剩下位置上的数字不确定. 你要确定剩下位置上的数字, 让得到的排列的最长上升子序列长度尽量长. $n \leq 10^5$

第 $Nxt_i$ 位是 $i$ 后面的第一个确定的数字, 我们用一个数组 $g_i$ 表示确定的位置 $i$ 到 $Nxt_i$ 的, 能填入 $(i, Nxt_i)$ 的在 $(a_i, a_{Nxt_i})$ 区间内的数字个数.

$f_i$ 表示以位置 $i$ 为结尾的最长上升子序列的长度, 则它是由

### 例题

一个二维点序列 $(a_i,b_i)$, 你需要把它拆成两个子序列, 使得两个子序列中相邻两项的曼哈顿距离之和最小. $n\leq 10^5$

设 $f_{i, j}$ 为 $[1, i]$ 的序列, $i$ 在一个子序列, $j$ 是另一个子序列的末尾的最小距离和, 这时 $f_{i, j}$ 可以转移到 $f_{i + 1, j}$ 和 $f_{i + 1, i}$ 上.

如果看 $f_{i, j}$ 的转移, 它可以由 $f_{i - 1, j}$ 转移而来或 $f_{}$

$$
f_{i, j} = min (f_{i - 1, k} + Dis_{i - 1, i}) (j = i - 1)\\
f_{i, j} = f_{i - 1, j} + Dis_{j, i} (j < i - 1)\\
$$

设 $g_{i} = f_{i, i - 1}$, 则 

$$
g_{i} = min (g_{j} + Dis_{j, j + 1} + Dis_{j + 1, j + 2} + ... + Dis_{i - 2, i - 1} + Dis_{j - 1, i})
$$

发现可以用 $Dis_{i, i + 1}$ 的前缀和进行优化, 

### 线段树分治

将询问离线, 每个询问给 $O(\log n)$ 个节点打标记, 然后对线段树进行 DFS, 过程中将每个节点对它们所对应的询问计算贡献, 最后统一回答询问.



### 例题

有 $n$ 种物品, 第 $i$ 种物品第一次选择的收益是 $a_i$, 之后每次选择的收益都是 $b_i$, 代价始终为 $c_i$. 你需要求出在总代价不超过 $m$ 下收益的最大值.

有 $Q$ 次修改, 第 $j$ 次修改会在第 $i$ 次修改 $(i < j)$ 的基础上修改一个物品的两类收益. 你需要对于每次修改后输出答案.

$n, m, Q \leq 2000$

修改构成一个树形结构, 对于每个修改相当于在树的 DFS 序的区间上修改, 而这个区间可以用线段树维护.

背包 DP 可以考虑新建一个数组 $g_{i, j}$ 表示第 $i$ 个物品强制选一次, 花费 $j$ 的代价, 然后用它跑完全背包.

### 例题

有 $n$ 个物品, 每个物品有大小和权值, 每次查询一个区间中的物品拿出来做大小为 $W$ 的背包得到的结果. $n, m \leq 10^4, W \leq 100$, 区间不存在包含关系.

离线查询, 排序, 发现每个物品有贡献的询问一定是一个连续区间, 用线段树维护这个区间, 于是将每个物品插入对应节点上, 在线段树上 DFS, 过程中统计路径贡献, 每次到叶子就回答对应位置的询问.

## Day9

### 