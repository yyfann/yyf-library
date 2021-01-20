<template>
  <div>
    输入路由:
    <input type="text" v-model="filePath" />
    <div>{{ fullPath }}</div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {
      filePath: ''
    }
  },

  computed: {
    /**
     * 仅能使用在非异步路由, 或者加载过的路由上, 否则组件还没拿到没有文件路径字段
     */
    fullPath() {
      
      function formatDeep(array) {
        function resolvePath(a, b) {
          let path = ''
          if (_.startsWith(b, '/')) {
            path = b
          } else {
            path = a + '/' + b
          }
          return path
        }

        function walk(array, parentFullPath) {
          for (let index in array) {
            const val = array[index]
            const { path, component } = val

            const fullPath = resolvePath(parentFullPath, path)
            val.fullPath = fullPath

            let optionFilePath
            if (component.resolved) {
              optionFilePath = component.resolved.extendOptions.__file
            } else {
              optionFilePath = component.__file
            }
            val.optionFilePath = optionFilePath

            if (val.children) {
              walk(val.children, fullPath)
            }
          }
        }
        walk(array, '/')
      }
      
      const routeOptions = this.$router.options.routes
      formatDeep(routeOptions)
      console.log(routeOptions, 'routeOptions')

      function findFullPath(array, filePath) {
        function walk(array) {
          for (let index in array) {
            const val = array[index]
            const { optionFilePath, fullPath } = val
            if (optionFilePath === filePath) {
              return fullPath
            }

            if (val.children) {
              return walk(val.children)
            }
          }
        }
        return walk(array)
      }

      const filePath = this.filePath.replace(/\\/g, '/')
      // const filePath = 'examples/pages/source-to-route/index.vue'
      console.log(filePath, 'filePath')
      const res = findFullPath(routeOptions, filePath)
      console.log(res, 'res')
      return res
    }
  },

  watch: {},

  async mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.to-route {
  background: pink;
}
</style>
