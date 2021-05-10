//·ÑÓÃÁ÷ 
#define inf 987654321
struct edge{
    int to,nxt,val,cst;
}e[100010];
int cnt = 1,fir[2010];
void ins(int u,int v,int w,int x){
    e[++cnt].to = v;e[cnt].nxt = fir[u];fir[u] = cnt;e[cnt].val = w;e[cnt].cst = x;
    e[++cnt].to = u;e[cnt].nxt = fir[v];fir[v] = cnt;e[cnt].val = 0;e[cnt].cst = -x;
}
int dq[2010],dis[2010],q[100010],h,t,s,g;
bool vst[2010],vis[2010];
bool bfs(){
    int i,j;
    h = t = 0;
    for(i = 1;i <= g;++i) dis[i] = inf,vst[i] = vis[i] = 0;
    dis[s] = 0;q[++t] = s;vst[s] = 1;
    while(h < t){
        j = q[++h];
        vst[j] = 0;
        for(i = fir[j];i;i = e[i].nxt) if(e[i].val > 0){
            if(e[i].cst + dis[j] < dis[e[i].to]){
                dis[e[i].to] = dis[j] + e[i].cst;
                if(!vst[e[i].to]){
                    vst[e[i].to] = 1;
                    q[++t] = e[i].to;
                }
            }
        }
    }
    return dis[g] < inf;
}
int dfs(int q,int fl){
    if(q == g) return fl;
    vis[q] = 1;
    int tp,as = 0;
    for(int &i = dq[q];i;i = e[i].nxt) if(e[i].val > 0 && !vis[e[i].to]){
        if(e[i].cst + dis[q] != dis[e[i].to]) continue;
        tp = dfs(e[i].to,min(fl,e[i].val));
        fl -= tp;as += tp;
        e[i].val -= tp;e[i ^ 1].val += tp;
        if(!fl){
            vis[q] = 0;
            return as;
        }
    }
    if(!as) dis[q] = -1;
    return as;
}
int work(){
    int an = 0,tp;
    while(bfs()){
        for(int i = 1;i <= g;++i) dq[i] = fir[i];
        while(tp = dfs(s,inf)){
            an += tp;
            as += tp * dis[g];
        }
    }
    return an;
}
