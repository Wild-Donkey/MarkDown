# 反汇编拆弹

## 学赛博手艺 玩电子puzzle

### 主体 cpp 代码

```cpp
/***************************************************************************
 * Dr. Evil's Insidious Bomb, Version 1.1
 * Copyright 2011, Dr. Evil Incorporated. All rights reserved.
 *
 * LICENSE:
 *
 * Dr. Evil Incorporated (the PERPETRATOR) hereby grants you (the
 * VICTIM) explicit permission to use this bomb (the BOMB).  This is a
 * time limited license, which expires on the death of the VICTIM.
 * The PERPETRATOR takes no responsibility for damage, frustration,
 * insanity, bug-eyes, carpal-tunnel syndrome, loss of sleep, or other
 * harm to the VICTIM.  Unless the PERPETRATOR wants to take credit,
 * that is.  The VICTIM may not distribute this bomb source code to
 * any enemies of the PERPETRATOR.  No VICTIM may debug,
 * reverse-engineer, run "strings" on, decompile, decrypt, or use any
 * other technique to gain knowledge of and defuse the BOMB.  BOMB
 * proof clothing may not be worn when handling this program.  The
 * PERPETRATOR will not apologize for the PERPETRATOR's poor sense of
 * humor.  This license is null and void where the BOMB is prohibited
 * by law.
 ***************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include "support.h"
#include "phases.h"

 /*
  * Note to self: Remember to erase this file so my victims will have no
  * idea what is going on, and so they will all blow up in a
  * spectaculary fiendish explosion. -- Dr. Evil
  */

FILE* infile;

int main(int argc, char* argv[])
{
  char* input;

  /* Note to self: remember to port this bomb to Windows and put a
   * fantastic GUI on it. */

   /* When run with no arguments, the bomb reads its input lines
    * from standard input. */
  if (argc == 1) {
    infile = stdin;
  }

  /* When run with one argument <file>, the bomb reads from <file>
   * until EOF, and then switches to standard input. Thus, as you
   * defuse each phase, you can add its defusing string to <file> and
   * avoid having to retype it. */
  else if (argc == 2) {
    if (!(infile = fopen(argv[1], "r"))) {
      printf("%s: Error: Couldn't open %s\n", argv[0], argv[1]);
      exit(8);
    }
  }

  /* You can't call the bomb with more than 1 command line argument. */
  else {
    printf("Usage: %s [<input_file>]\n", argv[0]);
    exit(8);
  }

  /* Do all sorts of secret stuff that makes the bomb harder to defuse. */
  initialize_bomb();

  printf("Welcome to my fiendish little bomb. You have 6 phases with\n");
  printf("which to blow yourself up. Have a nice day!\n");

  /* Hmm...  Six phases must be more secure than one phase! */
  input = read_line();             /* Get input                   */
  phase_1(input);                  /* Run the phase               */
  phase_defused();                 /* Drat!  They figured it out!
            * Let me know how they did it. */
  printf("Phase 1 defused. How about the next one?\n");

  /* The second phase is harder.  No one will ever figure out
   * how to defuse this... */
  input = read_line();
  phase_2(input);
  phase_defused();
  printf("That's number 2.  Keep going!\n");

  /* I guess this is too easy so far.  Some more complex code will
   * confuse people. */
  input = read_line();
  phase_3(input);
  phase_defused();
  printf("Halfway there!\n");

  /* Oh yeah?  Well, how good is your math?  Try on this saucy problem! */
  input = read_line();
  phase_4(input);
  phase_defused();
  printf("So you got that one.  Try this one.\n");

  /* Round and 'round in memory we go, where we stop, the bomb blows! */
  input = read_line();
  phase_5(input);
  phase_defused();
  printf("Good work!  On to the next...\n");

  /* This phase will never be used, since no one will get past the
   * earlier ones.  But just in case, make this one extra hard. */
  input = read_line();
  phase_6(input);
  phase_defused();

  /* Wow, they got it!  But isn't something... missing?  Perhaps
   * something they overlooked?  Mua ha ha ha ha! */

  return 0;
}
```

### `<string_length>`

字符串头指针存在栈顶下方 `4` 字节的位置, 也就是调用 `<string_length>` 之前的栈顶元素, 字符串长度通过 `%eax` 返回.

