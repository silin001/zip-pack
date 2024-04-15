/*
 * @Date: 2024-04-12 09:54:48
 * @LastEditTime: 2024-04-12 10:08:42
 * @Description: node模块操作相关方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\file.ts
 */


const fs = require("fs");
const { resolve, join } = require("path");


// const chalk = require('chalk') // TODO require 导入 chalk在.ts配置文件中打包会报错：Error[ERR_REQUIRE_ESM]: require() of ES Module
import chalk from "chalk";
const error = chalk.red;
const sucess = chalk.green;



import { getNowDate } from './tools'

/*
 获取（以当前文件路径util位置）的项目根目录路径
 __dirname 是当前文件夹路径 d:\web_si\my_webDemo\my-projectFrame\zip-pack\src\util
 需要注意：
 在node环境可以直接访问，而在浏览器中会找不到！ 需要声明
 const __dirname = resolve()
*/
const zipPackRootDir = resolve(); // xxx\zip-pack


/* 设置.zip最终输出目录（默认项目根目录）
   设置打包名称+打包时间
*/
 const setOutputDir = (optZipName: string, isPackagingTime: boolean) => {
   const res = join(
     zipPackRootDir,
     isPackagingTime
       ? `${optZipName}-${getNowDate().distDate}.zip`
       : `${optZipName}.zip`
   );
   return res;
 };

/* 获取目标路径 */
 const getTargetDir = (targetDir:string) => resolve(zipPackRootDir, targetDir);



/* 判断文件是否存在 */
 const isPathExists = (filePath:string) => fs.existsSync(filePath);


/* 删除文件 */
function deleteFile(filePath:string) {
  try {
    fs.unlinkSync(filePath);
    console.log(sucess("File deleted successfully."));
  } catch (err) {
    console.error(error("Error deleting file:", err));
  }
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


/** 使用fs模块读取指定文件、如 package.json */
function getFileByfileName(fileName = "package.json") {
  let file = {
    name: "",
    version: "",
  };
  // 使用 resolve 获取真实的json文件 path路径
  const packageJsonPath = resolve(__dirname, fileName);
  try {
    // 读取文件内容
    const packageJsonString = fs.readFileSync(packageJsonPath, "utf8");
    file = JSON.parse(packageJsonString);
  } catch (err) {
    console.error("fs无法读取文件:", file, err);
  }
  return file;
}


export {
  fs,
  error,
  sucess,
  join,
  resolve,
  zipPackRootDir,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists,
  addFilesToZip,
  getFileByfileName,
};
