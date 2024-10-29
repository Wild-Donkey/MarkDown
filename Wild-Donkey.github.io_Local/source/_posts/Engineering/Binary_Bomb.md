# 反汇编拆弹

## 学赛博手艺 玩电子puzzle

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

---

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

---

### `<func4>`

传入三个参数, 从栈顶往下, 设为 `A`, `B`, `C`.

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
```

`%eax = A`, `%ecx = C`, `%edx = C - B`, `%ebx = (C - B) >> 31 + (C - B)`. (逻辑右移, 高位补 `0`)

这里 `%ebx` 的值本质上是 `C - B` 加上它的符号位.

`%ebx = (%ebx >> 1) + B`. (算术右移, 高位补符号位)

```nasm
0x0000170c <+31>:    cmp    %eax,%ebx
0x0000170e <+33>:    jg     0x1719 <func4+44>
0x00001710 <+35>:    jl     0x1731 <func4+68>
0x00001712 <+37>:    mov    %ebx,%eax
0x00001714 <+39>:    add    $0x8,%esp
0x00001717 <+42>:    pop    %ebx
0x00001718 <+43>:    ret
```

当 `%ebx = %eax = A` 时, 会用 `%eax` 返回 `%ebx` 的值.

```nasm
0x00001719 <+44>:    sub    $0x4,%esp
0x0000171c <+47>:    lea    -0x1(%ebx),%edx
0x0000171f <+50>:    push   %edx
0x00001720 <+51>:    push   0x1c(%esp)
0x00001724 <+55>:    push   %eax
0x00001725 <+56>:    call   0x16ed <func4>
0x0000172a <+61>:    add    $0x10,%esp
0x0000172d <+64>:    add    %eax,%ebx
0x0000172f <+66>:    jmp    0x1712 <func4+37>
```

如果 `%ebx > %eax`, 会递归调用 `<func4>`, `A' = %eax = A`, `B = B'`, `C' = %edx = %ebx - 1`, 将调用的返回值增加到 `%ebx` 中, 然后跳出函数.

```nasm
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

`%ebx < %eax` 也会递归, `A' = A`, `B' = %ebx + 1`, `C' = C`, 将返回值增加到 `%ebx` 中, 返回 `%ebx` 的值.

---

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

这里读入了两个数, 并且要求 `0x4(%esp)` 小于等于 `0xe = 14`. 在 `<phase_4+53>` 后, 读入的数字存储的位置应该是: `0x4(%esp)`, `0x8(%esp)`, 记为 `X`, `Y`.

```nasm
0x0000178f <+73>:    sub    $0x4,%esp
0x00001792 <+76>:    push   $0xe
0x00001794 <+78>:    push   $0x0
0x00001796 <+80>:    push   0x10(%esp)
0x0000179a <+84>:    call   0x16ed <func4>
0x0000179f <+89>:    add    $0x10,%esp
```

这里调用了一个从命名看不出任何内容的函数 `<func4>`, 传入了三个参数, 从栈顶往下, 依次为: `X`, `0`, `14`.

```nasm
0x000017a2 <+92>:    cmp    $0x7,%eax
0x000017a5 <+95>:    jne    0x17ae <phase_4+104>
```

这里可以发现, 需要调整 `X` 的值, 使得调用 `<func4>` 的返回值为 `7`.

调用 `<func4>(X, 0, 14)`, `%ebx` 在 `<func4+27>` 后等于 `7`, 所以只需令 `X = 7` 即可通过本阶段.

```nasm
0x000017a7 <+97>:    cmpl   $0x7,0x8(%esp)
0x000017ac <+102>:   je     0x17b3 <phase_4+109>
```

由此得出 `Y = 7`.

```nasm
0x000017ae <+104>:   call   0x1c39 <explode_bomb>
0x000017b3 <+109>:   mov    0xc(%esp),%eax
0x000017b7 <+113>:   sub    %gs:0x14,%eax
0x000017be <+120>:   jne    0x17c5 <phase_4+127>
0x000017c0 <+122>:   add    $0x18,%esp
0x000017c3 <+125>:   pop    %ebx
0x000017c4 <+126>:   ret
0x000017c5 <+127>:   call   0x2a40 <__stack_chk_fail_local>
```

