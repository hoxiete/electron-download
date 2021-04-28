<template>
  <div id="app">
    <c-header></c-header>
    <basic-layout></basic-layout>
  </div>
</template>

<script>
  import BasicLayout from '@/components/BasicLayout'
  import CHeader from '@/components/title/titleIndex'

  export default {
    name: 'myelectron',
    components: {
      BasicLayout,
      CHeader
    }
  }
</script>

<style>
</style>
