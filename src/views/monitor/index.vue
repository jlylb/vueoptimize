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
                <div class='card-panel' v-for='(item, index) in dapeng' :key='item.AreaName' @click='handleClick'>
                    <div class='icon-wraper'>
                        <svg-icon icon-class="dapeng"  class='icon-panel'/>
                    </div>
                    <div class="card-panel-text" >{{ (index+1) + '号大棚' }}</div>
                </div>
            </div>
            <monitor-line :style='{width:"100%", height: "200px"}'></monitor-line>
        </div>
    </div>    
</template>

<script>

import SearchForm from '@/views/common/components/searchForm'
import { fetchList } from '@/api/monitor'
import MonitorLine  from './Line'


export default {
    components: {  SearchForm, MonitorLine },
    data() {
        return {
            dapeng: [],
            province: [],
            city: [],
            formModel: {},
            formColumns: [
            { 
                name: 'pro',
                label: '区域',
                type: 'select',
                props: {
                    class: 'select-dropdown',
                    placeholder: '请选择区域',
                    filterable: true,
                    clearable: true,
                },
            events: {
                change: this.selectChange,
                clear: this.selectClear
            },
                data: [] }
            ]
        }
    },
    methods: {
        handleFilter() {

        },
        selectChange(val) {
            if(val in this.city){
                this.dapeng = this.city[val]
            }else{
                this.dapeng = []
            }
        },
        selectClear() {

        },
        handleClick() {

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
    .dapeng-wrapper {
        padding: 0 10px;
        display: flex;
        flex-wrap: wrap;
        align-items:center;
    }
    .card-panel {
        background-color: #67C23A;
        text-align: center;
        width: 200px;
        height: 100px;
        margin: 5px;
        cursor: pointer;
        
        &:hover, &.active {
            background-color: #E6A23C;
            .icon-panel {
                fill: #fff;
            }
            .card-panel-text{
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
        color: #ccc
    }
</style>

