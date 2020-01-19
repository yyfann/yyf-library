<template>
  <div>
    <!-- 测试打开html源码 -->
    <list></list>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="日期"
        prop="date"
        width="180"
      ></el-table-column>
      <el-table-column
        label="姓名"
        width="180"
      >
        <template slot-scope="scope">
          {{ '就是: ' + scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        prop="address"
      ></el-table-column>
    </el-table>

    <el-form label-width="80px">
      <el-form-item label="活动名称1">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="活动名称2">{{ form.name }}</el-form-item>
      <el-form-item label="活动名称3">
        <div>{{ form.name }}</div>
      </el-form-item>
    </el-form>


    <!-- 测试登录 -->
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
      showAppendBtn: false,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],

      form: {
        name: '写loader的活动'
      }
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