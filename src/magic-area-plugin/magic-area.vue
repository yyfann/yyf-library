<template>
  <div 
    v-show="show" 
    class="magic-area"
    drag-handle=".drag"
  >
    <input
      placeholder="请输入侧边栏路由的title"
      type="text"
      v-model="targetRouteTitle"
    />
    <div>当前匹配路由: {{ targetRoutePath }}</div>
    <button @click="goPage">路由跳转</button>
    <br />
    <button @click="goFile">进入vue文件</button>
    <div>ctrl + m 切换隐藏显示</div>
    <!-- <div class="drag">可拖拽区域</div> -->
  </div>
</template>

<script>
import axios from "axios";
import _ from 'lodash'

export default {
  components: {
  },

  props: {
    routeDatas: {
      type: Array,
      default: () => ([]),
    },

    devServerPort: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      targetRouteTitle: "",
      show: true,
    };
  },
  mounted() {},
  created() {
    document.onkeydown = (e) => {
      if(77 == e.keyCode && e.ctrlKey) {
        this.show = !this.show
      }
    }

  },
  computed: {
    targetRoutePath() {
      const targetMenu = this.routeDatas.find(routeData => {
        return routeData.name === this.targetRouteTitle;
      });
      if (targetMenu) {
        return targetMenu.index;
      }
      return "没有匹配!";
    }
  },
  methods: {
    goPage() {
      if (this.targetRoutePath === "没有匹配!") return;
      this.$router.push(this.targetRoutePath);
    },
    goFile() {
      const filePath = _.last(this.$route.matched).components.default.__file;

      axios
        .get(`http://localhost:${this.devServerPort}/code`, {
          params: {
            filePath: `-g ${filePath}`
          }
        })
        .then(res => {
          console.log(res, "res");
        });
    }
  }
};
</script>

<style scoped>
.magic-area {
  border: 1px solid #000;
  border-radius: 20px;
  padding: 10px;
  top: 100px;
  left: 300px;
  position: fixed;
  background: #fff;
  box-shadow: 2px 2px 2px 2px #888888;
}
</style>
