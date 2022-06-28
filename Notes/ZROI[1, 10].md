[TOC]

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

实现超级简单:

```cpp
unsigned a[10005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
bool b[10005];
struct Edge; 
struct Node {
  Edge *Fst;
  Node *Fa; 
  unsigned long long Dep;
}N[100005], *S;
struct Edge {
  Node *To;
  Edge *Nxt;
  unsigned Val;
}E[200005], *CntE(E);
void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst;
  x->Fst = CntE;
  CntE->To = y;
  CntE->Val = C;
}
void DFS(Node *x) {
  Edge *Sid(x->Fst);
  while (Sid) {
    if(Sid->To != x->Fa) {
      Sid->To->Fa = x;
      Sid->To->Dep = x->Dep + Sid->Val; 
      DFS(Sid->To);
    }
    Sid = Sid->Nxt;
  }
}
int main() {
  n = RD();
  for (register unsigned i(1); i < n; ++i) {
    A = RD(), B = RD(), C = RD();
    Link(N + A, N + B);
    Link(N + B, N + A);
  }
  for (register unsigned i(1); i <= n; ++i) N[i].Dep = 0x3f3f3f3f3f3f3f3f;
  m = RD(), S = N + RD(), S->Dep = 0;
  DFS(S); 
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD();
    printf("%llu\n", N[A].Dep + N[B].Dep); 
  }
  return Wild_Donkey;
}
```

### 例2

给定一棵边带权的树, 询问 $x$ 到 $y$ 路径上边权的最小值.

$n, m \leq 10^5$, $边权 \leq 10^9$

求 LCA 的同时统计信息 (貌似只能倍增), 过水已隐藏.

### 例3: [CF609E](https://codeforces.ml/contest/609/problem/E)

给一个边带权无向图, 求强制选择某条边的时候, 最小生成树边权总和.

先求最小生成树, 如果选定边本来就在树中, 则直接输出最小生成树权值. 否则选一点为根, 求选定边的两端点在最小生成树上的路径中权值的最大值, 删除这个权值, 将选定边的权值统计入答案即可.

码量没有那么短, 但是都是板子, 细节少, 半小时连写带调.

```cpp
unsigned Fa[200005], Stack[200005], StTp(0), m, n, Cnt(0), A, B, C, D, t;
unsigned long long Sum(0), Ans[200005], Tmp(0);
bool b[10005];
struct FakeEdge {
  unsigned Val, Fr, To, Num;
  char Tag;
  inline const char operator< (const FakeEdge &x) const{
    return this->Val < x.Val;
  }
}FE[200005];
struct Edge;
struct Node {
  Edge *Fst;
  Node *Fa[20];
  unsigned Max[20], Dep;
}N[200005];
struct Edge {
  Node *To;
  Edge *Nxt;
  unsigned Val;
  char InTr;
}E[400005], *CntE(E);
void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst;
  x->Fst = CntE;
  CntE->To = y;
  CntE->Val = C;
}
unsigned Find(unsigned x) {
  register unsigned Tmpx(x);
  while (Fa[Tmpx] ^ Tmpx) Stack[++StTp] = Tmpx, Tmpx = Fa[Tmpx];
  while (StTp) Fa[Stack[StTp--]] = Tmpx;
  return Tmpx;
}
void DFS(Node *x) {
  Edge *Sid(x->Fst);
  while (Sid) {
    if(Sid->To != x->Fa[0]) {
      Sid->To->Fa[0] = x;
      Sid->To->Max[0] = Sid->Val;
      Sid->To->Dep = x->Dep + 1;
      for (register unsigned i(0); Sid->To->Fa[i]; ++i) {
        Sid->To->Fa[i + 1] = Sid->To->Fa[i]->Fa[i];
        Sid->To->Max[i + 1] = max(Sid->To->Max[i], Sid->To->Fa[i]->Max[i]);
      }
      DFS(Sid->To);
    }
    Sid = Sid->Nxt;
  }
}
unsigned LCA(Node *x, Node *y) {
  register unsigned TmpM(0);
  if(x->Dep < y->Dep) swap(x, y);
  for (register unsigned i(18); i < 0x3f3f3f3f; --i) if(x->Fa[i]) if(x->Fa[i]->Dep >= y->Dep) {
    TmpM = max(TmpM, x->Max[i]);
    x = x->Fa[i];
  }
  if(x == y) return TmpM;
  for (register unsigned i(18); i < 0x3f3f3f3f; --i) if(x->Fa[i] != y->Fa[i]) {
    TmpM = max(TmpM, x->Max[i]);
    TmpM = max(TmpM, y->Max[i]);
    x = x->Fa[i];
    y = y->Fa[i];
  }
  TmpM = max(TmpM, x->Max[0]);
  TmpM = max(TmpM, y->Max[0]);
  return TmpM;
}
int main() {
  n = RD(), m = RD(); 
  for (register unsigned i(1); i <= m; ++i)
    FE[i].Fr = RD(), FE[i].To = RD(), FE[i].Val = RD(), FE[i].Num = i;
  sort(FE + 1, FE + m + 1);
  for (register unsigned i(1); i <= n; ++i) Fa[i] = i;
  for (register unsigned i(1); i <= m; ++i) if(Find(FE[i].Fr) ^ Find(FE[i].To)) {
    FE[i].Tag = 1;
    Fa[Fa[FE[i].Fr]] = Fa[FE[i].To];
    Sum += FE[i].Val;
  }
  for (register unsigned i(1); i <= m; ++i) if(FE[i].Tag) {
    C = FE[i].Val;
    Link(N + FE[i].Fr, N + FE[i].To);
    Link(N + FE[i].To, N + FE[i].Fr);
  }
  DFS(N + 1);
  for (register unsigned i(1); i <= m; ++i)
    if(FE[i].Tag) Ans[FE[i].Num] = Sum;
    else Ans[FE[i].Num] = Sum + FE[i].Val - LCA(N + FE[i].Fr, N + FE[i].To);
  for (register unsigned i(1); i <= m; ++i) printf("%llu\n", Ans[i]);
  return Wild_Donkey;
}
```

### 例4: [HDU3183](https://acm.hdu.edu.cn/showproblem.php?pid=3183)

每个测试点给一个 $1000$ 位以内的整数, 要求删除 $m$ 位, 使得结果最小.

每次从左往右扫, 如果当前位比下一位大, 删除这一位, 删完 $m$ 位为止. 如果当前位更小, 则当前位往后移一位, 继续判断.

错误: 我竟然再次用 `char` 存整数...

```cpp
unsigned m, n(1), Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
char a[10005], b[10005], Flg(0);
unsigned Pre[10005], Pro[10005];
inline void Clr() {
  memset(b, 0, n + 2);
  memset(a, 0, n + 2);
  memset(Pre, 0, (n + 2) << 2);
  memset(Pro, 0, (n + 2) << 2);
  n = 1;
  Flg = 0;
}
int main() {
  while (scanf("%s", a + 1) != -1) { 
    m = RD();
    while (a[n]) ++n;
    for (register unsigned i(0); i <= n; ++i) {
      Pre[i] = i - 1;
      Pro[i] = i + 1;
    }
    for (register unsigned i(1), j(0); i <= m; ++i) {
      while (a[j] <= a[Pro[j]]) j = Pro[j];
      b[j] = 1;
      Pro[Pre[j]] = Pro[j];
      Pre[Pro[j]] = Pre[j];
      j = Pre[j];
    }
    for (register unsigned i(1); i < n; i = Pro[i]){
      if(!b[i]) {
        if (a[i] == '0') {
          if(!Flg) continue;
          else printf("%c", a[i]);
        } else {
          printf("%c", a[i]);
          Flg = 1;
        }
      }
    }
    if(!Flg) putchar('0');
    putchar('\n'); 
    Clr();
  }
  return Wild_Donkey;
}
```

### 例5: [POJ3419](http://poj.org/problem?id=3419)

