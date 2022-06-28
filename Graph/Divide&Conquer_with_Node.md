# Divide and conquer with node

点分治, 就是选取适当的根节点, 把树上关于路径的问题分成两类考虑, 即经过根的路径和不经过根的路径, 在求解时只考虑经过根的路径, 然后对于根的每个儿子的子树递归求解.

复杂度和层数还有每层的点数有关, 因为每层有 $O(n)$ 个点, 所以我们要尽量减少层数. 如果选择树的重心, 那么最坏情况下层数是 $O(\log n)$. 因此对于每个子问题都选择重心作为根.

## [模板题](https://www.luogu.com.cn/problem/P3806)

给一棵边带权的树, 求是否存在距离为 $k$ 的点对.

如果不会点分治, 可以使用 DSU on Tree 在 $O(n\log n)$ 的时间内解决问题, 而且常数更小. 不过我们为了学习点分治, 只能先放下这个方法.

对于只经过根的点对是否存在, 只需要 DFS 一遍, 把所有点的深度存到 `set` 里即可, 实现 $O(n\log^2 n)$ 的算法, 也可以使用哈希表, 达到 $O(n\log n)$ 的水平.

由于是 $m$ 次询问, 我们可以把询问都存下来, 统一回答, 可以减少常数.

```cpp
const unsigned long long Mod(1000003), Base(41);
unsigned Q[105], m, n;
unsigned A, B, C, D, t;
unsigned Cnt(0), Tmp(0), Mn(0), Total;
unsigned Hash[1010005], Stack[10005], STop(0);
unsigned Buffer[10005], BTop(0);
bitset<105> Ans;
struct Node {
  vector <pair<Node*, unsigned> > To;
  unsigned Size, MxSize, Dep;
  char NAva;
}N[10005], * Heavy;
inline unsigned Find(unsigned x) {
  unsigned Pos(x * Base % Mod);
  while (Hash[Pos] && (Hash[Pos] ^ x)) ++Pos;
  return Pos;
}
inline void DFS1(Node* x, Node* Fa) {
  x->Size = 1, x->MxSize = 0;
  for (auto i : x->To) if ((i.first != Fa) && (!(i.first->NAva)))
    DFS1(i.first, x), x->Size += i.first->Size, x->MxSize = max(x->MxSize, i.first->Size);
}
inline void DFS2(Node* x, Node* Fa) {
  unsigned MnMx(max(x->MxSize, Total - x->Size));
  if (MnMx < Mn) Mn = MnMx, Heavy = x;
  for (auto i : x->To) if ((i.first != Fa) && (!(i.first->NAva))) DFS2(i.first, x);
}
inline void DFS3(Node* x, Node* Fa) {
  unsigned Pos;
  for (auto i : x->To) if ((i.first != Fa) && (!(i.first->NAva))) {
    Buffer[++BTop] = (i.first->Dep = x->Dep + i.second);
    for (unsigned j(1); j <= m; ++j) if ((!Ans[j]) && (Q[j] >= i.first->Dep)) {
      if (i.first->Dep == Q[j]) { Ans[j] = 1; continue; }
      Pos = Find(Q[j] - i.first->Dep); if (Hash[Pos] == (Q[j] - i.first->Dep)) Ans[j] = 1;
    }
    DFS3(i.first, x);
  }
}
inline void Solve(Node* x) {
  DFS1(x, NULL), Heavy = NULL, Mn = 0x3f3f3f3f, Total = x->Size, DFS2(x, NULL);
  unsigned Pos;
  Heavy->Dep = 0;
  for (auto i : Heavy->To) if (!(i.first->NAva)) {
    Buffer[++BTop] = (i.first->Dep = Heavy->Dep + i.second);
    for (unsigned j(1); j <= m; ++j) if ((!Ans[j]) && (Q[j] >= i.first->Dep)) {
      if (i.first->Dep == Q[j]) { Ans[j] = 1; continue; }
      Pos = Find(Q[j] - i.first->Dep); if (Hash[Pos] == (Q[j] - i.first->Dep)) Ans[j] = 1;
    }
    DFS3(i.first, Heavy);
    while (BTop) { Pos = Find(Buffer[BTop]); if (!Hash[Pos]) Hash[Pos] = Buffer[BTop], Stack[++STop] = Pos; --BTop; }
  }
  Heavy->NAva = 1;
  while (STop) Hash[Stack[STop--]] = 0;
  for (auto i : Heavy->To) if (!(i.first->NAva)) Solve(i.first);
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i < n; ++i) {
    A = RD(), B = RD(), C = RD();
    N[A].To.push_back(make_pair(N + B, C));
    N[B].To.push_back(make_pair(N + A, C));
  }
  for (unsigned i(1); i <= m; ++i) Q[i] = RD();
  Solve(N + 1);
  for (unsigned i(1); i <= m; ++i)printf(Ans[i] ? "AYE\n" : "NAY\n");
  return Wild_Donkey;
}
```