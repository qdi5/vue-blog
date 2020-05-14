<template>
  <div>
    <div v-if="detailsData">
      <p class="location">
        <i class="iconfont icon-iconlocation"></i>
        您的位置是：<router-link to="/home">首页></router-link>
        <router-link :to="{path: '/article/type/' + detailsData.type_id, query: {requestType: 4, requestUrl: '/article/type/' + detailsData.type_id, queryContent: detailsData.typename}}">
        {{ detailsData.typename }}></router-link>
        {{ detailsData.title }}
      </p>
      <h2 class="article-title">{{ detailsData.title }}</h2>
      <p class="article-other-info">
        <span><i class="iconfont icon-admin"></i> {{ detailsData.author }}</span>
        <span><i class="iconfont icon-calendar"></i> {{ detailsData.time | formatTime('YYYY-MM-DD hh:mm') }}</span>
        <span>共<i>{{ detailsData.views }}</i>人围观</span>
      </p>
      <p class="tags"  v-if="tags">
        <router-link v-for="tag in tags" :key="tag.tag_id" :to="{path: '/article/type/' + tag.tag_id }">{{ tag.tagname }}</router-link>
      </p>
      <div class="article-summary">
        {{ detailsData.summery }}
      </div>
      <div class="article-content" v-html="detailsData.content" ref="article"></div>
    </div>
    <Loading v-else :show="!detailsData"></Loading>
    <div class="socail-share flex-horizontal-nowrap">
      <baidu-share v-if="detailsData" :title="detailsData.title" :url="href" :summary="detailsData.summery"></baidu-share>
    </div>
    <div v-if="lastData">
      <p class="last-article">
        上一篇：
        <router-link :to="{path: '/article/detail/' + lastData.id}" v-if="lastData && Object.keys(lastData).length">{{ lastData.title }}</router-link>
        <span v-else>没有了</span>
      </p>
      <p class="next-article">
        下一篇：
        <router-link :to="{path: '/article/detail/' + lastData.id}" v-if="nextData && Object.keys(nextData).length">{{ nextData.title }}</router-link>
        <span v-else>没有了</span>
      </p>
    </div>
    <div class="relative-articles-wrap">
      <h3 class="article-undeline">
        <i class="iconfont icon-bookopen"></i>
        相关文章
      </h3>
      <div class="relative-articles flex-horizontal-justify" v-if="relativeData.length">
        <router-link :to="{path: '/article/detail/' + relative.id}"  v-for="relative in relativeData" :key="relative.id">{{ relative.title }}</router-link>
      </div>
    </div>
    <div class="article-comments-wrap">
      <h3 class="article-undeline">
        <i class="iconfont icon-comment"></i>
        文章评论
      </h3>
      <!-- 评论开始 -->
      <div class="article-comments" id="comment">
        <comments :commentsAndReplysData="commentsReplys" v-if="commentsReplys.length"></comments>
        <p v-if="$store.getters.isLogin && !commentsReplys.length">暂无评论哟，快来留下你的第一条评论吧：</p>
      </div>
      <!-- 评论结束 -->
    </div>
    <div v-if="$store.getters.isLogin">
      <markdown-editor editorType="评论" btnName="发表评论" @handleClick="declareComment" element="commentEditor" ref="s" ></markdown-editor>
    </div>
    <p v-else>您暂未<router-link to="/login" class="login-a">登录</router-link>，暂时不能发表评论!</p>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import { formatTime } from '@/filters/date.js'
