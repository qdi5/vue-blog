<template>
  <div>
    <h2 class="recommend">文章推荐</h2>
    <section v-for="article in articlePageData" :key="article.id">
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
                <router-link :to="{path: '/article/type/' + article.typeid, query: {requestType: 4, requestUrl: '/article/type/' + article.typeid, queryContent: article.typename}}" :key="article.typeid">
                  {{ article.typename }}
                </router-link>
              </span>
              <span class="time">
                <i class="iconfont icon-icon-test"></i>
                &nbsp;{{ article.time | formatTime('YYYY-MM-DD hh:mm') }}
              </span>
            </div>
            <div class="article-info-right">
              <span class="comment">
                <i class="iconfont icon-comment"></i>
                <router-link :to="'/article/detail/' + article.id +'#comment'">评论&nbsp;({{ article.comment_count }})</router-link>
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
    <Loading :show="!articlePageData || isLoading"></Loading>
    <div v-if="(articlePageData && !articlePageData.length)||isHasData === false" class="no-more-data">没有更多数据了！</div>
  </div>
</template>
<script>
import _ from 'lodash'
import { getArticleByPage } from '@/api'
import Loading from '@/components/loading.vue'
import { formatTime } from '@/filters/date.js'
export default {
  props: ['id'],
  data () {
    return {
      articlePageData: null,
      totalData: 0,
      totalPage: 0,
      currentPage: 1,
      pageSize: 10,
      isHasData: true,
      isLoading: false
    }
  },
  created () {
    // 分页获取文章数据
    getArticleByPage(this.currentPage, this.pageSize).then(result => {
      this.articlePageData = result.data.articleData
      this.totalData = result.data.articleCount
      this.totalPage = Math.ceil(this.totalData / this.pageSize)
    }).catch(error => {
      throw error
    })
  },
  mounted () {
    this.scroll()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll(), false)
  },
  methods: {
    scroll () {
      // 绑定滚动事件，判断滚动距离是否大于可视窗口，来显示或隐藏滚动图标
      window.addEventListener('scroll', this.handleScroll(), false)
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
        /* console.log('scrollTop', scrollTop)
        console.log('clientHeight', clientHeight)
        console.log('documentHeight', documentHeight + 100) */
        if (scrollTop + clientHeight >= documentHeight - 120 && this.isHasData) {
          if (this.currentPage < this.totalPage && !this.isLoading) {
            this.isLoading = true
            getArticleByPage(++this.currentPage, this.pageSize).then(result => {
              this.articlePageData = this.articlePageData.concat(result.data.articleData)
              this.isLoading = false
            }).catch(error => {
              this.isLoading = false
              --this.currentPage
              throw error
            })
          } else {
            this.isHasData = false
          }
        }
      }, 100)
    }
  },

  filters: {
    // 格式化日期
    formatTime
  },
  components: {
    Loading
  }
}
</script>
<style lang="less">

</style>
