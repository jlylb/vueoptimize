<template>
    <!-- <div class='empty-text'>
      <el-alert
        :title="title"
        type="info"
        :closable='false'
        :description="description"
        :show-icon='showIcon'>
      </el-alert>
    </div> -->
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    description: {
      type: String,
      default: '没有查询到数据'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
  }
}
</script>

<style lang='scss' scoped>
.empty-text {
  transform: translate3d(-50%, -30%, 0);
  position: absolute;
  top: 30%;
  left: 50%;
  width: 50%;
}
</style>
