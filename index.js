// 入口文件向外暴露需要的成员
const { dirToZipFun } = require('./src/zip')
const { sucess } = require('./src/util/index')
const testaaa = 300
// 返回插件钩子，在打包结束时打包为zip
function pluginPackZip (options = {}) {
  return {
    name: 'plugin-zip-pack',
    apply: 'build',
    closeBundle () {
      console.log(sucess('Vite build completed!'));
      dirToZipFun(options)
    }
  }
}
module.exports = {
  pluginPackZip,
  testaaa
}