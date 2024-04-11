/*
 * @Date: 2024-02-25 18:39:32
 * @LastEditTime: 2024-04-11 17:43:00
 * @Description: 测试文件
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\plugins\test.ts
 */

export const test = "=======>12  typescript  plugin-zip-pack...";
// console.log(test);

import { xtsMsgPushWeChat, zipPackLogs } from "../utils/msgPush";

// 微信推送测试
xtsMsgPushWeChat(zipPackLogs({ projectName: '测试一下'}, 3));

export const testFun = (num: number = 100) => {
  return num + 1;
};

export const deepClone = (obj: Object) => {
  // 不是引用类型或者是null的话直接返回
  if (typeof obj !== "object" || typeof obj == null) {
    return obj;
  }
  // 初始化结果
  let result: object;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }

  for (let key in obj) {
    // 保证不是原型上的属性
    if (obj.hasOwnProperty(key)) {
      // 递归调用
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
};
