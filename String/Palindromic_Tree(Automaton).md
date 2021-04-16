# 回文树/自动机 (Palindromic Tree/Automaton)

回文树, 又称回文自动机 (PAM), 用来解决字符串的回文子串问题.

推荐先学 [后缀自动机](https://www.luogu.com.cn/blog/Wild-Donkey/hou-zhui-zi-dong-ji-suffix-automaton), [AC 自动机](https://www.luogu.com.cn/blog/Wild-Donkey/ac-zi-dong-ji-ahocorasickalgorithm), 三者会有很多相似之处, 学起来会更加愉快. 而 [Manacher](https://www.luogu.com.cn/blog/Wild-Donkey/manacher-algorithm) 的内容一点也没有用到, 无需为了学 PAM 特意学习.

## 定义

形态上是两棵树 + $Link$.

每个节点表示一个本质不同的回文子串. 该串长度即为该节点长度.

树边带权, 是自动机的转移边. 权值为一个字符 $c$, 表示起点两端同时加 $c$ 得到的新串存在并且作为另一个回文子串.

因为奇数长度的节点只能转移到奇数长度的节点, 所以存在两个根, 分别作为奇树和偶树的根.

$Link$ 边向长度小的节点转移, 表示该点最大的回文后缀. $Link$ 可以在两树之间连接.

建立一个数组 $Order$, 其中 $Order_i$ 表示原字符串中以第 $i$ 个字符为结尾的最长的回文子串的节点位置. 由于 $Order_i$ 的 $Link$ 是 $Order_i$ 的最长回文后缀. 所以通过 $Order$ 所在的 $Link$ 链可以访问以任意字符为结尾的的回文后缀.

## 构造

一开始是空串, 只有两个根, 偶根 $Link$ 连奇根. 考虑将一个字符 $c$ 加入到已经构建回文自动机的 $s$ 的后面会在哪里出现回文串. 

如果原来 $s$ 的后缀是回文串, 从 $Order_{len_s}$ 往 $Link$ 链上跳. 如果 $s$ 有回文后缀为 $[a, b]$, 满足 $s{b + 1} = s_{a - 1} = c$, 则出现回文串 $[a - 1, b + 1]$, 新建这个节点, 连接转移 $c$, 将 $Order_{len_s + 1}$ 指向 $[a - 1, b + 1]$ 所在节点.

这时就有人要问了, 如果有多个节点需要新建呢? 但是再审视一下回文后缀的性质, 每次新建的点真的不止一个吗?

如果 $s + c$ 的最长回文后缀是 $[a - 1, b + 1]$, 仍存在一个比 $b - a + 1$ 短的回文后缀 $[c, b + 1]$. 因为 $[a - 1, b + 1]$ 是回文串, 所以 $[a - 1, a - 1 + b - c]$ 也是一个和 $[c, b + 1]$ 本质相同的回文串. 所以不存在第二个新回文子串. 也就是说, 每个字符 $c$ 的加入最多带来一个新节点.

接下来考虑 $Link$ 的连接, 设节点 $A$ 在 $Order_{len_s}$ 的 $Link$ 上, 则 $A$ 是 $Order_{len_s}$ 的后缀. 只要 $len_A + 1 \leq len_{Order_{len_s + 1}}$, 那么 $A + c$ 就是 $Order_{len_s}$ 的后缀.

只要判断 $c + A + c$ 是否是 $Order_{len_s}$ 的后缀即可 (当然 $A$ 要有转移 $c$, 否则根本不存在 $c + A + c$ 对应的节点). 在跳 $Link$ 的时候, 判断 $A \rightarrow c$ ($A$ 的转移 $c$ 指向的节点) 的左端字符 $c$ 是否和 $Order_{len_s + 1}$ 对应位置的字符对应 (即判断是否有 $s_{len_s - len_A} = c$ 成立). 如果到最后没有找到合法的 $Link$, 连向偶根.

以此类推, 将每个字符都插入后, 便构造了一个回文自动机.

下面对复杂度进行证明, 同样是将字符集规模看作常数.

## 空间复杂度

因为一个节点只有一个树上入边, 一个 $Link$ 出边. 空间复杂度取决于节点数, 每个节点和一个本质不同的回文子串一一对应, 只要分析本质不同的回文子串数量即可. 因为一共有 $n$ 个字符, 之前已经说明, 每个字符的加入最多新出现一个本质不同的回文串, 所以最多有 $n$ 个本质不同的回文串. 空间复杂度为 $O(n)$

## 时间复杂度

除了跳 $Order_{len_s}$ 的 $Link$ 链, 其它部分都是显然的线性复杂度, 所以着重分析跳 $Link$ 的复杂度.

在 $Order_{len_s}$ 的 $Link$ 链上的满足以上条件的节点, 可能是 $Order_{len_s}$. 这样一来, $Order_{len_s + 1}$ 的 $Link$ 只要连向 $Order_{len_s + 1}$, 就能使 $Order_{len_s + 1}$ 的 $Link$ 链长比 $Order_{len_s}$ 的 $Link$ 链长大 $1$.

每次跳 $Link$, $Order_{len_s}$ 的 $Link$ 链长度都会减少 $1$. 而每次最多在一个 $Link$ 不跳的情况下使 $Link$ 链比上一个 $Link$ 链长 $1$. 所以总的跳 $Link$ 的总次数是线性的.

所以总复杂度是 $O(n)$

## [模板](https://www.luogu.com.cn/problem/P5496)

求一个长度为 $n$ 的字符串的每一个前缀的回文后缀数量. ($n \leq 5 * 10^5$)

前缀 $[1, i]$ 的回文后缀数也就是 $Order_i$ 所在的 $Link$ 链去掉两根的长度. 建立 PAM, 记忆化搜索统计长度即可.

**代码**

缺省源省略, `fread()` 需要 `<cstdio>`

```cpp
unsigned m, n, Cnt(0), Ans(0), Tmp(0), Key;
bool flg(0);
char a[500005];
struct Node {
  Node *Link, *To[26];
  int Len;
  unsigned int LinkLength; 
}N[500005], *Order[500005], *CntN(N + 1), *Now(N), *Last(N);
int main() {
  fread(a + 1, 1, 500003, stdin);
  n = strlen(a + 1);
  N[0].Len = -1;
  N[1].Link = N;
  N[1].Len = 0;
  Order[0] = N + 1;
  for (register unsigned i(1); i <= n; ++i) {
    if(a[i] < 'a' || a[i] > 'z') {
      continue;
    }
    Now = Last = Order[i - 1];
    a[i] -= 'a';
    a[i] = ((unsigned)a[i] + Key) % 26;
    while (Now) {
      if(Now->Len + 1 < i) {
        if(a[i - Now->Len - 1] == a[i]) { // 符合左端字符对应位置是 c 
          if(Now->To[a[i]]) {             // 有转移 c, 不新建节点, 只记录 Order 
            Order[i] = Now->To[a[i]];
            flg = 1;                      // 标记表示本轮没有节点被新建 
          }
          else {
            Now->To[a[i]] = ++CntN;       // 转移 
            CntN->Len = Now->Len + 2;     // 长度 +2 (左右两端加 c) 
            Order[i] = CntN;              // 记录 Order 
          }
          break; 
        }
      }
      Last = Now;                         // 记录上一个节点, 优化下一次跳 Link 链的次数 (下一次跳是找 Order_i 的 Link) 
      Now = Now->Link;                    // 跳 Link 
    }
    if(!flg) {                                    // 有新节点, 连接这个点的 Link 
      Now = Last;
      while (Now) {
        if(Now->To[a[i]]) {                       // 有转移 c 
          if(Now->To[a[i]]->Len < Order[i]->Len) {// 长度合法 
            if(a[i - Now->Len - 1] == a[i]) {     // 该节点左端包含于 Order_i->Link 的后缀 
              Order[i]->Link = Now->To[a[i]];
              Order[i]->LinkLength = Now->To[a[i]]->LinkLength + 1;
              break;                              // 找到 Link 
            }
          }
        }
        Now = Now->Link;                          // 跳 Link 
      }
      if(!Now) {    // 无合适的 Link, 连向偶根 
        Order[i]->Link = N + 1;
        Order[i]->LinkLength = 1;
      }
    }
    else {          // 有标记说明无新节点, 清空标记 
      flg = 0;
    }
    Key = Order[i]->LinkLength;
    printf("%d ", Key);
  }
  return Wild_Donkey;
}
```
