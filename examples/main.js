import Vue from "vue";

// import "./plugins/ant-design-vue";
// import "ant-design-vue/dist/antd.css";

import "./plugins/element-ui";
import 'element-ui/lib/theme-chalk/index.css';

import App from "./App.vue";
import router from "./router/router";

Vue.config.productionTip = false;

window.Vue = Vue;

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
