
# 插件简介

`plugin-zip-pack` 用于项目 webpack、vite build 结束后压缩指定目录资源为.zip 包


# 安装

`cnpm install plugin-zip-pack -D`

`npm install plugin-zip-pack -D`

# 参数配置

```javascript

 {
  optZipName: '测试包', // 打包名称，默认 dist
  targetDir: '', // 需要打包的目录，必须传入存在的目录，默认 dist
  enable: true // 插件是否开启，默认true开启
 },

```


# 使用

- vite

```javascript
// vite.config.js
const { vitePluginPackZi } = require("plugin-zip-pack");
export default defineConfig({
  plugins: [
    vitePluginPackZip(),
    // vitePluginPackZip({
    //   optZipName: '测试包'
    // }),
  ],
});
```

- webpack

```javascript
// webpack.config.js
const { webpackPluginPackZip } = require("plugin-zip-pack");
export default defineConfig({
  plugins: [new webpackPluginPackZip()],
});
```
