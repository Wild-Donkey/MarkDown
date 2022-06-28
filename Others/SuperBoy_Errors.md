# 超级男孩错误 ()

## 并查集: 生命的奇迹

- 错误示范

这个地方使用了错误的按秩合并, 但是丝毫没有用, 而且这里将一个节点的父亲指针连接到了另一个节点的父亲指针上. 这样会使得它的父亲和兄弟不能正确合并而出问题.

```cpp
void Union(ri u, ri v){
	ui fu=find(u), fv=find(v);
	if(fu < fv) fa[v]=fu;
	else fa[u] = fv; 
	return;
}
```

这份代码一度得到了正确的样例答案, 但是当我们发现这个问题之后, 它便不能再通过同一个样例. 这让我们认为代码有了生命, 所以称之为: 生命的奇迹.

- 正确示范

这里将合并改为了正常的模式, 然后将自己的父亲的父亲指针连到另一个点的父亲上, 保证了正确性.

```cpp
void Union(ui u, ui v){
	ui fu=find(u), fv=find(v);
//	if(fu < fv) fa[v]=fu;
//	else fa[u] = fv; 
	fa[fu]=fv;
	return;
}
```

> August.11th 2021 By JJK

## `\kk` 和 `/kk`: 亦真亦假

- 错误示范

