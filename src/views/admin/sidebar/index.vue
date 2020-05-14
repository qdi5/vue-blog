<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
        mode="vertical"
        :show-timeout = "200"
        :default-active="$route.path"
        :collapse = "isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        class="side-menu"
    >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>文章管理</span>
          </template>
          <!-- 只有一级菜单的情况 begin -->
          <router-link to="/admin/article/list">
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span slot="title">
                  文章列表
                </span>
            </el-menu-item>
          </router-link>
          <router-link to="/admin/article/declare">
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              <span slot="title">
                发表文章
              </span>
            </el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>导航管理</span>
          </template>
          <!-- 只有一级菜单的情况 begin -->
          <router-link to="/admin/nav/list">
            <el-menu-item index="2-1">
                <i class="el-icon-menu"></i>
                <span slot="title">
                  导航列表
                </span>
            </el-menu-item>
          </router-link>
        </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>
<script>
export default {
  props: ['isCollapse'],
  data () {
    return {
      permission_routers: []
    }
  }
}
</script>
<style lang="less" scoped>
.side-menu {
    border-right: 0;
}
</style>
