declare const deepClone: (obj: Object) => object;
declare const test = "ts\u7248\u672C\u6D4B\u8BD5222333";
import { VitePluginZipPackType } from './src/type/index';
import { DirToZipFunType } from "./src/type/index";
declare function vitePluginZipPack(options: DirToZipFunType): VitePluginZipPackType;
declare class WebpackPluginZipPack {
    private options;
    constructor(options: DirToZipFunType);
    apply(compiler: any): void;
}
export { test, deepClone, vitePluginZipPack, WebpackPluginZipPack };
