---
title: 省选日记 终章
date: 2022-06-01 16:45
categories: Notes
tags:
  - Persistent_Data_Structure
  - Self_Balancing_Binary_Search_Tree
  - Binary_Search
  - Depth_First_Search
  - Priority_Queue
  - Monotonic_Queue
  - Dynamic_Programming_Optimization
  - General_Suffix_Automaton
  - Suffix_Automaton
  - Aho_Corasick_Algorithm
thumbnail: https://wild-donkey-gallery.oss-cn-hangzhou.aliyuncs.com/BlogImg/GTA7.png
---

# 省选日记-终章 (SDOI2022 游记)

SDOI 重出江湖后被推迟到了 $5$ 月 $15$ 日, 一天考完 Day1 和 Day2. 推迟了 $41$ 天, 是时候有个交代了.

## Day $41$ May 14, 2022, Saturday

明天省选, 今天继续打板子.

### [P5055 可持久化文艺平衡树](https://www.luogu.com.cn/problem/P5055)

发现可持久化文艺平衡树没写, 意识到自己可持久化平衡树都是 WBLT, 自带两倍点数, 加上自己的代码使用了指针, 自带两倍空间, 所以空间是一般平衡树的四倍, 十分有可能被卡空. 不过可持久化之后点数的差距就没有那么明显了, 所以仍然是 WBLT.

这里看到一个 WBLT 的合并方式明显要比我之前的东周平衡树先进. 如果合并到两棵树的大小相差不超过阈值, 那么直接合并为一个父亲的两个儿子, 否则分类讨论, 如果将较小的树和较大的树的对应儿子合并后, 新树的大小相差不超过阈值, 那么就合并之, 否则先旋转再合并.

