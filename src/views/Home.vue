<template>
  <div class="home">
    <!-- 整个搜索区域 -->
    <div class="search" v-show="$store.state.allSearchisShow">
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
             {{item.singer}}
             <router-link :to="'/album/'+item.mid" tag="img" 
             :src="item.pic" width="40px" height="40px" slot="icon"
             @click.native="$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
             >
             </router-link>
             <!-- 将专辑图片作为路由跳转按钮 -->
           </mt-cell>
        </div>
        <div class="singer">
          <mt-cell title="歌手">
            <img slot="icon" src="../assets/icon-singer.png" width="20px" >
          </mt-cell>
          <mt-cell v-for="(item,index) in searchResult.singer.itemlist" :key="index"
            :title="item.name"
          >
             <router-link :to="{path:'/singer',query:{id:item.mid,url:item.pic}}" tag="img"
             :src="item.pic" width="40px" height="40px" slot="icon"
             style="border-radius:50%"
             @click.native="$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
             >
             </router-link>
          </mt-cell>
        </div>
        <div class="mv">
          <mt-cell title="MV">
            <img slot="icon" src="../assets/icon-mv.png" width="20px" >
          </mt-cell>
          <mt-cell v-for="(item,index) in searchResult.mv.itemlist" :key="index"
            :title="item.name"
            :label="item.singer"
            @click.native="$router.push('/mv/'+item.vid);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
          >
          </mt-cell>
        </div>
      </div>
    </div>
    <!-- 推荐与排行选项卡 -->
    <div class="tabbar" v-show="$store.state.allTabbarisShow">
      <mt-navbar v-model="selected">
        <mt-tab-item id="recommend">推荐</mt-tab-item>
        <mt-tab-item id="rank">排行</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected" :swipeable="true">
        <!-- 这是推荐选项卡 -->
        <mt-tab-container-item id="recommend">
          <div class="banner" @touchmove.stop="()=>{return true}">
             <mt-swipe :auto="5000">
                <mt-swipe-item v-for="(item,index) in bannerMessage" :key="index">
                  <img :src="item.picUrl">
                  <a :href="item.h5Url" v-show="item.type=='10002'">付费专辑请至官网收听</a>
                </mt-swipe-item>
             </mt-swipe>
          </div>
          <div class="recommendlist">
              <div class="recommedtitle"><h4>热门歌单</h4></div>
              <div class="recommendinner" v-for="(item,index) in recommendList" :key="index"
                @click="$router.push('/recommend/'+item.content_id);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
              >
                 <div class="img">
                   <img :src="item.cover">
                 </div>
                 <div class="name">{{item.title}}</div>
                 <div class="listennum">热度:{{item.listen_num}}</div>
              </div>
          </div>
          </mt-tab-container-item>
          <!-- 这是排行选项卡 -->
        <mt-tab-container-item id="rank">
          <!-- 巅峰榜 -->
          <div class="toprank">
            <div v-for="(item,index) in topRankmsg" :key="index" class="toprankitem"
             @click="$router.push('/rank/'+item.topId);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
            >
              <div class="left">
                 <img :src="item.picUrl">
                 <span>{{changeListennum(item.listenNum)}}万</span>
              </div>
              <div class="right">
                 {{item.label}}
                 <ul>
                   <li v-for="(i,index) in item.song" :key="index">
                     {{index+1}}{{i.title}}-{{i.singerName}}
                   </li>
                 </ul>
              </div>
            </div>
          </div>
          <!-- 地区榜 -->
          <div class="arearank">
            <div v-for="(item,index) in areaRankmsg" :key="index" class="arearankitem"
            @click="$router.push('/rank/'+item.topId);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
            >
              <div class="left">
                 <img :src="item.picUrl">
                 <span>{{changeListennum(item.listenNum)}}万</span>
              </div>
              <div class="right">
                 {{item.label}}
                 <ul>
                   <li v-for="(i,index) in item.song" :key="index">
                     {{index+1}}{{i.title}}-{{i.singerName}}
                   </li>
                 </ul>
              </div>
            </div>
          </div>
          <!-- 特色榜 -->
          <div class="specialrank">
            <div v-for="(item,index) in specialRankmsg" :key="index" class="specialrankitem"
            @click="$router.push('/rank/'+item.topId);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
            >
              <div class="left">
                 <img :src="item.picUrl">
                 <span>{{changeListennum(item.listenNum)}}万</span>
              </div>
              <div class="right">
                 {{item.label}}
                 <ul>
                   <li v-for="(i,index) in item.song" :key="index">
                     {{index+1}}{{i.title}}-{{i.singerName}}
                   </li>
                 </ul>
              </div>
            </div>
          </div>
          <!-- 全球榜 -->
          <div class="globalrank">
            <div v-for="(item,index) in globalRankmsg" :key="index" class="globalrankitem"
            @click="$router.push('/rank/'+item.topId);$store.state.allTabbarisShow=false;$store.state.allSearchisShow=false"
            >
              <div class="left">
                 <img :src="item.picUrl">
                 <span>{{changeListennum(item.listenNum)}}万</span>
              </div>
              <div class="right">
                 {{item.label}}
                 <ul>
                   <li v-for="(i,index) in item.song" :key="index">
                     {{index+1}}{{i.title}}-{{i.singerName}}
                   </li>
                 </ul>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <router-view></router-view>
    <!-- 音乐播放器 -->
    <keep-alive>
      <player></player>
    </keep-alive>
  </div>
