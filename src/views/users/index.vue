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
        <template slot-scope="{ data }" slot='status'>
            <el-tag> {{ data.status }} </el-tag>
        </template>
        <template slot-scope="{ data }" slot='company'>
             {{ data.company && data.company.name ||'' }}
        </template>
          <template slot-scope="{ data }" slot='avatar'>
            <img :src="getImageUrl(data.avatar)" v-if='data.avatar' :style='{width: "100px", height: "100px"}'/>
        </template>
        <template slot='actionExtra' slot-scope="{ data }">
                <el-button
                size="mini"
                type="success"
                @click="handleRole(data)">授权</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="addDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :pform-columns='formColumns'></my-form>
        </el-dialog>

        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='editDialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='editDialogForm'
                @do-form='saveData'
                :form-rules='editFormRules'
                :pform-model='editUserFormModel'
                :pform-columns='editFormColumns'></my-form>
        </el-dialog>

        <el-dialog title="用户授权" :visible.sync="roleDialog" @open='roleDialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='roleForm'
                @do-form='saveRoleData'
                :pform-model='roleFormModel'
                :pform-columns='roleColumns'></my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, fetchRoles, saveRoles, createUser, updateUser, deleteUser, getCompany } from '@/api/users'
import axios from 'axios'
import { getImageUrl } from '@/utils'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      formColumns: [
        { name: 'name', label: '用户名' },
        { name: 'email', label: '邮箱' },
        { name: 'password', label: '密码', inputType: 'password', type: 'input' },
        { name: 'password_confirmation', label: '确认密码', inputType: 'password', type: 'input' },
        {
          name: 'company_id',
          label: '所属公司',
          type: 'select',
          props: {
            filterable: true,
            remote: true,
            remoteMethod: this.remoteRoute,
            placeholder: '请输入公司名称',
            class: 'select-company_id',
            clearable: true,
            allowCreate: false
          },
          data: [

          ]
        },
      ],
      editFormColumns: [
        { name: 'name', label: '用户名' },
        { name: 'email', label: '邮箱' },
        {
          name: 'company_name',
          label: '所属公司',
          type: 'select',
          props: {
            filterable: true,
            remote: true,
            remoteMethod: this.remoteEditRoute,
            placeholder: '请输入公司名称',
            class: 'select-company_id',
            clearable: true,
            allowCreate: false
          },
          events: {
            change: this.editChange
          },
          data: [

          ]
        },
      ],
      searchColumns: [
        { name: 'name', label: '用户名', props: { clearable: true }},
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
      },
      columns: {
        id: {
          label: '编号'
        },
        name: {
          label: '用户名称'
        },
        email: {
          label: '用户邮箱'
        },
        avatar: {
          label: '用户头像'
        },
        company: {
          label: '所属公司'
        },
        created_at: {
           label: '创建时间',
        },
        updated_at: {
           label: '更新时间'
        },
        action: {
          'min-width': '150',
          label: '操作'
        },
        company_id: {
          hidden: true
        }
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      roleDialog: false,
      addDialog: false,
      roleFormModel: {},
      userFormModel: {},
      editUserFormModel: {},
      roleColumns: [
        {
          name: 'roles',
          label: '角色',
          type: 'checkboxgroup',
          data: [
          ]
        }
      ],
      dialogTitle: '',
      company_id: null
    }
  },
  methods: {
    getImageUrl,
    handleAdd(data) {
      this.addDialog = true
      this.dialogTitle = '添加'
      this.userFormModel = {}
      this.editId = 0

    },
    handleDelete(data) {
      deleteUser(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      // console.log(data)
      this.editDialog = true
      this.dialogTitle = '编辑'
      console.log(data.company)
      this.company_id = null
      data.company_name = data.company&&data.company.name||''
      this.editUserFormModel = data
      this.$nextTick(() => {

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
      const method = data.id ? updateUser : createUser
      if(this.company_id) {
        data.company_id = this.company_id
      }
      method(data).then((res) => {
        console.log(res)
        openMessage(res).then(() => {
          this.addDialog = false
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
    editDialogOpen(val) {

      this.$nextTick(() => {
        this.$refs.editDialogForm.clearValidate()
      })
    },
    handleRole(data) {
      this.roleDialog = true
      fetchRoles(data.id).then((res) => {
        const columns = this.roleColumns
        columns[0].data = res.data.data.allRoles
        this.roleColumns = columns
        this.roleFormModel = { roles: res.data.data.myRoles, id: data.id }
      }).catch((res) => {
        console.log(res)
      })
    },
    roleDialogOpen() {
      this.$nextTick(() => {
        this.$refs.roleForm.clearValidate()
      })
    },
    saveRoleData(data) {
      saveRoles(data).then((res) => {
        openMessage(res).then(() => {
          this.roleDialog = false
          this.getList()
        })
      })
        .catch((res) => {
          console.log(res)
        })
    },
    remoteRoute(query) {
      getCompany(query, {}).then((res) => {
        console.log(res)
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'company_id') {
            item.data = res.data.data
            return item
          }
        })
        this.formColumns = columns
      }).catch((res) => {
        console.log(res)
      })
    },
    remoteEditRoute(query) {
      getCompany(query, {}).then((res) => {
        console.log(res)
        const columns = this.editFormColumns
        columns.map((item) => {
          if (item.name == 'company_name') {
            item.data = res.data.data
            return item
          }
        })
        this.editFormColumns = columns
      }).catch((res) => {
        console.log(res)
      })
    },
    editChange(val) {
      if(!val) {
        this.company_id = null
      } else {
        this.company_id = val
      }
      
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
   .table-layout .my-form .el-input{
        width: 50%;
    }
    .select-company_id {
      width: 100%;
    }
</style>

