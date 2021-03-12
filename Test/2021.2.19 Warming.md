## Basketball1

数组劈成两半, 每一半中找出一些数, 求使左边一组异或和等于右边一组与和的方案数.

没看见劈成两半, 其实一开始想到正解, 但是如果交叉选人就没法通过, 所以 PASS 掉正解了.

设 $f_{i, j, 0}$ 表示前 $i$ 个数, 异或和为 $j$, 且 $i$ 在集合中的方案数.

$f_{i, j, 1}$ 表示 $i$ 后面的数 (包括 $i$ ) 与和等于 $j$, 且 $i$ 在集合中的方案数.

辅助数组 $g_j$ 记录 (前/后) 缀和, 视情况改变.

左边正着算, 右边倒着算.

$$
f_{i, j \wedge a_i, 0} += g_j\\
f_{i, j \& a_i, 1} += g_j
$$

统计答案时, 枚举断点, 左右异或/与和都等于同一个数的方案数相乘, 就是这个断点, 这个值的答案, 累加即可.

```cpp
#include <algorithm>
#include <cstring>
#include <iostream>
#include <cstdio>
using namespace std;
const int MOD(1000000007);
inline unsigned int RD() {
	register unsigned int rdtp(0);
	register char rdch(getchar());
	while ((rdch > '9') || (rdch < '0')) {
		rdch = getchar();
	}
	while ((rdch <= '9') && (rdch >= '0')) {
		rdtp *= 10;
		rdtp += rdch - '0'; 
		rdch = getchar();
	}
	return rdtp;
}
unsigned int n, a[1005], g[1050]/*辅助数组*/, f[1005][1050][2];
unsigned long long Ans(0);
int main() {
	freopen("basketball1.in","r",stdin);
	freopen("basketball1.out","w",stdout);
	n = RD();
	if(!n) {
		printf("0\n");
		return 0;
	}
	memset(f, 0, sizeof(f));
	memset(g, 0, sizeof(g));
	for (register unsigned int i(1); i <= n; ++i) {
		a[i] = RD();
	}
	for (register unsigned int i(1); i <= n; ++i) {
		for(register unsigned int j(0); j < 1024; ++j) {
			f[i][j ^ a[i]][0] += g[j];
			f[i][j ^ a[i]][0] %= MOD;
		}
		++f[i][a[i]][0];
		for (register unsigned int j(0); j < 1024; ++j) {
			g[j] += f[i][j][0];
			g[j] %= MOD;
		}
	}
	memset(g, 0, sizeof(g));
	for (register unsigned int i(n); i >= 1; --i) {
		for(register unsigned int j(0); j < 1024; ++j) {
			f[i][j & a[i]][1] += g[j];
			f[i][j & a[i]][1] %= MOD;
		}
		++f[i][a[i]][1];
		for (register unsigned int j(0); j < 1024; ++j) {
			g[j] += f[i][j][1];
			g[j] %= MOD;
		}
	}
	memset(g, 0, sizeof(g));
	for(register unsigned int i(1); i < n; ++i) {
		for(register unsigned int j(0); j < 1024; ++j) {
			g[j] += f[i][j][0];
			g[j] %= MOD;
			Ans += (long long)g[j] * f[i + 1][j][1];
			Ans %= MOD;
		}
	}
	printf("%llu", Ans);
	return 0; 
}
```

## Basketball2

给出人数 $n$, 权值上界 $l$, 需求权值和 $k$. 求可以取出权值和为 $k$ 的权值方案数 (不是选人的方案数).

$n, k \leq 20$

排列组合以及其余的 DP 算法似乎都会涉及重复统计的问题.

$dp_{i, state}$ 表示前 $i$ 位, $State$ 所表示的权值和能取得的方案总数.

枚举第 $i + 1$ 个取的数 $x$

$$
f_{i, (i | (i << x) | (1<<(x-1)))\ \&\ ((1<<K)-1)} += f_{i - 1, j}\\
f_{i + 1, (原来凑的 | 加上 x 新凑的 | x 本身的) \& (防止溢出)} += f_{i, j}
$$

