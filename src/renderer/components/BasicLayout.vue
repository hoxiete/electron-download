<template>
  <div class="background">
    <search-page></search-page>
  </div>
</template>

<script>
import SearchPage from '@/components/SearchPage'

export default {
  name: 'basicLayout',
  components: {
    SearchPage
  },

  // 创建前设置
  beforeCreate () {
    // const urlPah = require('../../../static/backimage.jpg')
    const urlPah = require('D:/BaiduNetdiskDownload/我的图片/illust_70505705_20200801_174143.png')
    document.querySelector('body')
      .setAttribute('style', 'background-repeat:no-repeat;background-size:100%; background-image:url("' + urlPah + '") ')
  },
  // 销毁前清除
  beforeDestroy () {
    document.querySelector('body').removeAttribute('style')
  }
}
</script>

<style>
</style>
