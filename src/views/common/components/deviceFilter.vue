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
            city: [],
            dapeng: [],
            currentDapeng: null,
            deviceType: [],
            currentDeviceType: null,
            devices: [],
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
                this.currentDeviceType = this.getDataValue(this.deviceType, [this.currentDapeng, 0, 'value']);
                const columns = this.formColumns
                columns.map((item) => {
                    return this.setColumns(item)
                })
                this.formColumns = columns

            }else{
                this.dapeng = []
                this.devices = []

            }
        },
        selectDapeng(val) {
            this.currentDapeng = val
            this.currentDeviceType = this.getDataValue(this.deviceType, [this.currentDapeng, 0, 'value']);
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

        setColumns(item, fields) {
            fields = fields || ['dapeng', 'device_type', 'device'];
            if (fields.indexOf(item.name) > -1 && item.name == 'dapeng') {
                item.data = this.dapeng||[]
                this.$set(this.formModel, 'dapeng', this.getValueFirst(item.data))
            }

            if (fields.indexOf(item.name) > -1 && item.name == 'device_type') {
                item.data = this.deviceType[this.currentDapeng]||[]
                this.$set(this.formModel, 'device_type', this.getValueFirst(item.data))
            }
            if (fields.indexOf(item.name) > -1 && item.name == 'device') {
                item.data = this.getDataValue(this.devices, [this.currentDapeng, this.currentDeviceType], [])
                this.$set(this.formModel, 'device', this.getValueFirst(item.data))
            }
            return item
        },
        getValueFirst(data) {
            return (data && data[0]) && data[0].value || ''
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
            this.deviceType = data.deviceType
            this.currentDeviceType = this.getDataValue(this.deviceType, [this.currentDapeng, 0, 'value']);
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
