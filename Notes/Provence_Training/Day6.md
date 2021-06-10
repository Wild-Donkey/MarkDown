# Day6

由于这一天的 `T1` 过于值得整理, 一道题就干了我 $10000$ 个字符的篇幅, 所以貌似今天只整了一道题, 但是这道题费了我一整天的时间, 还连累黄文鹤 `00:30` 都没睡. 这就是 `Day6` 了.

## City

给四个点, $s_1$, $s_2$, $t_1$, $t_2$, 可以进行 $k$ 次操作, 每次操作可以给一条边速度加 $1$, 一个条速度为 $v$ 的边的通过时间为 $\frac 1v$. 求进行操作后, 两个起点分别到两个终点的时间和最小值.

因为操作在两条路径的公共边上时收益更大, 所以要求两条路径的交的长度.

但是我也知道要这么做, 但是我不会求, 然后假设了一些好用的结论, 都被自己 Hack 了.

但是我赌他的枪里没有子弹

`12:30` 花了 $10min$ 写了个 BFS 狗急跳墙, 只考虑路径没有交的情况, 能得多少分随缘.

他的枪里果然没子弹

我的错误算法得了 $85'$, 我人都傻了. (可能是因为这是 ICPC 题, $95' = 0'$, 所以没有出太多离谱的数据).

```cpp
unsigned n, m, Mn, A, B, Q[10005], Hd(0), Tl(0), Times(0), Total, S1, S2, T1, T2;
double Ans1, Ans2, Ans;
char flg(0);
struct InEdge {
  unsigned From, To;
  inline const char operator<(const InEdge &x) const{
    return (this->From ^ x.From) ? (this->From < x.From) : (this->To < x.To);
  }
}IE[5005];
struct Edge;
struct Node {
  Edge *Fst;
  unsigned Dis1, Dis2;
}N[5005];
struct Edge {
  Edge *Nxt;
  unsigned Used;
  Node *To;
}E[10005], *CntE(E);
inline void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst, x->Fst = CntE;
  CntE->To = y;
  return;
}
int main() {
  n = RD(), m = RD(), Mn = RD();
  memset(N, 0x3f, sizeof(N));
  for (register unsigned i(1); i <= m; ++i)
    A = RD(), B = RD(), IE[i].From = min(A, B), IE[i].To = max(A, B);
  sort(IE + 1, IE + m + 1);
  for (register unsigned i(1); i <= m; ++i)
    if((IE[i].From ^ IE[i - 1].From) || (IE[i].To ^ IE[i - 1].To))
      Link(N + IE[i].From, N + IE[i].To), Link(N + IE[i].To, N + IE[i].From);
  S1 = RD(), T1 = RD(), S2 = RD(), T2 = RD();
  Q[++Tl] = S1, N[S1].Dis1 = 0, N[S2].Dis2 = 0;
  Node *now; Edge *Sid;
  while (Hd < Tl) {
    now = N + Q[++Hd];
    Sid = now->Fst;
    while (Sid < E + 20000) {
      if(Sid->To->Dis1 > 1000000000) {
        Sid->To->Dis1 = now->Dis1 + 1;
        Q[++Tl] = Sid->To - N;
      }
      Sid = Sid->Nxt;
    }
  }
  Hd = Tl = 0, Q[++Tl] = S2;
  while (Hd < Tl) {
    now = N + Q[++Hd], Sid = now->Fst;
    while (Sid < E + 20000) {
      if(Sid->To->Dis2 > 1000000000) 
        Sid->To->Dis2 = now->Dis2 + 1, Q[++Tl] = Sid->To - N;
      Sid = Sid->Nxt;
    }
  }
  Ans1 = N[T1].Dis1, Ans2 = N[T2].Dis2;
  Total = N[T1].Dis1 + N[T2].Dis2;
  Times = 2;
  if(!Total) {printf("0.00000000000\n"); return 0;}
  for (;Mn > Total; Mn -= Total) ++Times;
  Ans = (double)(Total * (Total - Mn)) / ((Times - 1) * Total) + ((double)Mn / Times);
  printf("%.11lf\n", Ans);
  return 0;
}
```

