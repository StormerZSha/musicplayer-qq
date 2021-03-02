import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MinUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import main from './assets/main.css'
import axios from 'axios'
import vueAxios from 'vue-axios'

Vue.prototype.$axios=axios;//将axios挂载到vue原型上
axios.defaults.baseURL='/api';//设置baseurl
Vue.config.productionTip = false
Vue.use(MinUI)
Vue.use({axios,vueAxios})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
