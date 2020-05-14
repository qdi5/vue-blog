const aside = {
  state: {
    // 当前用户拥有访问权限的路由数组
    catalog: [],
    // 文章内容dom对象
    articleRef: null,
    asideRef: null,
    isAllowScroll: true
  },
  mutations: {
    setCatalogData (state, data) {
      state.catalog = data
    },
    setArticleRef (state, obj) {
      state.articleRef = obj
    },
    setAsideRef (state, obj) {
      state.asideRef = obj
    },
    setIsAllowScroll (state, isAllow) {
      state.isAllowScroll = isAllow
    }
  }
}
export default aside
