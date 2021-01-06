<template>
  <div
    class="magic-area"
    ref="magicArea"
    v-show="show"
  >
    <div class="content">
      <div
        class="recent-route-nav route-nav"
        v-show="showAreas.includes('recent-route-nav')"
      >
        <div>最近使用的路由</div>
        <div class="matched-routes">
          <div
            :key="currentUserRecentRoutePath"
            @click="goPage(currentUserRecentRoute.path )"
            class="matched-route"
            v-for="(currentUserRecentRoute, currentUserRecentRoutePath) in currentUserRecentRoutes"
          >{{ currentUserRecentRoute.name }} : {{ currentUserRecentRoute.path }}</div>
        </div>
      </div>
      <div
        class="search-route-nav route-nav"
        v-show="showAreas.includes('search-route-nav')"
      >
        <input
          placeholder="搜索: 请输入侧边栏路由的title"
          ref="searchRouteInput"
          type="text"
          v-model="targetRouteTitle"
        />
        <div class="matched-routes">
          <div
            :key="matchedRoutePath"
            @click="goPage(matchedRoute.path )"
            class="matched-route"
            v-for="(matchedRoute, matchedRoutePath) in matchedRoutes"
          >
            <span v-html="matchedRoute.name"></span>
            <span>:{{ matchedRoute.path }}</span>
          </div>
        </div>
      </div>
      <div
        class="auto-login"
        v-show="showAreas.includes('auto-login')"
      >
        <button @click="addUserInfo">添加用户信息</button>
        <div
          class="user-infos"
          ref="userInfos"
        >
          <div
            :key="userInfo.id"
            class="user-info"
            v-for="(userInfo, userInfoIndex) in userInfos"
          >
            <div>
              <div class="order">序号: {{ userInfoIndex + 1 }}</div>
              <button @click="deleteUserInfo(userInfo)">删除此信息</button>
            </div>
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
            <div>
              <span>常用路由</span>
              <textarea
                class="recent-routes-textarea"
                type="text"
                v-model="userInfo.recentRoutes"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <find-path></find-path>
      <!-- <div
        class="responses-area"
        style="background: #292c33"
        v-show="showAreas.includes('quick-network')"
      >
        <json-viewer
          :expand-depth="2"
          :value="responsesJson"
          style="background: wheat"
        ></json-viewer>
        <tree-view
          :data="responsesJson"
          :options="{maxDepth: 3}"
          style="background: wheat"
        ></tree-view>
        <json-view
          :data="responsesJson"
          :deep="5"
          style="background: #292c33"
          theme="one-dark"
        ></json-view>
      </div>-->
    </div>
    <div class="footer">
      <div class="toggle-panel">
        <multi-select
          :options="allAreas"
          :values.sync="showAreas"
          mode="multi"
        ></multi-select>
      </div>
      <div
        class="tips"
        ref="footer"
      >
        <button @click="showTips = !showTips">使用说明</button>
        <template v-if="showTips">
          <div class="tips-title">ctrl + m:</div>
          <div>切换隐藏显示</div>
          <div class="tips-title">ctrl + 左键点击元素:</div>
          <div>进入标签源码</div>
          <div class="tips-title">alt + 左键点击组件:</div>
          <div>进入组件npm包组件源码</div>
          <div class="tips-title">ctrl + l + 数字:</div>
          <div>自动登录</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { drag } from "@src/utils/drag";
// import jsonView from "vue-json-views";
import multiSelect from "@src/multi-select/multi-select.vue";
import findPath from './components/find-path'
export default {
  components: {
    multiSelect,
    findPath,
    // jsonView
  },

  props: {
    routeDatas: {
      type: Array,
      default: () => []
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
      showTips: false,
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
        }
        // {
        //   label: "网络请求",
        //   value: "quick-network"
        // }
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
              return routeData.name.trim() === routeField;
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
            const [name, path] = routeField.split(":");
            return {
              name,
              path: path.trim()
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
    }

    // responsesJson() {
    //   // 数组的形式
    //   // return this.responses.map(({data, config}) => {
    //   //   return {
    //   //     url: config.url,
    //   //     pageData: data.resultObject.pageData
    //   //   }
    //   // })

    //   // console.log(this.responses,'this.responses')

    //   // 对象的形式
    //   const obj = this.responses.reduce((obj, item) => {
    //     if (_.get(item, "data.resultObject")) {
    //       obj[item.config.url] = item.data.resultObject.pageData;
    //     }
    //     return obj;
    //   }, {});
    //   return obj;
    // }
  },

  watch: {
    $route(val) {
      const routePath = val.fullPath;

      const targetMenu = this.routeDatas.find(routeData => {
        return routeData.path === routePath;
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
          this.goPage(this.currentUserRecentRoutes[0].path);
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
          overflow: hidden    
          text-overflow: ellipsis    
          white-space: nowrap   
          width: 300px
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
    // height: 120px
    border-radius: 0 0 20px 20px
    display: flex
    overflow: hidden
    .toggle-panel
      width: 130px
      
    .tips
      cursor: move
      background: darkorange
      flex: 1
      min-width: 100px
      .tips-title
      .tips-title::before
        content: ''
        display: inline-block
        width: 5px
        height: 5px   
        margin-right: 5px
        background: black   
        border-radius: 50%  
        // font-weight: bold
</style>
