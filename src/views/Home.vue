<template>
  <div class="home">
    <div class="search">
      <div class="searchinput">
        <input  type="text" class="quicksearch"
          v-model="$store.state.searchValue"
          placeholder="搜索 歌曲/专辑/歌手"
          @keyup.enter="quicksearch"
          @click="showSearch($event)"
          :style="cancleisShow?{width:81.5+'%'}:{width:96.5+'%'}"
        >
        <img src="../assets/icon-search.png" >
        <button class="cancle" 
           v-show="cancleisShow"
           @click="hideSearch($event)"
        >取消
        </button>
      </div>
      <div class="hotsearch" v-show="hotSearchisShow">   
        <mt-cell v-for="(item,index) in hotSearchValue"
         :key="index"  
         :title="index+1+'、'+item.k">
         {{item.n}}
         </mt-cell>
      </div>
    </div>
    
    <div class="tabbar">
    
    </div>
  </div>
</template>

<script>

import {Search,
        Cell 
} from 'mint-ui';
import axios from 'axios';
import vueAxios from 'vue-axios';

export default {
  name: 'Home',
  components: {
   
  },
  data(){
    return {
      hotSearchValue:[],//热门搜索关键字
      hotSearchisShow:false,//热门搜索的显示隐藏
      cancleisShow:false,//取消搜索按钮的显示隐藏
    }
  },
  methods:{
    hotsearch(){//获取热门搜索
      let that=this;
      axios({
        url:'/search/hot'
      }).then(res=>{
        console.log(res.data.data.slice(0,5));
        that.hotSearchValue=res.data.data.slice(0,5);
      }).catch(err=>{
        console.log(err);
      })
    },
    quicksearch(){//快速搜索
      let that=this;
      axios({
        url:'/search/quick?key='+that.$store.state.searchValue
      }).then(res=>{
        console.log(res);
      }).catch(err=>{
        console.log(err);
      })
    },
    showSearch(e){//搜索相关组件的显示
      this.hotSearchisShow=true;//热门搜索的显示
      e.target.style.width="81.5%";//搜索框的缩小
      this.cancleisShow=true;//取消按钮的显示
    },
    hideSearch(e){//搜索相关组件的隐藏
      this.hotSearchisShow=false;//热门搜索的隐藏
      this.cancleisShow=false;//取消按钮的隐藏
    }
  },
  created(){//页面创建时，调用获取热门搜索
    this.hotsearch();
  }
}
</script>
<style scoped>
.searchinput{
  width: 100%;
  height: 60px;
  position: relative;
}
.searchinput img{
  width: 30px;
  height: 30px;
  position: absolute;
  top: 17px;
  left: 12px;
}
.quicksearch{
  width: 96.5%;
  height: 70%;
  outline: none;
  border: 1px solid #fff;
  margin-left: 1.5%;
  margin-top: 10px;
  padding-left: 40px;
  font-size: 16px;
  background-color: #eee;
  box-sizing: border-box;
  border-radius: 10px;
}
.cancle{
  width: 15%;
  height: 70%;
  outline: none;
  border: 1px solid #fff;
  background-color: #fff;
}
</style>