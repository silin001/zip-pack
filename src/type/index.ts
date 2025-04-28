/** vite插件类型 */
// export type VitePluginZipPackType = {
//   name: string;
//   apply: string;
//   enforce: string;
//   // order: number;
//   // config: () => void;
//   // config: (config) => { plugins: any[] };
//   closeBundle: () => void;
//   configResolved: (config) => void;
//   // buildEnd: () => void;
//   // writeBundle: () => void;
// };


/** vite插件参数类型接口 */
export interface VitePluginOption {
  name: string;
  apply: 'build' | 'serve'; // 执行阶段 build、 serve
  enforce?: 'pre' | 'post'; // pre、post 设置为后置插件，确保在所有插件之后执行
  closeBundle: () => void;
  configResolved: (config) => void;
  // config?: (config) => { plugins: any[] };
  // buildEnd?: () => void;
};



/** 打包指定文件夹为.zip 插件的参数字段类型 */
export type DirToZipFunType = {
  optZipName: string; // 打包目录名称
  isPushVx?: boolean; // 是否开启微信推送
  xtsToken?: string; // 虾推啥 token
  enable?: boolean; // 是否禁用
  targetDir?: string; // 目标目录 默认 dist
  isPackagingTime?: boolean; // 目录名称是否显示打包时间
  interceptPluginName?: string; // 需要劫持的 插件
};

