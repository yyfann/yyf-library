import axios from "axios";
import _ from 'lodash'

import magicArea from "./magic-area.vue";

function magicAreaPlugin(Vue, router, routeDatas, devServerPort, moreConfigs = {}) {
  // -------------- 打开编辑器的函数 --------------
  function launchEditor(filePath) {
    if (!filePath) return

    console.log(filePath,'filePath')

    axios
      .get(`http://localhost:${devServerPort}/code`, {
        params: {
          filePath: `-g ${filePath}`
        }
      })
  }

  // 点击元素打开源码 (定位到行列)
  document.onclick = function (e) {

    if (e.ctrlKey) {
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
        // 1 el-table 的表头
        {
          test(e) {
            return _.get(e.target, 'parentNode.className', '').indexOf('el-table') > -1
          },
          getTargetTag(e) {
            /**
             * el-table,el-table-column 处理
             * 1 el-column 标签会渲染在 .hidden-columns中, 无法直接点击到
             * 2 解决: 点击表头元素根据th的下标在 .hidden-columns中找 实际的el-column元素
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
        // 2 el-form-item 的label, 或内容
        {
          test(e) {
            return [
              'el-form-item__content', 'el-form-item__label'
            ].includes(e.target.className)
          },
          getTargetTag(e) {
            return e.target.parentNode
          }
        }
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


  // -------------- 操作面板实例 --------------
  const magicAreaEl = document.createElement("div");
  magicAreaEl.id = "magicAreaEl";
  document.body.appendChild(magicAreaEl);

  if (!this.constructor.instance) {
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


  // 点击打开组件的源码 (包括node_modules里面的)
  const openComponentPlugin = {
    install(Vue, options) {
      Vue.mixin({
        mounted() {
          this.__injectedFn = (e) => {
            if (e.ctrlKey) {
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
          this.$el.addEventListener('contextmenu', this.__injectedFn)
        },


        destroyed() {
          this.$el.removeEventListener('contextmenu', this.__injectedFn)
        }
      });
    }
  };

  Vue.use(openComponentPlugin);
}


export default magicAreaPlugin

