import Vue from 'vue'
import Vuex from 'vuex'
import {Toast} from 'mint-ui'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allSearchisShow:true,//整个搜索相关的显示与隐藏
    allTabbarisShow:true,//整个选项卡的显示与隐藏
    searchValue:"",//当前搜索的值
    searchHistory:[],//搜索过的历史
    playList:[],//播放列表
  },
  mutations: {
    addPlayList(state,data){//添加歌曲mid,name,singer到播放列表(mid可请求播放地址)
      state.playList.push(data);
      Toast({
        message:"添加播放列表成功",
        position:"middle",
        duration:3000
      });
      console.log("添加成功");
   },
   removeSong(state,index){//点击按钮删除对应索引的歌
     state.playList.splice(index,1);
   },
   
  },
  actions: {
  },
  modules: {
  }
})
