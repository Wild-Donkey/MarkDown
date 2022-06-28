# 卢卡斯定理(Lucas Law)

$_{如无特殊说明, 则本文除法向下取整}$

## 核心内容

对正整数 $m$, $n$, 质数 $p$, 有

$$
\binom{n}{m}~\%~p = \binom{\frac{n}{p}}{\frac{m}{p}} \binom{n~\%~p}{m~\%~p} ~\%~p
$$

## 证明

从 $\binom{p}{m}~(p > m)$ 开始证明

$$
\binom{p}{m} = \frac{p!}{m!(p - m)!} = \frac pm \frac{(p - 1)!}{(m - 1)!((p - 1) - (m - 1))!} = \frac pm \binom{p - 1}{m - 1}
$$

由于是模 $p$ 意义下的运算, 且 $gcd(m, p) = 1$, 所以对 $m \in (0, p)$ 有

$$
\binom{p}{m}~\%~p = pInv_m \binom{p - 1}{m - 1}~\%~p = 0
$$

代入到二项式定理可得

$$
(1 + x)^p~\%~p = \sum_{i = 0}^p \binom{p}{i}x^i~\%~p = (1 + x^p)~\%~p
$$

将二项式指数推广到正整数 $n$, 设 $q_m = \frac mp$, $q_n = \frac np, r_m = m~\%~p, r_n = n~\%~p$

$$
(1 + x)^n = (1 + x)^{q_np + r_n} = (1 + x)^{q_np}(1 + x)^{r_n}
$$

使用前面的结论 $(1 + x)^p~\%~p = (1 + x^p)~\%~p$, 整理上式得

$$
(1 + x)^n~\%~p = (1 + x^p)^{q_n}(1 + x)^{r_n}~\%~p
$$

代入二项式定理

$$
(1 + x)^n~\%~p = \sum_{i = 0}^{q_n}(\binom{q_n}{i}x^{ip}\sum_{j = 0}^{r_n}\binom{r_n}{j}x^j)~\%~p
$$

整理得

$$
(1 + x)^n~\%~p = \sum_{i = 0}^{q_n}\sum_{j = 0}^{r_n}(\binom{q_n}{i}\binom{r_n}{j}x^{ip+j})~\%~p
$$

由于 $j < p$, 所以任意一组 $i$, $j$ 对应唯一的 $ip + j$ 值, 和 $[0, n]$ 内的每一个数一一对应, 所以将式子改写为枚举 $m = ip + j$ 的值.

$$
(1 + x)^n~\%~p = \sum_{m = 0}^{n} \binom{q_n}{q_m} \binom{r_n}{r_m}x^k~\%~p
$$

所以, 模 $p$ 意义下, $(1 + x)^n$ 的 $m$ 次项系数 $\binom nm$ 就是 $\binom{q_n}{q_m} \binom{r_n}{r_m}$

定理得证

## 模板[Luogu3807](https://www.luogu.com.cn/problem/P3807)

求 $T$ 组 $\binom{n + m}{n}~\%~p$

$1 \leq n, m, p \leq 10^5, 1 \leq T \leq 10$, $p$ 为质数

由于 $p$ 为质数且 $p \leq 10^5$, 可以用 `Lucas 定理` 递归求解

$$
\binom {n + m}n~\%~p = \binom {(n + m)~\%~p}{n~\%~p} \binom {(n + m)/p}{m / p}~\%~p
$$

```cpp
unsigned Lucas (unsigned x, unsigned y) {
  if(x <= Mod && y <= Mod) {
    return Binom(x, y);
  }
  return ((long long)Binom(x % Mod, y % Mod) * Lucas(x / Mod, y / Mod)) % Mod;
}
```

递归边界就是 $x, y \in [0, p)$, 直接 $O(n)$ 求出 $\binom xy$

需要注意的是, 当遇到取模之后 $x < y$ 时, $\binom xy = 0$, 因为 $(1 + x)^x$ 不存在 $y$ 次项 (括号内的 $x$ 是自变量, 指数 $x$ 是函数调用的参数)

还有, 当 $y = 0$ 的时候, $\binom xy = 1$, 尽管不加这个特判返回值也是 $0$, 但是不知道为什么我还是加了

```cpp
unsigned Binom (unsigned x, unsigned y) {
  unsigned Up(1), Down(1);
  if (y > x) {
    return 0;
  }
  if(!y) {
    return 1;
  }
  for (register unsigned i(2); i <= x; ++i) {
    Up = ((long long)Up * i) % Mod;
  }
  for (register unsigned i(2); i <= y; ++i) {
    Down = ((long long)Down * i) % Mod;
  }
  for (register unsigned i(2); i <= x - y; ++i) {
    Down = ((long long)Down * i) % Mod;
  }
  Down = Power(Down, Mod - 2);
  return ((long long)Up * Down) % Mod;
}
```

函数 `Binom()` 中的 `Power()` 用来根据欧拉定理求乘法逆元, 即 $Inv_x = x^{p - 2}$

```cpp
unsigned Power (unsigned x, unsigned y) {
  if(!y) {
    return 1;
  }
  unsigned tmp(Power(((long long)x * x) % Mod, y >> 1));
  if(y & 1) {
    return ((long long)x * tmp) % Mod;
  }
  return tmp;
}
```

最后放出 `main()`, 可以看出又多了一句无关紧要的特判, 一看就是让 `julian` 毒害过的可怜人

```cpp
int main() {
  t = RD();
  for (register unsigned T(1); T <= t; ++T){
    Clr();
    if(!(n && m)) {
      printf("1\n");
      continue; 
    }
    printf("%u\n", Lucas(n + m, n));
  }
  return Wild_Donkey;
}
```