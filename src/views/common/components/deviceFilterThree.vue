<template>
    <div v-if='formColumns.length > 0' class="search-form-layout">
        <search-form 
            :form-columns='formColumns'
            :pform-model='formModel'
            :is-export='false'
            :is-search='isSearch'
            search-label='筛选'
            search-icon=''
            @search-form='handleFilter'>
            <template slot='device' slot-scope='{ data }'>
                <span>{{ data.label }}</span>
                <el-badge :hidden='!data.warn_index' is-dot />
            </template>
        </search-form>  
    </div>
</template>

<script>
import SearchForm from '@/views/common/components/searchForm'
import { fetchList } from '@/api/monitor'
import { getDataValue } from '@/utils'

export default {
    components: {  SearchForm },
        props: {
            isSearch: {
                type: Boolean,
                default: true
            }, 
        },
        data() {
        return {
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
                },
            events: {
                change: this.selectChange,
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
                name: 'device',
                label: '选择设备:',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择设备',
                    filterable: true,
                },
                events: {
                    change: this.selectDevice,
                },
                data: [] }
            ],
            city: [],
            dapeng: [],
            currentDapeng: null,
            deviceType: [],
            currentDeviceType: null,
            devices: [],
            AreaDevices: {},
        }
    },
    methods: {
        getDataValue,
        handleFilter(data) {
            this.$emit('filter', data)
        },
        selectChange(val) {
            if(val in this.city){
                this.dapeng = this.city[val]||[]
                this.currentDapeng = this.getDataValue(this.dapeng, [0, 'value']);
                const columns = this.formColumns
                columns.map((item) => {
                    return this.setColumns(item)
                })
                this.formColumns = columns

            }else{
                this.dapeng = []
                this.devices = {}

            }
        },
        selectDapeng(val) {
            this.currentDapeng = val
            const columns = this.formColumns
            columns.map((item) => {
                return this.setColumns(item, ['device'])
            })
            this.formColumns = columns
        },

        setColumns(item, fields) {
            fields = fields || ['dapeng', 'device'];
            if (fields.indexOf(item.name) > -1 && item.name == 'dapeng') {
                item.data = this.dapeng||[]
                this.$set(this.formModel, 'dapeng', this.getValueFirst(item.data))
            }
            if (fields.indexOf(item.name) > -1 && item.name == 'device') {
                item.data = this.getDataValue(this.devices, [this.currentDapeng], [])
                this.$set(this.formModel, 'device', this.getValueFirst(item.data))
                this.$set(this.formModel, 'device_type', this.getValueFirst(item.data, 'device_type'))
            }
            return item
        },
        selectDevice(val) {
            console.log(val, 'device select .......')
            const devices = this.getDataValue(this.devices, [this.currentDapeng], [])
            let dtype
            devices.map((item) => {
                if(item.value === val) {
                    dtype = item.device_type
                    return
                }
            })
            this.$set(this.formModel, 'device_type', dtype)
        },
        getValueFirst(data, field = 'value') {
            return (data && data[0]) && data[0][field] || ''
        },
    },
    created() {
        fetchList().then((res) => {
            console.log(res)
            const data = res.data
            const province = data.province || []
            this.city = data.city || []
            let first = this.getDataValue(province, [0, 'value'])
            this.dapeng = this.city[first]||[]
            this.currentDapeng = this.getDataValue(this.dapeng, [0, 'value']);

            this.devices = data.areaDevice
            const columns = this.formColumns
            columns.map((item) => {
                if (item.name == 'pro') {
                    item.data = province
                    this.$set(this.formModel, 'pro', first)
                }

                return this.setColumns(item)
            })
            this.formColumns = columns
        }).then(() => {
            this.handleFilter(this.formModel)
        })
    },
    destoryed() {
        
    },
    beforeDestroy() {
       
    }
}
</script>

<style>
</style>
