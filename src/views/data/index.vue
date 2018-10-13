<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :labels='labels'
        :search-data='search'
        :hide-action='true'
        @list-data='getList'>
            <template  slot='add_search_button'>
                <el-button
                type="primary"
                icon='el-icon-back'
                @click="handleBack">返回</el-button>
            </template>
        </table-list>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { fetchList } from '@/api/data'

export default {
  components: { tableList },
  data() {
    return {
      data: [],
      searchColumns: [
        { name: 'pdi_index', label: '设备编号', props: { clearable: true }},
        { name: 'rd_updatetime', label: '时间', type: 'date'},
      ],

      columns: {

      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },

      labels: {},
    }
  },
  methods: {

    getList() {
      
      fetchList({...this.search, ...this.$route.params}).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
        this.labels = res.data.desc
        
        console.log(this.data)
      }).catch((res) => {

      })
    },

    handleBack() {
        this.$router.go(-1)
    }
  },
  mounted() {
    
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

