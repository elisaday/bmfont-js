import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'
import routes from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: routes
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
