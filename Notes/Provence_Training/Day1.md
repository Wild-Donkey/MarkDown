# Day1

## Majiang

输入一个 `01` 串 $S_1$, 需要输出一个最短的 `01` 串 $S_2$, 使得 $S_2$ 在 $S_1$ 中从未出现过.

如果有多个可行的解, 你需要输出字典序最小的那一个.

一开始看到后, 立马想到 SAM (只要是和字符串沾点边就能扯上 SAM, 更别说这个 $1.6 * 10^7$ 的数据范围明摆着是线性算法). 发现可以在 SAM 上 BFS, 遇到首个不是两个转移都有的点说明找到了一个符合要求的节点, 记录搜索路径得到答案. 算了算空间很紧张, 但是貌似问题不大, 我万万没想到我忘记了 SAM 的点数是字符串长度的两倍, 于是数组开小了, 被卡到 $50'$. 但是我万万没想到的是, 给样例的 $10'$ 我竟然没拿到, 因为我的 SAM 把 Linux 的换行符识别成了 `0`, 出现了子串 `110`, 所以就不能输出 `110` 了, 所以输出的是 `111`. 但是在 $10^6$ 的大测试点中, 最后加上一个 `0` 引起答案变化的可能性很小, 所以没有显现出问题. 于是我成了唯一一个 AC 了后面的点, 结果样例分没要的 $40'$.

最离谱的是我一个半小时连切带写加调, 然后卡常卡空间用了 $30min$, 最后还是挂了, 我真是吐了.

在考场代码的基础上微调后的 $50'$ 代码 (被时间空间常数卡到 $50'$):

```cpp
#include<algorithm>
#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;
unsigned n(1), Hd(0), Tl(0), Cnt(0), Q[16777220];
char a[16777220], flg(0);
struct Node {
  Node *Son[2], *Fail;
  unsigned Dep;
  char Vis;
}N[16777220], *CntN(N), *Last(N);
int main() {
  fread(a + 1, 1, 16777218, stdin);
  for (;a[n] <= '0'; ++n) a[n] -= '0';
  N[0].Dep = 0, --n;
  for (register unsigned i(1); i <= n; ++i) { 
    (++CntN)->Dep = Last->Dep + 1;
    while(Last) {
      if(Last->Son[a[i]]) break;
      Last->Son[a[i]] = CntN, Last = Last->Fail;
    }
    if(Last){
      register Node *Source(Last->Son[a[i]]);
      if(Source->Dep == Last->Dep + 1) CntN->Fail = Source, Last = CntN; 
      else {
        (++CntN)->Dep = Last->Dep + 1, CntN->Son[0] = Source->Son[0], CntN->Son[1] = Source->Son[1], CntN->Fail = Source->Fail, Source->Fail = CntN; 
        while(Last) {
          if(Last->Son[a[i]] != Source) break;
          Last->Son[a[i]] = CntN, Last = Last->Fail;
        }
        (CntN - 1)->Fail = CntN, Last = CntN - 1;
      }
    } else CntN->Fail = N, Last = CntN;
  }
  Q[++Tl] = 0;
  N->Fail = NULL;
  register Node *now;
  while (Hd < Tl) {
    now = N + Q[++Hd];
    if(now->Son[0] && now->Son[1]) {
      if(!(now->Son[0]->Vis)) Q[++Tl] = now->Son[0] - N, now->Son[0]->Vis = 1, now->Son[0]->Fail = now;
      if(!(now->Son[1]->Vis)) Q[++Tl] = now->Son[1] - N, now->Son[1]->Vis = 1, now->Son[1]->Fail = now;
    } else break;
  } 
  a[++Cnt] = ((now->Son[0]) ? '1' : '0');
  while (now - N) a[++Cnt] = ((now == now->Fail->Son[0]) ? '0' : '1'), now = now->Fail;
  for (register unsigned i(Cnt); i; --i) putchar(a[i]);
  putchar('\n');
  return 0;
}
```

