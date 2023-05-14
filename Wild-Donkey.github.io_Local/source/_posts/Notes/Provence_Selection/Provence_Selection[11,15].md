---
title: 省选日记 Day11~15
date: 2022-04-21 17:19
categories: Notes
tags:
  - Dynamic_Programming
  - Dynamic_Programming_Optimization
  - Data_Structure
  - Segment_Tree
  - Monotonic_Stack
  - Topological_Sorting
  - Simulation
  - String_Hash
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/MC11.png
---

# 省选日记 Day $11$ - Day $15$

## Day $11$ Apr 14, 2022, Thursday

### [SDOI2019 染色](https://www.luogu.com.cn/problem/P5359)

一开始一眼看出 $O(n^3)$ 的做法, 设 $f_{i, j, k}$ 表示计算到第 $i$ 列, $(i, 1)$ 为颜色 $j$, $(i, 2)$ 为颜色 $k$ 的方案数. 统计 $U_{i, j}$ 作为所有 $f_{i, j, x}$ 的总和, 统计 $D_{i, j}$ 作为所有 $f_{i, x, j}$ 的总和, $Sum_i$ 作为所有 $f$, 转移是:

$$
f_{i, j, k} = Sum_{i - 1} - U_{i - 1, j} - D_{i - 1, k} + f_{i - 1, j, k}
$$

然后把和已经确定的位置的颜色相悖的 $f$ 值赋为 $0$. 我一直认为这个题需要什么奇妙科技以至于想了一个小时没有进展, 看了两眼题解发现貌似用不到什么奇技淫巧, 也是从这个暴力 DP 上发展而来的, 于是继续之前的 DP 进行优化.

如果滚动数组, 可以写成:

$$
f_{i, j} += Sum - U_i - D_j
$$

发现这个东西可以转化为全局加法, 行减, 列减, 全局求和, 行求和, 列求和, 只保留某行或某列的归零, 只保留单点的归零, 对角线删除. 行减列减容易维护, 只需要每行每列记录增加数量总和 $PR_i$, $PC_i$, 全局操作也是一样, 只需要记录全局每个元素增加的数量总和 $Pl$. 对于单点修改, 我们记录一个矩阵 $f_{i, j}$ 表示每个点增加的数量总和, 维护 $Sum$ 表示矩阵 $f$ 的总和, $U_i$ 和 $D_i$ 仍然表示矩阵第 $i$ 行和第 $i$ 列的总和.

全局总和是 $Sum + c(c - 1)Pl + (c - 1)\sum_{i = 1}^n (PR_i + PC_i)$, 第 $i$ 行的总和是 $U_i + (c - 1)(Pl + PR_i) + \sum_{j = 1, j \neq i}^n PC_j$, 第 $i$ 列的总和是 $D_i + (c - 1)(Pl + PC_i) + \sum_{j = 1, j \neq i}^n PR_j$.

最后是归零, 我们求一个单点的值的时间是 $O(1)$ 的, 所以可以在 $O(c)$ 之内求出所有保留位置的值, 直接赋到 $f$ 里面, 清空所有的 $PR$, $PC$, $Pl$ 值. 我们发现, $f$ 最多同时只有一行或一列或一个点有值, 所以不如直接存行的总和和列的总和来代表 $f$.

