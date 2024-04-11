declare const test = "=======>12  typescript  plugin-zip-pack...";
declare const testFun: (num?: number) => number;
declare const deepClone: (obj: Object) => object;

/** vite插件类型 */
type VitePluginZipPackType = {
    name: string;
    apply: "build";
    closeBundle: () => void;
};
/** 打包指定文件夹为.zip参数字段类型 */
type DirToZipFunType = {
    optZipName: string;
    enable?: boolean;
    targetDir?: string;
};

/** 支持vite打包指定文件夹为.zip包的插件函数 */
declare const pluginZipPackVite: (options: DirToZipFunType) => VitePluginZipPackType;
/** 支持webpack打包指定文件夹为.zip包的类插件函数 */
declare class PluginZipPackWebpack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}

export { PluginZipPackWebpack, deepClone, pluginZipPackVite, test, testFun };
