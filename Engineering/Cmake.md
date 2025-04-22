# CMake

`CMakeList.txt` is all you need...

```cmake
cmake_minimum_required(VERSION 3.10)
project(cudaRandomForest LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(SOURCES
    bagging.cpp
    dataReader.cpp
    decisiontreeClassifier.cpp
    metrics.cpp
    # metrics.cu
    # normalization.cpp
    randomForestClassifier.cpp
)

set(HEADERS
    bagging.hpp
    dataReader.hpp
    decisiontreeClassifier.hpp
    # metrics.cuh
    metrics.hpp
    randomForestClassifier.hpp
)

add_executable(cudaRandomForest ${SOURCES} ${HEADERS})
```

*cmake* will generate some files and directories which are different in diverse environment. So we want git to ignore them. So introduce a new subdirectory `/build/` to contain these files and the executable file compiled. After that, just add a single line `build/`  in our `.gitignore` file to ignore it.

`ProjectDirectory/` contains `.cpp`s and `.hpp`s. Put the `CMakeLists.txt` in `ProjectDirectory/` and create a subdirectory `/build/`, in `/build/` use:

```sh
cmake ..
```

To create makefile in directory `/build/` and then run:

```sh
cmake --build ..
```

To compile. And generated file, such as `cudaRandomForest` will generated in `/build/`.

Write a script in `ProjectDirectory/` will simplifie this program:

```sh
#!/bin/bash

mkdir -p ./build
cd build

if [ ! -f "Makefile" ]; then
  cmake ..
fi

cmake --build .

cd ..

./build/cudaRandomForest
```

Then, run this bash every time when compile and run the code. It will only compile files that changed.
