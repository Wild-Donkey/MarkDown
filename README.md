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

  数据结构: 跳跃表, 斐波那契堆, 二项堆, 红黑树, AVL, FHQ, SBT, 珂朵莉树, zkw线段树, 笛卡尔树, 李超线段树, 树上启发式合并, 点分治, 析合树, 哈夫曼树
  
  字符串: 最小表示, Lyndon 分解, EXKMP, Boyer-Moore 算法, DFA, NFA

  网络流: 上下界最大流, 可行流, 最小费用可行流, 最短路增广费用流

  泛图论: $k$ 短路, 二分图最佳带权匹配, 双连通分量, 求 LCA 的 Tarjan, 一般图匹配, 支配集, 独立集, 覆盖集, 斯坦纳树, 虚树, 矩阵树定理, 最小树形图, 圆方树, Prufer 序列, LGV 引理, 弦图

  生成树: 次小生成树, 最短路径生成树, 最小直径生成树, 最优比率生成树
  
  最短路: 乘积最短路, 加和最短路, 同余最短路, 差分约束, 负环 (SPFA)
  
  动态规划: 动态动态规划 (DDP), 插头 DP, WQS 优化, CDQ 分治优化 (DP重在练习).

| 出处                                              | 题目       | 知识点                     |
| ------------------------------------------------- | ---------- | -------------------------- |
| [P3378](https://www.luogu.com.cn/problem/P3378)   | 堆         | 动态开点堆                 |
| [P7361](https://www.luogu.com.cn/problem/P7361)   | 春节十二响 | 树上启发式合并, 动态开点堆 |
| [P4158](https://www.luogu.com.cn/problem/P4158)   | 粉刷匠     | DP (背包问题), 双层 DP     |
| [SP9070](https://www.luogu.com.cn/problem/SP9070) | 避雷针     | 决策单调性, 分治优化 DP    |
| [P4051](https://www.luogu.com.cn/problem/P4051)   | 字符加密   | SA-IS, 后缀数组            |
| [P5490](https://www.luogu.com.cn/problem/P5490)   | 矩形的并   | 扫描线, 标记永久化线段树   |
| [P1772](https://www.luogu.com.cn/problem/P1772)   | 物流运输   | Dijkstra, 状压 DP          |


* 八月: 数学
  
  杂项: 容斥原理, 生成函数 (数学), 线性规划, 熵, 莫比乌斯变换, $0/1$ 分数规划
  
  博弈论: Nim, SG

  多项式相关: 快速傅里叶变换(FFT), 快速数论变换(NTT), 快速沃尔什变换(FWT), 拉格朗日插值, 多项式除法, 多项式求逆, 多项式开根, 多项式求对数, 多项式快速幂, 多项式指数函数
  
  组合数学: 母函数, 可重集, 错/圆排列, 卡特兰数, 斯特林数
  
  群论: 置换群/循环群, Burnside, Polya
  
  高等数学: 牛顿迭代, 数列, 泰勒级数, 卷积, 导数, 积分
  
  计算几何: 半平面交, 凸包, 旋转卡壳, 矢量
  
  数论: 莫比乌斯函数, 完全数, BSGS, 原根, 筛法(杜教筛, Min_25筛, 洲阁筛), 反演相关(多项式反演, 莫比乌斯反演等), 素数, 整除与同余, 中国剩余定理 (CRT), 狄利克雷卷积, 威尔逊定理, 平方剩余, 二次同余式, 二次互反律
  
  线性代数: 矩阵的逆运算, 行列式, 线性基, 线性方程组的高斯消元
  
  概率论: 贝叶斯公式, 全概率公式, 乘法公式.

## 中期(如果有的话)

中期 (NOIp-省选), 大概从十一月到四月, 包括NOIp, WC, 省选三个时间节点, 对前面所学内容进行集中刷题巩固.

## 后期(如果有的话)

后期 (省选-NOI), 大致从四月到七月, 这段时间, 会有一些国际性比赛, 如: APIO, THU-PC, IOI, USACO 等, 加以各大网站的网赛练习, 充分练习比赛技巧.