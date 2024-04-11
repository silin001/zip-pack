/*
 * @Date: 2024-02-23 15:32:16
 * @LastEditTime: 2024-04-11 17:23:15
 * @Description: 一些公用方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\index.ts
 */

const fs = require("fs");
const { resolve, join } = require("path");

// TODO import 导入 jszip  打包时报警告： 循环引用依赖
import jszip from "jszip";
//  require引入时， 在.js中使用打包报错  Error: Cannot find module 'jszip'
// const jszip = require("jszip");
const JSZip = new jszip();

// TODO require导入 chalk在.ts配置文件中打包会报错：Error[ERR_REQUIRE_ESM]: require() of ES Module
// const chalk = require('chalk')
import chalk from "chalk";
const error = chalk.red;
const sucess = chalk.green;

import { DirToZipFunType, VitePluginZipPackType } from "../type/index";
import { zipPackLogs } from "../utils/log";
/*
 获取（以当前文件路径util位置）的项目根目录路径
 __dirname 是当前文件夹路径 d:\web_si\my_webDemo\my-projectFrame\zip-pack\src\util
 需要注意：
 在node环境可以直接访问，而在浏览器中会找不到！ 需要声明
 const __dirname = resolve()
*/
const zipPackRootDir = resolve(); // xxx\zip-pack
// xxx/zip-pack
function getNowDate() {
  const myDate = new Date();
  const year = myDate.getFullYear(); //获取当前年
  const mon = myDate.getMonth() + 1; //获取当前月
  const date = myDate.getDate(); //获取当前日
  const hours = myDate.getHours(); //获取当前小时
  const minute = myDate.getMinutes();
  let timeValue = "";
  if (hours <= 12) {
    timeValue = "上午";
  } else if (hours > 12 && hours < 18) {
    timeValue = "下午";
  } else if (hours >= 18) {
    timeValue = "晚上";
  }
  return {
    currentDate: `(${year}-${mon}-${date}日${hours}:${minute})`,
    distDate: `(${year}-${mon}-${date}-${timeValue})`,
  };
}

/* 删除文件 */
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
    console.log(sucess("File deleted successfully."));
  } catch (err) {
    console.error(error("Error deleting file:", err));
  }
}

/* 获取目标路径 */
const getTargetDir = (targetDir) => resolve(zipPackRootDir, targetDir);

/* 设置.zip最终输出目录（默认项目根目录） */
const setOutputDir = (optZipName) => {
  const res = join(
    zipPackRootDir,
    `${optZipName}-${getNowDate().distDate}.zip`
  );
  return res;
};

/* 判断文件是否存在 */
const isPathExists = (filePath) => fs.existsSync(filePath);

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

import { httpGet } from "../http/index";
import { name, version } from "../../zip-pack-npm/package.json";
console.log("🚀🚀 ~ version:", version);
const pluginNameVersion = { name, version}

/** 虾推啥服务
 *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
 *
 */
export async function xtsMsgPushWeChat(
  content,
  titleType = 1,
  token = "9O547m1wt4SsX2F19yHhVlxnH",
) {
  const api = `http://wx.xtuis.cn/${token}.send`; // 完整服务接口
  const typeObj = {
    1: "【前端项目打包-成功】结果通知！",
    2: "【前端项目打包-失败】结果通知！",
  };
  const title = typeObj[titleType];
  const fullUrl = `${api}?text=${title}&desp=${content}`; // 拼接对应get请求参数
  const res = (await httpGet(fullUrl)) as Buffer; // 结果肯定是buffer类型数据 所以用as 断言一下
  // 这里接口请求到的是 buffer类型数据，方便查看需要转换一下
  const strData = res.toString()
  console.log("消息推送接口调用结果：", strData);
}

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
      console.log(sucess(zipPackLogs(pluginNameVersion)));
      // TODO 开启 微信消息推送提醒
    })
    .catch((err) => {
      console.error(error("Compression failed:", err));
    });
}

/** 支持vite打包指定文件夹为.zip包的插件函数 */
export const pluginZipPackVite = (
  options: DirToZipFunType
): VitePluginZipPackType => {
  return {
    name: "vite-plugin-zip-pack",
    apply: "build",
    closeBundle() {
      // vite打包结束时的钩子
      console.log(sucess("Vite build completed!"));
      dirToZipFun(options);
    },
  };
};

/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
export class PluginZipPackWebpack {
  private options: DirToZipFunType;
  constructor(options: DirToZipFunType) {
    this.options = options;
  }
  apply(compiler) {
    // 判断是否是生产环境
    if (compiler.options.mode === "production") {
      compiler.hooks.done.tap("WebpackPluginZipPack", () => {
        console.log(sucess("Webpack build completed!"));
        dirToZipFun(this.options);
      });
    }
  }
}

/**
 * @description: 将文件夹打包为.zip
 * @return {*}
 */
function dirToZipFun({
  enable = true,
  optZipName = "dist",
  targetDir = "dist",
}: DirToZipFunType) {
  if (!enable) {
    console.log(sucess(zipPackLogs(pluginNameVersion,2)));
    return;
  }
  if (!isPathExists(getTargetDir(targetDir))) {
    console.log(
      sucess(getTargetDir(targetDir), "目标路径不存在，请传入存在的指定目录！")
    );
    return;
  }
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName);
  if (isPathExists(outputFilePath)) {
    console.log(sucess("先删除已存在的.zip目录-->", outputFilePath));
    deleteFile(outputFilePath);
    setTimeout(() => {
      dirToZipHandle(optZipName, targetDir);
    }, 800);
  } else {
    dirToZipHandle(optZipName, targetDir);
  }
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
