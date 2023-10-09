/*
 * @Date: 2023-09-25 10:56:46
 * @LastEditTime: 2023-10-09 10:35:38
 * @Description: 不使用rollup打包
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\script\lib.js
 */

const fs = require('fs');
const { resolve, join } = require('path');
const { deleteFileOrFolder, publishPackage, copyFilesFun} = require('../src/util/index')
// 最终目录/build
const tarDir = resolve(__dirname, '../lib')
// 复制src、index
const sourceFilePath1 = resolve(__dirname, '../src')
const sourceFilePath2 = resolve(__dirname, '../index.js')
const sourcePaths = [sourceFilePath1, sourceFilePath2];


function init (sourcePaths, targetDir) {
  // 先删除之前lib下的 src、index
  const srcFolderPath = join(targetDir, 'src');
  const indexFilePath = join(targetDir, 'index.js');
  if (fs.existsSync(srcFolderPath) && fs.existsSync(indexFilePath)) {
    deleteFileOrFolder(srcFolderPath)
    deleteFileOrFolder(indexFilePath)
  }
  // 再循环复制src、index
  setTimeout(() => {
    copyFilesFun(sourcePaths, targetDir)
  }, 800);

}
// 复制指定文件夹和文件到lib目录
init(sourcePaths, tarDir);

/*
npm publish 发布

npm version patch  布丁版本号 0.0.x

npm version minor 次版本号 0.x.0

npm version major 主版本号 x.0.0
*/
const oredr = {
  1: 'patch',
  2: 'minor',
  3: 'major',
}
// console.log(oredr[1])
publishPackage(oredr[1], tarDir)



