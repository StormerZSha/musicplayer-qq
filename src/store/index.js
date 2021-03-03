import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchValue:"",//当前搜索的值
    searchHistory:[],//搜索过的历史
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
