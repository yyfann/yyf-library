<template>
  <div>
    <el-input
      id="elInput"
      placeholder="请输入内容"
      v-model="input"
    ></el-input>

    <input type="text" id="input">

    <el-select
      placeholder="请选择"
      v-model="value"
    >
      <el-option
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-for="item in options"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data() {
    return {
      input: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },

  mounted() {
    setTimeout(() => {
      
      const inputEl = document.getElementById('elInput')
      console.log(inputEl,'inputEl')
      inputEl.focus()
    }, 1000);
  },

  methods: {}
};
</script>

<style scoped>
</style>