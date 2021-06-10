# Day8

## Color

这道题的优化是真的爽, 考场上的代码我存了 $6$ 个版本, 每个版本都有大改, 有时候能优化掉一个复杂度, 而且越快的版本貌似码量越少.

开始的开始, 写了二维的 DP, $f_{i, j}$ 表示第 $i$ 个格子是第 $j$ 个连续的白格子的方案数, 结果发现转移非常麻烦, 于是就弃了.

> color-40'.cpp

然后考虑用 $f_i$ 表示第 $i$ 个格子涂黑, $i + 1$ 到 $n$ 不涂黑的方案数, 写出方程:

$$
f_{i} = \sum_{j}^{j + k \leq i} f_{j}
$$

然后发现如果要得到正确的答案, $j$ 可能会出现负数, 因为 $f_{i \in [1, k]}$ 的答案要从 $f_{j\in[1 - k, 0]}$ 转移过来. 为了防止 `RE`, 只能把坐标向右平移 $k$.

对于每个 $k$ 都会进行一次 $O(n^2)$ 的 DP, 将询问离线, 按 $k$ 排序, $O(nlogn)$, 得到了 $f$ 数组.

对于点 $x$ 是不涂色的, 分两部分考虑, 枚举它左边的最近的黑点 $i$, 右边最近的黑点 $j$. 对于每对 $j - i \geq k$ 的点, 答案就是 $f_if_{n - j + 1}$, 不要忘了左边不涂, 右边不涂和左右都不涂的情况.

写了非常麻烦的版本, 标称 $40'$, 实测 $20'$, 因为有一半的点 `WA` 掉了, 应该是因为我的思路太繁杂, 有一点细节没有处理好.

总复杂度 $O(nlogn + n^2(k + m))$

```cpp
unsigned n, m, Ans(0), f[1005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return this->Quek < x.Quek;
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  }
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f));
        f[1] = 1;
      for (register unsigned i(Q[T].Quek); i <= n + Q[T].Quek; ++i) {
        for (register unsigned j(1); j <= i - Q[T].Quek; ++j) {
          f[i] += f[j];
          if(f[i] >= MOD) f[i] -= MOD;
        }
      }
    }
    register unsigned long long TmpA(1);
    for (register unsigned i(1 + Q[T].Quek); i <= n + Q[T].Quek - Q[T].Quex; ++i) {
      TmpA += f[i];
      if(TmpA >= MOD) TmpA -= MOD;
    }
    for (register unsigned i(1 + Q[T].Quek); i < Q[T].Quex + Q[T].Quek; ++i) {
      TmpA += f[i];
      if(TmpA >= MOD) TmpA -= MOD;
    }
    for (register unsigned i(1 + Q[T].Quek); i < Q[T].Quex + Q[T].Quek; ++i) {
      for (register unsigned j(1 + Q[T].Quek); j <= min(n + Q[T].Quek - Q[T].Quex, n + Q[T].Quek + 1 - i); ++j) {
        TmpA = (TmpA + (unsigned long long)f[i] * f[j]) % MOD;
      }
    }
    Q[Q[T].Num].Ans = TmpA;
  }
  for (register unsigned i(1); i <= m; ++i) {
    printf("%u\n", Q[i].Ans);
  }
  return 0;
}
```

> color-50'Ex.cpp

这个版本已经能过 `40'` 了, 显然我对我的时间复杂度没有准确的估计.

