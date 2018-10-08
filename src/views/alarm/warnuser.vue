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
        <template  slot='actionExtra' slot-scope='{ data }'>
          <el-button
              type="danger"
              size='small'
              icon='el-icon-bell'
              @click="handleWarn(data)">告警设置</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :form-props='formProps'
                :pform-columns='formColumns'>

                </my-form>
        </el-dialog>
        <el-dialog title="告警设置" :visible.sync="editDialogWarn" width='50%'>
          <deviceinfo-warn :uid='uid' :key='uid'></deviceinfo-warn>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createItem, updateItem, deleteItem } from '@/api/warnuser'
import openMessage from '@/utils/message.js'
import DeviceinfoWarn from '@/views/deviceinfo/warn'

export default {
  components: { tableList, MyForm, DeviceinfoWarn },
  data() {
    return {
      data: [],
      logo: [],
      uid: null,
      dialogTitle: '',
      formColumns: [
        { name: 'Wu_name', label: '用户名' },
        { name: 'Wu_title', label: '用户称谓' },
        { name: 'Wu_SmsNumber', label: '短信息号码'},
        { name: 'Wu_Emailaddr', label: '邮件地址'},
        { name: 'Wu_Telenumber', label: '用户电话号码' },
 
      ],
      searchColumns: [
        { name: 'wu_index', label: '用户编号', props: { clearable: true }},
      ],
      formRules: {
        Wu_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        Wu_SmsNumber: [
          { type:'string', len: 11, required: true, message: '请输入11位短信息号码', trigger: ['blur'] }
        ],
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        wu_index: {
          label: '索引'
        },
        Wu_name: {
          label: '用户名'
        },
        Wu_title: {
          label: '用户称谓'
        },
        Wu_SmsNumber: {
          label: '短信息号码'
        },
        Wu_Emailaddr: {
          label: '邮件地址'
        },
        Wu_Telenumber: {
          label: '用户电话号码'
        },

        action: {
          'min-width': '200',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      editDialogWarn: false,
      userFormModel: {
      },
      isAdd: true,
    }
  },
  filters: {

  },
  methods: {
    handleAdd(data) {
      this.editDialog = true
      this.isAdd = true
      this.dialogTitle = '添加'
      this.userFormModel = {

      }

    },
    handleDelete(data) {
      deleteItem(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      console.log(data)
      this.isAdd = false
      this.editDialog = true
      this.dialogTitle = '编辑'

      this.$nextTick(() => {
        this.userFormModel = data
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
    saveData(data) {
      const method = this.isAdd !== true ? updateItem : createItem
      data.isAdd = this.isAdd
      method(data).then((res) => {
        openMessage(res).then(() => {
          this.editDialog = false
          this.getList()
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    dialogOpen(val) {

      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    handleWarn(data) {
      this.editDialogWarn = true
      this.uid = data.wu_index
    }

  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

