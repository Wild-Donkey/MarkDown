# Day2

## Hamiltonian

基环树和树构成的森林. 每个节点的值可以单向延边流向字节点, 总共可以给任意点增加权值 $m$, 求最小值最大.

这个题的部分分给的特别多, 暴力打满就有 $72'$. 场上我一个半小时写了 $56'$ 的数据点分治, 结果实测只 $52'$.

最后 $1H$ 的时候想到能用二分答案, 写到最后 $10min$ 也过不了大样例. 于是将暴力改改, 数据点分治, 暴力都解决不了的甩锅给二分答案, 爱得几分得几分, 发现最后的暴力是 $56'$, 合着是二分答案作为正解就得了 $16'$.

不过最后只跑二分答案貌似也是 $72'$, 所以还是问题不大.

下面是我的多级甩锅数据点分治, 考场 $72'$ 还不如暴力打满来的爽快的代码 (注释中出现的是数据点编号):

```cpp
unsigned n, m, From[1000005], Cnt(0);
unsigned long long Ans(0), a[1000005], Sum[1000005], CirSum(0), Ave[1000005], CirAve(0), f[1000005], L, R, Mid, Root[1000005];
char flg(0), Yes[1000005], OnCir[1000005];
long long Left;
struct Node {
  Node *Son, *Bro;
}N[1000005];
void DFS1(Node *x) {
  register Node *now(x->Son);
  while (now) {
    if(!Root[now - N]) {
      Root[now - N] = Root[x - N];
      DFS1(now);
    }
    now = now->Bro;
  }
  return;
}
long long DFS(Node *x, long long Fa) {
  register long long Tmp(Fa);
  if(a[x - N] > Mid) {
    Fa += a[x - N] - Mid;
  } else {
    Fa -= Mid - a[x - N]; 
  }
  Yes[x - N] = 1; 
  register Node *now(x->Son);
  while (now) {
    if(!Yes[now - N]) {
      Fa = DFS(now, Fa);
    }
    now = now->Bro;
  }
  if(OnCir[x - N]) {
    return Fa;
  }
  return min(Fa, Tmp);
}
char Judge(unsigned long long x) {
  Left = m;
  for (register unsigned i(1); i <= n; ++i) {
    if(!Yes[i]) {
      Left = DFS(N + i, Left);
    }
  }
  return Left >= 0;
}
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    From[i] = RDsg();
    if(From[i] > 0x3f3f3f3f || From[i] == i) {
      From[i] = 0;
    }
  }
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD();
    Sum[i] = Sum[i - 1] + a[i];
    Ave[i] = Sum[i] / i;
  }
  if(!Sum[n]) {  //6, 16, 17, 19
    printf("%llu\n", m / n);
    return 0;
  }
  for (register unsigned i(1); i < n; ++i) {
    if(From[i + 1] ^ i) {
      flg = 1; break;
    }
  }
  if(!flg) {
    if(From[1] == n) {  // 8, 9, 10, 11, 12, 13
      printf("%llu\n", (Sum[n] + m) / n);
      return 0;
    }
    if(!From[1]) {      // 3, 4, 5, 7
      a[1] += m, Ave[1] = a[1], f[1] = 0;
      for (register unsigned i(2); i <= n; ++i) {
        if(Ave[i - 1] < a[i]) {
          Ave[i] = Ave[i - 1];
          f[i] = f[i - 1] + a[i] - Ave[i - 1];
        } else {
          if(f[i - 1] <= Ave[i - 1] - a[i]) {
            Ave[i] = (Sum[i] + m) / i;
            f[i] = (Sum[i] + m) % i;
          } else {
            Ave[i] = Ave[i - 1];
            f[i] = f[i - 1] - Ave[i - 1] + a[i];
          }
        }
      }
      printf("%llu\n", Ave[n]);
      return 0;
    }
  }
  for (register unsigned i(1); i <= n; ++i) {
    if(From[i]) {
      N[i].Bro = N[From[i]].Son;
      N[From[i]].Son = N + i;
    }
  }
  for (register unsigned i(1); i <= n; ++i) {
    flg = 0;
    register unsigned j(i);
    while(!Root[j]) {
      if(Yes[j]) {
        Yes[j] = 0, OnCir[j] = 1;
        Root[j] = j;
        register unsigned Tmpj(j);
        j = From[i];
        while(!Root[j]) {
          Root[j] = Tmpj;
          Yes[j] = 0, OnCir[j] = 1;
          j = From[j];
        }
        flg = 1; break;
      }
      Yes[j] = 1;
      if(!From[j]) {
        Root[j] = j;
        DFS1(N + j);
        flg = 1; break;
      }
      j = From[j];
    }
    if(!flg) {
      DFS1(N + j);
    }
  }
  L = 0, R = (Sum[n] + m) / n;
  while (L < R) {
    memset(Yes, 0, n + 1);
    Mid = ((L + R + 1) >> 1);
    if(Judge(Mid)) {
      L = Mid;
    } else {
      R = Mid - 1;
    }
  }
  printf("%llu\n", L);
  return 0;
}
```

