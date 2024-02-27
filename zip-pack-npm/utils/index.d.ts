declare const resolve: any, join: any;
declare const error: any;
declare const sucess: any;
declare const zipPackRootDir: any;
declare function getNowDate(): {
    currentDate: string;
    distDate: string;
};
declare function deleteFile(filePath: any): void;
declare function deleteFileOrFolder(fileOrFolderPath: any): void;
declare const getTargetDir: (targetDir: any) => any;
declare const setOutputDir: (optZipName: any) => any;
declare function copyFilesFun(sourcePaths: any, targetDir: any): void;
declare const isPathExists: (filePath: any) => any;
declare function publishPackage(newVersion: any, tarDir: any): void;
export { error, sucess, join, resolve, zipPackRootDir, deleteFile, getNowDate, deleteFileOrFolder, getTargetDir, setOutputDir, isPathExists, copyFilesFun, publishPackage };
