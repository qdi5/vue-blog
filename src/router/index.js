import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { getCookie } from '@/utils/cookie'
import { Loading } from 'element-ui'
Vue.use(Router)
/*
// 添加该字段，表明进入这个路由是需要登录的。
const meta = {
  requireAuth: true
}
*/

// 禁止跳转某些路由
function forbidRedirect (to, next) {
  if (to.path.indexOf('login') !== -1) {
    next(false)
  } else {
    next()
  }
}
// 所有权限都拥有的通用路由表
/* export const constantRouterMap = [

]
*/
const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/home',
      component: () => import('@/views/home.vue'),
      children: [
        {
          path: 'home',
          component: () => import('@/views/mainAndAside.vue'),
          children: [
            {
              // 这里的path为空，当父组件匹配不到路由时，默认就会渲染这个子路由
              path: '',
              meta: {
                title: '前端爱我个人博客首页'
              },
              components: {
                main: () => import('@/views/main.vue'),
                aside: () => import('@/views/aside.vue')
              }
            }
          ]
        },
        {
          path: 'search',
          component: () => import('@/views/mainAndAside.vue'),
          children: [
            {
              path: '',
              meta: {
                title: '前端爱我个人博客搜索结果'
              },
              components: {
                main: () => import('@/views/result.vue'),
                aside: () => import('@/views/aside.vue')
              }
            }
          ]
        },
        {
          path: 'article/detail/:id',
          component: () => import('@/views/mainAndAside.vue'),
          props: true,
          children: [{
            path: '',
            meta: {
              title: '文章详情页'
            },
            components: {
              main: () => import('@/views/articleMain.vue'),
              aside: () => import('@/views/articleAside.vue')
            },
            props: {
              main: true,
              aside: false
            }
          }]
        },
        {
          path: 'article/tag/:id',
          component: () => import('@/views/mainAndAside.vue'),
          children: [
            {
              path: '',
              meta: {
                title: '根据标签查询的结果'
              },
              components: {
                main: () => import('@/views/result.vue'),
                aside: () => import('@/views/aside.vue')
              }
            }
          ]
        },
        {
          path: 'article/type/:id',
          component: () => import('@/views/mainAndAside.vue'),
          children: [
            {
              path: '',
              meta: {
                title: '根据分类查询的结果'
              },
              components: {
                main: () => import('@/views/result.vue'),
                aside: () => import('@/views/aside.vue')
              }
            }
          ]
        },
        {
          path: 'article/:year/:month',
          component: () => import('@/views/mainAndAside.vue'),
          children: [
            {
              path: '',
              meta: {
                title: '根据年月查询的文章数据'
              },
              components: {
                main: () => import('@/views/result.vue'),
                aside: () => import('@/views/aside.vue')
              }
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '前端爱我个人博客登录'
      },
      component: () => import('@/views/login.vue')
    },
    {
      path: '/admin',
      redirect: '/admin/dashboard',
      component: () => import('@/views/admin/admin.vue'),
      children: [
        {
          path: 'dashboard',
          meta: {
            title: '前端爱我个人博客后台管理'
          },
          component: () => import('@/views/admin/dashboard')
        },
        {
          path: 'article/declare',
          meta: {
            title: '发表文章'
          },
          component: () => import('@/views/admin/declareArticle.vue')
        },
        {
          path: 'article/list',
          meta: {
            title: '文章列表'
          },
          component: () => import('@/views/admin/articleList.vue')
        },
        {
          path: 'article/update/:articleId',
          props: true,
          meta: {
            title: '修改文章'
          },
          component: () => import('@/views/admin/updateArticle.vue')
        },
        {
          path: 'nav/list',
          props: true,
          meta: {
            title: '导航列表'
          },
          component: () => import('@/views/admin/navList.vue')
        }
      ]
    },
    {
      path: '/bind/email',
      name: 'bindemail',
      meta: {
        title: '前端爱我个人博客绑定邮箱'
      },
      component: () => import('@/views/bindemail.vue')
    },
    {
      path: '/bind/user',
      name: 'bindeuser',
      meta: {
        title: '绑定已存在的用户'
      },
      component: () => import('@/views/binduser.vue')
    },
    {
      path: '/bind/user/active',
      name: 'bindUserActive',
      meta: {
        title: '激活绑定用户'
      },
      component: () => import('@/views/bindUserActive.vue')
    },
    {
      path: '/has/account',
      name: '/hasAccount',
      meta: {
        title: '是否已有前端爱我个人博客账号'
      },
      component: () => import('@/views/hasAccount.vue')
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    },
    {
      path: '/404',
      meta: {
        title: '404页面'
      },
      component: () => import('@/views/404.vue')
    }
  ]
})
let loadingInstance = null
// 路由全局前置守卫
router.beforeEach((to, from, next) => {
  loadingInstance = Loading.service({ lock: true })
  const token = getCookie('token')
  // 修改网页标题
  window.document.title = to.meta.title
  // token存在的情况（代表用户登录成功过）
  if (token) {
    if (!String(store.getters.token)) {
      store.commit('setToken', token)
    }
    if (String(store.getters.nickname) === '') {
      // 当vuex中没有用户数据时，从后台获取
      store.dispatch('getInfo')
    }
    forbidRedirect(to, next)
  } else {
    // 如果token不存在；判断路由是否需要登录权限
    if (to.meta.requireAuth) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
})

// 路由全局后置守卫
router.afterEach((to, from) => {
  loadingInstance.close()
})
export default router
