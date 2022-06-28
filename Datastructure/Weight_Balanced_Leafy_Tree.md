# 宗法树 (Weight Balanced Leafy Tree)

> 宗法是西周的重要政治制度. 宗法制以血缘关系为基础, 核心是嫡长子继承制, 起着维护西周政治等级制度和稳定社会秩序的作用.

>----Wikipedia

宗法树, 简称 WBLT. 这种数据结构最广泛的用途是做平衡树, 然而它除了 LCT 几乎全能. 作为平衡树, Splay 最令人诟病的是它的常数, 这是因为每次操作后, 都要把一个点 Splay 到根上.

和一般的平衡树不同的是, 它的所有信息只存在叶子里, 也就是说在包含的元素数量相同时, 它的节点数是一般平衡树的两倍. 即使这样, 他仍然能用比 Treap 小的码量, 达到和 Treap 一样优秀的常数.

虽然不是一般意义上的 BST, 但是 WBLT 仍然满足 BST 的部分性质, 即右儿子的权值大于等于自己的权值大于等于左儿子的权值 (注意, 和 BST 不同的是, WBLT 一个节点的权值大于等于自己的子树上的所有权值, 而 BST一个节点的权值小于等于它右子树的所有权值). 特别地, WBLT 的右儿子的权值就是自己的权值, 因为非叶子节点权值的定义就是儿子权值的最大值.

## 旋转

为了维护 BST 的平衡, 需要在一个节点两个子树差别非常大的时候进行旋转. 这个差别是轻重的差别, 轻重即子树中叶子节点的数量 $Size$. 当 $x$ 的左子树 $LS$ 过重时, 新建一个节点 $new$ 做 $x$ 的右儿子, 将 $x$ 的原左儿子 $LS$ 的右子树 $LSRS$ 接到 $new$ 上做左子树, 将 $x$ 原来的右子树 $RS$ 接到 $new$ 上做右子树. 这时原来的左儿子 $LS$ 只剩下了左儿子 $LSLS$, 删除原来的左儿子 $LS$, 将 $LSLS$ 直接接到 $x$ 下面做新的左子树.

对于右子树过重的情况, 同样如此, 将前面的操作对称过来即可.

由于是将一个节点删除, 然后添加一个新的节点, 所以为了防止内存浪费过多, 将这个删除的节点的内存 $Move$ 直接分配给添加的那个节点即可.

这种旋转方式, 就是将一个点的某个子树分出一半, 加入兄弟的子树中, 然后这个儿子就去世了, 剩下的一个子树继承它的位置. 这种分配方式正如西周时, 嫡长子继承父亲的地位, 其余儿子发配到远方的宗法制, 宗法树因此得名.

```cpp
inline void Rotate(Node *x) {
  x->Size = x->LS->Size + x->RS->Size;
  x->InValue = x->LS->InValue, x->Value = x->RS->Value;
  if(x->LS->Size * 3 < x->RS->Size) {
    register Node *Move(x->RS);
    x->RS = Move->RS;
    Move->RS = Move->LS;
    Move->LS = x->LS;
    x->LS = Move;
    Move->Value = Move->RS->Value, Move->InValue = Move->LS->InValue;
    Move->Size = Move->LS->Size + Move->RS->Size;
    return;
  }
  if(x->RS->Size * 3 < x->LS->Size) {
    register Node *Move(x->LS);
    x->LS = Move->LS;
    Move->LS = Move->RS;
    Move->RS = x->RS;
    x->RS = Move;
    Move->Value = Move->RS->Value, Move->InValue = Move->LS->InValue;
    Move->Size = Move->LS->Size + Move->RS->Size; 
    return;
  }
}
```

## 插入

插入时, 找到大于等于插入值的最小的叶子节点的位置, 然后新建一个节点, 使原有的叶子节点变成它的一个儿子, 插入的节点变成另一个儿子. 最后对左右子树差别过大的点进行旋转.

```cpp
Node *Insert(Node *x) {
  if(x->Size == 1) {
    register Node *Fa(++CntN);
    if(B > x->Value) Fa->LS = x, Fa->RS = ++CntN;
    else Fa->RS = x, Fa->LS = ++CntN;
    CntN->Value = CntN->InValue = B, CntN->Size = 1;
    Fa->Value = Fa->RS->Value, Fa->InValue = Fa->LS->InValue, Fa->Size = 2;
    return Fa;
  }
  if(x->LS->Value < B) x->RS = Insert(x->RS);
  else x->LS = Insert(x->LS);
  Rotate(x);
  return x;
}
```

