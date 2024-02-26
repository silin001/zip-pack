import { DirToZipFunType } from "./type/index";
/** 支持vite打包的插件函数 */
export declare const vitePluginZipPack: (options: DirToZipFunType) => {
    name: string;
    apply: string;
    closeBundle(): void;
};
/** 支持vite打包的插件函数 */
/** 支持webpack打包的 类插件函数 */
export declare class WebpackPluginZipPack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}
