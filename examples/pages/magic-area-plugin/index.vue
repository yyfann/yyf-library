<template>
  <div>
    <list></list>

    <input
      @change="change"
      type="text"
      v-model="input1"
    >
    <div>{{ input1 }}</div>
    <input type="text">
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
import list from "./list";

export default {
  components: { list },
  data() {
    return {
      input1: "",
      showAppendBtn: false
    };
  },

  methods: {
    change() {
      console.log(this.input1, "this.input1");
      console.log("change!!");
    },

    login() {
      console.log("login");
      setTimeout(() => {
        this.showAppendBtn = true;
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