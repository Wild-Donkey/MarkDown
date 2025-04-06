# Auto Regressive

$$
x_t = u_t + \sum_{i = 1}^{p} \phi_i x_{t - i}
$$

线性递推方程, 非齐次, 因为存在噪音项 $u_t$.

# Moving Average

$$
x_t = u_t + \sum_{i = 1}^{q} \theta_i u_{t - i}
$$

指标数值是噪声的线性组合.

# ARMA

$$
x_t = u_t + \sum_{i = 1}^{p} \phi_i x_{t - i} + \sum_{i = 1}^{q} \theta_i u_{t - i}
$$

前面两个模型的组合, 既考虑了之前指标值的影响, 也考虑的噪音的影响.

# ARIMA

I for `Integrated`.

前面的模型的局限是在自回归系数设置不同的时候, 趋于指数爆炸或趋于零, 又或是维持在某个稳定的数值 (加权平均). 指数爆炸和趋于零显然会使得整个模型失去意义, 但是加权平均的情况又难以分析整体的上升或下降趋势.

发现可以对指标值取微分, 整体取向会在微分的过程中逐渐消失.

$$
x_t^{(d)} = u_t + \sum_{i = 1}^{p} \phi_i x_{t - i}^{(d)} + \sum_{i = 1}^{q} \theta_i u_{t - i}
$$


