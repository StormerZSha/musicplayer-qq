import Vue from 'vue'
import Vuex from 'vuex'
import {Toast} from 'mint-ui'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchValue:"",//当前搜索的值
    searchHistory:[],//搜索过的历史
    playList:[],//播放列表
  },
  mutations: {
    addPlayList(state,data){//添加歌曲mid,name到播放列表(mid可请求播放地址)
      state.playList.push(data);
      Toast({
        message:"添加播放列表成功",
        position:"middle",
        duration:3000
      });
      console.log("添加成功");
   }
  },
  actions: {
  },
  modules: {
  }
})
