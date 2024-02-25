// import * as fs from 'fs'
// import JSZip from "jszip"
const fs = require("fs");
const JSZip = require("jszip");
const zip = new JSZip();

import {
  sucess,
  error,
  resolve,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists,
  getNowDate,
} from "../utils/index";

import { DirToZipFunType, VitePluginZipPackType } from "./type/index";

/** 支持vite打包的插件函数 */
export const vitePluginZipPack = (
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

/** 支持webpack打包的 类插件函数 */
export class WebpackPluginZipPack {
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

const { name, version } = getPackJson();
function getPackJson() {
  const pkg = {
    name: "",
    version: "",
  };
  // 使用 resolve 获取真实的json文件 path路径
  const packageJsonPath = resolve(__dirname, "package.json");
  try {
    // 读取文件内容
    const packageJsonString = fs.readFileSync(packageJsonPath, "utf8");
    const { name, version } = JSON.parse(packageJsonString);
    pkg.name = name;
    pkg.version = version;
  } catch (err) {
    console.error("无法读取npm包的 package.json 文件:", err);
  }
  console.log("pkg--", pkg);
  return pkg;
}

/**
 * @description: 将文件夹打包为.zip
 * @return {*}
 */
function dirToZipFun({
  enable,
  optZipName = "dist",
  targetDir = "dist",
}: DirToZipFunType) {
  if (!enable) {
    console.log(
      sucess(`
      <===========   插件已禁用   ======>
      ${name} 插件版本：${version}
      如需开启请在参数选项 enable 字段传入值为 true
      <=========== ${name} ======>`)
    );
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
  addFilesToZip(zip, targetPath);
  // 生成zip压缩包内容的Buffer值，专门为Node.js使用
  zip
    .generateAsync({ type: "nodebuffer" })
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

// 递归添加文件和子文件夹
function addFilesToZip(zip, folderPath: string) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = `${folderPath}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      const subFolder = zip.folder(file);
      addFilesToZip(subFolder, filePath); // 递归处理子文件夹
    } else {
      const content = fs.readFileSync(filePath);
      zip.file(file, content);
    }
  }
}
