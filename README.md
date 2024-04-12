# 简介

`plugin-zip-pack` 【插件源码】，用于项目 webpack、vite build 结束后压缩指定目录资源为.zip 包

[plugin-zip-pack - npm (npmjs.com)](https://www.npmjs.com/package/plugin-zip-pack)

# npm源注意！

发布时报错：`Public registration is not allowed`

查看npm源： `npm config get registry`

设置npm源为npm镜像（必须为npm镜像才可以发布成功！）：`npm config set registry https://registry.npmjs.org/`


设置npm源为淘宝镜像： `npm config set registry https://registry.npm.taobao.org`

设置npm源为阿里云镜像： `npm config set registry https://registry.npmmirror.com`





# 打包相关

## 本地打包调试
`pnpm dev`： 本地源码测试

`pnpm dev:test`:  只用于更新本地lib目录（不发布npm包!）用于本地调试，不使用rollup打包（目前该插件实现功能简单，使用rollup打包后体积反而会比源码文件大） 而是使用 lib.js 复制 src、index源码到lib目录下


`dev:build`: 用于本地打包（不发布npm包!），包含ts类型文件，打包完成后进行本地测试

build文件夹下需要package.json文件，不需要打包时的一些依赖，只保留核心依赖即可。

## 打包方式1（不使用rollup，体积小，推荐）

ps：目前该插件实现功能简单，使用rollup打包后体积反而会比源码文件大，所以直接源码上传npm。

源码使用到了node模块、使用 commonJs 语法导出，所以此打包方式只支持 commonJs 引入使用。

- `pnpm lib`

 执行命令后先打包、更改npm源、然后发布npm； 发布前需要先登录npm、输入邮箱、输入验证码，比较麻烦。目前我这里使用了npm token + f2a 方式验证登录，每次发布时需要在手机的 `Authenticator App` 输入6位数的 otp 验证码即可。

- 发布npm官网

`"lib:publish": "cd ./lib && npm publish && cd ../ && pnpm setnpmtb",`: 该命令先 cd 指定目录
然后设置npm源为npm镜像（必须）
然后直接发布、
最后发布完成后在把npm源设置为最开始的淘宝源。

ps: lib目录中 package.json 文件如果后期有依赖更新需要手动更改。

script目录下的 lib.js 实现是使用node模块复制src、index文件到lib目录



## 打包方式2（使用rollup打包）

可配置打包出支持 esm、cjs、umd。目前直接打包出通用的 umd格式。


### 最终发布npm包打包命令：`pnpm build`

需要先切换到根目录然后执行： `pnpm build`

执行命令后执行脚本顺序：

- set:npmsource （查看当前npm源、设置npm源为npm镜像）
- rollup -c rollup.config.js （使用rollup打包，因为使用了插件所以 rollup -c时会打包出 ts的类型文件）

- pnpm build:cp （使用node 执行 ./script/rollup-build.js 脚本，复制build目录的一些产物到 zip-pack-npm目录）

- pnpm build:publish （先cd到 zip-pack-npm 然后在该目录执行 npm login 登录(此时需要查看手机的otp 6位数验证码)、 npm publish 发布、然后再cd上级目录 还原设置npm源为淘宝镜像）


如果发布失败了 记得手动将 `zip-pack-npm`目录下的package.json的版本号退回，因为在打包命令里配置了每次打包版本号+1

