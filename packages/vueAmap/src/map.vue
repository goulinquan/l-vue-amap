<template>
  <div class="map-container">
    <div class="lynn-map" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
export default {
  name: "l-amap",
  props: {
    vid: String, //vid
    amapKey: String, //高德地图的key
    version: String, //高德地图的版本
    UiVersion: String, //高德地图UI库版本
    init: Function, //加载地图完成后的callback
    plugins: Array, //开启的插件
    /*zoom: Number, //缩放等级
    center: Array, //中心点
    style: String, //地图样式
    lang: String, //使用的语言
    defaultCursor: String, //使用的鼠标样式
    animateEnable: Boolean, //地图平移过程中是否使用动画
    dragEnable: Boolean, //是否可以通过鼠标拖拽平移*/
    setting: Object, //地图初始化设置
    AMapInstance: Object //高德地图的实例对象
  },
  data() {
    return {
      map: null
    };
  },
  destroyed() {
    this.map && this.map.destroy();
  },
  async mounted() {
    // 已载入高德地图API，则直接初始化地图
    // console.log(this.AMap,window.AMap)
    if (window.AMap && window.AMapUI) {
      this.initMap();
      // 未载入高德地图API，则先载入API再初始化
    } else {
      await this.remoteLoad(
        `https://webapi.amap.com/maps?v=${this.version}&key=${this.amapKey}`,
        this.initMap //异步加载
      );
      await this.remoteLoad(
        `http://webapi.amap.com/ui/1.0/main.js?v=${this.UiVersion}`
      );
    }
  },
  methods: {
    initMap() {
      //创建高德地图实例
      let mapElement = this.$el.querySelector(".lynn-map");
      const elementID = this.vid || this.guid();
      mapElement.id = elementID;
      // eslint-disable-next-line no-undef
      this.map = new AMap.Map(elementID, this.setting);
      //添加插件
      this.convertPluginsProps();
      //返回实例
      if (this.AMapInstance) this.AMapInstance.setMap(this.map);
    },
    guid() {
      let s = [];
      let hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    },
    convertPluginsProps() {
      const pluginsNames = this.plugins.map(value => value.name);
      this.map.plugin(pluginsNames, () => {
        this.plugins.forEach(value => {
          this.addPluginToMap(value);
        });
      });
    },
    addPluginToMap(plugin) {
      //format plugin name to support AMap.Xxx or Xxx
      if (!plugin.name.includes("AMap.")) {
        plugin.name = `AMap.${plugin.name}`;
      }
      let pluginInstance;
      switch (plugin.name) {
        //https://lbs.amap.com/api/javascript-api/reference/map-control
        //组合了旋转、倾斜、复位、缩放在内的地图控件
        case "AMap.ControlBar":
          pluginInstance = new AMap.ControlBar(plugin.options);
          this.map.addControl(pluginInstance);
          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //地图类型切换插件。用户通过该插件进行地图切换
        case "AMap.MapType":
          pluginInstance = new AMap.MapType(plugin.options);
          this.map.addControl(pluginInstance);
          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //地图鹰眼插件
        case "AMap.OverView":
          pluginInstance = new AMap.OverView(plugin.options);
          this.map.addControl(pluginInstance);
          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //比例尺插件。位于地图右下角，用户可控制其显示与隐藏
        case "AMap.Scale":
          pluginInstance = new AMap.Scale();
          this.map.addControl(pluginInstance);
          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //地图操作工具条插件。可支持方向导航、位置定位、视野级别缩放、视野级别选择等操作
        case "AMap.ToolBar":
          pluginInstance = new AMap.ToolBar(plugin.options);
          this.map.addControl(pluginInstance);
          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //https://lbs.amap.com/api/javascript-api/reference/location
        //定位服务插件
        case "AMap.Geolocation":
          pluginInstance = new AMap.ToolBar(plugin.options);
          this.map.addControl(pluginInstance);

          pluginInstance.getCurrentPosition();

          AMap.event.addListener(pluginInstance, "complete", plugin.onComplete); //返回定位信息
          AMap.event.addListener(pluginInstance, "error", plugin.onError); //返回定位出错信息

          //返回实例
          if (this.AMapInstance)
            this.AMapInstance.setPlugin(plugin.name, pluginInstance);
          break;

        //用于在地图上弹出一个详细信息展示窗体
        case "AMap.AdvancedInfoWindow":
          break;

        //地理编码与逆地理编码类
        case "AMap.Geocoder":
          break;

        //输入提示，根据输入关键字提示匹配信息
        case "AMap.Autocomplete":
          break;

        //地点搜索服务插件，提供某一特定地区的位置查询服务
        case "AMap.PlaceSearch":
          break;

        //麻点图插件，提供海量搜索结果的辅助显示功能
        case "AMap.PlaceSearchLayer":
          break;

        //行政区查询服务，提供行政区相关信息
        case "AMap.DistrictSearch":
          break;

        //公交路线服务，提供公交路线相关信息查询服务
        case "AMap.LineSearch":
          break;

        //公交站点查询服务，提供途经公交线路、站点经纬度等信息
        case "AMap.StationSearch":
          break;

        default:
          break;
      }
    },
    remoteLoad(url, hasCallback) {
      return createScript(url);
      /**
       * 创建script
       * @param url
       * @returns {Promise}
       */
      function createScript(url) {
        const scriptElement = document.createElement("script");
        document.body.appendChild(scriptElement);
        const promise = new Promise((resolve, reject) => {
          scriptElement.addEventListener(
            "load",
            e => {
              removeScript(scriptElement);
              if (!hasCallback) {
                resolve(e);
              }
            },
            true
          );

          scriptElement.addEventListener(
            "error",
            e => {
              removeScript(scriptElement);
              reject(e);
            },
            true
          );

          if (hasCallback) {
            window.____callback____ = function() {
              hasCallback();
              resolve();
              window.____callback____ = null;
            };
          }
        });

        if (hasCallback) {
          url += "&callback=____callback____";
        }

        scriptElement.src = url;

        return promise;
      }

      /**
       * 移除script标签
       * @param scriptElement script dom
       */
      function removeScript(scriptElement) {
        document.body.removeChild(scriptElement);
      }
    }
  }
};
</script>

<style scoped></style>
