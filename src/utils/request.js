import axios from 'axios'
// import { Loading } from 'element-ui'
import router from '../router'
import { getCookie, removeCookie } from './cookie'
import gloabl from './default'
const apiPath = gloabl.backend.baseUrl
// 基本配置
const Util = {
  // 请求数
  requestNumber: 0,
  // 保存element的loading对象
  loading: null,
  apiUrl: {
    apiPath: apiPath
  },
  // 显示loading动画
  startLoading: function () {
    /* this.loading = Loading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    }) */
  },
  // 隐藏loading动画
  hideLoading: function () {
    // this.loading.close()
  },
  axios: axios
}

// ajax通用配置
Util.ajax = axios.create({
  baseURL: Util.apiUrl.apiPath,
  withCredentials: true
})

// 设置默认请求超时时间50s
Util.ajax.defaults.timeout = 50000

// 设置请求头携带token
Util.ajax.interceptors.request.use(
  config => {
    const localToken = getCookie('token')
    if (localToken) {
      config.headers.Authorization = localToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 请求拦截器
// config是请求的配置
Util.ajax.interceptors.request.use(config => {
  if (Util.requestNumber === 0) {
    Util.startLoading()
  }
  Util.requestNumber++
  return config
},
error => Promise.reject(error)
)

// 添加响应拦截器
Util.ajax.interceptors.response.use(res => {
  Util.requestNumber--
  if (Util.requestNumber === 0) {
    Util.hideLoading()
  }
  return res.data
}, error => {
  Util.hideLoading()
  if (error.response) {
    switch (error.response.status) {
      // 状态码为401代表未授权（token不存在或失效了）
      case 401:
        removeCookie('token')
        router.replace({
          path: '/login',
          // 将重定向之前的完整路径传递给跳转后的路由
          query: { redirect: router.currentRoute.fullPath }
        })
        break
    }
  }
  return Promise.reject(error)
}
)

const request = Util.ajax
export { request }
export default (Vue, options) => {
  Vue.prototype.$http = {
    get: Util.ajax.get,
    post: Util.ajax.post,
    put: Util.ajax.put,
    delete: Util.ajax.delete
  }
}
