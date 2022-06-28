# 线性基 (Linear Basis)

> 在线性代数中, 基 (basis) (也称为基底) 是描述, 刻画向量空间的基本工具. 向量空间的基是它的一个特殊的子集, 基的元素称为基向量. 向量空间中任意一个元素, 都可以唯一地表示成基向量的线性组合. 如果基中元素个数有限, 就称向量空间为有限维向量空间, 将元素的个数称作向量空间的维数. ----Wikipedia

## 定义

OI 中, 线性基特指一种线性空间的基. 这种线性空间的向量的每一维坐标是 $0$ 或 $1$, 每维坐标可以看作整数的每个二进制位. 加法定义是按位异或, 数乘定义没有意义, 因为因数只能是 $0$ 或 $1$.

## 性质

由于线性基内所有向量线性无关. 所以线性基的大小即为线性空间中线性无关的向量个数, 不会超过 $\log V$ 个.

如果把线性基的元素放一起形成矩阵, 进行初等变换后一定还是原线性空间的线性基. 而且我们用初等变换可以把线性基变成最高位的 $1$ 互不相同的数集.

## 算法

假设现在有 $n$ 个数, $a_1$,..., $a_n$, 求它们生成的线性空间 $A$ 的基 $B$.

我们先考虑从定义出发, 如果我们把所有给定的数字看成是行向量, 然后组成过一个 $n$ 行 $\log V$ 列的矩阵, 高斯消元后非全零的行即为所求的线性基. 对这个矩阵进行高斯消元的复杂度是 $O(n^2\log V)$. 如果 $V < 2^{64}$ 时我们可以通过用整数表示行向量来优化行异或为 $O(1)$, 所以复杂度优化到 $n^2$. 当 $V$ 超出 $8$ 字节后可以进行 `bitset` 优化, 达到 $O(\frac {n^2 \log V}w)$.

可以每次插入一个行向量就进行一轮初等变换, 出现全零行就将其删除, 维持这个矩阵为已经插入的行向量生成的线性空间的基 $B$, 并且从大到小有序排列. 每次插入一个行向量需要进行 $O(|B|)$ 次行异或. 因为 $|B| \leq \log V$, 所以这样总共需要 $P(n \log V)$ 次行异或. 当 $V < 2^{64}$ 时, 复杂度为 $O(n \log V)$, 否则是 $\frac {n \log^2 V}w$.

因为行向量从大到小排列, 且高斯消元使得它们最高位互不相同, 所以矩阵每行最高位不同. 对于一个新的行向量 $a$, 从上往下扫描矩阵, 如果发现了不存在和 $a$ 最高位相同的行向量, 那么直接把 $a$ 插入矩阵这一行中. 如果存在, 那么使 $a$ 被这个行向量异或. $a$ 的最高位一定会减小, 这时继续刚才的操作, 直到把 $a$ 作为行向量插入 $B$ 或 $a$ 变成 $0$ 为止.

为了方便操作, 使得矩阵第 $i$ 行对应最高位为 $i$ 的行向量.

```cpp
n = RD(), Bin[0] = 1;
for (unsigned i(1); i <= 50; ++i) Bin[i] = (Bin[i - 1] << 1);
for (unsigned i(1); i <= n; ++i) {
  A = RD();
  for (unsigned j(50); ~j; --j) if (A & Bin[j]) {
    if (B[j]) A ^= B[j];
    else { B[j] = A; break; }
  }
}
```

## 判断向量是否属于 $A$

如果把 $x$ 插入 $B$ 时 $x$ 被异或成 $0$, 说明它属于 $A$.

## 求 $A$ 中最大向量

只要从大到小枚举线性基然后贪心即可, 每一位能赋成 $1$ 就赋成 $1$.

```cpp
for (unsigned i(50); ~i; --i) if ((B[i]) && (!(Ans & Bin[i]))) Ans ^= B[i];
printf("%llu\n", Ans);
```

## 求 $A$ 中最小非零向量

线性基的最小元素即为最小非零向量.

## 求 $A$ 中第 $k$ 小的非零向量

我们把 $B$ 高斯消元后, 得到的矩阵中一定能使得每一行的最高位的 $1$ 是当前列唯一的 $1$.

