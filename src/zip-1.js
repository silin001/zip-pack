const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');

const { join, deleteFile, getTargetDir, setOutputDir, isPathExists } = require('./util/index')

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

function dirToZipHandle (optZipName, targetDir = 'dist') {
  const targetPath = getTargetDir(targetDir);
  const outputFilePath = setOutputDir(optZipName);

  const zipStream = zlib.createGzip();
  const writeStream = fs.createWriteStream(outputFilePath);

  const fileStreams = [];

  function processFile (file) {
    const filePath = join(targetPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // 如果是文件夹，则递归处理该文件夹内的文件
      fs.readdirSync(filePath).forEach((nestedFile) => {
        processFile(join(file, nestedFile));
      });
    } else {
      // 如果是文件，则将其添加到文件流列表中
      fileStreams.push(fs.createReadStream(filePath));
    }
  }

  fs.readdir(targetPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    files.forEach(processFile);

    function processFileStream (index) {
      if (index >= fileStreams.length) {
        zipStream.end();
        return;
      }

      const currentStream = fileStreams[index];

      currentStream.on('data', (chunk) => {
        zipStream.write(chunk);
      });

      currentStream.on('end', () => {
        processFileStream(index + 1);
      });
    }

    processFileStream(0);

    pipeline(zipStream, writeStream, (error) => {
      if (error) {
        console.error('Compression failed:', error);
      } else {
        console.log('Folder compressed successfully.');
      }
    });
  });
}

module.exports = {
  dirToZipFun
}