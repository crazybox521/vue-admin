import Vue from 'vue'
import App from './App.vue'
import router from './router'
import less from 'less'

import './assets/index.css'
/* import './assets/reset.css' */

import './config/element'

Vue.use(less)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
