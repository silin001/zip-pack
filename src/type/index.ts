/** vite插件类型 */
export type VitePluginZipPackType = {
  name: string;
  apply: "build";
  closeBundle: () => void;
};

/** 打包指定文件夹为.zip 函数参数字段类型 */
export type DirToZipFunType = {
  optZipName: string;
  isPushVx?: boolean; // 是否开启微信推送
  xtsToken?: string; // 虾推啥 token
  enable?: boolean;
  targetDir?: string;
};

