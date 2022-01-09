$$
\begin{aligned}
& O(n(n - 2) + \sum_{i = 1}^{n}\sum_{j = 0}^{n - 2} \frac{j}{i})\\
=& O(n^2 + \sum_{j = 0}^{n - 2}j\sum_{i = 1}^n\frac 1i)\\
=& O(n^2 + \sum_{j = 0}^{n - 2}\ln n)\\
=& O(n^2 + (n - 2)(n - 1)\ln n)\\
=& O(n^2(1 + \ln n))\\
=& O(n^2\ln n))\\
\end{aligned}
$$