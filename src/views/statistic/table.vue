<template>
 
  <table-list
  :custom-columns='columns'
  :form-columns='searchColumns'
  :table-data='data'
  :total='total'
  :hide-action='true'
  :labels='labels'
  :search-data='search'
  @list-data='getList'>

  </table-list>

</template>

<script>

import tableList from '../common/components/tableList'

import { fetchDeviceData } from '@/api/monitor'

export default {
  components: { tableList },
  props: {
    params: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      data: [],
      columns: {

      },
      searchColumns: [],
      total: 0,
      search: {
        page: 1,
        pageSize: 10,
        ...this.params
      },
      labels: {}
    }
  },
  watch: {
    params: {
      handler(newVal) {
        this.search = {...this.search, ...newVal}
        this.getList()
      },
      deep: true
    }
  },
  methods: {

    getList(query) {

      fetchDeviceData(query||this.search).then((res) => {
        console.log(res, 'table show list');
        this.data = res.data.data.data
        this.total = res.data.data.total
        this.labels = res.data.labels
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

