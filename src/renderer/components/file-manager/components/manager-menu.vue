<template>
  <div class="menu-container">
    <el-popover
      placement="bottom-start"
      v-model="popCreateShow"
      width="300"
      trigger="manual"
    >
      <createFile :show="popCreateShow"
        :onClose="() => (popCreateShow = false)"
      ></createFile>
      <el-button
        type="text"
        @click="popCreateClick"
        slot="reference"
        icon="PlusOutlined"
      >
        新建下载
      </el-button>
    </el-popover>
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon="el-icon-info"
      icon-color="red"
      placement="top"
      title="确定清空已完成的下载吗？"
      @confirm="onClear"
    >
      <el-button
        slot="reference"
        type="text"
        style="margin-left: 20px"
        icon="DeleteOutlined"
      >
        清空已完成
      </el-button>
    </el-popconfirm>
  </div>
</template>
<script>
import createFile from './createFile'
export default {
  props: {
    onClear: Function,
  },
  components: { createFile },
  data () {
    return {
      popCreateShow: false
    }
  },
  methods: {
    popCreateClick () {
      this.popCreateShow = !this.popCreateShow
    }
  }
}
</script>
<style>
@import "./style.module.less";
</style>
