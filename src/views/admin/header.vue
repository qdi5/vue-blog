<template>
  <div class="header">
    <div class="left-content">
      <i class="iconfont icon-menu responsive-menu-icon" :class="{vertical: isCollapse}"  @click="handleButtonClick"></i>
      <breadcrumb></breadcrumb>
    </div>
    <el-dropdown class="header-dropdown" v-if="isLogin">
      <span>
        <img src="@/assets/avatar.gif" class="avatar" alt="" />
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ $store.getters.nickname }}</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <router-link v-else :to="{name: 'login'}">登录</router-link>
  </div>
</template>
<script>
import breadcrumb from './breadCrumb'
export default {
  props: ['isCollapse'],
  data () {
    return {
      user: JSON.parse(window.localStorage.getItem('user'))
    }
  },
  methods: {
    handleButtonClick () {
      // this.isCollapse = !this.isCollapse
      this.$emit('changeCollapse')
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters.isLogin
    }
  },
  components: {
    breadcrumb
  }
}
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 25px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.left-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & > div {
    margin-left: 20px;
  }
}
.icon-menu {
  transition: all 0.3s;
}
.vertical {
  transform: rotate(90deg);
}
</style>