这样只能告诉别人: 我懂怎么用缩写发表情, 但是我分不清 `\` 和 `/`.

```
\kk
```

- 正确示范

你会得到一个正确的 `快哭了` 表情, 这既能告诉别人你快哭了, 又能表达你菜得深沉.

```
/kk
```

多次水群的时候, 只是因为 `Alt + Tab` 了几个窗口, 就打不出表情的我, 曾多次将 QQ 重启, 但是没有用, 这种问题还是在不知不觉中出现, 又消失于无形.

今天终于在 JJK 的帮助下破案了, 好耶!

> August.12th 2021 By WD

## `b` -> `B`: 一个 `Shift` 引发的血案

- 错误示范

这里传入的是 $B$, 但是函数中调用的是 $b$, 所以调用了全局变量, 得到了错误的答案.

```cpp
void exgcd(ll A, ll B, ll &X, ll &Y){
	if(B == 0){
		X = 1; Y = 0; return;
	}
	exgcd(B, A % B, Y, X);
	Y -= A/b * X;
	return;
}
```

- 正确示范

传入 $B$ 就用 $B$, 非常难调 "最安全的地方往往是最危险的地方". 

```cpp
void exgcd(ll A, ll B, ll &X, ll &Y){
	if(B == 0){
		X = 1; Y = 0; return;
	}
	exgcd(B, A % B, Y, X);
	Y -= A/B * X;
	return;
}
```

> August.13th 2021 By JJK

## $a^b \equiv a^{b \% p} \pmod p$ $\times$

这个错误涉及到欧拉定理, 因为一般取模的问题都是在过程中不断取模, 将过程中的值控制在模数以内. 但是对于乘方运算, 有 $a^b \equiv a^{b \% \phi(p)} $. 而一个合数的 $\phi$ 并不是它 $-1$, 所以不能直接取模, 所以有两种方案: 求出 $\phi$ 或者不取模.

- 错误示范

```cpp
ll ksm(ll base, unsigned long long p){
	p %= Mod - 1;
	ll res=1;
	while (p) {
		if(p&1) res = res * base % Mod;
		base = base * base % Mod;
		p >>= 1;
	}
	return res;
}
```

- 正确示范

```cpp
ll ksm(ll base, unsigned long long p){
	ll res=1;
	while (p) {
		if(p&1) res = res * base % Mod;
		base = base * base % Mod;
		p >>= 1;
	}
	return res;
}
```

> August.15th 2021 By JJK

## `Ctrl + C`, `Ctrl + V`

线段树的查询和修改操作很相似, 所以写的时候一般会先写一个函数, 另一个复制前一个修改而来, 这个问题就属于改干净的典型.

- 错误示范

递归查询右儿子的时候写成了修改, 导致出错.

```cpp
void Qry(Node *x, unsigned L, unsigned R) {
  if(A >= R) {
    Ans += x->Val;
    return;
  }
  PsDw(x, R - L + 1);
  register unsigned Mid((L + R) >> 1);
  Qry(x->LS, L, Mid);
  if(Mid < A) {
    Chg(x->RS, Mid + 1, R);
  }
}
```

- 正确示范

递归的本质是自己调用自己, 所以将 `Chg` 改回 `Qry` 即可.

```cpp
void Qry(Node *x, unsigned L, unsigned R) {
  if(A >= R) {
    Ans += x->Val;
    return;
  }
  PsDw(x, R - L + 1);
  register unsigned Mid((L + R) >> 1);
  Qry(x->LS, L, Mid);
  if(Mid < A) {
    Qry(x->RS, Mid + 1, R);
  }
}
```

> August.18th 2021 By WD

## 中元节后

如果出现了灵异现象 (比如用 `if` 实现了循环), 首先一定要坚定对科学的信任, 然后一定要检查函数返回值!

- 错误示范

这个函数的类型是 `Node*`, 但是我最后没有 `return`, 所以导致我用 `if` 实现了死循环......

```cpp
Node* Add(Node* x) {
  ......
  if (x->Size > 3) {
    if ((x->LS->Size * 3) < x->RS->Size) {
			......
    }
    if ((x->RS->Size * 3) < x->LS->Size) {
      ......
    }
  }
}
```

- 正确示范

加上 `return` 就好了.

```cpp
Node* Add(Node* x) {
  ......
  if (x->Size > 3) {
    if ((x->LS->Size * 3) < x->RS->Size) {
			......
    }
    if ((x->RS->Size * 3) < x->LS->Size) {
      ......
    }
  }
  return x;
}
```

> August.26th 2021 By WD

## 不可持久的可持久化 `Trie`

这是一个可持久化 Trie 的错误, 因为一般可持久化的继承都写在函数里面, 但是 `0/1` Trie 这次不知怎么回事写成了叶子节点 $Size$ 在函数外更新, 这就导致我必须给叶子的 $Size$ 手动增加 $1$, 但是因此忘记了继承 $Size$.

- 错误示范

这就是当时的写法, 最离谱的是, 这种完全不着调的错误可以在 Luogu 和 LOJ 上都拿到 $80'$, 而且最后 $4$ 个点竟然最多只和高达 $10^15$ 的答案差 $6$, 最少甚至差 $3$. 不得不说数据太水了, 这种错误显然可以被 $10$ 以内的数据卡掉.

```cpp
for (register char j(_31); j >= _0; --j) Add(((1 << j) & Sum[i]) >> j);
Last->Size = 1;
```

- 正确示范

指针的痛, 只能判断空指针, 不能像数组一样有大哨兵 $N[0]$.

```cpp
for (register char j(_31); j >= _0; --j) Add(((1 << j) & Sum[i]) >> j);
if (LastLast)Last->Size = LastLast->Size + 1;
else Last->Size = 1;
```

> August.26th 2021 By WD

## Manacherehcanam

这是 Manacher 算法的偶数串部分, 我们将偶数回文串中心定义为两个中心字符中靠右的一个, 那么对于一个 $Right$, $Mid$ 来说, 中心 $k$ 的对称点在 $Mid - (k - Mid)$ 的地方, 而不是 $Mid - (k - Mid) - 1$ 的地方.

这时因为我们找的是和 $k$ 对应的对称轴关于 $Mid$ 对应的对称轴相对的轴对应的点, 而不是找 $k$ 点关于 $Mid$ 对应的对称轴对称的点. 也就是说我们应该找 $k - 1$ 和 $k$ 分别的对称点中间那条轴的对应点, 也就是 $k - 1$ 的对称点 $Mid - (k - 1 - Mid) - 1$ 和 $k$ 的对称点 $Mid - (k - Mid) - 1$ 中靠有的一个, 也就是 $Mid - (k - 1 - Mid) - 1 = Mid - (k - Mid)$. 

还有一个不影响结果的错误, 就是 $k$ 对应的对称轴到 $Right$ 的距离, 应该是 $Right - k + 1$, 而不是 $Right - k$, 因为计算的是轴到轴的距离, 而不是点到轴的距离. 这个错误不会影响答案, 只不过是在有时会多判断不必要的一位, 对常数有细小影响, 几乎可以忽略.

- 错误示范

```cpp
if (k >= Ri) l = 0;
else l = min(Ri - k, f2[(m << 1) - k - 1]);
```

- 正确示范

```cpp
if (k >= Ri) l = 0;
else l = min(Ri - k + 1, f2[(m << 1) - k]);
```

> September.12th 2021 By WD

## `inline`, 永远的神!

- 错误示范

```cpp
void Tarjan(Node* x) {···}
```

- 正确示范

```cpp
inline void Tarjan(Node* x) {···}
```

在递归层数很多的时候, 我们必须注意栈空间占用带来的影响. 有时候, `inline` 可以节省栈空间, 所以貌似既能卡常又能卡空的 `inline` 确实应该好好利用起来

> September.24th 2021 By WD

## 树剖都能写错

这是树剖的跳链顶环节, 一般是将链顶较深的点跳到链顶的父亲的位置.

- 错误示范

这里是按编号判断的跳哪个点, 显然是错的.

```cpp
if(x->Top < y->Top) swap(x, y);
```

- 正确示范

应该根据深度判断.

```cpp
if(x->Top->Dep < y->Top->Dep) swap(x, y);
```

不过这个错误能过那么多大数据就离谱, 说明用脚造数据确实是可以助力每一个梦想的.

> September.25th 2021 By WD

## 帽子戏法

- 错误示范

这里 $k >> 1$ 是从 $1$ 开始的, 但是 `vector` 是从 $0$ 开始的, 所以会 RE.

猥琐的是, 它不会当场 RE, 而是在某次 `push_back()` 时随机 RE, 甚至同一份程序几次运行在不同地方 RE.

调了一天, 在贾正坤做小黄鸭的帮助下成功调了出来.

```cpp
for (unsigned i(1), k(2); i <= n; ++i) {
  for (unsigned j(1); j <= m; ++j, ++k) {
    Ans += (A = RD());
    if((i ^ j) & 1) {
      N->E.push_back((Edge){N + k, A, 0});
      N[k].E.push_back((Edge){N, 0, 0});
      N->E[k >> 1].Inv = 0;
      N[k].E[0].Inv = k >> 1;
    } else {
      N[1].E.push_back((Edge){N + k, 0, 0});
      N[k].E.push_back((Edge){N + 1, A, 0});
      N[1].E[k >> 1].Inv = 0;
      N[k].E[0].Inv = k >> 1;
    }
  }
}
```

- 正确示范

减去 $1$, 使得下标从 $0$ 开始, 并且, 由于 $N$ 和 $N[1]$ 的出边的 $Inv$ 在 `push_back()` 的适合就是 $0$, 所以就无需再赋一遍了.

```cpp
for (unsigned i(1), k(2); i <= n; ++i) {
  for (unsigned j(1); j <= m; ++j, ++k) {
    Ans += (A = RD());
    if((i ^ j) & 1) {
      N->E.push_back((Edge){N + k, A, 0});
      N[k].E.push_back((Edge){N, 0, 0});
      N[k].E[0].Inv = (k >> 1) - 1;
    } else {
      N[1].E.push_back((Edge){N + k, 0, 0});
      N[k].E.push_back((Edge){N + 1, A, 0});
      N[k].E[0].Inv = (k >> 1) - 1;
    }
  }
}
```

> October.8th 2021 By WD

## 不要让等待, 成为遗憾

- 错误示范

在 $n$ 个询问的时候, 打出这个操作使程序在回答 $n$ 个询问后触发被动技能【等待】, 在输入第 $n + 1$ 个询问前什么都不做, 直到 TLE 被评测机强行杀掉.

```cpp
for (unsigned i(0); i <= n; ++i) {
...........
}
```

- 正确示范

我在 $2017$ 年都懂的操作:

```cpp
for (unsigned i(1); i <= n; ++i) {
...........
}
```

> March.4th 2022 By WD

## $316$ 不是 $100000$ 之因数

- 错误示范

取 $D = \lfloor \sqrt C \rfloor$, 从 $1$ 枚举到 $D - 1$, 找 $C$ 的因数, 特判 $D$. 因为当 $C$ 是完全平方数的时候, $D$ 和 $\frac CD$ 是同一个数, 会被统计两次, 所以我们判断 $D^2$ 是否为 $C$, 讨论是否统计 $\frac CD$ 即可.

```cpp
D = sqrt(C = RD());
Edge[D].push_back(i); if((D * D) ^ C) Edge[C / D].push_back(i);
for (unsigned j(D - 1); j; --j) if(!(C % j))
  Edge[j].push_back(i), Edge[C / j].push_back(i);
