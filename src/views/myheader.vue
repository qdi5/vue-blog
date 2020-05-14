<template>
<div>
  <div class="header">
    <div class="header-top">
      <router-link to="/login" v-if="!isLogin">登录</router-link>
      <span v-else>
        <span>欢迎你：</span>
        <span>{{ nickname }}</span>
        <a href="javascript:void(0);" @click="handleLogout">&nbsp;退出</a>
      </span>
    </div>
  </div>
  <header>
    <div class="container">
      <div class="header-content flex-horizontal flex-horizontal-justify flex-vertical-center">
        <h1 class="site-title">
          前端爱我个人博客
        </h1>
        <form action="" class="search-form">
          <div class="search-wrap flex-horizontal">
            <input placeholder="关键词搜索文章" class="search-box" type="text" v-model="keyword" />
            <a class="search-btn flex-horizontal flex-horizontal-center flex-vertical-center" href="javascript:void(0);">
              <i class="iconfont icon-search" @click="handleSearch()"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  </header>
  <nav>
    <div class="container nav-wrap nav-collapse">
      <ul class="flex-horizontal flex-horizontal-start flex-wrap" v-if="navData">
        <router-link tag="li" to="/home">
          <a href="javascript:void(0);">首页</a>
        </router-link>
        <router-link v-for="n in navData" :key="'nav' + n.id" tag="li" :to="{path: n.url, query: {requestType: 4, requestUrl: '/article/type/' + n.typeid, queryContent: n.typename}}">
          <a href="javascript:void(0);">{{ n.typename }}</a>
        </router-link>
      </ul>
    </div>
  </nav>
</div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      keyword: '',
      navData: null
    }
  },
  created () {
    this.$http.get('/nav').then(result => {
      this.navData = result.data
    })
  },
  methods: {
    handleLogout () {
      this.logout()
      this.$router.push({ path: '/login' })
    },
    handleSearch () {
      if (this.keyword.trim() !== '') {
        this.$router.replace({ path: '/search', query: { requestType: 3, requestUrl: '/article/search', keyword: this.keyword, queryContent: this.keyword } })
      }
    },
    ...mapMutations(['logout'])
  },
  computed: {
    isLogin () {
      return this.$store.state.user.token
    },
    nickname () {
      return this.$store.state.user.nickname
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  background: #f3f3f3;
  color: #666;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
  box-sizing: border-box;
}
.header-top {
  text-align: right;
  margin: 0 auto;
  a {
    color: #666;
  }
}
header {
  margin: 30px auto;
  h1 {
    font-size: 28px;
    font-weight: 300;
    color: #666;
  }
  .search-wrap {
    height: 40px;
    font-size: 0;
    .search-box {
      width: 240px;
      font-size: 12px;
      padding-left: 3px;
    }
    .search-btn {
      width: 40px;
      line-height: 40px;
      text-align: center;
      background-color: rgb(56, 72, 90);
      & > .icon-search {
        color: #fff;
        font-size: 20px;
      }
    }
    & > .search-box,
    & > .search-btn {
      height: 100%;
      display: inline-block;
      box-sizing: border-box;
    }
  }
}
.header-content {
  padding: 0 15px;
}
nav {
  width: 100%;
  background: #31A9B3;
  font-size: 16px;
  line-height: 46px;
  ul.flex-wrap {
    & > li {
      flex-basis: 100px;
      text-align: center;
      margin-right: 5px;
      border-top: 4px solid transparent;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        ul {
          display: block;
        }
      }
      &:hover,
      &.active,
      &.router-link-active {
        border-top: 4px solid #f77825;
        background: #fff;
        & > a {
          color: #000;
        }
      }
      & > a {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    a {
      color: #fff;
    }
  }
}
@media (max-width: 1200px) {
  nav {
    ul.flex-wrap {
      li {
        margin-bottom: 3px;
      }
    }
  }
}
@media (max-width: 768px) {
  nav {
    ul.flex-wrap {
      align-content: center;
      justify-content: flex-start;
      li {
        flex-basis: auto;
        width: 33.333333%;
        box-sizing: border-box;
        margin-right: 0;
        margin-bottom: 3px;
      }
    }
  }
  .search-form,
  .site-title {
    margin-left:  auto;
    margin-right: auto;
  }
}
</style>
