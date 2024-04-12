/** 虾推啥服务推送到微信
 *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
 *
 */
export declare function xtsMsgPushWeChat(content: string, token: string, titleStr?: string): Promise<void>;
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
export declare function zipPackLogs(obj: LogObject, type?: number): any;
export {};
