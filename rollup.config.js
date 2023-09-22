import commonjs from '@rollup/plugin-commonjs'; // commonjs模块转换插件
import { nodeResolve } from '@rollup/plugin-node-resolve'; // 依赖引用插件
import pkg from './package.json'
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
    nodeResolve(),
    commonjs(),
  ],
  ignore: [
    "node_modules/**" // 忽略目录
  ]
}
