---
title: 省选日记 Day16~20
date: 2022-04-25 21:39
categories: Notes
tags:
  - Expected_Value_and_Probability
  - Dynamic_Programming
  - Inclusion_Exclusion_Principle
  - Dynamic_Programming_Optimization
  - Greedy_Algorithm
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/MC10.png
---

# 省选日记 Day $16$ - Day $20$

## Day $16$ Apr 19, 2022, Tuesday

解封了, 在外面飙车.

## Day $17$ Apr 20, 2022, Wednesday

解封第二天, 在 GTA $\sqrt {25}$ 里面飙车.

## Day $18$ Apr 21, 2022, Thursday

模拟赛搞了一道题的正解然后就寄摆润了.

### 一道 DP

给 $n$ 个点, 初始权值都是 $1$, 每个点一开始等概率地向左或向右移动, 所有点的速度是相等的.

当两个点相遇的时候, 权值大的点会干掉小的, 然后权值加上小的, 方向不变继续走. 如果权值相等, 13  那么朝左的干掉朝右的. 一个点运动到左边界或右边界, 就调头朝后走.

如果每个点 $i$ 留到最后的概率是 $p_i$, 求 $\sum 2^nip_i$ 对 $10^9 + 7$ 取模的结果.

我们发现, 一开始朝右的, 如果它右边有朝左的那么它一定会寄, 唯一活到最后的方式是在右边往左数第一个且从右端开始有至少 $\lceil \frac n2 \rceil$ 个朝右的点.

对于一个点朝左的情况, 我们要考虑有多少情况可以赢. 设计状态 $f_i$ 表示后缀 $i$ 中的所有点都折返之后, 所有朝左的点权都小于 $n - i$ 的方案数. 可以通过枚举这个后缀中最靠左的朝左的点来进行转移.

$$
f_i = \sum_{j = 2i - n + 1}^{i - 1} f_j
$$

通过前缀和优化可以 $O(n)$ 计算 $f$.

统计时一个点朝左且留到最后的方案数为 $2^{\lfloor \frac i2 \rfloor}f_{n - i}$, 直接统计即可, 总复杂度 $O(n)$.

```cpp
const unsigned long long Mod(1000000007);
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
unsigned Two[1000005], f[1000005], Sum[1000005], m, n;
unsigned long long Ans(0);
unsigned A, B, C, D, t;
signed main() {
  n = RD(), Sum[0] = f[0] = Two[0] = 1;
  for (unsigned i(1); i <= n; ++i) Two[i] = (Two[i - 1] << 1), Mn(Two[i]);
  Ans = (Ans + (unsigned long long)Two[n >> 1] * n) % Mod;
  for (unsigned i(1); i <= ((n - 1) >> 1); ++i) f[i] = Two[i], Sum[i] = Sum[i - 1] + f[i], Mn(Sum[i]);
  for (unsigned i((n + 1) >> 1); i <= n; ++i)
    f[i] = Mod + Sum[i - 1] - Sum[(i << 1) - n], Mn(f[i]), Sum[i] = Sum[i - 1] + f[i], Mn(Sum[i]);
  for (unsigned i(1); i <= n; ++i)
    Ans = (Ans + i * ((unsigned long long)Two[i >> 1] * f[n - i] % Mod)) % Mod;
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```

## Day $19$ Apr 22, 2022, Friday

### [PrSl2022 序列变换](https://www.luogu.com.cn/problem/P8293)

相当于是把括号分层, 从外层的一直操作到内层, 从每层留在外面一对括号. 有一个策略是先处理外层, 再处理内层, 这样可以比其它方案让内层括号有更多选择, 所以更优.

- $x = 0, y = 0$

别想了, 弱智才会出这种数据.

- $x = 0, y = 1$

把花费最大的括号放在外面, 然后把剩下的括号放到下一层, 花费就是这一层的所有括号去掉花费最大的之后的花费之和.

- $x = 1, y = 1$

用花费最小的括号拼掉这一层的所有的括号, 把最大的括号留在这一层.

- $x = 1, y = 0$

这时候我们遇到一个致命的问题, 每次留下一个括号, 就必须要花费这个物品的价值. 这就不能保证我们之前保留最大的括号的策略是正确的了.

但是可以确定的是, 每层除了留下的那个括号, 剩下的括号都需要用权值最小的括号拼掉. 唯一不确定的是留下什么是需要决策的.

如果我们把最大的留下, 那么就要付一次它的代价. 容易发现, 如果我们这次不付这个代价, 那么这个括号被搞到下面一层, 就会有两种情况. 第一种情况就是在后面某一层它被留下了, 第二种是最后只剩它自己的时候, 这个权值就可以不计算了.

每层我们会留下一个元素, 然后加入至少一个元素, 当我们不能再加入元素的时候, 就再也不能加入元素了. 这个类似于 Gap 优化, 也就是如果有一层没有括号, 那么下一层也不会有括号. 所以在结束加入元素之前, 我们当前存在的元素数量一定是单调不降的.

因此只有一对括号的时候有两种情况, 第一种是一开始的时候, 出现的只有一个括号的连续的时间. 第二种是最后一层我们会免费留下最后一对括号.

我们可以把第一种情况都跳过, 也就是删除输入括号序列外层连续的括号层. 问题转化为至少两个元素的集合, 每次加入至少一个值, 删除一个值, 最后连续删除直到不存在值. 那么只有一个值可以不统计任何贡献, 也就是被留到最后的那个值.

