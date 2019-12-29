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
      const filePath = e.target.getAttribute('source-code-location')
      console.dir(filePath,'filePath')
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
                if(_.startsWith(filePath, 'packages')) {
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
        

        destroyed(){
          this.$el.removeEventListener('contextmenu', this.__injectedFn)
        }
      });
    }
  };
  
  Vue.use(openComponentPlugin);
}


export default magicAreaPlugin
  
