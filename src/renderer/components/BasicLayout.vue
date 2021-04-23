<template>
  <div class="background">
    <search-page></search-page>
  </div>
</template>

<script>
import SearchPage from "@/components/SearchPage";
import { mapGetters } from 'vuex';
import {getUrl4File}from '@/components/file-manager/ipc-renderer'
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
        debugger
        if(this.backgroudUrl){
          let imageUrl = getUrl4File(this.backgroudUrl)
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
