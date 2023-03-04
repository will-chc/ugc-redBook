const { AMap } = window;
export const loadPlugin = (pluginName, callback) => {
  AMap.plugin(pluginName, () => {
    callback(AMap);
  });
};