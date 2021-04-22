<template>
  <div class="background">
    <search-page></search-page>
  </div>
</template>

<script>
import SearchPage from "@/components/SearchPage";
import { mapGetters } from 'vuex';
export default {
  name: "basicLayout",
  components: {
    SearchPage,
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters(['backgroudUrl']),
  },
  watch: {
    backgroudUrl () {
      this.makeBackground()
    },
  },
  methods: {
    defaultBackground () {
      document
        .querySelector("body")
        .setAttribute("style", "background-color:#fffff");
    },
    makeBackground () {
      try {
        if(this.backgroudUrl.buffer){
          let arrayBufferView = new Uint8Array(this.backgroudUrl.buffer);
          var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(blob);
          document
            .querySelector("body")
            .setAttribute(
              "style",
              'background-repeat:no-repeat;background-size:100%; background-image:url("' +
              imageUrl +
              '") '
            );
        }else{
          this.defaultBackground()
        }
      } catch (e) {
        this.defaultBackground()
      }
    }
  },
  // 创建前设置
  created () {
    // const urlPah = require('../../../static/backimage.jpg')
    this.makeBackground()
  },
  // 销毁前清除
  beforeDestroy () {
    document.querySelector("body").removeAttribute("style");
  },
};
</script>

<style>
</style>
