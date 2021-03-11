# [P2119 魔法阵](https://www.luogu.com.cn/problem/P2119)

## 思考

1. 想到开桶($b[i]$)把 $40000$ 优化到 $15000$

2. 推式子得
$$
X_a<X_b<X_c<X_d\\
X_b-X_a=2(X_d-X_c)\\
X_b-X_a<(X_c-X_b)/3\\
\Downarrow\\
a = a\\
b = a + 2\Delta\\
c > a + 8\Delta\\
d > a + 9\Delta
$$

于是想到一个 $O(15000^3)$ 的算法, 各种压榨, `continue;` 爆改优化到 $90$ 分.

## $90$ 分 $O(15000^3)$ 代码

```cpp
int Ans[15005][4];
int a[40005], b[15005], n, m, mx(0);
int main() {
  n = RD();
  m = RD();
  memset(b, 0, sizeof(b));
  for (register int i(1); i <= m; ++i) {
    a[i] = RD();
    b[a[i]]++;
    mx = max(mx, a[i]);
  }
  for (register int i(1), Dlt; i + 9 < n; ++i) {
    if (!b[i]) {
      continue;
    }
    Dlt = (mx - i - 1) / 9;
    for (register int j(1), b_(i + 2), Tmp_1; j <= Dlt; ++j, b_ += 2) {
      if (!b[b_]) {
        continue;
      }
      Tmp_1 = b[b_] * b[i];
      for (register int k(i + (j << 3) + 1), d_(k + j), Tmp_2; d_ <= mx;
           ++k, ++d_) {
        if (!((b[k]) && (b[d_]))) {
          continue;
        }
        Tmp_2 = b[k] * b[d_];
        Ans[k][2] += Tmp_1 * b[d_];
        Ans[d_][3] += Tmp_1 * b[k];
        Ans[i][0] +=  Tmp_2 * b[b_];
        Ans[b_][1] +=  Tmp_2 * b[i];
      }
    }
  }
  for (register int i(1); i <= m; ++i) {
    printf("%d %d %d %d\n", Ans[a[i]][0], Ans[a[i]][1], Ans[a[i]][2],
           Ans[a[i]][3]);
  }
  return 0;
}
```

## 尝试优化(类离散化)

由于开了桶, 所以那些从来没出现过的位置可能会浪费掉, 所以思考用跳过空位的方式来优化, 但是由于不好调, 没有调出来, 而且研究大测试点后发现桶很密集, 很少有空位, 所以证明了这样优化只能徒增常数, 果断搁浅

$错误优化$
```cpp
int Ans[15005][4], a[40005], b[15005], n, m, mx(0), Nxt[15005], NxtO[15005], kk;
int main() {
  n = RD();
  m = RD();
  memset(b, 0, sizeof(b));
  for (register int i(1); i <= m; ++i) {
    a[i] = RD();
    b[a[i]]++;
    mx = max(mx, a[i]);
  }
  for (register int i(mx), tmp(mx), tmpj(-1), tmpo(-1); i >= 1; --i) {
    if (b[i]) {
      Nxt[i] = tmp;
      if (i % 2) {
        NxtO[i] = tmpj;
        tmpj = i;
      } else {
        NxtO[i] = tmpo;
        tmpo = i;
      }
      tmp = i;
    }
  }
  for (register int i(1), j, b_, Dlt, Tmp_1; i + 9 < mx; i = Nxt[i]) {
    Dlt = (mx - i - 1) / 9;
    b_ = NxtO[i];
    while (1) {
      if (b_ < 0) {
        break;
      }
      if (b_ > (Dlt << 1) + i) {
        break;
      }
      Tmp_1 = b[b_] * b[i];
      kk = i + (j << 3) + 1;
      while (kk < mx) {
        if (Nxt[kk]) {
          break;
        }
        ++kk;
      }
      for (register int k(kk), d_(k + j), Tmp_2; d_ < mx; k = Nxt[k]) {
        d_ = k + j;
        if (!b[d_]) {
          continue;
        }
        Tmp_2 = b[k] * b[d_];
        Ans[k][2] += Tmp_1 * b[d_];
        Ans[d_][3] += Tmp_1 * b[k];
        Ans[i][0] += Tmp_2 * b[b_];
        Ans[b_][1] += Tmp_2 * b[i];
      }
      b_ = NxtO[b_];
      j = (b_ - i) >> 1;
    }
  }
  for (register int i(1); i <= m; ++i) {
    printf("%d %d %d %d\n", Ans[a[i]][0], Ans[a[i]][1], Ans[a[i]][2],
           Ans[a[i]][3]);
  }
  return 0;
}
```