综上本阶段答案为 `7 7`, 但是直觉上, 答案可能不唯一, 但是没有挖掘更多答案的必要.

---

### `<phase_5>`

```nasm
0x000017ca <+0>:     push   %esi
0x000017cb <+1>:     push   %ebx
0x000017cc <+2>:     sub    $0x20,%esp
0x000017cf <+5>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x000017d4 <+10>:    add    $0x4790,%ebx
0x000017da <+16>:    mov    0x2c(%esp),%esi
0x000017de <+20>:    mov    %gs:0x14,%eax
0x000017e4 <+26>:    mov    %eax,0x18(%esp)
0x000017e8 <+30>:    xor    %eax,%eax
0x000017ea <+32>:    push   %esi
0x000017eb <+33>:    call   0x1b03 <string_length>
0x000017f0 <+38>:    add    $0x10,%esp
0x000017f3 <+41>:    cmp    $0x6,%eax
0x000017f6 <+44>:    jne    0x184d <phase_5+131>
```

`<phase_5+16>` 给 `%esi` 赋的值, 存储在调用 `<phase_5>` 前的栈顶位置, 也就是传入的参数, 输入的字符串头指针. 后面对这个字符串求长度, 存储在 `%eax`, 并且由 `<phase_5+41>` 推断输入字符串的长度必须是 `6`.

```nasm
0x000017f8 <+46>:    mov    $0x0,%eax
0x000017fd <+51>:    lea    -0x2da4(%ebx),%ecx
0x00001803 <+57>:    movzbl (%esi,%eax,1),%edx
0x00001807 <+61>:    and    $0xf,%edx
0x0000180a <+64>:    movzbl (%ecx,%edx,1),%edx
0x0000180e <+68>:    mov    %dl,0x5(%esp,%eax,1)
0x00001812 <+72>:    add    $0x1,%eax
0x00001815 <+75>:    cmp    $0x6,%eax
0x00001818 <+78>:    jne    0x1803 <phase_5+57>
0x0000181a <+80>:    movb   $0x0,0xb(%esp)
```

通过访问内存, 得到 `%ecx` 字符串的前 `16` 个字节, `maduiersnfotvbyl`, 记这个字符串为 `List`.

这里是一个循环, 将字符串 `%esi` 的每一个字符 `%esi[i]` 与 `0xf` 也就是四个 `1` 的掩码后得到 `D`. 在字符串 `%ecx` 中, 取第 `D` 个字符, 放入 `%esp + i + 5` 中. 

这样就使得 `%esp + 5` 到 `%esp + a` 共六个字节成为一个新的字符串, 所以最后在 `%esp + b` 赋 `0` 表示结束. 记这个串为 `T`.

```nasm
0x0000181f <+85>:    sub    $0x8,%esp
0x00001822 <+88>:    lea    -0x2dcd(%ebx),%eax
0x00001828 <+94>:    push   %eax
0x00001829 <+95>:    lea    0x11(%esp),%eax
0x0000182d <+99>:    push   %eax
0x0000182e <+100>:   call   0x1b21 <strings_not_equal>
0x00001833 <+105>:   add    $0x10,%esp
0x00001836 <+108>:   test   %eax,%eax
0x00001838 <+110>:   jne    0x1854 <phase_5+138>
```

在对 `%esp` 进行后续修改后, 伸长了 `b` 个字节, 所以 `b + 5 = 0x11`, `<phase_5+95>` 中赋给 `%eax` 的就是 `T` 的头指针. 

访问内存获取参与比较的另一个字符串 `-0x2dcd(%ebx)`, 内容是 `flyers`, 记为 `S`.

在 `List` 中检索这个 `S`, 得到下标序列 `9, f, e, 5, 6, 7`, 需要找到六个字符, 使得他们的低四位是这几个数. 对于可打印字符, 可行的解有:

`9`: `)9IYiy`

`f`: `/?O_o`

`e`: `.>N^n~`

`5`: `%5EUeu`

`6`: `&6FVfv`

