# CF1416E Split

这篇题解没有任何思维含量，属于数据结构强行优化 DP，比别的题解少用了一些性质。

## 题目大意

给一个长度为 $n$ 的序列 $a$，把每个数原地分裂成两个正数，变成长度为 $2n$ 的序列 $b$。然后把 $b$ 相邻的连续的相同数字合并成一个数字，求 $b$ 合并后的最短长度。

## DP 设计

设计 $f_{i，j}$ 表示枚举到 $a_i$，$b_{2i} = j$ 的时候，合并后 $b$ 的最小长度。下面是转移:

$$
f_{i, j} = min(f_{i - 1, a_i - j} + 1, f_{i - 1, k} + 2) - [2j = a_i]\\
$$

很显然这样是 $O(n\max a)$ 的，所以一定是过不掉的。

## DP 优化

我们用平衡树维护一堆区间，表示 $f$ 值，需要支持全局最值，后缀删除，后缀插入，全局抹平，全局翻转，全局加，单点减。(真是看看就不想写呢，不过还好大部分都是全局操作)

为了阉掉全局加操作，所以把状态设为最小长度减去 $i$，这样转移就变成:

$$
f_{i, j} = min(f_{i - 1, a_i - j}, f_{i - 1, k} + 1) - [2j = a_i]\\
$$

接下来只要写一棵趁手的平衡树维护一下就可以了，复杂度 $O(n\log n)$。

## 代码实现

