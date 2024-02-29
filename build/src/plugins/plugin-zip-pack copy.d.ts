import { DirToZipFunType, VitePluginZipPackType } from "../type/index";
/** 支持vite打包指定文件夹为.zip包的插件函数 */
export declare const vitePluginZipPack: (options: DirToZipFunType) => VitePluginZipPackType;
/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
export declare class WebpackPluginZipPack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}
