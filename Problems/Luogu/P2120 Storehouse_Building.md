# P2120 仓库建设

又是[斜优](https://www.luogu.com.cn/blog/Wild-Donkey/xie-shuai-you-hua-convex-hull-optimisation), 这里是[直通车](https://www.luogu.com.cn/problem/P2120)

## 题意

$n$ 个工厂, 每个工厂有三个属性: 坐标 $x$, 物品数 $p$, 建设花费 $c$, 可以选若干工厂建仓库, 第 $i$ 个工厂的物品只能运往坐标大于等于它的位置仓库, 单个物品移动单位长度花费 $1$.

求存储所有货物的最小花费

$1 \leq n \leq 10^6, 0 \leq x, p, c \leq 2^{31}, ans + \sum p_ix_i < 2^{63}$

## 推导

设计 $f_i$ 表示在 $i$ 处设仓库 (不一定只在 $i$ 设), $[1, i]$ 所有货物被存储的最小花费

设 $p_i$, $p_ix_i$ 前缀和 $sump_i$, $sumpx_i$, 写出方程

$sumpx_i$ 的意义是将 $[1, i]$ 的所有物品移动到坐标 $0$ 的花费, 所以我们就可以将移动费用理解成先把需要移动到 $i$ 的物品移动到原点, 然后一起移动到 $i$ 工厂 

$$
f_i = min(f_j + c_i + (sump_i - sump_j)x_i - sumpx_i + sumpx_j)
$$

整理成函数

$$
f_j + sumpx_j = sump_jx_i + f_i + sumpx_i - sump_ix_i - c_i
$$

设 $sumpx_i - sump_ix_i - c_i = K_i$

$$
f_j + sumpx_j = sump_jx_i + f_i + K_i
$$

得到以 $sump_j$ 为自变量, $f_j + sumpx_j$ 为因变量, $x_i$ 为斜率, $f_i + K_i$ 为截距的函数

其中, 斜率 $x_i$ 单调, 自变量 $sump_i$ 单调, 因变量 $f_j + sumpx_j$ 单调, 直接用斜率优化

打出代码, 提交时是不开 `O2` 的[最快代码](https://www.luogu.com.cn/record/47963792) ($99ms$, 最优解第一页唯一没开 `O2` 的), 开 `O2` 的[最优解](https://www.luogu.com.cn/record/47963956) ($76ms$)

```cpp
struct Factory {
  long long x, p, c, sump, sumpx, K, f;
}F[1000005]; // 工厂属性 
struct Hull {
  long long x, y;
  unsigned Ad;
}H[1000005], Then;  // 凸壳 
unsigned a[10005], now, n, l(1), r(1);
bool b[10005];
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    F[i].x = RD();
    F[i].p = RD();
    F[i].c = RD();
    F[i].sump = F[i - 1].sump + F[i].p;
    F[i].sumpx = F[i - 1].sumpx + F[i].p * F[i].x;
    F[i].K = F[i].sumpx - F[i].sump * F[i].x - F[i].c;
  } // 各种预处理
  for (register unsigned i(1); i <= n; ++i) {
    while (l < r && ((H[l + 1].y - H[l].y) < (F[i].x) * (H[l + 1].x - H[l].x))) {
      ++l;  // 弹出无用节点 
    }
    now = H[l].Ad;
    F[i].f = F[now].f + F[i].c + (F[i].sump - F[now].sump) * F[i].x - F[i].sumpx + F[now].sumpx;  // 转移 
    Then.Ad = i;
    Then.x = F[i].sump;
    Then.y = F[i].f + F[i].sumpx;
    while (l < r && ((Then.y - H[r].y) * (H[r].x - H[r - 1].x) < (H[r].y - H[r - 1].y) * (Then.x - H[r].x))) {
      --r;  // 删除上凸节点 
    }
    H[++r] = Then;
  }
  printf("%lld\n", F[n].f);
  return Wild_Donkey;
}
```