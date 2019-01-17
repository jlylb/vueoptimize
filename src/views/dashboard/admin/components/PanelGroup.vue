<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('running')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="chicken" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text chicken">鸡总数</div>
          <count-to
            class="card-panel-num"
            :startVal="0"
            :endVal="102400"
            :duration="2600"
            style="color: #36a3f7"
          ></count-to>
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="cow" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text cow">牛总数</div>
          <count-to
            class="card-panel-num"
            :startVal="0"
            :endVal="102400"
            :duration="2600"
            style="color: #0dbb0d"
          ></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="pig" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text pig">猪总数</div>
          <count-to
            class="card-panel-num"
            :startVal="0"
            :endVal="9280"
            :duration="3200"
            style="color: #f4516c"
          ></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="sheep" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text sheep">羊总数</div>
          <count-to
            class="card-panel-num"
            :startVal="0"
            :endVal="13600"
            :duration="3600"
            style="color: #a7a01d"
          ></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      // this.$emit('handleSetLineChartData', type)
      this.$router.push({ name: "device_index" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.running {
  font-size: 20px;
  color: green;
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
    background: rgb(40, 49, 60);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #36a3f7;
      }
      .icon-message {
        background: #0dbb0d;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #a7a01d;
      }
    }
    .icon-people {
      color: #36a3f7;
    }
    .icon-message {
      color: #0dbb0d;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #a7a01d;
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
      .card-panel-text {
        line-height: 18px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 12px;
        text-align: center;
        &.chicken {
          color: #36a3f7;
        }
        &.cow {
          color: #0dbb0d;
        }
        &.pig {
          color: #f4516c;
        }
        &.sheep {
          color: #a7a01d;
        }
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
