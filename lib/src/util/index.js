const fs = require('fs');
const { exec } = require('child_process');
const { resolve, join, basename } = require('path')
const chalk = require('chalk')

const error = chalk.red;
const sucess = chalk.green;


/*
 获取（以当前文件路径util位置）的项目根目录路径
 __dirname 是当前文件夹路径 d:\web_si\my_webDemo\my-projectFrame\zip-pack\src\util
 需要注意：
 在node环境可以直接访问，而在浏览器中会找不到！ 需要声明
 const __dirname = resolve()
*/
const zipPackRootDir = resolve(); // xxx\zip-pack
// xxx/zip-pack
// console.log('----当前路径:', zipPackRootDir)
function getNowDate () {
  const myDate = new Date;
  const year = myDate.getFullYear(); //获取当前年
  const mon = myDate.getMonth() + 1; //获取当前月
  const date = myDate.getDate(); //获取当前日
  const hours = myDate.getHours(); //获取当前小时
  const timeValue = hours >= 12 ? "下午" : "上午"
  return `-(${year}-${mon}-${date}-${timeValue})`
}


/* 删除文件 */
function deleteFile (filePath) {
  try {
    fs.unlinkSync(filePath);
    // console.log(sucess('File deleted successfully.'));
  } catch (err) {
    console.error(error('Error deleting file:', err));
  }
}

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


/* 获取目标路径 */
const getTargetDir = (targetDir) => resolve(zipPackRootDir, targetDir);

/* 设置.zip最终输出目录（默认项目根目录） */
const setOutputDir = (optZipName) => {
  const res = join(zipPackRootDir, `${optZipName}${getNowDate()}.zip`)
  return res
};

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

/* 判断文件是否存在 */
const isPathExists = (filePath) => fs.existsSync(filePath);


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
  error,
  sucess,
  join,
  zipPackRootDir,
  deleteFile,
  deleteFileOrFolder,
  getTargetDir,
  setOutputDir,
  isPathExists,
  publishPackage,
  copyFilesFun
}