```nasm
0x00001b03 <+0>:     mov    0x4(%esp),%edx
0x00001b07 <+4>:     cmpb   $0x0,(%edx)
0x00001b0a <+7>:     je     0x1b1b <string_length+24>
0x00001b0c <+9>:     mov    $0x0,%eax
```

`<string_length+4>` 中, 判断了 `%edx` 指向的内存地址中的值是否为 `0`, `b` 表示判断是否为 `0` 的数据大小是一个字节. 如果为 `0`, 则标志寄存器的 `ZF` 位被赋为 `1`, 否则赋为 `0`. 随后的 `je` 语句就会在 `ZF` 为 `1` 时将程序跳转到 `<string_length+24>`, 否则不跳.

```nasm
0x00001b11 <+14>:    add    $0x1,%eax
0x00001b14 <+17>:    cmpb   $0x0,(%edx,%eax,1)
0x00001b18 <+21>:    jne    0x1b11 <string_length+14>
0x00001b1a <+23>:    ret
```

从 `<string_length+14>` 到 `<string_length+21>` 是一个循环. 表示判断内存中 `%edx + %eax` 地址的值是否为 `0`. `jne` 和 `je` 的区别是跳转的条件不同, 这里的 `jne` 语句是指 `ZF` 位为 `0` 时跳转到 `<string_length+14>`. 循环在做的事情是从传入 `%edx` 的地址开始, 每次判断一个位置是否为 `0`, 如果没有遇到 `0` 就继续探查, 将已经判断过的位置数量存入 `%eax`, 当遇到 `0` 就返回, 这时 `%eax` 内的值就是字符串长度.

```nasm
0x00001b1b <+24>:    mov    $0x0,%eax
0x00001b20 <+29>:    ret
```

这一段只能由 `<string_length+7>` 跳转而来, 表示字符串的首位就是 `0`, 即长度为 `0`, 将这个长度存入 `%eax` 后返回.

---

### `<strings_not_equal>`

判断两个字符串是否相等, 相等会赋 `%eax` 为 `0`, 否则为 `1`. 判断的两个字符串头指针需在调用前存入栈顶和栈顶下方一个元素.

```nasm
0x00001b21 <+0>:     push   %edi
0x00001b22 <+1>:     push   %esi
0x00001b23 <+2>:     push   %ebx
0x00001b24 <+3>:     mov    0x10(%esp),%ebx
0x00001b28 <+7>:     mov    0x14(%esp),%esi
```

从调用 `<strings_not_equal>` 开始, 栈顶一共移动了 `0x10` 个字节, 所以 `%ebx` 会被赋值为调用 `<strings_not_equal>` 前的栈顶, 而 `%esi` 会被赋值为这个栈顶下方一个元素的值. 这时开始, `%ebx`, `%esi` 分别存储两个字符串的头指针.

```nasm
0x00001b2c <+11>:    push   %ebx
0x00001b2d <+12>:    call   0x1b03 <string_length>
0x00001b32 <+17>:    mov    %eax,%edi
0x00001b34 <+19>:    mov    %esi,(%esp)
0x00001b37 <+22>:    call   0x1b03 <string_length>
0x00001b3c <+27>:    add    $0x4,%esp
0x00001b3f <+30>:    mov    %eax,%edx
```

`<strings_not_equal+12>` 求出以 `%ebx` 内的地址为头指针的字符串的长度, 存入 `%edi`.
`<strings_not_equal+22>` 求出以 `%esi` 内的地址为头指针的字符串的长度, 存入 `%edx`.

```nasm
0x00001b41 <+32>:    mov    $0x1,%eax
0x00001b46 <+37>:    cmp    %edx,%edi
0x00001b48 <+39>:    jne    0x1b75 <strings_not_equal+84>
```

如果两个字符串的长度不相等, 则将 `%eax` 赋 `1`, 退出函数. (`return 1`)

```nasm
0x00001b4a <+41>:    movzbl (%ebx),%eax
0x00001b4d <+44>:    test   %al,%al
0x00001b4f <+46>:    je     0x1b69 <strings_not_equal+72>
```

`movzbl` 中 `z` 表示 Zero, 表示源长度不足时, 高位用 `0` 填充. `b` 表示源大小为字节, `l` 表示目标大小为长字. 之后判断 `%eax` 的低 `8` 位是否为 `0`, 如果是, 那么跳转到 `<strings_not_equal+72>`. 也就是将 `%eax` 赋 `0`, 退出函数. (`return 0`)

