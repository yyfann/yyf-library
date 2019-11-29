import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
console.log(router,'router')

Vue.config.productionTip = false;

window.Vue = Vue;

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
