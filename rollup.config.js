// rollup 默认仅支持es6的模块, 本工程很多地方使用了node相关模块，是基于commonjs就需要插件来读取，
import commonjs from '@rollup/plugin-commonjs'; // 将 common js 模块转成es6
// 让rollup支持 ts
import typescript from '@rollup/plugin-typescript';
// rollup 并不知道如何寻找路径以外的依赖如 node_module 中的依赖。
// 所以需要借助 @rollup/plugin-node-resolve 插件帮助程序可以在项目依赖中找到对应文件


import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
// 生成.d.ts类型声明文件
import { dts } from "rollup-plugin-dts";
// 代码打包混淆
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';

// import pkg from './package.json'
// 方式2
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('package.json', { encoding:'utf8' }))

// 一段自定义的内容，以下内容会添加到打包结果中
const footer = `
if(typeof window !== 'undefined') {
  window.ZipPack_VERSION_ = '${pkg.version}'
  console.log('描述:', '${pkg.description}')
}
`;

export default [
  {
    input: './src/index.ts', // 打包的入口文件
    output: [
      {
        file: pkg.module, // ESM 格式的打包出口
        format: 'es', // ES规范(import)
        footer,
      },
      {
        file: pkg.main,
        format: 'cjs', // CommonJS 规范（require）
        footer,
      },
      //   // 如果你需要支持浏览器环境或通过 <script> 标签引入
      // {
      //   file: pkg.browser, // 打包出口
      //   // umd是兼容 cjs/esm/iife/amd/cmd/ 的通用打包格式
      //   format: 'umd',
      //   footer,
      //   name: 'ZipPack', // 指定打包后的全局变量名
      //   // sourcemap: true,
      //   globals: {
      //     // 你的模块名: 全局变量名
      //     stream: 'ZipPack_stream',
      //     events: 'ZipPack_events',
      //     buffer: 'ZipPack_buffer',
      //     util: 'ZipPack_util',
      //     process: 'ZipPack_process',
      //     os: 'ZipPack_os',
      //     tty: 'ZipPack_tty',
      //     // 'node:process': 'ZipPack_process',
      //     // 'node:os': 'ZipPack_os',
      //     // 'node:tty': 'ZipPack_tty',
      //   },
      // },
    ],
    plugins: [
      json(),
      // 使用 Rollup 打包时重写引用
      alias({
        entries: [
          { find: 'node:process', replacement: 'process' },
          { find: 'node:os', replacement: 'os' },
          { find: 'node:tty', replacement: 'tty' },
        ],
      }),
      commonjs({
        // esmExternals: true,
        // transformMixedEsModules: true,
      }),
      // 让rollup 支持打包ts代码,并可以指定ts代码打包过程中的相关配置
      typescript({ exclude: 'node_modules' }),
      nodeResolve({
        // 指定是否优先使用 Node.js 内置模块。如果设置为 true，当导入的模块与 Node.js 内置模块同名时，会优先使用内置模块。
        preferBuiltins: true,
        // 用于指定是否将导入的模块路径映射到浏览器版本的路径,当设置为 `true` 时，该插件会尝试将模块路径转换为适用于浏览器环境的路径。
        browser: true,
        exportConditions: ['node'],
      }),
      terser(), // 使用 terser 插件进行代码混淆，最后执行
    ],
    // 标记为外部依赖，不要将其打包进最终的输出文件中
    // external: ['node:os', 'node:process', 'node:tty', 'stream', 'buffer', 'events', 'util'],
    external: ['process', 'os', 'tty', 'stream', 'buffer', 'events', 'util'],
    ignore: [
      'node_modules/**', // 忽略目录
    ],
  },
  // 生成.d.ts文件
  {
    input: './src/index.ts',
    // output: [{ file: 'build/index.d.ts', format: 'es' }],
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
];
