#include<bits/stdc++.h>
using namespace std;
int n,s,g,q[100010],h,t,vis[2010],lx[1010],ly[1010],a[1010][1010],slx[1010],bel[1010];
struct edge{
	int fr,to,nxt,val;
}e[2100010];
int cnt = 1,fir[2010];
inline void ins(int u,int v,int w){
	e[++cnt].fr = u;e[cnt].to = v;e[cnt].nxt = fir[u];fir[u] = cnt;e[cnt].val = w;
	e[++cnt].fr = v;e[cnt].to = u;e[cnt].nxt = fir[v];fir[v] = cnt;e[cnt].val = 0;
}
#define chk(x) (e[x].fr == s || e[x].to == g || e[x].to <= n || e[x].fr > n || a[e[x].fr][e[x].to - n] == lx[e[x].fr] + ly[e[x].to - n])
#define inf 0x3f3f3f3f 
bool bfs(){
	int i,j;
	for(i = 1;i <= g;++i) vis[i] = 0;
	for(i = 1;i <= n;++i) slx[i] = inf,bel[i] = 0;
	h = t = 0;
	q[++t] = s;vis[s] = 1;
	while(h < t){
		j = q[++h];
		for(i = fir[j];i;i = e[i].nxt) if(chk(i) && e[i].val > 0 && !vis[e[i].to]){
			vis[e[i].to] = vis[j] + 1;
			q[++t] = e[i].to;
		}
	}
	return vis[g];
}
inline void ud(int x){
	for(int y = 1;y <= n;++y) if(slx[y] > lx[x] + ly[y] - a[x][y]){
		slx[y] = lx[x] + ly[y] - a[x][y];
		bel[y] = x;	
	}
}
bool bfs2(){
	while(h < t){
		int j = q[++h];
		for(int i = fir[j];i;i = e[i].nxt) if(chk(i) && e[i].val > 0 && !vis[e[i].to]){
			vis[e[i].to] = vis[j] + 1;
			q[++t] = e[i].to;
			if(e[i].to <= n) ud(e[i].to);
		}
	}
	return vis[g];
}
int now,ans;
int dfs(int x,int fl){
	if(x == g) return fl;
	int i,ans = 0,tmp;
	for(i = fir[x];i;i = e[i].nxt) if(chk(i) && e[i].val > 0 && vis[e[i].to] == vis[x] + 1){
		tmp = dfs(e[i].to,min(fl,e[i].val));
		fl -= tmp;ans += tmp;
		e[i].val -= tmp;e[i ^ 1].val += tmp;
		if(!fl) break;
	}
	return ans;
}
void wk(){
	int i,j; 
	s = n + n + 1;g = n + n + 2;
	for(i = 1;i <= n;++i) ins(s,i,1),ins(i + n,g,1);
	for(i = 1;i <= n;++i){
		int dy = 0;
		for(j = 1;j <= n;++j) if(lx[i] < a[i][j]) lx[i] = a[i][j],dy = j;
		ins(i,dy + n,1);
	}
	while(1){
		while(bfs()) now += dfs(s,n);
		if(now == n) return;
		for(i = 1;i <= n;++i) if(vis[i]) ud(i);
		do{
			int dlt = inf,dx = 0,dy = 0;
			for(i = 1;i <= n;++i) if(!vis[i + n] && dlt > slx[i]) dlt = slx[i],dx = bel[i],dy = i;
			for(i = 1;i <= n;++i) if(vis[i]) lx[i] -= dlt;
			for(i = 1;i <= n;++i){
				if(vis[i + n]) ly[i] += dlt;
				else slx[i] -= dlt;
			}
			ins(dx,dy + n,1);
			h = t = 0;ud(dx);
			q[++t] = dy + n;vis[dy + n] = vis[dx] + 1;
		}while(!bfs2());
	}
}
int main(){
	int i,j;
	cin>>n;
	for(i = 1;i <= n;++i) for(j = 1;j <= n;++j) cin>>a[i][j]; 
	wk();
	ans = 0;for(i = 1;i <= n;++i) ans += lx[i] + ly[i];
	cout<<ans;
	return 0;
}