```nasm
0x00001b51 <+48>:    cmp    %al,(%esi)
0x00001b53 <+50>:    jne    0x1b70 <strings_not_equal+79>
0x00001b55 <+52>:    add    $0x1,%ebx
0x00001b58 <+55>:    add    $0x1,%esi
0x00001b5b <+58>:    movzbl (%ebx),%eax
0x00001b5e <+61>:    test   %al,%al
0x00001b60 <+63>:    jne    0x1b51 <strings_not_equal+48>
```

这一段是一块循环, 循环体可以理解为:

`if(*a != *b) return 1;`, `++a, ++b;`, `if(!(*a)) break;`.

逐字节判断两字符串是否相等.

```nasm
0x00001b62 <+65>:    mov    $0x0,%eax
0x00001b67 <+70>:    jmp    0x1b75 <strings_not_equal+84>
0x00001b69 <+72>:    mov    $0x0,%eax
0x00001b6e <+77>:    jmp    0x1b75 <strings_not_equal+84>
0x00001b70 <+79>:    mov    $0x1,%eax
0x00001b75 <+84>:    pop    %ebx
0x00001b76 <+85>:    pop    %esi
0x00001b77 <+86>:    pop    %edi
0x00001b78 <+87>:    ret
```

这一段从 `<strings_not_equal+65>` 或 `<strings_not_equal+72>` 开始执行都表示 `return 0;`, 从 `<strings_not_equal+79>` 开始执行表示 `return 1;`.

---

### `<phase_1>`

通过设置断点 `break 74` 在进入 `<phase_1>` 前暂停执行. 发现调用 `<phase_1>` 之前, 将栈顶元素赋值为 `%eax`, 然后查看当前 `%eax` 的值, 为 `0x5655b3a0`. 这便是我们输入的字符串的头指针.

```nasm
0x000014cd <+0>:     push   %ebx
0x000014ce <+1>:     sub    $0x10,%esp
```

前两条指令先入栈, 然后通过对 `%esp` 的减少, 实现了类似入栈 `0x10` 个字节的效果. 我们猜测这是在函数内定义了一些局部变量.

```nasm
0x000014d1 <+4>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x000014d6 <+9>:     add    $0x4a8e,%ebx
0x000014dc <+15>:    lea    -0x2e20(%ebx),%eax
```

`<phase_1+4>` 中调用函数 `<__x86.get_pc_thunk.bx>` 将 `PC` 的值存入 `%ebx`. 这时 `%ebx` 会存储当前指令下一条指令的地址, 假设是 `0x000014d6`.

后面两句是将 `%ebx` 的值加上 `0x4a8e`, 然后减去 `0x2e20`, 将结果 `0x3144` 存入 `%eax` 中. 值得一提的是 lea 虽然用 `%ebx` 寻址, 但是不会访问这个地址的内存.

```nasm
0x000014e2 <+21>:    push   %eax
0x000014e3 <+22>:    push   0x1c(%esp)
```

对于 `<phase_1+22>`, 会先对 `0x1c(%esp)` 进行寻址, 然后执行 `push`, 所以这里寻址时的 `%esp` 还是本条 `push` 前的 `%esp`.

- `(%esp)` 存储的是 `<phase_1+21>` 压入的值.
- 从 `0x04(%esp)` 开始的 `0x10` 位, 是被 `<phase_1+1>` 跳过的位.
- `0x14(%esp)` 存储 `<phase_1+0>` 被压入的值. 
- `0x18(%esp)` 存储调用 `<phase_1>` 之前的 `PC`. 

所以 `<phase_1+22>` 压入的值是调用 `<phase_1>` 前的栈顶元素.

```nasm
0x000014e7 <+26>:    call   0x1b21 <strings_not_equal>
0x000014ec <+31>:    add    $0x10,%esp
0x000014ef <+34>:    test   %eax,%eax
0x000014f1 <+36>:    jne    0x14f8 <phase_1+43>
```

这里判断 `<phase_1+21>` 和 `<phase_1+22>` 中压入的头指针对应的两个字符串是否相等. 也就是以 `0x3144` 为头指针的字符串. 和外层函数传入了头指针的字符串, 即输入的字符串.

如果不相等, 则跳转到 `<phase_1+43>`, 即引爆炸弹.

