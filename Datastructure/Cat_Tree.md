# Cat_Tree

一种解决 RMQ 问题的数据结构, 和 ST 表相同, 猫树 (Cat_Tree) 需要 $O(n \log n)$ 预处理, 空间复杂度 $O(n \log n)$, 单次查询 $O(1)$.

## Structure

说是树, 事实上还是一个表格的结构, 我们需要把原序列扩张到二的整次幂, 设新的 $n = 2^{Lg}$, 然后分成 $Lg$ 层. 从 $1$ 开始编号, 第 $i$ 层有 $2^{Lg - i}$ 个节点, 每个节点覆盖 $2^i$ 个位置.