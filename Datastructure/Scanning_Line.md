# 扫描线

在很多题中, 扫描线都是非常有力的工具, 我之前从书上看过后花了好大力气领悟它的思想, 但是我居然现在才刚写, 着实不像话.

## 精神

扫描线的本质是在一个时间轴上扫描, 同时用数据结构维护序列在每个时间点的变化.

这个数据结构我们一般选用线段树.

## [模板: 矩形的并](https://www.luogu.com.cn/problem/P5490)

顾名思义, 给 $n$ 个矩形, 求它们并的面积. $n \leq 10^5$.

处理出所有矩形的左右边界, 共 $2n$ 个. 离散化所有的纵坐标, 令横坐标做时间轴, 按横坐标排序所有的左右边界, 维护每个时刻某个纵坐标被覆盖的次数.

类似于差分的思想, 每个矩形的左边界扫描到就给覆盖次数 $+1$, 右边界扫描到就 $-1$, 每次往右扫一个时间点就统计当前被覆盖至少一次的纵坐标区间总长度, 这个长度乘当前时间点的权值 (横坐标区间长度), 就是当前的面积并.

当然如果不离散化纵坐标, 而是将线段树变成动态开点线段树, 复杂度倒是也没错.

## 实现: 标记永久化

因为我们要维护的和求的东西不一样, 我们维护的是被覆盖次数, 求的是被覆盖至少 $1$ 次的位置长度. 所以不能简单地用标记实现区间修改区间查询.

我一开始想写一个函数, 查询区间的覆盖长度, 但是仅凭覆盖次数或总覆盖长度 (覆盖一次算一次)这些很容易就能维护的数据, 要查询覆盖长度, 需要递归到叶子, 复杂度 $O(n)$.

发现最多的复杂度浪费在递归, 发现每次查询区间都是 $[1, Cnty]$ (离散化后纵坐标值域), 所以一个复杂度正确的算法应该保证所有需要的信息都在 $[1, Cnty]$ 节点, 也就是根节点上, 这样才能在任意区间查询中得到正确的复杂度.

既然要用一个节点的信息求出答案, 我一开始维护的就是答案, 也就是 $Len$ 表示区间内的覆盖至少 $1$ 次的长度. 但是苦于在一次覆盖加取消覆盖后, 一个子树的所有 $Len$ 先是都变成区间长度, 然后就不能回到覆盖之前的状态了, 我们把这种情况成为: 数据丢失, 也就是本来有用的数据变成了可压缩的垃圾数据.

所以每个点上的有效数据必须被保留, 重新定义 $Len$, 让它表示这个区间内, 覆盖次数大于最小值的区间长度. 换个说法, 就是维护除去整个区间被覆盖的次数以外, 整个区间的覆盖次数大于等于 $1$ 的长度.

考虑如何维护这个值, 可以引入一种新思路: 标记永久化.

这个思想早在我初二的时候就略有理解, 将每次区间修改的标记永久保存在当前节点, 查询到时候递归过程中加权 (这个权值一般是节点区间和询问区间交的长度) 统计入答案, 下一层递归就不用考虑这部分的影响了. 当时我觉得这个只是另一种写法罢了, 功能和普通线段树没什么区别. 但是如今再分析, 标记永久化可以防止数据丢失, 所以标记永久化一般用在标记在父亲和儿子节点上意义不同的情况.

本题中标记在 $x$ 中表示的是 $x$ 的区间内的覆盖次数最小值减去它父亲 $x->Fa$ 的区间中覆盖次数最小值的差, 但是到了儿子 $x->Son$ 中就是 $x->Son$ 的区间中的覆盖次数最小值和 $x$ 的区间中覆盖次数最小值的差. 父亲不同, 意义也就不同, 标记便不能随意下传.

如果说 Lazy-Tag 是查询过程中不断将自己桶中的水倒入儿子桶中, 最后将递归底层的水一起称重; 那么标记永久化便是自己桶中水的颜色和儿子桶中不同, 所以每次递归时, 将递归路上所有桶中的不同颜色的水分别称重, 并且根据不同的颜色计算不同的价格.

这应该是我写过第一次的标记永久化, 而因为查询每次都是查询根节点, 所以就不用单独写个函数了, 再加上只有修改时递归到的节点才会发生影响答案的变化, 所以递归过程中对 $Len$ 进行维护. 函数返回值表示父亲将它的覆盖次数最小值减掉后, 当前节点覆盖次数大于等于 $1$ 的长度, 所以父亲的 $Len$ 就是两个儿子的返回值之和.