这个版本的更新是设 $Sum_i = \displaystyle{\sum_{j = 1}^{j < i}}$, 用前缀和优化将每次求 $f$ 的 DP 降到了 $O(n)$, $x$ 的左右不选情况降到了 $O(1)$, 单次询问降到了 $O(n)$, 所以时间复杂度来到了 $O(nlogn + n(k + m))$. 这是里程碑式的飞跃.

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  }
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f)), f[1] = 1, Sum[0] = 0;
      for (register unsigned i(Q[T].Quek), j(1), TmpFj(0); i <= n + Q[T].Quek; ++i) {
        while (j <= i - Q[T].Quek) {TmpFj += f[j], ++j; if(TmpFj >= MOD) TmpFj -= MOD;}
        f[i] += TmpFj; if(f[i] >= MOD) f[i] -= MOD;
      }
      for (register unsigned i(1); i <= n + Q[T].Quek; ++i) {Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    register unsigned long long TmpA(1);//都不选
    TmpA += Sum[n + Q[T].Quek - Q[T].Quex] - 1;
    if(TmpA >= MOD) TmpA -= MOD;
    TmpA += Sum[Q[T].Quex + Q[T].Quek - 1] - 1;
    if(TmpA >= MOD) TmpA -= MOD;
    for (register unsigned i(Q[T].Quex + Q[T].Quek - 1), TmpFj(0), j(1 + Q[T].Quek); i > Q[T].Quek; --i) {
      while (j <= min(n + Q[T].Quek - Q[T].Quex, n + Q[T].Quek + 1 - i)) {TmpFj += f[j],++j; if(TmpFj >= MOD) TmpFj -= MOD;}
      TmpA = (TmpA + (unsigned long long)f[i] * TmpFj) % MOD;
    }
    Q[Q[T].Num].Ans = TmpA;
  }
  for (register unsigned i(1); i <= m; ++i) {
    printf("%u\n", Q[i].Ans);
  }
  return 0;
}
```

> color-50'Ex_Pro.cpp

很遗憾, 这个版本还是 $40'$.

重新审视我们的转移方程:

$$
f_{i} = \sum_{j = 1}^{j + k \leq i} f_{j}
$$

我们发现, 因为 $f_{1 - k} = 1$, $f_{i \in (1 - k, 0]} = 0$. 那么对于 $i <= k$, 对它做出贡献的值只有 $f_{1 - k} = 1$ (下标是平移之前的, 可能有负数, 平移后不会越界). 这样就可以改一下方程, 让数组下标从 $1$ 开始, 无需平移. 

$$
f_{i} = 1 + \sum_{j = 1}^{j \leq \max(i - k, 1)} f_{j}
$$

方程的正确性是这样保证的: 原来的 $f_{1 - k} = 1$ 所转移的情况是除了 $i$ 点涂黑, 其它的点都留白的情况. 对于 $f_{i\in[1, n]}$, 显然这种情况都存在, 所以就拿出来当一个边界条件讨论, 避免了更多的转移.

所以这次更新是对代码难度的更新, 之前总是算下标恶心死人.

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek > x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  }
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f)), Sum[0] = 0;
      for (register unsigned i(1), j(1), TmpFj(1); i <= n; ++i) {
        while (j + Q[T].Quek <= i) {TmpFj += f[j], ++j; if(TmpFj >= MOD) TmpFj -= MOD;}
        f[i] = TmpFj;
      }
      for (register unsigned i(1); i <= n; ++i) {Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    register unsigned long long TmpA(1);//都不选
    TmpA += Sum[n - Q[T].Quex];//不选左 
    if(TmpA >= MOD) TmpA -= MOD;
    TmpA += Sum[Q[T].Quex - 1];//不选右 
    if(TmpA >= MOD) TmpA -= MOD;
    for (register unsigned i(Q[T].Quex - 1), j(1), AddDown; i; --i) {
      AddDown = n - max(Q[T].Quex, i + Q[T].Quek - 1);
      if(AddDown > 0x3f3f3f3f) {AddDown = 0;}
      TmpA = (TmpA + (unsigned long long)f[i] * Sum[AddDown]) % MOD;
    }
    Q[Q[T].Num].Ans = TmpA;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```

> color-50'Ex_Pro_Max.cpp

