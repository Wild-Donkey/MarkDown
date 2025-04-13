# Compute Unified Device Architecture (CUDA)

General-Purpose computing on Graphics Processing Units(GPGPU)

> [Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html)
> [Practice](https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html)

## Parallel

- a hierarchy of thread groups
- shared memories
- barrier synchronization

## Architecture

host: CPU
device: GPU

A GPU is built around an array of Streaming Multiprocessors (SMs)

(x * y * z)threads per block
(X * Y * Z)blocks per grid

```cu
/*Kernel*/<<<numBlocks, threadPerBlock>>>(/*Para*/)
```

`numBlocks`, `threadPerBlock` can be `dim3` or `int`.

`__syncthreads()` acts as a barrier at which all threads in the block must wait before any is allowed to proceed.

cluster: (x', y', z')blocks per cluster.

### Warps

The multiprocessor creates, manages, schedules, and executes threads in groups of $32$ parallel threads called `warps`. 

A warp executes one common instruction at a time. If threads of a warp diverge via a data-dependent conditional branch, the warp executes each branch path taken.

## Memory

- Per thread registers and local memory
- Per block shared memory (Shared in the same cluster)
- Global memory shared between all kernels
- Host memory

### Linear memory

Device memory, is allocated in a single unified address space. 

Generally, like `malloc` and `free` in C:

- `cudaMalloc(Address, Size)`
- `cudaMemcpy(To_device_addr, Src_host_addr, Size, cudaMemcpyHostToDevice)`
- `cudaMemcpy(To_host_addr, Src_device_addr, Size, cudaMemcpyDeviceToHost)`
- `cudaFree(Address)`

For 2D arrays:

- `cudaMallocPitch(Address, &pitch, RowSize, height)`

For 3D arrays:

- `extent = make_cudaExtent(RowSize, height, depth)`
- `cudaMalloc3D(&devPitchedPtr, extent)`

## Space Specifiers

### `__global__`

Declares a function as being a kernel. Executed on the device, callable from the host and device.

### `__device__`

Declares a function that is executed on the device, callable from the device only.

Declares a variable that resides on the device global memory.

### `__shared__`

Declares a variable that resides in the shared memory space of a thread block, is only accessible from all the threads within the block.

External shared array start at the same address in memory. 

### `__managed__`

Declares a variable that can be referenced from both device and host code.

### `__host__`

Declares a function that is executed on the host, callable from the host only. (default)

## Atomic functions

Atomic: Inseparable. All or Nothing.

### scope

- System scope: `_system` suffix
- Device scope: no suffix
- Block scope: `_block` scope

The bigger scope, the lower performance, the more strict memory order.

Block scope atomic funtions maybe conflict with operations from other blocks.

