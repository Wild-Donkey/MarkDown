# [Random Forest](https://zh.wikipedia.org/wiki/%E9%9A%8F%E6%9C%BA%E6%A3%AE%E6%9E%97)

Introducing a 1.5month Project

Optimize or implement RFOD(random forest of ?)/RFGen(random forest generating) for anomaly detect/generate

## Decision tree

Classification and Regression Trees (CART)

> classification/regression (detect/generate)

### Estimate of Positive Correctness ($E_p$)

true positives (TP) outweigh false positives (FP).

$$
E_p = TP - FP
$$

### Gini impurity($I_G(p)$)

how often a randomly chosen element of a set would be incorrectly labeled if it were labeled randomly and independently 

$J$ classes with relative frequencies $p_i, i \in \{1,2,...,J\}$.

$$
I_G(p) = \sum p_i (1 - p_i) = 1 - \sum p_i^2
$$

### Information gain($IG(T, a)$)

based on entropy:

$$
H(T) = -\sum p_i \log_2 p_i
$$

Information gain is the 

$$
IG(T, a) = H(T) - H(T | a)\\
E(IG(T, a)) = H(T) - \sum_{a \in Child} p_a H(T | a)
$$

### Variance reduction ($I_V(N)$)

When target variable is continuous (regression job), many other metrics would first require discretization.

$$
I_V(N) = \frac 1{|S|^2} \left(\sum_{i, j \in S} \frac 12 (y_i - y_j)^2 - \sum_{s\in Child} \sum_{i, j \in s} \frac 12 (y_i - y_j)^2 \right)
$$

$(y_i - y_j)^2$ can be replaced with the dissimilarity $d_{i,j}$.

### Mean square error (MSE)

The MSE is a measure of the quality of an estimator. As it is derived from the square of Euclidean distance, it is always a positive value that decreases as the error approaches zero.

For predictor:

$$
\text{MSE} = \frac 1n \sum (Y_i - \hat Y_i)^2
$$

For estimator:

$$
\text{MSE}(\hat \theta) = \text{E}_\theta (\theta - \hat \theta)^2\\
= \text{Var}(\hat \theta) + \text{Bias}(\hat \theta, \theta)^2
$$

### Measure of "goodness" ($\varphi$)

$s$ is a candidate split at node $t$.

$$
\varphi(s | t) = 2P(t_L)P(t_R) \sum |P(j|t_L) - P(j | t_R)|
$$

The measure of "goodness" will attempt to create a more balanced tree.

> Idea: Only 2 branches for a node? There can be multi-branches node if needed. (Clustering by 1 or more freatures, which each cluster leads to a branch)

## [Random Forest](https://zh.wikipedia.org/wiki/%E9%9A%8F%E6%9C%BA%E6%A3%AE%E6%9E%97)

multitude of decision trees

> [IBM-random forest](https://www.ibm.com/think/topics/random-forest)

### Bagging

Bootstrap Aggregating

Randomly, sampling with replacement. Generate $m$ new set $D_i$ from $D$.

For every tree, training data is sampled in a bag, and test data is the out-of-bag (oob) sample. 

**Random** in random forest, both data (row) and feature (column) are sampled randomly. 

Typically, for a classification problem with $p$ features, $\sqrt p$ features are used in each split.  For regression problems the inventors recommend $\frac p3$ with a minimum node size of $5$ as the default.

### Ensemble

average for regression, majority vote for classification

### ExtraTrees

- each tree is trained using the whole learning sample
- randomized splitting

A number of random cut-points are selected, the split that yields the highest score is chosen to split the node.

Default values of the number of randomly selected features are $\sqrt p$ for classification and $p$ for regression.

### Random forests for high-dimensional data

Large number of features

Focus mainly on features and trees that are informative.

- Prefiltering: Eliminate features that are mostly just noise.
- Enriched random forest (ERF): Use weighted random sampling.
- Tree-weighted random forest (TWRF): Give more weight to more accurate trees.

### Variable importance

- Permutation importance

The importance for the feature is computed by averaging the difference in out-of-bag error before and after the permutation over all trees. 

- Mean decrease in impurity feature importance

Important variables decrease a lot the impurity during splitting.

### Weighted neighborhoods

make predictions $\hat y$ for new points $x'$ by looking at the "neighborhood"

$$
\hat y = \sum W(x_i, x')y_i 
$$

For any $x'$, $\sum W(x_i, x') = 1$.

In kNN, $W(x_i, x') = \frac 1k$ if $x_i$ is one of the $k$ points closest to $x'$.

In a tree, $W(x_i, x') = \frac 1{k'}$ if $x_i$ is one of the k' points in the same leaf as x'.

## [cuML](https://github.com/rapidsai/cuml)

[Zero Code Change Acceleration to scikit-learn](https://developer.nvidia.com/blog/nvidia-cuml-brings-zero-code-change-acceleration-to-scikit-learn)

NVIDIA cuML: harness the power of CUDA on NVIDIA GPUs using familiar scikit-learn APIs and Python libraries

## Implement

> [cuML implement](https://github.com/rapidsai/cuml/tree/fdc14b38fcff98103258ef5410a53205b55b90c9/cpp/src/randomforest)

## RF_Gen

[SynMeter](https://github.com/zealscott/SynMeter)

## Plan

try cuML optimize

Cython + cuda + OpenMP (from cuML)

OpenMP for CPU parallel: 1 tree per thread

cuda for GPU parallel: calculating metrics

ddl: 04_22/29