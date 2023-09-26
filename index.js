// 入口文件向外暴露需要的成员
const { dirToZipFun } = require('./src/zip')
const { sucess } = require('./src/util/index')
const testaaa = 666
// 返回vite插件钩子，在打包结束时打包为zip
function vitePluginPackZip (options = {}) {
  return {
    name: 'vite-plugin-zip-pack',
    apply: 'build',
    closeBundle () { // 对于vite打包结束钩子
      console.log(sucess('Vite build completed!'));
      dirToZipFun(options)
    }
  }
}
// webpack插件
class webpackPluginPackZip {
  constructor(options = {}) {
    this.options = options;
  }
  apply (compiler) {
    compiler.hooks.afterEmit.tap('webpackPluginPackZip', () => {
      // 在打包完成后执行你的函数或操作
      console.log(sucess('Webpack build completed!'));
      dirToZipFun(this.options)
    });
  }
}

module.exports = {
  vitePluginPackZip,
  webpackPluginPackZip,
  testaaa
}