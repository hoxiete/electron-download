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
  import CHeader from '@/components/title/titleIndex'

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
</style>
