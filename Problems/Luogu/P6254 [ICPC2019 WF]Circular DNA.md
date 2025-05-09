校内 ICPC 模拟赛考到了此题，考完后发现考场代码喜提本体最优解 （虽然本来就没几个提交）。这道题很多人都是用 `<set>` 设计的 $O(nlogn)$ 的算法，这里就介绍**一个 $O(n)$ 的算法**。

## 题目分析

这个题面不是很好懂，校内赛中因为不明确 $s$，$e$ 后面数字的意思耽误了很长时间。字母后面跟的这个数字是基因的编号，编号相同的基因是同种基因，可以认为每种基因都是独立的，$s1$，$e1$ 之间就算有再多其它种类的基因也不影响 $s1$ 和 $e1$ 的匹配。

注意断开的位置 $p$ 的意思是在第 $p$ 个基因前面切割。

顺着当时做这道题的思路，我们来循序渐进地做这道题。

## 真核生物

众所周知，原核生物的 DNA 是环状的，但是显然环状 DNA 比真核生物的链状 DNA 复杂，所以先考虑链状 DNA 的完美匹配种数。

将 $s$ 看出上括号，权值为 $1$，$e$ 看成下括号，权值为 $-1$，这就是一个括号匹配问题。将同种基因求权值的前缀和。由于每个编号的基因互不影响，所以不同编号基因的前缀和分别记录。

对于权值总和不等于 $0$ 的编号，无论怎么切都切不出完美匹配的情况。对于总和等于 $0$ 的编号，至少有一种切法可以使它完美匹配。

一个编号的基因是完美匹配的条件有两个，一个是总和等于零，另一个是任何时候前缀和大于等于 $0$，只要维护这个编号的前缀和的最小值即可。

所以对于真核生物，只要扫一遍 DNA 链，过程中统计权值总和和前缀和最小值，最后枚举所有编号，统计满足上面两个条件的编号数量即可。时间复杂度 $O(n)$。

## $O(n^2)$

在考场上，有时需要先打复杂度高的算法然后再尝试优化，既减少了思考更优算法的难度，也能给这个题的得分兜底（当然 ACM 没有部分分）。

对于环形问题一般解法是断环为链，将环断成链后复制一份接在原来的链后面。

具体操作是在外层循环枚举断点，对于每个断点 $i$，都有 $[i, i + n - 1]$ 是以 $i$ 为断点切开的 DNA 链。每个断点跑一遍链式 DNA 的算法即可，复杂度 $O(n^2)$。

## 递推

先跑一遍真核生物的算法，考虑如何递推地求出每个断点的情况。

考虑断点向右移动，会有哪些影响？

显然是 DNA 左端基因接到右端去。假设这个基因编号是 $x$，则容易知道这次断点的移动只影响 $x$ 这一种编号的基因，因为其他编号的基因的相对位置不变。

前面已经说明，如果 $x$ 编号的所有基因权值总和不是 $0$，无论断点如何，永远不会完美匹配，所以只要这时左端基因的权值总和不是 $0$，直接跳到下一个断点即可。

规定编号 $x$ 的基因的权值总和为 $Sum_x$，本断点（端点不同前缀和最小值不同）的前缀和最小值为 $Low_x$，当前完美匹配数量为 $Tmp$。

如果 $Sum_x = 0$，那么这个编号的基因有可能是完美匹配（第一个条件符合）。一个基因的位置移动不影响这个编号的基因的权值总和。所以只要看移动这个基因后对 $Low_x$ 的影响如何即可。

对左端的基因分类讨论。

- 这个基因是 $sx$

  这是一个左括号，它在左端时给所有前缀和提供了一个加数 $1$，所以去掉它后，所有位置上，编号 $x$ 的基因权值前缀和都减少 $1$，$Low_x$ 也必然减少 $1$。

  因为 $Sum_x = 0$，所以前缀和最小值最大情况是 $0$，所以移动后的第 $x$ 种基因的前缀和最小值一定小于等于 $-1$，不可能完美匹配。

  修改 $Low_x$ 之前，对于原本 $Low_x = 0$ 的情况，失去了一个完美匹配，所以这一轮的最多匹配数量是 $Tmp - 1$。

- 这个基因是 $ex$

  这是一个右括号，它在左端时给所有前缀和提供了一个加数 $-1$，所以去掉它后，所有位置上，编号 $x$ 的基因权值前缀和都增加 $1$，$Low_x$ 也必然增加 $1$。

  给 $Low_x$ 加 $1$ 后，就有可能出现 $Low_x = 0$ 的情况，这时出现一个新的完美匹配 $x$（在此之前 $Low_x = -1$，不是完美匹配），及时更新 $Tmp$ 为 $Tmp + 1$。

