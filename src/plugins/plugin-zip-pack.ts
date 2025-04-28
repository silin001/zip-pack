/*
 * @Date: 2024-02-23 16:20:49
 * @LastEditTime: 2025-04-28
 * @Description: plugin-zip-pack 插件实现
 * @FilePath: plugin-zip-pack.ts
 */

//  require 引入时， 在项目.js配置文件中使用打包报错  Error: Cannot find module 'jszip'
import jszip from 'jszip';
const JSZip = new jszip();
import { name, version } from '../../zip-pack-npm/package.json';
const pluginNameVersion = { name, version };
import { DirToZipFunType, VitePluginOption } from '../type/index';
import {
  fs,
  sucess,
  error,
  timeOut,
  zipPackLogStr,
  getNowDate,
  xtsMsgPushWeChat,
  zipPackLogs,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists,
  addFilesToZip,
} from '../utils/index';
import {
  createNotifier,
  hijackPluginLifecycle,
} from '../utils/hijackPluginNotifier';



/** 支持vite打包指定文件夹为.zip包的插件函数 */
const pluginZipPackVite = (options: DirToZipFunType): VitePluginOption => {
  // 设置 interceptPluginName 默认值为 vite-plugin-compression 插件
  const { interceptPluginName = 'vite-plugin-compression' } = options;
  // 创建通知 Promise
  const notifier = createNotifier();
  // 是否拦截了插件
  let interceptPlugin: boolean | null = null;
  return {
    name: 'vite-plugin-zip-pack',
    apply: 'build',
    enforce: 'post',
    // 拦截插件
    configResolved(config) {
      if (interceptPluginName) {
        interceptPlugin = hijackPluginLifecycle(
          config.plugins,
          interceptPluginName,
          'closeBundle',
          notifier
        );
        // console.log(1, interceptPlugin);
      }
    },
    async closeBundle() {
      // console.log(2,interceptPlugin);
      if (interceptPluginName && interceptPlugin) {
        // 等待目标插件完成
        await notifier.promise;
      }
      try {
        console.log(sucess(zipPackLogStr + '开始ZIP打包!'));
        await dirToZipFun(options);
      } catch (error) {
        console.error('ZIP打包失败:', error);
      }
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
    if (compiler.options.mode === 'production') {
      compiler.hooks.done.tap('WebpackPluginZipPack', () => {
        console.log(sucess(zipPackLogStr + 'Webpack build completed!'));
        try {
          console.log(sucess(zipPackLogStr + '开始ZIP打包!'));
          dirToZipFun(this.options);
        } catch (error) {
          console.error('ZIP打包失败:', error);
        }
      });
    }
  }
}

/** 支持 rollup 打包指定文件夹为.zip包的插件函数 */
const pluginZipPackRollup = (options: DirToZipFunType) => {
  return {
    name: 'rollup-plugin-zip-pack',
    generateBundle(options2, bundle) {
      console.log(sucess(zipPackLogStr + 'Rollup build finished!'));
      try {
        console.log(sucess(zipPackLogStr + '开始ZIP打包!'));
        dirToZipFun(options);
      } catch (error) {
        console.error('ZIP打包失败:', error);
      }
    },
  };
};

/**
 * @description: 将文件夹打包为.zip
 * 在这里对参数设置一些默认值、处理路径是否存在、删除已存在的.zip文件
 * @return {*}
 */
  async function dirToZipFun({
    enable = true,
    optZipName = 'dist',
    targetDir = 'dist',
    isPackagingTime = true,
    isPushVx = false,
    xtsToken = '',
  }: DirToZipFunType) {
    const collectParams = {
      optZipName,
      targetDir,
      isPackagingTime,
      isPushVx,
      xtsToken,
    };
    if (!enable) {
      console.log(sucess(zipPackLogs(pluginNameVersion, 2)));
      return;
    }
    if (!isPathExists(getTargetDir(targetDir))) {
      console.log(
        sucess(
          getTargetDir(targetDir),
          '目标路径不存在，请传入存在的指定目录！'
        )
      );
      return;
    }

    // 设置 .zip包输出到当前项目根目录
    const outputFilePath = setOutputDir(optZipName, isPackagingTime);
    try {
      // 如果已存在zip包，先删除
      if (isPathExists(outputFilePath)) {
        // console.log(sucess('先删除已存在的.zip包-->', outputFilePath));
        await deleteFile(outputFilePath);
        // 等待删除完成
        await timeOut(800);
      }
      // 最终执行zip压缩
      await lastDirToZipHandler(collectParams);
    } catch (error) {
      console.error('执行zip压缩过程中发生错误：', error);
    }
  }

/**
 * @description: 最终将指定文件夹打包为 .zip 文件
 * @param {*} optZipName 打包后文件夹名称 xxx
 * @param {*} targetDir 需要打包的文件夹 dist
 * @return {*}
 */
function lastDirToZipHandler(opt: DirToZipFunType) {
  const { optZipName, targetDir, isPackagingTime, isPushVx, xtsToken } = opt;
  // 获取要打包的目录路径
  const targetPath = getTargetDir(targetDir as string);
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName, isPackagingTime as boolean); // 使用断言告诉ts isPackagingTime确定不会是 undefined 而是 boolean值
  // 打包zip
  addFilesToZip(JSZip, targetPath);
  // 生成zip压缩包内容的Buffer值，专门为Node.js使用
  JSZip.generateAsync({ type: 'nodebuffer' })
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
      console.error(error('Compression failed:', err));
    });
}

// 最终导出支持 vite、webpack、rollup 的主函数
export { pluginZipPackVite, pluginZipPackRollup, PluginZipPackWebpack };
