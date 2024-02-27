/*
 * @Date: 2024-02-23 15:32:16
 * @LastEditTime: 2024-02-27 17:24:24
 * @Description: 打包时 rollup-buld使用的方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\utils\build.js
 */
const fs = require('fs');
const { exec } = require('child_process');
const { resolve, join, basename } = require('path')

/* 删除文件夹或文件 */
function deleteFileOrFolder (fileOrFolderPath) {
  if (fs.existsSync(fileOrFolderPath)) { // 判断文件或文件夹是否存在
    if (fs.lstatSync(fileOrFolderPath).isDirectory()) { // 如果是文件夹，则递归删除子文件和子文件夹
      fs.readdirSync(fileOrFolderPath).forEach(item => {
        const itemPath = join(fileOrFolderPath, item);
        deleteFileOrFolder(itemPath);
      });
      fs.rmdirSync(fileOrFolderPath); // 删除空文件夹
      console.log(`Deleted folder: ${fileOrFolderPath}`);
    } else { // 如果是文件，则直接删除
      fs.unlinkSync(fileOrFolderPath); // 删除文件
      console.log(`Deleted file: ${fileOrFolderPath}`);
    }
  } else {
    console.log(`File or folder does not exist: ${fileOrFolderPath}`);
  }
}


/* 复制文件夹或文件 */
function copyFilesFun (sourcePaths, targetDir) {
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
        copyFilesFun(subSourcePaths, targetFolderPath); // 递归复制文件夹内的内容
        console.log(`复制 文件夹: ${folderName}`);
      }

    } else {
      console.log(`Source file or folder does not exist: ${sourceAbsolutePath}`);
    }
  });
}


/* npm版本更新、发布npm包 */
function publishPackage (newVersion, tarDir) {
  // 更新 package.json 文件中的版本号
  exec(`cd ${tarDir} && npm version ${newVersion} --no-git-tag-version`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error updating package version: ${error}`);
      return;
    }
    console.log('npm包版本更新完成！');
  });
}

module.exports = {
  deleteFileOrFolder,
  copyFilesFun,
  publishPackage
}