接下来是把我的二分答案调成 $100'$, 用了一个晚自习将自己的程序调成 $92'$, 被卡常了, 冯育硕被卡常真是让人笑话. 在卡了一个小时常数后, 我成功通过了此题. 由于是在考场代码的基础上删掉数据点分治改的, 所以看起来会很难受, 但是能过.

```cpp
int n, m, From[1000005], Cnt(0), Ans(0), List[1000005], Size[1000005];
char flg(0), Yes[1000005], OnCir[1000005], Vis[1000005];
long long a[1000005], Sum(0), Left, L, R, Mid;
struct Node {
  Node *Son, *Bro;
}N[1000005];
void DFS1(Node *x) {
  register Node *now(x->Son);
  while (now) {
    if(!Vis[now - N]) {
      Vis[now - N] = 1;
      DFS1(now);
    }
    now = now->Bro;
  }
  return;
}
long long DFS(Node *x, long long Fa) {
  register long long Tmp(Fa);
  if(OnCir[x - N]) {
    Fa += a[x - N] - (Mid * Size[x - N]);
  } else {
    Fa += a[x - N] - Mid;
  }
  Yes[x - N] = 1;
  register Node *now(x->Son);
  while (now) {
    if(!(Yes[now - N] & OnCir[now - N])) Fa = DFS(now, Fa);
    now = now->Bro;
  }
  return min(Fa, Tmp);
}
char Judge() {
  Left = m;
  for (register int i(1); i <= Cnt; ++i) {
    Left = DFS(N + List[i], Left);
  }
  return Left >= 0;
}
int main() {
  n = RD(), m = RD();
  for (register int i(1); i <= n; ++i) {
    From[i] = RDsg();
    if(From[i] < 0 || From[i] == i) From[i] = 0;
  }
  for (register int i(1); i <= n; ++i) a[i] = RD(), Sum += a[i];
  for (register int i(1); i <= n; ++i) if(From[i])
      N[i].Bro = N[From[i]].Son, N[From[i]].Son = N + i;
  for (register int i(1), j; i <= n; ++i) {
    flg = 0, j = i;
    if(!Vis[j]) {
      while(j) {
        if(!From[j]) {
          Vis[j] = 1, Size[j] = 1, List[++Cnt] = j, DFS1(N + j), flg = 1; break;
        }
        if(Yes[j]) {
          register int Tmpj(j);
          Vis[j] = 1, List[++Cnt] = j, j = From[i];
          while(!OnCir[j]) {
            Vis[j] = 1, OnCir[j] = 1, ++Size[Tmpj];
            if(j ^ Tmpj) {
              a[Tmpj] += a[j];
              register Node *now(N[j].Son), *TmpBro;
              N[j].Son = NULL;
              while(now) {
                TmpBro = now->Bro;
                if(!OnCir[now - N]) now->Bro = N[Tmpj].Son, N[Tmpj].Son = now;
                now = TmpBro;
              }
            }
            j = From[j];
          }
          DFS1(N + Tmpj), flg = 1; break;
        }
        Yes[j] = 1, j = From[j];
      }
    }
    if(!flg) DFS1(N + j);
  }
  flg = 0;
  L = 0, R = (Sum + m) / n;
  while (L < R) {
    memset(Yes, 0, n + 1);
    Mid = ((L + R + 1) >> 1);
    if(Judge()) {
      L = Mid;
    } else {
      R = Mid - 1;
    }
  }
  printf("%llu\n", L);
  return 0;
}
```

