import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/index.css'
/* import './assets/reset.css' */

import './config/element'


import ZkTable from 'vue-table-with-tree-grid'

Vue.component(ZkTable.name, ZkTable)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
