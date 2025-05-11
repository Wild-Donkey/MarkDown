# TimeXer MoE

> Subspace clustering

TO DO: Classifing

- TimeXer

MoE

- Bases

Subspace-based gating.

## Subspace

t-SNE, UMAP

Matrix (linear transform)

Problem: Data lay in a cream. (main dim be the $h$ of the cream)

Scoring for feature-importance.



## Strange

$$
S(d) = Var(d)(1 - Similarity)
$$

Choose Top-k strange, do random forest classify.

When $k$ comes to $\frac {dim}2$, the accuracy started to close to $k = dim$.

Can't overperform $k = dim$.

## New Method

New method to choose dim.

Overperform $k = dim$ when $k > \frac{dim}4$.

## Learn a matrix

Linear transformation of dims.

## Structure

- TimeSeries Data

- Embedding (Tokenize)

- Subspace

Drop some dimensions of informations.
