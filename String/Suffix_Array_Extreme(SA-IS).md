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

## LCP (Longest Common Prefix)

字符串 $a$, $b$ 的最长公共前缀表示为 $LCP(a, b)$, $LCP(a, b)$ 的长度表示为 $lcp(a, b)$.

设 $j \in [0, lcp(Suff_i, Suff_{i + 1})]$, 则所有 $s_{i + j}$ 都是同一字符.

- 对于第一类后缀

  $$
  s_{i + j} < s_{i + lcp(Suff_i, Suff_{i + 1}) + 1}
  $$

- 对于第二类后缀

  $$
  s_{i + j} > s_{i + lcp(Suff_i, Suff_{i + 1}) + 1}
  $$

对于 $lcp(Suff_i, Suff_{i + 1})$ 和 $lcp(Suff_{i + 1}, Suff_{i + 2})$ 的关系, 分两类讨论

- $lcp(Suff_i, Suff_{i + 1}) = 0$

  没有相同前缀, 也就是说首字符也不同, 也就是说 $s_i \neq s_{i + 1}$, 这时的 $lcp(Suff_{i + 1}, Suff_{i + 2})$ 和 $lcp(Suff_i, Suff_{i + 1})$ 无关.

- $lcp(Suff_i, Suff_{i + 1}) > 0$

  因为 $[i, i + lcp(i, i + 1)]$ 是连续的同一个字符, $s_{i + lcp(i, i + 1)} \neq s_{i + 1 + lcp(i, i + 1)}$. 分析 $lcp(i + 1, i + 2)$, 因为 $[i + 1, i + 1 + lcp(i, i + 1) - 1]$ 是同一字符, $s_{i + 1 + lcp(i, i + 1) - 1} \neq s_{i + 2 + lcp(i, i + 1) - 1}$, 所以 $lcp(i + 1, i + 2) = lcp(i, i + 1) - 1$.

## LMS (Left Most Suffix)

如果第一类后缀 $Suff_i$, 满足 $Suff_{i - 1}$ 是第二类后缀, 即局部极小后缀, 则称 $s_i$ 为字符串 $s$ 的一个 LMS 字符.

如果两个 LMS 字符 $s_i$, $s_j$ 之间没有 LMS 字符, 则 $[i, j]$ 是一个 LMS 子串.

分析 LMS 子串长度, 如果有子串 $[i, i + 1]$ 是 LMS 子串, 则 $s_i$, $s_{i + 1}$ 是 LMS 字符. $s_i$ 是 LMS 字符要求 $Suff_i$ 是第一类后缀, $s_i + 1$ 是 LMS 字符要求 $Suff_i$ 是第二类后缀, 自相矛盾, 所以不会出现长度为 $2$ 的 LMS 子串, LMS 子串长度最短为 $3$.

因为相邻的 LMS 子串共用一个公共字符, 所以 $s$ 中的 LMS 子串数量级为 $O(\frac{len_s}{2})$.

接下来证明一个 LMS 子串不是另一个 LMS 子串除它本身之外的前缀, 网上的证明真的看不太懂, 于是自己想方设法给出一个较为详细的简单证明 (可能不是很严谨, 欢迎 Hack)

如果有 LMS 子串 $[a, b]$ 是 $[c, d]$ 的真前缀, 说明 $[c, c + b - a] = [a, b]$.

因为 LMS 子串中, 左边一部分加右端点都是第一类后缀, 右边一部分不加右端点都是第二类后缀, 所以设分界点 $e$, $f$, 使得 $Suff_i~i \in [a, e] \cup [c, f] \cup \{b, d\}$ 是第一类后缀, $Suff_i~i \in [e + 1, b - 1] \cup [f + 1, d - 1]$ 是第二类后缀.

因为 $Suff_e$ 是第一类后缀, $Suff_{e + 1}$ 是第二类后缀, 所以 $s_{e + lcp(Suff_e, Suff_{e + 1})} < s_{e + lcp(Suff_e, Suff_{e + 1}) + 1}$, $s_{e + lcp(Suff_{e + 1}, Suff_{e + 2}) + 1} > s_{e + lcp(Suff_{e + 1}, Suff_{e + 2}) + 2}$.

根据之前的 $lcp(Suff_i, Suff_{i + 1})$ 和 $lcp(Suff_{i + 1}, Suff_{i + 2})$ 的关系, 分类讨论

- $lcp(Suff_e, Suff_{e + 1}) = 0, lcp(Suff_e, Suff_{e + 1}) - 1 \neq lcp(Suff_{e + 1}, Suff_{e + 2})$

  这时 $s_e < s_{e + 1}$.

- $lcp(Suff_e, Suff_{e + 1}) > 0, lcp(Suff_e, Suff_{e + 1}) - 1 = lcp(Suff_{e + 1}, Suff_{e + 2})$

  这时 $s_{e + lcp(Suff_e, Suff_{e + 1})} < s_{e + lcp(Suff_e, Suff_{e + 1}) + 1}$, $s_{e + lcp(Suff_e, Suff_{e + 1})} > s_{e + lcp(Suff_e, Suff_{e + 1}) + 1}$. 自相矛盾, 这种情况不存在.

综上, $s_e < s_{e + 1}$, 同理, $s_f < s_{f + 1}$, $s_{b - 1} > s_b$, $s_{d - 1} > s_d$.

根据之前的结论, $e + 1 < b$. 则只要 $s_e < s_{e + 1}$, 必有 $s_{c + e - a} < s_{c + e + 1 - a}$, 就有 $Suff_{c + e - a}$ 是第一类后缀, 根据 LMS 子串的性质, $Suff_i~i \in [c, c + e - a]$ 是第一类后缀. 因为 $Suff_{f + 1}$ 是第二类后缀, 所以 $c + e - a \leq f$, 即 $e - a \leq f - c$.

同样的, 因为 $s_{b - 1} > s_b$, 所以 $s_{c + b - 1 - a} > s_{c + b - a}$, 所以 $Suff_{c + b - 1 - a}$ 是第二类后缀, 根据 LMS 子串的性质得 $Suff_i~i \in [c + b - 1 - a, d - 1]$ 都是第二类后缀.

至此, 已经证明了 $[c, f] \cup \{d\}$ 的后缀都是第一类后缀, $[c + b - 1 - a, d - 1]$ 的后缀都是第二类后缀, 按照 $f$ 的定义, 第二类后缀的编号区间是 $[f + 1, d - 1]$, 则 $c + b - 1 - a \geq f + 1$, 整理得 $b - 1 - a = f + 1 - c$. 也就是说 

这时将 $Suff_{e + 1}$ 是第二类后缀的情况分为两种

- $e + 1 + lcp(Suff_{e + 1}, Suff_{e + 2}) < b$

这时的 $e + 1 + lcp(Suff_{e + 1}, Suff_{e + 2}) + 1 \leq b$, 所以

- $e + lcp(Suff_{e + 1}, Suff_{e + 2}) > b$ 

## SA-IS

将 LMS 子串排序, 结果存入 $s'$, 

## 例题

