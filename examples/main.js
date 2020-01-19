import Vue from "vue";

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router/router";
import _ from 'lodash'
import axios from 'axios'



window.Vue = Vue;
window._ = _;
window.axios = axios;


import { magicAreaPluginClient } from "@src/index.js";
import routerRawDatas from "./router/routes/main-routes";

// axios请求列表
const responses = []
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response,'response')
  responses.push(response)
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

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
  inspectUiLibrary: 'element-ui',
  responses,
});


new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
