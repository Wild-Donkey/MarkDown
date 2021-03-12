## 题意

**[Luogu P3834](https://www.luogu.com.cn/problem/P3834)**


维护一个数组($[1 , n]$), 可以在任意区间查询第 $k$ 小值($m$ 次).

$1 \leq n \leq 2 * 10^5$, $1 \leq n \leq 2 * 10^5$, $-10^9 \leq a_i \leq 10^9$

## 区间第 $k$ 小值

统计区间内各数出现次数, 从小到大统计, 直到小于等于当前数的数字个数刚好大于等于 $k$.

## 前缀和

为了提高效率, 可以用前缀和维护和查询每个数在不同区间出现的次数.

## 权值线段树

即使这样, 查询时也要从小到大枚举每个数, 所以考虑实现二分查找, 将枚举数字的个数从 $O(n)$ 优化到 $O(logn)$

在数组值域上建立线段树, 单点存储该值出现的次数. 查询时, 左子树的值 $\geq k$, 则要找的数在左子树, 反之在右子树.

## 离散化

权值线段树的根节点区间是值域 $[-10^9, 10^9]$, 很显然, 空间一定不够. 就算是动态开点线段树, 插入一个点也需要大约 $30$ 个节点.

引入离散化, 最多只会出现 $n$ 个数字, 将线段树根的区间优化到 $[1,2 * 10^5]$

## 可持久化

如果给每个位置都建一棵权值线段树, 空间一定不够用, 但是思考每一个位置的线段树相对前一个位置的线段树的区别只是某点权值加一, 想到可持久化.

**[参见可持久化数组](https://www.cnblogs.com/Wild-Donkey/p/14277676.html)**

在处理某位置的前缀和的时候, 从上一个位置的线段树继承过来, 在新版本上修改.

时空复杂度 $O((n + m)logn)$

## 实现

### 建树

由于原始状态线段树为空, 所以动态开点的可持久化线段树只需要新建一个根节点即可.

### 修改

在特定的点加上$1$, 同步遍历当前版本和前一个版本, 批判地继承.

```cpp
void Chg(Node *x, Node *y, unsigned int l, const unsigned int &r) {
  if (y) {  //更新权值
    x->Val = y->Val + 1;
  } else {
    x->Val = 1;
  }
  if (l == r) {  //边界
    return;
  }
  unsigned int m = (l + r) >> 1;  //继续递归
  if (B <= m) {                   //左边
    if (y) {
      x->R = y->R;                     //继承右儿子
      Chg(x->L = ++Cntn, y->L, l, m);  //递归左儿子
    } else {
      x->R = NULL;                     //无可继承
      Chg(x->L = ++Cntn, NULL, l, m);  //递归左儿子
    }
  } else {  //右边
    if (y) {
      x->L = y->L;                         //继承左儿子
      Chg(x->R = ++Cntn, y->R, m + 1, r);  //递归右儿子
    } else {
      x->L = NULL;
      Chg(x->R = ++Cntn, NULL, m + 1, r);  //递归右儿子
    }                                      //继承左儿子
  }
  return;
}
```

### 查询

两个版本($L - 1$, $R$) 二分查找.

由于某些指针为空, 所以可能有时会 `RE`, 所以进行一系列操作来避免.

```cpp
void Qry(Node *x, Node *y, unsigned int l, const unsigned int &r) {
  if (l == r) {  //边界
    Lst = l;
    return;
  }
  unsigned int m = (l + r) >> 1, Tmpx(0), Tmpy(0);
  Node *Sonxl(NULL), *Sonxr(NULL), *Sonyl(NULL), *Sonyr(NULL);
  if (x) {
    if (x->L) {
      Tmpx = x->L->Val;
      Sonxl = x->L;
    }
    if (x->R) {
      Sonxr = x->R;
    }
  }
  if (y) {
    if (y->L) {
      Tmpy = y->L->Val;
      Sonyl = y->L;
    }
    if (y->R) {
      Sonyr = y->R;
    }
  }                                  //防RE, 提前特判
  if (C <= Tmpy - Tmpx) {            //在左边
    return Qry(Sonxl, Sonyl, l, m);  //递归左儿子
  }
  C += Tmpx;  //右边
  C -= Tmpy;
  return Qry(Sonxr, Sonyr, m + 1, r);  //递归右儿子
}
```

### `main()`

某些代码部分已省略.

```cpp
int main() {
  n = RD();
  M = RD();
  memset(N, 0, sizeof(N));
  for (register int i(1); i <= n; ++i) {
    b[i] = a[i] = RD();  //创建副本
  }
  sort(b + 1, b + n + 1);
  b[0] = 0x3f3f3f3f;
  for (register int i(1); i <= n; ++i) {
    if (b[i] != b[i - 1]) {
      Rkx[++Cnta] = b[i];  // Rkx[i]为第i大的数为多少(离散化)
    }
  }
  Vrsn[0] = N;
  for (register int i(1); i <= n; ++i) {
    A = i;
    B = lower_bound(Rkx + 1, Rkx + Cnta + 1, a[i]) -
        Rkx;  //给当前数字的次序(离散化后的值) 这个点加一
    Chg(Vrsn[i] = ++Cntn, Vrsn[i - 1], 1, Cnta);  //在上一个位置前缀和基础上修改
  }
  for (register int i(1); i <= M; ++i) {
    A = RD();
    B = RD();
    C = RD();
    Qry(Vrsn[A - 1], Vrsn[B], 1, Cnta);  //查询
    printf("%d\n", Rkx[Lst]);  //同样, 将查询结果存入Lst后, 输出Lst对应的原始值
  }
  return 0;
}
```