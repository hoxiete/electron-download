<template>
  <el-dialog class="create-download" title="用户设置" :modal="false" center :visible="show" :show-close="false">
    <el-form class="form">
      <el-form-item label="主题样式：" class="downloadPath">
        <el-color-picker v-model="formData.themeColor" show-alpha :predefine="predefineColors"
          @active-change="themeStyleActiveChange">
        </el-color-picker>
      </el-form-item>
      <el-form-item label="壁纸图片：" class="downloadPath">
        <el-input readOnly :value="formData.backgroudUrl" style="width: 400px" />
        <el-button type="primary" circle="" icon="el-icon-folder" @click="handleChooseFile()"></el-button>
      </el-form-item>
      <el-form-item label="默认下载路径：" class="downloadPath">
        <el-input readOnly :value="formData.savePath" style="width: 373px" />
        <el-button type="primary" circle="" icon="el-icon-folder" @click="handleChoosePath()"></el-button>
      </el-form-item>
      <el-form-item label="检测新版本" class="downloadPath">
        <!-- <el-input readOnly :value="formData.savePath" style="width: 100px" /> -->
        <el-row>
          <el-col :span="4">
            <el-button type="" @click="getUpdateVersion()" style="font-size: 18px;">{{appVersion}}</el-button>
          </el-col>
          <el-col :span="13" style="padding-top: 12px;">
            <el-progress v-if="percentage!=0" :percentage="percentage"  :text-inside="true" :stroke-width="24" :status="progressStaus"></el-progress>
          </el-col>
        </el-row>

      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  getGlobalSetting,
  setGlobalSetting,
  getsetting,
} from "@/utils/electronStoreUtil";
import { equarComplex } from "@/utils/validate";
import {
  openFileDialog,
  chooseFileDialog,
  setLastDownloadPath,
  getLastDownloadPath,
} from "../file-manager/ipc-renderer";
export default {
  props: {
    show: Boolean,
    onClose: Function,
  },
  watch: {
    show(flag) {
      if (flag) {
        this.getAppVersion();
        this.loading = true;
        // debugger
        // let d = getsetting()
        let set = { ...this.globalSetting };
        if (set != undefined) {
          // this.formData = this.originData = {...set}  //这样写会让这两个数据双向绑定。影响后续比对操作
          this.formData = { ...set };
          this.originData = { ...set };
        }
        this.loading = false;
      }
    },
    checkCloseFlag(flag) {
      if (flag) {
        debugger;
        this.handleCancel();
      }
    },
  },
  data() {
    return {
      loading: false,
      originData: {},
      appVersion: "",
      percentage: 0,
      progressStaus: undefined,
      formData: {
        backgroudUrl: "",
        savePath: "",
        themeColor: "",
      },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577",
      ],
    };
  },
  computed: {
    ...mapGetters(["globalSetting", "editFlag", "checkCloseFlag"]),
  },
  methods: {
    ...mapActions([
      "viewChangeBG",
      "viewChangeTheme",
      "changeSavePath",
      "clearCloseFlag",
      "clearEditFlag",
      "saveGlobalSetting",
    ]),
    // 选择保存位置
    async handleChoosePath() {
      const newPath = await openFileDialog();
      this.formData = {
        ...this.formData,
        savePath: newPath,
      };
      this.changeSavePath(newPath);
    },
    // 选择背景图片
    async handleChooseFile() {
      //获取图片文件buffer 用于持久化
      const data = await chooseFileDialog();
      this.formData = {
        ...this.formData,
        backgroudUrl: data,
      };
      this.viewChangeBG(data);
    },
    themeStyleActiveChange(val) {
      this.viewChangeTheme(val);
      this.formData.themeColor = val;
    },
    // 保存
    handleOk() {
      setGlobalSetting(this.formData);
      this.onClose();
    },
    // 关闭对话框
    handleCancel() {
      //对复杂对象的比较 不能简单的使用===
      if (!equarComplex(this.originData, this.formData)) {
        this.clearCloseFlag();
        //还原设置
        this.$confirm("不保存修改就退出吗？", "提示", {
          confirmButtonText: "是的",
          cancelButtonText: "再想想",
          type: "warning",
        })
          .then(() => {
            this.clearEditFlag();
            this.saveGlobalSetting(this.originData);
            this.onClose();
          })
          .catch(() => {});
      } else {
        this.saveGlobalSetting(this.originData);
        this.onClose();
      }
    },
    getAppVersion() {
      this.$ipcApi.invoke("get-appversion", (res) => {
        debugger;
        this.appVersion = res;
      });
    },
    getUpdateVersion(data) {
      data = "one";
      let that = this
      switch (data) {
        case "one":
          const dialog = "";
          this.$ipcApi.send("check-update");
          console.log("启动检查");
          this.$ipcApi.on("UpdateMsg", (event, data) => {
            switch (data.state) {
              case -1:
                this.$message(data.msg);
                break;
              case 0:
                this.$message("正在检查更新");
                break;
              case 1:
                this.$message({
                  type: "success",
                  message: "已检查到新版本，开始下载",
                });
                break;
              case 2:
                this.$message({ type: "success", message: "无新版本" });
                break;
              case 3:
                this.percentage = data.msg.percent;
                break;
              case 4:
                this.progressStaus = "success";
                this.$alert("更新下载完成！", "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    that.$ipcApi.send("confirm-update");
                  },
                });
                break;

              default:
                break;
            }
          });
          break;
        case "two":
          console.log(111);
          this.$ipcApi.send("start-download");

          break;

        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.downloadPath {
  margin-top: 20px;
}
</style>
