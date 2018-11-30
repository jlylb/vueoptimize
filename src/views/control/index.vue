<template>
  <div class="table-layout">
    <device-filter-three ref="deviceFilter" @filter="getData" mtype="2"></device-filter-three>

    <div class="table-layout-inner">
      <el-carousel trigger="click" height="600px" :autoplay="autoplay" ref="pages" arrow="never">
        <el-carousel-item name="device_in">
          <device-card v-if="deviceData" class="device-control">
            <input-card
              :select-menu="deviceData.in[1].tu_SubTypeId"
              :type-icon="deviceData.in[1].status == 0?'auto':'manual'"
              :status="deviceData.in[1].bStatus?'success':'error'"
            >
              <p>{{ deviceData.in[1].status == 0 ? "自动":"手动" }}</p>
            </input-card>
            <input-card
              :menus="index==1?autoMenu:outMenu"
              v-for="(items, index) in deviceData.in"
              v-if="index > 1"
              :key="'in_'+index+(+new Date())"
              :ref="'input'+index"
              :select-menu="items.tu_SubTypeId"
              :status="items.bStatus?'success':'error'"
              :origin-title="items.dp_paramdesc"
              :title="items.dp_paramdesc"
              @select-menu="inputSelect($event, items, index)"
              @save-name="inputSave($event, items, index)"
            ></input-card>
          </device-card>
        </el-carousel-item>

        <el-carousel-item name="device_out">
          <device-card v-if="deviceData" class="device-control-status">
            <input-card
              :menus="outMenu"
              v-for="(items, index) in deviceData.out"
              :ref="'out'+index"
              :key="'out_'+index+(+new Date())"
              :disabled="!isAuto"
              :select-menu="items.length > 0 ? items[0].tu_SubTypeId : 0"
              @select-menu="outSelect($event, items, index)"
              @save-name="outSave($event, items, index)"
            >
              <template slot="append">
                <switch-control :is-auto="isAuto" :data="items" :pdi="pdiIndex"></switch-control>
              </template>
            </input-card>
          </device-card>
        </el-carousel-item>
      </el-carousel>
      <div class="tool-bar" v-if="deviceData">
        <el-button-group>
          <el-button type="success" @click="prev" icon="el-icon-d-arrow-left">输入</el-button>
          <el-button type="success" @click="next">
            输出
            <i class="el-icon-d-arrow-right el-icon--right"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchDeviceData, saveSwitch, saveOut } from '@/api/control'
import DeviceCard from '@/components/device'
import openMessage from '@/utils/message.js'
import DeviceFilterThree from '@/views/common/components/deviceFilterFive'
import InputCard from './inputcard'
import SwitchControl from './switchControl'

export default {
  components: { DeviceCard, DeviceFilterThree, InputCard, SwitchControl },
  data() {
    return {
      deviceData: null,
      current: 1,
      autoplay: false,
      pdiIndex: null,
      deviceType: null
    }
  },
  computed: {
    outMenu() {
      return this.deviceData.sub.filter(item => {
        return ![7, 8].includes(item.ts_typeid)
      })
    },
    autoMenu() {
      return this.deviceData.sub.filter(item => {
        return [7, 8].includes(item.ts_typeid)
      })
    },
    isAuto() {
      return this.deviceData.in[1].status == 0
    }
  },
  methods: {
    getData(data) {
      const { device: pdi_index, device_type: dpt_id } = data
      this.pdiIndex = pdi_index
      this.deviceType = dpt_id
      fetchDeviceData({ pdi_index, dpt_id })
        .then(res2 => {
          this.deviceData = res2.data.devicesData
          // this.isAuto = (deviceData.in[1].status==1)
        })
        .catch(() => {
          this.deviceData = null
        })
    },

    inputSelect(menuItem, data, index) {
      console.log(menuItem, data)
      const { Dp_id: dp_id, dp_paramdesc: desc } = data
      const { ts_typeid: subtype = 0 } = menuItem
      const loading = this.$loading({
        target: this.$refs['input' + index][0].$el,
        lock: true,
        text: '正在处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      saveSwitch({
        sindex: index,
        pdi_index: this.pdiIndex,
        dp_id,
        subtype,
        desc
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          //  this.isAuto = (deviceData.in[1].status==1)
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    inputSave(menuItem, data, index) {
      console.log(menuItem, data, 'saveName....')
      let desc, subtype
      const { Dp_id: dp_id, dp_paramdesc: sdesc } = data
      desc = sdesc
      if (menuItem.desc) {
        desc = menuItem.desc
        data.dp_paramdesc = desc
      }
      if (menuItem.item) {
        const { ts_typeid: ssubtype } = menuItem.item
        subtype = ssubtype
      } else {
        subtype = 0
      }
      const loading = this.$loading({
        target: this.$refs['input' + index][0].$el,
        lock: true,
        text: '正在处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      saveSwitch({
        sindex: index,
        pdi_index: this.pdiIndex,
        dp_id,
        subtype,
        desc
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          if (this.subtype == 7) {
            this.isAuto = true
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    outSelect(menuItem, items, index) {
      console.log(menuItem, index, items)
      const dpId = []
      items.forEach(item => {
        dpId.push(item.tu_Warnid)
      })
      const { ts_typeid: subtype = 0 } = menuItem
      const loading = this.$loading({
        target: this.$refs['out' + index][0].$el,
        lock: true,
        text: '正在处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      saveOut({
        pdi_index: this.pdiIndex,
        subtype,
        dp_id: dpId
      })
        .then(res => {
          fetchDeviceData({ pdi_index: this.pdiIndex, dpt_id: this.deviceType })
            .then(res2 => {
              this.deviceData = res2.data.devicesData
              // this.isAuto = (deviceData.in[1].status==1)
              loading.close()
            })
            .catch(() => {
              this.deviceData = null
              loading.close()
            })
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        })
        .catch(() => {
          loading.close()
        })
    },
    outSave(menuItem, index) {
      console.log(menuItem, index)
    },
    prev() {
      this.$refs.pages.setActiveItem('device_in')
    },
    next() {
      this.$refs.pages.setActiveItem('device_out')
    }
  },
  created() {}
}
</script>

<style lang='scss' scoped>
$activeColor: #e6a23c;

.table-layout-inner {
  background-color: #fff;
  padding: 20px 0;
  min-height: 800px;
  position: relative;
}

.running-custom /deep/ .running-type-item {
  &.active,
  &:hover {
    background-color: $activeColor;
  }
}
.device-control {
  justify-content: space-between;
  /deep/ .normal {
    width: 300px;
    min-height: 120px;
  }
}
.device-control-status {
  justify-content: flex-start;
  width: 95%;
  margin: 0 auto;
  /deep/ .normal {
    width: 300px;
    min-height: 160px;
  }
}
.el-dropdown-link {
  color: #fff;
}
.tool-bar {
  text-align: center;
}
</style>