所以要想凑出线性空间中的向量 $x$. 如果 $x$ 中的某一位 $1$ 是某个 $B$ 中元素的最高位的 $1$, 那么这个 $1$ 只能由它提供; 如果 $x$ 中某一位 $0$ 是某个 $B$ 中元素的最高位的 $1$, 那么这个元素一定不在异或出 $x$ 的元素集合中, 否则 $x$ 的这一位就变成 $1$ 了.

根据上面的规则, 只要知道 $x$ 的所有这 $|B|$ 个位置的值, 就可以构造出唯一的 $x$. 所以 $|A| = 2^{|B|}$.

$B$ 的前 $i$ 小的元素, 可以生成 $2^i$ 个 $A$ 中的元素. 因为任意这 $2^i$ 个元素异或一个 $B$ 中的前 $i$ 小的元素之外的元素, 都会变大, 因此可以知道这 $2^i$ 个元素即为 $A$ 中最小的 $2^i$ 个元素.

所以对于 $k$ 来说, 如果它的最高位是第 $i$ 位, 那么 $A$ 中第 $k$ 小的元素 $Ans$ 的最高位一定等于 $B$ 中第 $i$ 小的元素的最高位. 然后就得到了子问题: 求 $B$ 中前 $i - 1$ 的元素生成的 $2^{i - 1}$ 个元素中第 $k - 2^i$ 小的元素 $Ans'$. $Ans$ 即为 $Ans'$ 异或 $B$ 中第 $i$ 小元素的值. 扫描一遍 $B$, 过程中维护 $Ans$ 即可得到答案.

## 求并

我们只要把 $B_1$ 的所有元素插入 $B_2$ 中即可.

## 求交

对于两个集合 $B \subseteq A$, 定义运算 $A \backslash B$, 若 $x \in (A \backslash B)$, 当且仅当 $x \in A, x \notin B$.

我们要对 $B_1$ 进行初等变换, 使得 $A_2 \cap B_1$ 为 $A_1$, $A_2$ 的交 $A$ 的基 $B$. 为了构造, 建一个临时集合 $S$, 把 $B_2$ 复制进去, 然后尝试把 $B_1$ 的元素往 $S$ 里面插.

如果 $B_1$ 的元素 $x$ 插入的时候没有被异或为 $0$, 说明它不可以被 $S$ 中的元素表示. 于是将其插入 $S$.

如果 $x$ 可以被 $S$ 异或为 $0$, 且可以仅被 $B_2$ 的元素异或为 $1$, 说明 $x$ 属于 $B$, 将 $x$ 直接放入 $B$ 中即可.

如果 $x$ 需要被 $B_1$ 已经插入 $S$ 中的元素和 $B_2$ 中的元素共同异或为 $0$, 那么我们用 $B_1$ 已经插入 $S$ 的元素异或 $x$ 不会对线性基的性质产生任何影响, 所以可以转化为上一种情况, 把调整后的 $x$ 插入 $B$ 即可. 

最后求出的 $B$ 即为 $A_1 \cap A_2$ 的基.

## 在线删除

我们前面求的是 $\{a\}$ 集合生成的线性空间 $A$ 的基 $B$, 那么如果需要支持删除数字, 如何维护 $B$ 呢?

我们设 $B_i$ 为 $B$ 中最高位为 $i$ 的元素.

对于每个插入时没有异或为 $0$ 的数字 $a_i$, 我们认为它为线性空间增加了一维, 异或后插入到了位置 $B_j$. 这时我们给这一维赋一个空闲的维度编号 $R$. 这个编号不能是最高位位置 $j$, 原因在最后解释.

所以我们单独开一个名为 $Exi$ 的 `bitset`, $Exi_i = 0$ 表示这个维度编号空闲. 每次开启新维度时, $R$ 就是扫描这个数组得到的.

记一个数组 $Bel_i$ 表示 $a_i$ 生成的维度的编号, 如果 $a_i$ 没有生成任何维度则 $Bel_i = \infin$.

如果把每个 $Bel_i \neq \infin$ 的 $a_i$ 作为 $|B|$ 个维度的单位向量, 那么对于线性空间内每个数, 都可以由这些单位向量中的一部分异或而来的.

每个 $a_i$ 维护一个集合 $Set_i$, 表示 $a_i$ 是由哪些维度的单位向量异或而来的.

每个 $B_i$ 维护一个集合 $BSet_i$, 表示 $B_i$ 是由哪些维度的单位向量异或而来的.

还要记录一个 `bitset` $Del$, $Del_i = 1$ 表示 $a_i$ 已经被删除了.