```cpp
long long OV, Ans(0);
unsigned m, n, A, B, C, D;
struct Node {
  Node* LS, *RS;
  long long Val;
  unsigned Size;
  char Flip;
  inline void Prt();
  inline void Udt() {
    Size = (LS ? LS->Size : 0) + (RS ? RS->Size : 0);
    Val = (LS ? LS->Val : 0) + (RS ? RS->Val : 0);
  }
  inline void PsDw();
  inline Node *Rotate();
  inline Node *Insert(unsigned x);
  inline Node *Delete(unsigned x);
  inline Node *Merge(Node* x);
  inline void Split(Node*& x, Node*& y, unsigned z); 
}N[40000005], *Ver[200005], *CntN(N);
inline void Node::Prt(){
  printf("Node%u: Size %u Val %lld Flg %u LS %u(%u) RS %u(%u)\n", this - N, Size, Val, Flip, LS - N, LS ? LS->Size : 0, RS - N, RS ? RS->Size : 0);
}
inline void Node::PsDw() {
  if(Flip) swap(LS, RS);
  if(LS) *(++CntN) = *LS, LS = CntN, LS->Flip ^= Flip;
  if(RS) *(++CntN) = *RS, RS = CntN, RS->Flip ^= Flip;
  Flip = 0;
}
inline Node *Node::Rotate() {
  if(!LS) return RS;
  if(!RS) return LS;
  if(Size <= 5) return this;
  if((LS->Size << 1) < RS->Size) {
    Node* Cur(RS);
    Cur->PsDw(), RS = Cur->RS, Cur->RS = Cur->LS;
    Cur->LS = LS, LS = Cur, Cur->Udt();
    return this;
  }
  if((RS->Size << 1) < LS->Size) {
    Node* Cur(LS);
    Cur->PsDw(), LS = Cur->LS, Cur->LS = Cur->RS;
    Cur->RS = RS, RS = Cur, Cur->Udt(); 
    return this;
  }
  return this;
}
inline Node *Node::Insert(unsigned x) {
  if(Size == 1) {
    *(LS = ++CntN) = {NULL, NULL, x ? Val : OV, 1, 0};
    *(RS = ++CntN) = {NULL, NULL, x ? OV : Val, 1, 0};
    Flip = 0, Val = Val + OV, Size = 2; 
    return this;
  }
  PsDw();
  if(x <= LS->Size) LS = LS->Insert(x);
  else RS = RS->Insert(x - LS->Size);
  Udt();
  return Rotate();
}
inline Node *Node::Delete(unsigned x) {
  if(Size == 1) return NULL;
  PsDw();
  if(x <= LS->Size) LS = LS->Delete(x);
  else RS = RS->Delete(x - LS->Size);
  Udt();
  return Rotate();
}
inline Node *Node::Merge(Node* x) {
  if(Size + x->Size <= 5) {
    *(++CntN) = {this, x, Val + x->Val, Size + x->Size, 0};
    return CntN;
  }
  if(Size > (x->Size << 1)) {PsDw(), RS = RS->Merge(x), Udt(); return this;}
  if(x->Size > (Size << 1)) {x->PsDw(), x->LS = Merge(x->LS), x->Udt(); return x;}
  *(++CntN) = {this, x, Val + x->Val, Size + x->Size, 0};
  return CntN;
}
inline void Node::Split(Node*& x, Node*& y, unsigned z) {
  PsDw();
  if(LS->Size == z) {x = LS, y = RS;return;}
  Node *Cur;
  if(LS->Size > z) LS->Split(x, Cur, z), y = Cur->Merge(RS);
  else RS->Split(Cur, y, z - LS->Size), x = LS->Merge(Cur);
}
signed main() {
  n = RD();
  for (unsigned i(1); i <= n; ++i) {
    A = RD(), B = RD(), C = RD() ^ Ans;
    switch(B) {
      case (1) :{
        OV = RD() ^ Ans;
        if(!Ver[A]) *(Ver[i] = ++CntN) = {NULL, NULL, OV, 1, 0};
        else *(Ver[i] = ++CntN) = *Ver[A], Ver[i]->Insert(C);
        break;
      }
      case (2) :{
        *(Ver[i] = ++CntN) = *Ver[A], Ver[i]->Delete(C);
        break;
      }
      default :{
        D = RD() ^ Ans;
        Node* Part1, *Part2, *Part3;
        *(Ver[i] = ++CntN) = *Ver[A];
        if(C > 1) Ver[i]->Split(Part1, Part2, C - 1);
        else Part2 = Ver[i], Part1 = NULL;
        if(D ^ Ver[i]->Size) Part2->Split(Part2, Part3, D - C + 1);
        else Part3 = NULL;
//        printf("Done\n"); 
        if(B & 1) Part2->Flip ^= 1;
        else printf("%lld\n", Ans = Part2->Val);
        if(Part3) Part2 = Part2->Merge(Part3);
        if(Part1) Ver[i] = Part1->Merge(Part2);
        else Ver[i] = Part2;
        break;
      }
    }
  }
  return Wild_Donkey;
}
```

### [CTSC2012 熟悉的文章](https://www.luogu.com.cn/problem/P4022)

当时补正睿的时候做到过这道题, 但是因为太难跳过了, 今天当成 SAM 的板子打一下.

一开始想出 $O(n\log^2 n)$ 的时候还疑惑为什么这个题可以用 ACAM 做. 后来发现 ACAM 只能识别前缀, 不能识别子串. 所以还是得建 GSAM. 接下来是真正的 $O(n\log^2 n)$ 做法.

可以对模式串建立 GSAM, 然后对询问串的每一个前缀得到一个和所有模式串的 LCS (最长公共后缀). 记 $a_i$ 为第 $i$ 个前缀和所有模式串的 LCS. 接下来二分 $L$, 用 DP 验证可行性.

我们把所有串反过来, 那么统计的 $a$ 就成了 LCP 序列, 设计状态 $f_i$ 表示前缀 $i$ 的分割最少有多少没有被划分为熟悉子串的字符. 那么可以写出方程:

