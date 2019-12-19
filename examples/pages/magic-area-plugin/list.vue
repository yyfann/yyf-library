<template>
  <div>
    <div>lllll</div>
    <!-- <div @click="fn">list</div> -->
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
  },

  methods: {
    fn() {
      console.log(this.__file,'this list')
    },
  },
}
</script>

<style scoped>

</style>