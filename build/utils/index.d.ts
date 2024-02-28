/// <reference types="node" />
import fs from 'fs';
declare const resolve: any, join: any;
declare const error: any;
declare const sucess: any;
declare const zipPackRootDir: any;
declare function getNowDate(): {
    currentDate: string;
    distDate: string;
};
declare function deleteFile(filePath: any): void;
declare const getTargetDir: (targetDir: any) => any;
declare const setOutputDir: (optZipName: any) => any;
declare const isPathExists: (filePath: any) => boolean;
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
export { fs, error, sucess, join, resolve, zipPackRootDir, deleteFile, getNowDate, getTargetDir, setOutputDir, isPathExists, addFilesToZip, getFileByfileName, dirToZipHandle, };
