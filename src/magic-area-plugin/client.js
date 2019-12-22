import axios from "axios";

import magicArea from "./magic-area.vue";

function magicAreaPlugin(Vue, router, routeDatas, devServerPort, moreConfigs = {}) {

  // -------------- 打开编辑器的函数 --------------
  function launchEditor(filePath) {
    console.log(filePath, 'filePath')
    if (filePath) {
      axios
        .get(`http://localhost:${devServerPort}/code`, {
          params: {
            filePath: `-g ${filePath}`
          }
        })
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

  
  // 快捷键打开源码
  const openComponentPlugin = {
    install(Vue, options) {
      Vue.mixin({
        mounted() {
          this.__injectedFn = (e) => {
            if (e.ctrlKey) {
              e.preventDefault()
              console.log(this.$el, '$el')
              const filePath = this.$options.__file
              if (filePath) {
                e.stopPropagation()
                launchEditor(filePath)
              }
            }
          }
          this.$el.addEventListener('click', this.__injectedFn)
        },
        

        destroyed(){
          this.$el.removeEventListener('click', this.__injectedFn)
        }
      });
    }
  };
  
  Vue.use(openComponentPlugin);
}


export default magicAreaPlugin
  
