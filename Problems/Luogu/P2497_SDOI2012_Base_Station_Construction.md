# SDOI2012 基站建设

> stl 是 c++ 的馈赠。   ----Wild_Donkey

一开始看到这个题有标签 `线段树`，`平衡树`，`CDQ 分治`，做完后也没有用到这些 (如果 `std::set` 不算平衡树的话)。

一看题解发现所有人不是 CDQ，就是李超树，还有手写平衡树的。我十分不解，放着现成的 `set` 为什么不用啊。

## 式子

推式子的过程大同小异，可以略过。

设 $r_i$ 和 $R_i$ 为第 $i$ 个基站的发射和接收半径。

如果我们要把基站 $i$ 的信号传到基站 $j$，那么有式子:

$$
\begin{aligned}
(r_i + R_j)^2 &= (r_i - R_j)^2 + (x_i - x_j)^2\\
{r_i}^2 + {R_j}^2 + 2r_iR_j &= {r_i}^2 + {R_j}^2 - 2r_iR_j + (x_i - x_j)^2\\
4r_iR_j &= (x_i - x_j)^2\\
R_j &= \frac{(x_i - x_j)^2}{4r_i}\\
\sqrt{R_j} &= \frac{|x_i - x_j|}{2\sqrt{r_i}}\\
\end{aligned}
$$

显然如果一个基站的信号是从右边的基站接收来的，那么我们一定可以找到一个方案使得它的信号从左边接收而来且代价更小。因为信号的源头在最左端，所以把一个方案中，在 $x$ 右边的基站都不选，让信号直接从激活的基站中，$x$ 左边最近的基站传到 $x$，这样安排代价一定会更小，因为减少了激活一些基站的代价，中途额外代价也减少了。

接下来我们设信号传到基站 $i$ 的最小代价为 $f_i$，考虑 DP。

$$
f_i = V_i + \min_{j = 1}^{i - 1} (f_j + \frac{x_i - x_j}{2\sqrt{r_j}})
$$

然后就有以 $f_j - \dfrac{x_j}{2\sqrt{r_j}}$ 为因变量，以 $\dfrac{-1}{2\sqrt{r_j}}$ 为自变量，以 $x_i$ 为斜率，以 $f_i - V_i$ 为截距的函数。

$$
f_j - \frac{x_j}{2\sqrt{r_j}} = -\frac{x_i}{2\sqrt{r_j}} + f_i - V_i
$$

维护下凸壳进行斜率优化 DP 即可。答案即为 $max_{x_i + r_i \geq m} f_i$。

## 实现

这里是这篇题解的重点，具体介绍如何避免手写任何数据结构就能维护凸壳。

关于用 set 维护凸壳: 我们用 set 以横坐标为序保存这些点，写一个函数来判断从当前点 $this$ 到两个点 $x$，$y$ 的射线的斜率大小关系，用乘法代替除法以最大限度保留精度。

```cpp
struct Pnt {
  double X, Y;
  inline const char operator < (const Pnt& x) const {return X < x.X;}
  inline char KLeq (const Pnt x, const Pnt y) const {
    double Del1(x.X - X), Del2(y.X - X), Del3(x.Y - Y), Del4(y.Y - Y);
    return Del3 * Del2 <= Del4 * Del1;
  }
};
set<Pnt> S;
```

接下来一边输入一边 DP。因为 $x_i$ 递增，所以对于凸壳斜率小于 $x_i$ 的部分直接删掉即可，判断点 `S.begin()` 和 `++(S.begin())` 连成的线段的斜率和 $x_i$ 的关系，如果小于 $x_i$ 就删除 `S.begin()`。删到不能删的时候，`S.begin()` 即为我们用来转移 $f_i$ 的决策点。

算出 $f_i$ 还要记得尝试更新答案。

```cpp
A = RD(), B = RD(), C = RD(), Tmp = 0;
set<Pnt>::iterator It(S.begin()), Pre, Suf, TmpI;
while (((++It) != S.end()) && ((It->Y - S.begin()->Y) <= (It->X * A - S.begin()->X * A))) S.erase(S.begin());
Tmp = S.begin()->Y - S.begin()->X * A + C;
if(A + B >= m) Ans = min(Tmp, Ans);
```

接下来用 $f_i$ 算出它对应的点，插入凸壳中。这里找出它前面的点和后面的点，判断一下是否落到了凸壳内部，落到内部就不用插入了，直接删除。

```cpp
XTmp = (-1) / (2 * sqrt(B));
TmpI = Pre = Suf = It = (S.insert({XTmp, Tmp + XTmp * A})).first, ++Suf;
if(Pre != S.begin() && Suf != S.end()) {
  --Pre;
  if(Pre->KLeq(*(Suf), *(It))) {S.erase(It); continue;}
}
```

如果没落到内部，那么就尝试把新加入的点的左右的不凸了的点删除。先搞左边再搞右边。

```cpp
if(It != S.begin()) {
  Suf = It, Pre = --It;
  while (Pre != S.begin()) {
    --Pre;
    if(Pre->KLeq(*Suf, *It)) S.erase(It), It = Pre; else break;
  }
}
It = Pre = TmpI, ++It;
if(It == S.end()) continue;
Suf = It, ++Suf;
while (Suf != S.end()) {
  if(Pre->KLeq(*Suf, *It)) S.erase(It), It = Suf, ++Suf; else break;
}
```

下面是合订本:

```cpp
double A, B, C;
double Ans(1e18), Tmp(0), XTmp(0);
unsigned long long m; 
unsigned n;
unsigned D, t;
signed main() {
  n = RD(), m = RD();
  A = RD(), B = RD(), C = RD();
  XTmp = (-1) / (2 * sqrt(B));
  S.insert({XTmp, C + XTmp * A});
  for (unsigned i(2); i <= n; ++i) {
    A = RD(), B = RD(), C = RD(), Tmp = 0;
    set<Pnt>::iterator It(S.begin()), Pre, Suf, TmpI;
    while (((++It) != S.end()) && ((It->Y - S.begin()->Y) <= (It->X * A - S.begin()->X * A))) S.erase(S.begin());
    Tmp = S.begin()->Y - S.begin()->X * A + C;
    if(A + B >= m) Ans = min(Tmp, Ans);
    XTmp = (-1) / (2 * sqrt(B));
    TmpI = Pre = Suf = It = (S.insert({XTmp, Tmp + XTmp * A})).first, ++Suf;
    if(Pre != S.begin() && Suf != S.end()) {
      --Pre;
      if(Pre->KLeq(*(Suf), *(It))) {S.erase(It); continue;}
    }
    if(It != S.begin()) {
      Suf = It, Pre = --It;
      while (Pre != S.begin()) {
        --Pre;
        if(Pre->KLeq(*Suf, *It)) S.erase(It), It = Pre; else break;
      }
    }
    It = Pre = TmpI, ++It;
    if(It == S.end()) continue;
    Suf = It, ++Suf;
    while (Suf != S.end()) {
      if(Pre->KLeq(*Suf, *It)) S.erase(It), It = Suf, ++Suf; else break;
    }
  }
  printf("%.3lf\n", Ans);
  return Wild_Donkey;
}
```

代码过程中我犯了很多错，最弱智的莫过于忘记维护凸壳，写完还嘲讽这个题怎么这么好写并且过了两个点得了 $11$ 分。(没错就是没有删点只有加点)