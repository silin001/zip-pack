declare const test = "2-25 ts\u7248\u672C\u6D4B\u8BD5";
declare const testFun: (num?: number) => number;
declare const deepClone: (obj: Object) => object;

/** 限制插件参数字段 */
type DirToZipFunType = {
    enable?: boolean;
    optZipName: string;
    targetDir?: string;
};

/** 支持vite打包的插件函数 */
declare const vitePluginZipPack: (options: DirToZipFunType) => {
    name: string;
    apply: string;
    closeBundle(): void;
};
/** 支持vite打包的插件函数 */
/** 支持webpack打包的 类插件函数 */
declare class WebpackPluginZipPack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}

export { WebpackPluginZipPack, deepClone, test, testFun, vitePluginZipPack };
