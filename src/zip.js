const fs = require('fs');
const path = require('path')
const archiver = require('archiver');

const { deleteFile } = require('./util/index')

function getRealFolderPath (folderPath) {
 const rootDir = path.resolve(__dirname, '..'); // 获取当前项目的根目录路径
 const realFolderPath = path.resolve(rootDir, folderPath);
 return realFolderPath;
}
function isPathExists (filePath) {
 return fs.existsSync(filePath);
}


function zipFun (outputDir, targetDir = "dist") {
 let isOk = false
 // 定义要打包的目录路径
 const directoryPath = getRealFolderPath(targetDir)
 if (!isPathExists(directoryPath)) {
  console.log('目标路径不存在，请传入存在的指定目录！')
  return
 }
 // 输出的 .zip 文件到当前项目跟目录
 const rootDir = path.resolve(__dirname, '..'); // 获取当前项目的根目录路径
 const outputFilePath = path.join(rootDir, outputDir+'.zip');

 // 删除已存在的 zip 文件
 if (isPathExists(outputFilePath)) {
  console.log('先删除已存在的.zip目录', outputFilePath)
  // fs.unlinkSync(outputFilePath);
  deleteFile(outputFilePath)
 }

 // 创建一个可写流，将打包后的文件输出到指定的 zip 文件中
 const output = fs.createWriteStream(outputFilePath);
 const archive = archiver('zip', { zlib: { level: 9 } });

 // 监听打包压缩过程的错误事件
 archive.on('error', (err) => {
  console.log('archive 压缩错误:', err)
  throw err;
 });

 output.on('close', () => {
  console.log('Folder successfully zipped.');
  isOk = true
  // 将 output 流与 archive 对象进行关联
  archive.pipe(output);

  // 向 archive 对象中添加要打包的目录
  archive.directory(directoryPath, false);

  // 完成打包并关闭 output 流
  archive.finalize();

  console.log(`zip-pack 打包成功！ 输出路径：'${outputFilePath}'， 目标路径：'${directoryPath}'`);
 });
 }

// export default zipFun
module.exports = zipFun
// module.exports = {
//  zipFun
// }

