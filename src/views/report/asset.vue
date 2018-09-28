<template>
    <div class='table-layout'>

      <div v-if='data.length > 0'>
        <chart-asset :data='data' :total='total' class='chart-bar' ></chart-asset>
      </div>

      <div v-if='data.length ===0' class='no-data'>
        没有查询到数据
      </div>
      
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { assetsum } from '@/api/report'
import ChartAsset from './chartAsset'


export default {
  components: { tableList, ChartAsset },
  data() {
    return {
      data: [],
      search: {

      },
      total: 0
    }
  },
  watch: {

  },
  methods: {

    getList(query) {
      console.log(query)
      assetsum(query || this.search).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }).catch((res) => {

      })
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
