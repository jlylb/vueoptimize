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

        </table-list>


    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList } from '@/api/log'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      dialogTitle: '',
      searchColumns: [
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],

      columns: {
        logid: {
          label: '编号'
        },
        userid: {
          label: '用户编号'
        },
        username: {
          label: '用户名'
        },
        url: {
          label: '操作地址'
        },
        content: {
          label: '内容'
        },
        updatetime: {
          label: '创建时间',
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

