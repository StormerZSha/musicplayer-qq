<template>
  <div class="home">
    <!-- 整个搜索区域 -->
    <div class="search">
      <!-- 搜索输入框与取消按钮 -->
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
      <!-- 历史搜索记录与清除历史按钮 -->
      <div class="searchHistory" v-show="searchHistoryisShow">
         <mt-button plain
           v-for="(item,index) in $store.state.searchHistory.slice(-5)" :key="index"
           @click="historySearch(item)"
         >{{item}}</mt-button>
         <button class="clearhistory"
           v-show="$store.state.searchHistory.length>0"
           @click="clearHistory"
         >X</button>
      </div>
      <!-- 热门搜索关键字的显示 -->
      <div class="hotsearch" v-show="hotSearchisShow">   
        <mt-cell v-for="(item,index) in hotSearchValue"
         :key="index"  
         :title="index+1+'、'+item.k"
         @click.native="realHotsearch(item.k)"
         >
         {{item.n}}
         </mt-cell>
      </div>
      <!-- 实际搜索结果(单曲,专辑,歌手,mv) -->
      <div class="searchresult" v-show="searchResultisShow">
        <div class="song">
          <mt-cell title="单曲"></mt-cell>
          <mt-cell v-for="(item,index) in searchResult.song.itemlist" :key="index"
            :title="item.name" 
            :label="item.singer"
            is-link
           ></mt-cell>
        </div>
        <div class="album">
          <mt-cell title="专辑"></mt-cell>
           <mt-cell v-for="(item,index) in searchResult.album.itemlist" :key="index"
             :title="item.name"
           >
             <img slot="icon" :src="item.pic" width="40px" height="40px">
             {{item.singer}}
           </mt-cell>
        </div>
        <div class="singer">
          <mt-cell title="歌手"></mt-cell>
          <mt-cell v-for="(item,index) in searchResult.singer.itemlist" :key="index"
            :title="item.name"
          >
            <img slot="icon" :src="item.pic" width="40px" height="40px" style="border-radius:50%">
          </mt-cell>
        </div>
        <div class="mv">
          <mt-cell title="MV"></mt-cell>
          <mt-cell v-for="(item,index) in searchResult.mv.itemlist" :key="index"
            :title="item.name"
            :label="item.singer"
          ></mt-cell>
        </div>
      </div>
    </div>
    
    <div class="tabbar">
    
    </div>
  </div>
</template>

<script>

import {Search,
        Cell,
        Button 
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
      searchHistoryisShow:false,//搜索历史的显示隐藏
      searchResult:{
        album:{},
        mv:{},
        singer:{},
        song:{}
      },//快速搜索结果(复杂数据需要设定结构)
      searchResultisShow:false,//搜索结果的显示隐藏
    }
  },
  methods:{
    gethotsearch(){//获取热门搜索关键词
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
        console.log(res.data.data);
        that.searchResult=res.data.data;
      }).catch(err=>{
        console.log(err);
      })
      this.$store.state.searchHistory.push(this.$store.state.searchValue);//记录搜索过的关键字
      this.searchHistoryisShow=false;//搜索时搜索历史隐藏
      this.hotSearchisShow=false;//搜索时热门搜索关键词隐藏
      this.searchResultisShow=true;//搜索时搜索结果显示
    },
    showSearch(e){//搜索相关组件的显示
      this.hotSearchisShow=true;//热门搜索的显示
      e.target.style.width="81.5%";//搜索框的缩小
      this.cancleisShow=true;//取消按钮的显示
      this.searchHistoryisShow=true;//搜索历史的显示
    },
    hideSearch(e){//搜索相关组件的隐藏
      this.hotSearchisShow=false;//热门搜索的隐藏
      this.cancleisShow=false;//取消按钮的隐藏
      this.searchHistoryisShow=false;//搜索历史的隐藏
      this.searchResultisShow=false;//搜索结果隐藏
      this.$store.state.searchValue="";//清空当前搜索框
    },
    realHotsearch(key){//用热门搜索关键词真正搜索
      this.$store.state.searchValue=key;//将热门搜索关键词放入搜索框
      this.quicksearch();//调用快速搜索
      console.log(key);
    },
    historySearch(key){//用历史搜索关键词搜索
     this.$store.state.searchValue=key;
     this.quicksearch(); 
    },
    clearHistory(){
      this.$store.state.searchHistory=[];//存储搜索历史的数组清空
    }
  },
  created(){//页面创建时，调用获取热门搜索
    this.gethotsearch();
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