import Vue from 'vue'
import VueRouter from 'vue-router'

const Home=()=>import('../views/Home.vue');
const Album=()=>import('../views/Album.vue');
const Singer=()=>import('../views/Singer.vue');
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title:'首页',
      keepAlive:true
    },
    children:[
      {
        path:'/album/:id',
        name:'Album',
        component:Album
      },
      {
        path:'/singer',
        name:'Singer',
        component:Singer
      }
    ]
  },
  
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
