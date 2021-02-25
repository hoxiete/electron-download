<template>
  <el-form label-position="right" class="form" inline>
    <div style="font-size: 17px; margin: -4px 37% 11px">图片下载</div>
    <el-form-item label="图片地址:">
      <el-input v-model="formData.url" />
    </el-form-item>
    <el-form-item label="名称:">
      <el-input
        placeholder="默认名称为地址后缀,可不填"
        v-model="formData.name"
        style="width: 110%"
      />
    </el-form-item>
    <el-form-item label="位置:">
      <el-row>
        <el-col :span="22">
          <el-input readOnly :value="formData.path" />
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            circle=""
            icon="el-icon-folder"
            @click="handleChoosePath"
          ></el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">下 载</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  newDownloadFile,
  openFileDialog,
  setLastDownloadPath,
  getLastDownloadPath
} from '../ipc-renderer'

export default {
  props: {
    show: Boolean,
    onClose: Function,
  },
  watch: {
    async show (val) {
      if (val) {
        this.formData.url=""
        getLastDownloadPath().then(path =>
          this.formData.path = path)
      }
    }
  },
  data () {
    return {
      formData: {
        url: '',
        path: '',
        fileName: ''
      },
    }
  },
  computed: {
  },
  methods: {
    // 关闭新建对话框
    handleCancel () {
      this.onClose()
    },
    // 设置表单值
    handleFormChange (field, data) {
      this.formData = {
        ...this.formData,
        [field]: data,
      }
    },
    // 下载开始
    handleOk () {
      if (this.formData.path == "") {
        this.$message({
          type: 'error',
          message: '没有下载路径!'
        });
        return;
      }
      newDownloadFile(this.formData)
      this.handleCancel()
    },
    // 选择保存位置
    async handleChoosePath () {
      const newPath = await openFileDialog(this.formData.path || '')
      this.formData = {
        ...this.formData,
        path: newPath
      }
    },
  }
}
</script>
<style scoped>
.downloadPath {
  margin-top: 20px;
}
</style>
