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
    <div class="content">
      <router-view></router-view>
    </div>
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
  },

  methods: {

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

.content {
  margin-top: 10px;
  border: 1px solid black;
  padding: 10px;
}
    
</style>
