# 模反元素 (Modular Multiplicative Inverse)

模板: [Luogu P3811](https://www.luogu.com.cn/problem/P3811)

求 $1$ 到 $n$ 每个数模 $p$ 意义下最小正整数乘法逆元
$n \leq 3*10^6$, $p < 20000528$, $500ms$

## 概念

模反元素, 又称模逆元, 简称逆元, 其定义是在取模意义下的倒数

$$
ax \% p = 1
$$

则称 $x$ 是 $a$ 模 $p$ 意义下的逆元.

$a$ 模 $p$ 意义下的逆元存在当且仅当 $a$, $p$ 互质, 接下来给出证明.

## Exgcd

根据定义, 整理式子

$$
ax + py = 1
$$

根据最大公因数的定义, $gcd(a, p)$ 是式子 $ax + py$ 最小的正值. 如果 $ax + py = 1$, 那么必须满足 $gcd(a, b) = 1$, 即两数互质.

可以用 `exgcd` 快速算出使得 $ax + py = 1$ 的 $x$, $y$ 的一组解, 通过使 $x$ 对 $p$ 的取模, 可以常数时间利用 $x$ 求出最小的正整数解.

当然, 由于求 $3 * 10^6$ 个数的逆元, 一次操作复杂度 $O(logn)$, 最后是会超时的, 第一次提交总时间是 $1.01s$, 在我在细节上压榨过常数之后, 下面这份代码的时间来到了 $959ms$.

```cpp
inline void Exgcd(int a, int b, int &x, int &y) {
  if(!b) {
    x = 1;
    y = 0;
  }
  else {
    Exgcd(b, a % b, y, x);
    y -= (a / b) * x;
  }
}
signed main() {
  n = RD();
  p = RD();
  for (register int i(1); i <= n; ++i) {
    Exgcd(p, i, A, B);
    B %= p;
    B += p;
    B %= p;
    printf("%d\n", B); 
  }
  return Wild_Donkey;
}
```

接下来, 分析代码, 发现递归是可以优化的, 于是改成循环, 优化到 $920ms$

```cpp
inline void Exgcd(int a, int b, int &x, int &y) {
  int tmp;
  Cnt = 0;
  while(b) {
    a_b[++Cnt] = a / b;
    tmp = a;
    a = b;
    b = tmp % b;
  }
  x = 1;
  y = 0;
  for (register unsigned j(Cnt); j >= 1; --j) {
    tmp = x;
    x = y;
    y = tmp - a_b[j] * x;
  }
}
```

然后发现还有好多时间浪费到了输出上, 从网上嫖了个 `fwrite`, 并且进一步在细节上压榨 (如, 内层循环用 `short` 类型的控制器), 优化到 $888ms$.

```cpp
signed main() {
  n = RD();
  p = RD();
  for (register unsigned i(1); i <= n; ++i) {
    C = p;
    D = i;
    Cnt = 0;
    while(D) {
      a_b[++Cnt] = C / D;
      Tmp = C;
      C = D;
      D = Tmp % D;
    }
    A = 1;
    B = 0;
    for (register short j(Cnt); j >= 1; --j) {
      Tmp = A;
      A = B;
      B = Tmp - a_b[j] * A;
    }
    B %= p;
    B += p;
    B %= p;
    write(B);
  }
  fwrite(_d,1,_p-_d,stdout);
  return Wild_Donkey;
}
```

最后发现 `Tmp` 是 `unsigned`, 其它的变量是 `int`, 强转浪费时间了, 于是都改成 `int` 之后, 直接一波优化到 $816ms$.

## 线性递推

用 $a$ 表示 $p$, 设 $k = \left\lfloor\frac{a}{p}\right\rfloor$, $r = p \% a$

$$
(ak + r) \% p = 0 
$$

如果用 $Inv_i$ 表示 $i$ 模 $p$ 意义下的逆元, 则式子除以 $Inv_aInv_r$ 得

$$
(Inv_rk + Inv_a) \% p = 0
$$

移项, 由于所求的 $x = Inv_a$, 得到表达式

$$
Inv_a = (-Inv_rk) \% p
$$

可以递推求解

由于 $r = p \% a$, 所以 $r < a$, $Inv_r$ 已经求出, 而 $k = \left\lfloor\frac{a}{p}\right\rfloor$, 可以直接求, 所以可以线性时间求 $Inv_1$ 到 $Inv_n$, 下面这份代码只用了 $253ms$

```cpp
signed main() {
  n = RD();
  p = RD();
  a[1] = 1;
  write(a[1]);
  for (register unsigned i(2); i <= n; ++i) {
    a[i] = ((long long)a[p % i] * (p - p / i)) % p;
    write(a[i]);
  }
  fwrite(_d,1,_p-_d,stdout);
  return Wild_Donkey;
}
```