# CF883J Renovation

## 题意

共 $n$ 天，每天有 $a_i$ 经费。

有 $m$ 个房屋，每个房屋有属性 $b$，$p$。

第 $i$ 天可以拆除 $b < a_i$ 的房屋，每拆一座，会花费 $p$ 的经费。经费可以转结到下一天。

## 使 $a$ 单调

发现如果没有 $b$ 的限制，一定是第 $n$ 天统一拆除，因为将所有的经费留到第 $n$ 天，按 $p$ 从小到大拆一定能得到最优方案。

假设 $a_i < a_j$，$i < j$，在第 $i$ 天能拆的房子，在第 $j$ 天肯定能拆，所以对于这个 $i$，我们不用考虑它是否应该拆房子，只要将钱存起来就好了。

我们把可以考虑拆房子的天找出来，发现这些天 $i$ 必须满足不存在 $j > i$ 且 $a_j > a_i$。

可以从后往前 $O(n)$ 处理出这些天，存入数组 $Ava$ 中，称作 `工作日`。由于是倒着处理的，所以 $Ava_i$ 表示倒数第 $i$ 个工作日。

## 拆除

我们把所有房子按 $b$ 排序。

从前往后算，每个工作日可以拆除的房子越来越少，所以在每个工作日考虑过了今天就拆不了的房子，也就是满足 $a_{Ava_{i}} \geq b_j > a_{Ava_{i - 1}}$ 的房子 $j$。

按顺序将这些房子插入以 $p$ 为序的小根堆里，从小到大将能拆的拆掉。

每个工作日可以获得的经费是上个工作日到这个工作日之间的所有经费和当天的经费，即 $\displaystyle{\sum_{j = Ava_{i + 1} + 1}^{Ava_i}a_i}$。用前缀和可以 $O(1)$ 求出。

## 重建

发现如果按上面的算法，会在一些正确策略是前面故意攒钱到后面再花的数据中得到错误的答案。

假设还有一种操作，重建，每次重建会得到拆除它对应的经费。这个操作可以帮我们反悔。

每次拆除的时候，将拆掉的房子丢进按 $p$ 为序的大根堆，每次经费不足，但是重建一个房子再拆除不亏的时候(注意这很重要，只有 `重建 + 拆除` 两个操作结束后使经费增加才能使用)，重建获得经费最多的房子，拆除正在考虑的房子。

这样就能得到正确的答案了。

### 代码实现

```cpp
unsigned long long a[100005], Sum[100005], Now(0);
unsigned Ava[100005], Hd, m, n, Max(0), Cnt(0), Ans(0);
struct Bldi {
  unsigned long long b, p;
  inline const char operator < (const Bldi &x) const{
    return this->p > x.p; 
  } 
}B[100005];
inline char cmp (const Bldi &x, const Bldi &y) {
  return x.b < y.b;
}
priority_queue <Bldi> Q;
priority_queue <unsigned> BQ;
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = RD(), Sum[i] = Sum[i - 1] + a[i]; 
  for (register unsigned i(1); i <= m; ++i) B[i].b = RD();
  for (register unsigned i(1); i <= m; ++i) B[i].p = RD();
  sort(B + 1, B + m + 1, cmp);
  for (register unsigned i(n); i; --i) {
    if(a[i] > Max) {
      Ava[++Cnt] = i;
      Max = a[i];
    }
  }
  Ava[Cnt + 1] = 0;
  B[m + 1].p = 0x3f3f3f3f3f3f3f3f, Hd = m, Q.push(B[m + 1]);
  BQ.push(0);
  for (register unsigned i(Cnt); i; --i) {
    while (Hd && (B[Hd].b > a[Ava[i - 1]])) {
      Q.push(B[Hd--]);
    }
    Now += Sum[Ava[i]] - Sum[Ava[i + 1]];
    while ((Q.top().p <= Now) || (Q.top().p < BQ.top())) {
      if(Q.top().b > a[Ava[i]]) {
        Q.pop();
        continue;
      }
      if(Q.top().p > Now) {
        Now += BQ.top(), BQ.pop(), --Ans; 
      }
      ++Ans;
      Now -= Q.top().p;
      BQ.push(Q.top().p);
      Q.pop(); 
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```