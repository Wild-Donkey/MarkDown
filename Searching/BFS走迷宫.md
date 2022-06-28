# BFS走迷宫

## 一场考试引发的探究

## 题面

一个n行m列的迷宫, 0能走, 1不能走, 八连通.

输出从1,1走到n,m的路径.

### 样例:

####输入

```
1 2
0 0
```

#### 输出

```
1 1
1 2
```

注: 未说明八联通优先级, 所以优先级全靠蒙

附原题题目:

https://files.cnblogs.com/files/Wild-Donkey/T2%E8%BF%B7%E5%AE%AB%E9%97%AE%E9%A2%98(labyrinth).bmp

## 探索

一开始用的是DFS, 但是没有过, 得了52分. 理论上说的确过不了.

首先怀疑的是优先级问题, 当将52分程序的优先级改成标程的优先级时, 还是52分.

在题解过程中, 得分最多的同学竟然用的是四联通, 58分. 这时, 将另外一个和我同分的同学的程序改成了四联通, 果然得了58分.

分析数据时, 发现这个数据输出的是最短路径, BFS.

后来又打了个BFS, 确认无误后跑了几个点.

<details> <summary>52分BFS</summary> <pre><code>#include &lt;iostream>
using namespace std;
int l,r,n,m,fx[8][2]={{0,1},{1,1},{1,0},{1,-1},{0,-1},{-1,-1},{-1,0},{-1,1}},q[10005][2],cnt=0,ans[10005][2],fa[1005][1005];
bool a[1005][1005],flg=0;
void BFS(){
	int bx,by;
	while(l&lt;r){
		int nx,ny;
		bx=q[l][0];
		by=q[l][1];
		a[bx][by]=1;
		l++;
		if((bx==n)&&(by==m)){
			flg=1;
			return;
		}
		for(int i=0;i&lt;8;i++){
			nx=bx+fx[i][0];
			ny=by+fx[i][1];
			if((nx>0)&&(nx&lt;=n)&&(ny>0)&&(ny&lt;=m)){
				if(!a[nx][ny]){
					a[nx][ny]=1;
					q[r][0]=nx;
					q[r++][1]=ny;
					fa[nx][ny]=i;
				}
			}
		}
	}
	return;
}
int main(){
	cin>>n>>m;
	for(int i=1;i&lt;=n;i++){
		for(int j=1;j&lt;=m;j++){
			cin>>a[i][j];
		}
	}
	l=1;
	r=2;
	q[l][0]=1;
	q[l][1]=1;
	BFS();
	if(flg==0){
		cout&lt;&lt;-1&lt;&lt;endl;
		return 0;
	}
	int nx,ny,tx,ty;
	nx=n;
	ny=m;
	while((nx>0)&&(nx&lt;=n)&&(ny>0)&&(ny&lt;=m)){
		ans[++cnt][0]=nx;
		ans[cnt][1]=ny;
		tx=nx;
		ty=ny;
		nx-=fx[fa[tx][ty]][0];
		ny-=fx[fa[tx][ty]][1];
	} 
	for(int i=cnt;i>=1;i--){
		cout&lt;&lt;ans[i][0]&lt;&lt;" "&lt;&lt;ans[i][1]&lt;&lt;endl;
	}
	return 0;
} </code></pre> </details>

手动模拟出错的数据, 发现标准输出不成立.

造一个简单的数组做例子:

输入

```
2 3
0 0 1
1 0 0
```

按说应该输出

```
1 1
2 2
2 3
```

但是标程输出为

```
-1
```

随后仔细检查标程