直接做可以搞到 $96'$ 的好成绩.

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned long long& x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
unsigned a[100005][2];
unsigned long long mm;
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0);
struct Sta {
  unsigned long long Pl, SumPR, SumPC, SumExist;
  unsigned PR[10005], PC[10005], Exist[10005], Pos;
  char Type;
  inline unsigned long long Sum () {
    return (SumExist + mm * Pl + (SumPR + SumPC) * (m - 1)) % Mod;
  }
  inline unsigned long long Get(unsigned x, unsigned y) {
    unsigned Ex(0);
    if(Type == 1) Ex = ((x == Pos) ? Exist[y] : 0);
    if(Type == 2) Ex = ((y == Pos) ? Exist[x] : 0);
    return (Pl + PR[x] + PC[y] + Ex) % Mod;
  }
  inline unsigned long long GetRow(unsigned x) {
    unsigned Ex(0);
    if(Type == 1) Ex = ((x == Pos) ? (Mod + SumExist - Exist[x]) : 0);
    if(Type == 2) Ex = ((x == Pos) ? 0 : Exist[x]);
    return ((Pl + PR[x]) * (m - 1) + Mod - PC[x] + SumPC + Ex) % Mod;
  }
  inline unsigned long long GetColumn(unsigned x) {
    unsigned Ex(0);
    if(Type == 1) Ex = ((x == Pos) ? 0 : Exist[x]);
    if(Type == 2) Ex = ((x == Pos) ? (Mod + SumExist - Exist[x]) : 0);
    return ((Pl + PC[x]) * (m - 1) + Mod - PR[x] + SumPR + Ex) % Mod;
  }
  inline void Clr() {
    Pl = 0;
    memset(PR + 1, 0, m << 2);
    memset(PC + 1, 0, m << 2);
  }
  inline void Udt() {
    SumExist = SumPR = SumPC = 0;
    for (unsigned i(1); i <= m; ++i) SumExist += Exist[i];
    for (unsigned i(1); i <= m; ++i) SumPC += PC[i];
    for (unsigned i(1); i <= m; ++i) SumPR += PR[i];
    SumExist %= Mod;
    SumPC %= Mod;
    SumPR %= Mod;
  }
}cl[2], *Cur(cl + 0), *Lst(cl + 1);
signed main() {
  n = RD(), mm = (m = RD()) - 1, mm = mm * m % Mod;
  for (unsigned i(1); i <= n; ++i) a[i][0] = RD();
  for (unsigned i(1); i <= n; ++i) a[i][1] = RD();
  if(a[1][0]) {
    Cur->Type = 1, Cur->Pos = a[1][0];
    if(a[1][1]) Cur->Exist[a[1][1]] = 1, Cur->SumExist = 1;
    else Cur->PR[Cur->Pos] = 1, Cur->SumPR = 1;
  }
  else {
    if(!a[1][1]) Cur->Type = 0, Cur->Pl = 1; 
    else Cur->Type = 2, Cur->PC[Cur->Pos = a[1][1]] = 1, Cur->SumPC = 1;
  }
  for (unsigned i(2); i <= n; ++i) {
    swap(Lst, Cur), Cur->Pl = Lst->Pl + Lst->Sum(), Mn(Cur->Pl); 
    for (unsigned j(1); j <= m; ++j) Cur->PR[j] = Lst->PR[j] + Mod - Lst->GetRow(j), Mn(Cur->PR[j]);
    for (unsigned j(1); j <= m; ++j) Cur->PC[j] = Lst->PC[j] + Mod - Lst->GetColumn(j), Mn(Cur->PC[j]);
    memcpy(Cur->Exist + 1, Lst->Exist + 1, m << 2), Cur->Type = Lst->Type, Cur->Pos = Lst->Pos;
    if(a[i][0]) {
      if (a[i][1]) {
        unsigned TmpC(Cur->Get(a[i][0], a[i][1]));
        memset(Cur->Exist + 1, 0, m << 2), Cur->Exist[a[i][1]] = TmpC;
      } else {
        for (unsigned j(1); j <= m; ++j) Lst->Exist[j] = Cur->Get(a[i][0], j); Lst->Exist[a[i][0]] = 0;
        memcpy(Cur->Exist + 1, Lst->Exist + 1, m << 2);
      }
      Cur->Clr(), Cur->Type = 1, Cur->Pos = a[i][0];
    } else {
      if (a[i][1]) {
        for (unsigned j(1); j <= m; ++j) Lst->Exist[j] = Cur->Get(j, a[i][1]); Lst->Exist[a[i][1]] = 0; 
        memcpy(Cur->Exist + 1, Lst->Exist + 1, m << 2);
        Cur->Clr(), Cur->Type = 2, Cur->Pos = a[i][1];
      }
    }
    Cur->Udt();
  }
  printf("%llu\n", Cur->Sum());
  return Wild_Donkey;
}
```

发现有两个 Type, 也就是说 $Exist$ 可能是行, 也可能是列, 我们使 $Exist$ 只表示某一行的信息. 这样相当于不存在某一列第一行是 $0$, 而第二行非零的情况, 如果出现, 转置所维护的矩阵并且上下翻转输入序列. 仍然是 $96'$.

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned long long& x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
unsigned a[100005][2];
unsigned long long mm;
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0);
char Type, EType;
struct Sta {
  unsigned long long SumPR, SumPC, SumExist;
  unsigned PR[10005], PC[10005], Exist[10005], Pos;
  inline unsigned long long Sum () {
    return (SumExist + (SumPR + SumPC) * (m - 1)) % Mod;
  }
  inline unsigned long long GetRow(unsigned x) {
    unsigned Ex(0);
    if(EType ^ Type) Ex = Exist[x];
    else Ex = ((x == Pos) ? SumExist : 0);
    return ((unsigned long long)PR[x] * (m - 1) + Mod - PC[x] + SumPC + Ex) % Mod;
  }
  inline unsigned long long GetColumn(unsigned x) {
    unsigned Ex(0);
    if(EType ^ Type) Ex = ((x == Pos) ? SumExist : 0);
    else Ex = Exist[x];
    return ((unsigned long long)PC[x] * (m - 1) + Mod - PR[x] + SumPR + Ex) % Mod;
  }
  inline unsigned long long Get(unsigned x, unsigned y) {
    if(x == y) return 0;
    unsigned Ex;
    if(EType ^ Type) Ex = ((y == Pos) ? Exist[x] : 0);
    else Ex = ((x == Pos) ? Exist[y] : 0);
    return (PR[x] + PC[y] + Ex) % Mod;
  }
  inline void Clr() {
    memset(PR + 1, 0, m << 2), memset(PC + 1, 0, m << 2), SumPR = SumPC = 0; 
  }
}cl[2], *Cur(cl + 0), *Lst(cl + 1);
inline void Flip() {
  Type ^= 1;
  swap(Cur->SumPR, Cur->SumPC);
  for (unsigned i(1); i <= m; ++i) swap(Cur->PC[i], Cur->PR[i]);
}
signed main() {
  n = RD(), mm = (m = RD()) - 1, mm = mm * m % Mod;
  for (unsigned i(1); i <= n; ++i) a[i][0] = RD();
  for (unsigned i(1); i <= n; ++i) a[i][1] = RD();
  if(a[1][1]) EType = Type = 1, swap(a[1][1], a[1][0]);
  if(a[1][0]) {
    Cur->Pos = a[1][0];
    if(a[1][1]) Cur->Exist[a[1][1]] = 1, Cur->SumExist = 1;
    else Cur->PR[Cur->Pos] = 1, Cur->SumPR = 1;
  } else {for (unsigned i(1); i <= m; ++i) Cur->PR[i] = 1; Cur->SumPR = m;}
  for (unsigned i(2); i <= n; ++i) {
    swap(Lst, Cur), Cur->SumPR = Cur->SumPC = 0;
    unsigned long long Pl(Lst->Sum());
    for (unsigned j(1); j <= m; ++j) 
      Cur->PR[j] = Lst->PR[j] + Mod - Lst->GetRow(j), Mn(Cur->PR[j]), Mn(Cur->PR[j] += Pl), Mn(Cur->SumPR += Cur->PR[j]);
    for (unsigned j(1); j <= m; ++j) 
      Cur->PC[j] = Lst->PC[j] + Mod - Lst->GetColumn(j), Mn(Cur->PC[j]), Mn(Cur->SumPC += Cur->PC[j]);
    memcpy(Cur->Exist + 1, Lst->Exist + 1, m << 2), Cur->Pos = Lst->Pos, Cur->SumExist = Lst->SumExist; 
    if(a[i][1]) {swap(a[i][1], a[i][0]); if(!Type) Flip(); }
    else if(Type) Flip();
    if(a[i][0]) {
      if (a[i][1]) {
        unsigned TmpC(Cur->Get(a[i][0], a[i][1]));
        memset(Cur->Exist + 1, 0, m << 2), Cur->SumExist = Cur->Exist[a[i][1]] = TmpC;
      } else {
        Cur->SumExist = 0;
        for (unsigned j(1); j <= m; ++j) Mn(Cur->SumExist += (Lst->Exist[j] = Cur->Get(a[i][0], j)));
        memcpy(Cur->Exist + 1, Lst->Exist + 1, m << 2);
      }
      Cur->Clr(), Cur->Pos = a[i][0], EType = Type;
    }
  }
  printf("%llu\n", Cur->Sum());
  return Wild_Donkey;
}
```

