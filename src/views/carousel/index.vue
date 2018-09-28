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
    </div>
</template>

<script>

import tableList from '../common/components/tableList'
import { fetchList, deleteCarousel } from '@/api/carousel'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList },
  data() {
    return {
      data: [],
      logo: [],
      searchColumns: [
        { name: 'name', label: '幻灯片名称', props: { clearable: true }},
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
        name: {
          label: '幻灯片名称'
        },
        height: {
          label: '幻灯片高度'
        },
        initial_index: {
          label: '幻灯片的索引'
        },
        autoplay: {
          label: '是否自动切换'
        },
        interval: {
          label: '自动切换间隔'
        },
        type: {
          label: '幻灯片类型'
        },
        indicator_position: {
          label: '指示器的位置'
        },
        trigger: {
          label: '触发方式'
        },
        arrow: {
          label: '箭头显示时机'
        },
        status: {
          label: '状态'
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
      }
    }
  },
  methods: {
    handleAdd(data) {
      this.$router.push({ name: 'api.carousel.add' })
    },
    handleDelete(data) {
      deleteCarousel(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      this.$router.push({ name: 'api.carousel.edit', params: { ...data }})
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

