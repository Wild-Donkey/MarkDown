//n个点，m条边的无向图,k个特殊点，问把所有的特殊点都连起来的边权最小是多少
//n<=100,m<=n*(n-1)/2,k<=10 
#include<bits/stdc++.h>
using namespace std;
int dp[110][1030];
int n,m,k,h,t;
int fir[110],q[10010],cnt,d[110],g[110];
bool f[110],vst[110];
struct edge{
	int to,nxt,val;
}e[10010];
void insert(int u,int v,int w){
	e[++cnt].to = v;e[cnt].nxt = fir[u];fir[u] = cnt;e[cnt].val = w;
	e[++cnt].to = u;e[cnt].nxt = fir[v];fir[v] = cnt;e[cnt].val = w;
} 
int main(){
	int i,j,l,u,v,w;
	cin>>n>>m>>k;
	for(i = 1;i <= m;++i) {
		cin>>u>>v>>w;
		insert(u,v,w);
	}
	for(i = 1;i <= k;++i){
		cin>>u;
		f[u] = 1;//这个点是不是特殊点 
		g[u] = i - 1;//这个点是第几个（从0开始）特殊点 
	}
	memset(dp,0x3f,sizeof(dp));
	for(i = 1;i <= n;++i){
		if(f[i]) dp[i][1 << g[i]] = 0;
	}
	for(j = 0;j < (1 << k);++j){
		for(i = 1;i <= n;++i){
			for(l = j - 1 & j;l;l = l - 1 & j){//枚举子集 
				dp[i][j] = min(dp[i][j],dp[i][l] + dp[l][j]);//第一种转移 
			}
		}
		for(i = 1;i <= n;++i) {
			d[i] = dp[i][j];//spfa用的dis数组 
			q[i] = i;//spfa的队列 
			vst[i] = 1;
		}
		h = 1;
		t = n;
		while(h <= t){
			++h;
			vst[q[h]] = 0;
			for(l = fir[q[h]];l;l = e[l].nxt){
				if(d[e[l].to] > d[q[h]] + e[l].val){
					d[e[l].to] = d[q[h]] + e[l].val;
					if(!vst[e[l].to]){
						vst[e[l].to] = 1;
						q[++t] = e[l].to;
					}
				}
			}
		}
		//第二种转移，通过跑spfa实现 
		for(i = 1;i <= n;++i) dp[i][j] = d[i];
	}
	int ans = 987654321;
	for(i = 1;i <= n;++i) ans = min(ans,dp[i][(1 << k) - 1]);
	cout<<ans;
	return 0;
} 
