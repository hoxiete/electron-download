<template>
  <div class="background">
    <search-page></search-page>
  </div>
</template>

<script>
import SearchPage from "@/components/SearchPage";

export default {
  name: "basicLayout",
  components: {
    SearchPage,
  },
  data() {
    return {
      backgroundUrl: "",
    };
  },

  // 创建前设置
  beforeCreate() {
    // const urlPah = require('../../../static/backimage.jpg')
    try {
      const urlPah = require("D:/BaiduNetdiskDownload/我的图片/illust_76542723_20190913_084350.jpg");
      document
        .querySelector("body")
        .setAttribute(
          "style",
          'background-repeat:no-repeat;background-size:100%; background-image:url("' +
            urlPah +
            '") '
        );
    } catch(e) {
      document
        .querySelector("body")
        .setAttribute("style", "background-color:#fffff");
    }
  },
  // 销毁前清除
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
};
</script>

<style>
</style>
