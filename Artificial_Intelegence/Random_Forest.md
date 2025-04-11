# [Random Forest](https://zh.wikipedia.org/wiki/%E9%9A%8F%E6%9C%BA%E6%A3%AE%E6%9E%97)

Introducing a 1.5month Project

Optimize or implement RFOD(random forest of ?)/RFGen(random forest generating) for anomaly detect/generate

## Decision tree

Classification and Regression Trees (CART)

> classification/regression (detect/generate)

### [Gini impurity]

### [information gain]

### [mean square error]

> Idea: Only 2 branches for a node? There can be multi-branches node if needed. (Clustering by 1 or more freatures, which each cluster leads to a branch)

## [Random Forest](https://zh.wikipedia.org/wiki/%E9%9A%8F%E6%9C%BA%E6%A3%AE%E6%9E%97)

multitude of decision trees

> [IBM-random forest](https://www.ibm.com/think/topics/random-forest)

### Bagging

Bootstrap Aggregating

Randomly, sampling with replacement. Generate $m$ new set $D_i$ from $D$.

test data, known as the out-of-bag (oob) sample

**Random** in random forest, both data (row) and feature (column) are sampled randomly. 

### Ensemble

average for regression, majority vote for classification

## [cuML](https://github.com/rapidsai/cuml)

[Zero Code Change Acceleration to scikit-learn](https://developer.nvidia.com/blog/nvidia-cuml-brings-zero-code-change-acceleration-to-scikit-learn)

ddl: 04_22/29

## Implement

> [cuML implement](https://github.com/rapidsai/cuml/tree/fdc14b38fcff98103258ef5410a53205b55b90c9/cpp/src/randomforest)