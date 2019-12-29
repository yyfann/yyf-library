import Vue from "vue";

import ElementUI from 'element-ui';
Vue.use(ElementUI);
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
  appendBtnDelay: 3000,
  inspectUiLibrary: 'element-ui'
});


new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
