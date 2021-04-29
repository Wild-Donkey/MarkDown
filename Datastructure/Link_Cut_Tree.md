# Link/Cut Tree (动态树)

动态树问题, 维护一个森林, 支持但不仅限于如下操作:

- Query

  查询路径信息.

- Link

  连接两个不同树上的点.

- Cut

  断开两点之间的连边.

- Change

  单点修改

给出的解决方案是 Link/Cut Tree, 基于 Splay 的数据结构, 简称 LCT.

关于 [Splay](https://www.luogu.com.cn/blog/Wild-Donkey/ren-lun-zhi-guang-splay) 的内容.

LCT 是对原树进行树链剖分后用 Splay 树 (以下简称 Splay) 维护树链的数据结构, 这里的树链剖分指实链剖分, 如果你还不会轻重链剖分, 请先学习[轻重链剖分](https://www.luogu.com.cn/blog/Wild-Donkey/qing-zhong-lian-pou-fen), 因为轻重链剖分是最简单的树链剖分.

## LCT

对于一棵树, 对它建立 LCT. LCT 也是一棵树, 是由若干 Splay 组成的.

原树上的边划分为两种, 实边和虚边. 在原树中, 每个节点只能有一条连接自己和儿子的实边, 其余都是虚边. 这就使原树由