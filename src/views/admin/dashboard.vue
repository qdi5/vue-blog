<template>
<div>
  <h5>
    username: {{ $store.getters.nickname }}
  </h5>
  <h5>
    role: {{ roleId | convertRole }}
  </h5>
</div>
</template>
<script>
export default {
  data () {
    return {
      username: 'wuzhe',
      roleId: 1
    }
  },
  filters: {
    convertRole (val) {
      let returnVal = ''
      switch (val) {
        case 1:
          returnVal = '管理员'
          break
        default:
          returnVal = '普通用户'
          break
      }
      return returnVal
    }
  }
}
</script>
<style>
</style>
