//lct(附带简单子树操作)
int f[100010],l[100010],r[100010],t[100010],s[100010];
bool c[100010];
inline bool is(int q){
    return l[f[q]] != q && r[f[q]] != q;
}
inline void rv(int q){
    c[q] ^= 1;swap(l[q],r[q]);
}
inline void ps(int q){
    if(!c[q]) return;
    if(l[q]) rv(l[q]);
    if(r[q]) rv(r[q]);
    c[q] = 0;
}
inline void ud(int q){
    t[q] = t[l[q]] + t[r[q]] + s[q] + 1;
}
void ro(int q){
    int p = f[q];
    if(l[f[p]] == p) l[f[p]] = q;
    else if(r[f[p]] == p) r[f[p]] = q;
    f[q] = f[p];f[p] = q;
    if(l[p] == q){
        l[p] = r[q];r[q] = p;
        if(l[p]) f[l[p]] = p;
    }
    else{
        r[p] = l[q];l[q] = p;
        if(r[p]) f[r[p]] = p;
    }
    ud(p);ud(q);
}
void gx(int q){
	if(!is(q)) gx(f[q]);
	ps(q);
}
void sp(int q){
    gx(q);
    while(!is(q)){
        int p = f[q];
        if(!is(p)){
			if((l[p] == q) ^ (l[f[p]] == p)) ro(q);
        	else ro(p);
        }
        ro(q);
    }
}
int fd(int q){
    sp(q);
    while(l[q]) q = l[q];
    return q;
}
void ac(int q){
    int p = 0;
    while(q){
        sp(q);
		s[q] += t[r[q]];
		r[q] = p;
		s[q] -= t[r[q]];
        ud(q);
        p = q;q = f[q];
    }
}
void mk(int q){
    ac(q);sp(q);rv(q);
}
void si(int q,int w){
    mk(q);ac(w);sp(w);
}
void lk(int q,int w){
    si(q,w);
    f[q] = w;
	s[w] += t[q];
	ud(w);
}
void ct(int q,int w){
	si(q,w);
	f[q] = r[w] = 0;
	ud(w);
} 
