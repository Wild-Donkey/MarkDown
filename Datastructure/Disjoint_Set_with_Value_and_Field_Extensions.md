# 边带权与扩展域

## 边带权

并查集可以维护物品的集合关系, 只要给并查集的边加上权值, 就能维护某些别的东西.

通过查询一个点到它所在的集合的根的路径的权值总和, 就能得到元素在集合中的相对权值, 合并时, 通过两个集合根之间的边权, 维护两个集合的所有元素的相对权值.

## 经典题: [NOI2001 食物链](https://www.luogu.com.cn/problem/P2024)

维护三种生物中的 $n$ 个个体的关系, 三种生物的食物链呈环状, $A-B-C-A-...$, 也就是石头剪刀布的规则. 有两种断言: "$x$, $y$ 是同类" 和 "$x$ 吃 $y$".

一句断言如果和前面正确的断言和题目规模不冲突, 则这句断言是正确的, 否则是错误的. 输入 $m$ 个断言, 输出错误断言数量.

每个个体在确定了食物关系后, 合并成一个集合, 保证它的相对权值比它的天敌大 $1$. 根据三种生物的关系, 我们知道, 如果 $a$ 是 $b$ 的天敌, $b$ 是 $c$ 的天敌, 则 $c$ 是 $a$ 的天敌, 这里, $a$, $b$, $c$ 的权值分别是 $0$, $1$, $2$, $c$ 的权值加 $1$ 后对 $3$ 取模是 $a$ 的权值.

所以判断一个集合中两个个体的食物关系的方法就是, 求这两个元素的相对权值, 做差后对 $3$ 取模, 如果 $a - b \equiv 0 (\operatorname{mod} 3)$, 则 $a$ 是 $b$ 的同类; 如果 $a - b \equiv 1 (\operatorname{mod} 3)$, 则 $a$ 是 $b$ 的食物; 如果 $a - b \equiv 2 (\operatorname{mod} 3)$, 则 $a$ 是 $b$ 的天敌.

我们在路径压缩的过程中计算相对权值然后对 $3$ 取模, 保证每条边的权值都小于 $3$, 就像这样:

```cpp
inline pair<unsigned, unsigned> Find (unsigned x) {
  register unsigned now(x), Val(0);
  while (Fa[now].first ^ now) { // 跳到根 
    Val += Fa[now].second;      // 统计权值和 
    now = Fa[now].first; 
  }
  return Fa[x] = make_pair(now, (Val %= 3));// 取模 
}
```

接下来是主体代码:

```cpp
int main() {
  n = RD(), m = RD();
  for (register unsigned i(1); i <= n; ++i) { // 初始化 
    Fa[i] = make_pair(i, 0);
  }
  for (register unsigned i(1); i <= m; ++i) {
    if(RD() & 1) { // A equals to B
      A = RD(), B = RD();
      if(A > n || B > n) {  // 超出范围的输入 
        ++Ans;
        continue;
      }
      if(A == B) {          // 我和我自己同类 
        continue;
      }
      C = Find(A), D = Find(B);
      if (C.first ^ D.first) {  // 没有食物关系, 建立关系 
        if (C.second < D.second) {
          Fa[C.first] = make_pair(D.first, (D.second - C.second) % 3);
        } else {
          Fa[D.first] = make_pair(C.first, (C.second - D.second) % 3);
        }
        continue;
      }
      Ans += C.second != D.second;// 食物关系错误
    } else {       // A eat B
      A = RD(), B = RD();
      if(A == B || A > n || B > n) {  // 我吃我自己或超出范围 
        ++Ans;
        continue;
      }
      C = Find(A), D = Find(B);
      if (C.first ^ D.first) {        // 无关系, 建立关系 
        if (C.second + 1 < D.second) {
          Fa[C.first] = make_pair(D.first, (D.second - C.second - 1) % 3);
        } else {
          Fa[D.first] = make_pair(C.first, (C.second - D.second + 1) % 3);
        }
        continue;
      }
      Ans += (C.second + 1) % 3 != D.second;  // 关系错乱 
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```
## 扩展域

