<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="网址">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
            <!-- <el-form-item label="下载路径">
              <el-radio-group v-model="form.resource">
                <el-radio label="需要赞助商"></el-radio>
                <el-radio label="不需要赞助商"></el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="searchImgUrl"
                >获取图片</el-button
              >
              <el-button @click="downloadImg">下载图片</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="17">
                <span>图片url</span>
              </el-col>
              <el-col :span="3">
                <el-progress
                  type="circle"
                  :stroke-width="7"
                  :width="70"
                  :percentage="percent"
                  :status="status"
                  style=""
                ></el-progress>
                <!-- {{ progress.currentSize }} KB -->
              </el-col>
              <el-col :span="4">
                <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                  @click="handleClick"
                  >批量下载</el-button
                >
              </el-col>
            </el-row>
          </div>
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="resourceData"
            tooltip-effect="dark"
            label-position="center"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="url" label="链接">
              <template slot-scope="scope">
                <download-item
                  :ref="generateKey(scope.row.url)"
                  :key="generateKey(scope.row.url)"
                  :url="scope.row.url"
                ></download-item>
              </template>
            </el-table-column>
          </el-table> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import { searchUrl } from '@/utils/download'
import { validateURL } from '@/utils/validate'
import DownloadItem from './downloadItem'
import streamDownload from "@/utils/StreamDownload.js";
import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  components: { DownloadItem },
  data () {
    return {
      multipleSelection: '',
      loading: false,
      form: { url: '' },
      resourceData: []
    }
  },
  computed: {
    ...mapGetters(['percent', 'status'])
  },
  methods: {
    ...mapActions(['addTotal', 'clearStatus']),
    generateKey (url) {
      return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
    },
    downloadImg () {
      // this.$ipcApi.send("downloadImg", this.imgUrl);
      if (validateURL(this.form.url)) {
        this.clearStatus()
        streamDownload.downloadFile(
          this.form.url,
          "D://crawler/javbusImg/")
      } else {
        this.$message({
          type: 'error',
          message: '链接不正确'
        })
      }
    },
    searchImgUrl () {
      if (validateURL(this.form.url)) {
        this.clearStatus()
        this.resourceData = []
        this.loading = true
        var that = this
        searchUrl(this.form.url).then(res => {
          that.resourceData = res.map(ele => { return { url: ele } })
          that.loading = false
        })
      } else {
        this.$message({
          type: 'error',
          message: '链接不正确'
        })
      }
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
    },
    handleClick () {
      let that = this
      this.multipleSelection.forEach((item, i) => {
        let ref = that.generateKey(item.url)
        setTimeout(() => eval('that.$refs.' + ref).downloadImg(), 500)
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 580px;
}
</style>

