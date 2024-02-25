/*
 * @Date: 2024-01-29 16:06:39
 * @LastEditTime: 2024-02-22 17:18:27
 * @Description:  入口文件向外暴露需要的方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\index.js
 */
var test = "ts 版本测试111";
import { dirToZipFun } from "./src/plugin-zip-pack";
import { sucess } from "./src/util/index";
// 返回vite插件钩子，在打包结束时打包为zip
// function vitePluginZipPack(options = {}) {
function vitePluginZipPack(options) {
    return {
        name: "vite-plugin-zip-pack",
        apply: "build",
        closeBundle: function () {
            // vite打包结束时的钩子
            console.log(sucess("Vite build completed!"));
            dirToZipFun(options);
        },
    };
}
// webpack中导出类 WebpackPluginZipPack 插件
var WebpackPluginZipPack = /** @class */ (function () {
    function WebpackPluginZipPack(options) {
        this.options = options;
    }
    WebpackPluginZipPack.prototype.apply = function (compiler) {
        var _this = this;
        // 判断是否是生产环境
        if (compiler.options.mode === "production") {
            compiler.hooks.done.tap("WebpackPluginZipPack", function () {
                console.log(sucess("Webpack build completed!"));
                dirToZipFun(_this.options);
            });
        }
    };
    return WebpackPluginZipPack;
}());
// module.exports = {
//   vitePluginZipPack,
//   WebpackPluginZipPack,
//   test
// }
export { test, vitePluginZipPack, WebpackPluginZipPack };
