/** vite插件类型 */
/** vite插件参数类型接口 */
export interface VitePluginOption {
    name: string;
    apply: 'build' | 'serve';
    enforce?: 'pre' | 'post';
    closeBundle: () => void;
    configResolved: (config: any) => void;
}
/** 打包指定文件夹为.zip 插件的参数字段类型 */
export type DirToZipFunType = {
    optZipName: string;
    isPushVx?: boolean;
    xtsToken?: string;
    enable?: boolean;
    targetDir?: string;
    isPackagingTime?: boolean;
    interceptPluginName?: string;
};
