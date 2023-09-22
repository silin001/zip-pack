/*
 * @Date: 2023-09-22 15:44:59
 * @LastEditTime: 2023-09-22 15:55:29
 * @Description: 脚本发布npm包
 * @FilePath: /my-v3ts-project/Users/sisi/Desktop/myWeb/my-project/zip-pack/node-build.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
// 最终目录lib
const tarDir = __dirname + '/lib';
// 复制package
const sourceFilePath = __dirname + '/package.json'
const destinationFilePath = path.join(tarDir, path.basename(sourceFilePath));

fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
  if (err) {
    console.error('复制package文件失败:', err);
    return;
  }

  console.log('成功复制package文件到lib!');
});


exec('npm publish', { cwd: tarDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`npm包发布失败: ${error}`);
    return;
  }

  console.log(stdout);
  console.log('npm包发布完成！');
});
