# 树套树

这是一种思想, 不是什么特定的数据结构, 不过实现起来一般都是从外层的树形数据结构的每个节点上, 挂一个内层树形数据结构的根的指针, 这样, 本来是要查询或修改外层节点的信息的行为, 变成了在外层某节点对应的内层数据结构上查询或修改某种信息.

容易发现, 这种思想非常占空间, 所以一般这种数据结构尤其是内层, 必须动态开点或直接实现可持久化.

## [模板](https://www.luogu.com.cn/problem/P3380)

直接来看一道题来感受这种思想:

维护一个序列, 支持:

- 区间查询第 $k$ 小的数

- 区间查排名

- 单点修改

- 区间查前驱

- 区间查后继

官方做法是用线段树做外层数据结构, 每个节点挂一棵平衡树, 存储这个线段树节点表示的区间的数, 因为平衡树本来就是动态开点的, 所以空间是可以接受的, 加起来是 $O(nlogn)$.

区间查排名, 只需要 $O(logn)$ 找出这个区间对应的 $O(logn)$ 棵平衡树, 然后对每个平衡树 $O(logn)$ 查询排名, 总共 $O(log^2n)$.

单点修改也很简单, $O(logn)$ 找出包含这个单点的 $O(logn)$ 棵平衡树, 每棵平衡树 $O(logn)$ 删除, $O(logn)$ 插入即可.

区间查前驱后继也很简单, 对 $O(logn)$ 棵平衡树分别进行 $1$ 次复杂度为 $O(logn)$ 次查询前驱/后继, 取最大/最小的那个, 总时间 $O(log^2n)$.

对于区间查询第 $k$ 小的数, 因为是在 $logn$ 棵树上查询, 所以不能像普通平衡树一样, 二分查找这个位置, $O(logn)$ 查询. 只能二分答案, $O(logn)$ 的二分答案, $O(logn)$ 的线段树上查询, $O(logn)$ 的平衡树上查询, 总复杂度 $O(log^3n)$.

所以对于 $m$ 次操作的总复杂度应该是 $O(mlog^3n)$.

## 代码

