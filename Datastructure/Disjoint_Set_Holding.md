# 可持久化并查集

可持久化, 随机访问一个数据结构在经历 $k$ 次操作后的结果.

并查集, 维护元素对集合从属关系的数据结构.

可持久化并查集, 支持如下操作的数据结构:

- 合并两个元素所在集合

- 全局回到某时刻的状态

- 查询两个元素是否在同一集合

首先, 我们先考虑并查集需要维护什么.

$Fa_i$, 表示一个元素的父亲节点, 也就是 $i$ 属于 $Fa_i$ 所属的集合.

每次查询或合并时, 有一定几率对 $Fa$ 数组进行单点修改和单点查询.

所以我们只要将这个数组持久化即可, 而[可持久化数组](https://www.luogu.com.cn/blog/Wild-Donkey/p3919-mu-ban-ke-chi-jiu-hua-xian-duan-shu-1-ke-chi-jiu-hua-shuo-zu-post)是我们已经掌握了的.

这个题应该是我做过最水的板子紫题了吧.

## 实现

```cpp
unsigned a[10005], m, n, Cnt(0), A, B, Pos, ActVal, t, Ans(0), Tmp(0);
char b[10005];
struct Node {
  Node *LS, *RS;
  unsigned Val;
}N[4000005], *Ver[200005], *CntN(N);
Node *Build(unsigned L, unsigned R) {
  register Node *x(++CntN);
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    x->LS = Build(L, Mid);
    x->RS = Build(Mid + 1, R);
  } else {
    x->Val = ++Cnt;
  }
  return x;
}
void Chg(Node *x, Node *y, unsigned L, unsigned R) {
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    if(Pos <= Mid) {
      if(y->LS == x->LS) y->LS = ++CntN, y->LS->LS = x->LS->LS, y->LS->RS = x->LS->RS;
      Chg(x->LS, y->LS, L, Mid);
    } else {
      if(y->RS == x->RS) y->RS = ++CntN, y->RS->LS = x->RS->LS, y->RS->RS = x->RS->RS;
      Chg(x->RS, y->RS, Mid + 1, R);
    }
  } else {
    y->Val = ActVal; 
  }
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    if(Pos <= Mid) {
      Qry(x->LS, L, Mid);
    } else {
      Qry(x->RS, Mid + 1, R);
    }
  } else {
    ActVal = x->Val;
  }
}
unsigned Find(unsigned x, unsigned Version) {
  register unsigned y(x);
  Pos = y, Qry(Ver[Version], 1, n);
  while (y ^ ActVal) {
    y = ActVal, Pos = y, Qry(Ver[Version], 1, n);
  }
  Pos = x, Chg(Ver[Version - 1], Ver[Version], 1, n);
  return ActVal;
}
int main() {
  n = RD(), m = RD();
  Ver[0] = Build(1, n);
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    switch (A) {
      case 1: {
        Ver[i] = ++CntN, Ver[i]->LS = Ver[i - 1]->LS, Ver[i]->RS = Ver[i - 1]->RS;
        A = Find(RD(), i), ActVal = Find(RD(), i), Pos = A;
        Chg(Ver[i - 1], Ver[i], 1, n);
        break;
      } 
      case 2:{
        Ver[i] = Ver[RD()];
        break;
      }
      case 3:{
        Ver[i] = ++CntN, Ver[i]->LS = Ver[i - 1]->LS, Ver[i]->RS = Ver[i - 1]->RS;
        A = Find(RD(), i);
        B = Find(RD(), i);
        printf("%u\n", (A == B));
        break;
      }
    } 
  }
  return Wild_Donkey;
}
```

下载完全体数据之后, 发现本地时间花了 $76s$, 非常的感人这还是加了路径压缩的 (至于很多题解表示不能使用路径压缩我看到之后表示很震惊, 我写的难道压缩的是空气吗), 所以考虑路径压缩 + 按秩合并, 将一个集合的历史最深值作为秩 (因为历史最深比当前深度好维护, 本以为这样复杂度不对, 但是没想到过了), 话说这是我第一次写按秩合并, 不知是否绕了弯路.

```cpp
unsigned a[10005], m, n, Cnt(0), A, B, C, Pos, ActVal, ActDeep, t, Ans(0), Tmp(0);
char b[10005];
struct Node {
  Node *LS, *RS;
  unsigned Val, Dep;
}N[4000005], *Ver[200005], *CntN(N), *Found;
Node *Build(unsigned L, unsigned R) {
  register Node *x(++CntN);
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    x->LS = Build(L, Mid);
    x->RS = Build(Mid + 1, R);
  } else {
    x->Val = ++Cnt;
    x->Dep = 1;
  }
  return x;
}
void Chg(Node *x, Node *y, unsigned L, unsigned R) {
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    if(Pos <= Mid) {
      if(y->LS == x->LS) y->LS = ++CntN, y->LS->LS = x->LS->LS, y->LS->RS = x->LS->RS;
      Chg(x->LS, y->LS, L, Mid);
    } else {
      if(y->RS == x->RS) y->RS = ++CntN, y->RS->LS = x->RS->LS, y->RS->RS = x->RS->RS;
      Chg(x->RS, y->RS, Mid + 1, R);
    }
  } else {
    y->Val = ActVal;
    y->Dep = max(y->Dep, 1 + ActDeep);
  }
}
void Qry(Node *x, unsigned L, unsigned R) {
  if(L ^ R) {
    register unsigned Mid((L + R) >> 1);
    if(Pos <= Mid) Qry(x->LS, L, Mid);
    else Qry(x->RS, Mid + 1, R);
  } else Found = x;
}
unsigned Find(unsigned x, unsigned Version) {
  register unsigned y(x);
  Pos = y, Qry(Ver[Version], 1, n);
  while (y ^ Found->Val)
    y = Found->Val, Pos = y, Qry(Ver[Version], 1, n);
  Pos = x, ActVal = y, ActDeep = Found->Dep, Chg(Ver[Version - 1], Ver[Version], 1, n);
  return y;
}
int main() {
  n = RD(), m = RD();
  Ver[0] = Build(1, n);
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    switch (A) {
      case 1: {
        Ver[i] = ++CntN, Ver[i]->LS = Ver[i - 1]->LS, Ver[i]->RS = Ver[i - 1]->RS;
        Find(RD(), i), A = Found->Val, B = Found->Dep;
        Find(RD(), i);
        if(B < Found->Dep) Pos = A, ActVal = Found->Val, ActDeep = B;
        else ActVal = A, Pos = Found->Val, ActDeep = Found->Dep;
        Chg(Ver[i - 1], Ver[i], 1, n);
        break;
      } 
      case 2:{
        Ver[i] = Ver[RD()];
        break;
      }
      case 3:{
        Ver[i] = ++CntN, Ver[i]->LS = Ver[i - 1]->LS, Ver[i]->RS = Ver[i - 1]->RS;
        A = Find(RD(), i), B = Find(RD(), i);
        printf("%u\n", (A == B));
        break;
      }
    } 
  }
  return Wild_Donkey;
}
```