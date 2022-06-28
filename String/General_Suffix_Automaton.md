# 广义后缀自动机 (General Suffix Automaton)

## 定义

广义后缀自动机是后缀自动机和 Trie 结合的产物, 通俗地讲就是在 Trie 上建立后缀自动机. 后缀自动机维护的是单个字符串的信息, 而广义后缀自动机维护的则是多个字符串的信息.

如果你还不会后缀自动机或 Trie, 请移步这两篇博客:

- [后缀自动机](https://www.luogu.com.cn/blog/Wild-Donkey/hou-zhui-zi-dong-ji-suffix-automaton)

- [Trie](https://www.luogu.com.cn/blog/Wild-Donkey/ac-zi-dong-ji-ahocorasickalgorithm) (文章第一部分)

## 做法

> 问: 建立 GSAM 有几步.
> 答: 有 $3$ 步

1. 先建立一棵边上存字符, 而不是节点存字符的 Trie, 作为广义后缀自动机的主链.

2. 在 Trie 上跑一边 BFS, 保存 Trie 的 BFS 序.

3. 按 BFS 序像建立后缀自动机一样一个一个加入当前节点入边的字符 (因为字符存在边上)

## [模板: Luogu-P6139](https://www.luogu.com.cn/problem/P6139)

给 $n$ 个字符串, 求它们本质不同的子串数量. ($\displaystyle{\sum_{i = 1}^n}len_{s_i} \leq 10^6$, $n \leq 4*10^5$)

根据前面的结论, 一个 $Endpos$ 等价类中字符串连续递增 (由前一个字符串前面增加字符得到). 又因为一个 $Link$ 链上一个等价类中最短字符串长度等于它 $Link$ 最长的字符串长度加 $1$, 所以一个 $Link$ 链上所有节点的等价类的所有字符串也是连续递增的.

根据后缀自动机节点不重不漏表达字符串子串这个性质, 就可以将每个节点的字符串数相加得到答案.

具体细节如 Trie 的建立, BFS 的实现, SAM 的构建等都不再赘述, 其实 GSAM 就是 SAM 的一个特殊应用, 没有太多新东西, 思维难度也不高.

## 代码

```cpp
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <iostream>
#include <map>
#include <queue>
#include <vector>
#define Wild_Donkey 0
using namespace std;
inline unsigned RD() {
  unsigned intmp = 0;
  char rdch(getchar());
  while (rdch < '0' || rdch > '9') {
    rdch = getchar();
  }
  while (rdch >= '0' && rdch <= '9') {
    intmp = intmp * 10 + rdch - '0';
    rdch = getchar();
  }
  return intmp;
}
unsigned a[10005], m, n, Cnt(0), t, Tmp(0), len(0), queueHead(0), queueTail(0);
unsigned long long Ans(0); 
bool b[10005];
char s[1000006];
struct Node {
  Node *To[26], *Father, *Link;                       // GSAM 转移边, GSAM 父亲指针, 后缀链接指针 
  char Visited, Character, toAgain[26];               // 用 char 是因为它比 bool 快, toAgain[] 必要的话可以尝试用 unsigned 状压代替数组 
  unsigned Length;
}N[2000005], *now(N), *CntN(N), *Queue[1000005], *A, *C_c;
inline void Clr() {}
int main() {
  n = RD();
  N[0].Length = 0; 
  for (register unsigned i(1); i <= n; ++i) {         // 读入 + 建 Trie 
    scanf("%s", s);                                   // 字符转成自然数 
    len = strlen(s);
    now = N;
    for (register unsigned j(0); j < len; ++j) {
      s[j] -= 'a';
      if(!(now->To[s[j]])) {
        now->To[s[j]] = ++CntN;
        CntN->Father = now;
        CntN->Character = s[j];
        CntN->Length = now->Length + 1;               // 顺带着初始化一些信息 
      }
      now = now->To[s[j]];
    }
  }
  Queue[++queueTail] = N;                             // 初始化队列, 准备 BFS 
  while (queueHead < queueTail) {                     // 简单的 BFS 
    now = Queue[++queueHead];
    for (register char i(0); i < 26; ++i) {
      if(now->To[i]) {
        if(!(now->To[i]->Visited)) {
          Queue[++queueTail] = now->To[i];
          now->To[i]->Visited = 1;
        }
      }
    }
  }
  for (register unsigned i(2); i <= queueTail; ++i) { // BFS 留下的队列便是 BFS 序, 这便是一个普通的后缀自动机构建 
    now = Queue[i];                                   // 按队列的顺序进行插入, 保证 Link 跳到的节点已经插入 
    A = now->Father; 
    while (A && !(A->toAgain[now->Character])) {      // 跳 Link 边 + 连转移边 
      A->toAgain[now->Character] = 1;                 // 原来的 Trie 边不代表 GSAM 边, 这里的 toAgain 为真才说明 GSAM 有这个转移 
      A->To[now->Character] = now;
      A = A->Link;
    }
    if(!A) {                                          // 无对应字符转移 
      now->Link = N;
      continue;
    }
    if((A->Length + 1) ^ (A->To[now->Character]->Length)) {
      C_c = A->To[now->Character];
      (++CntN)->Length = A->Length + 1;               // 调了好久的问题, 不要在重定向之前自作主张提前转移 A->c 
      CntN->Link = C_c->Link;
      memcpy(CntN->To, C_c->To, sizeof(C_c->To));
      memcpy(CntN->toAgain, C_c->toAgain, sizeof(C_c->toAgain));
      now->Link = CntN;
      C_c->Link = CntN;
      CntN->Character = C_c->Character;
      while (A && A->To[C_c->Character] == C_c) {
        A->To[C_c->Character] = CntN;
        A = A->Link; 
      }
      continue;
    }
    now->Link = A->To[now->Character];                // 连续转移, 直接连 Link 
  }
  for (register Node *i(N + 1); i <= CntN; ++i) {
    Ans += i->Length - i->Link->Length;               // 统计字串数 
  }
  printf("%llu\n", Ans);
  return Wild_Donkey;
}
```

## 注意事项

- 构造 GSAM 时, 遇到节点分裂的情况, 新的转移要等批量重定向时一起修改, 否则, $A$ 的 $To[c]$ 提前从 $C \rightarrow c$ 修改为 $A \rightarrow c$, 会影响 `while` 跳出条件的判定 (`A->To[c] == C_c`), 导致无论什么情况, 都无法将其他节点重定向. 我这个蠢货因为这个从 $10:00$ 调到 $3:00$, 写了全套对拍程序, 找来 std 对拍, 人工精简出锅数据, 手玩出锅数据, 在纸上构造 GSAM. 最后发现程序过程输出的 $To$ 连接诡异, 发现是重定向有问题. 这时才恍然大悟, 无论什么数据, 我的重定向代码不会被执行哪怕一遍, 这样也能得 $35'$, 这题数据是真的水.

- 本题统计答案时, $Ans$ 需开 `long long`, 否则 $75'$

最后放出我找到并简化 (原输出 $300+$) 的卡掉了我 $35'$ 程序的数据, 如果输出 $24$, 说明你也是重定向的问题.

**P6139_0.in**

```
2
fcceded
fce
```

**P6139_0.out**

```
25
```