`<phase_1+31>` 将 `%esp` 的值改为了执行 `<phase_1+1>` 之前, 栈顶上方 `8` 字节的地址.

在 `<strings_not_equal>` 中查看从栈中拉出来的 `%ebx`, `%esi` 的值 `0x5655b3a0`, `0x56558144`, 发现前者恰好是前面解析出的, 输入的字符串的头指针, 后者则是答案串所在的位置. 发现传入的地址和我们之前计算出的 `0x3144` 不同, 反汇编时显示的地址是以程序开头为基址的相对地址, 而运行时程序被加载在内存中, 所以地址也是在内存中的地址, 因此这里就以运行时的地址为准.

直接找到 `0x56558144` 处的内存, 其内容为:

```
(gdb) x /40xb 0x56558144
0x56558144:     0x54    0x68    0x65    0x20    0x66    0x75    0x74    0x75
0x5655814c:     0x72    0x65    0x20    0x77    0x69    0x6c    0x6c    0x20
0x56558154:     0x62    0x65    0x20    0x62    0x65    0x74    0x74    0x65
0x5655815c:     0x72    0x20    0x74    0x6f    0x6d    0x6f    0x72    0x72
0x56558164:     0x6f    0x77    0x2e    0x00    0x57    0x6f    0x77    0x21
```

发现有效字符串为 `36` 字节, 翻译成 ASCII 码为: `The future will be better tomorrow.`. 这便是阶段一的答案.

```nasm
0x000014f3 <+38>:    add    $0x8,%esp
0x000014f6 <+41>:    pop    %ebx
0x000014f7 <+42>:    ret
```

这里相当于 `return;`. 通过对 `%esp` 直接修改, 使得栈顶重新指向 `<phase_1+0>` 压入的元素. 之后弹栈返回, 将栈顶恢复到调用 `<phase_1>` 前的位置.

```nasm
0x000014f8 <+43>:    call   0x1c39 <explode_bomb>
0x000014fd <+48>:    jmp    0x14f3 <phase_1+38>
```

引爆后返回.

---

### `<read_six_numbers>`

```nasm
0x00001c6e <+0>:     push   %ebx
0x00001c6f <+1>:     sub    $0x8,%esp
0x00001c72 <+4>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x00001c77 <+9>:     add    $0x42ed,%ebx
0x00001c7d <+15>:    mov    0x14(%esp),%eax
0x00001c81 <+19>:    lea    0x14(%eax),%edx
0x00001c84 <+22>:    push   %edx
0x00001c85 <+23>:    lea    0x10(%eax),%edx
0x00001c88 <+26>:    push   %edx
0x00001c89 <+27>:    lea    0xc(%eax),%edx
0x00001c8c <+30>:    push   %edx
0x00001c8d <+31>:    lea    0x8(%eax),%edx
0x00001c90 <+34>:    push   %edx
0x00001c91 <+35>:    lea    0x4(%eax),%edx
0x00001c94 <+38>:    push   %edx
0x00001c95 <+39>:    push   %eax
```

从调用函数前栈顶下方一个长字位置存储的地址开始, 将连续的六个长字地址从下到上压入栈中. 我们可以认为这是给后面的 `scanf` 传参, 即读取的元素存入的地址.

```nasm
0x00001c96 <+40>:    lea    -0x2c91(%ebx),%eax
0x00001c9c <+46>:    push   %eax
0x00001c9d <+47>:    push   0x2c(%esp)
0x00001ca1 <+51>:    call   0x1140 <__isoc99_sscanf@plt>
0x00001ca6 <+56>:    add    $0x20,%esp
0x00001ca9 <+59>:    cmp    $0x5,%eax
0x00001cac <+62>:    jle    0x1cb3 <read_six_numbers+69>
```

`<read_six_numbers+56>` 一个加法, 将栈顶位置还原成 `<read_six_numbers+0>` 入栈后的状态.

`<read_six_numbers+51>` 调用了 `scanf`, 读入数字的数量存入 `%eax`, 所以在 `<read_six_numbers+59>`, 判断读入数字数量, 如果小于等于 `5`, 就引爆炸弹.

```nasm
0x00001cae <+64>:    add    $0x8,%esp
0x00001cb1 <+67>:    pop    %ebx
0x00001cb2 <+68>:    ret
0x00001cb3 <+69>:    call   0x1c39 <explode_bomb>
```

---

### `<phase_2>`

