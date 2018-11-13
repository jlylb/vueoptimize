<template>
  <el-row class="panel-group" :gutter="40">

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel dapeng" @click="handleSetLineChartData('dapeng')">
        <div class="card-panel-icon-wrapper icon-dapeng">
          <svg-icon icon-class="dapeng" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">大棚总数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="dapeng" :duration="3600" ></count-to>
        </div>
      </div>
    </el-col>
    
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel device' @click="handleSetLineChartData('device')">
        <div class="card-panel-icon-wrapper icon-device">
          <svg-icon icon-class="shebei" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" >设备总数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="device" :duration="2600" ></count-to>
        </div>
      </div>
    </el-col>


    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel running" >
        <div class="card-panel-icon-wrapper icon-running">
          <svg-icon icon-class="running" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">运行状态</div>
          <div class='running-text'>良好</div>
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel alarm" @click="handleSetLineChartData('alarm')">
        <div class="card-panel-icon-wrapper icon-alarm">
          <svg-icon icon-class="baojing" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">告警数量</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="warn" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>


  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    dapeng: {
      type: Number,
      default: 0
    },
    device: {
      type: Number,
      default: 0
    },
    run: {
      type: String,
      default: '良好'
    },
    warn: {
      type: Number,
      default: 0
    },
  },
  methods: {
    handleSetLineChartData(stype) {
      if(stype==='alarm') {
        this.$router.push({ name: 'api.realwarn.index' })
      }
      if(stype==='device') {
        this.$router.push({ name: 'api.deviceinfo.index' })
      }
      if(stype==='dapeng') {
        this.$router.push({ name: 'api.area.index', params: { total: true } })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/variables.scss';

$dp-color: #0c9455;
$dv-color: #a448bb;
$rg-color: #36a3f7;
$am-color: $red;

.running-text {
  font-size: 20px;
}

.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    background: $subMenuBg;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &.dapeng {
      background: $dp-color;
    }
    &.device {
      background: $dv-color;
    }
    &.running {
      background: $rg-color;
    }
    &.alarm {
      background: $am-color;
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-dapeng {
        background: darken($dp-color, 5%);
        color: lighten($dp-color, 10%);
      }
      .icon-device {
        background: darken($dv-color, 5%);
        color: lighten($dv-color, 10%);
      }

      .icon-running {
        background: darken($rg-color, 5%);
        color: lighten($rg-color, 10%);
      }
      .icon-alarm {
        background: darken($am-color, 5%);
        color: lighten($am-color, 10%);
      }
    }
    .icon-dapeng {
      background: lighten($dp-color, 10%);
    }
    .icon-device {
      background: lighten($dv-color, 10%);
    }

    .icon-running {
      background: lighten($rg-color, 10%);
    }
    .icon-alarm {
      background: lighten($am-color, 10%);
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      text-align: center;
      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
