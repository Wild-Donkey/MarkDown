> [动手学深度学习](https://zh-v2.d2l.ai/)

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

### 范数

范数是从向量到标量的映射, 是衡量向量大小的标量. 需满足四个条件:

- 线性缩放

$$
f(\alpha \bold x) = |\alpha| f (\bold x)
$$

- 三角形不等式

$$
f(\bold x + \bold y) \leq f(\bold x) + f(\bold y)
$$

- 非负

$$
f(\bold x) \geq 0
$$

- 最小元

$$
f(\bold x) = 0 \Leftrightarrow \forall i, x_i = 0
$$

常见的范数有: 欧几里得距离 $L_2$, 曼哈顿距离 $L_1$, Frobenius 范数. 其中 Frobenius 范数是矩阵形向量的 $L_2$ 范数.

```py
u = torch.tensor([3.0, -4.0])
print(torch.norm(u)) # L2
print(torch.abs(u).sum()) # L1
print(torch.norm(torch.ones((4, 9)))) # Frobenuis
```

## 微积分

## 概率论

# 线性神经网络

## 线性回归

即假设输出是输入的线性组合（或者说，仿射变换），需要学习合适的系数集合使得预测值能尽可能确切地接近真实值。

$$
\hat y = b + \sum w_ix_i\\
\hat y = b + \bold{w^t x}
\bold{\hat y} = b + \bold{Xw}
$$

可以用向量点乘和矩阵乘法简化式子，从而借助向量加速优化程序性能。

我们用类似最小二乘的损失函数来评价结果的优劣，这是为了减小细微的偏差带来的损失。

$$
l^{(i)}(\bold{w},b) = \frac 12 (\hat y_i - y_i)^2\\
L(\bold{w},b) = \frac 1n \sum l^{(i)}(\bold{w},b) = \frac 1{2n} \sum  (\bold{w^t x}^{(i)} + b - y_i)^2
$$

线性回归的解析解是简单的，只需要对每个参数求偏导，然后令所有偏导同时等于零，便取到了极小值。

$$
\bold w^* = \bold {(X^TX)^{-1}X^Ty}
$$

### 梯度下降

更普遍的算法是, 我们对每个参数进行微调, 然后计算损失函数的变化量. 这样可以估计在当前点上损失函数关于每个参数的偏导, 也就得到当前点损失函数在参数空间的梯度. 沿令损失函数减小的方向调整参数向量.

$$
(\bold w, b) \leftarrow (\bold w, b) - \frac {\eta}{|\mathcal B|} \sum \partial_{(\bold w,b)}\bold l^{(i)}(\bold w,b)
$$

其中 $\eta$ 是一个用来控制调整幅度的常数. 梯度下降可以帮我们找到损失函数在参数空间的一个极小值, 但是面对的问题不是线性回归时, 极小值往往不止一个. 但是也不见得需要令损失函数最小, 因为损失函数的评价是仅仅基于给定训练集的, 而我们更关心的是模型在训练集外的表现, 也即**泛化**.

## 线性回归的实现

仅仅是一个简单的梯度下降, 三个参数.

```py
import random
import torch
from d2l import torch as d2l
def synthetic_data(w, b, num_examples):  #@save
  """生成y=Xw+b+噪声"""
  X = torch.normal(0, 1, (num_examples, len(w))) # 1000 * 2 的矩阵
  y = torch.matmul(X, w) + b # 长度为 1000 的向量
  y += torch.normal(0, 0.01, y.shape) # epsilon
  return X, y.reshape((-1, 1))

true_w = torch.tensor([3., -2.])
true_b = 114
features, labels = synthetic_data(true_w, true_b, 1000)

print('features:', features[0],'\nlabel:', labels[0])

def data_iter(batch_size, features, labels):
  num_examples = len(features)
  indices = list(range(num_examples))
  # 这些样本是随机读取的，没有特定的顺序
  random.shuffle(indices) # indices 乱序下标数组
  for i in range(0, num_examples, batch_size):
    batch_indices = torch.tensor(
      indices[i: min(i + batch_size, num_examples)])
    yield features[batch_indices], labels[batch_indices] # yeild 将函数变成一个生成器, 分批次返回数据集

batch_size = 10

w = torch.normal(0, 0.01, size=(2,1), requires_grad=True)
b = torch.zeros(1, requires_grad=True)

def linreg(X, w, b):
  """线性回归模型"""
  return torch.matmul(X, w) + b

def squared_loss(y_hat, y):
  return (y_hat - y.reshape(y_hat.shape)) ** 2 / 2

def sgd(params, lr, batch_size):
  """小批量随机梯度下降"""
  with torch.no_grad():
    for param in params:
      param -= lr * param.grad / batch_size
      param.grad.zero_()

lr = 0.03 # 学习率
num_epochs = 10 # 轮数
net = linreg
loss = squared_loss

for epoch in range(num_epochs):
  for X, y in data_iter(batch_size, features, labels): # 每次取一批数据
    lr = (num_epochs - epoch) / num_epochs * 0.03
    l = loss(net(X, w, b), y)  # X和y的小批量损失
    l.sum().backward() # 反向传播计算损失函数总和关于各个参数的偏导
    sgd([w, b], lr, batch_size)  # 使用参数的梯度更新参数
  with torch.no_grad():
    train_l = loss(net(features, w, b), labels)
    print(f'epoch {epoch + 1}, loss {float(train_l.mean()):f}')
    print(f'w {w}, b {b}')

# 太准了, 简直是魔法
```

## Softmax

对于分类问题，我们希望输出向量 $y$ 的每一个分量是对应类别的条件概率. 条件概率的性质要求 $y$ 的分量和应当为 $1$, 并且所有概率都非负. 但是线性回归的结果 $o$ 是不一定满足这两个性质的, 所以我们希望进行一些映射, 使得保留概率大小的相对关系的前提下, 新的输出向量满足这个性质。

对于非负, 我们可以对原有的数值取 exp, 将实数映射到正数. 然后进行标准化, 将每个数值除以所有分量的总和.

$$
\hat y_j = \frac{ \exp o_j}{\sum_k{\exp o_k}}
$$

对向量的 softmax 运算用 python 的实现：

```py
def softmax(X): # x 是 (batch_size, 10) 的矩阵
  X_exp = torch.exp(X)
  partition = X_exp.sum(1, keepdim=True) # partition size 为 (batch_size, 1) 的矩阵
  return X_exp / partition  # 这里应用了广播机制, 每一行除以同样的分量
```

评估 $\hat y$ 的预测效果, 我们希望 $y_j = 1$ 的位置, $\hat y_j$ 尽可能大, 也就是负对数尽可能小, 其损失函数为:

$$
\sum_j -y_j \log \hat y_j\\
$$

为了计算这个值, 我们没必要对 $y$ 的值为 $0$ 的部分做乘法并相加, 这部分对结果没有影响. 单独将 $y_j = 1$ 的元素拿出来计算 $-y_j \log \hat y_j = -\log \hat y_j$ 即可.

所以实现上, `y` 仅保留每个样本的正确标签的标号, 而 `y_hat` 则仍然完整保存对于每个结果的条件概率预测.

```py
def cross_entropy(y_hat, y):
  return - torch.log(y_hat[range(len(y_hat)), y]) # 把每一行的 y 指出的元素拿出来做对数运算
```

整理损失函数的表达式：

$$
\sum_j -y_j \log \hat y_j\\
= - \sum_j y_j \log \frac{ \exp o_j}{\sum_k{\exp o_k}}\\
= \sum_j y_j (\log \sum_k{\exp o_k} - o_j)\\
= \log \sum_k{\exp o_k} -\sum_j y_j o_j\\
$$

对这个损失函数求偏导，可以得到：

$$
\partial_{o_j}(\log \sum_k{\exp o_k} -\sum_j y_j o_j)\\
= \frac {\exp o_j}{\sum_k{\exp o_k}} - y_j\\
= \hat y_j - y_j
$$

# 多层感知机

对于一般的线性模型, 无论加多少层线性的隐藏层，本质都是对上一层的向量进行矩阵乘法。根据矩阵乘法的结合律，这些层的计算都可以被简化为一个矩阵，也就可以被等价为没有隐藏层的线性网络，这显然是徒增计算量的。

那么，如何尝试拟合更加复杂的关系呢？在每一层定义一个非线性的激活函数，使得一个节点的输出是线性输入结果的非线性函数值，而这种模型是不能被化归为单层线性网络的。

## 通用近似

利用一层隐藏层和特定的激活函数，理论上是可以通用地实现任意函数的映射的。但是通过增加隐藏层可以更容易地拟合函数关系，所以多层感知机仍然是有意义的。

## 激活函数

- ReLU

ReLU (Rectified linear unit) 是最简单常用的激活函数。

$$
\text{ReLU}(x) = \max(0, x)
$$

存在一些变体，比如加一项线性项的 pReLU。

$$
\text{pReLU}(x) = \max(0, x) + \alpha \min (0, x)
$$

- sigmoid

最早的，基于生物神经元的激活函数建模。

$$
\text{sigmoid} = \frac {1}{1 + e^{-x}}
$$

将 $R$ 上的定义域压缩到 $(0, 1)$ 的区间中. 在原点的邻域近似于线性.

对 $x$ 求导的结果是：

$$
\frac {e^{-x}}{(1 + e^{-x})^2}
$$

- tanh

$$
\tanh (x) = \frac {1 - e^{-2x}}{1 + e^{-2x}}
$$

类似于 sigmoid，值域为 $(-1,1)$. 导数为:

$$
1 - \tanh ^2 (x)
$$

## 过拟合和欠拟合

- 训练误差：训练集上的误差

- 泛化误差：测试集上的误差

模型的目的：拟合由特征向标签映射的模式。模式可能复杂也可能简单，需要有目的地选择模型和调整超参数。

### 过拟合

训练误差 << 泛化误差

模型过于复杂, 训练集过于小

### 欠拟合

训练误差和泛化误差都很大

模型过于简单, 训练轮数不够

### 模型复杂性

参数数量显然决定了模型复杂性，参数的取值范围也影响模型复杂性.

## 正则化

在机器学习中，正则化用来描述避免或减轻过拟合现象的做法。

### 权重衰减

缩小参数取值范围，降低模型复杂程度从而抑制过拟合。

定义正则化损失函数:

$$
J = L + \frac \lambda 2 ||\bold w||^2
$$

这样可以对绝对值大的参数施加更大的惩罚, 从而控制参数取值范围大小。

### 暂退法

作为从特征向标签的映射，模型可以被认为是一个函数，而一个尽可能平滑的函数被认为是好的。

为了使训练出的模型尽可能的平滑，我们在训练时加入一些随机的噪声作为扰动，期望得到更加平滑的模型。

具体做法是：随机取消某些节点，进行一轮梯度下降后还原取消的节点，然后继续训练。

每个节点取消的概率设为 $p$, 那么一个节点的激活值就有两种可能：

$$
\phi(h' = 0) 概率 = p\\
\phi(h' = \frac {h}{1 - p}) 概率 = 1 - p
$$

暂退法的另一个作用是打破隐藏层的对称性. 对于一层全连接的隐藏层的节点，如果初始化的权值相同，那么它们彼此之间应当是本质相同的，这也就是对称性。无论如何进行梯度下降，这一层每一个节点输入的权值应当被更新为相同的值。

暂退法可以对这种局面进行扰动来打破这个对称性。

## Xavier 初始化

初始化模型的权重参数的时候，需要打破对称性，加快收敛，避免过拟合，一般采用随机化的方式对参数初始化。为了防止输出的大小过大或过小，导致梯度爆炸或梯度消失，我们需要规定随机生成初始化参数的大小。

假设没有非线性激活函数存在，对于一个线性网络，一套好的初始值分布需要使得每层激活值的方差不变，并且梯度的方差也不变。

一个经验公式是，一个线性全连接层的权值采用均匀分布的值域应当为：

$$
(-\sqrt{\frac 6{n_{in} + n_{out}}},\sqrt{\frac 6{n_{in} + n_{out}}})
$$

这个经验公式在有激活函数的非线性网络中的效果仍然优秀。

## 分布偏移和修正

### 协变量偏移

即特征在训练集和验证集的分布不同。

假设训练集的特征分布为 $q(x)$, 验证集的分布为 $p(x)$. 目标是令损失函数在验证集的期望最小:

$$
\iint l(x, y) p(xy) dxdy\\
= \iint l(x, y) p(y | x) p(x) dxdy\\
= \iint l(x, y) q(y | x) q(x) \frac {p(x)}{q(x)} dxdy\\
$$

在不考虑修正的时候，模型会倾向于令下面的式子最小化:

$$
\iint l(x, y) q(y | x) q(x) dxdy\\
= \iint l(x, y) p(y | x) p(x) \frac {q(x)}{p(x)} dxdy
$$

定义每个特征的修正权重为 $\beta_i = \dfrac {p(x)}{q(x)}$, 则修正后需要最小化的值就是：

$$
\sum l(x_i, y_i) q(y_i | x_i) q(x_i) \frac {p(x_i)}{q(x_i)}\\
= \sum  \beta_i l(x_i, y_i) p(y_i | x_i) q(x_i)\\
$$

为了计算 $\beta$, 可以从训练集和验证集抽取同样数量的特征, 然后计算每个特征出现的条件概率(令 $1$ 表示验证集, 令 $-1$ 表示训练集)：

$$
P(z = 1|x) = \frac{p(x)}{p(x) + q(x)}\\
P(z = -1|x) = \frac{q(x)}{p(x) + q(x)}\\
\frac{P(z = 1|x)}{P(z = -1|x)} = \frac {p(x)}{q(x)} = \beta
$$

然后利用修正的损失函数进行训练即可。

### 标签偏移

即标签在训练集和验证集的分布不同。

需要最小化的式子和前面的修正类似。但是实现上，由于验证集标签是未知的，所以没法直接求出修正权重 $\beta$.

这里一个妥协的做法是先用已有的模型预测验证集，用验证集标签的估计值作为计算 $\beta$ 的依据.

### 概念偏移

是标签的定义会发生缓慢的改变。

修正这种偏移一般只能依赖在线的算法，逐步更新模型，而不是隔一段时间重新训练。

# 深度学习计算

`Sequential` 可以串联多个层，构成一个网络，然后封装成一个块。块又能通过 `Sequential` 串联起来, 成为更大的网络.

在 `Sequential` 中, 相同的层可以出现大于一次:

```py
shared = nn.Linear(8, 8)
net = nn.Sequential(nn.Linear(4, 8), nn.ReLU(),
                    shared, nn.ReLU(),
                    shared, nn.ReLU(),
                    nn.Linear(8, 1))
```

可以认为是这两个线性全连接层共享了一套参数, 计算梯度的时候会以两个位置分别计算, 并且累加.

可以将张量保存在文件里, 事后读取.

```py
x = torch.arange(4)
torch.save(x, 'x-file')
x2 = torch.load('x-file')
```

测试当前环境是否可以用cuda:

```py
print(torch.version.cuda) 
print(torch.cuda.is_available()) 
print(torch.cuda.device_count())
```

在 cuda 上进行计算:

```py
X = torch.ones(2, 3, device=torch.device('cuda')) # 在 gpu0 上定义一个张量
Y = torch.ones(3, 2) # cpu 上定义另一个张量
# Z = torch.mm(X, Y) # 禁止在不同设备上进行操作
Z = torch.mm(X, Y.cuda(0))
print(Z)
```

输出:

```
tensor([[3., 3.],
        [3., 3.]], device='cuda:0')
```