我使用的平衡树是 [WBLT](https://www.luogu.com.cn/blog/Wild-Donkey/lun-li-zui-yan-jin-di-ping-heng-shu-zong-fa-shu)，如果不会 WBLT，强烈推荐学一下，可以维护区间，可以持久化，非均摊复杂度，而且常数小如 Treap，基本上可以代替 FHQ 的一切。

```cpp
#define Inf 1000000
unsigned a[500005], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
struct Node {
  Node* LS, * RS;
  unsigned Mn, L, R, Tag, Size;
  char Re;
  inline void Udt() { Size = LS->Size + RS->Size, Mn = min(LS->Mn, RS->Mn); }
}N[5000005], * CntN(N), * Root;
inline void Clr() { n = RD(), Root = N; }
inline void PsDw(Node* x) {
  if (x->LS) x->LS->R = x->L + x->LS->R - x->LS->L, x->LS->L = x->L;
  if (x->RS) x->RS->L = x->R - x->RS->R + x->RS->L, x->RS->R = x->R;
  if (x->Re) {
    swap(x->LS, x->RS);
    if ((x->LS) && (x->RS)) {
      x->LS->Re ^= 1, x->RS->Re ^= 1;
      x->LS->R = x->L + x->LS->R - x->LS->L;
      x->RS->L = x->LS->R + 1;
      x->LS->L = x->L, x->RS->R = x->R;
    }
    else {
      if (x->LS) x->LS->Re ^= 1;
      if (x->RS) x->RS->Re ^= 1;
    }
    x->Re = 0;
  }
  if (x->Tag) {
    if (x->LS) x->LS->Tag = x->LS->Tag ? min(x->LS->Tag, x->Tag) : x->Tag, x->LS->Mn = min(x->LS->Mn, x->Tag);
    if (x->RS) x->RS->Tag = x->RS->Tag ? min(x->RS->Tag, x->Tag) : x->Tag, x->RS->Mn = min(x->RS->Mn, x->Tag);
    x->Tag = 0;
  }
}
inline Node* Rotate(Node* x) {
  PsDw(x);
  if ((!(x->LS)) && (!(x->RS))) return x;
  if (!(x->RS)) return Rotate(x->LS);
  if (!(x->LS)) return Rotate(x->RS);
  if (x->Size < 5) return x;
  if ((x->LS->Size * 3) < x->RS->Size) {
    Node* Cur(Rotate(x->RS));
    x->RS = Cur->RS, Cur->RS = Cur->LS, Cur->LS = x->LS, x->LS = Cur, Cur->Udt();
    Cur->L = Cur->LS->L, Cur->R = Cur->RS->R;
  }
  if ((x->RS->Size * 3) < x->LS->Size) {
    Node* Cur(Rotate(x->LS));
    x->LS = Cur->LS, Cur->LS = Cur->RS, Cur->RS = x->RS, x->RS = Cur, Cur->Udt();
    Cur->L = Cur->LS->L, Cur->R = Cur->RS->R;
  }
  return x;
}
inline Node* Edit(Node* x) {
  Rotate(x);
  if ((!(x->LS)) && (!(x->RS))) {
    if (x->L == x->R) --(x->Mn);
    else {
      if (x->L == A) {
        x->LS = (++CntN), * (x->LS) = (Node){ NULL, NULL, x->Mn - 1, A, A, 0, 1, 0 };
        x->RS = (++CntN), * (x->RS) = (Node){ NULL, NULL, x->Mn, A + 1, x->R, 0, 1, 0 };
        x->Udt();
        return x;
      }
      if (x->R == A) {
        x->RS = (++CntN), * (x->RS) = (Node){ NULL, NULL, x->Mn - 1, A, A, 0, 1, 0 };
        x->LS = (++CntN), * (x->LS) = (Node){ NULL, NULL, x->Mn, x->L, A - 1, 0, 1, 0 };
        x->Udt();
        return x;
      }
      x->LS = (++CntN), * (x->LS) = (Node){ NULL, NULL, x->Mn, x->L, A, 0, 1, 0 };
      x->RS = (++CntN), * (x->RS) = (Node){ NULL, NULL, x->Mn, A + 1, x->R, 0, 1, 0 };
      x->LS = Edit(x->LS), x->Udt();
    }
  }
  else {
    if (x->LS->R >= A) x->LS = Edit(x->LS);
    else x->RS = Edit(x->RS);
    x->Udt();
  }
  return x;
}
inline Node* Del(Node* x) {
  if (x->L > A) return NULL;
  x = Rotate(x);
  if (!(x->LS)) { x->R = A;return x; }
  if (x->LS->R > A) return Del(x->LS);
  x->RS = Del(x->RS), x->R = A, x = Rotate(x);
  if (x->LS) x->Udt();
  return x;
}
inline Node* Isrt(Node* x) {
  x = Rotate(x);
  if (x->RS) { x->RS = Isrt(x->RS), x->R = A, x->Udt(); return Rotate(x); }
  if (x->Mn == B) { x->R = A; return x; }
  x->LS = (++CntN), * (x->LS) = (Node){ NULL, NULL, x->Mn, x->L, x->R, 0, 1, 0 };
  x->RS = (++CntN), * (x->RS) = (Node){ NULL, NULL, B, x->R + 1, A, 0, 1, 0 };
  x->R = A, x->Udt();  return Rotate(x);
}
signed main() {
  t = RD();
  for (unsigned T(1); T <= t; ++T) {
    Clr();
    for (unsigned i(1); i <= n; ++i) a[i] = RD();
    N[0] = (Node){ NULL, NULL, Inf + 1, 1, a[1] - 1, 0, 1, 0 };
    if (!(a[1] & 1)) A = a[1] >> 1, Root = Edit(Root);
    for (unsigned i(2); i <= n; ++i) {
      B = Root->Mn + 1;
      A = a[i] - 1;
      if (a[i] > a[i - 1]) Root = Isrt(Root);
      if (a[i] < a[i - 1]) Root = Del(Root);
      Root = Rotate(Root), Root->Tag = B, Root->Re = 1, Root->Mn = min(B, Root->Mn);
      if (!(a[i] & 1)) A = a[i] >> 1, Root = Edit(Root);
    }
    printf("%u\n", Root->Mn + n - Inf);
  }
  return Wild_Donkey;
}
```