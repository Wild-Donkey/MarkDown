# Verilog 不让 cheat

[TOC]

## 层次结构

Design: typically top-down

Verification: typically bottom-up

## Structural

实例化模块, 描述模块的端口连接的是谁. 逻辑门也可以当作是模块, 端口一般输出在前, 输入在后.

```verilog
module majority (major, V1, V2, V3) ;

output major ;
input V1, V2, V3 ;

wire N1, N2, N3;

and A0 (N1, V1, V2),
    A1 (N2, V2, V3),
    A2 (N3, V3, V1);

or  Or0	(major, N1, N2, N3);    

endmodule 
```

这样可以定义一个 4bit 的连接:

```verilog
wire [3:0] partialsum;
```

模块的端口留空会导致这个端口变成高阻抗状态 (z) 也就是断路. 电路中一个点应当是存在 $4$ 种状态: 0/1 高/低电平, z 高阻抗, x 不确定/冲突.

## Dataflow

直接描述表达式.

```verilog
module majority (major, V1, V2, V3) ;

output major;
input V1, V2, V3 ;

assign major = V1 & V2 | V2 & V3 | V1 & V3;
endmodule 
```

32 位加法器和 MAC 可以直接实现:

```verilog
wire [31:0] sum, src1, src2;  // 3 32-bit wide vectors
assign {c_out,sum} = src1 + src2 + c_in;
```

```verilog
module mac(output [31:0] Z, output overflow, 
                    input [15:0] A, B, input [31:0] C);
    assign {overflow, Z} = A*B + C;
endmodule
```

`assign` 可以用的运算符: `+`, `-`, `&`, `|`, `^`, `~`, `>>`,...

## Behavioral

在什么情况会满足什么条件: 比如: V1, V2, V3 任意改变后, major 需要满足什么条件.

`always` 改变的必须是寄存器 `reg`.

```verilog
module majority (major, V1, V2, V3) ;

output reg major ;
input V1, V2, V3 ;

always @(V1, V2, V3) begin
  if (V1 && V2 || V2 && V3 || V1 && V3) major = 1;
  else major = 0;
end

endmodule 
```

`initial` 和 `always` 不能嵌套. `initial` 只在仿真时有用, 不会在电路上有体现. 初始化存储器需要从外部文件加载:

```verilog
reg [7:0] mem [0:15];

initial begin
  $readmemh("init_data.txt", mem);
end
```

也可以用 `always` 和 `default` 来初始化:

```verilog
always @(*) begin
  case (bin_in)
    4'd0: seg = 8'b11000000;
    4'd1: seg = 8'b11111001;
    // ...
    default: seg = 8'b11111111;
  endcase
end
```

可以没有 `@(...)`, 则 `while(1);`, 如果用 `@(*)`, 则会自动包含所有右值变量, 生成组合逻辑电路.

按规范来说, 组合逻辑电路应该总是使用 `@(*)`.

## Primitives(原语)

`and`, `nand`, `or`, `nor`, `xor`, `xnor`, `not`, `buf`, `bufif1`, etc.

只可实例化, 不可定义.

```verilog
and #10 N30 (Z, A, B, X); 
```

delay 语法, `#10` 表示与门存在 $10$ 个时间单位的延迟, 时间单位由文件中的这一行定义:

```verilog
`timescale 1ns / 1ps
```

这里表示一个时间单位是 `1ns`, 模拟时精度可以达到 `1ps`.

## 时序控制

`#100` 延迟控制, 表示中断一定的时间.

`@` 事件控制, `posedge`, `negedge`, `signals`.

`wait (<expression>)` 直到表达式为真才执行语句.

`specify (<expression>) = <time> endspecify`, 定义一个模块的某个路径的延迟.


## 编码和解码

**译码器** 和 **选择器(多路复用器)** 是对偶器件.

```verilog
module mux_41(a, sel, out);
    parameter WIDTH = 8;
    
    input [WIDTH-1:0] a[0:3];
    input [1:0] sel;
    output [WIDTH-1:0] out;
    
    // 利用数组
    assign out = a[sel];
    
endmodule
```

## 赋值

`=` 阻塞赋值一般用于组合逻辑电路, 立即生效.