<details> <summary>标程</summary> <pre><code>#include &lt;stdio.h>
#include &lt;stdlib.h>
#include &lt;iostream>
#include &lt;queue>
using namespace std&lt;
#define MAX 105
int tx[9]={0,0,1,1,1,0,-1,-1,-1};
int ty[9]={0,1,1,0,-1,-1,-1,0,1};
int map[MAX][MAX];
struct node
{
    int x,y;
}pre[MAX][MAX];
int m,n; 
void init()
{
  int i,j;
  scanf("%d",&n);
  scanf("%d",&m);
  for(i=1;i&lt;=m;i++)
    for(j=1;j&lt;=n;j++)
      scanf("%d",&map[j][i]);//问题所在
  for(i=0;i&lt;=n;i++)
    map[i][0]=map[i][m+1]=1;
  for(i=0;i&lt;=m;i++)
    map[0][i]=map[n+1][i]=1;
}
void print(int x,int y)
{
  if(x==1 && y==1)
  {
    printf("1 1\n");
    return ;
  }
  print(pre[x][y].x,pre[x][y].y);
  printf("%d %d\n",x,y);
}
void bfs()
{
  int i,j,k;
  queue&lt;node> q;
  node first;
  first.x=1;
  first.y=1;
  q.push(first);
  while(!q.empty())
  {
    first=q.front();
    q.pop();
    for(i=1;i&lt;=8;i++)
    {
      int dx=first.x+tx[i];
      int dy=first.y+ty[i];
      if( map[dx][dy]==0 )
      {
        node now;
        now.x=dx;
        now.y=dy;
        q.push(now);
        pre[dx][dy].x=first.x;
        pre[dx][dy].y=first.y;
        map[dx][dy]=-1;
        if(dx==n && dy==m)
        {
          print(dx,dy);
          return;
        }
      }
    }
  }
  printf("-1\n");
}
int main()
{
  init();
  bfs();
  return 0;
}</code></pre> </details>

在标程中, 输入是这样打的:

```c++
for(i=1;i&lt;=m;i++)//列
	for(j=1;j&lt;=n;j++)//行
		scanf("%d",&map[j][i]);
```

这就使得矩阵存成这样:

```
0 1 0 
0 1 0
```

所以输出的是-1

这就是为什么四联通会比八连通分高, 它比八连通多判断了一个点的-1.

为了验证猜想, 我把我打的52分BFS的输入改成这样:

```c++
for(int i=1;i<=m;i++){
	for(int j=1;j<=n;j++){
		cin>>a[j][i];
	}
}
```

然后就过了.

所以标程的问题就出在这输入上.

<details> <summary>修改后满分但是实际上是错误的BFS</summary> <pre><code>#include<iostream>
using namespace std;
int l,r,n,m,fx[8][2]={{0,1},{1,1},{1,0},{1,-1},{0,-1},{-1,-1},{-1,0},{-1,1}},q[10005][2],cnt=0,ans[10005][2],fa[1005][1005];
bool a[1005][1005],flg=0;
void BFS(){
	int bx,by;
	while(l&lt;r){
		int nx,ny;
		bx=q[l][0];
		by=q[l][1];
		a[bx][by]=1;
		l++;
		if((bx==n)&&(by==m)){
			flg=1;
			return;
		}
		for(int i=0;i&lt;8;i++){
			nx=bx+fx[i][0];
			ny=by+fx[i][1];
			if((nx>0)&&(nx&lt;=n)&&(ny>0)&&(ny&lt;=m)){
				if(!a[nx][ny]){
					a[nx][ny]=1;
					q[r][0]=nx;
					q[r++][1]=ny;
					fa[nx][ny]=i;
				}
			}
		}
	}
	return;
}
int main(){
	cin>>n>>m;
	for(int i=1;i&lt;=m;i++){
		for(int j=1;j&lt;=n;j++){
			cin>>a[j][i];
		}
	}
	l=1;
	r=2;
	q[l][0]=1;
	q[l][1]=1;
	BFS();
	if(flg==0){
		cout&lt;&lt;-1&lt;&lt;endl;
		return 0;
	}
	int nx,ny,tx,ty;
	nx=n;
	ny=m;
	while((nx>0)&&(nx&lt;=n)&&(ny>0)&&(ny&lt;=m)){
		ans[++cnt][0]=nx;
		ans[cnt][1]=ny;
		tx=nx;
		ty=ny;
		nx-=fx[fa[tx][ty]][0];
		ny-=fx[fa[tx][ty]][1];
	} 
	for(int i=cnt;i>=1;i--){
		cout&lt;&lt;ans[i][0]&lt;&lt;" "&lt;&lt;ans[i][1]&lt;&lt;endl;
	}
	return 0;
}
</code></pre> </details>

所以说这道题的正确标程应该是52分的BFS.