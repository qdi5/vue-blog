<template>
  <div v-if="queryData">
    <h3 class="recommend" v-if="queryType && queryContent && totalCount">{{ queryType }}：<b class="strong">“{{ queryContent }}”</b>， 总共有<b class="strong">{{ totalCount }}</b>篇</h3>
    <div v-if="articleData && articleData.length">
      <section v-for="article in articleData" :key="article.id">
        <div class="article-wrap flex-horizontal-nowrap flex-horizontal-around">
          <div class="article-img"  v-if="article.img">
            <figure>
              <img class="responsive-img" :src="article.img" :alt="article.title">
            </figure>
          </div>
          <div class="post flex-vertical">
            <h3 class="article-title">
              <router-link :to="{path: '/article/detail/' + article.id}">{{ article.title }}</router-link>
            </h3>
            <div class="article-summary">
              {{ article.summery }}
            </div>
            <div class="article-footer flex-horizontal-nowrap flex-horizontal-justify">
              <div class="article-info-left">
                <span class="type">
                  <i class="iconfont icon-tag2"></i>
                  {{ article.typename }}
                </span>
                <span class="time">
                  <i class="iconfont icon-icon-test"></i>
                  &nbsp;{{ article.time | formatTime('YYYY-MM-DD hh:mm') }}
                </span>
              </div>
              <div class="article-info-right">
                <span class="comment">
                  <i class="iconfont icon-comment"></i>
                  <router-link to="/article/detail#comment">评论&nbsp;({{ article.comment_count }})</router-link>
                </span>
                <span class="view">
                  <i class="iconfont icon-50"></i>
                  浏览&nbsp;({{ article.views }})
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div v-else>暂无数据</div>
    <Loading :show="isLoading || articleData === null"></Loading>
    <div v-if="isHasData === false && !isLoading" class="no-more-data">没有更多数据了！</div>
  </div>
</template>
<script>
import _ from 'lodash'
import Loading from '@/components/loading.vue'
export default {
  /**
    queryType: 查询类别;1：代表标签；2：代表按照年月查询；3：代表搜索
    requestUrl: 请求地址；查询类别对应的请求地址
   */
  data () {
    return {
      // 跳转路由获取到的数据
      queryData: null,
      // 查询的类别
      queryType: '',
      requestUrl: '',
      requestType: 0,
      // 查询的内容
      queryContent: '',
      // 获取的文章数据
      articleData: null,
      // 总文章数
      totalCount: 0,
      // 总页数
      totalPage: 0,
      // 当前页
      currentPage: 1,
      // 每页显示条数
      pageSize: 10,
      isLoading: false,
      isHasData: true,
      handleScrollFn: null
    }
  },
  mounted () {
    this.getData()
    this.scroll()
    // document.title = this.$route.
  },
  beforeDestroy () {
    if (this.handleScrollFn != null) {
      window.removeEventListener('scroll', this.handleScrollFn, false)
    }
  },
  methods: {
    getData () {
      // 请求数据
      this.queryData = this.$route.query
      const requestType = Number(this.queryData.requestType)
      const requestUrl = this.queryData.requestUrl
      this.requestUrl = requestUrl
      this.requestType = requestType
      // 根据标签查询
      if (requestType === 1) {
        this.queryType = '标签'
        this.queryContent = this.queryData.queryContent
        this.$http.get(requestUrl).then(data => {
          this.setResponsiveData(data)
        })
      } else if (requestType === 2) {
        const queryContent = this.queryData.queryContent
        this.queryType = queryContent.substring(0, queryContent.length - 3)
        this.queryContent = queryContent.substr(queryContent.length - 3)
        // 根据年月查询
        this.$http.get(requestUrl).then(data => {
          this.setResponsiveData(data)
        })
      } else if (requestType === 3) {
        this.queryType = '搜索'
        this.queryContent = this.queryData.queryContent
        // 搜索
        const keyword = this.queryData.keyword
        this.$http.get(requestUrl + '?keyword=' + keyword).then(data => {
          this.setResponsiveData(data)
        })
      } else if (requestType === 4) {
        this.queryType = '分类'
        this.queryContent = this.queryData.queryContent
        this.$http.get(requestUrl).then(data => {
          this.setResponsiveData(data)
        })
      }
    },
    setResponsiveData (data) {
      if (data && data.data && data.data.articleData) {
        this.articleData = data.data.articleData
        this.totalCount = data.data.articleCount
        this.totalPage = Math.ceil(this.totalCount / this.pageSize)
      }
    },
    getArticleByPage (currentPage, pageSize) {
      let queryString = this.requestUrl
      if (Number(this.requestType) !== 3) {
        queryString += `?currentPage=${currentPage}&pageSize=${pageSize}`
      } else {
        const keyword = this.queryData.keyword
        queryString += `?currentPage=${currentPage}&pageSize=${pageSize}&keyword=${keyword}`
      }
      return this.$http.get(queryString)
    },
    scroll () {
      this.handleScrollFn = this.handleScroll()
      // 绑定滚动事件，判断滚动距离是否大于可视窗口，来显示或隐藏滚动图标
      window.addEventListener('scroll', this.handleScrollFn, false)
    },
    handleScroll: function () {
      return _.debounce(() => {
        // 视口高度(可以看作是窗口可视区域高度)
        const clientHeight = document.documentElement.clientHeight
        const body = document.body
        const html = document.documentElement
        // 获取文档高度
        var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const scrollTop = html.scrollTop || body.scrollTop
        if (scrollTop + clientHeight === documentHeight && this.isHasData) {
          if (this.currentPage < this.totalPage) {
            if (!this.isLoading) {
              this.isLoading = true
              this.getArticleByPage(++this.currentPage, this.pageSize).then(result => {
                this.articleData = this.articleData.concat(result.data.articleData)
                this.isLoading = false
              }).catch(error => {
                this.isLoading = false
                --this.currentPage
                throw error
              })
            }
          } else {
            if (this.currentPage !== 1) {
              this.isHasData = false
            }
          }
        }
      }, 100)
    }
  },
  filters: {
    // 格式化日期
    formatTime (time, formatType) {
      time = new Date(time)
      const date = {
        Y: time.getFullYear(),
        M: time.getMonth() + 1,
        D: time.getDate(),
        h: time.getHours(),
        m: time.getMinutes(),
        s: time.getSeconds()
      }
      let d = '' // 初始化接受日期变量的对象
      let r = false // 判断是否存在待替换的字符
      let reg = null // 正则
      let _d = '' // 日期
      for (d in date) { // 过滤日期标示符
        reg = new RegExp('[' + d + ']{1,}', 'g')// 判断是否有待格式化的字符
        r = reg.test(formatType)
        // 验证是否存在
        if (r) {
          _d = date[d] // 被替换的日期
          formatType = formatType.replace(reg, _d < 10 ? ('0' + _d) : _d)
        }
      }
      return formatType
    }
  },
  components: {
    Loading
  },
  watch: {
    // 监听当前路由的变化，避免不同路由渲染同一视图数据缓存的问题
    // '$route': 'getData'
  }
}
</script>
<style>
.strong {
  color: #f77825;
  display: inline-block;
  padding: 0 3px;
  letter-spacing: 2px
}
</style>
