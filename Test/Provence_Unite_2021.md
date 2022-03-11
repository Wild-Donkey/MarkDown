> 时空无特殊说明皆 1s 512MB

# 卡牌游戏

## 题目描述
Alice 有 $n$ 张卡牌，第 $i(1 \le i \le n)$张卡牌的正面有数字 $a_i$，背面有数字 $b_i$，初始时所有卡牌正面朝上。

现在 Alice 可以将不超过 $m$ 张卡牌翻面，即由正面朝上改为背面朝上。Alice 的目标是让最终朝上的 $n$ 个数字的极差（最大值与最小值的差）尽量小。请你帮 Alice 算一算极差的最小值是多少。

## 输入格式

第一行，两个正整数 $n, m$, 代表卡牌张数与至多翻面张数。
第二行，$n$ 个正整数，第 $i$ 个数字表示 $a_i$。
第三行，$n$ 个正整数，第 $i$ 个数字表示 $b_i$。

数据保证卡牌上的 $2n$ 个数字互不相同，且卡牌按照 $a_i$ 升序给出。

## 输出格式

仅一行，一个整数，表示答案。

### 输入 #1

<pre>
6 3
8 11 13 14 16 19
10 18 2 3 6 7
</pre>

### 输出 #1

<pre>
8
</pre>

## 样例解释

最优方案之一：将第 $1, 5, 6$ 张卡牌翻面，最终朝上的数字依次为 $10, 11, 13, 14, 6, 7$，极差为 $14 - 6 = 8$。

## 数据范围

对于所有测试数据：$3 \le n \le {10}^6$，$1 \le m < n$，$1 \le a_i, b_i \le {10}^9$。

# 滚榜

## 题目描述

封榜是 ICPC 系列竞赛中的一个特色机制。ICPC 竞赛是实时反馈提交结果的程序设计竞赛，参赛选手与场外观众可以通过排行榜实时查看每个参赛队伍的过题数与排名。竞赛的最后一小时会进行“封榜”，即排行榜上将隐藏最后一小时内的提交的结果。赛后通过滚榜环节将最后一小时的结果（即每只队伍最后一小时的过题数）公布。

Alice 围观了一场 ICPC 竞赛的滚榜环节。本次竞赛共有 $n$ 支队伍参赛，队伍从 $1 \sim n$ 编号，$i$ 号队伍在封榜前通过的题数为 $a_i$。排行榜上队伍按照过题数从大到小进行排名，若两支队伍过题数相同，则编号小的队伍排名靠前。

滚榜时主办方以 $b_i$ 不降的顺序依次公布了每支队伍在封榜后的过题数 $b_i$（最终该队伍总过题数为 $a_i + b_i$），并且每公布一支队伍的结果，排行榜上就会实时更新排名。Alice 并不记得队伍被公布的顺序，也不记得最终排行榜上的排名情况，只记得每次公布后，本次被公布结果的队伍都成为了新排行榜上的第一名，以及所有队伍在封榜后一共通过了 $m$ 道题（即 $\sum_{i = 1}^{n} b_i = m$）。

现在 Alice 想请你帮她算算，最终排行榜上队伍的排名情况可能有多少种。

## 输入格式

第一行，包含两个正整数 $n, m$，表示队伍数量与它们封榜后的总过题数。
第二行，包含 $n$ 个正整数，表示 $a_i$。

## 输出格式

仅一行，一个整数，表示答案。

### 输入 #1

<pre>
3 6
1 2 1
</pre>

### 输出 #1

<pre>
5
</pre>

### 输入 #2

<pre>
6 50
4 7 9 3 0 3
</pre>

### 输出 #2

<pre>
96
</pre>

### 输入 #3

<pre>
11 300
6 8 8 12 0 11 6 1 0 15 5
</pre>

### 输出 #3

<pre>
30140983
</pre>

## 样例 #1 解释

最终排名：$1, 3, 2$，滚榜情况（按公布顺序，下同）：$b_2 = 0$，$b_3 = 2$，$b_1 = 4$。

最终排名：$2, 1, 3$，滚榜情况：$b_3 = 2$，$b_1 = 2$，$b_2 = 2$。

最终排名：$2, 3, 1$，滚榜情况：$b_1 = 1$，$b_3 = 2$，$b_2 = 3$。

最终排名：$3, 1, 2$，滚榜情况：$b_2 = 0$，$b_1 = 2$，$b_3 = 4$。

最终排名：$3, 2, 1$，滚榜情况：$b_1 = 1$，$b_2 = 1$，$b_3 = 4$。

## 数据范围

对于所有测试数据：$1 \le n \le 13$，$1 \le m \le 500$，$0 \le a_i \le {10}^4$

# 宝石

> 2s

## 题目描述

