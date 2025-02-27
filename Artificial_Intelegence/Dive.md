# 环境

## Miniconda

```powershell
wget "https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe" -outfile ".\Downloads\Miniconda3-latest-Windows-x86_64.exe"
```

用安装包安装后，用下面的快捷方式打开加载了 `conda` 的 `powershell`

```powershell
%WINDIR%\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy ByPass -NoExit -Command "& 'C:\ProgramData\miniconda3\shell\condabin\conda-hook.ps1' ; conda activate 'C:\ProgramData\miniconda3' "
```

用指令

```powershell
conda create --name d2l python=3.9 -y
conda activate d2l
```

在 `C:\Users\Micheal\.conda\envs\d2l` 创建了一个环境, 并激活它. 这会在环境内安装一些软件包：

```
ca-certificates-2024.12.31
openssl-3.0.15
pip-25.0
python-3.9.21
setuptools-75.8.0
sqlite-3.45.3
tzdata-2025a
vc-14.42
vs2015_runtime-14.42.34433
wheel-0.45.1
```

## 软件包和学习资源

安装 `pytorch`, `jupyter` 和 `d2l`.

```powershell
pip install torch==1.12.0
pip install torchvision==0.13.0
pip install d2l==0.17.6
pip install jupyterlab
```

下载资源包 `d2l-zh-2.0.0` 的 `pytorch` 部分. 然后启动本地服务器：

```powershell
jupyter notebook
```

这会打开一个本地网页, 是本书的电子拷贝.

# 引言

## 一些概念

- 数据集和标记：一些给出的可能的输入集合是数据集，它们对应的正确输出为标记。
- 参数和模型：灵活的程序算法的输出由参数决定，调整过参数后的程序称模型。
- 模型族：仅调整参数的不同模型集合是模型族，可用于解决相似的任务。

## 训练

用数据训练模型。

设计一个参数随机的模型。调整参数让模型在一些数据中的表现尽可能好。重复这个过程直到模型表现足够好。

人编写的并不是解决对应问题的程序，而是编写了一个训练模型的程序。可以认为是训练程序利用数据编写了解决对应问题的程序。

机器学习的要素：数据，模型，目标函数，算法。

算法参考数据集的目标函数对模型的参数进行调整。

## 监督学习

**特征-标签** 称为一个 **样本**. 每个样本都有正确的标签，模型只需要计算给定输入的标签的条件概率。

- 回归：标签是任意数值，模型需要尽可能准确预测标签值。一般要求平方误差损失函数的最小。（最小二乘）
- 分类：预测样本属于哪个类别，常见的损失函数是交叉熵。
- 标记问题：对于不互斥的类别实现多标签分类。
- 搜索：在大量数据中找到相关度最高的，并根据相关度排序。
- 推荐系统：对于显性或隐性的反馈，给出得分最高的对象集。
- 序列学习：输入和输出都是序列，要求记忆之前的输入。

## 无监督学习

没有对目标的要求，程序自发学习。

- 聚类：没有标签，将数据分成不同的类别。
- 主成分分析：用少量的参数捕捉数据的属性。
- 因果关系和概率图模型问题：分析并描述数据的关系，变化的根本原因。
- 生成对抗性网络：参考真实虚假数据是否相同的测试合成数据。

## 与环境互动和强化学习

在线学习，从环境中获取输入和标签。和环境互动会改变环境，环境也会影响模型的行为。

这里的模型可以称为**智能代理**。训练与环境互动的智能代理的过程用到了**强化学习**。

智能体和环境交互，每个时刻获取一定的观察，执行某个动作，最后获得奖励。强化学习的目标是生成一个好的策略，使得获得的奖励尽可能大。

# 前置

## 张量(Tensor)

$n$ 维数组，特殊情况：一维向量，二维矩阵。

### 初始化和赋值

```py
import torch
x = torch.arange(12) # 0-11 的整数向量
print(x)
print(x.shape) # 输出 x 的形状
print(x.numel()) # 输出 x 的元素数
X = x.reshape(3, 4) # 不改变内容，改变形状
print(X)
print(torch.zeros((2, 3, 4))) # 用 0 填充
print(torch.ones((2, 3, 4))) # 用 1 填充
print(torch.randn(3, 4)) # 用标准正态分布填充
print(torch.tensor([[2, 1, 4, 3], [1, 2, 3, 4], [4, 3, 2, 1]])) # 直接赋值
print(X.sum()) # 对张量 X 的所有元素求和
```

实机运行时，和参考书给出的不同的是，在每个需要观察输出的时候都套一层 `print()`，否则不能观测到输出信息。

有的数字输出时后面有一个 `.`, 这代表该数字类型是浮点数. 如: 

```
tensor([[[0., 0., 0., 0.],
         [0., 0., 0., 0.],
         [0., 0., 0., 0.]],

        [[0., 0., 0., 0.],
         [0., 0., 0., 0.],
         [0., 0., 0., 0.]]])
```

### 标量运算的推广

对于标量就有的运算，在张量中也可以推广。对于一元运算符，如 `torch.exp()`，可以令张量中每个元素都进行 exp 运算。对于二元运算符，如果两个张量形状相同，可以令两个张量中位置相同的元素执行运算。

```py
import torch
x = torch.tensor([1.0, 2, 4, 8])
y = torch.tensor([2, 2, 2, 2])
print(x + y)
print(x - y)
print(x * y)
print(x / y)
print(x ** y)
print(x == y) # 新张量元素是 bool 型, 取值为对应位置上 x 的元素和 y 的元素是否相等
print(torch.exp(x)) # 每个元素取 exp
```

