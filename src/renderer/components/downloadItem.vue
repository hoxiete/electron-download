<template>
  <div>
    <el-row>
      <el-col :span="21">
        <el-row> {{ url }} </el-row>
        <el-row>
          <el-progress
            v-if="show"
            :percentage="percent"
            :status="status"
          ></el-progress>
        </el-row>
      </el-col>
      <el-col :span="3" style="text-align: center">
        <el-button @click="downloadImg()" type="text" size="small"
          >下载</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { validateURL } from "@/utils/validate";
import { mapActions } from "vuex";
import streamDownload from "@/utils/StreamDownload.js";
export default {
  components: {},
  props: {
    url: { type: String, required: true },
  },
  data () {
    return {
      show: false,
      percent: 0,
      currentSize: 0,
      status: null,
    };
  },
  methods: {
    ...mapActions(["addTotal", "addCurrent"]),
    downloadImg () {
      // this.$ipcApi.send("downloadImg", this.imgUrl);
      this.show = true;
      if (validateURL(this.url)) {
        streamDownload.downloadFile(
          this.url,
          "D://crawler/javbusImg/",
          async (status, body) => {
            new Promise((resolve, reject) => {
              if (status == "start") {
                this.total = body.total;
                this.addTotal(body.total);
              } else if (status === "progress") {
                // 显示进度
                // debugger
                this.addCurrent(body.received);
                this.currentSize += body.received;
                // thispercent = body.percentage;
                this.percent = Math.round(
                  (this.currentSize * 100) / this.total,
                  -1
                );
              } else if (status === "finished") {
                // 通知完成
                this.status = "success";
                this.percent = 100;
                if(body){
                  this.addCurrent(1);
                }
              } else if (status == "error") {
                this.status = "error";
              }
            });
          }
        );
      } else {
        this.$message({
          type: "error",
          message: "链接不正确",
        });
      }
    },
    // downloadImg() {
    //   // this.$ipcApi.send("downloadImg", this.imgUrl);
    //   this.show = true;
    //   if (validateURL(this.url)) {
    //     this.$download.downloadFile(
    //       this.url,
    //       "D://crawler/javbusImg/",
    //       (status, body) => {
    //         if(status == "start"){
    //           this.total = body.total
    //           this.addTotal(body.total)
    //         }else if (status === "progress") {
    //           // 显示进度
    //           // debugger
    //           this.addCurrent(body.received)
    //           this.currentSize += body.received;
    //           // thispercent = body.percentage;
    //           this.percent = Math.round((this.currentSize * 100) / this.total,-1)
    //           console.log(this.percent)
    //         } else if (status === "finished") {
    //           // 通知完成
    //           this.status = "success";
    //           this.percent = 100
    //         } else if (status == "error") {
    //           this.status = "error";
    //         }
    //       }
    //     );
    //   } else {
    //     this.$message({
    //       type: "error",
    //       message: "链接不正确",
    //     });
    //   }
    // },
  },
};
</script>

<style scoped>
</style>

