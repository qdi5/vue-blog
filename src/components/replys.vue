<template>
<div>
  <template v-if="replys && replys.length">
    <div v-for="reply in replys" :key="reply.rpid">
      <ul class="comment-childs" v-if="reply.hasOwnProperty('rpid')">
        <li id="">
          <div class="media flex-horizontal-nowrap">
            <div class="user media-left">
              <a href="javascript:void(0);">
                <img :src="reply.avatar_url" />
              </a>
            </div>
            <div class="media-body flex-vertical">
              <div class="media-heading">
                <a href="javascript:void(0);">
                  {{ reply.from_username }}
                </a>
                <span>回复</span>
                <a href="javascript:void(0);">
                  {{ reply.to_username }}
                </a>
              </div>
              <p class="comment-content" v-html="reply.reply_content"></p>
              <div class="comment-footer">
                <time>{{ reply.reply_time |  formatTime('YYYY-MM-DD hh:mm') }}</time>
                <a v-if="!(('reply-'  + String(reply.rpid)) === activeReplyBox)" href="javascript:void(0);" class="reply-text" @click="getReplyData(rootCommentId, 5, reply.rpid, reply.rp_from_uid, 1)">
                    <i title="回复图标" class="iconfont icon-huifu"></i>回复
                </a>
                <a v-else  @click="$store.commit('resetActiveReplyBox')" href="javascript:void(0)" class="reply-text">取消回复</a>
                <transition name="fade">
                  <div v-show="('reply-'  + String(reply.rpid)) === activeReplyBox">
                    <markdown-editor editorType="回复" :maxLetterNumber="500" :minLetterNumber="10" btnName="回复" @handleClick="handleReply"  :element="'reply-replyEditor' + String(reply.rpid)" :ref="'reply-replyEditor' + String(reply.rpid)"></markdown-editor>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <reply-item v-if="reply.replys && reply.replys.length" :replys="reply.replys" :activeReplyBox="activeReplyBox"  :rootCommentId="rootCommentId"></reply-item>
    </div>
  </template>
</div>
</template>
<script>
import { formatTime } from '@/filters/date.js'
import MarkdownEditor from '@/components/markdownEditor.vue'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ReplyItem',
  props: ['replys', 'rootCommentId'],
  filters: {
    formatTime
  },
  methods: {
    getReplyData (commentId, replyType, replyId, toUserId, dicid) {
      // 先清空其他编辑器的内容
      this.$store.commit('resetEditorHtmlContent')
      this.setCommReplyData({ commentId, replyType, replyId, toUserId, dicid })
      if (replyType === 5) {
        this.setEditor(this.$refs['reply-replyEditor' + this.$store.state.comment.replyId][0])
      }
    },
    handleReply () {
      if (this.$store.state.comment.replyType === 5) {
        this.setEditor(this.$refs['reply-replyEditor' + this.$store.state.comment.replyId][0])
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
    MarkdownEditor
  }
}
</script>
<style>

</style>