$$
\begin{aligned}
f_{i + j} &= \min (f_{i + j}, f_i) &\left(j \in [L, a_{i + 1}]\right)\\
f_{i + 1} &= \min (f_{i + 1}, f_i + 1)
\end{aligned}
$$

初始是 $f_i = i$, 可以用线段树优化转移, 单次判断 $O(n\log n)$.

算上二分 $L$, 总复杂度 $O(n\log^2n)$.

```cpp
unsigned a[1100005];
unsigned m, n, Len;
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Match;
char SPool[1100005], *S(SPool);
struct Seg {
  Seg* LS, *RS;
  unsigned Tag;
  inline void PsDw() {
    LS->Tag = min(LS->Tag, Tag);
    RS->Tag = min(RS->Tag, Tag);
  }
  inline void Build(unsigned L, unsigned R);
  inline void Edit (unsigned L, unsigned R) {
    if(A <= L && R <= B) {Tag = min(Tag, C); return;}
    PsDw();
    unsigned Mid((L + R) >> 1);
    if(A <= Mid) LS->Edit(L, Mid);
    if(B > Mid) RS->Edit(Mid + 1, R);
  }
  inline void Find (unsigned L, unsigned R) {
    if(L == R) {B = Tag; return;}
    PsDw();
    unsigned Mid((L + R) >> 1);
    if(A <= Mid) LS->Find(L, Mid);
    else RS->Find(Mid + 1, R);
  }
}Se[2200005], *CntS(Se);
inline void Seg::Build(unsigned L, unsigned R) {
  Tag = 0x3f3f3f3f;
  if(L == R) { LS = RS = NULL; return; }
  unsigned Mid((L + R) >> 1);
  (LS = ++CntS)->Build(L, Mid);
  (RS = ++CntS)->Build(Mid + 1, R);
}
inline char Judge (unsigned x) {
  if(!x) return 1;
  (CntS = Se)->Build(1, Len);
  unsigned Cur(0);
  for (unsigned i(0); i < Len; ++i) {
    if(a[i + 1] >= x)
      A = i + x, B = i + a[i + 1], C = Cur, Se->Edit(1, Len);
    A = i + 1, Se->Find(1, Len), Cur = min(Cur + 1, B);
  }
  return Cur <= (Len * 0.1);
}
inline void Solve () {
  unsigned L(0), R(Len), Mid;
  while (L ^ R) {
    Mid = ((L + R + 1) >> 1);
    if(Judge(Mid)) L = Mid;
    else R = Mid - 1; 
  }
  printf("%u\n", L);
}
struct Node{
  Node *E[2], *Fail;
  unsigned Len;
  inline void Prt();
  inline Node*Find(char c);
  inline Node*Add(char c);
}N[2200005], *CntN(N);
inline void Node::Prt() {
  printf("Node%u: Sons %u %u Fail %u Len %u\n", this - N, E[0] - N, E[1] - N, Fail - N, Len);
}
inline Node* Node::Find(char c) {
  if(E[c]) {++Match; return E[c];}
  Node* Back(Fail);
  while (Back && (!Back->E[c])) Back = Back->Fail;
  Match = Back ? (Back->Len + 1) : 0;
  return Back ? Back->E[c] : N;
}
inline Node* Node::Add(char c) {
  if(E[c]) {
    if(E[c]->Len == Len + 1) return E[c];
    Node* Copy(++CntN), *Back(this), *Ori(E[c]);
    *Copy = *E[c], Copy->Len = Len + 1, Ori->Fail = Copy;
    while (Back && (Back->E[c] == Ori)) Back->E[c] = Copy, Back = Back->Fail;
    return Copy;
  }
  Node*Cur(++CntN), *Back(this);
  Cur->Len = Len + 1;
  while (Back && (!Back->E[c])) Back->E[c] = Cur, Back = Back->Fail;
  if(!Back) {Cur->Fail = N; return Cur;}
  if(Back->E[c]->Len == Back->Len + 1) {Cur->Fail = Back->E[c]; return Cur;}
  Node*Copy(++CntN), *Ori(Back->E[c]);
  *Copy = *Ori, Copy->Len = Back->Len + 1;
  Cur->Fail = Ori->Fail = Copy;
  while (Back && (Back->E[c] == Ori)) Back->E[c] = Copy, Back = Back->Fail;
  return Cur;
}
signed main() {
  n = RD(), m = RD();
  for (unsigned i(1); i <= m; ++i) {
    scanf("%s", S), Len = strlen(S);
    Node* Cur(N);
    for (unsigned j(0); j < Len; ++j) Cur = Cur->Add(S[j] - '0');
    S = S + Len;
  }
  for (unsigned i(1); i <= n; ++i) {
    Node* Cur(N);
    scanf("%s", S), Len = strlen(S), Match = 0;
    for (unsigned j(0); j < Len; ++j)
      Cur = Cur->Find(S[j] - '0'), a[Len - j] = Match;
    S = S + Len;
    Solve();
  }
  return Wild_Donkey;
}
```