## Math

给三个等长序列, 定义区间 $[l, r]$ 的权值为三个序列的区间极差乘积.

这个题我上来就写了 $6$ 个 `ST 表` 然后把它用到了 $O(n^2)$ 暴力上.

这个题输出 $0$ 有 $20'$, $n^2$ 暴力有 $20'$, 所以我只得了 $40'$.

但是这个常数极大的 $O(n^2)$ 在别人大样例 $O(n^2)$ 跑进 $10s$ 的同时跑了 $180s$. 我当时傻了没发现 `ST 表` 徒增常数, 还好刘少卿的暴力跑了 $500s$.

下面是极具美学价值的考场代码:

```cpp
unsigned A, B, C, Log[100005], n, m, a[100005], b[100005], c[100005], STA1[100005][18], STA2[100005][18], STB1[100005][18], STB2[100005][18], STC1[100005][18], STC2[100005][18];
unsigned long long Ans(0);
char flg(0);
inline unsigned Find(unsigned x[][18], const unsigned &l, const unsigned &r, const char &Ma) {
  register unsigned LG(Log[r - l + 1]); 
  return Ma ? (max(x[l][LG], x[r - (1 << LG) + 1][LG])) : (min(x[l][LG], x[r - (1 << LG) + 1][LG]));
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = STA1[i][0] = STA2[i][0] = RD(); 
  }
  for (register unsigned i(1); i <= n; ++i) {
    if(a[i] ^ 1) {
      flg = 1;
      break;
    }
  }
  if(!flg) {
    printf("0\n");
    return 0;
  }
  flg = 0;
  for (register unsigned i(1); i <= n; ++i) {
    b[i] = STB1[i][0] = STB2[i][0] = RD();
  }
  for (register unsigned i(1); i <= n; ++i) {
    c[i] = STC1[i][0] = STC2[i][0] = RD();
  }
  for (register unsigned i(1), Lg(0); i <= n; i <<= 1, ++Lg) {
    Log[i] = Lg;
  }
  for (register unsigned i(1); i <= n; ++i) {
    Log[i] = max(Log[i], Log[i - 1]);
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STA1[i][loglen] = min(STA1[i][loglen - 1], STA1[i + leng][loglen - 1]);
    }
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STA2[i][loglen] = max(STA2[i][loglen - 1], STA2[i + leng][loglen - 1]);
    }
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STB1[i][loglen] = min(STB1[i][loglen - 1], STB1[i + leng][loglen - 1]);
    }
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STB2[i][loglen] = max(STB2[i][loglen - 1], STB2[i + leng][loglen - 1]);
    }
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STC1[i][loglen] = min(STC1[i][loglen - 1], STC1[i + leng][loglen - 1]);
    }
  }
  for (register unsigned len(2), loglen(1); len <= n; len <<= 1, ++loglen) {
    for (register unsigned i(n - len + 1), leng(len >> 1); i; --i) {
      STC2[i][loglen] = max(STC2[i][loglen - 1], STC2[i + leng][loglen - 1]);
    }
  }
  for (register unsigned i(1); i <= n; ++i)
    for (register unsigned j(i); j <= n; ++j)
      Ans += (Find(STA2, i, j, 1) - Find(STA1, i, j, 0)) * (Find(STB2, i, j, 1) - Find(STB1, i, j, 0)) * (Find(STC2, i, j, 1) - Find(STC1, i, j, 0));
  printf("%u\n", Ans);
  return 0;
}
```

