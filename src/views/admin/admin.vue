<template>
  <index-layout>
    <div slot="header">
      <comm-header @changeCollapse="changeCollapse" :isCollapse = "isCollapse"></comm-header>
    </div>
    <div slot="footer">
      <comm-footer></comm-footer>
    </div>
    <div slot="sideMenu">
      <side-menu :isCollapse = "isCollapse"></side-menu>
    </div>
    <div slot="main">
        <router-view :key="key"></router-view>
    </div>
  </index-layout>
</template>
<script>
import IndexLayout from './layout'
import sideMenu from './sidebar/index'
import commHeader from './header'
import commFooter from './footer'
export default {
  name: 'admin',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    changeCollapse (isCollapse) {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {
    IndexLayout,
    sideMenu,
    commHeader,
    commFooter
  },
  computed: {
    key () {
      return (typeof this.$route.name) !== 'undefined' ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>
<style lang="less">
/* 侧边栏宽度 */
@asideWidth: 180px!important;
/* 头部背景 */
@header-bg-color: #f3f3f4;
/* 头部文字颜色 */
@header-color: #999c9e;
/* 侧边栏文字颜色 */
@aside-color: #676a6c;
/* 侧边栏背景 */
@aside-bg-color: #2f4050;
/* 主要内容区域  */
@main-content-bg-color: #f3f3f4;
@main-content-color: #f3f3f4;
/* 底部 */
@footer-bg-color: #fff;
.el-header {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
    padding-left: @asideWidth;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  & > div{
    width: 100%;
  }
}
.el-header, .el-footer {
  background-color: @header-bg-color;
  color: #333;
  line-height: 60px;
}

.el-aside {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 3;
  overflow: hidden;
  background-color: @aside-bg-color;
  color: @aside-color;
  line-height: 200px;
  &.layout-left-side {
    width: @asideWidth;
    overflow: hidden;
  }
}
.layout-main-wrapper {
  margin-left: 180px;
  overflow:hidden;
}
.layout-wrapper {
  &.main-container {
    margin-top: 60px;
    margin-left: @asideWidth;
    background: @main-content-bg-color;
    color: @main-content-color;
    padding: 20px;
  }
}
.el-main {
  position: relative;
  height: 100%;
  margin: 60px 0;
  background: #fff;
  color: #676a6c;
  border-color: #e7eaec;
  border-width: 1px 0;
}

.el-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  padding-left: 300px;
  background-color: @footer-bg-color;
  border-top: 1px solid #e7eaec;
  overflow: hidden;
  height: 36px!important;
  line-height: 36px;
  text-align: right;
}
.sidebar-menu {
  border-right: 0;
}
.responsive-menu-icon {
  display: inline-block;
  margin-left: 25px;
  cursor: pointer;
  transition: transform 0.3s;

}
.rotate90 {
  transform: rotate(90deg);
}

.header-dropdown {
  height: 40px;
}
</style>
