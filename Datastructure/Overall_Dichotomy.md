# 整体二分(Overall Dichotomy)

如果每个询问都要二分答案, 每次 `check` 可以同时 `check` 多个询问, 可以同时对所有询问二分答案以优化复杂度.

## [模板题](https://www.luogu.com.cn/problem/P3527)

[双倍经验](https://www.luogu.com.cn/problem/SP10264)

给一个长度为 $m$ 的序列, 一开始都是 $0$, 有一些区间增加操作. 每个元素属于一个人, 每个人有需求, 共 $n$ 对于每个人, 询问最少进行到第几个操作, 使得属于这个人的所有元素之和达到这个人的需求.

我们对于所有的位置进行二分答案. 将达到需求的人和他们拥有的元素分到右边, 没达到需求的人和他们拥有的元素分到左边. 递归解决两个子问题.

每层递归需要进行或撤销 $O(\frac k2)$ 次操作, 最多进行 $O(\log k)$ 次操作, 每次进行或撤销时, 需要二分查找操作位置, 单次 $O(\log m)$. 每层 `check` 需要 $O(m)$ 来计算差分数组的和. 所以总复杂度是 $O(mk \log k \log m)$.

这个题的核心部分还可以通过主席树来实现, 只是空间占用较大, 无法在 loj 上通过.

```cpp
long long Tmp[300005];
int Act[600005][3];
unsigned Find[300005], Tim[600005];
unsigned Ans[300005], m, n, k;
unsigned A(0), B, C, D, t;
unsigned Cnt(0);
struct Station {
  long long Val;
  unsigned Pos, Bel;
  const inline char operator < (const Station& x) const { return Pos < x.Pos; }
}S[300005];
struct People {
  long long Ned, Now;
  unsigned Num;
}P[300005];
inline void Do(unsigned L, unsigned R, long long V, unsigned Sl, unsigned Sr) {
  if (R < S[Sl].Pos) return;
  if (L > S[Sr].Pos) return;
  unsigned Bl(Sl), Br(Sr), BMid;
  while (Bl ^ Br) {
    BMid = ((Bl + Br) >> 1);
    if (S[BMid].Pos >= L) Br = BMid;
    else Bl = BMid + 1;
  }
  Tmp[Bl] += V;
  Bl = Sl + 1, Br = Sr + 1;
  while (Bl ^ Br) {
    BMid = ((Bl + Br) >> 1);
    if (S[BMid].Pos > R) Br = BMid;
    else Bl = BMid + 1;
  }
  Tmp[Bl] -= V;
}
inline void Solve(unsigned Cur, unsigned L, unsigned R, unsigned Pl, unsigned Pr, unsigned Sl, unsigned Sr) {
  if (L == R) { for (unsigned i(Pl); i <= Pr; ++i) Ans[P[i].Num] = Tim[L]; return; }
  if (Sl > Sr) { for (unsigned i(Pl); i <= Pr; ++i) Ans[P[i].Num] = 0x3f3f3f3f; return; }
  memset(Tmp + Sl - 1, 0, (Sr - Sl + 2) << 3);
  unsigned Mid((L + R) >> 1), STop(Pl), Top(Sr);
  while (Cur < Mid) ++Cur, Do(Act[Cur][0], Act[Cur][1], Act[Cur][2], Sl, Sr);
  while (Cur > Mid) Do(Act[Cur][0], Act[Cur][1], -Act[Cur][2], Sl, Sr), --Cur;
  for (unsigned i(Pl); i <= Pr; ++i) P[i].Now = 0;
  for (unsigned i(Sl); i <= Sr; ++i) {
    Tmp[i] += Tmp[i - 1], S[i].Val += Tmp[i], P[Find[S[i].Bel]].Now += S[i].Val;
    P[Find[S[i].Bel]].Now = min((long long)10000000000, P[Find[S[i].Bel]].Now);
  }
  for (unsigned i(Pl); i <= Pr; ++i) if (P[i].Now >= P[i].Ned) swap(P[STop], P[i]), swap(Find[P[STop++].Num], Find[P[i].Num]);
  for (unsigned i(Sr); i >= Sl; --i) if (Find[S[i].Bel] >= STop) swap(S[Top--], S[i]);
  sort(S + Sl, S + Top + 1);
  if (Pl < STop) Solve(Cur, L, Mid, Pl, STop - 1, Sl, Top);
  if (STop <= Pr) Solve(Cur, Mid + 1, R, STop, Pr, Top + 1, Sr);
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= m; ++i) S[i].Bel = RD(), S[i].Pos = i;
  for (unsigned i(1); i <= n; ++i) P[i].Ned = RD(), P[i].Num = Find[i] = i;
  k = RD();
  for (unsigned i(1); i <= k; ++i) {
    B = RD(), C = RD(), D = RD();
    if (B <= C) Act[++A][0] = B, Act[A][1] = C, Act[A][2] = D, Tim[A] = i;
    else {
      Act[++A][0] = 1, Act[A][1] = C, Act[A][2] = D, Tim[A] = i;
      Act[++A][0] = B, Act[A][1] = m, Act[A][2] = D, Tim[A] = i;
    }
  }
  Tim[A + 1] = 0x3f3f3f3f, Solve(0, 1, A + 1, 1, n, 1, m);
  for (unsigned i(1); i <= n; ++i) if (Ans[i] >= 0x3f3f3f3f) printf("NIE\n"); else printf("%u\n", Ans[i]);
  return Wild_Donkey;
}
```

## [另一个模板题](https://www.luogu.com.cn/problem/P1527)

给一个 $n$ 阶方阵, $m$ 次查询子矩阵的第 $k$ 小值.

离散化权值, 整体二分权值. 接下来考虑如何 `check`.

我们根据二维差分把每个查询分成四个查询. 新的查询是特殊的, 它们所查询的是原矩阵右上角的子矩阵.


一个做法是用二维树状数组直接维护小于等于权值 $x$ 的元素数量, 把离散化后的每个权值所包含的元素的位置记录下来, 每次把一个权值的元素插入或移除树状数组, 需要 $O(n^2\log n)$ 次修改, 每次修改 $O(\log^2 n)$, 进行 $O(m \log n)$ 次查询, 每次查询 $O(\log^2 n)$. 总复杂度 $O((n^2 + m)\log^3 n)$.

另一个做法是采用回滚树状数组, 通过排序减少了树状数组的维数, 避免了二维树状数组的使用. 我们可以使每次处理答案在 $[l, r]$ 范围内的询问时, 树状数组的状态为全空, 然后把权值在 $[l, mid]$ 的元素插入树状数组. 如果这时每个询问存储的查询结果初始值即为它们的子矩阵包含的在 $[1, l)$ 之内的元素的数量, 那么查询树状数组后得到的便是 $[1, mid]$ 的元素数量. 我们把所有要插入的元素按第一维坐标排序, 在插入完所有第一维坐标 $<= x$ 的待插入元素后, 查询第一维坐标为 $x$ 的询问, 就可以避免二维树状数组了. 每次需要给元素和询问排序, 复杂度为每层 $O(m \log m + n^2 \log n)$, 而查询和修改树状数组每层是 $O((n^2 + m)\log n)$, 所以总复杂度是 $O(m \log m\log n+ n^2 \log^2 n + m\log^2 n)$.

代码用的是第二种做法.

```cpp
#define Lbt(x) ((x)&((~(x))+1))
unsigned List[1000005], Val[1000005], a[505][505], b[250005], T[505];
unsigned m, n, Csq(0), LsC(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0);
unsigned Pls(0);
vector<pair<unsigned, unsigned> >V[250005];
struct Qry {
  unsigned Ans, Now, K;
}Q[60005];
struct SubQ {
  unsigned Bel, X, Y;
  char Type;
  inline const char operator < (SubQ& x) { return X < x.X; }
}Sq[240005];
inline void Chg(unsigned x) { for (;x <= n; x += Lbt(x)) if (Pls) ++T[x]; else --T[x]; }
inline void Ask(unsigned x) { for (;x; x -= Lbt(x)) Tmp += T[x]; }
inline void Solve(unsigned L, unsigned R, unsigned Ql, unsigned Qr) {
  if (L == R) { for (unsigned i(Ql); i <= Qr; ++i) Q[Sq[i].Bel].Ans = L; return; }
  if (Ql > Qr) return;
  unsigned Mid((L + R) >> 1), Bot(Ql), LastT(LsC), J(0);
  sort(Sq + Ql, Sq + Qr + 1);
  vector <pair <unsigned, unsigned> > Edit;
  for (unsigned i(Ql); i <= Qr; ++i) List[++LsC] = Sq[i].Bel;
  sort(List + LastT + 1, List + LsC + 1), LsC = unique(List + LastT + 1, List + LsC + 1) - List - 1;
  for (unsigned i(LastT + 1); i <= LsC; ++i) Val[i] = Q[List[i]].Now;
  for (unsigned i(L); i <= Mid; ++i) for (auto j : V[i]) Edit.push_back(j);
  sort(Edit.begin(), Edit.end()), Pls = 1;
  for (unsigned i(Ql); i <= Qr; ++i) {
    while ((J < Edit.size()) && (Edit[J].first <= Sq[i].X)) Chg(Edit[J++].second);
    Tmp = 0, Ask(Sq[i].Y), Tmp = (Sq[i].Type) ? (-Tmp) : Tmp, Q[Sq[i].Bel].Now += Tmp;
  }
  for (unsigned i(Ql); i <= Qr; ++i) if (Q[Sq[i].Bel].Now >= Q[Sq[i].Bel].K) swap(Sq[Bot++], Sq[i]);
  Pls = 0; while (J) Chg(Edit[--J].second);
  Solve(Mid + 1, R, Bot, Qr);
  for (; LsC > LastT;--LsC) Q[List[LsC]].Now = Val[LsC];
  Solve(L, Mid, Ql, Bot - 1);
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j) b[++Cnt] = a[i][j] = RD();
  sort(b + 1, b + Cnt + 1), Cnt = unique(b + 1, b + Cnt + 1) - b;
  for (unsigned i(1); i <= n; ++i) for (unsigned j(1); j <= n; ++j)
    V[lower_bound(b + 1, b + Cnt, a[i][j]) - b].push_back(make_pair(i, j));
  for (unsigned i(1); i <= m; ++i) {
    A = RD(), B = RD(), C = RD(), D = RD();
    Sq[++Csq] = SubQ{ i, A - 1, B - 1 ,0 };
    Sq[++Csq] = SubQ{ i, C, B - 1 ,1 };
    Sq[++Csq] = SubQ{ i, A - 1, D ,1 };
    Sq[++Csq] = SubQ{ i, C, D ,0 };
    Q[i].K = RD();
  }
  Solve(1, Cnt - 1, 1, Csq);
  for (unsigned i(1); i <= m; ++i) printf("%u\n", b[Q[i].Ans]);
  return Wild_Donkey;
}
```