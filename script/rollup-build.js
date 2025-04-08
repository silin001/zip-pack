/*
 * @Date: 2023-09-22 15:44:59
 * @LastEditTime: 2025-04-08
 * @Description: rollup打包后最终目录：build
 * 使用node脚本发布npm包
 * @FilePath: rollup-build.js
 */


// const fs = require('fs');
// const { resolve, join } = require('path');
// const { deleteFileOrFolder, publishPackage, copyFilesFun } = require('./build-utils.js')


import fs from 'fs';
import { resolve, join, dirname } from 'path';
import { deleteFileOrFolder, publishPackage, copyFilesFun } from './build-utils.js'


import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 打包路径
const sourceFilePath = resolve(__dirname, '../build')
// 最终要发布为npm的目录  /zip-pack-npm
const tarDir = resolve(__dirname, '../zip-pack-npm')
// build 文件夹的所有文件
const fileList = ['src',  'index.umd.js', 'index.d.ts']
const sourcePathsList = getAllFile()
/* 获取所有文件 */
function getAllFile () {
  const sourcePaths = []
  fileList.forEach((i) => {
    sourcePaths.push(sourceFilePath + '/' + i)
  })
  return sourcePaths
}

// 复制指定文件夹和文件到lib目录
init(sourcePathsList, tarDir);

function init (sourcePaths, targetDir) {
  console.log('需要复制的文件路径-->', sourcePaths)
  // 先删除之前 /zip-pack-npm 下的产物（除 README、package）
  fileList.forEach((i) => {
    const str = join(targetDir, i)
    if (fs.existsSync(str)) {
      deleteFileOrFolder(str)
    }
  })
  // 再循环复制
  setTimeout(() => {
    copyFilesFun(sourcePaths, targetDir)
  }, 800);

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
// 更新版本号
publishPackage(oredr[1], tarDir)