```

- 正确示范

应该判断 $D$ 是否整除 $C$.

```cpp
D = sqrt(C = RD());
if(!(C % D)) {Edge[D].push_back(i); if((D * D) ^ C) Edge[C / D].push_back(i);}
for (unsigned j(D - 1); j; --j) if(!(C % j))
  Edge[j].push_back(i), Edge[C / j].push_back(i);
```

> April.11th 2022 By WD

## 把 $0$ 丢进垃圾桶

- 错误示范

题意要求从 $1$ 开始枚举 $j$.

```cpp
for (unsigned i(1); i <= t; ++i) {
  A = RD(), B = RD();
  for (unsigned j(0); j < m; ++j) {
    D = ((A + (unsigned long long)B * j) % m) + 1;
    /*
    Process
    */
  }
}
```

- 正确示范

所以就该从 $1$ 开始枚举 $j$. 审题...

```cpp
for (unsigned i(1); i <= t; ++i) {
  A = RD(), B = RD();
  for (unsigned j(1); j <= m; ++j) {
    D = ((A + (unsigned long long)B * j) % m) + 1;
    /*
    Process
    */
  }
}
```

> April.13th 2022 By WD

## 快毒: 快速中毒

- 错误示范

没错, 如果一个字符既小于 `0` 也大于 `9`, 那么跳过这个字符, 再读一个字符.

```cpp
inline unsigned RD() {
  unsigned RTmp(0);
  char ch(getchar()); 
  while (ch < '0' && ch > '9') ch = getchar();
  while (ch >= '0' && ch <= '9') RTmp = RTmp * 10 + ch - '0', ch = getchar(); 
  return RTmp;
}
```

- 正确示范

没错, 如果一个字符既小于 `0` 或者大于 `9`, 那么跳过这个字符, 再读一个字符.

```cpp
inline unsigned RD() {
  unsigned RTmp(0);
  char ch(getchar()); 
  while (ch < '0' || ch > '9') ch = getchar();
  while (ch >= '0' && ch <= '9') RTmp = RTmp * 10 + ch - '0', ch = getchar(); 
  return RTmp;
}

> April.19th 2022 By WD