[LOJ 传送门](https://loj.ac/p/10121)

询问区间最长无重复元素的子段长度.

首先可以用双指针, 线性地处理出每个位置为左端点, 不重复的极长连续段长度 $f_{i, 0}$.

然后对 $f$ 建立最大值 ST 表.

接下来, 使用二分答案, 二分最长段的长度 $x$. `Judge()` 函数很简单, 只要查询 $[L, R - x + 1]$ 区间内的长度最大值是否大于 $x$ 即可.

```cpp
unsigned a[200005], f[200005][20], Log[200005], Bin[20], m, n, A, B, L, R, Mid, t, Ans(0), Tmp(0);
char Cnt[2000005];
inline void Clr() {}
inline unsigned Qry(unsigned x, unsigned y) {
  register unsigned Tmp(Log[y - x + 1]);
  return max(f[x][Tmp], f[y - Bin[Tmp] + 1][Tmp]);
}
inline char Judge(unsigned x) {
  return (Qry(A, B - x + 1) >= x);
}
int main() {
  n = RD(), m = RD(); 
  for (register unsigned i(1); i <= n; ++i)
    a[i] = RDsg() + 1000000;
  for (register unsigned i(1), j(1); i <= n; ++i) {
    while (!Cnt[a[j]]) ++Cnt[a[j++]];
    f[i][0] = j - i; 
    --Cnt[a[i]];
  }
  for (register unsigned i(1), j(0); i <= n; i <<= 1, ++j) 
    Log[i] = j, Bin[j] = i;
  for (register unsigned i(3); i <= n; ++i)
    Log[i] = max(Log[i], Log[i - 1]);
  for (register unsigned i(1), j(0); i <= n; i <<= 1, ++j)
    for (register unsigned k(1); k + (i << 1) <= n + 1; ++k)
      f[k][j + 1] = max(f[k][j], f[k + i][j]);
  for (register unsigned i(1); i <= m; ++i) {
    A = RD() + 1, B = RD() + 1;
    L = 1, R = B - A + 1;
    while (L ^ R) {
      Mid = ((L + R + 1) >> 1);
      if(Judge(Mid)) L = Mid;
      else R = Mid - 1;
    }
    printf("%u\n", L);
  }
  return Wild_Donkey;
}
```

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

```cpp
unsigned n, m, A;
long long a[100005], Sum[100005], B, C, Ans(0);
char Op[10];
struct Node {
  Node *LS, *RS;
  long long Val, Tag;
}N[200005], *CntN(N);
void PsDw(Node *x, unsigned Len) {
  if(x->Tag) {
    x->LS->Tag += x->Tag;
    x->LS->Val += x->Tag * ((Len + 1) >> 1);
    x->RS->Tag += x->Tag;
    x->RS->Val += x->Tag * (Len >> 1);
    x->Tag = 0;
  }
}
void Build(Node *x, unsigned L, unsigned R) {
  if(L == R) {
    x->Val = Sum[L];
    return;
  }
  register unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  x->Val = x->LS->Val + x->RS->Val;
  return;
}
void Chg(Node *x, unsigned L, unsigned R) {
  if(A <= L) {
    x->Tag += C;
    x->Val += (R - L + 1) * C;
    return;
  }
  PsDw(x, R - L + 1);
  register unsigned Mid((L + R) >> 1);
  Chg(x->RS, Mid + 1, R);
  if(Mid >= A) Chg(x->LS, L, Mid);
  x->Val = x->LS->Val + x->RS->Val;
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(A >= R) {
    Ans += x->Val;
    return;
  }
  PsDw(x, R - L + 1);
  register unsigned Mid((L + R) >> 1);
  Qry(x->LS, L, Mid);
  if(Mid < A) {
    Qry(x->RS, Mid + 1, R);
  }
}
int main() {
  n = RD(), m = RD(); 
  for (register unsigned i(1); i <= n; ++i) Sum[i] = Sum[i - 1] + (a[i] = RD());
  Build(N, 1, n);
  for (register unsigned i(1); i <= m; ++i) {
    scanf("%s", &Op);
    if(Op[0] ^ 'Q') {
      A = RD(), B = RD();
      C = B - a[A], a[A] = B;
      Chg(N, 1, n);
    } else {
      A = RD(), Ans = 0;
      Qry(N, 1, n);
      printf("%lld\n", Ans);
    }
  }
  return Wild_Donkey;
}
```

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

很显然这个时空复杂度都是错的.

考虑数据结构优化.

预处理 $Pre_i$ 表示 $a_i$ 前面一个和 $a_i$ 相等的元素的位置.

所以 $g_{k, j}$ 就可以表示为 $\displaystyle{\sum_{l = k}^{j} (l - Pre_l)[Pre_l \geq k]}$.

带入原方程:


$$
f_{i, j} = \min (f_{k, j - 1} + \sum_{l = k + 1}^{i} (l - Pre_l)[Pre_l \geq k + 1])
$$

发现转移时, 每个 $l - Pre_l$ 都会对满足 $(k \leq Pre_l - 1)$ 的 $f_{k, j - 1}$ 产生贡献. 所以可以在枚举 $i$ 的过程中将所以 $i - Pre_i$ 可能造成贡献的 $f_{k, j - 1}$ 值先加上 $i - Pre_i$. 这个过程相当于区间修改.

而转移就是要从这些数里面求出最小值, 相当于区间查最值.

使用线段树维护转移即可, 时间复杂度 $O(nm\log n)$, 空间复杂度 $O(n)$.

```cpp
unsigned a[35005], f[35005], Pre[35005], Pos[35005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
struct Node {
  Node *LS, *RS;
  unsigned Val, Tag;
}N[100005], *CntN(N);
void Ins(Node *x, unsigned L, unsigned R) {
  if(L == R) {
    return;
  } 
  register unsigned Mid((L + R) >> 1); 
  Ins(x->LS = ++CntN, L, Mid);
  Ins(x->RS = ++CntN, Mid + 1, R);
}
void Build(Node *x, unsigned L, unsigned R) {
  x->Tag = 0;
  if(L == R) {
    x->Val = f[L]; 
    return;
  }
  register unsigned Mid((L + R) >> 1); 
  Build(x->LS, L, Mid);
  Build(x->RS, Mid + 1, R);
  x->Val = min(x->LS->Val, x->RS->Val);
}
void PsDw(Node *x) {
  if(x->Tag) {
    x->LS->Tag += x->Tag;
    x->LS->Val += x->Tag;
    x->RS->Tag += x->Tag;
    x->RS->Val += x->Tag;
    x->Tag = 0;
  }
}
void Chg(Node *x, unsigned L, unsigned R) {
  if(R <= A) {
    x->Val += B;
    x->Tag += B;
    return;
  }
  PsDw(x);
  register unsigned Mid((L + R) >> 1);
  Chg(x->LS, L, Mid);
  if(Mid < A) {
    Chg(x->RS, Mid + 1, R);
  }
  x->Val = min(x->LS->Val, x->RS->Val);
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(R <= A) {
    Ans = min(Ans, x->Val);
    return;
  }
  PsDw(x);
  register unsigned Mid((L + R) >> 1);
  Qry(x->LS, L, Mid);
  if(Mid < A) {
    Qry(x->RS, Mid + 1, R);
  }
}
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(1); i <= n; ++i) {
    if(!Pos[a[i]]) Pos[a[i]] = i;
    Pre[i] = Pos[a[i]];
    Pos[a[i]] = i;
  }
  Ins(N, 1, n);
  for (register unsigned i(2); i <=n; ++i) {
    f[i] = f[i - 1] + i - Pre[i]; 
  }
  Build(N, 1, n); 
  for (register unsigned i(2); i <= m; ++i) {
    for (register unsigned j(i); j <= n; ++j) {
      A = Pre[j] - 1, B = j - Pre[j];
      if(A) Chg(N, 1, n);
      A = j - 1, Ans = 0x3f3f3f3f, Qry(N, 1, n);
      f[j] = Ans;
    }
    Build(N, 1, n);
  }
  register Node *Now(N);
  while (Now->RS) Now = Now->RS; 
  printf("%u\n", Now->Val);
  return Wild_Donkey;
}
```

另有一个自己口胡的奇妙想法: 使用可持久化线段树.

以 $i$ 为时间轴, $Pre_i$ 为下标, $i - Pre_i$ 为值, 建立可持久化线段树.

这时, $g_{i, j}$ 就相当于是在第 $j$ 个版本中对 $[i, n]$ 区间进行区间查询的结果. 相当于是前 $j$ 个元素中, 前驱大于 $i$ 的元素产生的贡献和, 可以 $O(n\log n)$ 预处理, $O(\log n)$ 查询.

关于转移, 因为 $f_{i, j}$ 的决策一定不比 $f_{i, j - 1}$ 的决策靠前 (总不会段数多了反而一段更长了吧), 也不会比 $f_{i - 1, j}$ 的决策靠前 (也不会遇到一个区间, 右边界多了一个元素反而左边界也增加元素的吧), 所以 $f$ 满足决策单调性.

决策单调性优化之后, 时间复杂度变成 $O(n (n + m) \log n)$, 空间 $O(nm + n \log n)$, 貌似也会 T.

```cpp
unsigned a[35005], f[105][35005], Chs[105][35005], Pre[35005], Pos[35005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
struct Node {
  Node *LS, *RS;
  unsigned Val, Tag;
}N[1000005], *Root[35005], *CntN(N);
void Chg(Node *x, Node *y, unsigned L, unsigned R) {
  if(!x) y->Val = B;
  else y->Val = x->Val + B;
  if(L == R) return;
  register unsigned Mid((L + R) >> 1);
  if(Mid < A) {
    if(!x) y->LS = NULL, Chg(NULL, y->RS = ++CntN, Mid + 1, R); 
    else y->LS = x->LS, Chg(x->RS, y->RS = ++CntN, Mid + 1, R);
  } else {
    if(!x) y->RS = NULL, Chg(NULL, y->LS = ++CntN, L, Mid); 
    else y->RS = x->RS, Chg(x->LS, y->LS = ++CntN, L, Mid);
  }
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(A <= L) {
    Ans += x->Val;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if(x->RS) Qry(x->RS, Mid + 1, R);
  if((x->LS) && (Mid >= A)) Qry(x->LS, L, Mid);
}
int main() {
  n = RD(), m = RD();
  memset(f, 0x3f, sizeof(f));
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(1); i <= n; ++i) {
    if(!Pos[a[i]]) Pos[a[i]] = i;
    Pre[i] = Pos[a[i]];
    Pos[a[i]] = i;
  }
  for (register unsigned i(1); i <= n; ++i) {
    A = Pre[i], B = i - Pre[i];
    Chg(Root[i - 1], Root[i] = ++CntN, 1, n);
  }
  f[1][0] = 0;
  for (register unsigned i(1); i <= n; ++i) {
    Chs[1][i] = 1;
    f[1][i] = f[1][i - 1] + i - Pre[i];
  }
  for (register unsigned i(2); i <= m; ++i) {
    Chs[i][n + 1] = n - 1;
    for (register unsigned j(n); j >= i; --j) {
      for (register unsigned k(Chs[i - 1][j]); k <= Chs[i][j + 1]; ++k) {
        A = k + 1, Ans = 0, Qry(Root[j], 1, n);
        if(f[i - 1][k] + Ans <= f[i][j]) {
          f[i][j] = f[i - 1][k] + Ans;
          Chs[i][j] = k;
        }
      }
    }
  }
  printf("%u\n", f[m][n]);
  return Wild_Donkey;
}
```

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

线段树维护这个权值, 一个节点维护八个值: `CntD`, `Val`, `ValC`, `ValD`, `BdC`, `BdD`, `BdL`, `BdR`.

- $CntD$ 是区间右括号数量, 结合区间长度可 $O(1)$ 求出 $CntC$, 所以不用特别维护
- $Val$ 表示这个区间的最大答案
- $ValC$ 表示区间去匹配后左括号数量
- $ValD$ 区间去匹配后右括号数量
- $BdC$ 表示节点区间 $[L, R]$ 的前缀 $[L, i]$ 中左括号减右括号的最大值
- $BdD$ 指后缀 $[i, R]$ 的右括号减左括号的最大值
- $BdL$ 是区间前缀去匹配后的最长长度
- $BdR$ 是区间后缀去匹配后的最长长度

然后是维护这些值:

- $CntD$ 直接按区间求和维护
- $ValC$ 和 $ValD$, 左儿子的左括号会和右儿子的左括号匹配, 这时需要判断这两种括号的数量关系, 以得到正确合并的结果
- $BdC$ 和 $BdD$ 类似于最大子段和的维护方式, 枚举前/后缀是否越过中线
- $BdL$ 和 $BdR$ 也是枚举是否越过中线, 不过对于跨中线的情况, 还要考虑中线左右的左右括号数量关系
- $Val$ 有四种情况, 前两种是答案区间完全被某个儿子包含, 后两种都是跨过中线, 区别在于去匹配后左右括号分界处和中线的关系, 枚举四种情况取最大即可.

总复杂度是 $O(m \log n)$, 代码也很简单, 因为查询区间都是 $[1, n]$, 所以无需写查询函数. 并且只需要单点修改即可, 所以无需使用 $Tag$.

```cpp
unsigned m, n, Cnt(0), A, B, t, Ans(0), Tmp(0);
char a[200005], Tmpc, Chgc;
struct Node {
  Node *LS, *RS;
  int CntD, Val, ValC, ValD, BdC, BdD, BdL, BdR;
}N[400005], *CntN(N);
inline void Print(Node *x) {
  printf("Point %u [%u, %u]\n", x - N, x->LS - N, x->RS - N);
  printf("Cnt) %u Val %u Val( %u Val) %u\n", x->CntD, x->Val, x->ValC, x->ValD);
  printf("( %u ) %u <- %u -> %u\n", x->BdC, x->BdD, x->BdL, x->BdR);
}
inline void Udt (Node *x, int Len) {
  x->CntD = x->LS->CntD + x->RS->CntD;
  x->ValC = x->RS->ValC + max(x->LS->ValC - x->RS->ValD, 0);
  x->ValD = x->LS->ValD + max(x->RS->ValD - x->LS->ValC, 0);
  x->BdC = max(x->LS->BdC, x->RS->BdC + ((Len + 1) >> 1) - ((x->LS->CntD) << 1));
  x->BdD = max(x->RS->BdD, x->LS->BdD + ((x->RS->CntD) << 1) - (Len >> 1));
  x->BdL = max(x->LS->BdL, max(x->LS->ValD + x->LS->ValC + x->RS->BdC, x->RS->BdL + x->LS->ValD - x->LS->ValC));
  x->BdR = max(x->RS->BdR, max(x->RS->ValD + x->RS->ValC + x->LS->BdD, x->LS->BdR + x->RS->ValC - x->RS->ValD));
  x->Val = max(x->LS->Val, x->RS->Val);
  register int TmpV = max(x->LS->BdR + x->RS->BdC, x->RS->BdL + x->LS->BdD);
  x->Val = max(x->Val, TmpV);
  return; 
}
void Build (Node *x, unsigned L, unsigned R) {
  if(L == R) {
    x->BdL = x->BdR = x->Val = 1;
    x->BdD = x->ValD = x->CntD = a[L];
    x->BdC = x->ValC = a[L] ^ 0x1;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  Udt(x, R - L + 1);
}
void Chg(Node *x, unsigned L, unsigned R) {
  if(L == R) {
    x->BdD = x->ValD = x->CntD = a[L];
    x->BdC = x->ValC = a[L] ^ 0x1;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if(A <= Mid) Chg(x->LS, L, Mid);
  else Chg(x->RS, Mid + 1, R);
  Udt(x, R - L + 1); 
}
int main() {
  n = ((RD() - 1) << 1), m = RD();
  scanf("%s", a + 1);
  for (register unsigned i(1); i <= n; ++i) a[i] -= '(';
  Build(N, 1, n);
  printf("%d\n", N->Val);
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD();
    if(a[A] ^ a[B]) {
      swap(a[A], a[B]);
      Chg(N, 1, n);
      A = B;
      Chg(N, 1, n);
    }
    printf("%d\n", N->Val);
  }
  return Wild_Donkey;
}
```

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

在处理从 $a_i$ 开始的最长上升/下降子序列时, 维护方案数.

实现:

对于每个长度, 开一棵动态开点线段树, 以 $a_i$ 为序, 存这个长度的最长上升/下降子序列, 以某个权值为左端点的方案数.

所以如果 $a_i$ 为左端点的最长上升/下降子序列的长度是 $L$, 那么就查询第 $L - 1$ 棵线段树中, 区间 $[1, a_i - 1]$/$[a_i + 1, Maxa]$ 的总和作为 $UpCnt_i$/$DownCnt_i$.

随后在第 $L$ 棵线段树的位置 $a_i$ 增加 $UpCnt_i/DownCnt_i$.

```cpp
const unsigned long long MOD(1000000007);
unsigned a[200005], Bin[200005], b[200005], Up[200005], Down[200005], UpCnt[200005], DownCnt[200005], Tmp[200005], f[200005];
unsigned m, n, Max(0), Ans(0), Now(0), A, B, C, D;
struct Node {
  Node *LS, *RS;
  unsigned Val;
}N[5000005], *Root[200005], *CntN(N);
void Add (Node *x, unsigned L, unsigned R) {
  if(L == R) {
    x->Val += B;
    if(x->Val >= MOD) x->Val -= MOD; 
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if(A <= Mid) {
    if(!(x->LS)) x->LS = ++CntN, x->LS->LS = x->LS->RS = NULL, x->LS->Val = 0; 
    Add(x->LS, L, Mid);
  } else {
    if(!(x->RS)) x->RS = ++CntN, x->RS->LS = x->RS->RS = NULL, x->RS->Val = 0; 
    Add(x->RS, Mid + 1, R);
  }
  x->Val = 0;
  if(x->LS) x->Val = x->LS->Val;
  if(x->RS) x->Val += x->RS->Val;
  if(x->Val >= MOD) x->Val -= MOD; 
  return;
}
void Qry1(Node *x, unsigned L, unsigned R) {
  if(A <= L) {
    B += x->Val;
    if(B >= MOD) B -= MOD; 
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if(x->RS) Qry1(x->RS, Mid + 1, R);
  if(A <= Mid) if(x->LS) Qry1(x->LS, L, Mid);
  return;
}
void Qry2(Node *x, unsigned L, unsigned R) {
  if(A >= R) {
    B += x->Val;
    if(B >= MOD) B -= MOD; 
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if(x->LS) Qry2(x->LS, L, Mid);
  if(A > Mid) if(x->RS) Qry2(x->RS, Mid + 1, R);
  return;
}
int main() {
  n = RD() + 1;
  Bin[0] = 1;
  for (register unsigned i(1); i <= n; ++i) {
    Bin[i] = Bin[i - 1] << 1;
    if(Bin[i] >= MOD) Bin[i] -= MOD; 
  }
  for (register unsigned i(n - 1); i; --i) a[i] = b[i] = RD();
  sort(a + 1, a + n);
  D = unique(a + 1, a + n) - a;
  for (register unsigned i(1); i < n; ++i) b[i] = lower_bound(a + 1, a + D, b[i]) - a + 1;
  f[0] = 0x3f3f3f3f, ++D;
  Root[0] = ++CntN, Root[0]->LS = Root[0]->RS = NULL, Root[0]->Val = 0, A = D, B = 1, Add(Root[0], 1, D);
  for (register unsigned i(1); i < n; ++i) {
    Tmp[i] = lower_bound(f, f + Now + 1, b[i], greater<unsigned>()) - f;
    A = b[i] + 1, B = 0; if(A) Qry1(Root[Tmp[i] - 1], 1, D);
    UpCnt[n - i] = B, A = b[i]; 
    if(Tmp[i] > Now) {
      Now = Tmp[i];
      f[Now] = b[i];
      Root[Now] = ++CntN, Root[Now]->LS = Root[Now]->RS = NULL, Root[Now]->Val = 0;
    } else {
      f[Tmp[i]] = max(f[Tmp[i]], b[i]);
    }
    Add(Root[Tmp[i]], 1, D);
  }
  for (register unsigned i(1); i < n; ++i) Up[i] = Tmp[n - i];
  Now = 0, memset(f, 0, sizeof(f)), CntN = N;
  Root[0] = ++CntN, Root[0]->LS = Root[0]->RS = NULL, Root[0]->Val = 0, A = 1, B = 1, Add(Root[0], 1, D);
  for (register unsigned i(1); i < n; ++i) {
    Tmp[i] = lower_bound(f, f + Now + 1, b[i]) - f;
    A = b[i] - 1, B = 0; if(A) Qry2(Root[Tmp[i] - 1], 1, D);
    DownCnt[n - i] = B, A = b[i]; 
    if(Tmp[i] > Now) {
      Now = Tmp[i];
      f[Tmp[i]] = b[i];
      Root[Now] = ++CntN, Root[Now]->LS = Root[Now]->RS = NULL, Root[Now]->Val = 0;
    } else {
      f[Tmp[i]] = min(f[Tmp[i]], b[i]);
    }
    Add(Root[Tmp[i]], 1, D);
  }
  --n;
  for (register unsigned i(1); i <= n; ++i) {
    if(Max < Up[i] + (Down[i] = Tmp[n - i + 1]) - 1) {
      Max = Up[i] + Down[i] - 1;
      Ans = ((unsigned long long)UpCnt[i] * DownCnt[i] % MOD) * Bin[n - Max] % MOD;
    } else {
      if(Max == Up[i] + Down[i] - 1) {
        Ans += ((unsigned long long)UpCnt[i] * DownCnt[i] % MOD) * Bin[n - Max] % MOD;
        if(Ans >= MOD) Ans -= MOD;
      }
    }
  }
  printf("%u %u\n", Max, Ans);
  return Wild_Donkey;
}
```

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

### [P1486](https://www.luogu.com.cn/problem/P1486)

维护一个集合, 支持:

- 加入一个数字

- 全局加减

- 查询排名第 $k$ 的元素

- 将低于下界的元素删除

典型的权值线段树, 记录一个 $Level$ 作为海平面, 每次全局加就降低海平面, 相当于整体增加了, 全局减就升高海平面, 并且将淹没的点删掉.

查询的时候在线段树上二分查找即可.

插入时记录一个总入队数 (注意判断一开始就不合法的情况, 直接跳过, 不计入总人数), 最后用总人数减去还在线段树里的人数即可.  

```cpp
unsigned a[10005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0), Level(100000);
char Op[5];
struct Node {
  Node *LS, *RS;
  unsigned Val;
}N[600005], *CntN(N);
void Del (Node *x, unsigned L, unsigned R){
  x->Val = 0;
  if(L == R) return;
  register unsigned Mid((L + R) >> 1);
  if(x->LS) {
    if(x->LS->Val) Del(x->LS, L, Mid);
    x->Val += x->LS->Val; 
  }
  if(x->RS) {
    if(Mid < Level - 1) if(x->RS->Val) Del(x->RS, Mid + 1, R); 
    x->Val += x->RS->Val;
  }
}
void Chg(Node *x, unsigned L, unsigned R) {
  ++(x->Val);
  if(L == R) return;
  register unsigned Mid((L + R) >> 1);
  if(A <= Mid) {
    if(!(x->LS)) x->LS = ++CntN;
    Chg(x->LS, L, Mid);
  } else {
    if(!(x->RS)) x->RS = ++CntN; 
    Chg(x->RS, Mid + 1, R);
  }
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(L == R) {B = L;return;}
  register unsigned Mid((L + R) >> 1);
  if(x->RS) {
    if(x->RS->Val >= A) return Qry(x->RS, Mid + 1, R);
    A -= x->RS->Val;
  }
  Qry(x->LS, L, Mid);
}
int main() {
  n = RD(), Level += (m = RD());
  for (register unsigned i(1); i <= n; ++i) {
    scanf("%s", &Op[1]), A = RD();
    switch (Op[1]) {
      case ('I') :{
        if(A >= m) {
          A += Level - m;
          ++Ans;
          Chg(N, 1, 300000);
        }
        break;
      }
      case ('A') :{
        Level -= A;
        break;
      }
      case ('S') :{
        Level += A;
        Del(N, 1, 300000);
        break;
      }
      case ('F') :{
        if(A > N->Val) {
          printf("-1\n");
          break;
        }
        Qry(N, 1, 300000);
        printf("%u\n", B - Level + m);
        break;
      }
    }
  }
  printf("%u\n", Ans - N->Val);
  return Wild_Donkey;
}
```

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

```cpp
const unsigned MOD1(1000000007);
unsigned Hash[26][200005], Bin[200005], m, n, Cnt(0), Len, A, B, C, D, t, Ans(0), Tmp(0), HashA[30], HashB[30];
char a[200005], Flg;
unsigned Find(unsigned L, unsigned R, unsigned *Ha) {
  register unsigned AnsF(Ha[R]);
  AnsF += MOD1 - ((unsigned long long)Ha[L - 1] * Bin[R - L + 1] % MOD1);
  if(AnsF >= MOD1) AnsF -= MOD1;
  return AnsF;
}
int main() {
  n = RD(), m = RD(); 
  scanf("%s", a + 1);
  Bin[0] = 1;
  for (register unsigned i(1); i <= n; ++i) {Bin[i] = Bin[i - 1] << 1; if(Bin[i] >= MOD1) Bin[i] -= MOD1;}
  for (register unsigned i(0); i < 26; ++i) Hash[i][0] = 1;
  for (register unsigned i(1); i <= n; ++i) {
    for (register char j(0); j < 26; ++j) {
      Hash[j][i] = (Hash[j][i - 1] << 1) + (((a[i] - 'a') ^ j) ? 0 : 1);
      if(Hash[j][i] >= MOD1) Hash[j][i] -= MOD1;
    }
  }
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), Len = RD(), C = A + Len - 1, D = B + Len - 1, Flg = 0;
    for (register unsigned j(0); j < 26; ++j) {
      HashA[j] = Find(A, C, Hash[j]);
      HashB[j] = Find(B, D, Hash[j]);
    }
    sort(HashA, HashA + 26);
    sort(HashB, HashB + 26);
    for (register unsigned j(0); j < 26; ++j) {
      if(HashA[j] ^ HashB[j]) {Flg = 1;break;}
    }
    printf(Flg ? "NO\n" : "YES\n"); 
  }
  return Wild_Donkey;
}
```

### Aho_Corasick_Algorithm

过水已隐藏

### [JSOI2007](https://www.luogu.com.cn/problem/P4052)

一个未知字符串 $A$, 我们知道它的长度 $m$, 由 $26$ 个大写字母组成, 有 $n$ 个模式串.

$A$ 一个情况是合法的, 定义为它有至少一个模式串作为子串. 输出在 $26^m$ 种情况中所有合法的情况数对 $10007$ 取模的结果.

对模式串建立 ACAM, 然后从 ACAM 每个节点上建一个数组 $f_{i, j}$ 表示走到第 $i$ 个点时已经走了 $j$ 步时的可行情况数.

重新标记结束点, 结束点 $Fail$ 树上的后代都是结束点.

重新连接转移边, 对于原本连向结束点和原本不存在的转移边, 将其跳 $Fail$ 直到出现非结束点的终点为止, 找不到就连到根上. 对于原本就存在且不是连向结束点的转移边, 不动.

在连接完的转移边的自动机上, 任意顺序枚举节点, 将它的当前长度 $f$ 值转移到对应点下一个长度的 $f$ 值上. 结束点不参与转移.

这个过程重复 $m$ 次, 将所有非结束点的长度 $m$ 的 $f$ 值加起来, 就得到了长度为 $m$ 且不含有模式串的方案数, 用 $26^m$ 减去这个值即可. (全程别忘了取模).

```cpp
const short MOD(10007);
const char _0(0), _26(26);
short Ans(0);
char m, n, a[105];
struct Node {
  Node *To[26], *Fail, *Fa, *Bro, *Son;
  char Ava;
  short f[105];
}N[6005], *CntN(N), *Now(N);
struct Sc {
  Node *Am;char Chr;
}Q[600005], *Hd(Q), *Tl(Q);
short Power(unsigned x, char y) {
  unsigned AnsP(1);
  while (y) {
    if(y & 1) AnsP = AnsP * x % MOD;
    y >>= 1, x = x * x % MOD; 
  }
  return AnsP; 
}
void DFS1(Node *x) {
  register Node *So(x->Son);
  if(x->Fail) if(x->Fail->Ava) x->Ava = 1;
  while (So) DFS1(So), So = So->Bro;
}
void DFS2(Node *x) {
  for (register char i(_0); i < _26; ++i) if(x->To[i]) DFS2(x->To[i]); else {
    register Node *Back(x->Fail);
    while (Back) {
      if(Back->To[i]) {
        x->To[i] = Back->To[i];
        break;
      }
      Back = Back->Fail;
    }
    if(!x->To[i]) x->To[i] = N;
  }
}
void Add(char x) {
  if(!(Now->To[x])) Now->To[x] = ++CntN, CntN->Fa = Now; 
  Now = Now->To[x];
}
void Build() {
  (++Tl)->Am = N;
  register Node *x;
  register char c;
  while (Hd != Tl) {
    x = (++Hd)->Am, c = Hd->Chr;
    if(x->Fa) {
      register Node *Back(x->Fa->Fail);
      while (Back) {
        if(Back->To[c]) {
          x->Fail = Back->To[c];
          x->Bro = Back->Son;
          Back->Son = x; 
          break;
        }
        Back = Back->Fail;
      }
      if(!(x->Fail)) x->Fail = N, x->Bro = N->Son, N->Son = x;
    }
    for (register char i(_0); i < _26; ++i) if(x->To[i]) (++Tl)->Am = x->To[i], Tl->Chr = i;
  }
}
int main() {
  n = RD(), m = RD();
  for (register char i(1); i <= n; ++i) {
    memset(a, 0, sizeof(a)), scanf("%s", &a[1]);
    a[0] = strlen(a + 1), Now = N;
    for (register unsigned j(1); j <= a[0]; ++j) Add(a[j] -= 'A');
    Now->Ava = 1;
  }
  Build(), DFS1(N), DFS2(N), N->f[0] = 1;
  for (register char i(1); i <= m; ++i) {
    for (register Node *j(N); j <= CntN; ++j) if(!(j->Ava)) {
      for (register char k(_0); k < _26; ++k) {
        j->To[k]->f[i] += j->f[i - 1];
        if(j->To[k]->f[i] >= MOD) j->To[k]->f[i] -= MOD; 
      }
    }
  }
  for (register Node *i(N); i <= CntN; ++i) {
    Ans += ((i->Ava) ? 0 : (i->f[m])); 
    if(Ans >= MOD) Ans -= MOD;
  }
  printf("%u\n", (MOD + Power(26, m) - Ans) % MOD);
  return Wild_Donkey;
}
```

### [HEOI2012](https://www.luogu.com.cn/problem/P4600)

给 $n$ 个字符串, 由 $26$ 个小写字母组成.

给出 $m$ 个询问, 每个询问给出 $a$, $b$ 表示两个字符串的编号, $Posa$, $Posb$ 是两个字符串的下标, 描述了 $a$ 的前缀 $[1, Posa]$, $b$ 的前缀 $[1, Posb]$. 回答这两个前缀最长的公共后缀的权值. 并且要求后缀是某个出现过的字符串的前缀.

规定一个字符串的权值是将它看成 $26$ 进制数后转化为 $10$ 进制后对 $10^9 + 7$ 取模的结果.

对给出的字符串建立 AC 自动机.

发现每个前缀都对应着确定的节点, 而每个节点一定能代表一个出现过的前缀. 只要在构造时将每个前缀对应的哈希值存到对应节点上, 这样问题就从找一个前缀的哈希值变成了找一个节点了.

发现每个节点在后缀链接树上的祖先就是它最长的非自身的后缀. 也就是说两个前缀的节点在后缀链接树上的公共祖先就是他们的公共后缀, 而满足条件的最长后缀就是他们的最近公共祖先.

所以本题就是构造 AC 自动机然后在后缀链接树上求 LCA.

实现上略有难度, 因为据说卡倍增空间, 所以需要树剖实现. 一开始用 ST 表也被卡空, 换成线段树然后将指针改成数组过掉了此题.

甚至写了[题解](https://www.luogu.com.cn/blog/Wild-Donkey/heoi2012-lv-xing-wen-ti).

```cpp
const unsigned MOD(1000000007);
const char _0(0), _26(26);
unsigned Nn, CntS(0), Len, m, n, Cnt(0), A, B, C, D, FindL, FindR, t, Ans(0), Tmp[2000005];
char b, Addx;
struct Node {
  unsigned Dep, Hash, DFSr, SubDFSr, To[26], Fa, Fail, Son, Bro;
}N[1000005], *CntN(N), *Now(N);
struct Sg {
  unsigned LS, RS, Val;
}S[4000005];
void Qry(Sg *x, unsigned L, unsigned R) {
  if((FindL <= L) && (R <= FindR)) {
    if(Now->Dep > N[x->Val].Dep) Now = N + x->Val; 
    return; 
  }
  register unsigned Mid((L + R) >> 1);
  if(Mid >= FindL) Qry(S + x->LS, L, Mid);
  if(Mid < FindR) Qry(S + x->RS, Mid + 1, R);
}
void BuildSg(Sg *x, unsigned L, unsigned R) {
  if(L == R) {x->Val = Tmp[L];return;}
  register unsigned Mid((L + R) >> 1);
  BuildSg(S + (x->LS = ++CntS), L, Mid);
  BuildSg(S + (x->RS = ++CntS), Mid + 1, R);
  if(N[S[x->LS].Val].Dep < N[S[x->RS].Val].Dep) x->Val = S[x->LS].Val;
  else x->Val = S[x->RS].Val;
}
unsigned Pool[20000005], *Pos[1000005], Top(0);
struct Quu {
  unsigned P; char Chr;
}TmpQ;
queue<Quu> Q;
void Add() {
  if(!Now->To[Addx]) Now->To[Addx] = ++CntN - N, CntN->Fa = Now - N, CntN->Son = 0x3f3f3f40;
  N[Now->To[Addx]].Hash = (((unsigned long long)26 * Now->Hash) + Addx) % MOD, Now = N + Now->To[Addx];
}
void Build() {
  TmpQ.P = 0;
  Q.push(TmpQ);
  register Node *x, *Back;
  register char c; 
  while (Q.size()) {
//    printf("Q.size %u\n", Q.size());
    TmpQ = Q.front(), Q.pop();
    x = N + TmpQ.P, c = TmpQ.Chr;
//    printf("BFS %u\n", x - N);
    if(x->Fa < 0x3f3f3f3f) {
      Back = N + N[x->Fa].Fail;
//      printf("Back %llu %u\n", Back - N, N[x->Fa].Fail);
      while (Back < N + 0x3f3f3f3f) {
        if(Back->To[c]) {
//          printf("Got %u %u\n", Back->To[c], x - N);
          x->Fail = Back->To[c];
          x->Bro = N[Back->To[c]].Son;
          N[Back->To[c]].Son = x - N;
          break; 
        }
        Back = N + Back->Fail;
      }
      if(!(x->Fail)) {
        x->Fail = 0;
        x->Bro = N->Son;
        N->Son = x - N;
      }
    }
    for (register char i(_0); i < _26; ++i) if(x->To[i]) TmpQ.P = x->To[i], TmpQ.Chr = i, Q.push(TmpQ);
  }
}
void DFS(Node *x) {
  Tmp[++Cnt] = x - N, x->DFSr = Cnt;
  register Node *So(N + x->Son);
  while (So < N + 0x3f3f3f3f) So->Dep = x->Dep + 1, DFS(So), So = N + So->Bro;
  Tmp[++Cnt] = x - N, x->SubDFSr = Cnt;
  return;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    while ((b = getchar()) < 'a');
    Now = N, Pos[i] = Pool + Top + 1;
    while (b >= 'a') Addx = b - 'a', Add(), Pool[++Top] = Now - N, b = getchar();
  }
  N[0].Son = N[0].Fa = N[0].Fail = 0x3f3f3f40, Build(), N->Dep = 1, DFS(N), Nn = CntN - N + 1, Nn <<= 1, BuildSg(S, 1, Nn);
  m = RD(), N[Nn + 1].Dep = 0x3f3f3f3f;
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    FindL = N[Pos[A][B - 1]].DFSr, FindR = N[Pos[C][D - 1]].DFSr;
    if(FindL > FindR) swap(FindL, FindR);
    if(N[Tmp[FindL]].SubDFSr > FindR) Now = N + Tmp[FindL];
    else Now = N + Nn + 1, Qry(S, 1, Nn), Now = N + Now->Fail;
    printf("%u\n", Now->Hash);
  }
  return Wild_Donkey;
}
```

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

首先 KMP 处理字符串的 Border 数组.

对于每个前缀, 它的最长的非自身周期就是本身长度减去最短非 $0$ Border. 这个最短非 $0$ Border 可以通过连续跳 Border 来求出. 如果本身 Border 就是 $0$, 说明这个前缀不存在非自身周期, 则不统计答案. 否则答案加上周期长度.

因为跑了一遍 KMP, 然后又线性扫了一遍 Border, 所以复杂度是 $O(n)$.

极限卡常后, 此代码以微弱优势抢了最优解.

```cpp
unsigned Bdr[1000005];
char aP[1000005];
int main() {
  register unsigned n(RD());
  register unsigned long long Ans(0);
  register char *a(aP);
  fread(a + 1, 1, 1000002, stdin);
  while (a[1] < 'a') ++a;
  for (register unsigned i(2), j; i <= n; ++i) {
    j = Bdr[i - 1];
    while (j && (a[j + 1] ^ a[i])) j = Bdr[j];
    Bdr[i] = (j ? (j + 1) : (a[1] == a[i]));
  }
  for (register unsigned i(1), j, *Bdi(Bdr + 1); i <= n; ++i, ++Bdi) if(j = *Bdi) Ans += i - (*Bdi = (Bdr[j] ? Bdr[j] : j));
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

### [POJ2752](Seek the Name, Seek the Fame)

求一个字符串前缀和后缀相匹配的数量.

求 $Next_n$ 的 $Next$ 链长度即可.

### [EXKMP](https://www.luogu.com.cn/problem/P5410)

$ZT_i$ 定义为模式串 $T$ 第 $i$ 位后面的子串 $[i, i + ZT_i)$ 和前缀 $[1, ZT_i]$ 匹配.

也就是求一个字符串每个后缀和本身的最长公共前缀长度.

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

因为是全局修改, 所以可以打一个 $Tag$, 然后在询问的过程中判断两个数组中的元素大小的时候叠加上 $Tag$ 的修正即可. 

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

建立 $n$ 个数的 ACAM, 然后在 ACAM 上跑 DP, 每个节点 $i$ 存一个数组 $f_{j, pos, 0/1}$, 表示走到第 $Pos$ 位的时候, 包含了状压状态为 $j$ 表示的子串的, 是否顶着上界的情况数.

重定义转移边后跑 DP 即可, 注意边界条件是所有情况中, 前导零后面的第一个非零转移, 需要特别讨论.

```cpp
const unsigned MOD(998244353);
const char _0(0), _1(1), _10(10);
char Len, TLen, m, n;
unsigned Ans(0), Tmp(0);
char L[105], R[105], a[105];
struct Node {
  Node *To[10], *Fa, *Fail, *Son, *Bro;
  unsigned f[105][32][2], Sum[105][32][2];
  char End;
}N[105], *Last(N), *CntN(N);
struct Quee {
  Node *Nd;
  char Chr;
}Q[105], *Hd(Q), *Tl(Q);
void Add(char c) {
  if(!(Last->To[c])) Last->To[c] = ++CntN, CntN->Fa = Last;
  Last = Last->To[c];
}
void Build() {
  (++Tl)->Nd = N;
  register Node *x, *Back;
  register char c; 
  while (Hd != Tl) {
    x = (++Hd)->Nd, c = Hd->Chr;
    if(x->Fa) {
      Back = x->Fa->Fail;
      while (Back) {
        if(Back->To[c]) {
          x->Fail = Back->To[c];
          x->Bro = Back->To[c]->Son;
          Back->To[c]->Son = x;
          break;
        }
        Back = Back->Fail; 
      }
      if(!(x->Fail)) x->Fail = N, x->Bro = N->Son, N->Son = x;
    }
    for (register char i(_0); i < _10; ++i) if(x->To[i]) (++Tl)->Nd = x->To[i], Tl->Chr = i;
  } 
}
void DFS(Node *x) {
  register Node *So(x->Son);
  while (So) So->End |= x->End, DFS(So), So = So->Bro;
}
void ReLink(Node *x) {
  register Node *Back; 
  for (register char i(_0); i < _10; ++i) {
    if(!(x->To[i])) {
      Back = x->Fail;
      while (Back) {
        if(Back->To[i]) {x->To[i] = Back->To[i];break;}
        Back = Back->Fail;
      }
      if(!(x->To[i])) x->To[i] = N;;
    } else {
      ReLink(x->To[i]);
    }
  }
}  
void DP (char *x, char Lead) {
  for (register char j(_1); j <= (x[Lead]); ++j)
    ++(N->To[j]->f[Lead + 1][N->To[j]->End][(j == x[Lead]) ? _1 : _0]),
    N->To[j]->Sum[Lead + 1][N->To[j]->End][(j == x[Lead]) ? _1 : _0] += j;
  for (register char i(Lead + _1); i < Len; ++i) {
    for (register char j(_1); j < _10; ++j)
      ++(N->To[j]->f[i + 1][N->To[j]->End][0]),
      N->To[j]->Sum[i + 1][N->To[j]->End][0] += j;
    for (register char j(_0); j < m; ++j) {
      for (register Node *k(N); k <= CntN; ++k) {
        register unsigned *Des;
        for (register char l(_0); l < x[i]; ++l) {
          Des = k->To[l]->f[i + 1][j | k->To[l]->End];
          *Des += k->f[i][j][0]; if(*Des >= MOD) *Des -= MOD;
          *Des += k->f[i][j][1]; if(*Des >= MOD) *Des -= MOD;
          Des = k->To[l]->Sum[i + 1][j | k->To[l]->End];
          *Des = (((unsigned long long)k->Sum[i][j][0] + k->Sum[i][j][1]) * 10 + ((unsigned long long)k->f[i][j][0] + k->f[i][j][1]) * l + *Des) % MOD;
        }
        Des = k->To[x[i]]->f[i + 1][j | k->To[x[i]]->End];
        *(Des + 1) += k->f[i][j][1]; if(*(Des + 1) >= MOD) *(Des + 1) -= MOD;
        *Des += k->f[i][j][0]; if(*Des >= MOD) *Des -= MOD;
        Des = k->To[x[i]]->Sum[i + 1][j | k->To[x[i]]->End];
        *Des = ((unsigned long long)k->Sum[i][j][0] * 10 + (unsigned long long)k->f[i][j][0] * x[i] + *Des) % MOD;
        *(Des + 1) = ((unsigned long long)k->Sum[i][j][1] * 10 + (unsigned long long)k->f[i][j][1] * x[i] + *(Des + 1)) % MOD;
        for (register char l(x[i] + 1); l < _10; ++l) {
          Des = k->To[l]->f[i + 1][j | k->To[l]->End];
          *Des += k->f[i][j][0]; if(*Des >= MOD) *Des -= MOD;
          Des = k->To[l]->Sum[i + 1][j | k->To[l]->End];
          *Des = ((unsigned long long)k->Sum[i][j][0] * 10 + (unsigned long long)k->f[i][j][0] * l + *Des) % MOD;
        }
      }
    }
  }
  for (register Node *k(N); k <= CntN; ++k){
    register unsigned *Des(k->Sum[Len][m - 1]);
    Tmp += *Des; if(Tmp >= MOD) Tmp -= MOD;
    Tmp += *(Des + 1); if(Tmp >= MOD) Tmp -= MOD;}
  for (register char i(_1); i <= Len; ++i)
    for (register char j(_0); j < m; ++j)
      for (register Node *k(N); k <= CntN; ++k)
        k->f[i][j][0] = k->f[i][j][1] = k->Sum[i][j][0] = k->Sum[i][j][1] = 0;
}
int main() {
  n = RD(), m = (1 << n), scanf("%s%s", L, R), TLen = strlen(L), Len = strlen(R);
  for (register unsigned i(TLen - 1); i < 0x3f3f3f3f; --i) L[Len - TLen + i] = L[i] - '0';
  for (register char i(_0); i < Len - TLen; ++i) L[i] = 0;
  for (register char i(_0); i < Len; ++i) R[i] = R[i] - '0';
  TLen = Len - 1; while (!L[TLen]) L[TLen] = 9, --TLen; --L[TLen], TLen = 0, L[Len] = 1; 
  while(!L[TLen]) ++TLen;
  for (register char i(_0), j; i < n; ++i) {
    memset(a, 0, sizeof(a)), scanf("%s", a), j = strlen(a), Last = N;
    for (register char k(0); k < j; ++k) Add(a[k] - '0');
    Last->End = 1 << i;
  }
  Build(), DFS(N), ReLink(N), DP(R, 0), Ans = Tmp, Tmp = 0, DP(L, TLen), Ans += MOD - Tmp;
  if(Ans >= MOD) Ans -= MOD; printf("%u\n", Ans);
  return Wild_Donkey;
}
```

## Day8: 分治 & CDQ & 线段树分治

### 例题

一张无向图, 每次询问 $a$, $b$ 不经过 $c$ 的最短路, $n \leq 200$, $q \leq 10^5$.

数据范围提示了 Floyd, 但是这个 Floyd 是排除了某个点的 Floyd, 我们只要发现将点插入 $Floyd$ 容易维护, 所以考虑加点 + 撤销, 采用分治, 先将左边的插入, 然后对右边分治, 右边结束之后, 撤销左边点的加入, 继续递归左边. 递归到边界就可以直接回答没有 $c_i$ 存在的最短路.

### [ZJOI2016](https://www.luogu.com.cn/problem/P3350)

给一个正边权的网格图和若干询问, 每次询问两点间最短路.

$nm \leq 2*10^4$, $q \leq 10^5$

将矩形分割成两个矩形, 对于分割线上的所有点, 求到矩形内所有点的单源最短路, 然后递归两个子矩形, 重复之前的操作.

然后分析两点间的路径可能的情况.

![P3350.png](https://i.loli.net/2021/08/24/U6Fn4ouGR7az5LY.png)

两点间的路径可能是蓝线, 跨过了右边子矩形的分割线, 也可能是黄线, 经过了左边子矩形的分割线, 对于所有可能经过的分割线, 枚举分割线上每个点到两个点的距离和, 取最小值作为答案.

离线询问, 然后求每一个分割线上的点到矩形内的最短路, 更新可能有影响的对应询问的答案, 最后将矩形分成两个, 用双端队列将询问分到两个子矩形中, 递归求解.

分析复杂度, 设最大的矩形面积为 $S$, 首先每一个矩形的分割线选择较短的一条, 这样可以将长度限制在 $\sqrt S$ 内. 每次求最短路的复杂度假设是 `Dijkstra` 的 $S\log S$, 那么一个矩形最短路的复杂度是 $O(S \sqrt S \log S)$.

而每次分割会使得下一层的矩形面积至多是这一层的一半, 所以下一层的最短路复杂度是 $O(\frac {S \sqrt S \log S}{\sqrt 2})$. 层数一共是 $O(\log S)$. 所以最短路的总复杂度是 $O(S\sqrt S \log^2 S)$.

更新答案的复杂度也很好算, 每层需要回答询问最多 $O(q)$ 个, 所以总复杂度是 $O(q \log S)$.

如果这样算, 复杂度 $O(S\sqrt S \log^2 S + q \log S)$.

$S = 20000, q = 1000000$ 算出来是 $5.5 * 10^8$, 最大数据跑了 $5s$, 所以考虑优化.

由于本题不卡 SPFA, 所以貌似 SPFA 比 Dijkstra 快一些. 这里最短路有一个 Trick, 可以利用上一轮的最短路对其进行优化, 使用上一轮的最短路作为初始值. 而不是每次重新给数组赋值 `0x3f3f3f3f`.

可以将 $100\%$ 数据 SPFA 入队总次数从 $6 * 10^8$ 优化到 $3 * 10^7$, 效果显著.

```cpp
unsigned Dis[20005], Complexity(0), Befr;
unsigned short Hr[20005], Ve[20005];
unsigned short m, n, nm, A, B, C, D;
unsigned q, Prt[100005], Cnt(0), Hd, Tl;
unsigned Pos(unsigned short x, unsigned short y) { return (x - 1) * m + y - 1; }
struct Square {
  Square* LS, * RS;
  unsigned short Width, Height, LUx, LUy, Mid;
} S[20005], * CntS(S);
struct Node {
  unsigned short Globalx, Globaly;
  char Inque;
  Square* Bel;
} N[20005], * Q[10000005];
unsigned Pos(Node* x) { return (x->Globalx - 1) * m + x->Globaly - 1; }
struct Ques {
  unsigned A, B, NumQ;
}Quest[100005], QTmp[100005];
void SPFA(Node* Now) {
  register Square* Sq(Now->Bel);
  register Node* Cur;
  register unsigned* CDP(Dis + Pos(Sq->LUx, Sq->LUy));
  for (register unsigned i(1); i <= Sq->Height; ++i, CDP += m - Sq->Width)
    for (register unsigned j(1); j <= Sq->Width; ++j, ++CDP)
      *CDP = ((*CDP) ? (*CDP + Befr) : 0x3f3f3f3f);
  Hd = Tl = 0, Q[++Tl] = Now, CDP = Dis + Pos(Now), *CDP = 0;
  while (Tl ^ Hd) {
    Cur = Q[++Hd], Cur->Inque = 0, CDP = Dis + Pos(Cur);
    if ((Cur->Globalx > Sq->LUx) && (*(CDP - m) > *CDP + Ve[Cur - N - m])) {
      *(CDP - m) = *CDP + Ve[Cur - N - m];
      if (!((Cur - m)->Inque)) Q[++Tl] = Cur - m, Q[Tl]->Inque = 1;
    }
    if ((Cur->Globalx + 1 < Sq->LUx + Sq->Height) && (*(CDP + m) > *CDP + Ve[Cur - N])) {
      *(CDP + m) = *CDP + Ve[Cur - N];
      if (!((Cur + m)->Inque)) Q[++Tl] = Cur + m, Q[Tl]->Inque = 1;
    }
    if ((Cur->Globaly > Sq->LUy) && (*(CDP - 1) > *CDP + Hr[Cur - N - 1])) {
      *(CDP - 1) = *CDP + Hr[Cur - N - 1];
      if (!((Cur - 1)->Inque)) Q[++Tl] = Cur - 1, Q[Tl]->Inque = 1;
    }
    if ((Cur->Globaly + 1 < Sq->LUy + Sq->Width) && (*(CDP + 1) > *CDP + Hr[Cur - N])) {
      *(CDP + 1) = *CDP + Hr[Cur - N];
      if (!((Cur + 1)->Inque)) Q[++Tl] = Cur + 1, Q[Tl]->Inque = 1;
    }
  }
}
void Div(Square* Now, unsigned short x, unsigned short y, unsigned short _x, unsigned short _y) {
  Now->LUx = x, Now->LUy = y;
  Now->Height = _x - x + 1, Now->Width = _y - y + 1;
  register int Number(Now->Width * Now->Height);
  if ((Now->Height == 1) && (Now->Width == 1)) return;
  if (Now->Width < Now->Height) {  // Horizon
    Now->Mid = Now->LUx + (Now->Height >> 1);
    Div(Now->LS = ++CntS, x, y, Now->Mid - 1, _y);
    if (Now->Height > 2) Div(Now->RS = ++CntS, Now->Mid + 1, y, _x, _y);
    for (register Node* Cur(N + Pos(Now->Mid, Now->LUy)), *Des(N + Pos(Now->Mid, Now->LUy + Now->Width - 1)); Cur <= Des; ++Cur)
      Cur->Bel = Now;
  }
  else {  // Vertical
    Now->Mid = Now->LUy + (Now->Width >> 1);
    Div(Now->LS = ++CntS, x, y, _x, Now->Mid - 1);
    if (Now->Width > 2) Div(Now->RS = ++CntS, x, Now->Mid + 1, _x, _y);
    for (register Node* Cur(N + Pos(Now->LUx, Now->Mid)), *Des(N + Pos(Now->LUx + Now->Height - 1, Now->Mid)); Cur <= Des; Cur += m)
      Cur->Bel = Now;
  }
}
void Qry(Square* Now, unsigned Pre, unsigned Pro) {
  memcpy(QTmp, Quest + Pre, (Pro - Pre + 1) * sizeof(Ques));
  register unsigned Number(Now->Height * Now->Width), NPre(Pre - 1), NPro(Pro + 1), OPre(NPre), OPro(NPro), NumA, NumB;
  Pro -= Pre, Pre = 0;
  for (register unsigned i(1), *CDP(Dis + Pos(Now->LUx, Now->LUy)); i <= Now->Height; ++i, CDP += m - Now->Width)
    for (register unsigned j(1); j <= Now->Width; ++j, ++CDP)
      *CDP = 0;
  if (Now->Width < Now->Height) {
    Dis[Pos(Now->Mid, Now->LUy)] = 0;
    for (register Node* Cur(N + Pos(Now->Mid, Now->LUy)), *Des(N + Pos(Now->Mid, Now->LUy + Now->Width - 1)); Cur <= Des; ++Cur) {
      Befr = Dis[Pos(Cur)], SPFA(Cur);
      for (register unsigned i(Pre); i <= Pro; ++i)
        Prt[QTmp[i].NumQ] = min(Dis[QTmp[i].A] + Dis[QTmp[i].B], Prt[QTmp[i].NumQ]);
    }
    for (register unsigned i(Pre); i <= Pro; ++i) {
      if (N[QTmp[i].B].Globalx < Now->Mid) Quest[++NPre] = QTmp[i];
      if (N[QTmp[i].A].Globalx > Now->Mid) Quest[--NPro] = QTmp[i];
    }
  }
  else {
    Dis[Pos(Now->LUx, Now->Mid)] = 0;
    for (register Node* Cur(N + Pos(Now->LUx, Now->Mid)), *Des(N + Pos(Now->LUx + Now->Height - 1, Now->Mid)); Cur <= Des; Cur += m) {
      Befr = Dis[Pos(Cur)], SPFA(Cur);
      for (register unsigned i(Pre); i <= Pro; ++i)
        Prt[QTmp[i].NumQ] = min(Dis[QTmp[i].A] + Dis[QTmp[i].B], Prt[QTmp[i].NumQ]);
    }
    for (register unsigned i(Pre); i <= Pro; ++i) {
      if ((N[QTmp[i].A].Globaly < Now->Mid) && (N[QTmp[i].B].Globaly < Now->Mid)) Quest[++NPre] = QTmp[i];
      if ((N[QTmp[i].A].Globaly > Now->Mid) && (N[QTmp[i].B].Globaly > Now->Mid)) Quest[--NPro] = QTmp[i];
    }
  }
  if (NPre ^ OPre) Qry(Now->LS, OPre + 1, NPre);
  if (NPro ^ OPro) Qry(Now->RS, NPro, OPro - 1);
}
int main() {
  n = RD(), m = RD(), nm = n * m;
  for (register unsigned short i(1), k(0); i <= n; ++i, ++k)
    for (register unsigned short j(1); j < m; ++j, ++k)
      Hr[k] = RD();
  for (register unsigned short i(1), k(0); i < n; ++i)
    for (register unsigned short j(1); j <= m; ++j, ++k)
      Ve[k] = RD();
  for (register unsigned short i(1), k(0); i <= n; ++i)
    for (register unsigned short j(1); j <= m; ++j, ++k)
      N[k].Globalx = i, N[k].Globaly = j;
  Div(S, 1, 1, n, m);
  scanf("%u", &q);
  for (register unsigned i(1); i <= q; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    if ((A == C) && (B == D)) { Prt[i] = 0;continue; }
    if (A > C) swap(A, C), swap(B, D);
    Quest[++Cnt].A = Pos(A, B), Quest[Cnt].B = Pos(C, D);
    Quest[Cnt].NumQ = i, Prt[i] = 0x3f3f3f3f;
  }
  Qry(S, 1, Cnt);
  for (register unsigned i(1); i <= q; ++i) printf("%u\n", Prt[i]);
  return Wild_Donkey;
}
```

### 例题

给 $n$ 个物品, 每个物品 $c_i$ 个, 定义 $\displaystyle{m = \sum_i^n c_i}$, 初始代价是 $a_i$, 每次选代价会减少 $b_i$, 对于不同的 $k$, 选择 $k$ 件物品的最小价值是多少.

固定一个 $k$, 在选了的物品中, 至多有一种物品没有选完, 所以每种物品一旦选就选完 $c_i$ 或 $k$ 为止. 但是 $k$ 的方案一定不是从 $k - 1$ 的方案的基础上转移而来的.

$O(n)$ 枚举选了, 但没完全选的物品, $O(nm)$ 剩下的 $n - 1$ 的物品跑 0/1 背包求出全部选了的物品, 背包所需总复杂度 $O(n^2m)$.

分治加物品, 每个物品加入背包需要 $O(m)$, 总的问题需要每个物品执行 $O(\log n)$ 次加入操作. 因此背包总的复杂度是 $O(nm\log n)$.

### 例题

给长为 $n$ 的序列, 再给单调不增的数组 $f$, 求最长的 $[l, r]$, 使得区间中数字出现次数 $\geq f_{r - l + 1}$, $n \leq 10^6$.

$O(n)$ 预处理每个数字出现次数, 扫描出整个数列任意一个出现次数小于 $f_n$ 的数字 $Mid$, 那么它不可能再答案中出现, 因为随着长度缩小, $f$ 不会缩小, 而 $Mid$ 出现数量不会增大, 所以我们可以将 $Mid$ 从数列中删除, $Cnt_Mid = Cnt_Mid - 1$, 也就是将数列分成两段.

从左右两端双指针同时扫描, 这样可以在两段中较小的一段的长度 $l$ 的复杂度下找到任意一个不合法的数字, 而我们只要求出了较小的一段的出现次数 $CntMin_i$, 就可以结合 $Cnt_i$ 求出较长的一段的出现次数 $Cnt_i - CntMin_i$.

<!-- ### 例题 (交互)

给 $2n$ 个, $n$ 种糖果, 每种糖果出现 $2$ 次, 排成一行. 有两种操作:

- 往序列中放一颗糖

- 从序列里拿一颗糖

每次操作后可以知道有多少不同种类的糖在序列中.

我们可以从左往右拿, 如果糖还在, 则拿走它, 如果有一个种类的不见了, 那我们就放回去, 然后继续扫描整个序列, 这时整个序列每个种类都出现了 $1$ 次.

然后分段 -->

### CDQ 分治解决三维偏序问题

第一维排序, 第二维分治, 第三维树状数组, 细节过水已隐藏

### 最长偏序链

就是多了一维的 LIS.

一个三元组定义一个值 $f$, 表示它为结尾的最长偏序链长度.

按 $a$ 排序.

将序列分成两半, 左右两边分别按 $b$ 排序, 假设左边的 $f$ 已经求出, 我们用双指针扫描, 不断将左边的 $f_i$ 按 $c_i$ 为序插入权值线段树, 维护最大值, 查询右边 $c_i$ 的 $[1, c_i)$ 的最大值, 更新 $f_i$, 然后递归右边.

<!-- ### 例题

一个长度为 $n$ 的排列, 有些位置上的数字已经确定了, 剩下位置上的数字不确定. 你要确定剩下位置上的数字, 让得到的排列的最长上升子序列长度尽量长. $n \leq 10^5$

第 $Nxt_i$ 位是 $i$ 后面的第一个确定的数字, 我们用一个数组 $g_i$ 表示确定的位置 $i$ 到 $Nxt_i$ 的, 能填入 $(i, Nxt_i)$ 的在 $(a_i, a_{Nxt_i})$ 区间内的数字个数.

$f_i$ 表示以位置 $i$ 为结尾的最长上升子序列的长度, 则它是由 -->

<!-- ### 例题

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

发现可以用 $Dis_{i, i + 1}$ 的前缀和进行优化,  -->

### [CF1365G](https://codeforces.com/contest/1365/problem/G)

有 $1000$ 个数字 $a_1$, $a_2$,…, 你想知道对于每个 $1 \leq i \leq 1000$, 除了 $a_i$ 以外其它所有数字 `|` 起来的结果.

你可以做至多 $13$ 次下面的询问: 给定若干个位置, 交互库会返回这些位置对应数字 `|` 的结果.

首先考虑 $20$ 次, 询问, 可以通过询问每个下标的第 $i$ 二进制位为 $1$ 或 $0$ 的或和, 记为 $f_{i, 0/1}$, 共 $20$ 个数, 查询时对于 $x$ 的每个二进制位 $i$, 如果这一位是 $1$, 则统计 $f_{i, 0}$, 否则统计 $f_{i, 1}$.

之所以不能只对 $x$ 为 $0$ 的二进制位 $i$ 统计 $f_{i, 1}$, 而不去统计二进制位为 $0$ 的所有 $f$, 只用 $10$ 次查询完成此题, 是因为可能存在 $x'$, 对于 $x$ 为 $0$ 的所有位置, $x'$ 都为 $0$, 但是 $x' \neq x$. 这样就会漏掉 $x'$ 的元素没有统计.

所以尝试重新定义编号, 使得不存在 $x' \neq x$, 使得 $x' | x = x$. 这时必须保证编号的二进制表示中, $1$ 的数量相同. 假设新的编号二进制长度为 $a$, 每个编号含有 $b$ 个 $1$. 那么我们就可以在 $a$ 次查询内得到整个数列 $P$, 因为我们只要对于每个 $i \in [1, a]$ 知道 $f_{i, 1}$ 就可以了.

首先对于一对 $a$, $b$, 有 $\binom {a}{b}$ 种编号, 需要满足 $a \leq 13$. 显然, $b$ 相同的时候, $a$ 越大, 编号集合越大, 所以 $a$ 是 $13$. 而 $b$ 是 $a$ 的一半的时候, 集合最大, 所以取 $b = 6$ 或 $b = 7$, 其集合大小都是 $1716$, 可以表示 $1000$ 个下标.

```cpp
unsigned List[2005], InList[20005], Ask[2005], n, Cnt(0);
unsigned long long f[15], Ans(0);
void DFS(unsigned Dep, unsigned Csd, unsigned Now) {
  if (Dep == 13) {
    if (Csd == 7) List[++Cnt] = Now;
    return;
  }
  if (13 - Dep < 7 - Csd) return;
  DFS(Dep + 1, Csd + 1, (Now << 1) + 1);
  DFS(Dep + 1, Csd, Now << 1);
}
int main() {
  n = RD(), DFS(0, 0, 0);
  for (register unsigned i(1); i <= n; ++i)
    InList[List[i]] = i;
  for (register unsigned i(0); i < 13; ++i) {
    Cnt = 0;
    for (register unsigned j(1); j <= n; ++j)
      if (List[j] & (1 << i)) Ask[++Cnt] = j;
    if (Cnt) {
      printf("? %u", Cnt);
      for (register unsigned j(1); j <= Cnt; ++j)
        printf(" %u", Ask[j]);
      putchar('\n');
      fflush(stdout);
      f[i] = RDll();
    }
    else f[i] = 0;
  }
  putchar('!');
  for (register unsigned i(1); i <= n; ++i) {
    Ans = 0;
    for (register unsigned j(0); j < 13; ++j)
      if (!(List[i] & (1 << j))) Ans |= f[j];
    printf(" %llu", Ans);
  }
  putchar('\n'), fflush(stdout);
  return Wild_Donkey;
}
```

### 例题

一个 $n * n$ 的矩形 $(n \leq 1000)$, 你可以进行如下操作至多 $20$ 次:

选择若干行和若干列, 涂黑这些行列的交点.

使得最后只有主对角线没被涂黑.

两次操作可以将平行于对角线的一半的线上的交点转化为黑点, 这样就可以用 $O(2\log n)$ 次操作完成转化.

### 例题

有 $n$ 种物品, 第 $i$ 种物品第一次选择的收益是 $a_i$, 之后每次选择的收益都是 $b_i$, 代价始终为 $c_i$. 你需要求出在总代价不超过 $m$ 下收益的最大值.

有 $Q$ 次修改, 第 $j$ 次修改会在第 $i$ 次修改 $(i < j)$ 的基础上修改一个物品的两类收益. 你需要对于每次修改后输出答案.

$n, m, Q \leq 2000$

修改构成一个树形结构, 对于每个修改相当于在树的 DFS 序的区间上修改, 而这个区间可以用线段树维护.

背包 DP 可以考虑新建一个数组 $g_{i, j}$ 表示第 $i$ 个物品强制选一次, 花费 $j$ 的代价, 然后用它跑完全背包.

### 例题

有 $n$ 个物品, 每个物品有大小和权值, 每次查询一个区间中的物品拿出来做大小为 $W$ 的背包得到的结果. $n, m \leq 10^4, W \leq 100$, 区间不存在包含关系.

离线查询, 排序, 发现每个物品有贡献的询问一定是一个连续区间, 用线段树维护这个区间, 于是将每个物品插入对应节点上, 在线段树上 DFS, 过程中统计路径贡献, 每次到叶子就回答对应位置的询问.

## Day9: 平衡树

### Splay

过水已隐藏

### Treap

过水已隐藏

### 非旋 Treap (FHQ)

跑得比 Splay 还慢, 可以持久化.

内核是普通 Treap 的分裂和合并 (Split & Merge).

插入时首先将树分裂成两部分, 这两部分和插入的单点合并成一棵树.

删除时将树分成删除的单点, 该点左边的树, 该点右边的树, 然后合并它左右的树即可.

实现 (是谁说 FHQ 短的):

```cpp
const unsigned Base(1000000009);
unsigned Seed(1000000007), m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
struct Node {
  Node *LS, *RS;
  unsigned Val, RVal, Size;
}N[2000005], *CntN(N);
inline unsigned Rand() {
  return Seed *= Base;
}
void Upd(Node *x) {
  x->Size = 1;
  if (x->LS) x->Size += x->LS->Size;
  if (x->RS) x->Size += x->RS->Size;
}
pair<Node*, Node*> Split (Node *x) {
  register pair<Node*, Node*> TmpP;
  if(x->Val > C) {
    if(x->LS) {
      TmpP = Split(x->LS);
      x->LS = TmpP.second;
      Upd(x);
      return make_pair(TmpP.first, x);
    } else {
      TmpP.first = NULL, TmpP.second = x;
      return TmpP;
    }
  } else {
    if(x->RS) {
      TmpP = Split(x->RS);
      x->RS = TmpP.first;
      Upd(x);
      return make_pair(x, TmpP.second);
    } else {
      TmpP.first = x, TmpP.second = NULL;
      return TmpP;
    }
  }
}
Node *Merge(Node *x, Node *y) {
  if(!x) return y;
  if(!y) return x;
  if(x->RVal < y->RVal) {
    x->RS = Merge(x->RS, y);
    Upd(x);
    return x;
  } else {
    y->LS = Merge(x, y->LS);
    Upd(y);
    return y;
  }
}
void Insert() {
  C = B;
  register pair<Node*, Node*> TmpP(Split(N));
  register Node *LTr(TmpP.first), *RTr(TmpP.second), *Now(++CntN);
  Now->RVal = Rand(), Now->Val = B, Now->Size = 1; 
  Now = Merge(LTr, Now);
  Merge(Now, RTr);
}
void Delete() {
  C = B - 1;
  register pair<Node*, Node*> TmpP1(Split(N));
  C = B;
  register pair<Node*, Node*> TmpP2(Split(TmpP1.second));
  register Node *Now(TmpP2.first);
  if(Now) {
    Now = Merge(Now->LS, Now->RS);
    Now = Merge(TmpP1.first, Now);
  } else {
    Now = TmpP1.first;
  }
  Merge(Now, TmpP2.second);
}
void Rank() {
  register Node *now(N);
  while (now) {
    if(now->Val < B) {
      if(now->LS) D += now->LS->Size;
      ++D;
      now = now->RS;
    } else { 
      now = now->LS;
    }
  }
}
void Find() {
  register Node *now(N);
  while (now) {
    if(now->LS) {
      if(now->LS->Size < B) {
        B -= now->LS->Size;
      } else {
        now = now->LS;
        continue; 
      } 
    }
    if(B ^ 1) {
      --B, now = now->RS;
    } else {
      D = now->Val - 20000000;
      return;
    }
  }
}
int main() {
  m = RD();
  N[0].RVal = 0, N[0].Val = 0, N[0].Size = 0; 
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    B = RDsg() + 20000000;
    switch (A) {
      case (1) :{
        Insert();
        break;
      }
      case (2) :{
        Delete(); 
        break;
      }
      case (3) :{
        D = 0, Rank();
        break;
      }
      case (4) :{
        B -= 19999999; 
        Find();
        break;
      }
      case (5) :{
        D = 0, Rank();
        B = D, Find();
        break;
      }
      case (6) :{
        ++B, D = 1, Rank();
        B = D, Find();
        break;
      }
    }
    if(A >= 3) {
      printf("%d\n", D);
    } 
  }
  return Wild_Donkey;
}
```

### 文艺平衡树

过水已隐藏

### [HNOI2012](https://www.luogu.com.cn/problem/P3224)

给 $n$ 个带权点, 支持两种操作:

- 两点之间连边

- 查询某点所在连通块中权值第 $i$ 大的点

每个点维护一个平衡树, 连边可以用启发式合并在 $O(n \log^2 n)$ 内解决问题.

当然也可以使用权值线段树合并, 在均摊 $O(n \log^2 n)$ 时间内解决问题.

下面这份代码使用了平衡树启发式合并的做法.

```cpp
unsigned a[100005], Fa[100005], Stack[100005], TopS(0), m, n, Cnt(0), A, B, D, t, Ans(0), Tmp(0);
char Op[5];
inline unsigned Find(unsigned x) {
  register unsigned Tmpx(x);
  while (Tmpx ^ Fa[Tmpx]) Stack[++TopS] = Tmpx, Tmpx = Fa[Tmpx];
  while (TopS) Fa[Stack[TopS--]] = Tmpx;
  return Tmpx;
}
struct Node {
  unsigned ValL, ValR, Size;
  Node* LS, * RS;
}N[300005], * Root[100005], * CntN, * C;
Node* Add(Node* x) {
  if (x->ValL == x->ValR) {
    (++CntN)->Size = 2;
    if (C->ValL < x->ValL) CntN->LS = C, CntN->RS = x;
    else CntN->RS = C, CntN->LS = x;
    CntN->ValL = CntN->LS->ValL;
    CntN->ValR = CntN->RS->ValR;
    return CntN;
  }
  ++(x->Size);
  if (C->ValL <= x->LS->ValR) x->LS = Add(x->LS);
  else x->RS = Add(x->RS);
  if (!(x->LS)) return x->RS;
  if (!(x->RS)) return x->LS;
  if (x->Size > 3) {
    if ((x->LS->Size * 3) < x->RS->Size) {
      register Node* TmpN(x->RS);
      x->RS = TmpN->RS;
      TmpN->RS = TmpN->LS;
      TmpN->LS = x->LS;
      x->LS = TmpN;
      TmpN->Size = TmpN->LS->Size + TmpN->RS->Size;
      TmpN->ValL = TmpN->LS->ValL;
      TmpN->ValR = TmpN->RS->ValR;
    }
    if ((x->RS->Size * 3) < x->LS->Size) {
      register Node* TmpN(x->LS);
      x->LS = TmpN->LS;
      TmpN->LS = TmpN->RS;
      TmpN->RS = x->RS;
      x->RS = TmpN;
      TmpN->Size = TmpN->LS->Size + TmpN->RS->Size;
      TmpN->ValL = TmpN->LS->ValL;
      TmpN->ValR = TmpN->RS->ValR;
    }
  }
  x->ValL = x->LS->ValL;
  x->ValR = x->RS->ValR;
  return x;
}
void DFS(Node* x) {
  if (x->ValL == x->ValR) { Stack[++TopS] = x - N;return; }
  if (x->LS) DFS(x->LS);
  if (x->RS) DFS(x->RS);
}
Node* Merge(Node* x, Node* y) {
  DFS(x);
  register Node* Cur(y);
  while (TopS) C = N + Stack[TopS--], Cur = Add(Cur);
  return Cur;
}
void Qry(Node* x) {
  if (B > x->Size) { Ans = -1; return; }
  if (x->ValL == x->ValR) { Ans = x - N; return; }
  if (x->LS) {
    if (x->LS->Size < B) B -= x->LS->Size, Qry(x->RS);
    else Qry(x->LS);
  }
  else Qry(x->RS);
}
signed main() {
  n = RD(), m = RD(), CntN = N + n;
  for (register unsigned i(1); i <= n; ++i) N[i].ValL = N[i].ValR = RD(), N[i].Size = 1, Root[i] = N + i, Fa[i] = i;
  for (register unsigned i(1); i <= m; ++i) {
    A = Find(RD()), B = Find(RD());
    if (A == B) continue;
    if (Root[A]->Size < Root[B]->Size) Fa[A] = B, Root[B] = Merge(Root[A], Root[B]);
    else Fa[B] = A, Root[A] = Merge(Root[B], Root[A]);
  }
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    scanf("%s", &Op), A = RD(), B = RD();
    if (Op[0] ^ 'B') Qry(Root[Find(A)]), printf("%d\n", Ans);
    else { A = Find(A), B = Find(B); if (Root[A]->Size < Root[B]->Size) Fa[A] = B, Root[B] = Merge(Root[A], Root[B]); else Fa[B] = A, Root[A] = Merge(Root[B], Root[A]); }
  }
  return Wild_Donkey;
}
```

### [CF573E](https://www.luogu.com.cn/problem/CF573E)

给定一个长度为 $n$ 的序列 $A$, 求子序列 $B$ (可以为空), 使得 $\displaystyle \sum_{i=1}^m iB_i$ 的值最大.

$n \leq 10^5$, $|a_i| \le 10^7$

先考虑 $O(n^2)$ DP, 设计 $f_{i, j}$ 表示考虑前 $i$ 位, 选择了 $j$ 个数的, 最大 $\displaystyle \sum_{k=1}^j kB_k$.

状态转移方程很好写:

$$
f_{i, j} = max(f_{i - 1, j - 1} + jA_i, f_{i - 1, j})
$$

所以转移是 $O(1)$, 总复杂度 $O(n^2)$, 滚掉一维, 空间 $O(n)$.

试图证明决策单调性, 即存在一个 $j$, 使得 $f_{i - 1, j - 2} + (j - 1)A_i \geq f_{i - 1, j - 1}$, 而对于所有 $k \geq j$, 都有 $f_{i - 1, k - 1} + kA_i < f_{i - 1, k}$.

使用打表法, 发现确实这样.

感性理解一下, 如果一个数字 $i$ 在总共选择 $j$ 个的时候被选择了, 那么选择更多的数的时候, 选择一个数的条件应该放宽, 所以就更能选 $i$ 了.

实践是检验真理的唯一标准, 因为这样写过了, 所以存在决策单调性.

这样对于一个阶段, 它的 DP 值相对上一个阶段的变化就是:

- 在决策点 $j$ 左边, DP 值不变

- 在 $j$ 前面插入一个新值 $f_{i - 1, j - 1} + jA_i$

- 从 $j$ 到 $i - 1$ 的 DP 值向右平移一位, 然后加上等差数列 $(j + 1)A_i, (j + 2)A_i, ..., iA_i$.

用平衡树维护 DP 值即可, 因为二分决策点, 对 $Mid$ 的一次判断需要单点查询, 是 $O(\log n)$ 的, 所以总复杂度 $O(n \log^2 n)$.

```cpp
unsigned m, n, Cnt(0), SzLft(0), A, B, C, D, t, Tmp(0);
long long ATmp, TmpC, TmpN, Ans;
struct Node {
  Node* LS, * RS;
  long long Bot, K;
  unsigned Size;
}N[1000005], * CntN(N), * Root(N);
void PsDw(Node* x) {
  register long long LSTmp(0);
  if (x->LS) x->LS->K += x->K, x->LS->Bot += x->Bot, LSTmp = x->LS->Size;
  if (x->RS) x->RS->K += x->K, x->RS->Bot += x->Bot + x->K * LSTmp;
  x->K = x->Bot = 0;
}
void DFS(Node* x) {
  if (x->Size == 1) { Ans = max(Ans, x->Bot); return; }
  PsDw(x);
  if (x->LS) DFS(x->LS);
  if (x->RS) DFS(x->RS);
  return;
}
Node* Add(Node* x) {
  ++(x->Size);
  if (x->Size == 2) {
    x->LS = ++CntN, x->RS = ++CntN;
    x->RS->Bot = x->Bot, x->LS->Bot = TmpC;
    x->LS->Size = x->RS->Size = 1;
    x->K = x->Bot = 0;
    return x;
  }
  PsDw(x);
  if (x->LS) {
    if (A <= x->LS->Size) x->LS = Add(x->LS);
    else A -= x->LS->Size, x->RS = Add(x->RS);
  }
  else x->RS = Add(x->RS);
  if (!(x->LS)) return x->RS;
  if (!(x->RS)) return x->LS;
  if (x->Size > 3) {
    if ((x->LS->Size * 3) < x->RS->Size) {
      register Node* TmpNd(x->RS);
      PsDw(TmpNd);
      x->RS = TmpNd->RS;
      TmpNd->RS = TmpNd->LS;
      TmpNd->LS = x->LS;
      x->LS = TmpNd;
      TmpNd->Size = TmpNd->LS->Size + TmpNd->RS->Size;
    }
    if ((x->RS->Size * 3) < x->LS->Size) {
      register Node* TmpNd(x->LS);
      PsDw(TmpNd);
      x->LS = TmpNd->LS;
      TmpNd->LS = TmpNd->RS;
      TmpNd->RS = x->RS;
      x->RS = TmpNd;
      TmpNd->Size = TmpNd->LS->Size + TmpNd->RS->Size;
    }
  }
  return x;
}
void Chg(Node* x, unsigned Cnt) {
  if (x->Size <= Cnt) {
    x->Bot += ATmp * SzLft;
    x->K += ATmp;
    SzLft += x->Size;
    return;
  }
  PsDw(x);
  if (x->RS) {
    if (x->RS->Size < Cnt) {
      Chg(x->LS, Cnt - x->RS->Size);
      Chg(x->RS, x->RS->Size);
    }
    else Chg(x->RS, Cnt);
  }
  else Chg(x->LS, Cnt);
}
long long Qry(Node* x) {
  if (x->Size == 1) return x->Bot;
  PsDw(x);
  if (x->LS) {
    if (x->LS->Size >= A) return Qry(x->LS);
    else { A -= x->LS->Size; return Qry(x->RS); }
  }
  else return Qry(x->RS);
}
signed main() {
  n = RD();
  N->Bot = 0xafafafafafafafaf, N->Size = 1;
  TmpC = 0, A = 1, Root = Add(Root);
  TmpC = RDsg(), A = 2, Root = Add(Root);
  for (register unsigned i(2); i <= n; ++i) {
    ATmp = RDsg();
    register unsigned L(1), R(i), Mid;
    while (L ^ R) {
      Mid = ((L + R) >> 1);
      A = Mid, TmpC = Qry(Root) + Mid * ATmp, A = Mid + 1, TmpN = Qry(Root);
      if (TmpC > TmpN) {//Choose
        R = Mid;
      }
      else {  //Not
        L = Mid + 1;
      }
    }
    A = L, TmpC = Qry(Root) + L * ATmp, A = L + 1, Root = Add(Root);
    SzLft = L + 1, Chg(Root, i + 1 - L);
  }
  DFS(N);
  printf("%lld\n", Ans);
  return Wild_Donkey;
}
```

## Day10: 可持久化

### 可持久化线段树

过水已隐藏

### [CF323C](https://codeforces.com/contest/323/problem/C)

给定两个长度均为 $n$ 的排列.

$m$ 次询问. 每次询问您要求出在第一个排列的 $[l_1,r_1]$ 和第二个排列的 $[l_2,r_2]$ 同时出现的数有多少个.

$1 \leq n \leq 10^6$, $1 \leq m \leq 2 \times 10^5$, 强制在线.

因为是排列, 所以一个数字在两个排列中一定都出现, 而一个数字在两个排列中的位置构成一个二维坐标, 问题转化成了求二维平面上的一个矩形包含了多少点.

以横坐标为版本时间轴, 纵坐标为序, 每个点权值为 $1$, 建立可持久化线段树, 在版本 $r_1$ 和 $l_1 - 1$ 两个版本对 $[l_2, r_2]$ 进行查询并做差, 即为所求.

代码实现: 可持久化开 $40n$ 数组吧.

```cpp
unsigned a[1000005],b[1000005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0);
struct Node {
  Node *LS, *RS;
  unsigned Val;
}N[40000005], *Order[1000005], *CntN(N);
void Add(Node *x, Node *y, unsigned L, unsigned R) {
  if(!x) {
    y->Val = 1;
    if (L == R) return;
    register unsigned Mid((L + R) >> 1);
    if(Mid >= A) {
      Add(NULL, y->LS = ++CntN, L, Mid);
    } else {
      Add(NULL, y->RS = ++CntN, Mid + 1, R);
    }
    return;
  }
  y->Val = x->Val + 1; 
  if(L == R) return;
  register unsigned Mid((L + R) >> 1);
  if(Mid >= A) {
    if(!y->LS) y->LS = ++CntN; 
    Add(x->LS, y->LS, L, Mid);
    y->RS = x->RS;
  } else {
    if(!y->RS) y->RS = ++CntN; 
    Add(x->RS, y->RS, Mid + 1, R);
    y->LS = x->LS;
  }
}
void Qry(Node *x, unsigned L, unsigned R){
  if((A <= L) && (R <= B)) {
    Tmp += x->Val; return;
  }
  register unsigned Mid((L + R) >> 1);
  if ((A <= Mid) && (x->LS)) {
    Qry(x->LS, L, Mid);
  }
  if ((Mid < B) && (x->RS)) {
    Qry(x->RS, Mid + 1, R); 
  }
}
inline unsigned F(unsigned x) {
  return ((x - 1 + Ans) % n) + 1;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    a[RD()] = i;
  }
  for (register unsigned i(1); i <= n; ++i) {
    b[a[RD()]] = i;
  }
  Order[0] = N;
  for (register unsigned i(1); i <= n; ++i) {
    A = b[i], Add(Order[i - 1], Order[i] = ++CntN, 1, n);
  }
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    C = F(RD()), D = F(RD()), A = F(RD()), B = F(RD());
    if(C > D) swap(C, D); 
    if(A > B) swap(A, B);
    Tmp = 0, Qry(Order[D], 1, n);
    Ans = Tmp, Tmp = 0, Qry(Order[C - 1], 1, n);
    printf("%u\n", Ans = Ans - Tmp);
    ++Ans;
  }
  return Wild_Donkey;
}
```

### Kruskal 重构树

执行 Kruskal 算法时, 将所有原图上的点作为叶节点, 将连边的两点所在的树根加一个公共祖先, 这样就加了 $n - 1$ 个点, 将最小生成树变成一棵重构之后的二叉树, 这棵二叉树就是 Kruskal 重构树, 重构树上的边权是连接这条边时原图上对应边的边权.

Kruskal 重构树的一个非常重要的性质就是一个链从下到上边权递增. 如果将边权 $\geq x$ 的边禁用, 一个点能到达的点则相当于 Kruskal 重构树上某个祖先的子树上的节点.

### 可持久化平衡树

除了均摊都可持久

### 可持久化 Trie

过水已隐藏

### [12OI2019](https://loj.ac/p/3048)

给 $n$ 个数的序列, 求 $m$ 个不同的区间, 使得这些区间异或和的和最大.

求前缀异或和, 以便 $O(1)$ 查询区间异或和.

从左往右枚举右端点 $i$, 不断将前缀异或和插入 0/1 Trie, 将 Trie 可持久化.

从可持久化 Trie 上可以 $O(32)$ 地查询一个前缀的第 $k$ 大后缀异或和, 将所有 $[1, i]$ 的最大的后缀异或和插入大根堆, 每次取出堆顶, 将堆顶对应的 $i$ 的次大的后缀异或和插入堆, 直到弹出 $m$ 次为止, 总复杂度 $O(32(n + m))$.

```cpp
const char _31(31), _0(0), _1(1);
unsigned Sum[500005], Top[500005], m, n, Cnt(0), Now(0), A, B, C, D, t, Tmp(0);
unsigned long long Ans(0);
struct Node {
  Node* Son[2];
  unsigned Size;
}N[20000005], * Root[500005], * Last, * LastLast, * CntN(N);
void Add(char c) {
  Last->Son[c] = ++CntN, Last->Size = 1;
  if (LastLast) Last->Son[c ^ 1] = LastLast->Son[c ^ 1], Last->Size += LastLast->Size, LastLast = LastLast->Son[c];
  Last = Last->Son[c];
}
unsigned Qry(Node* x, unsigned Dep) {
  if (Dep == 32) {
    return B ^ Now;
  }
  register unsigned Big(1 & (B >> (31 - Dep)));
  Now <<= 1, Big ^= 1;
  if (x->Son[Big]) {
    if (x->Son[Big]->Size >= A) { Now |= Big;return Qry(x->Son[Big], Dep + 1); }
    else { A -= x->Son[Big]->Size, Now |= (Big ^ 1);return Qry(x->Son[Big ^ 1], Dep + 1); }
  }
  Now |= (Big ^ 1);
  return Qry(x->Son[Big ^ 1], Dep + 1);
}
priority_queue <pair<unsigned, unsigned> > Q;
signed main() {
  n = RD(), m = RD();
  Root[0] = Last = ++CntN, LastLast = NULL;
  for (register char i(_31); i >= _0; --i) Add(0);
  Last->Size = 1;
  for (register unsigned i(1); i < n; ++i) {
    Sum[i] = Sum[i - 1] ^ RD();
    Root[i] = Last = ++CntN, LastLast = Root[i - 1];
    for (register char j(_31); j >= _0; --j) Add(((1 << j) & Sum[i]) >> j);
    if (LastLast)Last->Size = LastLast->Size + 1;
    else Last->Size = 1;
    A = Top[i] = 1, B = Sum[i], Now = 0, Q.push(make_pair(Qry(Root[i - 1], 0), i));
  }
  Sum[n] = Sum[n - 1] ^ RD();
  A = Top[n] = 1, B = Sum[n], Now = 0, Q.push(make_pair(Qry(Root[n - 1], 0), n));
  for (register unsigned i(1); i <= m; ++i) {
    Ans += Q.top().first, D = Q.top().second, Q.pop();
    if (Top[D] < D) {
      A = ++Top[D], B = Sum[D], Now = 0, Q.push(make_pair(Qry(Root[D - 1], 0), D));
    }
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

这个题也可以不用可持久化, 因为可持久化是为了保证从 $j \in [0, i)$ 选一个 $Sum_j$ 使得 $Sum_i ^ Sum_j$ 是第 $k$ 大的, 如果没有 $[0, i)$ 的限制, 事实上所有的 $Sum_i$ 都在同一棵 Trie 上查询就可以, 只要将要选的 $m$ 个区间变成 $2m$ 个, 因为显然每对 $(i, j)$ 会被统计两次, 最后将答案除以 $2$ 即可.

### [CTSC2018](https://loj.ac/p/2555)

给 $n$ 种果汁, 每种果汁有三个属性: 美味度 $d$, 单位体积价格 $p$, 和每瓶最多添加的体积 $l$.

$m$ 个询问, 每个询问规定总价不高于 $g$, 总体积不小于 $L$, 选择的果汁中美味度最小值最大.

考虑二分, 将果汁按 $d$ 为反向时间轴 (版本 $i$ 由版本 $i + 1$ 修改而来), $p$ 为序, $pl$ 和 $l$ 为权值, 插入可持久化线段树.

每次 Judge $x$ 的时候, 在版本 $x$ 按 $pl$ 二分, 选出美味度大于等于 $x$ 的所有果汁中, 按价格从小到大, 选择不大于 $L$ 体积的所有果汁的价值总和, 然后将剩下的 $L$ 用还没选的最便宜的果汁补全.

二分答案复杂度 $O(\log n)$, 二分查找复杂度 $O(\log n)$, 总复杂度 $O(n \log n + m \log^2 n)$

```cpp
unsigned a[100005], m, n, Cnt(0), t, Ans(0), Tmp(0);
unsigned long long A, B, C, D;
struct Juice {
  unsigned Val, Cost, Limit;
  inline const char operator< (const Juice& x)const {
    return this->Val < x.Val;
  }
}J[100005];
struct Node {
  Node* LS, * RS;
  unsigned long long Cost, V;
}N[4000005], * Root[100005], * CntN(N);
void Udt(Node* x) {
  x->V = x->Cost = 0;
  if (x->LS) x->V += x->LS->V, x->Cost += x->LS->Cost;
  if (x->RS) x->V += x->RS->V, x->Cost += x->RS->Cost;
}
void Add(Node* x, Node* y, unsigned L, unsigned R) {
  if (L == R) {
    y->Cost = B * C;
    y->V = C;
    if (x) y->V += x->V, y->Cost += x->Cost;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if (A <= Mid) {
    if (x) {
      y->RS = x->RS;
      Add(x->LS, y->LS = ++CntN, L, Mid);
    }
    else Add(NULL, y->LS = ++CntN, L, Mid);
  }
  else {
    if (x) {
      y->LS = x->LS;
      Add(x->RS, y->RS = ++CntN, Mid + 1, R);
    }
    else Add(NULL, y->RS = ++CntN, Mid + 1, R);
  }
  return Udt(y);
}
void Qry(Node* x, unsigned L, unsigned R) {
  if (L == R) {
    C += A * x->Cost / x->V;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if (x->LS) {
    if (x->LS->V >= A) return Qry(x->LS, L, Mid);
    else {
      A -= x->LS->V;
      C += x->LS->Cost;
    }
  }
  Qry(x->RS, Mid + 1, R);
}
signed main() {
  n = RD(), m = RD(), Root[0] = N;
  for (register unsigned i(1); i <= n; ++i)
    J[i].Val = RD(), a[i] = J[i].Cost = RD(), J[i].Limit = RD();
  sort(J + 1, J + n + 1), sort(a + 1, a + n + 1), Cnt = unique(a + 1, a + n + 1) - a - 1;
  for (register unsigned i(n); i; --i)
    A = lower_bound(a + 1, a + Cnt + 1, J[i].Cost) - a, B = J[i].Cost, C = J[i].Limit, Add(Root[i + 1], Root[i] = ++CntN, 1, Cnt);
  for (register unsigned i(1); i <= m; ++i) {
    B = RD(), D = RD();
    register unsigned BL(0), BR(n), BMid;
    while (BL ^ BR) {
      BMid = (BL + BR + 1) >> 1, A = D, C = 0;
      if (Root[BMid]->V < A) {
        BR = BMid - 1;
        continue;
      }
      Qry(Root[BMid], 1, Cnt);
      if (C > B) BR = BMid - 1;
      else BL = BMid;
    }
    if (!BL) printf("-1\n");
    else printf("%u\n", J[BL].Val);
  }
  return Wild_Donkey;
}
```

### [P2839](https://www.luogu.com.cn/problem/P2839)

给一个序列, 每次求序列的子区间, 满足左端点在 $[a, b]$ 之间, 右端点在 $[c, d]$ 之间的最大中位数. 和一般定义不同的是, 本题中偶数个元素的中位数定义为第 $\frac n2$ 个数.

$n \leq 20000, q \leq 25000$ 强制在线.

先考虑 $O(qn^2 \log^2 n)$ 的做法, 以位置为时间轴建立可持久化权值线段树, 二分中位数 $x$, 枚举左右端点, 判断区间 $\leq x$ 的数量和 $\geq x$ 的数量是否合法.

接下来优化算法, 发现枚举左右端点时可以顺便统计数字和 $x$ 关系的情况. 去掉线段树后优化到 $O(qn^2\log n)$.

发现左界右界对答案的影响是相独立的, 所以可以分别处理左右界, 将复杂度优化到 $O(qn\log n)$.

可以以权值为时间轴, 以下标为序, 建立可持久化线段树. 对于每次二分的答案 $x$, 数组中一个元素如果大于等于 $x$, 则它的权值是 $1$, 如果小于 $x$, 则权值是 $-1$. 所以权值的前缀和就代表了整个数组前缀区间中大于等于 $x$ 的元素数量减去小于 $x$ 的元素的数量的差. 这个值大于等于 $0$, 说明这个前缀的中位数大于等于 $x$.

所以用可持久化线段树维护这个前缀和, 前缀和相减就能表示区间信息, 为了使区间权值和尽可能大, 需要右端点前缀和尽可能大, 左端点前面一个位置的前缀和尽可能小. 由于区间的左右端点不确定, 所以需要求出前缀和的区间最大和最小值.

为了构造这棵线段树, 发现每次操作相当于将权值数组的一些 $-1$ 变成 $1$, 对应到前缀和数组就是将一个后缀增加 $2$, 在上一个版本的基础上区间修改即可.

对于每个 $x$, 需要 $O(\log n)$ 求最值然后判断其正负, 每次询问判断 $\log n$ 个 $x$, 最终复杂度 $O(n \log n + q\log ^ 2 n)$.

值域偏大, 不要忘了离散化.

```cpp
unsigned a[20005], b[20005], Pos[20005], Cnt[20005], Ask[4];
unsigned m, n, Cntn, A, B, C, D, t, Tmp(0), Last(0);
int QrySum, LMin, RMax;
char QryMin(0);
struct Node {
  Node* LS, * RS;
  int Max, Min, Tag;
}N[10000005], * Order[20005], * CntN(N), * Lst(N);
void Udt(Node* x) {
  x->Max = x->Tag + max(x->LS->Max, x->RS->Max);
  x->Min = x->Tag + min(x->LS->Min, x->RS->Min);
}
void Build(Node* x, unsigned L, unsigned R) {
  if (L == R) {
    x->Max = x->Min = -L;
    return;
  }
  register unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  Udt(x);
}
Node* Add(Node* x, Node* y, unsigned L, unsigned R) {
  if (A <= L) {
    if (y > Lst) {
      y->Tag += 2;
      y->Max += 2;
      y->Min += 2;
    }
    else {
      y = ++CntN;
      y->Tag = x->Tag + 2;
      y->Max = x->Max + 2;
      y->Min = x->Min + 2;
      y->LS = x->LS;
      y->RS = x->RS;
    }
    return y;
  }
  register unsigned Mid((L + R) >> 1);
  if (y <= Lst) y = ++CntN, y->Tag = x->Tag, y->LS = x->LS, y->RS = x->RS;
  if (!(y->LS)) y->LS = x->LS;
  if (A <= Mid) y->LS = Add(x->LS, y->LS, L, Mid);
  y->RS = Add(x->RS, y->RS, Mid + 1, R);
  Udt(y);
  return y;
}
void Qry(Node* x, unsigned L, unsigned R, int TagSum) {
  if ((A <= L) && (R <= B)) {
    if (QryMin) QrySum = min(QrySum, TagSum + x->Min);
    else QrySum = max(QrySum, TagSum + x->Max);
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if (A <= Mid) Qry(x->LS, L, Mid, TagSum + x->Tag);
  if (B > Mid) Qry(x->RS, Mid + 1, R, TagSum + x->Tag);
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = b[i] = RD();
  sort(b + 1, b + n + 1);
  Cntn = unique(b + 1, b + n + 1) - b - 1;
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = lower_bound(b + 1, b + Cntn + 1, a[i]) - b;
    ++Cnt[a[i]];
  }
  for (register unsigned i(1); i <= Cntn; ++i) Cnt[i] += Cnt[i - 1];
  for (register unsigned i(1); i <= n; ++i) Pos[Cnt[a[i]]--] = i;
  Build(Order[Cntn + 1] = ++CntN, 0, n), Cnt[Cntn + 1] = n;
  for (register unsigned i(Cntn); i; --i) {
    Lst = CntN, Order[i] = ++CntN;
    for (register unsigned j(Cnt[i + 1]); j >= Cnt[i] + 1; --j)
      A = Pos[j], Add(Order[i + 1], Order[i], 0, n);
  }
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    for (register unsigned j(0); j < 4; ++j) Ask[j] = 1 + ((RD() + Last) % n);
    sort(Ask, Ask + 4);
    register unsigned BL(1), BR(Cntn), BMid;
    while (BL ^ BR) {
      BMid = (BL + BR + 1) >> 1;
      QryMin = 1, A = Ask[0] - 1, B = Ask[1] - 1, QrySum = 0x3f3f3f3f, Qry(Order[BMid], 0, n, 0);
      QryMin = 0, LMin = QrySum, QrySum = 0xafafafaf, A = Ask[2], B = Ask[3], Qry(Order[BMid], 0, n, 0);
      if (QrySum >= LMin) BL = BMid;
      else BR = BMid - 1;
    }
    Last = b[BL], printf("%u\n", Last);
  }
  return Wild_Donkey;
}
```