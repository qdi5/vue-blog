<template>
<footer>
  <div class="container footer">
    Copyright ©2018-{{ now }}  前端爱我 鄂ICP备16019423号-2
  </div>
</footer>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      now: dayjs().year()
    }
  }
}
</script>
<style lang="less" scoped>
  footer {
    width: 100%;
    margin-top: 35px;
    border-top: 1px solid #eee;
    background: #f6f6f6;

  }
  .footer {
    margin: 30px auto 0;
    padding-bottom: 20px;
    text-align: center;
  }
</style>
