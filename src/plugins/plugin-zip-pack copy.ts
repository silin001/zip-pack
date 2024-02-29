/*
 * @Date: 2024-02-23 16:20:49
 * @LastEditTime: 2024-02-29 11:20:19
 * @Description: plugin-zip-pack 插件入口文件
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\plugins\plugin-zip-pack copy.ts
 */
import { DirToZipFunType, VitePluginZipPackType } from "../type/index";

import {
  sucess,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists,
  dirToZipHandle,
} from "../utils/index";

import { name, version } from '../../zip-pack-npm/package.json'


/** 支持vite打包指定文件夹为.zip包的插件函数 */
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

/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
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

