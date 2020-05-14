<template>
  <div></div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      value: true,
      email: ''
    }
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    next()
  },
  mounted () {
    this.confirm()
  },
  methods: {
    confirm () {
      this.$confirm('是否已有本站账号？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        console.log('确认回调函数参数', arguments)
        window.setTimeout(() => {
          this.$router.replace('/bind/user')
        }, 200)
      }).catch(() => {
        // 我是萌新
        // 存入新用户信息
        this.$http.post('/user/add').then(data => {
          this.setUserId(data.data.id)
          this.setNickname(data.data.username)
          this.setAvatar(data.data.avatar)
          // 使用vuex存储用户信息，发起异步请求获取并存储token
          return this.$http.post('/login/local', { username: data.data.id, password: data.data.username })
        }).then(result => {
          this.setToken(result.data.token)
          this.$router.replace('/')
        }).catch(error => {
          throw error
        })
      })
    },
    ...mapMutations([
      'setToken',
      'setUserId',
      'setNickname',
      'setAvatar'
    ])
  }
}
</script>
<style>
</style>
