<template>
    <div class='table-layout'>

        <device-filter @filter='getData'></device-filter>
        <div class='table-layout-inner' :style="{padding:0}" v-if='deviceData.items'>
            <div class='real-status-block' >
                <div class="real-data" >
                    <el-carousel :autoplay='true'  arrow='never' ref='realData' class='monitor-carousel'>
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
                    <el-carousel :autoplay='true'  arrow='never' ref='realStatus' class='monitor-carousel'>
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
                                <el-row v-for='(params, idxParam) in  firstData' :key='idxParam' v-if='idxParam!=="undefined" && idxParam!=="consta"' class='content-status-choose'> 
                                    <el-col :span="12"><svg-icon  :icon-class="deviceData.icons ? deviceData.icons[idxParam]: ''" /> 当前{{ params[idxParam + '_name'] }}</el-col>
                                    <el-col :span="12">{{ params[idxParam + '_value'] }} {{ deviceData.unit && deviceData.unit[idxParam] }}</el-col>
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
                        <monitor-chart :data='deviceData'></monitor-chart>
                    </el-card>
                </div>        
            </div>
        </div>
        <div class='table-layout-inner' v-else>
            
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import DeviceFilter from '@/views/common/components/deviceFilter'
import { fetchList, fetchDeviceRealData } from '@/api/monitor'

import MonitorChart from './chart1'
import { getDataValue } from '@/utils'

export default {
    components: {  SearchForm, MonitorChart, DeviceFilter },
    data() {
        return {
            deviceData: {},
            timer: null,
            firstData: {},
            firstIndex: 1,
            loading: true,
        }
    },
    methods: {
        getDataValue,
        handleFilter(data) {
            console.log(data)
        },

        getData(data) {
            fetchDeviceRealData({...data })
            .then((res2) => {
                console.log(res2)
                this.deviceData = res2.data.devices
                this.firstData = this.deviceData.items[0]
                this.loading = false
            }).catch(()=>{
                this.catchError()
                this.deviceData = {}
                this.firstData = {}
                this.loading = false
            })
            this.startTimer()
        },
        catchError() {
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
        },

    },



}
</script>

<style lang='scss' scoped>
.table-layout-inner {
  background-color: #fff;
  padding: 20px 0;
  min-height: 800px;
  position: relative;
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

