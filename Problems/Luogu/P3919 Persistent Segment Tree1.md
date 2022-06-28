## 题意

**[Luogu P3919](https://www.luogu.com.cn/problem/P3919)**

维护一个数组($[1 , n]$), 可以在任意一历史版本上单点修改和查询($m$ 次).

$1 \leq n \leq 10^6$, $1 \leq n \leq 10^6$

## 不持久

线段树可以实现在单一版本上单点修改和查询. (当然这不如直接用单个数组存储)

只要在根节点 ($[1 , n]$) 往下递归, 直到找到对应位置进行操作即可.

## 持久

所谓持久, 即保存所有操作中的历史版本. 当然, 第一反应当然时每次操作直接复制一个线段树, 这样做的复杂度为 $O(mnlogn)$

## 动态开点

动态开点的仅针对一开始为空的线段树. 对于查询, 一个节点表示的区间为空时, 一个节点和一棵子树的区别不大. 所以思考只有在插入一个值的时候, 新建最多 $log_2n$ 个节点进行存储. 这样就能解决根节点范围很大但数据相对稀疏的线段树的空间问题了.

## 可持久化

可是, 本题一开始的线段树不为空啊, 讲动态开点有什么用呢?

如果根据前面的朴素算法, 每次操作后新复制的线段树相对前一个版本的区别就相当于一棵空树加一个单点有值, 而且根节点表示的范围又很大. 这不就是动态开点所处理的稀疏线段树吗?

只不过, 修改时, 新开的点不再连接到原树上的父节点, 而是连到新树上. 对于一个新的版本, 从根节点开始, 新建节点, 若某个子树和上一版本完全相同, 儿子指针直接指向将上一个版本的该节点地址. 若是修改的点所在子树, 则对该子树进行递归.

时空复杂度 $O((n + m)logn)$

## 实现

### 存储

由于空间拮据, 所以不在节点内存其表示的区间, 而是做参数传入, 递归时维护.
```cpp
struct Node {
  Node *L, *R;  //左右儿子指针
  int Val;      //值
} N[20000005], *Vrsn[1000005] /*每个版本根节点*/, *Cntn(N) /*栈顶*/;
```

### 建树

和一般线段树类似的操作.

```cpp
void Bld(Node *x, unsigned int l,
         const unsigned int &r) {  //将当前节点和对应区间作为参数传入, 节省空间
  if (l == r) {  //边界
    x->Val = a[l];
    return;
  }
  unsigned int m((l + r) >> 1);
  Bld(x->L = ++Cntn, l, m);  //递归左右子树
  Bld(x->R = ++Cntn, m + 1, r);
  return;
}
```

### 修改

参数增加了一个节点的指针, 为上一个版本的同位节点. 由于需要继承其子树, 所以同步遍历当前版本和上一版本.

```cpp
void Chg(Node *x, Node *y /*上一个版本的同位节点*/, unsigned int l,
         const unsigned int &r) {
  if (l == r) {  //边界
    x->Val = D;
    return;
  }
  unsigned int m = (l + r) >> 1;
  if (C <= m) {                          //左边
    x->R = y->R;                         //继承右儿子
    Chg(x->L = ++Cntn, y->L, l, m);      //递归左儿子
  } else {                               //右边
    x->L = y->L;                         //继承左儿子
    Chg(x->R = ++Cntn, y->R, m + 1, r);  //递归右儿子
  }
  return;
}
```

### 查询

和普通线段树无异.

```cpp
void Qry(Node *x, unsigned int l, const unsigned int &r) {
  if (l == r) {  //边界
    Lst = x->Val;
    return;
  }
  unsigned int m = (l + r) >> 1;
  if (C <= m) {           //左边
    Qry(x->L, l, m);      //递归左儿子
  } else {                //右边
    Qry(x->R, m + 1, r);  //递归右儿子
  }
  return;
}
```

### `main()`

头文件, 快读 `RD()` 等略.

```cpp
int main() {
  n = RD();
  m = RD();
  for (register int i(1); i <= n; ++i) {
    a[i] = RD();
  }
  Bld(N, 1, n);  //建树
  Vrsn[0] = N;   //原始版本
  for (register int i(1); i <= m; ++i) {
    A = RD();
    B = RD();
    C = RD();
    if (B == 1) {  //修改
      D = RD();
      Vrsn[i] = ++Cntn;  //新建一个版本
      Chg(Vrsn[i], Vrsn[A], 1, n);
    } else {
      Vrsn[i] = Vrsn[A];  //无需修改, 当前版本即所查询的版本
      Qry(Vrsn[i], 1, n);
      printf("%d\n", Lst);  //查询结果已经记录在Lst中
    }
  }
  return 0;
}
```
