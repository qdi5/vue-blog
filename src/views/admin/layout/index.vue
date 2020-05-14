<template>
  <el-container class="layout-wrapper">
    <el-aside class="layout-left-side" width="180px">
      <el-row>
        <el-col :span="24">
          <slot name="sideMenu"></slot>
        </el-col>
      </el-row>
    </el-aside>
    <el-container class="layout-main-wrapper">
      <el-header>
        <slot name="header"></slot>
      </el-header>
      <el-container class="main-container">
        <el-main>
          <slot name="main"></slot>
        </el-main>
        <el-footer>
          <slot name="footer"></slot>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'layoutIndex'
}
</script>
<style>
</style>
