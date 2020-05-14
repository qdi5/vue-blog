const permission = {
  state: {
    // 当前用户拥有访问权限的路由数组
    accessedRoutes: []
  },
  mutations: {
    setAccessedRoutes (state, routes) {
      state.accessedRoutes = routes
    }
  }
}
export default permission