我们发现答案有两种情况: 

- 当 $[1, Cnty]$ 节点最小覆盖次数 (它的 $Tag$) 不是 $0$ 的时候

  答案一定是全体纵坐标.

- 当 $[1, Cnty]$ 节点最小覆盖次数 (它的 $Tag$) 是 $0$ 的时候

  答案就是该节点的 $Len$.

所以每次移动到一个新的横坐标, 修改之前, 查询答案, 加权 (权值是本横坐标和上一个横坐标之差) 统计到答案中.

但是为了减少编程难度, 这里也能缩减掉, 我们发现对 $[1, Cnty]$ 修改的函数的返回值恰好就是本次修改后的答案, 所以我们可以把每次修改后的答案记录下来, 每次需要求这个答案时直接拿去用, 让代码更美观.

另外: 因为坐标会出现 $0$, 所以为了使 $yList_0 = 0$ 作为离散化的哨兵, 我们强行将所有坐标往右移动一格, 往上移动一格, 避免出现 $0$ 导致离散化误判.

## 代码

```cpp
unsigned yList[2000005], m, n, Cnty(0), A, B, t, Tmp(0), Last(0);
unsigned long long Ans(0);
char Pls;
struct Line {
  unsigned Ly, Ry, Posx;
  char Plus;
  inline const char operator<(const Line &x) const{
    return this->Posx < x.Posx;
  }
}Li[2000005];
struct Node {
  Node *LS, *RS;
  unsigned Times, Lenth;
}N[4000005], *CntN(N);
unsigned Change (Node *x, unsigned L, unsigned R) {
  if((B < L) || (A > R)) {  // Out Of Range
    if(x->Times) return yList[R] - yList[L - 1];
    else return x->Lenth;
  }
  if((A <= L) && (R <= B)) {// In Range
    if(Pls) ++(x->Times);
    else --(x->Times);
    if(x->Times) return yList[R] - yList[L - 1];
    else return x->Lenth;
  }
  register unsigned Mid((L + R) >> 1);
  if(!(x->LS)) x->LS = ++CntN;
  if(!(x->RS)) x->RS = ++CntN;
  x->Lenth = Change(x->LS, L, Mid) + Change(x->RS, Mid + 1, R);
  if(x->Times) return yList[R] - yList[L - 1];
  else return x->Lenth; 
}
int main() {
  n = RD();
  for (register unsigned i(1); i <= n; ++i)
    Li[(i << 1) - 1].Posx = RD() + 1, yList[(i << 1) - 1] = Li[(i << 1) - 1].Ly = Li[i << 1].Ly = RD() + 1, Li[i << 1].Posx = RD() + 1, yList[i << 1] = Li[(i << 1) - 1].Ry = Li[i << 1].Ry = RD() + 1, Li[(i << 1) - 1].Plus = 1;
  n <<= 1;
  sort(yList + 1, yList + n + 1);
  for (register unsigned i(1); i <= n; ++i)
    if(yList[i] ^ yList[Cnty])
      yList[++Cnty] = yList[i];
  n >>= 1;
  for (register unsigned i(1); i <= n; ++i) {
    Li[(i << 1) - 1].Ly = Li[i << 1].Ly = lower_bound(yList + 1, yList + Cnty + 1, Li[i << 1].Ly) - yList;
    Li[(i << 1) - 1].Ry = Li[i << 1].Ry = lower_bound(yList + 1, yList + Cnty + 1, Li[i << 1].Ry) - yList;
  }
  n <<= 1;
  sort(Li + 1, Li + n + 1);
  for (register unsigned i(1); i <= n; ++i) {
    if(Li[i].Posx ^ Li[i - 1].Posx)
      Ans += (unsigned long long)(Li[i].Posx - Li[i - 1].Posx) * Last;
    A = Li[i].Ly + 1, B = Li[i].Ry, Pls = Li[i].Plus;
    Last = Change(N, 1, Cnty);
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## 后记: 做题心路历程的重要性

奉劝各位, 做题整理做法是帮你想明白怎么做这道题, 但是如果把做题想题的心路历程整理一遍, 有助于帮你想明白怎么做别的题.

提示: `for(register i(1); i <= 1; ++i)` 这种写法可以过本地, 很容易被忽视, 但是洛谷会 CE, 务必提高警惕! 正确写法: `for(register unsigned i(1); i <= 1; ++i)`