## Day $12$ Apr 15, 2022, Friday

### 还是那道题

看了题解发现我超脱了题解的路数, 以至于题解的方法无法优化这个做法, 而我也完全没有办法优化这个做法. 重新审视我们的转移, 发现每个阶段的转移只和当前列的状态有关, 而当前列为空白时, 所有状态从上一个阶段到下一个阶段的转移是相同的. 而当前列非空白时, 这个阶段有效状态数最多是 $O(c)$ 的.

仍然是遇到第二行有确定颜色就交换两行, 我们用 $f_{i, j}$ 表示第 $i$ 个非空列, 第二行是颜色 $j$ 的方案数. 处理 $g_{i, 0/1/2/3/4}$ 用来转移, 表示相邻两个非空列中间隔了 $i$ 列, 两端状态为 $0/1/2/3/4$ 五种情况的转移系数. 两端共四个格子, 这五种情况分别是:

- $0$ 表示四个颜色各不相同
- $1$ 表示同行的颜色相同而同列的不同
- $2$ 表示对角线上颜色相同而同行或同列颜色不同
- $3$ 表示只有一行颜色相同, 其余两个格子为不同颜色
- $4$ 表示只有一个对角线颜色相同, 其余两个格子为不同颜色.

发现有情况无法转移, 就是两端列存在空白列的情况, 这时需要预处理第一个阶段的 DP 值, 并且通过最后一个阶段的 DP 值算出答案.

