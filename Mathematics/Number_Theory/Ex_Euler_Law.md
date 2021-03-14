# 扩展欧拉定理

## 欧拉函数 $\phi$

设 $\phi(x)$ 为 $[1, x]$ 范围内和 $x$ 互质的数的数量.

对于质数 $x$, 由于和 $[1, x - 1]$ 中任意数字互质, 所以有结论

$$
\phi(x) = x - 1
$$

对于正整数 $x$, $p_i$ 表示第 $i$ 个质数, 由正整数的唯一分解设

$$
x = \prod_{i}^{p_i | x} p_i^{a_i}
$$

由于被 $p_i$ 整除的数有 $x / p_i$ 个, 这些数一定不和 $x$ 互质. 结合容斥原理, 对于所有的 $p_i|x$, 和 $x$ 互质的数有

$$
\sum_{i}^{p_i|x} \frac{x}{p_i} - \sum_{i, j}^{p_ip_j|x} \frac{x}{p_ip_j} + \sum_{i, j, k}^{p_ip_jp_k|x} \frac{x}{p_ip_jp_k} - ...
$$

提公因式:

$$
x (\sum_{i}^{p_i|x} \frac1{p_i} - \sum_{i, j}^{p_ip_j|x} \frac1{p_ip_j} + \sum_{i, j, k}^{p_ip_jp_k|x} \frac1{p_ip_jp_k} - ...)
$$

整理得

$$
\phi(x) = x \prod_{i}^{p_i|x} (1 - \frac{1}{p_i})
$$

设 $x = ab$, $gcd(a, b) = 1$

$$
\phi(a) = a \prod_{i}^{p_i|a} (1 - \frac{1}{p_i})\\
\phi(b) = b \prod_{i}^{p_i|b} (1 - \frac{1}{p_i})
$$

把两式相乘

$$
\phi(a)\phi(b) = ab \prod_{i}^{p_i|a} \prod_{i}^{p_i|b}
$$

已知 $p_i|a$ 和 $p_i|b$ 不能同时满足, 又因为 $x = ab$, 所以只要 $p_i|b~or~p_i|a$, 当且仅当 $p_i|x$, 上式变成

$$
\phi(a)\phi(b) = x \prod_{i}^{p_i|x} = \phi(x)
$$

因此得出结论, 对于 $x = ab$, $gcd(a, b) = 1$, 有

$$
\phi(x) = \phi(a)\phi(b)
$$

我们把 $\phi(x)$ 这种性质称作 `积性函数`

## 欧拉定理

设正整数 $a$, $p$ 互质

则

$$
a^{\phi(p)}~\%~p = 1
$$

由此可以推得费马小定理, 即对于正整数 $a$ 和质数 $p$, 有

$$
a^{\phi(p)}~\%~p = a^{p - 1}~\%~p = 1
$$

这就是快速幂求乘法逆元的原理

## 扩展欧拉定理

### 前置知识

* 引理一, 设正整数 $x$, $a_1$, $a_2$, $a_3$, ..., $a_n$, 如果 $x \equiv y (mod~a_i)$, 则有

$$
x \equiv y (mod~lcm(a_i))\\
x \equiv y (mod~\prod_{i}a_i)
$$

* 引理二, 设质数 $p$, 正整数 $x > 1$, 则

$$
\phi(p^x) = p^x (1 - \frac{1}{p}) = p^x - \frac{p^x}{p} = p^x - p^{x - 1} \geq x
$$

### 证明

设正整数 $q$, $a$, $x$, 质数 $p$, 满足 $x \geq \phi(p^q)$

由于 $p$ 是质数, 所以对于 $gcd(a, p)$, 有两种情况, 即 $1$ 或 $p$.

* 针对 $gcd(a, p) = 1$ 的情况,  一定有 $gcd(a^x, p^q) = 1$, 根据欧拉定理, $a^{\phi(p^q)}~\%~p^q= 1$, 所以一定有

$$
a^x~\%~p^q = a^{x~\%~\phi(p^q)}~\%~p^q = (a^{(x~\%~\phi(p^q)) + \phi(p^q)})~\%~p^q
$$

* 针对 $gcd(a, p) = p$ 的情况, 由引理二得 $x \geq \phi(p^q) \geq q$.  一定有 $a^x~\%~p^q = a^{\phi(p^q)}~\%~p^q = 0$. 所以
 
$$
(a^{x~\%~\phi(p^q)}a^{\phi(p^q)})~\%~p^q = (a^{(x~\%~\phi(p^q)) + \phi(p^q)})~\%~p^q = 0 = a^x~\%~p^q
$$

