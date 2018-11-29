<template>
    <div :class='["running-type-wrapper", `running-${status}`, { [activeClass]: isActive }]'>
      <div class='running-type-header'>
        <slot name='header'></slot>
      </div> 
      <div  :class='["running-type-item", direction, size, { [activeClass]: isActive }]'>
          <div class='running-icon' v-if='$slots.icon||iconName'>
            <svg-icon v-if='iconName' :icon-class="iconName"  class='running-icon-panel'/>
            <slot name='icon'>
            </slot>  
          </div>
          <div class='running-status'>
            <slot name='params'></slot>
          </div>
      </div>
      <div class='running-desc' v-if='$slots.default'>
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
    },
    direction: {
      type: String,
      default: 'row'
    },
    size: {
      type: String,
      default: 'normal'
    },
    isActive: {
      type: Boolean,
      default: false
    },
    activeClass: {
      type: String,
      default: 'active'
    },
  }
}
</script>

<style lang='scss' scoped>
.running-type-wrapper {
  position: relative;
  background-color: #67c23a;
  margin: 5px;
  margin-right: 10px;
}

%item {
  cursor: pointer;
  .running-icon-panel {
    fill: #fff;
  }
  .running-status {
    color: #fff;
  }
  .running-icon {
    border: 5px solid rgba(255, 255, 255, 0.8);
  }
}

.running-error {
  background-color: #dd6161;
}
.running-success {
  background-color: #67c23a;
}

.running-type-item {
  // width: 300px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.active,
  &:hover {
    @extend %item;
  }
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
  fill: #ccc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.running-status {
  color: #ccc;
  padding-left: 20px;
  width: 50%;
}
.running-desc {
  // position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  padding: 5px 0;
  text-align: center;
}
.running-type-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.normal {
  width: 230px;
}
.medium {
  width: 300px;
}

.row {
  flex-direction: row;
  p {
    text-align: center;
  }
}
.column {
  flex-direction: column;
  .running-status {
    padding: 0;
    //padding-top: 10px;
  }
  .running-icon {
    width: 60px;
    height: 60px;
  }
  .running-icon-panel {
    width: 30px;
    height: 30px;
  }
  p {
    padding: 0;
    margin: 5px;
    text-align: center;
  }
}
</style>
