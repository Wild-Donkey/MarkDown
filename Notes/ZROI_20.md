# Day 1

## [CF1427E](https://www.luogu.com.cn/problem/P1427C)

Exgcd()

## [CF1340D](https://www.luogu.com.cn/problem/P1340D)

结论

## [CF1442D](https://www.luogu.com.cn/problem/P1442D)

$f_{i, j}$ 前 $i$ 个数组选了 $j$ 个.

$f_{i, j} = \max(f_{i - 1, k} + Sum_{i, j - k})$

DP $O(n^3)$

分治背包, $O(nk\log n)$.

## [CF1446C](https://www.luogu.com.cn/problem/P1446C)

Trie

## [CF1439B](https://www.luogu.com.cn/problem/CF1439B)

按度数从小到大删

## [P4007](https://www.luogu.com.cn/problem/P4007)

矩阵优化 DP

## [P4766](https://www.luogu.com.cn/problem/P4766)

区间 DP

## [P4350](https://www.luogu.com.cn/problem/P4350)

删边改建边, 并查集维护

## [P4748](https://www.luogu.com.cn/problem/P4748)

直接枚举 $k$ 判断 Size 整除性即可.

## [P4750](https://www.luogu.com.cn/problem/P4750)

二维差分

## [AGC052B]()

转化为交换点权, .

## [COCI2018-2019]()

连三个竞赛图的边, 然后跑 Tarjan.

## [P5307](https://www.luogu.com.cn/problem/P5307)

整数分块, DP

## [P7207](https://www.luogu.com.cn/problem/P7207)

递归匹配

## [AGC043B](https://www.luogu.com.cn/problem/AT5799)

转化为异或, 然后 Lucas 统计贡献次数.

## [AGC044B]()

每次删点, DFS 更新最短路, 均摊 $O(n^3)$.

## [AGC045B]()

前缀和求极值, 枚举最大值, 然后贪心判断.

## [AGC045C]()

推结论, 然后 $O(n^2)$ DP

## [CF1458C](https://www.luogu.com.cn/problem/CF1458C)

转化为维护三元组, 位移相当于全局加减, 置换相当于交换两维.

## [CF1361E](https://www.luogu.com.cn/problem/CF1361E)

随机化, 如果好点比 $20\%$ 多, 则每次有 $20\%$ 几率找到好点. 随机 $x$ 次, 找到的概率是 $1 - 0.8^x$, 随机 $100$ 次基本就完全正确了.

每次判断 DFS 即可.

找到以后直接从它的入边找所有的点, 如果有 $20\%$ 就输出.

## [CF1444D](https://www.luogu.com.cn/problem/CF1444D)

