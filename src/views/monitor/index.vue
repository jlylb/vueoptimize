<template>
  <div class="table-layout">
    <device-filter @filter="getData"></device-filter>
    <div class="table-layout-inner" :style="{padding:0}" v-if="deviceData.items">
      <div class="real-status-block">
        <div class="rw-100">
          <el-carousel :autoplay="false" arrow="never" ref="realStatus" class="monitor-carousel">
            <el-carousel-item v-for="(item, index) in deviceData.items" :key="index">
              <el-card class="box-card">
                <div class="content">
                  <h3 class="title">实时状态</h3>
                  <el-row
                    v-for="(field, fieldIndex) in  deviceData.fields"
                    :key="field"
                    v-if="field!=='consta'"
                    class="content-status"
                  >
                    <el-col :span="3">{{ item[field][field + '_name'] + (index+1) }}</el-col>
                    <el-col :span="3">
                      <el-tag>{{ item[field][field + '_value'] }} {{ deviceData.unit[field] }}</el-tag>
                    </el-col>
                    <el-col :span="3">{{ item[field]['hwarn_name'] }}</el-col>
                    <el-col :span="3">
                      <el-tag
                        :type="item[field]['hwarn_value']==0?'primary':'danger'"
                        size="mini"
                      >{{ item[field]['hwarn_value']==0?'正常':'过高' }}</el-tag>
                    </el-col>
                    <el-col :span="3">{{ item[field]['lwarn_name'] }}</el-col>
                    <el-col :span="3">
                      <el-tag
                        :type="item[field]['lwarn_value']==0?'primary':'danger'"
                        size="mini"
                      >{{ item[field]['lwarn_value']==0?'正常':'过低' }}</el-tag>
                    </el-col>
                    <el-col :span="3" v-if="fieldIndex==0">{{ item['consta']['consta_name'] }}</el-col>
                    <el-col :span="3" v-if="fieldIndex==0">
                      <el-tag
                        :type="item['consta']['consta_value']==0?'primary':'danger'"
                        size="mini"
                      >{{ item['consta']['consta_value']==0?'正常':'断线' }}</el-tag>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="real-status-block">
        <div class="real-data">
          <el-card class="box-card">
            <div class="content content-align">
              <div class="content-inner">
                <el-row class="content-status">
                  <el-col :span="24">
                    <el-dropdown trigger="click" @command="handleCommand" size="medium">
                      <span class="el-dropdown-link">
                        {{ deviceData.name }}{{ firstIndex }}
                        <i
                          class="el-icon-arrow-down el-icon--right"
                        ></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          :command="index"
                          v-for="index in deviceData.num"
                          :key="index"
                        >{{ deviceData.name }}{{ index }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
                <el-row
                  v-for="(params, idxParam) in  firstData"
                  :key="idxParam"
                  v-if="idxParam!=='undefined' && idxParam!=='consta'"
                  class="content-status-choose"
                >
                  <el-col :span="12">
                    <span class="icon">
                      <svg-icon
                        :icon-class="deviceData.icons ? deviceData.icons[idxParam]: ''"
                        class="title-icon"
                      />
                    </span>
                    当前{{ params[idxParam + '_name'] }}
                  </el-col>
                  <el-col
                    :span="12"
                    class="title-desc"
                  >{{ params[idxParam + '_value'] }} {{ deviceData.unit && deviceData.unit[idxParam] }}</el-col>
                </el-row>
                <el-row class="content-status-choose">
                  <el-col :span="12">
                    <span class="icon">
                      <svg-icon icon-class="time" class="title-icon"/>
                    </span>
                    更新时间
                  </el-col>
                  <el-col :span="12" class="title-desc">{{ deviceData.rd_updatetime }}</el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
        <div class="real-status">
          <el-card class="box-card">
            <monitor-chart :data="deviceData"></monitor-chart>
          </el-card>
        </div>
      </div>
    </div>
    <div class="table-layout-inner" v-else></div>
  </div>
</template>

<script>
import SearchForm from "@/views/common/components/searchForm";
import DeviceFilter from "@/views/common/components/deviceFilterFive";
import { fetchList, fetchDeviceRealData } from "@/api/monitor";

import MonitorChart from "./chart1";
import { getDataValue } from "@/utils";

export default {
  components: { SearchForm, MonitorChart, DeviceFilter },
  data() {
    return {
      deviceData: {},
      timer: null,
      firstData: {},
      firstIndex: 1,
      loading: true,
      params: {}
    };
  },
  methods: {
    getDataValue,
    handleFilter(data) {
      console.log(data);
    },

    getData(data) {
      this.params = data;
      this.timerFunc();
      this.startTimer();
    },
    timerFunc() {
      fetchDeviceRealData({ ...this.params })
        .then(res2 => {
          console.log(res2);
          this.deviceData = res2.data.devices;
          this.firstData = this.deviceData.items[0];
          this.loading = false;
        })
        .catch(() => {
          this.catchError();
          this.deviceData = {};
          this.firstData = {};
          this.loading = false;
        });
    },
    catchError() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    startTimer() {
      this.catchError();
      this.timer = setInterval(this.timerFunc, this.$appConfig.freshTimer);
    },

    getRunningStatus(device) {
      return device.rd_NetCom == 0 ? "正常" : "停止";
    },
    getRunningStatusClass(device) {
      return device.rd_NetCom == 0 ? "success" : "error";
    },
    handleCommand(command) {
      this.firstIndex = command;
      let index = command - 1;
      this.firstData = this.deviceData.items[index];
      this.$refs.realStatus.setActiveItem(index);
    }
  },
  beforeDestroy() {
    this.catchError();
  },
  mounted() {
    this.catchError();
  }
};
</script>

<style lang='scss' scoped>
@import "src/styles/variables.scss";
.table-layout-inner {
  background-color: #fff;
  padding: 20px 0;
  min-height: 800px;
  position: relative;
}
.icon {
  display: inline-block;
  border-radius: 100%;
  border: 2px solid $baseColor;
  color: $baseColor;
  font-size: 24px;
  width: 36px;
  height: 36px;
  text-align: center;
  /deep/ .title-icon {
    vertical-align: middle;
  }
}

.title-desc {
  line-height: 36px;
  text-align: center;
}
.real-status-block {
  display: flex;
}
.real-data {
  width: 30%;
}
.real-status {
  width: 70%;
}
.rw-100 {
  width: 100%;
}
.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
.content-align {
  align-items: center;
  color: $baseColor;
}
.content-inner {
  width: 80%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.content-data {
  //   flex-direction: column;
  width: 100%;
}
.content-status {
  display: flex;
  width: 100%;
  /deep/ .el-col {
    text-align: center;
  }
}
.content-status-choose {
  width: 100%;
  /deep/ .el-col {
    // text-align: center;
    margin: 10px 0;
  }
}
.box-card {
  height: 100%;
  // background-color: #67c23a;
  // color: #fff;
  /deep/ .el-card__body {
    height: 100%;
  }
}
.el-dropdown-link {
  // color: rgb(255, 255, 255);
  cursor: pointer;
  display: inline-block;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
}
.monitor-chart {
  width: 100%;
  min-height: 500px;
}
.monitor-carousel /deep/ .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: $light-blue;
}
</style>

