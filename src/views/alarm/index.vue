<template>
    <div class='table-layout'>

        <device-filter ref='deviceFilter' @filter='getData' ></device-filter>

        <div class='table-layout-inner' v-if='Object.keys(deviceData).length > 0'>
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
import DeviceFilter from '@/views/common/components/deviceFilter'
import AlarmChart from './chart.vue'

export default {
    components: {   DeviceFilter, AlarmChart },
    data() {
        return {
            deviceData: {}
        }
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
</style>

