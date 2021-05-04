//高精度（1.2）
//支持高精度数据直接读入、输出、高精低精互相转化、比较大小、四则运算、幂运算、开方、gcd、lcm等
//10.18更新：支持对高精度数据直接赋值
//11.9更新：声明高精度数据时初值直接为0
//1.21更新：用vector存储高精度数据 
//1.22更新：加快了高精乘法的实现速度（分治法） 
//1.23更新：实现了压位高精（8位），同时加速了高精乘法，在O2优化下0.5s内可以实现300000规模的乘法运算 
//压位高精实现不了ntt，故用分治乘法代替,在100000位之内与ntt效率相当 
//4.2更新：优化高精gcd，2s内实现10000位数据的gcd 
//6.29更新：实现了基于二分的高精开任意次根 
//10.17更新：增加了用string和char*给高精度数据赋值的操作 
//11.19更新：高精度支持负数
//1.2更新：支持使用cin/cout进行读入/输出 
#include<bits/stdc++.h>
using namespace std;
#define li long long
const li MAX_PER_UNIT = 100000000;
inline li ll_in(){
	li x = 0,y = 0,c = getchar();
	while(!isdigit(c)) y = c,c = getchar();
	while(c >= '0' && c <= '9') x = (x << 1) + (x << 3) + (c ^ '0'),c = getchar();
	return y == '-' ? -x : x;
}
inline void ll_out(li q){
	if(q < 0){
		putchar('-');
		q = -q;
	} 
	if(q >= 10) ll_out(q / 10);
	putchar(q % 10 + '0');
} 
struct gjd{
	vector<li> a;//存储高精度数据 
	int len;//该数据的位数 
	bool fh;//符号,0为非负1为负 
	gjd(){//初始化(清零)  
		len = fh = 0;a.clear();
	}
	inline gjd operator = (li x){
		a.clear();len = fh = 0;
		if(x < 0){
			fh = 1;x = -x;
		}
		while(x){
			a.push_back(x % MAX_PER_UNIT);
			x /= MAX_PER_UNIT;
		}
		len = a.size();
		return *this;
	}
	inline gjd operator = (int x){
		a.clear();len = fh = 0;
		if(x < 0){
			fh = 1;x = -x;
		}
		while(x){
			a.push_back(x % MAX_PER_UNIT);
			x /= MAX_PER_UNIT;
		}
		len = a.size();
		return *this;
	}
	inline gjd operator = (string c){
		a.clear();len = fh = 0;
		if(c.size() == 1 && c[0] == '0') return *this;
		int q = MAX_PER_UNIT,j = 0,d = 0;
		while(j < c.size() && (c[j] < '0' || c[j] > '9')) d = c[j++];
		while(j < c.size() && c[j] == '0') ++j;
		if(j == c.size()) return *this;
		for(int i = c.size() - 1;i >= j;--i){
			if(q == MAX_PER_UNIT){
				a.push_back(c[i] - '0');
				++len;
				q = 10;
			}
			else{
				a[len - 1] += (c[i] - '0') * q;
				q *= 10;
			} 
		}
		if(len && d == '-') fh = 1;
		return *this;
	}
	inline gjd operator = (char *c){
		a.clear();len = fh = 0;
		int tp = strlen(c);
		if(tp == 1 && c[0] == '0') return *this;
		int q = MAX_PER_UNIT,j = 0,d = 0;
		while(j < tp && (c[j] < '0' || c[j] > '9')) d = c[j++];
		while(j < tp && c[j] == '0') ++j;
		if(j == tp) return *this;
		for(int i = tp - 1;i >= j;--i){
			if(q == MAX_PER_UNIT){
				a.push_back(c[i] - '0');
				++len;
				q = 10;
			}
			else{
				a[len - 1] += (c[i] - '0') * q;
				q *= 10;
			} 
		}
		if(len && d == '-') fh = 1;
		return *this;
	}
	inline void read(){//读入 
		a.clear();len = fh = 0;
		vector<char> c;
		char d,e = 0;
		int i = 0;
		d = getchar();
		while(d < '0' || d > '9') e = d,d = getchar();//屏蔽非数字字符 
		while(d == '0') d = getchar();//屏蔽前导0 
		if(d == -1) return;//处理读入0 
		while(d >= '0' && d <= '9') ++i,c.push_back(d),d = getchar();
		int q = MAX_PER_UNIT;
		for(--i;i >= 0;--i){
			if(q == MAX_PER_UNIT){
				a.push_back(c[i] - '0');
				++len;
				q = 10;
			}
			else{
				a[len - 1] += (c[i] - '0') * q;
				q *= 10;
			} 
		}
		if(len && e == '-') fh = 1;
	}
	inline void print(){//输出 
		int i = len;
		if(i == 0){
			putchar('0');
			return;
		} 
		if(fh) putchar('-');
		ll_out(a[i - 1]);
		for(i -= 2;i >= 0;--i){
			if(a[i] < 10000000) putchar('0');
			if(a[i] < 1000000) putchar('0');
			if(a[i] < 100000) putchar('0');
			if(a[i] < 10000) putchar('0');
			if(a[i] < 1000) putchar('0');
			if(a[i] < 100) putchar('0');
			if(a[i] < 10) putchar('0');
			ll_out(a[i]);
		} 
	}
};
inline istream& operator >> (istream &is,gjd &x){
	x.read();return is;
}
inline ostream& operator << (ostream &os,gjd x){
	x.print();return os;
}

