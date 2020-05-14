import { request } from '@/utils/request.js'
import { Message } from 'element-ui'
const comment = {
  state: {
    // 根评论id
    commentId: 0,
    // 回复类型(4代表的是回复的评论，5代表的是回复的回复)
    replyType: 4,
    // 被回复的评论(回复)id
    replyId: 0,
    // 被回复人id
    toUserId: 0,
    // 主题(文章、说说)类型
    dicid: 1,
    // 回复框是否显示
    isReplyBoxShow: false,
    // 确保只有一个回复框出现
    activeReplyBox: '',
    // 编辑器的html内容
    editorHtmlContent: '',
    // 当前正在使用的editor编辑器对象
    currentEditorObj: null,
    // 评论和回复的数据
    commentsAndReplysData: [],
    articleId: 0
  },
  mutations: {
    // 得到当前回复的数据
    setCommReplyData (state, { commentId, replyType, replyId, toUserId, dicid }) {
      if (replyType === 4) {
        state.activeReplyBox = 'comment-' + String(commentId)
      } else {
        state.activeReplyBox = 'reply-' + String(replyId)
      }
      state.commentId = commentId
      state.replyType = replyType
      state.replyId = replyId
      state.toUserId = toUserId
      state.dicid = dicid
    },
    // 设置editor的值
    setEditor (state, editorObj) {
      state.currentEditorObj = editorObj
      state.editorHtmlContent = editorObj.getHtmlContent()
    },
    // 设置articleId的值
    setArticleId (state, id) {
      state.articleId = id
    },
    // 设置评论和回复的数据
    setCommentsAndReplysData (state, data) {
      state.commentsAndReplysData = data
    },
    // 关闭回复框
    resetActiveReplyBox (state) {
      state.activeReplyBox = ''
    },
    // 清空编辑器的内容
    resetEditorHtmlContent (state) {
      if (state.currentEditorObj) {
        state.currentEditorObj.clearEditorContent()
        state.editorHtmlContent = ''
      }
    },
    // 取消回复
    cancelReply (state) {
      if (state.currentEditorObj) {
        state.currentEditorObj.clearEditorContent()
      }
      state.editorHtmlContent = ''
      state.currentEditorObj = null
    }
  },
  actions: {
    // 处理回复;rootState指的是state的顶级对象（它可以获取所有的state）
    handleCommReply ({ dispatch, commit, state, rootState }) {
      console.log('rootState:', rootState)
      // 请求回复接口
      return request.post('/comments/reply/add', {
        commid: state.commentId,
        replytype: state.replyType,
        replyid: state.replyId,
        fromuid: rootState.user.userId,
        touid: state.toUserId,
        content: state.editorHtmlContent,
        dicid: state.dicid
      }).then(result => {
        Message.success('回复成功')
        commit('resetActiveReplyBox')
        commit('resetEditorHtmlContent')
        // 在action函数里调用另一个action函数
        dispatch('getCommentsAndReplysData', state.articleId)
      })
    },
    // 获取评论和回复的数据
    getCommentsAndReplysData ({ commit }, articleId) {
      return request.get(`/comments/article/${articleId}`).then(result => {
        console.log('在vuex的action里查询评论回复数据：', result.data)
        commit('setCommentsAndReplysData', result.data)
      })
    }
  }
}
export default comment
