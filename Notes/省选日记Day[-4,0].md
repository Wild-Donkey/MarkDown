# 省选日记 Day $-4$ - Day $0$

## Day $-4$ Mar 30, 2022, Wednesday

$12$ 点半起床, 完美错过模拟赛. 下午把前两天的锅补了.

## Day $-3$ Mar 31, 2022, Thursday

### A

维护可重集中求互质的数字对数, 我们开桶模拟可重集, 然后记每个不含平方因子的数的倍数数量, 这样就可以进行容斥算出每次插入或删除的数的互质数量, 得到答案的变化量. 我们枚举每个因数作为公因数计算数字的对数, 容斥系数显然是莫比乌斯函数. 复杂度 $O(n\sqrt n)$.

### B

这个题有上个题的影子. 对于静态问题, 我们做一个特殊的树上背包, 按路径 GCD 记录所有的路径, 然后用一个辅助数组在合并背包的同时统计贡献, 直接按上个题的思想进行合并即可. 复杂度 $O(n^2 \sqrt a)$.

对于修改, 我们可以每次计算修改的边在修改前对答案的贡献, 同样是 $O(n^2)$ 的树上背包. 最后 $O(n\sqrt a)$ 及可合并.

因此复杂度是 $O((n + q)n\sqrt a)$. 可以获得 $70'$.

