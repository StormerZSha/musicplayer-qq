<template>
  <div class="home">
    <mt-search 
    :value="$store.state.searchValue"
    placeholder="搜索 歌曲/专辑/歌手"
    cancle-text="取消"
    ></mt-search>
    <div class="tabbar">
      搜索以外的界面
      <button @click="hotsearch">接口测试</button>
    </div>
  </div>
</template>

<script>

import {Search} from 'mint-ui';
import axios from 'axios';
import vueAxios from 'vue-axios';

export default {
  name: 'Home',
  components: {
   
  },
  methods:{
    hotsearch(){
      axios({
        url:'/search/hot'
      }).then(res=>{
        console.log(res);
      }).catch(err=>{
        console.log(err);
      })
    }
  }
}
</script>
