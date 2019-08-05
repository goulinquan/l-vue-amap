# l-vue-amp
The l-vue-amap based on vue.js that can make you use amap.js easily on vue.

## 安装
    npm install l-vue-amap -s
## 基本用法
    <l-amap
      ampa-key="your amap key"
      :setting="setting"
      :plugins="plugins"
      ui-version="1.0.11"
      version="1.4.15"
      style="width: 600px; height: 600px"
      :a-map-instance="aMapInstance"
    ></l-amap>
    
    <script>
    import { AMapInstance } from "l-vue-amap";
    let aMapInstance = new AMapInstance();
    export default {
    ...
      data() {
        return {
            aMapInstance,
            setting: {
                center: [122.994163, 41.108239],
                zoom: 8,
                mapStyle: "amap://styles/13aa5ab123da7a121814525b8cb486cd"
            },
            plugins: [{ name: "AMap.ToolBar",options: {} }] //name为 "ToolBar" 或 "AMap.ToolBar" 皆可
        };
      }
    }
    </script>
    
AMapInstance.getMap();  获取地图实例
AMapInstance.getPlugin(name);  获取插件实例, name为 "ToolBar" 或 "AMap.ToolBar" 皆可

plugins: [{ name: "AMap.Geolocation",options: object,onComplete: function, onError: function }] 
定位插件提供成功/失败的回调 onComplete/onError
