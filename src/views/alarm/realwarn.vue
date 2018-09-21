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

        <template slot='wd_index' slot-scope="{ data }">
          <el-popover
            placement="right"
            width="300"
            @show='detail(data)'
            trigger="hover">

            <el-form label-position="left" class='show-detail'>
              <el-form-item label="告警名称">{{ detailData.wd_name }}</el-form-item>
              <el-form-item label="告警描述">{{ detailData.wd_warndesc0 }}</el-form-item>
              <el-form-item label="告警描述">{{ detailData.wd_warndesc1 }}</el-form-item>
            </el-form>
            <el-button slot="reference" type='primary' size='small'>查看 {{ data.wd_index }}</el-button>
          </el-popover>
        </template>

         <template slot='warndefine.wd_level0' slot-scope="{ data }">
           <el-tag :class='warnClass(data.warndefine.wd_level0)'> {{ data.warndefine.wd_level0|warnTxt }} </el-tag>
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
        rw_index: {
          label: '索引'
        },
        pdi_index: {
          label: '设备编号'
        },
        // wd_index: {
        //   label: '告警编号'
        // },
        'warndefine.wd_level0': {
          label: '告警等级'
        },
        'warndefine.wd_name': {
          label: '告警名称'
        },
        'warndefine.wd_warndesc0': {
          label: '告警描述'
        },
        rw_occurtime: {
          label: '告警时间'
        },
        hw_index: {
          label: '告警事件编号'
        },
        rw_canceltime: {
          label: '恢复时间'
        },
        rw_memo: {
          label: '备注'
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
      return warnLevel()[val]['lvl']
    }
  },
  created() {
    const pdiIndex = this.$route.params.pdi_index;
    this.search.pdi_index = pdiIndex;
   // this.searchModel = { pdi_index: pdiIndex };
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.show-detail .el-form-item {
  margin-bottom: 0;
}
</style>