```cpp
inline unsigned Gcd(unsigned x, unsigned y) {
  unsigned TmpG;
  while (y) TmpG = x, x = y, y = TmpG % y;
  return x;
}
bitset<1000005> No;
struct Node;
struct Edge {
  Node *To[2];
  unsigned Val;
}Ed[100005];
unsigned Pri[100005], Cnt[1000005], TmpP[1000005];
unsigned Stack[1000005], *STop(Stack);
unsigned long long Ans(0), Tmp(0);
unsigned m, n, CntP(0);
unsigned A, B, C, D, t;
struct Node {
  vector <Edge*> E;
  map<unsigned, unsigned> Val;
  inline void DFS(Edge* Fa) {
    Val.clear();
    unordered_map<unsigned, unsigned> TmpM;
    for (auto i:E) if(i != Fa){
      Node*Cur(i->To[i->To[0] == this]);
      Cur->DFS(i);
      for (auto j:Cur->Val) {
        unsigned G(Gcd(j.first, i->Val));
        if(G == 1) Tmp += j.second;
        for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
          if(Cnt[k] < 0x3f3f3f3f) {
            if(Cnt[k] & 1) Tmp -= (unsigned long long)j.second * TmpM[k];
            else Tmp += (unsigned long long)j.second * TmpM[k];
          }
          unsigned ToG(G / k);
          if(Cnt[ToG] < 0x3f3f3f3f && (k ^ ToG)) {
            if(Cnt[ToG] & 1) Tmp -= (unsigned long long)j.second * TmpM[ToG];
            else Tmp += (unsigned long long)j.second * TmpM[ToG];
          }
        }
      }
      for (auto j:Cur->Val) {
        unsigned G(Gcd(j.first, i->Val));
        Val[G] += j.second;
        for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
          unsigned ToG(G / k);
          if(Cnt[k] < 0x3f3f3f3f) TmpM[k] += j.second; 
          if(Cnt[ToG] < 0x3f3f3f3f && (ToG ^ k)) TmpM[ToG] += j.second;
        }
      }
    }
    if(Fa) ++Val[Fa->Val];
  }
  inline void DFS2(Edge* Fa) {
    Val.clear();
    for (auto i:E) if(i != Fa){
      Node*Cur(i->To[i->To[0] == this]);
      Cur->DFS2(i);
      for (auto j:Cur->Val) Val[Gcd(j.first, i->Val)] += j.second;
    }
    if(Fa) ++Val[Fa->Val];
  }
}N[100005];
signed main() {
  Cnt[1] = 0, Cnt[0] = 0;
  for (unsigned i(2); i <= 1000000; ++i) {
    if(!No[i]) Pri[++CntP] = i, Cnt[i] = 1;
    for (unsigned j(1), k(i << 1); (k <= 1000000) && (j <= CntP); ++j, k = Pri[j] * i) {
      No[k] = 1, Cnt[k] = Cnt[i] + 1;
      if(!(i % Pri[j])) Cnt[k] = 0x3f3f3f3f;
    }
  }
  n = RD();
  for (unsigned i(1); i < n; ++i) {
    Ed[i].To[0] = N + (A = RD());
    Ed[i].To[1] = N + (B = RD());
    Ed[i].Val = RD();
    N[A].E.push_back(Ed + i);
    N[B].E.push_back(Ed + i);
  }
  N[1].DFS(NULL), Ans = Tmp;
  printf("%llu\n", Ans);
  m = RD();
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), Tmp = 0;
    Ed[A].To[0]->DFS2(Ed + A);
    Ed[A].To[1]->DFS2(Ed + A);
    --(Ed[A].To[1]->Val[Ed[A].Val]);
    for (auto j:Ed[A].To[0]->Val) {
      unsigned G(Gcd(Ed[A].Val, j.first));
      if(G == 1) Tmp += j.second;
      for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
        unsigned ToG(G / k);
        if(Cnt[k] < 0x3f3f3f3f) TmpP[k] += j.second, *(++STop) = k;
        if(Cnt[ToG] < 0x3f3f3f3f && (ToG ^ k)) TmpP[ToG] += j.second, *(++STop) = ToG;
      }
    }
    for (auto j:Ed[A].To[1]->Val) {
      unsigned G(j.first);
      for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
        if(Cnt[k] < 0x3f3f3f3f) {
          if(Cnt[k] & 1) Tmp -= (unsigned long long)j.second * TmpP[k];
          else Tmp += (unsigned long long)j.second * TmpP[k];
        }
        if(Cnt[G / k] < 0x3f3f3f3f && ((k * k) ^ G)) {
          if(Cnt[G / k] & 1) Tmp -= (unsigned long long)j.second * TmpP[G / k];
          else Tmp += (unsigned long long)j.second * TmpP[G / k];
        }
      }
    }
    --(Ed[A].To[0]->Val[Ed[A].Val]);
    ++(Ed[A].To[0]->Val[Ed[A].Val = B]);
    Ans -= Tmp, Tmp = 0;
    while (STop > Stack) TmpP[*(STop--)] = 0;
    for (auto j:Ed[A].To[0]->Val) {
      unsigned G(Gcd(Ed[A].Val, j.first));
      if(G == 1) Tmp += j.second;
      for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
        unsigned ToG(G / k);
        if(Cnt[k] < 0x3f3f3f3f) TmpP[k] += j.second, *(++STop) = k;
        if(Cnt[ToG] < 0x3f3f3f3f && (ToG ^ k)) TmpP[ToG] += j.second, *(++STop) = ToG;
      }
    }
    for (auto j:Ed[A].To[1]->Val) {
      unsigned G(j.first);
      for (unsigned k(sqrt(G)); k; --k) if(!(G % k)){
        if(Cnt[k] < 0x3f3f3f3f) {
          if(Cnt[k] & 1) Tmp -= (unsigned long long)j.second * TmpP[k];
          else Tmp += (unsigned long long)j.second * TmpP[k];
        }
        if(Cnt[G / k] < 0x3f3f3f3f && ((k * k) ^ G)) {
          if(Cnt[G / k] & 1) Tmp -= (unsigned long long)j.second * TmpP[G / k];
          else Tmp += (unsigned long long)j.second * TmpP[G / k];
        }
      }
    }
    while (STop > Stack) TmpP[*(STop--)] = 0;
    Ans += Tmp;
    printf("%llu\n", Ans);
  }
  return Wild_Donkey;
}
```

接下来考虑正解. 按照前面的思路, 我们对于所有 $i$ 如果求出 Gcd 是 $i$ 的倍数的路径数量, 仍用莫比乌斯函数作为容斥系数即可求出答案.

我们考虑枚举所有的数作为公因数, 找出每个连通块求出大小, 如果一个连通块的大小为 $x$, 那么它就包含 $\frac {x(x - 1)}2$ 条路径. 因此我们只要求出所有连通块点数的平方和和即可. 用并查集维护这个东西的复杂度是 $O(n\sqrt a\log n)$.

因为有平方因子的因数的 $\mu$ 为 $0$, 不会产生贡献, 所以我们不予讨论. 为了更好地求出一个数的所有无平方因子的因数, 我们线性筛的过程中记录值域内所有数的最小质因子, 然后一直除最小质因子就可以找到别的所有质因子. $10^6$ 内的数字最多有 $6$ 个不同的质因子, 所以我们最多只要处理 $64$ 个有贡献的因数即可. 复杂度变成 $O(64n\log n)$.

