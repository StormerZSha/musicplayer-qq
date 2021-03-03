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
          <mt-cell title="单曲">
            <img slot="icon" src="../assets/icon-music.png" width="20px" >
          </mt-cell>
          <mt-cell v-for="(item,index) in searchResult.song.itemlist" :key="index"
            :title="item.name" 
            :label="item.singer"
            is-link
            @click.native="addplaylist(item.mid,item.name,item.singer)"
           ></mt-cell>
        </div>
        <div class="album">
          <mt-cell title="专辑">
            <img slot="icon" src="../assets/icon-album.png" width="20px" >
          </mt-cell>
           <mt-cell v-for="(item,index) in searchResult.album.itemlist" :key="index"
             :title="item.name" 
           >
             <img slot="icon" :src="item.pic" width="40px" height="40px">
             {{item.singer}}
           </mt-cell>
        </div>
        <div class="singer">
          <mt-cell title="歌手">
            <img slot="icon" src="../assets/icon-singer.png" width="20px" >
          </mt-cell>
          <mt-cell v-for="(item,index) in searchResult.singer.itemlist" :key="index"
            :title="item.name"
          >
            <img slot="icon" :src="item.pic" width="40px" height="40px" style="border-radius:50%">
          </mt-cell>
        </div>
        <div class="mv">
          <mt-cell title="MV">
            <img slot="icon" src="../assets/icon-mv.png" width="20px" >
          </mt-cell>
          <mt-cell v-for="(item,index) in searchResult.mv.itemlist" :key="index"
            :title="item.name"
            :label="item.singer"
          >
          </mt-cell>
        </div>
      </div>
    </div>
    <!-- 搜索与播放中间部分暂定 -->
    <div class="tabbar">
    </div>
    <!-- 音乐播放器 -->
    <div class="musicplayer">
      <!-- 迷你播放器 -->
      <div class="minplayer" @click="bigPlayerisShow=true">
        <img src="../assets/icon-defaultplayer.png"  width="50px" class="albumpic">
        <div class="musicname">Music Player</div>
        <img src="../assets/icon-play.png" width="30px" class="icon-play">
      </div>
      <mt-popup v-model="bigPlayerisShow" position="bottom" :moadl="false" :closeOnClickModal=false>
         <div class="bigplayer">
           <span class="closebigplayer" @click="bigPlayerisShow=false">X</span>
           <img src="../assets/icon-defaultplayer.png"  class="bigalbumpic" >
           <div class="playerset">
             <audio controls autoplay :src="playingurl" >
               您的浏览器不支持在线播放
             </audio>
           </div>
           <span @click="playListisShow=true">歌单测试</span>
          <mt-popup v-model="playListisShow" position="bottom" :modal="false" >
            <div class="playlist">
              <span @click="playListisShow=false">关闭</span>
              <mt-cell v-for="(item,index) in this.$store.state.playList" :key="index"
                :title="item.name"
                :label="item.singer"
                @click.native="playsong(item.mid)"
              >
                 <mt-button icon="field-error" plain style="border:none"
                  @click.native="removesong(index)"
                 ></mt-button>
              </mt-cell>
            </div>
          </mt-popup>
         </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>

import {Search,
        Cell,
        Button,
        Popup,
        Actionsheet
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
      bigPlayerisShow:false,//完整播放器的显示与隐藏
      playListisShow:false,//播放列表的显示与隐藏
      actionSheetisShow:false,//播放列表详情上拉菜单的显示与隐藏
      playingurl:"",//当前正在的音乐的url
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
    },
    addplaylist(mid,name,singer){//调用全局方法,添加播放列表
     this.$store.commit('addPlayList',{mid,name,singer});
    },
    removesong(index){//调用全局方法,删除当前的歌曲
     this.$store.commit('removeSong',index);
    },
    playsong(mid){
      let that=this;
      axios({
        url:'/song/urls?id='+mid
      }).then(res=>{
        console.log(res.data.data[mid]);
        that.playingurl=res.data.data[mid];
      }).catch(err=>{
        console.log(err);
      })
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
.musicplayer{
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  left: 0;
  bottom: 0;
}
.musicname{
  margin-bottom: 20px;
}
.musicname{
  position: absolute;
  left: 75px;
  top: 15px
}
.icon-play{
  position: absolute;
  right: 30px;
  top: 10px;
}
.mint-popup{
  width: 100%;
  height: 100%;
}
.bigalbumpic{
  width: 100%;
  height: 50%;
}
.playerset{
  width: 100%;
  height: 50%;
  background-color: rgba(0,0,0,.2);
}
.bigplayer{
  position: relative;
}
.closebigplayer{
  position: absolute;
  top: 0;
  left: 0;
}
.mint-actionsheet-listitem{
  background-color: #ccc;
}
</style>