---
title: 省选日记 Day26~30
date: 2022-05-04 20:11
categories: Notes
tags:
  - State_Compression
  - Virtual_Tree
  - Network
  - Engineering
thumbnail: /images/MC8.png
---

# 省选日记 Day $26$ - Day $30$

## Day $26$ Apr 29, 2022, Friday

### [PrSl2022 卡牌](https://www.luogu.com.cn/problem/P8292)

场上爆搜搞了 $40'$. 一般遇到有关一些元素包含质数的问题的时候, 通常是按照值域根号分治. 就像著名题目[寿司晚宴](https://www.luogu.com.cn/problem/P2150).

朴素的做法就是强制不包含某个质数集合的情况然后按照集合大小容斥.

我们把大于根号值域的质数称为大质数, 其它的是小质数. 那么给出的数字最多包含一个大质数, 我们可以把所有给出的数字按包含的大质数分类. 我们枚举一个能选择的大质数, 然后对小质数进行容斥.

$2000$ 以内有 $303$ 个质数, 最大的小质数是 $41$, 共有 $13$ 个小质数, 有 $290$ 个大质数.

我们对每个大质数, 可以求出 $f_{i, S}$ 表示第 $i$ 个大质数的因数中, 强制不选择 $S$ 集合的所有小质数的倍数的数字个数, $g_S$ 表示强制不选所有给出的大质数的倍数, 剩下的数中, 强制不选择 $S$ 中所有小质数的倍数的数字个数. 我们统计答案也就是强制规定一个 $S$ 的小质数不选, 所有给出的大质数都选择的方案数乘以 $(-1)^{|S|}$ 的总和, 即为:

$$
\sum_{S} (-1)^{|S|} 2^{g_S} \prod_{i = 1, i \in Qry} (2^{f_{i, S}} - 1)
$$

提前处理出 $Cnt_{i, S}$ 表示给出的数字中, 第 $i$ 个大质数的倍数, 至少含有所有 $S$ 内小质数因数的数量. 那么可以这样表示 $f$ 数组.

$$
f_{i, S} = \sum_{A \subseteq S} (-1)^{|A|}Cnt_{i, A}
$$

我们可以枚举子集以 $291\times 3^{13}$ 的复杂度求出 $f$. (大概是 $4*10^8$)

$g$ 是无论含有什么大质数, 所有情况的强制不选 $S$ 的小质数的数字数量减去 $f_{i, S}$ 的总和.

每次询问的时候的复杂度是 $2^{小质数数量}(大质数数量 + 1)$, 也就是大约 $2^{13}*\sum c$ 大概是 $18000 \times 8192$, 也就是 $1.5 \times 10^8$.

虽然有大约 $5.5 \times 10^8$ 的复杂度, 但是都在 $700$ 多毫秒的时间内跑过去了.