写完以后小调之后过了样例, 提交有了 $80'$, 喜出望外这次的 GSAM 一次写对了, 但是复杂度上的缺陷确实过不了 $1.1e6$, 开了 `-O2` 拿到了 $90'$.

正难则反, 发现不用把 $a$ 反过来表示 LCP, 设 $a_i$ 仍然表示询问串第 $i$ 个前缀和模式串的 LCS, 设计状态 $f_i$ 表示第 $i$ 个前缀缀最少的没有被标记为熟悉的子串的长度总和, 则有这样的方程:

$$
f_i = \min(f_{i - 1} + 1, \min_{j = L}^{a_i} f_{i - j})
$$

发现这个方程可以用单调队列优化. (虽然这个时候提到单调队列有点搞心态)

对于 $f_a \leq f_b$, $i - L \geq a > b$, $f_b$ 在转移中是无用的, 因此我们维护一个单调队列, 每次转移进行一次二分查找, 并且插入一个元素. 这样仍然是 $O(n\log^2 n)$, 但是常数会减少. 所以最慢一个点 $977ms$ 险过.

所以啊, 年轻人会二分查找是真的好.

> Stop learning useless algorithms, go and solve some problems, learn how to use binary search.   ----Um_nik

```cpp
unsigned a[1100005], f[1100005], Stack[1100005], *STop(Stack);
char SPool[1100005], *S(SPool);
inline char Judge (unsigned x) {
  if(!x) return 1;
  unsigned Cur(0);
  memset(f + 1, 0x3f, Len << 2);
  f[0] = 0;
  for (unsigned i(1); i <= Len; ++i) {
    if(i >= x) {
      while ((STop > Stack) && (f[i - x] <= f[*STop])) --STop;
      *(++STop) = i - x;
    }
    f[i] = f[i - 1] + 1;
    if(a[i] >= x)
      f[i] = min(f[i], f[*lower_bound(Stack + 1, STop + 1, i - a[i])]);
  }
  return f[Len] <= (Len * 0.1);
}
signed main() {
  /*这部分和上一份代码都一样*/
  for (unsigned i(1); i <= n; ++i) {
    Node* Cur(N);
    scanf("%s", S), Len = strlen(S), Match = 0;
    for (unsigned j(0); j < Len; ++j)
      Cur = Cur->Find(S[j] - '0'), a[j + 1] = Match; // 只有这个地方把 a[Len - j] 改成了 a[j + 1]
    S = S + Len;
    Solve();
  }
  return Wild_Donkey;
}
```

不过这道题是有单 log 做法的, 只不过 AC 限制了我的思考, 所以去看题解学习一下.

原理其实很简单, 我们求出来的 $a$ 数组, 由于是一个字符一个字符匹配的, 每次最多增加 $1$, 所以一定有 $a_i + 1 \geq a_{i + 1}$. DP 中, 可以转移 $f_i$ 的状态最小是 $i - a_i$, 因为 $a_i + 1 \geq a_{i + 1}$, 因此 $i - a_i \leq i + 1 - a_{i + 1}$, 因此左边界单调增加, 所以我们可以直接将队尾弹出, 让单调栈真正变成单调队列, 这样就不用二分查找了, 总复杂度 $O(n\log n)$.

