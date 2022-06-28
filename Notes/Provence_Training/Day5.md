# Day5

## Gp

维护一个序列, 支持:

单点修改 (颜色和权值)

从 $s$ 点往后, 选择一些连续的, 颜色不重复的点, 可以跳过 $k$ 个点, 也可以直接结束选择, 求最大合法权值和.

考场上写了一个 $nmlog^2n$ 的做法, 建 $O(n)$ 棵动态开点线段树, 每个颜色对应一棵, 维护两种信息: 区间内这个颜色的点数和区间内这个颜色的点的最大权值. 对于每个询问 $(s, k)$, 容易得到, 选的颜色越多答案越优, 在 $k$ 够用的情况下, 必须尽量往右走, 直到 $k$ 用完后遇到一个已经遇到的颜色停下.

在 $k$ 和 $s$ 一定时, 越往右走, 所需的 $k$ 越多, 所以可以二分答案找选点的终点, 由于维护了每种颜色的区间出现数, 所以对于一个待定的终点 $x$, 在每棵线段树上查询区间 $[s, x]$ 的出现数量, 只要出现超过 $1$ 次, 超出部分就会消耗 $k$, 如果所有颜色需要的 $k$ 足够, 则这个终点合法, 否则不合法, 单次 $Judge$ 是 $O(nlogn)$, 单次询问 $O(nlog^2n)$.

在询问终点的同时, 统计每种颜色在这个区间的最大权值, 然后求最大值之和, 这样最后的复杂度是 $O(nmlog^2n)$. 优化一下可以做到更小的常数, 但是都是 $30'$, 接下来的代码是场外优化后的:

