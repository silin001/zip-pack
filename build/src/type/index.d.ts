export type VitePluginZipPackType = {
    name: string;
    apply: "build";
    closeBundle: () => void;
};
/** 限制插件参数字段 */
export type DirToZipFunType = {
    enable?: boolean;
    optZipName: string;
    targetDir: string;
};
