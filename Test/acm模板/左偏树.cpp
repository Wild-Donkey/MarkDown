//左偏树（可并堆） 
#include<bits/stdc++.h>
using namespace std;
struct node{
	int w,bh;
	bool operator > (const node &q)const{
		return w == q.w ? bh > q.bh : w > q.w;
	}
};
struct tree{
	node v;
	int ls,rs,len;
}t[100010];
int n,m,f[100010];
bool del[100010];
int getf(int q){
	return f[q] == q ? q : f[q] = getf(f[q]);
}
void mg(int q,int w){
	f[getf(w)] = getf(q);
}
int merge(int q,int w){
	if(!q) return w;
	if(!w || q == w) return q;
	if(t[q].v > t[w].v) swap(q,w);
	mg(q,w);
	t[q].rs = merge(t[q].rs,w);
	if(!t[q].ls || !t[q].rs) t[q].len = 0;
	else t[q].len = min(t[t[q].ls].len,t[t[q].rs].len) + 1;
	if(t[t[q].ls].len < t[t[q].rs].len || (!t[q].ls && t[q].rs)) swap(t[q].ls,t[q].rs);
	return q;
}
int top(int q){
	int as = getf(q);
	if(!t[as].ls){
		del[as] = 1;
		return t[as].v.w;
	}
	else if(t[as].ls && !t[as].rs) f[t[as].ls] = f[as] = t[as].ls;
	else if(t[t[as].ls].v > t[t[as].rs].v) f[t[as].rs] = f[as] = t[as].rs;
	else f[t[as].ls] = f[as] = t[as].ls;
	del[as] = 1;merge(t[as].ls,t[as].rs);
	return t[as].v.w;
}
int main(){
	int i,u,v,w;
	cin>>n>>m;
	for(i = 1;i <= n;++i){
		cin>>t[i].v.w;
		t[i].v.bh = i;
		f[i] = i;
	}
	for(i = 1;i <= m;++i){
		cin>>u>>v;
		if(u == 1){//操作1： 将第x个数和第y个数所在的小根堆合并
			cin>>w; 
			if(del[v] || del[w]) continue;
			merge(getf(v),getf(w));
		}
		else{//操作2： 输出第x个数所在的堆最小数，并将其删除
			if(del[v]) printf("-1\n");
			else cout<<top(v)<<endl;
		} 
	}
	return 0;
} 
