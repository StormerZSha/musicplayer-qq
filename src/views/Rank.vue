<template>
    <div class="rank">
        <div class="backtitle">
            <div class="icon" @click="$router.go(-1);$store.state.allSearchisShow=true;$store.state.allTabbarisShow=true">
                <img src="../assets/icon-back-white.png">
            </div>
            <div class="text">
                排行榜
            </div>
        </div>
        <div class="title">
            <div class="rankpic">
                <img :src="info.picUrl" >
            </div>
            <div class="rankname">
                <h1>{{info.title}}</h1>
            </div>
        </div>
        <div class="songlist">
            <div class="hotsong">排行歌曲</div>
            <mt-cell v-for="(item,index) in list" :key="index"
              :title="index+1+' '+item.name"
              @click.native="addplaylist(item.mid,item.name,item.singerName||item.singer[0].name)"
            >
            {{item.singerName||item.singerName[0].name}}
            </mt-cell>

        </div>
    </div>
</template>
<script>
import axios from 'axios';
import vueAxios from 'vue-axios';
export default {
    name:"Rank",
    data(){
      return{
          info:{},//排行介绍
          list:[],//排行歌曲列表
      }
    },
    methods:{
        getRanklist(){//获取排行信息
            let that=this;
            axios({
                url:"/top?id="+this.$route.params.id
            }).then(res=>{
                console.log(res);
                that.info=res.data.data.info;
                that.list=res.data.data.list;
            }).catch(err=>{
                console.log(err);
            })
        },
         addplaylist(mid,name,singer){//调用全局方法,添加播放列表
          this.$store.commit('addPlayList',{mid,name,singer});
        },
    },
    created(){
        this.getRanklist();
    }
}
</script>
<style scoped>
.rank{
    width: 100%;
    position: absolute;
}
.backtitle{
    width: 100%;
    height: 49px;
    border-bottom: 1px solid rgba(0, 0,0,.1);
    background-color: rgba(255,255,255,.1);
    color: #fff;
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
.title{
    position: relative;
}
.rankpic{
    width: 100%;
    position: fixed;
    top: -20px;
    z-index: -1;
}
.rankpic img{
    width: 100%;
}
.rankname{
    width: 100%;
    position: absolute;
    color: #fff;
    left: 0;
    top: 300px;
}

.hotsong{
    width: 100%;
    height: 50px;
    background-color: rgba(0,0,0,.4);
    color: #fff;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
}
.songlist{
    width: 100%;
    position: absolute;
    top: 395px;
}
</style>