这个版本无愧它 `Pro Max` 的称号, 得了 $60'$, 这是因为对求答案时的部分进行了剪枝, 因为有时候, 对于 $i + k <= x$, $j$ 可以随便选, 不用枚举, 可以前缀和优化掉, 对于 $x > k$ 的情况, $i \in [1, x - k]$ 也可以随便选, 可以优化, 所以询问复杂度变成 $O(n - 2k)$, 相当于优化了很大的常数.

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  }
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f)), Sum[0] = 0;
      for (register unsigned i(1), j(1), TmpFj(1); i <= n; ++i) {
        while (j + Q[T].Quek <= i) {TmpFj += f[j], ++j; if(TmpFj >= MOD) TmpFj -= MOD;}
        f[i] = TmpFj;
      }
      for (register unsigned i(1); i <= n; ++i) {Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    register unsigned long long TmpA(1);//都不选
    TmpA += Sum[n - Q[T].Quex];//不选左 
    if(TmpA >= MOD) TmpA -= MOD;
    TmpA += Sum[Q[T].Quex - 1];//不选右 
    if(TmpA >= MOD) TmpA -= MOD;
    if(Q[T].Quex + 1 > Q[T].Quek) {
      if(Q[T].Quek < 2) TmpA = (TmpA + (unsigned long long)Sum[Q[T].Quex - 1] * Sum[n - Q[T].Quex]) % MOD;
      else {
        TmpA = (TmpA + (unsigned long long)(Sum[Q[T].Quex - Q[T].Quek + 1]) * Sum[n - Q[T].Quex]) % MOD;
        for (register unsigned i(Q[T].Quex - 1), AddDown; i > Q[T].Quex - Q[T].Quek + 1; --i) {
          AddDown = n + 1 - i - Q[T].Quek;
          if(AddDown > 0x3f3f3f3f) AddDown = 0;
          TmpA = (TmpA + (unsigned long long)f[i] * Sum[AddDown]) % MOD;
        }
      }
    } else {
      for (register unsigned i(Q[T].Quex - 1), AddDown; i; --i) {
        AddDown = n - max(Q[T].Quex, i + Q[T].Quek - 1);
        if(AddDown > 0x3f3f3f3f) AddDown = 0;
        TmpA = (TmpA + (unsigned long long)f[i] * Sum[AddDown]) % MOD;
      }
    }
    Q[Q[T].Num].Ans = TmpA;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```

> color-70'Ex_Pro_Max_Ti.cpp

这个 `70'` 非常的丢人, 因为它只有 $60'$.

优化力度不大, 代码方面减少了讨论, 将两种情况合为一种, 因为两种唯一的区别是枚举 $i$ 的上界. 时间方面只是剪枝了一下, 利用了求答案时利用下标 $AddDown$ 的单调性, 实现了 $AddDown = 0$ 的情况自动跳过, 也体现在 $i$ 的枚举上界上, 询问的复杂度变得十分玄学 $O(k)$ or $O(x)$ or $O(n - x)$ or $O(n - k)$... 但是它短呀!

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i) Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f)), Sum[0] = 0;
      for (register unsigned i(1), j(1), TmpFj(1); i <= n; ++i) {
        while (j + Q[T].Quek <= i) {TmpFj += f[j], ++j; if(TmpFj >= MOD) TmpFj -= MOD;}
        f[i] = TmpFj;
      }
      for (register unsigned i(1); i <= n; ++i) {Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    register unsigned long long TmpA(1);//都不选
    register unsigned Flor(min(Q[T].Quex - 1, n + 1 - Q[T].Quek)), Ceil(0);
    TmpA += Sum[n - Q[T].Quex];//不选左 
    if(TmpA >= MOD) TmpA -= MOD;
    TmpA += Sum[Q[T].Quex - 1];//不选右 
    if(TmpA >= MOD) TmpA -= MOD;
    if(Q[T].Quex + 1 > Q[T].Quek)
      Ceil = Q[T].Quex - Q[T].Quek + 1, TmpA = (TmpA + (unsigned long long)Sum[Q[T].Quex - max(Q[T].Quek - 1, _1)] * Sum[n - Q[T].Quex]) % MOD;
    for (register unsigned i(Flor), AddDown(n + 1 - i - Q[T].Quek); i > Ceil; --i, ++AddDown) TmpA = (TmpA + (unsigned long long)f[i] * Sum[AddDown]) % MOD;
    Q[Q[T].Num].Ans = TmpA;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```

> color-70'Ex_Pro_Max_Ti_X.cpp

重新审视这个询问的过程, 发现所有的方案数 $Sum_i + 1$, 减去 $x$ 涂黑的方案数 $f_x f_{n - x + 1}$, 就是不涂 $x$ 的方案数.

所以变成了 $O(1)$ 询问. 这是复杂度的巨大飞跃, 也是代码的进一步缩减, 但是更遗憾的是, 它还是只有 $60'$

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i)
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      memset(f, 0, sizeof(f)), Sum[0] = 0;
      for (register unsigned i(1), j(1), TmpFj(1); i <= n; ++i) {
        while (j + Q[T].Quek <= i) {TmpFj += f[j], ++j; if(TmpFj >= MOD) TmpFj -= MOD;}
        f[i] = TmpFj;
      }
      for (register unsigned i(1); i <= n; ++i) {Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    Q[Q[T].Num].Ans = (MOD + (Sum[n] + 1) - ((unsigned long long)f[Q[T].Quex] * f[n - Q[T].Quex + 1] % MOD));
    if(Q[Q[T].Num].Ans >= MOD) Q[Q[T].Num].Ans -= MOD;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```

> color-70'Ex_Pro_Max_Ti_X_S.cpp

这个 `70'` 实测得了 $80'$. (No `-O2`) 也是全场唯一的 $80'$ (为什么我总是得这么奇怪的分啊?)

这是我考试时最后一个版本, 这份代码主要是对 DP 的过程进行剪枝, 因为打表可得, 对于某个 $k$, $f_{i \in [1, k]}$ 等于 $1$. 又因为排序后 $k$ 单增, 所以我们自然不用每次再求一遍 $f_{i \in [1, k]}$ 了, 复杂度变成 $O(n - k)$, 对于 $k$ 大的情况下理论上能将整个程序复杂度优化 $50\%$ 左右. 所以总复杂度 $O(nlogn + \frac {nk}2 + m)$.

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= m; ++i)
    Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  sort(Q + 1, Q + m + 1);
  for (register unsigned T(1); T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      for (register unsigned i(Q[T - 1].Quek + 1); i <= Q[T].Quek; ++i) f[i] = 1, Sum[i] = i;
      for (register unsigned i(Q[T].Quek + 1); i <= n; ++i) {
        f[i] = Sum[i - Q[T].Quek] + 1;
        Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;
      }
    }
    Q[Q[T].Num].Ans = (MOD + (Sum[n] + 1) - ((unsigned long long)f[Q[T].Quex] * f[n - Q[T].Quex + 1] % MOD));
    if(Q[Q[T].Num].Ans >= MOD) Q[Q[T].Num].Ans -= MOD;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```

> color-100'Ex_Pro_Max_Ti_X_Ultra_Extreme.cpp

在写正解之前, 先来看一下以张业琛为代表的选手的 $O(\frac{nm}{k})$ 做法. 我一听也很疑惑, 我的算法 $k$ 在分子上, 为什么你的 $k$ 在分子上?

我们知道一个黑点前面一定有 $k - 1$ 个连续的白点, 所以我们可以把这些白点和对应的黑点绑到一起, 成为一个长度为 $k$ 的段, 值得一提的是, 由于第一个黑点前面不一定有 $k - 1$ 个白点, 所以可以在格子 $1$ 前面加 $k - 1$ 的格子, 可以作为容纳第一个黑点对应白点的位置, 这样我们就有最多 $\lfloor \frac{n + k - 1}{k} \rfloor = \lceil \frac nk \rceil$ 个黑点了.

考虑有 $i$ 个点, 那么它们占用的长度是 $ki$, 则还剩下 $n + k - 1 - ki$ 个自由的, 没有约束的白点, 像放哪放哪. 这时, 把黑点加上它们对应的尾巴看成一个点, 和自由白点加在一起做组合数即可求出方案数. 点数是 $n + k - 1 - ki + i$, 从这些点中选 $i$ 个点定为带尾巴的黑点, 剩下的是自由白点的方案数是 $\binom{n + k - 1 - ki + i}{i}$.

对于 $i \in [1, \lfloor \frac{n + k - 1}{k} \rfloor]$ 求 $\binom{n + k - 1 - ki + i}{i}$, 就能得到对于 $n$ 长度和 $k$ 间隔没有约束条件的合法涂色方案数.

接下来考虑 $x$ 点为白的情况, 仍然是前面的想法, 即所有的情况减去 $x$ 为黑的情况.

求 $x$ 为黑的情况, 我们知道 $i \in [x - k + 1, x - 1] \cup [x + 1, x + k - 1]$ 必须是白点. 所以 $x$ 右边最多有 $\lfloor \frac{n - x}{k} \rfloor$, 左边最多有 $\lfloor \frac{x - 1 + k - 1 - k + 1}{k} \rfloor = \lfloor \frac{x - 1}{k} \rfloor$. 对于 $i > x$ 由于黑点的尾巴在左边, 所以带尾巴的黑点可以贴脸放, 而且不需要像求整段一样在左端加上 $k - 1$ 个点, 则 $x$ 右边放 $i$ 个黑点的合法方案数为 $\binom {n - x - ki + i}{i}$, 则 $x$ 的左边放 $i$ 个的合法方案数为 $\binom {x - 1 - ki + i}{i}$.

也就是说, 对于询问 $x$, $k$, 答案是:

$$
\Bigg(\sum_{i = 1}^{i \leq \lfloor \frac{n + k - 1}{k} \rfloor}\dbinom {n + k - 1 - ki + i}{i}\Bigg) - \Bigg(\sum_{i = 1}^{i \leq \lfloor \frac{n - x}{k} \rfloor}\dbinom {n - x - ki + i}{i}\Bigg) * \Bigg(\sum_{i = 1}^{i \leq \lfloor \frac{x - 1}{k} \rfloor}\dbinom {x - 1 - ki + i}{i}\Bigg)
$$

只要可以 $O(1)$ 求二项式系数, 我们就可以 $O(\frac{n}{k})$ 回答询问了.

众所周知, 二项式系数:

$$
\binom {a}{b} = \frac{a!}{b!(a - b)!}
$$

我们只要预处理出 $i!$ 和 $inv_{i!}$ 即可, $O(n)$ 求阶乘没问题, 主要问题是逆元.

要预处理 $inv_{i!}, i \in [1, n]$, 我们需要先用快速幂求出 $inv_{n!}$.

假设 $inv_{i!}$ 已经求出, 要求 $inv_{(i - 1)!}$ 使得 $(i - 1)!inv_{(i - 1)!} \equiv 1(\bmod p)$.

则 $i!inv_{(i - 1)!} \equiv i(\bmod p)$, 又因为 $i!inv_{i!} \equiv 1(\bmod p)$, 所以 $inv_{(i - 1)!} \equiv inv_{i!} * i (\bmod p)$.

这样, 总的复杂度就是 $O(\frac {nm}k)$ 了.

接下来考虑正解.

我们现在有算法可以做到 $O(nlogn + \frac {nk}2 + m)$, 也有算法能做到 $O(\frac {nm}k)$. 所以可以数据分治, 对于 $k \leq \sqrt n$ 的询问, 用前一种算法, 对于 $k > \sqrt n$ 的做法, 用后一种做法, 这样, 最坏的复杂度是 $O(nlogn + (n + m) \sqrt n)$.

最后是代码:

```cpp
unsigned n, m, Ans(0), f[100005], Sum[100005], T(1), Sq;
unsigned long long Inv[200005], Fac[200005];
char flg(0);
struct Que {
  unsigned Quex, Quek, Num, Ans;
  inline const char operator<(const Que &x) const{
    return (this->Quek ^ x.Quek) ? (this->Quek < x.Quek) : (this->Quex < x.Quex);
  }
}Q[100005];
int main() {
  n = RD(), m = RD(), Sq = sqrt(n);
  for (register unsigned i(1); i <= m; ++i) Q[i].Quex = RD(), Q[i].Quek = RD(), Q[i].Num = i;
  sort(Q + 1, Q + m + 1), Fac[0] = 1;
  for (register unsigned i(1); i <= n + Q[m].Quek; ++i) Fac[i] = Fac[i - 1] * i % MOD;
  register unsigned TmpM(MOD - 2);
  register unsigned long long TmpFac(Fac[n + Q[m].Quek]);
  Inv[n + Q[m].Quek] = 1;
  while (TmpM) {
    if(TmpM & 1) Inv[n + Q[m].Quek] = Inv[n + Q[m].Quek] * TmpFac % MOD;
    TmpFac = TmpFac * TmpFac % MOD, TmpM >>= 1;}
  for (register unsigned i(n + Q[m].Quek - 1); i < 0x3f3f3f3f; --i) Inv[i] = Inv[i + 1] * (i + 1) % MOD;
  for (; Q[T].Quek <= Sq && T <= m; ++T) {
    if(Q[T].Quek ^ Q[T - 1].Quek){
      for (register unsigned i(Q[T - 1].Quek + 1); i <= Q[T].Quek; ++i) f[i] = 1, Sum[i] = i;
      for (register unsigned i(Q[T].Quek + 1); i <= n; ++i){
        f[i] = Sum[i - Q[T].Quek] + 1, Sum[i] = Sum[i - 1] + f[i]; if(Sum[i] >= MOD) Sum[i] -= MOD;}
    }
    Q[Q[T].Num].Ans = (MOD + (Sum[n] + 1) - ((unsigned long long)f[Q[T].Quex] * f[n - Q[T].Quex + 1] % MOD));
    if(Q[Q[T].Num].Ans >= MOD) Q[Q[T].Num].Ans -= MOD;
  }
  for (register unsigned long long TmpTotal(1), TmpLe(1), TmpRi(1); T <= m; ++T) {
    for (register unsigned i((n + Q[T].Quek - 1)/ Q[T].Quek), Len(n + Q[T].Quek - 1 - Q[T].Quek * i + i); i; --i, Len += (Q[T].Quek - 1))
      TmpTotal = (TmpTotal + (Fac[Len] * Inv[i] % MOD) * Inv[Len - i]) % MOD;
    for (register unsigned i((n - Q[T].Quex)/ Q[T].Quek), Len(n - Q[T].Quex - Q[T].Quek * i + i); i; --i, Len += (Q[T].Quek - 1))
      TmpLe = (TmpLe + (Fac[Len] * Inv[i] % MOD) * Inv[Len - i]) % MOD;
    for (register unsigned i((Q[T].Quex - 1) / Q[T].Quek), Len(Q[T].Quex - 1 - Q[T].Quek * i + i); i; --i, Len += (Q[T].Quek - 1))
      TmpRi = (TmpRi + (Fac[Len] * Inv[i] % MOD) * Inv[Len - i]) % MOD;
    Q[Q[T].Num].Ans = MOD + TmpTotal - (TmpLe * TmpRi % MOD), TmpTotal = TmpLe = TmpRi = 1;
    if(Q[Q[T].Num].Ans >= MOD) Q[Q[T].Num].Ans -= MOD;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Q[i].Ans);
  return 0;
}
```