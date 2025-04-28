declare const test = "=======> typescript plugin-zip-pack...";
declare const deepClone: (obj: Object) => object;

/** vite插件类型 */
/** vite插件参数类型接口 */
interface VitePluginOption {
    name: string;
    apply: 'build' | 'serve';
    enforce?: 'pre' | 'post';
    closeBundle: () => void;
    configResolved: (config: any) => void;
}
/** 打包指定文件夹为.zip 插件的参数字段类型 */
type DirToZipFunType = {
    optZipName: string;
    isPushVx?: boolean;
    xtsToken?: string;
    enable?: boolean;
    targetDir?: string;
    isPackagingTime?: boolean;
    interceptPluginName?: string;
};

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

export { PluginZipPackWebpack, deepClone, pluginZipPackRollup, pluginZipPackVite, test };
