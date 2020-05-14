export default {
  token: state => state.user.token,
  nickname: state => state.user.nickname,
  isLogin: state => {
    return !!state.user.token
  }
}
