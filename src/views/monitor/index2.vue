<template>
    <div class='table-layout'>
        <div v-if='formColumns.length > 0' class="search-form-layout">
            <search-form 
                :form-columns='formColumns'
                :pform-model='formModel'
                :is-export='false'
                search-label='筛选'
                search-icon=''
                @search-form='handleFilter'>
            </search-form>  
        </div>
        <div class='table-layout-inner' :style="{padding:0}">
            <div class='real-status-block'>
                <div class="real-data" >
                    <el-carousel :autoplay='true' indicator-position='none' arrow='never' ref='realData'>
                        <el-carousel-item v-for="(item, index) in deviceData.items" :key="index">
                             <el-card class="box-card">
                            <div class='content content-data'>
                                <h3 class='title'>实时数据</h3>
                                <el-row v-for='(params, idxParam) in  item' :key='idxParam' v-if='idxParam!=="consta"' class='content-status'>
                                    <el-col :span="12">{{ params[idxParam + '_name'] + (index+1) }}</el-col>
                                    <el-col :span="12">{{ params[idxParam + '_value'] }} {{ deviceData.unit[idxParam] }}</el-col>
                                </el-row>
                            </div>
                             </el-card>
                        </el-carousel-item>
                    </el-carousel>
                </div>

                <div class="real-status">
                    <el-carousel :autoplay='true' indicator-position='none' arrow='never' ref='realStatus'>
                        <el-carousel-item v-for="(item, index) in deviceData.items" :key="index">
                            <el-card class="box-card">
                            <div class='content'>
                                <h3 class='title'>实时状态</h3>
                                <el-row v-for='(field, fieldIndex) in  deviceData.fields' :key='field' v-if='field!=="consta"' class='content-status'>
                                    <el-col :span="4">{{ item[field]['hwarn_name'] }}</el-col>
                                    <el-col :span="4"> <el-tag :type='item[field]["hwarn_value"]==0?"primary":"danger"' size='mini'>{{ item[field]['hwarn_value']==0?'正常':'过高' }}</el-tag></el-col>
                                    <el-col :span="4">{{ item[field]['lwarn_name'] }}</el-col>
                                    <el-col :span="4"> <el-tag :type='item[field]["lwarn_value"]==0?"primary":"danger"' size='mini'>{{ item[field]['lwarn_value']==0?'正常':'过低' }}</el-tag></el-col>
                                    <el-col :span="4" v-if='fieldIndex==0'>{{ item['consta']['consta_name'] }}</el-col> 
                                    <el-col :span="4" v-if='fieldIndex==0'> <el-tag :type='item["consta"]["consta_value"]==0?"primary":"danger"' size='mini'>{{ item['consta']['consta_value']==0?'正常':'断线' }}</el-tag></el-col>
                                </el-row>
                            </div>
                            </el-card>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>

            <div class='real-status-block'>
                <div class="real-data" >
                    <el-card class="box-card">
                        <div class='content'>
                            <el-row class='content-status'>
                                <el-col :span="24">
                                <el-dropdown trigger="click" @command="handleCommand" size="medium">
                                    <span class="el-dropdown-link">
                                        {{ deviceData.name }}{{ firstIndex }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command='index' v-for='index in deviceData.num' :key='index'>{{ deviceData.name }}{{ index }}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                </el-col>
                            </el-row>
                                <el-row v-for='(params, idxParam) in  firstData' :key='idxParam' v-if='idxParam!=="consta"' class='content-status-choose'> 
                                    <el-col :span="12"><svg-icon  :icon-class="deviceData.icons[idxParam]" /> 当前{{ params[idxParam + '_name'] }}</el-col>
                                    <el-col :span="12">{{ params[idxParam + '_value'] }} {{ deviceData.unit[idxParam] }}</el-col>
                                </el-row>
                                <el-row class='content-status-choose'> 
                                    <el-col :span="12"><svg-icon  icon-class="time" /> 更新时间</el-col> 
                                    <el-col :span="12">{{ deviceData.rd_updatetime }}</el-col> 
                                </el-row>
                        </div>
                    </el-card>
                </div>
                <div class="real-status">
                    <el-card class="box-card">
                        <monitor-chart :data='deviceData' class='monitor-chart'></monitor-chart>
                    </el-card>
                </div>        
            </div>
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList, fetchDevice, fetchDeviceRealData } from '@/api/monitor'

import MonitorChart from './chart'