顾名思义, 扩展域就是增加空间, 对于每个元素维护多个关系. 这个思想类似于图论里的拆点, 将一个点拆成多个, 分别维护查询关系.

## 一题多解

仍然是食物链, 这题也能用扩展域 (貌似是更热门的解法).

每个个体拆成三个点, 第一个点和它的同类的第一个点合并到一个集合中; 第二个点和它的天敌的  第一个点分到一个集合中; 第三个点和它的食物的第一个点分到一个集合中.

每次查询时, 先查 $a$, $b$ 所属的类, 如果相同, 说明 $a$, $b$ 同类; 如果不同, 查询 $a$ 的天敌和食物所在的集合, 哪个和 $b$ 在一个集合, $b$ 就和 $a$ 是什么关系. 如果 $b$ 的三个点和 $a$ 的第一个点都不在一个集合中, 说明它们还没有建立关系.

避坑: 在我写第一遍的时候, 在给两个个体建立联系的时候, 只合并了它们三对点中的一对点, 但是这样另外两对点的关系就不是正确的了, 所以应该一次将三个点的关系都维护正确.

更普通的 `Find()` 函数:

```cpp
inline unsigned Find (unsigned x) {
  register unsigned now(x);
  while (Fa[now] ^ now) now = Fa[now];
  return Fa[x] = now; // 路径压缩 
}
```

然后是个人认为比较阴间主体代码 (自己都觉得阴间, 于是加了注释):

```cpp
int main() {
  n = RD(), m = RD();
  t = n * 3 + 3;  // 总点数 
  for (register unsigned i(1); i <= t; ++i) { // 初始化 
    Fa[i] = i;
  }
  for (register unsigned i(1); i <= m; ++i) {
    if(RD() & 1) {
      A = RD(), B = RD();
      if(A > n || B > n) {
        ++Ans;
        continue;
      }
      if(A == B) {
        continue;
      }
      C = Find(A * 3);
      if (C == Find((B * 3) + 1) || C == Find((B * 3) + 2)) { // A eat B or B eat A 关系错乱 
        ++Ans;
        continue;
      }
      if (C ^ Find(B * 3)) {  // 建立关系 
        Fa[C] = Fa[B * 3];                      // 我的同类的同类是我自己, 将 A 的第一个点和 B 的第一个点合并
        Fa[Find((A * 3) + 1)] = Fa[(B * 3) + 1];// 我的同类的天敌是我的天敌, 将 A 的第二个点和 B 的第二个点合并 
        Fa[Find((A * 3) + 2)] = Fa[(B * 3) + 2];// 我的同类的食物是我的食物, 将 A 的第三个点和 B 的第三个点合并 
      }
    } else {
      A = RD(), B = RD();
      if(A == B || A > n || B > n) {  // 我吃我自己或超出范围
        ++Ans;
        continue;
      }
      C = Find(A * 3);
      if (C == Find(B * 3) || C == Find((B * 3) + 2)) { // A 是 B 的同类或食物, 关系错乱 
        ++Ans;
        continue;
      }
      if (C ^ Find((B * 3) + 1)) {  // 建立关系 
        Fa[C] = Fa[(B * 3) + 1];                // 我的食物的天敌是我自己, 将 A 的第一个点和 B 的第二个点合并
        Fa[Find((A * 3) + 2)] = Fa[B * 3];      // 我的食物的同类是我的食物, 将 A 的第三个点和 B 的第一个点合并
        Fa[Find((A * 3) + 1)] = Fa[(B * 3) + 2];// 我的食物的食物是我的天敌, 将 A 的第二个点和 B 的第三个点合并
      }
    }
  }
  printf("%u\n", Ans);
  return Wild_Donkey;
}
```
