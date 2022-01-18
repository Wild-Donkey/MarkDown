
$$
\begin{aligned}
&\sum_{i = 1}^{n} \sum_{j = 1}^{m} d(ij)\\
&\sum_{i = 1}^{n} \sum_{j = 1}^{m} d(i)d(j) - d(gcd(i, j))\\
= &\sum_{i = 1}^{n} \sum_{j = 1}^{m} \sum_{k | ij} 1\\
= &\sum_{k = 1}^{nm} \sum_{i = 1}^{\lfloor \frac nk \rfloor} \sum_{j = 1}^{\lfloor \frac m{ki} \rfloor} 1\\
= &\sum_{k = 1}^{nm} \sum_{i = 1}^{\lfloor \frac nk \rfloor} \lfloor \frac m{ki} \rfloor\\
\end{aligned}
$$
