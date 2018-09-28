<template>
    <div class='table-layout'>
        <div v-if='searchColumns.length > 0' class="search-form-layout">
            <search-form 
                :form-columns='searchColumns'
                :pform-model='searchModel'
                :is-export='false'
                @search-form='getList'>
            </search-form>  
        </div>
      <div v-if='data.length > 0'>
        <chart-bar :warn='data' class='chart-bar' ></chart-bar>
      </div>
        <div v-if='data.length ===0' class='no-data'>
          没有查询到数据
        </div>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { historysum } from '@/api/report'
import ChartBar from './chartbar'
import SearchForm from '@/views/common/components/searchForm'

export default {
  components: { tableList, ChartBar, SearchForm },
  data() {
    return {
      data: [],

      searchColumns: [

        {
          name: 'rs_updatetime',
          label: '告警时间',
          type: 'date'
        }
      ],
      searchModel: {},


      search: {
        page: 1,
        pageSize: 10
      },

    }
  },
  watch: {

  },
  methods: {
    getList(query) {
      console.log(query)
      historysum(query || this.search).then((res) => {
        this.data = res.data.data
        this.searchModel = {rs_updatetime: res.data.rs_updatetime}
      }).catch((res) => {

      })
    },


    handleFilter() {

    },

  },
  filters: {
    warnTxt(val) {
      return warnLevel()[val]['lvl']
    }
  },
  created() {

    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.chart-bar {
  width: 100%;
  min-height: 100vh;
}
.no-data {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  text-align: center;
}
</style>

