import Vue from "vue";
window.Vue = Vue;

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router/router";
import _ from 'lodash'
window._ = _;
import axios from 'axios'
window.axios = axios;
window.axiosInstance = axios.create({})



import { magicAreaPluginClient } from "@src/index.js";
import routerRawDatas from "./router/routes/main-routes";

// 路由映射配置
const routeDatas = routerRawDatas.map(routerRawData => {
  return {
    name: routerRawData.meta.title,
    path: routerRawData.path
  };
});

new magicAreaPluginClient(Vue, router, routeDatas, {
  loginBtnSelector: ".login-yyy",
  appendBtnSelector: ".append-btn",
  appendBtnDelay: 3000,
  inspectUiLibrary: 'element-ui',
});


new Vue({
  router,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