欧艾大陆上有 $n$ 座城市，城市从 $1 \sim n$ 编号，所有城市经由 $n - 1$ 条无向道路互相连通，即 $n$ 座城市与 $n - 1$ 条道路构成了一棵树。

每座城市的集市上都会出售宝石，总共有 $m$ 种不同的宝石，用 $1 \sim m$ 编号。$i$ 号城市的集市出售的是第 $w_i$ 种宝石，一种宝石可能会在多座城市的集市出售。

K 神有一个宝石收集器。这个宝石收集器能按照顺序收集至多 $c$ 颗宝石，其收集宝石的顺序为：$P_1, P_2, \ldots , P_c$。更具体地，收集器需要先放入第 $P_1$ 种宝石，然后才能再放入第 $P_2$ 种宝石，之后再能放入第 $P_3$ 种宝石，以此类推。其中 $P_1, P_2, \ldots , P_c$ 互不相等。

K 神到达一个城市后，如果该城市的集市上出售的宝石种类和当前收集器中需要放入的种类相同，则他可以在该城市的集市上购买一颗宝石并放入宝石收集器中；否则他只会路过该城市什么都不做。

现在 K 神给了你 $q$ 次询问，每次给出起点 $s_i$ 与终点 $t_i$，他想知道如果从 $s_i$ 号城市出发，沿最短路线走到 $t_i$ 号城市后，他的收集器中最多能收集到几个宝石？（在每次询问中，收集器内初始时没有任何宝石。起点与终点城市集市上的宝石可以尝试被收集）

## 输入格式

第一行，包含三个正整数 $n, m, c$，分别表示城市数，宝石种类数，收集器的容量。
第二行，包含 $c$ 个正整数 $P_i$。数据保证 $1 \le P_i \le m$ 且这些数互不相等。
第三行，包含 $n$ 个正整数 $w_i$，表示每个城市集市上出售的宝石种类。
接下来 $n - 1$ 行，每行两个正整数 $u_i, v_i$，表示一条连接 $u_i$ 和 $v_i$ 号城市的道路。
接下来一行，包含一个正整数 $q$，表示询问次数。
接下来 $q$ 行，每行两个正整数 $s_i, t_i$，表示该次询问的起点与终点。

## 输出格式

按输入顺序输出 $q$ 行，每行一个整数，表示询问的答案。

### 输入 #1

<pre>
7 3 3
2 3 1
2 1 3 3 2 1 3
1 2
2 3
1 4
4 5
4 6
6 7
5
3 5
1 3
7 3
5 7
7 5
</pre>

### 输出 #1

<pre>
2
2
2
3
1
</pre>

## 数据范围

对于所有测试数据：$1 \le n, q \le 2 \times {10}^5$，$1 \le c \le m \le 5 \times {10}^4$，$1 \le w_i \le m$。

# 卡牌游戏

>By intel_core

首先不难发现这个题满足答案单调性
现在考虑 $\text{check}$ 一个答案 $x$
如果我们选定了值域区间的左端点，那么右端点就可以很简单的确定
在这个基础上，$a_i$ 在选定范围内的卡牌就不用翻了
所以其他的卡牌就需要进行翻面，并且对应的 $b$ 值必须在选定的范围内，否则跳过
所以现在变成了查询 $b_i$ 的前后缀 $\text{RMQ}$
总复杂度是 $O(nlogn)$ 的，$\text{i5-4590@3.3GHz}$ 可以做到 $\text{1s}$

# 滚榜

> By 白鲟

## 前言

纪念一下这场爆炸的省选唯一 AC 的题目。

同时是第一次在正式考场上 AC 动态规划。

同时是第一次在正式考场上 CE（还是本应 AC 的 Day1 T1）。

大概是本场第三简单的题。

应该比去年 Day2 T1 简单。

## 分析

看了一眼范围估计是状压。

开始分析的时候容易想到设计状态为 $f(S,i,j,k)$，即前 $|S|$ 位为 $S$ 内元素、第 $|S|$ 位为 $i$、已选 $b_i$ 总和为 $j$、上一个 $b_i$ 为 $k$ 的方案总数，但始终甩不掉枚举 $b_i$ 的和与上一个 $b_i$ 的值的 $m^2$ 循环。

冷静看题。发现只用求排名的总方案数，而与 $b_i$ 分配方式无关。可以得到的启发是寻找 $b_i$ 的最佳分配方式。

对于某一确定的排列方式 $a_1,a_2,\cdots,a_n$，贪心地分配使得每个位置的 $b_i$ 尽量小的方式易得：若当前的 $a_i$ 大于 $a_{i-1}$，为了维护 $b_i$ 不降，使得 $b_i=b_{i-1}$, 否则 $b_i=b_{i-1}+a_{i-1}-a_i$。

根据这一结论，直接使用全排列可以获得 60 pts 的好成绩。

