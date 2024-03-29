declare const fs: any;
declare const resolve: any, join: any;
import chalk from "chalk";
declare const error: chalk.Chalk;
declare const sucess: chalk.Chalk;
import { DirToZipFunType, VitePluginZipPackType } from "../type/index";
declare const zipPackRootDir: any;
declare function getNowDate(): {
    currentDate: string;
    distDate: string;
};
declare function deleteFile(filePath: any): void;
declare const getTargetDir: (targetDir: any) => any;
declare const setOutputDir: (optZipName: any) => any;
declare const isPathExists: (filePath: any) => any;
/** 使用fs模块读取指定文件、如 package.json */
declare function getFileByfileName(fileName?: string): {
    name: string;
    version: string;
};
/** 递归添加文件和子文件夹 */
declare function addFilesToZip(jszip: any, folderPath: string): void;
/**
 * @description: 将指定文件夹打包为.zip
 * @param {*} optZipName 打包后文件夹名称 xxx
 * @param {*} targetDir 需要打包的文件夹 dist
 * @return {*}
 */
declare function dirToZipHandle(optZipName: string, targetDir: string): void;
/** 支持vite打包指定文件夹为.zip包的插件函数 */
export declare const pluginZipPackVite: (options: DirToZipFunType) => VitePluginZipPackType;
/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
export declare class PluginZipPackWebpack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}
declare function isVite(): boolean;
declare function isWebpack(): boolean;
export { fs, error, sucess, join, resolve, zipPackRootDir, deleteFile, getNowDate, getTargetDir, setOutputDir, isPathExists, addFilesToZip, getFileByfileName, dirToZipHandle, isVite, isWebpack, };
