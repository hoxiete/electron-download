<!--  -->
<template>
  <div class="window-title" :style="themeStyle">
    <!-- 软件logo预留位置 -->
    <div style="-webkit-app-region: drag" class="logo">
    </div>
    <!-- 菜单栏位置 -->
    <div></div>
    <!-- 中间标题位置 -->
    <div style="-webkit-app-region: drag" class="title"></div>
    <div class="controls-container">
      <div style="margin-top: 40px; width: 0px">
        <el-popover placement="bottom" width="400" trigger="manual" v-model="visible">
          <downloadIndex />
          <template slot="reference">
            <el-badge :hidden="count <= 0" :value="count" class="icon-size">
              <el-button type="info" icon="el-icon-message" circle @click="visible = !visible"></el-button>
            </el-badge>
          </template>
        </el-popover>
      </div>
      <div class="windows-icon-bg" @click="openSetting">
        <i class="svg-icon el-icon-setting"></i>
      </div>
      <div class="windows-icon-bg" @click="Mini">
        <svg-icon icon-class="mini" class-name="icon-size"></svg-icon>
      </div>
      <div class="windows-icon-bg" @click="MixOrReduction">
        <svg-icon v-if="mix" icon-class="reduction" class-name="icon-size"></svg-icon>
        <svg-icon v-else icon-class="mix" class-name="icon-size"></svg-icon>
      </div>
      <div class="windows-icon-bg close-icon" @click="Close">
        <svg-icon icon-class="close" class-name="icon-size"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import downloadIndex from "@/components/file-manager/download/index.vue";
import {
  clearDownloadDone,
  getDownloadData,
  listenerDownloadItemDone,
  listenerDownloadItemUpdate,
  listenerNewDownloadItem,
  isDownloading,
  openFile,
  openFileInFolder,
  pauseOrResume,
  removeDownloadItem,
} from "@/components/file-manager/ipc-renderer";
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    mix: false,
    count: 0,
    visible: false,
    triggerType: "manual",
    permanent: false,
  }),

  components: { downloadIndex },
  created() {
    listenerNewDownloadItem((event, item) => {
      this.count += 1;
    });
    // listenerDownloadItemUpdate((event, item) => {
    //   this.handleUpdateData(item)
    // })

    // listenerDownloadItemDone((event, item) => {
    //   this.handleUpdateData(item)
    // })
  },
  computed: {
    ...mapGetters(["themeColor"]),
    themeStyle() {
      let rgba = this.rgbToRgba(this.themeColor,0.7)
      return `background-image: linear-gradient(to bottom,${rgba[0]} , ${rgba[1]})`;
    },
  },

  mounted() {},

  methods: {
    ...mapActions(["toggleGlogalSetting"]),

    rgbToRgba(color, alp=0.2) {
      var r, g, b;
      var rgbaAttr = color.match(/[\d.]+/g);
      if (rgbaAttr.length >= 3) {
        var r, g, b;
        r = rgbaAttr[0];
        g = rgbaAttr[1];
        b = rgbaAttr[2];
        let oldval = "rgba(" + r + "," + g + "," + b + "," + 1 + ")"
        let newval = "rgba(" + r + "," + g + "," + b + "," + alp + ")"
        return [oldval,newval];
      }
    },
    openSetting() {
      this.toggleGlogalSetting();
    },
    Mini() {
      this.$ipcApi.send("windows-mini");
    },
    MixOrReduction() {
      this.$ipcApi.send("window-max");
      this.$ipcApi.on("window-confirm", (event, arg) => (this.mix = arg));
    },
    async Close() {
      let flag = await isDownloading();
      if (flag) {
        this.$confirm("当前任务还在下载就退出吗？", "提示", {
          confirmButtonText: "是的",
          cancelButtonText: "再想想",
          type: "warning",
        }).then(() => {
          this.$ipcApi.send("window-close");
        });
      } else {
        this.$ipcApi.send("window-close");
      }
    },
  },
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.window-title {
  width: 100%;
  height: 25px;
  line-height: 25px;
  // background-color: #f8096d;
  display: flex;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  margin-left: -8px;
  // z-index: 99999;
  .title {
    text-align: center;
  }
  .logo {
    height: 25px;
    width: 25px;
    margin-left: 5px;
    background-repeat:no-repeat;
    background-size:100%;
    background-image:url('../../../../static/iconimg.png')
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
        width: 15px;
        height: 15px;
      }
      .svg-icon {
        color: azure;
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
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