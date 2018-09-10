<template>
    <div :class="`running-type-wrapper running-${status}`" > 
      <div class='running-type-item'>
          <div class='running-icon'>
            <svg-icon v-if='iconName' :icon-class="iconName"  class='running-icon-panel'/>
            <slot name='icon'>
            </slot>  
          </div>
          <div class='running-status'>
            <slot name='params'></slot>
          </div>
      </div>
      <div class='running-desc'>
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style lang='scss' scoped>
.running-type-wrapper {
  position: relative;
  background-color: #67c23a;
  margin-right: 10px;
}
.running-error {
  background-color: #dd6161;
}
.running-success {
  background-color: #67c23a;
}
.running-type-item {
  width: 300px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.running-icon {
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  position: relative;
}
.running-icon-panel {
  width: 50px;
  height: 50px;
  fill: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.running-status {
  color: #fff;
  padding-left: 20px;
}
.running-desc {
  // position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding: 5px 0;
  text-align: center;
}
</style>
