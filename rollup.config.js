
// import typescript from '@rollup/plugin-typescript';  // 让 rollup 认识 ts 的代码
// 为了将引入的第三方 npm 包，也打包进我们的最终结果中
import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
// 转义es5
// import babel from "rollup-plugin-babel"; // babel 插件
// import { eslint } from 'rollup-plugin-eslint'; // eslint插件
import pkg from './package.json'
// 一段自定义的内容，以下内容会添加到打包结果中
// const footer = `if(typeof window !== 'undefined') {
//   window._Dry_VERSION_ = '${pkg.version}'
// }`

export default {

  input: './index.js', // 打包的入口文件
  // output: {
  //  name: 'zip-pack',  // 输入的包名
  //  file: './bin/index.js', // 打包输出地址, 这里的导出地址就是package内main的地址
  //  format: 'umd' // 包类型
  // },
  output: [
    {
      file: pkg.module,
      format: 'esm',
      //  footer,
    },
    {
      file: pkg.main,
      format: 'cjs',
      //  footer,
    },

    // {
    //  file: pkg.browser,
    //  format: 'umd',
    //  name: 'Dry',
    //  footer,
    // },
  ],
  plugins: [
    resolve(),
    commonjs(),
    nodePolyfills()
    // typescript()
    // babel({
    //  exclude: 'node_modules/**',
    //  runtimeHelpers: true,
    // }),
    // eslint({
    //  throwOnError: true,
    //  include: ['src/**'],
    //  exclude: ['node_modules/**']
    // })
  ],
  // external: ['archiver'], // 将archiver标记为外部模块
  ignore: [
    "node_modules/**" // 忽略目录
  ]

}