inline void clear(gjd &x){//初始化(清零) 
	x.a.clear();
	x.len = 0;
}
inline gjd turn(li x){//将低精转化为高精
	gjd y;
	if(x < 0){
		y.fh = 1;x = -x;
	}
	while(x){
		y.a.push_back(x % MAX_PER_UNIT); 
		x /= MAX_PER_UNIT;
	}
	y.len = y.a.size();
	return y;
} 
inline li turn(gjd z){//将高精转化为低精（有爆ll风险，慎用） 
	li x = 0;
	for(int i = z.len - 1;i >= 0;--i) x = x * MAX_PER_UNIT + z.a[i];
	return z.fh ? -x : x;
} 
inline void swap(gjd &x,gjd &y){//交换两个高精度数据 
	gjd t = x;
	x = y;
	y = t;
}
inline gjd abs(gjd x){//高精度数据取绝对值
	x.fh = 0;
	return x;
}
inline gjd operator - (gjd x){//相反数 
	if(x.len) x.fh ^= 1;
	return x;
}

inline int cmp(gjd x,gjd y){//高精与高精比较大小 
	if(x.fh && !y.fh) return -1;
	if(!x.fh && y.fh) return 1;
	int tmp = 1;
	if(x.fh && y.fh) tmp = -1;
	int q = x.len,w = y.len; 
	if(q > w) return tmp;
	if(w > q) return -tmp;
	for(--q;q >= 0;--q){
		if(x.a[q] > y.a[q]) return tmp;
		if(x.a[q] < y.a[q]) return -tmp;
	}
	return 0;
}
inline bool operator == (gjd b,gjd c){
	return cmp(b,c) == 0;
} 
inline bool operator < (gjd b,gjd c){
	return cmp(b,c) == -1;
}
inline bool operator > (gjd b,gjd c){
	return cmp(b,c) == 1;
}
inline bool operator <= (gjd b,gjd c){
	return cmp(b,c) != 1;
}
inline bool operator >= (gjd b,gjd c){
	return cmp(b,c) != -1;
}
inline bool operator != (gjd b,gjd c){
	return cmp(b,c) != 0;
}

inline int cmp(gjd x,li b){//高精与低精比较大小 
	return cmp(x,turn(b));
}
inline bool operator == (gjd b,li c){
	return cmp(b,c) == 0;
} 
inline bool operator < (gjd b,li c){
	return cmp(b,c) == -1;
}
inline bool operator > (gjd b,li c){
	return cmp(b,c) == 1;
}
inline bool operator <= (gjd b,li c){
	return cmp(b,c) != 1;
}
inline bool operator >= (gjd b,li c){
	return cmp(b,c) != -1;
}
inline bool operator != (gjd b,li c){
	return cmp(b,c) != 0;
}