import MarkdownEditor from '@/components/markdownEditor.vue'
import Comments from '@/components/comments.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
import Loading from '@/components/loading.vue'
import BaiduShare from '@/components/baiduShare.vue'
import _ from 'lodash'
export default {
  props: ['id'],
  data () {
    return {
      tags: [],
      detailsData: null,
      lastData: null,
      nextData: null,
      relativeData: [],
      combineHElementAry: [],
      handleScrollFn: null
    }
  },
  mounted () {
    const articleId = this.id
    // 查询文章详情数据
    this.$http.get(`/article/detail/${articleId}`).then(result => {
      this.tags = result.data.articleTags
      this.detailsData = result.data.articleDetailData[0]
      this.$nextTick(() => {
        window.document.title = this.detailsData.title
        // 构建目录需要的数据
        const articleDomObj = this.$refs.article
        // 高亮代码块
        const codeBlocks = [...articleDomObj.querySelectorAll('pre code')]
        codeBlocks.forEach(function (block) {
          hljs.highlightBlock(block)
        })
        this.$nextTick(() => {
          const h2NodeList = Array.prototype.slice.call(articleDomObj.getElementsByTagName('h2'))
          const h3NodeList = Array.prototype.slice.call(articleDomObj.getElementsByTagName('h3'))
          // 相对于视口左上角的固定偏移距离: obj.getBoundingClientRect().top + (document.documentElement.scrollTop || document.body.scrollTop)
          const h2OffsetTopAry = h2NodeList.map(obj => ({ element: obj, top: Math.floor(obj.getBoundingClientRect().top + window.pageYOffset - obj.clientTop) }))
          const h3OffsetTopAry = h3NodeList.map(obj => ({ element: obj, top: Math.floor(obj.getBoundingClientRect().top + window.pageYOffset - obj.clientTop) }))
          // h2和h3元素集合合并后的数组
          const combineHElementAry = h2OffsetTopAry.concat(h3OffsetTopAry)
          // catalog目录数据
          const catalog = []
          let headIndex = -1
          // 按照offset.top顺序排序
          combineHElementAry.sort((a, b) => a.top - b.top)
          this.combineHElementAry = combineHElementAry
          for (let i = 0, length = h2OffsetTopAry.length; i < length; i++) {
            const h2Obj = h2OffsetTopAry[i]
            let nextH2Obj = null
            if (i !== length - 1) {
              nextH2Obj = h2OffsetTopAry[i + 1]
            }
            const h2HeaderIndex = 'head-' + (++headIndex)
            catalog.push({
              title: h2Obj.element.innerHTML,
              head: h2HeaderIndex
            })
            h2Obj.element.setAttribute('data-id', h2HeaderIndex)
            catalog[i].children = []
            for (let j = 0, lg = h3OffsetTopAry.length; j < lg; j++) {
              const h3Obj = h3OffsetTopAry[j]
              let h3HeaderIndex = ''
              // 判断哪些h3标签是属于当前h2标签的子标题
              if (nextH2Obj != null) {
                if (h3Obj.top > h2Obj.top && h3Obj.top < nextH2Obj.top) {
                  h3HeaderIndex = 'head-' + (++headIndex)
                  h3Obj.element.setAttribute('data-id', h3HeaderIndex)
                  catalog[i].children.push({
                    // textContent 表示一个节点及其后代的文本内容
                    title: h3Obj.element.textContent,
                    head: h3HeaderIndex
                  })
                }
              } else {
                if (h3Obj.top > h2Obj.top) {
                  h3HeaderIndex = 'head-' + (++headIndex)
                  h3Obj.element.setAttribute('data-id', h3HeaderIndex)
                  catalog[i].children.push({
                    title: h3Obj.element.textContent,
                    head: h3HeaderIndex
                  })
                }
              }
            }
          }
          if (catalog.length) {
            // 将目录数据传递给侧边栏组件
            this.$store.commit('setCatalogData', catalog)
            this.$store.commit('setArticleRef', articleDomObj)
            this.handleScrollFn = this.handleScroll()
            // 监听滚动，滚动到指定的标题，高亮右侧目录
            window.addEventListener('scroll', this.handleScrollFn, false)
          }
        })
      })
      return this.detailsData.typeid
    }).then(typeId => {
      // 根据文章类别查询相关类似文章
      this.$http.get(`/article/relative?typeid=${typeId}`).then(result => {
        this.relativeData = result.data
      })
    }).catch(error => {
      console.error('查询详情出错')
      throw error
    })
    // 查询上一篇
    this.$http.get(`/article/last?articleId=${articleId}`).then(result => {
      this.lastData = result.data[0]
    }).catch(error => {
      console.error('查询上一篇出错')
      throw error
    })
    // 查询下一篇
    this.$http.get(`/article/next?articleId=${articleId}`).then(result => {
      this.nextData = result.data[0]
    }).catch(error => {
      throw error
    })
    this.getComments(articleId)
    this.$store.commit('setArticleId', articleId)
  },
  destroyed () {
    if (this.handleScrollFn !== null) {
      window.removeEventListener('scroll', this.handleScrollFn, false)
    }
  },
  methods: {
    // 发表评论
    declareComment () {
      const editorObj = this.$refs.s
      const content = editorObj.getHtmlContent()
      const dicid = 1
      const fromUid = this.$store.state.user.userId
      const topicId = this.id
      this.$http.post('/comments/article/add', { content, dicid, fromUid, topicId }).then(result => {
        // 清空编辑器的内容
        this.$message({
          message: '评论成功',
          type: 'success'
        })
        editorObj.clearEditorContent()
        this.getComments(topicId)
      }).catch(error => {
        throw error
      })
    },
    getComments (articleId) {
      // 使用vuex获取文章的评论和回复
      this.getCommentsAndReplysData(articleId).then(() => {
        this.$nextTick(() => {
          const comment = document.getElementById('comment')
          const codeBlocks = [...comment.querySelectorAll('pre code')]
          codeBlocks.forEach(function (block) {
            hljs.highlightBlock(block)
          })
        })
      })
    },
    handleScroll () {
      return _.throttle(() => {
        if (this.$store.state.aside.isAllowScroll) {
          // 滚动条滚动过的距离
          const scrollTop = Math.floor((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop)
          const combineHElementAry = this.combineHElementAry
          const asideDomObj = this.$store.state.aside.asideRef
          const liDomList = asideDomObj.querySelectorAll('li')
          for (let i = 0, length = combineHElementAry.length; i < length; i++) {
            const currentHelement = combineHElementAry[i]
            let nextHelement = null
            if (i !== length - 1) {
              nextHelement = combineHElementAry[i + 1]
            }
            const dataId = currentHelement.element.getAttribute('data-id')
            const aElement = asideDomObj.querySelector(`a[href="#${dataId}"]`)
            if (nextHelement !== null) {
              // 不满足这个条件，最终都会走到else里面去
              if (scrollTop >= currentHelement.top && scrollTop <= nextHelement.top) {
                // 高亮右侧对应的目录条
                // 对应的锚点
                for (const li of liDomList) {
                  if (li.classList.contains('active')) {
                    li.classList.remove('active')
                  }
                }
                if (!aElement.parentNode.classList.contains('active')) {
                  aElement.parentNode.classList.add('active')
                }
                break
              }
            } else {
              for (const li of liDomList) {
                if (li.classList.contains('active')) {
                  li.classList.remove('active')
                }
              }
              if (scrollTop >= combineHElementAry[combineHElementAry.length - 1].top) {
                const lastLiElement = liDomList[liDomList.length - 1]
                if (!lastLiElement.classList.contains('active')) {
                  lastLiElement.classList.add('active')
                }
              }
              break
            }
          }
        }
      }, 300)
    },
    ...mapMutations(['setEditor']),
    ...mapActions(['getCommentsAndReplysData'])
  },
  computed: {
    ...mapState({
      commentsReplys: state => state.comment.commentsAndReplysData
    }),
    href () {
      return window.location.href
    }
  },
  filters: {
    formatTime
  },
  components: {
    Comments,
    MarkdownEditor,
    Loading,
    BaiduShare

  }
}
</script>
<style lang="less" scoped>
.location {
  font-size: 14px;
  line-height: 36px;
  color: #666;
  a {
    color: #333;
    margin: 0 5px;
    &:hover {
        color: #000;
        text-decoration: underline;
    }
  }
}
.article-title {
  font-size: 30px;
  font-weight: 400;
  padding: 20px 0 10px 0;
  color: #38485A;
}
.article-other-info {
  color: #999999;
  line-height: 18px;
  position: relative;
  span {
    margin-right: 15px;
    &:last-child {
      margin-right: 0;
      margin-left: 15px;
    }
    i {
      color: #333;
      padding: 0 5px;
      font-style: normal;
    }
  }
}
.tags {
  & > a {
    background: #F4650E;
    padding: 3px 8px;
    margin: 0 5px 0 0;
    color: #fff;
  }
}
.article-summary {
  color: #888888;
  border: 1px solid #F3F3F3;
  padding: 10px;
  margin: 20px auto 15px auto;
  line-height: 23px;
  background: none repeat 0 0 #F6F6F6;
  font-size: 16px;
}
.article-content {
  line-height: 24px;
  font-size: 18px;
  overflow: hidden;
  /deep/ img {
    border: 0;
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
  /deep/ img + img {
    margin-top: 15px;
  }
  /deep/ h2,
  /deep/ h3 {
    font-weight: 600;
    color: #333;
    line-height: 1.5;
    margin-top: 35px;
    margin-bottom: 10px;
    padding-bottom: 12px;
  }
  /deep/ h2 {
    font-size: 24px;
    border-bottom: 1px solid #ececec;
  }
  /deep/ h3 {
    font-size: 18px;
    padding-bottom: 0;
  }
  /deep/ h2 + h3 {
    margin-top: 0
  }
  /deep/ ul {
    padding-left: 20px;
    li {
      list-style-type: disc;
      margin-left: 15px;
    }
  }
  /deep/ a {
    color: #0269c8;
    border-bottom: 1px solid #d1e9ff;
    &:hover {
      color: #275b8c;
    }
  }
}
.socail-share {
  padding: 10px 0;
}
.last-article,
.next-article {
  a {
    color: #666;
    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }
}
.relative-articles {
  font-size: 0;
  a {
    display: inline-block;
    margin-bottom: 10px;
    width: 50%;
    flex-basis: 50%;
    font-size: 12px;
    color: #666;
    overflow: hidden;
    &:hover {
      text-decoration: underline;
      color: #09C;
    }
  }
}
.article-undeline {
  border-bottom: #099 2px solid;
  line-height: 40px;
  font-size: 14px;
  color: #000;
}
.login-a {
  color: #F4650E;
}
</style>
