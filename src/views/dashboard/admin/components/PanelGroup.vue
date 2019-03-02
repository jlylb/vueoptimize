<template>
  <el-row class="panel-group" :gutter="40">

    <panel-item
      name="device"
      icon="shebei"
      text="设备总数"
    ></panel-item>

    <panel-item
      name="running"
      icon="running"
      text="运行状态"
    ></panel-item>
    <panel-item
      name="criticle"
      icon="baojing"
      text="严重报警"
    ></panel-item>

    <panel-item
      name="enimeny"
      icon="baojing"
      text="紧急报警"
    ></panel-item>

  </el-row>
</template>

<script>

import PanelItem from './panelitem'

export default {
  components: {
    PanelItem
  },
  methods: {
    handleSetLineChartData(type) {
      this.$router.push({ name: 'device_index' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

@mixin cardStyle($color, $type){
  .card-#{$type} {
    background-color: darken($color, 30%);
    &:hover {
      .icon-#{$type} {
        background-color: darken($color, 10%);
        color: darken($color, 20%);
      }
    }
    .icon-#{$type} {
      color: $color;
    }
    .card-panel-description{
      color: $color;
    }
  }
}

$colors: #40c9c6, #4aa6ec, #f4516c, #f4ea2a;
$types: device, running, criticle, enimeny;

.panel-group {
  margin-top: 18px;
  @each $_type in $types {
    $ii: index($types, $_type);
    @include cardStyle(nth($colors, $ii), $_type);
  }  
}

</style>
