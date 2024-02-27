declare const resolve: any, join: any;
import chalk from 'chalk';
declare const error: chalk.Chalk;
declare const sucess: chalk.Chalk;
declare const zipPackRootDir: any;
declare function getNowDate(): {
    currentDate: string;
    distDate: string;
};
declare function deleteFile(filePath: any): void;
declare const getTargetDir: (targetDir: any) => any;
declare const setOutputDir: (optZipName: any) => any;
declare const isPathExists: (filePath: any) => any;
export { error, sucess, join, resolve, zipPackRootDir, deleteFile, getNowDate, getTargetDir, setOutputDir, isPathExists, };
