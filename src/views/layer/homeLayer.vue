<template>
  <div>
    <el-container>
      <el-row class="layer-header">
        <slot name="header"></slot>
      </el-row>
    </el-container>
    <el-container class="layer-content">
      <slot name="main"></slot>
    </el-container>
    <el-container class="layer-footer">
      <el-row class="layer-footer-container">
        <el-col :span="24">
          <slot name="footer"></slot>
        </el-col>
      </el-row>
    </el-container>
    <slot></slot>
  </div>
</template>
<script>
</script>
<style lang="less">
.layer {
  display: flex;
  flex: 1;
  min-height: 100vh;
  flex-flow: column;
  min-width: 100%;
}
.layer-header {
  flex: 1
}
.layer-main {
  flex: 1;
}
.layer-footer {
  position: relative;
  height: 104px;

}
.layer-footer-container {
  flex: 1;
}
.layer-content {
  padding: 0 10px;

}
</style>
