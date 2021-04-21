<template>
  <div class="container">
    <div class="title">
        <div style="margin-left: -15px;">下载管理器</div>
    </div>
    <DownloadManagerMenu :onClear="handleClearDone"/>

    <div class="main" :onScroll="handleScroll">
      <template v-for="(item, index) in downloadItem">
        <DownloadItem
          :key="item.id"
          :item="item"
          :index="index"
          :onOpenFile="handleOpenFile"
          :onPauseOrResume="handlePauseOrResume"
          :onOpenFolder="handleOpenFolder"
          :onCancel="handleRemove"
        />
      </template>
    </div>
  </div>
</template>
<script>
import DownloadManagerMenu from '../components/manager-menu'
import DownloadItem from '../components/download-item'
import {
  clearDownloadDone,
  getDownloadData,
  openDownloadManager,
  listenerDownloadItemDone,
  listenerDownloadItemUpdate,
  listenerNewDownloadItem,
  openFile,
  openFileInFolder,
  pauseOrResume,
  removeDownloadItem,
} from '../ipc-renderer'
// import { IDownloadFile } from '../../../../../../app/file-manager/interface'
export default {
  props: {
  },
  components: {
    DownloadManagerMenu, DownloadItem
  },
  computed: {

  },
  created () {
    listenerNewDownloadItem((event, item) => {
      // this.handleOpenCreate()
      this.handleUpdateData(item)
    })

    listenerDownloadItemUpdate((event, item) => {
      this.handleUpdateData(item)
    })

    listenerDownloadItemDone((event, item) => {
      this.handleUpdateData(item)
    })
    await openDownloadManager()
    this.initData()
  },
  data () {
    return {
      show: false,
      lock: false,
      downloadItem: [],
      hasMore: true,
      downloadItemRef: [],
      pageIndex: 1,
      pageCount: 6
    }
  },
  methods: {
    async initData () {
      let data = await getDownloadData({
        pageIndex: this.pageIndex,
        pageCount: this.pageCount,
      })

      if (!data.length) {
        this.pageIndex -= 1
        this.hasMore = false
        return
      }

      this.downloadItemRef.push(...data)
      this.downloadItem = this.downloadItemRef
      this.hasMore = true
    },
    // 更新下载数据
    handleUpdateData (item) {
      const index = this.downloadItemRef.findIndex(d => d.id === item.id)

      if (index < 0) {
        this.downloadItemRef.unshift(item)
      } else {
        this.downloadItemRef[index] = item
      }

      this.downloadItem = [...this.downloadItemRef]
    },

    // 滚动到底部自动加载更多
    handleScroll (event) {
      // 滚动条的总高度，可视区的高度，距离顶部的距离
      const { scrollHeight, clientHeight, scrollTop } = event.target

      if (scrollTop + clientHeight + 10 >= scrollHeight && hasMore) {
        // 滚动到底部
        pageIndex.current += 1
        this.initData()
      }
    },

    // 打开新建下载弹框
    // handleOpenCreate () {
    //   debugger
    //   this.show = true
    // },

    // 关闭新建下载弹框
    // handleCloseCreate () {
    //   this.show = false
    // },

    // 暂停或恢复下载
    async handlePauseOrResume (item) {
      const data = await pauseOrResume(item)
      this.handleUpdateData(data)
    },

    // 双击图标打开文件
    async handleOpenFile (path) {
      const res = await openFile(path)

      if (!res) {
        this.$message({ message: '文件不存在', type: 'warning' })
      }
    },

    // 打开文件所在目录
    async handleOpenFolder (path) {
      const res = await openFileInFolder(path)
      if (!res) {
        this.$message({ message: '文件不存在', type: 'warning' })
      }
    },

    // 删除下载项
    handleRemove (item, index) {
      removeDownloadItem(item, index).finally(() => {
        this.downloadItemRef.splice(index, 1)
        this.downloadItem = [...this.downloadItemRef]
      })
    },

    // 清空已完成
    async handleClearDone () {
      const data = await clearDownloadDone()
      this.downloadItemRef = data
      this.downloadItem = [...data]
    },
  }
}
</script>

