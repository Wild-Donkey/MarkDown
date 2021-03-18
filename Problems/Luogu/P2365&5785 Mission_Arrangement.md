# Luogu2365&5785 任务安排

斜率优化模板题,  是 `算法竞赛进阶指南-李煜东` 的斜率优化例题, 关于斜率优化的内容, 可以在这里找到

> [斜率优化](https://www.luogu.com.cn/blog/Wild-Donkey/xie-shuai-you-hua-convex-hull-optimisation)

> [题目直通车](https://www.luogu.com.cn/problem/P2365)

> [加强版](https://www.luogu.com.cn/problem/P5785)

## 概括

$n$ 个任务, 任务 $i$ 有两个属性时间 $T_i$, 费用系数 $C_i$, 分批加工, 每批任务是连续的一段区间

每批任务需要经过 $\sum_i^{任务 i 在这一批} T_i$ 时间后, 本批任务同时完成. 两批任务之间有 $S$ 时间空闲, 每个任务花费和完成的时刻 $Clock_i$ 有关, 为 $C_iClock$

试求完成所有任务的最小花费

$1 \leq n \leq 5000，0 \leq s \leq 50，1 \leq t_i ,f_i \leq 100$

## 推导

设计状态, $f_i$ 表示完成前 $i$ 个任务的花费和这 $i$ 个任务的完成对后面任务花费的贡献.

用 $SumC_i$ 和 $SumT_i$ 表示 $C_i$, $T_i$, 的前缀和

写出方程, 前 $j$ 个的花费 + 第 $j + 1$ 到第 $i$ 个的花费 + $S$ 对第 $i + 1$ 个及之后的贡献.


$$
f_i = min(f_j + (SumC_i - SumC_j)SumT_i + (SumC_n - SumC_i)S)
$$

整理得

$$
f_j = SumC_jSumT_i + f_i - SumC_i(SumT_i - S) - SumC_nS
$$

得到以 $SumC_j$ 为自变量, $f_j$ 为因变量, $SumT_i$ 为斜率, $f_i - SumC_i(SumT_i - S) - SumC_nS$ 为截距的函数

虽然本题不用斜优, $O(n^2)$ 能过, 但是既然能优化, 为什么不做到最快呢?~~为什么不复制加强版的代码呢~~

## 代码实现

```cpp
struct Ms {
  long long C, T, SumC, SumT, f;
}M[5005]; // 任务属性 
struct Hull {
  long long x, y;
  unsigned Ad;
}H[5005], *Now, Then; // 下凸壳 
unsigned n, l(1), r(1);
long long S, Cst; 
int main() {
  n = RD();
  S = RD();
  M[0].SumT = S;
  for (register unsigned i(1); i <= n; ++i) {
    M[i].T = RD();
    M[i].C = RD();
    M[i].SumT = M[i - 1].SumT + M[i].T;
    M[i].SumC = M[i - 1].SumC + M[i].C; //预处理 
  }
  Cst = S * M[n].SumC;  // 截距中的一项常数 
  for (register unsigned i(1); i <= n; ++i) {
    while (l < r && ((H[l + 1].y - H[l].y) < M[i].SumT * (H[l + 1].x - H[l].x))) {
      ++l; // 弹出过气决策点 
    }
    M[i].f = M[H[l].Ad].f + (M[i].SumC - M[H[l].Ad].SumC) * M[i].SumT + Cst - M[i].SumC * S; // 转移 
    Then.Ad = i;
    Then.x = M[i].SumC;
    Then.y = M[i].f;    // 求新点坐标 
    while (l < r && ((Then.y - H[r].y) * (H[r].x - H[r - 1].x) <= (H[r].y - H[r - 1].y) * (Then.x - H[r].x))) {
      --r; // 维护下凸 
    }
    H[++r] = Then;      // 入队 
  }
  printf("%lld\n", M[n].f);
  return Wild_Donkey;
}
```

## 加强版

$1 \leq n \leq 3*10^5, 1 \leq S \leq 256, |T_i| \leq 256, 0 \leq C_i \leq 256$

因为 $C_i \geq 0$, 所以 $SumC_i$ 单调, 但是 $SumT_i$ 不单调, 但是影响不大, 只影响决策时切线的斜率. 为了应对随机变化的切线斜率, 只要保存整个下凸壳, 在决策的时候二分查找即可, $O(n\log n)$, 其余部分完全一致 (注意有负数出现).

## 二分查找

```cpp
Hull *Binary (unsigned L, unsigned R, const long long &key) {
  if(L == R) {
    return H + L;
  }
  unsigned M((L + R) >> 1), M_ = M + 1;
  if((H[M_].y - H[M].y) < key * (H[M_].x - H[M].x)) {//Key too big 
    return Binary(M_, R, key);
  }
  return Binary(L, M, key);
}
```