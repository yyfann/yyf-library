<template>
  <xy-list
    :api="api"
    :search-query="searchForm"
    ref="xyList"
  >
    <el-table-column
      label="数据id"
      prop="id"
    ></el-table-column>
    <el-table-column
      label="名称"
      prop="name"
    ></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{row}">
        <el-button
          @click="detail(row)"
          type="text"
        >查看</el-button>
      </template>
    </el-table-column>
  </xy-list>
</template>

<script>
import xyList from "@src/xy-list/xy-list.vue";

export default {
  components: {
    xyList
  },
  data() {
    return {
      api: "/mock/list-data",
      searchForm: {}
    };
  },

  methods: {
    detail(row) {
      console.log(row, "row");
    }
  }
};
</script>

<style scoped>
</style>