<template>
  <div class="bind-wrap">
    <div v-show="isShow">正在执行绑定用户操作……</div>
    <div v-if="isBindSuccess === true">
      绑定成功！{{ second.number }} 秒后跳转到{{ page }}……
    </div>
    <div v-else>
       <div v-if="isValid === false">
        链接已经失效,{{ second.number }}秒后跳转到{{ page }}
      </div>
      <div v-if="isRepeat === true">
        此账户已经绑定过了，请勿重新绑定！{{ second.number }}秒后跳到{{ page }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { countDown } from '@/utils/global'
export default {
  data () {
    return {
      isShow: true,
      page: '',
      isValid: '',
      isRepeat: '',
      isBindSuccess: '',
      second: { number: 3 }
    }
  },
  mounted () {
    const verifyKey = this.$route.query.verifyKey
    console.log('verifyKey', verifyKey)
    // 点击邮箱链接确认绑定
    this.$http.get('/user/active?verifyKey=' + verifyKey).then(result => {
      console.log('result', result)
      if (result.status === 'ok') {
        if (!result.errorData) {
          const userId = result.data.userId
          const username = result.data.username
          this.isBindSuccess = true
          // 获取token
          return this.$http.post('/login/local', { username: userId, password: username })
        } else {
          this.isBindSuccess = false
          // 邮箱重复绑定的情况
          if (result.errorData.status === 0) {
            this.isRepeat = true
          }
          this.isShow = false
          this.page = '登录页'
          countDown(this.second, () => {
            this.$router.replace('/')
          })
          return Promise.reject(new Error('请勿重新绑定'))
        }
      } else if (result.status === 'failed') {
        this.isShow = false
        this.isBindSuccess = false
        this.isValid = false
        this.page = '登录页'
        countDown(this.second, () => {
          this.$router.replace('/login')
        })
        return Promise.reject(new Error('链接失效'))
      }
    }).then(result => {
      this.setToken(result.data.token)
      // 获取用户信息
      return this.$http.get('/user')
    }).then(result => {
      // 绑定成功
      if (result.status === 'ok') {
        console.log('获取到的用户信息为：', result.data)
        this.setUserId(result.data.id)
        this.setNickname(result.data.username)
        this.setAvatar(result.data.avatar)
        this.isShow = false
        this.isBindSuccess = true
        this.page = '首页'
        countDown(this.second, () => {
          this.$router.replace('/')
        })
      }
    }).catch(error => {
      // 链接失效
      throw error
    })
  },
  methods: {
    ...mapMutations([
      'setToken',
      'setUserId',
      'setNickname',
      'setAvatar'
    ])
  }
}
</script>
<style lang="less" scoped>
  .bind-wrap {
    width: 100%;
    margin-top: 120px;
    font-size: 18px;
    text-align: center;
  }
</style>