这个题的正解被 $58$ 级巨神何彦霖场切了, 但是不幸被卡常.

可以感性理解答案的长度不会比 $logn + 1$ 长, 因为如果 $logn + 1$ 长度的 01 串有 $2n$ 个, 如果说所有的串在每个位置不重复地出现, 也不可能全部出现. 我们可以线性处理 $2n$ 个字串, 找出所有没有在原串中出现的子串. 为了方便处理, 我们将 01 串当成二进制数, 以整数的形式存起来.

一个长 $x$ 的串有 $2$ 个长度为 $x - 1$ 的字串, 在已经出现的串中, 两个 $x - 1$ 长度的字串都出现了. 如果存在没有出现的长度 $x - 1$ 的子串作为另外的长度为 $x$ 的串的子串, 这个长度为 $x$ 的字串也一定没出现过.

所以对于一个 $x - 1$ 长度出现过的串, 一定存在至少 $1$ 个长度为 $x$ 的子串包含它, 我们用前面处理的所有出现过的长 $x$ 的串掐头去尾得到所有的出现过的长度为 $x - 1$ 的子串. 每一次缩短长度, 子串的数量复杂度会减半.

存每一个长度的子串出现的字典序最小的子串, 当长度 $x$ 缩小到这个长度所有串都出现过时, 答案就是 $x + 1$ 长度的没出现过的字典序最小的子串.

然后是 AC 代码:

```cpp
#include<algorithm>
#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;
unsigned n(1), now(0), Ans(0), AnsLen(0);
char a[16777220], flg(0), Appear[16777220], Bucket[16777220];
inline void Print(unsigned x, unsigned Len) {
  for (register unsigned i(Len - 1); i <= 0x3f3f3f3f; --i) putchar((x & (1 << i)) ? '1' : '0');
  putchar('\n');
}
int main() {
  fread(a + 1, 1, 16777218, stdin);
  for (;a[n] >= '0'; ++n) a[n] -= '0';
  --n;
  if(n <= 24) {
    unsigned Me(0);
    for (register unsigned i(1); i <= n; ++i) Me <<= 1, Me += a[i];
    Appear[Me] = 1;
    for (register unsigned i(n); i; --i) {
      memset(Bucket, 0, (1 << (i - 1)));
      for (register unsigned j((1 << i) - 1); j <= 0x3f3f3f3f; --j)
        if(!Appear[j]) Ans = j, AnsLen = i;
        else Bucket[j >> 1] = 1, Bucket[j & ((1 << (i - 1)) - 1)] = 1;
      if(AnsLen == i - 1) Print(Ans, AnsLen);
      else memcpy(Appear, Bucket, (1 << (i - 1)));
    }
    Print(Ans, AnsLen);
    return 0;
  }
  register unsigned Me(0);
  for (register short i(1); i <= 24; ++i) Me <<= 1, Me += a[i];
  Appear[Me] = 1;
  for (register unsigned i(25); i <= n; ++i) Me = ((Me & 8388607) << 1) + a[i], Appear[Me] = 1;
  for (register unsigned i(24); i; --i) {
    memset(Bucket, 0, (1 << (i - 1)));
    for (register unsigned j((1 << i) - 1); j <= 0x3f3f3f3f; --j) {
      if(!Appear[j]) Ans = j, AnsLen = i;
      else Bucket[j >> 1] = 1, Bucket[j & ((1 << (i - 1)) - 1)] = 1;
    }
    if(AnsLen == i - 1) {
      Print(Ans, AnsLen);
      break;
    } else memcpy(Appear, Bucket, (1 << (i - 1)));
  }
  Print(Ans, AnsLen); 
  return 0;
}
```

## [Dezhoupuke](https://www.luogu.com.cn/problem/P6106)

平面上有 $n$ 条线段.

