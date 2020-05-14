<template>
  <div class="article-list-wrap">
    <div class="handle-icon text-align-right">
      <router-link to="/admin/article/declare">
        <el-button type="primary" class="btn-square" icon="el-icon-plus"></el-button>
      </router-link>
    </div>
    文章列表
    <el-table
        ref="multipleTable"
        :data="articleData"
        style="width: 100%"
        row-class-name="table-header">
      <el-table-column
      prop="id"
      label="id"
      width="60"
      sortable
      >
      </el-table-column>
      <el-table-column
      prop="title"
      label="标题"
      >
      </el-table-column>
      <el-table-column
      prop="author"
      label="作者"
      >
      </el-table-column>
      <el-table-column
      prop="summery"
      label="摘要"
      width="350"
      >
      </el-table-column>
      <el-table-column
      prop="time"
      label="发表时间"
      >
        <template slot-scope="scope">
          {{scope.row.time | formatTime('YYYY-MM-DD hh:mm')}}
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览量">
      </el-table-column>
      <el-table-column prop="typename" label="类别">
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button @click="handleViewArticle(scope.row.id)">查看</el-button>
          <el-button type="info" @click="handleUpdateArticle(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { formatTime } from '@/filters/date.js'
export default {
  data () {
    return {
      // 文章数据
      articleData: null,
      // 当前页
      currentPage: 1,

      // 每页显示几条
      pageSize: 10,

      // 总数据
      total: 0
    }
  },
  created () {
    this.getArticleData(this.currentPage, this.pageSize)
  },
  methods: {
    changePage (currentPage) {
      this.currentPage = currentPage
    },
    // 获取文章数据
    getArticleData (currentPage, pageSize) {
      return this.$http.get(`/article/page/${currentPage}?pageSize=${pageSize}`).then(result => {
        if (result.status === 'ok') {
          this.articleData = result.data.articleData
          this.total = result.data.articleCount
        }
      })
    },
    handleViewArticle (articleId) {
      this.$router.push({ path: '/article/detail/' + articleId })
    },
    handleUpdateArticle (articleId) {
      this.$router.push({ path: '/admin/article/update/' + articleId })
    }
  },
  filters: {
    formatTime
  },
  watch: {
    currentPage: function () {
      this.getArticleData(this.currentPage, this.pageSize)
    },
    pageSize: function () {
      this.getArticleData(this.currentPage, this.pageSize)
    }
  }
}
</script>
<style scoped>
.text-align-right {
  text-align: right;
}
</style>
