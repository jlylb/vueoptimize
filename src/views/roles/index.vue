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
        <template slot='actionExtra' slot-scope="{ data }">
            <el-button
            size="mini"
            type="success"
            @click="handleRoleAbility(data)">授权</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :pform-columns='formColumns'></my-form>
        </el-dialog>
        <el-dialog title="角色授权" :visible.sync="roleDialog" @open='roleDialogOpen'>
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
import { fetchList, fetchRoleAlibity, createRole, updateRole, deleteRole } from '@/api/roles'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'name', label: '角色名' },
        { name: 'title', label: '角色描述' }

      ],
      searchColumns: [
        { name: 'name', label: '角色名', props: { clearable: true }},
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      columns: {
        id: {
          label: '编号'
        },
        name: {
          label: '角色名称'
        },
        title: {
          label: '角色描述'
        },
        scope: {
          label: '区域'
        },
        level: {
           hidden: true
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
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      roleDialog: false,
      roleFormModel: {},
      userFormModel: {},
      roleColumns: [

      ]
    }
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true
      this.dialogTitle = '添加'
      this.userFormModel = {}
      this.editId = 0

    },
    handleDelete(data) {
      deleteRole(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      console.log(data)
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
      const method = data.id ? updateRole : createRole
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
    handleRoleAbility(data) {
      console.log(data)
      this.$router.push({ name: 'api.roles.ability', params: { role: data.name }})
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
      }).catch((res) => {
          console.log(res)
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

