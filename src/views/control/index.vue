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
            <div class='dapeng-wrapper'>
                <div>选择大棚: </div>
                <div class='card-panel' 
                v-bind:class="{ active:index==current}" 
                v-for='(item, index) in dapeng' 
                :key='item.AreaName' 
                @click='handleClick(index, item)'>
                    <div class='icon-wraper'>
                        <svg-icon icon-class="dapeng"  class='icon-panel'/>
                    </div>
                    <div class="card-panel-text" >{{ (index+1) + '号大棚' }}</div>
                </div>
            </div>

            <div class='dapeng-wrapper'>
                <div>选择类型: </div>
                <div class='card-panel-device' 
                v-if='!isEmptyObject(deviceCurrentType)' 
                v-bind:class="{ active:index==deviceIndex}" 
                v-for='(item, index) in deviceCurrentType' 
                :key='index' 
                @click='handleDevice(index, item)'>
                    <div class='icon-wraper'>
                        <svg-icon :icon-class="typeIcon[item.dt_typeid]"  class='icon-panel'/>
                    </div>
                    
                    <div class="card-panel-text"  >{{ item.dt_typename }} </div>
                    <div class="card-panel-text" > {{ item.dt_typememo }}</div>
                </div>
                
                <div v-if='isEmptyObject(deviceCurrentType)'> 无数据</div>
            </div>


            <div class='running-type'>

                <device-component v-for='(item, index) in currentDevice' :key='index' :status='getRunningStatusClass(item)' :icon-name="typeIcon[deviceType]">
                    <template slot='header'>
                        <div class='running-setting'>
                            <svg-icon  icon-class="running"  @click.native='openSetting(item)' />
                        </div>
                    </template>
                    <template slot='params'>
                        <p> 运行状态:
                            <el-switch
                                :key='item.pdi_index + "rs_status"'
                                @change="runningChange($event,item)"
                                :active-value='1'
                                :inactive-value='0'
                                v-model="item.device_status.rs_status">
                            </el-switch>
                        </p>
                        <p> 设备状态:
                        <el-switch
                            :key='item.pdi_index + "device_status"'
                            @change="deviceChange($event,item)"
                            :active-value='1'
                            :inactive-value='0'
                            v-model="item.device_status.device_status">
                        </el-switch>
                        </p>
                    </template>
                     设备编号: {{ item.pdi_index }}
                </device-component>

            </div>

        <el-dialog :title="deviceTitle" :visible.sync="settingDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-setting-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :form-props='formProps'
                :pform-columns='settingFormColumns'>
                </my-form>
            </el-dialog>

        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList } from '@/api/monitor'
import { updateStatus, fetchDevice } from '@/api/control'
import DeviceComponent from '@/components/deviceComponent'
import openMessage from '@/utils/message.js'
import MyForm from '../common/components/myform'

export default {
    components: {  SearchForm, DeviceComponent, MyForm },
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
                110: 'temp',
                111: 'co2',
                112: 'light',
                114: 'soil',
                115: 'liquid',
                116: 'video',
            },
            settingDialog: false,
            formProps: {
                labelWidth: '120px'
            },
            userFormModel: {
                level4: 100,
                level3: 200,
                level2: 300,
                level1: 400,
            },
            formRules: {
            },
            settingFormColumns: [
                { label: '四级告警', name: 'level4', type: 'el-input-number' },
                { label: '三级告警', name: 'level3', type: 'el-input-number' },
                { label: '二级告警', name: 'level2', type: 'el-input-number' },
                { label: '一级告警', name: 'level1', type: 'el-input-number' },
            ],
            deviceTitle: ''
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
            console.log(data, 'device')
            fetchDevice(data).then((ress) => {
                console.log(ress)
                const data = ress.data
                this.devices = data.devices
                this.deviceTypeArr = data.types
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
            // fetchDeviceRealData({...data })
            // .then((res2) => {
            //     console.log(res2)
            //     this.deviceData = res2.data.devices
            // }).catch(this.catchError)
            // this.startTimer()
        },
        isEmptyObject(obj) {
            if(!obj) return false;
            return Object.keys(obj).length === 0;
        },
        catchError() {
            console.log(this.timer, 66666666666)
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
            return device.device_status && device.device_status.rs_status==1?'正常':'停止'
        },
        getRunningStatusClass(device) {
            return device.device_status && device.device_status.rs_status==1?'success':'error'
        },
        changeStatus(val, item, typeStatus) {
            this.$confirm('确定更改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.updateStatus({pdi_index: item.pdi_index, value: val, field: typeStatus}, item)
            })
            .catch(() => {
                item.device_status[typeStatus] = val==0?1:0
                this.$message({
                    type: 'info',
                    message: '取消更改状态'
                })
            })
        },
        runningChange(val, item) {
            this.changeStatus(val, item, 'rs_status')
        },
        deviceChange(val, item) {
            this.changeStatus(val, item, 'device_status')
        },
        updateStatus(params, item) {
            updateStatus(params)
            .then((res) => {
                openMessage(res)
                .then(()=>{})
                .catch(()=>{
                    item.device_status[params.field] = params.value==0?1:0
                })
            })
            .catch((err)=>{
                item.device_status[params.field] = params.value==0?1:0
            })
        },
        openSetting(item) {
           this.settingDialog = true
           this.deviceTitle = `${item.pdi_index} 设备报警设置`
        },
        saveData(data) {
            console.log(data)
        },
        dialogOpen() {},
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
        console.log('monitor destoryed')
        this.catchError();
    },
    beforeDestroy() {
        console.log('monitor destoryed')
        // clearInterval(this.timer)
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
</style>

