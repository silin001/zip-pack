/*
 * @Date: 2024-04-11 09:52:14
 * @LastEditTime: 2024-04-11 16:49:27
 * @Description:
 * @FilePath: \yike-design-devd:\web_si\my_webDemo\my-projectFrame\zip-pack\src\http\index.ts
 */

const http = require("http");

export const httpGet = (api) => {
  return new Promise((resolve, reject) => {
    http
      .get(api, (res) => {
        let bufferData;
        res.on("data", (chunk) => {
          bufferData = chunk;
        });
        res.on("end", () => {
          resolve(bufferData);
        });
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
        reject(err)
      });
  })
}