inline int cmp(li b,gjd c){//低精与高精比较大小
	return cmp(turn(b),c);
}  
inline bool operator == (li b,gjd c){
	return cmp(b,c) == 0;
} 
inline bool operator < (li b,gjd c){
	return cmp(b,c) == -1;
}
inline bool operator > (li b,gjd c){
	return cmp(b,c) == 1;
}
inline bool operator <= (li b,gjd c){
	return cmp(b,c) != 1;
}
inline bool operator >= (li b,gjd c){
	return cmp(b,c) != -1;
}
inline bool operator != (li b,gjd c){
	return cmp(b,c) != 0;
}

inline gjd max(gjd x,gjd y){//高精与高精取最大值 
	return x > y ? x : y;
}
inline gjd max(gjd x,li y){//高精与低精取最大值 
	return x >= y ? x : turn(y);
}
inline gjd max(li x,gjd y){//低精与高精取最大值 
	return x > y ? turn(x) : y;
}
inline gjd min(gjd x,gjd y){//高精与高精取最小值 
	return x < y ? x : y;
}
inline gjd min(gjd x,li y){//高精与低精取最小值 
	return x <= y ? x : turn(y);
}
inline gjd min(li x,gjd y){//低精与高精取最小值 
	return x < y ? turn(x) : y;
}


inline gjd jia(gjd b,gjd c) {//高精加高精的绝对值相加,要求b,c>=0 
	if(c.len == 0) return b;
	if(b.len == 0) return c;
	int z = 0;
	gjd d;
	int l1 = b.len,l2 = c.len,t1,t2;
	d.a.resize(max(l1,l2) + 1);
	while(z < l1 || z < l2){
		if(l1 > z) t1 = b.a[z];
		else t1 = 0;
		if(l2 > z) t2 = c.a[z];
		else t2 = 0;
		d.a[z] += t1 + t2;
		if(d.a[z] >= MAX_PER_UNIT) d.a[z + 1] = 1,d.a[z] -= MAX_PER_UNIT;
		++z;
	}
	d.len = d.a.size();
	while(d.len && !d.a[d.len - 1]) --d.len;
	return d;
}
inline gjd jia(gjd b,li c){//高精加低精的绝对值相加,要求b,c>=0 
	if(c == 0) return b;
	if(b.len == 0) return turn(c);
	if(abs(c) > 9000000000000000000ll) return jia(b,turn(c));//不然会爆ll 
	int z = 0;
	b.a[0] += c;
	while(b.a[z] >= MAX_PER_UNIT){
		if(b.a.size() == z + 1) b.a.push_back(b.a[z] / MAX_PER_UNIT);
		else b.a[z + 1] += b.a[z] / MAX_PER_UNIT;
		b.a[z] %= MAX_PER_UNIT;
		++z;
	}
	b.len = max(b.len,z + 1);
	return b;
}

inline gjd jian(gjd z,li x){//高精减低精的绝对值相减，要求z>=x>=0 
	if(x == 0) return z;
	int q = 0,w = -1;
	z.a[0] -= x;
	while(z.a[q] < 0){
		z.a[q + 1] += z.a[q] / MAX_PER_UNIT;
		z.a[q] %= MAX_PER_UNIT;
		if(z.a[q] < 0){
			z.a[q] += MAX_PER_UNIT;
			--z.a[q + 1];	
		}
		if(z.a[q]) w = q;
		++q;
	}
	if(z.len == q + 1 && z.a[q] == 0) z.len = w + 1;
	return z;
}
inline gjd jian(gjd b,gjd c){//高精减高精的绝对值相减，要求b>=c>=0 
	if(c.len == 0) return b;
	int z = 0,w = -1;
	int l1 = b.len,l2 = c.len;
	gjd d;
	d.a.resize(b.len);
	int tp;
	while(z < l1){
		if(l2 > z) tp = c.a[z];
		else tp = 0;
		d.a[z] += b.a[z] - tp;
		if(d.a[z] < 0){
			d.a[z] += MAX_PER_UNIT;
			d.a[z + 1] = -1;
		}
		if(d.a[z]) w = z;
		++z;
	}
	d.len = w + 1;
	return d;
}

