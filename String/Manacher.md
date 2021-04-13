# Manacher Algorithm

> Gleen K. Manacher (1975), "A new linear-time 'on-line' algorithm for finding the smallest initial palindrome of a string"

一种关于一个字符串 $s$ 的回文子串的算法, 可以线性求两个数组 ${f_1}_i$ 和 ${f_2}_i$, 分别表示以第 $i$ 位为中心的最长奇回文子串和最长偶回文子串的半径 (长度除以 $2$, 向上取整). 对于以 $i$ 为中心的回文子串 $[l, r]$, 规定 $i = \lceil \frac{l + r}{2} \rceil$.

根据回文串的性质可以知道 ${f_1}_i$ 和 ${f_2}_i$ 也恰好是以 $i$ 为中心的回文子串的个数. 这条性质非常重要.

## 朴素

在求字符 $i$ 的 $f_1$ 时, 每次从 ${f_1}_i = 1$ 开始枚举, 只要 $s_{i + {f_1}_i} = s_{i - {f_1}_i}$, 就让 ${f_1}_i$ 增加 $1$.

对于 $f_2$ 同样如此, 只是边界换成 $f_2 = 0$, 自增条件变成 $s_{i + {f_2}_i} = s_{i - {f_2}_i - 1}$.

容易看出, 这样最坏的复杂度可达 $O(n^2)$, 在 $s$ 形如 `aaaa...aaaa` 时可以出现.

## 优化

还是先考虑 $f_1$ 的求法.

由于朴素算法外层循环是从小到大按顺序的, 所以可以认为求 ${f_1}_i$ 时, ${f_1}_j~(j \in [1, i))$ 已经求出来了.

设当前 $j + {f_1}_j - 1$ 最大的 (对应回文子串右边界最大) 的 $j$ 为 $Frontier$, 则对 $i$ 有两种情况:

### $i > Frontier + {f_1}_{Frontier} - 1$

这时的 $i$ 不在任何已知的回文子串中, 则直接朴素求 ${f_1}_i$.

### $i \leq Frontier + {f_1}_{Frontier} - 1$

这时的 $i$ 在以 $Frontier$ 为中心的回文串内, 则必有 $s_{i} = s_{2Frontier - i}$. 内涵是因为 $i$ 在 $Frontier$ 的右边, 又在以 $Frontier$ 为中心的奇回文串内, 则在 $Frontier$ 左边的对应位置也应该有一个同样的字符. 设这个字符位置为 $Reverse = 2Frotier - i$.

因为 $Reverse$ 在 $Frontier$ 左边, 所以 ${f_1}_{Reverse}$ 也一定求出来了, 所以 $[Reverse - {f_1}_{Reverse} + 1, Reverse + {f_1}_{Reverse} - 1]$ 是回文串, 再加上 $[Frontier - {f_1}_{Frontier} + 1, Frontier + {f_1}_{Frontier} - 1]$ 也是回文串, 所以 $[Reverse - {f_1}_{Reverse} + 1, Reverse + {f_1}_{Reverse} - 1]$ 和 $[Frontier - {f_1}_{Frontier} + 1, 2Reverse - Frontier + {f_1}_{Frontier} - 1]$ 皆为回文串. 二者的中心都是 $Reverse$, 设二者的交集为 $[PalindromeL, PalindromeR]$, 则 $[2Frontier - PalindromeR, 2Frontier - PalindromeL]$ 也是回文串.

这时 $[2Frontier - PalindromeR, 2Frontier - PalindromeL]$ 的中心是 $2Frontier - \frac{PalindromeL + PalindromeR}{2} = 2Frontier - Reverse = i$. 

这时, 可以断定 ${f_1}_i \geq Reverse - PalindromeL + 1$.

接下来, 考虑 ${f_1}_i$ 是否能取更大值.

- $Reverse - {f_1}_{Reverse} + 1 < Frontier - {f_1}_{Frontier} + 1$

  这时如果 ${f_1}_i > Reverse - PalindromeL + 1$, 则 $s_{Frontier + {f_1}_{Frontier}} = s_{2i - Frontier - {f_1}_{Frontier}} = s_{3Frontier - 2i + {f_1}_{Frontier}}$. 字符 $3Frontier - 2i + {f_1}_{Frontier}$ 关于 $Reverse$ 的对称字符就是 $Frontier - {f_1}_{Frontier}$, 因为 $Reverse - {f_1}_{Reverse} + 1 < Frontier - {f_1}_{Frontier} + 1$, 所以字符 $Frontier - {f_1}_{Frontier}$ 也和前面提到的三个字符相同. 这样, $s_{Frontier - {f_1}_{Frontier}} = s_{Frontier + {f_1}_{Frontier}}$. 但是 ${f_1}_{Frontier}$ 则说明 $s_{Frontier - {f_1}_{Frontier}} \neq s_{Frontier + {f_1}_{Frontier}}$, 相矛盾, 所以 ${f_1}_{Frontier}$ 不能更大.

- $Reverse - {f_1}_{Reverse} + 1 > Frontier - {f_1}_{Frontier} + 1$

  根据已经求出的 $f_{Reverse}$ 得, $s_{Reverse - {f_1}_{Reverse}} \neq s_{Reverse + {f_1}_{Reverse}}$. 又因为 $Reverse - {f_1}_{Reverse} \geq Frontier - {f_1}_{Frontier} + 1$, 所以对称的 $s_{2Frontier - Reverse + {f_1}_{Reverse}} \neq s_{2Frontier - Reverse - {f_1}_{Reverse}}$, 所以这种情况 ${f_1}_i$ 也不会更大.

