//store-wagner算法求无向图的全图最小割 
#include<bits/stdc++.h>
using namespace std;
#define inf 987654321
int n,m,e[310][310],as = inf,s,t,dis[310];
bool used[310];
char c[50];
int work(){
    int nw = 1,ct = 1,i,mx;
    dis[1] = 0;
    used[1] = 1;
    while(ct < n){
        for(i = 1;i <= n;++i){
            if(used[i]) continue;
            dis[i] += e[nw][i];
        }
        mx = 0;
        for(i = 1;i <= n;++i){
            if(used[i]) continue;
            if(dis[i] > mx){
                mx = dis[i];
                nw = i;
            }
        }
        ++ct;
        if(ct == n - 1) s = nw;
        if(ct == n) t = nw;
        used[nw] = 1;
    }
    return dis[t];
}
void merge(int s,int t){
    for(int i = 1;i <= n;++i){
        e[s][i] += e[t][i];
        e[i][s] = e[s][i];
    }
    for(int i = 1;i < n;++i){
        e[i][t] = e[i][n];
        e[t][i] = e[n][i];
    }
    e[s][s] = e[t][t] = 0;
    --n;
}
int main(){
    int i,u,v,w;
	cin>>n>>m;
    for(i = 1;i <= m;++i){
        cin>>u>>v>>w;
        e[u][v] = e[v][u] = w;
    }
    while(n > 1){
        for(i = 1;i <= n;++i) dis[i] = used[i] = 0;
        s = t = 1;
        as = min(as,work());
        merge(s,t);
    }
    cout<<as;
    return 0;
}