### 连结

```py
print(torch.cat((X, Y), dim=0)) # 按 0 轴连结
print(torch.cat((X, Y), dim=1)) # 按 1 轴连结
```

假如这里 `X`, `Y` 都是 `[3,4]` 的，那么按 `0` 轴连结后，结果张量的 `0` 轴便是 `3+3=6`，其中 `0-2` 三行的内容是 `X` 的，`3-5` 三行的内容是 `Y` 的。

### 广播机制


```py
import torch
x = torch.tensor([[0, 1, 2, 3]])
y = torch.tensor([[0], [100], [200], [300]])
print(x + y)
```

`[1,4]` 的矩阵和 `[4, 1]` 的矩阵可以相加。

```
tensor([[  0,   1,   2,   3],
        [100, 101, 102, 103],
        [200, 201, 202, 203],
        [300, 301, 302, 303]])
```

但是：

```py
import torch
x = torch.tensor([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]])
y = torch.tensor([[0, 100, 200], [300, 400, 500], [600, 700, 800], [900, 1000, 1100]])
print(x + y)
```

`[3,4]` 的矩阵和 `[4, 3]` 的矩阵无法相加。

```
RuntimeError: The size of tensor a (4) must match the size of tensor b (3) at non-singleton dimension 1
```

广播机制一般在长度为 `1` 的维度上进行复制。

### 索引和切片

```py
print(X.shape) # X 是 tensor[3,4]
print(X[-1]) # X 的最后一行
print(X[1:3]) # X 的行号在左闭右开区间 [1,3) 的行, 即第二第三行
X[1, 2] = 9 # 类似于二维数组语法 X[1][2] = 9
X[0:2, :] = 12 # 前两行都赋值为 12
```

和 python 语法类似：
- 用负数表示倒着数的索引
- 用 `:` 表示左闭右开区间
- 下标从 `0` 开始

### 地址相关

有时候我们需要强制张量的地址不变，用缺省的 `:` 切片可以选中整个张量，且赋值是原址的。（类似于 cpp 的引用）也可以用赋值运算语句来保证地址不变，如 `+=`。

```py
print(Y), print(X)
print('id(Y):', id(Y))
before = id(Y)
Y = Y + X # 可能变址
print('id(Y):', id(Y))
Z = torch.zeros_like(Y) # 形状和 Y 一样的全 0 张量
print('id(Z):', id(Z))
Z[:] = X + Y # 原址操作
print('id(Z):', id(Z))
Y[:] = X + Y # 原址操作
print('id(Y):', id(Y))
before = id(X)
X += Y # 原址操作
print(id(X) == before)
```

### 类型转换

tensor 和 numpy 的张量可以互相转化。

```py
A = X.numpy()
B = torch.tensor(A)
print(type(A)) # numpy.ndarray
print(type(B)) # torch.tensor
```

单个元素的 tensor 转换为默认标量。

```py
a = torch.tensor([3.5])
print(type(a)) # tensor
print(type(a.item())) # 标量(浮点数)
print(type(float(a))) # 标量(浮点数)
print(type(int(a))) # 标量(整数)
```

```
<class 'torch.Tensor'>
<class 'float'>
<class 'float'>
<class 'int'>
```

## 预处理

```py
import pandas as pd

data = pd.read_csv("house_tiny.csv")
print(data)
print(type(data))
```

用 `pandas` 将数据从 csv 读入到对象 `data` 中。

`data` 的 type 为:

```
pandas.core.frame.DataFrame
```

切片为输入和输出，填充缺失值，处理离散的分类信息。

```py
inputs, outputs = data.iloc[:, 0:2], data.iloc[:, 2]
inputs = inputs.fillna(inputs.mean()) # 用同一列的均值填充缺失值
inputs = pd.get_dummies(inputs, dummy_na=True) # 用两个布尔列代替原来的分类列
print(inputs)
```

最后转换为张量。

```py
import torch

X = torch.tensor(inputs.to_numpy(dtype=float)) # 转换为张量
y = torch.tensor(outputs.to_numpy(dtype=float))
print(X, y)
```

## 线性代数

```py
A = torch.arange(20, dtype=torch.float32).reshape(5, 4) # 规定元素为浮点数, 否则若元素是整数则无法调用 mean() 计算均值, 但是 sum / numel 仍可用
print(len(A)) # 5
print(A.T) # 转置
```

向量或轴的维度被用来表示向量或轴的长度，即向量或轴的元素数量。

可以用 `T` 转置一个矩阵。

```py
a = 2
X = torch.arange(24).reshape(2, 3, 4)
print(a + X), print(a * X)
```

张量和标量的线性运算结果是对于张量的每个元素都执行同样的运算。

```py
print(A.sum(axis=0))
print(A.sum(axis=1))
print(A.mean() == (A.sum() / A.numel())) # 两种表达等价
print(A.sum(axis=1, keepdims=True))
print(A.cumsum(axis=0)) # 沿轴 0 前缀和
```

`sum` 和 `mean` 都可以规定沿哪个轴进行运算，沿哪个轴运算，就会将这个轴降维。当所有轴都被选中时，就是对所有轴进行运算，效果和不带参数一样。 

可以通过规定 `keepdims` 强制维数不变，被选中降维的轴的长度会变成 `1` 而不是消失。



## 微积分

## 概率论

