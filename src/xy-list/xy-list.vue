<!-- @file xy-list-ele 一个让你提前下班20分钟的组件 -->
<template>
  <div>
    <el-table
      :data="listData"
    > 
      <slot></slot>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.current"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script>

export default {
  name: 'XyList',
  components: {},
  props: {
    // 数据源,可以使api接口, 也可以是假数据列表
    api: {
      type: String,
    },

    // 请求数据 页码参数 字段名
    pageNumField: {
      type: String,
      default: 'currentPage',
    },

    // 请求数据 页码参数 字段名
    pageSizeField: {
      type: String,
      default: 'pageSize',
    },

    // 从请求响应中取后端数据 的路径 (注意项目里的请求封装情况)
    listPath: {
      type: String,
      default: 'data',
    },

    // 从请求响应中取后端数据总数 的路径
    totalCountPath: {
      type: String,
      default: 'totalCount',
    },

    // 从请求响应中取后端每页条数 的路径
    pageSizePath: {
      type: String,
      default: '',
    },

    data: {
      type: Array,
      default: () => [],
    },

    searchQuery: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },

      listData: [],
    };
  },

  computed: {
    // 发送请求的参数, 分页相关的字段名可能和a-table的不用
    params() {
      return {
        ...this.searchQuery,
        [`${this.pageNumField}`]: this.pagination.current,
        [`${this.pageSizeField}`]: this.pagination.pageSize,
        // 后端必须要加的
        isCountQuery: true,
      };
    },
  },

  watch: {
    searchQuery() {
      this.pagination.current = 1;
    },

    params: {
      handler() {
        this.getList();
      },
      immediate: true,
      deep: true,
    },

    data: {
      handler() {
        if(this.data.length) {
          this.getList();
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    // 获取列表数据
    getList() {
      if (this.api) {
        axios.get(this.api, this.params).then(resultObject => {
          console.log(resultObject,'xy-list data')
          this.listData = _.get(resultObject, this.listPath);
          this.pagination.total = +_.get(resultObject, this.totalCountPath);
        });
      } else if (this.data) {
        this.listData = this.data;
      }
    },

    handleCurrentChange(current) {
      this.pagination = { 
        ...this.pagination,
        current,
      };
    },

    handleSizeChange(pageSize) {
      this.pagination = { 
        ...this.pagination,
        pageSize,
      };
    },
  },
};
</script>
