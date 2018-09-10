<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        @list-data='getList'>

        </table-list>

    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { fetchList } from '@/api/devicetype'

export default {
  components: { tableList },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'dt_typeid', label: '设备类型编号', isnumber: true },
        { name: 'dt_typename', label: '设备名称' },
        { name: 'dt_issupportext', label: '是否支持扩展', type: 'switch' },
        { name: 'dt_isenable', label: '是否可用', type: 'switch' },
        { name: 'dt_rtdata_table', label: '实时数据表名' },
        { name: 'dt_hisdata_table', label: '历史数据表名' },
        { name: 'dt_typememo', label: '备注', }

      ],
      searchColumns: [
        { name: 'dt_typename', label: '设备名称', props: { clearable: true }},
      ],

      formProps: {
        labelWidth: '120px'
      },
      columns: {
        dt_index: {
          label: '设备索引'
        },
        dt_typeid: {
          label: '设备类型'
        },
        dt_typename: {
          label: '设备名称'
        },
        dt_issupportext: {
          label: '是否支持扩展'
        },
        dt_isenable: {
           label: '是否可用'
        },
        dt_rtdata_table: {
          label: '实时数据表名'
        },
        dt_hisdata_table: {
          label: '历史数据表名'
        },
        dt_typememo: {
          label: '备注'
        },
        action: {
          'min-width': '200',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },

      userFormModel: {
      },
    }
  },
  methods: {

    getList(query) {
      console.log(query)
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },

  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

