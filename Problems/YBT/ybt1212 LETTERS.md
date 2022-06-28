# ybt1212 LETTERS

## 【题目描述】

给出一个roe×col的大写字母矩阵，一开始的位置为左上角，你可以向上下左右四个方向移动，并且不能移向曾经经过的字母。问最多可以经过几个字母。

## 【输入】

第一行，输入字母矩阵行数R和列数S，1≤R,S≤20。

接着输出R行S列字母矩阵。

## 【输出】

最多能走过的不同字母的个数。

## 【输入样例】

```
3 6
HFDFFB
AJHGDH
DGAGEH
```
## 【输出样例】

```
6
```

## 【题解】

从0,0开始搜索，维护一个数组lt,存储当前路径中出现的字母。

之前出现的字母如果遍历到，就返回。

记录这个点出发到四个方向所能经过的最大字母的最大值，加上1（它本身的字母）返回给上级，这样就能找出最大值。

### 注意：

这道题求的是DFS数里，最大的根叶路径长度而不是整个DFS序中出现的所有字母。（血的教训）

```c++
#include<iostream>
#include<cstring>
using namespace std;
int xr[4] = { 0,1,0,-1 };
int yr[4] = { -1,0,1,0 };//操作记录
int T, n, m, ans = 0, a[100][100];
char ch;
bool lt[30];
int dfs(int x, int y) {//深搜
	//cout << x << " " << y << "	";
	if ((x < 0) || (y < 0)) {
		return 0;
	}
	if ((x >= n) || (y >= m)) {
		return 0;
	}
	if (lt[a[x][y]]) {
		return 0;
	}
	int t=0;
	lt[a[x][y]] = 1;
	for (int i = 0; i < 4; i++) {
		ans = dfs(x + xr[i], y + yr[i]);
		if (t < ans) {
			t = ans;
		}
	}
	lt[a[x][y]] = 0;
	return t+1;
}
int main() {
	cin >> n >> m;//输入矩阵大小
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			cin >> ch;
			a[i][j] = ch - 'A';
		}
	}
	ans = dfs(0, 0);//从0,0的位置开始搜
	cout << ans << endl;
	return 0;
}
```

