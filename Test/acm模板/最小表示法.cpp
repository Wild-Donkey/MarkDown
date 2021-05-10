//最小表示法
#include<bits/stdc++.h>
using namespace std;
char c[1000010];
int n;
int main(){
	int i,j,k,l;
	scanf("%s",c + 1),
	n = strlen(c + 1);
	i = 1;
	j = 2;
	k = 0;
	while(i <= n && j <= n && k < n){
		l = c[(i + k - 1) % n + 1] - c[(j + k - 1) % n + 1];
		if(!l) ++k;
		else{
			if(l > 0) i += k + 1;
			else j += k + 1;
			if(i == j) ++j;
			k = 0;
		} 
	}
	printf("%d",min(i,j));
	return 0;
}