共 $m$ 次询问, 每次询问给出一个边平行于坐标轴的矩形, 问每条与矩形有交的线段与矩形的交的长度之和与所有线段的长度之和的比值, 要求输出与标准答案的相对误差或绝对误差不超过 $10^6$. 保证任意两条线段没有交点或重合部分, 且存在斜率.

于是我场上就无脑写了 $O(mn)$ 的暴力, 喜提 $30'$.

暴力求出了线段所在直线的解析式, 也就是 $x + by + c = 0$, 把一道~~清新~~毒瘤的数据结构写出了漂亮的数学的感觉, 下面是考场 $30'$ 代码. 大样例能 $300s+$ 跑出正确答案也是神奇.

```cpp
unsigned n, m;
double All(0), Ans(0), A, B, C, D, Px1, Py1, Px2, Py2;
char flg(0);
struct Line {
  int X1, X2, Y1, Y2;
  double Len, b, c;   // x + by + c = 0;
}L[100005];
int main() {
	freopen("dezhoupuke.in", "r", stdin);
	freopen("dezhoupuke.out", "w", stdout);
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    L[i].X1 = RD();
    L[i].Y1 = RD();
    L[i].X2 = RD();
    L[i].Y2 = RD();
    A = L[i].X1 - L[i].X2;
    B = L[i].Y2 - L[i].Y1;
    All += sqrt((A * A) + (B * B));
    L[i].b = A / B;
    L[i].c = -(L[i].X1 + L[i].Y1 * L[i].b);
  }
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    Ans = 0;
    for (register unsigned j(1); j <= n; ++j) {
      Px1 = min(L[j].X1, L[j].X2);
      Px2 = max(L[j].X1, L[j].X2);
      Py1 = min(L[j].Y1, L[j].Y2);
      Py2 = max(L[j].Y1, L[j].Y2);
      if(Px1 < A) {
        Px1 = A;
        if(L[j].b < 0) {  // k > 0
          Py1 = max(Py1, (A + L[j].c) / (-L[j].b));
        } else {          // k < 0
          Py2 = min(Py2, (A + L[j].c) / (-L[j].b));
        }
      }
      if(Px2 > C) {
        Px2 = C;
        if(L[j].b < 0) {  // k > 0
          Py2 = min(Py2, (C + L[j].c) / (-L[j].b));
        } else {          // k < 0
          Py1 = max(Py1, (C + L[j].c) / (-L[j].b));
        }
      }
      if(Py1 < B) {
        Py1 = B;
        if(L[j].b < 0) {  // k > 0
          Px1 = max(Px1, -(L[j].b * B + L[j].c));
        } else {          // k < 0
          Px2 = min(Px2, -(L[j].b * B + L[j].c));
        }
      }
      if(Py2 > D) {
        Py2 = D;
        if(L[j].b < 0) {  // k > 0
          Px2 = min(Px2, -(L[j].b * D + L[j].c));
        } else {          // k < 0
          Px1 = max(Px1, -(L[j].b * D + L[j].c));
        }
      }
      if(Px1 >= Px2 || Py1 >= Py2) {
        continue;
      }
      Px1 -= Px2;
      Py1 -= Py2;
      Ans += sqrt((Px1 * Px1) + (Py1 * Py1));
    }
    printf("%.9lf\n", Ans/All);
  }
  return 0;
}
```

这题的正解是真的毒瘤.

在盘面上进行二维差分. 处理完了可以 $O(log(10^6))$ 查询.

设 $f_{i, j}$ 是坐标左下角到点 $(i, j)$ 所确定的矩形交的所有线段长度之和.

求 $f_{i, j}$ 需要分类讨论, 我们先处理斜率为正的, 对于斜率为负的, 我们只要反转一个坐标轴即可.

对于斜率为正的线段, 分为 $4$ 类讨论:

* 完全包含

* 完全无交

* 和右边界相交

* 和上边界相交

