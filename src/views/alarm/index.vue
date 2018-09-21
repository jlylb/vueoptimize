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
                    v-for='(item, index) in deviceCurrentType' 
                    :key='index'  
                    :is-active='index==deviceIndex'
                    :icon-name="typeIcon[item.dt_typeid]"
                    direction='column' 
                    @click.native='handleDevice(index, item)'>

                    <template slot='params'>
                        <p>
                            {{ item.dt_typename }}
                        </p>
                        <p> 
                            {{ item.dt_typememo }}
                        </p>
                    </template>
                    
                </device-component>

                <div class='running-type-custom' v-if='isEmptyObject(deviceCurrentType)'> 无数据</div>
        
            </device-card>


            <device-card>

                <device-component 
                    v-for='(item, index) in currentDevice' 
                    :key='index' 
                    :status='getRunningStatusClass(item)'
                    :icon-name="typeIcon[deviceType]">

                    <template slot='params'>
                        <p class='p-warning'> 告警数 </p>
                        <p class='p-warning-num animated infinite headShake' @click='goDetail(item)'> {{ item.warn_num }} </p>
                    </template>
                     设备编号: {{ item.pdi_index }}
                </device-component>

            </device-card>


        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList } from '@/api/monitor'
import { fetchDevice } from '@/api/alarm'
import DeviceComponent from '@/components/deviceComponent'
import DeviceCard from '@/components/device'

export default {
    components: {  SearchForm, DeviceComponent, DeviceCard },
    data() {
        return {
            dapeng: [],
            province: [],
            city: [],
            formModel: {},
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
                data: [] }
            ],
            current: 0,
            currentDapeng: {},
            deviceIndex: 0,
            devices: [],
            deviceData: {},
            deviceType: 0, //设备分类当前类型
            deviceTypeArr: {}, //设备分类
            deviceCurrentType: {}, //设备分类
            currentDevice: {},
            timer: null,
            typeIcon: {
            },
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

            }else{
                this.dapeng = []
                this.devices = []
                this.deviceData = {}
                this.currentDapeng = {}
                this.currentDevice = {}
            }
        },
        selectClear() {

        },
        handleClick(index, item) {
            this.current = index
            if(item.value===this.currentDapeng.value) {
                return
            }
            this.currentDapeng = item
            this.catchError()
            this.selectDevice(item)
        },
        handleDevice(index, item) {
            this.deviceIndex = index
            if(item.dt_typeid===this.deviceType) {
                return
            }
            this.deviceType = item.dt_typeid
            this.currentDevice = this.devices[this.currentDapeng.value][item.dt_typeid]
            this.catchError()

        },
        selectDevice(item) {
            const areaId = item.value
            if(this.deviceTypeArr[areaId]) {
                this.deviceCurrentType = this.deviceTypeArr[areaId]
                const deviceType = Object.keys(this.deviceCurrentType)[0]
                this.deviceType = deviceType
                this.deviceIndex = deviceType
                this.currentDevice = this.devices[areaId][deviceType]
            }else{
                this.deviceCurrentType = {}
                this.deviceType = 0
                this.deviceIndex = 0
                this.currentDevice = {}
            }

        },
        getDevice(data) {
            fetchDevice(data).then((ress) => {
                console.log(ress)
                const data = ress.data
                this.devices = data.devices
                this.deviceTypeArr = data.types
                this.typeIcon = data.icon
                if(this.isEmptyObject(this.devices)) {
                    this.deviceType = 0
                    this.currentDevice = {}
                    this.deviceTypeArr = {}
                    this.deviceCurrentType = {}
                }else{
                    this.selectDevice(this.currentDapeng)
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

        },
        isEmptyObject(obj) {
            if(!obj) return false;
            return Object.keys(obj).length === 0;
        },
        catchError() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            } 
        },
        startTimer() {
            // if(this.timer) {
            //     return
            // }
            // this.timer = setInterval(() => {
            //    this.getData(this.currentDevice)
            // }, 10000)
        },
        handleButton() {
            if(!this.currentDevice) {
                return
            }
            this.getData(this.currentDDevice)
        },
        getRunningStatus(device) {
            return device.device_status && device.device_status.rs_status==0?'正常':'停止'
        },
        getRunningStatusClass(device) {
            return device.warn_num > 0?'error':'success'
        },

        goDetail(item) {
            this.$router.push({ name: 'api.realwarn.index', params:{ pdi_index: item.pdi_index } })
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
            this.formColumns = columns
            this.currentDapeng = this.dapeng[0]
            return this.dapeng[0]
        })
        .then((res) => {
            this.getDevice(res)
        })
        .catch(this.catchError)

        this.startTimer()
    },
    destoryed() {
        this.catchError();
    },
    beforeDestroy() {
        this.catchError();
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
.card-panel {
  background-color: #67c23a;
  text-align: center;
  width: 200px;
  height: 100px;
  margin: 5px;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: $activeColor;
    .icon-panel {
      fill: #fff;
    }
    .card-panel-text {
      color: #fff;
    }
  }
}
.icon-panel {
  width: 60px;
  height: 60px;
  fill: #ccc;
}
.icon-wraper {
  display: inline-block;
  padding-top: 8px;
}
.card-panel-text {
  color: #ccc;
}
.chart-block {
  display: flex;
  flex-wrap: wrap;
}
.chart-item {
  // padding: 5px;
  margin: 15px;
  position: relative;
}
.card-panel-device {
  @extend .card-panel;
  height: 120px;
}

.running-type {
  margin-top: 20px;
  padding: 0 10px;
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  align-items: center;
}
.running-setting {
  text-align: right;
  padding: 5px;
  cursor: pointer;
}
.my-setting-form /deep/ .el-input-number .el-input {
  width: auto;
}
.p-warning {
  margin: 5px 0;
  text-align: center;
}
.p-warning-num {
  text-align: center;
  margin: 5px 0;
  font-size: 3em;
  cursor: pointer;
  &:hover {
    animation-play-state: paused;
  }
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

