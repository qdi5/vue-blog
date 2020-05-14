<template>
  <home-layer>
      <el-col slot="header">
        <myheader></myheader>
      </el-col>
      <router-view slot="main"></router-view>
      <div slot="footer">
        <myfooter></myfooter>
      </div>
      <go-top></go-top>
  </home-layer>
</template>
<script>
import HomeLayer from './layer/homeLayer.vue'
import myheader from './myheader.vue'
import myfooter from './myfooter.vue'
import GoTop from '@/components/goTop.vue'

export default {
  name: 'home',
  components: {
    myfooter,
    myheader,
    HomeLayer,
    GoTop
  }
}
</script>
