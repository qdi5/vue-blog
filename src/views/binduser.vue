<template>
  <el-dialog title="绑定已有账号" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form :model="form" ref="userForm" :rules="rule">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import _ from 'lodash'
import { mapMutations } from 'vuex'
export default {
  data () {
    // 自定义表单验证规则
    const checkUsername = (rule, value, callback) => {
      this.isUserExist(this.form.username).then(result => {
        if (Boolean(result) === true) {
          callback()
        } else {
          callback(new Error('用户名无效'))
        }
      })
    }
    return {
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {
        username: ''
      },
      rule: {
        username: [{
          required: true,
          message: '请输入用户名'
        }, {
          min: 2,
          max: 25,
          message: '用户名应该在2到25个字符之间'
        }, {
          validator: checkUsername,
          trigger: 'change'
        }]
      }
    }
  },
  mounted () {
    this.openPrompt()
  },
  methods: {
    openPrompt () {
      this.dialogFormVisible = true
    },
    closePrompt () {
      this.dialogFormVisible = false
    },
    ok () {
      // 表单判断
      // 1、输入得用户名不存在，不执行绑定操作
      this.$refs.userForm.validate(valid => {
        if (valid) {
          // 根据用户名绑定当前账号:
          // 给用户发送一封确认绑定的邮件（a、该用户未设置邮箱（无法绑定）；b、已经绑定邮箱(直接发送邮箱)）
          this.$http.post('/user/beforebind', { username: this.form.username }).then(response => {
            this.closePrompt()
            // 该用户未设置邮箱
            if (response.data.status === -1 || response.data.status === 0) {
              this.$alert(response.message, '绑定失败', { showClose: false })
            }
            // 邮件发送成功
            if (response.data.status === 1) {
              this.$alert('绑定账号的确认邮件已发送到您的邮箱：' + response.data.email + '。请进入邮箱确认执行绑定', '提示', { showClose: false })
            }
          }).catch(error => {
            throw error
          })
        }
      })
    },
    // 取消绑定应该直接以新用户身份登录
    cancel () {
      // this.$router.push('/home')
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
    },
    handleBindEmail () {
      // 执行绑定操作
      // 1、检查用户是否已绑定邮箱（邮箱是否为空）
    },
    isUserExist () {
      // 查询用户名是否存在
      return this.$http.get('/user/exist?username=' + this.form.username).then(response => {
        if (response.data.duplicateCount <= 0) {
          return false
          // return Promise.resolve('用户名不存在')
        } else {
          return true
          // return Promise.resolve('有效的用户名')
          // 发送邮件验证
          // 查询用户是否有绑定过邮箱
          // 1、未绑定，则提示绑定到邮箱；然后再发送验证邮件(暂不考虑)
          // 2、已绑定，则直接发送邮件
        }
      }).catch(error => {
        throw error
      })
    },
    ...mapMutations(['setToken', 'setUserId', 'setNickname', 'setAvatar'])
  }
}
</script>
<style>
</style>
