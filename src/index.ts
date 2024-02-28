/*
 * @Date: 2024-01-29 16:06:39
 * @LastEditTime: 2024-02-28 13:18:29
 * @Description: 入口文件，向外界导出最终需要使用的方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\index.ts
 */


// import { test, testFun, deepClone } from "./test";

// 导出vite、webpack插件
import { vitePluginZipPack, WebpackPluginZipPack } from "./plugin-zip-pack";
export {
  vitePluginZipPack,
  WebpackPluginZipPack
};


// 上面可简写如下：
export * from "./test";
// export * from "./plugin-zip-pack";