枚举断点同时统计 $Tmp$，并且对于每个断点，尝试更新所有断点中最优的匹配数量 $Ans$ 和断点 $Pos$。因为在 $Tmp$ 相同时，优先输出小的断点，所以只有 $Tmp > Ans$ 时更新两个变量，最后直接输出 $Pos$ 和 $Ans$ 即可。

因为只是简单地扫上常数次序列，所以显然时间复杂度是 $O(n)$。

## 注意

- 在 $sx$ 情况，先判断 $Low_x = 0$，再修改 $Low_x$；在 $ex$ 的情况，先更新 $Low_x$，再判断 $Low_x = 0$。

- 枚举断点时只考虑左端点，所以这种算法不用复制一遍原序列接在后面，直接在原序列中找左端点即可。

- 代码中为了方便设计程序，枚举的断点 $i$ 的意义和 $p$ 不同。$i$ 的意义是在第 $i$ 个基因后面断，$p$ 的意义是在第 $p$ 个基因前面断。

## 代码

一些细节都在代码注释中，应该会很好懂吧。

```cpp
<<<<<<< HEAD
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
=======
#include <cstdio>
#include <iostream>
#define Wild_Donkey 0
using namespace std;
>>>>>>> 2b6fff84012c826acf358403a84aa5f3a253e8ca
unsigned n, Cnt(0), Ans(0), Tmp(0), List[1000005], Pos(0);
char Character;
int Sum[1000005], Low[1000005];
struct DNA {
  unsigned Number;  // 编号 
  int SE;           // s or e, 即权值 
}a[1000005];
int main() {
<<<<<<< HEAD
  n = RD();
=======
  scanf("%u", &n);
>>>>>>> 2b6fff84012c826acf358403a84aa5f3a253e8ca
  for (register unsigned i(1); i <= n; ++i) { // 读入 
    Character = getchar();
    while (Character != 's' && Character != 'e') {
      Character = getchar();
    }
    if(Character == 's') {                    // 上括号 
      a[i].SE = 1;
    }
    else {                                    // 下括号 
      a[i].SE = -1;
    }
<<<<<<< HEAD
    a[i].Number = RD();
=======
    scanf("%u", &a[i].Number);
>>>>>>> 2b6fff84012c826acf358403a84aa5f3a253e8ca
    if(!Low[a[i].Number]) {                   // 这个编号的基因首次出现
      Low[a[i].Number] = 1;                   // 打标记表示这个编号的基因出现过 
      List[++Cnt] = a[i].Number;              // 记录在基因列表中 
    }
  }
  Pos = 1;
  for (register unsigned i(1); i <= n; ++i) {
    Sum[a[i].Number] += a[i].SE;              // 累计总和 
    Low[a[i].Number] = min(Low[a[i].Number], Sum[a[i].Number]); // 更新前缀和历史最小值 
  }
  for (register unsigned i(1); i <= Cnt; ++i) {// 真核生物  (枚举基因编号)
    if(Low[List[i]] == 0 && Sum[List[i]] == 0) {// 同时满足两个条件 
      ++Tmp;
    }
  }
  Pos = 1, Ans = Tmp;                         // 对于真核生物的运行结果
  for (register unsigned i(1); i < n; ++i) {  // 枚举断点, 这里是从 i 后面切断, 所以原左端基因是 a[i] 
    if(!(Sum[a[i].Number] ^ 0)) {             // 优化常数, 等价于 if(Sum[a[i].Number] == 0) 
      if(a[i].SE ^ (-1)) {                    // 优化同上, 这是 sx 的情况 
        if(!(Low[a[i].Number] ^ 0)) {         // 原本完美, 修改后不完美了 
          --Tmp;
        }
        --Low[a[i].Number];                   // 最后修改 Low[x] 
      }
      else {                                  // 这是 ex 的情况 
        ++Low[a[i].Number];                   // 先修改 Low[x] 
        if(!(Low[a[i].Number] ^ 0)) {         // 原本不是完美匹配, 但是现在完美了 
          ++Tmp;
        }
      }
    }
    if(Tmp > Ans) {                           // 新断点严格优于原先才更新 
      Pos = i + 1;
      Ans = Tmp;
    }
  }
  printf("%u %u", Pos, Ans);
  return Wild_Donkey;
}
```

## 鸣谢 & 后记

感谢 [@巴菲特](https://www.luogu.com.cn/user/171851) 踩了我的考场代码，但是幸好我用一发新的提交守住了最优解（当然这种题的最优解没什么用，是个人随便卡卡常就能比我快）。算法竞赛中人们以 A 题为目的，很少有人有能快则快能省则省的工程精神。但是追求完美的精神却让我受益匪浅，希望 OI 能给每个人留下受益终身的财富而不仅是名校的垫脚石。