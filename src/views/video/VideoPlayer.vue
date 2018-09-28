<template>
  <video :src='src' :height="height" :width="height">
    Your browser does not support the video tag.
  </video>
</template>

<script>
export default {

  props: {
    src: {
      type: String,
      default: ''
    },
    // controles: {
    //   type: Boolean,
    //   default: true
    // },
    width: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: '50%'
    },
  }

}
</script>

<style>
</style>
