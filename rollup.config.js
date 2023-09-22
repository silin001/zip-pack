// 模拟这些变量和 API，以便于在浏览器环境中使用。
import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
// import typescript from '@rollup/plugin-typescript';  // 让 rollup 认识 ts 的代码
// 转义es5
import babel from "rollup-plugin-babel"; // babel 插件
// import { eslint } from 'rollup-plugin-eslint'; // eslint插件
import pkg from './package.json'
// 一段自定义的内容，以下内容会添加到打包结果中
// const footer = `if(typeof window !== 'undefined') {
//   window._Dry_VERSION_ = '${pkg.version}'
// }`

export default {
  input: './index.js', // 打包的入口文件
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
    resolve({
      browser: true,
      dedupe: ['path']
    }),
    // resolve(),
    commonjs(),
    nodePolyfills(),
    // typescript()
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      // presets: ['@babel/preset-env']
    }),
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