</template>

<script>

import {Search,
        Cell,
        Button,
        Popup,
        Actionsheet,
        Range,
        Navbar,
        TabItem,
        TabContainer,
        TabContainerItem,
        Swipe,
        SwipeItem
} from 'mint-ui';
import axios from 'axios';
import vueAxios from 'vue-axios';
import player from '../components/Player'

export default {
  name: 'Home',
  components: { 
    player
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
      selected:"recommend",//当前选项卡选中的值
      bannerMessage:[],//获取到的轮播图信息
      recommendList:[],//获取到的推荐列表
      topRankmsg:[],//巅峰总榜信息
      areaRankmsg:[],//地区总榜信息
      specialRankmsg:[],//特色总榜信息
      globalRankmsg:[],//全球总榜信息
    }
  },
  methods:{
    gethotsearch(){//获取热门搜索关键词
      let that=this;
      axios({
        url:'/search/hot'
      }).then(res=>{
        //console.log(res.data.data.slice(0,5));
        that.hotSearchValue=res.data.data.slice(0,5);//截取前5个赋值显示
      }).catch(err=>{
        console.log(err);
      })
    },
    quicksearch(){//快速搜索
      let that=this;
      axios({
        url:'/search/quick?key='+that.$store.state.searchValue
      }).then(res=>{
        //console.log(res.data.data);
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
      this.$store.state.allTabbarisShow=false;//选项卡隐藏
    },
    hideSearch(e){//搜索相关组件的隐藏
      this.hotSearchisShow=false;//热门搜索的隐藏
      this.cancleisShow=false;//取消按钮的隐藏
      this.searchHistoryisShow=false;//搜索历史的隐藏
      this.searchResultisShow=false;//搜索结果隐藏
      this.$store.state.searchValue="";//清空当前搜索框
      this.$store.state.allTabbarisShow=true;//选项卡显示
    },
    realHotsearch(key){//用热门搜索关键词真正搜索
      this.$store.state.searchValue=key;//将热门搜索关键词放入搜索框
      this.quicksearch();//调用快速搜索
      //console.log(key);
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
    removesong(event,index){//调用全局方法,删除当前的歌曲
     this.$store.commit('removeSong',index);
    },
    getBanner(){//获取首页轮播图信息
      let that=this;
      axios({
        url:'/recommend/banner'
      }).then(res=>{
        //console.log(res);
        that.bannerMessage=res.data.data;
      }).catch(err=>{
        console.log(err);
      })
    },  
    getRecommendlist(){//获取首页推荐列表
        let that=this;
        axios({
        url:'/recommend/playlist/u'
      }).then(res=>{
        //console.log(res);
        that.recommendList=res.data.data.list;
      }).catch(err=>{
        console.log(err);
      })
    },
    getRanklist(){//获取排行列表
       let that=this;
       axios({
         url:'/top/category?showDetail=1'
       }).then(res=>{
        // console.log(res);
         that.topRankmsg=res.data.data[0].list;
         that.areaRankmsg=res.data.data[1].list;
         that.specialRankmsg=res.data.data[2].list;
         that.globalRankmsg=res.data.data[3].list;
       }).catch(err=>{
         console.log(err);
       })
    },
    changeListennum(num){//处理排行榜听歌数字
       return parseInt(num/10000); 
    }
  },
  created(){//页面创建时,调用获取热门搜索,获取轮播图信息,获取推荐列表,获取排行列表
    this.gethotsearch();
    this.getBanner();
    this.getRecommendlist();
    this.getRanklist();
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
.searchresult{
  padding-bottom:50px;
}
.tabbar{
  padding-bottom: 50px;
}
.banner{
  width: 100%;
  height: 200px;
  background-color: #ccc;
}
.banner img{
  width: 100%;
}
.recommedtitle{
  font-weight: 400;
  text-align: center;
  margin-top: 10px;
}
.recommendinner{
  width: 50%;
  height: 252px;
  float: left;
  margin-bottom: 10px;
  position: relative;
}
.recommendinner img{
  width: 100%;
}
.listennum{
  position: absolute;
  left: 0;
  bottom: 45px;
  color: #fff;
}
.toprankitem,.arearankitem,.specialrankitem,.globalrankitem{
  width: 94%;
  height: 98px;
  margin-top: 10px;
  margin-left: 3%;
  box-shadow: 0 0 5px #ccc;
}
.toprankitem img,.arearankitem img,.specialrankitem img,.globalrankitem img{
  width: 100%;
}
.left{
  width: 25%;
  position: relative;
}
.left,.right{
  float: left;
}
.right{
  width: 70%;
  margin-left: 15px;
  margin-top: 5px;
}
.left span{
  color: #fff;
  position: absolute;
  left: 0;
  bottom: 3px;
}
li{
  width: 100%;
  overflow: hidden;
  list-style: none;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>