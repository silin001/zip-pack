const fs = require('fs');
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

/* 获取目标路径 */
const getTargetDir = (targetDir) => resolve(zipPackRootDir, targetDir);

/* 设置.zip最终输出目录（默认项目根目录） */
const setOutputDir = (optZipName) => {
  const res = join(zipPackRootDir, `${optZipName}${getNowDate()}.zip`)
  return res
};

/* 判断文件是否存在 */
const isPathExists = (filePath) => fs.existsSync(filePath);

module.exports = {
  error,
  sucess,
  join,
  zipPackRootDir,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists
}