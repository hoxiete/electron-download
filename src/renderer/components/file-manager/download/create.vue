<template>
  <el-dialog class="create-download" title="新建下载" :modal="false" center :visible="showCreate" :show-close="false">
    <el-form class="form">
      <el-card
        v-loading="loading"
        element-loading-text="拼命加载中"
        class="box-card"
      >
        <el-form-item label="爬取规则">
          <el-select v-model="strategy" placeholder="请选择">
            <el-option
              v-for="item in allStrategy"
              :key="item.name"
              :label="item.name"
              :value="item.strategy"
            ></el-option>
          </el-select>
          <el-button type="primary" @click="editStrategy"
            ><i class="el-icon-edit"></i
          ></el-button>
          <el-button type="primary" @click="parseHtml"
            ><i class="el-icon-key"></i
          ></el-button>
          <!-- <el-alert
            title="成功获取html，请设置规则"
            type="success"
            center
            show-icon
          >
          </el-alert> -->
        </el-form-item>
        <el-table
          class="table"
          ref="multipleTable"
          :height="'80%'"
          :data="resourceData"
          tooltip-effect="dark"
          label-position="center"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="url" label="链接"> </el-table-column>
        </el-table>
      </el-card>
      <el-form-item label="位置：" class="downloadPath">
        <el-input readOnly :value="formData.path" style="width: 400px" />
        <el-button
          type="primary"
          circle=""
          icon="el-icon-folder"
          @click="handleChoosePath"
        ></el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">下 载</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { getHtml4Url, parseHtml4Strategy } from '@/utils/download'
import {
  retryDownloadFile,
  getDownloadPath,
  newDownloadFile,
  openFileDialog,
  setLastDownloadPath,
  getLastDownloadPath
} from '../ipc-renderer'

export default {
  props: {
    show: Boolean,
    searchUrl: String,
    onClose: Function
  },
  watch: {
    async show (val) {
      if (val) {
        this.showCreate = this.show
        this.loading = true
        getLastDownloadPath().then(path => this.formData.path = path)
        this.html = await getHtml4Url(this.searchUrl)
        debugger
        this.loading = false
        // this.formData = {
        //   url: '',
        //   fileName: '',
        //   path: getDownloadPath()
        // }
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
      html: '',
      loading: false,
      resourceData: [],
      strategy: '',
      formData: {
        url: '',
        path: ''
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['allStrategy', 'currentStrategy']),
  },
  methods: {
    ...mapActions(['addStrategy', 'selectStrategy']),
    // disabled () { !(formData.url && formData.path), [formData.url, formData.path]) },
    disabled () { },
    handleSelectionChange () {

    },
    editStrategy () {
      if (this.strategy != '') {
        let currentStrategy = this.allStrategy.find(item => item.strategy == this.strategy)
        this.selectStrategy(currentStrategy)
      }
      this.$emit('openStrategy')
    },
    parseHtml () {
      this.resourceData = parseHtml4Strategy(this.html, this.strategy).map(ele => { return { url: ele } })
    },
    // 获取光标，选中内容
    handleFocus (event) {
      event.target.select()
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
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: 'error',
          message: '未选择下载目标!'
        });
        return;
      }
      let selectItem = this.multipleSelection
      selectItem.forEach(async (item, index) => await newDownloadFile({ path: this.formData.path, url: item.url }))
      setLastDownloadPath(this.formData.path)
      this.handleCancel()
    },
    // 关闭新建对话框
    handleCancel () {
      this.showCreate = false
      this.onClose()
    },

    // 选择保存位置
    async handleChoosePath () {
      const newPath = await openFileDialog(this.formData.path || '')
      this.formData = {
        ...this.formData,
        path: newPath
      }
    },
    generateName (url) {
      return url.substring(url.lastIndexOf('/') + 1)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style scoped>
.downloadPath {
  margin-top: 20px;
}
</style>
