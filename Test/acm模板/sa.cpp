//ºó×ºÊý×é
#include<bits/stdc++.h>
using namespace std;
char c[1000010];
int as[2000010],b[1000010],d[1000010],n,e[1000010],h[1000010];
int q[130],s[130];
struct node{
    int num,now;
}f[1000010],g[1000010];
int nw[1000010];
int main(){
    int i,j,l,k;
    scanf("%s",c + 1);
    n = strlen(c + 1);
    for(i = 1;i <= n;++i) ++q[c[i]];
    for(i = 0;i <= 122;++i){
        if(q[i]) s[i] = s[i - 1] + 1;
        else s[i] = s[i - 1];
    }
    for(i = 1;i <= n;++i) as[i] = s[c[i]];
    nw[1] = 1;
    for(i = 0;i <= 19;++i){
        memset(e,0,sizeof(e));memset(h,0,sizeof(h));memset(b,0,sizeof(b));memset(d,0,sizeof(d));
        l = 1 << i;
        for(j = 1;j <= n;++j){
            f[j].num = j;
            f[j].now = as[j];
        }
        for(j = 1;j <= n;++j) ++e[as[j + l]];
        for(j = 1;j <= n;++j) h[j] = h[j - 1] + e[j - 1];
        for(j = 1;j <= n;++j) g[++h[as[j + l]]] = f[j];
        for(j = 1;j <= n;++j) ++b[g[j].now];
        for(j = 1;j <= n;++j) d[j] = d[j - 1] + b[j - 1];
        for(j = 1;j <= n;++j) f[++d[g[j].now]] = g[j];
       	k = 1;
        for(j = 2;j <= n;++j){
            if(f[j].now == f[j - 1].now && as[f[j].num + l] == as[f[j - 1].num + l]) nw[j] = k;
            else nw[j] = ++k;
        }
        for(j = 1;j <= n;++j) as[f[j].num] = nw[j];
    }
    for(i = 1;i <= n;++i) cout<<f[i].num<<" ";
    return 0;
}