```cpp
const unsigned long long Mod(998244353);
inline void Mn(unsigned &x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned long long &x) {x -= ((x >= Mod) ? Mod : 0);}
bitset<2005> No;
unsigned f[295][8200], PopC[8200], Two[1000005], b[18005];
unsigned Cont[2005], Ind[2005], a[2005], Pri[320];
unsigned CntP(0), n, m, A, B, C, Cur(0), Cond(0), Ans;
inline void Pre (unsigned* x) {
  for (unsigned i(1); i <= 4096; i <<= 1) 
    for (unsigned j(0); j < 8191; ++j) if(!(j & i))
      x[j] += x[j ^ i];
  for (unsigned i(8191); ~i; --i) {
    if(PopC[i] & 1) x[i] = -x[i];
    for (unsigned j((i - 1) & i); j ^ i; j = ((j - 1) & i)) 
      if(PopC[j] & 1) x[i] -= x[j]; else x[i] += x[j];
  }
}
inline void DFS(unsigned Dep) {
  if(b[Dep] > 41) {
    unsigned Number(f[0][Cond]), FN(0);
    unsigned long long Sum(1);
    for (unsigned i(C); b[i] > 41; --i)
      FN = f[Ind[b[i]] - 13][Cond], Sum = Sum * (Two[FN] - 1) % Mod, Number -= FN;
    Sum = Sum * Two[Number] % Mod;
    Mn(Ans += ((Cur & 1) ? (Mod - Sum) : Sum));
    return;
  }
  DFS(Dep + 1);
  Cond ^= (1 << (Ind[b[Dep]] - 1)), ++Cur; 
  DFS(Dep + 1);
  Cond ^= (1 << (Ind[b[Dep]] - 1)), --Cur;
}
int main() {
  for (unsigned i(0); i < 8192; ++i) PopC[i] = PopC[i >> 1] + (i & 1);
  for (unsigned i(0); i < 8192; ++i) PopC[i] = PopC[i >> 1] + (i & 1);
  for (unsigned i(2); i <= 2000; ++i) {
    if(!No[i]) Pri[++CntP] = i;
    for (unsigned j(1), k(2); (j <= CntP) && (k * i <= 2000); k = Pri[++j]) {
      No[i * k] = 1;
      if(!(i % k)) break;
    }
  }
  for (unsigned i(1); i <= 303; ++i) Ind[Pri[i]] = i;
  for (unsigned i(1), k(1); i <= 13; ++i, k <<= 1)
    for (unsigned j((2000 / Pri[i]) * Pri[i]); j; j -= Pri[i]) Cont[j] |= k;
  n = RD(), Two[0] = 1;
  for (unsigned i(1); i <= n; ++i) Two[i] = (Two[i - 1] << 1), Mn(Two[i]);
  for (unsigned i(1); i <= n; ++i) ++a[RD()];
  for (unsigned i(1); i <= 2000; ++i) f[0][Cont[i]] += a[i];
  Pre(f[0]);
  for (unsigned i(14); i <= 303; ++i) {
    for (unsigned j(2000 / Pri[i]); j; --j) f[i - 13][Cont[j]] += a[j * Pri[i]];
    Pre(f[i - 13]);
  }
  m = RD();
  for (unsigned i(1); i <= m; ++i) {
    C = RD();
    Ans = Cur = 0;
    for (unsigned j(1); j <= C; ++j) b[j] = RD();
    sort(b + 1, b + C + 1), C = unique(b + 1, b + C + 1) - b - 1;
    b[C + 1] = 0x3f3f3f3f, Cur = 0, DFS(1);
    printf("%u\n", Ans);
  }
  return 0;
}
```

重新定义 $Cnt_{i, S}$ 为第 $i$ 个大质数的倍数中, 恰好不包含 $S$ 中的所有小质数的数字数量. 则 $f$ 就可以直接高维前缀和求出:

$$
f_{i, S} = \sum_{S \in A} Cnt_{i, A}
$$

预处理实现了从 $291 \times 3^{13}$ 到 $291 \times 2^{13}$ 的飞跃. 提交之后发现速度比原来的 $15$ 倍都快.

```cpp
/*
The Same Code
*/
inline void Pre (unsigned* x) {
  for (unsigned i(1); i <= 4096; i <<= 1) 
    for (unsigned j(0); j < 8191; ++j) if(!(j & i))
      x[j] += x[j ^ i];
}
/*
The Same Code
*/
for (unsigned i(1); i <= 2000; ++i) Cont[i] = 8191 - Cont[i];
/*
The Same Code
*/
```

## Day $27$ Apr 30, 2022, Saturday

### [SDOI2019 世界地图](https://www.luogu.com.cn/problem/P5360)

网格图, 但是是环. 每次询问环上一段图的最小生成树.

一开始想了一个回滚莫队的做法, 维护当前列区间内的点的生成树, 每次加入一个列, 用 LCT 维护是 $O(n\log n)$ 的. 因此可以通过回滚莫队做到 $O((qB + m\frac mB)n \log n)$, 块长取 $\frac m{\sqrt q}$ 是最优的, 复杂度 $O(nm\sqrt q\log n)$. 只能拿到 $40'$.

但是我一直没有发现一个隐含条件, 那就是所有询问都会跨越 $m$ 到 $1$ 的列. 也就是说如果我们可以预处理出所有前缀和后缀的生成树, 每次询问找到对应的前缀和对应的后缀的生成树, 连接中间那些边, 将两棵生成树合并成一棵, 就可以得到答案.

每次加边, 如果它会造成环, 那么我们就把这个环上最大的边删掉. 可以把可能删掉的边先断开, 然后把这些边和将要加入的边一起跑 Kruskal.

出现了一个新的问题: 什么边是可能被删掉的, 我们要删除的边是这些边里面最大的一条. 如果要合并两段相邻的点的生成树, 那么新加入的边只有跨越新点和旧点的横边, 而这些边成环的时候, 环上有两种边, 新边和旧边, 新边是这一次加入的边, 旧边是原来就存在而没有被删除的边.

如果最大的是新边, 那么我们一开始就已经把这些边考虑在 Kruskal 中了.