代码其余部分都相同.

```cpp
unsigned a[1100005], f[1100005], Que[1100005], *Hd, *Tl;
inline char Judge (unsigned x) {
  if(!x) return 1;
  unsigned Cur(0);
  memset(f + 1, 0x3f, Len << 2);
  f[0] = 0, Hd = Tl = Que; 
  for (unsigned i(1); i <= Len; ++i) {
    if(i >= x) {
      while ((Hd < Tl) && (f[i - x] <= f[*Tl])) --Tl;
      *(++Tl) = i - x;
    }
    f[i] = f[i - 1] + 1;
    while ((Hd < Tl) && ((*(Hd + 1)) < i - a[i])) ++Hd;
    if((Hd < Tl) && (*(Hd + 1) <= i - x)) f[i] = min(f[i], f[*(Hd + 1)]);
  }
  return f[Len] <= (Len * 0.1);
}
```

### [NOI2011 阿狸的打字机](https://www.luogu.com.cn/problem/P2414)

打字机打字的过程其实就是对 Trie 树遍历的过程, 我们可以建一棵 Trie 出来.

如果构造 ACAM, 询问一个字符串在另一个字符串中出现的次数, 就是查询 Fail 树上某个节点的子树中有多少个另一个串也含有的节点.

我们要查询的是 Trie 树上的一条路径上的节点在 Fail 树中的一个子树中出现了多少个, 因此将 Trie 重链剖分, 将问题转化为重链剖分套二维数点.

记一个 DFS 序, 然后在 Fail 树上按 DFS 序建立可持久化权值线段树. 因为是两个共用节点的树形结构, 我们分两个 DFS 序考虑. 设 Trie 树上节点 $i$ 的 DFS 序为 $TrieR_i$, 在 Fail 树上节点 $i$ DFS 序为 $FailR_i$. 这个可持久化权值线段树以 $FailR$ 为版本号, 以 $TrieR$ 为序, 在两个版本上查询就是在一棵 Fail 树的子树上查询, 而区间查询则是查询某个 Tire 树上的链上的节点在这个子树中的数量. 单次查询 $O(n\log^2 n)$.

