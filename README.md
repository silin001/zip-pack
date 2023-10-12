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

## 打包方式1（体积小，推荐）

源码使用到了node模块、使用 commonJs 语法导出，所以此打包方式只支持 commonJs 引入使用。

`pnpm lib`: 会先打包、更改npm源、然后发布npm。发布前需要先登录npm、输入邮箱、输入验证码，比较麻烦。目前这里使用了npm token + f2a 方式验证登录，每次发布时需要在手机的 `Authenticator App` 输入6位数的 otp 验证码即可。

`"lib:publish": "cd ./lib && npm publish && cd ../ && pnpm setnpmtb",`: 该命令先 cd 指定目录，然后设置npm源为npm镜像（必须）、然后直接发布、最后发布完成后在把npm源设置为最开始的淘宝源。


ps: lib目录中 package.json 文件如果后期有依赖更新需要手动更改。

script下 lib.js 实现使用node模块复制src、index文件到lib目录



## 打包方式2（rollup）

可配置打包出支持 commonJs、esm、umd。

打包： `pnpm build`

发布npm： `pnpm build:publish`

ps：目前该插件实现功能简单，使用rollup打包后体积反而会比源码文件大。

