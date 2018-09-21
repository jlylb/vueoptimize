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
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createWarnClass, updateWarnClass, deleteDeviceinfo } from '@/api/warnclass'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        // { name: 'wc_index', label: '告警编号', type: 'el-input-number', props: {min:1, max: 4} },
        { name: 'Wc_classname', label: '告警分类' },
        { name: 'Wc_memo', label: '告警描述' },

      ],
      searchColumns: [
        { name: 'Wc_classname', label: '告警分类', props: { clearable: true }},
      ],
      formRules: {
        // wc_index: [
        //   { type:'number', required: true, message: '请输入告警编号', trigger: 'blur' }
        // ],
        Wc_classname: [
          { required: true, message: '请输入告警分类', trigger: 'blur' }
        ],
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        wc_index: {
          label: '编号'
        },
        Wc_classname: {
          label: '告警分类'
        },
        Wc_memo: {
          label: '告警描述'
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
      userFormModel: {
      },
      isAdd: true,
    }
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true
      this.isAdd = true
      this.dialogTitle = '添加'
      this.userFormModel = {
       
      }
      this.editId = 0

    },
    handleDelete(data) {
      deleteDeviceinfo(data).then((res) => {
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
      const method = this.isAdd !== true ? updateWarnClass : createWarnClass
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


  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

