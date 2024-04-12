declare const fs: any;
declare const resolve: any, join: any;
declare const error: import("chalk").ChalkInstance;
declare const sucess: import("chalk").ChalkInstance;
declare const zipPackRootDir: any;
declare const setOutputDir: (optZipName: string) => any;
declare const getTargetDir: (targetDir: string) => any;
declare const isPathExists: (filePath: string) => any;
declare function deleteFile(filePath: string): void;
/** 递归添加文件和子文件夹 */
declare function addFilesToZip(jszip: any, folderPath: string): void;
/** 使用fs模块读取指定文件、如 package.json */
declare function getFileByfileName(fileName?: string): {
    name: string;
    version: string;
};
export { fs, error, sucess, join, resolve, zipPackRootDir, deleteFile, getTargetDir, setOutputDir, isPathExists, addFilesToZip, getFileByfileName, };
