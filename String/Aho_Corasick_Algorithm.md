# AC自动机 (Aho_Corasick_Algorithm)

线性地求 $n$ 个模式串分别在特定的一个字符串中的出现次数

## 字典树(Trie)

Trie 是一棵存储模式串的树, 它的一个节点代表着字符串的一个字符, 每个字符所在的节点指向下一个字符所在的节点, 拥有相同前缀的字符串, 其相同的前缀共用相同的节点

举个例子, 这里是一些字符串

```
beta
alpha
haha
delta
dede
tata
```

下图就是一棵根据这些字符串建立的 Trie

![看到这个说明图片炸了](https://cdn.luogu.com.cn/upload/image_hosting/dze2q1py.png)

## KMP 算法

通过对单个模式串预处理, 在线性时间内在另一个字符串上查找模式串出现的所有位置

有关 KMP 算法的更多内容 [看这里](https://www.luogu.com.cn/blog/Wild-Donkey/kmp-suan-fa-knuthmorrispratt-algorithm)

## AC 自动机

其实 AC 自动机就是在 Trie 上连边, 相当于每个节点存一个 KMP 的失配指针 $Fail$, 即这个字符后面失去同步~~刺客震怒~~, 跳回对应节点继续匹配

节点 $x$ 的指针 $Fail$ 连接的节点必须满足以它为结尾的前缀, 和以 $x$ 结尾的前缀相匹配. 当然,以 $Fail$ 为结尾的前缀的长度一定小于以 $x$ 结尾的前缀, 所以只要以 $x$ 结尾的前缀的相同长度的后缀和以 $Fail$ 为结尾的前缀匹配即可连边.

举个例子, 有两个字符串存在 Trie 里, 给每个节点编号

```
alpha
12345
haha
6789
```

这时 $Fail$ 指针连接情况是, `7->1` `4->6`, `5->7`, `8->6`, `9->7`, 其余节点 $Fail$ 全连向根

连接所有 $Fail$ 的方法是在建好的 Tire 上 BFS, 每到一个节点 $x$, 找到父亲节点, 由于是 BFS, 所以父亲的 $Fail$ 已经求出, 所以找到父亲 $Fail$ 指向的节点, 看看是否有儿子代表的字符和 $x$ 代表的相同. 如果有, $x$ 的 $Fail$ 指向这个节点的对应儿子; 如果没有, 再去看这个节点 $Fail$ 指向的节点, 直到找到一个有对应儿子的节点, 连接指针, 如果最后找不到了, 则连向根.

接下来是前面那颗 Trie 连接 $Fail$ 指针后的样子 (极度混乱)

![看到这个说明图片炸了](https://cdn.luogu.com.cn/upload/image_hosting/kewpkgfd.png)

连接 $Fail$ 指针的 Trie 就是 AC 自动机. 因为利用 AC 自动机, 就可以在 Trie 上跑 KMP, 不计预处理的时间, 即可在线性时间内查找整个字符串, 在搜索引擎中应用广泛.

## 复杂度分析

* 建 Trie

对每个模式串线性扫描, 没有分支, 所以复杂度是 $\displaystyle\sum_{i}^{n}Len_i$

* 建自动机

BFS 时每个节点入队一次, 根无需入队, 最坏情况下有 $\displaystyle\sum_{i}^{n}Len_i$ 个节点入队.

每次出队时要顺着父亲的 $Fail$ 链往上跳, 最坏情况是跳 $Deep$ 次 (即它的深度), 然后将 $Fail$ 连向根. 但是跳 $Deep$ 次之后, 它的儿子则只需跳一次. 而一个长 $Deep$ 的 $Fail$ 链, 也是由 $Deep$ 个节点, 每个节点往上跳一次造成的结果. 也就是说, 跳 $Fail$ 的操作均摊 $O(1)$, 连边复杂度和建 Trie 相同

* 扫描

扫描长度为 $Len$ 的字符串, 每个字符最多被成功匹配一次, 复杂度取决于失败次数, 之前说明过, 跳 $Fail$ 复杂度均摊 $O(1)$, 所以扫描复杂度 $O(Len)$

## 例题 [Luogu5357](https://www.luogu.com.cn/problem/P5357)

$n$ 个模式串 $a_i$, 一个文本串 $S$, 求每个模式串在文本串中出现的次数

$n \leq 2*10^5$, $Len_S \leq 2*10^6$, $\displaystyle\sum_{i}^{n}Len_{a_i} \leq 2*10^5$

### 实现

由于是模板题, 必然会要求先建立自动机, 扫一遍字符串, 将出现的模式串都记录下来, 并且为了能正确输出并且处理相同模式串, 建立一个指针数组, 存储每个模式串尾字符所在的节点指针.

建 Trie

```cpp
for (register unsigned i(1); i <= n; ++i) {
  while (inch < 'a' || inch > 'z') {//跳过无关字符 
    inch = getchar();
  }
  now = N;  // 从根开始 
  while (inch >= 'a' && inch <= 'z') {
    inch -= 'a';            // 字符转化为下标 
    if(!(now->Son[inch])) { // 新节点 
      now->Son[inch] = ++Cntn;
      Cntn->Ch = inch;
      Cntn->Fa = now;
    }
    now = now->Son[inch]; // 往下走 
    inch = getchar();
  }
  if (!(now->Exist)) { //新串 (原来不存在以这个点结尾的模式串)
    now->Exist = 1;
  }
  Ans[i] = now; // 记录第 i 个串尾所在节点 
}
```

由于需要 DFS, 所以在连 $Fail$ 指针时要连接反向边, 原因接下来会解释. 由于每个点出度为 $1$, 入度不定, 所以正向边直接连指针, 反向边则需要边表.

连边建 AC 自动机

```cpp
for (register short i(0); i < 26; ++i) {  // 对第一层的特殊节点进行边界处理 
  if(N->Son[i]) {           // 根的儿子 
    Q[++R] = N->Son[i];     // 入队 
    N->Son[i]->Fail = N;    // Fail 往上连, 所以只能连向根
    (++Cnte)->Nxt = N->Fst; // 反向边, 用边表存 
    N->Fst = Cnte;
    Cnte->To = N->Son[i];
  }
}
while (L < R) { // BFS 连边, 建自动机 
  now = Q[++L]; // 取队首并弹出
  for (register short i(0); i < 26; ++i) {
    if(now->Son[i]) {
      Q[++R] = now->Son[i];
    }
  }
  if(!(now->Fa)) {
    continue;
  }
  Find = now->Fa->Fail; // 从父亲的 Fail 开始往上跳, 直到找到 
  while (Find) {
    if(Find->Son[now->Ch]) {                    // 找到了 (边界)
      now->Fail = Find->Son[now->Ch];           // 正向边 (往上连)
      (++Cnte)->Nxt = Find->Son[now->Ch]->Fst;  // 反向边 (往下连) 
      Find->Son[now->Ch]->Fst = Cnte;
      Cnte->To = now;
      break;
    }
    Find = Find->Fail;  // 继续往前跳 
  }
  if(!(now->Fail)) {
    now->Fail = N;  // 所有找不到对应 Fail 的节点, Fail 均指向根 
    (++Cnte)->Nxt = N->Fst;
    N->Fst = Cnte;
    Cnte->To = now;
  }
}
```

接下来便是用自动机扫描字符串, 记录每个匹配成功的节点被扫描到的次数.

值得一提的是, 由于某些模式串是其它模式串的字串, 如 `abcd` 和 `bcd`, 它们有些不具有公共节点, 这就导致了在扫描到 `abcd` 时, `bcd` 的任何节点都没有被扫描到, 所以这时统计的扫描次数并不是最终答案.

自动机扫描过程

```cpp
while (inch < 'a' || inch > 'z') {
  inch = getchar();
}
now = N;
while (inch >= 'a' && inch <= 'z') {  // 自动机扫一遍 
  inch -= 'a';
  if(!now) {  // 如果完全失配了, 则从根开始新的匹配, 否则接着前面已经匹配成功的节点继续匹配 
    now = N;
  }
  while(now) {              // 完全失配, 跳出 
    if(now->Son[inch]) {    // 匹配成功, 同样跳出 
      now = now->Son[inch]; // 自动机对应节点和字符串同步往下走 
      ++(now->Times);       // 记录节点扫描次数 
      break;
    }
    now = now->Fail;        // 跳 Fail 
  }
  inch = getchar();
}
```

这时已经记录了每个节点的扫描次数, 接下来, 考虑如何统计被别的模式串包含的模式串的出现次数.

只要模式串 $x$ 包含于 $y$, 则有两种情况:

* $x$ 是 $y$ 的前缀

$x$ 在 Trie 中的所有节点都和 $y$ 共用, AC 自动机扫描过程中, 只要 $y$ 被扫描, 必然先扫描 $x$, 所以这种情况下 $x$ 出现的次数已经被计算过了

* $x$ 不是 $y$ 的前缀

这时扫描 $y$ 不会扫描到 $x$ 的所有节点, 也就不会扫描到 $x$ 的尾字符对应的节点. 根据 $Fail$ 的定义和求 $Fail$ 的原则, $x$ 的尾字符对应的节点一定在 $y$ 的尾字符对应节点的 $Fail$ 链上

如果把 $Fail$ 看作无向边, 则自动机的所有节点和它的 $Fail$ 组成了一棵以 Trie 的根为根的树, 姑且称之为 `Fail-Tree` $_{_{起名鬼才}}$

举 `abcde` 和 `bcd` 的例子, 首先, 它们没有公共节点, 所以给它们的字符对应的节点编号.

```
abcde bcd
12345 678
```

易知它们组成的自动机中, 除了连向根的 $Fail$ 的连接是这样的

`2->6 3->7 4->8`

如果把一个节点表示的字符串当作是以它结尾的模式串前缀 (从 Trie 根到这个点的字符组成的字符串), 则一个节点表示字符串是它 `Fail_Tree` 上的子树上的节点表示的字符串的前缀 ($Fail$ 的定义), 所以只要它的子树上任意节点被扫描过 (该节点对应的字符串出现过), 它也一定被扫描过 (它对应的字符串出现过)

猜想: 字符串 $x$ 的出现次数是 $x$ 尾字符的节点在 `Fail-Tree` 上的子树上的所有节点扫描次数之和

对于 $x$ 在 `Fail-Tree` 的子树上的节点 $y$, 有两种情况

* $x$ 代表的字符串是 $y$ 代表的字符串的前缀和后缀

这时 $x$ 在 Trie 上也是 $y$ 的祖先, 所以在扫描整个 $y$ 的时候, $x$ 的尾字符对应的节点只被统计了 $1$ 次, 而 $x$ 实际出现了至少 $2$ 次. 根据分析的 `Fail-Tree` 的性质可得, $x$ 在 $y$ 中其它的出现位置的尾字符对应的节点, 在 `Fail-Tree` 上一定也以 $x$ 为祖先, 并且和 $x$ 在 $y$ 上的出现位置一一对应, 所以对于这种情况, 统计子树节点的扫描次数不重不漏

* $x$ 和 $y$ 尾字符对应的节点在 Trie 上没有直系亲缘关系

这时 $y$ 的扫描丝毫不会更新 $x$ 尾字符对应节点的扫描次数, 所以统计子树扫描次数不会重复. 对于不遗漏的证明和上一种情况相同

至此, 用自动机对字符串进行扫描后, 程序只要一次 DFS, 遍历整个自动机, 即可统计答案.

`DFS` 函数

```cpp
unsigned DFS(Node *x) {
  Edge *Sid(x->Fst);  // 枚举当前节点所有出边 
  x->Size = x->Times; // 自己的扫描次数也要统计 
  now = x;
  while (Sid) {
    now = Sid->To;
    x->Size += DFS(now);  // 统计子节点的子树值 
    Sid = Sid->Nxt;
  }
  return x->Size;     // 返回自己的子树值 
}
```

`main` 末尾部分

```cpp
DFS(N); // 统计互相包含的模式串 
for (register unsigned i(1); i <= n; ++i) {
  printf("%u\n", Ans[i]->Size); // 根据之前记录的第 i 个模式串尾字符对应的节点的指针找到需要的答案 
}
```

## 小结

自动机之所以叫自动机, 正时因为它在预处理后按照设定好的 $Fail$ 在一个字符串上扫描, 正如 DNA 复制过程中的复制泡. 在分析一个算法时, 原理是否巧妙也是一个重要标准, AC 自动机的原理类似于 KMP 算法, 却比 KMP 算法功能更强, 也更美丽 (当然, KMP 本来就比那些带 $log$ 的无脑二分要漂亮得多), 确实是一个伟大的算法.