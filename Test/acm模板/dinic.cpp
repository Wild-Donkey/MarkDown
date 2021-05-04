//dinic
#define inf 987654321
int q[100010],h,t,s,g,dq[10010];
int vst[10010];
struct edge{
    int to,nxt,val;
}e[100010];
int cnt = 1,fir[100010];
void ins(int u,int v,int w){
    e[++cnt].to = v;e[cnt].nxt = fir[u];fir[u] = cnt;e[cnt].val = w;
    e[++cnt].to = u;e[cnt].nxt = fir[v];fir[v] = cnt;e[cnt].val = 0;
}
bool bfs(){
    int i,j;
    for(i = 1;i <= g;++i) vst[i] = 0;
    h = t = 0;
    q[++t] = s;vst[s] = 1;
    while(h < t){
        j = q[++h];
        for(i = fir[j];i;i = e[i].nxt) if(e[i].val > 0 && !vst[e[i].to]){
            vst[e[i].to] = vst[j] + 1;
            q[++t] = e[i].to;
        }
    } 
    return vst[g];
}
int dfs(int q,int fl){
    if(q == g) return fl;
    int as = 0,tp;
    for(int &i = dq[q];i;i = e[i].nxt) if(e[i].val > 0){
        if(vst[q] + 1 != vst[e[i].to]) continue;
        tp = dfs(e[i].to,min(fl,e[i].val));
        as += tp;fl -= tp;
        e[i].val -= tp;e[i ^ 1].val += tp;
        if(!fl) return as;
    }
    if(!as) vst[q] = -1;
    return as;
}
int work(){
    int as = 0,tp;
    while(bfs()){
        for(int i = 1;i <= g;++i) dq[i] = fir[i];
        if(tp = dfs(s,inf)) as += tp;
    }
    return as;
}