正解(费这么大劲多拿个 $15'$ 真不如 $10min$ 写个 BFS 来得爽快): 以每个点为起点, 跑 $O(n)$ 的 BFS, 这样就能 $O(n^2)$ 求全源最短路了. 容易知道, 两条路径的交一定是一段连续的路径, 因为如果分成多段, 从一段尾两条路径会分开, 到另一段开头合并, 这两段分开的一定可以走其中较短的一段, 不会使答案更劣. 所以只要枚举这一段公共路径的两个端点即可求出路径的交 $a$ 和交对并的补 $b$, 分别是被两条路径都经过的长度和两条路径单独经过的长度. 对于每个 $a$ 值, 维护和它一起出现的最小的 $b$ 值, 因为对同一个 $a$ 来说, $b$ 越小答案越优. 写出最后的时间和 $y$ 对操作放到 $a$ 的数量 $x$ 的函数:

值得一提的一个细节: 当枚举两个端点时, 会有情况是 $Dis_{s_1, i} + Dis_{t_1, j} < Dis_{s_1, j} + Dis_{t_1, i}$ 并且 $Dis_{s_2, j} + Dis_{t_2, i} < Dis_{s_2, i} + Dis_{t_2, j}$ 这是因为虽然路径交已经确定, 但是两条路径进入这段路径的方向没确定, 需要分类讨论每个点是从 $i$ 端进, $j$ 端出, 还是从 $j$ 端进, $i$ 端出.

$$
y = \frac{2(x\%a)}{2 + \lfloor \frac xa \rfloor} + \frac{2(a - {x\%a})}{1 + \lfloor \frac xa \rfloor} + \frac{(k - x)\%b}{2 + \lfloor \frac {(k - x)}b \rfloor} + \frac{b - {(k - x)\%b}}{1 + \lfloor \frac {(k - x)}b \rfloor}
$$

我们可以三分这个 $x$ 求出对于某个三元组 $(a, b, k)$ 最小的 $y$. 因为 $k$ 不变, 每个 $a$ 对应唯一的 $b$, 所以这样的三元组一共有 $n$ 个, 可以 $O(nlog_{\frac{3}{2}}^k)$ 处理得到答案. 最后的复杂度 $O(n^2 + nlog_{\frac{3}{2}}k)$.

很显然这个题原来是 $3s$, 但是场上要开 `-O2`, 所以改到了 $1s$, 理论上不开 `-O2` 是过不了的, 千辛万苦调完了之后, 只得了 `65'`, 剩下的都超时了, 开了 `-O2` 能过, 所以这就是正解了, 其中加了判重边的操作使程序更加鲁棒 (题目说了有重边). 

```cpp
unsigned n, m, N2, Mn, A, B, Dis[5005][5005], Hd(0), Tl(0), Q[5005], Total, S1, S2, T1, T2, Minb[10005], TmpA(0), L, R, Mid1, Mid2;
double Ans(1e9);
char flg(0);
struct InEdge {
  unsigned From, To;
  inline const char operator<(const InEdge &x) const{return (this->From ^ x.From) ? (this->From < x.From) : (this->To < x.To);}
}IE[5005];
struct Edge;
struct Node {Edge *Fst; unsigned Dis1, Dis2;}N[5005], *now;
struct Edge {Edge *Nxt; unsigned Used; Node *To;}E[10005], *CntE(E), *Sid;
inline void Link(Node *x, Node *y) {(++CntE)->Nxt = x->Fst, x->Fst = CntE, CntE->To = y;}
inline double Calc(unsigned x) {
  register unsigned Kx(Mn - x);
  register double Div1(x / B), Div2(Kx / A), Mod1(x % B), Mod2(Kx % A);
  return 2 * (Mod1 / (2 + Div1) + (B - Mod1) / (1 + Div1)) + Mod2 / (2 + Div2) + (A - Mod2) / (1 + Div2);
}
int main() {
  n = RD(), m = RD(), Mn = RD(), N2 = (n << 1); 
  memset(Dis, 0x3f, sizeof(Dis)), memset(Minb, 0x3f, sizeof(Minb));
  for (register unsigned i(1); i <= m; ++i)
    A = RD(), B = RD(), IE[i].From = min(A, B), IE[i].To = max(A, B);
  sort(IE + 1, IE + m + 1);
  for (register unsigned i(1); i <= m; ++i)
    if((IE[i].From ^ IE[i - 1].From) || (IE[i].To ^ IE[i - 1].To))
      Link(N + IE[i].From, N + IE[i].To), Link(N + IE[i].To, N + IE[i].From);
  S1 = RD(), T1 = RD(), S2 = RD(), T2 = RD();
  for (register unsigned i(1); i <= n; ++i) {
    Hd = Tl = 0, Q[++Tl] = i, Dis[i][i] = 0;
    while (Hd < Tl) {
      now = N + Q[++Hd], Sid = now->Fst;
      while (Sid) {
        if(Dis[i][Sid->To - N] > 1000000000)
          Dis[i][Sid->To - N] = Dis[i][now - N] + 1, Q[++Tl] = Sid->To - N;
        Sid = Sid->Nxt;
      }
    }
  }
  Minb[Dis[S1][T1] + Dis[S2][T2]] = 0;
  for (register unsigned i(1); i <= n; ++i) {
    for (register unsigned j(1); j <= n; ++j) {
      TmpA = min(Dis[S1][i] + Dis[T1][j], Dis[S1][j] + Dis[T1][i]) + min(Dis[S2][i] + Dis[T2][j], Dis[S2][j] + Dis[T2][i]);
      if(TmpA <= N2) {
        Minb[TmpA] = min(Minb[TmpA], Dis[i][j]);
      }
    }
  }
  if(!Minb[0]) {printf("0.00000000000\n"); return 0;}
  if(Minb[0] < 1000000000) Ans = 2 * ((double)(Mn % Minb[0]) / (2 + (Mn / Minb[0])) + (double)(Minb[0] - (Mn % Minb[0])) / (1 + (Mn / Minb[0])));
  for (register unsigned i(1); i <= N2; ++i) {
    if(Minb[i] > 1000000000) continue;
//    printf("%.11lf\n", Ans);
//    printf("A %u B %u\n", i, Minb[i]);
    L = 0, R = Mn, A = i, B = Minb[i];
    if(!B) {Ans = min(Ans, (double)(Mn % i) / (2 + (Mn / i)) + (double)(i - (Mn % i)) / (1 + (Mn / i))); continue;}
    while (L + 2 < R) {
      Mid1 = L + ((R - L + 2) / 3), Mid2 = R - ((R - L + 2) / 3);
//      printf("[%u, %u] (%u, %u)\n", L, R, Mid1, Mid2);
      if(Calc(Mid1) > Calc(Mid2)) {
        L = Mid1;
      } else {
        R = Mid2;
      }
    }
    Ans = min(min(Ans, Calc(L + 2)), min(Calc(L), Calc(L + 1)));
  }
  printf("%.11lf\n", Ans);
  return 0;
}
```

但是我还是不满意, 作为历城二中最快的男人, 怎么能被卡常? 我把本地的 `-O2` 关掉, 删掉了好多使程序鲁棒的细节 (甚至不能保证快读的正确性), 只为过这 $20$ 点, 将大部分的整数变成 `unsigned short`, 本来想用 `float` 搞浮点数, 但是又被卡精度了. 最后感谢刘少卿的 `unsigned short &` 的引用, 避免了数组寻址的重复计算. 最后将大部分比较操作改成位运算, 最终在没有 `-O2` 的情况下 AC. (期间想看看 std 的表现如何, 交了一发不开 `-O2` 的, 结果才得了 $50'$, 还比不上我随手写的鲁棒程序, 我爆踩 Std). 接下来是这份非常让人满意的代码:

```cpp
#include<algorithm>
#include<iostream>
#include<cstdio>
#include<cmath>
#include<set>
#include<cstring>
using namespace std;
const unsigned short _0(0), _1(1), _2(2);
const double __1(1), __2(2); 
inline unsigned short RD() {
	unsigned short InTmp(0); char InCh(getchar());
	while (InCh < '0' || InCh > '9') {
    InCh = getchar();
  }
  while (InCh >= '0') {
    InTmp = (InTmp << 3) + (InTmp << 1) + InCh - '0';
    InCh = getchar();
  }
  return InTmp;
}
unsigned short n, m, Dis[5005][5005], Hd(0), Tl(0), Q[5005], S1, S2, T1, T2, Minb[5005], TmpA(0), Top(0x3f3f), now, CntE(0), Sid, Fst[5005];
unsigned Mn, A, B;
double Ans(10000.0);
struct Edge {unsigned short To, Nxt;}E[10005];
inline void Link(unsigned short x, unsigned short y) {E[++CntE].Nxt = Fst[x], Fst[x] = CntE, E[CntE].To = y;}
inline double Calc(unsigned x) {
  register unsigned Kx(Mn - x);
  register double Div1(x / A), Div2(Kx / B), Mod1(x % A), Mod2(Kx % B);
  return __2 * (Mod1 / (_2 + Div1) + (A - Mod1) / (_1 + Div1)) + Mod2 / (_2 + Div2) + (B - Mod2) / (_1 + Div2);
}
signed main() {
  n = RD(), m = RD(), scanf("%u", &Mn);
  memset(Dis, 0x3f, sizeof(Dis)), memset(Minb, 0x3f, sizeof(Minb));
  for (register unsigned short i(1); i <= m; ++i)
    A = RD(), B = RD(), Link(A, B), Link(B, A);
  S1 = RD(), T1 = RD(), S2 = RD(), T2 = RD();
  for (register unsigned short i(1); i <= n; ++i) {
    Hd = Tl = _0, Q[++Tl] = i, Dis[i][i] = _0;
    while (Hd < Tl) {
      now = Q[++Hd], Sid = Fst[now];
      register unsigned short &Addin(Dis[i][now]);
      while (Sid) {
        if(Dis[i][E[Sid].To] & 0x2000)
          Dis[i][E[Sid].To] = Addin + _1, Q[++Tl] = E[Sid].To;
        Sid = E[Sid].Nxt;
      }
    }
  }
  Minb[0] = Dis[S1][T1] + Dis[S2][T2];
  for (register unsigned short i(1); i <= n; ++i) {
    register unsigned short &AddiS1(Dis[i][S1]), &AddiT1(Dis[i][T1]), &AddiS2(Dis[i][S2]), &AddiT2(Dis[i][T2]);
    for (register unsigned short j(1); j <= n; ++j) {
      register unsigned short &Addij(Dis[i][j]);
      if(Addij <= n) {
        TmpA = min(AddiS1 + Dis[T1][j], Dis[S1][j] + AddiT1) + min(AddiS2 + Dis[T2][j], Dis[S2][j] + AddiT2);
        Minb[Addij] = min(Minb[Addij], TmpA);
      }
    }
  }
  if(!Minb[0]) {printf("0.00000000000\n"); return 0;}
  if(Minb[_0] ^ 0x3f3f) Ans = (double)(Mn % Minb[_0]) / (_2 + (Mn / Minb[_0])) + (double)(Minb[_0] - (Mn % Minb[_0])) / (_1 + (Mn / Minb[_0]));
  for (register unsigned i(1); i <= m; ++i) {
    if(Minb[i] & 0x2000) continue;
    register unsigned L(0), R(Mn), Mid1, Mid2;
    A = i, B = Minb[i];
    if(B > Top) {continue;}
    Top = B;
    if(!B) {Ans = min(Ans, __2 * ((double)(Mn % i) / (_2 + (Mn / i)) + (double)(i - (Mn % i)) / (_1 + (Mn / i)))); continue;}
    if(Mn == 1) {Ans = min(Ans, Calc(1));continue;}
    while (L + 2 < R) {
      Mid1 = L + ((R - L + 2) / 3), Mid2 = R - ((R - L + 2) / 3);
      if(Calc(Mid1) > Calc(Mid2)) L = Mid1;
      else R = Mid2;
    }
    Ans = min(min(Ans, Calc(L + _2)), min(Calc(L), Calc(L + _1)));
  }
  printf("%.11lf\n", Ans);
  return 0;
}
```

感谢黄文鹤提供的 `C++` 版的 `Special Judge`.
