<template>
    <div class='table-layout'>
        <div v-if='formColumns.length > 0' class="search-form-layout">
            <search-form 
                :form-columns='formColumns'
                :pform-model='formModel'
                :is-export='false'
                :is-search='false' 
                @search-form='handleFilter'>
            </search-form>  
        </div>
        <div class='table-layout-inner'>

            <device-card class='running-custom'>
                <!-- <div class='running-type-custom'>选择大棚: </div> -->
                <device-component
                    v-for='(item, index) in dapeng' 
                    :key='item.AreaName'  
                    :is-active='index==current'
                    :icon-name="'dapeng'" 
                    @click.native='handleClick(index, item)'>

                    <template slot='params'>
                        <p>
                            NO.{{ index+1 }}
                        </p>
                        <p> 
                            {{ (index+1) + '号大棚' }}
                        </p>
                    </template>
                    
                </device-component>
        
            </device-card>

            <device-card class='running-custom'>
                <!-- <div class='running-type-custom' >选择类型: </div> -->
                <device-component
                    v-for='(item, index) in devices' 
                    :key='index' 
                    v-if='devices.length>0'  
                    :is-active='index==deviceIndex'
                    :icon-name="typeIcon[item.dpt_id]" 
                    direction='column'
                    @click.native='handleDevice(index, item)'>

                    <template slot='params'>
                        <p>
                            {{ item.types.dt_typename }}
                        </p>
                        <p> 
                            {{ item.types.dt_typememo }}
                        </p>
                    </template>
                    
                </device-component>

                <div class='running-type-custom' v-if='devices.length===0'> 无数据</div>
        
            </device-card>

            <div class='dapeng-wrapper'>
                <!-- <div>选择日期: </div> -->
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
                </div>
            </div>

            <div class='chart-block' v-if='showType===1'>

                <template v-if='deviceType==110'>
                    <monitor-line 
                    :style='{width:"48%", height: "450px"}' 
                    class='chart-item' v-for='(item, index) in deviceData' 
                    :key='index' 
                    :wendu='item.temp'
                    :shidu='item.wet'  
                    :title='index'></monitor-line>
                </template>
                <template v-if='deviceType==11'>
                    <co-line :style='{width:"48%", height: "400px"}' class='chart-item'></co-line>
                </template>
                <template v-if='deviceType==112'>
                    <light-line 
                        :style='{width:"48%", height: "450px"}' 
                        class='chart-item' v-for='(item, index) in deviceData' 
                        :key='index' 
                        :wendu='item.light'  
                        :title='index'></light-line>
                </template>
                <template v-if='deviceType==4'>
                    <soil-line :style='{width:"48%", height: "400px"}' class='chart-item'></soil-line>
                </template>
            </div>

            <div class='chart-block' v-if='showType===2'>
                <table-component :params='searchParams' class='table-list'></table-component>
            </div>
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList, fetchDevice, fetchDeviceData } from '@/api/monitor'
import MonitorLine  from './Line'
import CoLine  from './coLine'
import LightLine  from './lightLine'
import SoilLine  from './soilLine'
import TableComponent from './table'
import DeviceComponent from '@/components/deviceComponent'
import DeviceCard from '@/components/device'

