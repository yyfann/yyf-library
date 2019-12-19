<template>
  <div>
    <div @click="fn">list</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },

  methods: {
    fn() {
      console.log(this.$options,'this list')
    },
  },
}
</script>

<style scoped>

</style>