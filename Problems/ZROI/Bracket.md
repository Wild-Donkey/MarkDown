# 均摊数据结构: 带旋链表

## 问题引入

在模拟赛中, 遇到一个题, 给出一个括号序列, 对每一个位置, 求包含它的合法的括号序列个数.

## 预处理

首先用栈将所有不可能被包含的括号都设为空格. 然后将所有 `()` 找出来, 作为链表的节点, 从左到右连起来.

在每个节点上存一个区间, 这个区间外面可以加一对匹配的括号, 我们把加括号的操作称为 "扩张".

每新建一个节点, 我们都将它扩张到不能扩张为止.

每次扩张, 差分维护区间修改, 代表区间内的括号都被覆盖一次.

## 合并

对于链表上一段节点的区间首尾相接的情况, 说明它们可以合并成一个合法的区间.

但是统计答案却不简单, 如果有 $k$ 个连续的节点可以合并, 那么从左到右第 $i$ 个节点的区间就要统计 $i * (k - i + 1) - 1$ 次贡献, 因为 $k$ 个节点中, 任选若干连续的节点组成的子串, 使其包含第 $i$ 个节点的方案中, 左端点的 $i$ 种取值和右端点的 $k - i + 1$ 种取值随便组合都是合法的. 但是当选择的子串就是 $i$ 节点本身时, 这种情况已经被统计过了, 所以应当减去.

从上面的原理看, 合并对答案的影响和一次合并的节点数有关, 所以一定要保证合并的节点区间是极大的.

举个例子, `()()(()())`, 我们一开始建立的链表是 `[1, 2]`, `[3, 4]`, `[6, 7]`, `[8, 9]`.

如果我们先将前两个节点合并成 `[1, 4]`, 再把后两个节点合并成 `[6, 9]`, 然后扩张成 `[5, 10]`, 最后合并剩下的两个节点, 这样统计出的答案是错误的.

因为正确的合并方式应该是先合并到 `[6, 9]`, 扩张到 `[5, 10]`, 然后将 `[1, 2]`, `[3, 4]`, `[5, 10]` 一起合并起来, 而不是一开始就把 `[1, 4]` 作为一个整体考虑.

但是如果一开始不合并, 之后回过头来合并就会很慢, 因为这样会将一个节点扫过多次而不合并.

我们所熟知的链表最多只支持前后查询, 单点插入和删除. 这时急需一种新的链表出现, 才能解决这个问题.

## 旋转挂链

如果在原来链表的基础上, 将每个节点上挂一条链, 那么这个时候的链表就会呈现一种一二级结构, 主链上的节点还会有几率挂一条支链.

将主链上某节点的后继带着它的支链一起接驳到自己支链末端的操作, 称之为 "旋转".

每次旋转操作后, 都需要重新连接断开的主链, 不能破坏其连续性.

利用这个操作, 我们可以将可以合并, 但是时机尚未成熟的节点放到一条支链上, 然后对支链进行合并, 这样只要还没有合并节点统计答案, 我们都可以把这一堆节点当作一个整体来对待.

主链上每个节点, 保存自己支链的右端点位置, 也就是链底的右端点位置. 用来和相邻的支链合并.

## 支链收缩

当确定一个支链左右都不存在可以并入的节点, 那么从上到下扫描这条链, 统计答案, 然后将整条支链删除, 仅保留一个节点, 表示从此这个区间可以彻底作为一个整体考虑了. 我们把这个统计答案删除支链的过程称为 "收缩".

每次收缩完之后, 不要忘记扩张.

当一个新的节点扩张之后, 需要判断是否可以和前面的节点合并, 如果可以, 把自己接驳到前面节点支链底端即可.

## 复杂度证明

根据本题代码可以看出, 用栈标记不合法的括号和最后统计答案明显是线性.

扩张的复杂度也很好证明, 因为合并不会改变所有节点区间总长度, 所以找出初始所有节点后, 节点区间长度总和的增加仅来源于扩张. 每次扩张总长度增加 $2$, 所以扩张次数也是线性.

对于旋转到支链的节点, 除了删除它的时候需要遍历以外, 其余情况都不需要遍历, 所以旋转的复杂度取决于节点数. 因为不会出现新的节点, 所以旋转总数也是线性.

收缩的复杂度很好理解, 每次收缩扫描一整条支链, 然后将整条支链缩成一个点, 总点数线性, 所以收缩复杂度均摊线性.

因为已经证明了旋转, 扩张, 收缩的复杂度, 所以我们讨论主循环的贡献时候抠出这三种操作.

每次循环有四种情况:

- 将后面节点的支链旋转到自己支链底端

后面节点被旋转出主链, 主链长度和剩余主链长度减 $1$, 总点数不增加.

- 跳过

$Head$ 向后移动, 剩余主链长度减 $1$, 总点数主链长度不增加.

- 删点

将 $Head$ 从主链删除, 总点数和主链长度和剩余主链长度减 $1$.

