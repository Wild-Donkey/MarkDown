//最小树形图（可并堆） 
#include<bits/stdc++.h>
using namespace std;
int n,m,r,as;
int rt[100010],cnt,nw,vis[100010];
int to[100010],vl[100010],c[100010],f[100010],ls[100010],rs[100010],len[100010];
inline int getf(int q){
	return f[q] == q ? q : f[q] = getf(f[q]);
}
inline void ud(int q,int x){
	c[q] += x;vl[q] += x;
}
inline void ps(int q){
	if(!c[q]) return;
	if(ls[q]) ud(ls[q],c[q]);
	if(rs[q]) ud(rs[q],c[q]);
	c[q] = 0;
}
inline int mg(int u,int v){
	if(!u || !v) return u + v;
	ps(u);ps(v);
	if(vl[u] > vl[v]) swap(u,v);
	rs[u] = mg(rs[u],v);
	if(len[ls[u]] < len[rs[u]]) swap(ls[u],rs[u]);
	len[u] = len[rs[u]] + 1;
	return u;
}
int st[100010],ft;
inline void dfs(int q){
	if(q == r || (vis[q] && vis[q] != nw)) return;
	if(vis[q]){
		int j;
		while(1){
			j = st[ft--];
			if(q == j) break;
			rt[q] = mg(rt[q],rt[j]);
			f[getf(j)] = q;
		}
	}
	while(q == getf(to[rt[q]])) rt[q] = mg(ls[rt[q]],rs[rt[q]]);
	if(!rt[q]){
		puts("-1");exit(0);
	}
	vis[q] = nw;st[++ft] = q;
	int x = getf(to[rt[q]]),y = vl[rt[q]];
	rt[q] = mg(ls[rt[q]],rs[rt[q]]);
	if(rt[q]) ud(rt[q],-y);
	as += y;
	dfs(x);
}
int main(){
    int i,u,v,w;
	cin>>n>>m>>r;for(i = 1;i <= n;++i) f[i] = i;
	for(i = 1;i <= m;++i){
		cin>>u>>v>>w;
		if(u == v) continue;
		to[++cnt] = u;vl[cnt] = w;len[cnt] = 1;rt[v] = mg(rt[v],cnt);
	}
	for(i = 1;i <= n;++i) if(!vis[getf(i)]){
		++nw;ft = 0;dfs(getf(i));
	}
	cout<<as;
    return 0;
}