回到状压。考虑对贡献进行简单变形：$\sum{b_i}=\sum{\max(a_{i-1}-a_i,0)}(n-i+1)$，如此可以甩掉枚举上一个 $b_i$ 的值这一步。设 $f(S,i,j)$ 表示前 $|S|$ 位为 $S$ 内元素、第 $|S|$ 位为 $i$、已选总贡献为 $j$ 的方案总数，在枚举状态的同时枚举下一个选的数，容易写出方程式。

最后统计 $f(U,i,j)$ 的和即可。

时间复杂度为 $\operatorname{O}(2^nn^2m)$。可通过使用 $\operatorname{lowbit}$ 枚举元素等方式略微卡常。

上述方法忽略的细节是相等时的按编号排序，实现时应注意。

## 代码

> upd on 2021.4.24

根据 UOJ 数据修复了代码实现的一点小问题，目前在 UOJ 上可通过。

```cpp
#include<algorithm>
#include<cstdio>
using namespace std;
const int maxn=13,maxm=500;
int n,m,all,t,a[maxn+1],no[1<<maxn|1];
long long f[1<<maxn|1][maxn+1][maxm+1],ans;
inline int lowbit(int x)
{
	return x&(-x);
}
int main()
{
	scanf("%d%d",&n,&m);
	all=(1<<n)-1;
	a[0]=-1;
	for(int i=1;i<=n;++i)
	{
		scanf("%d",&a[i]);
		if(a[i]>a[t])
			t=i;
		no[1<<(i-1)]=i;
	}
	for(int i=1;i<=n;++i)
	{
		int target=n*(a[t]-a[i]+(t<i));
		if(target<=m)
			f[1<<(i-1)][i][target]=1;
	}
	for(int i=1;i<all;++i)
	{
		int popcount=0;
		for(int j=1;j<=maxn;++j)
			if(i&(1<<(j-1)))
				++popcount;
		for(int t=i;t;t-=lowbit(t))
			for(int sum=0;sum<=m;++sum)
			{
				int pos=no[lowbit(t)];
				for(int j=1;j<=n;++j)
					if(!(i&(1<<(j-1))))
					{
						int target=sum+(n-popcount)*max(0,(pos<j)+a[pos]-a[j]);
						if(target<=m)
							f[i|(1<<(j-1))][j][target]+=f[i][pos][sum];
					}
			}
	}
	for(int i=0;i<=m;++i)
		for(int j=1;j<=n;++j)
			ans+=f[all][j][i];
	printf("%lld",ans);
	return 0;
}
```

# 宝石

> By hezlik

看到好像没什么人是和我思路类似的单 $\log$ 做法，我就来水一篇 blog 了。

对于一条询问路径 $s_i\rightarrow t_i$ 拆成 $s_i\rightarrow x_i$ 和 $y_i\rightarrow t_i$，其中 $y_i$ 是 $s_i,t_i$ 的 LCA，$x_i$ 是 $y_i$ 的儿子。

对于 $s_i\rightarrow x_i$ 的部分，我们直接处理出这一段最多可以获得多少宝石，并把下一个宝石的种类记为 $c_i$，然后把二元组 $(c_i,i)$ 挂到节点 $y_i$ 上，并在节点 $t_i$ 上挂一个结束标记 $i$。

这个部分可以用树上倍增进行处理。

现在只需要对树进行一遍 dfs，并对每个宝石的种类 $i$ 维护一个容器 $d_i$，支持：

进入点 $k$ 时，对于挂在 $k$ 上的所有二元组 $(i,x)$，把 $x$ 插入容器 $d_i$。

令点 $k$ 上的宝石种类 $w$ 在宝石序列中的后继为 $r$，则把 $d_{w}$ 合并到 $d_{r}$ 中。

对于挂在 $k$ 上的所有结束标记 $x$，查询 $x$ 所在的容器编号。
退出点 $k$ 时，撤销进入点 $k$ 时进行的操作（包括插入与合并）。
我们发现用带撤销并查集可以很好的实现这个容器。

于是就做完了，时间复杂度 $O((n+q)\log n)$。

代码如下：

