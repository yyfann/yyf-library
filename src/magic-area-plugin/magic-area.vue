<template lang="pug">
  .magic-area(ref='magicArea', v-show='show')
    .content
      //- 当前用户常用路由导航
      .recent-route-nav.route-nav(
        v-show="showAreas.includes('recent-route-nav')"
      )
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
      .search-route-nav.route-nav(
        v-show="showAreas.includes('search-route-nav')"
      )
        input(
          placeholder='搜索: 请输入侧边栏路由的title', 
          type='text', 
          v-model='targetRouteTitle',
          ref="searchRouteInput"
        )
        .matched-routes
          .matched-route(:key='matchedRouteIndex', @click='goPage(matchedRoute.index)', v-for='(matchedRoute, matchedRouteIndex) in matchedRoutes')
            span(v-html='matchedRoute.name')
            span :{{ matchedRoute.index }}

      //- 账号存储区
      .auto-login(
        v-show="showAreas.includes('auto-login')"
      )
        button(@click='addUserInfo') 添加用户信息
        .user-infos(
          ref="userInfos"
        )
          .user-info(
            :key='userInfo.id', 
            v-for='(userInfo, userInfoIndex) in userInfos'
          )
            div
              .order 序号: {{ userInfoIndex + 1 }}
              button(@click='deleteUserInfo(userInfo)') 删除此信息
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
              textarea.recent-routes-textarea(
                type='text', v-model='userInfo.recentRoutes'
              )
      
      //- 展示请求 暂时不用
      //- .responses-area(
      //-   v-show="showAreas.includes('quick-network')"
      //-   style="background: #292c33"
      //- )
      //-   json-viewer(
      //-     :value="responsesJson"
      //-     :expand-depth="2"
      //-     style="background: wheat"
      //-   )
        //- tree-view(
        //-   :data='responsesJson' :options='{maxDepth: 3}'
        //-   style="background: wheat"
        //- )
        //- json-view(
        //-   :data='responsesJson', 
        //-   theme="one-dark",
        //-   style="background: #292c33"
        //-   :deep="5"
        //- )

    .footer
      .toggle-panel
        multi-select(
          mode="multi"
          :options="allAreas"
          :values.sync="showAreas"
        )
      .tips(ref='footer')
        div ctrl + m 切换隐藏显示
        div ctrl + 左键 点击元素进入组件源码
        div ctrl + l + 数字 自动登录
</template>

<script>
import _ from "lodash";
import { drag } from "@src/utils/drag";
// import jsonView from "vue-json-views";
import multiSelect from "@src/multi-select/multi-select.vue";

export default {
  components: {
    multiSelect,
    // jsonView
  },

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
    },

    responses: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      targetRouteTitle: "",
      matchedRoutes: [],
      show: true,
      userInfos: [],
      allAreas: [
        {
          label: "用户常用路由",
          value: "recent-route-nav"
        },
        {
          label: "路由搜索",
          value: "search-route-nav"
        },
        {
          label: "用户信息",
          value: "auto-login"
        },
        {
          label: "网络请求",
          value: "quick-network"
        }
      ],
      showAreas: []
    };
  },

  computed: {
    currentUserInfo() {
      return this.userInfos[0] || {};
    },

    currentUserRecentRoutes() {
      if (this.currentUserInfo.recentRoutes) {
        const routeFields = this.currentUserInfo.recentRoutes
          .split(/,\n*/)
          .filter(x => x);

        // 系统内置路由(通过文字提取)
        const optionsRoutes = _.chain(routeFields)
          .filter(routeField => {
            return routeField.indexOf(":") === -1;
          })
          .map(routeField => {
            const target = this.routeDatas.find(routeData => {
              return routeData.name === routeField;
            });
            return target || {};
          })
          .value();

        // 自定义路由
        const customRoutes = routeFields
          .filter(routeField => {
            return routeField.indexOf(":") > -1;
          })
          .map(routeField => {
            const [name, index] = routeField.split(":");
            return {
              name,
              index
            };
          });

        return [...optionsRoutes, ...customRoutes];
      }
      return [];
    },

    localData() {
      const attrsNeedLocal = ["show", "userInfos", "showAreas"];
      const obj = attrsNeedLocal.reduce((next, attr) => {
        next[attr] = this[attr];
        return next;
      }, {});
      return obj;
    },

    responsesJson() {
      // 数组的形式
      // return this.responses.map(({data, config}) => {
      //   return {
      //     url: config.url,
      //     pageData: data.resultObject.pageData
      //   }
      // })

      // console.log(this.responses,'this.responses')

      // 对象的形式
      const obj = this.responses.reduce((obj, item) => {
        if (_.get(item, "data.resultObject")) {
          obj[item.config.url] = item.data.resultObject.pageData;
        }
        return obj;
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
        localStorage.setItem(
          "yyf-library-magic-area-data",
          JSON.stringify(this.localData)
        );
      },
      deep: true
    },

    show() {
      this.searchRouteInputFocus();
    }
  },

  async mounted() {
    // 读取localStorage中的显示情况
    const localData =
      JSON.parse(localStorage.getItem("yyf-library-magic-area-data")) || {};
    Object.assign(this, localData);

    // 快捷键
    document.onkeydown = async e => {
      // 切换面板的显示隐藏
      if ("m" === e.key && e.ctrlKey) {
        this.show = !this.show;
      }

      // 切换当前使用的用户信息
      if (/\d/.test(e.key) && e.altKey) {
        // 将当前使用的用户提到最前面
        const user = this.userInfos.splice(+e.key - 1, 1)[0];
        if (user) {
          this.userInfos.unshift(user);
          // 重置滚动条
          this.$refs.userInfos.scrollTop = 0;
        }
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

    this.searchRouteInputFocus();
  },

  methods: {
    goPage(path) {
      if (!path) return;
      this.$router.push(path);
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
    },

    searchRouteInputFocus() {
      this.$nextTick(() => {
        this.$refs.searchRouteInput.focus();
      });
    }
  }
};
</script>


<style lang="sass" scoped>
.magic-area
  border: 1px solid #000
  top: 100px
  left: 300px
  border-radius: 20px
  position: fixed
  background: #fff
  z-index: 2000
  box-shadow: 2px 2px 2px 2px #888888
  .content
    padding: 10px
    position: relative
    border-radius: 20px 20px 0 0
    .route-nav
      .matched-routes
        margin: 5px
        padding: 5px
        .matched-route
          border-bottom: 1px solid #000
          margin: 10px 0 10px 0
          background: wheat
          cursor: pointer
    .open-route-source-code
    .auto-login
      .user-infos
        max-height: 150px
        overflow: auto
        .user-info
          border: 1px solid #000
          margin-top: 10px
          .order
            display: inline
            margin-right: 20px
          .recent-routes-textarea
            width: 200px
            height: 50px
        .user-info:first-child
          border: 2px solid red
    .responses-area
      // width: 200px
      height: 400px
      position: absolute
      top: 0
      right: 450px
      overflow: auto
  .footer
    height: 120px
    border-radius: 0 0 20px 20px
    display: flex
    overflow: hidden
    .toggle-panel
      width: 200px
      .area-togglers
    .tips
      cursor: move
      background: darkorange
</style>
