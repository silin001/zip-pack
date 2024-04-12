/*
 * @Date: 2024-04-12 09:47:36
 * @LastEditTime: 2024-04-12 12:50:10
 * @Description: 封装好的一些函数工具
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\utils\tools.ts
 */


export const getNowDate = () => {
  const myDate = new Date();
  const year = myDate.getFullYear(); //获取当前年
  const mon = myDate.getMonth() + 1; //获取当前月
  const date = myDate.getDate(); //获取当前日
  const hours = myDate.getHours(); //获取当前小时
  const minute = myDate.getMinutes();
  let timeValue = "";
  if (hours <= 12) {
    timeValue = "上午";
  } else if (hours > 12 && hours < 18) {
    timeValue = "下午";
  } else if (hours >= 18) {
    timeValue = "晚上";
  }
  return {
    currentDate: `(${year}-${mon}-${date}日${hours}:${minute})`,
    distDate: `(${year}-${mon}-${date}-${timeValue})`,
  };
}



// 辅助函数，将样式对象转换为字符串
export function getStyleString(styleObj) {
  return Object.keys(styleObj)
    .map(key => `${key}:${styleObj[key]}`)
    .join(';');
}

