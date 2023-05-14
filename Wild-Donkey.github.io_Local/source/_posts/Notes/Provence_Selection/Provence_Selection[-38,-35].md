---
title: 省选日记 Day-38~-35
date: 2022-03-01 20:33
categories: Notes
tags:
  - Du_Sieve
  - Suffix_Automaton
  - Suffix_Array
  - Segment_Tree
  - Persistent_Segment_Tree
  - Persistent_Data_Structure
  - Self_Balancing_Binary_Search_Tree
  - Greedy_Algorithm
  - OI_Puzzle
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/Photo4.JPG
---

# 省选日记 Day $-38$ - Day $-35$

## Day $-38$ Feb 24, 2022, Thursday

模拟赛, 只做了 T1, 用杜教筛做 $O(n^{\frac 23})$ 过不了 $10^{11}$, 正解是转化后枚举 $O(n^{\frac 23})$ 种情况, 跑得足够快. 补了 T2, 可以认为是前缀和优化建边的最小生成树.

将比赛 T1 补充到[亚线性筛法](https://www.luogu.com.cn/blog/Wild-Donkey/ya-xian-xing-shai-fa-du-jiao-shai-hu-powerful-number-shai)里.

复习原根.

### [AHOI2013](https://www.luogu.com.cn/problem/P4248)

有长为 $n$ 的字符串 $S$, 设以 $i$ 开始的后缀为 $T_i$, 求:

$$
\sum_{i = 2}^n \frac {3i(i - 1)}2 - 2\sum_{i = 1}^{n - 1} \sum_{j = i + 1}^n LCP(T_i, T_j)
$$

也就是求所有后缀两两删掉 LCP 的长度和. 前面的 $\displaystyle{\sum_{i = 2}^n \frac {3i(i - 1)}2}$ 表示的是对于所有无须数对 $(i \neq j)$, 长度为 $i$, $j$ 的后缀长度和, 即 $\displaystyle{\sum_{i = 2}^n} i \sum_j^{i - 1} j$, 这个式子可以展开然后 $O(1)$ 求, 但是不影响复杂度就懒得展了.

接下来求 $\displaystyle{\sum_{i = 1}^{n - 1} \sum_{j = i + 1}^n LCP(T_i, T_j)}$, 我们可以把字符串倒着输入, 这样就可以只求每对前缀的 LCS (Longest Common Suffix).

对新的串 $S'$ 建 SAM, 发现后缀树上的每个节点, 如果它的最长字符串长度为 $Len$, 公共后缀 (也就是最短字符串) 长度为 $len$, Endpos 集合大小为 $|Endpos|$, 那么它的贡献是 $|Endpos|(|Endpos| - 1) (Len - len + 1)$. 对于以它 Endpos 集合中任意选取一对位置, 这两个位置为结尾的前缀, 都有它作为公共后缀, 不一定最长, 所以我们只记录已知部分的贡献, 也就是长度为 $Len - len + 1$ 这部分. 这部分左边的贡献在它子树上其它节点处统计, 右边的贡献在它祖先处已经统计了.

好久没有写 SAM 了, 我都快忘了怎么写了, 学习了我 $10MB$ 代码的 Tabnine 仍记得怎么写 (当然我没有接受它的建议).

```cpp
unsigned long long Ans(0);
unsigned a[10005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0), STop(0);
char S[500005];
struct Node {
  vector<Node*> Son;
  Node* To[26], * Fa;
  unsigned Len, Siz;
}N[1000005], * Stack[500005], * Last(N), * CntN(N);
inline void Add(char c) {
  Node* Back(Last), * Cur(Last = Back->To[c] = ++CntN);
  Cur->Len = Back->Len + 1, Back = Back->Fa, Stack[++STop] = CntN;
  while (Back) {
    if (Back->To[c]) {
      Node* BcTo(Back->To[c]);
      if (BcTo->Len == Back->Len + 1) { Cur->Fa = BcTo; return; }
      else {
        Node* Copy(++CntN);
        (*Copy) = *(BcTo), Copy->Len = Back->Len + 1, BcTo->Fa = Cur->Fa = Copy;
        while (Back && (Back->To[c] == BcTo)) Back->To[c] = Copy, Back = Back->Fa;
        return;
      }
    }
    Back->To[c] = Cur, Back = Back->Fa;
  }
  if (!(Cur->Fa)) Cur->Fa = N;
}
inline void DFS(Node* x, unsigned len) {
  for (auto i : x->Son) DFS(i, x->Len), x->Siz += i->Siz;
  unsigned long long Ct(x->Siz);
  Ans -= (x->Len - len) * Ct * (Ct - 1);
}
signed main() {
  fread(S + 1, 1, 500002, stdin), n = strlen(S + 1), Ans = 0;
  while (S[n] < 'a') --n;
  for (unsigned long long i(2); i <= n; ++i) Ans += i * (i - 1);
  Ans >>= 1, Ans *= 3;
  for (unsigned i(n); i; --i) Add(S[i] - 'a');
  while (STop) Stack[STop--]->Siz = 1;
  for (Node* i(CntN); i > N; --i) i->Fa->Son.push_back(i);
  DFS(N, 0);
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

发现无论正着还是反着插入, 都能 AC. 分析其原因, 对于两段不重合的极大相同子串 $A$, $B$, 长度为 $Len$, 它们的前缀或后缀作为 LCP 或 LCS 能造成的总贡献都是 $\displaystyle{\sum_{i = 1}^{Len} i} = \dfrac {i(i + 1)}2$.

#### 法二

对于两个后缀, 我们所统计的 LCS, 属于它们所属节点在后缀树上的 LCA. 如果回归我们一开始的式子, 也就是两个前缀去掉 LCS 后的长度, 那么在后缀树上的体现就是两点间的路径长度. 定义每个点向父亲的边权为 $Len_{Cur} - Len_{Fa}$, 求路径长度即可.

对每条边计算贡献, 可以知道经过这条边的点对共有 $Size_{Cur}(n - Size_{Cur})$ 个, 直接计算贡献即可.

#### 法三

用 SA, 求出 $Height$ 数组. 可以知道对于 $Height$ 的每个区间 $[l, r]$, 其最小值表示的即为以 $l$, $r$ 开头的后缀的 LCP. 用单调栈, 扫描 $r$, 维护所有 $l$, 即可求出答案.

本题目开始于 Feb 24, 完成于 Feb 25 

## Day $-37$ Feb 25, 2022, Friday

模拟赛爆大零, T1 可持久化线段树被人带跑了, 想分块去了. 结果最后分块写完发现自己做的是问题的弱化 (忘了一开始是经过自己的弱化才开始做的了, 如果一开始往离线上弱化估计就做出来了).

好几个月没写可持久化线段树, $1$ 个小时才 AC.

```cpp
unsigned a[200005], Stack[200005], STop(0), m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node {
  Node* LS, * RS;
  unsigned Fa, Val, Tag;
  inline void PsUp() {
    if (LS) Val = max(Val, LS->Val);
    if (RS) Val = max(Val, RS->Val);
  }
}N[10000005], * Ver[200005], * CntN(N);
inline Node* New() {
  Node* Cur(++CntN);
  Cur->Val = Cur->Tag = 0, Cur->LS = Cur->RS = NULL, Cur->Fa = 1;
  return Cur;
}
inline Node* Copy(Node* x) {
  Node* Cur(++CntN);
  (*Cur) = (*x), Cur->Fa = 1, --(x->Fa);
  if (Cur->LS) ++(Cur->LS->Fa);
  if (Cur->RS) ++(Cur->RS->Fa);
  return Cur;
}
inline void Chg(Node* x, Node* y, unsigned L, unsigned R) {
  if ((A <= L) && (R <= B)) { ++(y->Val), ++(y->Tag); return; }
  unsigned Mid((L + R) >> 1);
  if (A <= Mid) {
    if (!(x->LS)) x->LS = New();
    if (!(y->LS)) y->LS = New();
    else if (y->LS->Fa > 1) y->LS = Copy(y->LS);
    Chg(x->LS, y->LS, L, Mid);
  }
  if (Mid < B) {
    if (!(x->RS)) x->RS = New();
    if (!(y->RS)) y->RS = New();
    else if (y->RS->Fa > 1) y->RS = Copy(y->RS);
    Chg(x->RS, y->RS, Mid + 1, R);
  }
  y->PsUp();
}
inline void Qry(Node* x, unsigned L, unsigned R) {
  if ((A <= L) && (R <= B)) { Ans = max(Ans, x->Val + Tmp); return; }
  unsigned Mid((L + R) >> 1);  Tmp += x->Tag;
  if (A <= Mid) { if (x->LS) Qry(x->LS, L, Mid); else Ans = max(Ans, Tmp); }
  if (Mid < B) { if (x->RS)  Qry(x->RS, Mid + 1, R); else Ans = max(Ans, Tmp); }
  Tmp -= x->Tag;
}
signed main() {
  n = RD(), m = RD(), t = RD(), Ver[0] = N;
  for (unsigned i(1); i <= n; ++i) {
    a[i] = RD();
    while (STop && (a[i] > a[Stack[STop]])) --STop;
    A = Stack[STop] + 1, B = Stack[++STop] = i;
    ++(Ver[i - 1]->Fa), Chg(Ver[i - 1], Ver[i] = Copy(Ver[i - 1]), 1, n);
  }
  for (unsigned i(1); i <= m; ++i) {
    Ans *= t, A = (RD() + Ans + n - 1) % n + 1, B = (RD() + Ans + n - 1) % n + 1;
    if (A > B) swap(A, B);
    Ans = Tmp = 0, Qry(Ver[B], 1, n);
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

然后完成了昨天 SAM 的代码.

## Day $-36$ Feb 26, 2022, Saturday

### [NOI2005](https://www.luogu.com.cn/problem/P2042)

给一个序列, 支持一下操作:

- 区间插入

- 区间删除

- 区间赋值

- 区间翻转

- 区间求和

- 区间最大子段和

一眼平衡树, 首先明确我们要求的东西所需的信息: 区间和, 区间最大子段和, 区间最大前缀和, 区间最大后缀和. 还需要为区间赋值和区间翻转打 Tag.

写了一棵 WBLT, 抢了个最优解[榜首](https://www.luogu.com.cn/record/70075175).

打 USACO, 铜组用了五十多分钟, 真是太菜了.

银组的 T1 卡了一下午, 因为往费用流和二分图匹配上想了, 最后加上二分答案查询优化到 $O(n^{3.5}\log n)$, 实在是做不了. 然后突然想到可以强连通分量 $O(n^2)$ 做. 我们建有向图, 每头牛是节点, 向初始拥有自己更想拥有的礼物的牛连边. 在这个有向图上的每一个环, 我们都可以进行一次交换, 这样可以让环上每一头牛都更加满意.

如何判断一头牛能否得到一个礼物? 它必须存在指向初始拥有这个礼物的牛的边, 并且它们在一个简单环里. 对于所有它拿到后更满意的礼物, 都满足第一个条件, 第二个条件等价于两个点在同一个强连通分量里. 那么我们查询的就是自己所在强连通分量内所有节点中, 初始拥有的自己最想得到的礼物.

T2 给秒了, 爆搜复杂度是 $O(2^n)$, 但是可惜 $n \leq 40$, 所以直接双向搜索. 因为 `map` 的常数极大, 所以实现后会 MLE, 所以尝试把 `long long` 变成 `int`, 仍失败. 认为大概率 `map` 存在平衡树的结构, 所以会有几倍的空间.

所以使用 `vector`, 记录可达的坐标, 不再记录到达同一个坐标的方案数量, 而是作为相同的元素共存于 `vector` 中, 不影响复杂度. 最后将所有 `vector` 排序然后双指针统计答案即可. 碰运气没开 `long long` 结果也过了.

关于这个题 `int` 能过的问题: 虽然有 $40$ 个 $[-10^9, 10^9]$, 总和可以超过 `int` 的范围, 但是我们的终点也是 $[-10^9, 10^9]$, 所以溢出的点必须再回到合法范围内才能对答案进行贡献. 我们又知道溢出是取模意义下的, 也就是说我加一个数溢出了, 我减同样多的数还能减回来. 所以相当于把坐标生成了一个 `int` 范围的, 可减的哈希值, 对于 $40$ 种操作来说, 这个碰撞的概率是及其小的, 但是可以构造数据来卡. 出题人没有刻意卡, 那么不开 `long long` 出错的可能性是很低的.

T3 是个贪心, 模拟过程比较细节, 但是在一些 stl 的帮助下, 经过几次小重构, 在 $30$ 分钟左右的时间内过掉了此题.

整场比赛我提前得到了题面, 开题后开始写代码, 遇到了一些问题, 但是仍在 $100$ 分钟内完成了所有代码.

## Day $-35$ Feb 27, 2022, Sunday

今天为了搞到金组题面, 帮别人调了好几份银组的代码, 当了一上午大好人.

看到在任务清单吃灰的区间众数, 我心想[蒲公英](https://www.luogu.com.cn/problem/P4168)也是区间众数, 是紫的, 你凭什么是黑题? 然后把它秒了, 发现 $62.5MB$ 内存卡掉了空间 $O(n\sqrt n)$ 的做法, 好不容易在唐爷爷的提醒下想到了 $O(n)$ 空间的做法, 但 $O(n\sqrt n \log n)$ 又让我只能望着 $5 * 10^5$ 的数据兴叹.

下午好不容易搞到了金组题面, 一看 T1 还以为是朋友给我发错了, 这不是银组 T1 吗? 然后发现这个奶牛换礼物虽然规则和背景都一样, 但是求的东西不一样了. 这个题目困住了我, 也让我困倦不堪, 我睡了一觉, 起来后发现自己还是不会. 把 T2 读完想到了 $O(n)$ 的递推, 又想到可以矩阵快速幂转移, 加上二分干到 $O(n\log^2 m)$.

晚上终于在朋友的帮助下看懂了 T1, 也意识到 T2 转移是等比数列求和, 所以自己是个傻逼.

觉得自己应该静静, 所以报名了 [ARC](https://atcoder.jp/contests/arc136). 这是我第一次打 ARC, 打得很窝囊, 只做出了 AB 两题, CD 很弱智, 但是我没想出来.

A 是签到题, 把 `A` 都转化成 `BB`, 然后贪心地合并连续的 `BB` 即可.

B 别人都觉得难, 首先判所有数字个数, 不相同直接 `No`. 然后先考虑所有数字不同的情况, 可以建立映射, 使得第一个序列等价于排列 $1, 2, 3,...,n$, 然后就可以求出第二个序列对应的排列. 发现每次执行题目中的操作, 会使得排列逆序对变化 $2$ 的整数倍, 所以判断目标排列的逆序对数量奇偶即可. 然后考虑有相同数字的情况, 如果我们把相同数字的每次出现视为不同情况, 则等价于所有数字不同的情况. 但是不同之处在于, 如果我们一开始就交换两个相同的数字, 那么这个序列逆序对数变化奇数个, 可以使得原本不能得到的序列可以得到. 所以当存在相同数字时, 无论有多少逆序对, 都是 `Yes`, 否则判断逆序对数量奇偶即可. 这道题求成正序对了, 调了好久.

C 是 [NOIP2018 铺设道路](https://www.luogu.com.cn/problem/P5019)在环上的版本, 先看原题的做法, 可以认为是每次差分为正时插入线段, 然后在差分为负时删除线段, 答案即为插入线段的数量. 那么这道题的不同之处在于, 对于不相交的两条线段, 只要它们一条以 $1$ 为起点, 一条以 $n$ 为终点, 那么我们就可以把它合并成一条.

接下来的任务就是尽可能地让可合并的线段更多. 因为一条线段起点越靠后, 它相对就更有价值, 所以删除的时候优先删除起点靠前的, 我们可以用小根堆维护这些线段. 由于相同线段较多, 所以我们每次插入时记录数量, 就可以避免多次插入相同线段了, 删除的时候把起点为 $1$ 的线段插入一个 `vector`, 最后将所有终点为 $n$ 的线段插入另一个 `vector`. 排序后用双指针扫描两个 `vector` 将可并线段合并. 答案即为 NOIP 原题的答案减去合并线段的对数. 

```cpp
priority_queue <pair<unsigned, unsigned> > Q;
vector<pair<unsigned, unsigned> > Pre, Suf;
unsigned long long Ans(0), Refresh(0);
unsigned a[200005], m, n, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    a[i] = RD();
  }
  Ans = a[1], Q.push({ n - 1, a[1] });
  for (unsigned i(2); i <= n; ++i) {
    if (a[i] > a[i - 1]) Q.push({ n - i, a[i] - a[i - 1] }), Ans += a[i] - a[i - 1];
    else {
      unsigned Del(a[i - 1] - a[i]);
      while (Del && (Q.top().second <= Del)) {
        if (Q.top().first == n - 1) Pre.push_back({ i, Q.top().second });
        Del -= Q.top().second, Q.pop();
      }
      if (Del) {
        pair <unsigned, unsigned> Tmpp(Q.top());
        Q.pop(), Tmpp.second -= Del;
        if (Tmpp.first == n - 1) Pre.push_back({ i, Del });
        Q.push(Tmpp);
      }
    }
  }
  while (Q.size()) Suf.push_back({ n - Q.top().first, Q.top().second }), Q.pop();
  for (unsigned i(0), j(0); i < Pre.size() && j < Suf.size();) {
    while (j < Suf.size() && Pre[i].first > Suf[j].first) ++j;
    if (i < Pre.size() && j < Suf.size()) {
      if (Pre[i].second > Suf[j].second) Ans -= Suf[j].second, Pre[i].second -= Suf[j].second, ++j;
      else Ans -= Pre[i].second, Suf[j].second -= Pre[i].second, ++i;
    }
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

D 直接用高维前缀和求出 $10^6$ 范围内每个数字的答案即可.

```cpp
unsigned a[1000005], b[1000005], m, n;
unsigned long long Ans(0);
unsigned A, B, C, D, t;
unsigned Cnt(0);
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) ++a[b[i] = RD()];
  for (unsigned i(1); i <= 999999; ++i) if (i % 10) a[i] += a[i - 1];
  for (unsigned i(1); i <= 999999; ++i) if ((i / 10) % 10) a[i] += a[i - 10];
  for (unsigned i(1); i <= 999999; ++i) if ((i / 100) % 10) a[i] += a[i - 100];
  for (unsigned i(1); i <= 999999; ++i) if ((i / 1000) % 10) a[i] += a[i - 1000];
  for (unsigned i(1); i <= 999999; ++i) if ((i / 10000) % 10) a[i] += a[i - 10000];
  for (unsigned i(100000); i <= 999999; ++i) a[i] += a[i - 100000];
  for (unsigned i(1); i <= n; ++i) {
    unsigned Tmp(b[i]);
    char Flg(0);
    while (Tmp) { if ((Tmp % 10) >= 5) Flg = 1; Tmp /= 10; }
    Ans += a[999999 - b[i]] + Flg - 1;
  }
  printf("%llu\n", Ans >> 1);
  return Wild_Donkey;
}
```