# 不删除莫队

为了做字符串被迫学莫队的屑是我了.

## 模板

询问区间相同的数的最大间隔.

## 不删除

首先考虑不删除的情况, 维护两个数组 $Fst$, $Lst$, 分别表示当前区间内某个数第一次出现的下标和最后一次出现的下标. 每次增加一个元素 $a_i$, 将对应的 $Fst$ 或 $Lst$ 修改为 $i$ 即可.

在修改的同时, 计算 $Lst$ 和 $Fst$ 的差, 然后尝试更新答案.

## 回滚

为了避免删除, 采用复位的操作撤销加入. 假设对左边界分块, 右边界为第二关键字.

有两种复位, 一种是复位左边界, 一种是复位整个区间.

每次只要移动右端点, 并且左端点小于当前查询的左边界, 就需要复位左边界到左边界初始位置. (因为每次询问都复位的复杂度不是错的, 于是每次询问都复位左边界)

由于左边界在同一个块内的右边界单增, 所以每次左边界的块改变的时候, 将整个区间复位, 并且重新确定左边界初始位置.

初始位置, 即区间长度为 $0$ 的时候, 左边界的位置. 对于一次询问的右边界和左边界在同一个块中的情况, 左边界初始位置设为询问右边界 $+1$, 这样这次询问就都移动左边界即可. 对于不在同一个块的情况, 将左边界初始位置定为询问所在的块的右端 $+1$ 即可.

## 代码实现

用一个栈维护左边界移动的时候, 数组和答案的变化情况, 每次复位弹栈撤销操作即可.

```cpp
unsigned b[200005], a[200005], Fst[200005], Lst[200005];
unsigned* ValMx, m, n, Cnt(0), A, B, C, D, t, Ans[200005], Tmp(0);
unsigned BlcLen, STop(0);
struct Qry {
  unsigned L, R, Bel, Num;
  inline const char operator < (const Qry& x) const {
    return (this->Bel ^ x.Bel) ? (this->Bel < x.Bel) : (this->R < x.R);
  }
}Q[200005];
struct Stack {
  unsigned Pos, Val1, Val2, MxAns;
}S[1005];
void ClrA() {
  STop = 0;
  memset(Lst, 0, (n + 1) << 2);
  memset(Fst, 0, (n + 1) << 2);
}
unsigned ClrL() {
  register unsigned ClAns;
  while (STop) Fst[S[STop].Pos] = S[STop].Val1, Lst[S[STop].Pos] = S[STop].Val2, ClAns = S[STop--].MxAns;
  return ClAns;
}
signed main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i) b[i] = a[i] = RD();
  sort(b + 1, b + n + 1), ValMx = unique(b + 1, b + n + 1);
  for (register unsigned i(1); i <= n; ++i) a[i] = lower_bound(b + 1, ValMx, a[i]) - b;
  m = RD(), BlcLen = (n / sqrt(m)) + 1;
  for (register unsigned i(1); i <= m; ++i) Q[i].L = RD(), Q[i].R = RD(), Q[i].Num = i, Q[i].Bel = Q[i].L / BlcLen;
  sort(Q + 1, Q + m + 1);
  for (register unsigned i(1), NowL(1), NowR(0), NowAns(0); i <= m; ++i) {
    if (Q[i - 1].Bel ^ Q[i].Bel) ClrA(), NowL = Q[i].R + 1, NowR = NowL - 1;
    NowL += STop, NowAns = ClrL();
    if (NowR < NowL) NowL = min((Q[i].Bel + 1) * BlcLen, Q[i].R + 1), NowR = NowL - 1, NowAns = 0;
    while (NowR < Q[i].R) {
      ++NowR, Lst[a[NowR]] = NowR;
      if (Fst[a[NowR]]) NowAns = max(NowAns, NowR - Fst[a[NowR]]);
      else Fst[a[NowR]] = NowR;
    }
    while (NowL > Q[i].L) {
      ++STop, --NowL, S[STop].Pos = a[NowL];
      S[STop].Val1 = Fst[a[NowL]], S[STop].Val2 = Lst[a[NowL]];
      Fst[a[NowL]] = NowL, S[STop].MxAns = NowAns;
      if (Lst[a[NowL]]) NowAns = max(NowAns, Lst[a[NowL]] - NowL);
      else Lst[a[NowL]] = NowL;
    }
    Ans[Q[i].Num] = NowAns;
  }
  for (register unsigned i(1); i <= m; ++i) printf("%u\n", Ans[i]);
  return Wild_Donkey;
}
```