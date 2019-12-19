import Vue from "vue";

// import "./plugins/ant-design-vue";
// import "ant-design-vue/dist/antd.css";

import "./plugins/element-ui";
import 'element-ui/lib/theme-chalk/index.css';

import App from "./App.vue";
import router from "./router/router";

Vue.config.productionTip = false;

window.Vue = Vue;

const plugin = {
  install(Vue, options) {
    Vue.mixin({
      mounted() {
        this.__injectedFn = (e) => {
          e.stopPropagation()
          if (e.ctrlKey) {
            console.log(e,'e')
            console.log(this.$options.__file, 'el click')
          }
        }
        console.log('mounted')
        this.$el.addEventListener('click', this.__injectedFn)
      },

      destroyed(){
        this.$el.removeEventListener('click', this.__injectedFn)
      }
    });
  }
};
Vue.use(plugin);


new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
