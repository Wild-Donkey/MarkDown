# 网络最大流·Advanced

## 历史背景

对于网络流的初步, 半年前我写过一篇文章总结, [Dinic 先生的两个算法](https://www.luogu.com.cn/blog/Wild-Donkey/p3376-mu-ban-wang-lao-zui-tai-liu). 在后来的日子里, 陆续有别人学习了最大流算法, 在议论着算法效率问题, 其中胜出者是@[sxy](https://www.luogu.com.cn/user/213237), 他用 Dinic 某个神奇优化以最慢的一个点的时间为 $70ms$ 左右的成绩赢得了卡常大赛的冠军. 对效率的追求近乎偏执的我来了兴趣, 虽然当时没有人写这道题, 我没有进行卡常, 代码也是看了算法文字叙述后自己yy的, 所以自己清楚没什么胜算, 但是当我找出之前的代码, 就有了下面的对话.

> 我只有 $55ms$

> 哪个点

> 我的意思是总时间

然后年少轻狂的我拿着我的算法交了一发加强版, 只有 $16'$, 剩下的点 T 飞了, 我主页 "尝试过的题目" 从此由 $3$ 道变成了 $4$ 道.

本以为这个事就这么过去了, 但是随着sxy用新学的 ISAP 以 $28ms$ 的总时间拿到了非加强版的最优解, 我便又开始难受了, 但是算法不同导致的效率差距不是卡常能追回来的, 于是为了强行扯平我们的实力, 我用他的代码也在加强版的题目中拿到了 $16'$ 的好成绩.

但是光是用阴招算什么好汉, 我思前想后, 要想超越sxy, 抢走他的最优解比登天还难, 谁都知道模板题的常数已经卷到什么程度了, 所以我下定决心要过掉加强版, 这起码比优化到最优解简单.

## ISAP

### 简介

ISAP Algorithm, Improved Shortest Augmenting Paths Algorithm, 是一种网络最大流算法, 翻译成中文是:

$$
最短增广路算法·\color{red}加强版
$$

由于 Dinic 在算法竞赛中完全够用, 被卡机率非常小, 如果被卡了, ISAP 也能解决这些丧心病狂的题目, 所以论实用性, 学习 ISAP 的性价比还是很高的.

古人云: "知己知彼, 百战不殆", 我特意在sxy的博客中学习了 ISAP 算法, 这里挂一下[友链](https://www.luogu.com.cn/blog/sxy2/wang-lao-liu).

### 从 Dinic 说起

先回顾一下 Dinic 的过程, 每次从 $S$ 开始 BFS 分层建图, 然后用 DFS 推流, 规定只能从深度小的点往深度大的点流.

ISAP 算法就是从分层图的思想中优化过来的, 将多次分层优化成了单次分层. 

至于这样为什么正确, 其实要从分层的意义开始分析. Dinic 算法之所以先分层再推流, 是为了让流单向流动, 防止两个点来回踢皮球, 或者环形流的出现, 也就是说我们只需要给每个点分一个先后, 或者说海拔高度, 然后让它们的流自行流入 T 即可.

那为什么要多次分层呢? 因为每次推流完成之后, 会有一些边的余量变成 $0$, 也就是说, 不连通了, 这时一个点的深度就有可能变深 (思考为什么不会变浅). 这时这个点就有机会将流量推到上个回合没有推到的节点, 这时就要求我们推流后修改深度, Dinic 算法中的方案是重新分层.

前面提出一个问题, 为什么深度只能变深而不能变浅. 考虑每个点的深度是如何被更新的, 由于 BFS 的特性, 每个点一定是被起点最浅的入边更新的, 如果这条边不连通了, 那么这个点的深度就要被别的边更新, 而别的入边起点的深度一定不会更浅, 所以一个点的深度只能增加.

还有一个显而易见的结论, 如果规定流只能从浅到深单向移动, 则一个点的流只能直接流向比它深度大 $1$ 的点, 至于深度更大的点为什么不能到达, 是因为如果存在这种出边, 当前点可以将这条出边的终点的深度更新到更小, 不符合 BFS 建图的性质.

接下来思考为什么可以不用重新搜索就维护每个点的深度, 从一个点的深度增加的条件考虑, 两种原因:

- 情况一: 所有入边均不再连通

由于前面证明了本轮推流的每条入边的起点的深度都是这个点的深度减 $1$, 所以但凡有一条边仍联通, 这个点的深度就不会增加. 入边之所以不连通, 是因为在本次推流中, 每条入边边的流量用完了它的容量.

- 情况二: 所有入边的起点的深度增加

这种情况可以分析更新这些起点的深度增加的原因, 并且追溯到所有情况二的边界, 这些点深度增加的原因是情况一, 也就是所有入边都被榨干.

情况一和情况二, 总结来说就是一个点的深度增加的充要条件, 是在当前分层情况的可行边种, $S$ 到这个点的路径都被榨干, 而一条路径被榨干, 当且仅当这条路径有至少一条边被榨干.

一个点的深度增加后, 它的入边的起点也会变成其它深度更大的点 (深度比它的深度小 $1$), 这时可能会出现新的从 $S$ 到这个点的路径.

### 算法核心

前置结论证明完了, 接下来就是 ISAP 的精髓.

由于无法快速判断 $S$ 到当前点的路径是否都被榨干, 但是由于我们可以通过判断一个点推流后的余量来判断这个点到 $T$ 的路径是否都被榨干. 由于网络的对称性, 我们可以以 $T$ 为起点 BFS 分层, 这样就可以快速判断一个点的深度是否要增加了.

这时, 推流的规则变成了将一个点的流推向深度比这个点小 $1$ 的点.

证明了每次只有特定节点的深度会改变, 加上我们可以快速判断每个点的深度是否增加, 就可以动态地维护每个点的深度, 避免了每次 DFS 前都要跑 BFS.

判断了深度是否增加, 那如果增加, 增加多少呢?

事实上, 我们可以增加 $1$, 这样既不会增加过多错过一些可行的路径, 也不会因为增加得少耗费太多时间, 因为如果一个深度不存在任何可行的出边, 则会判定为深度增加, 不会进行进一步的搜索.

### Gap

Gap, 缺口, 豁口, 裂口.

建立一个数组, $Gap_i$ 表示深度为 $i$ 的点数, 容易知道, 在一个点的流量只能流向深度比它小 $1$ 的点的时候, 如果这时在小于 $S$ 的深度的某个深度的 $Gap$ 值为 $0$, 说明这个深度的点不存在, 也就不会从 $S$ 往 $T$ 推任何流, 所有点的深度都永远不会再变化. 这种情况, 说明算法运行结束, 不存在增广路了, 可以退出.

我们把这种判断称作: "Gap 优化".

### 复杂度分析

在 $n$, $m$, DAG 上跑 DFS 的时间复杂度为 $O(nm)$. 每次 DFS, $S$ 的深度至少增加 $1$, 而最坏情况下, $Gap$ 数组从 $1$ 到 $S$ 的深度都不是 $0$ 的时候, $S$ 的深度最多为 $n$, 这时所有 $Gap$ 值都是 $1$, 因此需要 $O(n)$ 次 $DFS$.

因此, ISAP 的复杂度是 $O(n^2m)$, 和 Dinic 相同, 但是由于网络流算法很难卡到理论上界, 所以可以认为 ISAP 比 Dinic 快不少.

### 实现

实现起来非常简单, 细节也非常少, 只打了半小时就一遍过了, 但是跑得巨慢, 可能是评测机的锅 (评测机: MMP)

简单啊概括一下, 一遍 BFS 十分清新, 就是一遍 BFS.

DFS 的流程也比较简单, 符合条件的边就访问, 能推流就推流, 真正推到 T 点的流量会占用容量, 其余的多余流量回收, 推到别的出边.

由于一次只推 $2^{32} - 1$, 可能会出现源点的初始流流光 (供不应求) 的情况出现, 但是由于算法的鲁棒性, 这种情况源点的深度不增加, 而是下一次 DFS 再推一个 $2^{32} - 1$ 的流.

由于答案一般较小, 这种反复不会影响效率表现.

因为单次 DFS 源点流量没有爆 `unsigned`, 所以汇点实际的到的流量一定也不会爆 `unsigned`, 为了效率, 我们就用 `unsigned` 进行中间运算, 只有 $Ans$ 用 `unsigned long long` 求每次 DFS 的返回值总和. 

```cpp
unsigned Hd(0), Tl(0), Gap[10005], m, n, Cnt(0), C, D, t;
unsigned long long Ans;
struct Node; 
struct Edge {
  Node *To;
  Edge *Nxt;
  unsigned Contain;
}E[10005], *CntE(E);
struct Node {
  Edge *Fst;
  unsigned Dep;
}N[205], *Que[205], *A, *B, *S, *T;
unsigned DFS(Node *x, unsigned Come) {
  if(x == T) return Come;
  register Edge *Sid(x->Fst);
  register unsigned Go(0), Tmp;
  while (Sid) {
    if((Sid->To->Dep + 1 == x->Dep) && (Sid->Contain)) {
      Tmp = DFS(Sid->To, min(Come, Sid->Contain));
      Come -= Tmp;
      Go += Tmp;
      Sid->Contain -= Tmp;
      (Sid + 1)->Contain += Tmp;
      if(!Come) return Go;
    }
    Sid = Sid->Nxt;
  }
  if(!(--Gap[(x->Dep)++])) S->Dep = n + 1;
  ++Gap[x->Dep];
  return Go;
}
signed main() {
  n = RD(), m = RD(), S = N + RD(), T = N + RD();
  for (register unsigned i(1); i <= m; ++i) {
    A = N + RD(), B = N + RD(), C = RD();
    (++CntE)->Nxt = A->Fst;
    A->Fst = CntE;
    CntE->To = B;
    CntE->Contain = C;
    (++CntE)->Nxt = B->Fst;
    B->Fst = CntE;
    CntE->To = A;
  }
  T->Dep = 1, Que[++Tl] = T;
  register Node *x;
  while(Hd < Tl) {
    x = Que[++Hd];
    register Edge *Sid(x->Fst);
    while (Sid) {
      if(!(Sid->To->Dep)) {
        ++Gap[Sid->To->Dep = x->Dep + 1];
        Que[++Tl] = Sid->To;
      }
      Sid = Sid->Nxt;
    }
  }
  while (S->Dep <= n) Ans += DFS(S, 0xffffffff);
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

当然, 和sxy的 ISAP 一样, 我的 ISAP 同样在加强版中得到了 $16'$ 的好成绩.

## HLPP

### 简介

要想通过加强版, 我们这些凡人都需要用到一个算法, HLPP.

HLPP Algorithm, 缩写源自于 Highest label Preflow Push Algirithm (最高标号预流推进算法)

在 Wikipedia 中, 预流推进算法的名称是: Push–relabel Maximum Flow Algorithm. 分析百科文本中对时间复杂度 $O(n^2\sqrt m)$ 的算法的描述, 最高标号预流推进算法的名称应该是 Variant of Push–relabel Maximum Flow Algorithm that Based on the Highest Label Node Selection Rule, 翻译过来就是:

$$
"推流-标号"最大流算法\\
的基于选择最高标号节点\\
的推流规则\\
的变体
$$

所以根据这么详细的名字, 我们就可以顾名思义一下了:

- 通过给节点编号来确定单向流的方向, 这一点和 ISAP/Dinic 一样.

- 每次选择最高标号的节点来推流, 可以让本次推流中, 当前推流的节点在推流之后不会接受到任何流

所以这应该更加类似于在 ISAP 的基础上引入了推流节点的选择, 用 BFS 代替了 DFS. 让程序从跟着流从 $S$ 走到 $T$ 的陪伴者, 变成选择了节点, 将流推走, 然后不管这些流, 再前往下一个节点的管理者. 

### 算法思路

仍然是从 $T$ 为起点跑 BFS 给图分层, 记录每个点的深度作为高度 (标号).

然后将 $S$ 的每一个出边的终点加入优先队列, 将流量拉满. 这个优先队列以高度为序.

这时类似于 BFS, 每次弹出堆顶一个点, 这个点一定是之前有流量推过来的点, 用它的流量往高度比它小 $1$ 的点推, 这时会出现两种可能的情况:

- 推完所有合法的出边后该点仍有流量没有推走, 这时增加它的高度, 重新入队, 下一轮会尝试将流推到更高的点中. 因为既然这个点弹出前是标号最大, 那么它增加后再次入队, 这期间没有其它点加入, 它一定还是堆顶. 增加的数量也没必要非得是 $1$, 因为高度增加是为了流向其它点, 所以取出边中, 本次高度不足以流向的点的高度最小值再加上 $1$ 作为本次高度增加后的值. 这样既不会漏掉任何可行的出边, 又不会出现大量无意义重复运算.

- 推完了, 不用进行任何操作, 继续取堆顶推流即可.

如果推到了 $T$ 或 $S$, 无需加入优先队列, 留在 $T$ 中的流作为最大流的答案, 留在 $S$ 中的流作为多余的流. 这两个点的流在最后相加应该等于最开始入队的点的流量之和.

最后的答案就是 $T$ 中存在的流.

> 由于根号的复杂度过于玄学, 所以我对此非常疑惑, 不过时间复杂度一定和每个点的入队次数有关, 也和优先队列有关, 所以暂不证明.

### Gap

Gap, 缺口, 豁口, 裂口.

和 ISAP 不同的是, HLPP 的高度不是分层图的深度, 所以 Gap 优化不能和 ISAP 一样.

在 HLPP 中, 高度在堆顶之上的点, 除了 $S$ 对多余流量只吞不吐以外, 其它点都不存在流量. 所以如果堆顶的点 $x$ 的高度变化, 并且高度变化后, 同高度的点不存在了, 高度更高的点和后面的点的通路断开了, 这时 $x$ 的高度增加也不能把流量留到高度低的地方, 只能回到 $S$, 所以将所有比 $x$ 高的点的高度都设为 $n + 1$, 促进流量早日回到 $S$, 而不是反复横跳到 $S$.

实现方面每次一个 $Gap$ 值变空, 直接枚举 $n$ 个点, 把除了 $S$, $T$ 之外的高度比 $x$ 的高度大的点的高度都设为 $n + 2$, 这样做的正确性是因为每次操作时, 因为 $x$ 是堆顶, 所以比 $x$ 高的点一定不在队列中, 即使高度改变也不会影响队列的构造. 而效率的保证是因为每次出现一个 $Gap = 0$ 的情况, 就有 $x$ 的流量全部推到 $S$ 点, 这样, $x$ 的流推到 $S$ 后堆顶的高度一定会减小. 堆顶的高度最多减少 $O(n)$ 次, 每次最多枚举一遍 $n$ 个点, 所以这个操作的复杂度是 $O(n^2)$, 不影响 $O(n^2 \sqrt m)$ 总复杂度.

### 实现

代码细节较多, 码量没有提高太多, 由于写代码时对算法理解程度不高, 花了不少时间才过了题, 但是总体逻辑比较清晰.

单调队列方面比较绕, 因为避免将整个结构体作为队列元素, 我们只维护指针即可, 但是指针的运算符没法~~或是说, 我不会~~单独定义, 所以我开了一个新的结构体 `Que`, 只有一个成员变量, `Node` 指针 $P$, 这样就可以把 `Que` 的运算符定义为按 $Dep$ 排序, 然后就能插入单调队列了.

因为 HLPP 是基于 ISAP 修改得到的, 所以代码会有雷同, 但不同的是: 它可以 AC 加强版 (虽然很慢).

和 ISAP 一样, 为了方便 BFS, 我们将 $T$ 的高度设为 $1$, 这样 $S$ 的高度初始值就设为 $n + 1$, Gap 优化时重设高度是 $n + 2$.

```cpp
unsigned Hd(0), Tl(0), Gap[1205], m, n, Cnt(0), C, D, t, Tmp(0);
struct Node; 
struct Edge {
  Node *To;
  Edge *Nxt;
  unsigned Contain;
}E[240005], *CntE(E - 1);
struct Node {
  Edge *Fst;
  unsigned Dep, Contain;
}N[1205], *Qu[1205], *A, *B, *S, *T;
struct Que {
  Node *P;
  inline const char operator<(const Que &x) const {
    return this->P->Dep < x.P->Dep;
  }
};
priority_queue <Que> Q;
signed main() {
  n = RD(), m = RD(), S = N + RD(), T = N + RD();
  for (register unsigned i(1); i <= m; ++i) {
    A = N + RD(), B = N + RD(), C = RD();
    if(A == B) continue;
    (++CntE)->Nxt = A->Fst;
    A->Fst = CntE;
    CntE->To = B;
    CntE->Contain = C;
    (++CntE)->Nxt = B->Fst;
    B->Fst = CntE;
    CntE->To = A;
  }
  T->Dep = 1, Qu[++Tl] = T;
  register Node *x;
  while(Hd < Tl) {
    x = Qu[++Hd];
    register Edge *Sid(x->Fst);
    while (Sid) {
      if((!(Sid->To->Dep)) && (!(Sid->Contain))) {
        ++Gap[Sid->To->Dep = x->Dep + 1];
        Qu[++Tl] = Sid->To;
      }
      Sid = Sid->Nxt;
    }
  }
  --Gap[S->Dep];
  ++Gap[S->Dep = n + 1];
  register Que Pu;
  register Edge *Sid(S->Fst);
  while (Sid) {
    if(Sid->Contain) { 
      if(Sid->To != T && (!(Sid->To->Contain))) {
        Pu.P = Sid->To;
        Q.push(Pu);
      }
      Sid->To->Contain += Sid->Contain;
      (Sid + 1)->Contain = Sid->Contain;
      Sid->Contain = 0;
    }
    Sid = Sid->Nxt;
  }
  while(Q.size()) {
    x = (Q.top()).P, Q.pop();
    register unsigned Real;
    Sid = x->Fst;
    Tmp = 0x3f3f3f3f;
    while(Sid) {
      if(Sid->Contain) {
        if(Sid->To->Dep + 1 == x->Dep) {
          Real = min(x->Contain, Sid->Contain);
          if(!Real) {Sid = Sid->Nxt; continue;}
          x->Contain -= Real;
          Sid->Contain -= Real;
          E[(Sid - E) ^ 1].Contain += Real;
          if(Sid->To != S && Sid->To != T && (!(Sid->To->Contain))) {
            Pu.P = Sid->To, Q.push(Pu);
          }
          Sid->To->Contain += Real;
          if(!(x->Contain)) break;
        } else Tmp = min(Tmp, Sid->To->Dep);
      }
      Sid = Sid->Nxt;
    }
    if(x->Contain) {
      if(!(--Gap[x->Dep])) {
        for (register unsigned i(1); i <= n; ++i) {
          if(N + i != S && N + i != T && N[i].Dep > x->Dep) {
            N[i].Dep = n + 2;
          }
        }
      }
      ++Gap[x->Dep = Tmp + 1];
      Pu.P = x;
      Q.push(Pu);
    }
  }
  printf("%u\n", T->Contain);
  return Wild_Donkey;
}
```
