import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import comment from './modules/comment'
import aside from './modules/aside'
import getters from './getters'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    comment,
    aside
  },
  // vuex会自动给getters回调函数里设置一个store参数
  getters
})
