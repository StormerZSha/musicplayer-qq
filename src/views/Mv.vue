<template>
    <div class="mv">
        <div class="backtitle">
            <div class="icon" 
            @click="$router.go(-1);$store.state.allSearchisShow=true">
                <img src="../assets/icon-back.png">
            </div>
            <div class="text">
                MV
            </div>
        </div>
        <video controls :src="mvUrl[0]"></video>
        <div class="msg">
            <h4>{{mvMsg.name}}</h4>
            <span class="singer">演唱:{{mvMsg.singer}}</span>
            <span class="playcnt">播放量:{{mvMsg.playcnt}}</span>
        </div>
        <div class="recommend">
            <div class="rectitle">
                <h4>相关推荐</h4>
            </div>
            <div class="recdetail" v-for="(item,index) in mvRecommend.slice(0,4)" :key="index">
                <div class="cover">
                    <img :src="item.cover_pic" 
                     @click="getrecMvurl(item.vid);getrecMvmsg(item.vid);"
                    >
                </div>
                <div class="name">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import vueAxios from 'vue-axios';
export default {
    name:'Mv',
    data(){
      return{
          mvUrl:"",//存储取得的mvurl
          mvMsg:{//mv的基本信息
              name:"",//名字
              singer:"",//歌手
              playcnt:""//播放次数
          },
          mvRecommend:[],//相关推荐
      }
    },
    methods:{
        //页面初加载时的链接，名字，歌手，播放量，推荐
        getMvurl(){//获取mv播放url
            let that=this;
            axios({
                url:'/mv/url?id='+this.$route.params.id
            }).then(res=>{
                console.log(res);
                that.mvUrl=res.data.data[this.$route.params.id];
            }).catch(err=>{
                console.log(err);
            })
        },
        getMvmsg(){//获取mv信息
            let that=this;
            axios({
                url:'/mv?id='+this.$route.params.id
            }).then(res=>{
                console.log(res);
                that.mvMsg.name=res.data.data.info.name;
                that.mvMsg.singer=
                res.data.data.info.singers[1]?res.data.data.info.singers[0].name+"/"+res.data.data.info.singers[1].name:res.data.data.info.singers[0].name;
                that.mvMsg.playcnt=res.data.data.info.playcnt;
                that.mvRecommend=res.data.data.recommend;
            }).catch(err=>{
                console.log(err);
            })
        },
        //点击推荐后加载的链接，名字，歌手，播放量，不包括推荐
         getrecMvurl(vid){//获取推荐mv播放url
            let that=this;
            axios({
                url:'/mv/url?id='+vid
            }).then(res=>{
                that.mvUrl=res.data.data[vid];
            }).catch(err=>{
                console.log(err);
            })
        },
        getrecMvmsg(vid){//获取推荐mv信息
            let that=this;
            axios({
                url:'/mv?id='+vid
            }).then(res=>{
                that.mvMsg.name=res.data.data.info.name;
                that.mvMsg.playcnt=res.data.data.info.playcnt;
                that.mvMsg.singer=
                res.data.data.info.singers.length==0?"":res.data.data.info.singers[0];
            }).catch(err=>{
                console.log(err);
            })
        }

    },
    created(){
        this.getMvurl();
        this.getMvmsg();
    }
}
</script>
<style scoped>

video{
    width: 100%;
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
.msg{
    margin-top: 5px;
    background-color: #ccc;
    height: 75px;
}
.singer,.playcnt{
    margin-top: 15px;
}
.singer{
    float: left;
}
.playcnt{
    float: right;
}
.recdetail{
    width: 50%;
    float: left;
}
.recdetail img{
    width: 100%;
    height: 100px;
}
</style>