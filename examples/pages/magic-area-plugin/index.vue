<template>
  <div>
    <button @click="fn">打开面板</button>

    <list></list>

    <input
      @change="change"
      type="text"
      v-model="input1"
    />
    <div>{{ input1 }}</div>
    <input type="text" />
    <button
      @click="login"
      class="login-yyy"
    >登录按钮</button>

    <div
      @click="clickAppendBtn"
      class="append-btn"
      v-show="showAppendBtn"
    >强行登录</div>
  </div>
</template>

<script>
import Vue from "vue";
import router from "../../router/router";
import magicAreaPluginClient from "@src/magic-area-plugin/client.js";
import routerRawDatas from "../../router/routes/main-routes";

import list from './list'

// 路由映射配置
const routeDatas = routerRawDatas.map(routerRawData => {
  return {
    name: routerRawData.meta.title,
    index: routerRawData.path
  };
});

console.log(routeDatas, "routeDatas");

// devServer 的端口号
const devServerPort = 8090;

export default {
  components: {list},
  data() {
    return {
      input1: "",
      showAppendBtn: false
    };
  },

  mounted() {
    this.fn();
  },

  methods: {
    fn() {
      new magicAreaPluginClient(Vue, router, routeDatas, devServerPort, {
        loginBtnSelector: ".login-yyy",
        appendBtnSelector: ".append-btn",
        appendBtnDelay: 3000,
      });
    },

    change() {
      console.log(this.input1, "this.input1");
      console.log("change!!");
    },

    login() {
      console.log("login");
      setTimeout(() => {
        this.showAppendBtn = true
      }, 1000);
    },

    clickAppendBtn() {
      console.log("clickAppendBtn");
    }
  }
};
</script>

<style scoped>
</style>