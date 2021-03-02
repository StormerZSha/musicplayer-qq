import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MinUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
Vue.use(MinUI)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
