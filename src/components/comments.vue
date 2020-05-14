<template>
  <ul class="media-list" v-if="commentsAndReplysData.length">
    <li class="media flex-horizontal-nowrap" v-for="commentsReplys in commentsAndReplysData" :key="commentsReplys.commid">
      <!--展示评论 begin-->
      <div class="media-left">
        <a href="javascript:void(0);">
          <img :src="commentsReplys.avatar_url" />
        </a>
      </div>
      <div class="media-body">
        <div class="media-heading">
          <a href="javascript:void(0);">
            {{ commentsReplys.username }}
          </a>
        </div>
        <p class="comment-content" v-html="commentsReplys.content"></p>
        <div class="comment-footer">
          <time>{{ commentsReplys.comm_time | formatTime('YYYY-MM-DD hh:mm') }}</time>
          <a href="javascript:void(0);" v-if="!('comment-' + String(commentsReplys.commid) === activeReplyBox)" :isReplyBoxShow="isReplyBoxShow" class="reply-text"  @click="getReplyData(commentsReplys.commid, 4, commentsReplys.commid, commentsReplys.from_uid, 1)">
            <i title="回复图标" class="iconfont icon-huifu"></i>
            回复
          </a>
          <a v-else  @click="handleCancelReply" class="reply-text" href="javascript:void(0)">取消回复</a>
          <transition name="fade">
            <div v-show="'comment-' + String(commentsReplys.commid) === activeReplyBox">
              <markdown-editor btnName="回复" :maxLetterNumber="500" :minLetterNumber="10" editorType="回复" @handleClick="handleReply"  :element="'comment-replyEditor' + String(commentsReplys.commid)" :ref="'comment-replyEditor' + String(commentsReplys.commid)"></markdown-editor>
            </div>
          </transition>
        </div>
        <replys :replys="commentsReplys.replys" :activeReplyBox="activeReplyBox" :rootCommentId="commentsReplys.commid"></replys>
  <!--表示针对评论的回复-->
      </div>
    </li>
  </ul>
</template>
<script>
import Replys from '@/components/replys.vue'
import { formatTime } from '@/filters/date.js'
import MarkdownEditor from '@/components/markdownEditor.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    commentsAndReplysData: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  },
  filters: {
    formatTime
  },
  methods: {
    // 得到当前回复的数据
    getReplyData (commentId, replyType, replyId, toUserId, dicid) {
      // 先清空其他编辑器的内容
      this.$store.commit('resetEditorHtmlContent')
      this.setCommReplyData({ commentId, replyType, replyId, toUserId, dicid })
      // 评论类型的回复
      if (replyType === 4) {
        this.setEditor(this.$refs['comment-replyEditor' + this.$store.state.comment.commentId][0])
      }
    },
    // 处理回复
    handleReply () {
      if (this.$store.state.comment.replyType === 4) {
        this.setEditor(this.$refs['comment-replyEditor' + this.$store.state.comment.commentId][0])
      }
      this.handleCommReply()
    },
    // 处理取消回复
    handleCancelReply () {
      this.$store.commit('resetActiveReplyBox')
      this.cancelReply()
    },
    ...mapMutations(['setCommReplyData', 'handleCommReply', 'setEditor', 'cancelReply']),
    ...mapActions(['handleCommReply', 'getCommentsAndReplysData'])
  },
  computed: {
    ...mapState({
      isReplyBoxShow: state => state.comment.isReplyBoxShow,
      activeReplyBox: state => state.comment.activeReplyBox
    })
  },
  components: {
    Replys,
    MarkdownEditor
  }
}
</script>
<style lang="less" scoped>
/* 评论部分begin */
.media-list {
  /deep/ .media-left {
    img {
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  /deep/ .media-body {
    padding-left: 14px;
    .media-heading {
      & > a {
        color: #f77825;
      }
    }
  .comment-footer {
      margin-bottom: 10px;
      .reply-text {
        color: #838383;
      }
    }
  }
  /deep/ .comment-childs {
    padding-left: 30px;
  }
  /deep/ .comment-content img {
    display: block;
    max-width: 100%;
  }
}
/* 评论部分end */
</style>
