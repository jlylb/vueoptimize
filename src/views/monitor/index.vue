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
                v-if='devices.length>0' 
                v-bind:class="{ active:index==deviceIndex}" 
                v-for='(item, index) in devices' 
                :key='item.pdi_index' 
                @click='handleDevice(index, item)'>
                    <div class='icon-wraper'>
                        <svg-icon :icon-class="typeIcon[item.dpt_id]"  class='icon-panel'/>
                    </div>
                    
                    <div class="card-panel-text" v-if='item.types' >{{ item.types.dt_typename }} </div>
                    <div class="card-panel-text" v-if='item.types' > {{ item.types.dt_typememo }}</div>
                </div>
                
                <div v-if='devices.length===0'> 无数据</div>
            </div>


            <div class='running-type'>

                <device-component v-for='(item, index) in deviceData' :key='index' :status='getRunningStatusClass(item)' :icon-name="typeIcon[deviceType]">
                    <template slot='params'>
                        <p> 运行状态: {{ getRunningStatus(item) }}</p>
                        <p v-for='(params, index) in  item.params' :key='index'> {{ params[1] }}: {{ params[0] }} °C</p>
                    </template>
                     设备编号: {{ item.pdi_index }}
                </device-component>

                <device-component>
                    <template slot='icon'>
                        <svg-icon icon-class="temp"  class='running-icon-panel'/>
                    </template>
                    <template slot='params'>
                        <p> 运行状态: 正常</p>
                        <p> 温度: 35 °C</p>
                        <p> 湿度: 35 °C</p>
                    </template>
                    设备编号: 1111111
                </device-component>
            </div>

        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList, fetchDevice, fetchDeviceRealData } from '@/api/monitor'
import DeviceComponent from '@/components/deviceComponent'


export default {
    components: {  SearchForm, DeviceComponent },
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
            currentDapeng: null,
            deviceIndex: 0,
            devices: [],
            deviceData: {},
            deviceType: null,
            currentDevice: null,
            timer: null,
            typeIcon: {
                110: 'temp',
                111: 'co2',
                112: 'light',
                114: 'soil',
                115: 'liquid',
                116: 'video',
            }
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
                this.currentDapeng = null
                this.currentDevice = null
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
            }).catch(this.catchError)
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
            this.timer = setInterval(() => {
               this.getData(this.currentDevice)
            }, 10000)
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
</style>

