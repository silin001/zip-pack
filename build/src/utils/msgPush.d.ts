/** 虾推啥服务
 *  get请求地址：'https://wx.xtuis.cn/您的token.send?text=黄金大涨&desp=黄金大涨100元'
 *
 */
export declare function xtsMsgPushWeChat(content: any, titleType?: number, token?: string): Promise<void>;
/** 日子打印 */
export declare function zipPackLogs(obj: any, type?: number): any;
