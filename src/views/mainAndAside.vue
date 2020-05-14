<template>
  <el-row class="main-wrap" :gutter="20">
    <el-col class="aside" ref="aside" :md="8"  :xl="6" :sm="24">
      <div ref="asideWrap" class="aside-wrap">
        <router-view name = "aside"></router-view>
      </div>
    </el-col>
    <el-col class="main" :md="16"  :xl="18" :sm="24">
      <router-view name = "main" :key="key"></router-view>
    </el-col>
  </el-row>
</template>
<script>
export default {
  computed: {
    key () {
      return (typeof this.$route.name) !== 'undefined' ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style lang="less" scoped>
.main-wrap {
  margin-top: 20px;
  max-width: 100%;
  min-width: 100%
}
.aside-wrap {
  position: relative;
  top: 0;
  min-width: 100%;
  max-width: 100%;
}
@media (min-width: 768px) {
  .main {
    float: left;
  }
  .aside {
    float: right;
  }
}
</style>