到这里, 汇编的语法已经多次应用了, 会减少对语义的记录, 而是关注功能.

```nasm
0x000014ff <+0>:     push   %edi
0x00001500 <+1>:     push   %esi
0x00001501 <+2>:     push   %ebx
0x00001502 <+3>:     sub    $0x28,%esp
0x00001505 <+6>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x0000150a <+11>:    add    $0x4a5a,%ebx
0x00001510 <+17>:    mov    %gs:0x14,%eax
0x00001516 <+23>:    mov    %eax,0x24(%esp)
0x0000151a <+27>:    xor    %eax,%eax
0x0000151c <+29>:    lea    0xc(%esp),%eax
```

前面仍然是进入函数的一些开空间存变量的操作, `0x00001510 <+17>` 的 `%gs:0x14` 表示调用 `%gs` 段的相对地址为 `0x14` 的长字存入 `%eax`.

`0x00001505 <+6>` 到 `0x0000151c <+29>` 的伪代码: `%ebx = PC + 0x4a5a`, `%eax = *(%gs + 0x14)`, `*(%esp + 0x24) = %eax`, `%eax = %esp + 0xc`.

```nasm
0x00001520 <+33>:    push   %eax
0x00001521 <+34>:    push   0x3c(%esp)
0x00001525 <+38>:    call   0x1c6e <read_six_numbers>
0x0000152a <+43>:    add    $0x10,%esp
```

前面对 `<read_six_numbers>` 解析之后, 发现读入的数字会存储在 `%eax` 存储的地址开始, 向后共六个长字中. 而调用 `<read_six_numbers>` 前, `%eax` 存储的地址是 `0xc(%esp)`, 也就是执行 `<phase_2+43>` 之后的 `0x4(%esp)`. 所以六个数字的地址就是 `0x4(%esp)`, `0x8(%esp)`, ..., `0x18(%esp)`.

```nasm
0x0000152d <+46>:    cmpl   $0x1,0x4(%esp)
0x00001532 <+51>:    jne    0x153e <phase_2+63>
```

由此可知密码的第一位是 `1`.

```nasm
0x00001534 <+53>:    lea    0x4(%esp),%esi
0x00001538 <+57>:    lea    0x18(%esp),%edi
0x0000153c <+61>:    jmp    0x154c <phase_2+77>
0x0000153e <+63>:    call   0x1c39 <explode_bomb>
0x00001543 <+68>:    jmp    0x1534 <phase_2+53>
```

初始化一个循环 `%esi` 是初地址, `%edi` 是末地址.

```nasm
0x00001545 <+70>:    add    $0x4,%esi
0x00001548 <+73>:    cmp    %edi,%esi
0x0000154a <+75>:    je     0x155c <phase_2+93>
0x0000154c <+77>:    mov    (%esi),%eax
0x0000154e <+79>:    add    %eax,%eax
0x00001550 <+81>:    cmp    %eax,0x4(%esi)
0x00001553 <+84>:    je     0x1545 <phase_2+70>
0x00001555 <+86>:    call   0x1c39 <explode_bomb>
0x0000155a <+91>:    jmp    0x1545 <phase_2+70>
```

循环体可以理解为这样.

```cpp
while(1) {
  if(%edi == (%esi += 4)) break;
  if(*(%esi + 4) != (%eax = (*%esi << 1))) explode_bomb;
}
```

每次判断一个新的数, 是否等于上一个数的两倍, 如果不是就引爆炸弹. 由此可以知道, 密码是一个公比为 `2`, 首项为 `1` 的等比数列. `1 2 4 8 16 32`.

```nasm
0x0000155c <+93>:    mov    0x1c(%esp),%eax
0x00001560 <+97>:    sub    %gs:0x14,%eax
0x00001567 <+104>:   jne    0x1570 <phase_2+113>
0x00001569 <+106>:   add    $0x20,%esp
0x0000156c <+109>:   pop    %ebx
0x0000156d <+110>:   pop    %esi
0x0000156e <+111>:   pop    %edi
0x0000156f <+112>:   ret
0x00001570 <+113>:   call   0x2a40 <__stack_chk_fail_local>
```

后面就是一些返回前的后处理.

### `<phase_3>`

