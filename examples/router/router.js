import Vue from "vue";
import Router from "vue-router";
import mainRoutes from './routes/main-routes'
// import playground from './routes/playground'
import magicAreaRoute from './routes/magic-area-route'

Vue.use(Router);

export default new Router({
  routes: [
    ...magicAreaRoute,
    ...mainRoutes,
    // ...playground,
  ]
});
