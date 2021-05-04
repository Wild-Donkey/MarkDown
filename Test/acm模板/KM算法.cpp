#include <bits/stdc++.h>
using namespace std;
const int maxn = 505;
const int inf = 0x3f3f3f3f;
int N, M;
int lx[maxn], ly[maxn], C[maxn][maxn], slack[maxn];
bool inU[maxn], inV[maxn];
int matchx[maxn], matchy[maxn];
int pre[maxn];
queue<int> q;
void addToU(int x) {
	q.push(x);
	inU[x] = 1; 
	for (int y = 1; y <= N; ++y) {
		if (lx[x]+ly[y]-C[x][y] < slack[y]) {
			slack[y] = lx[x]+ly[y]-C[x][y];
			pre[y] = x; 
		}
	}
}
void change(int y) { 
	if (matchx[pre[y]])  change(matchx[pre[y]]); 
	matchy[y] = pre[y];
	matchx[pre[y]] = y; 
}
bool bfs() { 
	while (!q.empty()) {
		int x = q.front(); 
		q.pop();
		for (int y = 1; y <= N; ++y) { 
            if (lx[x]+ly[y] != C[x][y])  continue;
			if (inV[y])  continue; 
			inV[y] = 1,pre[y] = x; 
			if (!matchy[y]) { 
				change(y);
				return 1;
			}
			if(!inU[matchy[y]])  addToU(matchy[y]);
		}
	}
	return 0;
}
void KM() { 
	for (int i = 1; i <= N; ++i) {
		lx[i] = -inf, ly[i] = 0;
		for (int j = 1; j <= N; ++j) {
			lx[i] = max(lx[i], C[i][j]);
		}
	}
	for (int x = 1; x <= N; ++x) {
		for (int i = 1; i <= N; ++i) {
			pre[i] = inU[i] = inV[i] = 0;
			slack[i] = inf;
		}
		while (!q.empty())  q.pop();
		addToU(x);
		while (!bfs()) {
			int delta = inf;
			for (int i = 1; i <= N; ++i) {
				if (!inV[i])  delta=min(delta, slack[i]);
			}
			for (int i = 1; i <= N; ++i) {
				if (inU[i])  lx[i]-=delta;
				if (inV[i])  ly[i]+=delta;
				if (!inV[i]) slack[i] -= delta;
			}
			bool b = 0;
			for (int y = 1; y <= N; ++y) {
				if (!inV[y] && !slack[y]) {
                    inV[y] = 1;
					if (!matchy[y]) { 
						change(y);
						b = 1; break; 
					}
					addToU(matchy[y]); 
				}
			}
			if (b)  break;
		}
	} 
}
int main() {
    /*cin >> N >> M;
    for (int i = 1; i <= N; ++i)
    	for (int j = 1; j <= N; ++j) 
    		C[i][j] = -inf;
    for (int i = 0; i < M; ++i) {
    	int u, v, c;
    	cin >> u >> v >> c;
    	C[u][v] = c;
    }*/
    cin>>N;
	for(int i = 1;i <= N;++i)
		for(int j = 1;j <= N;++j) cin>>C[i][j]; 
    KM();
    int ans=0;
    for (int i = 1; i <= N; ++i)
    	ans += C[i][matchx[i]];
    cout << ans << endl;
    return 0;
}
