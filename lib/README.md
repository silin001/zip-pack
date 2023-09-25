# 说明

`plugin-zip-pack` 将指定文件夹打包为.zip 包

# 安装

`npm install plugin-zip-pack -D`

# 使用

```javascript
// vite.config.ts
const { pluginPackZip } = require("plugin-zip-pack");

export default defineConfig({
  plugins: [
    pluginPackZip(),
    // pluginPackZip({
    //   optZipName: '测试包'
    // }),
  ],
});
```