对于动态问题, 我们离线所有询问, 对于每个公因数单独计算贡献, 计算时先求出全程没有变化的边的局面, 然后枚举每个时刻计算有变化的边的贡献. 复杂度 $O(64(Q^2 + n)\log n)$.

```cpp
bitset<1000005> No;
unsigned Pri[100005], CntP(0), Cnt[1000005], Small[1000005];
struct Node {
  Node* Fa; unsigned Size;
}N[100005];
pair<Node, Node*> Stack[200005], *STop(Stack), *SBot;
struct Edge {
  Node *To[2];
}E[100005];
struct Change {
  Edge* Ed;
  unsigned Range[2], Val;
  inline const char operator<(const Change& x) const { return Range[0] < x.Range[0]; }
}Edit[205], *CntE(Edit);
vector<Edge*> List[1000005];
vector<Change*> Added[1000005];
unsigned Val[100005], Tot[65];
unsigned long long Ans[105], Tmp(0), LTmp(0);
unsigned m, n, A, B, C, D;
inline unsigned Insert(unsigned y) {
  unsigned Cl(0), TmP; 
  Tot[0] = 1;
  while (y > 1) {
    TmP = Small[y];
    while (!(y % TmP)) y /= TmP;
    Tot[1 << (Cl++)] = TmP;
  }
  for (unsigned j(1), k(2); j < Cl; ++j, k <<= 1)
    for (unsigned l((1 << j) - 1); l; --l) Tot[k | l] = Tot[k] * Tot[l];
  return (1 << Cl) - 1;?
}
inline Node* Find(Node* x) { while (x->Fa != x) x = x->Fa; return x;}
inline unsigned long long Calc(unsigned x) {return ((unsigned long long)x * (x - 1)) >> 1;}
inline void Add(Edge* x) {
  Node *LS(Find(x->To[0])), *RS(Find(x->To[1]));
  *(++STop) = {*LS, LS}, *(++STop) = {*RS, RS};
  if(LS->Size < RS->Size) swap(LS, RS);
  Tmp -= Calc(LS->Size), Tmp -= Calc(RS->Size); 
  LS->Size += RS->Size, RS->Fa = LS;
  Tmp += Calc(LS->Size);
}
signed main() {
  Cnt[1] = 0, Cnt[0] = 0, Small[1] = 1;
  for (unsigned i(2); i <= 1000000; ++i) {
    if(!No[i]) Pri[++CntP] = i, Cnt[i] = 1, Small[i] = i;
    for (unsigned j(1), k(i << 1); (k <= 1000000) && (j <= CntP); ++j, k = Pri[j] * i) {
      No[k] = 1, Cnt[k] = Cnt[i] + 1, Small[k] = Pri[j];
      if(!(i % Pri[j])) Cnt[k] = 0x3f3f3f3f;
    }
  }
  n = RD();
  for (unsigned i(1); i < n; ++i) E[i].To[0] = N + RD(), E[i].To[1] = N + RD(), Val[i] = RD();
  m = RD();
  map<Edge*, Change*> Last;
  for (unsigned i(1); i <= m; ++i) {
    A = RD();
    if(Val[A] < 0x3f3f3f3f) *(++CntE) = {E + A, 0, 0, Val[A]}, Val[A] = 0x3f3f3f3f, Last[E + A] = CntE;
    *(++CntE) = {E + A, i, 0, RD()}, Last[E + A]->Range[1] = i - 1, Last[E + A] = CntE; 
  }
  for (auto i:Last) { i.second->Range[1] = m; }
  for (Change* i(CntE); i > Edit; --i) {
    for (unsigned j(Insert(i->Val)); ~j; --j) Added[Tot[j]].push_back(i);
  }
  for (unsigned i(1); i < n; ++i) if(Val[i] < 0x3f3f3f3f)
    for (unsigned j(Insert(Val[i])); ~j; --j) List[Tot[j]].push_back(E + i);
  for (unsigned i(1); i <= n; ++i) N[i].Fa = N + i, N[i].Size = 1; 
  for (unsigned i(1); i <= 1000000; ++i) if(Cnt[i] < 0x3f3f3f3f) {
    Tmp = 0;
    while (STop > Stack) *(STop->second) = STop->first, --STop;
    for (auto j:List[i]) Add(j); LTmp = Tmp, SBot = STop;
    for (unsigned j(0); j <= m; ++j) {
      Tmp = LTmp;
      while (STop > SBot) *(STop->second) = STop->first, --STop;
      for (auto k:Added[i]) if((k->Range[0] <= j) && (j <= k->Range[1])) Add(k->Ed);
      if(Cnt[i] & 1) Ans[j] -= Tmp;
      else Ans[j] += Tmp;
    }
  }
  for (unsigned i(0); i <= m; ++i) printf("%llu\n", Ans[i]);
  return Wild_Donkey;
}
```

