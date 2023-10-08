/*
 * @Date: 2023-09-25 10:56:46
 * @LastEditTime: 2023-10-08 16:44:22
 * @Description: 不使用rollup打包
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\script\lib.js
 */

const fs = require('fs');
const { resolve, join, basename } = require('path');
const { deleteFileOrFolder, publishPackage } = require('../src/util/index')
// 最终目录/build
const tarDir = resolve(__dirname, '../lib')
// 复制src、index
const sourceFilePath1 = resolve(__dirname, '../src')
const sourceFilePath2 = resolve(__dirname, '../index.js')
const sourcePaths = [sourceFilePath1, sourceFilePath2];

copyFiles(sourcePaths, tarDir);

// 复制指定文件夹和文件
function copyFiles (sourcePaths, targetDir) {
  // 先删除之前lib到src、index
  const srcFolderPath = join(targetDir, 'src');
  const indexFilePath = join(targetDir, 'index.js');
  if (fs.existsSync(srcFolderPath) && fs.existsSync(indexFilePath)) {
    deleteFileOrFolder(srcFolderPath)
    deleteFileOrFolder(indexFilePath)
  }
  // 循环复制src、index
  sourcePaths.forEach(sourcePath => {
    const sourceAbsolutePath = resolve(sourcePath); // 获取源文件的绝对路径
    const targetAbsolutePath = resolve(targetDir); // 获取目标文件夹的绝对路径
    if (fs.existsSync(sourceAbsolutePath)) { // 判断源文件或文件夹是否存在
      const stats = fs.statSync(sourceAbsolutePath);
      if (stats.isFile()) { // 如果是文件，则直接复制到目标文件夹
        const fileName = basename(sourceAbsolutePath);
        const targetPath = join(targetAbsolutePath, fileName);
        fs.copyFileSync(sourceAbsolutePath, targetPath);
        console.log(`复制 文件: ${fileName}`);
      } else if (stats.isDirectory()) { // 如果是文件夹，则递归复制文件夹内的内容
        const folderName = basename(sourceAbsolutePath);
        const targetFolderPath = join(targetAbsolutePath, folderName);
        fs.mkdirSync(targetFolderPath); // 创建目标文件夹
        const subSourcePaths = fs.readdirSync(sourceAbsolutePath).map(subPath => join(sourceAbsolutePath, subPath));
        copyFiles(subSourcePaths, targetFolderPath); // 递归复制文件夹内的内容
        console.log(`复制 文件夹: ${folderName}`);
      }

    } else {
      console.log(`Source file or folder does not exist: ${sourceAbsolutePath}`);
    }
  });
}

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



