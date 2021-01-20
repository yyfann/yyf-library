<template>
  <div>
    <div class="header">
      <div>copyNetwork</div>
      <div class="setting" @click="showSetting = !showSetting">设置</div>
    </div>
    <template v-if="showSetting">
      <div>
        <span>过滤</span>
        <input type="text" v-model="filterWord" />
      </div>
      <div>
        <span>成功/失败规则</span>
        <!-- 一个对象字符串, key是response的key, value是期望的值, 或者布尔值(判断有无) -->
        <input type="text" v-model="respValidExpression" />
      </div>
    </template>
    <div class="network-list">
      <div
        :key="respIndex"
        class="list-item"
        v-for="(resp, respIndex) in respsShow"
      >
        <div class="title" @click="resp.showDetail = !resp.showDetail">
          <div class="url">
            {{ resp.url }}
          </div>
          <div class="status" :class="getStatus(resp).className">
            {{ getStatus(resp).label }}
          </div>
        </div>
        <div class="detail" v-if="resp.showDetail">
          <textarea
            :value="resp.showText"
            cols="30"
            id
            name
            rows="5"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const prettier = require('prettier/standalone')
const prettierParserBabel = [require('prettier/parser-babel')]
import { copyToClipBoard } from '@src/utils/index'
import { proxy, unProxy } from 'ajax-hook'

export default {
  components: {},

  props: {},

  data() {
    return {
      responses: [],
      showSetting: false,
      filterWord: '',
      respValidExpression: ``,
      uniq: true,
      respsShow: [],
    }
  },

  computed: {
    localDataKey() {
      return 'yyf-library-magic-area-data_copyNetwork'
    },
    localData() {
      const attrsNeedLocal = ['filterWord', 'uniq', 'respValidExpression']
      const obj = {}
      attrsNeedLocal.forEach(key => {
        obj[key] = this[key]
      })
      return obj
    },

    factors() {
      return {
        resps: this.resps,
        filterWord: this.filterWord,
        uniq: this.uniq,
      }
    },

    // 有用的字段
    resps() {
      return this.responses.map(item => {
        item = _.cloneDeep(item)

        const {
          config: { url, method, body },
          response,
        } = item

        const res = {
          url,
          method,
          body,
          response,
        }

        // json字符串的内容parse一下
        _.forEach(res, (val, key) => {
          if (this.isJsonStr(val)) {
            res[key] = JSON.parse(val)
          }
        })

        return res
      })
    },
  },

  watch: {
    $route() {
      this.responses = []
    },

    factors() {
      let respsShow = _.chain(this.resps)
        .map(item => {
          const res = _.cloneDeep(item)

          const str = JSON.stringify(res)
          res.showText = this.prettierCode(str)
          res.showDetail = false

          return res
        })
        .filter(item => {
          return item.url.includes(this.filterWord)
        })
        .value()

      if (this.uniq) {
        respsShow.reverse()
        respsShow = _.uniqBy(respsShow, 'url')
      }

      this.respsShow = respsShow
    },

    localData: {
      handler() {
        localStorage.setItem(this.localDataKey, JSON.stringify(this.localData))
      },
      deep: true,
    },
  },

  async mounted() {
    // 读取localStorage中的显示情况
    const localData = JSON.parse(localStorage.getItem(this.localDataKey)) || {}
    Object.assign(this, localData)

    proxy({
      // tip: 三个函数都要有!!
      onRequest: (config, handler) => {
        handler.next(config)
      },
      onError: (err, handler) => {
        handler.next(err)
      },
      //请求成功后进入
      onResponse: (response, handler) => {
        this.responses.push(response)
        handler.next(response)
      },
    })
  },

  methods: {
    isJsonStr(str) {
      return _.isString(str) && _.startsWith(str, '{"')
    },

    getStatus(resp) {
      const validConfig = eval(`(${this.respValidExpression || '{}'})`)
      let valid = true
      _.forEach(validConfig, (val, key) => {
        const value = _.get(resp.response, key)
        if (!(value === val || !!value === val)) {
          valid = false
        }
      })
      const res = valid
        ? {
            className: 'success',
            label: '成功',
          }
        : {
            className: 'error',
            label: '失败',
          }
      return res
    },

    prettierCode(code) {
      const res = prettier.format(code, {
        parser: 'json',
        plugins: prettierParserBabel,
      })
      return res
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  .setting {
    cursor: pointer;
    color: blue;
  }
}
.network-list {
  .list-item {
    border-bottom: 1px solid #000;
    margin-top: 5px;
    .title {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      .url {
      }
      .status {
      }
      .success {
        color: forestgreen;
      }
      .error {
        color: red;
      }
    }
    .detail {
      textarea {
      width: 400px;
      height: 400px;
      background: wheat;
      font-size: 14px;
      font-family: 'PingFang SC'
      }
    }
  }
}
</style>