## Day $-2$ Apr 1, 2022, Friday

历史总是惊人地相似, 我再次起到了 $12$ 点.

### [PrSl2021 图函数](https://www.luogu.com.cn/problem/P7516)

首先容易发现任何情况下原图中不在一个强连通分量中的点不会产生贡献, 所以问题转化为将所有强连通分量之间的边删掉而仅考虑强连通分量内的问题.

一开始想的是对于只求 $h(G)$ 值的问题, 强连通分量内的点的删除顺序是一定的, 所以我们可以提前处理一个森林结构, 每个强连通分量是一棵树, 树根是这个强连通分量的编号最小的节点. 树上的父亲没删除之前, 这个点不会被删除. 每个子树表示它的祖先都被删除后留下的强连通分量. 则每个点的函数值便是这个点在树上的深度.

但是注意到每次删除边或加入边, 树的形态都可以出现巨大变化, 所以不能维护. 我们发现点数只有 $1000$, 所以不妨使用邻接矩阵, 用类似 Floyd 的方式处理出一个点到另一个点的编号最小的点最大的最大值. 这样我们查询 $h$ 值就相当于在处理结束的邻接矩阵 $a$ 上寻找有序点对 $(i, j)$ 满足 $\min(a_{i, j}, a_{j, i}) \geq i$ 的数量.

做一次是 $O(n^3)$. 对于删边的问题, 我的初步想法是将边倒序加入 Floyd, 加一次 $O(n^3)$, 所以复杂度是 $O(mn^3)$, 可以拿到 $44'$ 的好成绩.

```cpp
unsigned a[1005][1005], Sid[200005][2], Prt[200005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Udt(unsigned x, unsigned y) {
  unsigned Cur(a[x][y]), To;
  for (unsigned j(1), k(min(j, y)); j <= n; ++j, k = min(j, y)) if(a[j][y] < (To = min(a[j][x], Cur)))
    {if(min(a[j][y], a[y][j]) < k && min(a[y][j], To) >= k) ++Ans; a[j][y] = To, Udt(j, y);}
  for (unsigned j(1), k(min(j, x)); j <= n; ++j, k = min(j, x)) if(a[x][j] < (To = min(a[y][j], Cur)))
    {if(min(a[x][j], a[j][x]) < k && min(a[j][x], To) >= k) ++Ans; a[x][j] = To, Udt(x, j);}
}
signed main() {
  Ans = n = RD(), m = RD();
  for (unsigned i(1); i <= m; ++i) Sid[i][0] = RD(), Sid[i][1] = RD();
  for (unsigned i(1); i <= n; ++i) a[i][i] = i;
  Prt[m + 1] = Ans;
  for (unsigned i(m); i; --i) {
    printf("%u:\n", i); 
    A = Sid[i][0], B = Sid[i][1], C = min(A, B);
    if(min(a[A][B], a[B][A]) < C && min(a[B][A], C) >= C) ++Ans;
    a[A][B] = max(a[A][B], C), Udt(A, B), Prt[i] = Ans;
    for (unsigned j(1); j <= n; ++j) {
      for (unsigned k(1); k <= n; ++k) printf("%2u", a[j][k]); putchar(0x0A);
    }
  }
  for (unsigned i(0); i <= m; ++i) printf("%u ", Prt[i + 1]);
  putchar(0x0A);
  return Wild_Donkey;
}
```

我们发现, 可以把问题转化为对每个有序点对 $(i, j)$, 求只走编号大于等于 $\min(i, j)$ 的路径, 可以使 $(i, j)$ 互通的满足最小编号的边最大的边的编号.

所以我们可以记邻接矩阵 $a_{i, j}$ 为只走大于等于 $min_{i, j}$, 从 $i$ 到 $j$ 路径上最小的边的最大值. 直接用 Floyd 解决即可. 复杂度 $O(n^3 + m)$, 因为有 `-O2`, 因此简单卡常即可 AC.

