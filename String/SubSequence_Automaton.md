# 子序列自动机 (Subsequence Automaton)

时隔两个月回来学自动机.

子序列自动机可以在线性时间识别一个字符串 $a$ 是否是 $s$ 的子序列.

首先考虑 $s$ 没有重复字符的情况, 那么 $s$ 的子序列就是 $2^{Len_s}$ 种, 分别是每个字符选或不选得到的子序列.

子序列的结尾有 $n$ 个, 分别代表以 $n$ 个字符结尾的子序列. 每个状态可以由它前面的每个状态转移过来, 所以转移数量的复杂度是 $O(n^2)$.

如果在 $s$ 后面再加一个已经出现的字符 $c$, 会增加 $n$ 个转移, 因为每个结尾字符都可以转移到第二个 $c$, 在原有的基础上再末尾加一个字符 $c$.

但是对于转移到第二个 $c$ 的转移边, 有一些浪费的情况. 假设第一个 $c$ 是第 $i$ 个字符, 第二个 $c$ 是第 $n + 1$ 个字符, 那么 $[1, i)$ 的字符到 $i$ 的转移和到 $n + 1$ 的转移所代表的子序列是相同的, 所以只有 $[i, n]$ 的状态才需要转移到 $n + 1$.

综上所述, 对于某个状态 $i$, 对于每个字符 $c$ 最多存在一个转移, 转移到它右边第一个这个字符对应的状态.

所以一个字符集大小为 $k$, 长度为 $n$ 的字符串的子序列自动机的状态数是 $O(n)$ 转移数是 $O(nk)$.

## [模板](https://www.luogu.com.cn/problem/P5826)

给一个正整数序列 $A$, 询问别的的正整数序列 $B$ 是否是 $A$ 的子序列.

对 $A$ 建立子序列自动机, 匹配 $B$ 即可.

但是, 一个测试点有多个 $B$, 字符集大小 $m$ 和 $A$ 的长度 $n$ 同阶, 都是 $10^5$, 如果用常规方式, $O(nm)$ 会使时空双双爆炸.

考虑用数据结构优化. 因为第 $i$ 个状态的转移只比第 $i + 1$ 个状态的转移增加了一个 $i + 1$, 减少了一个后一个 $i + 1$ 的后继. (规定一个字符的后继是它后面第一个和它字符相同的字符, 如果没有就是 $n + 1$)

这种一个版本只和另一个版本差别很小的数组, 可以通过可持久化线段数之可持久化数组来实现. 构造自动机的时空复杂度变成 $O(nlogm)$.

再来看匹配, 所有的 $B$ 串满足 $\sum len_B \leq 10^6$, 复杂度是 $O(\sum len_Blogm)$, 时间复杂度正确.

代码难度极小, 构建自动机的过程只是对每个字符进行一次可持久化线段树修改, 匹配时, 对特定的版本进行查询即可. 复杂度 $O((n + \sum Len_B)logm)$

```cpp
unsigned a[100005], m, n, Cnt(0), A, B, C, D, t, Ans(0), Tmp(0), CQPos, CQVal, Len, Ty;
char Flg(0);
inline void Clr() {}
struct Node{
  Node *LS, *RS, *Val;
}N[1700005], Ver[100005], *CntN(N);
void Chg(Node *x, unsigned L, unsigned R) {
  if(L == R) {x->Val = Ver + CQVal; return;}
  unsigned Mid((L + R) >> 1);
  if(CQPos <= Mid) {
    ++CntN;
    if(x->LS) CntN->LS = x->LS->LS, CntN->RS = x->LS->RS;
    x->LS = CntN;
    Chg(x->LS, L, Mid);
  } else {
    ++CntN;
    if(x->RS) CntN->LS = x->RS->LS, CntN->RS = x->RS->RS;
    x->RS = CntN;
    Chg(x->RS, Mid + 1, R);
  }
}
Node *Qry(Node *x, unsigned L, unsigned R) {
  if(L == R) {return x->Val;}
  unsigned Mid((L + R) >> 1);
  if(CQPos <= Mid) {if(x->LS) return Qry(x->LS, L, Mid);}
  else if(x->RS) return Qry(x->RS, Mid + 1, R);
  return NULL;
}
int main() {
  Ty = RD(), n = RD(), t = RD(),   m = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  for (register unsigned i(n - 1); i < 0x3f3f3f3f; --i) {
    Ver[i].LS = Ver[i + 1].LS, Ver[i].RS = Ver[i + 1].RS;// 继承上一个 
    CQPos = a[i + 1], CQVal = i + 1;
    Chg(Ver + i, 1, m);  // 后一个节点有到它自己后继的转移, 删除, 设为它自己
  }
  for (register unsigned i(1); i <= t; ++i) {
    Len = RD(), Flg = 0;
    register Node *Now(Ver);
    for (register unsigned j(1); j <= Len; ++j) {
      if(Flg) RD();
      else {
        CQPos = RD();
        Now = Qry(Now, 1, m);
        if(!Now) Flg = 1;
      }
    }
    printf(Flg ? "No\n" : "Yes\n");
  }
  return Wild_Donkey;
}
```

