<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <!-- <el-card class="box-card"> -->
        <el-form ref="form" :model="form" label-width="120px" style="margin-left: -16%;">
          <el-form-item label="网址">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-s-promotion"
              @click="searchImgUrl"
              >获取图片</el-button
            >
            <!-- <el-button @click="downloadImg">下载图片</el-button> -->
          </el-form-item>
        </el-form>
        <!-- </el-card> -->
      </el-col>
    </el-row>
    <CreateModal
      :show="createModalShow"
      :searchUrl="searchUrl"
      :onClose="
        () => {
          createModalShow = false;
        }
      "
      @openStrategy="openStrategy"
    />
    <SettingModal
      :show="openSettingFlag"
      :onClose="
        ()=>closeGlogalSetting()
      "
    />
    <EditStrategy :show="editStrategyShow" :onClose="
        () => {
          editStrategyShow = false;
        }
      " />
  </div>
</template>

<script>
// import { searchUrl } from '@/utils/download'
import { validateURL } from '@/utils/validate'
import CreateModal from './file-manager/download/create'
import SettingModal from './setting'
import EditStrategy from './file-manager/download/EditStrategy'

import { mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  components: { CreateModal, EditStrategy,SettingModal },
  data () {
    return {
      createModalShow: false,
      editStrategyShow: false,
      searchUrl: '',
      multipleSelection: '',
      loading: false,
      form: { url: 'http://www.baidu.com' },
      resourceData: []
    }
  },
  computed: {
    ...mapGetters(['openSettingFlag'])
  },
  methods: {
    ...mapActions(['closeGlogalSetting']),
    openStrategy () {
      this.editStrategyShow = true
    },
    generateKey (url) {
      return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
    },
    editSavePath () {

    },
    editStrategy () {

    },
    searchImgUrl () {
      if (validateURL(this.form.url)) {
        this.createModalShow = true
        this.searchUrl = this.form.url
      } else {
        this.$message({
          type: 'error',
          message: '链接不正确'
        })
      }
    },
  }
}
</script>

<style scoped>
.app-container {
  margin: 20% 20% 20% 20%;
}
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
.el-select {
  width: 70%;
}
</style>

