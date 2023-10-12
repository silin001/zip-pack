// 入口文件向外暴露需要的成员
const { dirToZipFun } = require('./src/plugin-zip-pack')
const { sucess } = require('./src/util/index')
const test = 666
// 返回vite插件钩子，在打包结束时打包为zip
function vitePluginZipPack (options = {}) {
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
class WebpackPluginZipPack {
  constructor(options = {}) {
    this.options = options;
  }
  apply (compiler) {
    // 判断是否是生产环境
    if (compiler.options.mode === 'production') {
      // compiler.hooks.afterEmit.tap('WebpackPluginZipPack', () => {
      //   // 在打包完成后执行你的函数或操作
      //   console.log(sucess('Webpack build completed!'));
      //   dirToZipFun(this.options)
      // });
      compiler.hooks.done.tap('WebpackPluginZipPack', () => {
        console.log(sucess('Webpack build completed!'));
        dirToZipFun(this.options)
      })
    }
  }
}

module.exports = {
  vitePluginZipPack,
  WebpackPluginZipPack,
  test
}