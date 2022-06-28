# 分块的做法

分块是 CF 的[官方题解](https://codeforces.com/blog/entry/51685)的思路。虽说是 $O(n\sqrt q)$ 的复杂度，但是很显然 $10^5$ 就是分块的数据范围。

当然，这篇题解可能和官方题解有不同，但是基本思路和复杂度是一样的，请放心食用。

## 题意

一个坐标轴上，有若干线段，可以从每条线段的左端走到线段右端，也可以在坐标轴上沿负方向移动。保证每条线段右端点互不相同。

每次询问给一个区间 $[L, R]$，求以 $L$ 为起点，全程不离开区间 $[L, R]$ 所能到达的最右位置。

坐标轴长度 $n$，线段数 $m$，询问数 $q$ 均满足 $\leq 10^5$。

## 分析

因为线段的右端点互不相同，所以可以用一个数组 $From_i$ 存储点 $i$ 做右端点时，对应线段的左端点。

## 暴力

询问 $[L, R]$ 时，维护一个以 $L$ 为左端点的 “Available 区间” $[L, i]$，表示当前这个区间内的所有点都能到达。一开始，Available 区间是 $[L, L]$。

从 $L + 1$ 到 $R$ 枚举指针 $j$，当 $From_j \in [L, i]$ 时， 将 $i$ 变成 $j$，继续上面的操作。最终，当 $j$ 枚举到 $R$ 时，这时的 $i$ 就是本次询问的答案。

为什么这样维护 Available 序列是正确的？当 $From_j \in [L, i]$ 时，可以从 Available 区间中的某个点走到 $j$。而从 $j$ 又可以合法地走到 $i$ 和路上的所有点。

## 分块

对坐标分块，设块长 $BlockLen$，块数 $BlockNum$。

新建一个数组 $f_{i, j}$，表示以 $i$ 为起点，以第 $j$ 块结尾 ($jBlockLen$) 为终点的查询结果。

这样每次查询时，可以 $O(1)$ 得到 $j = kBlockLen$ 时的 Available 区间为 $[L, f_{L, kBlockLen}]$。$k$ 的选取满足 $kBlockLen < R\leq (k + 1)BlockLen$ 只需要 $O(BlockLen)$ 即可。询问总复杂度 $O(qBlockLen)$。

## 预处理

为了优化常数，我们 $O(n)$ 处理一个数组 $Block_i$，表示 $i$ 所在块的编号。

处理一个数组 $g_{i, j}$，表示以 $i$ 为左端，右端在 $j$ 块以内的最大的线段右端点。

求 $g_{i, j}$ 需要利用 $g_{i, j}$ 的单调性，我们知道对于 $j_1 < j_2$，一定有 $g_{i, j_1} \leq g_{i, j_2}$，所以每次输入一个线段 $(l, r)$ 时，赋值 $g_{l, Block_r} = max(g_{l, Block_r}, r)$。

最后，正序扫描一遍 $g$ 数组，使 $g_{i, j} = max(g_{i, j}, g_{i, j - 1})$ 即可，复杂度 $O(\frac{n^2}{BlockLen} + m)$。

对于 $f_{i, j}$，从大到小枚举 $i$，则对于 $k \in (i, n]$，$f_{k, j}$ 都是已知的。对于 $f_{i, j}$，分类讨论：

- $f_{i, j} = f_{k, j} (k \in (i, g_{i, j}])$

  因为这里的 $i$ 是递减枚举的，所以对于 $k_1 < k_2$，只要能取到 $k_2$，一定能取到 $k_1$，所以当 $f_{k_1, j} > f_{k_2, j}$ 时，$k_2$ 的存在不能使答案更优，弹出 $k_2$。

  这里可以用单调队列维护 $k$。保证队列中 $k$ 和 $f_{k, j}$ 单调递减。每一次求 $f_{i, j}$ 时，从队尾往前遍历队列，只要 $k \leq g_{i, j}$，就弹出这个 $k$，因为 $i < k$，且这时一定有 $f_{i, j} \geq f_{k, j}$。重复上面的操作直到 $k > g_{i, j}$。

  如果最后一个弹出的 $k$ 满足 $f_{k, j} > g_{i, j}$，则赋值 $f_{i, j} = f_{k, j}$。否则就是下面的情况。

- $f_{i, j} = g_{i, j}$

  如果弹出的 $k$ 满足 $f_{k, j} \leq g_{i, j}$，说明从 $i$ 直接走一条线段到达的点更优。所以赋值 $f_{i, j} = g_{i, j}$。

最后把 $i$ 插入队尾。

对于每个 $j$，复杂度是 $O(n)$，因为每个 $i$ 只入队一次。总复杂度 $O(\frac{n^2}{BlockLen})$。

算法复杂度是 $O(\frac{n^2}{BlockLen} + qBlockLen + m)$

## 块长

为了方便计算，因为 $m \leq n$，我们将线性的 $m$ 忽略，把复杂度当成 $O(\frac{n^2}{BlockLen} + qBlockLen)$ 来计算，发现当块长取 $\frac n{\sqrt{q}}$ 时达到分块理论最优复杂度 $n\sqrt q$。

## 代码

注意：省略了缺省源和快读 `RD()`。

```cpp
unsigned A[100005], B[100005], m, n, q, Ans(0), From[100005], f[100005][400], g[100005][400], BlockLen, BlockNum, Block[100405], Ql, Qr, Stack[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) { // 先读进来, 因为求块长需要用 q 
    A[i] = RD(), B[i] = RD();
  }
  q = RD();
  BlockLen = (n / (sqrt(q) + 1)) + 1;       // 理论最优块长 
  BlockNum = (n + BlockLen - 1) / BlockLen; // 块数 
  for (register unsigned i(1); i <= BlockNum; ++i) {
    for (register unsigned j(1); j <= BlockLen; ++j) {
      Block[(i - 1) * BlockLen + j] = i;    // O(n) 预处理 Block 数组 
    }
  }
  for (register unsigned i(1); i <= m; ++i) {
    g[A[i]][Block[B[i]]] = max(g[A[i]][Block[B[i]]], B[i]); // 更新 g[l][Block[r]]
    From[B[i]] = A[i];                                      // 存储 From[r] = l 
  }
  for (register unsigned i(1); i <= n; ++i) {
    g[i][Block[i]] = max(i, g[i][Block[i]]);
    for (register unsigned j(Block[i]); j <= BlockNum; ++j) {
      g[i][j] = max(g[i][j], g[i][j - 1]);                  // 扫一遍 g 数组, 通过单调性处理 g 
    }
  }
  for (register unsigned j(1), Ri; j <= BlockNum; ++j) {
    Ri = j * BlockLen;
    Ri = (Ri > n) ? n : Ri;                         // 终点的最大值 (第 j 块的右界)
    for (register unsigned i(Ri), Hd(0); i >= 1; --i) {
      while(Hd && Stack[Hd] <= g[i][j]) --Hd;       // 弹出队尾 
      if(Stack[Hd + 1] <= g[i][j]) {                // 这个 i 弹出了至少一次队尾 
        f[i][j] = max(f[Stack[Hd + 1]][j], g[i][j]);
      }
      else {                                        // 一次也没弹出 
        f[i][j] = g[i][j];
      }
      Stack[++Hd] = i;
    }
  }
  for (register unsigned i(1), j; i <= q; ++i) {  // 回答询问 
    Ql = RD(), Qr = RD();
    if(Block[Ql] ^ Block[Qr]) {                   // 左右端点在不同块内 
      Ans = f[Ql][Block[Qr] - 1];
      j = ((Block[Qr] - 1) * BlockLen) + 1;
    } else {                                      // 在同一块内 
      Ans = Ql;
      j = Ans + 1;
    }
    while (j <= Qr) {                             // 暴力最后不足一块的部分 
      if(Ql <= From[j] && From[j] <= Ans) {
        Ans = j;
      }
      ++j;
    }
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```