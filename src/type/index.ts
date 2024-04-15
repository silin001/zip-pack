/** vite插件类型 */
export type VitePluginZipPackType = {
  name: string;
  apply: "build";
  closeBundle: () => void;
};

/** 打包指定文件夹为.zip 函数参数字段类型 */
export type DirToZipFunType = {
  optZipName: string; // 打包目录名称
  isPushVx?: boolean; // 是否开启微信推送
  xtsToken?: string; // 虾推啥 token
  enable?: boolean; // 是否禁用
  targetDir?: string; // 目标目录
  isPackagingTime?: boolean; // 目录名称是否显示打包时间
};

