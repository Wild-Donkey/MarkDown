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
\binom{p}{m} = \frac{p!}{m!(p - m)!} = \frac px \frac{(p - 1)!}{(m - 1)!((p - 1) - (m - 1))!} = \frac pm \binom{p - 1}{m - 1}
$$

由于是模 $p$ 意义下的运算, 且 $gcd(x, p) = 1$, 所以对 $m \in (0, p)$ 有

$$
\binom{p}{m}~\%~p = pInv_m \binom{p - 1}{m - 1}~\%~p = 0
$$

代入到二项式定理可得

$$
(1 + x)^p~\%~p = \sum_{i = 0}^p \binom{i}{p}x^i~\%~p = (1 + x^p)~\%~p
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
(1 + x)^n~\%~p = \sum_{i = 0}^{q_n}(\binom{i}{q_n}x^{ip}\sum_{j = 0}^{r_n}\binom{j}{r_n}x^j)~\%~p
$$

整理得

$$
(1 + x)^n~\%~p = \sum_{i = 0}^{q_n}\sum_{j = 0}^{r_n}\binom{i}{q_n}\binom{j}{r_n}x^{ip+j})~\%~p
$$

由于 $j < p$

$$