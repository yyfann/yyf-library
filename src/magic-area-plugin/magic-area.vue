<template>
  <div
    class="magic-area"
    ref="magicArea"
    v-show="show"
  >
    <div class="content">
      <!-- 路由快捷导航 -->
      <div class="route-nav">
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
      </div>

      <!-- 打开源码 -->
      <div class="open-source-code">
        <button @click="goFile">进入当前vue文件</button>
      </div>

      <!-- 账号存储区 -->
      <div class="auto-login">
        <button @click="addUserInfo">添加用户信息</button>
        <div class="user-infos">
          <div
            :key="userInfo.id"
            v-for="(userInfo, userInfoIndex) in userInfos"
          >
            <div>
              <span>标题</span>
              <input
                type="text"
                v-model="userInfo.title"
              />
            </div>
            <div>
              <span>用户</span>
              <input
                type="text"
                v-model="userInfo.username"
              />
            </div>
            <div>
              <span>密码</span>
              <input
                type="text"
                v-model="userInfo.password"
              />
            </div>
            <button @click="deleteUserInfo(userInfo)">删除此信息</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="footer"
      ref="footer"
    >
      <div>提示: ctrl + m 切换隐藏显示</div>
      <div>提示: ctrl + l + 数字 自动登录</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";
import { drag } from "@src/utils/drag";

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
    },

    loginBtnSelector: {
      type: String,
      default: ""
    },

    appendBtnSelector: {
      type: String,
      default: '',
    },

    appendBtnDelay: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      show: true,
      targetRouteTitle: "",
      targetFilePath: "",
      matchedRoutes: [],
      userInfos: []
    };
  },
  created() {
    // 读取localStorage中的显示情况
    const localData =
      JSON.parse(localStorage.getItem("yyf-library-magic-area-data")) || {};

    // 读取面板显示情况
    const { show, userInfos } = localData;
    this.show = show;
    this.userInfos = userInfos || [];

    document.onkeydown = e => {
      console.log(e.key, "e.key");
      // 组合键切换显示
      if ("m" === e.key && e.ctrlKey) {
        this.show = !this.show;
      }

      // 组合键自动登录
      if ("i" == e.key && e.ctrlKey) {
        // 填入用户名密码
        const inputs = document.querySelectorAll("input");
        inputs[0].value = this.userInfos[0].username;
        inputs[0].dispatchEvent(new Event('input'))

        inputs[1].value = this.userInfos[0].password;
        inputs[1].dispatchEvent(new Event('input'))

        // 点击登录按钮
        const loginBtn = document.querySelectorAll(this.loginBtnSelector);
        loginBtn[0].click();

        // 点击强行登录的确定, 有一定延迟
        setTimeout(() => {
          const appendBtn = document.querySelectorAll(this.appendBtnSelector);
          appendBtn[0].click()
        }, this.appendBtnDelay);
      }
    };
  },
  mounted() {
    const { magicArea, footer } = this.$refs;

    drag(magicArea, footer, {
      savePosition: true
    });
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
    },

    show() {
      this.updateLocal("show", this.show);
    },

    userInfos: {
      handler() {
        this.updateLocal("userInfos", this.userInfos);
      },
      deep: true
    }
  },

  methods: {
    updateLocal(key, value) {
      const localData =
        JSON.parse(localStorage.getItem("yyf-library-magic-area-data")) || {};

      localData[key] = value;

      localStorage.setItem(
        "yyf-library-magic-area-data",
        JSON.stringify(localData)
      );

      // console.log(localStorage.getItem("yyf-library-magic-area-data"),'local str')
    },

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
        .then(res => {});
    },

    addUserInfo() {
      this.userInfos.push({
        title: "",
        username: "",
        password: "",
        id: new Date().getTime()
      });
    },

    deleteUserInfo(userInfo) {
      this.userInfos = this.userInfos.filter(_userInfo => {
        return userInfo.id !== _userInfo.id;
      });
    }
  }
};
</script>

<style scoped>
.magic-area {
  border: 1px solid #000;
  border-radius: 20px;
  top: 100px;
  left: 300px;
  position: fixed;
  background: #fff;
  z-index: 2000;
  box-shadow: 2px 2px 2px 2px #888888;
  overflow: hidden;
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

.content {
  padding: 10px;
}

.user-infos {
  max-height: 150px;
  overflow: auto;
}

.footer {
  background: darkorange;
  height: 50px;
  cursor: move;
  padding: 10px;
  line-height: 50px;
}
</style>
