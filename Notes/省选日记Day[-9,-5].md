# 省选日记 Day $-9$ - Day $-5$

## Day $-9$ Mar 25, 2022, Friday

### [ARC059F](https://atcoder.jp/contests/arc059/tasks/arc059_d)
看到这里的题解都是二维 DP, 我是从卡特兰数的方面考虑的此题. 

如果这个题的模数换成 $998244343$ 或是别的 NTT 模数, 那么复杂度就可以通过分治 FFT 做到 $O(n\log^2 n)$. 可惜换不得. 但是貌似存在某神奇的多项式科技任意模数 NTT, 那么理论上还是可以 $O(n\log^2 n)$ 的.

但是本题解只对 $O(n^2)$ 的做法进行实现.

前置知识: 可以在[这里](https://www.luogu.com.cn/blog/Wild-Donkey/zroi-day11-day20-bi-ji) Day19 的 C 题笔记中找到卡特兰数的推导和变形, 也可以查看 [Wiki](https://zh.wikipedia.org/zh-hans/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B0).

给一个 0/1 串 $S$, 每次可以选择在末尾插入一个 `0` 或 `1`, 或删除最后一个字符. 求进行 $n$ 次操作之后得到 $S$ 的方案数.

注意到一个比较头疼的事情是在没有字符的时候按退格, 这样的退格不会删除任何东西, 且一旦出现无效退格, 一定不存在任何字符. (废话) 所以可以认为是一个新的子问题.

设操作 $i$ 次, 操作 $i$ 是无效退格的方案数为 $f_i$. 

为了求这个 $f$, 我们需要计算从 $0$ 个字符开始, 不断进行操作, 但是禁止无效退格. 进行 $2i$ 次操作的方案数为 $g_i$. 这样会打出 $i$ 个字符, 并且这 $i$ 个字符会被 $i$ 个有效退格删掉. 这个问题等价于将 `0` 和 `1` 压入栈并且弹出. 可以看出 $g_i$ 等于卡特兰数第 $i$ 项乘 $2^i$. $2^i$ 枚举了每个插入的字符是 `0` 还是 `1`, 卡特兰数第 $1$ 项枚举了每个退格的时刻.

求出了 $g$, 我们枚举倒数第二次无效空格的时刻 $i - 1 - 2j$, 则 $f_i$ 可以表示为:

$$
f_i = \sum_{j = 0}^{\lfloor \frac {i - 1}2 \rfloor} f_{i - 1 - 2j}g_j
$$

这是卷积的形式, 我们可以使得 $g'_{2i + 1} = g_i$, 然后让 $g'$ 其余项为 $0$, 那么式子就变成:

$$
f_i = \sum_{j = 1}^{i} f_{i - j}g'_{j}
$$

可以用分治 FFT 优化到 $O(n\log^2 n)$, 所以这个题理论上是可以 $O(n \log^2 n)$ 的. 有需要的人可以拿去出个加强版, 把模数换成 $998244353$ 然后把 $n$ 开到 $10^5$ 什么的.

我们枚举最后一个无效退格的时刻 $x$. 那么相当于是在禁止无效退格的情况下用 $n - x$ 次操作得到目标串. 所以我们枚举 $x$, 对不同的 $x$ 算 $n - x$ 答案即可.

接下来考虑禁止无效退格, 用 $x$ 次操作凑出目标串的方案数.

设 $S$ 的长度为 $m$, 那么我们知道会有 $\dfrac{x + m}2$ 次插入操作, 剩下的是删除操作. 所以需要 $x$, $m$ 奇偶性相同. 否则方案数为 $0$.

我们先不管 $x$ 次操作后的串是什么, 求出只存在 `0` 的情况下, $x$ 次操作后留下 $m$ 个 `0` 的方案数. 显然是卡特兰数的变形, 也就是 $\dbinom x{\frac {x + m}2} - \dbinom x{\frac {x + m}2 + 1}$.

最后我们考虑既有 `0` 也有 `1` 的情况. 对于被删除了的 $\dfrac {x - m}{2}$ 次插入, 我们允许它们是任何数字, 剩下的 $m$ 个未被删除的插入, 它们必须是目标位置的数字. 因此只要在原来只有 `0` 的方案数的基础上乘以 $2^{\frac{x - m}2}$ 即可.

这里没有对分治 FFT 进行任意模数 NTT 的实现. 只写了暴力卷积:

```cpp
const unsigned long long Mod(1000000007);
unsigned long long Fac[5005], Inv[5005], Two[5005], g[5005], f[5005], Ans(0);
unsigned m, n;
inline unsigned long long Inver(unsigned long long x) {
  unsigned long long Rt(1);
  unsigned y(1000000005);
  while (y) { if(y & 1) Rt = Rt * x % Mod; x = x * x % Mod, y >>= 1;}
  return Rt;
}
inline unsigned long long Solve(unsigned x) {
  unsigned Typ((x + m) >> 1);
  unsigned long long A(Two[Typ - m]), B(Inv[Typ] * Inv[x - Typ] % Mod);
  A = A * Fac[x] % Mod;
  B = B * A % Mod, Typ = x - Typ;
  if(Typ) --Typ, A = A * Inv[Typ] % Mod, A = A * Inv[x - Typ] % Mod;
  else A = 0;
  return Mod + B - A;
}
signed main() {
  n = RD(), f[0] = g[0] = Fac[0] = Two[0] = 1;
  while (getchar() >= '0') ++m;
  for (unsigned i(1); i <= n; ++i) Fac[i] = Fac[i - 1] * i % Mod;
  Inv[n] = Inver(Fac[n]);
  for (unsigned i(n); i; --i) Inv[i - 1] = Inv[i] * i % Mod;
  for (unsigned i(1); i <= n; ++i) Two[i] = (Two[i - 1] << 1), Two[i] -= (Two[i] >= Mod) ? Mod : 0;
  for (unsigned i(n >> 1); i; --i)
    g[i] = (((Fac[i << 1] * Inv[i + 1] % Mod) * Inv[i] % Mod) * Two[i]) % Mod;
  for (unsigned i(1); i <= n; ++i) for (unsigned j((i - 1) >> 1); ~j; --j)
    f[i] = (f[i] + f[i - 1 - (j << 1)] * g[j]) % Mod;
  for (unsigned i(n - m); ~i; --i) if(!(((n - i) ^ m) & 1))
    Ans = (Ans + f[i] * Solve(n - i)) % Mod;
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## Day $-8$ Mar 26, 2022, Saturday

### NOIO-S T1

这里有一个结论. 对于 $i < x$, 如果从 $i$ 开始入栈, $x$ 是成功的, 那么从 $i + 1$ 开始入栈, $x$ 也一定是成功的. 我们可以从 $1$ 开始把所有东西入栈. 取一个元素 $x$ 入栈后的前一个元素 $y$, 我们知道从 $y + 1$ 开始入栈, $x$ 就是成功的了. 把每个元素成功需要的最小起点记录为 $Left$ 数组.

起床 $8:30$ 就离谱, 在床上就火速开电脑. 立马看题, 一边做饭一遍想, 但是想错了. 当时一直认为上面这个结论是错的, 以至于把这个题想得很难. 到了机房九点接近半了, 直接比别人少了一个小时.

接下来我们要解决的就是在区间 $[L, R]$ 内, 对 $Left_i \leq L$ 的 $i$ 计数. 可以使用可持久化权值线段树直接查询, 也可以对所有询问拆成 $i \leq R$, $i < L$ 两个询问, 将每个询问排序后, 用树状数组一遍插入, 一边询问前缀和.

我写挂了, 是因为排序时重载询问的小于号, 把比较规则设为了小于等于号. 我把 T1 大样例过了, 并且因为大样例本地 $0.8s$ 我很慌张, 发现输出占了 $0.5s+$, 怒写快写, 时间卡到 $0.3s$ 心满意足. 没想到这种明显的 RE 错误都没有看出来.

### NOIO-S T2

这个题当时没有想出来, 因为我给 T1 卡完常就快 $11:00$ 了. 于是当时开始努力拿暴力.

我一开始认为, 这个暴力拿 `bitset` 随便冲不就是了? 结果事后在民间数据提交发现连 $5000$ 的点都过不了.

正解其实很无脑, 我们考虑如果依次对每个人会做的题染色, 每次遍历到一个人, 就判断它会做的题是否是一个颜色, 如果是, 说明他是别人的子集. 如果不是, 有两种情况, 他包含别人或者是找到了答案. 为了避免他包含别人的情况, 我们只要把人按照会题数量排序即可. 这样我们只要取我们会的题中, 不是最大的那个颜色作为答案的一个人, 当前遍历的人作为另一个人即可.

### NOIO-S T3

其实这个暴力是好写的, $m = 2$ 就是求两两列的总和, 求矩阵的和然后乘以 $2n$ 即可.

我们可以把答案分为两部分, $f$ 的对角线部分, 和下三角部分. 因为 $f$ 是对称的, 所以我们可以线性算出对角线贡献的 $\frac 12$, 再加上一个下三角, 然后把答案乘以 $2$. 我们可以分别对 $\min$ 和 $\max$ 算贡献, 然后加起来.

$n \leq 3000$ 的点也很简单, 直接按题意模拟即可得到答案.

我们以 $\max$ 为例, 正解需要的只有一步转化, 我们先找出和 $a_{i, 0}$ 相加作为最大值的数都有哪些 $j$, 它们的总和是多少. 这些 $j$ 需要满足:

$$
a_{i, 0} + a_{j, 0} \geq a_{i, 1} + a_{j, 1}\\
a_{i, 0} + a_{j, 0} \geq a_{i, 2} + a_{j, 2}\\
a_{i, 0} + a_{j, 0} \geq a_{i, 3} + a_{j, 3}
$$

为了去重, 遇到相等的情况, 我们需要比较第二维, 因为第二维只有 $4$, 因此只是个常数.

移项得到:

$$
a_{i, 0} - a_{i, 1} \geq a_{j, 1} - a_{j, 0}\\
a_{i, 0} - a_{i, 2} \geq a_{j, 2} - a_{j, 0}\\
a_{i, 0} - a_{i, 3} \geq a_{j, 3} - a_{j, 0}
$$

我们可以枚举哪一行作为最大值, 然后把每个元素记为一个三元组, 然后对它进行一个三维偏序的操作. 即可算出答案.

### NOIO-J T1

这个题的样例出锅了, 总体很简单, 按题意模拟即可.

### NOIO-J T2

设 $d = \gcd(x, y)$, 则 $x = x'd$, $y = y'd$, $z = x'y'd^3$.

我们计算 $\frac zx$, 如果除不开那么这个 $z$ 是不合法的, 否则就得到 $\frac zx = y'd^2$.

接下来把 $x$ 平方得到 $x'^2d^2$. 使用 $\frac zx = y'd^2$ 和 $x'^2d^2$ 计算出.

## Day $-7$ Mar 27, 2022, Sunday

### Luogu April Fool A

给 $x$, $y$. 输出它们分别与 $9961$ 异或后, 将它们分别加上 $17$, 再将第一个数加到第二个数上, 再分别乘以 $81$, 再求出它们的和, 再将和减去 $2 \times 3$, 加上 $2$, 将其个位设为 $\tan 45$, 并对 $9$ 取模得到的值.

### Luogu April Fool B

有一个让你等待的图片, 我人傻了, 等了 $\frac 14$ 以后手贱点了一下就被骗了, 点进了 Never Gonna Give You Up. 回来以后就白等了. 看了一下 F12, 发现是个 svg, 发现它把每一个时刻的状态都存下来了, 所以用可持久化图片直接快进到最后一秒, 得到一个神奇的串 `10wliyqz`. 输出它即可.

### Luogu April Fool C

审题解, 管理员辛苦了.

不知道甚么是违规内容, 首先交一发输出 `d1`, 看看哪些是违规内容警告. 发现是 `8, 9, 10`. 

然后交一发 `a1`, 发现只有 `5` 过了.

还剩下 $8$ 篇需要审, 接下来就是漫长的审核过程了.

轻松审了 `2, 3, 4`, `1` ACM 费了九牛二虎之力, 终于搞出来了. 对于 `6, 7`, 则是通过 ACM + 枚举试出来的. 到了 `11, 12`, 我们都白搭了, 远程连线了 AC 的其他人, 线上 ACM + 威逼利诱搞了出来. 从上午做到下午的题.

接下来放出每个点的槽点:

```
1:  c1c3c4
2:  b1b3c2c6
3:  b2b3c2
4:  b1b3
5:  a1
6:  b2c1c2
7:  b2c1c2c3c5
8:  d1
9:  d1
10: d1
11: b6b7c1c2c5
12: b2b3c1c6
```

### Luogu April Fool E

因为某种原因提前看到了题, 所以秒了.

我们甚么也不放, 烂天平自己就不平衡了, 蜀兵不战自退.

### Luogu April Fool H

限制代码使用进行大量输出的 idea 是在我得知 [yzy1](https://www.luogu.com.cn/user/207996) 在出愚人节的时候向他提出来的. 原问题是禁止使用 `for`, `while`, `goto`, 递归, 并且输出 $10^7$ 个 `A`. 也就是题面中提到的黑名单法.

我们当晚的想法是用 `define` 搞出一个倍增的形式, 也就是这样:

```cpp
#define B "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
#define C B B B B B B B B B B 
#define D C C C C C C C C C C 
#define E D D D D D D D D D D 
#define F E E E E E E E E E E 
#define G F F F F F F F F F F
```

最后直接 `printf(G)` 即可.

还有人说可以进行 `memcpy` 倍增, 这样貌似更加巧妙, 我们定义 $\log$ 个字符数组, 存储 $2$ 的整数幂个 `A`, 通过 `memcpy` 来处理, 最后直接输出对应的字符串即可.

还有方法指出可以进行 `#define A fo`, `Ar()` 来绕开黑名单实现 `for` 循环. 或者通过 `\` 连接两行代码来绕开黑名单.

黑名单真的很无脑就能做. 但是白名单拼代码, 真的难爆了, 在这里 % 一下 yzy1.

一开始尝试用 `goto` 死循环输出 `0`, 结果必然是没过. 然后又尝试了 `"0"*a` 等奇技淫巧, 必然是不能过的. 这道题让我彻底失去了做愚人节的信心.

本来不想听讲评, 但是脸白, 手贱点开直播刚想关掉就看见了这题刚开始讲, 怒贺.

我们需要知道, `*` 在 `printf` 中的意义是规定输出宽度, 我们用 `printf("%*u", a, b);` 就可以在输出 $b$ 的过程中, 如果宽度不足 $a$, 则左边补空格直至宽度为 $a$ 为止, 如果宽度大于 $a$, 则正常输出 $b$.

但是我们发现给出的东西中没有单独的字母 `d` 或 `u`, 所以无法凑出这个语法, 但是不要忘了还有一个东西叫做 `%i`, 它和 `%d` 意义相同, 发现我们可以使用 `i`, 那么就可以凑出这个语法, 我们在 `*` 前面加的字符便是添加的占位符, 我们可以用 `printf("%0*i", a, 0)` 来输出 $a \geq 1$ 个 `0`.

于是本题可以用这样的代码解决:

```c
#include<stdio.h>
int main(){{int a;}scanf("%d",&a),printf("%0*i",a,0);}
```

但是这个东西貌似不满足数量要求了, 因为我不懂 `c`, 所以我觉得这玩意已经到极限了. 我在前面的错误代码中尝试着把最扎眼的 `int a` 放到 `main()` 的括号里, 发现正常编译了, 于是后来就这么用了. 

听了讲评之后, 我明白了可以直接写一个 `main(a)`, 并且无需调用什么 `stdio.h`. 最后狠心删掉一个 `int`, 代码变成了这样:

```c
main(a){scanf("%d", &a),printf("%0*i",a,0);}
```

长度为 $27$. 终于通过了此题.

获得了期满许久的 key.

```
27
19 3 4 16 3 13 20 8 9 10 3 13 12 18 9 21 7 6 15 4 21 12 3 12 6 13 14
1168558492611544400
```

我的评价是: 出得很好, 下次不要再出了.

### [PrSl2021 矩阵游戏](https://www.luogu.com.cn/problem/P7515)

我一开始想的是这样的, 我只要知道左边和上边两个边界上 $n + m - 1$ 个元素就可以生成整个矩阵. 但是这个矩阵不一定满足上下界要求.

矩阵其他元素关于已知 $n + m - 1$ 个格子 $x_1, x_2,...,x_{n + m - 1}$ 的表达式可以用三个 $x$ 表示, 我们可以列出对应的不等式来约束 $x$. 但是显然三元的不等式是我们不想看到的, 因为我们没有什么算法可以很好地处理这个问题.

想了好久也不懂如何去搞, 最后看了一眼题解, 发现题解是把每个行和每个列作为变量去考虑. 假设已经生成了一个满足加和性质的矩阵 $a$, 我们需要进行一些调整使它满足要求. 发现如果对一行进行调整, 它的奇数列增加 $k$, 偶数列就要减少 $k$, 这样可以保证性质. 对于列也是一样, 它奇数行增加 $k$, 偶数行就要减少 $k$.

我们把每一行奇数列增加的数量和每一列奇数行增加的数量作为变量, 发现每个格子的约束变成了两个变量的和或差的不等式. 接下来只要对这 $2nm$ 个不等式个找出一组可行的解或判断无解即可.

对于 $x_i - x_j \leq a$ 的形式我们可以想到差分约束, 但是我们不能很好地处理 $x_i + x_j \leq a$ 的形式.

发现出现 $x_i + x_j$ 的情况只有行列奇偶相同的时候会出现. 

我们可以对奇数行记录奇数位置增加数量为这一行的变量, 对于偶数行记录偶数位置增加数量为这一行的变量. 对于奇数列记录偶数位置的增加量为这一列的变量, 对于偶数列记录奇数位置增加量为这一列的变量. 这样对于一个点, 它调整后的值一定和两个变量的差有关, 我们所设的式子也只和两个变量的差有关, 可以进行差分约束了.

最后确定了变量的值直接对前面构造的矩阵进行调整即可. 最后输出调整之后的 $a'$.

如果一个格子 $(i, j)$ 行列相加是奇数, 那么它得到的不等式便是:

$$
a_{i, j} - x_i + x_{n + j} \in [0, 1000000]\\
\Downarrow\\
x_i \leq x_{n + j} + a_{i, j}\\
x_{n + j} \leq x_i + 1000000 - a_{i, j}\\
$$

否则得到的不等式是:

$$
a_{i, j} + x_i - x_{n + j} \in [0, 1000000]\\
\Downarrow\\
x_{n + j} \leq x_i + a_{i, j}\\
x_i \leq x_{n + j} + 1000000 - a_{i, j}\\
$$

接下来连边跑最短路即可. 没有一遍过是因为输出 `NO` 没有换行.

```cpp
long long b[305][305], a[305][305];
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Ans(0), Tmp(0);
struct Node {
  vector<pair<long long, Node*> > E;
  long long Dis;
  unsigned Cnt;
}N[605], *Que[360005], **Tl(Que), **Hd(Que);
inline void Clr() {
  for (unsigned i(n + m); i; --i) N[i].E.clear();
  n = RD(), m = RD();
  Tl = Hd = Que;
}
inline char SPFA() {
  for (unsigned i(n + m); i; --i) N[i].Cnt = 1, *(++Tl) = N + i, N[i].Dis = 0;
  while (Hd < Tl) {
    Node* Cur(*(++Hd));
    for (auto i:Cur->E) if(Cur->Dis + i.first < i.second->Dis) {
      if(++(i.second->Cnt) > n + m) return 1;
      *(++Tl) = i.second, i.second->Dis = Cur->Dis + i.first;
    }
  }
  return 0;
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (unsigned i(2); i <= n; ++i) for (unsigned j(2); j <= m; ++j) b[i][j] = RD();
    a[1][1] = 500000;
    for (unsigned i(3); i <= n; i += 2) a[1][i] = 0;
    for (unsigned i(2); i <= n; i += 2) a[1][i] = 1000000;
    for (unsigned j(2); j <= m; j += 2) a[j][1] = 0;
    for (unsigned j(3); j <= m; j += 2) a[j][1] = 1000000;
    for (unsigned i(2); i <= n; ++i) for (unsigned j(2); j <= m; ++j)
      a[i][j] = b[i][j] - a[i - 1][j - 1] - a[i - 1][j] - a[i][j - 1];
    for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= m; ++j) {
      A = i, B = n + j; if((i ^ j) & 1) swap(A, B);
      N[B].E.push_back({1000000 - a[i][j], N + A}), N[A].E.push_back({a[i][j], N + B});
    }
    if(SPFA()) {printf("NO\n"); continue;}
    printf("YES\n");
    for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= m; ++j) a[i][j] += ((i ^ j) & 1) ? (-N[i].Dis) : N[i].Dis;
    for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= m; ++j) a[i][j] += ((i ^ j) & 1) ? N[n + j].Dis : (-N[n + j].Dis);
    for (unsigned i(1); i <= n; ++i) {for (unsigned j(1); j <= m; ++j) printf("%lld ", a[i][j]); putchar(0x0A);}
  }
  return Wild_Donkey;
}
```

## Day $-6$ Mar 28, 2022, Monday

### ExACM 赛制导论

##### Introduction of ExACM

我们知道, ExCRT 就是在本来不能 CRT 的时候进行 CRT, ExLucas 就是在本来不能用 Lucas 的时候用 Lucas, 所以 ExACM 顾名思义, 就是在不能 ACM 的时候 ACM.

一般这种赛制是由 OI 赛制或 IOI 赛制又或者 CF, AT 等赛制演变而来的. 我们知道, 这种赛制下如果强制进行 ACM 可能会被反作弊, 所以 ExACM 的核心就是在 ACM 的情况下保证每个人的答案和正常情况下一样. 并且在 ACM 的加持下获得更优的比赛复杂度.

一般 ExACM 队伍人数以 $6-8$ 人为最佳. 队伍可能需要一些 unrated 的账号进行一些特殊工作. 一般有秒题员, 调试员, 领航员, 试错员, Hack 员, 证明员等分工.

秒题员负责迅速阅读前面的签到题并且广播正解防止队员在弱智题上降智和由于读题速度导致罚时过多.

调试员负责在队员在代码有问题的时候进行辅助调试, 一般是没有切题任务并且代码能力较强并且已经完成自己代码的队员.

领航员在大多数情况下是由自愿放弃上分的队员用 unrated 账号报名并且倒序开题的人. 他们用大部分时间去钻研难题, 并且尽可能地让队员在最少时间内完成后面难题的代码, 避开不可做的坑题.

试错员在有队员对某个题有可能正确但无法证实的做法时, 由试错员在 unrated 账号提交, 如果不希望通过后为了防止被防作弊系统干掉而重新写代码, 那么试错员会增加一个无关紧要的特判, 最后自己将自己 Hack 掉.

Hack 员则是负责在错解出现时发现并且指出其中的问题所在, 构造数据以便于队员能够尽快纠正错解. 在 OI 赛制的比赛中, 考虑到有时候没有大样例或大样例不够强, 需要有数据验证队员解的正确性和效率. Hack 员还需要造数据并且完成暴力代码以供对拍.

证明员会在队员用不明所以的算法通过某个题之后钻研做法的本质并且证明它的正确性, 更加明白自己做法的本质可以修正一些小 Bug, 防止 FST.

### BMP 图像的编码

一般前 $14$ 字节记录文件类型, 文件大小, 数据起始相对位置.

之后的 $40$ 字节 (也存在别的大小, 但是大部分情况是 $40$), 记录的是图片的长宽, 色深, 压缩方式, 数据大小, DPI 等信息.

接下来, 对于某些格式的图像, 会有存在调色盘, 大小取决于前面给定的信息, 每个颜色占用 $4$ 个字节, 分别表示红绿蓝和最后的空位.

调色盘结束后, 会从文件头规定的数据起始位置开始记录像素信息, 每个像素占的位数也在前面给出.

下面是一篇生成 $24$ 位的 $512 * 512$ 的图像的代码:

注意 `wb` 指的是以二进制文件写入, 这样做可以防止输出 `0x0A` 的时候被程序加上 `0x0D` 导致一些问题.

```cpp
#include <iostream>
#include <cmath>
using namespace std;
const double Pi(acos(-1)), SqTwo(sqrt(2));
struct BITMAPFILEHEADER {
  unsigned char bfType[2] = {66, 77};         // must be "BM"
  unsigned char bfSize[4] = {54, 0, 12, 0};   // the size of the bmp file
  unsigned char UseLess[4] = {0,0,0,0};       // all bytes are 00
  unsigned char bfOffBits[4] = {54, 0, 0, 0}; // the offset to the bitmap data
} FileHeader;

struct BITMAPINFOHEADER {
  unsigned char biSize[4] = {40, 0, 0, 0};            // the size of BITMAPINFOHEADER
  unsigned char biWidth[4] = {0, 2, 0, 0};            // width (pixels)
  unsigned char biHeight[4] = {0, 2, 0, 0};           // height (pixels)
  unsigned char biPlanes[2] = {1, 0};                 // color planes
  unsigned char biBitCount[2] = {24, 0};              // bits per pixel
  unsigned char biCompression[4] = {0, 0, 0, 0};      // type of compression (0 is no compression)
  unsigned char biSizeImage[4] = {0, 0, 12, 0};       // the origin size of the bitmap data (before compression)
  unsigned char biXPelsPerMeter[4] = {196, 14, 0, 0}; // horizontal pixels per meter
  unsigned char biYPelsPerMeter[4] = {196, 14, 0, 0}; // vertical pixels per meter
  unsigned char biClrUsed[4] = {0, 0, 0, 0};          // the number of colors used
  unsigned char biClrImportant[4] = {0, 0, 0, 0};     // "important" colors, usually 0
} InfoHeader;
unsigned Hei, Wid;
struct Vect {
  double X, Y;
  inline Init(unsigned x, unsigned y) {X = x - 255.5, Y = y - 255.5; }
  inline double Deg() {return ((X < 0) ? Pi : 0) + ((X > 0 && Y < 0) ? (2 * Pi) : 0) + atan(Y / X); }
  inline double Len() {return sqrt((X * X) + (Y * Y));}
};
inline unsigned Gcd(unsigned x, unsigned y) {
  unsigned TmG;
  while (y) TmG = x, x = y, y = TmG % y;
  return x;
}
inline unsigned Sq(unsigned x) {return x * x;}
inline void Set(unsigned i, unsigned j) {
  unsigned char a[3];
  Vect b; b.Init(i, j);
  double F(sin((i + j) / 512.000 * Pi)), G(cos((511 - i + j) / 512.000 * Pi)), H(sin(b.Deg()));
  a[0] = min(255, (int)((H + 1) * 128));
  a[1] = min(255, (int)((F + 1) * 128));
  a[2] = min(255, (int)((G + 1) * 128));
  fwrite(a, 3, 1, stdout);
}
int main() {
  freopen("My.bmp", "wb", stdout);
  fwrite((char *)&FileHeader, sizeof(FileHeader), 1, stdout);
  fwrite((char *)&InfoHeader, sizeof(InfoHeader), 1, stdout);
  Hei = 512, Wid = 512;
  for (unsigned i(0); i < Hei; ++i) {
    for (unsigned j(0); j < Wid; ++j) {
      Set(i, j);
    }
  }
  return 0;
}
```

### [CF1658E Gojou and Matrix Game](https://codeforces.com/contest/1658/problem/E)

这场我用别人的 unrated 号作为 ExACM 的领航员. 上来看 E, 一开始就往倒序 DP 想了, 写了一个 $O(n^6)$ 做法. 在向正解越走越远的时候, 我开始从博弈的角度思考.

试想有一个点, 选它之后不能选到其它的比它大的点, 那么先手选这个点之后, 后手选的一定比它小, 而先手第二次又可以选这个点, 因此这个策略可以让先手必胜. 因此这种点即为必胜点. 而和这个点距离大于 $k$ 的所有点都是必败点.

对于没有确定的点, 称之为未知点. 我们发现所有未知点构成一个子问题, 因为先手选择一个未知点, 后手不是选择必败点就是选择未知点. 对于后手来说, 选择必败点一定失败, 而选择权值更大的未知点则可以有机会胜利. 如果后手无法选择更大的未知点, 那么他必败, 因为先手每次可以都选他一开始选择的点, 则先手每次选择的这个点也是必胜点. 我们知道所有和必胜点距离大于 $k$ 的点都是必败点, 所以又确定了一批点的状态.

我们按权值从大到小一次考虑每个点, 如果这个点先前没有被确定为必败点, 它就是必胜点, 我们用它去标记别的点为必败, 如果先前已经被确定为必败点, 那么我们直接跳过不考虑.

接下来问题就是如何快速维护整个棋盘. 我们发现每次操作相当于是将以自己为中心的矩形之外的未知点确定为必败点. 可是这个矩形是 $45$ 度旋转的, 我们无法进行维护. 考虑到可以把矩阵旋转 $45$ 度, 然后纵横等比例扩展 $\sqrt 2$, 原来的 $(i, j)$ 在新矩阵上为 $(i + j, n + j - i)$, 每次相当于进行 $4$ 次矩形覆盖. 可以使用二维线段树解决这个问题. 

```cpp
unsigned Pos[4000005][2];
unsigned a[2005][2005];
char Ans[2005][2005];
unsigned m, n;
unsigned A, B, C, D, t, Up, Down, Left, Right;
unsigned Cnt(0), Tmp(0);
char Cur, Pre;
inline char Inrg() {
  if(C > Up) return 0;
  if(C < Down) return 0;
  if(D > Right) return 0;
  if(D < Left) return 0;
  return 1;
}
inline void Udt() {
  if(C > m) Down = max(C - m, Down);
  Up = min(C + m, Up);
  if(D > m) Left = max(D - m, Left);
  Right = min(D + m, Right);
}
signed main() {
  n = RD(), m = RD(), A = n * n, Down = Left = 1, Up = Right = (n << 1);
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j) Pos[a[i][j] = RD()][0] = i, Pos[a[i][j]][1] = j;
  for (unsigned i(A); i; --i) {
    C = Pos[i][0] + Pos[i][1], D = n + Pos[i][1] - Pos[i][0];
    if(Inrg()) Udt(), Ans[Pos[i][0]][Pos[i][1]] = 1;
  }
  for (unsigned i(1); i <= n; ++i) {
    for (unsigned j(1); j <= n; ++j) putchar(Ans[i][j] ? 'M' : 'G'); 
    putchar(0x0A);
  }
  return Wild_Donkey;
}
```

## Day $-5$ Mar 29, 2022, Tuesday

> 模拟赛爆大零

### A

T1 其实已经想出来了, 苦于没写过历史信息和就摆烂了.

每个合法区间的贡献是值域区间大小减去区间长度, 所以我们只需要求出询问区间的最大值之和, 最小值之和, 长度之和即可.

我们处理每个点做右端点, 可以有权值的左端点, 发现这个东西是单调的, 可以双指针扫一遍求出. 记 $i$ 做右端点的最小左端点是 $Left_i$. 我们可以扫描线预处理每个点做右端点的所有子区间的贡献值, 记为 $f_i$.

对于 $i, Left_i \in [L, R]$, 因为 $Left$ 的单调性, 我们可以直接对这些 $i$ 二分查找到边界, 然后对 $f_i$ 进行区间求和. 对于剩下的一段 $Left_i < L$ 的部分, 这里面的所有子区间都是合法的, 我们用维护历史版本和的可持久化线段树对这些区间的最大值和最小值进行求和, 然后算出它们区间长度的和, 即可对询问进行回答.

### B

这个东西一眼以为是个 WQS, 结果发现没有凸性.

分析性质发现如果一个人接水时间小于左边的人, 它可以直接变成左边的人的时间, 不会对答案产生影响. 所以不考虑段数要求最优的方案就是在每个前缀最大值的位置断开, 每相邻两个断开点之间为一段.

我们所做的就是在这个方案的基础上将相邻的段合并. 所以一个已经很明显的 DP 是这样的:

$$
f_{i, j} = \min_{k = 0}^{j - 1}(f_{i - 1, k} + a_jL_{k + 1})
$$

其中, $f_{i, j}$ 意义是, 将前 $j$ 段, 合并到 $i$ 组的最小代价. $a_i$ 表示的是第 $i$ 段的接水时间, 随着 $i$ 的增加而增加, $l_i$ 表示第 $i$ 段的长度, $L_i$ 是 $l_i$ 的后缀和.

这个时候我们可以写一个 $O(n^2R)$ 的 DP, 一不小心拿到 $80'$ 的好成绩.

如果我们把最优方案的 $i$ 输出会发现, 这个数不大, 一般不超过 $20$, 于是我们就把 $R$ 和 $30$ 取一个最小值, 发现瞬间通过了此题. 

```cpp
unsigned a[500005], l[500005], L[500005];
unsigned long long f[2][500005], Ans(0x3f3f3f3f3f3f3f3f);
unsigned m, n(0), A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  A = RD(), m = min((unsigned)30, RD()), B = 0;
  for (unsigned i(1); i <= A; ++i)
    if((C = RD()) > B) B = a[++n] = C, l[n] = 1;
    else ++l[n]; 
  for (unsigned i(n); i; --i) L[i] = L[i + 1] + l[i];
  unsigned long long *Cur(f[1]), *Pre(f[0]);
  memset(Pre, 0x3f, ((n + 1) << 3)), Pre[0] = 0;
  for (unsigned i(1); i <= m; ++i, swap(Cur, Pre)) {
    memset(Cur, 0x3f, ((n + 1) << 3));
    for (unsigned j(1); j <= n; ++j) for (unsigned k(0); k < j; ++k)
      Cur[j] = min(Cur[j], Pre[k] + (unsigned long long)a[j] * L[k + 1]);
    Cur[0] = 0x3f3f3f3f3f3f3f3f; if(Ans > Cur[n]) Ans = min(Ans, Cur[n]), A = i;
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

我们思考减少 DP 阶段数的正确性. 如果一个方案中, 一个组被分成两个组, 假设分界线左边的长度为 $l$, 则分界线右边长度为 $n - l$. 左边组的接水时间是 $a_1$, 右边组接水时间是 $a_2$, 则分成两个组能使答案更优的条件是:

$$
\begin{aligned}
a_1n + a_2(n - l) &< a_2n\\
a_1n &< a_2l\\
\frac{n}{l} &< \frac{a_2}{a_1}\\
\end{aligned}
$$

每次决策分开, 都会使之后的 $a_1$ 最多是原来的 $\dfrac ln$ 倍, 而 $l$ 递减. 最坏的情况, 也就是贪心过程中使上面式子成立次数最多的情况. 我们需要使 $l$ 减少速度尽可能小, 也就是是从最后开始, 每次减少 $1$, 为了使 $a_1$ 减少次数尽可能小, 需要在 $l$ 越大的时候减少越好. 也就是每次让 $a_n$ 乘以 $\displaystyle \prod_{i = 1}^x\dfrac{n - i}n$, 直到为 $0$ 为止. 因此最多的组数便是使下面式子成立的最大的 $x$:

$$
\begin{aligned}
Maxa &\geq \prod_{i = 1}^{x} \frac {n}{n - i}\\
\end{aligned}
$$

对于最大的 $n = 500000$, $Maxa = 10^9$, $Maxx = 4545$. 但是发现这个东西是整除意义下的, 所以这时的 $Maxx$ 变成了 $4050$. 因此我们把这个东西卡满, 有效的 $R$ 也只有 $4050$.

为了证明有效 $R$ 的复杂度, 我们考虑最优方案第 $i$ 组接水时间是 $a_i$, 人数后缀和是 $L_i$, 那么总代价是:

$$
\sum_{i = 1}^n L_ia_i
$$

每次合并两个相邻的组相当于将答案减去 $a_iL_i + a_{i + 1}L_{i + 1}$, 加上 $a_{i + 1}L_{i}$, 因为方案最优, 则对于所有正整数 $i < n$ 有不等式:

$$
\begin{aligned}
a_iL_i + a_{i + 1}L_{i + 1} &\leq a_{i + 1}L_{i}\\
\frac{a_i}{a_{i + 1}} + \frac{L_{i + 1}}{L_i} &\leq 1
\end{aligned}
$$

则 $L_i$ 比 $L_{i + 1}$ 增加多于一倍, $a_i$ 比 $a_{i + 1}$ 减少不少于 $\frac 12$ 两者至少发生一个. 因此组数不会多于 $\log_2(n) + \log_2(Maxa) = O(\log nMaxa)$.

但是即使是这样, 我们用 $O(n^2 \log nMaxa)$ 的复杂度也无法通过特殊构造的数据. 发现每次 DP 可以使用斜率优化到 $O(n\log Maxa)$.

$$
f_{i, j} = \min_{k = 0}^{j - 1}(f_{i - 1, k} + a_jL_{k + 1})
$$

用李超树维护所有直线 $y = L_{k + 1}x + f_{i - 1, k}$, 直接查询 $x = a_j$ 时的最小值即可.

这样即可 $O(n\log Maxa^2n)$ 地通过此题了.

```cpp
unsigned a[10005], l[10005], L[10005];
unsigned long long f[10005], N, D, Ans(0x3f3f3f3f3f3f3f3f);
unsigned m, n(0), C, t;
unsigned Cnt(0), Tmp(0);
struct Line {
  unsigned long long K, B;
  inline unsigned long long F(const unsigned long long y) const {return B + y * K;}
  inline const char Com (const Line &x, const unsigned long long y) const {
    return F(y) < x.F(y);
  }
}A;
struct Node {
  Node *LS, *RS;
  Line Val;
}T[100005], *CntT(T);
inline void Ins(Node* x, unsigned L, unsigned R) {
  if(L == R) {if(A.Com(x->Val, L)) x->Val = A; return; }
  unsigned Mid((L + R) >> 1);
  if(A.Com(x->Val, Mid)) swap(x->Val, A);
  if(A.K > x->Val.K) {
    if(!(x->LS)) x->LS = ++CntT, x->LS->Val = x->Val, x->LS->LS = x->LS->RS = NULL;
    Ins(x->LS, L, Mid);
  } else {
    if(!x->RS) x->RS = ++CntT, x->RS->Val = x->Val, x->RS->LS = x->RS->RS = NULL;
    Ins(x->RS, Mid + 1, R);
  }
  return;
}
inline void Find(Node* x, unsigned L, unsigned R) {
  D = min(D, x->Val.F(C));
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  if(C <= Mid) {if(x->LS) Find(x->LS, L, Mid);}
  else {if(x->RS) Find(x->RS, Mid + 1, R);}
}
signed main() {
  D = RD(), m = min((unsigned)20, RD()), N = 0;
  for (unsigned i(1); i <= D; ++i)
    if((C = RD()) > N) N = a[++n] = C, l[n] = 1;
    else ++l[n];
  for (unsigned i(n); i; --i) L[i] = L[i + 1] + l[i];
  memset(f, 0x3f, ((n + 1) << 3)), f[0] = 0, Ans = 0x3f3f3f3f3f3f3f3f;
  for (unsigned i(1); i <= m; ++i) {
    T->LS = T->RS = NULL, CntT = T, T->Val = {0, 0x3f3f3f3f3f3f3f3f};
    for (unsigned j(1); j <= n; ++j) A = {L[j], f[j - 1]}, Ins(T, 1, N);
    for (unsigned j(1); j <= n; ++j) C = a[j], D = 0x3f3f3f3f3f3f3f3f, Find(T, 1, N), f[j] = min(D, f[j]);
    Ans = min(f[n], Ans);
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```