```cpp
unsigned CntC(0), n, m, C[200005], V[200005], A, B, D, ColList[200005];
unsigned long long Ans(0);
char flg(0), Exist[200005];
set <unsigned> FindCol;
struct Node {
  Node *LS, *RS;
  unsigned Num, Max;
}N[10000005], *CntN(N), *List[200005];
void Udt(Node *x) {
  x->Max = x->Num = 0;
  if(x->LS) {
    x->Num += x->LS->Num;
    x->Max = max(x->Max, x->LS->Max);
  }
  if(x->RS) {
    x->Num += x->RS->Num;
    x->Max = max(x->Max, x->RS->Max);
  }
  return;
}
void Add (Node *x, unsigned Pos, unsigned L, unsigned R) {
  if(L == R) {
    x->Max = V[Pos];
    x->Num = 1;
    return;
  }
  unsigned Mid((L + R) >> 1);
  if(Pos <= Mid) {
    if(!(x->LS))  x->LS = ++CntN;
    Add(x->LS, Pos, L, Mid);
  } else {
    if(!(x->RS)) x->RS = ++CntN;
    Add(x->RS, Pos, Mid + 1, R);
  }
  return Udt(x);
}
void Era (Node *x, unsigned Pos, unsigned L, unsigned R) {
  if(L == R) {x->Max = 0, x->Num = 0; return;}
  unsigned Mid((L + R) >> 1);
  if(Pos <= Mid) {
    if(!(x->LS)) x->LS = ++CntN;
    Era(x->LS, Pos, L, Mid);
  } else {
    if(!(x->RS)) x->RS = ++CntN;
    Era(x->RS, Pos, Mid + 1, R);
  }
  return Udt(x);
}
unsigned Qry(Node *x, unsigned Low, unsigned High, unsigned L, unsigned R) {
  if(Low <= L && High >= R) return x->Num;
  unsigned Mid((L + R) >> 1), TmpNum(0);
  if(Low <= Mid) if(x->LS) TmpNum += Qry(x->LS, Low, High, L, Mid);
  if(High > Mid) if(x->RS) TmpNum += Qry(x->RS, Low, High, Mid + 1, R);
  return TmpNum;
}
unsigned Qry1(Node *x, unsigned Low, unsigned High, unsigned L, unsigned R) {
  if(Low <= L && High >= R) return x->Max;
  unsigned Mid((L + R) >> 1), TmpMax(0);
  if(Low <= Mid) if(x->LS) TmpMax = max(TmpMax, Qry1(x->LS, Low, High, L, Mid));
  if(High > Mid) if(x->RS) TmpMax = max(TmpMax, Qry1(x->RS, Low, High, Mid + 1, R));
  return TmpMax;
}
char Judge(unsigned L, unsigned R, unsigned Lim) {
  unsigned TmpNum(0);
  for (register unsigned i(1); i <= CntC; ++i) {
    TmpNum = Qry(List[ColList[i]], L, R, 1, n);
    Lim -= (TmpNum <= 1) ? 0 : (TmpNum - 1);
    if(Lim > 0x3f3f3f3f) return 0;
  }
  return 1;
}
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    C[i] = RD(), V[i] = RD();
    if(!List[C[i]]) List[C[i]] = ++CntN;
    Add(List[C[i]], i, 1, n);
    if(FindCol.find(C[i]) == FindCol.end()) {
      ColList[++CntC] = C[i];
      FindCol.insert(C[i]);
    }
  }
  C[n + 1] = C[n];
  for (register unsigned T(1); T <= m; ++T) {
    if(RD() & 1) {
      A = RD();
      Era(List[C[A]], A, 1, n);
      C[A] = RD(), V[A] = RD();
      if(!List[C[A]]) {
        List[C[A]] = ++CntN;
      }
      Add(List[C[A]], A, 1, n);
      if(FindCol.find(C[A]) == FindCol.end()) {
        ColList[++CntC] = C[A];
        FindCol.insert(C[A]);
      }
    } else {
      A = RD(), B = RD();
      Ans = 0;
      register unsigned Bot(min((A + B), n)), Top(n), Mid;
      while (Bot < Top) {
        Mid = (Bot + Top + 1) >> 1;
        if(Judge(A, Mid, B)) {
          Bot = Mid;
        } else {
          Top = Mid - 1;
        }
      }
      Ans = 0;
      for (register unsigned i(1); i <= CntC; ++i) {
        Ans += Qry1(List[ColList[i]], A, Bot, 1, n);
      }
      printf("%llu\n", Ans);
    }
  }
  return 0;
}
```

然后出场后被告知有一个极为无脑的 $O(nm)$ 贪心, 为了优化, 用 `set` 存颜色数, 因为颜色数虽然是 $O(n)$, 但实际一定远小于 $n$, 然后就 A 了, 可是为了卡 $O(nm)$, 事后出了加强数据, 只能跑 $55'$, 但是原数据在这种常数加持下是可以通过的 (甚至不需要 -o2, 真是见了鬼了):

```cpp
unsigned CntC(0), n, m, C[200005], V[200005], A, B, D, ColList[200005], Max[200005];
unsigned long long Ans(0);
char flg(0);
set <unsigned> FindCol;
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    C[i] = RD(), V[i] = RD();
    if(FindCol.find(C[i]) == FindCol.end()) {
      ColList[++CntC] = C[i];
      FindCol.insert(C[i]);
    }
  }
  C[n + 1] = C[n];
  for (register unsigned T(1); T <= m; ++T) {
    if(RD() & 1) {
      A = RD();
      C[A] = RD(), V[A] = RD();
      if(FindCol.find(C[A]) == FindCol.end()) {
        ColList[++CntC] = C[A];
        FindCol.insert(C[A]);
      }
    } else {
      D = A = RD(), B = RD();
      Ans = 0;
      for (; A <= n; ++A) {
        if(Max[C[A]]) --B;
        if(B > 0x3f3f3f3f) break;
        Max[C[A]] = max(Max[C[A]], V[A]);
      }
      for (register unsigned i(D); i < A; ++i) {
        Ans += Max[C[i]];
        Max[C[i]] = 0;
      }
      printf("%llu\n", Ans);
    }
  }
  return 0;
}
```

