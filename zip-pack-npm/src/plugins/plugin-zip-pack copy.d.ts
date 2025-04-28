import { DirToZipFunType, VitePluginOption } from '../type/index';
/** 支持vite打包指定文件夹为.zip包的插件函数 */
declare const pluginZipPackVite: (options: DirToZipFunType) => VitePluginOption;
/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
declare class PluginZipPackWebpack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}
/** 支持 rollup 打包指定文件夹为.zip包的插件函数 */
declare const pluginZipPackRollup: (options: DirToZipFunType) => {
    name: string;
    generateBundle(options2: any, bundle: any): void;
};
export { pluginZipPackVite, PluginZipPackWebpack, pluginZipPackRollup };
