# NOIP2021-数列

显然是个 DP 题，这个题 $O(n^3mk)$ 做法是不是垫底了啊。

## 状态设计

首先发现这个序列的元素的顺序不会影响权值和 $S$ 值，所以我们可以使序列为空，然后将值填入序列，计算对权值和 $S$ 的贡献，对这个过程进行 DP。

因为对于等于 $i - 1$ 的 $a$，它可以影响 $S$ 的第 $i$ 位及其后面的位，所以我们从小往大讨论 $a$ 的值。以它作为阶段从小往大考虑，可以避免后效性。

因为确定了小于 $i$ 的所有 $a$ 后，可以确定 $S$ 前 $i$ 位的情况，所以我们对于填完小于 $i$ 的值的状态只需要记录 $S$ 前 $i$ 位的 $1$ 的数量，可以忽略具体哪些位是 $1$。

当然，小于 $i$ 的 $a$ 对第 $i$ 位后面的位置是有影响的，所以我们记录一维状态表示当前的 $\lfloor \frac{S}{2^i} \rfloor$。

现在还有一个状态被忽略了，也就是当前序列已经有多少位置不是空位，这个状态让我们知道有多少空位可以赋值。

设计 $f_{i, j, k, l}$ 表示已经填了小于 $i$ 的所有 $a$ 值，总计 $j$ 个，$S$ 的前 $i$ 位有 $k$ 个 $1$，$\lfloor \frac{S}{2^i} \rfloor = l$。

## 转移

先写方程:

$$
f_{i, j, k, \lfloor\frac{x + y}2\rfloor} = \sum \binom{n - j + x}{x} f_{i - 1, j - x, k - (x + y) \bmod 2, y} \cdot a^{x}
$$

可以发现这里目标状态只枚举了 $i$，$j$，$k$ 三维，剩下一维是由转移所枚举的 $x$，$y$ 决定的。我不知道如何定义每个状态的转移复杂度，但是总复杂度一定是枚举的这五个变量的范围之积。

接下来解释这个转移，$x$ 枚举的是数字 $i$ 选择的数量，$y$ 枚举的是起始状态进位到 $i$ 的数字，所以可以当作是在 $x$ 的基础上，额外选择了 $y$ 个 $i$，但是不花费空位，也不消耗权值，仅对 $S$ 产生影响。

这样前面的二项式系数的意义就很显然了，我们起始状态有 $n - j + x$ 个空位，我们从中选择 $x$ 个填上 $i$ 的方案数就是 $\binom{n - j + x}{x}$。

$a^x$ 表示原来每个方案的基础上加 $x$ 个 $i$，都会使方案的权值乘 $a^x$。

$\lfloor\frac{x + y}2\rfloor$ 表示的是本次填入 $i - 1$ 对 $S$ 贡献的 $x2^{i - 1}$ 和原来已经存在的 $y2^{i - 1}$，它们的和除以 $2^i$ 的结果，也就是 $\lfloor \frac{S}{2^i} \rfloor$。

$(x + y) \And 1$ 的意义是填入和合并得到的 $i - 1$，对 $S$ 中前 $i$ 位 $1$ 的数量的贡献，显然，如果 $x + y$ 是奇数，就会使得 $S$ 的第 $i$ 位是 $1$。

## 代码

> 代码是考场代码增删注释得到的，所以码风保守。

为了防止变量名冲突，上面提到的 $x$，$y$ 在代码中分别写成 $jj$ 和 $ll$，题目中的 $k$ 用 $t$ 来代替。

为了防止数组越界，$f_{i}$ 表示第 $i - 1$ 个阶段的 DP 值，也就是填了数字 $i - 1$ 的 DP 值。因此需要在输入时把 $m$ 变成 $m + 1$。

```cpp
const unsigned long long Mod(998244353);
unsigned long long Ans(0), C[35][35], a[105][35];
unsigned f[105][35][35][35], Pop[105];
unsigned n, m, t;
unsigned A, B;
unsigned Cnt(0);
signed main() {
  n = RD(), m = RD() + 1, t = RD();
  for (unsigned i(1); i <= m; ++i) {
    a[i][0] = 1, a[i][1] = RD();
    for (unsigned j(2); j <= n; ++j)
      a[i][j] = a[i][j - 1] * a[i][1] % Mod;//预处理每个值有不同个数的权值 (也就是预处理 a 的幂)
  }
  for (unsigned i(1); i <= 102; ++i) Pop[i] = Pop[i >> 1] + (i & 1);//预处理 Popcount
  C[0][0] = 1;
  for (unsigned i(1); i <= n; ++i) {
    C[i][0] = 1;
    for (unsigned j(1); j <= n; ++j) {
      C[i][j] = C[i - 1][j] + C[i - 1][j - 1];//预处理二项式系数
      if(C[i][j] >= Mod) C[i][j] -= Mod;
    }
  }
  for (unsigned i(0); i <= m; ++i) f[i][0][0][0] = 1;//初始化
  for (unsigned i(1); i <= m; ++i) {
    for (unsigned j(1); j <= n; ++j) {
      for (unsigned k(0); k <= t; ++k) {
        for (unsigned jj(0); jj <= j; ++jj) {
          for (unsigned ll(0); ll <= n; ++ll) {
            if((ll + jj) & 1) {
              if(!k) continue;//防止越界
              f[i][j][k][(ll + jj) >> 1] = ((f[i][j][k][(ll + jj) >> 1] + (f[i - 1][j - jj][k - 1][ll] * C[n - j + jj][jj] % Mod) * a[i][jj]) % Mod);
            } else {
              f[i][j][k][(ll + jj) >> 1] = ((f[i][j][k][(ll + jj) >> 1] + (f[i - 1][j - jj][k][ll] * C[n - j + jj][jj] % Mod) * a[i][jj]) % Mod);
            }
          }
        }
      }
    } 
  }
  for (unsigned i(0); i <= t; ++i) {
    for (unsigned j(0); j <= n; ++j) {
      if(Pop[j] + i <= t) {//第 n 位后面的 1 的数量和前 n 位的 1 的数量和
        Ans += f[m][n][i][j];//统计答案
        if(Ans >= Mod) Ans -= Mod;
      }
    }
  }
  printf("%u\n", Ans);
  return 0;
}
```