<template>
    <div class='table-layout'>
        <div v-if='formColumns.length > 0' class="search-form-layout">
            <search-form 
                :form-columns='formColumns'
                :pform-model='formModel'
                :is-export='false' 
                @search-form='handleFilter'>
            </search-form>    
        </div>
        <div class='table-layout-inner'>
           
            <vue-drag-resize
            :w='300'
            :x='device.DragX>0?+device.DragX:300*index'
            :y='+device.DragY'
            v-for='(device, index) in devices'
            :key='device.pdi_index' 
            :isActive="true" 
            :isResizable="false" 
            v-on:resizing="resize" 
            v-on:dragging="resize"
            @dragstop="onDragStop"
            :parentLimitation="true">
                <p>{{ device.pdi_name }} </p>
                <p>{{ top }} х {{ left }}</p>
            </vue-drag-resize>
        </div>
         {{ devices }}
    </div>    
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import SearchForm from '@/views/common/components/searchForm'
import { fetchAllTypes, fetchList } from '@/api/deviceinfo'


export default {
    components: { VueDragResize, SearchForm },
    data() {
        return {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            formColumns: [
            { 
                name: 'dpt_id',
                label: '设备分类',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请输入设备分类',
                    filterable: true,
                    clearable: true,
                },
            events: {
                change: this.selectChange,
                clear: this.selectClear
            },
                data: [] }
            ],
            formModel: {
               // dpt_id: null
            },
            devices: []
        }
    },
    methods: {
        resize(newRect) {
            this.width = newRect.width
            this.height = newRect.height
            this.top = newRect.top
            this.left = newRect.left
        },
        onDragStop(rect) {
            console.log(rect.top, rect.left)
        },
        handleFilter() {

        },
        selectChange(val) {
          
          fetchList({type_id: val}).then((res2) => {
                console.log(res2)
                this.devices = []
                let data =res2.data.data.data
                if(data.length === 0) {
                    this.devices = []
                } else {
                    data.forEach((item) => {
                        let {pdi_index, dpt_id, pdi_name, DragX, DragY} = item
                        this.devices.push({pdi_index, dpt_id, pdi_name, DragX, DragY})
                    })
                }
            })
        },
        selectClear() {

        }
    },
    created() {
        fetchAllTypes().then((res) => {
            const columns = this.formColumns
            columns.map((item) => {
                if (item.name == 'dpt_id') {
                    item.data = res.data.data
                    this.$set(this.formModel, 'dpt_id', item.data[0].value)
                }
                return item
            })
            this.formColumns = columns
            return res.data.data[0].value
      }).then((re) => {
          
          fetchList({type_id: re}).then((res2) => {
                console.log(res2)
                this.devices = []
                let data =res2.data.data.data
                if(data.length === 0) {
                    this.devices = []
                } else {
                    data.forEach((item) => {
                        let {pdi_index, dpt_id, pdi_name, DragX, DragY} = item
                        this.devices.push({pdi_index, dpt_id, pdi_name, DragX, DragY})
                    })
                }
            })
      })
    }

}
</script>

<style lang='scss' scoped>
    .table-layout-inner{
        background-color: #fff;
        padding: 20px 0;
        min-height: 800px;
        position: relative;
    }
</style>
