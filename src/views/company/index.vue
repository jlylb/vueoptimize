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
        <template slot-scope="{ data }" slot='Co_Logo'>
            <img :src="getImageUrl(data.Co_Logo)" class="logo-img" v-if='data.Co_Logo'>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="permission-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :pform-model='formModel'
                :pform-columns='formColumns'>
                </my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createCompany, updateCompany, deleteCompany } from '@/api/company'
import { getImageUrl } from '@/utils'
export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'Co_Name', label: '公司名' },
        {
          name: 'logo',
          label: '上传LOGO',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'Co_Logo',
            data: {
              field: 'Co_Logo'
            }
          },
          default: []
        },
        { name: 'Co_ConnectionsNumber', label: '联系电话', hidden: true },

      ],
      searchColumns: [
        { name: 'Co_Name', label: '公司名', props: { clearable: true }},
        {
          name: 'created_at',
          label: '时间',
          type: 'date'
        }
      ],
      formRules: {
        Co_Name: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ]
      },
      columns: {
        Co_ID: {
          label: '编号'
        },
        Co_Name: {
          label: '公司名称'
        },
        Co_Logo: {
          label: '公司图标'
        },
        Co_ConnectionsNumber: {
          label: '联系电话'
        },
        action: {
          'min-width': '100',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      formModel: {

      },
      editDialog: false,
      isAdd: true
    }
  },
  methods: {
    getImageUrl,
    handleDelete(data) {
      deleteCompany(data).then((res) => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getList()
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd() {
      this.editDialog = true
      this.dialogTitle = '添加'
      this.isAdd = true
      this.logo = []
      this.formModel = {}
      this.$nextTick(() => {
        
      })
    },
    handleEdit(data) {
      this.editDialog = true
      this.dialogTitle = '编辑'
      this.isAdd = false
      console.log(data)
      if(data.Co_Logo){
        this.logo = [
          { url: getImageUrl(data.Co_Logo), name: 'logo' }
        ]
      }else{
        this.logo = []
      }
      //this.formModel = data
      this.$nextTick(() => {
        //this.$refs.dialogForm.resetForm()
        this.$refs.dialogForm.setFormModel(data)

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
      this.editDialog = false
      const method = this.isAdd !== true ? updateCompany : createCompany
      method(data)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.getList()
        })
        .catch((res) => {
        })
    },
    dialogOpen(val) {
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.dialogForm.clearValidate()
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss" >
    .logo-img{
      width: 100px;
      height: 100px;
    }
</style>