```nasm
0x00001575 <+0>:     push   %ebx
0x00001576 <+1>:     sub    $0x24,%esp
0x00001579 <+4>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x0000157e <+9>:     add    $0x49e6,%ebx
0x00001584 <+15>:    mov    %gs:0x14,%eax
0x0000158a <+21>:    mov    %eax,0x18(%esp)
0x0000158e <+25>:    xor    %eax,%eax
0x00001590 <+27>:    lea    0x14(%esp),%eax
0x00001594 <+31>:    push   %eax
0x00001595 <+32>:    lea    0x13(%esp),%eax
0x00001599 <+36>:    push   %eax
0x0000159a <+37>:    lea    0x18(%esp),%eax
0x0000159e <+41>:    push   %eax
0x0000159f <+42>:    lea    -0x2dd6(%ebx),%eax
0x000015a5 <+48>:    push   %eax
0x000015a6 <+49>:    push   0x3c(%esp)
0x000015aa <+53>:    call   0x1140 <__isoc99_sscanf@plt>
0x000015af <+58>:    add    $0x20,%esp
0x000015b2 <+61>:    cmp    $0x2,%eax
0x000015b5 <+64>:    jle    0x15d1 <phase_3+92>
```

根据 `<read_six_numbers>` 的解析, 从 `scanf` 的第三个参数 (倒数第三个被压入栈中的元素) 开始, 就是读入的内容存储的位置. 根据 `<phase_3+61>`, 这里读入了三个元素, 存入了 `0x18(%esp)`, `0x13(%esp)`, `0x14(%esp)`. 不过那是压入栈中的时候的 `%esp`, 如果改写为 `<phase_3+58>` 执行后的 `%esp` 相对位置, 即为 `0x4(%esp)`, `0x3(%esp)`, `0x8(%esp)`.

```nasm
0x000015b7 <+66>:    cmpl   $0x7,0x4(%esp)
0x000015bc <+71>:    ja     0x16bf <phase_3+330>
```

如果记第一个输入的是整数 `A`, 第二个输入的是字符 `B`, 第三个输入的是整数 `C`, 那么这里当 `7 < A`, 就引爆炸弹.

```nasm
0x000015c2 <+77>:    mov    0x4(%esp),%eax
0x000015c6 <+81>:    mov    %ebx,%edx
0x000015c8 <+83>:    add    -0x2dc4(%ebx,%eax,4),%edx
0x000015cf <+90>:    jmp    *%edx
```

这个地方 `%ebx` 存储的值非常重要, 直接决定了接下来执行的语句, 综合前面的指令, `%ebx` 的值是 `<phase_3+9> + 0x49e6`, 跳转到的语句地址即为: `(<phase_3+9> + 0x49e6) + *((<phase_3+9> + 0x49e6) + 4A - 0x2dc4)`. 也就是说 `A` 每增加 `1`, 跳转到的地址便增加 `4`. 所以决定先将 `A` 设为 `7`, 然后建立起跳转到的位置和 `A` 之间的关系映射.

当 `A` 为 `7` 时, 跳转到的地址为 `<phase_3+303>`, 因此, 跳转的地址即为 `<phase_3+(275+4A)>`.

