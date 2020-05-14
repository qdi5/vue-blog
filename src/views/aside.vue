<template>
  <div>
    <div class="follow-me">
      <h3 class="title">关注我</h3>
      <div class="socail-media flex-horizontal-nowrap flex-horizontal-justify">
          <a href="https://code.aliyun.com/u/wuzhe128520" target="_blank" class="aliyun">
            <i class="iconfont icon-aliyun"></i>
            <div>阿里云code</div>
          </a>
          <a href="https://blog.csdn.net/wuzhe128520" target="_blank" class="csdn">
            <i class="iconfont icon-csdn"></i>
            <div>csdn</div>
          </a>
          <a href="javascript:void(0);" class="weixin">
            <i class="iconfont icon-weixin"></i>
            <div>微信</div>
            <div class="img-wrap">
              <img src="../assets/weixin.png" alt="">
            </div>
          </a>
          <a href="tencent://message/?uin=1038764857&Site=www.qdi5.com&Menu=yes" class="qq">
            <i class="iconfont icon-QQ"></i>
            <div>qq</div>
          </a>
      </div>
    </div>

    <div class="article-tabs">
      <div class="tabs">
        <ul class="flex-horizontal-nowrap flex-horizontal-start">
          <li :class="{ active: tabId === 1 }" @mouseover="tabId = 1">
            <a href="javascript:void(0);">
              点击排行
            </a>
          </li>
          <li :class="{ active: tabId === 2 }" @mouseover="tabId = 2">
            <a href="javascript:void(0);">
              随机文章
            </a>
          </li>
          <li :class="{ active: tabId === 3 }"  @mouseover="tabId = 3">
            <a href="javascript:void(0);">热评文章</a>
          </li>
        </ul>
      </div>
      <div class="tabs-content">
        <div class="tab-item" v-show="tabId === 1">
          <ul v-if="viewsData.length" >
            <li v-for="(views, index) in viewsData" :key="views.id">
              <i class="icon counter" :class="'number-' + (index + 1)"></i>
              <router-link :to="'/article/detail/' + views.id" v-cloak>
                {{ views.title }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="tab-item" v-show="tabId === 2">
          <ul v-if="randomsData.length">
            <li v-for="(randoms, index) in randomsData" :key="randoms.id">
              <i class="icon counter" :class="'number-' + (index + 1)"></i>
              <router-link :to="'/article/detail/' + randoms.id">
                {{ randoms.title }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="tab-item" v-show="tabId === 3">
          <ul v-if="commentsData.length">
            <li v-for="(comments, index) in commentsData" :key="comments.id">
              <i class="icon counter" :class="'number-' + (index + 1)"></i>
              <router-link :to="'/article/detail/' + comments.id">
                {{ comments.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tags-wrap">
      <h3 class="comm-title">标签云</h3>
      <div class="cloud flex-horizontal" v-if="tagsData.length">
        <router-link :to="{path: '/article/tag/' + tag.tag_id, query: {requestType: 1, requestUrl: '/article/tag/' + tag.tag_id, queryContent: tag.tagname}}"  v-for="tag in tagsData" :key="tag.tag_id">{{ tag.tagname }}</router-link>
      </div>
    </div>
    <div class="archive">
      <h3 class="comm-title">文章存档</h3>
      <div class="archive-wrap flex-horizontal flex-horizontal-justify" v-if="archiveData.length">
        <router-link :to="{path: '/article/' + getYearStr(formatDate(archive.time, 'YYYYMM')) + '/' + getMonthStr(formatDate(archive.time, 'YYYYMM')), query: {requestType: 2, queryContent: formatDate(archive.time, 'YYYY年MM月'),  requestUrl: '/article/' + getYearStr(formatDate(archive.time, 'YYYYMM')) + '/' + getMonthStr(formatDate(archive.time, 'YYYYMM'))}}" v-for="(archive, index) in archiveData" :key="index">
          {{ formatDate(archive.time, 'YYYY年MM月') }} ({{ archive.articlenum }})
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabId: 1,
      viewsData: [],
      randomsData: [],
      commentsData: [],
      tagsData: [],
      archiveData: []
    }
  },
  created () {
    // 查询点击排行
    this.$http.get('/article/views').then(data => {
      this.viewsData = data.data
    })
    // 查询随机文章
    this.$http.get('/article/random').then(data => {
      this.randomsData = data.data
    })
    // 查询热评文章
    this.$http.get('/article/mostcomments').then(data => {
      this.commentsData = data.data
    })
    // 查询标签
    this.$http.get('/article/tags').then(data => {
      this.tagsData = data.data
    })
    // 存档
    this.$http.get('/article/archive').then(data => {
      this.archiveData = data.data
    })
  },
  methods: {
    formatDate (time, formatType) {
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
    },
    getYearStr (formatDate) {
      return formatDate.substr(0, 4)
    },
    getMonthStr (formatDate) {
      return formatDate.substr(4)
    }
  }
  /* filters: {
    // 格式化日期
    formatTime (time, formatType) {
      console.log('filters下的this', this)
      return this.formatDate(time, formatType)
    }
  } */
}
</script>
<style lang="less">
.comm-title {
  height: 40px;
  line-height: 40px;
  color: #38485A;
  font-size: 18px;
  border-bottom: 1px solid #E6E6E6;
}
.follow-me {
  .title {
    .comm-title;
  }
}
.socail-media {
  a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #747F8C;
    & > i {
      font-size: 52px;
    }
    &:hover {
      i {
        color: rgb(192, 198, 203);
      }
      color: #000;
    }
  }
  .aliyun {
    & > i {
      color: rgb(51, 51, 51);
    }
  }
  .csdn {
    & > i {
      color: #f44444;
    }
  }
  .weixin {
    position: relative;
    & >i {
      color: rgb(100, 170, 35);
    }
    &:hover {
      .img-wrap {
        display: block;
        opacity: 1;
      }
    }
    .img-wrap {
      position: absolute;
      top: -239px;
      left: -165%;
      width: 220px;
      height: 220px;
      opacity: 0;
      display: none;
      transition: opacity 0.3s;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -28px;
        margin-left: -29px;
        width: 0;
        height: 0;
        border-color: #000 transparent transparent;
        border-style: solid;
        border-width: 30px 30px 0;
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .qq {
    & > i {
      color: #0187FA;
    }
  }
}
.article-tabs {
  margin: 30px 0 20px 0;
}
.tabs {
  height: 32px;
  border-bottom: 1px solid #EAEAEA;
  font-size: 14px;
  ul {
    li {
      height: 32px;
      line-height: 32px;
      list-style-type: none;
      a {
        color: #666;
        height: 100%;
        width: 100%;
        display: block;
        padding: 0 15px;
        box-sizing: border-box;
      }
      &:hover,
      &.active {
        a {
          color: #fff;
          background: #f77825;
        }
      }
    }
  }
}
.tabs-content {
   padding: 10px 0 0 10px;
   ul {
     li {
       border-bottom: solid 1px #EAEAEA;
       line-height: 30px;
       height: 30px;
       overflow: hidden;
       font-size: 14px;
       padding: 10px 0 0 0;
       a {
         color: #666;
       }
       &:hover {
         border-bottom: #000 1px solid;
       }
     }
   }
}
.tags-wrap {
  margin-bottom: 20px;
  overflow: hidden;
}
.cloud a {
  height: 24px;
  line-height: 24px;
  padding: 3px 11px;
  margin: 10px 10px 0 0;
  border-radius: 8px;
  transition: all 0.5s;
  color: #fff;
  &:hover {
     border-radius: 0; text-shadow: #000 1px 1px 1px;
  }
}
.cloud a:nth-child(8n-7) { background: #8A9B0F }
.cloud a:nth-child(8n-6) { background: #EB6841 }
.cloud a:nth-child(8n-5) { background: #3FB8AF }
.cloud a:nth-child(8n-4) { background: #FE4365 }
.cloud a:nth-child(8n-3) { background: #FC9D9A }
.cloud a:nth-child(8n-2) { background: #EDC951 }
.cloud a:nth-child(8n-1) { background: #C8C8A9 }
.cloud a:nth-child(8n) { background: #83AF9B }
.cloud a:first-child { background: #036564 }
.cloud a:last-child { background: #3299BB }
.archive {
  a {
    color: #666;
    font-size: 14px;
    margin-bottom: 15px;
    flex-basis: 45%;
    text-align: left;
  }
}
.archive-wrap {
  & > a:nth-child(2n) {
    text-align: right;
  }
}
</style>
