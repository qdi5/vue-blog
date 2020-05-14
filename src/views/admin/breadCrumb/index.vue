<template>
    <el-breadcrumb separator="/" v-if="item.meta.title">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
            <!-- 如果当前路由不需要跳转，或者是最后一个路由，则添加no-redirect的class -->
            <span v-if="item.redirect === 'noredirect' || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
            <!-- item.redirect：在多级菜单中，如果是最顶层菜单，则使用redirect属性，默认设置跳转到第一个子菜单里 -->
            <router-link v-else :to="item.redirect || item.path">{{ item.meta.title }}</router-link>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
  created () {
    this.getBreadCrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  // 监听路由变化，每次变化都触发路由对应组件的重新渲染（包括调用组件声明周期）
  watch: {
    $route () {
      this.getBreadCrumb()
    }
  },
  methods: {
    getBreadCrumb () {
      // 筛选出拥有name的所有路由
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]

      // 如果不是dashboard，则手动添加上dashboard路由
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>
<style scoped>
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