这时假设要删除的是 $a_i$, 那么可以按 $Bel_i$ 分为两类.

### $Bel_i = \infin$

这就说明 $a_i$ 的插入并没有给 $A$ 带来新的元素, 那么 $a$ 删除之后 $A$ 也不会变化, 所以它的基 $B$ 也不会变化, 我们什么都不用做.

### $Bel_i \neq \infin$

我们这时候要尝试找出一个未被删除且 $Bel_d = \infin$ 的数 $a_d$, 满足 $Bel_i \in Set_d$.

#### $d$ 存在

如果我们设 $F(Set)$ 表示维度集合 $Set$ 内所有维度的单位向量的异或和. 则有

$$
\begin{aligned}
a_d &= F(Set_d)\\
a_d &= F(Set_d \backslash Bel_i) \oplus a_i\\
a_d \oplus a_i &= F(Set_d \backslash Bel_i)\\
a_i &= F(Set_d \backslash Bel_i) \oplus a_d\\
\end{aligned}
$$

那么对于 $A$ 中的任意元素 $x$, 一定有集合 $Set$ 使得 $x = F(Set)$. 如果 $Bel_i \notin Set$, 则删除 $a_i$ 不会对生成 $x$ 产生影响. 如果 $Bel_i \in Set$ 那么就有:

$$
\begin{aligned}
x &= F(Set)\\
x &= F(Set \backslash Bel_i) \oplus a_i\\
x &= F(Set \backslash Bel_i) \oplus F(Set_d \backslash Bel_i) \oplus a_d\\
\end{aligned}
$$

因为 $Set \backslash Bel_i$ 和 $Set_d \backslash Bel_i$ 都不含 $Bel_i$, 所以它们都可以在 $a_i$ 不存在的时候结合 $a_d$ 凑出 $x$. 也就是说删除 $a$ 也不会使得 $A$ 发生任何变化, 所有需要 $a$ 参与生成的元素都可以由 $b_1$ 生成, 所以我们不对 $B$ 进行任何修改.

但是我们需要把 $Bel_i$ 维度的单位向量改成 $a_d$, 这样会使 $Set$ 和 $BSet$ 都发生变化.

因为对于包含 $Bel_i$ 的集合 $Set$, 在这个维度单位向量变化后, $F(Set)$ 会变成 $F(Set) \oplus F(Set_d \backslash Bel_i)$. 为了使所有这种 $Set$ 的 $F(Set)$ 仍然等于原来的 $F(Set)$.

我们如果想对它进行修正, 就要使 $F(Set) \oplus F(Set_d \backslash Bel_i)$ 再异或一个 $F(Set_d \backslash Bel_i)$.

体现在 $Set$ 上就是使得 $Set$ 变成 $Set \oplus (Set_d \backslash Bel_i)$. 这个修正操作对每个包含 $Bel_i$ 的 $Set_j$ 和 $BSet_j$ 都要进行.

由于我们已经把 $a_d$ 选为维度 $Bel_i$ 的单位向量, 所以将 $Bel_d$ 赋值为 $Bel_i$.

#### $d$ 不存在

说明删掉 $a_i$ 会让维度 $Bel_i$ 消失, 我们需要在 $B$ 中删掉一个元素, 并且把 $Exi_{Bel_i}$ 变成 $0$.

如果 $A$ 中任意元素 $x$ 都可以表示为 $x = F(Set)$.

$A$ 减少一维意味着减少一半的元素, 也就是删除所有 $Bel_i \in Set$ 的 $x$.

因为所有 $x$ 都是 $B$ 的元素异或出来的, 如果所有 $BSet_j$ 都满足 $Bel_i \notin BSet_j$, 那么自然就无法生成 $Bel_i \in Set$ 的 $x$ 了.

**解法1**

先考虑把所有 $Bel_i \in BSet_j$ 的所有 $B_j$ 都异或 $a_i$. 这时可以在 $BSet$ 中清除所有 $Bel_i$, 但是这时 $BSet$ 的元素不是线性无关的. 所以需要进行一轮高斯消元.

**解法2**

重新审视线性基的性质, 我们发现可以选一个 $k$, 使其满足 $Bel_i \in BSet_k$, 然后把所有满足 $Bel_i \in BSet_j$ 的 $B_j$ 都异或 $B_k$, 这样也可以消除所有 $BSet$ 中的 $Bel_i$.