```cpp
#include<bits/stdc++.h>
using namespace std;

const int N=500000,C=21;

int Ri(){
  int x=0,y=1;
  char c=getchar();
  for (;c<'0'||c>'9';c=getchar()) if (c=='-') y=-1;
  for (;c<='9'&&c>='0';c=getchar()) x=x*10+c-'0';
  return x*y;
}

int n,m,sk,a[N+9],pre[N+9],suf[N+9],pos[N+9];
struct side{
  int y,next;
}e[N+9];
int lin[N+9],cs;

void Ins(int x,int y){e[++cs].y=y;e[cs].next=lin[x];lin[x]=cs;}
void Ins2(int x,int y){Ins(x,y);Ins(y,x);}

int fa[N+9],son[N+9],dep[N+9],siz[N+9],top[N+9];
int fir,up1[N+9],up[N+9][C],now[N+9];

void Dfs_ord0(int k,int fat){
  if (now[suf[a[k]]]) up[k][0]=now[suf[a[k]]];
  for (int i=1;i<C;++i) up[k][i]=up[up[k][i-1]][i-1];
  int t=now[a[k]];
  now[a[k]]=k;
  if (now[fir]) up1[k]=now[fir];
  fa[k]=fat;
  dep[k]=dep[fat]+1;
  siz[k]=1;
  for (int i=lin[k];i;i=e[i].next)
    if (e[i].y^fat){
      Dfs_ord0(e[i].y,k);
      siz[k]+=siz[e[i].y];
      if (siz[e[i].y]>siz[son[k]]) son[k]=e[i].y;
    }
  now[a[k]]=t;
}

void Dfs_ord1(int k,int t){
  top[k]=t;
  if (son[k]) Dfs_ord1(son[k],t);
  for (int i=lin[k];i;i=e[i].next)
    if (e[i].y^fa[k]&&e[i].y^son[k]) Dfs_ord1(e[i].y,e[i].y);
}

int Query_lca(int x,int y){
  for (;top[x]^top[y];x=fa[top[x]])
    if (dep[top[x]]<dep[top[y]]) swap(x,y);
  return dep[x]<dep[y]?x:y;
}

int cq,ans[N+9];
vector<int>qc[N+9],qid[N+9],q[N+9];

void into(){
  n=Ri();m=Ri();sk=Ri();
  for (int i=1;i<=sk;++i) a[i]=Ri();
  fir=a[1];
  for (int i=1;i<=sk;++i){
    pre[a[i]]=a[i-1];
    suf[a[i]]=a[i+1];
    pos[a[i]]=i;
  }
  for (int i=1;i<=n;++i) a[i]=Ri();
  for (int i=1;i<n;++i){
    int x,y;
    x=Ri();y=Ri();
    Ins2(x,y);
  }
  Dfs_ord0(1,0);
  Dfs_ord1(1,1);
  cq=Ri();
  for (int i=1;i<=cq;++i){
    int x,y,z;
    x=Ri();y=Ri();
    z=Query_lca(x,y);
    if (dep[up1[x]]<=dep[z]){
      qc[z].push_back(fir);
      qid[z].push_back(i);
      q[y].push_back(i);
    }else{
      int t=up1[x];
      for (int j=C-1;j>=0;--j)
        if (dep[up[t][j]]>dep[z]) t=up[t][j];
      t=a[t];
      if (suf[t]){
        qc[z].push_back(suf[t]);
        qid[z].push_back(i);
        q[y].push_back(i);
      }else ans[i]=m;
    }
  }
}

int uni[N+9],sz[N+9],col[N+9],rot[N+9];

int Query_uni(int k){return k==uni[k]?k:Query_uni(uni[k]);}

void Dfs_ans(int k){
  for (int vs=qc[k].size(),i=0;i<vs;++i){
    int c=qc[k][i],t=qid[k][i];
    uni[t]=t;sz[t]=1;col[t]=c;
    rot[c]?(uni[t]=rot[c],++sz[rot[c]]):rot[c]=t;
  }
  int x=rot[a[k]];
  rot[a[k]]=0;
  int c=suf[a[k]],y=rot[c];
  if (x){
    if (!y) rot[c]=x,col[x]=c;
    else if (sz[x]<sz[y]){
      uni[x]=y;
      sz[y]+=sz[x];
    }else{
      uni[y]=rot[c]=x;
      sz[x]+=sz[y];
      col[x]=c;
    }
  }
  for (int vs=q[k].size(),i=0;i<vs;++i){
    int t=col[Query_uni(q[k][i])];
    ans[q[k][i]]=t?pos[t]-1:sk;
  }
  for (int i=lin[k];i;i=e[i].next)
    if (e[i].y^fa[k]) Dfs_ans(e[i].y);
  if (x){
    if (!y) rot[c]=0,col[x]=a[k];
    else if (rot[c]==y){
      uni[x]=x;
      sz[y]-=sz[x];
    }else{
      uni[y]=rot[c]=y;
      sz[x]-=sz[y];
      col[x]=a[k];
    }
  }
  rot[a[k]]=x;
  for (int vs=qc[k].size(),i=0;i<vs;++i){
    int c=qc[k][i],t=qid[k][i];
    rot[c]==t?rot[c]=0:--sz[uni[t]];
  }
}

void work(){
  Dfs_ans(1);
}

void outo(){
  for (int i=1;i<=cq;++i)
    printf("%d\n",ans[i]);
}

int main(){
  into();
  work();
  outo();
  return 0;
}
```