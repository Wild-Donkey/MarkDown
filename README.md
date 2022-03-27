# 计划

## 前期

前期 (NOIp之前) 计划分为四个阶段

* 第一阶段对 NOIp 的知识点进行扫尾, 定于三月份.

* 第二阶段, 学习省选内容, 但是由于很难找到系统的教程. 借助大佬博客, 对每个研究方向进行专项学习, 定于四到八月. 由于文化课的影响, 分为两部分: $6$ 月前期及之前, 仅利用晚自习时间; 再往后是全天时间, 速度会加快.

* 第三阶段, 刷题训练, 以历届真题为主, 配以 CF 的思维训练, 定于九月到十一月.

### 第一阶段

* 第一周
将偏弱的数学部分集中学习, 达到 NOIp 的标准.

| 出处                                                     | 题目             | 知识点                  |
| -------------------------------------------------------- | ---------------- | ----------------------- |
| [P1403-AHOI2005](https://www.luogu.com.cn/problem/P1403) | 约数研究         | 基础数论                |
| [P3811](https://www.luogu.com.cn/problem/P3811)          | 乘法逆元         | 乘法逆元                |
| [P4549](https://www.luogu.com.cn/problem/P4549)          | 裴蜀定理         | 欧几里得算法(gcd)       |
| [P5656](https://www.luogu.com.cn/problem/P5656)          | 二元一次不定方程 | 扩展欧几里得算法(exgcd) |
| [P1082](https://www.luogu.com.cn/problem/P1082)          | 同余方程         | 扩展欧几里得算法(exgcd) |
| [P5091](https://www.luogu.com.cn/problem/P5091)          | 扩展欧拉定理     | 扩展欧拉定理, 快速幂    |
| [P3807](https://www.luogu.com.cn/problem/P3807)          | 卢卡斯定理       | 卢卡斯定理, 组合数学    |
___

* 第二周
动态规划 (DP) 的巩固和加深, 内容是: 期望 DP, 基环树 DP, 树上 DP, 斜率优化, 四边形不等式优化.

| 出处                                                     | 题目              | 知识点                         |
| -------------------------------------------------------- | ----------------- | ------------------------------ |
| [P3195-HNOI2008](https://www.luogu.com.cn/problem/P3195) | 玩具装箱          | 斜率优化                       |
| [P2365](https://www.luogu.com.cn/problem/P2365)          | 任务安排          | 斜率优化                       |
| [P5785-SDOI2012](https://www.luogu.com.cn/problem/P5785) | 任务安排 (加强版) | 斜率优化, 二分查找             |
| [P2120-ZJOI2007](https://www.luogu.com.cn/problem/P2120) | 仓库建设          | 斜率优化                       |
| [P1912-NOI2009](https://www.luogu.com.cn/problem/P1912)  | 诗人小G           | 四边形不等式, 字符串, 二分查找 |
| [P4767-IOI2000](https://www.luogu.com.cn/problem/P4767)  | 邮局              | 四边形不等式                   |
| [P3628-APIO2010](https://www.luogu.com.cn/problem/P3628) | 特别行动队        | 斜率优化                       |

___

* 第三周
字符串, 内容是: KMP, AC 自动机, 后缀自动机, 后缀树和后缀数组, Manacher.

| 出处                                                    | 题目                   | 知识点    |
| ------------------------------------------------------- | ---------------------- | --------- |
| [P3375](https://www.luogu.com.cn/problem/P3375)         | KMP字符串匹配          | KMP算法   |
| [P2375-NOI2014](https://www.luogu.com.cn/problem/P2375) | 动物园                 | KMP算法   |
| [P2580](https://www.luogu.com.cn/problem/P2580)         | 于是他错误的点名开始了 | Trie      |
| [P3808](https://www.luogu.com.cn/problem/P3808)         | AC 自动机 (简单版)     | AC 自动机 |
| [P3796](https://www.luogu.com.cn/problem/P3796)         | AC 自动机 (加强版)     | AC 自动机 |
| [P5357](https://www.luogu.com.cn/problem/P5357)         | AC 自动机 (二次加强版) | AC 自动机 |
___

### 第二阶段

* 第 $1-4$ 周
字符串进阶. 后缀自动机, 广义后缀自动机, 回文自动机, 子序列自动机, 后缀数组 (倍增和线性的 SA-IS), manacher 的学习.

| 出处                                            | 题目                  | 知识点                            |
| ----------------------------------------------- | --------------------- | --------------------------------- |
| [P3809](https://www.luogu.com.cn/problem/P3809) | 后缀排序 (SA)         | 后缀数组, 基数排序, 桶排序, 倍增  |
| [P3804](https://www.luogu.com.cn/problem/P3809) | 后缀自动机 (SAM)      | 后缀自动机, 递推, 记忆化搜索, DFS |
| [P6139](https://www.luogu.com.cn/problem/P6139) | 广义后缀自动机 (GSAM) | 后缀自动机, BFS, Trie             |
| [P3805](https://www.luogu.com.cn/problem/P3805) | Manacher              | Manacher                          |
| [P5496](https://www.luogu.com.cn/problem/P5496) | 回文自动机 (回文树)   | 回文自动机                        |
| [P5826](https://www.luogu.com.cn/problem/P5826) | 子序列自动机          | 子序列自动机, 可持久化线段树      |


* 第 $5-8$ 周
数据结构进阶, 包括数据结构持久化, 轻重链树链剖分, LCT, 边带权/扩展域并查集, 莫队 (基础莫队, 树上莫队, 带修莫队, 带修树上莫队).

| 出处                                                     | 题目                       | 知识点                             |
| -------------------------------------------------------- | -------------------------- | ---------------------------------- |
| [P6136](https://www.luogu.com.cn/problem/P6136)          | 普通平衡树 (数据加强版)    | Splay                              |
| [P3690](https://www.luogu.com.cn/problem/P3690)          | 动态树 Link/Cut Tree (LCT) | Splay, LCT, 文艺平衡树             |
| [P1494](https://www.luogu.com.cn/problem/P1494)          | 小 Z 的袜子                | 莫队, GCD                          |
| [P1903](https://www.luogu.com.cn/problem/P1903)          | 数颜色 / 维护队列          | 莫队, 带修莫队, 离散化             |
| [SP10707 COT2](https://www.luogu.com.cn/problem/SP10707) | Count on a tree Ⅱ          | 莫队, 树上莫队, 离散化             |
| [P4074](https://www.luogu.com.cn/problem/P4074)          | 糖果公园                   | 莫队, 带修莫队, 树上莫队           |
| [CF793F](https://www.luogu.com.cn/problem/CF793F)        | Julia the Snail            | 分块                               |
| [P2024](https://www.luogu.com.cn/problem/P2024)          | 食物链                     | 并查集, 边带权并查集, 扩展域并查集 |
| [SP3377](https://www.luogu.com.cn/problem/SP3377)        | A Bug's Life               | 并查集, 扩展域并查集               |

* 六月

  数据结构: CDQ 分治, KD-Tree, 树套树, 左偏树(可并堆), 长链剖分, 宗法树, 替罪羊树.

  网络流: ISAP, HLPP, 最小费用最大流

| 出处                                                  | 题目               | 知识点                           |
| ----------------------------------------------------- | ------------------ | -------------------------------- |
| [P3377](https://www.luogu.com.cn/problem/P3377)       | 可并堆             | 并查集, 左偏树                   |
| [P3810](https://www.luogu.com.cn/problem/P3810)       | 三维偏序           | CDQ分治, 树状数组, 序理论        |
| [P3369](https://www.luogu.com.cn/problem/P3369)       | 普通平衡树         | 宗法树                           |
| [P3380](https://www.luogu.com.cn/problem/P3380)       | 二逼平衡树(树套树) | 线段树, 宗法树, 树套树, 二分答案 |
| [P3369](https://www.luogu.com.cn/problem/P3369)       | 普通平衡树         | 替罪羊树                         |
| [P4148](https://www.luogu.com.cn/problem/P4148)       | 简单题             | K-D Tree, 替罪羊树               |
| [P5903](https://www.luogu.com.cn/problem/P5903)       | 树上 k 级祖先      | 长链剖分, 倍增                   |
| [P3376](https://www.luogu.com.cn/problem/P3376)       | 网络最大流         | ISAP                             |
| [P4722](https://www.luogu.com.cn/problem/P4722)       | 最大流 加强版      | HLPP                             |
| [P3381](https://www.luogu.com.cn/problem/P3381)       | 最小费用最大流     | SPFA, Dinic, Dijkstra            |
| [P5522](https://www.luogu.com.cn/problem/P5522)       | 棠梨煎雪           | 线段树, 位运算                   |
| [UVA12716](https://www.luogu.com.cn/problem/UVA12716) | GCD = XOR          | 数学, 数论                       |
| [P6189](https://www.luogu.com.cn/problem/P6189)       | 跑步               | 根号分块, DP                     |
| [P1967](https://www.luogu.com.cn/problem/P1967)       | 货车运输           | 最大生成树, LCA, 并查集          |

* 七月: 数据结构 + 字符串 + DP + 图论

  数据结构: 树上启发式合并, FHQ, 哈夫曼树
  
  字符串: EXKMP

  网络流: 上下界最大流, 可行流, 最小费用可行流, 最小费用最大流
  
  图论: 最短路径生成树, 次小生成树, 二分图最佳带权匹配, 圆方树, 双连通分量, 求 LCA 的 Tarjan

| 出处                                              | 题目       | 知识点                     |
| ------------------------------------------------- | ---------- | -------------------------- |
| [P3378](https://www.luogu.com.cn/problem/P3378)   | 堆         | 动态开点堆                 |
| [P5290](https://www.luogu.com.cn/problem/P5290)   | 春节十二响 | 树上启发式合并, 动态开点堆 |
| [P4158](https://www.luogu.com.cn/problem/P4158)   | 粉刷匠     | DP (背包问题), 双层 DP     |
| [SP9070](https://www.luogu.com.cn/problem/SP9070) | 避雷针     | 决策单调性, 分治优化 DP    |
| [P4051](https://www.luogu.com.cn/problem/P4051)   | 字符加密   | SA-IS, 后缀数组            |
| [P5490](https://www.luogu.com.cn/problem/P5490)   | 矩形的并   | 扫描线, 标记永久化线段树   |
| [P1772](https://www.luogu.com.cn/problem/P1772)   | 物流运输   | Dijkstra, 状压 DP          |


* 八月: 数学
  
  容斥原理, 博弈论, 卡特兰数, 莫比乌斯反演, (扩展)中国剩余定理

## 中期 (如果有的话)

事实证明是有的.

中期 (NOIp-省选), 大概从十一月到四月, 包括NOIp, WC, 省选三个时间节点, 对前面所学内容进行集中刷题巩固. 计划分为上下两部分.

- 中一期: 知识储备 `2021.12.26-2022.2.17`

  学习大部分省选知识, 每个知识点单独练习例题, 每个大块安排专项练习. 从各大培训 PPT 找题.

- 中二期: 模拟训练 `2022.2.18-2022.4.15`

  联合各地选手, 每日一场模拟赛, 下午组织讲评.

### 知识清单 (FYS 不会)

以下这些都是fys不会的, 不一定都要学, 但是应该很全了, 不太可能会出现值得学的知识点fys不会且没出现在这个清单里的.

#### tyy 推荐

- 图论: 虚树

- 组合数学: 可重集, 错/ 圆排列, 斯特林数

#### tyy 中立

- DP: 动态动态规划 (DDP)

- 数据结构: zkw 线段树, 笛卡尔树, 析合树

- 字符串: 最小表示, Lyndon 分解, DFA, NFA.

- 图论: 最小直径生成树, 最优比率生成树, 支配集, 独立集, 覆盖集, 斯坦纳树, Prufer 序列, LGV 引理, 弦图, $k$ 短路

- 最短路: 乘积最短路, 加和最短路, 同余最短路, 负环 (SPFA)

- 杂项数学: 线性规划, $0/1$ 分数规划

- 多项式: 牛顿迭代, 多项式除法, 多项式求逆, 多项式开根, 多项式求对数, 多项式指数函数

- 数论: 筛法(Min_25筛, 洲阁筛), 多项式反演 (拉格朗日反演), 威尔逊定理, 平方剩余, 二次同余式, 二次互反律

- 高等数学: 泰勒级数

- 概率论: 贝叶斯公式, 全概率公式, 乘法公式

- 群论: 置换群/循环群, Burnside, Polya

- 计算几何: 半平面交, 旋转卡壳

#### tyy 不推荐

- 数据结构: 跳跃表, 斐波那契堆, 二项堆, 红黑树, AVL, Top Tree

- 字符串: Boyer-Moore 算法, 后缀平衡树

- 图论: 一般图匹配, 最小树形图

- 数学: 完全数

### 知识清单 (FYS 会)

以下这些都是 fys $2022$ 年 $Jan.1st$ 之后会的, 不一定都要学, 但是应该很全了, 不太可能会出现值得学的知识点fys不会且没出现在这个清单里的.

#### tyy 推荐

- DP: 凸优化, CDQ 分治优化, 插头 DP

- 数据结构: 李超线段树

- 图论: 点分治

- 线性代数: 高斯消元, 行列式

- 多项式: 多项式插值, 线性基

- 数论: 杜教筛, 莫比乌斯反演

- 计算几何: 凸包

#### tyy 中立

- 数据结构: 珂朵莉树

- 多项式:  FMT, FWT, FFT, NTT, 多项式快速幂, 生成函数

- 信息论: 熵

- 数论: BSGS, 原根

- 线性代数: 矩阵求逆

### 中一期

#### DP

- 复习内容: 斜率优化, 决策单调性优化, 数据结构优化, 前缀和优化

- 主要内容: 凸优化, CDQ 分治优化

- 次要内容: 动态动态规划 (DDP), 插头 DP

| 出处                                                         | 题目                | 知识点                                  |
| ------------------------------------------------------------ | ------------------- | --------------------------------------- |
| [NOIP2022 P7962](https://www.luogu.com.cn/problem/P7962)     | 方差                | DP, 推式子                              |
| [P3959 NOIP2017](https://www.luogu.com.cn/problem/P3959)     | 宝藏                | 状压 DP                                 |
| [P3943](https://www.luogu.com.cn/problem/P3943)              | 星空                | 状压 DP, 最短路                         |
| [P2150 NOI2015](https://www.luogu.com.cn/problem/P2150)      | 寿司晚宴            | 状压 DP, 根号分治, 容斥                 |
| [P5933 THU2012](https://www.luogu.com.cn/problem/P5933)      | 串珠子              | 状压 DP, 避免重复统计的技巧             |
| [P4363 NPOI2018](https://www.luogu.com.cn/problem/P4363)     | 一双木棋            | 状压 DP, 状压单调折线, 正反转移的区别   |
| [P2595 ZJOI2009](https://www.luogu.com.cn/problem/P2595)     | 多米诺骨牌          | 状压 DP, 轮廓线 DP, 容斥                |
| [URAL1519 P5056](https://www.luogu.com.cn/problem/P5056)     | 插头 DP             | 插头 DP, 轮廓线 DP, 状压 DP             |
| [AGC016F](https://atcoder.jp/contests/agc016/tasks/agc016_f) | Games on DAG        | 博弈论 DP                               |
| [P4317](https://www.luogu.com.cn/problem/P4317)              | 花神的数论题        | 数位 DP                                 |
| [P2235 HNOI2002](https://www.luogu.com.cn/problem/P2235)     | Kathy函数           | 数位 DP, 二进制回文数                   |
| [P3281 SCOI2013](https://www.luogu.com.cn/problem/P3281)     | 数数                | 数位 DP                                 |
| [P1040 NOIP2003](https://www.luogu.com.cn/problem/P1040)     | 加分二叉树          | 区间 DP ,决策记录                       |
| [AGC020E](https://atcoder.jp/contests/agc020/tasks/agc020_e) | Encoding Subsets    | 区间 DP, 记忆化搜索                     |
| [P1514 NOIP2010](https://www.luogu.com.cn/problem/P1514)     | 引水入城            | 记忆化搜索 DP, 贪心                     |
| [P7606 THUPC2021](https://www.luogu.com.cn/problem/P7606)    | 混乱邪恶            | 记忆化搜索 DP, bitset 优化, 随机化      |
| [P2585 ZJOI2006](https://www.luogu.com.cn/problem/P2585)     | 三色二叉树          | 树形 DP                                 |
| [P8202](https://www.luogu.com.cn/problem/P8202)              | 染色                | 树形 DP, 二维树上背包                   |
| [P5021 NOIP2018](https://www.luogu.com.cn/problem/P5021)     | 赛道修建            | 树形 DP, 二分答案                       |
| [P7727](https://www.luogu.com.cn/problem/P7727)              | 风暴之眼            | 树形 DP, 计数 DP                        |
| [P1850 NOIP2016](https://www.luogu.com.cn/problem/P1850)     | 换教室              | 期望 DP                                 |
| [P1941 NOIP2014](https://www.luogu.com.cn/problem/P1941)     | 飞扬的小鸟          | 前缀和优化 DP                           |
| [ARC068F](https://atcoder.jp/contests/arc068/tasks/arc068_d) | Solitaire           | 二维前缀和优化 DP, 计数 DP              |
| [P5664 CSP-S2019](https://www.luogu.com.cn/problem/P5664)    | Emiya 家今天的饭    | 计数 DP, 记录状态差降维技巧             |
| [ARC059F](https://atcoder.jp/contests/arc059/tasks/arc059_d) | Unhappy Hacking     | 计数 DP, 卡塔兰数                       |
| [P5307 COCI2019](https://www.luogu.com.cn/problem/P5307)     | Mobitel             | 计数 DP, 整除分块优化                   |
| [P4491 HAOI2018](https://www.luogu.com.cn/problem/P4491)     | 染色                | 计数 DP, 二项式反演, 数论变换, 减法卷积 |
| [P3188 HNOI2007](https://www.luogu.com.cn/problem/P3188)     | 梦幻岛宝珠          | 背包 DP, Lowbit 分治                    |
| [P6775 NOI2020](https://www.luogu.com.cn/problem/P6775)      | 制作菜品            | 背包 DP, bitset 优化, 贪心              |
| [P5454 THUPC2018](https://www.luogu.com.cn/problem/P5454)    | 城市地铁规划        | 背包 DP, 树的构造                       |
| [P4027 NOI2007](https://www.luogu.com.cn/problem/P4027)      | 货币兑换            | 斜率优化 DP, 面向数据编程               |
| [P2497 SDOI2012](https://www.luogu.com.cn/problem/P2497)     | 基站建设            | 斜率优化 DP                             |
| [P4383 EPOI2018](https://www.luogu.com.cn/problem/P4383)     | 林克卡特树          | 凸优化 DP, 树形 DP                      |
| [P4694 PA2013](https://www.luogu.com.cn/problem/P4694)       | Raper               | 凸优化 DP, 数据结构优化 DP              |
| [P6246 IOI2000](https://www.luogu.com.cn/problem/P6246)      | 邮局(加强版)        | 凸优化 DP, 决策单调性优化 DP            |
| [P2841](https://www.luogu.com.cn/problem/P2841)              | A*B Problem         | 高精度 DP                               |
| [CF1416E](https://codeforces.com/problemset/problem/1416/E)  | Split               | 数据结构优化 DP, WBLT, 文艺宗法树       |
| [CF506E](https://codeforces.com/problemset/problem/506/E)    | Mr. Kitayuta's Gift | 矩阵乘法优化 DP, 有限自动机, 自动机压缩 |

#### 数学

复习内容: 莫比乌斯反演, ExGCD

主要内容: 快速傅里叶变换, 数论变换, 多项式插值, 高斯消元, 行列式, 基尔霍夫定理, 杜教筛

次要内容: BSGS, ExBSGS, 矩阵求逆, Powerful Number 筛

| 出处                                                         | 题目             | 知识点                   |
| ------------------------------------------------------------ | ---------------- | ------------------------ |
| [P3803](https://www.luogu.com.cn/problem/P3803)              | 多项式乘法       | 快速傅里叶变换           |
| [P3338 ZJOI2014](https://www.luogu.com.cn/problem/P3338)     | 力               | 快速傅里叶变换, 减法卷积 |
| [P6091](https://www.luogu.com.cn/problem/P6091)              | 原根             | 判原根存在性, 求原根     |
| [P3803](https://www.luogu.com.cn/problem/P3803)              | 多项式乘法       | 数论变换                 |
| [P1919](https://www.luogu.com.cn/problem/P1919)              | A*B Problem      | 数论变换                 |
| [P4721](https://www.luogu.com.cn/problem/P4721)              | 分治 FFT         | 数论变换, 分治           |
| [P4717](https://www.luogu.com.cn/problem/P4717)              | 或, 与, 异或卷积 | 快速沃尔什变换           |
| [P3846 TJOI2007](https://www.luogu.com.cn/problem/P3846)     | BSGS             | BSGS                     |
| [P4195](https://www.luogu.com.cn/problem/P4195)              | ExBSGS           | ExBSGS                   |
| [P1516](https://www.luogu.com.cn/problem/P1516)              | 青蛙的约会       | ExGCD                    |
| [P1447 NOI2010](https://www.luogu.com.cn/problem/P1447)      | 能量采集         | 莫比乌斯反演             |
| [P1829](https://www.luogu.com.cn/problem/P1829)              | Crash的数字表格  | 莫比乌斯反演, 整除分块   |
| [P3327 SDOI2015](https://www.luogu.com.cn/problem/P3327)     | 约数个数和       | 莫比乌斯反演, 整除分块   |
| [P3389](https://www.luogu.com.cn/problem/P3389)              | 高斯消元         | 高斯消元                 |
| [P7112](https://www.luogu.com.cn/problem/P7112)              | 行列式           | 高斯消元, 辗转相减法     |
| [P4783](https://www.luogu.com.cn/problem/P4783)              | 矩阵求逆         | 高斯消元                 |
| [P6178](https://www.luogu.com.cn/problem/P6178)              | Matrix-Tree 定理 | 基尔霍夫定理, 行列式     |
| [P3812](https://www.luogu.com.cn/problem/P3812)              | 线性基           | 线性基                   |
| [BZOJ4184](https://hydro.ac/d/bzoj/p/4184)                   | Shallot          | 线性基删除               |
| [ABC223H](https://atcoder.jp/contests/abc223/tasks/abc223_h) | Xor Query        | 线性基                   |
| [P4781](https://www.luogu.com.cn/problem/P4781)              | 拉格朗日插值     | 多项式插值               |
| [P5667](https://www.luogu.com.cn/problem/P5667)              | 拉格朗日插值2    | 多项式插值, 数论变换     |
| [P4213](https://www.luogu.com.cn/problem/P4213)              | 杜教筛           | 杜教筛                   |
| [P3768](https://www.luogu.com.cn/problem/P3768)              | 简单的数学题     | 杜教筛, 莫比乌斯反演     |
| [P5325](https://www.luogu.com.cn/problem/P5325)              | Min_25 筛        | Powerful Number 筛       |
| [THUPC2019 P5377](https://www.luogu.com.cn/problem/P5377)    | 鸽鸽的分割       | 欧拉-笛卡尔公式          |
| [THUPC2019 P5376](https://www.luogu.com.cn/problem/P5377)    | 过河卒二         | 卢卡斯定理, 容斥         |

#### 数据结构

- 复习内容: 左偏树, LCT

- 主要内容: 李超树, 整体二分

- 次要内容: 珂朵莉树, zkw 线段树, 析合树, 笛卡尔树

- 学有余力内容: k-D Tree, Top Tree

| 出处                                                            | 题目                           | 知识点                                                 |
| --------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| [P4515 COCI2009-2010](https://www.luogu.com.cn/problem/P4515)   | XOR                            | 扫描线                                                 |
| [P4560 IOI2014](https://www.luogu.com.cn/problem/P4560)         | Wall                           | 线段树                                                 |
| [P3688 ZJOI2017](https://www.luogu.com.cn/problem/P3688)        | 树状数组                       | 线段树套线段树                                         |
| [P4899 IOI2018](https://www.luogu.com.cn/problem/P4899)         | Werewolf                       | Kruskal 重构树, 可持久化权值线段树                     |
| [P4097 HEOI2013](https://www.luogu.com.cn/problem/P4097)        | Segment                        | 李超线段树                                             |
| [P4254 JSOI2008](https://www.luogu.com.cn/problem/P4254)        | Blue Mary开公司                | 李超线段树                                             |
| [P3527 POI2011 SP10264](https://www.luogu.com.cn/problem/P3527) | Meteors                        | 整体二分, 主席树, 树状数组, 差分                       |
| [SDOI2013 P3302](https://www.luogu.com.cn/problem/P3302)        | 森林                           | 树上差分, 可持久化权值线段树, 线段树上二分, 启发式合并 |
| [P1527 国家集训队](https://www.luogu.com.cn/problem/P1527)      | 矩阵乘法                       | 整体二分                                               |
| [P5048 Ynoi2019](https://www.luogu.com.cn/problem/P5048)        | Yuno loves sqrt technology III | 分块                                                   |
| [P8120 RdOIr3.5](https://www.luogu.com.cn/problem/P8120)        | RMSQ                           | 分块, 数组回滚                                         |
| [WC2022 P8078](https://www.luogu.com.cn/problem/P8078)          | 秃子酋长                       | 回滚莫队, 链表, 卡常                                   |
| [P5586 P5350](https://www.luogu.com.cn/problem/P5586)           | 序列                           | 东周平衡树                                             |
| [CQOI2011 P3157](https://www.luogu.com.cn/problem/P3157)        | 动态逆序对                     | 线段树套平衡树, Splay                                  |

#### 图论

- 主要内容: 虚树, 点分治

| 出处                                            | 题目       | 知识点                   |
| ----------------------------------------------- | ---------- | ------------------------ |
| [P3806](https://www.luogu.com.cn/problem/P3806) | 点分治     | 点分治                   |
| [P3806](https://www.luogu.com.cn/problem/P5236) | 静态仙人掌 | 仙人掌, 圆方树, 树链剖分 |

### 中二期

模拟赛.

## 后期(如果有的话)

后期 (省选-NOI), 大致从四月到七月. 以打为主, 