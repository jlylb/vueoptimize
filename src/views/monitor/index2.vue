<template>
  <div
    class="table-layout-inner"
    :style="{ padding: 0 }"
    v-if="deviceData.items"
  >
    <div class="real-status-block">
      <div class="rw-100">
        <el-carousel
          :autoplay="false"
          arrow="never"
          ref="realStatus"
          class="monitor-carousel"
        >
          <el-carousel-item
            v-for="(itemData, field) in deviceData.items"
            :key="field"
            :name="field"
          >
            <el-card class="box-card">
              <div class="content">
                <h3 class="title">实时状态</h3>
                <el-row
                  v-for="(item, fieldIndex) in itemData"
                  :key="fieldIndex"
                  type="flex"
                  class="content-row"
                >
                  <el-col :span="3">{{ item[field + "_name"] }}</el-col>

                  <el-col :span="3">
                    <el-tag
                      >{{ item[field + "_value"] }}
                      {{ deviceData.unit[field] }}</el-tag
                    >
                  </el-col>

                  <el-col :span="3">{{ item["hwarn_name"] }}</el-col>

                  <el-col :span="3">
                    <el-tag
                      :type="item['hwarn_value'] == 0 ? 'primary' : 'danger'"
                      size="mini"
                      >{{ item["hwarn_value"] == 0 ? "正常" : "过高" }}</el-tag
                    >
                  </el-col>

                  <el-col :span="3">{{ item["lwarn_name"] }}</el-col>

                  <el-col :span="3">
                    <el-tag
                      :type="item['lwarn_value'] == 0 ? 'primary' : 'danger'"
                      size="mini"
                      >{{ item["lwarn_value"] == 0 ? "正常" : "过低" }}</el-tag
                    >
                  </el-col>

                  <el-col :span="3">{{ item["up_name"] }}</el-col>

                  <el-col :span="3">
                    {{ item["up_value"] }} {{ item["unit"] }}
                  </el-col>
                  <el-col :span="3">{{ item["down_name"] }}</el-col>

                  <el-col :span="3">
                    {{ item["down_value"] }} {{ item["unit"] }}
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
                  <el-dropdown
                    trigger="click"
                    @command="handleCommand"
                    size="medium"
                  >
                    <span class="el-dropdown-link">
                      {{ firstLabel }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="field"
                        v-for="(label, field) in deviceData.fieldDesc"
                        :key="field"
                        >{{ label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
              <el-row
                v-for="(params, idxParam) in firstData"
                :key="idxParam"
                class="content-status-choose"
              >
                <el-col :span="12">
                  <span class="icon">
                    <svg-icon
                      :icon-class="
                        deviceData.icons ? deviceData.icons[firstField] : ''
                      "
                      class="title-icon"
                    />
                  </span>
                  当前{{ params[firstField + "_name"] }}
                </el-col>
                <el-col :span="12" class="title-desc"
                  >{{ params[firstField + "_value"] }}
                  {{ deviceData.unit && deviceData.unit[firstField] }}</el-col
                >
              </el-row>
              <el-row class="content-status-choose">
                <el-col :span="12">
                  <span class="icon">
                    <svg-icon icon-class="time" class="title-icon" />
                  </span>
                  更新时间
                </el-col>
                <el-col :span="12" class="title-desc">{{
                  deviceData.rd_updatetime
                }}</el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </div>
      <div class="real-status">
        <el-card class="box-card">
          <monitor-chart
            :input-data="deviceData"
            :first="firstField"
          ></monitor-chart>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import MonitorChart from "./chart2";
import { getDataValue } from "@/utils";

export default {
  components: { MonitorChart },
  props: {
    realData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      deviceData: this.realData,
      firstData: [],
      firstField: null,
      firstLabel: null
    };
  },
  watch: {
    realData(nval) {
      this.deviceData = nval;
      this.setDeviceData();
    }
  },
  methods: {
    getDataValue,
    handleCommand(command) {
      this.firstField = command;
      this.firstLabel = this.deviceData.fieldDesc[command];
      this.firstData = this.deviceData.items[command];
      console.log(this.$refs.realStatus);
      this.$refs.realStatus.setActiveItem(command);
    },
    setDeviceData() {
      console.log(this.deviceData, "set device data......");
      if (!this.deviceData.items) return;
      const keys = Object.keys(this.deviceData.items);
      console.log(keys, this.firstField, "set device data......keys");
      if (!this.firstField) {
        this.firstField = keys[0];
        this.firstLabel = this.deviceData.fieldDesc[this.firstField];
      }
      if (this.deviceData.items) {
        this.firstLabel = this.deviceData.fieldDesc[this.firstField];
        this.firstData = this.deviceData.items[this.firstField];
      } else {
        this.firstField = null;
        this.firstData = [];
      }
      console.log(
        this.firstLabel,
        this.firstField,
        this.firstData,
        "set device data......"
      );
      if (!this.$refs.realStatus) return;
      this.$refs.realStatus.setActiveItem(this.firstField);
    }
  },
  beforeDestroy() {
    this.firstLabel = null;
    this.firstData = [];
    this.firstField = null;
  },
  mounted() {
    this.setDeviceData();
  }
};
</script>

<style lang="scss" scoped>
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
<style lang="scss">
.content-row {
  width: 100%;
  flex-wrap: wrap;
}
</style>
