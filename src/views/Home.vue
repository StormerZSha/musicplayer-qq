<template>
  <div class="home">
    这是首页
    <button @click="toatclick">测试mintui</button>
  </div>
</template>

<script>

import {Toast} from 'mint-ui';
export default {
  name: 'Home',
  components: {
   
  },
  methods:{
    toatclick(){
     Toast({
       message:'提示',
       position:'bottom',
       duration:5000
     });
    }
  }
}
</script>
