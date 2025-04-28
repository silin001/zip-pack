/*
 * @Date: 2025-04-26
 * @Description: 劫持目标插件的生命周期方法，当该插件完成时，进行通知。
 * @FilePath: hijackPluginNotifier.ts
 */

// 通用工具：创建通知 Promise
export function createNotifier() {
  let resolveFn!: () => void;
  const promise = new Promise<void>((resolve) => {
    resolveFn = resolve;
  });
  return {
    promise,
    resolve: resolveFn,
  };
}


// 获取 vite 插件名称
export function getVitePluginName(value) {
  const prefix = 'vite-plugin-';
  if (value.startsWith(prefix)) {
    // 添加 vite插件 name 前缀
    return 'vite:' + value.substring(prefix.length);
  }
  return value;
}



// 劫持目标插件的生命周期方法，通知完成
export function hijackPluginLifecycle(
  plugins: any[], // 插件数组
  pluginName: string, // 目标插件名
  lifecycleMethod: string, // 目标生命周期方法名
  notifier: { promise: Promise<void>; resolve: () => void } // 通知对象
) {
  // console.log(111, plugins);
  const viteName = getVitePluginName(pluginName);
  // console.log('🚀🚀 ~ lastViteName:', viteName);
  const plugin = plugins.find((p) => p.name === viteName);
  if (!plugin) {
    console.warn(`Plugin not found：${pluginName}`);
    return null;
  }
  // console.log('Find plugin：', plugin);
  // console.log(
  //   `[劫持] 正在劫持插件 "${pluginName}" 的 "${lifecycleMethod}" 方法`
  // );
  const originalMethod = plugin[lifecycleMethod];
  if (!originalMethod) {
    // console.log('当前插件没有对应生命周期方法：', plugin);
    return null;
  }
  plugin[lifecycleMethod] = async function (...args: any[]) {
    // console.log(`[${pluginName}] ${lifecycleMethod} 开始执行`);
    if (originalMethod) {
      await originalMethod.apply(this, args);
    }
    // console.log(`[${pluginName}] ${lifecycleMethod} 执行完成`);
    // 完成后调用通知
    notifier.resolve();
  };
  return true;
}
