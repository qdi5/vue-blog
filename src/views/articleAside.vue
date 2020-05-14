<template>
  <div class="catalog-container">
    <el-scrollbar wrap-class="diy-scrollbar" ref="catalog">
      <div  class="catalog-wrap hidden-xs-only hidden-sm-only" ref="catawrap">
        <Loading :show="typeof catalog === 'undefined'"></Loading>
        <div v-if="catalog && catalog.length">
          <h3>文章目录</h3>
          <ul v-if="catalog && catalog.length">
            <li class="catalog-level top" v-for="(cata, index) in catalog" :key="index">
              <a @click.prevent="handleCatalogClick($event, cata.head)" :href="'#' + cata.head" v-html="cata.title"></a>
              <ul v-if="cata.hasOwnProperty('children') && cata.children.length" class="catalog-sub-wrap">
                <li class="catalog-level" v-for="(child, i) in cata.children" :key="(String(index) + i)">
                  <a @click.prevent="handleCatalogClick($event, child.head)" :href="'#' + child.head " v-html="child.title"></a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>
    <aside-menu v-if="!catalog || !catalog.length"></aside-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Loading from '@/components/loading.vue'
import { closest } from '@/utils/dom.js'
import AsideMenu from './aside.vue'
import _ from 'lodash'
export default {
  data () {
    return {
      handleScrollFn: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit('setAsideRef', this.$refs.catawrap)
      this.scroll()
    })
  },
  methods: {
    handleCatalogClick (event, head) {
      this.$store.commit('setIsAllowScroll', false)
      const articleDomObj = this.$store.state.aside.articleRef
      const hElement = articleDomObj.querySelector(`[data-id = ${head}]`)
      const target = event.target
      const targetParent = target.parentNode
      // 移除其他条目的active类
      // 获取li的所有兄弟元素
      const liWrapper = closest(targetParent, '.catalog-wrap')
      const lis = liWrapper.getElementsByTagName('li')
      if (document.documentElement) {
        document.documentElement.scrollTop = Math.floor(hElement.getBoundingClientRect().top + window.pageYOffset - hElement.clientTop)
      } else if (document.body) {
        document.body.scrollTop = Math.floor(hElement.getBoundingClientRect().top + window.pageYOffset - hElement.clientTop)
      }
      for (const li of lis) {
        if (li.classList.contains('active')) {
          li.classList.remove('active')
        }
      }
      if (!targetParent.classList.contains('active')) {
        targetParent.classList.add('active')
      }
      setTimeout(() => {
        this.$store.commit('setIsAllowScroll', true)
      }, 10)
    },
    scroll () {
      if (document.documentElement.clientWidth > 768) {
        console.log('this.$store.state.aside.catalog', this.$store.state.aside.catalog)
        if (this.$store.state.aside.catalog) {
          this.handleScrollFn = this.handleScroll()
          window.addEventListener('scroll', this.handleScrollFn, false)
        }
      }
    },
    handleScroll () {
      return _.debounce(() => {
        // 滚动条滚动过得距离等于侧边栏离文档顶部的距离时，将侧边栏设置为fixed
        // let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        console.log('this.$refs[catalog].$el', this.$refs.catalog.$el)
        const targetDomObj = this.$refs.catalog.$el
        // 获取目标元素的大小及其相对于视口的位置
        const rectObject = targetDomObj.getBoundingClientRect()
        // 随着滚动或者自身位置的改变，实时变化的top值
        const computedOffsetTop = rectObject.top
        const catawrapObj = this.$refs.catawrap
        if (computedOffsetTop <= 0) {
          // let computedStyle = window.getComputedStyle(targetDomObj)
          // let calcedWidth = rectObject.width - computedStyle.getPropertyValue('paddingLeft') - computedStyle.getPropertyValue('paddingRight') + 'px'
          // console.log('calcedWidth', calcedWidth)
          catawrapObj.style.width = catawrapObj.getBoundingClientRect().width + 'px'
          catawrapObj.style.position = 'fixed'
          catawrapObj.style.minWidth = 'auto'
        } else {
          catawrapObj.style.position = 'relative'
          catawrapObj.style.width = '100%'
          catawrapObj.style.minWidth = '100%'
        }
      })
    }
  },
  computed: {
    ...mapState({
      catalog: state => state.aside.catalog
    })
  },
  beforeDestroy () {
    this.$store.commit('setCatalogData', null)
    if (this.handleScrollFn !== null) {
      window.removeEventListener('scroll', this.handleScrollFn, false)
    }
  },
  components: {
    Loading,
    AsideMenu
  }
}
</script>
<style lang="less" scoped>
.diy-scrollbar {
  max-height: 350px;
}
.catalog-container {
  position: relative;
  font-size: 14px;
}
.catalog-wrap {
  transition: all 0.2s;
  position: relative;
  top: 0;
  .catalog-sub-wrap {
    padding: 10px 0;
    padding-left: 18px;
    font-size: 13px;
    & > li {
      line-height: 22px;
    }
  }
  .catalog-level {
    a {
      color: inherit;
      padding: 3px 5px;
      transition: all 0.3s;
      &:hover {
        background-color: #ebedef;
      }
    }
    &.active > a {
      color: #31A9B3;
      background: #ebedef;
    }
    &.top {
      margin: 3px 0
    }
  }
}
</style>
