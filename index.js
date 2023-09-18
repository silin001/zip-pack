import { dirToZipFun }  from './src/zip'
// const { dirToZipFun } = require('./src/zip')

// dirToZipFun('测试打包2','src/util')
// dirToZipFun('测试打包')
// dirToZipFun('pc端', 'src')
// dirToZipFun('测试打包', 'src')

const numaaa = 100
// console.log(numaaa)

// 入口文件向外暴露需要的成员
module.exports = {
 dirToZipFun,
 numaaa
}