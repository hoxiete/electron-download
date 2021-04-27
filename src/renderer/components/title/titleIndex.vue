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
    hideOrQuitData: true,
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
    ...mapGetters(["themeColor", "firstCloseApp", "hideOrQuit"]),
    themeStyle() {
      let rgba = this.rgbToRgba(this.themeColor, 0.7);
      return `background-image: linear-gradient(to bottom,${rgba[0]} , ${rgba[1]})`;
    },
  },
  mounted() {
    this.hideOrQuitData = this.hideOrQuit;
  },
  methods: {
    ...mapActions(["toggleGlogalSetting", "setHideOrQuit",'setfirstCloseApp']),

    rgbToRgba(color, alp = 0.2) {
      var r, g, b;
      var rgbaAttr = color.match(/[\d.]+/g);
      if (rgbaAttr.length >= 3) {
        var r, g, b;
        r = rgbaAttr[0];
        g = rgbaAttr[1];
        b = rgbaAttr[2];
        let oldval = "rgba(" + r + "," + g + "," + b + "," + 1 + ")";
        let newval = "rgba(" + r + "," + g + "," + b + "," + alp + ")";
        return [oldval, newval];
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
      // this.setfirstCloseApp();
      if (this.firstCloseApp) {
        const h = this.$createElement;
        let that = this;
        this.$msgbox({
          title: "首次关闭设置",
          message: h("div", null, [
            h(
              "el-radio",
              {
                props: { value: this.hideOrQuitData },
                attrs: { label: true, id: "radio1" },
                nativeOn: {
                  click(e) {
                    e.preventDefault();
                    that.handleClick(e);
                  },
                },
              },
              "最小化"
            ),
            h(
              "el-radio",
              {
                props: { value: this.hideOrQuitData },
                attrs: { label: false, id: "radio2" },
                nativeOn: {
                  click(e) {
                    e.preventDefault();
                    that.handleClick(e);
                  },
                },
              },
              "退出"
            ),
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            that.setHideOrQuit(that.hideOrQuitData);
            that.setfirstCloseApp();
            if (this.hideOrQuitData) {
              this.$ipcApi.send("window-hide");
            } else {
              this.$ipcApi.send("window-close");
            }
          })
          .catch(() => {});
      } else {
        if (this.hideOrQuit) {
          this.$ipcApi.send("window-hide");
        } else {
          this.$ipcApi.send("window-close");
        }
      }
    },
    handleClick(e) {
      let value;
      if (e.target.parentNode.children[1].value != undefined) {
        value = e.target.parentNode.children[1]._value;
      } else {
        value = e.target.parentNode.children[0].children[1]._value;
      }
      if (this.hideOrQuitData === !value) {
        this.hideOrQuitData = value;
        let node1 = document.getElementById("radio1").children[0];
        let node2 = document.getElementById("radio2").children[0];
        let swap = node1.className;
        node1.className = node2.className;
        node2.className = swap;
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
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url("../../../../static/iconimg.png");
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