`<=` 非阻塞赋值一般用于时序逻辑电路, 延迟生效 (先保存赋值的结果, 再生效, 类似于寄存器的行为)

`assign` 持续赋值, 只要 RHS 变, 则 LHS 赋值. 

## case

逐位比较 `case` 括号内的变量, 做出相应修改.

```verilog
parameter AND = 2’b00;
parameter OR = 2’b01;
parameter XOR = 2’b10;

case (alu_op)
   AND 		: alu = src1 & src2;
   OR 		: alu = src1 | src2;
   XOR 		: alu = src1 ^ src2;
   default	: alu = src1 + src2;
endcase
```

比较的目标位可以是 `x` 或 `z`, 但是只能在仿真测试中用来 debug.

`case`: 只能匹配确定的二进制串, 不能包含 `?`, `x`, `z`.

`casez`: 把 `z` 当成 `?`, 匹配目标中的 `z` 和 `?` 意义相同, 这些位可以匹配 `0`, `1`, `?`, `z`.

`casex`: 把 `z`, `x` 都当成 `?`, 一般只用于仿真.

## 循环

`for` 静态展开, 每一次执行都变成独立的电路.

```verilog
module mult4b(output reg [7:0] R, input [3:0] A, input [3:0] B);
    integer i;

    always @(A, B) begin
        R = 0;
        for(i=1; i<=4; i=i+1)
            if(B[i-1]) R = R + (A<<i);
        end
endmodule
```

`while` 一般只在仿真中使用.

```verilog
reg [15:0] flag;
reg [4:0] index;

initial begin
   index=0;
   found=1’b0;
   while ((index<16) && (!found)) begin
      if (flag[index]) found = 1’b1;
      else index = index + 1;
   end
   if (!found) $display(“non-zero flag bit not found!”);
   else $display(“non-zero flag bit found in position %d”,index);
end
```

`repet` 固定次循环, 也一般在仿真中使用.

```verilog
initial begin
   inc_DAC = 1’b1;
   repeat(4095) @(posedge clk);	// bring DAC right up to point of rollover
   inc_DAC = 1’b0;
   inc_smpl = 1’b1;
   repeat(7)@(posedge clk);	// bring sample count up to 7
   inc_smpl = 1’b0;
end
```

`forever` 只能仿真用.

```verilog
initial begin
  clk = 0;
  forever #10 clk = ~ clk;
end
```

## Task

时序逻辑电路, 可以包含时间控制结构, 能包含别的 Task 或 Function.

输入和输出数量不限制, 没有返回值.

## Function

组合逻辑电路, 没有时间控制结构, 不能包含 Task, 可以包含别的 Function.

有至少一个输入, 只有一个返回值作为输出.

```verilog
module arithmetic_unit (result_1, result_2, operand_1, operand_2,);
  output 		[4: 0] result_1;
  output		[3: 0] result_2;
  input 		[3: 0] operand_1, operand_2;
  assign result_1 = sum_of_operands (operand_1, operand_2);
  assign result_2 = larger_operand (operand_1, operand_2);

  function [4: 0] sum_of_operands(input [3:0] operand_1, operand_2);
    sum_of_operands = operand_1 + operand_2;
  endfunction

  function [3: 0] larger_operand(input [3:0] operand_1, operand_2);
    larger_operand = (operand_1 >= operand_2) ? operand_1 : operand_2;
  endfunction
endmodule
```

`sum_of_operands` 是函数名, 也是输出端口名. 可以递归但是不建议, 递归必须能静态展开且层数不能过大.

## 命名块

将 `begin/end` 或 `fork/join` 包裹的块命名后, 可以通过分级命名空间来访问局部变量, 比如下面可以用 `top.block1.i` 访问 `block1` 中的变量 `i`.

```verilog
module top();
initial begin: block1
   integer i;	// i is local to block1
    // top.block1.i
   …
end		// end of block1
endmodule
```

## 参数化设计

可以参数化位宽等常数, 无需多次设计.

