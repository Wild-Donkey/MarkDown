# CDQ 分治

## 二元关系

有两个集合 $A$, $B$, 他们的笛卡尔积 $A \times B$ 是 $|A|\times|B|$ 个点对构成的集合, 即 $A$ 中的每个元素和 $B$ 中每个元素组成的有序点对.

定义 $A \times B$ 的一个子集 $R$, 则 $R$ 是 $A$ 和 $B$ 的一个二元关系.

## 偏序

偏序也是一种二元关系, 设一个定义在同一个集合 $A$ 中的二元关系 $R \in A \times A$, 满足以下性质:

- 自反性

  对于每个元素 $a \in A$ 有 $(a, a) \in R$.

- 反对称性

  如果存在 $(a, b) \in R$ 且 $(b, a) \in R$, 则 $a = b$.

- 传递性

  如果存在 $(a, b) \in R$ 且 $(b, c) \in R$, 则 $(a, c) \in R$.

则 $R$ 是一个偏序.

如果 $R$ 还满足:

- 完全性

  对于每一个 $a \in A$, $b \in A$, 一定有 $(a, b) \in R$ 或 $(b, a) \in R$.

则 $R$ 是一个全序.

一般我们说的偏序都是非严格偏序 (自反偏序), 但是与之相对, 有一种严格偏序 (反自反偏序), 严格偏序在满足传递性的基础上, 满足:

- 反自反性

  对于每个元素 $a \in A$ 不存在 $(a, a) \in R$.

- 禁对称性

  如果存在 $(a, b) \in R$ 则不存在 $(b, a) \in R$.

其实对于每个严格偏序中的点对, 在对应的非严格偏序中一定存在, 如果每个点对表示一条有向边, 则严格偏序一定对应一个 DAG, 而非严格偏序中会增加一些自环和重边.

算法竞赛中的题目, 一般偏序的要求是满足反自反性, 对称性和传递性.

## 二维偏序

如果有有序二元组 $(a, b)$ 构成的集合 $A$, 则一个有序二元组的有序点对 $R \in A \times A$ 就是一个二维偏序.

如果规定 $((a_i, b_i), (a_j, b_j)) \in R$, 当且仅当 $a_i \leq a_j$ 且 $b_i \leq b_j$, 求 $|R|$, 这就是一道很简单的二维偏序题.

很幸运, 二维偏序一般不需要 CDQ 分治, 只要对所有二元组按 $a$ 为第一关键字, $b$ 为第二关键字排序, 然后建立树状数组, 从第一个开始, 依次查询 $[1, b_i]$ 的 $b$ 的数量, 然后插入 $b_i$ 即可.

高端的食材, 往往只需要采用最朴素的烹饪方式.

但是, 我们使用同样高端的烹饪方式又有何不可?

尝试用 CDQ 分治解决二维偏序.

已经按 $a$ 第一, $b$ 第二排好序了, 将所有二元组分成左右两部分, $[1, Mid]$, $(Mid, n]$. 这时, 满足 $((a_i, b_i), (a_j, b_j)) \in R$ 的 $i$, $j$ 有三种情况:

- $i \in [1, Mid]$, $j \in (Mid, n]$

- $i \in [1, Mid]$, $j \in [1, Mid]$

- $i \in (Mid, n]$, $j \in (Mid, n]$

对于第一种情况, 按 $b$ 可以用双指针 $O(n)$ 求出, 对于后两种, 可以递归解决, 总复杂度还是 $O(nlogn)$.

这种双指针 + 递归的分治思想是不是非常眼熟? 没错, 这就是归并排序的加强版.

## 三维偏序

同理, 如果有有序三元组 $(a, b, c)$ 构成的集合 $A$, 定义 $R \in A * A$, 当前仅当 $a_i \leq a_j$, $b_i \leq b_j$, $c_i \leq c_j$ 同时成立时, $((a_i, b_i, c_i), (a_j, b_j, c_j)) \in R$. 求 $|R|$.

很显然, 这是一道三维偏序题, 仍然是先按 $a$ 排序. 然后分成两部分, 还是存在那三种情况.

- $i \in [1, Mid]$, $j \in (Mid, n]$

- $i \in [1, Mid]$, $j \in [1, Mid]$

- $i \in (Mid, n]$, $j \in (Mid, n]$

仍然思考如何求出第一种情况数量. 因为已知 $a_i \leq a_j$, 所以相当于在 $A$ 的子集 $B$, $C$ (即左右两段的点代表的集合), 求二维偏序 $R \in B \times C$ 的 $|R|$.

参考二维偏序的做法, 对于左右两段分别按 $b$ 排序, 双指针 $i$, $j$ 扫描, 使得 $b_i = b_j$. 然后不断将左段的 $c_i$ 加入树状数组, 然后查询 $[1, c_j]$ 的数量, 统计答案, 然后递归求子问题.

