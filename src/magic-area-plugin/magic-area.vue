<template>
  <div
    class="magic-area"
    ref="magicArea"
    v-show="show"
  >
    <input
      placeholder="请输入侧边栏路由的title"
      type="text"
      v-model="targetRouteTitle"
    />
    <div class="matched-routes">
      <div
        :key="matchedRouteIndex"
        @click="goPage(matchedRoute.index)"
        class="matched-route"
        v-for="(matchedRoute, matchedRouteIndex) in matchedRoutes"
      >
        <span v-html="matchedRoute.name"></span>
        <span>:{{ matchedRoute.index }}</span>
      </div>
    </div>
    <!-- <div>当前匹配文件路径: {{ targetFilePath }}</div> -->
    <button @click="goFile">进入当前vue文件</button>
    <div>ctrl + m 切换隐藏显示</div>
    <div
      class="drag"
      ref="dragArea"
    >可拖拽区域</div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  components: {},

  props: {
    routeDatas: {
      type: Array,
      default: () => []
    },

    devServerPort: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      show: true,
      // targetRouteTitle: "",
      targetRouteTitle: "测试",
      targetFilePath: "",
      // matchedRoutes: [],
      matchedRoutes: this.routeDatas
    };
  },
  created() {
    // 组合键切换显示
    document.onkeydown = e => {
      if (77 == e.keyCode && e.ctrlKey) {
        this.show = !this.show;
      }
    };
  },
  mounted() {
    // 注册拖拽事件
    const { magicArea, dragArea } = this.$refs;
    console.log(magicArea, "magicArea");

    function yang(e) {
      var a = e.offsetX;
      var b = e.offsetY;
      document.onmousemove = function(e) {
        var x = e.clientX - a;
        var y = e.clientY - b;
        var h = document.documentElement.clientHeight;
        var w = document.documentElement.clientWidth;

        var xmax = w - magicArea.offsetWidth;
        var ymax = h - magicArea.offsetHeight;
        //判断边界
        if (x < 0) {
          x = 0;
        } else if (x > xmax) {
          x = xmax;
        }
        if (y < 0) {
          y = 0;
        } else if (y > ymax) {
          y = ymax;
        }

        magicArea.style.left = x + "px";
        magicArea.style.top = y + "px";

        return false;
      };
    }

    dragArea.onmousedown = yang;
    document.documentElement.onmouseup = function() {
      document.onmousemove = null;
    };
  },
  watch: {
    $route(val) {
      const routePath = val.fullPath;

      const targetMenu = this.routeDatas.find(routeData => {
        return routeData.index === routePath;
      });
      if (targetMenu) {
        this.targetRouteTitle = targetMenu.name;
      } else {
        this.targetRouteTitle = "";
      }
    },

    targetRouteTitle() {
      // 模糊匹配路由
      if (!this.targetRouteTitle) {
        this.matchedRoutes = [];
      } else {
        this.matchedRoutes = _.chain(this.routeDatas)
          // 匹配关键字
          .filter(routeData => {
            return routeData.name.search(this.targetRouteTitle) > -1;
          })
          // 高亮替换
          .map(routeData => {
            let replaceReg = new RegExp(this.targetRouteTitle, "g");
            let replaceString =
              '<span style="color: red">' + this.targetRouteTitle + "</span>";

            const hightLightName = routeData.name.replace(
              replaceReg,
              replaceString
            );

            return {
              ...routeData,
              name: hightLightName
            };
          })
          // 按照匹配程度(字数)排序
          .sortBy(routeData => routeData.name.length)
          .value();
      }
    }
  },

  methods: {
    goPage(path) {
      if (!path) return;
      this.$router.push(path);
    },
    goFile() {
      this.targetFilePath = _.last(
        this.$route.matched
      ).components.default.__file;
      const filePath = this.targetFilePath;

      axios
        .get(`http://localhost:${this.devServerPort}/code`, {
          params: {
            filePath: `-g ${filePath}`
          }
        })
        .then(res => {
          // console.log(res, "res");
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
  z-index: 2000;
  box-shadow: 2px 2px 2px 2px #888888;
}

.matched-routes {
  margin: 5px;
  padding: 5px;
}

.matched-route {
  border-bottom: 1px solid #000;
  margin: 10px 0 10px 0;
  background: wheat;
  cursor: pointer;
}

.drag {
  background: darkorange;
  height: 50px;
}
</style>
