<template>
  <div>
    <div class="handle-icon text-align-right">
      <el-button type="primary" class="btn-square" icon="el-icon-plus" @click="handleClickAddBtn"></el-button>
    </div>
    导航列表
    <el-table
      ref="multipleTable"
      :data="navData"
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
      label="导航名称"
      >
      </el-table-column>
      <el-table-column
      prop="url"
      label="URL"
      >
      </el-table-column>
      <el-table-column
      prop="typename"
      label="分类"
      >
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button @click="handleDeleteNav(scope.row.id, scope.row.title)">删除</el-button>
          <!-- <el-button type="info" @click="handleUpdateNav(scope.row.id)">修改</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加导航" :visible.sync="dialogFormVisible">
      <el-form :model="navForm" ref="navForm" :rules="navFormRule">
        <el-form-item label="分类" :label-width="formLabelWidth" prop="type">
          <el-select v-model="navForm.type" placeholder="选择类别" v-if="typeData" @change="handleTypeChange">
            <el-option :label="type.typename" :value="type.type_id" v-for="type in typeData" :key="type.type_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导航名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="navForm.title" :readonly="readonly" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" :label-width="formLabelWidth" prop="url">
          <el-input v-model="navForm.url" :readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="父级导航" :label-width="formLabelWidth" prop="pid">
          <el-input v-model="navForm.pid"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddNav">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 导航数据(已有的导航数据)
      navData: null,
      // 控制弹框显示和隐藏
      dialogFormVisible: false,
      // 已经添加过的分类
      formLabelWidth: '100px',
      // 分类数据
      typeData: null,
      readonly: false,
      // 添加导航的表单数据
      navForm: {
        // 标题
        title: null,
        // 导航地址
        url: null,
        // 分类
        type: null,
        // 父级导航的id
        pid: 0
      },
      navFormRule: {
        title: [{
          required: true,
          message: '导航名称不能为空',
          trigger: 'blur'
        }, {
          max: 20,
          message: '导航名称不能超过20个字符',
          trigger: 'blur'
        }],
        url: [{
          required: true,
          message: 'url不能为空',
          trigger: 'blur'
        }, {
          max: 300,
          message: 'url长度不能超过300',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请选择分类',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    // 查询导航
    this.getNav()
  },
  methods: {
    getNav () {
      this.$http.get('/nav').then(result => {
        this.navData = result.data
      })
    },
    getType () {
      // 获取分类
      this.$http.get('/article/types').then(result => {
        if (Array.isArray(result.data)) {
          this.typeData = result.data.filter(obj => {
            if (Array.isArray(this.navData)) {
              return this.navData.every(nav => nav.typeid !== obj.type_id)
            }
          })
        }
      })
    },
    openDialog () {
      this.dialogFormVisible = true
    },
    closeDialog () {
      this.dialogFormVisible = false
    },
    handleClickAddBtn () {
      this.openDialog()
      if (this.typeData === null) {
        this.getType()
      }
    },
    handleAddNav () {
      this.$refs.navForm.validate(valid => {
        if (valid) {
          this.$http.post('/nav/add', {
            title: this.navForm.title,
            pid: this.navForm.pid,
            url: this.navForm.url,
            typeid: this.navForm.type
          }).then(result => {
            if (result.status === 'ok') {
              this.$message({
                message: '添加导航成功',
                type: 'success'
              })
              // 将当前已经添加到导航的类别从数组中移除掉
              this.typeData.forEach((obj, index) => {
                if (obj.type_id === this.navForm.type) {
                  this.typeData.splice(index, 1)
                }
              })
              this.getNav()
              this.closeDialog()
              setTimeout(() => {
                this.resetForm(this.$refs.navForm)
              }, 200)
            } else {
              this.$message.error('添加导航失败')
            }
          }).catch(error => {
            this.$message.error('添加导航失败')
            throw error
          })
        }
      })
    },
    handleDeleteNav (id, title) {
      if (id) {
        this.$confirm('确认删除导航"' + title + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`/nav/${id}`).then(result => {
            if (result.status === 'ok') {
              this.$message({
                message: '删除导航成功',
                type: 'success'
              })
              this.getNav()
            } else {
              this.$message.error('删除导航失败')
            }
          }).catch(error => {
            this.$message.error('服务器错误')
            throw error
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    handleTypeChange (selectedValue) {
      if (selectedValue) {
        if (!this.readonly) {
          this.readonly = true
        }
        this.navForm.url = '/article/type/' + selectedValue
        const selectTypeObj = this.typeData.find(obj => obj.type_id === selectedValue)
        this.navForm.title = selectTypeObj.typename
      }
    },
    resetForm (formRef) {
      formRef.resetFields()
    }
  }
}
</script>
<style>

</style>
