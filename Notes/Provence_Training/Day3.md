# Day 3

今天本来能和 $23$ 个人并列第 $7$, 但是可惜我最后害怕炸了加了一句特判, 挂了 $30'$, 可惜.

## Zuiqianyande

定义 $f_x$ 是 $x$ 所有因子的亦或和, 求 $f_1$ 到 $f_n$ 的异或和.

本来能拿三天以来第一个正解, 还是被一句特判杀了...(又是精准控分, 唯一的 $70'$)

```cpp
unsigned long long n, m, Ans(0), The(0), Sq;
inline unsigned long long Sum (unsigned long long x) {
  if(x & 1) {
    return ((x >> 1) & 1) ? 0 : 1;
  }
  else {
    return x + ((x >> 1) & 1);
  }
}
int main() {
  n = RD();
  Sq = floor(sqrt(n)); 
  for (register unsigned long long i(1); i <= Sq; ++i) {
    if ((n / i) & 1) {
      Ans ^= i;
    }
    if(i & 1) {
      Ans ^= Sum(n / i) ^ Sum(n / (i + 1));
    }
  }
  if(((n / Sq) & 1) && (Sq & 1)) {
    if(Sq * Sq == n) {  // 这一句删了就 A 了
      Ans ^= Sq;
    }
  }
  printf("%llu\n", Ans);
  return 0;
}
```

这应该是这次培训最短的正解了, 由于考场代码就是正解, 所以我只好压压行, 卡卡常, 然后放出最优解:

```cpp
unsigned long long n, m, Ans(0), The(0), Sq;
inline unsigned long long Sum(const unsigned long long &x) {
  return ((x & 1) ? (((x >> 1) & 1) ? 0 : 1) : (x + ((x >> 1) & 1)));
}
int main() { 
  n = RD(), Sq = floor(sqrt(n)); 
  for (register unsigned long long i(1); i <= Sq; ++i) {
    if ((n / i) & 1) Ans ^= i;
    if (i & 1) Ans ^= Sum(n / i) ^ Sum(n / (i + 1));
  }
  if(((n / Sq) & 1) && (Sq & 1)) Ans ^= Sq;
  printf("%llu\n", Ans);
  return 0;
}
```

做这题一开始就读错题了, 以为让求 $f_n$, 我一看这个不是 $O(\sqrt n)$ 的红题吗? 于是 $5min$ 写出了 "正解", $10^{14}$ 不是随便 AC.

结果我一测大样例就傻了, 和答案只差一点点, 我觉得是我边界没处理好, 打表一看, 卧槽, 手玩都玩错了. 一看样例解释才发现我假了, 原来的 $O(\sqrt n)$ 变成 $O(n \sqrt n)$, 实测只有 $35'$.

手玩样例时发现了规律, 打表证明之:

如果把出现在答案中的异或和加数都写出来, 那么这些加数都小于等于 $n$, 发现在 $n \% 2 = 1$, 时, 答案的异或加数中有 $1$ 出现, 在 $(n - 2) \% 4 < 2$ 时, 答案中有 $2$, 在 $(n - i) \% 2i < i$ 时, 答案中有 $i$ 出现. 整理得 $n / i$ 是奇数时, 答案中有 $i$ 出现. 这样只要枚举 $[1, n]$ 中每个数, 判断是否包含即可, 这样就得到了 $O(n)$ 的算法, 实测 $45'$.

然后就放弃 T1 了, `12:00` 后面都写不动, 再回来看时, 只能打表, 发现了不得了的东西.

因为在 $i$ 很大的时候, $i$ 的变化很少会影响 $n / i$ 的值, 所以可以预见, 大部分的枚举, 出现在答案里的 $i$ 是连续的段. 容易发现 $n / i$ 变化比 $i$ 缓慢的这个临界点, 恰恰就是 $\sqrt n$. 我们枚举 $i$ 枚举到 $\sqrt n$, 然后枚举 $n / i$, 所以我们总的枚举的数量是 $O(\sqrt n)$.

这种思想就是数论分块, 我从来都没写过, 所以当时就不想写了, 这只是一个黄神午饭时给我口胡的一个算法, 我当时听的时候都感到疑惑, 更别说已经过去了半年, 我已经不记得多少了.

但是后面两题都不会, 我还能干什么呢? 将数论分块写了出来, 过了小样例.

但是这时, 我的每个连续的块是一个个枚举的, 所以我的复杂度是 $O(\sqrt n) * O(\sqrt n) = O(n)$, 还是 $45'$, 一点都没多, 因为我不会快速求一个整数区间的异或和. 最后 $30min$, 我只好打表, 发现 $1$ 到 $x$ 前缀的前缀异或和可以写成:

$$
\begin{aligned}
x&~~~~~~~~~~x \equiv 0 \pmod 4\\
1&~~~~~~~~~~x \equiv 1 \pmod 4\\
x + 1&~~~~~~~~~~x \equiv 2 \pmod 4\\
0&~~~~~~~~~~x \equiv 3 \pmod 4
\end{aligned}
$$

这样就能 $O(1)$ 查询 $1$ 到 $x$ 的前缀异或和 $Sum_x$ 了, 如果要求 $[l, r]$ 的整数的异或和, 根据异或的性质, 只要求 $Sum_r - Sum_{l - 1}$, $O(1)$, 将 $O((\sqrt n) ^ 2)$ 算法优化到 $O(\sqrt n)$

## Zhengfangguilv

这个题给了一堆正交的线段, 求作为桥的线段.

一开始想用扫描线, 但是发现没有卵用, 因为我只会 $O(n^2)$, 并且没法优化.

考虑在所有相交的线段之间连边, 则建成一个二分图. 在二分图上的割点对应的线段就是桥. 而每个度小于等于 $1$ 的点都不是割点. 考虑度更大的点, 只要它连接的边中, 至少有一个点的度为 $1$, 则这个点是割点. 在 $O(n^2)$ 连边后, $O(m)$ 遍历整个图, 就能找到所有的割点. 由于二分图的边数 $m$ 的复杂度是 $O(n^2)$ 的, 所以程序的复杂度是 $n^2$ 的.

接下来是比较简单的 $30'$ 代码:

```cpp
unsigned n, m, Ans[100005][2], List[1005], Top(0), Fa[10005];
char flg(0);
struct Line {
  unsigned L, R, Pos; char Type; 
}V[100005], H[100005];
struct Edge;
struct Node {
  Edge *Fst; unsigned Dgre;
}N[100005];
struct Edge {
  Node *To; Edge *Nxt;
}E[2000005], *CntE(E);
inline void Link(Node *x, Node *y) {
  (++CntE)->Nxt = x->Fst, x->Fst = CntE, CntE->To = y; 
}
inline unsigned Find(unsigned x) {
  register unsigned Tmp;
  while(Fa[Tmp] ^ Tmp) Tmp = Fa[Tmp];
  return Fa[x] = Tmp;
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    H[i].L = RD(), H[i].R = RD();
  for (register unsigned i(1); i <= n; ++i)
    V[i].L = RD(), V[i].R = RD();
  for (register unsigned i(1); i <= n; ++i)
    for (register unsigned j(V[i].L); j <= V[i].R; ++j)
      if(H[j].L <= i && H[j].R >= i) {
        Link(N + i, N + n + j);
        Link(N + n + j, N + i);
        ++(N[i].Dgre);
        ++(N[n + j].Dgre);
      }
  for (register unsigned i(1); i <= n; ++i)
    if(N[i].Dgre >= 2) {
      register Edge *Sid(N[i].Fst);
      while(Sid) {
        if(Sid->To->Dgre <= 1) Ans[i][1] = 1;
        Sid = Sid->Nxt;
      }
    }
  for (register unsigned i(1); i <= n; ++i)
    if(N[i + n].Dgre >= 2) {
      register Edge *Sid(N[i + n].Fst);
      while(Sid) {
        if(Sid->To->Dgre <= 1) Ans[i][0] = 1;
        Sid = Sid->Nxt;
      }
    }
  for (register unsigned i(1); i <= n; ++i) putchar('0' + (Ans[i][0]));
  putchar('\n');
  for (register unsigned i(1); i <= n; ++i) putchar('0' + (Ans[i][1]));
  return 0;
}
```

正解要用数据结构优化连边, $O(nlogn)$ 维护边, 不再把每一条边都存起来.

## Qiguanshaizi

这个题要维护一个染色的树, 支持:

单点修改

同色块修改

查询点的同色块颜色, 点数, 高度(深度极差 + 1).

我场上没有想到什么能用的方法, 只能写一个暴力. 但是调试的过程非常漫长, 因为要考虑的边界过于复杂, 由于子任务难度梯度过大, 以至于我毫无悬念地拿了 $20'$.

```cpp
unsigned n, m, A, B, C, D;
char flg(0);
struct Node {
  Node *Fa, *Son, *Bro, *Root;
  unsigned Dep, Siz, QwQ;
  char Col;
}N[100005];
inline void Udt(Node *x) {
  x->QwQ = x->Siz = 1;
  register Node *now(x->Son);
  while(now) {
    if(now->Col == x->Col)
      x->Siz += now->Siz, x->QwQ = max(x->QwQ, (now->QwQ) + 1);
    now = now->Bro;
  }
  return;
}
void DFS(Node *x) {
  x->QwQ = x->Siz = 1;
  register Node *now(x->Son);
  while(now) {
    if(now->Col == x->Col) now->Root = x->Root;
    else now->Root = now;
    now->Dep = x->Dep + 1, DFS(now);
    if(now->Col == x->Col)
      x->Siz += now->Siz, x->QwQ = max(x->QwQ, (now->QwQ) + 1);
    now = now->Bro;
  }
  return;
}
void DFS1(Node *x) {
  x->QwQ = x->Siz = 1;
  register Node *now(x->Son);
  while(now) {
    if(now->Col == x->Col) now->Root = x->Root, DFS1(now), x->Siz += now->Siz, x->QwQ = max(x->QwQ, (now->QwQ) + 1);
    else now->Root = now, DFS1(now);
    now = now->Bro;
  }
  return;
}
void DFS2(Node *x) {
  register Node *now(x->Son);
  while(now) {
    if(now->Col == x->Col) DFS2(now), now->Col = C;
    now = now->Bro;
  }
  return;
}
void DFS3(Node *x) {
  x->QwQ = x->Siz = 1;
  register Node *now(x->Son);
  while(now) {
    if(now->Col == x->Col)
      now->Root = x->Root, DFS3(now), x->Siz += now->Siz, x->QwQ = max(x->QwQ, now->QwQ + 1);
    now = now->Bro;
  }
  return;
}
int main() {
  n = RD(), RD(); 
  for (register unsigned i(2); i <= n; ++i)
    N[i].Fa = N + RD(), N[i].Bro = N[i].Fa->Son, N[i].Fa->Son = N + i;
  for (register unsigned i(1); i <= n; ++i) N[i].Col = RD();
  N[1].Dep = 0, N[1].Fa = N, N[1].Root = N + 1, DFS(N + 1);
  m = RD();
  for (register unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD();
    switch(A) {
      case(1): {
        C = RD();
        if(C == N[B].Col) break;
        if(C == N[B].Fa->Col) N[B].Root = N[B].Fa->Root;
        else N[B].Root = N + B;
        N[B].Col = C, DFS1(N + B), Node *now(N + B);
        while (now) Udt(now), now = now->Fa;
        break;
      }
      case(2): {
        C = RD();
        if(C == N[B].Col) break;
        Node *Dest(N[B].Root);
        DFS2(Dest), Dest->Col = C;
        if(C == Dest->Fa->Col) Dest->Root = Dest->Fa->Root;
        else Dest->Root = Dest;
        DFS3(Dest->Root);
        break;
      }
      case(3): {
        printf("%u %u %u\n", N[B].Col, N[B].Root->Siz, N[B].Root->QwQ);
        break;
      }
    }
  } 
  return 0;
}
```

正解是每个连通块用一个平衡树维护, 因为颜色数量极少, 所以可以每个点分颜色存儿子 (就是邻接表的首个儿子, 存 $30$ 个), 这样可以更快地遍历所需颜色的儿子, 进行块内搜索. 相当于是维护树套平衡树, 单点修改就是点的分裂, 区间修改就是点的合成, 然后查询的是点的信息.

将平衡树持久化以保证时间复杂度.

## Ynoi2015

查区间乘积约数个数.

如果定义 $Cnt_i$ 是第 $i$ 个质数在当前区间中的出现次数.

$Ans = \displaystyle{\prod_{i}^{i \in [l, r]}} Cnt_{i} - 1$

这样就能用莫队维护 $Cnt_i$ 数组了.

预处理每个数的所有质因数, 建一个 `vector` $V_{i, j}$ 表示数字 $i$ 的第 $j$ 个质因数, 由于在值域为 $k$ 的情况下, 质因数的数量是 $O(logk)$. 所以增量的复杂度 $O(logk)$.

莫队的增量数量复杂度是 $O(n\sqrt m)$, 所以总复杂度 $O(n \sqrt m logk)$.