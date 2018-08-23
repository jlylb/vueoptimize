<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        @list-data='getList'
        @list-edit='viewContent'
        @list-delete='handleDelete'>
        <template slot-scope="{ data }" slot='status'>
            <el-tag> {{ data.status }} </el-tag>
        </template>
        <template slot='action' slot-scope="{ data }">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(data)">删除</el-button>
        </template>
        <template slot='actionExtra' slot-scope="{ data }">
            <el-button
            size="mini"
            type="success"
            @click="viewContent(data)">查看</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" 
        :visible.sync="editDialog" 
        @open='dialogOpen'
        :before-close='beforeClose' 
        :close-on-click-modal='false'>
          <el-card class="box-card" shadow="hover">
            {{ messageData.content }}
          </el-card>
        </el-dialog>

    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, readAllNotification, readNotification, deleteNotification } from '@/api/notification'
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
          label: '发送时间',
          type: 'date'
        }
      ],

      columns: {
        id: {
          label: '编号'
        },
        type: {
          label: '通知类型'
        },
        type: {
          label: '通知类型'
        },
        notifiable_id: {
          label: '接收人ID'
        },
        name: {
          label: '接收人'
        },
        notifiable_type: {
          label: '接收类型',
          hidden: true
        },
        data: {
           label: '消息内容',
        },
        read_at: {
           label: '阅读时间',
        },
        created_at: {
           label: '发送时间',
        },
        updated_at: {
           label: '更新时间',
           hidden: true
        },
        action: {
          'min-width': '150',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      userFormModel: {},
      messageData: {}

    }
  },
  methods: {

    handleDelete(data) {

      this.$confirm('删除记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNotification(data).then((res) => {
          openMessage(res).then(() => {
            this.getList()
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

    },

    getList(query) {
      console.log(query)
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },

    dialogOpen(val) {
      this.$nextTick(() => {
        // this.messageData = {}
      })
    },
    viewContent(data) {
      this.editDialog = true
      this.dialogTitle = '查看消息'
      this.messageData = data.data
      readNotification(data).then((res) => {
          this.getList()
      }).catch((res) => {
        console.log(res)
      })
    },
    beforeClose(done) {
      done()
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">

</style>