```nasm
0x000015d1 <+92>:    call   0x1c39 <explode_bomb>
0x000015d6 <+97>:    jmp    0x15b7 <phase_3+66>
0x000015d8 <+99>:    mov    $0x75,%eax
0x000015dd <+104>:   cmpl   $0x263,0x8(%esp)
0x000015e5 <+112>:   je     0x16c9 <phase_3+340>
0x000015eb <+118>:   call   0x1c39 <explode_bomb>
0x000015f0 <+123>:   mov    $0x75,%eax
0x000015f5 <+128>:   jmp    0x16c9 <phase_3+340>
0x000015fa <+133>:   mov    $0x76,%eax
0x000015ff <+138>:   cmpl   $0x5a,0x8(%esp)
0x00001604 <+143>:   je     0x16c9 <phase_3+340>
0x0000160a <+149>:   call   0x1c39 <explode_bomb>
0x0000160f <+154>:   mov    $0x76,%eax
0x00001614 <+159>:   jmp    0x16c9 <phase_3+340>
0x00001619 <+164>:   mov    $0x66,%eax
0x0000161e <+169>:   cmpl   $0x24c,0x8(%esp)
0x00001626 <+177>:   je     0x16c9 <phase_3+340>
0x0000162c <+183>:   call   0x1c39 <explode_bomb>
0x00001631 <+188>:   mov    $0x66,%eax
0x00001636 <+193>:   jmp    0x16c9 <phase_3+340>
0x0000163b <+198>:   mov    $0x66,%eax
0x00001640 <+203>:   cmpl   $0xbd,0x8(%esp)
0x00001648 <+211>:   je     0x16c9 <phase_3+340>
0x0000164a <+213>:   call   0x1c39 <explode_bomb>
0x0000164f <+218>:   mov    $0x66,%eax
0x00001654 <+223>:   jmp    0x16c9 <phase_3+340>
0x00001656 <+225>:   mov    $0x71,%eax
0x0000165b <+230>:   cmpl   $0x203,0x8(%esp)
0x00001663 <+238>:   je     0x16c9 <phase_3+340>
0x00001665 <+240>:   call   0x1c39 <explode_bomb>
0x0000166a <+245>:   mov    $0x71,%eax
0x0000166f <+250>:   jmp    0x16c9 <phase_3+340>
0x00001671 <+252>:   mov    $0x64,%eax
0x00001676 <+257>:   cmpl   $0x6b,0x8(%esp)
0x0000167b <+262>:   je     0x16c9 <phase_3+340>
0x0000167d <+264>:   call   0x1c39 <explode_bomb>
0x00001682 <+269>:   mov    $0x64,%eax
0x00001687 <+274>:   jmp    0x16c9 <phase_3+340>
0x00001689 <+276>:   mov    $0x78,%eax
0x0000168e <+281>:   cmpl   $0x224,0x8(%esp)
0x00001696 <+289>:   je     0x16c9 <phase_3+340>
```

发现从后面的指令, 不存在跳转到这之前的指令的情况, 所以我们可以认为, 上面这一段是没有用的, 无需分析.

```nasm
0x00001698 <+291>:   call   0x1c39 <explode_bomb>
0x0000169d <+296>:   mov    $0x78,%eax
0x000016a2 <+301>:   jmp    0x16c9 <phase_3+340>
```

第一个合法的 `A` 是 `A = 4`, 但是会直接引爆炸弹.

```nasm
0x000016a4 <+303>:   mov    $0x68,%eax
0x000016a9 <+308>:   cmpl   $0x222,0x8(%esp)
0x000016b1 <+316>:   je     0x16c9 <phase_3+340>
0x000016b3 <+318>:   call   0x1c39 <explode_bomb>
```

另一个合法的是 `A = 7` 时, 要求 `C = 0x222 = 546`.

```nasm
0x000016b8 <+323>:   mov    $0x68,%eax
0x000016bd <+328>:   jmp    0x16c9 <phase_3+340>
0x000016bf <+330>:   call   0x1c39 <explode_bomb>
0x000016c4 <+335>:   mov    $0x74,%eax
```

这一段理论上不会被执行, 不分析.

```nasm
0x000016c9 <+340>:   cmp    %al,0x3(%esp)
0x000016cd <+344>:   jne    0x16e1 <phase_3+364>
0x000016cf <+346>:   mov    0xc(%esp),%eax
0x000016d3 <+350>:   sub    %gs:0x14,%eax
0x000016da <+357>:   jne    0x16e8 <phase_3+371>
```

跳转过来之后, 要求 `B = 0x68`, 也就是 `h`.

```nasm
0x000016dc <+359>:   add    $0x18,%esp
0x000016df <+362>:   pop    %ebx
0x000016e0 <+363>:   ret
0x000016e1 <+364>:   call   0x1c39 <explode_bomb>
0x000016e6 <+369>:   jmp    0x16cf <phase_3+346>
0x000016e8 <+371>:   call   0x2a40 <__stack_chk_fail_local>
```

因此本阶段密码为: `7 h 546`.

### `<phase_4>`