如果最大的是旧边, 环上这种边被新边分成了一些连续的极长的段, 这些段的两端一定是新边的端点, 而新边的端点一定是两段点中边界上的点. 也就是说我们可能删除的边一定是每一段列区间中边界列上能够找到两点使得它们之间的路径包含的边.

因此对于每一段列的区间中的点, 我们把边界列上的这些点称为关键点, 这些关键点之间的所有路径的并称为关键边.

我们又发现, 因为是选择最大的边, 所以一个连续旧边路径上, 有用的只有其中最大的一条. 对于所有的关键点对, 如果生成树中有一条极长的关键边组成的路径不是完全出现在这对关键点之间的路径中, 就是完全没有出现在这对关键点之间的路径中, 那么这条极长路径中除了最大的边以外, 别的边都不会在下一次合并中被删除.

仔细分析, 发现这样的路径恰好是原生成树以边界列的点为关键点建立的虚树上的边所代表的路径, 而我们只需要利用虚树的边所代表路径的最大值就可以完成合并. 由于关键点有 $O(n)$ 个, 因此这个虚树的规模也是 $O(n)$ 的, 所以最后跑 Kruskal 的边数也是 $O(n)$ 的, 单次合并的复杂度即为 $O(n\log n)$.

接下来考虑如何实现. 发现虽然虚树和 Kruskal 告诉了我们合并的时候该删什么边, 加什么边, 但是我们还是需要 LCT 来求虚树和维护生成树. 如果不需要知道合并后树的形态, 只希望知道树的大小, 当然可以不用 LCT, 做一场断子绝孙的买卖, 而回答询问时合并后缀列和前缀列恰恰不怕断子绝孙, 所以我们可以只记录每个前后缀需要决策的边集和已经确定的不可能在下一次合并时被删除的边的总和即可, 空间 $O(nm)$.

对于预处理, 仍然需要维护一个 LCT, 让我们能够一边改变树的形态, 一边在线查询树上的路径信息.

## Day $28$ May 1, 2022, Sunday