export default {
    components: {  SearchForm, MonitorLine, CoLine, LightLine, SoilLine, TableComponent, DeviceComponent, DeviceCard },
    data() {
        return {
            searchDate: [],
            selectDate: 'day',
            dapeng: [],
            province: [],
            city: [],
            showType: 1,
            formModel: {
                showType: 1,
            },
            formColumns: [
            { 
                name: 'pro',
                label: '选择区域:',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择区域',
                    filterable: true,
                    // clearable: true,
                },
            events: {
                change: this.selectChange,
                clear: this.selectClear
            },
                data: [] },
           { 
                name: 'showType',
                label: '显示方式: ',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择显示方式',
                    filterable: true,
                    // clearable: true,
                },
            events: {
                change: this.selectTypeChange,
                clear: this.selectTypeClear
            },
                data: [
                    {label: '图表显示', value: 1 },
                    {label: '表格显示', value: 2 },
                ] }
            ],
            current: 0,
            currentDapeng: null,
            deviceIndex: 0,
            devices: [],
            deviceData: {},
            deviceType: null,
            currentDevice: null,
            timer: null,
            poption: {
                onPick: this.onPick
            },
            searchParams: {},
            typeIcon: {}
        }
    },
    methods: {
        handleFilter() {

        },
        selectChange(val) {
            this.current = 0
            this.deviceIndex = 0
            if(val in this.city){
                this.dapeng = this.city[val]
                this.currentDapeng = this.dapeng[0]
                this.getDevice(this.dapeng[0])
                this.resetDate()
            }else{
                this.dapeng = []
                this.devices = []
                this.deviceData = {}
                this.currentDapeng = null
                this.currentDevice = null
            }
        },
        selectClear() {

        },
        selectTypeChange(val) {
            this.showType = val;
            // this.searchParams.showType = val
            this.getData(this.currentDevice);
        },
        selectTypeClear() {},
        handleClick(index, item) {
            this.current = index
            if(item.value===this.currentDapeng.value) {
                return
            }
            this.currentDapeng = item
            this.catchError()
            this.resetDate()
            this.getDevice(item)
        },
        handleDevice(index, item) {
            this.deviceIndex = index
            if(item.dpt_id===this.deviceType) {
                return
            }
            this.deviceType = item.dpt_id
            this.currentDevice = item
            this.catchError()
            this.resetDate()
            this.getData(item)
        },
        getDevice(data) {
            fetchDevice(data).then((ress) => {
                console.log(ress)
                const data = ress.data
                this.devices = data.devices
                if(this.devices.length===0) {
                    this.deviceType = null
                    this.currentDevice = null
                }else{
                    this.deviceType = this.devices[0].dpt_id
                    this.currentDevice = this.devices[0]
                    this.typeIcon = data.icon
                    return this.devices[0]
                }
                
            }).then((res) => {
                if(!res) {
                    this.deviceData = {}
                    this.catchError()
                    return 
                }
                this.getData(res)
            }).catch(this.catchError)
        },
        getData(data) {
            console.log(this.showType, data, 'get data')
            this.searchParams = {...data, selectDate: this.selectDate, searchDate: this.searchDate, showType: this.showType, page: 1, pageSize: 10 };
            if(this.showType===2) {
                return;
            }
            fetchDeviceData(this.searchParams)
            .then((res2) => {
                console.log(res2)
                this.deviceData = res2.data.devices
            }).catch(this.catchError)
            // this.startTimer()
        },
        catchError() {
            console.log(this.timer, 66666666666)
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            } 
        },
        startTimer() {

        },
        handleButton() {
            if(!this.currentDevice) {
                return
            }
            this.getData(this.currentDevice)
        },
        changeDate(val) {
            if(!this.currentDevice) {
                return
            }
            this.searchDate = []
            this.getData(this.currentDevice)
        },
        dateOnPick(val) {
            if(!val) {
                this.selectDate = 'day'
            }
            if(!this.currentDevice) {
                return
            }
            this.getData(this.currentDevice)
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
        fetchList().then((res) => {
            console.log(res)
            const data = res.data
            const province = data.province || []
            this.city = data.city || []
            let first = province[0].value
            this.dapeng = this.city[first]
            const columns = this.formColumns
            columns.map((item) => {
                if (item.name == 'pro') {
                    item.data = province
                    this.$set(this.formModel, 'pro', first)
                }
                return item
            })
            // this.$set(this.formModel, 'showType', '图表显示')
            this.formColumns = columns
            this.currentDapeng = this.dapeng[0]
            return this.dapeng[0]
        })
        .then((res) => {
            this.getDevice(res)
        })
        .catch(this.catchError)

        this.startTimer()
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

.selectDate /deep/ {
  & .el-radio__input.is-checked + .el-radio__label {
    color: $activeColor;
  }
  & .el-radio__input.is-checked .el-radio__inner {
    border-color: $activeColor;
    background: $activeColor;
  }
  & .el-radio.is-bordered.is-checked {
    border-color: $activeColor;
  }
}

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
</style>

