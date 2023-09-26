# 说明

`plugin-zip-pack` 用于项目 webpack、vite build 结束后压缩指定目录资源为.zip 包

# 安装

`cnpm install plugin-zip-pack -D`

`npm install plugin-zip-pack -D`

# 使用

- vite

```javascript
// vite.config.ts
const { vitePluginPackZip, webpackPluginPackZip } = require("plugin-zip-pack");
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
