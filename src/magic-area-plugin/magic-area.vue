<template lang="pug">
  .magic-area(ref='magicArea', v-show='show')
    .content
      //- 当前用户常用路由导航
      .recent-route-nav.route-nav
        div 最近使用的路由
        .matched-routes
          .matched-route(
            :key='currentUserRecentRouteIndex', 
            @click='goPage(currentUserRecentRoute.index)', 
            v-for='(currentUserRecentRoute, currentUserRecentRouteIndex) in currentUserRecentRoutes'
          )
            span {{ currentUserRecentRoute.name }}
            span :{{ currentUserRecentRoute.index }}

      //- 搜索路由导航
      .search-route-nav.route-nav
        input(placeholder='搜索: 请输入侧边栏路由的title', type='text', v-model='targetRouteTitle')
        .matched-routes
          .matched-route(:key='matchedRouteIndex', @click='goPage(matchedRoute.index)', v-for='(matchedRoute, matchedRouteIndex) in matchedRoutes')
            span(v-html='matchedRoute.name')
            span :{{ matchedRoute.index }}

      //- 打开源码
      .open-source-code
        button(@click='goFile') 进入当前vue文件

      //- 账号存储区
      .auto-login
        button(@click='addUserInfo') 添加用户信息
        .user-infos
          .user-info(
            :key='userInfo.id', 
            v-for='(userInfo, userInfoIndex) in userInfos'
            :class="{'user-info_active': userInfoIndex === currentUserInfoIndex}"
          )
            div
              span 标题
              input(type='text', v-model='userInfo.title')
            div
              span 用户
              input(type='text', v-model='userInfo.username')
            div
              span 密码
              input(type='text', v-model='userInfo.password')
            div
              span 常用路由
              input(type='text', v-model='userInfo.recentRoutes')
            button(@click='deleteUserInfo(userInfo)') 删除此信息

    .footer(ref='footer')
      div 提示: ctrl + m 切换隐藏显示
      div 提示: ctrl + 左键 点击元素进入组件源码
      div 提示: ctrl + l + 数字 自动登录
</template>

<script>
import _ from "lodash";
import { drag } from "@src/utils/drag";

export default {
  components: {},

  props: {
    routeDatas: {
      type: Array,
      default: () => []
    },

    launchEditor: {
      type: Function,
      default: null
    },

    loginBtnSelector: {
      type: String,
      default: ""
    },

    appendBtnSelector: {
      type: String,
      default: ""
    },

    appendBtnDelay: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      targetRouteTitle: "",
      matchedRoutes: [],
      show: true,
      userInfos: [],
      currentUserInfoIndex: 0
    };
  },

  computed: {
    currentUserInfo() {
      return this.userInfos[this.currentUserInfoIndex] || {};
    },

    currentUserRecentRoutes() {
      if (this.currentUserInfo.recentRoutes) {
        const titles = this.currentUserInfo.recentRoutes.split(',')
        const routes = this.routeDatas.filter((routeData) => {
          return titles.includes(routeData.name)
        })
        return routes
      }
      return []
    },

    localData() {
      const attrsNeedLocal = ["show", "userInfos", "currentUserInfoIndex"];
      const obj = attrsNeedLocal.reduce((next, attr) => {
        next[attr] = this[attr];
        return next
      }, {});
      return obj;
    }
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

    localData: {
      handler() {
        this.updateLocalAll(this.localData);
      },
      deep: true
    }
  },

  async mounted() {
    // 读取localStorage中的显示情况
    const localData =
      JSON.parse(localStorage.getItem("yyf-library-magic-area-data")) || {};
    Object.assign(this, localData);

    // 快捷键
    document.onkeydown = async e => {
      // console.log(e.key, "e.key");
      // 切换面板的显示隐藏
      if ("m" === e.key && e.ctrlKey) {
        this.show = !this.show;
      }

      // 切换当前使用的用户信息
      if (/\d/.test(e.key) && e.altKey) {
        this.currentUserInfoIndex = +e.key - 1;
      }

      // 自动登录
      if ("i" == e.key && e.ctrlKey) {
        // 填入用户名密码
        const inputs = document.querySelectorAll("input");
        inputs[0].value = this.currentUserInfo.username;
        inputs[0].dispatchEvent(new Event("input"));

        inputs[1].value = this.currentUserInfo.password;
        inputs[1].dispatchEvent(new Event("input"));

        // 点击登录按钮
        const loginBtn = document.querySelectorAll(this.loginBtnSelector);
        loginBtn[0].click();

        // 点击强行登录的确定, 有一定延迟
        if (this.appendBtnSelector) {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              const appendBtn = document.querySelectorAll(
                this.appendBtnSelector
              );
              if (appendBtn[0]) {
                appendBtn[0].click();
              }
              resolve();
            }, this.appendBtnDelay);
          });
        }

        // 登录用户信息对应的常用路由
        if (this.currentUserRecentRoutes.length) {
          this.goPage(this.currentUserRecentRoutes[0].index);
        }
      }
    };

    // 拖拽
    const { magicArea, footer } = this.$refs;

    drag(magicArea, footer, {
      savePosition: true
    });
  },

  methods: {
    updateLocalAll(localData) {
      localStorage.setItem(
        "yyf-library-magic-area-data",
        JSON.stringify(localData)
      );

      // console.log(
      //   localStorage.getItem("yyf-library-magic-area-data"),
      //   "local str"
      // );
    },

    goPage(path) {
      if (!path) return;
      this.$router.push(path);
    },

    goFile() {
      const filePath = _.last(this.$route.matched).components.default.__file;

      this.launchEditor(filePath);
    },

    addUserInfo() {
      this.userInfos.push({
        title: "",
        username: "",
        password: "",
        recentRoutes: "",
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


<style lang="sass" scoped>
.magic-area
  border: 1px solid #000
  border-radius: 20px
  top: 100px
  left: 300px
  position: fixed
  background: #fff
  z-index: 2000
  box-shadow: 2px 2px 2px 2px #888888
  overflow: hidden
  .content
    padding: 10px
    .route-nav
      .matched-routes
        margin: 5px
        padding: 5px
        .matched-route
          border-bottom: 1px solid #000
          margin: 10px 0 10px 0
          background: wheat
          cursor: pointer
    .open-source-code
    .auto-login
      .user-infos
        max-height: 150px
        overflow: auto
        .user-info
          border: 1px solid #000
          margin-top: 10px
        .user-info_active
          border: 2px solid red

  .footer
    background: darkorange
    cursor: move
    height: 100px
    padding: 10px
</style>
