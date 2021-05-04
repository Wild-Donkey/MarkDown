//∂≈ΩÃ…∏£®«Ûmiu∫Õphi£© 
#include<bits/stdc++.h>
using namespace std;
#define li long long
#define mx 6666666
int p[1000010],miu[mx + 10],phi[mx + 10],smiu[mx + 10],t,n,cnt;
li sphi[mx + 10];
bool notp[mx + 10];
map<int,li> ssp;
map<int,int> ssm;
pair<li,int> work(int q){
    if(q <= mx) return make_pair(sphi[q],smiu[q]);
    if(ssp[q]) return make_pair(ssp[q],ssm[q]);
    li t1 = q * (q + 1ll) >> 1,t2 = 1;
    pair<li,int> t;
    li i = 2,j;
    while(i <= q){
        j = q / i;
        if(j <= mx) t = make_pair(sphi[j],smiu[j]);
        else t = work(j);
        j = q / j;
        t1 -= t.first * (j - i + 1);
        t2 -= t.second * (j - i + 1);
        i = j + 1;
    }
    return make_pair(ssp[q] = t1,ssm[q] = t2);
}
int main(){
    miu[1] = phi[1] = smiu[1] = sphi[1] = notp[1] = 1;
    int i,j,k,l;
    for(i = 2;i <= mx;++i){
        if(!notp[i]){
            p[++cnt] = i;
            miu[i] = -1;
            phi[i] = i - 1;
        }
        smiu[i] = smiu[i - 1] + miu[i];
        sphi[i] = sphi[i - 1] + phi[i];
        for(j = 1;j <= cnt && p[j] * i <= mx;++j){
            notp[p[j] * i] = 1;
            if(i % p[j] == 0){
                miu[i * p[j]] = 0;
                phi[i * p[j]] = phi[i] * p[j];
                break;
            }
            miu[i * p[j]] = miu[i] * miu[p[j]];
            phi[i * p[j]] = phi[i] * phi[p[j]];
        }
    }
    scanf("%d",&t);
    for(i = 1;i <= t;++i){
        scanf("%d",&n);
        if(n <= mx){
            printf("%lld%d\n",sphi[n],smiu[n]);
            continue;
        }
        if(ssp[n]){
            printf("%lld%d\n",ssp[n],ssm[n]);
            continue;
        }
        pair<li,int> p = work(n);
        printf("%lld%d\n",p.first,p.second);
    }
    return 0;
}