综上, 对于所有正整数 $q$, $a$, $x$, 质数 $p$, $(x \geq \phi(p^q))$, 有

$$
a^x~\%~p^q = (a^{(x~\%~\phi(p^q)) + \phi(p^q)})~\%~p^q
$$

设正整数 $m$, 将其拆分为质因数对应幂的乘积, 由引理一和 $\phi(x)$ 的积性函数性质得

$$
x~\%~\phi(p_{i}^{q_i})= x~\%~lcm(\phi(p_i^{q_i})) = x~\%~\phi(m)
$$

因为 $x \geq \phi(m)$, 所以对于所有 $i$ 满足 $p_i|m$, 有 

$$
x~\%~\phi(p_i^{q_i}) = x~\%~\phi(m)
$$

因此

$$
a^x \equiv a^{x~\%~\phi(m) + \phi(m)}~(mod~p_i^{q_i})
$$

再次利用引理一, 得到


$$
a^x \equiv a^{x~\%~\phi(m) + \phi(m)}~(mod~m)
$$

这就是扩展欧拉定理

## 模板 [Luogu5091](https://www.luogu.com.cn/problem/P5091)

求 $a^b~\%~m$, $(1 \leq a \leq 10^9, 1 \leq b \leq 10^{2*10^7}, 1 \leq m \leq 10^8)$

根据扩展欧拉定理

$$
a^b~\%~m = a^{b~\%~\phi(m) + \phi(m)}~\%~m
$$

易证

$$
x~\%~p = (((x~\%~10^k)~\%~p) * 10^k + (x~/~10^k))~\%~p
$$

所以 $b$ 对 $\phi(m)$ 取模, 可以在快读过程中不断取模避免高精

值得一提的是, 本题中可能出现 $b < \phi(m)$ 的情况, 这时, $a^{b~\%~\phi(m) + \phi(m)}$ 是错误的, 应该是 $a^{b~\%~\phi(m)}$, 所以读入时也要判断 $b$, $m$ 的大小关系.

```cpp
while (ch < '0' || ch > '9') {
  ch = getchar();
}
while (ch >= '0' && ch <= '9') {
  B *= 10;
  B += ch - '0';
  if(B > C) {
    flg = 1;
    B %= C;
  }
  ch = getchar();
}
```

关于求 $phi(m)$, 由于只求一个数, 且 $m \leq 10^8$, 所以线性筛就不好使了, 用下面的式子求出 $phi(m)$ (先除后乘防溢出)

$$
\phi(x) = x \prod_{i}^{p_i|x} (1 - \frac{1}{p_i})
$$

```cpp
unsigned Phi(unsigned x) {
  unsigned tmp(x), anotherTmp(x), Sq(sqrt(x));
  for (register unsigned i(2); i <= Sq && i <= x; ++i) {
    if(!(x % i)) {
      while (!(x % i)) {
        x /= i;
      }
      tmp /= i;
      tmp *= i - 1;
    }
  }
  if (x > 1) {//存在大于根号 x 的质因数 
    tmp /= x;
    tmp *= x - 1;
  }
  return tmp;
}
```

这里要说明一下为什么枚举到 $\sqrt{n}$, 把这些质因数除掉后剩下的 $n'$ 一定是质数. 首先, $n' \leq n$, 如果是合数, 一定存在因数 $p$ 使得 $p \leq \sqrt{n'} \leq \sqrt{n}$ 或 $n'/p \leq \sqrt{n'} \leq \sqrt{n}$, 而这个 $p$ 或 $n'/p$ 至少有一个已经被枚举到了, 所以 $n'$ 不可能是合数.

最后便是求乘积了, 用最普通的取模快速幂完成这个任务

```cpp
unsigned Power(unsigned x, unsigned y) {
  if(!y) {
    return 1;
  }
  unsigned tmp(Power(x, y >> 1));
  tmp = ((long long)tmp * tmp) % D;
  if(y & 1) {
    return ((long long)tmp * x) % D;
  }
  return tmp;
}
```

最后是加了一点特判的完整 `main()`

```cpp
int main() {
  A = RD();
  D = RD();
  C = Phi(D);
  while (ch < '0' || ch > '9') {
    ch = getchar();
  }
  while (ch >= '0' && ch <= '9') {
    B *= 10;
    B += ch - '0';
    if(B > C) {
      flg = 1;
      B %= C;
    }
    ch = getchar();
  }
  if(B == 1) {
    printf("%u\n", A % D);
    return Wild_Donkey;
  }
  if(flg) {
    printf("%u\n", Power(A, B + C));
  }
  else {
    printf("%u\n", Power(A, B));
  }
  return Wild_Donkey;
}
```