```cpp
unsigned a[1005][1005], Prt[200005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) a[i][i] = m + 1;
  for (unsigned i(1); i <= m; ++i) A = RD(), B = RD(), a[A][B] = max(a[A][B], i);
  for (unsigned i(n); i; --i) {
    for (unsigned j(1), *J(a[j]); j <= i; J = a[++j]) for (unsigned k(1); k <= n; ++k)
      J[k] = max(J[k], min(J[i], a[i][k]));
    for (unsigned j(i + 1), *J(a[j]); j <= n; J = a[++j]) for (unsigned k(1); k <= i; ++k)
      J[k] = max(J[k], min(J[i], a[i][k]));
  }
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= i; ++j) ++Prt[min(a[i][j], a[j][i])];
  for (unsigned i(m); i; --i) Prt[i] += Prt[i + 1];
  for (unsigned i(0); i <= m; ++i) printf("%u ", Prt[i + 1]);
  putchar(0x0A);
  return Wild_Donkey;
}
```

显然这个 $O(n^3)$ 的做法不是出题人一开始的想法, 因为如果出题人这样做, 他应该把 $m$ 开到 $\dfrac {n(n - 1)}2$. 接下来盘点一下本题一个更加优秀的做法.

我们先考虑一个 $O(nm^2)$ 的暴力. 对于每张图, 我们枚举每个点 $i$ 做为有序对 $(i, j)$ 中较小的一个点, 找出有多少个 $j$ 是合法的. 我们不走 $< i$ 的点, 搜索求出 $i$ 能到达的所有点, 然后在反图上进行同样的操作, 找出正反图都能到达的点有多少.

接下来考虑优化, 因为从后往前加边的时候, 已经到达的点一定还会到达, 所以我们仍然是倒着加边, 考虑每次加边 $(u, v)$ 对点 $i$ 的影响:

如果 $i$ 可达 $v$, 那么这条边无用, 因为 $v$ 已经可达了, 所以不需要通过 $u$ 来到达它. 所以删掉这条边. 对于任何终点可达的边都删掉.

如果 $i$ 可达 $u$ 而不可达 $v$, 则从 $v$ 开始搜索其它可达的点. 这时 $v$ 可达了, 变成了上一种情况. 所以将这条边删掉.

如果 $i$ 不可达 $u$, $v$, 那么我们留着这条边, 等之后 $u$ 可达了再用.

这个过程要求我们外层枚举点, 内层倒着枚举边, 对正反图都进行这样的操作. 维护两个邻接矩阵共同位置以得到答案. 由于枚举到每个点搜索时每条边只会被经过一次, 因此复杂度为 $O(nm)$.

## Day $-1$ Apr 2, 2022, Saturday

### [PrSl2021 宝石](https://www.luogu.com.cn/problem/P7518)

发现不在 $P$ 中的颜色都是垃圾, 我们知道 $P$ 中的元素互不相同, 所以等待类型等待的宝石类型和匹配长度一一对应, 所以每个点存储这个颜色在 $P$ 中的位置, 如果不在 $P$ 中就存 $0$.

显然策略是能收就收, 我们贪心地拿就能得到最优答案. 问题转化为找路径上的最长的从 $1$ 开始的连续上升子序列. 所以贪心可以做到 $O(nq)$. 只能骗到 $25'$.

接下来考虑优化, 我们发现路径分为两部分, 上升段和下降段. 对于上升段, 我们可以预处理从点 $i$ 往上走 $2^j$ 个点, 从 $k$ 开始的连续上升子序列最长是多少. 对于下降段, 其实也是找最长的连续上升子序列. 我们预处理从点 $i$ 开始上方 $2^j$ 个点能找到的从 $k$ 开始的最长连续下降子序列. 只要提前找出 LCA, 就可以按深度差找到所有要查询的点, 即可 $O(\log n)$ 完成一次查询操作. 预处理复杂度是 $O(nc\log n)$ 的, 总复杂度 $O(q\log n + nc \log n)$. 这样即可得到 $50'$ 的好成绩.

对于链的情况, 有从左到右和从右到左两种询问, 由于问题是对称的, 我们只考虑其中一种. 我们离线所有询问, 按结束位置排序, 然后对序列用 `map` 以匹配长度为键值进行扫描. 对于两个结尾相同的子串, 如果它们匹配长度相等, 我们可以贪心地保留起点靠后的, 又因为两个结尾相同的子串, 结尾靠左的一定包含结尾靠右的所有子序列, 因此匹配长度一定随左端点向右而减小. 所以右端点移动一位只会修改一个元素. 每次查询这个右端点的询问时, 我们二分匹配长度, 使得左端点在查询范围之内即可. 这样可以做到 $O((n + q)\log n)$ 的复杂度. 那么我们现在已经得到 $70'$ 的好成绩了.