$g$ 数组线性递推即可求出. 

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned long long& x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
bitset<100005> Flp;
unsigned a[100005][2], Pos[100005], f[100005], g[100005][5];
unsigned long long mm, M1, M2, M3, M4, Sum;
unsigned m, n;
unsigned Cnt(0), Ans(0);
inline unsigned ColorTwo(unsigned x) {return a[x][Flp[x] ^ 1];}
inline unsigned ColorOne(unsigned x) {return a[x][Flp[x]];}
inline unsigned long long Onesided(unsigned x) {
  if(!x) return 1; --x;
  return ((g[x][0] * M2 % Mod) * M3 + g[x][1] + g[x][2] + ((g[x][3] + g[x][4]) * M2 << 1)) % Mod;
}
inline void Mul(unsigned long long x) {
  Sum = Sum * x % Mod;
  for (unsigned i(1); i <= m; ++i) f[i] = f[i] * x % Mod;
}
inline void Add(unsigned x) {
  Sum = (Sum + (unsigned long long)m * x) % Mod;
  for (unsigned i(1); i <= m; ++i) Mn(f[i] += x);
}
inline void Def(unsigned x) {
  Sum = (m * x) % Mod;
  for (unsigned i(1); i <= m; ++i) f[i] = x;
}
inline void Set(unsigned x, unsigned y) {
  Mn(Sum += y + Mod - f[x]), Mn(Sum), f[x] = y;
}
inline unsigned long long Find(unsigned x) {
  return f[x];
}
signed main() {
  n = RD(), mm = (m = RD()) - 1, mm = mm * m % Mod;
  M1 = m - 1, M2 = m - 2, M3 = m - 3, M4 = m - 4; 
  for (unsigned i(1); i <= n; ++i) a[i][0] = RD();
  for (unsigned i(1); i <= n; ++i) a[i][1] = RD();
  g[0][0] = g[0][2] = g[0][4] = 1, g[0][1] = g[0][3] = 0;
  for (unsigned i(1); i <= n; ++i) {
    g[i][0] = (g[i - 1][0] * ((M3 * M4 + 1) % Mod) + g[i - 1][1] + g[i - 1][2] + ((g[i - 1][3] + g[i - 1][4]) * M3 << 1) % Mod) % Mod;
    g[i][1] = ((g[i - 1][0] * M2 % Mod) * M3 + g[i - 1][2] + (g[i - 1][4] * M2 << 1)) % Mod;
    g[i][2] = ((g[i - 1][0] * M2 % Mod) * M3 + g[i - 1][1] + (g[i - 1][3] * M2 << 1)) % Mod;
    g[i][3] = ((g[i - 1][0] * M3 % Mod) * M3 + g[i - 1][2] + g[i - 1][3] * M2 + g[i - 1][4] * (M3 + M2)) % Mod;
    g[i][4] = ((g[i - 1][0] * M3 % Mod) * M3 + g[i - 1][1] + g[i - 1][4] * M2 + g[i - 1][3] * (M3 + M2)) % Mod;
  }
  for (unsigned i(1); i <= n; ++i) if(a[i][0] | a[i][1]) {Pos[++Cnt] = i; if(a[i][1]) Flp[Cnt] = 1;}
  for (unsigned i(1); i <= Cnt; ++i) a[i][0] = a[Pos[i]][0], a[i][1] = a[Pos[i]][1];
  if(!Cnt) {
    printf("%llu\n", (Onesided(n - 1) * m % Mod) * M1 % Mod);
    return 0;
  }
  unsigned CT(ColorTwo(1)), Val(Onesided(Pos[1] - 1));
  if(CT) Sum = f[CT] = Val;
  else {for (unsigned i(1); i <= m; ++i) f[i] = Val; f[ColorOne(1)] = 0, Sum = Val * M1 % Mod;}
  for (unsigned i(2); i <= Cnt; ++i) {
    if(0) {
      CT = ColorTwo(Cnt), Ans = 0;
      for (unsigned i(1); i <= m; ++i) if(CT ^ i) Mn(Ans += f[i]);
      printf("%llu\n", Ans);
    }
    unsigned A(a[i - 1][0]), B(a[i - 1][1]), C(a[i][0]), D(a[i][1]), *Len(g[Pos[i] - Pos[i - 1] - 1]);
    if(Flp[i]) swap(A, B), swap(C, D), Flp[i - 1] = (Flp[i - 1] ^ 1);
    if(Flp[i - 1]) {
      if(B == C) {
        unsigned long long PTmp(Sum * Len[4] % Mod);
        Mul(Mod + Len[2] - Len[4]), Add(PTmp), Set(ColorOne(i), 0);
      } else {
        unsigned long long FC(Find(C)), PTmp(((Mod + Sum - FC) * Len[0] + FC * Len[3]) % Mod);
        unsigned long long AB((FC * Len[1] + (Mod + Sum - FC) * Len[3]) % Mod);
        Mul(Mod + Len[4] - Len[0]), Add(PTmp), Set(C, 0), Set(B, AB);
      }
    } else {
      if(A == C) {
        unsigned long long PTmp(Sum * Len[3] % Mod);
        Mul(Mod + Len[1] - Len[3]), Add(PTmp), Set(ColorOne(i), 0);
      } else {
        unsigned long long FC(Find(C)), PTmp(((Mod + Sum - FC) * Len[0] + FC * Len[4]) % Mod);
        unsigned long long AB((FC * Len[2] + (Mod + Sum - FC) * Len[4]) % Mod);
        Mul(Mod + Len[3] - Len[0]), Add(PTmp), Set(C, 0), Set(A, AB);
      }
    }
    if(D) {
      unsigned TmpF(Find(D));
      Def(0), Set(D, TmpF);
    }
  }
  CT = ColorTwo(Cnt), Ans = 0;
  for (unsigned i(1); i <= m; ++i) if(CT ^ i) Mn(Ans += f[i]);
  printf("%llu\n", Ans * Onesided(n - Pos[Cnt]) % Mod);
  return Wild_Donkey;
}
```

发现瓶颈是对于每个阶段的 $f$ 数组进行全局修改查询和单点修改和查询, 由于模数较大, 所以无法线性, 但是可以通过线段树做到 $O(n\log c + c)$. 把[快速查询](https://www.luogu.com.cn/problem/P5358)的部分分代码复制过来, 删除全局赋值即可拿到 $100'$ 的好成绩.

```cpp
const unsigned long long Mod(1000000009);
inline void Mn(unsigned long long& x) {x -= ((x >= Mod) ? Mod : 0);}
inline void Mn(unsigned& x) {x -= ((x >= Mod) ? Mod : 0);}
bitset<100005> Flp;
unsigned a[100005][2], Pos[100005], g[100005][5];
unsigned long long mm, M1, M2, M3, M4;
unsigned OpV, OpP;
unsigned m, n;
unsigned Cnt(0), Ans(0);
inline unsigned ColorTwo(unsigned x) {return a[x][Flp[x] ^ 1];}
inline unsigned ColorOne(unsigned x) {return a[x][Flp[x]];}
struct Node {
  Node *LS, *RS;
  unsigned Sum, Mul, Pls;
  inline void Build(unsigned L, unsigned R);
  inline void PsDw(unsigned long long Llen, unsigned long long Rlen) {
    if(Mul ^ 1) {
      LS->Mul = (unsigned long long)Mul * LS->Mul % Mod;
      LS->Pls = (unsigned long long)Mul * LS->Pls % Mod;
      LS->Sum = (unsigned long long)Mul * LS->Sum % Mod;
      RS->Mul = (unsigned long long)Mul * RS->Mul % Mod;
      RS->Pls = (unsigned long long)Mul * RS->Pls % Mod;
      RS->Sum = (unsigned long long)Mul * RS->Sum % Mod;
      Mul = 1;
    }
    if(Pls) {
      Mn(LS->Pls += Pls), Mn(RS->Pls += Pls);
      LS->Sum = (LS->Sum + Pls * Llen) % Mod;
      RS->Sum = (RS->Sum + Pls * Rlen) % Mod;
      Pls = 0;
    }
  }
  inline void Define(unsigned L, unsigned R) {
    if(L == R) {Mul = 1, Pls = 0, Sum = OpV; return;}
    unsigned Mid((L + R) >> 1);
    this->PsDw(Mid - L + 1, R - Mid);
    if(OpP <= Mid) LS->Define(L, Mid);
    else RS->Define(Mid + 1, R);
    Sum = LS->Sum + RS->Sum, Mn(Sum);
  }
  inline void Qry(unsigned L, unsigned R) {
    if(L == R) {OpV = Sum; return;}
    unsigned Mid((L + R) >> 1);
    this->PsDw(Mid - L + 1, R - Mid);
    if(OpP <= Mid) LS->Qry(L, Mid);
    else RS->Qry(Mid + 1, R);
  }
}N[200005], *CntN(N);
inline void Node::Build(unsigned L, unsigned R) {
  Mul = 1, Pls = 0, Sum = 0;
  if(L == R) return;
  unsigned Mid((L + R) >> 1);
  (LS = ++CntN)->Build(L, Mid);
  (RS = ++CntN)->Build(Mid + 1, R);
}
inline unsigned long long Onesided(unsigned x) {
  if(!x) return 1; --x;
  return ((g[x][0] * M2 % Mod) * M3 + g[x][1] + g[x][2] + ((g[x][3] + g[x][4]) * M2 << 1)) % Mod;
}
inline void Multiple(unsigned long long x) {
  N->Mul = N->Mul * x % Mod;
  N->Pls = N->Pls * x % Mod;
  N->Sum = N->Sum * x % Mod;
}
inline void Add(unsigned long long x) {
  Mn(N->Pls += x);
  N->Sum = (N->Sum + m * x) % Mod;
}
inline void Set(unsigned x, unsigned y) {
  if(!x) return;
  OpP = x, OpV = y, N->Define(1, m);
}
inline unsigned long long Find(unsigned x) {
  if(!x) return 0;
  OpP = x, N->Qry(1, m);
  return OpV;
}
signed main() {
  n = RD(), mm = (m = RD()) - 1, mm = mm * m % Mod;
  M1 = m - 1, M2 = m - 2, M3 = m - 3, M4 = m - 4, N->Build(1, m);
  for (unsigned i(1); i <= n; ++i) a[i][0] = RD();
  for (unsigned i(1); i <= n; ++i) a[i][1] = RD();
  g[0][0] = g[0][2] = g[0][4] = 1, g[0][1] = g[0][3] = 0;
  for (unsigned i(1); i <= n; ++i) {
    g[i][0] = (g[i - 1][0] * ((M3 * M4 + 1) % Mod) + g[i - 1][1] + g[i - 1][2] + ((g[i - 1][3] + g[i - 1][4]) * M3 << 1) % Mod) % Mod;
    g[i][1] = ((g[i - 1][0] * M2 % Mod) * M3 + g[i - 1][2] + (g[i - 1][4] * M2 << 1)) % Mod;
    g[i][2] = ((g[i - 1][0] * M2 % Mod) * M3 + g[i - 1][1] + (g[i - 1][3] * M2 << 1)) % Mod;
    g[i][3] = ((g[i - 1][0] * M3 % Mod) * M3 + g[i - 1][2] + g[i - 1][3] * M2 + g[i - 1][4] * (M3 + M2)) % Mod;
    g[i][4] = ((g[i - 1][0] * M3 % Mod) * M3 + g[i - 1][1] + g[i - 1][4] * M2 + g[i - 1][3] * (M3 + M2)) % Mod;
  }
  for (unsigned i(1); i <= n; ++i) if(a[i][0] | a[i][1]) {Pos[++Cnt] = i; if(a[i][1]) Flp[Cnt] = 1;}
  for (unsigned i(1); i <= Cnt; ++i) a[i][0] = a[Pos[i]][0], a[i][1] = a[Pos[i]][1];
  if(!Cnt) {
    printf("%llu\n", (Onesided(n - 1) * m % Mod) * M1 % Mod);
    return 0;
  }
  unsigned CT(ColorTwo(1)), Val(Onesided(Pos[1] - 1));
  if(CT) Set(CT, Val);
  else Add(Val), Set(ColorOne(1), 0);
  for (unsigned i(2); i <= Cnt; ++i) {
    unsigned A(a[i - 1][0]), B(a[i - 1][1]), C(a[i][0]), D(a[i][1]), *Len(g[Pos[i] - Pos[i - 1] - 1]);
    if(Flp[i]) swap(A, B), swap(C, D), Flp[i - 1] = (Flp[i - 1] ^ 1);
    if(Flp[i - 1]) {
      if(B == C) {
        unsigned long long PTmp((unsigned long long)N->Sum * Len[4] % Mod);
        Multiple(Mod + Len[2] - Len[4]), Add(PTmp), Set(ColorOne(i), 0);
      } else {
        unsigned long long FC(Find(C)), PTmp(((Mod + N->Sum - FC) * Len[0] + FC * Len[3]) % Mod);
        unsigned long long AB((FC * Len[1] + (Mod + N->Sum - FC) * Len[3]) % Mod);
        Multiple(Mod + Len[4] - Len[0]), Add(PTmp), Set(C, 0), Set(B, AB);
      }
    } else {
      if(A == C) {
        unsigned long long PTmp((unsigned long long)N->Sum * Len[3] % Mod);
        Multiple(Mod + Len[1] - Len[3]), Add(PTmp), Set(ColorOne(i), 0);
      } else {
        unsigned long long FC(Find(C)), PTmp(((Mod + N->Sum - FC) * Len[0] + FC * Len[4]) % Mod);
        unsigned long long AB((FC * Len[2] + (Mod + N->Sum - FC) * Len[4]) % Mod);
        Multiple(Mod + Len[3] - Len[0]), Add(PTmp), Set(C, 0), Set(A, AB);
      }
    }
    if(D) {
      unsigned TmpF(Find(D));
      Multiple(0), Set(D, TmpF);
    }
  }
  CT = ColorOne(Cnt), Ans = N->Sum + Mod - Find(CT);
  printf("%llu\n", Ans * Onesided(n - Pos[Cnt]) % Mod);
  return Wild_Donkey;
}
```

## Day $13$ Apr 16, 2022, Saturday

### [SDOI2019 热闹的聚会和尴尬的聚会](https://www.luogu.com.cn/problem/P5361)

因为一个方案中, 第一天和第二天是互相独立的, 因此我们要分别使得 $p$ 和 $q$ 最大. 如果 $p$ 和 $q$ 分别最大的时候也不能满足条件, 则无解.

对于 $p$, 我们用单调队列从小到大维护每个点的度数, 每次取度最小的点删掉, 这个点的度数作为此时此刻还没删掉的点的集合的 $p$, 维护一个 $p$ 的最大值, 和达到这个最大值时删掉的点集, 输出时可以将没删掉的点输出.

$q$ 的最大值显然是求最大独立集, 这个问题是经典 NPC, 显然不能去求 $q$ 的最大值, 只能求一个近似解.

一开始想的是, 随便找出一个极大的独立集, 据说这样能过. 方法是: 随机一个排列, 依次选择, 如果一个点是已经被选的邻居, 则跳过, 否则选择.

但是发现每次选一个点, 都会使它当前度数个点不能被选择, 所以感性地, 每次选择度数最小的点. 这样可以证明是一定有解的.

证明是这样的: 如果第 $i$ 次选择的点使 $Cg_i$ 个点从可以被选择变成了不能被选择, 一共选则了 $q$ 个. 那么一定有 $\sum_{i = 1}^q (Cg_i + 1) = n$.

我们知道, 如果第 $i$ 个被选择的点使 $Cg_i$ 个点从可以被选择变成了不能被选择, 那么这个点当时的度数一定大于等于 $Cg_i$, 而每个点被扩展的时候, 一定会更新 $p$, 也就是说 $p \geq Cg_i$.

我们需要满足的条件是 $\lfloor \frac{n}{p + 1}\rfloor \leq q$, $\lfloor \frac{n}{q + 1}\rfloor \leq p$, 转化为 $\lfloor \frac{n}{p + 1}\rfloor < q + 1$, $\lfloor \frac{n}{q + 1}\rfloor < p + 1$, 最后是 $n < (q + 1)(p + 1) + n \% (p + 1)$, $n < (q + 1)(p + 1) + n \% (q + 1)$. 一个更严格的界是 $n < (q + 1)(p + 1)$, 拆括号可得 $n < pq + p + q + 1$.

因为 $p \geq Cg_i$, 所以 $pq + q \geq \sum_{i = 1}^q (Cg_i + 1) = n$, 因此 $pq + q + p \geq n$, $pq + q + p + 1 > n$.

证毕.

因为求独立集的过程也是每次找一个度数最小的点, 因此可以从求 $p$ 的过程中同时处理.

```cpp
struct Node {
  vector<Node*> E;
  Node**Pos; 
  unsigned Deg, Ava;
}N[10005], *Stack[10005], **Head[10005];
vector <Node*> Buck[10005];
unsigned Arr[10005], Cnt(0);
unsigned m, n;
unsigned A, B, C, D, t;
unsigned Ans(0), Tmp(0);
inline void Clr() {
  for (unsigned i(1); i <= n; ++i) N[i].E.clear(), N[i].Ava = 0;
  for (unsigned i(1); i <= n; ++i) Buck[i].clear();
  n = RD(), m = RD(), Head[0] = Stack;
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T){
    Clr();
    for (unsigned i(1); i <= m; ++i) 
      A = RD(), B = RD(), N[A].E.push_back(N + B), N[B].E.push_back(N + A);
    for (unsigned i(1); i <= n; ++i) Buck[N[i].Deg = N[i].E.size()].push_back(N + i);
    for (unsigned i(1); i <= n; ++i) {
      Head[i] = Head[i - 1]; 
      for (auto j:Buck[i]) *(++Head[i]) = j, j->Pos = Head[i];
    }
    Ans = 0, A = 1, Cnt = 0;
    for (unsigned i(1); i <= n; ++i) {
      Node* Cur(Stack[i]);
      if(Ans < Cur->Deg) A = i, Ans = Cur->Deg;
      if(!(Cur->Ava)) Arr[++Cnt] = Cur - N;
      for (auto j:Cur->E) if(j->Deg) {
        j->Ava |= (Cur->Ava ^ 1);
        swap(*(++Head[--(Cur->Deg)]), *(Cur->Pos));
        swap(Cur->Pos, (*(Cur->Pos))->Pos);
        swap(*(++Head[--(j->Deg)]), *(j->Pos));
        swap(j->Pos, (*(j->Pos))->Pos);
      }
    }
    printf("%u", n - A + 1);
    for (unsigned i(A); i <= n; ++i) printf(" %u", Stack[i] - N); putchar(0x0A);
    printf("%u", Cnt);
    for (unsigned i(1); i <= Cnt; ++i) printf(" %u", Arr[i]); putchar(0x0A);
  }
  return Wild_Donkey;
}
```

## Day $14$ Apr 17, 2022, Sunday

今天模拟省选联考 2022, 起晚了, 少考了半个多小时. 先看了题, T1 不愧是个模拟, 不过没有那么恐怖的样子, T2 还算正常, T3 一眼看出超出能力范围.

所以先做 T2. 如果枚举一个值域区间, 使得所有非零的点值都在区间内, 我们可以进行树形 DP 就可以 $O(n)$ 求出我们想要的东西. 一开始把题读错了, 读成了只要能走就不能停, 这个比原问题还要强, 方案数和总和各需要多记一个状态, 用了一段时间竟然干出来了. 发现读错题了, 删掉两个状态搞出来了.

一开始是离散化容斥, 结果被第二个样例卡掉. 改成值域枚举发现还是错, 因为我是按值域长度和 $K$ 的关系容斥的, 仔细思考发现不用枚举每一个长度的区间, 只要对长度为 $K + 1$ 和 $K$ 的区间进行容斥, 求 $O(V)$ 个区间的答案即可求出. 这就是 $O(nV)$ 的做法.

### [PrSl2022 预处理器](https://www.luogu.com.cn/problem/P8289)

T2 过大样例之和开始做 T1.

听了这道题的臭名声, 本来以为是个折磨大模拟, 没想到一会就写完了, 小调过大样例. 果然人越菜越会叫唤.

拒绝 `string`, 哈希天下第一, 远离超时.

```cpp
inline char Judge(char x) {
  if(x >= 'a' && x <= 'z') return 1;
  if(x >= 'A' && x <= 'Z') return 1;
  if(x >= '0' && x <= '9') return 1;
  return x == '_'; 
}
struct Modle {
  unsigned Leng;
  char Cond, Conte[105];
}List[105];
unordered_map<unsigned long long, unsigned> M;
unsigned n, Cnt(0);
char Cur[105];
inline void Open(char* f, unsigned Len) {
  unsigned long long Hash(0);
  unsigned j(0);
  for(unsigned i(0); i < Len; ++i) {
    if(Judge(f[i])) Hash *= Base, Hash += f[i];
    else {
      unsigned Me(M[Hash]);
      if((!Me) || (List[Me].Cond)) while (j <= i) putchar(f[j++]);
      else {
        List[Me].Cond = 1, Open(List[Me].Conte, List[Me].Leng);
        List[Me].Cond = 0, j = i + 1, putchar(f[i]);
      }
      Hash = 0;
    }
  }
  unsigned Me(M[Hash]);
  if((!Me) || (List[Me].Cond)) while (j < Len) putchar(f[j++]);
  else {
    List[Me].Cond = 1, Open(List[Me].Conte, List[Me].Leng);
    List[Me].Cond = 0;
  }
}
int main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    memset(Cur, 0, sizeof(Cur));
    cin.getline(Cur, 102);
    unsigned Len(strlen(Cur));
    if(Cur[0] == '#') {
      unsigned long long Hash(0);
      unsigned Pos;
      if(Cur[1] == 'd') {
        Pos = 8;
        while (Cur[Pos] != ' ') Hash *= Base, Hash += Cur[Pos++];
        M[Hash] = ++Cnt, ++Pos;
        while (Pos < Len) List[Cnt].Conte[(List[Cnt].Leng)++] = Cur[Pos++];
      } else {
        Pos = 7;
        while (Pos < Len) Hash *= Base, Hash += Cur[Pos++];
        List[M[Hash]].Cond = 1;
      }
    } else Open(Cur, Len);
    putchar(0x0A);
  }
}
```

## Day $15$ Apr 18, 2022, Monday

模拟省选 2022 Day 2, 今天上来就发现之前快读写错了:

```cpp
inline unsigned RD() {
  unsigned RTmp(0);
  char ch(getchar()); 
  while (ch < '0' && ch > '9') ch = getchar();
  while (ch >= '0' && ch <= '9') RTmp = RTmp * 10 + ch - '0', ch = getchar(); 
  return RTmp;
}
```

这个地方

```cpp
while (ch < '0' && ch > '9') ch = getchar();
```

Day 1 得分玄学了.

今天感冒了, 半个小时读完题, 感觉可以先搞一搞 T2, 于是睡了两个小时.

起来以后发现 T2 的所有权值相等和 $x = 0$ 可以做. 对于 $x = y = 1$ 的情况, 我本来写了一个自认为是正确的算法, 但是和大样例差了一点点.

T1 我写了个爆搜容斥, 可能有个 $10$ 分 $20$ 分的吧.

T3 没看.

