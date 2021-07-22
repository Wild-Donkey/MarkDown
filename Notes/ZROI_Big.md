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

## Day3: 模拟赛

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

## Day5

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

## Day6

### KMP

过水已隐藏

### HDU3336

求一个字符串的前缀出现的次数之和对 $10007$ 取模的结果.

建立 KMP $Next$ 数组, 处理 $Next$ 链长度 $Len$, 对于所有不为 $0$ 的位置都给答案增加当前 $Next$ 链长度.

### ZOJ1905

求一个字符串最小循环节, $S$ 的循环节 $A$ 定义为 $S$ 可以表示为 $AA...A$.

一个合法循环节的长度 $x$ 一定能整除字符串长度 $n$. 所以我们可以枚举 $O(\sqrt n)$ 个长度的前缀, 和整个字符串进行匹配, 复杂度 $O(n \sqrt n)$.

然后发现可以 $O(n)$ 解决, 建立 KMP $Next$ 数组, 如果 $n - Next_n$ 整除 $n$, 则 $n - Next_n$ 即为所求; 否则最短循环节是 $n$.

### ZOJ_Pro

求一个字符串最小循环节, $S$ 的循环节 $A$ 定义为 $S$ 是 $AAAA...AAA$ 的子串.

在前面的基础上, 省略判断整除的部分即可.

### POI2006

求字符串的每个前缀的, 除本身之外的最长循环节之和 (如果除本身之外无无循环节, 则按 $0$ 统计答案).






