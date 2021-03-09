<template>
    <div class="recommend">
        <div class="backtitle">
            <div class="icon" @click="$router.go(-1);$store.state.allSearchisShow=true;$store.state.allTabbarisShow=true">
                <img src="../assets/icon-back.png">
            </div>
            <div class="text">
                歌单
            </div>
        </div>
        <div class="msgtitle">
            <div class="cover">
                <img :src="songList.logo" :alt="songList.desc">
            </div>
            <div class="msg">
                <div class="title">{{songList.name}}</div>
                <div class="tag">
                    风格:<span v-for="(item,index) in songList.tags" :key="index">{{item.name}}/</span>
                </div>
                <div class="count">{{songList.songnum}}首歌</div>
            </div>
        </div>
        <div class="songlist">
            <mt-cell v-for="(item,index) in songList.list" :key="index"
              :title="item.songname"
              :label="item.singer[1]?item.singer[0].name+'-'+item.singer[1].name:item.singer[0].name"
              @click.native="addplaylist(item.songmid,item.songname,item.singer[0].name)"
            >
            </mt-cell>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import vueAxios from 'vue-axios';
export default {
    name:'Recommend',
    data(){
      return{
          songList:{
              logo:"",
              name:"",
              tags:[],
              desc:"",
              songnum:"",
              list:[]
          },//存储获取的歌曲列表
      }
    },
    methods:{
        getRecommedMsg(){//获取推荐歌单的信息
        let that=this;
          axios({
              url:'/songlist?id='+this.$route.params.id
          }).then(res=>{
             // console.log(res);
              that.songList.logo=res.data.data.logo;//歌单图片
              that.songList.name=res.data.data.dissname;//歌单名字
              that.songList.tags=res.data.data.tags;//歌单标签
              that.songList.desc=res.data.data.desc;//歌单描述
              that.songList.songnum=res.data.data.songnum;//歌曲数量
              that.songList.list=res.data.data.songlist;//歌曲列表,数组
          }).catch(err=>{
              console.log(err);
          })
        },
        addplaylist(mid,name,singer){//调用全局方法,添加播放列表
          this.$store.commit('addPlayList',{mid,name,singer});
        },
    },
    created(){
        this.getRecommedMsg();
    }
}
</script>
<style scoped>
.recommend{
    width: 100%;
    position: absolute;
}
.backtitle{
    width: 100%;
    height: 49px;
    border-bottom: 1px solid rgba(0, 0,0,.1);
    background-color: rgba(0, 0,0,.1);
}
.backtitle img{
    width: 35px;
    height: 35px;
}
.text{
    font-size: 20px;
    line-height: 35px;
}
.icon,.text{
    float: left;
    margin-top: 10px;
}
.msgtitle{
    width: 100%;
    height: 130px;
    background-color: rgba(0, 0,0,.1);
    padding-top: 20px;
}
.cover,.msg{
    float: left;
}
.cover img{
    width: 120px;
    height: 120px;
}
.msgtitle .msg{
    margin-left:15px;
}
.tag,.count{
    font-size: 15px;
    color: #666;
    margin-top: 10px;
}
.mint-cell{
    background-color: rgba(0, 0,0,.1);
}
</style>