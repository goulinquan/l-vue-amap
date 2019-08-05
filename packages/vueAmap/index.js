//导入组件
import LAMap from "./src/map.vue";

// 为组件添加 install 方法，用于按需引入
LAMap.install = function(Vue) {
  Vue.component(LAMap.name, LAMap);
};

export default LAMap;
