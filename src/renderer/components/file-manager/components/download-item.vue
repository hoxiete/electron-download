<template>
  <div class="download-item-container" :key="item.id">
    <div
      v-if="item.state === 'progressing'"
      class="download-item-progress"
      :style="`width:${item.progress * 100}%`"
    />
    <div class="download-item-main">
      <div class="file-icon" @dblclick="() => onOpenFile(item.path)">
        <img :src="item.icon" />
      </div>
      <div class="file-info">
        <el-tooltip :content="item.fileName">
          <p class="file-name">{{ item.fileName }}</p>
        </el-tooltip>
        <div class="file-desc">
          <template v-if="item.state === 'progressing'">
            <div class="file-size">
              {{ getFileSize(item.receivedBytes, false) }}/{{
                getFileSize(item.totalBytes)
              }}
            </div>
            <span class="download-speed">{{ getFileSize(item.speed) }}/s</span>
          </template>
          <template v-else-if="item.state === 'completed'">
            <p>{{ getFileSize(item.totalBytes) }}</p>
          </template>
        </div>
      </div>
      <div class="styles.operating">
        <template v-if="item.state === 'progressing'">
          <el-tooltip
            :content="item.paused ? '恢复' : '暂停'"
            class="operating-item"
          >
            <template v-if="item.paused">
              <i @click="() => onPauseOrResume(item)" class="el-icon-video-play" />
            </template>
            <template v-else>
              <i @click="() => onPauseOrResume(item)" class="el-icon-video-pause" />
            </template>
          </el-tooltip>
        </template>
        <template v-else-if="item.state === 'completed'">
          <el-tooltip
            content="打开所在位置"
            class="operating-item"
          >
            <i @click="() => onOpenFolder(item.path)" class="el-icon-folder" />
          </el-tooltip>
        </template>
        <el-popover placement="top" width="160" v-model="confirmVisible">
          <p>确定{{item.state === 'progressing' ? '取消并' : ''}}移除下载项吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="confirmVisible = false"
              >取消</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="
                () => {
                  confirmVisible = false;
                  onCancel(item, index);
                }
              "
              >确定</el-button
            >
          </div>
          <el-tooltip
            slot="reference"
            :content="`${item.state === 'progressing' ? '取消并' : ''}移除下载`"
            class="operating-item"
          >
            <i class="el-icon-close" />
          </el-tooltip>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script>
// import IconButton from "./icon-button";
export default {
  components: {},
  props: {
    item: Object,
    onOpenFile: Function,
    onPauseOrResume: Function,
    onOpenFolder: Function,
    onCancel: Function,
  },

  // import { IDownloadFile } from "../../../../../app/file-manager/interface";

  // interface DownloadProps {
  //   item: IDownloadFile;
  //   index: number;
  //   onOpenFile?: (path: string) => void;
  //   onPauseOrResume?: (item: IDownloadFile) => void;
  //   onOpenFolder?: (path: string) => void;
  //   onCancel?: (item: IDownloadFile, index: number) => void;
  // }
  data () {
    return {
      confirmVisible: false
    };
  },
  methods: {
    /**
     * 处理文件大小
     * @param bytes - 字节
     * @param isUnit - 是否需要单位，默认 `true`
     */
    getFileSize: (bytes, isUnit) => {
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      isUnit = isUnit !== undefined && isUnit !== null ? isUnit : true;

      if (bytes === 0) {
        return isUnit ? "0B" : "0";
      }

      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (i === 0) {
        return bytes + (isUnit ? sizes[i] : "");
      }
      return (bytes / 1024 ** i).toFixed(2) + (isUnit ? sizes[i] : "");
    }
  }
};
</script>
<style lang="less" scoped>
.menu-container {
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
}

.download-item-container {
  padding: 10px 15px;
  position: relative;
  -webkit-app-region: no-drag;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  .download-item-progress {
    background-color: #e6f7ff;
    position: absolute;
    left: 0;
    top: 0;
    max-width: 100%;
    height: 100%;
    transition: width linear 0.3s;
  }

  .download-item-main {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .file-icon {
    width: 32px;
    height: 32px;
  }

  .file-info {
    flex: 1;
    padding: 0 10px;
    overflow: hidden;

    p {
      margin: 0;
    }
  }

  .file-name {
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .file-desc {
    color: #999;
    display: flex;
    font-size: 14px;

    .file-size {
      flex: 1;
    }

    .download-speed {
      flex: 1;
    }
  }

  .operating {
    .operating-item {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
}
</style>