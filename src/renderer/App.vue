<template>
  <div id="app">
    <!-- <landing-page></landing-page> -->
    <c-header></c-header>
    <basic-layout></basic-layout>
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'
  import BasicLayout from '@/components/BasicLayout'
  import CHeader from '@/components/title'

  export default {
    name: 'myelectron',
    components: {
      LandingPage,
      BasicLayout,
      CHeader
    }
  }
</script>

<style>
body {background-image:url('../../static/backimage.jpg');}
</style>