这道题还有线性做法:

考虑反客为主, 用 $A$ 去匹配 $B$. (其实我一开始想的是可以用所有的 $B$ 建 `Trie`, 构造 `AC 自动机`, 然后就不会写了)

基本流程是将每个 $B$ 当前匹配到的指针存下来, $Pos_i$ 表示, 第 $i$ 个 $B$ 的前 $Pos_i$ 位是当前已经考虑过的 $A$ 的子序列.

开一个 $m$ 大小的桶, $Bucket_i$ 存所有 ${B_k}_{Pos_k} = i$ 的 $k$. 一开始, 初始化 $Pos_i = 1$, 从左到右扫描 $A$, 对于 $A_i$, 每次将 $Bucket_{A_i}$ 中的所有 $k$ 对应的 $Pos_k$ 右移变成 $Pos_k + 1$.

对于 $B$ 的存储, 为了防止使用 `vector`, 我将所有 $B$ 存在了一个数组中, 中间用空字符隔开, 这样, $Pos_i$ 指向的位置就是 ${B_i}_1$ 在整个数组中的位置了.

中间的空字符充当了哨兵的角色, $B_i$ 判完了, $Pos_i$ 会丢进 $Bucket_0$, 而不管 $A$ 扫到哪一位, 都不会碰 $Bucket_0$. 最后扫描所有的 $Pos_i$, $B_{Pos_i} = 0$ 的说明整个 $B_i$ 判完了, 输出 `Yes`, 否则输出 `No`.

这里桶存储多个数字的方式我使用了邻接表, 同样是防止使用 `vector`, 这样就可以优化常数了.

最后用了一发输出优化, 不知是不是又双叒叕反向优化了.

本来以为我的代码难看都是指针的锅, 没想到数组也能变得这么难看, 可能是极限卡常和丧心病狂的压行导致的, 不过勉勉强强挤进了前 $5$.

```cpp
unsigned a[100005], b[1100005], Pos[100005], Bucket[100005], Nxt[100005], m, n, t;
signed main() {
  RD(), n = RD(), t = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) a[i] = RD();
  for (register unsigned T(1), Len, Cnt(0); T <= t; ++T) {
    Pos[T] = ++Cnt, Len = Cnt + RD();
    while (Cnt < Len) b[Cnt++] = RD();
  }
  for (register unsigned i(1); i <= t; ++i)
    Nxt[i] = Bucket[b[Pos[i]]], Bucket[b[Pos[i]]] = i;
  for (register unsigned i(1), j, Tmp; i <= n; ++i) {
    Tmp = Bucket[a[i]], Bucket[a[i]] = 0;
    while (Tmp) j = Tmp, ++Pos[j], Tmp = Nxt[j], Nxt[j] = Bucket[b[Pos[j]]], Bucket[b[Pos[j]]] = j;
  }
  for (register unsigned i(1); i <= n; ++i)
    if(b[Pos[i]]) putchar('N'), putchar('o'), putchar('\n'); 
    else putchar('Y'), putchar('e'), putchar('s'), putchar('\n'); 
  return Wild_Donkey;
}
```