如果我们选择 $k$ 的时候让 $B_k$ 尽可能小, 那么最后异或结束后除了 $B_k$ 变成 $0$ 以外, 其它的元素因为最高位比 $B_k$ 高, 所以最高位没有发生变化, 所以在 $B$ 中的位置也不会变化. 为了方便, 我们这样选择 $k$.

注意在异或过程中同步维护 $BSet$.

### 编号单独维护的原因

如果用 $B_i$ 最高位作为维度编号, 在这组数据中会出问题:

```
Insert 3
Insert 2
Delete 3
Insert 1
```

$3$ 生成了维度 $1$, $B$ 插入了新元素 $B_1 = 3$, 同时 $BSet_1 = \{1\}$.

$2$ 生成了维度 $0$, $B$ 插入了新元素 $B_0 = 1$, 同时 $BSet_0 = \{0, 1\}$.

如果删除 $3$, 会删除维度 $1$, 这时所有 $1 \in BSet_i$ 的集合中, $B_i$ 最小的是 $B_0 = 1$, 所以使得 $B_0$, $B_1$ 都异或 $B_0$, 同时 $BSet_0$, $BSet_1$ 异或 $BSet_0$.

得到了 $B_0 = 0$, $BSet_0 = \empty$, $B_1 = 2$, $BSet = \{0\}$.

虽然插入 $a_i$ 之前线性基不存在最高位为 $j$ 的元素, 但是在此之前最高位为 $j$ 的元素可能插入并删除了, 在这个元素存在的时候, 

如果这个时候插入 $1$, 会生成新的维度, $B$ 插入新元素 $B_0 = 1$, 最高位为 $0$, 但是维度 $0$ 仍然存在, 所以这样编号会和已经存在的维度 $0$ 冲突.

### 复杂度分析

我们在插入 $a_i$ 的时候需要维护大小为 $\log V$ 的集合 $Set_i$, 大小为 $\log V$ 的向量 $a_i$, 进行 $\log V$ 次异或. 如果最后出现了新的维度, 需要遍历大小为 $\log V$ 的 `bitset` $Exi$, 复杂度 $O(\frac{\log^2 V}w)$.

删除 $a_i$ 时, 如果 $Bel_i = \infin$, 则 $O(1)$.

然后我要遍历 $|\{a\}|$ 个集合来寻找 $d$, $O(|\{a\}|)$.

如果存在 $d$, 那么我需要将 $O(|\{a\}| + \log V)$ 个大小为 $\log V$ 的集合异或一个同样大小的集合, $O(\frac{(|\{a\}| + \log V)\log V}w)$.

如果没有 $d$, 那么我需要遍历 $O(\log V)$ 个大小为 $O(\log V)$ 的集合并且选出集合进行异或, 复杂度 $O(\frac {\log^2 V}w)$

如果操作数是 $n$, 则总复杂度是 $O(n(\frac{\log^2V + |\{a\}|\log V}w + |\{a\}|))$. 如果认为 $O(|\{a\}|) = O(n)$, 则复杂度为 $O(n(\frac{\log^2V + n\log V}w + n)) = O(n^2 + \frac{n^2\log V}w + \frac{n\log^2V}w)$

### 代码实现

