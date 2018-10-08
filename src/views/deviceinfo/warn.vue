<template>
    <div>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        @list-data='getList'
        :hide-action='true'
        :is-export='false'
        :show-expand='false'>
        <template  slot='add_search_button'>
            <el-button
            type="primary"
            icon='el-icon-circle-check-outline'
            @click="handleSave">保存</el-button>
        </template>

        <template slot-scope="{ data }" slot='area'>
            {{ data.area.AreaName }}
        </template>

        <template slot-scope="{ data }" slot='sms'>

           <el-checkbox 
           v-model="data.sms"
           @change='selectCheckbox(data, $event, "sms")'>
           </el-checkbox>
        </template>

        <template slot-scope="{ data }" slot='email'>
           <el-checkbox 
           v-model="data.email" 
           @change='selectCheckbox(data, $event, "email")'>
           </el-checkbox>
        </template>

        <template slot-scope="{ data }" slot='audio'>
           <el-checkbox 
           v-model="data.audio"
           @change='selectCheckbox(data, $event, "audio")'>
           </el-checkbox>
        </template>

        </table-list>

    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList } from '@/api/deviceinfo'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  props: {
    uid: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      data: [],
      sms: false,
      email: false,
      audio: false, 
      formColumns: [

      ],
      searchColumns: [
        { name: 'pdi_code', label: '设备编号', props: { clearable: true }},
      ],

      formProps: {
        labelWidth: '120px'
      },
      columns: {
        pdi_index: {
          label: '设备索引'
        },
        pdi_name: {
          label: '设备名称'
        },
        pdi_code: {
          label: '设备编号'
        },
        area: {
          label: '区域名称'
        },
        sms: {
          label: '短信',
          columnKey: 'sms',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        email: {
          label: '邮箱',
          columnKey: 'email',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        audio: {
          label: '语音',
          columnKey: 'audio',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        action: {
          'min-width': '150',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },

    }
  },
  methods: {

    getList(query) {
      console.log(query)
      this.reset()
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },
    formatColumn(field) {
      console.log('formatColumn', this[field])
      this.data = this.data.map((item) => {
        item[field] = this[field];
        return item
      })
      console.log(this.data, 'set ....')
    },
    selectCheckbox(data, bVal, field) {
      let index = this.data.indexOf(data)
      let curData = [ ...this.data ]
      curData[index][field] = bVal
      this.data = curData
      let selectedLength = this.data.filter((item) => item[field] > 0 )

      this[field] = ( this.data.length === selectedLength.length )

     console.log(this.data, selectedLength)

    },
    handleSave() {
      const data = this.data.map((item)=>{
         let {pdi_index, wu_index, sms=false, email=false, audio=false} = item
         return {pdi_index, wu_index, sms, email, audio}
      })
      console.log(data, 'handle save')
    },
    reset() {
      this.sms = false
      this.email = false
      this.audio = false
      this.data = []
    },
    render(h, column) {
      const field = column.property
      const vm = this
      return h('el-checkbox', {
        props: 
          {
            value: vm[field],
          },
        on: {
          change: function(bVal, ev) {
            vm.$emit('change', bVal);
            vm[field] = bVal
            vm.formatColumn(field)
          }
        },
      }, column.label)
    },
    formatData(data) {
      if(data.length === 0 ) return []
      return data.map((item)=>{
        let val = +item.Wn_notifytype
        item.sms = (val & 4) > 0;
        item.email = (val & 2) >0;
        item.audio = (val & 1) >0;
        return item
      })
    }

  },
  created() {
    this.search = Object.assign({}, this.search, this.$route.params, {uid: this.uid});
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

