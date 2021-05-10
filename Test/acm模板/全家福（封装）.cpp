#include<bits/stdc++.h>
#pragma GCC optimize(3)
using namespace std;
#define li long long
#define gc getchar()
#define pc putchar
inline li read(){
	li x = 0,y = 0,c = gc;
	while(!isdigit(c)) y = c,c = gc;
	while(isdigit(c)) x = x * 10 + (c ^ '0'),c = gc;
	return y == '-' ? -x : x;
}
inline void print(li x){
	if(x < 0) pc('-'),x = -x;
	if(x >= 10) print(x / 10);
	pc(x % 10 + '0');
}
li s1 = 19260817,s2 = 23333333,s3 = 998244853,srd;
inline li rd(){
	return srd = (srd * s1 + s2 + rand()) % s3;
}
void file(){
	freopen(".in","r",stdin);
	freopen(".out","w",stdout);
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
namespace poly{
	#define maxn 300000
	li dxs[20][maxn],tp1[maxn],tp2[maxn],tp3[maxn],tp4[maxn],tp5[maxn],tp6[maxn],tp7[maxn],tp8[maxn],tp9[maxn],tp10[maxn];
	vector<li> dd[maxn];
	li wn[2][20][maxn],ny[maxn];
	int tp[maxn];
	bool bz_flag,bz_fg,cz_fg;
	//初始化单位根和逆元 
	inline void init(int x){
		register int i,j,l;
		wn[0][0][0] = wn[1][0][0] = 1;
		for(i = 1,l = 2;i <= x && l <= maxn;l <<= 1,++i){
			wn[0][i][0] = wn[1][i][0] = 1;
			wn[1][i][1] = ksm(3,(mo - 1) / (l << 1));
			wn[0][i][1] = ksm(wn[1][i][1],mo - 2);
			for(j = 2;j < l;++j){
				wn[1][i][j] = wn[1][i][j - 1] * wn[1][i][1] % mo;
				wn[0][i][j] = wn[0][i][j - 1] * wn[0][i][1] % mo;
			}
		}
		
		ny[1] = 1;for(i = 2;i <= l >> 1;++i) ny[i] = (mo - mo / i * ny[mo % i] % mo) % mo;
	}
	//预处理len和tp数组 
	inline int pre(int n){
		register int i,j,l;
		for(j = 0,l = 1;l <= n;l <<= 1,++j);
		for(i = 1;i < l;++i) tp[i] = (tp[i >> 1] >> 1) | ((i & 1) << (j - 1));
		return l;
	}
	//ntt主函数 
	inline void ntt(li *q,int l,bool fg){
		register int i,j,k,g;
		li tmp;
		for(i = 1;i < l;++i) if(i < tp[i]) swap(q[i],q[tp[i]]);
		for(i = 1,g = 0;i < l;i <<= 1,++g){
			for(j = 0;j < l;j += (i << 1)){
				for(k = 0;k < i;++k){
					tmp = q[k + i + j] * wn[fg][g][k] % mo;
					q[k + i + j] = q[k + j] - tmp;q[k + i + j] < 0 ? q[k + i + j] += mo : 0;
					q[k + j] += tmp;q[k + j] >= mo ? q[k + j] -= mo : 0;
				}
			}
		}
		if(!fg){
			li nn = ksm(l,mo - 2);
			for(i = 0;i < l;++i) (q[i] *= nn) %= mo;
		}
	}
	//多项式乘法：给定n次多项式a和m次多项式b，求n+m次多项式c=a*b 
	inline int mul(li *a,li *b,li *as,int n,int m){
		register int i,l;
		l = pre(n + m);
		for(i = 0;i <= n;++i) tp1[i] = a[i];
		for(i = 0;i <= m;++i) tp2[i] = b[i];
		ntt(tp1,l,1);ntt(tp2,l,1);for(i = 0;i < l;++i) as[i] = tp1[i] * tp2[i] % mo;ntt(as,l,0);
		for(i = 0;i < l;++i) tp1[i] = tp2[i] = 0;
		return l;
	} 
	//多项式求逆：给定多项式a，求b=1/a(mod x^n) 
	inline void inv(li *a,li *b,int n){
		if(n == 1){
			b[0] = ksm(a[0],mo - 2);return;
		}
		inv(a,b,n + 1 >> 1);
		register int i,l;
		for(i = 0;i < n;++i) tp1[i] = a[i];
		l = pre(n + n);
		for(i = n + 1 >> 1;i < l;++i) b[i] = 0;
		ntt(tp1,l,1);ntt(b,l,1);for(i = 0;i < l;++i) b[i] = (2 * b[i] - tp1[i] * b[i] % mo * b[i] % mo + mo) % mo;ntt(b,l,0);
		for(i = 0;i < l;++i) tp1[i] = 0;
		for(i = n;i < l;++i) b[i] = 0; 
	}
	//多项式带余除法：给定n次多项式a和m次多项式b，求n-m次多项式d和m-1次多项式r，满足a=bd+r 
	inline void div(li *a,li *b,li *d,li *r,int n,int m){
		register int i,l;
		for(i = 0;i <= n;++i) d[i] = r[i] = 0;
		if(n < m){
			for(i = 0;i <= n;++i) r[i] = a[i];
			return;
		}
		for(i = 0;i <= n;++i) tp3[i] = a[n - i];
		for(i = 0;i <= m;++i) tp4[i] = b[m - i];
		if(!bz_fg) inv(tp4,tp5,n - m + 1);
		else if(!bz_flag){
			inv(tp4,tp5,n - m + 1);
			for(i = 0;i <= n - m;++i) tp10[i] = tp5[i];
			bz_flag = 1;
		}
		else{
			for(i = 0;i <= n - m;++i) tp5[i] = tp10[i];
		}
		l = mul(tp3,tp5,tp4,n,n - m);
		for(i = 0;i <= n - m;++i) d[i] = tp4[n - m - i];
		mul(b,d,tp5,m,n - m);
		for(i = 0;i < m;++i) r[i] = a[i] < tp5[i] ? a[i] - tp5[i] + mo : a[i] - tp5[i];
		for(i = 0;i < l;++i) tp3[i] = tp4[i] = tp5[i] = 0;
	} 
	//多项式求导：给定n次多项式a，求b=a'
	inline void qd(li *a,li *b,int n){
		b[n] = 0;for(int i = 0;i < n;++i) b[i] = a[i + 1] * (i + 1) % mo;
	}
	//多项式不定积分：给定n-1次多项式a，求b=积分 a dx,常数项默认为0 
	inline void jf(li *a,li *b,int n){
		b[0] = 0;for(int i = 0;i < n;++i) b[i + 1] = a[i] * ny[i + 1] % mo;
	} 
	//多项式ln：给定多项式a，求b=ln(a)(mod x^n) 
	//需要满足：a[0]=1
	inline void fln(li *a,li *b,int n){
		register int i,l;
		inv(a,tp3,n);qd(a,tp4,n - 1);
		l = mul(tp3,tp4,tp3,n - 1,n - 2);
		jf(tp3,b,n - 1);
		for(i = 0;i < l;++i) tp3[i] = tp4[i] = 0;
	}
	//多项式exp：给定多项式a，求b=exp(a)(mod x^n) 
	//需要满足：a[0]=0
	inline void fexp(li *a,li *b,int n){
		if(n == 1){
			b[0] = 1;return;
		}
		fexp(a,b,n + 1 >> 1);
		register int i,l;
		for(i = n + 1 >> 1;i < n;++i) b[i] = 0;
		fln(b,tp5,n);
		l = pre(n + n);
		for(i = n;i < l;++i) b[i] = 0;
		for(i = 0;i < n;++i) tp5[i] = a[i] < tp5[i] ? a[i] - tp5[i] + mo : a[i] - tp5[i];
		++tp5[0];tp5[0] >= mo ? tp5[0] -= mo : 0;
		ntt(tp5,l,1);ntt(b,l,1);for(i = 0;i < l;++i) (b[i] *= tp5[i]) %= mo;ntt(b,l,0);
		for(i = n;i < l;++i) b[i] = 0;
		for(i = 0;i < l;++i) tp5[i] = 0;
	}
	//以下为计算二次剩余
	li ec_m,ec_mm_n;
	struct cp{
		li x,y;
		cp(li _x = 0,li _y = 0){x = _x % mo;y = _y % mo;}
	};
	inline cp operator * (cp a,cp b){
		return cp(a.x * b.x + a.y * b.y % mo * ec_mm_n,a.x * b.y + a.y * b.x);
	}
	inline cp ec_ksm(cp q,li w){
		cp as = cp(1,0);
		while(w){
			if(w & 1) as = as * q;
			q = q * q;
			w >>= 1;
		}
		return as;
	}
	//二次剩余：给定n，求x满足x^2%mo=n(取较小的一组解)
	//需要满足：n是mo的二次剩余
	inline li ec_work(li n){
		if(!n) return 0;
		do ec_m = rd();while(!ec_m || ksm((ec_m * ec_m - n + mo) % mo,mo >> 1) == 1);ec_mm_n = (ec_m * ec_m + mo - n) % mo;
		li as = ec_ksm(cp(ec_m,1),mo + 1 >> 1).x;
		if(as > (mo >> 1)) as = mo - as;
		return as;
	}
	//多项式开根：给定多项式a，求b=sqrt(a)(mod x^n)(取常数项较小的一组解) 
	//需要满足：a[0]是mo的二次剩余 
	inline void fsqrt(li *a,li *b,int n){
		if(n == 1){
			b[0] = ec_work(a[0]);
			return;
		}
		fsqrt(a,b,n + 1 >> 1);
		inv(b,tp3,n);
		register int i,l;
		l = mul(a,tp3,tp3,n,n - 1);
		for(i = 0;i < n;++i) b[i] = (b[i] + tp3[i]) * ny[2] % mo;
		for(i = 0;i < l;++i) tp3[i] = 0;
	}
	//给定n-1次多项式a，求x^m mod a
	//注意：初次调用时fg=0 
	inline void bz_mod(li *a,li *b,int n,li m,bool fg){
		bz_fg = 1;
		register int i,l;
		if(m < n - 1){
			for(i = 0;i < n;++i) b[i] = 0;
			b[m] = 1;return;
		}
		bz_mod(a,b,n,m >> 1,1);
		l = pre(n + n - 4);
		ntt(b,l,1);for(i = 0;i < l;++i) (b[i] *= b[i]) %= mo;ntt(b,l,0);
		div(b,a,tp9,tp6,n + n - 4,n - 1);
		for(i = 0;i < n - 1;++i) b[i] = tp6[i],tp6[i] = tp9[i] = 0;
		for(i = n - 1;i < l;++i) b[i] = tp9[i] = 0;
		if(m & 1){
			for(i = n - 1;i;--i) b[i] = b[i - 1];b[0] = 0;
			li tmp = b[n - 1] * ksm(a[n - 1],mo - 2) % mo;
			for(i = n - 1;i >= 0;--i) (b[i] += mo - tmp * a[i] % mo) %= mo;
		}
		if(!fg){
			for(i = 0;i < l;++i) tp10[i] = 0;
			bz_flag = bz_fg = 0;
		}
	}
	//多项式快速幂：给定a，求b=a^m(mod x^n)
	//需要满足：a[0]=1 
	inline void qkpow(li *a,li *b,int n,li m){
		register int i;
		((m %= mo) += mo) %= mo;
		if(!m){
			b[0] = 1;for(i = 1;i < n;++i) b[i] = 0;
			return;
		}
		fln(a,tp6,n);
		for(i = 0;i < n;++i) (tp6[i] *= m) %= mo;
		fexp(tp6,b,n);
		for(i = 0;i < n;++i) tp6[i] = 0; 
	}
	#define ls nw << 1
	#define rs nw << 1 | 1
	#define ln ls,l,mid
	#define rn rs,mid + 1,r
	#define md int mid = l + r >> 1
	//以下为多点求值 
	inline void build(li *q,int nw,int l,int r){
		dd[nw].resize(r - l + 2);
		if(l == r){
			dd[nw][0] = q[l] ? mo - q[l] : 0;dd[nw][1] = 1;return;
		}
		int i,ll;
		md;build(q,ln);build(q,rn);
		ll = pre(r - l + 1);
		for(i = 0;i <= mid - l + 1;++i) tp1[i] = dd[ls][i];
		for(i = 0;i <= r - mid;++i) tp2[i] = dd[rs][i];
		ntt(tp1,ll,1);ntt(tp2,ll,1);for(i = 0;i < ll;++i) (tp1[i] *= tp2[i]) %= mo;ntt(tp1,ll,0);
		for(i = 0;i <= r - l + 1;++i) dd[nw][i] = tp1[i];
		for(i = 0;i < ll;++i) tp1[i] = tp2[i] = 0;
	}
	inline void del(int nw,int l,int r){
		dd[nw].clear();
		if(l == r) return;
		md;del(ln);del(rn);
	}
	inline void wk1(li *c,int n,int nw,int l,int r,int dpt){
		if(l == r){
			c[l] = dxs[dpt][0];return;
		}
		register int i;
		md;
		for(i = 0;i <= mid - l + 1;++i) tp6[i] = dd[ls][i];
		div(dxs[dpt],tp6,tp9,dxs[dpt + 1],n,mid - l + 1);
		for(i = 0;i <= max(n,mid - l + 1);++i) tp6[i] = tp9[i] = 0;
		wk1(c,min(n,mid - l),ln,dpt + 1);
		for(i = 0;i <= mid - l;++i) dxs[dpt + 1][i] = 0;
		for(i = 0;i <= r - mid;++i) tp6[i] = dd[rs][i];
		div(dxs[dpt],tp6,tp9,dxs[dpt + 1],n,r - mid);
		for(i = 0;i <= max(n,r - mid);++i) tp6[i] = tp9[i] = 0;
		wk1(c,min(n,r - mid - 1),rn,dpt + 1);
		for(i = 0;i <= r - mid - 1;++i) dxs[dpt + 1][i] = 0;
	}
	//多点求值：给定n次多项式a和m个点b0...bm-1,求c0...cm-1表示a在对应位置的点值 
	inline void qz(li *a,li *b,li *c,int n,int m){
		register int i;
		if(m == 1){
			c[0] = 0;for(i = n;i >= 0;--i) c[0] = (c[0] * b[0] + a[i]) % mo;
			return;
		}
		if(!cz_fg) build(b,1,0,m - 1);
		for(i = 0;i <= n;++i) dxs[0][i] = a[i];
		wk1(c,n,1,0,m - 1,0);
		for(i = 0;i <= n;++i) dxs[0][i] = 0;
		if(!cz_fg) del(1,0,m - 1);
	}
	//以下为快速插值 
	inline void wk2(li *a,int nw,int l,int r,int dpt){
		if(l == r){
			dxs[dpt][l] = a[l];return;
		}
		md;
		wk2(a,ln,dpt + 1);wk2(a,rn,dpt + 1);
		register int i;
		for(i = 0;i <= r - mid;++i) tp6[i] = dd[rs][i];
		mul(tp6,dxs[dpt + 1] + l,tp10,r - mid,mid - l);
		for(i = 0;i <= r - l;++i) dxs[dpt][i + l] = tp10[i],tp10[i] = tp6[i] = 0;
		for(i = 0;i <= mid - l + 1;++i) tp6[i] = dd[ls][i];
		mul(tp6,dxs[dpt + 1] + mid + 1,tp10,mid - l + 1,r - mid - 1);
		for(i = 0;i <= r - l;++i) (dxs[dpt][i + l] += tp10[i]) %= mo,tp10[i] = tp6[i] = dxs[dpt + 1][i + l] = 0;
	}
	//快速插值：给定n个点x0...xn-1及对应的点值y0...yn-1，求一个对应的n-1次多项式f 
	inline void cz(li *x,li *y,li *f,int n){
		cz_fg = 1;
		register int i;
		build(x,1,0,n - 1);
		for(i = 1;i <= n;++i) tp7[i - 1] = dd[1][i] * i % mo;
		qz(tp7,x,tp8,n - 1,n);
		for(i = 0;i < n;++i) tp8[i] = y[i] * ksm(tp8[i],mo - 2) % mo;
		wk2(tp8,1,0,n - 1,0);
		for(i = 0;i < n;++i) f[i] = dxs[0][i],dxs[0][i] = tp7[i] = tp8[i] = 0;
		del(1,0,n - 1);
		cz_fg = 0;
	}
	#undef ls
	#undef rs
	#undef ln
	#undef rn
	#undef md
	//复合逆：给定n次多项式a，求多项式b的x^n项系数，其中b满足b(a(x))=a(b(x))=x
	//需要满足：a[0]=0,a[1]=1 
	inline li fhn(li *a,int n){
		register int i;li as;
		for(i = 0;i < n;++i) tp7[i] = a[i + 1];
		qkpow(tp7,tp8,n,-n);
		as = (tp8[n - 1] * ny[n] % mo + mo) % mo;
		for(i = 0;i < n;++i) tp7[i] = tp8[i] = 0;
		return as;
	}
	//线性递推：已知序列b的前n项b0...bn-1和当i>=n时的递推关系bi=sigma i=1~n ai*b(n-i)，求bm 
	inline li xxdt(li *a,li *b,int n,li m){
		if(m < n) return b[m];
		register int i;li as = 0;
		for(i = 0;i < n;++i) tp7[i] = (mo - a[n - i]) % mo;tp7[n] = 1;
		bz_mod(tp7,tp8,n + 1,m,0);
		for(i = 0;i < n;++i) (as += tp8[i] * b[i]) %= mo;
		for(i = 0;i <= n;++i) tp7[i] = tp8[i] = 0;
		return as;
	}
}
using namespace poly;
li a[maxn],b[maxn],c[maxn],d[maxn],e[maxn],f[maxn]; 
int main(){
	srand(time(0));rd();
	//file();
	init(18);
	
	return 0; 
}