inline gjd operator + (gjd z,li x){//高精加低精 
	if(!z.fh && x >= 0) return jia(z,x);
	gjd a;
	if(z.fh && x < 0){
		z.fh = 0;x = -x;
		a = jia(z,x);
		a.fh = 1;
		return a;
	}
	if(!z.fh && x < 0){
		x = -x;
		if(z >= x){
			a = jian(z,x);
			a.fh = 0;
		}
		else{
			a = jian(turn(x),z);
			a.fh = 1;
		}
		return a;
	}
	if(z.fh && x >= 0){
		z.fh = 0;
		if(z > x){
			a = jian(z,x);
			a.fh = 1;
		}
		else{
			a = jian(turn(x),z);
			a.fh = 0;
		}
		return a;
	}
	return a;
}
inline gjd operator + (gjd z,gjd x){//高精加高精 
	if(!z.fh && !x.fh) return jia(z,x);
	if(z > x) swap(z,x);
	gjd a;
	if(z.fh && x.fh){
		z.fh = x.fh = 0;
		a = jia(z,x);
		a.fh = 1;
		return a;
	}
	if(z.fh && !x.fh){
		z.fh = 0;
		if(z > x){
			a = jian(z,x);
			a.fh = 1;
		}
		else{
			a = jian(x,z);
			a.fh = 0;
		}
		return a;
	}
	return a;
}
inline gjd operator + (li z,gjd x){//低精加高精 
	return x + z;
}
inline gjd operator += (gjd &z,li x){
	z = z + x;
	return z;
}
inline gjd operator += (gjd &z,gjd x){
	z = z + x;
	return z;
}
inline li operator += (li &z,gjd x){//请注意爆long long风险 
	z = z + turn(x);
	return z;
} 
inline gjd operator ++ (gjd &z){//由于特殊原因，使用时只能写作++z，不能写作z++ 
	z = z + 1;
	return z;
}

inline gjd operator - (gjd z,li x){//高精减低精 
	return z + (-x);
}
inline gjd operator - (gjd z,gjd x){//高精减高精 
	if(x.len) x.fh ^= 1;
	return z + x;
}
inline gjd operator - (li b,gjd c){//低精减高精
	return turn(b) - c; 
} 
inline gjd operator -= (gjd &z,li x){
	z = z - x;
	return z;
}
inline gjd operator -= (gjd &z,gjd x){
	z = z - x;
	return z;
}  
inline li operator -= (li &z,gjd x){//请注意爆long long风险 
	z = z - turn(x);
	return z;
} 
inline gjd operator -- (gjd &z){//由于特殊原因，使用时只能写作--z，不能写作z-- 
	z = z - 1;
	return z;
}