```cpp
unsigned m, n(0);
unsigned A, B, C, D, t;
unsigned Cnt(0), Ans(0), Tmp(0);
char a[100005];
struct Seg {
  Seg *LS, *RS;
  unsigned Val;
  inline void Insert(Seg* x, unsigned L, unsigned R);
  inline void Find(Seg* x, unsigned L, unsigned R) {
    if(A <= L && R <= B) { Ans += Val - (x ? x->Val : 0);return; }
    unsigned Mid((L + R) >> 1);
    if(A <= Mid && LS) LS->Find(x ? x->LS : NULL, L, Mid);
    if(B > Mid && RS) RS->Find(x ? x->RS : NULL, Mid + 1, R);
  }
}S[2000005], *Ver[100005], *CntS(S);
inline void Seg::Insert(Seg* x, unsigned L, unsigned R) {
  if(x) *this = *x;
  ++Val;
  if(L == R) {return;}
  unsigned Mid((L + R) >> 1);
  if(A <= Mid) (LS = ++CntS)->Insert(x ? x->LS : NULL, L, Mid);
  else (RS = ++CntS)->Insert(x ? x->RS : NULL, Mid + 1, R);
}
struct Node{
  vector<Node*> Son;
  Node *E[26], *Fa, *Fail, *Heavy, *Top;
  unsigned Dep, SizeF, SizeT, FailR, TrieR;
  char My;
  inline void DFST() {
    TrieR = ++Cnt;
    if(Heavy) Heavy->Top = Top, Heavy->DFST();
    for (char i(0); i < 26; ++i) 
      if(E[i] && (E[i] != Heavy)) E[i]->Top = E[i], E[i]->DFST();
  }
  inline void DFSF ();
}N[100005], *List[100005], *Rev[100005], *Last(N), *CntN(N);
inline void Node::DFSF () {
  Rev[FailR = ++Cnt] = this, SizeF = 1;
  for (auto i:Son) i->DFSF(), SizeF += i->SizeF; 
}
inline void BFS() {
  Node* Que[CntN - N + 3], **Hd(Que), **Tl(Que);
  for (char i(0); i < 26; ++i) if(N->E[i]) *(++Tl) = N->E[i];
  while (Hd < Tl) {
    Node *Cur(*(++Hd)), *Back(Cur->Fa->Fail);
    Cur->Dep = Cur->Fa->Dep + 1;
    while (Back && (!(Back->E[Cur->My]))) Back = Back->Fail;
    if(Back && Back->E[Cur->My]) Cur->Fail = Back->E[Cur->My];
    else Cur->Fail = N;
    for (char i(0); i < 26; ++i) if(Cur->E[i]) *(++Tl) = Cur->E[i];
  }
  for (Node** i(Tl); i > Que; --i) {
    (*i)->SizeT = 1;
    unsigned Mx(0);
    for (char j(0); j < 26; ++j) if((*i)->E[j]) {
      (*i)->SizeT += (*i)->E[j]->SizeT;
      if(Mx < (*i)->E[j]->SizeT)
        Mx = ((*i)->Heavy = (*i)->E[j])->SizeT;
    }
  }
}
signed main() {
  scanf("%s", a + 1);
  A = strlen(a + 1), m = RD();
  while (A && (a[A] ^ 'P')) --A;
  for (unsigned i(1); i <= A; ++i) {
    if(a[i] == 'P') {List[++n] = Last; continue;}
    if(a[i] == 'B') {Last = (Last->Fa ? Last->Fa : N); continue;}
    if(!(Last->E[a[i] -= 'a']))
      (Last->E[a[i]] = ++CntN)->Fa = Last, (Last = CntN)->My = a[i];
  }
  BFS(), N->DFST(), Cnt = 0;
  for (Node *i(N + 1); i <= CntN; ++i) i->Fail->Son.push_back(i);
  N->Top = N, N->DFSF();
  for (unsigned i(1); i <= Cnt; ++i)
    A = Rev[i]->TrieR, (Ver[i] = ++CntS)->Insert(Ver[i - 1], 1, Cnt);
  for (unsigned i(1); i <= m; ++i) {
    Node *QrySt(List[RD()]), *ModleSt(List[RD()]);
    Seg *Frm(Ver[QrySt->FailR - 1]), *Too(Ver[QrySt->FailR + QrySt->SizeF - 1]);
    Ans = 0;
    while (ModleSt) {
      A = ModleSt->Top->TrieR, B = ModleSt->TrieR;
      Too->Find(Frm, 1, Cnt);
      ModleSt = ModleSt->Top->Fa;
    }
    printf("%u\n", Ans);
  }
  return Wild_Donkey;
}
```

## Day $42$ May 15, 2022, Sunday

今天是省选 Day1 + Day2, 因为有一点空虚, 所以我迟了好久才过来写游记.

期望 $20 + 35 + 25 + 100 + 10 + 0 = 190$, 实际挂成了 $0 + 35 + 25 + 100 + 2 + 0 = 162$. 山东 RK $24$, 加上 NOIP 成绩 RK $23$. 肯定没有 AB 了, 但是 D 是绝对可以买的.

详细内容参见[省选游记](/Contests/SDOI2022).

## Day $43-52$ May 16 - 25

省选结束后我进入了一段轻松的退休生活. 有多轻松呢? 反正就是很轻松就是了.

## Day $55$ May 28, 2022, Saturday

考了省选来 APIO 散散心, 具体内容见[游记](/Contests/APIO2022).