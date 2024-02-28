
/*
 * @Date: 2024-02-23 15:32:16
 * @LastEditTime: 2024-02-28 13:23:03
 * @Description: 一些公用方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\index.ts
 */

import fs from 'fs'
// const fs = require('fs')
const { resolve, join } = require('path')
// TODO 打包报错 循环引用依赖
import jszip from "jszip";
const JSZip = new jszip();
// import 这样导入打包时会报警告，
// import chalk  from 'chalk'
// require 导入在.ts打包报错：Error[ERR_REQUIRE_ESM]: require() of ES Module
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



/** 使用fs模块读取指定文件、如 package.json */
function getFileByfileName (fileName = 'package.json') {
  let file = {
    name: '',
    version: ''
  }
  // 使用 resolve 获取真实的json文件 path路径
  const packageJsonPath = resolve(__dirname, fileName);
  try {
    // 读取文件内容
    const packageJsonString = fs.readFileSync(packageJsonPath, "utf8");
    file = JSON.parse(packageJsonString);
  } catch (err) {
    console.error("fs无法读取文件:", file, err);
  }
  return file
}


/** 递归添加文件和子文件夹 */
function addFilesToZip(jszip, folderPath: string) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = `${folderPath}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      const subFolder = jszip.folder(file);
      addFilesToZip(subFolder, filePath); // 递归处理子文件夹
    } else {
      const content = fs.readFileSync(filePath);
      jszip.file(file, content);
    }
  }
}



import { name, version } from "../../package.json";



/**
 * @description: 将指定文件夹打包为.zip
 * @param {*} optZipName 打包后文件夹名称 xxx
 * @param {*} targetDir 需要打包的文件夹 dist
 * @return {*}
 */
function dirToZipHandle(optZipName: string, targetDir: string) {
  // function dirToZipHandle (optZipName = "dist", targetDir = "dist") {
  // 获取要打包的目录路径
  const targetPath = getTargetDir(targetDir);
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName);
  // 打包zip
  addFilesToZip(JSZip, targetPath);
  // 生成zip压缩包内容的Buffer值，专门为Node.js使用
  JSZip.generateAsync({ type: "nodebuffer" })
    .then((content) => {
      // 将压缩后的内容写入文件
      fs.writeFileSync(outputFilePath, content);
      console.log(
        sucess(`
      <===========   zip打包成功   ======>
      ${name} 插件版本：${version}
      打包目标目录：'${targetDir}'
      打包输出路径：'${outputFilePath}'
      打包完成时间：'${getNowDate().currentDate}'
      <===========   ${name}   ======>`)
      );
    })
    .catch((err) => {
      console.error(error("Compression failed:", err));
    });
}


export {
  fs,
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
  addFilesToZip,
  getFileByfileName,
  dirToZipHandle,
};