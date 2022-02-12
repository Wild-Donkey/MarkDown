# 东周平衡树 (FHQ Weight Baclanced Leafy Tree, FHQ_WBLT)

英文名中有 FHQ, 但是算法不出自 FHQ, 只是实现了 FHQ Treap 的所有操作. 它是 LXL 发明的 WBLT 的拓展. 在我之前有人也这样做过, 我并不是首创, 但我还是想写一篇博客介绍一下这个写法.

相比写 FHQ 或写单点操作的 WBLT 的人来说, 将 WBLT 分裂合并的人太少了, 这么优秀的数据结构不应该被埋没. 所以在这里我们拨动历史的车轮, 将来自西周的宗法树发展为下面要介绍的东周平衡树.

> 这是一种可以分裂合并的平衡树, 这意味着它可以完成 FHQ 能做到的一切. 它的深度复杂度由 WBLT 的旋转操作保证, 这意味着它可以做到 WBLT 的效率, 且不依赖于随机化. ----Wild Donkey

## 前置知识

### 必备

WBLT: [伦理最严谨的平衡树: 宗法树](https://www.luogu.com.cn/blog/Wild-Donkey/lun-li-zui-yan-jin-di-ping-heng-shu-zong-fa-shu)

FHQ: 大部分有兴趣点进来的人应该都会了吧 (我没有写 FHQ 的博客)

### 可选

可持久化 WBLT: [可持久化平衡树 = 可持久化线段树 + 平衡线段树](https://www.luogu.com.cn/blog/Wild-Donkey/SteadyWBLT)

## 基础做法

旋转操作和 WBLT 是一样的, 其余操作可以分裂之后直接做. 核心就是分裂合并.

### 分裂 (Split)

我们需要实现将一棵树的左儿子的子树的叶子权值 $\leq x$, 右儿子的子树的叶子权值 $> x$, 或是使左儿子的子树有 $k$ 个叶子, 右儿子的子树包含剩下的叶子.

和 FHQ 一样, 我们分三种情况来讨论:

- 两个子树已经满足条件   
目的达成, 直接结束分裂过程.
- 左子树中有叶子要分给右子树
这时递归左子树, 使所有要分给右子树的叶子处于左子树的右儿子的子树中. 最后进行一个简单的旋转操作.
- 右子树中有叶子要分给左子树
这时递归右子树, 使所有要分给左子树的叶子处于右子树的左儿子的子树中. 最后进行一个简单的旋转操作.

对于这个简单的旋转操作, 假设我们遇到了第二种情况, 这时已经递归完了左子树, 如图所示.

![image.png](https://s2.loli.net/2022/02/12/e6rL2E9uXGZxI1s.png)

我们把左子树的左儿子作为自己的左儿子, 把左子树右儿子变成它的左儿子, 自己的右儿子作为左子树的右儿子, 自己原来的左儿子放到自己右儿子的位置, 如图所示:

![image.png](https://s2.loli.net/2022/02/12/xaKCM9yJkRmbBzv.png)

遇到第三种情况只要把这个过程左右颠倒就可以了.

下面是代码:

```cpp
inline void Split(unsigned Left) {
  PsDw(); // 访问儿子之前先把标记下传
  if (LS->Size == Left) return;//第一种情况
  Node* Cur;
  if (LS->Size > Left) (Cur = LS)->Split(Left), LS = Cur->LS, Cur->LS = Cur->RS, Cur->RS = RS, RS = Cur; // 第二种情况
  else (Cur = RS)->Split(Left - LS->Size), RS = Cur->RS, Cur->RS = Cur->LS, Cur->LS = LS, LS = Cur; // 第三种情况
  Cur->PsUp(); // 由于子树叶子有变化, 所以需要更新 Cur
}
```

### 合并

合并很简单, 我们只要新建一个节点作为根 (或者直接把分裂的时候多出来的节点作为根), 然后左右儿子分别是需要合并的两棵子树. 为了保证平衡, 我们对它进行旋转操作即可.

```cpp
inline Node* MERGE(Node* Rt, Node* L, Node* R) {//根节点, 左部, 右部
  if (L && R) { Rt->LS = L, Rt->RS = R, Rt->PsUp(); return Rt->Rotate(); }
  if (L) return L->Rotate();
  return R->Rotate();
}
```

## 进阶

### 可持久化

我们在操作过程中记录一个节点的父亲数量, 当下传标记的时候发现儿子有多于一个父亲, 则将儿子复制一份, 把原来的儿子父亲数量减一, 副本只有自己一个父亲, 这样就可以在副本上修改了.

容易被忽视的一点是, 如果复制的点有儿子, 复制会使得复制的点的儿子的父亲数量增加 $1$.

由于把函数定义在结构体里面可以使代码更简洁, 但是不能通过节点在内存中的绝对位置寻址, 所以我们每个节点记录一个 $Num$ 作为它在内存池中的相对地址, 使新点能够利用已知绝对地址的节点的相对地址找到自己的绝对地址.

```cpp
inline Node* Copy() {
  int Del(Stack[STop] - Num); //相对位置寻址, Stack 是内存池可用地址, Del 意为 Delta, 即为两个节点地址的差
  Node* Cur(this + Del);// 通过已知地址的节点算出新节点的绝对地址
  --Use, * Cur = *this, Cur->Use = 1, Cur->Num = Stack[STop--];
  if (Cur->LS) ++(Cur->LS->Use);// 把儿子的父亲数量增加 1
  if (Cur->RS) ++(Cur->RS->Use);
  return Cur;
}
```

### 内存回收

由于已经有了相对地址寻址法, 所以内存回收就变得很容易实现. 当一个点不存在父亲的时候, 它便是废点了, 所以我们把它的相对地址堆入空闲地址栈中. 不要忘了更新儿子.

```cpp
inline void Cycle() {
  if (LS) { --(LS->Use); if (!(LS->Use)) LS->Cycle(); }
  if (RS) { --(RS->Use); if (!(RS->Use)) RS->Cycle(); }
  Stack[++STop] = Num;
}
```

## 例题

[Luogu P5586 序列 (加强版)](https://www.luogu.com.cn/problem/P5586)

一道裸的平衡树题, 目前是[最优解](https://www.luogu.com.cn/record/69125016)(Feb.12th, 2022), 这里用来演示 FHQ_WBLT.

```cpp
const unsigned Mod(1000000007);
unsigned m, n, Last;
unsigned Stack[600005], STop(0);
unsigned A, B, C, D, Opt, OV;
unsigned Cnt(0), Ans(0), Tmp(0);
inline void Mn(unsigned& x) { x -= ((x >= Mod) ? Mod : 0); }
struct Node {
  Node* LS, * RS;
  unsigned Size, Val, Tag, Def, Num, Use;
  char Flp;
  inline void PsUp() {
    Val = LS->Val + RS->Val, Mn(Val);
    Size = LS->Size + RS->Size;
  }
  inline Node* Copy() {
    int Del(Stack[STop] - Num);
    Node* Cur(this + Del);
    --Use, * Cur = *this, Cur->Use = 1, Cur->Num = Stack[STop--];
    if (Cur->LS) ++(Cur->LS->Use);
    if (Cur->RS) ++(Cur->RS->Use);
    return Cur;
  }
  inline void Cycle() {
    if (LS) { --(LS->Use); if (!(LS->Use)) LS->Cycle(); }
    if (RS) { --(RS->Use); if (!(RS->Use)) RS->Cycle(); }
    Stack[++STop] = Num;
  }
  inline void PsDw() {
    if (LS) {
      if (LS->Use > 1) LS = LS->Copy();
      if (~Def) LS->Def = Def, LS->Val = ((unsigned long long)Def * LS->Size) % Mod, LS->Tag = 0;
      LS->Tag += Tag, Mn(LS->Tag), LS->Val = (LS->Val + (unsigned long long)LS->Size * Tag) % Mod;
      if (Flp) LS->Flp ^= 1, swap(LS->LS, LS->RS);
    }
    if (RS) {
      if (RS->Use > 1) RS = RS->Copy();
      if (~Def) RS->Def = Def, RS->Val = ((unsigned long long)Def * RS->Size) % Mod, RS->Tag = 0;
      RS->Tag += Tag, Mn(RS->Tag), RS->Val = (RS->Val + (unsigned long long)RS->Size * Tag) % Mod;
      if (Flp) RS->Flp ^= 1, swap(RS->LS, RS->RS);
    }
    Tag = Flp = 0, Def = 0xffffffff;
  }
  inline Node* Rotate() {
    PsDw();
    if (Size <= 5) return this;
    Node* Cur(NULL);
    if ((LS->Size * 3) < RS->Size) (Cur = RS)->PsDw(), RS = Cur->RS, Cur->RS = Cur->LS, Cur->LS = LS, (LS = Cur)->PsUp();
    if ((RS->Size * 3) < LS->Size) (Cur = LS)->PsDw(), LS = Cur->LS, Cur->LS = Cur->RS, Cur->RS = RS, (RS = Cur)->PsUp();
    if (Cur) Cur->Rotate();
    return this;
  }
  inline void Split(unsigned Left) {
    PsDw();
    if (LS->Size == Left) return;
    Node* Cur;
    if (LS->Size > Left) (Cur = LS)->Split(Left), LS = Cur->LS, Cur->LS = Cur->RS, Cur->RS = RS, RS = Cur;
    else (Cur = RS)->Split(Left - LS->Size), RS = Cur->RS, Cur->RS = Cur->LS, Cur->LS = LS, LS = Cur;
    Cur->PsUp();
  }
  inline void SPLIT(unsigned Left, Node*& LP, Node*& RP) {
    if (!Left) { LP = NULL, RP = this; return; }
    if (Left == Size) { LP = this, RP = NULL; return; }
    Split(Left), LP = LS, RP = RS;
  }
  inline void Prt() {
    if (Size == 1) { printf("%u ", Val); return; }
    PsDw();
    if (LS) LS->Prt();
    if (RS) RS->Prt();
  }
}N[600005], * CntN(N), * Root(N);
inline void Build(Node* x, unsigned L, unsigned R) {
  x->Def = 0xffffffff, x->Num = x - N, x->Use = 1;
  if (L == R) { x->Val = RD(), x->LS = NULL, x->RS = NULL, x->Size = 1; return; }
  unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
  x->PsUp();
}
inline Node* MERGE(Node* Rt, Node* L, Node* R) {
  if (L && R) { Rt->LS = L, Rt->RS = R, Rt->PsUp(); return Rt->Rotate(); }
  if (L) return L->Rotate();
  return R->Rotate();
}
signed main() {
  n = RD(), m = RD(), Build(N, 1, n);
  for (unsigned i(1); i <= m; ++i) {
    Opt = RD(), A = (RD() ^ Last), B = (RD() ^ Last);
    Node* Part1(NULL), * Part2(NULL), * Part3(NULL), * Rt1(NULL), * Rt2(NULL);
    (Rt1 = Root)->SPLIT(A - 1, Part1, Part2);
    (Rt2 = Part2)->SPLIT(B - A + 1, Part2, Part3);
    switch (Opt) {
    case(1): {
      printf("%u\n", Last = Part2->Val);
      break;
    }
    case(2): {
      Part2->Def = (RD() ^ Last), Part2->Tag = 0, Part2->Val = (unsigned long long)Part2->Size * Part2->Def % Mod;
      break;
    }
    case(3): {
      Part2->Tag += (OV = (RD() ^ Last)), Mn(Part2->Tag), Part2->Val = (Part2->Val + (unsigned long long)Part2->Size * OV) % Mod;
      break;
    }
    case(6): {
      Part2->Flp = 1, swap(Part2->LS, Part2->RS);
      break;
    }
    default: {
      Node* Part4(NULL), * Part5(NULL), * Rt3(NULL), * Rt4(NULL);
      C = (RD() ^ Last), D = (RD() ^ Last);
      if (C > B)  (Rt3 = Part3)->SPLIT(C - B - 1, Part3, Part4);
      else (Rt3 = Part1)->SPLIT(C - 1, Part1, Part4);
      (Rt4 = Part4)->SPLIT(D - C + 1, Part4, Part5);
      if (Opt & 1) swap(Part4, Part2);
      else Part4->Cycle(), ++((Part4 = Part2)->Use);
      Part4 = MERGE(Rt4, Part4, Part5);
      if (C > B) Part3 = MERGE(Rt3, Part3, Part4);
      else Part1 = MERGE(Rt3, Part1, Part4);
      break;
    }
    }
    Part2 = MERGE(Rt2, Part2, Part3);
    Root = MERGE(Rt1, Part1, Part2);
  }
  Root->Prt(), putchar(0x0A);
  return Wild_Donkey;
}
```

## 后记

中文名的背景是东周诸侯国纷争, 天下分分合合, 像极了这棵平衡树. 又因为宗法树的背景是西周时期, 所以我们用东周来称呼它的拓展写法.