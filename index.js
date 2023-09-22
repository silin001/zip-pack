// 入口文件向外暴露需要的成员
const { dirToZipFun } = require('./src/zip')
const testaaa = 300
// 返回插件钩子，在打包结束时打包为zip
function pluginPackZip (options = {}) {
  return {
    name: 'plugin-zip-pack',
    apply: 'build',
    closeBundle () {
      console.log('=======》〉》打包完成!');
      console.log('Vite build completed!');
      dirToZipFun(options)
    }
  }
}

module.exports = {
  pluginPackZip,
  testaaa
}