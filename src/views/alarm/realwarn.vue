<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        :hide-action='true'
        @list-data='getList'>

         <template slot='pdi_warnlevel' slot-scope="{ data }">
           <el-tag :class='warnClass(data.pdi_warnlevel)'> {{ data.pdi_warnlevel|warnTxt }} </el-tag>
         </template>


        </table-list>

    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { fetchList } from '@/api/realwarn'
import { fetchDetail } from '@/api/warndefine'
import { warnLevel, warnClass } from '@/utils/config'

export default {
  components: { tableList },
  data() {
    return {

      data: [],

      searchColumns: [
        { name: 'pdi_index', label: '设备编号', props: { clearable: true }},
      ],
      searchModel: {},

      columns: {
        pdi_index: {
          label: '索引',
          sortable: true
        },
        pdi_devid: {
          label: '设备编号',
          sortable: true
        },
        pdi_areaname: {
          label: '区域名称'
        },
        pdi_name: {
          label: '设备名称'
        },
        pdi_typememo: {
          label: '设备类型'
        },
        pdi_warnname: {
          label: '告警描述'
        },
        pdi_warnlevel: {
          label: '告警等级'
        },
        pdi_updatetime: {
          label: '告警时间'
        },


      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      detailData: {},
      wdIndex: null,
    }
  },
  watch: {
    wdIndex(newVal) {
      fetchDetail({ wd_index: newVal }).then((res) => {
        this.detailData = res.data.data
      }).catch((res) => {
        this.detailData = {}
      })
    }
  },
  methods: {
    warnClass,
    getList(query) {
      console.log(query)
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },
    detail(item) {
      this.wdIndex = item.wd_index
    }

  },
  filters: {
    warnTxt(val) {
      return warnLevel()[val] && warnLevel()[val]['lvl'] || ''
    }
  },
  created() {
    // const pdiIndex = this.$route.params.pdi_index;
    this.search = Object.assign({}, this.search, this.$route.params);
   // this.searchModel = { pdi_index: pdiIndex };
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.show-detail .el-form-item {
  margin-bottom: 0;
}
.table-layout /deep/ .el-table .warning-high {
  background: #f0f9eb;
}
</style>

