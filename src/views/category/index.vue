<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        @list-data='getList'
        @list-edit='handleEdit'
        @list-delete='handleDelete'>
        <template  slot='add_search_button'>
            <el-button
            type="primary"
            icon='el-icon-circle-plus-outline'
            @click="handleAdd">添加</el-button>
        </template>
        </table-list>
        <select-item 
        v-model="formmodel.company" 
        :link="['pro','dapeng']" 
        :data="company" 
        ref="company"></select-item>
          <select-item 
          v-model="formmodel.pro" 
          :source="companyP"
          :link="['dapeng']" 
          ref="pro"></select-item>
                    <select-item 
          v-model="formmodel.dapeng" 
          :source="dapeng"
          ref="dapeng"></select-item>
          {{ formmodel }}
    </div>
</template>

<script>

import tableList from '../common/components/tableList'
import { fetchList, deleteCategory } from '@/api/category'
import openMessage from '@/utils/message.js'
import SelectItem from '../common/components/selectitem'

export default {
  components: { tableList, SelectItem },
  data() {
    return {
      data: [],
      logo: [],
      searchColumns: [
        { name: 'name', label: '分类名称', props: { clearable: true }},
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],
      columns: {
        id: {
          label: '编号'
        },
        parent_id: {
          label: '父分类'
        },    
        name: {
          label: '分类名称'
        },
        name_en: {
          label: '分类英文标识'
        },
        path: {
          label: '路径'
        },
        created_at: {
          label: '创建时间'
        },
        updated_at: {
          label: '更新时间'
        },
        action: {
          'min-width': '150',
          label: '操作'
        }
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      formmodel: {
        company: 1,
        pro: 24,
        dapeng: 41
      },
      company: [
        {label:"abc", value:1},
         {label:"bbc", value:2},
          {label:"dbc", value:3},
           {label:"qbc", value:4},
      ],
      companyP:{
        1:[
          {label:"gz", value:22},
          {label:"hz", value:23},
          {label:"zz", value:24},
        ],
                2:[
          {label:"wh", value:32},
          {label:"tj", value:33},
          {label:"hf", value:34},
        ]
      },
            dapeng:{
        24:[
          {label:"agz", value:41},
          {label:"bhz", value:42},
          {label:"czz", value:43},
        ],
                33:[
          {label:"cwh", value:52},
          {label:"ctj", value:53},
          {label:"chf", value:54},
        ]
      }
    }
  },
  methods: {
    handleAdd(data) {
      this.$router.push({ name: 'api.category.add' })
    },
    handleDelete(data) {
      deleteCategory(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      this.$router.push({ name: 'api.category.edit', params: { ...data }})
    },
    getList(query) {
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }).catch((res) => {

      })
    }

  },
  created() {
    this.getList()
  }
}
</script>

<style lang="scss">

</style>