`7`: `'7GWgw`

这六组字符按顺序组成字符串理论上都可以作为答案, 随便取一组 `)_>%&'` 进行测试, 通过了本阶段.

```nasm
0x0000183a <+112>:   mov    0xc(%esp),%eax
0x0000183e <+116>:   sub    %gs:0x14,%eax
0x00001845 <+123>:   jne    0x185b <phase_5+145>
0x00001847 <+125>:   add    $0x14,%esp
0x0000184a <+128>:   pop    %ebx
0x0000184b <+129>:   pop    %esi
0x0000184c <+130>:   ret
0x0000184d <+131>:   call   0x1c39 <explode_bomb>
0x00001852 <+136>:   jmp    0x17f8 <phase_5+46>
0x00001854 <+138>:   call   0x1c39 <explode_bomb>
0x00001859 <+143>:   jmp    0x183a <phase_5+112>
0x0000185b <+145>:   call   0x2a40 <__stack_chk_fail_local>
```

---

### `<phase_6>`

```nasm
0x00001860 <+0>:     push   %ebp
0x00001861 <+1>:     push   %edi
0x00001862 <+2>:     push   %esi
0x00001863 <+3>:     push   %ebx
0x00001864 <+4>:     sub    $0x74,%esp
0x00001867 <+7>:     call   0x1240 <__x86.get_pc_thunk.bx>
0x0000186c <+12>:    add    $0x46f8,%ebx
0x00001872 <+18>:    mov    %gs:0x14,%eax
0x00001878 <+24>:    mov    %eax,0x64(%esp)
0x0000187c <+28>:    xor    %eax,%eax
0x0000187e <+30>:    lea    0x34(%esp),%eax
0x00001882 <+34>:    mov    %eax,%edi
0x00001884 <+36>:    mov    %eax,0x24(%esp)
0x00001888 <+40>:    push   %eax
0x00001889 <+41>:    push   0x8c(%esp)
0x00001890 <+48>:    call   0x1c6e <read_six_numbers>
```

调用 `<read_six_numbers>` 前, 栈顶下方一个长字, 就是读入数字存储的头指针, 即 `<phase_6+30>` 的 `%esp + 0x34`, 也就是 `<phase_6+48>` 时的 `%esp + 0x3c`. 设读入的数为 `A[0]`, `A[1]`, ..., `A[5]`.

```nasm
0x00001895 <+53>:    mov    %edi,0x28(%esp)
0x00001899 <+57>:    add    $0x10,%esp
0x0000189c <+60>:    mov    %edi,0x10(%esp)
0x000018a0 <+64>:    movl   $0x0,0xc(%esp)
0x000018a8 <+72>:    mov    %edi,%ebp
0x000018aa <+74>:    jmp    0x18cf <phase_6+111>
```

```nasm
0x000018ac <+76>:    call   0x1c39 <explode_bomb>
0x000018b1 <+81>:    jmp    0x18e3 <phase_6+131>
0x000018b3 <+83>:    add    $0x1,%esi
0x000018b6 <+86>:    cmp    $0x6,%esi
0x000018b9 <+89>:    je     0x18ca <phase_6+106>
0x000018bb <+91>:    mov    0x0(%ebp,%esi,4),%eax
0x000018bf <+95>:    cmp    %eax,(%edi)
0x000018c1 <+97>:    jne    0x18b3 <phase_6+83>
0x000018c3 <+99>:    call   0x1c39 <explode_bomb>
0x000018c8 <+104>:   jmp    0x18b3 <phase_6+83>
```

这是内层循环, 将 `%esi` 从 `0xc(%esp)` 枚举到 `5`, 记为 `j`.

从 `<phase_6+95>` 可以判断, `A[i + 1]` 到 `A[5]` 都不应该当等于 `A[i]`. 即, 六个数互不相同.

