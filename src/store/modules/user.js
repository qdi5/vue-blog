import { getCookie, setCookie, removeCookie } from '@/utils/cookie'
import { request } from '@/utils/request'
const user = {
  state: {
    token: getCookie('token'),
    userId: '',
    nickname: '',
    avatar: ''
  },
  mutations: {
    // 设置用户id
    setUserId: (state, userId) => {
      state.userId = userId
    },
    // 设置昵称(也是用户名)
    setNickname: (state, name) => {
      state.nickname = name
    },
    // 设置token值
    setToken: (state, token) => {
      setCookie('token', token, { expires: 7 })
      state.token = token
    },
    // 设置头像
    setAvatar: (state, avatar) => {
      state.avatar = avatar
    },
    // 注销
    logout: (state) => {
      const hostname = window.location.hostname
      const domain = hostname.substring(hostname.indexOf('.'))
      state.token = ''
      removeCookie('token', { domain: domain })
      removeCookie('token', { domain: hostname })
    }
  },
  actions: {
    // 获取用户信息
    getInfo ({ commit, state }) {
      request.get('/user').then(response => {
        const userData = response.data
        commit('setUserId', userData.id)
        commit('setNickname', userData.username)
        commit('setAvatar', userData.avatar_url)
      })
    }
  }
}

export default user
