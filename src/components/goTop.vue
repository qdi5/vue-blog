<template>
  <i class="iconfont icon-backtotop back-to-top" @click="goTop" ref="backBtn"></i>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      timer: null,
      handleScrollFn: null
    }
  },
  mounted () {
    this.scroll()
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScrollFn, false)
  },
  methods: {
    scroll () {
      this.handleScrollFn = this.handleScroll()
      // 绑定滚动事件，判断滚动距离是否大于可视窗口，来显示或隐藏滚动图标
      window.addEventListener('scroll', this.handleScrollFn, false)
    },
    goTop () {
      // 滚回顶部
      window.scroll(0, 0)
    /* if (this.timer == null) {
        let rootFirstChild = null
        if (document.documentElement) {
          rootFirstChild = document.documentElement
        } else if (document.body) {
          rootFirstChild = document.body
        }
        this.timer = window.setInterval(() => {
          let newScrollTop = 0
          let scrollTop = rootFirstChild.scrollTop
          console.log('scrollTop', scrollTop)
          let speed = Math.floor(-scrollTop / 5)
          rootFirstChild.scrollTop = newScrollTop = scrollTop + speed
          console.log('rootFirstChild.scrollTop', rootFirstChild.scrollTop)
          if (newScrollTop <= 0) {
            console.log('setInterval end');
            rootFirstChild.scrollTop = 0
            clearInterval(this.timer)
            this.timer = null
          }
        }, 30)
      } */
    },
    handleScroll: function () {
      return _.debounce(() => {
        // 视口高度(可以看作是窗口可视区域高度)
        const clientHeight = document.documentElement.clientHeight
        const backTop = this.$refs.backBtn
        const body = document.body
        const html = document.documentElement
        // 获取文档高度
        var documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const scrollTop = html.scrollTop || body.scrollTop
        if (scrollTop + clientHeight >= documentHeight - 120) {
          backTop.style.display = 'block'
        } else {
          backTop.style.display = 'none'
        }
      }, 100)
    }
  }
}
</script>