因为留下的元素数量一定, 除了最后一个元素其它元素都要付出自己的权值作为留下的代价, 所以我们希望最后留下的元素尽可能大. 又因为无论我们用什么策略, 每一层的元素数量是一定的, 因此我们希望任意时刻的最小值也尽可能地小.

当元素数量大于二时, 完全可以把最大值和最小值都传递到后面, 这样既可以最大限度地保留最大值, 也可以保留最小值. 在此基础上随意留下一个非最值即可.

最后剩下元素数量等于 $2$ 的时候, 仍然分为两类, 第一类是倒数第二层, 存在两个元素, 显然我们选择留下较小的, 下放较大的. 那么接下来考虑另一种情况, 也就是上升段的只有两个元素的时刻, 根据前面的结论, 这些时刻应该是连续的. 

假设这种时刻有 $x$ 个, 有 $x$ 个元素会被留下, 有 $1$ 个元素会下放到后面的元素, 代价只有留下元素付出的代价, 也就是这 $x + 1$ 个元素的总和减去我们最后下放的元素. 我们可以枚举下放哪个元素, 其它时刻留下的元素是一定的, 然后 $O(n)$ 地贪心求结果即可. 总复杂度 $O(n^2)$.

不过如果思考整体的策略, 不难发现, 数量为 $2$ 的时刻不能同时保证最大值和最小值, 要求我们进行取舍. 所以我们只有两条路线, 保留最大值, 保留最小值, 对这两种情况分别求答案即可做到 $O(n)$.

```cpp
char Br[800005];
vector<unsigned> List[400005];
multiset<unsigned> Cur;
unsigned Stack[400005], Cnt(0), STop(0), Opp[800005], Pos[400005], Val[400005];
unsigned nn, n, m, A, B, Mx;
unsigned long long Ans(0), Sum(0);
char Flg(0);
int main() {
  nn = ((n = RD()) << 1), A = RD(), B = RD();
  scanf("%s", Br);
  for (unsigned i(1); i <= n; ++i) Val[i] = RD();
  for (unsigned i(0); i < nn; ++i)
    if(Br[i] ^ ')') List[++STop].push_back(Val[++Cnt]); else --STop;
  for (unsigned i(1); i < n; ++i) if(Val[i] ^ Val[i + 1]) {Flg = 1; break;} 
  Cnt = 0;
  if(!Flg) {
    Val[1] *= (A + B);
    for (unsigned i(1); Cnt + List[i].size(); ++i) {
      Cnt += List[i].size();
      Ans += Cnt - 1, --Cnt;
    }
    printf("%llu\n", Ans * Val[1]);
    return 0;
  }
  if(A == 0 && B == 1) {
    for (unsigned i(1); List[i].size() + Cur.size(); ++i) {
      for (auto j:List[i]) Sum += j, Cur.insert(j);
      Sum -= (A = *(Cur.rbegin())), Cur.erase(--Cur.end());
      Ans += Sum;
    }
    printf("%llu\n", Ans);
    return 0; 
  }
  if(A & B) {
    for (unsigned i(1); List[i].size() + Cur.size(); ++i) {
      for (auto j:List[i]) Sum += j, Cur.insert(j);
      A = *(Cur.begin()); 
      Ans += (Sum - A) + (unsigned long long)A * (Cur.size() - 1);
      Sum -= (A = *(Cur.rbegin())), Cur.erase(--Cur.end());
    }
    printf("%llu\n", Ans);
    return 0;
  } 
  unsigned Beg(1), CurC(0);
  unsigned long long SumD(0);
  vector<unsigned> Do;
  for (; CurC += List[Beg].size(); ++Beg, --CurC) {
    if(CurC > 2) break;
    if(CurC == 2) for (auto i:List[Beg]) SumD += i, Do.push_back(i);
  }
  if(!Do.size()) {
    for (unsigned i(1); List[i].size() + Cur.size(); ++i) {
      for (auto j:List[i]) Sum += j, Cur.insert(j);
      if(Cur.size() == 1) continue;
      if(Cur.size() == 2) {Ans += *(Cur.begin()); break;}
      Ans += (A = *(++(Cur.begin()))) + (*(Cur.begin())) * (Cur.size() - 2);
      Sum -= A, Cur.erase(++Cur.begin());
    }
    printf("%llu\n", Ans);
  } else {
    sort(Do.begin(), Do.end());
    if(!(List[Beg].size())) {printf("%llu\n", SumD - Do.back()); return 0;}
    unsigned long long Tmp(SumD - Do[0]);
    Cur.insert(Do[0]);
    for (unsigned i(Beg); List[i].size() + Cur.size(); ++i) {
      for (auto j:List[i]) Sum += j, Cur.insert(j);
      if(Cur.size() == 1) continue;
      if(Cur.size() == 2) {Tmp += *(Cur.begin()); break;}
      Tmp += (A = *(++(Cur.begin()))) + (*(Cur.begin())) * (Cur.size() - 2);
      Sum -= A, Cur.erase(++Cur.begin());
    }
    Cur.clear(), Cur.insert(Do.back()), Ans = SumD - Do.back();
    for (unsigned i(Beg); List[i].size() + Cur.size(); ++i) {
      for (auto j:List[i]) Sum += j, Cur.insert(j);
      if(Cur.size() == 1) continue;
      if(Cur.size() == 2) {Ans += *(Cur.begin()); break;}
      Ans += (A = *(++(Cur.begin()))) + (*(Cur.begin())) * (Cur.size() - 2);
      Sum -= A, Cur.erase(++Cur.begin());
    }
    printf("%llu\n", min(Ans, Tmp));
  }
  return 0;
}
```

## Day $20$ Apr 23, 2022, Saturday

颓了一天, 有点 Emo.