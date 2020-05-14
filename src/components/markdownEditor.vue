<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
  <el-form-item prop="content" label="">
    <textarea :ref="element" v-model="ruleForm.content"></textarea>
    <el-button @click="handleReply">{{ btnName }}</el-button>
  </el-form-item>
  </el-form>
</template>
<script>
import '@/utils/highlight.js'
import Simplemde from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import marked from 'marked'
export default {
  props: {
    // 每个编辑器唯一的ref标识字符串
    element: {
      type: String,
      required: true
    },
    // 按钮的名字
    btnName: {
      type: String
    },
    editorType: String,
    maxLetterNumber: Number,
    minLetterNumber: Number
  },
  data () {
    // 自定义验证富文本编辑器的规则
    const checkMdEditorContent = (rule, value, callback) => {
      const markdownContentLength = marked(this.ruleForm.content).length
      if (markdownContentLength < this.minLetterNumber && markdownContentLength > this.maxLetterNumber) {
        callback(new Error(this.editorType + '内容不能少于' + this.minLetterNumber + '字', '且不能多于' + this.maxLetterNumber + '字'))
      } else {
        callback()
      }
    }
    return {
      mdEditor: null,
      ruleForm: {
        content: ''
      },
      rules: {
        content: [{
          required: true,
          message: this.editorType + '内容不能为空'
        }, {
          validator: checkMdEditorContent
        }]
      }
    }
  },
  mounted () {
    this.loadMdEditor()
  },
  methods: {
    // 加载markdown编辑器
    loadMdEditor () {
      this.mdEditor = new Simplemde({
        // 编辑器渲染的textarea元素
        element: this.$refs[this.element],
        // 自动将编辑器里的值同步赋值给原来的textarea
        forceSync: true,
        // autoDownloadFontAwesome: false,
        // 自动保存
        autosave: true,
        // 弹出输入链接或图片地址的框
        promptURLs: true,
        placeholder: '支持markdown语法，快来试试吧~~~',
        // 拼写检查
        spellChecker: false,
        renderingConfig: {
          singleLineBreaks: false,
          // 使用highlight.js来支持语法高亮
          codeSyntaxHighlighting: true
        }
      })

      this.mdEditor.codemirror.on('blur', () => {
        this.ruleForm.content = this.getMarkdownContent()
        // 手动验证某一个表单字段
        this.$refs.ruleForm.validateField('content')
      })
    },
    // 获取markdown编辑器的html内容
    getHtmlContent () {
      return marked(this.getMarkdownContent())
    },
    // 获取编辑器的markdown格式内容
    getMarkdownContent () {
      let val = null
      let returnedValue = null
      if (arguments.length >= 1) {
        val = String(arguments[0])
      }
      if (val === null) {
        returnedValue = this.mdEditor.value()
      } else {
        returnedValue = this.mdEditor.value(val)
      }
      return returnedValue
    },
    setMarkdownContent (val) {
      return this.getMarkdownContent(val)
    },
    // 清空编辑器的内容
    clearEditorContent () {
      this.mdEditor.value('')
    },
    // 绑定按钮的点击事件
    handleReply () {
      this.$refs.ruleForm.validate(valid => {
        // 触发父组件的自定义事件handleClick
        if (valid) {
          this.$emit('handleClick')
        }
      })
    }
  }
}
</script>
<style lang="less">
.CodeMirror, .CodeMirror-scroll {
  min-height: 190px;
}
</style>