```nasm
0x000018ca <+106>:   addl   $0x4,0x10(%esp)
0x000018cf <+111>:   mov    0x10(%esp),%eax
0x000018d3 <+115>:   mov    %eax,%edi
0x000018d5 <+117>:   mov    (%eax),%eax
0x000018d7 <+119>:   mov    %eax,0x14(%esp)
0x000018db <+123>:   sub    $0x1,%eax
0x000018de <+126>:   cmp    $0x5,%eax
0x000018e1 <+129>:   ja     0x18ac <phase_6+76>
0x000018e3 <+131>:   addl   $0x1,0xc(%esp)
0x000018e8 <+136>:   mov    0xc(%esp),%esi
0x000018ec <+140>:   cmp    $0x5,%esi
0x000018ef <+143>:   jle    0x18bb <phase_6+91>
```

这是外层循环的一部分, 会将 `0x10(%esp)` 从 `A[0]` 的地址枚举到 `A[5]`. 从 `0` 到 `5` 枚举 `0xc(%esp)` 和 `%esi`, 记为 `i`.

`<phase_6+126>` 要求 `%eax <= 5`, 注意到这里的 `%eax` 在上一条指令中被减去了 `1`, 也就是 `<phase_6+111>` 中 `1 <= (%eax) <= 6`. 也就是读入的数字都在 `1` 到 `6` 之间.

结合内层循环的判断, 这里应当是输入一个 `6` 的排列.

```nasm
0x000018f1 <+145>:   mov    0x1c(%esp),%edx
0x000018f5 <+149>:   add    $0x18,%edx
0x000018f8 <+152>:   mov    $0x7,%ecx
0x000018fd <+157>:   mov    0x18(%esp),%eax
0x00001901 <+161>:   mov    %ecx,%esi
0x00001903 <+163>:   sub    (%eax),%esi
0x00001905 <+165>:   mov    %esi,(%eax)
0x00001907 <+167>:   add    $0x4,%eax
0x0000190a <+170>:   cmp    %eax,%edx
0x0000190c <+172>:   jne    0x1901 <phase_6+161>
```

这是一个循环, `%eax` 从 `A[0]` 的地址开始, 每次向后一个长字, 直到 `A[6]` 的地址 (不存在这个元素, 但是由 `<phase_6+36>`, `<phase_6+145>` 和 `<phase_6+149>` 得知 `%edx` 保存的地址指向这个位置, 循环过程中也不会访问这个地址) 然后令 `A[i] = 7 - A[i]`.

```nasm
0x0000190e <+174>:   mov    $0x0,%esi
0x00001913 <+179>:   mov    %esi,%edi
0x00001915 <+181>:   mov    0x2c(%esp,%esi,4),%ecx
0x00001919 <+185>:   mov    $0x1,%eax
0x0000191e <+190>:   lea    0x168(%ebx),%edx
0x00001924 <+196>:   cmp    $0x1,%ecx
0x00001927 <+199>:   jle    0x1933 <phase_6+211>
0x00001929 <+201>:   mov    0x8(%edx),%edx
0x0000192c <+204>:   add    $0x1,%eax
0x0000192f <+207>:   cmp    %ecx,%eax
0x00001931 <+209>:   jne    0x1929 <phase_6+201>
0x00001933 <+211>:   mov    %edx,0x44(%esp,%edi,4)
0x00001937 <+215>:   add    $0x1,%esi
0x0000193a <+218>:   cmp    $0x6,%esi
0x0000193d <+221>:   jne    0x1913 <phase_6+179>
```

这是一个二重循环, 将 `%esi` 从 `0` 枚举到 `5`. 有一个新数组 `0x44(%esp)` 记为 `B`. 新建一个变量 `j = 1`, `k = %ebx + 0x168`. 如果 `A[i] <= j` 就令 `B[i] = k`, 否则 `++j`, 令 `k = *(k + 0x8)`.

`%ebx + 0x168 = 0x5655b0cc` 和之后的几个长字的值为:

```
0x5655b068: 0x56

0x5655b0cc <node1>:     0x0000008d      0x00000001      0x5655b0d8      0x00000131
0x5655b0dc <node2+4>:   0x00000002      0x5655b0e4      0x00000353      0x00000003
0x5655b0ec <node3+8>:   0x5655b0f0      0x00000237      0x00000004      0x5655b0fc
0x5655b0fc <node5>:     0x00000312      0x00000005      0x5655b068      0x00000000
```

