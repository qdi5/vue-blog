
// 通过meta.role判断是否与当前用户权限匹配
/**
 *
 * @param {Array 当前用户拥有的权限数组} roles
 * @param {Object 路由对象} route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    // 只要当前路由里面有一个role是和当前用户roles里面的一个匹配，则拥有访问权限
    return roles.some(role => route.meta.roles.indexOf(role) !== -1)
  }
  return true
}

// 通过后台获取的roles来筛选出符合用户角色权限的路由表
function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouter = asyncRouterMap.filter((route) => {
    // 查看route里的meta对象的roles是否与传入的roles匹配(假设roles都是数组形式)
    if (hasPermission(roles, route)) {
      // 是否有子路由，如果有，则递归判断是否拥有子路由的权限
      if (route.children && route.children.length > 0) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })

  return accessedRouter
}

export default filterAsyncRouter
