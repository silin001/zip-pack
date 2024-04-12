/*
 * @Date: 2024-04-11 17:09:22
 * @LastEditTime: 2024-04-12 15:19:01
 * @Description:
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\msgPush.ts
 */

import { httpGet } from "../http/index";
import { getStyleString, xtsBgStyle, xtsBgStyle2} from "../utils/index";

/** 虾推啥服务推送到微信
 *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
 *
 */
export async function xtsMsgPushWeChat(
  content: string,
  token:string,
  titleStr?:string,
) {
  const api = `http://wx.xtuis.cn/${token}.send`; // 完整服务接口
  const title = titleStr || "【前端项目打包】结果通知！";
  const fullUrl = `${api}?text=${title}&desp=${content}`; // 拼接对应get请求参数
  const res = (await httpGet(fullUrl)) as Buffer; // 结果肯定是buffer类型数据 所以用as 断言一下
  // 这里接口请求到的是 buffer类型数据，方便查看需要转换一下
  const strData = res.toString();
  console.log("消息推送接口调用结果：", strData);
}


/**
 * 通过定义 LogObject 接口来指定 obj 参数的类型，您可以确保该参数包含函数中使用的所有属性
 */
interface LogObject {
  projectName?: string;
  name: string;
  version: string;
  targetDir?: string;
  outputFilePath?: string;
  doneTime?: string;
}

/** 日志打印 */
export function zipPackLogs(obj: LogObject, type: number = 1) {
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
        <div style="${getStyleString(xtsBgStyle)}">
          <div>当前项目名称: <font color="red">${projectName}</font> </div>
          <div>插件名称: <font color="red">${name}</font> </div>
          <div>插件版本: <font color="red">${version}</font> </div>
          <div>打包输出路径: <font color="red">${outputFilePath}</font> </div>
          <div>打包目标目录: ${targetDir}</div>
          <div>打包完成时间: ${doneTime}</div>
        </div>
        <div style="${getStyleString(xtsBgStyle2)}">
          <div>插件地址:  <a href="https://www.npmjs.com/package/plugin-zip-pack">plugin-zip-pack</a>  </div>
          <div>插件作者:  尖椒土豆sss</div>
        </div>
      `;
  const logs = {
    1: cmdMsg,
    2: disable,
    3: wxMsg,
  };
  return logs[type];
}