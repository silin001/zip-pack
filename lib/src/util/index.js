const fs = require('fs');
const { exec } = require('child_process');
const { resolve, join } = require('path')
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
    console.log(sucess('File deleted successfully.'));
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
    // 发布新版本的 npm 包
    // loginAndPublish(tarDir)
  });
}

function npmPublish (tarDir) {
  console.log(tarDir)
  exec(`cd ${tarDir}&& npm publish`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error publishing package: ${error}`);
      return;
    }
    console.log('npm包发布完成！');
  });
}

function loginAndPublish (tarDir) {
  // 执行 npm login 命令
  exec(`cd ${tarDir} && npm login`, (loginError, loginStdout, loginStderr) => {
    if (loginError) {
      console.error(`Error logging in to npm: ${loginError}`);
      return;
    }

    // 登录成功后执行 npm publish 命令
    exec(`cd ${tarDir} && npm publish`, (publishError, publishStdout, publishStderr) => {
      if (publishError) {
        console.error(`Error publishing package: ${publishError}`);
        return;
      }

      console.log('npm包发布完成！');
    });
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
  npmPublish
}