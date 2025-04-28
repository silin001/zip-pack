export declare function createNotifier(): {
    promise: Promise<void>;
    resolve: () => void;
};
export declare function getVitePluginName(value: any): any;
export declare function hijackPluginLifecycle(plugins: any[], // 插件数组
pluginName: string, // 目标插件名
lifecycleMethod: string, // 目标生命周期方法名
notifier: {
    promise: Promise<void>;
    resolve: () => void;
}): true | null;
