# 说明
zip-pack 将指定文件夹打包为.zip包

# 安装
`npm install zip-pack -D`

# 使用
// vite.config.ts

```javascript
const { dirToZipFun } = require('zip-pack')
export default defineConfig({
    plugins: [
        dirToZipFun('测试打包','src')
    ]
});
```