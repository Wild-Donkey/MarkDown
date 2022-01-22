$$
\begin{aligned}
&\sum_{i = 1}^n \sum_{j = 1}^m \sum_{k_3 | i} \sum_{k_2 | j} [gcd(k_3, k_2) = 1]\\
= &\sum_{k_3 = 1}^n \sum_{k_2 = 1}^m [gcd(k_3, k_2) = 1] \lfloor \frac n{k_3} \rfloor\lfloor \frac m{k_2} \rfloor\\
= &\sum_{d = 1}^n \mu(d) \sum_{k_3 = 1}^{\lfloor \frac nd \rfloor} \sum_{k_2 = 1}^{\lfloor \frac md \rfloor} \lfloor \frac n{k_3d} \rfloor\lfloor \frac m{k_2d} \rfloor\\
= &\sum_{d = 1}^n \mu(d) (\sum_{k_3 = 1}^{\lfloor \frac nd \rfloor}\lfloor \frac n{k_3d} \rfloor) (\sum_{k_2 = 1}^{\lfloor \frac md \rfloor} \lfloor \frac m{k_2d} \rfloor)\\
= &\sum_{d = 1}^n \mu(d) (\sum_{k_3 = 1}^{\lfloor \frac nd \rfloor}\lfloor \frac {\lfloor \frac nd \rfloor}{k_3}\rfloor) (\sum_{k_2 = 1}^{\lfloor \frac md \rfloor} \lfloor \frac {\lfloor \frac md \rfloor}{k_2}\rfloor)\\
\end{aligned}
$$
