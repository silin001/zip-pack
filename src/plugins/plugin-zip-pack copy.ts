/*
 * @Date: 2024-02-23 16:20:49
 * @LastEditTime: 2025-04-28
 * @Description: plugin-zip-pack 插件实现
 * @FilePath: plugin-zip-pack copy.ts
 */

//  require引入时， 在项目.js配置文件中使用打包报错  Error: Cannot find module 'jszip'
import jszip from 'jszip';
const JSZip = new jszip();

import { DirToZipFunType, VitePluginOption } from '../type/index';
import {
  resolve,
  getNowDate,
  xtsMsgPushWeChat,
  zipPackLogs,
} from '../utils/index';
import {
  fs,
  sucess,
  error,
  deleteFile,
  getTargetDir,
  setOutputDir,
  isPathExists,
  addFilesToZip,
} from '../utils/index';

import { name, version } from '../../zip-pack-npm/package.json';
const pluginNameVersion = { name, version };

const logStr = 'plugin-zip-pack----->';
// console.log(logStr, version);
/** 支持vite打包指定文件夹为.zip包的插件函数 */
const pluginZipPackVite = (options: DirToZipFunType): VitePluginOption => {
  return {
    name: 'vite-plugin-zip-pack',
    apply: 'build',
    enforce: 'post', // 设置为后置插件，确保在所有插件之后执行
    // buildEnd() {
    //   console.log(2222);
    // },
    // 注入压缩插件的修改版本
    // config(config) {
    //   const originalPlugins = config.plugins || [];
    //   return {
    //     // plugins: [
    //     //   ...originalPlugins.map((p) => {
    //     //     // 找到 gzip打包插件
    //     //     if (p && p.name === 'vite:compression') {
    //     //       console.log(p);
    //     //       const originalCloseBundle = p.closeBundle?.bind(p);
    //     //       return {
    //     //         ...p,
    //     //         // closeBundle: async function () {
    //     //         //   // 执行原插件的 closeBundle
    //     //         //   await p.closeBundle();
    //     //         //   console.log('🟢 压缩已完成');
    //     //         //   // 触发完成通知
    //     //         //   compressionState.resolve();
    //     //         // },
    //     //         async closeBundle() {
    //     //           console.log('🟠 开始压缩...');
    //     //           try {
    //     //             await originalCloseBundle?.();
    //     //           } catch (err) {
    //     //             console.error('压缩失败:', err);
    //     //             throw err;
    //     //           }
    //     //           console.log('🟢 压缩完成');
    //     //           resolve();
    //     //         },
    //     //       };
    //     //     }
    //     //     return p;
    //     //   }),
    //     // ],
    //     plugins: originalPlugins.map((p) => {
    //       if (p?.name === 'vite:compression') {
    //         const original = p.closeBundle;
    //         return {
    //           ...p,
    //           async closeBundle() {
    //             await original?.();
    //             console.log('🟢 压缩完成回调');
    //             resolve(); // 标记完成
    //           },
    //         };
    //       }
    //       return p;
    //     }),
    //   };
    // },
    configResolved(config) {
      // 监听 `vite-plugin-compression` 插件的状态

      const compressionPlugin = config.plugins.find((plugin) => {
        console.log(1, plugin);
        return plugin.name === 'vite:compression';
      });

      if (compressionPlugin) {
        // 劫持 `closeBundle` 方法，注入你自己的 Promise 逻辑
        const originalCloseBundle = compressionPlugin.closeBundle;

        compressionPlugin.closeBundle = async function () {
          // 创建一个全局的 Promise，并在压缩完成时 resolve
          const compressionDonePromise = new Promise<void>((resolve) => {
            // 创建一个钩子，在压缩完成时 resolve
            this._compressionDoneResolve = resolve;
          });

          // 调用原来的 `closeBundle` 方法来完成压缩逻辑
          await originalCloseBundle.call(this);

          // 压缩完成后，触发 resolve
          if (this._compressionDoneResolve) {
            this._compressionDoneResolve();
          }
        };
      }
    },

    // vite打包结束时的钩子
    async closeBundle() {
      // console.log('等待： vite-plugin-compression 插件执行完成...');
      // await compressionState.promise; // 等待压缩完成
      // console.log(sucess(logStr + '开始对最终产物进行 zip 压缩打包...'));
      // // console.log(sucess(logStr + 'Vite build completed!'));
      // await dirToZipFun(options);
      // console.log(1, compressionState);
      // console.log(2, compressionState.promise);
      // try {
      //   await Promise.race([
      //     compressionState.promise,
      //     new Promise((_, reject) =>
      //       setTimeout(() => reject('压缩超时（20秒未完成）'), 20000)
      //     ),
      //   ]);

      //   console.log('🎯 开始ZIP打包');
      //   await dirToZipFun(options);
      // } catch (err) {
      //   console.error('❌ ZIP打包失败:', err);
      // }
      // console.log('⏳ 等待压缩...');
      // await compressionPromise;
      const compressionPlugin = this.config.plugins.find(
        (plugin) => plugin.name === 'vite:compression'
      );

      if (compressionPlugin && compressionPlugin._compressionDoneResolve) {
        // 等待压缩完成
        await new Promise<void>((resolve) => {
          compressionPlugin._compressionDoneResolve = resolve;
        });
        console.log('🎯 开始ZIP');

        // 执行你的 zip 打包逻辑
        await dirToZipFun(options); // 你的自定义打包逻辑
      }
    },

    //  async closeBundle() {
    // 使用 process.cwd() 获取当前工作目录（项目根目录）
    // const distDir = resolve(process.cwd(), 'dist');
    // console.log('🚀🚀 ~ closeBundle ~ distDir:', distDir);
    // const gzFiles = fs
    //   .readdirSync(distDir)
    //   .filter((file) => file.endsWith('.gz'));
    // if (!gzFiles.length) {
    //   // 如果没有 .gz 文件，跳过后续操作
    //   console.warn('No .gz files found in the dist directory.');
    // } else {
    //   console.log(111, sucess(logStr + 'Vite build completed!'));
    //   dirToZipFun(options);
    // }
    // 等待可能的异步操作完成
    //  await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
    //  console.log(111, sucess(logStr + 'Vite build completed!'));
    //  await dirToZipFun(options);
    //  },

    //  closeBundle: {
    //   // order: 'post', // 明确指定在最后阶段执行
    //   // order: 10,
    //   handler() {
    //     console.log(sucess(logStr + 'Vite build completed!'));
    //     dirToZipFun(options);
    //   },
    // },
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
        console.log(sucess(logStr + 'Webpack build completed!'));
        dirToZipFun(this.options);
      });
    }
  }
}

/** 支持 rollup 打包指定文件夹为.zip包的插件函数 */
const pluginZipPackRollup = (options: DirToZipFunType) => {
  return {
    name: 'rollup-plugin-zip-pack',
    generateBundle(options2, bundle) {
      console.log(sucess(logStr + 'Rollup build finished!'));
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
  xtsToken = '',
  optZipName = 'dist',
  targetDir = 'dist',
  isPackagingTime = true,
}: DirToZipFunType) {
  if (!enable) {
    console.log(sucess(zipPackLogs(pluginNameVersion, 2)));
    return;
  }
  if (!isPathExists(getTargetDir(targetDir))) {
    console.log(
      sucess(getTargetDir(targetDir), '目标路径不存在，请传入存在的指定目录！')
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
    console.log(sucess('先删除已存在的.zip文件-->', outputFilePath));
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
  isPackagingTime,
}: DirToZipFunType) {
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

// 最终导出支持 vite、webpack的2个主函数
export { pluginZipPackVite, PluginZipPackWebpack, pluginZipPackRollup };
