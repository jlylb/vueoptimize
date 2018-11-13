<template>
    <div class='table-layout'>

        <device-filter ref='deviceFilter' @filter='getData' :is-search='false'></device-filter>

        <div  class="search-form-layout">
            <div style='padding: 0 5px;'>
                <el-radio-group v-model="selectDate" @change='changeDate' class='selectDate'>
                    <el-radio :label="'day'" border>当天</el-radio>
                    <el-radio :label="'week'" border>本周</el-radio>
                    <el-radio :label="'month'" border>本月</el-radio>
                    <el-radio :label="'year'" border>本年</el-radio>
                </el-radio-group>
                <el-date-picker
                    v-model="searchDate"
                    type="daterange"
                    :value-format='"yyyy-MM-dd"'
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change='dateOnPick'
                    :picker-options="poption"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
                <el-button type='primary' @click='handleFilter'>筛选</el-button>
            </div>
        </div>

        <div class='table-layout-inner' v-if='deviceData.items'>

            <chart-statistic :data='deviceData' class='monitor-chart'></chart-statistic>
 
        </div>
        <div class='table-layout-inner' v-else>
            <empty-text></empty-text>
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList, fetchDevice, fetchDeviceData } from '@/api/monitor'
import DeviceFilter from '@/views/common/components/deviceFilter'
import ChartStatistic from './chart.vue'
// import EmptyText from '@/views/common/components/empty'

export default {
    components: {  
        SearchForm, 
        DeviceFilter,
        ChartStatistic
    },
    data() {
        return {
            searchDate: [],
            selectDate: 'day',
            deviceData: {},
            timer: null,
            poption: {
                onPick: this.onPick
            },
            searchParams: {},
        }
    },
    methods: {
        getData(data) {
            console.log(this.showType, data, 'get data')
            this.searchParams = {
                ...data, 
                selectDate: this.selectDate, 
                searchDate: this.searchDate,  
            };
            fetchDeviceData(this.searchParams)
            .then((res2) => {
                console.log(res2)
                this.deviceData = res2.data.devices
            }).catch(this.catchError)
            // this.startTimer()
        },
        handleFilter() {
            this.$refs.deviceFilter.handleFilter(this.$refs.deviceFilter.formModel)
        },
        catchError() {

        },

        changeDate(val) {
            this.searchDate = []
        },
        dateOnPick(val) {

        },
        onPick(dates) {
            if(dates.maxDate) {
                this.selectDate = null
            }
        },
        resetDate() {
            this.selectDate = 'day'
            this.searchDate = []
        }
    },
    created() {

    }

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
.dapeng-wrapper {
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

// .selectDate /deep/ {
//   & .el-radio__input.is-checked + .el-radio__label {
//     color: $activeColor;
//   }
//   & .el-radio__input.is-checked .el-radio__inner {
//     border-color: $activeColor;
//     background: $activeColor;
//   }
//   & .el-radio.is-bordered.is-checked {
//     border-color: $activeColor;
//   }
// }

.table-list {
  width: 100%;
  margin-top: 20px;
}
.running-type-custom {
  color: #000;
}

.running-setting {
  text-align: right;
  padding: 5px;
  cursor: pointer;
}

.running-custom /deep/ .running-type-item {
  &.active,
  &:hover {
    background-color: $activeColor;
  }
}
.monitor-chart {
  width: 100%;
  min-height: 700px;
}
</style>

