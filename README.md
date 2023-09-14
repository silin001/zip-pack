# 说明
zip-pack 将指定文件夹打包为.zip包

# 安装
`npm install zip-pack -D`

# 说使用
// vite.config.ts

```javascript
import zipPack  from "zip-pack";

export default defineConfig({
    plugins: [
        zipPack()
    ]
});
```