现在思考 $100'$, 我们仍然离线询问, 找出每个询问的 LCA, 分成上升段和下降段, 把每个询问的三个点挂在树的节点上.

对于上升段, 我们在 DFS 回溯的过程中用最长匹配长度为键值的 `map` 维护从起点向上走到这个点为某个匹配长度时的每个询问. 由于会存在不同的询问匹配长度相等的情况, 我们用并查集合并相同的询问, 然后在维护 `map` 的同时对并查集同步记录匹配长度.

我们现在把所有上升段走完了, 每个询问的 LCA 上存储上升段的匹配长度, 然后进行 DFS 回答询问. 仍然是 `map` 加并查集. 我们在回溯的时候回滚两个数据结构, 这样每个时刻存储的就是某个点所有祖先的询问的信息了, 每次到达一个终点就查询并查集回答询问即可.

两次 DFS 每个点只会更新一个元素, 并且每个询问也只会被查询 $2$ 次, 所有询问合并 $O(q)$ 次. 因此总复杂度 $O((n + q)\log n)$.

看了一下题解, 发现倍增同样可以处理上升段, 下降段的处理和前面自己胡出来的一样.

首先每个点处理一个指针 $Beg_i$, 表示从 $i$ 往上走最近的颜色为 $1$ 的点, 每个点 $i$ 再处理指针 $Up_{i, j}$ 表示 $i$ 往上走最近的颜色为 $w_i + 2^j$ 的点. 这样就可以倍增地求上升段了. 求 $Up$ 的时候, 我们记录一个指针数组 $Last_i$, 表示当前位置最近的颜色为 $i$ 的点, 进入时更新, 弹出后回滚.

接着是下降段, 重新审视 `map` 的作用, 它只是用来查询等待特定颜色的询问工具, 而颜色的范围只有 $50000$, 因此可以直接记录对应并查集根的指针. 因此我们没必要用 `map`.

总复杂度为 $O(n + q(\log m + \log q + \log n))$.

