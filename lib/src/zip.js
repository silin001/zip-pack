const fs = require('fs');
const JSZip = require('jszip');
const zip = new JSZip();

const { sucess, error, deleteFile, getTargetDir, setOutputDir, isPathExists } = require('./util/index')

/*
将文件夹打包为.zip
targetDir： 需要打包的目录
*/
function dirToZipFun ({ optZipName = "dist", targetDir = "dist" }) {
  if (!isPathExists(getTargetDir(targetDir))) {
    console.log(sucess(getTargetDir(targetDir), '目标路径不存在，请传入存在的指定目录！'))
    return
  }
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName)
  if (isPathExists(outputFilePath)) {
    console.log(sucess('先删除已存在的.zip目录-->', outputFilePath))
    deleteFile(outputFilePath)
    setTimeout(() => {
      dirToZipHandle(optZipName, targetDir)
    }, 800);
  } else {
    dirToZipHandle(optZipName, targetDir)
  }
}

/* 将文件夹打包为.zip */
function dirToZipHandle (optZipName = "dist", targetDir = "dist") {
  // 获取要打包的目录路径
  const targetPath = getTargetDir(targetDir)
  // 设置 .zip包输出到当前项目跟目录
  const outputFilePath = setOutputDir(optZipName)
  // 打包zip
  addFilesToZip(zip, targetPath);
  // 生成zip压缩包内容的Buffer值，专门为Node.js使用
  zip.generateAsync({ type: 'nodebuffer' })
    .then((content) => {
      // 将压缩后的内容写入文件
      fs.writeFileSync(outputFilePath, content);
      console.log(sucess(`
      <===========   zip打包成功    ======>
      打包目标目录：'${targetDir}'
      打包输出路径：'${outputFilePath}'
      <=========== plugin-zip-pack ======>`));
    })
    .catch((err) => {
      console.error(error('Compression failed:', err));
    });
}


// 递归添加文件和子文件夹
function addFilesToZip (zip, folderPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = `${folderPath}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      const subFolder = zip.folder(file);
      addFilesToZip(subFolder, filePath); // 递归处理子文件夹
    } else {
      const content = fs.readFileSync(filePath);
      zip.file(file, content);
    }
  }
}
module.exports = {
  dirToZipFun
}


