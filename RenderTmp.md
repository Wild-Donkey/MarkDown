
$$
\begin{aligned}
f_{i, j, 0} &= \max_{k = 0}^j(f_{i, j, 0}, f_{i, j - k, 0} + f_{Son, k, 0/1/2})\\
f_{i, j, 1} &= \max_{k = 0}^j(f_{i, j, 1}, f_{i, j - k, 1} + f_{Son, k, 0/1/2}, f_{i, j - k, 0} + f_{Son, k, 1} + V_{i, Son})\\
f_{i, j, 2} &= \max_{k = 0}^j(f_{i, j, 2}, f_{i, j - k, 2} + f_{Son, k, 0/1/2}, f_{i, j - k + 1, 1} + f_{Son, k, 1} + V_{i, Son})\\
\end{aligned}
$$