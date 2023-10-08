# 打包相关

## 打包方式1（体积小，推荐）

源码使用到了node模块、使用 commonJs 语法导出，所以此打包方式只支持 commonJs 引入使用。

执行： `pnpm lib`  后会先打包然后发布npm

ps: lib目录中 package.json 文件如果后期有依赖更新需要手动更改。

script下 lib.js 中使用node模块复制src、index文件到lib目录



## 打包方式2（rollup）

可配置打包出支持 commonJs、esm、umd。

打包： `pnpm build`

发布npm： `pnpm build:publish`

ps：目前该插件实现功能简单，使用rollup打包后体积反而会比源码文件大。

