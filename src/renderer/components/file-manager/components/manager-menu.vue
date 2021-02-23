<template>
  <div class="menu-container">
    <el-button type="text" icon="PlusOutlined" @onClick="onCreate">
      新建下载
    </el-button>
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
        icon="DeleteOutlined"
      >
        清空已完成
      </el-button>
    </el-popconfirm>
  </div>
</template>
<script>
export default {
  props: {
    onCreate: Function,
    onClear: Function
  }
}
// interface DownloadManagerMenuProps {
//   onCreate?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
//   onClear?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
// }
</script>
<style>
@import "./style.module.less";
</style>