参考前面 CDQ 分治求二维偏序, 发现三维偏序用 CDQ 转化来的二维偏序问题也可以用 CDQ 分治再来一层.

在左段打标记, 然后将所有三元组按 $b$ 排序. (貌似只能 `cmp()` 函数解决了, 二次重载运算符是被禁止的) (在张业琛的提醒下, 在 `std=c++11` 的情况下, 可以使用 Lambda 表达式来代替 `cmp()`)

这时, 按二维偏序来做, 但是左边只考虑有标记的点, 右边只考虑无标记的点. 递归到底就求出了上面分的三种情况中的第一种, 剩下的仍然递归求出, 总复杂度 $O(nlog^2n)$. 

## 多维偏序

用上面的方法, 可以推广到 $k$ 维, 但是时间复杂度 $O(nlog^{k - 1}n)$ 在 $1s$ 内能解决的问题的规模, 越来越接近朴素的 $O(kn^2)$ 甚至更劣. 所以一般到了 $4$ 维, CDQ 分治就没什么意义了.

## [模板](https://www.luogu.com.cn/problem/P3810)

三维偏序计数题, 求对于每一个 $i$, 满足 $a_j \leq a_i$, $b_j \leq b_i$, $c_j \leq c_i$, $j \neq i$ 的 $j$ 的数量.

索性用一维排序, 二维 CDQ, 三维树状数组的逻辑来做好了.

按 $a$ 排序, 进入 CDQ.

CDQ 分成两段, 段内按 $b$ 排序, 然后树状数组统计, 然后递归之前再按 $a$ 排序.

最后递归求其它情况.

```cpp
#define Lowbit(x) ((x) & (-(x)))
unsigned m, n, NM(0), A, B, C, D, t, Tree[200005], Ans[100005];
inline unsigned Qry(unsigned Pos) {
  unsigned TmpQ(0);
  while (Pos) TmpQ += Tree[Pos], Pos -= Lowbit(Pos);
  return TmpQ;
}
inline void Add(unsigned Pos, unsigned Val) {while(Pos <= m) Tree[Pos] += Val, Pos += Lowbit(Pos);}
inline void Minus(unsigned Pos, unsigned Val) {while(Pos <= m) Tree[Pos] -= Val, Pos += Lowbit(Pos);}
struct Group {
	unsigned a, b, c, Cnt, Same;
	inline const char operator<(const Group &x) {return this->b < x.b;}
}G[100005];
inline const char cmp(const Group &x, const Group &y) {return (x.a ^ y.a) ? (x.a < y.a) : ((x.b ^ y.b) ? (x.b < y.b) : (x.c < y.c));}
void CDQ(unsigned L, unsigned R) {
  if(L == R) return; 
  register unsigned Mid((L + R) >> 1);
  CDQ(L, Mid);
  CDQ(Mid + 1, R);
  sort(G + L, G + Mid + 1);
  sort(G + Mid + 1, G + R + 1);
  register unsigned PointerL(L), PointerR(Mid + 1);
  while (PointerR <= R) {
    while (G[PointerL].b <= G[PointerR].b && PointerL <= Mid) Add(G[PointerL].c, G[PointerL].Same), ++PointerL;
    G[PointerR].Cnt += Qry(G[PointerR].c), ++PointerR;
  }
  while (PointerL > L) --PointerL, Minus(G[PointerL].c, G[PointerL].Same);
}
int main() {
	n = RD(), m = RD();
	for (register unsigned i(1); i <= n; ++i) G[i].a = RD(), G[i].b = RD(), G[i].c = RD();
	sort(G + 1, G + n + 1, cmp);
	for (register unsigned i(1); i <= n; ++i) {if((G[i].a ^ G[i - 1].a) || (G[i].b ^ G[i - 1].b) || (G[i].c ^ G[i - 1].c)) G[++NM] = G[i]; ++(G[NM].Same);}
  CDQ(1, NM);
	for (register unsigned i(1); i <= NM; ++i) Ans[G[i].Cnt + G[i].Same - 1] += G[i].Same;
	for (register unsigned i(0); i < n; ++i) printf("%u\n", Ans[i]);
	return Wild_Donkey;
}
```

有一些细节需要注意: 排序的规则方面, 按 $a$ 排序的时候, 必须保证不能存在 $i > j$, $(i, j) \in R$ 存在, 这就要求必须分别按 $a$, $b$, $c$ 为第一, 二, 三关键字排序. 而按 $b$ 排序的时候, 只需要保证两段中, $b$ 值单调递增即可, 所以根本不需要第二, 第三关键字.