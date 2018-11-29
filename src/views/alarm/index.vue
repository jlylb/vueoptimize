<template>
    <div class='table-layout'>

        <!-- <device-filter ref='deviceFilter' @filter='getData' ></device-filter> -->

        <device-filter-three ref='deviceFilter' @filter='getData' ></device-filter-three>

        <div class='table-layout-inner' v-if='Object.keys(deviceData).length > 0'>
              <el-alert
                :title="tipText"
                class='tip'
                :type="tipType"
                :closable='false'
                center
                show-icon>
            </el-alert>
            <alarm-chart :data='deviceData' class='monitor-chart'></alarm-chart>

        </div>
        <div class='table-layout-inner' v-else>
            <empty-text></empty-text>
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import {  fetchDeviceRealData } from '@/api/monitor'
// import DeviceFilter from '@/views/common/components/deviceFilter'
import DeviceFilterThree from '@/views/common/components/deviceFilterFive'
import AlarmChart from './chart.vue'

export default {
    components: { AlarmChart, DeviceFilterThree },
    data() {
        return {
            deviceData: {}
        }
    },
    computed: {
        tipType() {
            const { rd_NetCom } = this.deviceData
            return rd_NetCom == 0 ? 'success' : 'error'
        },
        tipText() {
            const { rd_NetCom } = this.deviceData
            return rd_NetCom == 0 ? '设备网络连接正常' : '设备网络连接断开'
        },
    },
    methods: {
        getData(data) {
            fetchDeviceRealData({...data })
            .then((res2) => {
                console.log(res2)
                this.deviceData = res2.data.devices
            }).catch(()=>{
                this.deviceData = {}
            })
        },

    },
}
</script>

<style lang='scss' scoped>
.monitor-chart {
  width: 100%;
  min-height: 500px;
}
.tip {
  height: 60px;
}
</style>

