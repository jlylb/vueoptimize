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

            <device-card class='monitor-device'>
                <device-component 
                v-for='(item, index) in deviceData' 
                :key='index' 
                :status='getRunningStatusClass(item)'
                size='medium' 
                :icon-name="typeIcon[deviceType]">
                    <template slot='params'>
                        <p> 运行状态: {{ getRunningStatus(item) }}</p>
                        <p v-for='(params, index) in  item.params' :key='index'> {{ params[1] }}: {{ params[0] }} °C</p>
                    </template>
                     设备编号: {{ item.pdi_index }}
                </device-component>
            </device-card>

        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList, fetchDevice, fetchDeviceRealData } from '@/api/monitor'
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
            currentDapeng: null,
            deviceIndex: 0,
            devices: [],
            deviceData: {},
            deviceType: null,
            currentDevice: null,
            timer: null,
            typeIcon: {

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
.monitor-device /deep/ .row p {
  text-align: left;
}
</style>