然而所谓的正解 (指能过数据加强版) 确实可以 $O(kmlogn)$, 思路 $Pre_i$ 表示 $i$ 前面第一个颜色为 $Col_i$ 的点的下标. 可以用 `multiset` 维护.

用数据结构维护 $Val$ 的区间和, 可以使用树状数组.

然后用数据结构维护 $[i, n]$ 中 $Pre$ 的最大值, 可知这个东西单调. 对于每个询问 $(x, 0)$, 先二分 $[x, n]$ 的最大值, 得到一个 $j$, 使得 $[j, n]$ 中的前缀最大值刚好大于等于 $x$, 次大值小于 $x$, 这个 $j - 1$ 就是我们选的区间的右端点. 因为 $j$ 是 $x$ 之后第一个和 $[x, j - 1]$ 有同样颜色的点, 所以不能选, 前面的点都能选.

对于询问 $(x, k)$, 枚举 $k$, 如果对于 $k - 1$ 的区间右端点是 $j$, 那么二分查找满足 $[j', n]$ 中前缀最大值刚好大于等于 $j$ 的 $j'$, 使 $j' - 1$ 作为新的右端点, 以此类推, 所以算法有 $k$ 倍常数.

过程中查询每一个区间的权值和作为答案, 需要 `long long`.

## Of

这个题同样是手玩也不会, 建好 ACAM, 发现自己什么都不会了, 然后就浪费了 $1.5h$ 的时间去推式子, 手玩样例, 做等比数列求和. 然后连代码都没敢交.

正解: 貌似也要建 ACAM, 但是这早就超出我能力范围了.

法二: 概率生成函数, 连 Trie 都不用建, 神奇的数学.

## Lxl

这题就是沾了随机的光, 这个题可以用一个数组暴力过去, 得 $30'$.

正解简直是人类智慧, 对于长度为 $n$ 的二进制串, 用 $\frac{n}{64}$ 个 `unsigned long long` 压位.

在最低位的整数不是 $1$ 时, 不考虑前面的整数状态. 操作时, 仅对低位的数进行 $*3 + 1$ 的操作, 后面留 $0$, 直到最后一个数是 $10000...$ 的形式, 这时, 记录总的后缀 $0$ 数量进入答案, 删除最低位的整数, 假设一共进行了 $x$ 次 $*3+1$ 的操作, 则前面的每个数都 $O(1)$ 地 $*3^x + (3^{x - 1} + 3^{x - 2} + ... + 3 + 1)$.

以此类推, 最后的复杂度是 $O((\frac {n}{64})^2 + n * k)$, $k$ 的意义是 $64$ 长度的 $01$ 串的操作数量.

## LCM Sum

求

$$
(\sum_{i = 1}^{n} lcm(i, i + 1, i + 2,...,i + k)) \% 10^9 + 7
$$

$1 \leq n \leq 10^{18}, 0 \leq k \leq 30$

考虑连续整数的 $LCM$ 的值的性质, 可以知道对于同一个 $k$, $\frac{\displaystyle{\prod_{i = x}^{x + k}} i}{lcm(x, x + 1,...,x + k)}$ 是个定值, $O(k)$ 枚举所有小于 $k$ 的质数即可求出定值 $c$. 求连乘之和, 然后乘这个定值的逆元. 连乘可以 $O(n)$ 推出, 这样就能过 $n \leq 10^7$ 的数据了. 用 CRT 优化可以做到 $\sqrt n k^2$, 具体操作我一个 CRT 都不会的人必然是不会的.

## Random

$n$ 个 $10^18$ 以内的随机数 $a_1, a_2, ... , a_n$, $10^10$ 以内的 $b_1, b_2, ..., b_n$, 求一个 $k$ 和 $m$ 使得存在某种排序让 $b_i = (a_i + k) \% m$ 并且一一对应.

