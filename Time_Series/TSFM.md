# TSFM for anomaly

## LLM for Time Series

Leverage/repurpose LLM for time series analysis

E.g.: Time-LLM, LLMTime, AutoTimes, OFA, UniST, .

### Reprogram

only fine-tune

Reprogramming ≈ Adaptation + Alignment

- Adaptation: makes LLMs to understand how to process the input time series
- Alignment: further eliminates domain boundary to facilitate knowledge acquiring

### Architecture

Input: (patched reprogramed time series data) + (prompt processed by embedding LLM)

Prompt: Donmain/Instruction/Statistic

Body LLM process and output forecast by Output Projection.

### FPT

adapts GPT-2 for time series

preserves self-attention and feedforward layers,

redisign & retrain input layer

### Chronos

adapts probabilistic models for tokenized time series 

continuous values of time series into a fixed vocabulary (tokens)

## Foundation Models

Training from scratch based on time series data

robust, generalized models for some aspects like NLP, CV, and TS.

LLM adaptation to TS: embedding-visible & textual-visible.

E.g.: Time-MoE, Moirai, TimesFM, Chronos, Moment,…

### Scaling Laws

An empirical scaling law that describes how neural network performance changes as key factors (number of parameters, training dataset size, training cost) are scaled up or down.

### TimeGPT

encoder-decoder transformer

detection and forecasting

### Time MOE

Mixture of Experts

decoder-only transformer

Time series converse to token by FFN, and output token converse to time series by FFN. (FFN, neural network with 1 hidden layer)

### MOIRAI

Mixture of Experts

decoder-only transformer

## XGBoost

statistical method

## Autoencoder

encoder-decoder deep-learning model

## Anomaly

Anomaly: Detect & Predict

Anomaly rare, TS data hard to obtain and lableing.

TSFM (Time Series Foundational Models)

Black-Box nature: lack of interpretability and applicability.

for Anomaly Dec/Pred :  traditional statistical/deep learning >= TSFM