```cpp
unsigned m, n, c, q;
unsigned A, B, C, D, t;
unsigned Rk[50005], Ans[200005], Tmp(0);
struct Set{
  Set* Fa;
  unsigned Col, Size;
}Mer[200005], *Root[50005];
inline Set* Find (Set* x) {
  while (x->Fa != x) x = x->Fa;
  return x;
}
pair<Set*, Set> Stack[2000005], *STop(Stack);
pair<Set**, Set*> Stack2[2000005], *STop2(Stack2);
inline Set* Merge (Set *x, Set *y) {
  if(!x) return y;
  if(!y) return x;
  if(x->Size < y->Size) swap(x, y);
  *(++STop) = {x, *x}, *(++STop) = {y, *y};
  x->Size += y->Size, y->Fa = x;
  return x;
}
struct Node {
  vector<Node*> E;
  Node *Beg, *Up[17], *Fa[19];
  vector<pair<unsigned, unsigned> > Frm;
  vector<unsigned> To;
  unsigned Col, Dep;
  inline void Init();
  inline void DFS();
}N[200005], *Last[50005];
inline void Node::Init () {
  Beg = Last[1], Up[0] = Last[Col + 1];
  for (unsigned i(0); Up[i]; ++i) Up[i + 1] = Up[i]->Up[i];
  for (unsigned i(0); Fa[i]; ++i) Fa[i + 1] = Fa[i]->Fa[i];
  Node* TmpL;
  for (auto i:E) if(i != Fa[0]) {
    TmpL = Last[i->Col], Last[i->Col] = i;
    i->Fa[0] = this, i->Dep = Dep + 1, i->Init();
    Last[i->Col] = TmpL;
  }
}
inline void Node::DFS () {
  pair<Set*, Set> *BackUp(STop);
  pair<Set**, Set*> *BackUp2(STop2);
  for (auto i:Frm) {
    Set *&Point(Root[i.first]);
    *(++STop2) = {&Point, Point};
    if(!Point) Point = Mer + i.second;
    else Point = Merge(Point, Mer + i.second);
    Point->Col = i.first;
  }
  if(Root[Col]) {
    (*(++STop2)) = {Root + Col + 1, Root[Col + 1]};
    (*(++STop2)) = {Root + Col, Root[Col]};
    Root[Col + 1] = Root[Col + 1] ? Merge(Find(Root[Col]), Find(Root[Col + 1])) : Root[Col];
    (*(++STop)) = {Root[Col + 1], *Root[Col + 1]};
    Root[Col] = NULL, Root[Col + 1]->Col = Col + 1;
  }
  for (auto i:To) Ans[i] = Find(Mer + i)->Col;
  for (auto i:E) if(i != Fa[0]) i->DFS();
  while (STop > BackUp) *(STop->first) = STop->second, --STop;
  while (STop2 > BackUp2) *(STop2->first) = STop2->second, --STop2;
}
inline Node* LCA(Node* x, Node* y) {
  if(x->Dep < y->Dep) swap(x, y);
  for (unsigned i(17); ~i; --i)
    if((x->Fa[i]) && (x->Fa[i]->Dep >= y->Dep)) x = x->Fa[i];
  if(x == y) return x;
  for (unsigned i(17); ~i; --i) if(x->Fa[i] != y->Fa[i]) x = x->Fa[i], y = y->Fa[i];
  return x->Fa[0];
}
signed main() {
  n = RD(), memset(Rk, 0, ((m = RD()) + 1) << 2), c = RD(); 
  for (unsigned i(1); i <= c; ++i) Rk[RD()] = i;
  for (unsigned i(1); i <= n; ++i) N[i].Col = Rk[RD()];
  for (unsigned i(1); i < n; ++i)
    A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
  Last[N[1].Col] = N + 1;
  N[1].Fa[0] = NULL, N[1].Dep = 1, N[1].Init();
  Last[N[1].Col] = NULL;
  memset(Ans, 0, ((q = RD()) + 1) << 2);
  for (unsigned i(1); i <= q; ++i) {
    Node *S(N + RD()), *T(N + RD()), *L_CA(LCA(S, T));
    T->To.push_back(i), S = S->Beg;
    if(S && (S->Dep > L_CA->Dep)) {
      Ans[i] = 1;
      for (unsigned j(15); ~j; --j)
        if((S->Up[j]) && (S->Up[j]->Dep > L_CA->Dep))
          S = S->Up[j], Ans[i] += (1 << j);
    }
    L_CA->Frm.push_back({Mer[i].Col = (Ans[i] + 1), i});
  }
  for (unsigned i(1); i <= q; ++i) Mer[i].Fa = Mer + i;
  N[1].DFS();
  for (unsigned i(1); i <= q; ++i) printf("%u\n", Ans[i] - 1);
  return Wild_Donkey;
}
```

### [PrSl2021 滚榜](https://www.luogu.com.cn/problem/P7519)

发现滚榜的顺序倒过来恰恰就是最后的排名, 只要求出可行的滚榜顺序数量即可. 另外是方案 $b$ 的总和只要小于等于 $m$ 即可, 因为如果不够 $m$, 缺口可以都加到最后一个滚榜的人上面. 

所以每个可行的方案可以通过某个策略构造出一个确定的方案, 如果当前要滚的人编号小于等于当前的第一名, 那么它需要的 $b$ 就是和第一名的差值, 如果大于当前的第一名, 那么它需要的 $b$ 就是和第一名的差值加一. 这时的 $b$ 值和上一次的 $b$ 值取 `max` 即为这一次的 $b$ 值. 这样让第一名尽可能小, 一定可以构造出所有可行的顺序.

因此一个朴素的做法是记录当前已经滚榜的人的集合 $S$, 第一名的编号 $i$ 和 $b_i = j$, 还可以滚的题数 $k$ 为状态, $f_{S, i, j, k}$ 表示这个状态的排列数. 状态数为 $O(2^nnm^2)$. 可以发现, 这个状态数高达 $2.6*10^{10}$, 比直接暴力枚举排列还要劣.

我们发现由于滚榜时 $b$ 单调不降, 因此可以提前计算贡献, 也就是说在给一个人滚 $b$ 的时候, 别人都要同步滚 $b$, 我们转移的时候只要关心两个人 $a$ 的差即可. 因此 $f_{S, i, j}$ 表示已经滚了 $S$ 集合, 最后滚的为 $i$, 提前计算贡献之后剩下 $m$ 道题没滚的可行方案数. 状态 $O(2^nnm)$, 转移 $O(n)$, 总复杂度 $O(2^nn^2m)$.