- $Reverse - {f_1}_{Reverse} + 1 = Frontier - {f_1}_{Frontier} + 1$

  这时比较特殊, 因为 $s_{Reverse - {f_1}_{Reverse}} \neq s_{Reverse + {f_1}_{Reverse}}$, $s_{Frontier - {f_1}_{Frontier}} \neq s_{Frontier + {f_1}_{Frontier}}$. 所以就算是 $s_{Frontier + {f_1}_{Frontier}} = s_{2i - Frontier - {f_1}_{Frontier}} = s_{Reverse + {f_1}_Reverse}$ 也无所谓, 这不会和任何已经求出的 $f_1$ 值冲突. 所以在 ${f_1}_i = Reverse - PalindromeL + 1$ 的基础上继续朴素即可.

对于求 $f_2$ 的情况, 思路相同, 实现有细节上的差别, 不再赘述.

## 时间复杂度

以 $f_1$ 为例.

在大部分情况下, 每个 $f_1$ 的求出是 $O(1)$ 的, 只要考虑朴素时的复杂度即可.

- 当 $Frontier + {f_1}_{Frontier} - 1 < i$ 时

  一定有 $Frontier + {f_1}_{Frontier} - 1 < i + {f_1}_i - 1$, $Frontier$ 被更新成 $i$, $Frontier + {f_1}_{Frontier}$ 比原先多了至少 ${f_1}_i$, 即本次操作步数.

- 当 $Frontier + {f_1}_
{Frontier} - 1 \leq i$, 但 $Frontier + {f_1}_{Frontier} - 1 = Reverse + {f_1}_{Reverse} - 1$ 时.

  朴素从原来的 ${f_1}_i$ 开始, 这时 $i + {f_1}_i - 1= Frontier + {f_1}_{Frontier} - 1$, 接下来每执行一步, $i + {f_1}_{Frontier}$ 都增加 $1$.

因为每次朴素执行 $k$ 步后, $Frontier + {f_1}_{Frontier}$ 都右移至少 $k$ 位, 而 $Frontier + {f_1}_{Frontier}$ 最大是 $n$, 所以朴素的总复杂度是 $O(n)$.

综上, Manacher 可以在 $O(n)$, 求出长度为 $n$ 的字符串的所有回文子串.

## [模板](https://www.luogu.com.cn/problem/P3805)

一个长度为 $n$ 的字符串, 求最长回文子串长度. ($n \leq 1.1*10^7$)

用 $Manacher$ 求出 $f_1$, $f_2$, 第 $i$ 个字符为中心的最长回文子串即为 $\max(2{f_1}_i - 1, 2{f_2}_i)$, 求 $f_1$, $f_2$ 时顺便统计即可.

**代码**, 缺省源省略

```cpp
unsigned n, Frontier(0), Ans(0), Tmp(0), f1[11000005], f2[11000005];
char a[11000005];
int main() {
	fread(a+1,1,11000000,stdin);        // fread 优化 
  n = strlen(a + 1);                  // 字符串长度 
  a[0] = 'A';
  a[n + 1] = 'B';                     // 哨兵 
  for (register unsigned i(1); i <= n; ++i) {   // 先求 f1 
    if(i + 1 > Frontier + f1[Frontier]) {       // 朴素 
      while (!(a[i - f1[i]] ^ a[i + f1[i]])) {
        ++f1[i];
      }
      Frontier = i;                             // 更新 Frontier 
    }
    else {
      register unsigned Reverse((Frontier << 1) - i), A(Reverse - f1[Reverse]), B(Frontier - f1[Frontier]);
      f1[i] = Reverse - ((A < B) ? B : A);                      // 确定 f1[i] 下界 
      if (!(Reverse - f1[Reverse] ^ Frontier - f1[Frontier])) { // 特殊情况 
        while (!(a[i - f1[i]] ^ a[i + f1[i]])) {
          ++f1[i];
        }
        Frontier = i;                                           // 更新 Frontier 
      }
    }
    Ans = ((Ans < f1[i]) ? f1[i] : Ans);
  }
  Ans = (Ans << 1) - 1;                             // 根据 max(f1) 求长度 
  Frontier = 0;
  for (register unsigned i(1); i <= n; ++i) {
    if(i + 1 > Frontier + f2[Frontier]) {           // 朴素 
      while (!(a[i - f2[i] - 1] ^ a[i + f2[i]])) {
        ++f2[i];
      }
      Frontier = i;                                 // 更新 Frontier 
    }
    else {
      register unsigned Reverse ((Frontier << 1) - i - 1), A(Reverse - f2[Reverse]), B(Frontier - f2[Frontier]);
        f2[i] = Reverse - ((A < B) ? B : A);        // 确定 f2[i] 下界 
      if (A == B) { // 特殊情况, 朴素 
        while (a[i - f2[i] - 1] == a[i + f2[i]]) {
          ++f2[i];
        }
        Frontier = i;                               // 更新 Frontier 
      }
    }
    Tmp = ((Tmp < f2[i]) ? f2[i] : Tmp);
  }
  Tmp <<= 1;                                        // 根据 max(f2) 求长度 
  printf("%u\n", (Ans < Tmp) ? Tmp : Ans);          // 奇偶取其大 
  return Wild_Donkey;
}
```