劳动节, 放个假. 还记得去年这时候出现了著名宣传片[《奋斗者, 不寂寞》](https://www.bilibili.com/video/BV1uK4y1d7YX)受到了广泛的好评, 今天再来重温一遍.

小知识: 五一劳动节的起源是 1886 年干草市场事件, 工人为了争取八小时工作制走上了街头.

## Day $29$ May 2, 2022, Monday

按之前的计划今天是 SDOI Day1.

接上题, 发现我没写过虚树, 所以打算先找一道虚树来写. [详情见](https://www.luogu.com.cn/blog/Wild-Donkey/jing-hua-shui-yue-shu-xu-dian-shi-xu-shu-xue-xi-bi-ji)

### [SDOI2011 消耗战](https://www.luogu.com.cn/problem/P2495)

简化为一棵边带权的树, 每次询问把根节点和 $k$ 个关键点断开所需要的最小花费.

首先把根节点也设为关键点, 因为询问是关于它的, 假设我们只把关键点和关键点两两的 LCA 提出来, 将剩下的点都删掉, 没有删除的点向自己最近的没有删除的祖先连边, 边权就是两点间路径的最小边权, 那么这棵树就是原树关于给出的关键点建立的一棵虚树. 我们从这棵树上求得的答案和原树上求的是等价的.

我们用倍增求 LCA, 顺便求路径最小值. 可以做到 $O((n + \sum k)\log n)$.

```cpp
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Tree {
  vector<pair<Tree*, unsigned> > E;
  Tree* Fa[19];
  unsigned Min[19], Dep, DFSr;
  inline void DFS() {
    DFSr = ++Cnt, memset(Min + 1, 0x3f, 72);
    for (unsigned i(0); Fa[i]; ++i)
      Fa[i + 1] = Fa[i]->Fa[i], Min[i + 1] = min(Min[i], Fa[i]->Min[i]);
    for (auto i:E) if(Fa[0] != i.first) 
      i.first->Dep = Dep + 1, i.first->Fa[0] = this, i.first->Min[0] = i.second, i.first->DFS();
  }
  inline unsigned Qry(Tree* Ac) {
    Tree* x(this);
    unsigned Rt(0x3f3f3f3f);
    for (unsigned i(17); ~i; --i)
      if((x->Fa[i]) && (x->Fa[i]->Dep >= Ac->Dep)) Rt = min(Rt, x->Min[i]), x = x->Fa[i];
    return Rt;
  }
}T[250005];
inline Tree* LCA(Tree* x, Tree* y) {
  if(x->Dep < y->Dep) swap(x, y);
  for (unsigned i(17); ~i; --i) 
    if((x->Fa[i]) && (x->Fa[i]->Dep >= y->Dep)) x = x->Fa[i];
  if(x == y) return x;
  for (unsigned i(17); ~i; --i)
    if(x->Fa[i] != y->Fa[i]) x = x->Fa[i], y = y->Fa[i];
  return x->Fa[0];
}
struct Node {
  vector<Node*> Son;
  Tree* Ori;
  unsigned long long f;
  unsigned ToFa;
  inline const char operator< (const Node& x) const {return Ori->DFSr < x.Ori->DFSr;}
  inline void AddSon(Node* x) {
    Son.push_back(x);
    x->ToFa = x->Ori->Qry(this->Ori);
  }
  inline void DFS() {
    for (auto i:Son) i->DFS(), f += min((unsigned long long)i->ToFa, i->f);
  }
}N[250005], *Stack[250005], *CntN(N), **STop(Stack);
signed main() {
  n = RD();
  for (unsigned i(1); i < n; ++i) {
    A = RD(), B = RD(), C = RD();
    T[A].E.push_back({T + B, C});
    T[B].E.push_back({T + A, C});
  }
  T[1].Min[0] = 0x3f3f3f3f, T[1].Dep = 1, T[1].DFS(), m = RD();
  for (unsigned i(1); i <= m; ++i) {
    while (CntN > N) (CntN--)->Son.clear();
    A = RD(), CntN = A + N + 1, STop = Stack;
    for (unsigned j(1); j <= A; ++j) 
      N[j].f = 0x3f3f3f3f3f3f3f3f, N[j].Ori = T + RD(), N[j].Son.clear(), N[j].ToFa = 0;
    N[++A].Ori = T + 1, N[A].f = 0, sort(N + 1, N + A + 1), *(++STop) = N + 1;
    for (unsigned j(2); j <= A; ++j) {
      Tree* Lca(LCA(N[j].Ori, N[j - 1].Ori));
      while((STop > Stack + 1) && ((*(STop - 1))->Ori->Dep >= Lca->Dep))
        (*(STop - 1))->AddSon(*STop), --STop;
      Tree* Top((*STop)->Ori);
      if (Top == Lca) {*(++STop) = N + j; continue;}
      Node* Cur(++CntN);
      Cur->Ori = Lca, Cur->f = 0;
      if (Top->Dep > Lca->Dep) Cur->AddSon(*(STop--));
      *(++STop) = Cur, *(++STop) = N + j;
    }
    while (STop > Stack + 1) (*(STop - 1))->AddSon(*STop), --STop;
    N[1].DFS();
    printf("%llu\n", N[1].f);
  }
  return Wild_Donkey;
}
```

## Day $30$ May 3, 2022, Tuesday

Ubuntu 和 AMD 的显卡有仇, 驱动先是把 apt 搞炸了, 我把驱动暴力删除之后又把 GUI 搞没了. 其实原因是没有善用 apt 的 `remove`.

今天在折腾 Linux 搭建的软路由. 有几个需要注意的是一定先找一个已知网站的 ip, 这样就可以有效分辨是网络问题还是 DNS 的问题. 比如一个百度服务器的 ip 就是 `220.181.38.251`, 某 google 服务器的 ip 是 `142.250.66.46`.

需要先保证可以让局域网内的机器将本机作为网关之后, 可以访问它本来就可以访问的网页, 然后进行接下来的操作.

还有一个问题是关于劫持本机所有流量的工具 `cgproxy`, 其实只要把 `config.json` 配置好了就行了, 内容无非改几个 `true` 和 `false`. 它会默认把除了白名单里的程序产生的流量劫持到 localhost 的 12345 端口上.

因为包管理器里面的 qv2ray 是旧版本的, 所以选择从 github 上下载 release. 但是如果没有环境变量可能会导致 cgproxy 无法放行, 所以最好查看 `$PATH` 后在对应的目录内安装. 如果实在没有也没关系, 只要装一个 Command 插件, 每次自动发送命令放行就可以了, 这次尝试就是用的这个方法.

还有一个问题是遇到了 `too many open files` 的情况, 解决方案是把系统的文档改了, 把文件限制从 $1024$ 开到 $1048576$, 用户名无脑设 `*` 就行. (最大是 $1048576$, 也就是 $2^20$)

其实不需要设置拦截 DNS. (我也没整明白) 一个 `114.114.114.114` 的 DNS 足够了.

有一个问题是有一个 broken pipe 的 Error 贯穿始终, 无法解决, 不过貌似不影响使用.

注意: fakeDNS 开关不是 DNS 拦截的开关.