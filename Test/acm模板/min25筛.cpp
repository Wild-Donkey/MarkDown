//min25ɸ(loj6053 f(p^c)=p xor c) 
#include<bits/stdc++.h>
using namespace std;
#define li long long
const int mo = 1000000007;
bool notp[10000010];
li n,m,cnt,tot,p[1000010],s[1000010],dy[2000010],q1[1000010],p1[1000010],q2[1000010],p2[1000010];
int work(li q,int w){
	if(q <= 1 || q < p[w]) return 0;
	li ans,tp1,tp2;
	if(q <= n / q) ans = (q2[q] - q1[q] - s[w - 1] + w - 1 + mo + mo) % mo;
	else ans = (p2[n / q] - p1[n / q] - s[w - 1] + w - 1 + mo + mo) % mo;
	if(w == 1) ans += 2;
	for(int i = w;i <= cnt && 1ll * p[i] * p[i] <= q;++i){
		tp1 = p[i];tp2 = tp1 * p[i];
		for(int j = 1;tp2 <= q;++j){
			(ans += (p[i] ^ (j + 1)) + 1ll * (p[i] ^ j) * work(q / tp1,i + 1)) %= mo;
			tp1 = tp2;tp2 *= p[i];
		}
	}
	return ans;
}
int main(){
	cin>>n;m = sqrtl(n);notp[1] = 1;
	li i,j,k;
	for(i = 2;i <= m;++i){
		if(!notp[i]) p[++cnt] = i,s[cnt] = (s[cnt - 1] + i) % mo;
		for(j = 1;j <= cnt && i * p[j] <= m;++j){
			notp[i * p[j]] = 1;
			if(i % p[j] == 0) break; 
		}
	}
	for(i = 1;i <= n;i = j + 1){
		k = n / i;j = n / k;dy[++tot] = k;
		if(k <= j){
			q1[k] = (k - 1) % mo;q2[k] = (k + 2) % mo * q1[k] % mo;
			if(q2[k] & 1) q2[k] += mo;
			q2[k] /= 2; 
		}
		else{
			p1[j] = (k - 1) % mo;p2[j] = (k + 2) % mo * p1[j] % mo;
			if(p2[j] & 1) p2[j] += mo;
			p2[j] /= 2; 
		}
	}
	for(i = 1;i <= cnt;++i){
		for(j = 1;j <= tot && 1ll * p[i] * p[i] <= dy[j];++j){
			k = dy[j] / p[i];
			if(dy[j] <= n / dy[j]){
				(q1[dy[j]] += mo - q1[k] + i - 1) %= mo;
				(q2[dy[j]] += mo - p[i] * (q2[k] - s[i - 1]) % mo) %= mo;
			}
			else{
				if(k <= n / k){
					(p1[n / dy[j]] += mo - q1[k] + i - 1) %= mo;
					(p2[n / dy[j]] += mo - p[i] * (q2[k] - s[i - 1]) % mo) %= mo;
				}
				else{
					(p1[n / dy[j]] += mo - p1[n / k] + i - 1) %= mo;
					(p2[n / dy[j]] += mo - p[i] * (p2[n / k] - s[i - 1]) % mo) %= mo;
				}
			}
		}
	}
	cout<<(work(n,1) + 1) % mo;return 0;
}
