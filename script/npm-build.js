/*
 * @Date: 2023-09-22 15:44:59
 * @LastEditTime: 2023-09-25 14:42:35
 * @Description: rollup打包后最终目录：build
 * 使用node脚本发布npm包
 * @FilePath: /my-v3ts-project/Users/sisi/Desktop/myWeb/my-project/zip-pack/script/npm-build.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
// 最终目录/build
const tarDir = __dirname + '/build';
// 复制package到 build
const sourceFilePath = __dirname + '/package.json'
const destinationFilePath = path.join(tarDir, path.basename(sourceFilePath));

fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
  if (err) {
    console.error('复制package文件失败:', err);
    return;
  }
  console.log('成功复制package文件到lib!');
});


/*
npm publish 首次发布

npm version patch  布丁版本号 0.0.x

npm version minor 次版本号 0.x.0

npm version major 主版本号 x.0.0
*/
const oredr = {
  1: 'npm version patch',
  2: 'npm version minor',
  3: 'npm version major',
}
exec(oredr[1], { cwd: tarDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`npm包发布失败: ${error}`);
    return;
  }
  console.log(stdout);
  console.log('npm包发布完成！');
});
