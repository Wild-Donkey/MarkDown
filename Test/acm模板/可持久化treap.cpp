//可持久化treap
//功能：在历史版本上进行插入、删除、查询排名、查询第k大、查询前驱、查询后继 
#include<bits/stdc++.h>
#define li long long
using namespace std;
struct tr{
	int k,v,ls,rs,size,num;
}t[20000010];
int root[500010];
int n,cnt;
li q1 = 19260817,q2 = 23333333,q3 = 998244353,srd = 67108867;
li rd(){
	return srd = (srd * q1 + q2) % q3;
}
pair<int,int> split(int rt,int k){
	if(!rt) return make_pair(0,0);
	t[++cnt] = t[rt];
	if(t[t[cnt].ls].size >= k){
		int tp = cnt;
		pair<int,int> p = split(t[tp].ls,k);
		t[tp].size -= t[p.first].size;
		t[tp].ls = p.second;
		return make_pair(p.first,tp);
	}
	else if(t[t[cnt].ls].size + t[cnt].num >= k){
		t[cnt].size -= t[t[cnt].rs].size;
		int tmp = t[cnt].rs;
		t[cnt].rs = 0;
		return make_pair(cnt,tmp);
	}
	else{
		int tp = cnt;
		pair<int,int> p = split(t[tp].rs,k - t[t[tp].ls].size - t[tp].num);
		t[tp].size -= t[p.second].size;
		t[tp].rs = p.first;
		return make_pair(tp,p.second);
	}
}
int merge(int q,int w){
	if(!q) return w;
	if(!w) return q;
	if(t[q].k < t[w].k){
		t[q].size += t[w].size;
		t[q].rs = merge(t[q].rs,w);
		return q;
	}
	else{
		t[w].size += t[q].size;
		t[w].ls = merge(q,t[w].ls);
		return w;
	}
}
int getrk(int rt,int q){
	if(!rt) return 0;
	int now = rt,ans = 0;
	while(t[now].v != q){
		if(t[now].v > q) now = t[now].ls;
		else{
			ans += t[t[now].ls].size + t[now].num;
			now = t[now].rs;
		}
		if(!now) break;
	}
	return ans + t[t[now].ls].size + 1;
}
int getnum(int rt,int q){
	if(!rt) return 0;
	int now = rt;
	while(1){
		if(t[t[now].ls].size >= q) now = t[now].ls;
		else if(t[t[now].ls].size + t[now].num >= q) return t[now].v;
		else{
			q -= t[t[now].ls].size + t[now].num;
			now = t[now].rs;
		}
		if(!now) return 0;
	}
}
int getlb(int rt,int q){
	if(!rt) return -2147483647;
	int now = rt,ans = -2147483647;
	while(1){
		if(t[now].v >= q) now = t[now].ls;
		else{
			ans = t[now].v;
			now = t[now].rs;
		}
		if(!now) return ans;
	}
}
int getub(int rt,int q){
	if(!rt) return 2147483647;
	int now = rt,ans = 2147483647;
	while(1){
		if(t[now].v <= q) now = t[now].rs;
		else{
			ans = t[now].v;
			now = t[now].ls;
		}
		if(!now) return ans;
	}
}
int newnode(int rt,int q,bool f){
	t[++cnt] = t[rt];
	int tp = cnt;
	if(f) ++t[tp].size;
	else --t[tp].size;
	if(t[rt].v == q){
		if(f) ++t[tp].num;
		else --t[tp].num;
	}
	else if(t[tp].v > q) t[tp].ls = newnode(t[tp].ls,q,f);
	else t[tp].rs = newnode(t[tp].rs,q,f);
	return tp;
}
int insert(int rt,int q){
	if(!rt){
		t[++cnt].v = q;
		t[cnt].k = rd();
		t[cnt].size = t[cnt].num = 1;
		return cnt;
	}
	int now = rt,tmp,as = 0;
	while(1){
		if(t[now].v == q) return newnode(rt,q,1);
		else if(t[now].v > q) tmp = t[now].ls;
		else {
			as += t[t[now].ls].size + t[now].num;
			tmp = t[now].rs;
		}
		if(!tmp){
			t[++cnt].k = rd();
			t[cnt].v = q;
			t[cnt].size = t[cnt].num = 1;
			int tp = cnt;
			pair<int,int> p = split(rt,as);
			return merge(merge(p.first,tp),p.second);
		}
		now = tmp;
	}
}
int del(int rt,int q){
	if(!rt) return 0;
	int now = rt,as = 0;
	while(1){
		if(t[now].v == q){
			if(t[now].num > 1) return newnode(rt,q,0);
			else{
				as += t[t[now].ls].size;
				pair<int,int> p = split(rt,as);
				p = make_pair(p.first,split(p.second,1).second);
				return merge(p.first,p.second);
			}
		}
		else if(t[now].v > q) now = t[now].ls;
		else{
			as += t[t[now].ls].size + t[now].num;
			now = t[now].rs;
		}
		if(!now) return rt;
	}
}
int main(){
	int u,v,w,i,j;
	cin>>n;
	for(i = 1;i <= n;++i){
		cin>>u>>v>>w;
		if(v == 1) root[i] = insert(root[u],w); //插入 
		else if(v == 2) root[i] = del(root[u],w);//删除 
		else if(v == 3){//查询排名 
			cout<<getrk(root[u],w))<<endl;
			root[i] = root[u];
		}
		else if(v == 4){//查询第k小 
			cout<<getnum(root[u],w)<<endl;
			root[i] = root[u];
		}
		else if(v == 5){//前驱 
			cout<<getlb(root[u],w)<<endl;
			root[i] = root[u];
		}
		else{//后继 
			cout<<getub(root[u],w))<<endl;
			root[i] = root[u];
		}
	}
	return 0;
}