## 最后的优化 $O(15000^2)$

这次从中间的不等式入手, 发现 $\Delta$ 一定时, $A-B$, $C-D$, 成为两个滑动线段, 可以用前缀和优化.

求一半答案 (定义一个$O(15000^2 / 9)$ 的数组Half-ans, $Hans[j][i]$), 即只求线段的权值 (端点乘积), 用 $Hans[j][i]$ 存 $i$ 在 $\Delta = i$ 时, $C >= j$ 的所有 $C - D$
权值 $b[C] * b[D]$ 的总和, 或 $A <= j$ 的所有 $A - B$ 权值 $b[A] * b[B]$ 的总和.

$Hans[j][i]$可以 $O(15000 ^ 2)$ 求出.

举个例子, 一个数 $j$ 在 $\Delta = i$ 时做 $A$, 这时 $B = j + i * 2$, $C > j + i * 8$

$j$ 做 $A$ 的情况总和就加上:

$$ 
b[(i << 1) + j] * Hans[j + (i << 3) + 1][i]
$$

$j + i * 2$ 做 $B$ 的情况总和就加上:

$$
b[j] * Hans[j + (i << 3) + 1][i]
$$

反过来一个数求做 $C$, $D$ 的可能性也一样, 只是重新定义 $Hans[j][i]$ 的意义, 并且递推就好了.


**AC 代码**
```cpp
int Ans[15005][4], a[40005], b[15005], n, m, mx(0), Hans[15005][1670];
int main() {
  long long ti(clock());
  n = RD();
  m = RD();
  memset(b, 0, sizeof(b));
  for (register int i(1); i <= m; ++i) {
    a[i] = RD();
    b[a[i]]++;
    mx = max(mx, a[i]);
  }
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    for (register int j(mx - i), d_(i + j); j > 1 + (i << 3); --j, --d_) {
      Hans[j][i] = Hans[j + 1][i] + b[j] * b[d_];
    }
  }
  for (register int i(1), b_, Dlt, Tmp_1; i + 9 < mx; ++i) {
    Dlt = mx - i;
    if (!b[i]) {
      continue;
    }
    for (register int j(1), b_, c_; j * 9 < Dlt; ++j) {
      b_ = i + (j << 1);
      if (!b[b_]) {
        continue;
      }
      c_ = i + (j << 3) + 1;
      Ans[i][0] += b[b_] * Hans[c_][j];
      Ans[b_][1] += b[i] * Hans[c_][j];
    }
  }
  memset(Hans, 0, sizeof(Hans));
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    for (register int j(1), b_((i << 1) + j); j + (i * 9) < mx; ++j, ++b_) {
      Hans[j][i] = Hans[j - 1][i] + b[j] * b[b_];
    }
    for (register int j(mx), c_(j - i), a_; j > (i * 9); --j, --c_) {
      if (!(b[j] && b[c_])) {
        continue;
      }
      a_ = c_ - (i << 3) - 1;
      Ans[c_][2] += b[j] * Hans[a_][i];
      Ans[j][3] += b[c_] * Hans[a_][i];
    }
  } 
  for (register int i(1); i <= m; ++i) {
    printf("%d %d %d %d\n", Ans[a[i]][0], Ans[a[i]][1], Ans[a[i]][2],
           Ans[a[i]][3]);
  }
  return 0;
}
```
---

**你以为就这样就结束了?**

## O(15000) 空间优化

由于对于 $\Delta$ 一定的情况下, 只使用$i = \Delta$ 的 $Hans[j][i]$, 优化掉一维.