首先是平衡树部分, 这里采用了[宗法树](https://www.luogu.com.cn/blog/Wild-Donkey/lun-li-zui-yan-jin-di-ping-heng-shu-zong-fa-shu).

```cpp
struct SubNode {
  SubNode *LS, *RS;
  int Val, Ival;
  unsigned Size;
} SN[2000005], *CntSN(SN);
```

### 旋转

```cpp
void Rotate(SubNode *x) {
  x->Size = x->LS->Size + x->RS->Size;
  x->Ival = x->LS->Ival, x->Val = x->RS->Val;
  if(x->LS->Size * 3 < x->RS->Size) {
    register SubNode *Move(x->RS);
    x->RS = Move->RS;
    Move->RS = Move->LS;
    Move->LS = x->LS;
    x->LS = Move;
    Move->Ival = Move->LS->Ival, Move->Val = Move->RS->Val, Move->Size = Move->LS->Size + Move->RS->Size;
    return;
  }
  if(x->RS->Size * 3 < x->LS->Size) {
    register SubNode *Move(x->LS);
    x->LS = Move->LS;
    Move->LS = Move->RS;
    Move->RS = x->RS;
    x->RS = Move;
    Move->Ival = Move->LS->Ival, Move->Val = Move->RS->Val, Move->Size = Move->LS->Size + Move->RS->Size; 
  }
}
```

### 插入

```cpp
SubNode *Insert(SubNode *x) {
  if(x->Size == 1) {
    SubNode *Fa(++CntSN);
    if(x->Val < OpVal) {
      Fa->LS = x;
      Fa->RS = ++CntSN;
    } else {
      Fa->RS = x;
      Fa->LS = ++CntSN;
    }
    CntSN->Val = CntSN->Ival = OpVal, CntSN->Size = 1;
    Fa->Size = 2;
    Fa->Ival = Fa->LS->Ival, Fa->Val = Fa->RS->Val;
    return Fa;
  }
  if(x->LS->Val < OpVal) x->RS = Insert(x->RS);
  else x->LS = Insert(x->LS);
  Rotate(x);
  return x;
}
```

### 删除

```cpp
SubNode *Delete(SubNode *x) {
  if(x->LS->Val < OpTmp) {
    if(x->RS->Size == 1) {
      if(x->RS->Val == OpTmp) {
        return x->LS;
      } else {
        return x;
      }
    }
    x->RS = Delete(x->RS);
  } else {
    if(x->LS->Size == 1) {
      if(x->LS->Val == OpTmp) {
        return x->RS;
      } else {
        return x;
      }
    }
    x->LS = Delete(x->LS);
  }
  Rotate(x);
  return x; 
}
```

### 查排名

```cpp
void SubRank(SubNode *x) {
  if (x->Size == 1) {
    if (x->Val < OpVal) ++Ans;
    return;
  }
  if (x->LS->Val < OpVal)
    Ans += x->LS->Size, SubRank(x->RS);
  else
    SubRank(x->LS);
}
```

### 查前驱

```cpp
void SubPre(SubNode *x) {
  if (x->Size == 1) {
    if (x->Val < OpVal) Ans = max(Ans, x->Val);
    return;
  }
  if (x->RS->Ival >= OpVal) {
    SubPre(x->LS);
  } else {
    SubPre(x->RS);
  }
}
```

### 查后继

```cpp
void SubSuc(SubNode *x) {
  if (x->Size == 1) {
    if (x->Val > OpVal) Ans = min(Ans, x->Val);
    return;
  }
  if (x->LS->Val < OpVal) {
    SubSuc(x->RS);
  } else {
    SubSuc(x->LS);
  }
}
```

然后是线段树部分, 最普通的线段树即可.

```cpp
struct Node {
  Node *LS, *RS;
  SubNode *Root;
} N[100005], *CntN(N);
```

### 建树 

```cpp
void Build(Node *x, unsigned L, unsigned R) {
  x->Root = ++CntSN;
  x->Root->Val = x->Root->Ival = a[L];
  x->Root->Size = 1;
  if (L == R) return;
  for (register unsigned i(L + 1); i <= R; ++i) {
    OpVal = a[i], x->Root = Insert(x->Root);
  }
  register unsigned Mid((L + R) >> 1);
  Build(x->LS = ++CntN, L, Mid);
  Build(x->RS = ++CntN, Mid + 1, R);
}
```

### 单点修改

就是先插入一个新值, 然后将原值删除.

```cpp
void Change(Node *x, unsigned L, unsigned R) {
  x->Root = Insert(x->Root);
  x->Root = Delete(x->Root);
  if (L == R) {
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if (Mid < OpL) {
    Change(x->RS, Mid + 1, R);
  } else {
    Change(x->LS, L, Mid);
  }
  return;
}
```

### 查排名

```cpp
void Rank(Node *x, unsigned L, unsigned R) {
  if (L >= OpL && R <= OpR) {
    SubRank(x->Root);
    return;
  }
  register unsigned Mid((L + R) >> 1);
  if (OpL <= Mid) {
    Rank(x->LS, L, Mid);
  }
  if (Mid < OpR) {
    Rank(x->RS, Mid + 1, R);
  }
  return;
}
```

### 查前驱

```cpp
void Pre(Node *x, unsigned L, unsigned R) {
  if (L >= OpL && R <= OpR) {
    return SubPre(x->Root);
  }
  register unsigned Mid((L + R) >> 1);
  if (OpL <= Mid) {
    Pre(x->LS, L, Mid);
  }
  if (Mid < OpR) {
    Pre(x->RS, Mid + 1, R);
  }
}
```

### 查后继

```cpp
void Suc(Node *x, unsigned L, unsigned R) {
  if (L >= OpL && R <= OpR) {
    return SubSuc(x->Root);
  }
  register unsigned Mid((L + R) >> 1);
  if (OpL <= Mid) {
    Suc(x->LS, L, Mid);
  }
  if (Mid < OpR) {
    Suc(x->RS, Mid + 1, R);
  }
}
```

### 二分答案

```cpp
void Find() {
  register int L(0), R(100000000), Mid;
  while (L < R) {
    Mid = ((L + R + 1) >> 1);
    Ans = 1, OpVal = Mid, Rank(N, 1, n);
    if (Ans > OpTmp)
      R = Mid - 1;
    else
      L = Mid;
  }
  Ans = L;
}
```

### 主函数

```cpp
unsigned a[50005], m, n, Cnt(0), OpL, OpR, A, B, C, D, t, Tmp(0);
int Ans, OpVal, OpTmp;
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  Build(N, 1, n);
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    switch (A) {
      case 1: {
        OpL = RD(), OpR = RD(), OpVal = RD();
        Ans = 1, Rank(N, 1, n);
        break;
      }
      case 2: {
        OpL = RD(), OpR = RD(), OpTmp = RD();
        Find();
        break;
      }
      case 3: {
        OpL = RD();
        OpTmp = a[OpL];
        a[OpL] = OpVal = RD();
        Change(N, 1, n);
        break;
      }
      case 4: {
        OpL = RD(), OpR = RD(), OpVal = RD();
        Ans = -2147483647, Pre(N, 1, n);
        break;
      }
      case 5: {
        OpL = RD(), OpR = RD(), OpVal = RD();
        Ans = 2147483647, Suc(N, 1, n);
        break;
      }
    }
    if (A != 3) {
      printf("%d\n", Ans);
    }
  }
  return Wild_Donkey;
}
```