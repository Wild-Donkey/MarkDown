# GCD=XOR问题 ( 阉割版 )

## 问题

给定一个n, 问求出(a,b)无序数对, 使a^b=gcd(a, b)

## 题解

### 数学证明

设a>=b, a^b=c

因为^的规则是, 只有两个数的同一位有一个0和一个1时, 结果才为1, 否则都是0.

这样对于a, b, c的每一位的真假, 只可能出现两种情况: 0,0,0和0,1,1. 而这两种情况都是对于a, b, c知二推一.

所以,若 a^b=c, 则 a^c=b, b^c=a.

当a-b的时候, 分类讨论每一位:

某位上, 0-0=0, 这时c的这一位也是0

1-1=0, 这时c的这一位是0

1-0=1,c的这一位是1

0-1=-1,借位,这时c的这一位是1.

所以, 前三种情况结果都是a^b=a-b

只有最后一种情况a^b>a-b.

所以a^b>=a-b.

而且, 又因为c=gcd(a, b)<=a-b (显而易见, 否则a/c, b/c就有可能是分数)

题目规定的c=gcd(a, b)=a^b

c=a-b=a^b就是它的必要条件

### 设计算法

接下来, 只要保证a-b>c就可以求出所有结果了.

因为a不能等于b, 因为这时gcd(a, b)=a=b, a-b=0

所以a至少比b大c.

又因为b至少是c的一倍

所以a必须是两倍起跳.

又因为a<=n, a>=b+c>=2c.

所以c必须小于等于n/2.

因为a xor b=c, a xor c=b, b xor c=a, 知一推二

a-b=c, a-c=b, 知一推一

所以只要a^c=a-c

就满足a^b=a-b

这样就保证了在这个范围内的a, c, 只要满足a^c=a-c, 答案就成立.

```c++
#include<iostream>
#include<cstdio>
using namespace std;
long long N, Ans = 0;
int main()
{
	cin >> N;//设b<a
	for (register int i = 1; i <= N >> 1; i++) {//这个地方枚举的是gcd, 因为gcd一定小于b, 并且gcd=a^b=a-b, 所以gcd一定小于a/2(也就是N/2), 这样gcd就一定小于b了
		for (register int j = i << 1; j <= N; j += i) {//根据gcd枚举a, 因为是倍数关系, 所以增量为gcd, 而且a>b且b最小就是gcd的一倍, 所以a是两倍起跳
			if ((i ^ j) == j - i) {//符合必要条件
				Ans++;
			}
		}
	}
	cout << Ans << endl;//其实只有一个数字不用printf.
	return 0;
}
```

