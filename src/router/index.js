import Vue from 'vue'
import VueRouter from 'vue-router'

const Home=()=>import('../views/Home.vue');
const Album=()=>import('../views/Album.vue');
const Singer=()=>import('../views/Singer.vue');
const Mv=()=>import('../views/Mv.vue');
const Recommend=()=>import('../views/Recommend.vue');
const Rank=()=>import('../views/Rank.vue');
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
        component:Album,
        meta:{
          title:'专辑'
        }
      },
      {
        path:'/singer',
        name:'Singer',
        component:Singer,
        meta:{
          title:'歌手'
        }
      },
      {
        path:'/mv/:id',
        name:'Mv',
        component:Mv,
        meta:{
          title:'MV'
        }
      },
      {
        path:'/recommend/:id',
        name:'Recommend',
        component:Recommend,
        meta:{
          title:'推荐'
        }
      },
      {
        path:'/rank/:id',
        name:'Rank',
        component:Rank,
        meta:{
          title:'推荐'
        }
      }
    ]
  },
  
]

const router = new VueRouter({
  routes,
  mode:'history',
})

router.beforeEach((to,from,next)=>{//设置全局导航守卫
  document.title=to.match[0].meta.title;
})

export default router