- 缩点

将 $Head$ 的支链缩成一个点, 因为只有支链长度大于 $1$ 时才会执行, 所以总结点数至少减 $1$, 主链长度和剩余主链长度不增加. 缩成的新点有可能旋转到前一个节点的支链上, 当前节点 $Head$ 从主链上旋转出去, $Head$ 往前移动一位, 主链长度减 $1$, 总点数和剩余主链长度不增加.

综合四种情况, 每次执行循环时, 总点数, 主链长度, 剩余主链长度, 三个线性变量都不增加, 其总和至少减 $1$, 当它们的总和为 $0$ 时, 循环必定跳出, 所以循环次数是线性的.

因为除去前面计算过的三个操作的贡献后, 每次循环都是常数时间的, 所以总复杂度是线性.

## 代码实现

输入一个长度 $1000000$ 以内的括号序列, 将答案储存在 $Sum$ 数组里, 对 $1000000007$ 取模.

```cpp
const unsigned long long Mod(1000000007);
unsigned long long Sum[1000005];
unsigned Stack[1000005], STop(0), n;
char a[1000005]; 
struct SubStr {
  SubStr* Last, * Nxt, * SubNxt, * Bot;
  unsigned L, R, GrandR, Lay;
  inline void Del () {
    if(Last) Last->Nxt = Nxt;
    if(Nxt) Nxt->Last = Nxt;
  }
}S[500005], * Head(S + 1), * CntS(S);
signed main() {
  scanf("%s", a + 1), n = strlen(a + 1);
  for (unsigned i(1); i <= n; ++i) if(a[i] == '(') Stack[++STop] = i; else {if(STop) --STop; else a[i] = ' ';}
  while (STop) a[Stack[STop--]] = ' ';
  for (unsigned i(1); i <= n; ++i) if((a[i] == '(') && (a[i + 1] == ')')) {
    ++Sum[i], --Sum[i + 2], (++CntS)->L = i, CntS->R = i + 1, CntS->Nxt = CntS + 1;
    while ((a[CntS->L - 1] == '(') && (a[CntS->R + 1] == ')')) --(CntS->L), ++(CntS->R), ++Sum[CntS->L], --Sum[CntS->R + 1];
    CntS->GrandR = CntS->R, CntS->Lay = 1;
  }
  if(CntS == S) return Wild_Donkey;
  for (SubStr* i(Head); i <= CntS; i = i->Nxt) i->Last = i - 1, i->Nxt = i + 1, i->Bot = i, i->SubNxt = NULL;
  CntS->Nxt = CntS->SubNxt = Head->Last = NULL;
  while (Head) if((Head->Nxt) && (Head->Nxt->L == Head->GrandR + 1)) { // Rotate
    Head->Bot->SubNxt = Head->Nxt;
    Head->Bot = Head->Nxt->Bot;
    Head->Lay += Head->Nxt->Lay;
    Head->GrandR = Head->Nxt->GrandR;
    Head->Nxt = Head->Bot->Nxt;
    if(Head->Nxt) Head->Nxt->Last = Head;
  } else {
    if((a[Head->GrandR + 1] == '(') || (a[Head->L - 1] == ')')) {Head = Head->Nxt; continue;}//Wait for nodes after it to join
    if(Head->Lay == 1) {Head->Del(), Head = Head->Nxt;continue;} // Won't shrink, so delete
    SubStr* Cur(Head);
    for (unsigned long long i(1); i <= Head->Lay; ++i, Cur = Cur->SubNxt) {//Shrink
      Sum[Cur->L] = (Sum[Cur->L] + i * (Head->Lay - i + 1) - 1) % Mod;
      Sum[Cur->R + 1] = Mod + Sum[Cur->R + 1] - ((i * (Head->Lay - i + 1) - 1) % Mod);
      if(Sum[Cur->R + 1] >= Mod) Sum[Cur->R + 1] -= Mod;
    }
    Head->R = Head->GrandR, Head->SubNxt = NULL, Head->Bot = Head;
    while ((a[Head->L - 1] == '(') && (a[Head->R + 1] == ')')) --(Head->L), ++(Head->R), ++Sum[Head->L], --Sum[Head->R + 1];//Grow
    Head->GrandR = Head->R, Head->Lay = 1;
    if ((Head->Last) && (Head->Last->GrandR + 1 == Head->L)) {//Try to join nodes in front of it
      Head = Head->Last;
      Head->Bot->SubNxt = Head->Nxt;
      Head->Bot = Head->Nxt->Bot;
      Head->Lay += Head->Nxt->Lay;
      Head->GrandR = Head->Nxt->GrandR;
      Head->Nxt = Head->Bot->Nxt;
      if(Head->Nxt) Head->Nxt->Last = Head;
    }
  }
  for (unsigned i(1); i <= n; ++i) Sum[i] += Sum[i - 1];
  return Wild_Donkey;
}
```