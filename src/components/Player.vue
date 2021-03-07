<template>
    <div class="musicplayer">
      <!-- 迷你播放器 -->
      <div class="minplayer" @click="bigPlayerisShow=true">
        <img :src="playingablumpic?playingablumpic:defaultPlayerpic"  width="50px" class="albumpic">
        <div class="musicname">{{playingname?playingname:defaultPlayername}}</div>
        <img :src="iconurl" width="30px" class="icon-play" @click.stop="startPlay">
      </div>
      <mt-popup v-model="bigPlayerisShow" position="bottom" :moadl="false" :closeOnClickModal=false>
         <div class="bigplayer">
           <div class="closebigplayer" @click="bigPlayerisShow=false">X</div>
           <img :src="playingablumpic?playingablumpic:defaultPlayerpic"  class="bigalbumpic" >
           <div class="playerset">
             <audio :src="playingurl"  class="audioclass" autoplay>
               您的浏览器不支持在线播放
             </audio>
             <!-- 此处添加自定义进度条 -->
             <mt-range :max="originMusicduration" :step="1" :value="originMusiccurrent"
             >
               <div slot="start">{{musiccurrent}}</div>
               <div slot="end">{{musicduration}}</div>
             </mt-range>
             <h3 class="playingname">{{playingname?playingname:defaultPlayername}}</h3>
             <h5 class="playingsinger">{{playingsinger}}</h5>
             <div class="playinglyric">
               <ul>
                 <li v-for="(item,index) in playinglyric" :key="index"
                     :class="originMusiccurrent-item.time>=0&&originMusiccurrent-item.time<=5?'playing':''"
                     v-show="originMusiccurrent-item.time>=0&&originMusiccurrent-item.time<=5"
                 >{{item.lyr}}</li>
               </ul>
             </div>
             <div class="musiccontrol">
                <img src="../assets/icon-forward.png" @click="forwardSong(playingindex)">
                <img src="../assets/icon-slowrun.png" @click="slowRun" id="slowrun">
                <img :src="iconurl" @click="startPlay">
                <img src="../assets/icon-fastrun.png" @click="fastRun" id="fastrun">
                <img src="../assets/icon-next.png" @click="nextSong(playingindex)">
             </div>
             <img src="../assets/icon-list.png" @click="playListisShow=true" class="listshow" >
           </div>
          <mt-popup v-model="playListisShow" position="bottom" :modal="false" >
            <div class="playlist">
              <mt-cell :title="'共'+$store.state.playList.length+'首歌'">
                <span @click="playListisShow=false">关闭</span>
              </mt-cell>
              <mt-cell v-for="(item,index) in this.$store.state.playList" :key="index"
                :title="item.name"
                :label="item.singer"
                @click.native="playsong(item.mid,item.name,item.singer,index);getCover(item.mid)"
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
</template>
<script>
import axios from 'axios';
import vueAxios from 'vue-axios';
export default {
    name:'Player',
    data(){
        return{
            bigPlayerisShow:false,//完整播放器的显示与隐藏
            playListisShow:false,//播放列表的显示与隐藏
            actionSheetisShow:false,//播放列表详情上拉菜单的显示与隐藏
            playingurl:"",//当前正在播放的音乐的url
            playingname:"",//当前正在播放的音乐的名字
            playingsinger:"",//当前正在播放的音乐的歌手
            iconurl:require("../assets/icon-play.png"),//播放键图标
            musicduration:"",//音频总时长(分钟),用于显示
            musiccurrent:"",//音频当前位置(分钟),用于显示
            originMusicduration:0,//原始音频总时长(秒),用于操作进度条
            originMusiccurrent:0,//原始音频当前位置(秒)，用于操作进度条
            songDetail:{//单独一首歌的详细信息
              extras:{},
              info:{},
              track_info:{}
            },
            playingablumpic:"",//当前播放的专辑封面
            defaultPlayerpic:require('../assets/icon-defaultplayer.png'),//播放器默认图片,
            defaultPlayername:"Music Player",//播放器默认名字
            playingindex:"",//当前正在播放的音乐在列表中的索引
            playinglyric:[],//当前播放的音乐的歌词对象数组
        }
    },
    methods:{
    addplaylist(mid,name,singer){//调用全局方法,添加播放列表
     this.$store.commit('addPlayList',{mid,name,singer});
    },
    removesong(event,index){//调用全局方法,删除当前的歌曲
     this.$store.commit('removeSong',index);
    },
    playsong(mid,name,singer,index){//请求url进行播放
      let that=this;
      this.playingname=name;//提取歌名
      this.playingsinger=singer;//提取歌手
      axios({//提取url
        url:'/song/urls?id='+mid
      }).then(res=>{
        console.log(res.data.data[mid]);
        that.playingurl=res.data.data[mid];
      }).catch(err=>{
        console.log(err);
        Toast({
          message:"音乐暂时无法播放",
          position:"middle",
          duration:3000
        })
      });
      axios({//请求歌词
        url:'/lyric?songmid='+mid
      }).then(res=>{
        //console.log(res.data.data.lyric);
        let firststep=(res.data.data.lyric||"").split(/\n/);
        let secondstep=firststep.splice(6);
        //console.log(secondstep);
        that.playinglyric=[];//清空之前的记录
        for(let item of secondstep){//将处理后的歌词保存起来
          that.playinglyric.push({
            time:parseInt(item.slice(0,10).slice(1,6).slice(0,2))*60+parseInt(item.slice(0,10).slice(1,6).slice(3,5)),
            lyr:item.slice(10)});
        }
      }).catch(err=>{
        console.log(err);
      });
      this.startPlay(index);
      console.log(index);//当前播放这首歌在播放列表的索引
      this.playingindex=index;
    },
    nextSong(index){//切换到下一首歌
      let nextindex;
      if(index==this.$store.state.playList.length-1){//是最后一首歌时
         nextindex=0;//变为第一首
      }else{
         nextindex=index+1;
      }
      let nextmid=this.$store.state.playList[nextindex].mid;//获取下一首歌的信息
      let nextname=this.$store.state.playList[nextindex].name;
      let nextsinger=this.$store.state.playList[nextindex].singer;
      this.playsong(nextmid,nextname,nextsinger,nextindex);
      this.getCover(nextmid);
      this.iconurl=require("../assets/icon-pause.png");
    },
    forwardSong(index){//切换到上一首歌
      let forwardindex;
      if(index==0){//时第一首歌
        forwardindex=this.$store.state.playList.length-1;
      }else{
        forwardindex=index-1;
      }
      let forwardmid=this.$store.state.playList[forwardindex].mid;//获取上一首歌的信息
      let forwardname=this.$store.state.playList[forwardindex].name;
      let forwardsinger=this.$store.state.playList[forwardindex].singer;
      this.playsong(forwardmid,forwardname,forwardsinger,forwardindex);
      this.getCover(forwardmid);
      this.iconurl=require("../assets/icon-pause.png");
    },
    getCover(mid){//请求封面url
    let that=this;
    axios({//第一层获得一首歌的详细信息
      url:'/song?songmid='+mid
    }).then(res=>{
      console.log(res.data.data);
      that.songDetail=res.data.data;
      console.log(that.songDetail.track_info.album.mid);
      axios({//第二层用详细信息里的专辑获得专辑封面
        url:'/album?albummid='+that.songDetail.track_info.album.mid
      }).then(res=>{
        console.log(res.data.data.picUrl);
        that.playingablumpic=res.data.data.picUrl;
      })
    })
    },
    startPlay(event,index){//开始播放
      let audio=document.querySelector(".audioclass");
      let lyricul=document.querySelector('.playinglyric>ul');
      if(audio.paused){//如果播放器时暂停状态
        audio.play();//开始播放
        this.iconurl=require("../assets/icon-pause.png");//按钮改为暂停键
        this.originMusicduration=parseInt(audio.duration);//得出总时长
        this.musicduration=this.musicTimechange(audio.duration);
        console.log("播放成功");
      }else{//如果播放器在播放
        audio.pause();//暂停
        this.iconurl=require("../assets/icon-play.png");//按钮改为开始键
        console.log("暂停成功");
      }
      audio.ondurationchange=()=>{//音频总时长变化时刷新数据
        this.originMusicduration=parseInt(audio.duration);
        this.musicduration=this.musicTimechange(audio.duration);
      }
     // if(timer){clearInterval(timer);}
      let that=this;
      let timer=setInterval(()=>{//设置定时器,每一秒记录下当前进度
       this.originMusiccurrent=parseInt(audio.currentTime); 
       this.musiccurrent=this.musicTimechange(audio.currentTime);
      // console.log(this.musicTimechange(audio.currentTime));
      if(audio.currentTime==audio.duration){//播放完成时清除定时器,按钮重新变成开始键
        clearInterval(timer);
        this.iconurl=require("../assets/icon-play.png");
        that.nextSong(that.playingindex);
      }
      },1000);
    },
    fastRun(){//快进按钮
      let audio=document.querySelector(".audioclass");
      if(audio.duration-audio.currentTime>15){//当前进度离播完如果大于15s
         audio.currentTime+=15;//快进15s
      }      
    },
    slowRun(){//后退按钮
      let audio=document.querySelector(".audioclass");
      if(audio.currentTime>=15){//当前进度大于15s
        audio.currentTime-=15;
      }
    },
    musicTimechange(time){//将音乐时长与当前进度转化成分钟制
      let duration=parseInt(time);
      let minutes=parseInt(duration/60);
      let seconds=duration%60;
      if(seconds<=9){
        seconds="0"+seconds;
      }
      if(minutes<=9){
        minutes="0"+minutes;
      }
      return minutes+":"+seconds;
    },
    }

}
</script>
<style scoped>
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
  width: 20px;
  height: 20px;
  text-align: center;
  background: #fff;
  border: 1px solid #000;
  position: absolute;
  top: 15px;
  left: 15px;
}
.mint-actionsheet-listitem{
  background-color: #ccc;
}
.playerset{
  position: relative;
}
.playingname{
  position: absolute;
  left: 50%;
  transfrom: translateX(-50%);
  -webkit-transform:translateX(-50%);
  -ms-transform: translateX(-50%);
}
.playingsinger{
  position: absolute;
  top: 55px;
  left: 50%;
  transfrom: translateX(-50%);
  -webkit-transform:translateX(-50%);
  -ms-transform: translateX(-50%);
}
.musiccontrol{
  width: 100%;
  margin-top: 2%;
  margin-left: 25%;
}
.musiccontrol img{
  width: 50px;
  height: 50px;
  margin-left: 15px;
}
#fastrun,#slowrun{
  position: absolute;
  top: 25px;
  width: 20px;
  height: 20px;
}
#slowrun{
  left: -5px;
}
#fastrun{
  right: 10px;
}
.listshow{
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50px;
  height: 50px;
}
.playlist{
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.playinglyric{
  width: 70%;
  height: 170px;
  margin-top: 55px;
  margin-left: 65px;
  text-align: center;
  overflow: hidden;
  position: relative;
}
.playinglyric ul{
  position: absolute;
  top: 15px;
}
.playing{
  color: #f00;
  font-size: 25px;
}
</style>