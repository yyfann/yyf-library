<template>
  <div>
    <div class="nav">
      <router-link
        class="nav-option"
        v-for="(route, routeIndex) in routes"
        :key="routeIndex"
        :to="route.path"
      >{{ route.meta.title }}</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      routes: []
    }
  },

  created() {
    this.routes = this.$router.options.routes
    console.log(this.routes,'this.routes')
  },
}
</script>

<style scoped>
.nav {
  height: 100px;
  background: skyblue;
}
.nav-option {
  margin: 10px;
}
    
</style>
