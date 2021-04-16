# 线性求后缀数组: $\mathbf{SA-IS~ Algorithm}$

SA-IS 算法在实现线性求后缀数组的同时, 做到了比 DC3 更强的常数效率, 适合在对求后缀数组效率有要求的题目中使用.

建议先学[倍增求后缀数组](https://www.luogu.com.cn/blog/Wild-Donkey/bei-zeng-qiu-hou-zhui-shuo-zu-suffix-array), 因为编程难度小, 复杂度也能接受, 本篇将沿用上一篇对变量名的定义.

## 后缀分类

假设有字符串 $s$, 则可以将 $s$ 的后缀 $Suff_i$ 分成两类 (因为长度不同, 所以不可能相等):

- $Suff_i < Suff_{i + 1}$

- $Suff_i > Suff_{i + 1}$

规定 $Suff_{len_s + 1}$ 是第一类后缀, 所以 $Suff_{len_s}$ 是第二类后缀.

发现一个性质, 对于一类后缀 $Suff_i$ 和二类后缀 $Suff_j$, 如果 $s_i = s_j$, 那么有 $Suff_i > Suff_j$, 证明如下:

对于 $Suff_i$, 有 $s_i < s_{i + 1}$ 成立或 $s_i = s_{i + 1}$ 和 $Suff_{i + 1} < Suff_{i + 2}$ 成立.

对于 $Suff_j$, 有 $s_j > s_{j + 1}$ 成立或 $s_j = s_{j + 1}$ 和 $Suff_{j + 1} > Suff_{j + 2}$ 成立.

因为 $s_i = s_j$, 所以 $s_{j + 1} \leq s_i = s_j \leq s_{i + 1}$.

对于 $s_{i + 1} > s_{j + 1}$, 结论显然成立

对于 $s_{i + 1} = s_{j + 1}$, 则一定有 $s_{j + 1} = s_i = s_j = s_{i + 1}$. 逐位比较, 只要 $s_i + k = s_j + k$, 就有 $Suff_{i + k} < Suff_{i + k + 1}$, $Suff_{j + k} > Suff_{j + k + 1}$, 然后 $k$ 增加 $1$. 由于已经确定 $Suff_i$ 和 $Suff_j$ 的类别, 所以迟早会遇到 $k$, 使得 $s_{i + k} < s_{i + k + 1}$ 或 $s_{j + k} > s_{j + k + 1}$, 因为 $s_{i + k} = s_{j + k}$, 所以有 $s_{j + k + 1} < s{i + k + 1}$.

所以无论如何都有 $Suff_i > Suff_j$, 证毕.

## 特殊字符 / 子串

如果第一类后缀 $Suff_i$, 满足 $Suff_{i - 1}$ 是第二类后缀, 即局部极小后缀, 则称 $s_i$ 为字符串 $s$ 的一个特殊字符.

如果两个特殊字符 $s_i$, $s_j$ 之间没有特殊字符, 则 $[i, j)$ 是一个特殊子串.

规定 $Suff_{len_s + 1}$ 是特殊子串, 也是唯一的长度为 $1$ 的特殊子串.

因为如果有除 $Suff_{len_s + 1}$ 的子串 $[i, i]$ 是特殊子串, 则 $s_i$, $s_{i + 1}$ 是特殊字符. $s_i$ 是特殊字符要求 $Suff_i$ 是第一类后缀, $s_i + 1$ 是特殊字符要求 $Suff_i$ 是第二类后缀, 矛盾, 所以不会出现第二个长度为 $1$ 的特殊子串, 特殊子串长度最短为 $2$.

可以得到 $s$ 中的特殊子串数量最多为 $\lceil \frac{len_s}{2} \rceil$

接下来证明一个特殊子串不是另一个特殊字串除它本身之外的前缀: 

如果有 $[a, b]$ 是 $[c, d]$ 的真前缀, 说明 $[c, c + b - a] = [a, b]$. 这时 $Suff_{a - 1}$, $Suff_{c - 1}$, $Suff_b$, $Suff_d$ 是第二类后缀, 因为 $s_a$, $s_c$, $s_{b + 1}$, $s_{d + 1}$ 是特殊字符.

考虑 $Suff_{c + b - a}$ 是第几类后缀. 

- 如果 $Suff_{c + b - a}$ 是第一类后缀
  
  则 $Suff_{i} (i \in [c, c + b - a])$ 都必须是第一类后缀, 否则就会在 $(c, c + b - a + 1]$ 出现一个新的特殊字符, 和 $(c, d]$ 中没有特殊字符冲突.

  $Suff_{b}$ 是第二类后缀, 所以 $s_{b + lcp(b, b + 1)} < s_{lcp}$

- 如果 $Suff_{c + b - a}$ 是第二类后缀

  那

所以 $Suff_{c + b - a}$ 是

<!-- ## LCP (Longest Common Prefix)

字符串 $a$, $b$ 的最长公共前缀表示为 $LCP(a, b)$, $LCP(a, b)$ 的长度表示为 $lcp(a, b)$.

设 $j \in [0, lcp(Suff_i, Suff_{i + 1})]$, 则所有 $s_{i + j}$ 都相等.

- 对于第一类后缀

  $$
  s_{i + j} < s_{i + lcp(Suff_i, Suff_{i + 1}) + 1}
  $$

- 对于第二类后缀

  $$
  s_{i + j} > s_{i + lcp(Suff_i, Suff_{i + 1}) + 2}
  $$ -->

## SA-IS

将特殊子串排序, 结果存入 $s'$, 

## 例题

