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

从调用函数前栈顶下方一个长字位置开始, 将连续的六个长字地址从下到上压入栈中.

```nasm
0x00001c96 <+40>:    lea    -0x2c91(%ebx),%eax
0x00001c9c <+46>:    push   %eax
0x00001c9d <+47>:    push   0x2c(%esp)
0x00001ca1 <+51>:    call   0x1140 <__isoc99_sscanf@plt>
0x00001ca6 <+56>:    add    $0x20,%esp
0x00001ca9 <+59>:    cmp    $0x5,%eax
0x00001cac <+62>:    jle    0x1cb3 <read_six_numbers+69>
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
0x0000152d <+46>:    cmpl   $0x1,0x4(%esp)
0x00001532 <+51>:    jne    0x153e <phase_2+63>
0x00001534 <+53>:    lea    0x4(%esp),%esi
0x00001538 <+57>:    lea    0x18(%esp),%edi
0x0000153c <+61>:    jmp    0x154c <phase_2+77>
0x0000153e <+63>:    call   0x1c39 <explode_bomb>
0x00001543 <+68>:    jmp    0x1534 <phase_2+53>
```

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

```cpp
while(1) {
  if(%edi == (%esi += 4)) break;
  if(*(%esi + 4) != (%eax = (*%esi << 1))) explode_bomb;
}
```

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

```cpp
%eax = *(%esp + 0x1c) - *(%gs + 0x14);
if(%eax) return __stack_chk_fail_local();
return;
```