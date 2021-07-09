# 线性求后缀数组: $\mathbf{SA-IS~ Algorithm}$

SA-IS 算法在实现线性求后缀数组的同时, 做到了比 DC3 更强的常数效率, 适合在对求后缀数组效率有要求的题目中使用.

## ! ! ! FBI Warning 前排提醒 ! ! !

SA-IS, 非常~~毒瘤~~快的后缀数组算法, 貌似效率仅次于[这个算法](https://suffixsorting.github.io/) (我也不懂, 有兴趣的可以自行研究), 但是复杂度都是 $O(n)$, 所以并没有差太多.

如果你不是倍增求后缀数组带师, 就算你会倍增法, 也建议去看上一篇[倍增求后缀数组](https://www.luogu.com.cn/blog/Wild-Donkey/bei-zeng-qiu-hou-zhui-shuo-zu-suffix-array) , 因为编程难度小, 复杂度也能接受, 本篇将沿用上一篇对变量名的定义.. 毕竟能下决心看这个篇幅的文章, 也不差这一点时间了. 英语好直接去看[原文](https://dna049.com/string/LinearSuffixArrayConstructionbyAlmostPureInduced-Sorting.pdf), 我讲的肯定没发明这个算法的人讲得好.


## 后缀分类

假设有字符串 $s$, 则可以将 $s$ 的后缀 $Suff_i$ 分成两类 (因为长度不同, 所以不可能相等):

- S-Type

$$
Suff_i < Suff_{i + 1}
$$

- L-Type

$$
Suff_i > Suff_{i + 1}
$$

规定 $Suff_{n + 1}$ 是 S-Type.

发现一个性质, 对于 S-Type 后缀 $Suff_i$ 和 L-Type 后缀 $Suff_j$, 如果 $s_i = s_j$, 那么有 $Suff_i > Suff_j$, 证明如下:

* 对于 $Suff_i$
  
  有 $s_i < s_{i + 1}$ 成立或 $s_i = s_{i + 1}$ 和 $Suff_{i + 1} < Suff_{i + 2}$ 成立.

* 对于 $Suff_j$
  
  有 $s_j > s_{j + 1}$ 成立或 $s_j = s_{j + 1}$ 和 $Suff_{j + 1} > Suff_{j + 2}$ 成立.

因为 $s_i = s_j$, 所以 $s_{j + 1} \leq s_i = s_j \leq s_{i + 1}$.

* 对于 $s_{i + 1} > s_{j + 1}$
    
  结论显然成立

* 对于 $s_{i + 1} = s_{j + 1}$
    
  则一定有 $s_{j + 1} = s_i = s_j = s_{i + 1}$. 逐位比较, 只要 $s_i + k = s_j + k$, 就有 $Suff_{i + k} < Suff_{i + k + 1}$, $Suff_{j + k} > Suff_{j + k + 1}$, 然后 $k$ 增加 $1$. 由于已经确定 $Suff_i$ 和 $Suff_j$ 的类别, 所以迟早会遇到 $k$, 使得 $s_{i + k} < s_{i + k + 1}$ 或 $s_{j + k} > s_{j + k + 1}$, 因为 $s_{i + k} = s_{j + k}$, 所以有 $s_{j + k + 1} < s{i + k + 1}$.

所以无论如何都有 $Suff_i > Suff_j$, 证毕.

## LCP (Longest Common Prefix)

字符串 $a$, $b$ 的最长公共前缀表示为 $LCP(a, b)$, $LCP(a, b)$ 的长度表示为 $lcp(a, b)$.

设 $j \in [0, lcp(Suff_i, Suff_{i + 1})]$, 则所有 $s_{i + j}$ 都是同一字符.

- 对于 S-Type 后缀

  $$
  s_{i + j} < s_{i + lcp(Suff_i, Suff_{i + 1}) + 1}
  $$

- 对于 L-Type 后缀

  $$
  s_{i + j} > s_{i + lcp(Suff_i, Suff_{i + 1}) + 1}
  $$

对于 $lcp(Suff_i, Suff_{i + 1})$ 和 $lcp(Suff_{i + 1}, Suff_{i + 2})$ 的关系, 分两类讨论

- $lcp(Suff_i, Suff_{i + 1}) = 0$

  没有相同前缀, 也就是说首字符也不同, 也就是说 $s_i \neq s_{i + 1}$, 这时的 $lcp(Suff_{i + 1}, Suff_{i + 2})$ 和 $lcp(Suff_i, Suff_{i + 1})$ 无关.

- $lcp(Suff_i, Suff_{i + 1}) > 0$

  因为 $[i, i + lcp(i, i + 1)]$ 是连续的同一个字符, $s_{i + lcp(i, i + 1)} \neq s_{i + 1 + lcp(i, i + 1)}$. 分析 $lcp(i + 1, i + 2)$, 因为 $[i + 1, i + 1 + lcp(i, i + 1) - 1]$ 是同一字符, $s_{i + 1 + lcp(i, i + 1) - 1} \neq s_{i + 2 + lcp(i, i + 1) - 1}$, 所以 $lcp(i + 1, i + 2) = lcp(i, i + 1) - 1$.

## LMS (Left Most S-Type) 后缀

如果 S-Type 后缀 $Suff_i$, 满足 $Suff_{i - 1}$ 是 L-Type 后缀, 即局部极小后缀, 则称 $s_i$ 为字符串 $s$ 的一个 LMS 字符.

如果两个 LMS 字符 $s_i$, $s_j$ 之间没有 LMS 字符, 则 $[i, j]$ 是一个 LMS 子串.

分析 LMS 子串长度, 如果有子串 $[i, i + 1]$ 是 LMS 子串, 则 $s_i$, $s_{i + 1}$ 是 LMS 字符. $s_i$ 是 LMS 字符要求 $Suff_i$ 是 S-Type 后缀, $s_i + 1$ 是 LMS 字符要求 $Suff_i$ 是 L-Type 后缀, 自相矛盾, 所以不会出现长度为 $2$ 的 LMS 子串, LMS 子串长度最短为 $3$.

因为相邻的 LMS 子串共用一个公共字符, 所以 $s$ 中的 LMS 子串数量级为 $O(\frac{len_s}{2})$.

事实上, LMS 子串也可以不互相共用一个 LMS 字符, 即对于相邻 LMS 字符 $s_i$, $s_j$, 则 $[i, j)$ 是一个 LMS 子串. 貌似也出现了这种的做法 (也可能没有, 我只是在听大佬们交流时道听途说的), 我一开始也是这么理解 LMS 子串的, 因为这样首尾相接很美观, 但是失败了. 因为末尾的 LMS 字符相当于一个哨兵, 可以避免很多要判断的边界条件.

## 子字符串 $S1$

注意, 子字符串不是子串, 而是 $S1$ 在算法的递归中作为子问题出现而这么命名的 (我命名的).

将 LMS 子串升序排序, 每个 LMS 根据相对关系离散化成整数存入 $S1$, 排序的规则不光是按从左到右比较字符的字典序, 还有第二关键字, 即这个字符对应后缀的 Type, 字符相同时, S-Type 的字符排在 L-Type 字符的后面. 因为前缀相同的 S-Type 后缀大于 L-Type 后缀, 所以这样排序能保证 $S1$ 中后缀的相对大小关系就是 $S$ 中对应的 LMS 后缀的相对大小关系.

$S1$ 中的最后一个字符对应的 LMS 子串一定是空串, 离散化后的值是 $0$, 是 $S1$ 中唯一的 $0$, 也是最小值.

排序之后, 因为 $S1$ 降序, 所以 $SA1$ 一定是 $\{len_{S1} + 1, len_{S1}, ..., 1\}$

关于如何为了保证复杂度, 使用 Radix-Sort.

恭喜你得到了 KA 算法, 满足于 $O(n)$ 复杂度的可以关了这篇博客去写代码了, 不过如果只追求 $O(n)$ 复杂度去学 DC3 不行吗, 来受这罪干什么.

为了得到更好的效率, 我们将 LMS 子串的排序问题搁置一下, 假设这个问题已经解决了.

对 LMS 子串的排序结果, 可以存储在 $SA1$ 中, 只要没有本质相同的 LMS 子串, LMS 子串的次序一定可以表示 LMS 后缀的次序; 如果有本质相同的 LMS 子串, 则将排序前的 $S1$ 作为子问题, 递归求解. 这种做法会在下文详细解释.

## 用 $SA1$ 诱导 $SA$

这时假设已经求出 $SA1$, 考虑如何根据已经求出的 $SA1$, 求出 $SA$.

必须保证 $S1$ 中的所有 LMS 子串本质不同, 否则对排序前的 $S1$ 递归诱导, 直到求出严格的次序为止.

这样做的原因是如果有两个 LMS 子串本质相同, 就不能得到 LMS 后缀的严格相对关系, 也就不能诱导 $SA$ 了. 因为 $SA$ 的诱导是建立在 LMS 后缀插入时的严格递减关系上的, 如果有两个 LMS 子串相同, 就有可能出现(将(本来较小的 LMS 后缀) 排到 (((比它大的) (以(同一个 LMS 子串) 为公共前缀的) LMS 后缀的) 前面) 的情况). (为了方便阅读 (虽然也没方便多少), 加了括号)

因为在 SA 中, 首字符相同的后缀一定是聚在一起的, 所以将 SA 数组分割成几个栈, 然后维护每个栈顶的指针. 每个字符有一个对应的栈. 和一般的栈不同的是, 本算法的栈可以从下往上堆, 也能从上往下堆. 这是因为在每个栈里面, 左边是 L-Type 后缀, 右边是 S-Type 后缀. 这是引入 L/S-Type 后缀时证明过的, 在首字符相同时, S-Type 后缀比 L-Type 后缀大. 对 L-Type 后缀, 从下往上堆栈 (从左往右), 对 S-Type 后缀, 从上往下堆栈 (从右往左).

算法分为三步:

- 操作一

  将所有 LMS 后缀按 $SA1$ 的顺序倒序堆入桶里, 由于 LMS 后缀都是 S-Type 后缀, 所以从上往下堆栈.

- 操作二

  从左到右扫描 $SA$, 对于 $SA_i$ 存在的情况, 只要 $Suff_{SA_i - 1}$ 是 L-Type 后缀, 就将 $Suff_{SA_i - 1}$ 堆入相应的栈中. 由于这次插入的都是 L-Type 后缀, 所以不会出现重复插入的情况 (原来栈中只有 S-Type 后缀), 而且从下往上堆栈.

- 操作三

  从右到左扫描 $SA$, 只要 $Suff_{SA_i - 1}$ 是 S-Type 后缀就堆入相应的栈. 堆入的是 S-Type 后缀, 所以从上往下堆. 无视之前已经放入的 LMS 后缀, 直接在对应的地址覆盖原来的 LMS 后缀.

## 正确性证明

- 操作一

  第一次的操作, LMS 后缀放的位置是暂时的, 是和最终的 SA 不同的, 所以无正确性可言. 这里证明 $SA$ 中 LMS 后缀从左到右递增.

  由于是从上往下堆入 LMS 后缀, 且 LMS 后缀以递减的顺序堆入, 所以操作一结束后 $SA$ 中从左往右的 LMS 后缀是递增的.

- 操作二

  先证明不漏掉任何 L-Type 后缀. 每个后缀 $Suff_i$ 只能被 $Suff_{i + 1}$ 诱导进来, 所以除了所谓的 LML 后缀 (满足 $Suff_{i - 1}$ 是 S-Type 后缀的 L-Type 后缀 $Suff_i$ 称 LML 后缀). 其它的所有 L-Type 后缀都必须在堆入 $SA$ 后被 $i$ 扫描到一次. 即 $i < RK_{SA_i - 1}$, 转化成大小关系就是 $Suff_i < Suff_{i - 1}$, 我们知道 $Suff_{i - 1}$ 是 L-Type 后缀, 所以 $Suff_i < Suff_{i - 1}$ 是显然的.

  接下来证明堆入的 L-Type 后缀的位置正确. 前面已经说明了任意 L-Type 后缀的位置已经被规定在了对应首字符的栈里的左边部分, 这里只要证明在同一个栈中的 L-Type 区域内, L-Type 后缀从左到右递增即可.

  由于 $Suff_{SA_i - 1}$ 堆入的栈中的后缀的首字符相等, 所以只要 $Suff_{SA_i}$ 从小到大扫描即可保证栈内的 L-Type 后缀递增.

  数学归纳法, 假设已经加入的 L-Type 后缀的位置正确, 即从左到右递增, 第一步保证了 LMS 递增. 因为同首字符的 L-Type 后缀小于 S-Type 后缀, 所以前面将 L-Type 放左边, S-Type 放右边. 所以 $SA$ 中的所有后缀 (L-Type 和 S-Type), 从左到右递增.

  因为是从左往右扫描, 所以扫描到后缀递增. 只要小的后缀先堆入, 最终可以保证每个栈内的 L-Type 区递增.

- 操作三

  同样先看是否遗漏, 证明一个 S-Type 后缀进入 $SA$ 后一定会被 $i$ 扫描到. 对于 S-Type 后缀 $Suff_{SA_i - 1}$, 必有 $Suff_{SA_i} > Suff_{SA_i - 1}$, 所以 $Suff_{SA_i - 1}$ 在 $SA$ 中的地址比 $Suff_{SA_i}$ 靠前, 所以会被向左移动的 $i$ 扫描到.

  第三次扫描时覆盖掉 LMS 后缀, 证明所有 LMS 后缀 $Suff_i$ 不会诱导 $Suff_{SA_i - 1}$. 操作三中一个后缀被诱导进来, 必须满足 S-Type, 但是 LMS 后缀左边一定是 L-Type 后缀, 所以在操作三中 LMS 后缀不会诱导任何后缀.

  由于 $Suff_{SA_i}$ 从右往左递减, 所以, 首字符相同的 $Suff_{SA_i - 1}$ 加入对应的栈的顺序应该是递减的. 因为是从上往下堆栈, 所以操作三后, 栈中 S-Type 区的后缀从右往左递减, 即从左往右递增.

结合一开始对 $SA$ 划分的说明, 只要证明了所有栈的 L/S-Type 区的后缀从左往右递增, 也就证明了整个 $SA$ 中的后缀从左往右递增.

## $S1$ 的排序

如何高效地求出 $S1$ 的顺序, 处理出 $SA1$, 成了最后需要解决的问题. 

引入一个概念: LMS 前缀 (LMS-prefix), $Pre_i$, 表示从 $S_i$ 到从它开始右边第一个 LMS 字符的子串. 特别地, 对于 LMS 字符 $S_i$, 它的 LMS 前缀就是它本身.

先说结论, 只要先将 $S$ 的 LMS 字符 (所有长度为 $1$ 的 LMS 前缀) 随机丢进 $SA$ 里, 然后跑一遍操作二和操作三, 扫描得到的 $SA$, LMS 字符的下标在 $SA$ 中按对应的 LMS 子串的字典序升序排序.

- 证明

  随机堆入长度为 $1$ 的 LMS 前缀后, 可以保证从左往右首字符递增, 即 LMS 前缀递增.

  将 L-Type 的 LMS 前缀堆入栈中后, 从左到右 L-Type 的 LMS 前缀递增可以用数学归纳法证明.

  如果当前已有的 L-Type 前缀是递增的, 则由它们诱导的 L-Type 前缀 $Pre_i$ 也递增, 因为 $Pre_i$ 的首字符有序性由它堆入哪个栈决定, 去掉首字符的 $Pre_i$ 已经在 $SA$ 中, 并且符合有序性, 所以 $Pre_i$ 的有序性得证.

  相似地, 根据 L-Type 前缀将 S-Type 前缀堆入栈中后, 可以保证从左到右 S-Type 的 LMS 前缀递增.

  这时原长度为 $1$ 的 LMS 前缀被相同起点的 LMS 子串代替, 仍然满足从左到右递增, 所以这时 LMS 子串递增.

需要考虑的是, 如何判断 LMS 子串相同的情况. 由于 LMS 子串总长度是 $O(n)$ 的, 且单调排列, 所以只要存在相同的子串, 则它们在 $SA$ 中必定相邻. 暴力判重时, 每个串最多扫两边, 总复杂度线性, 暴力判重复杂度正确.

判重的同时离散化 (命名 $S1$ 中的字符), 因为所有 LMS 子串的左端点都有序地存在 $SA$ 中, 直接线性扫描并且依次命名即可.

## 代码实现

算法呈递归结构, 每一层递归的规模最多是上一层的一半, 所以总体时空复杂度最坏是 $O(2n)$. 空间管理上, 开内存池, 避免在后面的递归中给小规模问题开全规模的空间.

这种递归时传输用到的数组在内存池中的头指针的做法不是很常见, 所以会遇到很多问题. 比如程序中有一些存下标的数组, 在进入下一层或返回上一层时, 随着头指针的位置变化, 同一个下标指向的地址也会发生变化, 这种情况就很难协调, 所以~~物竞卧底~~采用统一参照物的方法:

这里定义 $N$ 表示本层问题规模, $CntLMS$ 是 LMS 字符数量, 也就是可能存在的下一次的问题规模. 定义 $S\_S1_i$ 表示以本层 LMS 字符 $S_i$ 为起点的 LMS 子串在 $S1$ 中的下标, 由于递归中 $S1_1$ 的地址是 $S_{N + 1}$, 也就是 $S1$ 的地址紧跟在 $S$ 的地址后面. 所以 $S\_S1$ 中存储的值域是 $[N + 1, N + CntLMS]$, 所以 $S\_S1$ 表示的是以 $S$ 为参照物的相对下标.

定义 $Address_i$ 表示上一层的 $S1_i$, 即本层的 $S_i$, 所代表的上一层的 $S$ 中的 LMS 子串的首字符的下标. 由于记录的是上一层的下标, 这里如果用本层 $S$ 为参照物, 则坐标值域将是负数, 不方便. 于是以上一层的 $S$ 为参照物, 值域为上一层的 $[1, N]$.

对于 $SA$, 由于 $SA_i$ 和 $i$ 的意义都是在同一层定义的, 所以理所当然地, $SA$ 在哪一层, 下标参照物就是哪一层的 $S$.

顶层设计结束, 接下来进行局部分析:

### 通过 $SA1$ 诱导 $SA$

预处理部分, 首先要确定一个后缀的类型, 扫一遍即可. 然后处理 $Address$, $S\_S1$ 两个数组. 为了开桶, 提前计算出对应字符出现次数, 同时统计字符集. 通过调用 `Induced_Sort()` 来求出 $SA1$, 确定了 LMS 子串的顺序, 在执行 `Induced_Sort()` 时也对本层的 $SA$ 进行了填入, 执行完后要重置本层的 $SA$.

万事俱备, 函数主体是三次对 $SA$ 的填入, 一定要搞清楚方向, 无论是扫描方向还是堆栈方向, 否则会很迷惑. 方向的判断参照对正确性的证明, 通过后缀的单调性来判断. 每次改变堆栈方向要重新确定栈顶 (左端或右端), 因为填入过程中 $Bucket$ 不被修改, 所以每次可以 $O(N)$ 重置 $SumBucket$.

```cpp
void Induc (unsigned *Address, char *Type, unsigned *SA, unsigned *S, unsigned *S_S1, unsigned *Bucket, unsigned *SumBucket, unsigned N) {// 诱导 SA
  for (register unsigned i(1), j(1); i < N; ++i) {      // 定性 S/L 
    if(S[i] < S[i + 1]) {                               // Suff[j~i] 是 S-Type 
      while (j <= i) {
        Type[j++] = 1;
      }
    }
    if(S[i] > S[i + 1]) {                               // Suff[j~i] 是 L-Type 
      while (j <= i) {
        Type[j++] = 0;
      }
    }
  }
  Type[N] = 1;
  Type[0] = 1;
  register unsigned CntLMS(N)/*记录 LMS 字符数量*/;
  for (register unsigned i(1); i < N; ++i) {            // 记录 S1 中字符对应的 S 的 LMS 子串左端 LMS 字符的位置 Address[], 和 S 中的 LMS 子串在 S1 中的位置 S_S1[] 
    if(!Type[i]) {
      if(Type[i + 1]) {
        Address[++CntLMS] = i + 1;
        S_S1[i + 1] = CntLMS;
      }
    }
  }
  register unsigned bucketSize(0);                      // 本次递归字符集大小 
  for (register unsigned i(1); i <= N; ++i) {           // 确定 Bucket, 可以线性生成 SumBucket 
    ++Bucket[S[i]];
    bucketSize = bucketSize < S[i] ? S[i] : bucketSize; // 统计 Bucket 的空间范围 
  }
  Induced_Sort(Address, Type, SA, S, S_S1, Bucket, SumBucket, N, bucketSize, CntLMS);// 诱导排序 LMS 子串, 求 SA1 
  memset(SA + 1, 0, sizeof(unsigned) * N);              // 在求 SA1 时也填了一遍 SA, 这里进行清空 
  SumBucket[0] = 1;                                     // SA1 求出来了, 开始诱导 SA 
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (右端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  for (register unsigned i(CntLMS); i > N; --i) {       // 放 LMS 后缀 
    SA[SumBucket[S[Address[SA[i] + N]]]--] = Address[SA[i] + N];
  }
  SumBucket[0] = 1;
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (左端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  for (register unsigned i(1); i <= N; ++i) {           // 从左到右扫 SA 数组 
    if(SA[i] && (SA[i] - 1)) {
      if(!Type[SA[i] - 1]) {                            // Suff[SA[i] - 1] 是 L-Type 
        SA[++SumBucket[S[SA[i] - 1] - 1]] = SA[i] - 1; 
      }
    }
  }
  SumBucket[0] = 1;
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (右端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  for (register unsigned i(N); i >= 1; --i) {           // 从右往左扫 SA 数组 
    if(SA[i] && (SA[i] - 1)) {
      if(Type[SA[i] - 1]) {                             // Suff[SA[i] - 1] 是 S-Type 
        SA[SumBucket[S[SA[i] - 1]]--] = SA[i] - 1; 
      }
    }
  }
  return;
}
```

### LMS 子串的诱导排序

主体部分还是三轮 $SA$ 的填入, 但是不同的是, 填入后要根据 $SA$ 对 $S1$ 进行命名, 并且处理出 $SA1$ 的数值, 供上一层使用.

由于 `Induc()` 中有对 `Induced_Sort()` 的调用, `Induced_Sort()` 中也有对 `Induc()` 的调用. 所以将 `Induc()` 的定义写在后面, 并且在 `Induced_Sort()` 之前提前声明.

判重命名环节涉及大量的本层和上一层的参照物转换, 脑中一定要有全局的连续的内存空间占用模型, 否则很容易两行写出三个 BUG (不是夸张, 亲身经历, 事实上最多一次两行挤进去四五个 BUG).

最后判重结束后, 只要有本质相同的子串, 就进入下一层递归.

```cpp
void Induc (unsigned *Address, char *Type, unsigned *SA, unsigned *S, unsigned *S_S1, unsigned *Bucket, unsigned *SumBucket, unsigned N);// 诱导 SA
void Induced_Sort (unsigned *Address, char *Type, unsigned *SA, unsigned *S, unsigned *S_S1, unsigned *Bucket, unsigned *SumBucket, unsigned N, unsigned bucketSize, unsigned LMSR) {// 通过 S 求 SA
  SumBucket[0] = 1;
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (右端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  memset(SA + 1, 0, sizeof(unsigned) * N);              // 在上一层的诱导排序中, 填入了 SA, 这里进行清空 
  for (register unsigned i(LMSR); i > N; --i) {         // 放长度为 1 的 LMS 前缀 
    SA[SumBucket[S[Address[i]]]--] = Address[i];
  }
  SumBucket[0] = 1;
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (左端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  for (register unsigned i(1); i <= N; ++i) {           // 从左到右扫 SA 数组 
    if(SA[i] && (SA[i] - 1)) {
      if(!Type[SA[i] - 1]) {                            // Suff[SA[i] - 1] 是 L-Type 
        SA[++SumBucket[S[SA[i] - 1] - 1]] = SA[i] - 1; 
      }
    }
  }
  SumBucket[0] = 1;
  for (register unsigned i(1); i <= bucketSize; ++i) {  // 重置每个栈的栈底 (右端) 
    SumBucket[i] = SumBucket[i - 1] + Bucket[i];
  }
  for (register unsigned i(N); i >= 1; --i) {           // 从右往左扫 SA 数组 
    if(SA[i] && (SA[i] - 1)) {
      if(Type[SA[i] - 1]) {                             // Suff[SA[i] - 1] 是 S-Type 
        SA[SumBucket[S[SA[i] - 1]]--] = SA[i] - 1; 
      }
    }
  }
  register char flg(0)/*是否有重*/;
  register unsigned CntLMS(0)/*本质不同的 LMS 子串数量*/, Pre(N)/*上一个 LMS 子串起点*/, *Pointer(SA + N + 1)/*LMS 子串的 SA 的头指针*/;
  for (register unsigned i(2); i <= N; ++i) {           // 扫描找出 LMS, 判重并命名 
    if(Type[SA[i]] && (!Type[SA[i] - 1])) {
      if(Pre ^ N && Equal(S, Type, SA[i], Pre)) {       // 暴力判重
        S[S_S1[SA[i]]] = CntLMS;                        // 命名 
        flg = 1;
      }
      else {
        S[S_S1[SA[i]]] = ++CntLMS;                      // 命名 
      }
      Pre = SA[i];                                      // 用来判重 
      *(++Pointer) = S_S1[SA[i]] - N;                   // 记录 LMS 
    }
  }
  S[LMSR] = 0;
  SA[N + 1] = LMSR - N;                                 // 末尾空串最小 
  if(flg) {                                             // 有重复 LMS 子串, 递归排序 S1 
    Induc(Address + N, Type + N, SA + N, S + N, S_S1 + N, Bucket + bucketSize + 1, SumBucket + bucketSize + 1, LMSR - N); //有重复, 先诱导 SA1, 新的 Bucket 直接接在后面 
  }
  return;                                               // 递归跳出, 保证 SA1 是严格的
}
```

### LMS 子串的比较

上面证明过, 暴力判断的复杂度正确. 所以只要一个一个字符地判断即可 (我也没有想到别的判重的好办法).

两个 LMS 子串的相等, 无非就是字符相同的同时, Type 也相同. 除了空串外, LMS 子串都分为三部分: 最左边是连续的 S-Type, 我喜欢叫它 S 区; 接着是连续的 L-Type, 也就是 L 区; 末尾是一个 S-Type, 简称尾 S. 处理好边界情况即可.

```cpp
inline char Equal (unsigned *S, char *Type, unsigned x, unsigned y) {
  while (Type[x] & Type[y]) {     // 比较 S 区 
    if(S[x] ^ S[y]) {
      return 0;
    }
    ++x,++y;
  }
  if(Type[x] | Type[y]) {         // L 区起点是否整齐 
    return 0;
  }
  while (!(Type[x] | Type[y])) {  // 比较 L 区 
    if(S[x] ^ S[y]) {
      return 0;
    }
    ++x, ++y;
  }
  if(Type[x] ^ Type[y]) {         // 尾 S 位置是否对应 
    return 0;
  }
  if(S[x] ^ S[y]) {               // 尾 S 权值是否相等 
    return 0;
  }
  return 1;
}
```

### 剩余部分的代码

只剩下 `main()` 里面的 I/O 接口, 为了提高效率, 采用 `fread()` 读入.

```cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <iostream>
#include <map>
#include <queue>
#include <vector>
#define Wild_Donkey 0
using namespace std;
unsigned Cnt(0), n, Ans(0), Tmp(0), SPool[2000005], SAPool[2000005], BucketPool[2000005], SumBucketPool[2000005], AddressPool[2000005], S_S1Pool[2000005];
char TypePool[2000005];
int main() {
  fread(TypePool + 1, 1, 1000004, stdin);
  for (register unsigned i(1); ; ++i) {   // 尽量压缩字符集 
    if(TypePool[i] <= '9' && TypePool[i] >= '0') {
      SPool[i] = TypePool[i] - 47;
      continue;
    }
    if(TypePool[i] <= 'Z' && TypePool[i] >= 'A') {
      SPool[i] = TypePool[i] - 53;
      continue;
    }
    if(TypePool[i] <= 'z' && TypePool[i] >= 'a') {
      SPool[i] = TypePool[i] - 59;
      continue;
    }
    n = i;
    break;
  }
  SPool[n] = 0;// 最后一位存空串, 作为哨兵 
  Induc (AddressPool, TypePool, SAPool, SPool, S_S1Pool, BucketPool, SumBucketPool, n);
  for (register unsigned i(2); i <= n; ++i) { // SA[1] 是最小的后缀, 算法中将空串作为最小的后缀, 所以不输出 SA[1] 
    printf("%u ", SAPool[i]);
  }
  return Wild_Donkey;
}
```

## 后记

一开始刚学完后缀数组是 `Apr.1st`, 提交的递归求后缀数组效率极低, 工程精神驱使我优化, 结果反向优化 (详情见[倍增求后缀数组](https://www.luogu.com.cn/blog/Wild-Donkey/bei-zeng-qiu-hou-zhui-shuo-zu-suffix-array)). 当时立下 Flag, 等学完字符串的其他主要内容, 一定会来学线性算法. `Apr.15th`, 学完回文自动机的我正要看 DC3, 结果发现 SA-IS 效率更高, 果断选择了它, 没想到竟花了一周多才结束.

大部分时间在学算法, 而不是打代码. 看网上的文章有很多卡住的地方, 因为理解上的偏差和逻辑的不严谨, 比如[这篇文章](https://riteme.site/blog/2016-6-19/sais.html)的 "任何 LMS 子串不是另一个 LMS 子串的真前缀" 的问题, 我花了两天去 Hack 这个命题, 将它证伪了, 看评论才知道作者已经在下面做了补充.

接着就是看原文, 因为是第一次看英文论文, 所以非常吃力, 打印了一份, 甚至在早读时都在研究.

代码是 `Apr.21st` 才开始打的, 一晚上就写到 `8KB`, 然后第二晚调了一晚. 今天, `Apr.23rd`, AC 的时候长度来到了 `11KB`(很大一部分是注释和调试). 可以看看[初始代码](https://github.com/Wild-Donkey/Code/blob/main/Luogu/P3800-P3999/P3809_Suffix_Array_SA-IS_Origin.cpp)感受一下 (如果链接炸了, 这里是[提交记录](https://www.luogu.com.cn/record/49865967)).

不过总算是写出来了, 虽然这种不看标程直接莽代码的行为非常愚蠢, 但是学一个新算法最好的方法就是在一点点摸索的过程中把问题都暴露出来了. 看一份代码, 想一个模型以至于提到它就想吐的地步, 为了一个细节推敲半天, 这就是工程精神.

希望以后的算法能友好一些, 也希望 OIer 能不忘初心, 关注一下算法的工程价值和美学价值.

## 参考文献:

[Linear Suffix Array Construction by Almost Pure(2009)](https://dna049.com/string/LinearSuffixArrayConstructionbyAlmostPureInduced-Sorting.pdf)

[诱导排序与 SA-IS 算法](https://riteme.site/blog/2016-6-19/sais.html)