$$
f_{S + k, k, j - (n - |S|)\max(a_i - a_k + [i < k], 0)} += f_{S, i, j}
$$

注意这个时候不要用 `unordered_map`, 因为后面的第三维就十分密集了, 用数组可以痛快地通过此题. (注释部分是 `unordered_map` 写法)

```cpp
//unordered_map <unsigned, unsigned> f[8200][13];
unsigned f[8200][13][501];
unsigned Pop[8200], Cost[13][13], a[13], m, n, N, Mx(0);
unsigned long long Ans(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
signed main() {
  N = (1 << (n = RD())) - 1, m = RD(); 
  for (unsigned i(0); i < n; ++i) {a[i] = RD(); if(a[i] > a[Mx]) Mx = i;}
  for (unsigned i(0); i < n; ++i) for (unsigned j(0); j < n; ++j) {
    Cost[i][j] = a[i] - a[j] + (i < j);
    Cost[i][j] = (Cost[i][j] > 0x3f3f3f3f) ? 0 : Cost[i][j];
  }
  for (unsigned i(0), j; i < n; ++i) if((j = n * Cost[Mx][i]) <= m) f[1 << i][i][m - j] = 1;
  for (unsigned i(0); i < N; ++i) {
    unsigned Pi(n - (Pop[i] = Pop[i >> 1] + (i & 1)));
    for (unsigned j(0); j < n; ++j) if((i >> j) & 1) {
      for (unsigned k(0); k < n; ++k) if(!((i >> k) & 1)) {
        unsigned Use(Pi * Cost[j][k]);
//        for (auto l:f[i][j]) if(l.first >= Use) f[i + (1 << k)][k][l.first - Use] += l.second;
        for (unsigned l(Use); l <= m; ++l) f[i + (1 << k)][k][l - Use] += f[i][j][l];
      }
    }
  }
//  for (unsigned i(0); i < n; ++i) for (auto j:f[N][i]) Ans += j.second;
  for (unsigned i(0); i < n; ++i) for (unsigned j(0); j <= m; ++j) Ans += f[N][i][j];
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

看了一下题解, 这道题还可以爆搜滚 $6$ 个人和 $7$ 个人的所有情况, 双向搜索得到答案.

## Day $0$ Apr 3, 2022, Sunday

### [PrSl2021 支配](https://www.luogu.com.cn/problem/P7520)

显然加边后支配关系只能解除而不能增加, 支配关系有传递性, 即如果 $a$ 支配 $b$, $b$ 支配 $c$, 则 $a$ 支配 $c$.

由此我们推出假设一个点的支配集为 $S$, 则一定有一个排列使得 $S_i$ 的支配集为 $\{S_1, S_2,...,S_{i - 1}\}$. 如果从所有支配集内对所有 $S_i$ 到 $S_{i + 1}$ 连边, 这样就可以得到一个树形结构. 听说这个题要用支配树, 看来这个树形结构就被称为支配树吧.

考虑如何找出这个结构.

惊喜地发现 $n \leq 3000$, $m \leq 6000$, 因此我们枚举每个点被删除, 从 $1$ 开始搜索, 到不了的点就是被这个点支配的点. $O(nm)$ 可以连好边, 建出一棵树.

```cpp
```

对于每个询问考虑加边的情况, 发现起点和它的祖先的支配集不会有任何变化.

如果终点是起点的祖先或儿子, 那么任何点的支配情况不会有任何变化.

但是有变化的时候我们却不知如何快速找到变化的点.

事后发现建的树确实类似于支配树, 但是建出支配树我也不会做, 而支配树甚至有 $O(n + m)$ 的建法, 怒学.

#### 线性支配树

由于一些原因, 支配树的中文条目和英文条目有一些出入, 中文词条和英文词条不同的地方是不能自恰的, 在这里提醒一下. 目前的版本是[这个](https://zh.wikipedia.org/w/index.php?title=%E6%94%AF%E9%85%8D_(%E5%9C%96%E8%AB%96)&oldid=70026716), 表格中 $5$ 号点没有 idom, 而按照左边的定义和英文条目

对于 $i$ 支配 $j$, 我们称 $i$ 是 $j$ 的必经点. 点 $i$ 的最近必经点 $Fa_i$ 必须满足除了它本身外不支配任何支配 $i$ 的节点.