其实还有 $20'$ 别人推式子能推出来线性算法, 但是我推了 $1H$ 还是没有推出来, 还是要在数学上下功夫.

最离谱的是我这个题本来想分块, 可惜分不得, 结果在第三道题上本来有分块的分却没想到.

## Leetcode

这个题维护的是一堆操作, 对输入值进行形如 $v = |x - v|$ 的操作, 每次查询 $v$ 在依次经历区间 $[l, r]$ 的所有操作后的值.

强制在线.

对于相同的起点和终点, 初值到结果的映射是一个分段函数, 段数和区间长度是指数关系. 用可持久化平衡树维护一个初始值的不同结果.

其实这个题我想了分层图, DP, 扫描线, 结果都没整出来, 唯一写出代码的 DP 还假了.

于是最后只写了一个 $20'$ 的无脑 $O(nm)$, 极简主义代码:

```cpp
unsigned n, m, a[100005], A, B, C, Last(0);
char flg(0);
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    a[i] = RD();
  }
  for (register unsigned i(1); i <= m; ++i) {
    A = RD() ^ Last, B = RD() ^ Last, C = RD() ^ Last;
    for (register unsigned j(A); j <= B; ++j) {
      C = (C < a[j]) ? (a[j] - C) : (C - a[j]);
    }
    printf("%u\n", Last = C);
  }
  return 0;
}
```

其实在值域足够小的部分分, 可以分块做, 这个分块也近乎无脑了, 可是我没有想到. (明明第二题像了那么多分块) 所以白白扔了 $20'$.

正解竟然真的是扫描线, 我场上想了, 但是没做出来...

## CF464E

$n$ 点 $m$ 边无向图. 第 $i$ 条边的边权是 $2^{x_i}$, 求两点最短路, 对 $10^9 + 7$ 取模.

用 `0/1 Trie` 维护路径长度, 跑 `Dijkstra`. 为了实现加法, 在 `Trie` 上线段树维护所有极长 `1` 串, 然后区间修改这个 `1` 串为 `0`, 单点修改进位.

## CF1446D2

求 $5 * 10^7$ 长度的序列中最长的最少包含两个出现次数最多的元素的字段长度.

显然需要线性算法.

考虑整个序列的全局众数 $x$ 的 $a$ 个位置, 因为出现两个及以上的众数, 必须减少区间中 $x$ 的数量.

## CF700D

给序列的元素进行哈夫曼编码, 每次查询某区间的哈夫曼编码最短的元素的编码长度.

所以统计所有出现的元素的出现数量, 离散化. 然后数据结构维护这些编码的哈希值.

## CF1476G

维护序列, 支持:

单点修改

查询区间中, 取 $k$ 个元素出现次数 $Cnt$ 的极差最小值

一个重要的性质: 不同的 $Cnt$ 值有 $\sqrt n$ 种. 达到这种上界的情况是不同的出现次数为 $1$, $2$, $3$,..., $x$, 这时序列长度为 $\frac{(1 + x)x}2$.

带修莫队维护出现次数, 离线询问, 每次取 $k$ 个元素的操作可以用数据结构维护 $Cnt$ 数组实现, 可能需要对元素的值进行离散化.

## CF1344E

一棵树, 从根往下走, 目标为点 $Dest$, 边权是通行时间, 点瞬间经过. 在某点只能往下走, 且只能往某个特定的儿子走, 每个 `Tick` 可选择修改任意一个点的后继儿子.

给一些出发时刻, 求是否能使所有时刻出发的点都能到达目标, 否则求首个偏离目标的时间. 并且求达到上面的结果进行的最小操作数.

启发式合并 + 平衡树
