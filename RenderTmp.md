$$
f_{i, j, k} = 
\begin{cases}
24f_{i - 1, j, k} + f_{i - 1, j - 1, k} + f_{i - 1, j, k - 1} &a_{j} \neq a_{n - k + 1}\\
25f_{i - 1, j, k} + f_{i - 1, j - 1, k - 1} &a_{j} = a_{n - k + 1}\\
\end{cases}
$$

$$
f_{i, j} = \sum_{k = 'a'}^{'z'}f_{i - 1, To_j(k)}\\
$$