```nasm
0x00001746 <+0>:     push   %ebx
0x00001747 <+1>:     sub    $0x18,%esp
0x0000174a <+4>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x0000174f <+9>:     add    $0x4815,%ebx
0x00001755 <+15>:    mov    %gs:0x14,%eax
0x0000175b <+21>:    mov    %eax,0xc(%esp)
0x0000175f <+25>:    xor    %eax,%eax
0x00001761 <+27>:    lea    0x8(%esp),%eax
0x00001765 <+31>:    push   %eax
0x00001766 <+32>:    lea    0x8(%esp),%eax
0x0000176a <+36>:    push   %eax
0x0000176b <+37>:    lea    -0x2c85(%ebx),%eax
0x00001771 <+43>:    push   %eax
0x00001772 <+44>:    push   0x2c(%esp)
0x00001776 <+48>:    call   0x1140 <__isoc99_sscanf@plt>
0x0000177b <+53>:    add    $0x10,%esp
0x0000177e <+56>:    cmp    $0x2,%eax
0x00001781 <+59>:    jne    0x178a <phase_4+68>
0x00001783 <+61>:    cmpl   $0xe,0x4(%esp)
0x00001788 <+66>:    jbe    0x178f <phase_4+73>
0x0000178a <+68>:    call   0x1c39 <explode_bomb>
```

这里读入了两个数, 并且要求 `0x4(%esp)` 小于等于 `0xe = 14`. 在 `<phase_4+53>` 后, 读入的数字存储的位置应该是: `0x4(%esp)`, `0x8(%esp)`.

```nasm
0x0000178f <+73>:    sub    $0x4,%esp
0x00001792 <+76>:    push   $0xe
0x00001794 <+78>:    push   $0x0
0x00001796 <+80>:    push   0x10(%esp)
0x0000179a <+84>:    call   0x16ed <func4>
0x0000179f <+89>:    add    $0x10,%esp
```

这里调用了一个从命名看不出任何内容的函数 `<func4>`

```nasm
0x000017a2 <+92>:    cmp    $0x7,%eax
0x000017a5 <+95>:    jne    0x17ae <phase_4+104>
0x000017a7 <+97>:    cmpl   $0x7,0x8(%esp)
0x000017ac <+102>:   je     0x17b3 <phase_4+109>
0x000017ae <+104>:   call   0x1c39 <explode_bomb>
0x000017b3 <+109>:   mov    0xc(%esp),%eax
0x000017b7 <+113>:   sub    %gs:0x14,%eax
0x000017be <+120>:   jne    0x17c5 <phase_4+127>
0x000017c0 <+122>:   add    $0x18,%esp
0x000017c3 <+125>:   pop    %ebx
0x000017c4 <+126>:   ret
0x000017c5 <+127>:   call   0x2a40 <__stack_chk_fail_local>
```

### `<func4>`

```nasm
0x000016ed <+0>:     push   %ebx
0x000016ee <+1>:     sub    $0x8,%esp
0x000016f1 <+4>:     mov    0x10(%esp),%eax
0x000016f5 <+8>:     mov    0x18(%esp),%ecx
0x000016f9 <+12>:    mov    %ecx,%edx
0x000016fb <+14>:    sub    0x14(%esp),%edx
0x000016ff <+18>:    mov    %edx,%ebx
0x00001701 <+20>:    shr    $0x1f,%ebx
0x00001704 <+23>:    add    %edx,%ebx
0x00001706 <+25>:    sar    $1,%ebx
0x00001708 <+27>:    add    0x14(%esp),%ebx
0x0000170c <+31>:    cmp    %eax,%ebx
0x0000170e <+33>:    jg     0x1719 <func4+44>
0x00001710 <+35>:    jl     0x1731 <func4+68>
0x00001712 <+37>:    mov    %ebx,%eax
0x00001714 <+39>:    add    $0x8,%esp
0x00001717 <+42>:    pop    %ebx
0x00001718 <+43>:    ret
0x00001719 <+44>:    sub    $0x4,%esp
0x0000171c <+47>:    lea    -0x1(%ebx),%edx
0x0000171f <+50>:    push   %edx
0x00001720 <+51>:    push   0x1c(%esp)
0x00001724 <+55>:    push   %eax
0x00001725 <+56>:    call   0x16ed <func4>
0x0000172a <+61>:    add    $0x10,%esp
0x0000172d <+64>:    add    %eax,%ebx
0x0000172f <+66>:    jmp    0x1712 <func4+37>
0x00001731 <+68>:    sub    $0x4,%esp
0x00001734 <+71>:    push   %ecx
0x00001735 <+72>:    lea    0x1(%ebx),%edx
0x00001738 <+75>:    push   %edx
0x00001739 <+76>:    push   %eax
0x0000173a <+77>:    call   0x16ed <func4>
0x0000173f <+82>:    add    $0x10,%esp
0x00001742 <+85>:    add    %eax,%ebx
0x00001744 <+87>:    jmp    0x1712 <func4+37>
```