inline gjd operator * (gjd b,gjd c){//高精乘高精 
	if(b.len == 0 || c.len == 0) return turn(0);
	if(min(b.len,c.len) <= 200){
		gjd d;
		d.fh = b.fh ^ c.fh;
		b.fh = c.fh = 0;
		int i,j;
		int l1 = b.len,l2 = c.len;
		d.a.resize(l1 + l2 - 1);
		for(i = 0;i < l1;++i){
			for(j = 0;j < l2;++j){
				d.a[i + j] += b.a[i] * c.a[j];
			}
		}
		for(i = 0;i < l1 + l2 - 2;++i){
			d.a[i + 1] += d.a[i] / MAX_PER_UNIT;
			d.a[i] %= MAX_PER_UNIT;
		}
		while(d.a[i] >= MAX_PER_UNIT){
			if(d.a.size() == i + 1) d.a.push_back(d.a[i] / MAX_PER_UNIT);
			else d.a[i + 1] = d.a[i] / MAX_PER_UNIT;
			d.a[i] %= MAX_PER_UNIT;
			++i; 
		}
		d.len = i + 1;
		return d;
	}
	int l = max(b.len,c.len) / 2;
	gjd ans,b1,b2,c1,c2,s1,s2,s3,s4,s5;
	int tmp = b.fh ^ c.fh;
	b.fh = c.fh = 0;
	int i;
	b1.len = min(l,b.len);
	b1.a.resize(b1.len);
	for(i = 0;i < l && i < b.len;++i) b1.a[i] = b.a[i];
	c1.len = min(l,c.len);
	c1.a.resize(c1.len);
	for(i = 0;i < l && i < c.len;++i) c1.a[i] = c.a[i];
	if(b.len > l){
		b2.a.resize(b.len - 1);
		for(i = l;i < b.len;++i) b2.a[i - l] = b.a[i];
		b2.len = b.len - l;
	}
	if(c.len > l){
		c2.a.resize(c.len - 1);
		for(i = l;i < c.len;++i) c2.a[i - l] = c.a[i];
		c2.len = c.len - l;
	}
	while(b1.len && !b1.a[b1.len - 1]) --b1.len;
	while(c1.len && !c1.a[c1.len - 1]) --c1.len;
	while(b2.len && !b2.a[b2.len - 1]) --b2.len;
	while(c2.len && !c2.a[c2.len - 1]) --c2.len;
	s1 = b1 * c1;
	s2 = b2 * c2;
	s3 = (b1 + b2) * (c1 + c2) - s1 - s2;
	if(s2.len){
		s4.a.resize((l << 1) + s2.len);
		for(i = 0;i < s2.len;++i) s4.a[i + (l << 1)] = s2.a[i];
		s4.len = (l << 1) + s2.len; 
	}
	if(s3.len){
		s5.a.resize(l + s3.len);
		for(i = 0;i < s3.len;++i) s5.a[i + l] = s3.a[i];
		s5.len = l + s3.len;
	}
	ans = s1 + s4 + s5;ans.fh = tmp;
	return ans;
}
inline gjd operator * (gjd b,li c){//高精乘低精 
	if(b.len == 0 || c == 0) return turn(0);
	if(abs(c) > 10000000000ll) return b * turn(c);//不然会爆long long
	int l = b.len,i,j;
	j = b.fh ^ (c < 0);
	b.fh = 0;c = abs(c);
	for(i = 0;i < l;++i) b.a[i] *= c;
	for(i = 0;i < l - 1;++i){
		b.a[i + 1] += b.a[i] / MAX_PER_UNIT;
		b.a[i] %= MAX_PER_UNIT;
	}
	while(b.a[i] >= MAX_PER_UNIT){
		if(b.a.size() == i + 1) b.a.push_back(b.a[i] / MAX_PER_UNIT);
		else b.a[i + 1] = b.a[i] / MAX_PER_UNIT;
		b.a[i] %= MAX_PER_UNIT;
		++i;
	}
	b.len = i + 1;
	b.fh = j;
	return b;
}
inline gjd operator * (li z,gjd x){//低精乘高精 
	return x * z;
} 
inline gjd operator *= (gjd &z,li x){
	z = z * x;
	return z;
}
inline gjd operator *= (gjd &z,gjd x){
	z = z * x;
	return z;
}  
inline li operator *= (li &z,gjd x){//请注意爆long long风险 
	z = z * turn(x);
	return z;
} 

inline gjd operator / (gjd b,li c){//高精除以低精 
	if(!c){
		puts("error:divided by zero!");
		exit(1);
	}
	if(b.len == 0) return turn(0);
	gjd q;
	q.fh = b.fh ^ (c < 0);
	b.fh = 0;c = abs(c);
	int l = b.len - 1;
	int x = 0,y;
	while(l){
		y = b.a[l] / c;
		if(!x && y){
			x = l;
			q.a.resize(x);
			q.a.push_back(y);
		} 
		if(x) q.a[l] = y;
		b.a[l - 1] += b.a[l] % c * MAX_PER_UNIT;
		--l;
	}
	if(!x){
		y = b.a[0] / c;
		if(!y) return q;
		q.a.push_back(y);
		q.len = x + 1;
		return q;
	}
	q.a[0] = b.a[0] / c;
	if(!q.a[0] && !x) q.len = 0;
	else q.len = x + 1;
	return q;
}
inline gjd operator / (gjd b,gjd c){//高精除以高精 
	if(c.len == 0){
		puts("error:divided by zero!");
		exit(1);
	} 
	if(b.len == 0) return turn(0);
	int tmp = b.fh ^ c.fh;
	b.fh = c.fh = 0;
	if(b < c) return turn(0);
	gjd q,w;//q：商；w：余数 
	int i = b.len - 1,l = -1,al,ar,am;
	for(;i >= 0;i--){
		w = w * MAX_PER_UNIT + b.a[i];
		if(w >= c){
			if(l == -1) q.a.resize(i + 1);
			l = max(l,i);
			al = 1,ar = MAX_PER_UNIT - 1;
			while(al <= ar){
				am = al + ar >> 1;
				if(w >= c * am){
					q.a[i] = am;
					al = am + 1;
				} 
				else ar = am - 1;
			}
			w -= c * q.a[i];
		}
	} 
	q.len = l + 1;
	q.fh = tmp;
	return q;
}
inline gjd operator / (li x,gjd y){//低精除以高精 
	return turn(x) / y;
}
inline gjd operator /= (gjd &z,li x){
	z = z / x;
	return z;
}
inline gjd operator /= (gjd &z,gjd x){
	z = z / x;
	return z;
}  
inline li operator /= (li &z,gjd x){//请注意爆long long风险 
	if(z < x){
		z = 0;
		return z;
	}
	z = z / turn(x);
	return z;
} 


