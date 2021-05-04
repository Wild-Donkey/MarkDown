//µÑ¿¨¶ûÊ÷ 
#include<bits/stdc++.h>
using namespace std;
struct node{
	int k,v;
}a[200010];
struct tree{
	int f,ls,rs;
	node d;
}t[200010];
int read(){
	int x = 0,y = 0,c = gc;
	while(!isdigit(c)) y = c,c = gc;
	while(isdigit(c)) x = (x << 1) + (x << 3) + (c ^ '0'),c = gc;
	return y == '-' ? -x : x;
}
bool cmp(node q,node w){
	return q.k < w.k;
}
int n;
int st[200010],ft,cnt;
void rotate(int q){
	int p = t[q].f;
	if(t[t[p].f].ls == p) t[t[p].f].ls = q;
	else if(t[t[p].f].rs == p) t[t[p].f].rs = q;
	t[q].f = t[p].f;
	t[p].f = q;
	t[t[q].ls].f = p;
	t[p].rs = t[q].ls;
	t[q].ls = p;
}
int root;
int main(){
	int i,j;
	n = read();
	for(i = 1;i <= n;++i){
		a[i].k = read();
		a[i].v = read();
	}
	sort(a + 1,a + n + 1,cmp);
	t[++cnt].d = a[1];
	root = 1;
	st[++ft] = 1;
	for(i = 2;i <= n;++i){
		t[++cnt].d = a[i];
		t[cnt].f = st[ft];
		t[st[ft]].rs = cnt;
		while(ft && a[i].v < a[st[ft]].v){
			rotate(i);
			--ft;
		}
		if(!ft) root = i;
		st[++ft] = i; 
	} 
	return 0;
}