**空间 O(15000) 优化**
```cpp
int Ans[15005][4], a[40005], b[15005], n, m, mx(0), Hans[15005];
int main() {
  long long ti(clock());
  n = RD();
  m = RD();
  memset(b, 0, sizeof(b));
  for (register int i(1); i <= m; ++i) {
    a[i] = RD();
    b[a[i]]++;
    mx = max(mx, a[i]);
  }
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    Hans[mx - i + 1] = 0;
    for (register int j(mx - i), d_(i + j); j > 1 + (i << 3); --j, --d_) {
      Hans[j] = Hans[j + 1] + b[j] * b[d_];
    }
    for (register int j(1), b_(j + (i << 1)), c_(2 + (i << 3)); c_ + i <= mx;
         ++j, ++b_, ++c_) {
      if (!(b[b_] && b[j])) {
        continue;
      }
      Ans[j][0] += b[b_] * Hans[c_];
      Ans[b_][1] += b[j] * Hans[c_];
    }
  }
  memset(Hans, 0, sizeof(Hans));
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    for (register int j(1), b_((i << 1) + j); j + (i * 9) < mx; ++j, ++b_) {
      Hans[j] = Hans[j - 1] + b[j] * b[b_];
    }
    for (register int j(mx), c_(j - i), a_; j > (i * 9); --j, --c_) {
      if (!(b[j] && b[c_])) {
        continue;
      }
      a_ = c_ - (i << 3) - 1;
      Ans[c_][2] += b[j] * Hans[a_];
      Ans[j][3] += b[c_] * Hans[a_];
    }
  }
  for (register int i(1); i <= m; ++i) {
    printf("%d %d %d %d\n", Ans[a[i]][0], Ans[a[i]][1], Ans[a[i]][2],
           Ans[a[i]][3]);
  }
  return 0;
}
```

使我万万没想到的是, 不光空间变成了原来的 $1\%$, 连时间也成了原来的 $25\%$

---
**优化远远没有结束**

## 最后的优化

由于一个前缀和只会被调用一次, 大胆取消前缀和数组, 并且将二级两个循环合并成一个.

并且在细节处进行压榨, 如循环控制等.

```cpp
int Ans[15005][4], a[40005], b[15005], n, m, mx(0), Hans;
int main() {
  n = RD();
  m = RD();
  memset(b, 0, sizeof(b));
  for (register int i(1); i <= m; ++i) {
    a[i] = RD();
    b[a[i]]++;
    mx = max(mx, a[i]);
  }
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    Hans = 0;
    for (register int j(mx - i), a_(j - (i << 3) - 1), b_(a_ + (i << 1)); a_;
         --j, --a_, --b_) {
      Hans += b[j] * b[j + i];
      if (!(b[b_] && b[a_])) {
        continue;
      }
      Ans[a_][0] += b[b_] * Hans;
      Ans[b_][1] += b[a_] * Hans;
    }
  }
  for (register int i(1); (i * 9) + 1 < mx; ++i) {
    Hans = 0;
    for (register int j(1), c_(j + (i << 3) + 1), d_(c_ + i); d_ <= mx;
         ++j, ++c_, ++d_) {
      Hans += b[j] * b[j + (i << 1)];
      if (!(b[d_] && b[c_])) {
        continue;
      }
      Ans[c_][2] += b[d_] * Hans;
      Ans[d_][3] += b[c_] * Hans;
    }
  }
  for (register int i(1); i <= m; ++i) {
    printf("%d %d %d %d\n", Ans[a[i]][0], Ans[a[i]][1], Ans[a[i]][2],
           Ans[a[i]][3]);
  }
  return 0;
}
```

## 总结

最后开$O(2)$总算是以约 $1MB$ 内存, $100ms$ 虐杀了这道困扰我二十多天的题.

从 $2020.10.29$ 开始提交到现在, 一共提交了 $12$ 份代码. $CE$, $CE$, $85$, $10$, $90$, $10$, $90$, $10$, $100$, $100$, $100$, $100$.

都说行百里者半九十, 我做这道题的第二天就写出了 $90$ 分, 第 $25$ 天 $AC$. 这道题可谓行百里者 $5\%$ 九十. 不过以后要改一改一道题做一个月的习惯, 否则效率上不来.