export default {
    components: {  SearchForm, MonitorChart },
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
                data: [] },
            { 
                name: 'dapeng',
                label: '选择大棚:',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择大棚',
                    filterable: true,
                },
                events: {
                    change: this.selectDapeng,
                },
                data: [] },
            { 
                name: 'device_type',
                label: '选择设备分类:',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择设备分类',
                    filterable: true,
                },
                events: {
                    change: this.selectType,
                },
                data: [] },
            { 
                name: 'device',
                label: '选择设备:',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择设备',
                    filterable: true,
                },

                data: [] }
            ],
            current: 0,
            currentDapeng: null,
            deviceIndex: 0,
            devices: [],
            deviceData: {},
            deviceType: [],
            current: null,
            timer: null,
            firstData: {},
            firstIndex: 1,
            currentDeviceType: null
        }
    },
    methods: {
        handleFilter(data) {
            console.log(data)
        },
        selectChange(val) {
            this.current = 0
            this.deviceIndex = 0
            if(val in this.city){
                this.dapeng = this.city[val]
                const columns = this.formColumns
                columns.map((item) => {
                    return this.setColumns(item)
                })
                this.formColumns = columns

            }else{
                this.dapeng = []
                this.devices = []
                this.deviceData = {}

            }
        },
        selectDapeng(val) {
            this.currentDapeng = val
            const columns = this.formColumns
            columns.map((item) => {
                return this.setColumns(item, ['device_type', 'device'])
            })
            this.formColumns = columns
        },
        selectType(val) {
            this.currentDeviceType = val
            const columns = this.formColumns
            columns.map((item) => {
                return this.setColumns(item, ['device'])
            })
            this.formColumns = columns
        },
        selectClear() {

        },

        getDevice(data) {
            fetchDevice(data).then((ress) => {
                console.log(ress)
                const data = ress.data
                this.devices = data.devices
                if(this.devices.length===0) {
                    // this.deviceType = null
                    this.currentDevice = null
                }else{
                    // this.deviceType = this.devices[0].dpt_id
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
            fetchDeviceRealData({...data })
            .then((res2) => {
                console.log(res2)
                this.deviceData = res2.data.devices
                this.firstData = this.deviceData.items[0]
            }).catch(()=>{
                this.catchError()
                this.deviceData = {}
            })
            this.startTimer()
        },
        catchError() {
            console.log(this.timer, 66666666666)
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            } 
        },
        startTimer() {
            if(this.timer) {
                return
            }
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
            return device.rd_NetCom==0?'正常':'停止'
        },
        getRunningStatusClass(device) {
            return device.rd_NetCom==0?'success':'error'
        },
        handleCommand(command) {
            this.firstIndex = command
            let index = command-1
            this.firstData = this.deviceData.items[index]
            this.$refs.realData.setActiveItem(index)
            this.$refs.realStatus.setActiveItem(index)
            // this.$message('click on item ' + command);
        },
        setColumns(item, fields) {
            fields = fields || ['dapeng', 'device_type', 'device'];
            if (fields.indexOf(item.name) > -1 && item.name == 'dapeng') {
                item.data = this.dapeng
                this.$set(this.formModel, 'dapeng', this.currentDapeng)
            }

            if (fields.indexOf(item.name) > -1 && item.name == 'device_type') {
                item.data = this.deviceType[this.currentDapeng]
                this.$set(this.formModel, 'device_type', this.currentDeviceType)
            }
            if (fields.indexOf(item.name) > -1 && item.name == 'device') {
                item.data = this.devices[this.currentDapeng][this.currentDeviceType]
                this.$set(this.formModel, 'device', item.data[0].value)
            }
            return item
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
            this.currentDapeng = this.dapeng[0].value;
            this.deviceType = data.deviceType
            this.currentDeviceType = this.deviceType[this.currentDapeng][0].value;
            this.devices = data.device
            const columns = this.formColumns
            columns.map((item) => {
                if (item.name == 'pro') {
                    item.data = province
                    this.$set(this.formModel, 'pro', first)
                }

                return this.setColumns(item)
            })
            this.formColumns = columns
            console.log(this.formColumns, 'form columns')
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
.monitor-device {
  /deep/ .running-type-wrapper {
    margin: 0;
  }
  .monitor-device-left {
    width: 30%;
  }
  .monitor-device-right {
    width: 70%;
    height: 100%;
  }
}
.monitor-device /deep/ .row p {
  text-align: left;
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
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
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
    text-align: center;
    margin: 10px 0;
  }
}
.box-card {
  height: 100%;
  background-color: #67c23a;
  color: #fff;
  /deep/ .el-card__body {
    height: 100%;
  }
}
.el-dropdown-link {
  color: rgb(255, 255, 255);
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
</style>

