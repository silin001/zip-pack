/*
 * @Date: 2024-01-29 16:06:39
 * @LastEditTime: 2024-04-11 12:36:09
 * @Description: 入口文件，向外界导出最终需要使用的方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\index.ts
 */


export * from "./plugins/test";
// 导出vite、webpack插件
// import { vitePluginZipPack, WebpackPluginZipPack } from "./plugin-zip-pack";
// export {
//   vitePluginZipPack,
//   WebpackPluginZipPack
// };

// 上面可简写如下：
export * from "./plugins/plugin-zip-pack";

