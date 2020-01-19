import axios from "axios";
import _ from 'lodash'
import magicArea from "./magic-area.vue";
import JsonViewer from 'vue-json-viewer'


function magicAreaPlugin(Vue, router, routeDatas, devServerPort, moreConfigs = {}) {
  // -------------- 打开编辑器的函数 --------------
  function launchEditor(filePath) {
    if (!filePath) return

    console.log(filePath, 'filePath')

    axios
      .get(`http://localhost:${devServerPort}/code`, {
        params: {
          filePath: `-g ${filePath}`
        }
      })
  }

  // 点击元素打开源码 (定位到行列)
  function openSourceCode(e) {
    if (e.ctrlKey) {
      console.log(e.target,'e.target')

      e.preventDefault()
      // 判断点击元素的类别, 来找不同的标签(含有源码地址的)
      const options = [
        // 标签直接有源码地址
        {
          test(e) {
            return !!e.target.getAttribute('source-code-location')
          },
          getTargetTag(e) {
            return e.target
          }
        },
        // 2 el-form-item, el-button或任何父级有源码地址的标签
        {
          test(e) {
            // return [
            //   'el-form-item__content', 'el-form-item__label'
            // ].includes(e.target.className)
            return !!e.target.parentNode.getAttribute('source-code-location')
          },
          getTargetTag(e) {
            return e.target.parentNode
          }
        },
        // 1 el-table 的表头, 单元格
        {
          test(e) {
            return _.get(e.target, 'parentNode.className', '').indexOf('el-table') > -1
          },
          getTargetTag(e) {
            /**
             * el-table,el-table-column 处理
             * 1 el-column 标签会渲染在 .hidden-columns中, 无法直接点击到
             * 2 解决: 点击表头元素根据th的下标在 .hidden-columns中找 实际的el-column元素
             * 3 这个逻辑是为了点击表头准备的, 单元格可以用因为恰好逻辑都能对上
             */
            // 找到th的位置下标
            const th = e.target.parentNode
            const tr = th.parentNode
            const thIndex = Array.from(tr.children).indexOf(th)

            // 找到父级的名为.hidden-columns的兄弟元素
            const elTable = tr.parentNode.parentNode.parentNode.parentNode
            const hiddenColumnsNode = Array.from(elTable.children).find(child => child.className === 'hidden-columns')
            const elColumn = hiddenColumnsNode.children[thIndex]
            return elColumn
          }
        },

      ]

      // 找到标签
      let targetTag = null
      _.forEach(options, ({ test, getTargetTag }) => {
        if (test(e)) {
          targetTag = getTargetTag(e)
          return false  // 退出循环
        }
      })

      // 跳转源码
      const filePath = targetTag.getAttribute('source-code-location')
      launchEditor(filePath)
    }

  }
  document.addEventListener('click', openSourceCode)
  document.addEventListener('contextmenu', openSourceCode)


  // -------------- 操作面板实例 --------------
  const magicAreaEl = document.createElement("div");
  magicAreaEl.id = "magicAreaEl";
  document.body.appendChild(magicAreaEl);

  if (!this.constructor.instance) {
    Vue.use(JsonViewer)
    this.constructor.instance = new Vue({
      el: "#magicAreaEl",
      components: {
        magicArea
      },
      data: {
        magicProps: {
          routeDatas,
          devServerPort,
          ...moreConfigs,
          launchEditor,
        }
      },
      template: `
      <magic-area 
        v-bind="magicProps"
      />
    `,
      router
    });
  }


  // 点击打开组件级别的源码 (包括node_modules里面的)
  const openComponentPlugin = {
    install(Vue, options) {
      Vue.mixin({
        mounted() {
          this.__injectedFn = (e) => {
            if (e.altKey) {
              e.preventDefault()
              let filePath = this.$options.__file

              const { inspectUiLibrary } = moreConfigs

              if (filePath) {
                if (_.startsWith(filePath, 'packages')) {
                  if (inspectUiLibrary) {
                    e.stopPropagation()
                    filePath = `node_modules/${inspectUiLibrary}/${filePath}`
                    launchEditor(filePath)
                  }
                } else {
                  e.stopPropagation()
                  launchEditor(filePath)
                }
              }
            }
          }
          this.$el.addEventListener('click', this.__injectedFn)
        },


        destroyed() {
          this.$el.removeEventListener('click', this.__injectedFn)
        }
      });
    }
  };
  // Vue.use(openComponentPlugin);
}


export default magicAreaPlugin

