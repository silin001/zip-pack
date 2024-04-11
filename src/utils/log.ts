/*
 * @Date: 2024-04-11 17:09:22
 * @LastEditTime: 2024-04-11 17:14:09
 * @Description:
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\log.ts
 */


export function zipPackLogs(obj, type = 1) {
  const { projectName, name, version, targetDir, outputFilePath, doneTime } =
   obj;
  // 终端打印
  const cmdMsg = `
      <===========  zip打包成功 ======>
      ${name} 插件版本：${version}
      打包目标目录: ${targetDir}
      打包输出路径：${outputFilePath}
      打包完成时间：${doneTime}
      <===========  ${name}   =======>
      `;
 const disable = `
      <===========   插件已禁用   ======>
      ${name} 插件版本：${version}
      如需开启请在参数选项 enable 字段传入值为 true
      <=========== ${name} ======>`;
  const wxMsg = `
      项目名称：<font color="red">${projectName}<font/> <br>
      插件名称：<div class="title">${name}<div/> <br>
      插件版本：<div class="title">${version}<div/> <br>
      打包目标目录: ${targetDir} <br>
      打包输出路径：${outputFilePath} <br>
      打包完成时间：${doneTime}`;
  const logs = {
    1: cmdMsg,
    2: disable,
    3: wxMsg
  };
  return logs[type]
}