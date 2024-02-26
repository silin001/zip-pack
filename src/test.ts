/*
 * @Date: 2024-02-25 18:39:32
 * @LastEditTime: 2024-02-26 17:11:15
 * @Description: 测试文件
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\test.ts
 */



export const test = "2-25 ts版本测试";
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
