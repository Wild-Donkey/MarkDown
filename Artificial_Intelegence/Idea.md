我们发现在 Transformer 中, 每个 encoder 模块中, 序列长度是一定的. 但是事实上, encoder 需要提取的上下文信息, 信息的颗粒度应该比输入的词元大. 既然不同的 encoder 不共享参数, 是否可以令后面的 encoder 的单个 token 维数增加, 数量减小.