```verilog
module full_adder(a, b, c_in, sum, c_out);
    // 学习 parameter 的申明及使用
    parameter WIDTH = 8;
    
    input [WIDTH-1:0] a, b;
    input c_in;
    output [WIDTH-1:0] sum;
    output c_out;
    
    assign { c_out, sum } = a + b + c_in;
endmodule

// 调用语法
full_adder #(.WIDTH(32)) dut(a, b, c_in, sum, c_out);
```

## 寄存器

### 锁存器

锁存器 (Latch): 当使能信号（如CLK或EN）保持某一电平（如高电平）时，输入变化会立即影响输出。
不依赖时钟边沿，对时序要求不严格，但容易产生毛刺和不稳定现象。

Latch 消耗 FPGA 资源更多, 容易产生毛刺. 尽可能避免 Latch. 当 if 没有 else 或 case 没有 default 时容易产生 Latch.

### 触发器

触发器 (Flip-Flop): 只在时钟信号的上升沿或下降沿时才采样输入，输出在时钟边沿之后才变化。
配合时钟系统，时序清晰、确定性强。是时序逻辑电路的核心，如寄存器、计数器、FSM等。

### 复位

D 触发器的 `Clr` 传输的是异步复位信号, 触发时立刻生效. 同步复位则是每个时钟触发时, 才检测是否有 `RST` 信号.

实现上, 同步复位只需要 `always@(posedge CLK)`, 而异步复位则需要 `always@(posedge CLK, negedge Rst_n)`. 但是在实际工作中, 一般采用异步出发, 同步释放.

### IR (Instruction Register) —— 指令寄存器

存放当前指令

### MAR (Memory Address Register) —— 存储器地址寄存器

存放内存地址

### MDR (Memory Data Register) —— 存储器数据寄存器

传输/存放数据

## 存储器

寄存器阵列. 双端口存储器的写入和读取完全独立.

```verilog
module ram(data, read_addr, write_addr, clk, we, q);
  parameter DATA_WIDTH = 8;
  parameter ADDR_WIDTH = 3;

  input clk, we;
  input [DATA_WIDTH-1:0] data;
  input [ADDR_WIDTH-1:0] read_addr, write_addr;
  output reg [DATA_WIDTH-1:0] q;

  // 申明存储器数组
  reg [DATA_WIDTH-1:0] ram[2**ADDR_WIDTH-1:0];

  always @(posedge clk) begin
    if (we)
      ram[write_addr] <= data;

    q <= ram[read_addr];
  end    
endmodule
```

## 数据通路

寄存器 LA, LB 存储两个操作数. 通用内存模块 GR (General Register) 保存数据或地址等信息.

ALU 接受 Op, LA, LB, 来进行运算, 将结果存入 GR.

```verilog
module datapath_top(clk, rst, lda, ldb,
                    read_addr, write_addr,
                    we, op);
  input clk, rst, lda, ldb, we;
  input [4:0] read_addr, write_addr;
  input [1:0] op;

  wire [31:0] gr_data, alu_data;
  wire [31:0] la_data, lb_data;
  
  register #(32) LA (clk, rst, lda, gr_data, la_data);
  register #(32) LB (clk, rst, ldb, gr_data, lb_data);
  ram #(32, 5) GR (alu_data, read_addr, write_addr, 
                   clk, we, gr_data);
  alu #(32) ALU (la_data, lb_data, op, alu_data);

endmodule
```

## 有限状态机 (FSM)

有限状态机的要素：现态、次态、条件、动作。

CPU 是同步时序电路，clk^ 是必然迁移条件。从当前状态迁移到下一个状态。在 clk 的上升沿完成迁移，是典型的“同步时序逻辑”。

Moore 型 FSM: 输出只和当前状态相关
Mealy 型 FSM: 输出和当前状态、输入相关

可以定义 `localparam` 用状态名代替二进制串.

两段式实现, 分离了时序逻辑和组合逻辑:

