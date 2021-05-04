#include<bits/stdc++.h>
using namespace std;
int n,a[1010][1010],lx[1010],ly[1010],sl[1010],bel[1010],mtx[1010],mty[1010];
bool vx[1010],vy[1010];
int q[100010],h,t;
#define inf 0x3f3f3f3f
inline void ins(int x){
	q[++t] = x;vx[x] = 1;
	for(int y = 1;y <= n;++y) if(sl[y] > lx[x] + ly[y] - a[x][y]){
		sl[y] = lx[x] + ly[y] - a[x][y];
		bel[y] = x;
	}
}
void mdf(int y){
	if(mtx[bel[y]]) mdf(mtx[bel[y]]);
	mtx[bel[y]] = y;
	mty[y] = bel[y];
}
bool bfs(){
	while(h < t){
		int x = q[++h];
		for(int y = 1;y <= n;++y) if(!vy[y] && lx[x] + ly[y] == a[x][y]){
			vy[y] = 1;bel[y] = x;
			if(!mty[y]){
				mdf(y);
				return 1;
			}
			if(!vx[mty[y]]) ins(mty[y]);
		}
	}
	return 0;
}
int km(){
	int i,j,x,y;
	for(i = 1;i <= n;++i){
		lx[i] = -inf;ly[i] = 0;
		for(j = 1;j <= n;++j) lx[i] = max(lx[i],a[i][j]);
	}
	for(x = 1;x <= n;++x){
		h = t = 0;
		for(i = 1;i <= n;++i) sl[i] = inf,vx[i] = vy[i] = bel[i] = 0;
		ins(x);
		while(!bfs()){
			int dlt = inf;
			for(y = 1;y <= n;++y) if(!vy[y]) dlt = min(dlt,sl[y]);
			for(i = 1;i <= n;++i) if(vx[i]) lx[i] -= dlt;
			for(y = 1;y <= n;++y){
				if(vy[y]) ly[y] += dlt;
				else sl[y] -= dlt;
			}
			bool fg = 0;
			for(y = 1;y <= n;++y) if(!sl[y] && !vy[y]){
				vy[y] = 1;
				if(!mty[y]){
					mdf(y);
					fg = 1;
					break;
				}
				ins(mty[y]);
			}
			if(fg) break;
		}
	}
	int ans = 0;
	for(i = 1;i <= n;++i) ans += lx[i] + ly[i];
	return ans;
}
int main(){
	int i,j;
	cin>>n;
	for(i = 1;i <= n;++i) for(j = 1;j <= n;++j) cin>>a[i][j];
	cout<<km();
	return 0;
}