如果取的数大于 $k$, 那么对于凑数来说, 都是等价的, 直接统计

$$
f_{i, j} += f_{i - 1, j} * (l - k)
$$

$O(n^22^n)$, 但是状压废状态比较多, 剪掉废状态即可 AC (否则 $80$)

```cpp
#include <algorithm>
#include <cstring>
#include <iostream>
using namespace std;
const int MOD(1000000007);
inline unsigned int RD() {
	register unsigned int rdtp(0);
	register char rdch(getchar());
	while ((rdch > '9') || (rdch < '0')) {
		rdch = getchar();
	}
	while ((rdch <= '9') && (rdch >= '0')) {
		rdtp *= 10;
		rdtp += rdch - '0'; 
		rdch = getchar();	
	}
	return rdtp;
}
unsigned int N, n, K, k, l, f[1050000][25], tmp;
unsigned long long Ans(0);
int main() {
	freopen("basketball2.in","r",stdin);
	freopen("basketball2.out","w",stdout);
	n = RD();
	k = RD();
	l = RD();
	K = min(k, l);
	N = (1 << k) - 1;
	memset(f, 0, sizeof(f));
	if(!l) {
			if(k){
				printf("0\n");
				return 0;
			}
		printf("1\n");
		return 0;
	}
	f[0][0] = 1;
	for (register unsigned int i(1); i <= n; ++i) {
		for (register unsigned int m(0); m <= N; ++m) {
			if(f[m][i - 1]) {
				for (register unsigned int j(0); j <= K; ++j) {
					tmp = (m/*原来能凑的*/ | (m << j/*加上j新凑出来的*/) | (1 << (j - 1))/*只选第i个人*/) & ((1 << k) - 1)/*防止溢出, 控制在所需范围以内*/;
					f[tmp][i] += f[m][i - 1];
					f[tmp][i] %= MOD;
				}
			}
		}
		if(l > k) {
			for (register unsigned int m(0); m <= N; ++m) {
				f[m][i] += ((long long)f[m][i - 1] * (l - k)) % MOD;//大于k的数对凑数无用 
				f[m][i] %= MOD;
			}
		}
	}
	for(register unsigned int i(1 << (k - 1)); i <= N; ++i) {
		Ans += f[i][n];
	}
	Ans %= MOD; 
	printf("%llu\n", Ans);
	return 0; 
}
```

## Maze

一个 $n * n$ 的棋盘

* `#` 是墙壁, 不能走
* `S` 是问题, 多花 $1$ 时间, 只需要解一次
* `K` 是起点
* `T` 是终点
* `数字x`, 是第 $x$ 把钥匙, 要从第 $1$ 把挨个拿.
* `.` 是普通地格

地格之间四联通, 每次移动花 $1$ 时间, 求从 $K$ 出发拿到所有钥匙并到达 $T$ 的最短时间.

$0 < n \leq 100, 0 \leq m \leq 9, S_{num} \leq 5$

这题由于 `S` 较少, 枚举每个 `S` 做还是不做 (不做就暂时设为 `#`), 然后直接 BFS 即可.

按顺序取钥匙, 增加一维表示已经拿到的钥匙, 将棋盘变成三维的, 有钥匙时有两个分支, 拿或是不拿, 不拿就在本层继续走, 拿就前往下一层.

设 $f_{i, j, k}$ 为第 $(i, j)$ 点取到钥匙 $k$ 的时间, 被更新就入队, 否则不入.

