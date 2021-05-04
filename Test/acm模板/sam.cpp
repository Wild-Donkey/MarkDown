//后缀自动机
#include<bits/stdc++.h>
using namespace std;
char c[2000010];
int son[3000010][26],pre[3000010],len[3000010],size[3000010],sm[3000010],as[3000010];
int n,cnt,lst;
void insert(int nw){
    int p = lst,np = ++cnt;
    lst = np;
    len[np] = len[p] + 1;
    while(p && !son[p][nw]){
        son[p][nw] = np;
        p = pre[p];
    }
    if(!p) pre[np] = 1;
    else{
        int q = son[p][nw];
        if(len[p] + 1 == len[q]) pre[np] = q;
        else{
            int nq = ++cnt;
            len[nq] = len[p] + 1;
            for(int i = 0;i < 26;++i) son[nq][i] = son[q][i];
            pre[nq] = pre[q];
            pre[q] = pre[np] = nq;
            while(son[p][nw] == q){
                son[p][nw] = nq;
                p = pre[p];
            }
        }
    }
    size[np] = 1;
}
void build(){
    cnt = 1;
    lst = 1;
    for(int i = 1;i <= n;++i) insert(c[i] - 'a');
}
long long ans;
void run(){
    int i,j;
    for(i = 1;i <= cnt;++i) ++sm[len[i]];
    for(i = 1;i <= cnt;++i) sm[i] += sm[i - 1];
    for(i = 1;i <= cnt;++i) as[sm[len[i]]--] = i;
    for(i = cnt;i;--i){
        j = as[i];
        size[pre[j]] += size[j];
        if(size[j] > 1) ans = max(ans,1ll * size[j] * len[j]);
    }
}
int main(){
    scanf("%s",c + 1);
    n = strlen(c + 1);
    build();
    run();
    printf("%lld",ans);
    return 0;
}
