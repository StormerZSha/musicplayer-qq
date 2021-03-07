<template>
    <div class="album">
        <div class="backtitle">
            <div class="icon" 
            @click="$router.go(-1);$store.state.allSearchisShow=true">
                <img src="../assets/icon-back.png">
            </div>
            <div class="text">
                专辑
            </div>
        </div>
        <div class="msgtitle">
            <div class="cover">
                <img :src="albummsg.picUrl" :alt="albummsg.desc">
            </div>
            <div class="msg">
                <div class="title">{{albummsg.name}}</div>
                <div class="count">{{albumcount}}首歌</div>
                <div class="publict">发行时间:{{albummsg.publicT}}</div>
                <div class="company">唱片公司:{{albummsg.company}}</div>
            </div>
        </div>
        <div class="songlist">
            <mt-cell v-for="(item,index) in albumsong" :key="index"
              :title="item.name"
              :label="item.singer[0].name"
            >
            </mt-cell>
        </div>
        
    </div>  
</template>
<script>

import {Cell,
} from 'mint-ui';
import axios from 'axios';
import vueAxios from 'vue-axios';
import player from '../components/Player'
import Player from '../components/Player.vue';
export default {
    name: 'Album',
    components:{
      player
    },
    data(){
        return {
            albummid:"",//记录专辑id
            albummsg:{//专辑本身信息
                company:"",//公司
                desc:"",//描述
                name:"",//名字
                picUrl:"",//专辑封面
                publicT:""//出版时间
            },
            albumsong:[],//专辑的歌曲列表
            albumcount:"",//专辑歌曲数目
        }
    },
    methods:{
        getAlbumid(){//获取上一个页面传来的专辑id
            this.albummid=this.$route.params.id;
        },
        getAlbummesg(){//获取专辑本身信息
            axios({
                url:'/album?albummid='+this.$route.params.id
            }).then(res=>{
                //console.log(res);
                this.albummsg.company=res.data.data.company;
                this.albummsg.desc=res.data.data.desc;
                this.albummsg.name=res.data.data.name;
                this.albummsg.picUrl=res.data.data.picUrl;
                this.albummsg.publicT=res.data.data.publicT;
            }).catch(err=>{
                console.log(err);
            })
        },
        getSongs(){//获取这个专辑的歌
            axios({
                url:'/album/songs?albummid='+this.$route.params.id
            }).then(res=>{
                console.log(res);
                this.albumsong=res.data.data.list;
                this.albumcount=res.data.data.list.length;
            }).catch(err=>{
                console.log(err);
            })
        }
    },
    created(){
        this.getAlbumid();
        this.getAlbummesg();
        this.getSongs();
        this.getSongs();
    }
}
</script>
<style scoped>
.album{
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
.count,.publict,.company{
    font-size: 12px;
    color: #8f8f8f;
    margin-top: 10px;
}
.mint-cell{
    background-color: rgba(0, 0,0,.1);
}

</style>