```cpp
#include <algorithm>
#include <cstring>
#include <iostream>
#include <cstdio>
#include <queue>
using namespace std;
const int MOD(1000000007);
inline unsigned int RD() {
	register unsigned int rdtp(0);
	register char rdch(getchar());
	while ((rdch > '9') || (rdch < '0')) {
		rdch = getchar();
	}
	while ((rdch <= '9') && (rdch >= '0')) {
		rdtp *= 10;
		rdtp += rdch - '0'; 
		rdch = getchar();
	}
	return rdtp;
}
struct Pnt {
	unsigned int x, y, key;
	Pnt (unsigned int a = 0, unsigned int b = 0, unsigned int c = 0) {
		x = a;
		y = b;
		key = c; 
	}
};
queue<Pnt> Q;
//bool b[105][105];
unsigned int Cnt(0), sx, sy, tx, ty, S[7][2], m, n, f[105][105][10]/*f[i][j][k]:拿到第 k 把钥匙, 在i,j的最短时间*/, Ans(0x3f3f3f3f);
char s[105], a[105][105];
void Udt (const Pnt &x, const Pnt &y) {
	if (y.key + 1 == x.key) {
		if (f[x.x][x.y][x.key] > f[y.x][y.y][y.key] + 1) {//Pick
			f[x.x][x.y][x.key] = f[y.x][y.y][y.key] + 1;
			Q.push(x);
		}
	}
	if (f[x.x][x.y][y.key] > f[y.x][y.y][y.key] + 1) {//Not Pick
		f[x.x][x.y][y.key] = f[y.x][y.y][y.key] + 1;
		Q.push(Pnt(x.x, x.y, y.key));
	}
	return;
}
inline void Inst (Pnt x, const Pnt &y) {
	if (a[x.x][x.y] == 0x7f) {
		return;
	}
	x.key = (unsigned int)a[x.x][x.y];
	if(!x.key) {
		x.key = y.key;
	}
	Udt(x, y);
	return;
} 
void BFS() {
	Pnt x;
	Q.push(Pnt(sx, sy, 0));
	while (Q.size()) {
		x = Q.front();
		if (x.x - 1) {
			Inst(Pnt(x.x - 1, x.y, 0), x);
		}
		if (x.x + 1 <= n) {
			Inst(Pnt(x.x + 1, x.y, 0), x);
		}
		if (x.y - 1) {
			Inst(Pnt(x.x, x.y - 1, 0), x);
		}
		if (x.y + 1 <= n) {
			Inst(Pnt(x.x, x.y + 1, 0), x);
		}
		Q.pop();
	}
	return;
}
void DoS(unsigned int Dep, unsigned int Chost) {
	if(Dep > Cnt) {//枚举完了, 开始走 
		memset(f, 0x3f, sizeof(f));
		f[sx][sy][0] = Chost;
		BFS();
		Ans = min(f[tx][ty][m], Ans);
		return; 
	}
	a[S[Dep][0]][S[Dep][1]] = 0x7f; 
	DoS(Dep + 1, Chost);
	a[S[Dep][0]][S[Dep][1]] = 0;
	DoS(Dep + 1, Chost + 1);
	return;
} 
int main() {
	freopen("maze.in","r",stdin);
	freopen("maze.out","w",stdout);
	n = RD();
	m = RD();
	if(!n) {
		printf("0\n");
		return 0;
	}
	memset(a, 0, sizeof(a));
	for (register unsigned int i(1); i <= n; ++i) {
		gets(s);
		for (register unsigned int j(1); j <= n; ++j) {
			switch(s[j - 1]) {
				case '#':{
					a[i][j] = 0x7f;
					break;
				}
				case '.': {
					break;
				}
				case 'K': {
					sx = i;
					sy = j;
					break;
				}
				case 'S': {
					S[++Cnt][0] = i;
					S[Cnt][1] = j;
					break;
				}
				case 'T': {
					tx = i;
					ty = j;
					break;
				}
				default: {
					a[i][j] = s[j - 1] - '0';
					break;
				} 
			}
		}
	}
	memset(f, 0x3f, sizeof(f));
	DoS(1, 0);
	if(Ans >= 1000000000) {
		printf("impossible\n");
		return 0;
	}
	printf("%u\n", Ans);
	return 0; 
}
```
