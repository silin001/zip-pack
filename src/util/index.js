const fs = require('fs');
const path = require('path')

// import fs from 'fs'
// import path from 'path'
/*
 获取（以当前文件路径util位置）的项目根目录路径
 __dirname 是当前文件夹路径 d:\web_si\my_webDemo\my-projectFrame\zip-pack\src\util

*/
const zipPackRootDir = path.resolve(__dirname, '../../'); // xxx\zip-pack

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
  console.log('File deleted successfully.');
 } catch (err) {
  console.error('Error deleting file:', err);
 }
}

/* 获取目标路径 */
const getTargetDir = (targetDir) => path.resolve(zipPackRootDir, targetDir);

/* 设置.zip最终输出目录（默认项目根目录） */
const setOutputDir = (optZipName) => {
 const res = path.join(zipPackRootDir, `${optZipName}${getNowDate()}.zip`)
 return res
};

/* 判断文件是否存在 */
const isPathExists = (filePath) => fs.existsSync(filePath);

module.exports = {
 zipPackRootDir,
 deleteFile,
 getTargetDir,
 setOutputDir,
 isPathExists
}