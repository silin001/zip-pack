/*
 * @Date: 2024-04-11 17:09:22
 * @LastEditTime: 2024-04-11 17:40:08
 * @Description:
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\msgPush.ts
 */

import { httpGet } from "../http/index";
/** 虾推啥服务
 *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
 *
 */
export async function xtsMsgPushWeChat(
  content,
  titleType = 1,
  token = "9O547m1wt4SsX2F19yHhVlxnH"
) {
  const api = `http://wx.xtuis.cn/${token}.send`; // 完整服务接口
  const typeObj = {
    1: "【前端项目打包】结果通知！",
    2: "【前端项目打包】结果通知！",
  };
  const title = typeObj[titleType];
  const fullUrl = `${api}?text=${title}&desp=${content}`; // 拼接对应get请求参数
  const res = (await httpGet(fullUrl)) as Buffer; // 结果肯定是buffer类型数据 所以用as 断言一下
  // 这里接口请求到的是 buffer类型数据，方便查看需要转换一下
  const strData = res.toString();
  console.log("消息推送接口调用结果：", strData);
}


/** 日子打印 */
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