```verilog
module laser_timer(clk,rst,b,x);
  input clk, rst, b;
  output reg x;
    
  localparam S0 = 0, S1 = 1,
             S2 = 2, S3 = 3;
    
  reg [1:0] State, StateNext;

  always @(State, b) begin
    case(State)
      S0: begin
        x <= 0;
        if (b == 1)
          StateNext <= S1;
        else
          StateNext <= S0;
      end
      S1: begin
        x <= 0;
        if (b == 1)
          StateNext <= S2;
        else
          StateNext <= S0;
      end
      S2: begin
        x <= 0;
        if (b == 1)
          StateNext <= S3;
        else
          StateNext <= S0;
      end
      S3: begin
        x <= 1;
        if (b == 1)
          StateNext <= S3;
        else
          StateNext <= S0;
      end
    endcase
  end
  
  always @(posedge clk)
  begin
    if (rst == 1)
      State <= S0;
    else
      State <= StateNext;
  end
endmodule
```

所谓安全的 FSM 是指：如果进入非法状态时，可以自动转移到合法状态的 FSM。

## CPU 结构

数据通路 – 执行机构: 运算单元 + 存储单元
有限状态机 – 控制单元

### 单总线 CPU

总线有时候传输地址, 有时候传输数据, 有时候传输指令.

## Testbench

不直接综合为硬件电路。它主要用于仿真阶段，通过输入激励信号、观察输出结果，验证设计模块是否符合预期功能。

自动或手动比对输出是否正确，通过 `$display`、`$monitor`、`$strobe` 等进行输出，必要时触发错误报告 `$fatal`。

控制仿真过程的启动、暂停和结束，例如使用 `$finish`、`$stop`。

```verilog
`timescale 1ns/1ps  

module tb_example();
    // 1. 信号声明
    reg clk, rst;
    reg [7:0] a, b;
    wire [7:0] sum;

    // 2. 实例化 DUT (Device Under Test)
    adder dut (
        .clk(clk),
        .rst(rst),
        .a(a),
        .b(b),
        .sum(sum)
    );

    // 3. 时钟生成
    initial clk = 0;
    always #5 clk = ~clk;  // 10ns 周期

    // 4. 激励生成
    initial begin
        rst = 1; a = 0; b = 0;
        #20 rst = 0;

        // 测试用例 1
        a = 8'd10; b = 8'd5; 
        #10;

        // 测试用例 2
        a = 8'd100; b = 8'd50;
        #10;

        $finish;
    end

    // 5. 结果监视
    initial begin
        $monitor("At time %0t: a=%d, b=%d, sum=%d", $time, a, b, sum);
    end
endmodule
```

在全局置位、复位脉冲释放之前就确保时钟源已经开始工作。

在仿真时间的 0 时刻，将所有的设计输入初始化位为一个确定的值；

在综合后和实现后的时序仿真中，会自动触发全局置位/复位脉冲（GSR），这会让所有的寄存器在仿真的前 100ns 内锁定其值。因此在 100ns 之后再赋值激励数据；

另一个 Testbench 例子:

```verilog
module test_and;
integer file, i, code;
reg a, b, expect, clock;
wire out;
parameter cycle = 20;
and #4 a0(out, a, b); 		// Circuit under test

initial begin : file_block
    clock = 0;
    file = $fopen("compare.txt", “r” );
    for (i = 0; i < 4; i=i+1) begin
       @(posedge clock) 	// Read stimulus on rising clock
       code = $fscanf(file, "%b %b %b\n", a, b, expect);
       #(cycle - 1) 		// Compare just before end of cycle
       if (expect !== out)
          $strobe("%d %b %b %b %b", $time, a, b, expect, out);
    end // for
    $fclose(file); $stop; 
end // initial
always #(cycle /2) clock = ~clock; // Clock generator
endmodule
```

`$display`: 直接打印并换行。

```verilog
$display("Time: %0t, a = %b", $time, a);  // 会换行
```

`$strobe`: 等到当前时间点的所有赋值都完成后再输出。

```verilog
$strobe("At time %0t, final value of out = %b", $time, out);
```

`$write`: 直接输出，不自动换行。

```verilog
$write("a = %b, ", a);
$write("b = %b\n", b);  // 手动添加换行
```

`$monitor`: 任何被监视信号变化时立即触发.

```verilog
$monitor("Time=%0t, a=%b, b=%b", $time, a, b);
```

```
Time=0, a=0, b=0
Time=10, a=1, b=0
Time=30, a=1, b=1
Time=60, a=0, b=1
```