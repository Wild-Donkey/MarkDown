//manacher
#include<bits/stdc++.h>
using namespace std;
int n;
char c[11000010],d[22000010];
int mx,mid,ans,as[22000010];
int main(){
	int i,j,k;
	scanf("%s",c + 1);
	n = strlen(c + 1);
	d[0] = '&';
	for(i = 1;i <= n;++i){
		d[(i << 1) - 1] = '*';
		d[(i << 1)] = c[i]; 
	}
	n <<= 1;
	++n;
	d[n] = '*';
	d[n + 1] = '@';
	for(i = 1;i <= n;++i){
		if(i + as[mid * 2 - i] < mx){
			as[i] = as[mid * 2 - i];
		}
		else{
			for(j = max(mx,i + 1);j <= n;++j){
				if(d[j] != d[i * 2 - j]) break;
			}
			--j;
			mx = j;
			mid = i;
			as[i] = j - i;
			ans = max(ans,as[i]);
		}
	}
	printf("%d",ans);
	return 0;
}
