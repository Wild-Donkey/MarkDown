//×îÐ¡Ô²¸²¸Ç 
#include<bits/stdc++.h>
#define db double
using namespace std;
struct node{
	db x,y;
	node(db _x = 0.0,db _y = 0.0){
		x = _x;y = _y;
	}
}a[100010];
node operator + (node a,node b){
	return node(a.x + b.x,a.y + b.y);
}
node operator - (node a,node b){
	return node(a.x - b.x,a.y - b.y);
}
node operator * (node a,db b){
	return node(a.x * b,a.y * b);
}
node operator / (node a,db b){
	return node(a.x / b,a.y / b);
}
int n;
node o;
db r;
db dis(node q,node w){
	return sqrt((q.x - w.x) * (q.x - w.x) + (q.y - w.y) * (q.y - w.y));
}
bool inc(node q){
	return dis(q,o) <= r ? 1 : 0;
}
node calc(db a,db b,db c,db d,db e,db f){
	db x = (b * f - c * e) / (a * e - b * d);
	db y = (a * f - c * d) / (b * d - a * e);
	return node(x,y);
}
void solve(node a,node b,node c){
	db q = a.x - b.x,w = a.y - b.y,e = (b.x * b.x + b.y * b.y - a.x * a.x - a.y * a.y) / 2;
	db p = a.x - c.x,t = a.y - c.y,u = (c.x * c.x + c.y * c.y - a.x * a.x - a.y * a.y) / 2;
	o = calc(q,w,e,p,t,u);
	r = dis(o,a);
}
int main(){
	int i,j,k;
	scanf("%d",&n);
	for(i = 1;i <= n;++i) scanf("%lf%lf",&a[i].x,&a[i].y);
	random_shuffle(a + 1,a + n + 1);
	for(i = 1;i <= n;++i){
		if(!inc(a[i])){
			o = a[i];r = 0;
			for(j = 1;j < i;++j){
				if(!inc(a[j])){
					o = (a[i] + a[j]) / 2;
					r = dis(o,a[i]);
					for(k = 1;k < j;++k){
						if(!inc(a[k])) solve(a[i],a[j],a[k]);
					}
				}
			}
		}
	}
	printf("%.10lf\n%.10lf %.10lf",r,o.x,o.y);
	return 0;
}
