//k¶ÌÂ·£¨¿É²¢¶Ñ£© 
#include<bits/stdc++.h>
using namespace std;
int n,m,ans;
#define db double
#define eps 1e-8
db tot;
struct edge{
	int to,nxt;
	db val;
}e[200010],e2[200010];
int cnt,fir[5010],f2[5010];
void ins(int u,int v,db w){
	e[++cnt].to = v;e[cnt].nxt = fir[u];fir[u] = cnt;e[cnt].val = w;
	e2[cnt].to = u;e2[cnt].nxt = f2[v];f2[v] = cnt;e2[cnt].val = w;
}
db dis[5010];
#define mp make_pair
#define fi first
#define se second
#define pdi pair<db,int>
#define ppd pair<pdi,int>
priority_queue<pdi > q1,q2;
struct node{
	int l,r,len;
	pdi x;
}t[1500010];
int rt[5010],fa[5010],fsts[5010],nxt[5010],ed[5010],ct;
int mg(int q,int w){
	if(!q) return w;
	if(!w) return q;
	int nw = ++ct;
	if(t[q].x.fi > t[w].x.fi) swap(q,w);
	t[nw] = t[q];
	t[nw].r = mg(t[q].r,w);
	if(t[t[nw].l].len < t[t[nw].r].len) swap(t[nw].l,t[nw].r);
	t[nw].len = t[t[nw].r].len + 1;
	return nw;
}
void dfs(int q){
	rt[q] = rt[fa[q]];
	if(q != n){
		for(int i = fir[q];i;i = e[i].nxt) if(i != ed[q]){
			int p = ++ct;t[p].x = mp(e[i].val - dis[q] + dis[e[i].to],i);
			rt[q] = mg(rt[q],p);
		} 
	}
	for(int i = fsts[q];i;i = nxt[i]) dfs(i);
}
int main(){
	int i,j,u,v;db w;
	cin>>n>>m;scanf("%lf",&tot);
	for(i = 1;i <= m;++i){
		cin>>u>>v;scanf("%lf",&w);ins(u,v,w);
	}
	for(i = 1;i <= n - 1;++i) dis[i] = 987654321.0;
	q1.push(mp(0,n));
	while(!q1.empty()){
		pdi p = q1.top();q1.pop();
		if(-p.fi != dis[p.se]) continue;
		for(i = f2[p.se];i;i = e2[i].nxt){
			if(dis[e2[i].to] > -p.fi + e2[i].val){
				dis[e2[i].to] = -p.fi + e2[i].val;
				fa[e2[i].to] = p.se;ed[e2[i].to] = i;
				q1.push(mp(-dis[e2[i].to],e2[i].to));
			}
		}
	}
	++ans;tot -= dis[1];
	for(i = 1;i < n;++i) nxt[i] = fsts[fa[i]],fsts[fa[i]] = i;
	dfs(n);
	pdi tp,tp2;
	if(rt[1]) q2.push(mp(-t[rt[1]].x.fi,rt[1]));
	while(!q2.empty()){
		tp = q2.top();q2.pop();tp.fi *= -1;
		if(tot - dis[1] - tp.fi < -eps) break;
		tot -= dis[1] + tp.fi;++ans;
		if(t[tp.se].l) q2.push(mp(-(tp.fi + t[t[tp.se].l].x.fi - t[tp.se].x.fi),t[tp.se].l));
		if(t[tp.se].r) q2.push(mp(-(tp.fi + t[t[tp.se].r].x.fi - t[tp.se].x.fi),t[tp.se].r));
		if(rt[e[t[tp.se].x.se].to]) q2.push(mp(-(tp.fi + t[rt[e[t[tp.se].x.se].to]].x.fi),rt[e[t[tp.se].x.se].to]));
	}
	cout<<ans;
	return 0;
}
