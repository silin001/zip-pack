# 说明

当前目录是最终要发布到 npm官网上的包，该包是使用 rollup 工具打包后生成了 esm、cjs、umd三种格式的js压缩文件


# 文件注意

- package.json

当前包目录必须包含 package.json，该文件 dependencies中依赖后期有新增时，需要手动维护（其实就是要和根目录下的 package.json的dependencies生产依赖保持同步）

- README.md

用于npm包文档