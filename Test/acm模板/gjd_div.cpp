//¸ß¾«³ý·¨ nlogn 
#include<bits/stdc++.h>
using namespace std;
#define li long long
#define gc getchar()
#define pc putchar
inline li read(){
    li x = 0,y = 0,c = gc;
    while(!isdigit(c)) y = c,c = gc;
    while(isdigit(c)) x = x * 10 + c - '0',c = gc;
    return y == '-' ? -x : x;
}
inline void print(li q){
    if(q < 0) pc('-'),q = -q;
    if(q >= 10) print(q / 10);
    pc(q % 10 + '0');
}
#define pb push_back
struct gjd{
	vector<li> a;
	inline void clear(){
		vector<li>().swap(a);
	}
	inline gjd operator = (li x){
		clear();
		while(x){
			a.pb(x % 10);x /= 10;
		}
		return *this;
	}
	inline gjd read(){
		clear();
		int c = gc;
		while(!isdigit(c)) c = gc;
		while(c == '0') c = gc;
		if(c == -1) return *this;
		while(isdigit(c)) a.pb(c - '0'),c = gc;
		for(int i = 0;i < (int)a.size() - i - 1;++i) swap(a[i],a[a.size() - i - 1]);
		return *this;
	}
	inline void print(){
		if(!a.size()){
			pc('0');return;
		}
		for(int i = a.size() - 1;i >= 0;--i) pc(a[i] + '0');
	}
	inline li& operator [] (li x){return a[x];}
	inline li len(){return a.size();}
	inline void pb(li x){a.pb(x);}
	inline void resize(li x){a.resize(x);}
};
inline gjd turn(li x){gjd a;a = x;return a;}
inline li turn(gjd x){
	li a = 0,p = 1;
	for(int i = 0;i < x.len();++i) a += x[i] * p,p *= 10;
	return a;
}
inline li cmp(gjd q,gjd w){
	if(q.len() > w.len()) return 1;
	if(q.len() < w.len()) return -1;
	for(int i = q.a.size() - 1;i >= 0;--i){
		if(q[i] > w[i]) return 1;
		if(q[i] < w[i]) return -1;
	}
	return 0;
}
inline bool operator == (gjd q,gjd w){return !cmp(q,w);}
inline bool operator < (gjd q,gjd w){return cmp(q,w) == -1;}
inline bool operator > (gjd q,gjd w){return cmp(q,w) == 1;}
inline bool operator <= (gjd q,gjd w){return cmp(q,w) <= 0;}
inline bool operator >= (gjd q,gjd w){return cmp(q,w) >= 0;}
inline bool operator != (gjd q,gjd w){return cmp(q,w);}
inline gjd operator + (gjd a,li b){
	if(!a.len()) return turn(b);
	if(!b) return a;
	register int i;
	a[0] += b;
	for(i = 0;a[i] >= 10 && i + 1 < a.len();++i) a[i + 1] += a[i] / 10,a[i] %= 10;
	while(a[a.len() - 1] >= 10) a.pb(a[i] / 10),a[i] %= 10,++i;
	return a;
}
inline gjd operator + (li a,gjd b){return b + a;}
inline gjd operator + (gjd a,gjd b){
	if(!a.len()) return b;
	if(!b.len()) return a;
	gjd as;as.resize(max(a.len(),b.len()));
	register int i;
	for(i = 0;i < a.len() && i < b.len();++i) as[i] += a[i] + b[i];
	for(;i < a.len();++i) as[i] = a[i];
	for(;i < b.len();++i) as[i] = b[i];
	for(i = 0;i + 1 < as.len();++i) as[i + 1] += as[i] / 10,as[i] %= 10;
	while(as[as.len() - 1] >= 10) as.pb(as[i] / 10),as[i] %= 10,++i;
	return as;
}
inline gjd operator - (gjd a,gjd b){
	if(a < b){cerr<<"cannot support negative number!\n";exit(-1);}
	if(!b.len()) return a;
	if(a == b) return turn(0);
	register int i,l;
	for(i = 0;i < b.len();++i) a[i] -= b[i];
	for(i = 0;i + 1 < a.len();++i) while(a[i] < 0) --a[i + 1],a[i] += 10;
	for(l = a.len() - 1;l >= 0 && !a[l];--l);
	gjd as;as.resize(l + 1);
	for(i = 0;i <= l;++i ) as[i] = a[i];
	return as;
}
const int mo = 998244353;
inline li ksm(li q,li w){
	li as = 1;
	while(w){
		if(w & 1) as = as * q % mo;
		q = q * q % mo;
		w >>= 1;
	}
	return as;
}
int tp[2100000];
li tp1[2100010],tp2[2100010];
inline int pre(int n){
	register int i,j,l;
	for(j = 0,l = 1;l <= n;l <<= 1,++j);
	for(i = 1;i < l;++i) tp[i] = (tp[i >> 1] >> 1) | ((i & 1) << (j - 1));
	return l;
}
inline void ntt(li *q,int l,bool fg){
	register int i,j,k;
	li nw,wn,q1,q2;
	for(i = 0;i < l;++i) if(i < tp[i]) swap(q[i],q[tp[i]]);
	for(i = 1;i < l;i <<= 1){
		wn = ksm(3,fg ? (mo - 1) / (i << 1) : mo - 1 - (mo - 1) / (i << 1));
		for(j = 0;j < l;j += i << 1){
			nw = 1;
			for(k = j;k < j + i;++k){
				q1 = q[k];q2 = q[k + i] * nw % mo;
				q[k] = q1 + q2 >= mo ? q1 + q2 - mo : q1 + q2;
				q[k + i] = q1 - q2 < 0 ? q1 - q2 + mo : q1 - q2;
				(nw *= wn) %= mo;
			}
		}
	}
	if(!fg){
		li nn = ksm(l,mo - 2);
		for(i = 0;i < l;++i) (q[i] *= nn) %= mo;
	}
}
inline gjd operator * (gjd a,li b){
	if(!a.len() || !b) return turn(0);
	register int i;
	for(i = 0;i < a.len();++i) a[i] *= b;
	for(i = 0;i + 1 < a.len();++i) a[i + 1] += a[i] / 10,a[i] %= 10;
	while(a[a.len() - 1] >= 10) a.pb(a[i] / 10),a[i] %= 10,++i;
	return a;
}
inline gjd operator * (li a,gjd b){return b * a;}
inline gjd operator * (gjd a,gjd b){
	if(!a.len()) return a;
	if(!b.len()) return b;
	register int i,j,l;
	if(min(a.len(),b.len()) <= 100){
		for(i = 0;i < a.len();++i) for(j = 0;j < b.len();++j) tp1[i + j] += a[i] * b[j];
		j = a.len() + b.len() - 2;
		for(i = 0;i < j;++i) tp1[i + 1] += tp1[i] / 10,tp1[i] %= 10;
		while(tp1[j] >= 10) tp1[j + 1] = tp1[j] / 10,tp1[j] %= 10,++j; 
		gjd as;as.resize(j + 1);
		for(i = 0;i <= j;++i) as[i] = tp1[i],tp1[i] = 0;
		return as;
	}
	for(i = 0;i < a.len();++i) tp1[i] = a[i];
	for(i = 0;i < b.len();++i) tp2[i] = b[i];
	l = pre(j = a.len() + b.len() - 2);
	ntt(tp1,l,1);ntt(tp2,l,1);for(i = 0;i < l;++i) (tp1[i] *= tp2[i]) %= mo;ntt(tp1,l,0);
	for(i = 0;i < j;++i) tp1[i + 1] += tp1[i] / 10,tp1[i] %= 10;
	while(tp1[j] >= 10) tp1[j + 1] = tp1[j] / 10,tp1[j] %= 10,++j; 
	gjd as;as.resize(j + 1);
	for(i = 0;i <= j;++i) as[i] = tp1[i];
	for(i = 0;i <= max(j,l);++i) tp1[i] = tp2[i] = 0; 
	return as;
}
inline gjd operator / (gjd a,gjd b){
	if(!b.len()){cerr<<"divided by zero!\n";exit(-1);}
	if(a < b) return turn(0); 
	if(b.len() == 1 && b[0] == 1) return a;
	if(b[b.len() - 1] == 1){
		bool fg = 1;
		for(int i = b.len() - 2;i >= 0;--i) if(b[i]){
			fg = 0;break;
		}
		if(fg){
			gjd as;as.resize(a.len() - b.len() + 1);
			for(int i = 0;i < as.len();++i) as[i] = a[a.len() - as.len() + i];
			return as;
		}
	}
	register int i,ll,l2 = 1,len = a.len() - b.len() + 2;
	gjd inv,tmp,as,nxt,nxt2,nxt3;
	inv.resize(1);
	for(inv[0] = 1;inv[0] < 9 && (inv[0] + 1) * b[b.len() - 1] <= 10;++inv[0]);
	for(ll = 2;;ll <<= 1){
		ll = min(ll,len);
		tmp.resize(min(b.len(),1ll * ll));
		for(i = 0;i < tmp.len();++i) tmp[i] = b[b.len() - tmp.len() + i];
		nxt = tmp * inv * inv;
		inv = inv * 2;
		nxt2.resize(ll);
		for(i = 0;i < ll;++i) nxt2[i] = nxt[nxt.len() - ll + i];
		nxt3.clear();nxt3.resize(inv.len() + ll - l2);
		for(i = 0;i < inv.len();++i) nxt3[i + ll - l2] = inv[i];
		if(nxt3 >= nxt2) inv = nxt3 - nxt2;
		else{
			tmp.resize(nxt2.len() - 1);
			for(i = 0;i < tmp.len();++i) tmp[i] = nxt2[i + 1];
			inv = nxt3 - tmp;
		}
		l2 = ll;
		if(ll == len) break;
	}
	gjd lst,lstt;lst = 0;lstt = 0;
	while(inv != lst && inv != lstt){
		lstt = lst;lst = inv;
		nxt = b * inv * inv;
		inv = inv * 2;
		nxt2.resize(len);
		for(i = 0;i < len;++i) nxt2[i] = nxt[nxt.len() - len + i];
		if(inv >= nxt2) inv = inv - nxt2;
		else{
			tmp.resize(nxt2.len() - 1);
			for(i = 0;i < tmp.len();++i) tmp[i] = nxt2[i + 1];
			inv = inv - tmp;
		}
	}
	tmp = a * inv;
	len = tmp.len() - (inv.len() + b.len() - 1);
	as.resize(len);
	for(i = 0;i < len;++i) as[i] = tmp[tmp.len() - len + i];
	while(as * b > a) as = as - turn(1);
	return as;
}
int main(){
	gjd a,b;a.read();b.read();(a / b).print();
    return 0;
}