## 删除

仍然是先寻找对应的点, 如果找到, 就删除这个点, 并且将所有只剩一个儿子的节点删除, 函数返回传入的 $x$ 的子树的新的根. 最后对差别过大的子树进行旋转.

```cpp
Node *Delete(Node *x) {
  if(x->Size == 1) return x;
  if(x->LS->Value < B) {
    if(x->RS->Size == 1) {
      if(x->RS->Value == B) return x->LS;
      else return x;
    } else x->RS = Delete(x->RS);
  } else {
    if(x->LS->Size == 1) {
      if(x->LS->Value == B) return x->RS;
      else return x;
    } else x->LS = Delete(x->LS);
  }
  Rotate(x);
  return x;
}
```

## 查 $k$ 排名

在查找大于等于 $k$ 的最小的节点, 统计这个点左边的叶子数量, 答案比这个数量大 $1$.

```cpp
void Rank (Node *x) {
  if(x->Size == 1) {if(x->Value < B) ++Ans;return;}
  if(x->LS->Value < B) Ans += x->LS->Size, Rank(x->RS);
  else Rank(x->LS);
}
```

## 查第 $k$ 大

用线段树的结构二分查找, 如果要查的点在左子树, 查询左子树, 如果在右子树, 查询右子树. (废话)

```cpp
void Find(Node *x) {
  if(x->Size == 1) {Ans = x->Value;return;}
  if(x->LS->Size < B) B -= x->LS->Size, Find(x->RS);
  else Find(x->LS);
}
```

## 前驱

前驱必然比查询到数小, 所以查询 $x - 1$. 维护一个反权值 $InValue$, 意义和 $Value$ 恰好对称, 这样就能找树上小于等于一个数的最大值了.

```cpp
void Pre/*Predecessor*/(Node *x) {
  if(x->Size == 1) {Ans = x->Value;return;}
  if(x->RS->InValue > B) Pre(x->LS);
  else Pre(x->RS);
}
```

## 后继

和查前驱对称即可.

```cpp
void Suc/*Successor*/(Node *x) {
  if(x->Size == 1) {Ans = x->Value;return;}
  if(x->LS->Value < B) Suc(x->RS);
  else Suc(x->LS);
}
```

## 主函数

宗法树的一般写法中, 旋转会产生大量的垃圾内存, 因为要删除节点, 再加上大量的新建节点, 可能空间会造成浪费. 

一般这个问题的解决方案是垃圾回收, 但是由于我对旋转进行了一点优化, 所以旋转并不会产生任何垃圾内存或新建节点, 所以新建节点仅限 `Insert()`, 一次 `Insert()` 会新建 $2$ 个节点; 删除节点仅限 `Delete()` 操作, 一次 `Delete()` 会删除 $2$ 个节点. 由于在所需的操作步数是 $10^5$, 即使都是 $Insert$ 操作, 也只需要 $2*10^5$ 个点.

对于一般的问题, 只要不是 $O(1)$ 规模的树上连续插入删除, 跑 $10^7$ 次 `Insert()` 和 `Delete()`, 这样会卡掉不垃圾回收的宗法树. 否则在时间允许的情况下, 这棵宗法树一定不会超出空间限制.

```cpp
unsigned m, n, Cnt(0), A, C, D, t, Tmp(0);
int Ans, B;
struct Node {
  Node *LS, *RS;
  int Size, Value, InValue;
} N[200005], *CntN(N), *Root(N);
int main() {
  n = RD();
  N[0].Value = N[0].InValue = 0x3f3f3f3f, N[0].Size = 1;  
  for (register unsigned i(1); i <= n; ++i) {
    A = RD();
    B = RDsg();
    switch(A) {
      case 1:{Root = Insert(Root); break;}
      case 2:{Root = Delete(Root);break;}
      case 3:{Ans = 1, Rank(Root);break;}
      case 4:{Find(Root);break;}
      case 5:{--B, Pre(Root);break;}
      case 6:{++B, Suc(Root);break;}
    }
    if(A >= 3) printf("%d\n", Ans);
  }
  return Wild_Donkey;
}
```