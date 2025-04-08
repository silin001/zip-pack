/*
 * @Date: 2024-02-23 16:20:49
 * @LastEditTime: 2025-04-08
 * @Description: plugin-zip-pack 插件实现
 * @FilePath: plugin-zip-pack.ts
 */

// TODO 判断当前环境是 Vite 还是 Webpack
/**  插件入口函数  */
// export const pluginZipPack = () => {
//   // 判断当前环境是 Vite 还是 Webpack
//   if (isVite()) {
//     return pluginZipPackVite;
//   } else if (isWebpack()) {
//     return PluginZipPackWebpack;
//   } else {
//     throw new Error("Unsupported build tool environment[不支持的生成工具环境]");
//   }
// };


//  require引入时， 在项目.js配置文件中使用打包报错  Error: Cannot find module 'jszip'
import jszip from "jszip";
const JSZip = new jszip();

import { DirToZipFunType, VitePluginZipPackType } from "../type/index";
import { getNowDate, xtsMsgPushWeChat, zipPackLogs } from "../utils/index";
import { fs, sucess, error, deleteFile,getTargetDir, setOutputDir, isPathExists, addFilesToZip,} from "../utils/index";
import { name, version } from "../../zip-pack-npm/package.json";
const pluginNameVersion = { name, version };

const logStr =  'plugin-zip-pack----->'
console.log(logStr, version)
/** 支持vite打包指定文件夹为.zip包的插件函数 */
const pluginZipPackVite = (
  options: DirToZipFunType
): VitePluginZipPackType => {
  return {
    name: "vite-plugin-zip-pack",
    apply: "build",
    closeBundle() {
      // vite打包结束时的钩子
      console.log(sucess(logStr + "Vite build completed!"));
      dirToZipFun(options);
    },
  };
};

/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
class PluginZipPackWebpack {
  private options: DirToZipFunType;
  constructor(options: DirToZipFunType) {
    this.options = options;
  }
  apply(compiler) {
    // 判断是否是生产环境
    if (compiler.options.mode === "production") {
      compiler.hooks.done.tap("WebpackPluginZipPack", () => {
        console.log(sucess(logStr+"Webpack build completed!"));
        dirToZipFun(this.options);
      });
    }
  }
}


/** 支持 rollup 打包指定文件夹为.zip包的插件函数 */
const pluginZipPackRollup = (
  options: DirToZipFunType
) => {
  return {
    name: "rollup-plugin-zip-pack",
    generateBundle(options2, bundle) {
      console.log(sucess(logStr + "Rollup build finished!"));
      dirToZipFun(options);
    },
  };
};


/**
 * @description: 将文件夹打包为.zip
 * 在这里对参数设置一些默认值
 * @return {*}
 */
function dirToZipFun({
  enable = true,
  isPushVx = false,
  xtsToken = "",
  optZipName = "dist",
  targetDir = "dist",
  isPackagingTime = true
}: DirToZipFunType) {
  if (!enable) {
    console.log(sucess(zipPackLogs(pluginNameVersion, 2)));
    return;
  }
  if (!isPathExists(getTargetDir(targetDir))) {
    console.log(
      sucess(getTargetDir(targetDir), "目标路径不存在，请传入存在的指定目录！")
    );
    return;
  }
  const params = {
    optZipName,
    targetDir,
    isPushVx,
    xtsToken,
    isPackagingTime,
  };
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName, isPackagingTime);
  if (isPathExists(outputFilePath)) {
    console.log(sucess("先删除已存在的.zip文件-->", outputFilePath));
    deleteFile(outputFilePath);
    setTimeout(() => {
      dirToZipHandle(params);
    }, 800);
  } else {
    dirToZipHandle(params);
  }
}



/**
 * @description: 将指定文件夹打包为.zip
 * @param {*} optZipName 打包后文件夹名称 xxx
 * @param {*} targetDir 需要打包的文件夹 dist
 * @return {*}
 */
// function dirToZipHandle(optZipName: string, targetDir: string, isPushVx?: boolean) {
function dirToZipHandle({
  optZipName,
  targetDir,
  isPushVx,
  xtsToken,
  isPackagingTime
}: DirToZipFunType) {
  // 获取要打包的目录路径
  const targetPath = getTargetDir(targetDir as string);
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName, isPackagingTime as boolean); // 使用断言告诉ts isPackagingTime确定不会是 undefined 而是 boolean值
  // 打包zip
  addFilesToZip(JSZip, targetPath);
  // 生成zip压缩包内容的Buffer值，专门为Node.js使用
  JSZip.generateAsync({ type: "nodebuffer" })
    .then((content) => {
      // 将压缩后的内容写入文件
      fs.writeFileSync(outputFilePath, content);
      const logInfo = {
        projectName: optZipName, // 打包文件名称（项目名称）
        ...pluginNameVersion,
        targetDir,
        outputFilePath,
        doneTime: getNowDate().distDate,
      };
      // node终端打印
      console.log(sucess(zipPackLogs(logInfo)));
      // 开启 微信消息推送提醒
      if (isPushVx && xtsToken) {
        xtsMsgPushWeChat(zipPackLogs(logInfo, 3), xtsToken);
      }
    })
    .catch((err) => {
      console.error(error("Compression failed:", err));
    });
}


// 最终导出支持 vite、webpack的2个主函数
export { pluginZipPackVite, PluginZipPackWebpack, pluginZipPackRollup };