inline gjd operator % (gjd b,li c){//高精模低精 
	if(!c){
		puts("error:divided by zero!");
		exit(1);
	}
	if(b.len == 0) return turn(0);
	int l = b.len - 1,tmp = b.fh;
	b.fh = 0;c = abs(c);
	while(l){
		b.a[l - 1] += b.a[l] % c * MAX_PER_UNIT;
		--l;
	}
	b.a[0] %= c;
	gjd y = turn(b.a[0]);
	y.fh = tmp;
	return y;
}
inline gjd operator % (gjd b,gjd c){//高精模高精 
	if(c.len == 0){
		puts("error:divided by zero!");
		exit(1);
	} 
	if(b.len == 0) return turn(0);
	gjd w,tp;//w：余数 tp:辅助计算 
	int tmp = b.fh;
	b.fh = c.fh = 0;
	if(b < c){
		b.fh = tmp;
		return b;
	} 
	int i = b.len - 1,j;
	for(;i >= 0;--i){
		w = w * MAX_PER_UNIT + b.a[i];
		j = 1 << 26;
		while(j){
			tp = c * j;
			if(w >= tp) w -= tp;
			j >>= 1;
		}
	} 
	w.fh = tmp;
	return w;
}
inline gjd operator % (li x,gjd y){//低精模高精 
	return turn(x) % y;
}
inline gjd operator %= (gjd &z,li x){
	z = z % x;
	return z;
}
inline gjd operator %= (gjd &z,gjd x){
	z = z % x;
	return z;
}  
inline li operator %= (li &z,gjd x) {//请注意爆long long风险 
	if(z < x) return z;
	z = z % turn(x);
	return z;
}  

inline gjd spw(gjd q,li w){//高精度数据的单精度次幂运算，结果为高精度，要求指数是非负整数 
	if(w < 0){
		puts("error:in function 'spw(gjd q,long long int w)',w is negative!");
		exit(1);
	}
	if(!w) return turn(1);
	if(q == 0) return turn(0);
	if(q == 1) return turn(1);
	if(w == 1) return q;
	gjd z;
	z = spw(q,w >> 1);
	z = z * z;
	if(w & 1) z = z * q;
	return z;
}
inline gjd spw(li q,li w){//两个单精度数据的幂运算，结果为高精度，要求指数是非负整数  
	return spw(turn(q),w);
} 
inline gjd operator ^ (gjd q,li w){
	return spw(q,w);
}
inline gjd operator ^= (gjd &q,li w){
	q = q ^ w;
	return q;
}
//以下为指数是高精度的幂运算，小心结果可能很大！ 
inline gjd spw(gjd q,gjd w){
	if(w == 0) return turn(1);
	if(q == 0) return turn(0);
	if(q == 1) return turn(1);
	return spw(q,turn(w));
}
inline gjd spw(li q,gjd w){
	if(w == 0) return turn(1);
	if(q == 0) return turn(0);
	if(q == 1) return turn(1);
	return spw(turn(q),turn(w));
}
inline gjd operator ^ (gjd q,gjd w){
	if(w == 0) return turn(1);
	if(q == 0) return turn(0);
	if(q == 1) return turn(1);
	return spw(q,turn(w));
}
inline gjd operator ^= (gjd &q,gjd w){
	q = q ^ w;
	return q;
}
inline gjd operator ^ (li q,gjd w){
	if(w == 0) return turn(1);
	if(q == 0) return turn(0);
	if(q == 1) return turn(1);
	return spw(turn(q),turn(w));
}
inline li operator ^= (li &q,gjd w){//小心爆ll的风险 
	q = turn(q ^ w);
	return q;
}