我们可以尝试写出 `k` 的取值顺序: `0x5655b0cc, 0x5655b0d8, 0x5655b0e4, 0x5655b0f0, 0x5655b0fc, 0x5655b068`, 因为 `A[i]` 最多是 `6` 所以 `k` 的取值也只会迭代到第六次. 记第 `i` 个取值为 `k[i]`, 则经过这个循环后, `0x44(%esp)` 的值会变成 `B[i] = k[A[i] - 1]`.

可以认为, 从 `B[i]` 指向的字节开始的 `12` 个字节, 是一个结构体单元, 其中, 最后的四个字节表示一个指针, 表示它后继的头指针, 而开始的四个字节则存储该单元的权值.

```nasm
0x0000193f <+223>:   mov    0x44(%esp),%esi
0x00001943 <+227>:   mov    0x48(%esp),%eax
0x00001947 <+231>:   mov    %eax,0x8(%esi)
0x0000194a <+234>:   mov    0x4c(%esp),%edx
0x0000194e <+238>:   mov    %edx,0x8(%eax)
0x00001951 <+241>:   mov    0x50(%esp),%eax
0x00001955 <+245>:   mov    %eax,0x8(%edx)
0x00001958 <+248>:   mov    0x54(%esp),%edx
0x0000195c <+252>:   mov    %edx,0x8(%eax)
0x0000195f <+255>:   mov    0x58(%esp),%eax
0x00001963 <+259>:   mov    %eax,0x8(%edx)
0x00001966 <+262>:   movl   $0x0,0x8(%eax)
```

从 `B[0]` 到 `B[5]`, 执行 `*(B[i] + 8) = B[i + 1]`, `*(B[5] + 8) = 0`. 这里可以理解为重新赋值每个存储单元的后继指针.

```nasm
0x0000196d <+269>:   mov    $0x5,%edi
0x00001972 <+274>:   jmp    0x197c <phase_6+284>
0x00001974 <+276>:   mov    0x8(%esi),%esi
0x00001977 <+279>:   sub    $0x1,%edi
0x0000197a <+282>:   je     0x198c <phase_6+300>
0x0000197c <+284>:   mov    0x8(%esi),%eax
0x0000197f <+287>:   mov    (%eax),%eax
0x00001981 <+289>:   cmp    %eax,(%esi)
0x00001983 <+291>:   jge    0x1974 <phase_6+276>
0x00001985 <+293>:   call   0x1c39 <explode_bomb>
0x0000198a <+298>:   jmp    0x1974 <phase_6+276>
```

从 `5` 到 `0` 枚举 `edi`, 控制该结构执行五次.

需要保证每一次 `*%esi >= %eax`. 这里 `%esi` 的初始值是 `B[0]`, 每次迭代到它的后继. `%eax` 则是其后继的权值. 也就是说后继的权值小于等于自己的权值.

重新审视挖掘出来的字节信息, 每一个单元的权值分别为, `0x8d, 0x131, 0x353, 0x237, 0x312, 0x56`, 如果要将其降序排列, 经过前面操作的排列应该是: `3 5 4 2 1 6`.

考虑到之前存在操作, 使得所有 `A[i] = 7 - A[i]`, 所以推断本题答案为: `4 2 3 5 6 1`. 

```nasm
0x0000198c <+300>:   mov    0x5c(%esp),%eax
0x00001990 <+304>:   sub    %gs:0x14,%eax
0x00001997 <+311>:   jne    0x19a1 <phase_6+321>
0x00001999 <+313>:   add    $0x6c,%esp
0x0000199c <+316>:   pop    %ebx
0x0000199d <+317>:   pop    %esi
0x0000199e <+318>:   pop    %edi
0x0000199f <+319>:   pop    %ebp
0x000019a0 <+320>:   ret
0x000019a1 <+321>:   call   0x2a40 <__stack_chk_fail_local>
```

---

## 一组可行的解

![](image.png)

阶段五存在其它的解, 阶段四可能存在其它的解, 并且据说本实验还有隐藏关, 这次实验没有进行挖掘.