[模板题](https://hydro.ac/d/bzoj/p/4184), 可惜时间复杂度过不了.

```cpp
map<unsigned, vector<unsigned> > a;
bitset<500005> Del;
bitset<32> Exi;
unsigned Set[500005], Bel[500005], BSet[32], Bin[32], B[32], m, n;
unsigned C, D, Rk, Line;
unsigned Cnt(0), Ans(0);
int A;
void Ins(int i, unsigned Val) {
  unsigned Highest(0x3f3f3f3f);
  for (unsigned j(30); ~j; --j) if (Val & Bin[j]) {
    if (B[j]) Val ^= B[j], Set[i] ^= BSet[j];
    else { B[j] = Val, Highest = j; break; }
  }
  if (Highest ^ 0x3f3f3f3f) for (unsigned j(0); j <= 30; ++j)
    if (!Exi[j]) { BSet[Highest] = (Set[i] | Bin[j]), Exi[Bel[i] = j] = 1; break; }
}
void Delt(int i) {
  Del[i] = 1;
  if (Bel[i] == 0x3f3f3f3f) return;
  unsigned z(0x3f3f3f3f), Line(Bel[i]);
  for (int x(0); x < Cnt; x++) if ((!Del[x]) && (Bel[x] == 0x3f3f3f3f) && (Set[x] & Bin[Line])) { z = x; break; }
  if (z ^ 0x3f3f3f3f) {// Replace i by z
    Bel[z] = Line;
    unsigned t(Set[z] ^ Bin[Line]);
    for (unsigned x(0); x < Cnt; ++x) if (Set[x] & Bin[Line]) Set[x] ^= t;
    for (unsigned x(0); x <= 30; ++x) if (BSet[x] & Bin[Line]) BSet[x] ^= t;
    return;
  }
  unsigned XPos(0x3f3f3f3f), Xor, XSet;
  for (unsigned x(0); x <= 30; ++x) if (BSet[x] & Bin[Line]) {
    if (XPos == 0x3f3f3f3f) XPos = x, Xor = B[x], XSet = BSet[x];
    B[x] ^= Xor, BSet[x] ^= XSet;
  }
  Exi[Line] = 0;
}
signed main() {
  memset(Bel, 0x3f, sizeof(Bel));
  Bin[0] = 1;
  for (unsigned i(1); i <= 30; ++i) Bin[i] = (Bin[i - 1] << 1);
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    if (!(i % 10000)) fprintf(stderr, "Now %u\n", i);
    A = RDsg(), Ans = 0;
    if (A < 0) D = -A, Delt(a[D].back()), a[D].pop_back();
    else D = A, a[D].push_back(Cnt), Ins(Cnt++, D);
    for (unsigned j(30); ~j; --j) if (B[j] && (!(Ans & Bin[j]))) Ans ^= B[j];
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

## 离线删除

### 线段树

可以对时间构造线段树, 每个插入的元素看成一个区间修改, 区间就是它存在的时间区间, 区间修改会遇到 $O(\log n)$ 个节点, 给这些节点的 `vector` 中压入这个元素即可.

插入结束后对线段树每个节点求出自己 `vector` 中所有元素的线性基.

每次查询的时候, 在线段树上单点查询的时候合并 $O(\log n)$ 个线性基, 相当于 $O(\log n \log V)$ 次插入, 复杂度是 $O(m \log n \log^2 V)$. 如果按时间顺序回答询问, 每次用回滚的方式代替从头开始合并, 则可以均摊所有询问最多会合并 $O(n)$ 次, 需要 $O(n \log V)$ 次插入, 复杂度 $O(n \log^2 V)$.

我们同样可以在线段树构造完之后, DFS 使得每个节点的线性基变成父亲和自己线性基合并的结果. 这样每个时间的答案便可以在 $O(n \log^2 n)$ 的时间内处理出来.

下面这份代码可以通过前面提到的模板题.

```cpp
map<unsigned, vector<unsigned> > a;
unsigned Bin[32], B[31], n, D, CL, CR;
unsigned Cnt(0), Ans(0);
int A;
inline void Ins(unsigned x) {
  for (unsigned i(30); (~i) && x; --i) if (x >> i) {
    if (B[i]) x ^= B[i];
    else { B[i] = x; return; }
  }
}
struct Node {
  vector <unsigned> Val;
  Node* LS, * RS;
  inline void Chg(unsigned L, unsigned R) {
    if ((CL <= L) && (R <= CR)) { Val.push_back(D); return; }
    unsigned Mid((L + R) >> 1);
    if (CL <= Mid) LS->Chg(L, Mid);
    if (CR > Mid) RS->Chg(Mid + 1, R);
  }
  inline void DFS() {
    unsigned Bf[31];
    memcpy(Bf, B, sizeof(B));
    for (auto i : Val) Ins(i);
    if (!LS) {
      Ans = 0;
      for (unsigned i(30); ~i; --i) if (B[i] && (!(Ans & Bin[i]))) Ans ^= B[i];
      printf("%u\n", Ans);
    }
    else LS->DFS(), RS->DFS();
    memcpy(B, Bf, sizeof(B));
    return;
  }
}N[1000005], * CntN(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  if (L == R) return;
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
}
signed main() {
  Bin[0] = 1;
  for (unsigned i(1); i <= 30; ++i) Bin[i] = (Bin[i - 1] << 1);
  n = RD(), Build(N, 1, n);
  for (unsigned i(1); i <= n; ++i) {
    A = RDsg(), Ans = 0;
    if (A < 0) D = -A, CL = a[D].back(), CR = i - 1, N->Chg(1, n), a[D].pop_back();
    else D = A, a[D].push_back(i);
  }
  for (auto i : a) { D = i.first;  for (auto j : i.second) CL = j, CR = n, N->Chg(1, n); }
  fprintf(stderr, "Done\n");
  N->DFS();
  return Wild_Donkey;
}
```

### 无线段树

我们发现在线删除时, 最耗费时间的是维护 $Set$, 如果能想办法避免维护 $Set$, 时间复杂度就会得到非常大的优化.

分析 $Set$ 的作用, 发现它被用来寻找 $d$, 也就是 $Bel = \infin$ 的可以代替 $a_i$ 的元素. 如果想办法消除 $d$ 存在情况就可以省略这个判断了.

另需维护数组 $b$ 使得最高位为第 $i$ 位的 $b_i$ 

具体措施是处理出每个元素的删除时间, 然后在插入 $a_i$ 时, 如果 $a_i$ 生成新的维度, 则按原来的写法维护.

如果不能生成新的维度, 我们求出 $Set_i$ (注意这里不维护所有数字的 $Set$, 仅求出 $a_i$ 对应的 $Set_i$ 作为临时变量使用), 找出所有维度 $j \in Set_i$ 中单位向量删除时间最早的单位向量 $a_k$. 如果 $a_k$ 在 $a_i$ 之后删除, 则什么也不做, 否则直接用 $a_i$ 作为维度 $Bel_k$ 的单位向量, 进行替换操作.

复杂度: 在原来的基础上去掉维护和查询 $Set$ 的复杂度, 复杂度为 $O(\frac{n\log^2V}w)$.

```cpp
struct Num {
  unsigned In, Out, Val;
}List[500005];
map<unsigned, vector<unsigned> > a;
bitset<32> Exi;
unsigned Move[500005], Bel[500005], BSet[32], Bin[32], B[32], b[32], m, n;
unsigned C(0), D, Rk;
unsigned Cnt(0), Ans(0);
int A;
void Delt(int x) {
  if (Bel[x] == 0x3f3f3f3f) return;
  unsigned Line(Bel[x]), XPos(0x3f3f3f3f), Xor, XSet;
  for (unsigned i(0); i <= 30; ++i) if (BSet[i] & Bin[Line]) {
    if (XPos == 0x3f3f3f3f) XPos = i, Xor = B[i], XSet = BSet[i];
    B[i] ^= Xor, BSet[i] ^= XSet;
  }
  for (unsigned i(0); i <= 30; ++i) if (b[i] == x) { b[i] = b[XPos]; break; }
  b[XPos] = Exi[Line] = 0, Bel[x] = 0x3f3f3f3f;
}
signed main() {
  memset(Bel, 0x3f, sizeof(Bel));
  Bin[0] = 1;
  for (unsigned i(1); i <= 30; ++i) Bin[i] = (Bin[i - 1] << 1);
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    A = RDsg(), Ans = 0;
    Num* Cur;
    if (A < 0) Cur = List + a[D = -A].back(), Cur->Out = i - 1, Move[i] = Cur - List, a[D].pop_back();
    else D = A, a[D].push_back(++Cnt), List[Move[i] = Cnt] = Num{ i, 0, D };
  }
  for (auto i : a) { D = i.first;  for (auto j : i.second) List[j].Out = n; }
  for (unsigned i(1); i <= n; ++i) {
    if (!(i % 50000)) fprintf(stderr, "Now %u\n", i);
    unsigned x(Move[i]);
    Num* Cur(List + x);
    Ans = 0, D = Cur->Val;
    if ((Cur->In) ^ i) Delt(x);
    else {
      unsigned Highest(0x3f3f3f3f), TmpS(0), Line(0), TmpD(D);
      for (unsigned j(30); ~j; --j) if (D & Bin[j]) {
        if (B[j]) D ^= B[j], TmpS ^= BSet[j];
        else { b[j] = x, B[j] = D, Highest = j; break; }
      }
      if (Highest ^ 0x3f3f3f3f) {
        for (unsigned j(0); j <= 30; ++j) if (!Exi[j]) { Exi[Line = Bel[x] = j] = 1; break; }
        BSet[Highest] = (TmpS | Bin[Line]);
      }
      else {
        unsigned Last(0x3f3f3f3f);
        for (unsigned j(0); j <= 30; ++j) if (b[j] && (TmpS & Bin[Bel[b[j]]]) && (List[b[j]].Out < Last))
          Last = List[b[j]].Out, Line = Bel[b[j]], Highest = j;
        if (Last < Cur->Out) {
          Bel[b[Highest]] = 0x3f3f3f3f, Bel[b[Highest] = x] = Line, TmpS ^= Bin[Line];
          for (unsigned j(0); j <= 30; ++j) if (BSet[j] & Bin[Line]) BSet[j] ^= TmpS;
        }
      }
    }
    for (unsigned j(30); ~j; --j) if (B[j] && (!(Ans & Bin[j]))) Ans ^= B[j];
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

### 优化

是否可以通过插入的特判避免 $BSet$ 的维护, 使得程序更简洁.

考虑 $BSet$ 的作用, 在删除一个维度 $i$ 的时候, 需要把所有被维度 $i$ 的单位向量 $a_j$ 生成的 $B_k$ 都异或上最小的 $B_k$. $BSet$ 的作用就是找出所有这些 $B_k$. 如果能使每次找出的 $B_k$ 都只有 $B_i$ 一个, 只要让它自己变成 $0$ 即可, 那么我们便不需要维护 $BSet$ 了.

避免了 $B$ 的互相异或, 无需维护任何维度集合, 所以维度编号就不用记录了. 我们可以把 $i$ 作为 $B_i$ 插入时新建的维度的编号, 也就是最高位位置.

为了实现每次删除 $a_{b_i}$ 时, 只有 $B_i$ 是需要单位向量 $a_{b_i}$ 参与才能生成. 需要保证线性基中每个 $B_i$ 只需要不比 $i$ 删除得早的维度的单位向量参与生成.

由于避免了 $B$ 的相互异或, $B_i$ 的元素都是从高位一路异或过来才插入的, 所以只要一个时刻内, 满足任意 $B_i$ 只需要 $a_{b_j}\ (j \geq i)$ 参与即可生成, 那么任何后来插入的 $B_i$ 都不会需要 $j < i$ 的 $a_{b_i}$ 参与即可生成. 显然 $B$ 为空的时候满足这个条件, 所以任何时刻 $B$ 都能满足这个条件.

接下来我们只需要满足维度 $i$ 删除时间比任意 $j < i$ 都晚, 这样因为前面的性质, 就可以满足 $B_i$ 可以被删除时间不比 $i$ 早的维度 $j$ 的单位向量即可生成.

为了使得 $i$ 删除时间比 $j < i$ 的 $j$ 晚, 我们需要在插入时进行一些操作.

如果这时向线性基内插入 $a_i$, 过程中记录 $A$ 表示 $a_i$ 异或一些 $k > j$ 的 $a_{b_k}$ 得到的结果. 遇到 $B_j$ 和 $A$ 最高位相同, 按 $a_i$ 和 $a_{b_j}$ 的删除时间分类讨论:

- $a_i$ 更早删除
  那么直接用 $B_j$ 异或 $A$, 然后用新的 $A$ 继续这个过程讨论后面的元素.

- $a_{b_j}$ 更早删除
  这时候 $A$ 可以只用 $a_{b_k}\ (k < j)$ 和 $a_i$ 生成, 所以有资格作为 $B_j$, 我们使 $a_i$ 作为维度 $j$ 的单位向量, 而 $a_{b_j}$ 则是作为 $B$ 中别的元素的单位向量.
  实现上是交换 $B_j$ 和 $A$ 的数值, 然后交换 $b_j$ 和 $i$ 的数值, 就可以用新的 $A$ 和 $i$ 继续这个过程的讨论. 我们只是把 $B_j$ 暂时拿到了外面, 并不是把它删除, 因为原来的维度 $j$ 仍然存在, 只是编号不知道变成什么了, 并且 $b_j$ 也参与生成其它 $k < j$ 的 $B_k$.

这个过程直到 $A$ 或 $B_j$ 其中任何一个变成 $0$ 结束. 如果 $B_j$ 先为 $0$, 说明 $a_i$ 产生了新的维度, 赋值 $b_j = i$, $B_j = A$. 如果 $A$ 先变成 $0$, 则没有新维度产生, 直接跳出.

过程复杂度不变, 但是得到了简化.

```cpp
map<unsigned, unsigned> a;
unsigned Val[500005], Out[500005], Bin[32], B[32], b[32], n;
unsigned C(0), D, Rk;
unsigned Cnt(0), Ans(0);
int A;
signed main() {
  n = RD(), Bin[0] = 1; for (unsigned i(1); i <= 30; ++i) Bin[i] = (Bin[i - 1] << 1);
  memset(Out, 0x3f, (n + 1) << 2);
  for (unsigned i(1); i <= n; ++i) {
    A = RDsg(), Ans = 0;
    if (A < 0)  Out[Val[i] = Out[i] = a[D = -A]] = i - 1;
    else a[Val[i] = D = A] = i;
  }
  for (unsigned i(1); i <= n; ++i) if (Out[i] == 0x3f3f3f3f) Out[i] = n;
  for (unsigned i(1); i <= n; ++i) {
    if (!(i % 50000)) fprintf(stderr, "Now %u\n", i);
    Ans = 0, D = Val[i];
    if (i > Out[i]) { for (unsigned j(0); j <= 30; ++j) if (b[j] == D) { B[j] = b[j] = 0; break; } }
    else {
      unsigned Cur(i);
      for (unsigned j(30); (~j) && D; --j) if (D & Bin[j]) {
        if (B[j]) { if (Out[b[j]] < Out[Cur]) swap(D, B[j]), swap(Cur, b[j]); D ^= B[j]; }
        else { b[j] = Cur, B[j] = D; break; }
      }
    }
    for (unsigned j(30); ~j; --j) if (B[j] && (!(Ans & Bin[j]))) Ans ^= B[j];
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

## 例题

### [ABC223H](https://atcoder.jp/contests/abc223/tasks/abc223_h)

给一个序列, 每次询问一个区间 $[l, r]$ 的数字通过异或是否可以得到一个给出的数字 $X$.

很容易想到用线段树, 每个节点存这个区间的线性基. 每次查询时把 $\log n$ 个线性基合并起来, 直接查询 $X$ 是否存在于这个线性基的线性空间里. 单次查询复杂度 $O(\log n \log^2 V)$, 不能通过.

我们如果查询的是后缀而非区间, 一个贪心的思想是只要能用较短的后缀生成的数字, 那么比这个长的后缀就同样可以生成. 也就是说我们尝试使用尽可能靠后的元素生成 $X$. 如果存在两个元素, 插入当前线性基后得到的线性空间相同, 那么靠后面的元素相对于前面的元素更有价值.

思考优化过的线性基离线删除的算法, 相当于是让每一对 $i < j$ 满足 $a_{b_i}$ 比 $a_{b_j}$ 先删除. 用尽可能删除晚的元素代替同位置的删除早的元素, 贪心地维护这个线性基.

推广到区间修改上, 就是一边从左往右插入, 一边在这个长度为 $i$ 前缀生成的线性空间的线性基上回答 $r = i$ 的询问. 如果生成过程中出现了需要使用 $B_j$ 而 $b_j < l$ 的情况, 则回答是否定的. 如果无法生成 $X$, 则答案仍是否定的. 其余情况答案是肯定的.

```cpp
struct Query {
  unsigned long long Val;
  unsigned L, R, Num;
  inline const char operator < (const Query& x) const { return R < x.R; }
}Q[200005];
unsigned long long a[400005], B[60];
unsigned Pos[60], C, D, m, n;
unsigned Cnt(0), Tmp(0);
bitset<200005> Ans;
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) a[i] = RDll();
  for (unsigned i(1); i <= m; ++i) Q[i].L = RD(), Q[i].R = RD(), Q[i].Val = RDll(), Q[i].Num = i;
  sort(Q + 1, Q + m + 1);
  for (unsigned i(1), j(1); j <= m; ++j) {
    while (i <= Q[j].R) {
      unsigned long long A(a[i]);
      unsigned P(i++);
      for (unsigned k(59); (~k) && A; --k) if (A >> k) {
        if (!B[k]) { Pos[k] = P, B[k] = A;break; }
        if (P > Pos[k]) swap(P, Pos[k]), swap(A, B[k]);
        A ^= B[k];
      }
    }
    unsigned long long A(Q[j].Val);
    unsigned P(Q[j].L);
    for (unsigned k(59); ~k; --k) if (A >> k) {
      if (P > Pos[k]) break;
      A ^= B[k]; if (!A) { Ans[Q[j].Num] = 1; break; }
    }
  }
  for (unsigned i(1); i <= m; ++i) printf(Ans[i] ? "Yes\n" : "No\n");
  return Wild_Donkey;
}
```
