<template>
    <div class="singer">
        <div class="backtitle">
            <div class="icon" 
            @click="$router.go(-1);$store.state.allSearchisShow=true">
                <img src="../assets/icon-back-white.png">
            </div>
            <div class="text">
                歌手
            </div>
        </div>
        <div class="title">
            <div class="singerpic">
                <img :src="$route.query.url" >
            </div>
            <div class="singername">
                <h1>{{singerName}}</h1>
                <span @click="singerDescisShow=true">歌手详情</span>
                <mt-popup v-model="singerDescisShow">
                    <div>{{singerDesc}}</div>
                </mt-popup>
            </div>
        </div>
        <div class="songlist">
            <div class="hotsong">热门歌曲</div>
            <mt-cell v-for="(item,index) in singerHotsong" :key="index"
              :title="item.name"
              :label="item.singer[1]?item.singer[0].name+'-'+item.singer[1].name:item.singer[0].name"
              @click.native="addplaylist(item.mid,item.name,item.singer[0].name)"
            ></mt-cell>

        </div>
    </div>
</template>
<script>
import {Cell,
} from 'mint-ui';
import axios from 'axios';
import vueAxios from 'vue-axios';
export default {
    name:'Singer',
    data(){
      return{
          singerName:"",//歌手名字
          singerDesc:"",//歌手描述
          singerDescisShow:false,//歌手描述的显示与隐藏
          singerHotsong:[],//歌手热门歌曲
      }
    },
    methods:{
        getSingermsg(){//获取歌手介绍
         let that=this;
            axios({
                url:'/singer/desc?singermid='+this.$route.query.id
            }).then(res=>{
                console.log(res);
                that.singerName=res.data.data.singername;
                that.singerDesc=res.data.data.desc;
            }).catch(err=>{
                console.log(err);
            })
        },
        getSingersong(){//获取歌手热门歌曲
            axios({
                url:'/singer/songs?singermid='+this.$route.query.id
            }).then(res=>{
                console.log(res);
                this.singerHotsong=res.data.data.list;
            }).catch(err=>{
                console.log(err);
            })
        },
        addplaylist(mid,name,singer){//调用全局方法,添加播放列表
          this.$store.commit('addPlayList',{mid,name,singer});
        },
    },
    created(){
        this.getSingermsg();
        this.getSingersong();
    }
}
</script>
<style scoped>
.singer{
    width: 100%;
    position: absolute;
}
.backtitle{
    width: 100%;
    height: 49px;
    border-bottom: 1px solid rgba(0, 0,0,.1);
    background-color: rgba(0, 0,0,.4);
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
.singerpic{
    width: 100%;
    position: fixed;
    top: -20px;
    z-index: -1;
}
.singerpic img{
    width: 100%;
}
.singername{
    width: 100%;
    position: absolute;
    color: #fff;
    left: 0;
    top: 300px;
}
.singername div{
    width: 100%;
    color: #000;
    background-color: rgba(255, 255, 255, .5);
}
.singername h1{
    display: inline-block;
}
.singername span{
    margin-left:20px;
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