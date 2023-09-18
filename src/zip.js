const fs = require('fs');
const archiver = require('archiver');
const { deleteFile, getTargetDir, setOutputDir, isPathExists } = require('./util/index')

// import fs from 'fs'
// import archiver from 'archiver'
// import { deleteFile, getTargetDir, setOutputDir, isPathExists } from './util/index.js'


/*
将文件夹打包为.zip
targetDir： 需要打包的目录
*/
function dirToZipFun (optZipName, targetDir = "dist") {
 if (!isPathExists(getTargetDir(targetDir))) {
  console.log(getTargetDir(targetDir), '目标路径不存在，请传入存在的指定目录！')
  return
 }
 // 设置 .zip包输出到当前项目跟目录
 const outputFilePath = setOutputDir(optZipName)
 if (isPathExists(outputFilePath)) {
  console.log('先删除已存在的.zip目录-->   ', outputFilePath)
  deleteFile(outputFilePath)
  setTimeout(() => {
   dirToZipHandle(optZipName, targetDir)
  }, 800);
 } else {
  dirToZipHandle(optZipName, targetDir)
 }

}

/* 将文件夹打包为.zip */
 function dirToZipHandle (optZipName, targetDir = "dist") {
 // 设置 .zip包输出到当前项目跟目录
 const outputFilePath = setOutputDir(optZipName)
 // 获取要打包的目录路径
 const targetPath = getTargetDir(targetDir)
 // 创建一个可写流，将打包后的文件输出到指定的 zip 文件中
 const output = fs.createWriteStream(outputFilePath);
 const archive = archiver('zip', { zlib: { level: 9 } });
 // 监听打包压缩过程的错误事件
 archive.on('error', (err) => {
  console.log('archive 压缩错误:', err)
  throw err;
 });
 output.on('close', () => {
  console.log('⭐⭐⭐Folder successfully zipped.⭐⭐⭐');
 });
 // 将 output 流与 archive 对象进行关联
 archive.pipe(output);
 // 向 archive 对象中添加要打包的目录
 archive.directory(targetPath, false);
 // 完成打包并关闭 output 流
 archive.finalize();
 console.log(`zip-pack 打包成功！ 输出路径：'${outputFilePath}'， 目标路径：'${targetDir}'`);
}

module.exports = {
 dirToZipFun
}


