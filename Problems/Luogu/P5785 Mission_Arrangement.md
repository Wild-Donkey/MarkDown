# Luogu5785 任务安排

斜率优化模板题,  是 `算法竞赛进阶指南-李煜东` 的斜率优化例题, 关于斜率优化的内容, 可以在这里找到

> [斜率优化](https://www.luogu.com.cn/blog/Wild-Donkey/xie-shuai-you-hua-convex-hull-optimisation)
>  [题目直通车](https://www.luogu.com.cn/problem/P5785)

## 概括

$n$ 个任务, 任务 $i$ 有两个属性时间 $T_i$, 费用系数 $C_i$, 分批加工, 每批任务是连续的一段区间

每批任务需要经过 $\sum_i^{任务 i 在这一批} T_i$ 时间后, 本批任务同时完成. 两批任务之间有 $S$ 时间空闲, 每个任务花费和完成的时刻 $Clock_i$ 有关, 为 $C_iClock$

试求完成所有任务的最小花费

$1 \leq n \leq 3*10^5, 1 \leq S \leq 256, |T_i| \leq 256, 0 \leq C_i \leq 256$

## 推导

设计状态, $f_i$ 表示完成前 $i$ 个任务的花费和这 $i$ 个任务的完成对后面任务花费的贡献.

用 $SumC_i$ 和 $SumT_i$ 表示 $C_i$, $T_i$, 的前缀和

写出方程

$$
f_i = min(f_j + (SumC_i - SumC_j)
$$

因为 $C_i \geq 0$, 所以 $SumC_i$ 单调, 但是 $SumT_i$ 不单调.