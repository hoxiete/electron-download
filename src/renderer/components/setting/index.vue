<template>
  <el-dialog class="create-download" title="用户设置" :modal="false" center :visible="showCreate" :show-close="false">
    <el-form class="form">
         <el-form-item label="壁纸图片：" class="downloadPath">
        <el-input readOnly :value="formData.backgroudUrl" style="width: 400px" />
        <el-button
          type="primary"
          circle=""
          icon="el-icon-folder"
          @click="handleChoosePath('backgroudUrl')"
        ></el-button>
      </el-form-item>
      <el-form-item label="默认位置：" class="downloadPath">
        <el-input readOnly :value="formData.savePath" style="width: 400px" />
        <el-button
          type="primary"
          circle=""
          icon="el-icon-folder"
          @click="handleChoosePath('savePath')"
        ></el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import {getGlobalSetting,setGlobalSetting} from '@/utils/electronStoreUtil'
import {
  openFileDialog,
  setLastDownloadPath,
  getLastDownloadPath
} from '../file-manager/ipc-renderer'
export default {
  props: {
    show: Boolean,
    onClose: Function
  },
  watch: {
     show (val) {
      if (val) {
        debugger
        this.showCreate = this.show
        this.loading = true
        // setGlobalSetting({'test':'test'})
        let set = getGlobalSetting()
        if(set!=undefined){
          this.formData = Object.assign(this.formData,set)
        }
        this.loading = false
      }
    },
    currentStrategy (val) {
      debugger
      this.strategy = this.allStrategy.find(item => item == val).strategy
    }
  },
  data () {
    return {
      showCreate: false,
      loading: false,
      formData: {
        backgroudUrl: '',
        savePath:''
      },
    }
  },
  computed: {
    ...mapGetters(['allStrategy', 'currentStrategy']),
  },
  methods: {
    ...mapActions(['addStrategy', 'selectStrategy']),
    // 设置表单值
    handleFormChange (field, data) {
      this.formData = {
        ...this.formData,
        [field]: data,
      }
    },
        // 选择保存位置
    async handleChoosePath (field) {
      debugger
      const newPath = await openFileDialog()
      this.formData = {
        ...this.formData,
        [field]: newPath
      }
      debugger
    },
    // 下载开始
    handleOk () {
      this.handleCancel()
    },
    // 关闭新建对话框
    handleCancel () {
      this.showCreate = false
      this.onClose()
    },
  }
}
</script>
<style scoped>
.downloadPath {
  margin-top: 20px;
}
</style>
