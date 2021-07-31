#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <iostream>
#include <map>
#include <queue>
#include <vector>
#define Wild_Donkey 0
using namespace std;
inline unsigned RD() {
  unsigned intmp = 0;
  char rdch(getchar());
  while (rdch < '0' || rdch > '9') {
    rdch = getchar();
  }
  while (rdch >= '0' && rdch <= '9') {
    intmp = intmp * 10 + rdch - '0';
    rdch = getchar();
  }
  return intmp;
}
unsigned a[10005], n, m, Cnt(0), Tmp(0), Mx;
bool flg(0);
char inch, List[155][75];
struct Node {
  Node *Son[2], *Fa;
  char Tag;
  unsigned Value, Sum;
} N[100005], *Stack[100005];
inline void Update(Node *x) {
  x->Sum = x->Value;
  if (x->Son[0]) {
    x->Sum ^= x->Son[0]->Sum;
  }
  if (x->Son[1]) {
    x->Sum ^= x->Son[1]->Sum;
  }
  return;
}
inline void Push_Down(Node *x) {  // Push_Down the spliting tag
  if (x->Tag) {
    register Node *TmpSon(x->Son[0]);
    x->Tag = 0, x->Son[0] = x->Son[1], x->Son[1] = TmpSon;
    if (x->Son[0]) {
      x->Son[0]->Tag ^= 1;
    }
    if (x->Son[1]) {
      x->Son[1]->Tag ^= 1;
    }
  }
}
inline void Rotate(Node *x) {
  register Node *Father(x->Fa);
  x->Fa = Father->Fa;  // x link to grandfather
  if (Father->Fa) {
    if (Father->Fa->Son[0] == Father) {
      Father->Fa->Son[0] = x;  // grandfather link to x
    }
    if (Father->Fa->Son[1] == Father) {
      Father->Fa->Son[1] = x;  // grandfather link to x
    }
  }
  x->Sum = 0, Father->Fa = x;
  if (Father->Son[0] == x) {
    Father->Son[0] = x->Son[1];
    if (Father->Son[0]) {
      Father->Son[0]->Fa = Father;
    }
    x->Son[1] = Father;
    if (x->Son[0]) {
      x->Sum = x->Son[0]->Sum;
    }
  } else {
    Father->Son[1] = x->Son[0];
    if (Father->Son[1]) {
      Father->Son[1]->Fa = Father;
    }
    x->Son[0] = Father;
    if (x->Son[1]) {
      x->Sum = x->Son[1]->Sum;
    }
  }
  Update(Father);
  x->Sum ^= x->Value ^ Father->Sum;
  return;
}
void Splay(Node *x) {
  register unsigned Head(0);
  while (x->Fa) {  // 父亲没到头
    if (x->Fa->Son[0] == x ||
        x->Fa->Son[1] ==
            x) {  // x is the preferred-edge linked son (实边连接的儿子)
      Stack[++Head] = x;
      x = x->Fa;
      continue;
    }
    break;
  }
  Push_Down(x);
  if (Head) {
    for (register unsigned i(Head); i > 0;
         --i) {  // Must be sure there's no tags alone Root-x, and delete
                 // Root->Fa for a while
      Push_Down(Stack[i]);
    }
    x = Stack[1];
    while (x->Fa) {  // 父亲没到头
      if (x->Fa->Son[0] == x ||
          x->Fa->Son[1] ==
              x) {  // x is the preferred-edge linked son (实边连接的儿子)
        if (x->Fa->Fa) {
          if (x->Fa->Fa->Son[0] == x->Fa ||
              x->Fa->Fa->Son[1] == x->Fa) {  // Father
            Rotate((x->Fa->Son[0] == x) ^ (x->Fa->Fa->Son[0] == x->Fa) ? x
                                                                       : x->Fa);
          }  // End
        }
        Rotate(x);  //最后一次旋转
      } else {
        break;
      }
    }
  }
  return;
}
void Access(Node *x) {  // Let x be the bottom of the chain where the root at
  Splay(x), x->Son[1] = NULL, Update(x);  // Delete x's right son
  Node *Father(x->Fa);
  while (Father) {
    Splay(Father), Father->Son[1] = x;      // Change the right son
    x = Father, Father = x->Fa, Update(x);  // Go up
  }
  return;
}
Node *Find_Root(Node *x) {  // Find the root
  Access(x), Splay(x), Push_Down(x);
  while (x->Son[0]) {
    x = x->Son[0], Push_Down(x);
  }
  Splay(x);
  return x;
}
int main() {
  //   freopen("P3690_1.in", "r", stdin);
  //   freopen("my.out", "w", stdout);
  n = RD();
  m = RD();
  for (register unsigned i(1); i <= n; ++i) {
    N[i].Value = RD();
  }
  register unsigned A, B, C;
  for (register unsigned i(1); i <= m; ++i) {
    A = RD();
    B = RD();
    C = RD();
    switch (A) {
      case 0: {                                      // Query
        Access(N + B), Splay(N + B), N[B].Tag ^= 1;  // x 为根
        Access(N + C);  // y 和 x 为同一实链两端
        Splay(N + C);   // y 为所在实链的 Splay 的根
        printf("%u\n", N[C].Sum);
        break;
      }
      case 1: {  // Link
        Access(N + B), Splay(N + B),
            N[B].Tag ^= 1;  // x 为根, 也是所在 Splay 的根
        if (Find_Root(N + C) !=
            N + B) {  // x, y 不连通, x 在 Fink_Root 时已经是它所在 Splay
                      // 的根了, 也是它原树根所在实链顶, 左子树为空
          N[B].Fa = N + C;  // 父指针
        }
        break;
      }
      case 2: {  // Cut
        Access(N + B), Splay(N + B),
            N[B].Tag ^= 1;                // x 为根, 也是所在 Splay 的根
        if (Find_Root(N + C) == N + B) {  // x, y 连通
          if (N[C].Fa == N + B &&
              !(N[C].Son[0])) {  // x 是 y 在 Splay 上的父亲, y 无左子树,
                                 // 所以有直连边
            N[C].Fa = N[B].Son[1] = NULL;  // 断边
            Update(N + B);  // 更新 x (y 的子树不变, 无需更新)
          }
          //   if(N[B].Fa == N + C && !(N[B].Son[1])) {
          //     N[B].Fa = N[C].Son[0] = NULL;         // 断边
          //     Update(N + C);                        // 更新 x (y 的子树不变,
          //     无需更新)
          //   }
        }
        break;
      }
      case 3: {          // Change
        Splay(N + B);    // 转到根上
        N[B].Value = C;  // 改权值
        break;
      }
    }
  }
  return Wild_Donkey;
}
/*
avsklhdvhsalhdasvjkhvszkxjdkshfkdkdshfkhsdfskdjfh







*/