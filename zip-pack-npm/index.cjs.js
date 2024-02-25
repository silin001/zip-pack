'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require("fs");
var JSZip = require("jszip");
var zip = new JSZip();
var _a = require("../utils/index"), sucess$1 = _a.sucess, error = _a.error, resolve = _a.resolve, deleteFile = _a.deleteFile, getTargetDir = _a.getTargetDir, setOutputDir = _a.setOutputDir, isPathExists = _a.isPathExists, getNowDate = _a.getNowDate;
var _b = getPackJson(), name = _b.name, version = _b.version;
function getPackJson() {
    var pkg = {
        name: "",
        version: "",
    };
    // 使用 resolve 获取真实的json文件 path路径
    var packageJsonPath = resolve(__dirname, "package.json");
    try {
        // 读取文件内容
        var packageJsonString = fs.readFileSync(packageJsonPath, "utf8");
        var _a = JSON.parse(packageJsonString), name_1 = _a.name, version_1 = _a.version;
        pkg.name = name_1;
        pkg.version = version_1;
    }
    catch (err) {
        console.error("无法读取npm包的 package.json 文件:", err);
    }
    console.log("pkg--", pkg);
    return pkg;
}
/**
 * @description: 将文件夹打包为.zip
 * @return {*}
 */
function dirToZipFun(_a) {
    var enable = _a.enable, _b = _a.optZipName, optZipName = _b === void 0 ? "dist" : _b, _c = _a.targetDir, targetDir = _c === void 0 ? "dist" : _c;
    if (!enable) {
        console.log(sucess$1("\n      <===========   \u63D2\u4EF6\u5DF2\u7981\u7528   ======>\n      ".concat(name, " \u63D2\u4EF6\u7248\u672C\uFF1A").concat(version, "\n      \u5982\u9700\u5F00\u542F\u8BF7\u5728\u53C2\u6570\u9009\u9879 enable \u5B57\u6BB5\u4F20\u5165\u503C\u4E3A true\n      <=========== ").concat(name, " ======>")));
        return;
    }
    if (!isPathExists(getTargetDir(targetDir))) {
        console.log(sucess$1(getTargetDir(targetDir), "目标路径不存在，请传入存在的指定目录！"));
        return;
    }
    // 设置 .zip包输出到当前项目跟目录
    var outputFilePath = setOutputDir(optZipName);
    if (isPathExists(outputFilePath)) {
        console.log(sucess$1("先删除已存在的.zip目录-->", outputFilePath));
        deleteFile(outputFilePath);
        setTimeout(function () {
            dirToZipHandle(optZipName, targetDir);
        }, 800);
    }
    else {
        dirToZipHandle(optZipName, targetDir);
    }
}
/**
 * @description: 将指定文件夹打包为.zip
 * @param {*} optZipName 打包后文件夹名称 xxx
 * @param {*} targetDir 需要打包的文件夹 dist
 * @return {*}
 */
function dirToZipHandle(optZipName, targetDir) {
    // function dirToZipHandle (optZipName = "dist", targetDir = "dist") {
    // 获取要打包的目录路径
    var targetPath = getTargetDir(targetDir);
    // 设置 .zip包输出到当前项目跟目录
    var outputFilePath = setOutputDir(optZipName);
    // 打包zip
    addFilesToZip(zip, targetPath);
    // 生成zip压缩包内容的Buffer值，专门为Node.js使用
    zip
        .generateAsync({ type: "nodebuffer" })
        .then(function (content) {
        // 将压缩后的内容写入文件
        fs.writeFileSync(outputFilePath, content);
        console.log(sucess$1("\n      <===========   zip\u6253\u5305\u6210\u529F   ======>\n      ".concat(name, " \u63D2\u4EF6\u7248\u672C\uFF1A").concat(version, "\n      \u6253\u5305\u76EE\u6807\u76EE\u5F55\uFF1A'").concat(targetDir, "'\n      \u6253\u5305\u8F93\u51FA\u8DEF\u5F84\uFF1A'").concat(outputFilePath, "'\n      \u6253\u5305\u5B8C\u6210\u65F6\u95F4\uFF1A'").concat(getNowDate().currentDate, "'\n      <===========   ").concat(name, "   ======>")));
    })
        .catch(function (err) {
        console.error(error("Compression failed:", err));
    });
}
// 递归添加文件和子文件夹
function addFilesToZip(zip, folderPath) {
    var files = fs.readdirSync(folderPath);
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        var filePath = "".concat(folderPath, "/").concat(file);
        if (fs.statSync(filePath).isDirectory()) {
            var subFolder = zip.folder(file);
            addFilesToZip(subFolder, filePath); // 递归处理子文件夹
        }
        else {
            var content = fs.readFileSync(filePath);
            zip.file(file, content);
        }
    }
}

/*
 * @Date: 2024-01-29 16:06:39
 * @LastEditTime: 2024-02-23 16:39:30
 * @Description:  入口文件向外暴露需要的方法
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\index.ts
 */
var deepClone = function (obj) {
    // 不是引用类型或者是null的话直接返回
    if (typeof obj !== "object" || typeof obj == null) {
        return obj;
    }
    // 初始化结果
    var result;
    if (obj instanceof Array) {
        result = [];
    }
    else {
        result = {};
    }
    for (var key in obj) {
        // 保证不是原型上的属性
        if (obj.hasOwnProperty(key)) {
            // 递归调用
            result[key] = deepClone(obj[key]);
        }
    }
    return result;
};
var test = "ts版本测试222333";
var sucess = require("./utils/index").sucess;
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
//   test,
// };
// export { test, deepClone };

exports.WebpackPluginZipPack = WebpackPluginZipPack;
exports.deepClone = deepClone;
exports.test = test;
exports.vitePluginZipPack = vitePluginZipPack;

if(typeof window !== 'undefined') {
  window._ZipPack_VERSION_ = '1.0.0'
}
