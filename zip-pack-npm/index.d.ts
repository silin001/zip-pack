declare const test = "2-25 ts\u7248\u672C\u6D4B\u8BD5";
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
    enable?: boolean;
    optZipName: string;
    targetDir?: string;
};

/** 支持vite打包指定文件夹为.zip包 */
declare const vitePluginZipPack: (options: DirToZipFunType) => VitePluginZipPackType;
/** 支持webpack打包的 类插件函数 */
declare class WebpackPluginZipPack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}

export { WebpackPluginZipPack, deepClone, test, testFun, vitePluginZipPack };
