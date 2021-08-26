# 超级男孩错误 ()

## 并查集: 生命的奇迹

- 错误示范

这个地方使用了错误的按秩合并, 但是丝毫没有用, 而且这里将一个节点的父亲指针连接到了另一个节点的父亲指针上. 这样会使得它的父亲和兄弟不能正权合并而出问题.

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