完全包含的情况是单调的, 即出现在 $f_{i, j}$ 中的也会出现在 $f_{i, j + 1}$ 中.

和上边界相交可以转置这个棋盘, 处理成和右边界相交的情况.

和右边界相交的情况可以扫描线解决, 因为线段不相交, 所以只要存在某个 $x$, 使得一条线段在另一条线段之上, 则线段上下关系不会随 $x$ 改变.

这样, 扫描线 + 平衡树可以做到 $O(logn)$ 回答询问, 加上预处理, 所以总复杂度 $O((n + m)logn)$, 但是常数巨大, 据说有 $24$ 倍.

## Jiangqi

给定一棵包含 $n$ 个结点的树, 每条边有一个权值.

共 $m$ 次询问, 第 $i$ 次询问给出 $t_i$ 个点, 考虑这些点两两之间简单路径经过的边的并集，问无序地选出两条不同的边, 使得边权相同的方案数.

这个题做的非常混乱, 因为我也不知道复杂度是多少, 所以写得非常放飞自我. 基本思想就是一个点一个点往上跳, 用 `set` 维护出现的边, 然后数组 $Cnt$ 统计权值出现次数, 最后一个一个弹 `set` 的同时, 清空 $Cnt$ 并且计算 $C(2, Cnt_i)$ 作为答案.

然后穿插着一些卡常的挣扎, 比如:

- 求 LCA 的时候选一个深度最大的点和其他的点求 LCA, 这样就能优化一定的常数. 果然排序不亏.

- 排序需要重载运算符, 但是我觉得如果直接移动整个 `Node`, 一定会非常慢, 所以我新建了一个结构体, 只存 `Node*`, 大大提高了排序效率.

- 本来求 LCA 也可以像统计答案一样往上一个一个跳, 但是我还是写了倍增.

注意特判询问只有一个点的时候.

考场上过了样例 $3$, 也就是说有 $40'$, 但是这显然和正解没什么关系, 记录代码留个纪念吧.

```cpp
unsigned n, m, t, Cnt[100005];
unsigned long long Ans(0);
char flg(0);
struct Node {
  Node *Fa[18], *Son, *Bro;
  unsigned Val, Depth;
}N[100005], *Ace;
struct Pointer {
  Node *Po;
  const inline char operator<(const Pointer &x) {
    return this->Po->Depth > x.Po->Depth; 
  }
}a[100005];
set<Node*> S;
void DFS (Node *x) {
  register Node *now(x->Son);
  while (now) {
    now->Depth = x->Depth + 1;
    for (register short i(0); now->Fa[i]; ++i) now->Fa[i + 1] = now->Fa[i]->Fa[i];
    DFS(now), now = now->Bro;
  }
  return;
}
Node *LCA(Node *x, Node *y) {
  if(x->Depth < y->Depth) swap(x, y);
  for (register short i(17); i >= 0; --i) if(x->Fa[i]) if(x->Fa[i]->Depth >= y->Depth)  x = x->Fa[i];
  if(x == y) return x;
  for (register short i(17); i >= 0; --i) if(x->Fa[i] != y->Fa[i]) x = x->Fa[i], y = y->Fa[i];
  return x->Fa[0];
}
int main() {
  n = RD();
  for (register unsigned i(2); i <= n; ++i) {
    N[i].Fa[0] = N + RD(), N[i].Val = RD();
    N[i].Bro = N[i].Fa[0]->Son;
    N[i].Fa[0]->Son = N + i; 
  }
  N[1].Depth = 1, DFS(N + 1);
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    t = RD(), Ans = 0;
    for (register unsigned T(1); T <= t; ++T) a[T].Po = N + RD();
    if(t == 1) {
      printf("0\n");
      continue;
    }
    sort(a + 1, a + t + 1);
    register Node *now, *Top(a[1].Po);
    for (register unsigned T(2); T <= t; ++T) {
      now = a[T].Po; 
      Ace = LCA(a[1].Po, a[T].Po);
      while (Top->Depth > Ace->Depth){
        if(S.find(Top) == S.end()) S.insert(Top), ++Cnt[Top->Val];
        Top = Top->Fa[0];
      }
      while (now->Depth > Ace->Depth){
        if(S.find(now) == S.end()) S.insert(now), ++Cnt[now->Val];
        now = now->Fa[0];
      }
    }
    while(!S.empty()) {
      now = *S.begin();
      if(Cnt[now->Val]) Ans += (((unsigned long long)Cnt[now->Val] * (Cnt[now->Val] - 1)) >> 1), Cnt[now->Val] = 0;
      S.erase(now);
    }
    printf("%llu\n", Ans);
  }
  return 0;
}
```

