
/*
 * @Date: 2024-02-23 15:32:16
 * @LastEditTime: 2024-02-27 17:27:27
 * @Description: 一些公用方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\utils\index.js
 */
const fs = require('fs');
const { resolve, join } = require('path')

// import 这样导入打包时会报警告，
import chalk  from 'chalk'
// require 导入在.ts打包报错：Error[ERR_REQUIRE_ESM]: require() of ES Module
// const chalk = require('chalk')
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
function getNowDate () {
  const myDate = new Date;
  const year = myDate.getFullYear(); //获取当前年
  const mon = myDate.getMonth() + 1; //获取当前月
  const date = myDate.getDate(); //获取当前日
  const hours = myDate.getHours(); //获取当前小时
  const minute = myDate.getMinutes();
  let timeValue = ''
  if (hours <= 12) {
    timeValue = '上午'
  } else if (hours > 12 && hours < 18) {
    timeValue = "下午";
  } else if (hours>=18) {
    timeValue = "晚上";
  }
  return {
    currentDate: `(${year}-${mon}-${date}日${hours}:${minute})`,
    distDate: `(${year}-${mon}-${date}-${timeValue})`,
  };
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
  const res = join(zipPackRootDir, `${optZipName}-${getNowDate().distDate}.zip`)
  return res
};


/* 判断文件是否存在 */
const isPathExists = (filePath) => fs.existsSync(filePath);


export {
  error,
  sucess,
  join,
  resolve,
  zipPackRootDir,
  deleteFile,
  getNowDate,
  getTargetDir,
  setOutputDir,
  isPathExists,
};