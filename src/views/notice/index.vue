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
        <template slot-scope="{ data }" slot='status'>
            <el-tag> {{ data.status }} </el-tag>
        </template>
        <template slot='add_search_button'>
            <el-button type="primary"  icon='el-icon-circle-plus-outline'>添加</el-button>
        </template>
        </table-list>
        <el-dialog title="编辑" :visible.sync="editDialog" @open='dialogOpen'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :form-columns='formColumns'></my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, deleteNotice, updateNotice } from '@/api/notice'
export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      formColumns: [
        { name: 'name', label: '用户名' },
        {
          name: 'status',
          label: '消息等级',
          type: 'select',
          data: [
            { value: 1, label: '一般' },
            { value: 2, label: '警告' },
            { value: 3, label: '严重' },
            { value: 4, label: '紧急' },
            { value: 5, label: '加急' }
          ],
          props: {
            clearable: true,
            placeholder: '请选择'
          }
        },
        {
          name: 'created_at',
          label: '发送时间',
          type: 'date'
        }
      ],
      searchColumns: [
        { name: 'name', label: '用户名' },
        {
          name: 'status',
          label: '消息等级',
          type: 'select',
          data: [
            { value: 1, label: '一般' },
            { value: 2, label: '警告' },
            { value: 3, label: '严重' },
            { value: 4, label: '紧急' },
            { value: 5, label: '加急' }
          ],
          props: {
            clearable: true,
            placeholder: '请选择'
          }
        },
        {
          name: 'created_at',
          label: '发送时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入消息等级', trigger: 'blur' }
        ]
      },
      columns: {
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false
    }
  },
  methods: {
    handleDelete(data) {
      deleteNotice(data).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      // console.log(data)
      this.editDialog = true
      this.$nextTick(() => {
        this.$refs.dialogForm.resetForm()
      })
    },
    getList(query) {
      console.log(query)
      fetchList(query || this.search).then((res) => {
        this.data = res.data.items
        this.total = res.data.total
      }).catch((res) => {

      })
    },
    saveData() {
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    dialogOpen(val) {
      this.$nextTick(() => {
        console.log(this.$refs)
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