正解:

虚   树

直  接  去  势

## EC Final 2020 G

查询区间颜色数为奇数的子区间数.

也就是求所有子区间颜色数对 $2$ 取模的和. 扫描线扫描右端点, 维护左端点答案.

右端点右移一位, 相当于将所有区间右端加一个点. 在扫描线上进行修改, 于此同时统计这个右端点对答案的贡献.

维护对于 $a_i$ 来说, 上一个颜色 $a_i$ 出现的下标 $Last_i$, 每次 $r$ 右移, 扫描线将区间 $[a_r, r]$ 异或 $1$, 说明多了一种颜色, 查询时只要在每个版本 $r$ 求和即可.

## UOJ 群里的神秘题

查询序列中出现偶数次的数的异或和.

就是区间所有出现过的数的异或和和区间中出现奇数次的数的异或和的异或和.

出现奇数次的数的异或和就是区间异或和, 考虑如何求所有出现过的数的异或和.

可是竟然没讲如何维护这个异或和, 只说了和维护区间出现的数的数量相同的方法, 所以接下来是我的口胡:

虽然没讲, 但是大概率是个扫描线, 和上个题类似, 扫描右端点, 维护左端点. 不强制在线, 所以应该可以将询问离线下来, 保证 $O((n + m)log(n + m))$ 以内的复杂度.

## Loj3489 JOISC2021

$n$ 个队列, $m$ 个操作.

操作形如: $[l, r]$ 的队列中入队 $k$ 个 $c$ 或 $[l, r]$ 的队列中出队 $k$ 个元素.

查询某个队列中的第 $k$ 个.

离线操作和查询, 分为两个维度, 一维是队列序号, 另一维是时间. 在队列序号上差分, 扫描线维护.

扫的是队列的序号, 对时间进行维护, 一次区间修改只需要在两端进行两次差分即可, 这两次差分离线后不是必须同时操作的. 对于每个队列, 扫到这个队列时, 每次统一回答所有关于这个队列的询问.

注意, 所有修改和询问按照队列下标顺序而不是时间顺序, 这就是离线的意义.

## 经典题

一个边带权 DAG, 查询一个点出发的路径中字典序第 $k$ 小的路径的终点.

$n, m \leq 10^5, k \leq 10^18$, 每个点没有边权相同的两条出边. 强制在线.

可持久化平衡树

排拓扑序, 每个点维护一个平衡树, 存第 $k$ 小的路径终点, 支持 $O(logn)$ 查询. 对于一个入边, 该点平衡树整体加权插入起点的平衡树. 将平衡树持久化以保证空间复杂度.

其实这个题目的思想类似于 BST 查询第 $k$ 小元素, 都是将二分查找用数据结构实现.

## P6617

给一个常数 $w$, 维护长 $5 * 10^5$ 的序列, 支持:

单点修改

查询是否有两数之和为 $w$.

$4s$

如果是不带修的, 定义数组 $Pre_i$ 为离 $a_i$ 最近的 $w - a_i$ 的下标.

考虑到这个题只需要判断存在性, 所以只要维护 $Pre$ 和与之对应的 $Pro$ 即可.