inline gjd sqrt(gjd b){//高精开平方(牛顿迭代法)
	if(b.fh){
		puts("error:in function 'sqrt(gjd b)',b is negative!");
		exit(1);
	}
	if(b.len == 0) return turn(0);
	gjd z[2],tmp;
	bool i = 0; 
	z[1].a.resize((b.len + 1) / 2 - 1);
	z[1].a.push_back(1);
	z[1].len = (b.len + 1) / 2;
	while(z[i] != z[!i]){
		tmp = (b / z[!i] + z[!i]) / 2;
		if(z[!i] > z[i] && z[!i] - z[i] == 1 && z[i] == tmp) break;
		z[i] = tmp;
		i = !i;
	}
	return z[i];
}
inline gjd sqr(gjd a,li b){//二分法高精开b次方根,要求次数为正整数 
	if(b <= 0){
		puts("error:in function 'sqr(gjd a,li b)',b is not positive!");
		exit(1);
	}
	if(a.fh && b % 2 == 0){
		puts("error:in function 'sqr(gjd a,li b)',a is negative and b is even!");
		exit(1);
	}
	if(a.len == 0) return turn(0);
	if(b == 1) return a;
	int tmp = a.fh;
	a.fh = 0;
	if(a <= b) return turn(1 * tmp); 
	gjd l,r,mid,ans;
	l.a.resize((a.len - 1) / b);r.a.resize((a.len - 1) / b + 1);
	l.a.push_back(1);l.len = (a.len - 1) / b + 1;r.a.push_back(1);r.len = l.len + 1;
	while(l <= r){
		mid = (l + r) / 2;
		if(spw(mid,b) <= a){
			ans = mid;
			l = mid + 1;
		}
		else r = mid - 1;
	}
	ans.fh = tmp;
	return ans;
}


inline gjd gcd(gjd x,gjd y){//高精度与高精度的最大公因数，返回值非负（下同） 
	x.fh = y.fh = 0; 
	if(!x.len) return y;
	if(!y.len) return x;
	gjd q = turn(1);
	if(x < y) swap(x,y);
	while(x != y){
		if((x.a[0] & 1) && (y.a[0] & 1)) x -= y;
		else if(x.a[0] & 1) y /= 2;
		else if(y.a[0] & 1) x /= 2;
		else{
			x /= 2;
			y /= 2;
			q *= 2;
		}
		if(x < y) swap(x,y);
	}
	return q * x;
} 
inline gjd gcd(gjd x,li y){//高精度与单精度的最大公因数 
	x.fh = 0;y = abs(y);
	return y == 0 ? x : gcd(turn(y),x % y);
}
inline gjd gcd(li x,gjd y){//单精度与高精度的最大公因数 
	return gcd(y,x);
}
inline gjd gjd_gcd(li x,li y){//单精度与单精度的最大公因数，结果返回高精 
	x = abs(x);y = abs(y);
	return y == 0 ? turn(x) : gjd_gcd(y,x % y);
}
inline li gcd(li x,li y){//单精度与单精度的最大公因数，结果返回单精 
	x = abs(x);y = abs(y);
	return y == 0 ? x : gcd(y,x % y);
}

inline gjd lcm(gjd x,gjd y){//高精度与高精度的最小公倍数 
	x.fh = y.fh = 0;
	if(!x.len || !y.len) return turn(0);
	return x / gcd(x,y) * y;
}
inline gjd lcm(gjd x,li y){//高精度与单精度的最小公倍数 
	x.fh = 0;y = abs(y);
	if(!x.len || !y) return turn(0);
	return x / gcd(x,y) * y;
} 
inline gjd lcm(li x,gjd y){//单精度与高精度的最小公倍数 
	return lcm(y,x);
}  
inline gjd gjd_lcm(li x,li y){//单精度与单精度的最小公倍数,结果返回高精 
	x = abs(x);y = abs(y);
	if(!x || !y) return turn(0);
	return x / gjd_gcd(x,y) * y;
}
inline li lcm(li x,li y){//单精度与单精度的最小公倍数,结果返回单精 
	x = abs(x);y = abs(y);
	if(!x || !y) return 0;
	return x / gcd(x,y) * y;
}
int main(){
	
	return 0;
}
