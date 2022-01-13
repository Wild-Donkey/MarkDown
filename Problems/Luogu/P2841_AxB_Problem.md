# P2841 A*B Problem

这是一篇高精度 DP 的题解。

## 题目大意

给一个数 $A$，找出最小的 $B$ 使得 $A*B$ 的十进制表示中只包含 $0$ 和 $1$。

## DP 设计

一看到这个题，想到的是从低位到高位确定 $B$，因为 $B$ 的高位无法影响 $A * B$ 的低位，积的低位和 $B$ 的高位无关恰恰就是 DP 无后效性的原则。

设计状态 $f_{i, j}$ 表示已经确定了 $B$ 最低的 $i$ 位，记作 $B'$，并且 $B'$ 满足 $A*B'$ 最低的 $i$ 位只有 $0$ 和 $1$，还满足 $\lfloor \frac {A*B'}{10^i} \rfloor = j$ 的最小的 $B'$。转移很显然：

$$
f_{i, \lfloor \frac {j + kn}{10}\rfloor} = \min_{(j + kn) \mod 10 < 2} f_{i - 1, j} + k10^i
$$

转移的意义是在保证第 $i$ 低位小于 $2$ 的前提下，尽可能最小化 $B'$. 每次 DP 完一个阶段 $i$, 寻找是否存在十进制表示是由 $0$ 和 $1$ 组成的 $j$, 满足 $f_{i, j} < \infin$。

## 代码实现

需要用到的高精计算是：高精度加法，高精乘低精，高精度比较。写一个大整数类解决之。

```cpp
struct BI {
  unsigned Len;
  char a[205];
  inline BI() { Len = 1; a[0] = 0; }
  inline void Prt() {
    for (unsigned i(Len - 1); ~i; --i) putchar('0' + a[i]);
  }
  inline void Big() { Len = 200, a[199] = 1; }
  inline void operator = (unsigned x) {
    a[0] = 0;
    for (Len = 1; x; x /= 10, ++Len) a[Len - 1] = x % 10;
    if (Len > 1)--Len;
  }
  const inline char operator <(const BI& x) {
    if (Len ^ x.Len) return Len < x.Len;
    for (unsigned i(Len - 1); ~i; --i) if (a[i] ^ x.a[i]) return a[i] < x.a[i];
    return 0;
  }
  inline BI operator +(const BI& x) {
    BI Rt(x);
    char Up(0);
    for (unsigned i(max(Len, Rt.Len) + 1); i >= Rt.Len; --i) Rt.a[i] = 0;
    Rt.Len = max(Len, Rt.Len) + 1;
    for (unsigned i(0); i < Len; ++i) {
      Rt.a[i] += a[i] + Up, Up = 0;
      while (Rt.a[i] >= 10) Rt.a[i] -= 10, ++Up;
    }
    for (unsigned i(Len); i < Rt.Len && Up; ++i) {
      Rt.a[i] += Up, Up = 0;
      while (Rt.a[i] >= 10) Rt.a[i] -= 10, ++Up;
    }
    while (Up) {
      Rt.a[Rt.Len] = Up, Up = 0;
      while (a[Rt.Len] >= 10) Rt.a[Rt.Len] -= 10, ++Up;
      ++(Rt.Len);
    }
    while ((!(Rt.a[Rt.Len - 1])) && (Rt.Len > 1)) --(Rt.Len);
    return Rt;
  }
  inline BI operator *(const unsigned& x) {
    BI Rt(*this);
    unsigned MuT(0);
    for (unsigned i(Len); i <= 200; ++i) Rt.a[i] = 0;
    for (unsigned i(0); i < Len; ++i) MuT += a[i] * x, Rt.a[i] = MuT % 10, MuT /= 10;
    while (MuT) Rt.a[(Rt.Len)++] = MuT % 10, MuT /= 10;
    return Rt;
  }
}f[2][10005], Ten[205], Ans;
inline BI Suf(unsigned x, unsigned y) {
  BI Rt;
  Rt.Len = y + 1;
  for (unsigned i(0); i <= y; ++i) Rt.a[i] = 0;
  Rt.a[y] = x;
  return Rt;
}
const unsigned Fin[2][10] = { {0, 9, 8, 7, 6, 5, 4, 3, 2, 1},{1, 0, 9, 8, 7, 6, 5, 4, 3, 2} };
unsigned D, t, n;
unsigned Cnt(0), Len(0);
set<unsigned long long> Tai[10];
bitset <10005> OK;
signed main() {
  n = RD(), OK[0] = 1, Ans.Big();
  for (unsigned i(1); i <= n; ++i) OK[i] = (OK[i / 10] & ((i % 10) < 2));
  if (OK[n]) { printf("1 %u\n", n);return 0; }
  for (unsigned i(0); i <= 200; ++i) Ten[i].Len = i + 1, Ten[i].a[i] = 1;
  for (unsigned i(0); i < 10; ++i) Tai[(n * i) % 10].insert(i);
  for (unsigned i(0); i <= n; ++i) f[0][i].Big();
  for (auto i : Tai[0]) f[0][i * n / 10] = i;
  for (auto i : Tai[1]) f[0][i * n / 10] = i;
  while (1) {
    for (unsigned i(1); i <= n; ++i) if (OK[i] & (f[Len & 1][i] < Ten[199])) if (f[Len & 1][i] < Ans) Ans = f[Len & 1][i];
    if (Ans < Ten[199]) break;
    ++Len;
    for (unsigned i(0); i <= n; ++i) f[Len & 1][i].Big();
    for (unsigned i(0); i <= n; ++i) {
      for (auto j : Tai[Fin[0][i % 10]]) {
        unsigned Des((j * n + i) / 10);
        BI Tmp(f[(Len & 1) ^ 1][i] + Suf(j, Len));
        if (Tmp < f[Len & 1][Des]) f[Len & 1][Des] = Tmp;
      }
      for (auto j : Tai[Fin[1][i % 10]]) {
        unsigned Des((j * n + i) / 10);
        BI Tmp(f[(Len & 1) ^ 1][i] + Suf(j, Len));
        if (Tmp < f[Len & 1][Des]) f[Len & 1][Des] = Tmp;
      }
    }
  }
  Ans.Prt(), putchar(' '), (Ans * n).Prt(), putchar(0x0A);
  return Wild_Donkey;
}
```