这种思想带上修改, 每次修改是 $O(n)$, 因为要考虑改变了多少个点的 $Pre$ 和 $Pro$.

如果有 $i < j_1 < j_2$, 满足 $a_i + a_{j_1} = a_i + a_{j_2} = w$, 则这个 $Pre_{j_2} = i$ 对答案无效, 所以无需维护. 所以一对点 $i$, $j$, 它们的关系是一一对应的, 即只要 $Pre_j = i$, 则一定有 $Pro_i = j$.

使用 `RMQ 线段树` + `set` 来维护 $Pre$ 和 $Pro$.

## Bzoj3489

给一个 $10^5$ 的序列, $10^6$ 次询问, 查询区间 $[l, r]$ 中只出现一次的数中最大的一个.

强制在线.

可持久化线段树套堆, 持久的是堆

## P5073

维护序列, 支持:

全局修改

区间最大子段和

将不同时间点的全局操作值离线, 从小到大考虑, 这样就能使修改值递增, 转化为只全局加法的修改.

分块维护最大前缀和, 最大子段和, 最大子段和. 总复杂度 $O((m + n)logn)$

还可以 $O((n + m)logn)$ 做, `poly log` 是什么阴间东西?!

## P2824 HEOI2016

一个全排列, 支持:

- $[l, r]$ 的区间升序排序

- $[l, r]$ 的区间升序降序

所有操作结束后, 单点查询.

Pro: 在操作的同时加入单点查询操作.

## P5612 YNOI2013

维护序列, 支持:

- 区间异或

- 区间排序

- 区间异或和

$32MB$

## Ynoi2007 rgxsxrs

给 $5 * 10^5$ 的序列, $5 * 10^5$ 次操作, 可以将区间中 $>x$ 的元素减去 $x$, 也有查询区间最值 (min/max), 总和.

$6s$

对值域倍增分块, 每一块的块长是倍增的, 如 $[0, 1)$, $[1, 2)$, $[2, 4)$, $[4, 8)$ ...

每块建线段树, 维护区间最值, 总和.

复杂度 $O(mlog^2n)$

## Loj6276

点带权的 $10^5$ 个点的树, 求满足链上没有两点权值相同的链的数量. 保证每种权值出现 $\leq 20$ 次.

$4s$

如果一对点的路径不满足没有两点权值相同, 则从一个点的子树上任意节点到另一个点的子树上的任意节点的路径也不满足.

## [模板] 扫描线

矩形面积并, 很简单的扫描线

## P7126

用 $Dist_{i, j}$ 表示树上 $i$, $j$, 两点路径上的权值和. 定义 `C-连通` 指满足...

## Uoj207

一棵树, 一个 `pair<Node, Node>` 集合 $S$, 每个点对都对应一条路径.

询问: 一条边是否是属于 $S$ 中所有路径的交.

修改: 断开一条边后连接两个点, 保证还是一棵树.

LCT 维护树的变形, 复杂度 $O((n + m)logn)$

## 经典题

点带权树, 询问两个等长的路径中的点集的差异度. 定义两个点集的差异度为两个点集的点按权值排序后的序列中不同的位数.

可持久化权值线段树维护哈希值

## 野题

点带权菊花图, 规定每个点的父亲都是 $1$ (除了点 $1$).

修改操作是将 $[l, r]$ 的父亲改为 $x$ 或者是单点权值修改.

查询是询问子树权值和.

保证 $1$ 永远是根.

## P7124

一棵树, 维护一个集合, 支持:

1. 当前集合中插入一个节点 $x$

1. 撤销插入

1. 将当前点集就是第 $i$ 个点的子树点集以整棵树为全集的补集为真

$3$ 操作是一个判断, 构造一个合法的操作序列. 使得 $3$ 的判定对每个结点都有且只有一次, 并且 $1$ 操作至多 $4.5 * 10^6$ 次.

