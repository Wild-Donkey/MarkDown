//可持久化并查集 
#include<bits/stdc++.h>
#define ln ls[q],l,mid
#define rn rs[q],mid + 1,r
#define md int mid = l + r >> 1
using namespace std;
int t[7000010],sz[7000010],ls[7000010],rs[7000010],rt[200010],cnt,n,m;
void init(int &q,int l,int r){
    q = ++cnt;
    if(l == r){
        t[q] = l;sz[q] = 1;return;
    }
    md;
    init(ln);init(rn);
}
void xg(int lst,int &q,int l,int r,int p,int x,int fg){
    q = ++cnt;
    if(l == r){
        t[q] = x;sz[q] = sz[lst] + fg;return;
    }
    md;
    if(mid >= p) {
        xg(ls[lst],ln,p,x,fg);rs[q] = rs[lst];
    }
    else{
        ls[q] = ls[lst];xg(rs[lst],rn,p,x,fg);
    }
}
pair<int,int> qry(int q,int l,int r,int x){
    if(l == r) return make_pair(t[q],sz[q]);
    md;
    if(mid >= x) return qry(ln,x);
    else return qry(rn,x);
}
pair<int,int> getf(int q,int x){
    pair<int,int> p = qry(rt[q],1,n,x);
    if(p.first == x) return p;
    return getf(q,p.first);
}
int main(){
    int i,j,k,u,v;
    pair<int,int> f1,f2;
    cin>>n>>m;
    init(rt[0],1,n);
    for(i = 1;i <= m;++i){
        k = read();
        if(k == 1){//合并两点 
            cin>>u>>v;
            f1 = getf(i - 1,u);f2 = getf(i - 1,v);
            if(f1.second > f2.second) swap(f1,f2);
            xg(rt[i - 1],rt[i],1,n,f1.first,f2.first,0);
            if(f1.second == f2.second) xg(rt[i],rt[i],1,n,f2.first,f2.first,1);
        }
        else if(k == 2){//恢复历史版本 
            cin>>u;rt[i] = rt[u];
        }
        else{//查询两点是否连通 
            u = read();v = read();
            rt[i] = rt[i - 1];
            f1 = getf(i,u);f2 = getf(i,v);
            putchar(f1.first == f2.first ? '1' : '0');putchar('\n')； 
        }
    }
    return 0;
}
