<!--  -->
<template>
  <div class="window-title">
    <!-- 软件logo预留位置 -->
    <div style="-webkit-app-region: drag" class="logo">
      <!-- <svg-icon icon-class="electron-logo"></svg-icon> -->
      <!-- <i class="el-icon-delete"></i> -->
    </div>
    <!-- 菜单栏位置 -->
    <div></div>
    <!-- 中间标题位置 -->
    <div style="-webkit-app-region: drag" class="title"></div>
    <div class="controls-container">
      <div class="windows-icon-bg">
        <el-popover
          placement="bottom"
          width="400"
          trigger="manual"
          v-model="visible"
        >
          <downloadIndex
          />
          <template slot="reference">
            <el-badge :hidden="count <= 0" :value="count" class="icon-size">
              <el-button
                type="info"
                icon="el-icon-message"
                circle
                @click="visible=!visible"
              ></el-button>
            </el-badge>
          </template>
        </el-popover>
      </div>
      <!-- <div class="windows-icon-bg" @click="MixOrReduction">
        <svg-icon v-if="mix" icon-class="reduction" class-name="icon-size"></svg-icon>
        <svg-icon v-else icon-class="mix" class-name="icon-size"></svg-icon>
      </div>
      <div class="windows-icon-bg close-icon" @click="Close">
        <svg-icon icon-class="close" class-name="icon-size"></svg-icon>
      </div> -->
    </div>
  </div>
</template>

<script>
import downloadIndex from '@/components/file-manager/download/index.vue'
import {
  clearDownloadDone,
  getDownloadData,
  listenerDownloadItemDone,
  listenerDownloadItemUpdate,
  listenerNewDownloadItem,
  openFile,
  openFileInFolder,
  pauseOrResume,
  removeDownloadItem,
} from '@/components/file-manager/ipc-renderer'
export default {
  data: () => ({
    count: 0,
    visible: false,
    triggerType: 'manual',
    permanent: false
  }),

  components: { downloadIndex },
  created () {
    listenerNewDownloadItem((event, item) => {
      this.count += 1
    })
    // listenerDownloadItemUpdate((event, item) => {
    //   this.handleUpdateData(item)
    // })

    // listenerDownloadItemDone((event, item) => {
    //   this.handleUpdateData(item)
    // })
  },

  mounted () {
  },

  methods: {
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.window-title {
  width: 100%;
  height: 50px;
  line-height: 30px;
  background-color: #f8096d;
  display: flex;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  margin-left: -7px;
  // z-index: 99999;
  .title {
    text-align: center;
  }
  .logo {
    margin-left: 20px;
  }
  .controls-container {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    text-align: center;
    position: relative;
    z-index: 3000;
    -webkit-app-region: no-drag;
    height: 100%;
    width: 138px;
    margin-left: auto;
    .windows-icon-bg {
      display: inline-block;
      -webkit-app-region: no-drag;
      height: 100%;
      width: 33.34%;
      color: rgba(129, 129, 129, 0.6);
      .icon-size {
        width: 40px;
        height: 15px;
      }
    }
    .windows-icon-bg:hover {
      background-color: rgba(182, 182, 182, 0.2);
      color: #333;
    }
    .close-icon:hover {
      background-color: rgba(232, 17, 35, 0.9);
      color: #fff;
    }
  }
}
</style>