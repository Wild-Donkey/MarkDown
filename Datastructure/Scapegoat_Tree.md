# 替罪羊树(Scapegoat_Tree)

## 定义

一种平衡树, 能达到[宗法树](https://www.luogu.com.cn/blog/Wild-Donkey/lun-li-zui-yan-jin-di-ping-heng-shu-zong-fa-shu)和 Treap 的常数, 不用旋转维护自己的平衡, 逻辑和宗法树类似, 在左右子树极度不平衡时维护它的平衡性, 只不过宗法树是旋转, 比较温和, 而替罪羊树采用的是重构左右子树这种比较激进的策略.

所以替罪羊树不需要旋转.

和旋转不同的是, 一次重构可以使它的整个子树的每个节点的两个儿子平衡, 所以就不需要像宗法树一样, 每次遇到左右不平衡的节点都维护, 只要在这次操作经过的所有节点中, 找到深度最小的那个不平衡的节点, 然后重构它的子树即可.

这就是替罪羊树得名的原因: 即使有很多点需要重构, 选深度最小的点作为替罪羊, 只重构替罪羊的子树. 原因也很简单, 即使从下到上的所有节点都重构, 结果也和只重构那个最靠上的一样. (虽然依次重构这些点不会使复杂度更劣, 但是会得到两倍的常数).

```cpp
struct Node {
  Node *LS, *RS;
  int Value, Size, Cnt, RealSize;
}N[100005], *PntStk[100005], *CntN(N), *Root(N), *TmpN, *TmpNF, *TmpF;
```

## 重构

字面意思, 重新建树, 如果子树规模为 $n$, 则重构复杂度是实实在在的 $O(n)$, 至于为什么时间复杂度正确, 之后会给出证明.

操作逻辑很简单, $O(n)$ 中序遍历, 得到一个排序好的序列, 然后每次取中点作为子树的根, 将序列分成两段, 两段分别递归建树.

实现起来一般是将树上的节点按中序遍历压入一个栈, 在重构的时候, 使用栈里的节点的内存, 这样就能减少垃圾节点的数量并且不会申请新的内存.

```cpp
Node *Build(unsigned L, unsigned R) {
  if(L == R) {
    PntStk[Hd]->Size = PntStk[Hd]->Cnt = CntStack[L], PntStk[Hd]->LS = PntStk[Hd]->RS = NULL, PntStk[Hd]->Value = Stack[L], PntStk[Hd]->RealSize = 1;
    return PntStk[Hd--];
  }
  register unsigned Mid((L + R) >> 1);
  register Node *x(PntStk[Hd--]);
  x->RealSize = 1, x->Value = Stack[Mid], x->Size = x->Cnt = CntStack[Mid];
  if(L < Mid) x->LS = Build(L, Mid - 1), x->RealSize += x->LS->RealSize, x->Size += x->LS->Size;
  else x->LS = NULL;
  x->RS = Build(Mid + 1, R);
  x->RealSize += x->RS->RealSize, x->Size += x->RS->Size;
  return x;
}
inline void DFS(Node *x) {
  if(x->LS) DFS(x->LS);
  if(x->Cnt) PntStk[++Hd] = x, CntStack[Hd] = x->Cnt, Stack[Hd] = x->Value;
  if(x->RS) DFS(x->RS);
}
Node *Rebuild(Node *x) {
  Hd = 0, DFS(x);
  return Build(1, Hd);
}
```

## 删除

先说删除, 是因为替罪羊树的删除不同于基于旋转的平衡树, 因为不能旋转, 因此不能合并, 所以一个点的删除不能仅仅将它的两个子树合并后插入这个点原来的位置.

为了避免破坏树的结构, 我们用 $Cnt$ 来表示这个节点对应元素出现的次数, 对于需要删除的元素对应的节点, 如果这个元素存在至少一个, 将 $Cnt$ 减少 $1$, $Size$ 也同样变化.

当然, 为了防止有那种疯狂删除节点的数据, 我们需要在有效元素明显小于节点数的时候重构这棵子树. 实现起来就是维护两个 $Size$, 其中一个 $Size$ 存这个子树实际上有多少个元素, 另一个 $RealSize$ 存这个子树有多少节点.

对于 $Size$, 我们在递归时维护即可, 因为重构不会改变 $Size$ 大小.

对于 $RealSize$, 删除不会删除节点, 所以删除操作不会改变 $RealSize$, 但是重构会删除所有 $Cnt$, 所以我们需要在重构之后重新计算重构之后的子树的 $RealSize$. 因为 $RealSize$ 只在回溯到某个点的时候使用, 所以可以暂时不更新一个子树的祖先的 $RealSize$, 当需要用到 $RealSize$ 值的时候, 这时的 $RealSize$ 一定是从叶子回溯回来的, 也就是正确的.

注意这里的几个 $Tmp$ 变量, 这是因为在重构之后, 子树的根可能会改变, 根改变后, 就不能通过它的父亲递归到正确的节点, 所以需要存储 $TmpN$ 这棵子树原来的父亲是谁, 存到 $TmpNF$ 中, 然后记录它是哪个儿子, $TmpNT = 0$ 时, $TmpN$ 是 $TmpNF$ 的左儿子, 反之是右儿子. 其余 $Tmp$ 就是在递归时暂存对于 $x$ 而言的 $TmpNF$ 和 $TmpNT$ 的, 用全局变量和局部变量结合避免了递归传参, 优化了常数.

```cpp
void Delete(Node *x) {
  register Node *TmpofTmp(TmpF);
  register char TmpofTmpTg(TmpTg);
  TmpF = x;
  if(x->Value == B) {if(x->Cnt) --(x->Cnt), --(x->Size);}
  else  if(x->Value > B) {if (x->LS) TmpTg = 0, x->Size -= x->LS->Size, Delete(x->LS), x->Size += x->LS->Size;}
        else if (x->RS) TmpTg = 1, x->Size -= x->RS->Size, Delete(x->RS), x->Size += x->RS->Size;
  x->RealSize = 1;
  if(x->LS) x->RealSize += x->LS->RealSize; 
  if(x->RS) x->RealSize += x->RS->RealSize; 
  if(x->RealSize > 3 && x->Size) {
    if((!(x->LS)) || (!(x->RS))) {TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;return;}
    if((x->LS->Size * 2 < x->RS->Size) || (x->RS->Size * 2 < x->LS->Size)) {TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;return;}
    if(x->RealSize * 3 > x->Size * 4) TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;
  }
}
```

## 插入

插入操作和删除的不同是: 一定成功. 不像删除操作可能没有对应元素导致无法删除.

所以对于任何递归到的节点, $Size$ 一定会增加 $1$, 所以所有经过的点, $Size$ 先增加再说.

而 $RealSize$ 则不然, 所以需要递归时维护 $RealSize$, 回溯时判断是否重构.

```cpp
void Insert(Node *x) {
  ++(x->Size);
  register Node *TmpofTmp(TmpF);
  register char TmpofTmpTg(TmpTg);
  TmpF = x;
  if(x->Value == B) {++(x->Cnt);}
  else {
    if(x->Value < B) {
      if(!(x->RS)) ++(x->RealSize), x->RS = ++CntN, x->RS->Value = B, x->RS->Cnt = x->RS->RealSize = x->RS->Size = 1;
      else TmpTg = 1, x->RealSize -= x->RS->RealSize, Insert(x->RS), x->RealSize += x->RS->RealSize;
    } else {
      if(!(x->LS)) ++(x->RealSize), x->LS = ++CntN, x->LS->Value = B, x->LS->Cnt = x->LS->RealSize = x->LS->Size = 1;
      else TmpTg = 0, x->RealSize -= x->LS->RealSize, Insert(x->LS), x->RealSize += x->LS->RealSize;
    }
  }
  x->RealSize = 1;
  if(x->LS) x->RealSize += x->LS->RealSize; 
  if(x->RS) x->RealSize += x->RS->RealSize;
  if(x->RealSize > 3 && x->Size) {
    if((!(x->LS)) || (!(x->RS))) {TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;return;}
    if((x->LS->Size * 2 < x->RS->Size) || (x->RS->Size * 2 < x->LS->Size)) TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;
    if(x->RealSize * 3 > x->Size * 4) TmpN = x, TmpNF = TmpofTmp, TmpNT = TmpofTmpTg;
  }
}
```

## 查排名

查排名和一般的 BST 是一样的, 没有什么特点.

唯一的细节是小心当前节点的 $Cnt$ 为 $0$ 的情况, 这是在其他 BST 中不会出现的 (貌似不判断也不会出错).

```cpp
void Rank (Node *x) {
  if(x->LS) if(x->Value > B) return Rank(x->LS); else Ans += x->LS->Size;
  if(x->Cnt) if(x->Value < B) Ans += x->Cnt;
  if(x->RS) return Rank(x->RS);
}
```

## 查第 $k$ 大

这时的 $Cnt = 0$ 貌似也不影响正确性, 和一般的 BST 一样, 按部就班查询即可.

```cpp
void Find(Node *x) {
  if(x->LS) if(x->LS->Size >= B) return Find(x->LS); else B -= x->LS->Size;
  if(x->Cnt) if(x->Cnt >= B) {Ans = x->Value; return;} else B -= x->Cnt;
  if(x->RS) return Find(x->RS);
}
```

## 查前驱

未曾设想的道路: 查询 $x$ 的前驱, 需要先求 $x$ 的排名 $r$, 然后查询第 $r - 1$ 大数的即可, 不需要单独写一个函数.

## 查后继

想都不敢想的道路: 查询 $x + 1$ 的排名 $r$, 然后查询第 $r$ 大的数即可.

## 主函数

这里主要是注意用 $TmpN$, $TmpNF$, $TmpNT$ 重构替罪羊, 并且将重构之后的替罪羊接回原树对应的位置. 对于根做替罪羊的情况, 将根的指针指向新的根即可; 其余情况, 则是根据 $TmpNT$, 将新的子树根连接到 $TmpNF$ 的对应儿子处. 至于不更新 $Size$ 和 $RealSize$ 的原因, 在删除的部分已经解释过了.

```cpp
unsigned Hd(0), m, n, A;
int Ans, B, Stack[100005], CntStack[100005];
char TmpNT(0), TmpTg(0);
int main() {
  n = RD(), N[0].Value = 0x3f3f3f3f, N[0].Size = 1;  
  for (register unsigned i(1); i <= n; ++i) {
    A = RD(), B = RDsg();
    switch(A) {
      case 1:{
        TmpN = NULL, Insert(Root);
        if(TmpN) {
          if(TmpN == Root) {Root = Rebuild(TmpN);break;}
          if(TmpNT) TmpNF->RS = Rebuild(TmpN);
          else TmpNF->LS = Rebuild(TmpN);
        }
        break;
      }
      case 2:{
        TmpN = NULL, Delete(Root);
        if(TmpN) {
          if(TmpN == Root) {Root = Rebuild(TmpN);break;}
          if(TmpNT) TmpNF->RS = Rebuild(TmpN);
          else TmpNF->LS = Rebuild(TmpN);
        }
        break;
      }
      case 3:{Ans = 1, Rank(Root);break;}
      case 4:{Find(Root);break;}
      case 5:{Ans = 0, Rank(Root), B = Ans, Find(Root);break;}
      case 6:{++B, Ans = 1, Rank(Root), B = Ans, Find(Root);break;}
    }
    if(A >= 3) printf("%d\n", Ans);
  }
  return Wild_Donkey;
}
```

## 复杂度

首先假设不会有元素相同, 因为有元素相同只能在元素数量相同的情况下使节点更少, 显然不会使复杂度更劣, 所以考虑更坏的情况, 即元素各不相同.

然后假设对极度不平衡的定义是左子树比右子树的两倍还要大, 或右子树比左子树的两倍还要大.

对于一棵子树需要重构的, 子树节点规模为 $k$ 的替罪羊, 它从上一次被重构, 到这一次, 至少会有 $\frac k3$ 次插入或删除操作使得它变得极度不平衡. 也就是说一次 $O(k)$ 的操作出现, 必定是 $O(\frac{klogk}3)$ 的操作的结果.

另一种重构的情况是一棵子树的元素数量小于节点数的 $\frac 34$, 则这棵子树从上一次重构到这时至少进行了 $\frac k4$ 次删除操作. 也就是说一次 $O(k)$ 的操作的出现, 必定是 $O(\frac{klogk}4)$ 次操作的结果.

这两种情况的分析证明了在 $logk > 4$ 的时候, 重构操作并不影响时间复杂度. 而对于 $logk < 4$ 的时候, 即使每次操作都重构, 单次操作的复杂度也是 $O(logn + 16)$, 同样不影响复杂度.

