<template>
  <div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <div>列表组件</div>
    <!-- <div @click="fn">list</div> -->
    <div class="find-me">找到我</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      
    }
  },

  mounted() {
    // this.$el.addEventListener('click', (e) => {
    //   if (e.ctrlKey) {
    //     console.log(e,'e')
    //     console.log(this.$options.__file, 'el click')
    //   }
    // })
    // console.log(a,'a')
  },

  methods: {
    fn() {
      console.log(this.__file,'this list')
    },
  },
}
</script>

<style scoped>
  .find-me {
  color: red;    
  font-weight: bold;
  }
</style>