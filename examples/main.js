import Vue from "vue";

// import "./plugins/ant-design-vue";
// import "ant-design-vue/dist/antd.css";

import "./plugins/element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router/router";
import _ from 'lodash'

Vue.config.productionTip = false;

window.Vue = Vue;
window._ = _;

import { magicAreaPluginClient } from "@src/index.js";
import routerRawDatas from "./router/routes/main-routes";

// 路由映射配置
const routeDatas = routerRawDatas.map(routerRawData => {
  return {
    name: routerRawData.meta.title,
    index: routerRawData.path
  };
});


// devServer 的端口号
const devServerPort = 8090;

new magicAreaPluginClient(Vue, router, routeDatas, devServerPort, {
  loginBtnSelector: ".login-yyy",
  appendBtnSelector: ".append-btn",
  appendBtnDelay: 3000
});


new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
