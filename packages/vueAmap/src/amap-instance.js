export default class AMapInstance {
  constructor() {
    this._map = null;
    this._pluginsMap = new Map();
  }
  setMap(map) {
    this._map = map;
  }
  getMap() {
    return this._map;
  }
  setPlugin(name, pluginInstance) {
    this._pluginsMap.set(name, pluginInstance);
  }
  getPlugin(name) {
    //format plugin name to support AMap.Xxx or Xxx
    if (!name.includes("AMap.")) {
      name = `AMap.${name}`;
    }
    return this._pluginsMap.get(name);
  }
}
