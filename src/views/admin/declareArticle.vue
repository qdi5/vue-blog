<template>
  <el-form :model="articleForm" ref="articleForm" :rules="rules" label-width="100px" class="demo-ruleForm currentForm">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="articleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="作者" prop="author">
      <el-input v-model="articleForm.author"></el-input>
    </el-form-item>
    <el-form-item label="摘要" prop="summary">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入摘要信息"
        v-model="articleForm.summary">
      </el-input>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <textarea ref="md" v-model="articleForm.content"></textarea>
    </el-form-item>
    <el-form-item required>
      <fieldset class="article-img-wrap">
        <legend>选择文章封面图</legend>
        <div class="upload-wrap">
          <p>图片预览</p>
          <div class="clearfix upload-btn-group choose-file-wrap">
           <el-upload
             class="upload-demo"
             ref="upload"
             list-type="picture-card"
             name="smfile"
             :limit="1"
             accept="image/*"
             action="/img/upload"
             :auto-upload="false"
             :on-remove="handleRemove"
             :before-upload="limitImageSize"
             :on-success="getImgUrl"
             >
             <i slot="trigger" size="small" class="el-icon-plus"></i>
             <el-button size="small" style="marin-left: 10px;" type="success" class="submit-upload-btn" @click="uploadImageManual">上传</el-button>
             <div slot="tip" class="el-upload__tip">
               <ul>
                 <li>1、图片大小不能超过250kb</li>
                 <li>2、支持格式：.jpg .png .gif</li>
               </ul>
             </div>
           </el-upload>
          </div>
        </div>
      </fieldset>
    </el-form-item>
    <el-form-item label="文章标签" prop="selectedTag">
      <el-select
        v-model="articleForm.selectedTag"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请选择文章标签" v-if="articleForm.existedTags">
        <el-option
          v-for="item in articleForm.existedTags"
          :key="item.tag_id"
          :label="item.tagname"
          :value="item.tag_id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分类" prop="selectedType">
      <el-radio-group  v-if="articleForm.type.length" v-model="articleForm.selectedType">
        <el-radio v-for="types in articleForm.type" name="type" :key="types.type_id" :label="types.type_id">
          {{ types.typename }}
        </el-radio>
        <el-button icon="el-icon-plus" class="add-btn" @click="openDialog"></el-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item class="declare-btn">
      <el-button type="primary" @click="declareArticle('articleForm')">发表文章</el-button>
      <span v-if="successed === true">发表文章成功，{{ second.number }}秒后跳转到详情页</span>
      <span v-if="successed === false">发表文章失败</span>
    </el-form-item>
    <el-dialog title="添加分类" :visible.sync="addForm.dialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="addFormRule">
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="addForm.typeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>
<script>
import '@/utils/highlight.js'
import Simplemde from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import marked from 'marked'
import { countDown } from '@/utils/global'
export default {
  data () {
    // 自定义验证标签的规则
    const checkTags = (rule, value, callback) => {
      if (this.articleForm.selectedTag.length < 1 || this.articleForm.selectedTag.length > 5) {
        callback(new Error('最多只能选择5个标签'))
      } else {
        callback()
      }
    }

    // 自定义验证富文本编辑器的规则
    const checkMdEditorContent = (rule, value, callback) => {
      if (marked(this.articleForm.content).length <= 100) {
        callback(new Error('文章内容不能少于100字'))
      } else {
        callback()
      }
    }
    return {
      mdEditor: null,
      imgUrl: '',
      articleForm: {
        title: '',
        author: '',
        summary: '',
        content: '',
        // 新添加的标签
        newTags: [],
        // 数据库中已存在的标签
        existedTags: [],
        type: [],
        selectedType: '',
        selectedTag: []
      },
      successed: null,
      second: { number: 3 },
      rules: {
        title: [{
          required: true,
          message: '标题不能为空'
        }, {
          min: 1,
          max: 50,
          message: '标题应在1到50个字符内'
        }],
        author: [{
          required: true,
          message: '作者不能为空'
        }, {
          min: 2,
          max: 25,
          message: '作者名称应在2到25个字符之间'
        }],
        summary: [{
          max: 300,
          message: '摘要不能超过300个字符'
        }],
        content: [{
          required: true,
          message: '文章内容不能为空'
        }, {
          validator: checkMdEditorContent
        }],
        selectedTag: [{
          required: true, message: '请选择标签'
        }, {
          validator: checkTags,
          trigger: 'change'
        }],
        selectedType: [{
          required: true,
          message: '请选择类别'
        }]
      },
      addForm: {
        typeName: '',
        dialogFormVisible: false
      },
      addFormRule: {
        typeName: [{
          required: true,
          message: '分类不能为空'
        }, {
          max: 20,
          message: '分类名称不能超过20个字符'
        }]
      }
    }
  },
  created () {
    // 查询所有文章标签
    this.$http.get('/article/tags').then(result => {
      console.log('标签', result.data)
      this.articleForm.existedTags = result.data
    })
    this.getAllType()
  },
  mounted () {
    this.loadMdEditor()
    // 监听markdown编辑器的文本改动事件
    this.mdEditor.codemirror.on('blur', () => {
      this.articleForm.content = this.mdEditor.value()
      // 手动验证某一个表单字段
      this.$refs.articleForm.validateField('content')
    })
  },
  methods: {
    getAllType () {
      // 请求所有类别
      return this.$http.get('/article/types').then(result => {
        this.articleForm.type = result.data
        return Promise.resolve('ok')
      }).catch(error => {
        return Promise.reject(error)
      })
    },
    handleRemove (file, fileList) {
      console.log('移除文件：', file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    limitImageSize (file) {
      const isImage = ['image/jpeg', 'image/png', 'image/gif'].some(mimeType => mimeType === file.type.toLowerCase())
      const isLt250kb = file.size / 1024 <= 250
      console.log('判断图片是否合格', isImage, isLt250kb)
      if (!isImage) {
        this.$message.error('图片只能是JPG、png或gif格式!')
      }
      if (!isLt250kb) {
        this.$message.error('上传的图片大小不能超过250kb!')
      }
      return isImage && isLt250kb
    },
    // 手动上传图片
    uploadImageManual () {
      this.$refs.upload.submit()
    },
    // 图片上传成功后，获取图片在图床的地址
    getImgUrl (response, file, fileList) {
      this.imgUrl = response.data.url
    },
    // 加载markdown编辑器
    loadMdEditor () {
      this.mdEditor = new Simplemde({
        // 编辑器渲染的textarea元素
        element: this.$refs.md,
        // 自动保存
        autosave: true,
        // 弹出输入链接或图片地址的框
        promptURLs: true,
        // 拼写检查
        spellChecker: false,
        renderingConfig: {
          singleLineBreaks: false,
          // 使用highlight.js来支持语法高亮
          codeSyntaxHighlighting: true
        }
      })
    },
    // 发表文章
    declareArticle (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const title = this.articleForm.title
          const author = this.articleForm.author
          let summary = this.articleForm.summary
          // 前端选择和创建的标签
          const selectedTagsAry = JSON.parse(JSON.stringify(this.articleForm.selectedTag))
          // 要从已经选择的标签里面区分数据库已有的和新加的标签
          // 数据库中已存在的标签
          const databaseTags = this.articleForm.existedTags
          // 选择的标签中已存在于数据库中的部分
          const existedTagIds = selectedTagsAry.filter(value => {
            return databaseTags.some(obj => obj.tag_id === value)
          })
          // 新添加的标签
          let newTags = []
          // 如果有旧标签,则在已选择的数组中除去旧标签，剩下的就是新标签了
          if (existedTagIds.length > 0) {
            for (let i = 0; i < selectedTagsAry.length; i++) {
              if (existedTagIds.indexOf(selectedTagsAry[i]) !== -1) {
                selectedTagsAry.splice(i, 1)
                i--
              }
            }
          }
          newTags = selectedTagsAry
          const typeId = this.articleForm.selectedType
          const content = marked(this.mdEditor.value())
          const imgUrl = this.imgUrl
          // 如果没有写摘要，则自动设置摘要为文章内容的前300字符
          if (String(summary).trim().length <= 0) {
            summary = content.substr(0, 250)
          }
          this.$http.post('/article/add', {
            title,
            author,
            summary,
            existedTagIds,
            newTags,
            typeId,
            content,
            imgUrl
          }).then(result => {
            console.log('添加文章的结果：', result)
            if (result.status === 'ok') {
              // 添加文章成功，获取刚添加的文章id，三秒后跳转到详情页
              const articleId = result.data.insertId
              this.successed = true
              countDown(this.second, () => {
                this.$router.push({ path: `/article/detail/${articleId}` })
              })
            } else {
              this.successed = false
            }
          }).catch(error => {
            this.successed = false
            throw error
          })
        }
      })
    },
    // 取消弹框
    cancelDialog () {
      this.resetForm(this.$refs.addForm)
      this.closeDialog()
    },
    // 确认弹框
    confirmDialog () {
      // 验证添加类别弹出框
      this.handleAddType()
    },
    handleAddType () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 执行添加请求
          this.$http.post('/type/add', { typeName: this.addForm.typeName }).then(result => {
            if (result.status === 'ok') {
              console.log('添加成功')
              // 重新请求type
              return this.getAllType()
            } else {
              throw new Error('添加失败')
            }
          }).then(ok => {
            console.log('添加并查询成功~~~')
          }).catch(error => {
            throw new Error(error)
          })
          this.closeDialog()
        }
      })
    },
    closeDialog () {
      this.addForm.dialogFormVisible = false
    },
    openDialog () {
      this.addForm.dialogFormVisible = true
    },
    // 重置表单
    resetForm (formRef) {
      formRef.resetFields()
    }
  },
  components: {
  }
}
</script>
<style lang="less" scoped>
.img-wrap {
  width: 200px;
  min-height: 200px;
  border: 1px solid #666;
  & > img {
    display: block;
    width: 100%;
    height: auto;
  }
}
.submit-upload-btn {
  vertical-align: bottom;
}
// 在less中穿透scoped的限制
.currentForm /deep/ .el-upload-list--picture-card {
    margin: 0;
    display: inline-block;
    vertical-align: top;
    height: 148px;
}
.add-btn {
  margin-left: 15px;
}
</style>
