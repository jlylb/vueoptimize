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
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :pform-model='formModel'
                :pform-columns='formColumns'></my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createPermission, updatePermission, deletePermission } from '@/api/permission'
import openMessage from '@/utils/message.js'
export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'name', label: '权限名称' },
        {
          name: 'title',
          label: '权限描述'
        }
        // {
        //   name: 'entity_type',
        //   label: '模型'
        // },
        // {
        //   name: 'only_owned',
        //   label: '属于自己',
        //   type: 'checkbox'
        // },
        // {
        //   name: 'scope',
        //   label: '域名称'
        // }
      ],
      searchColumns: [
        { name: 'name', label: '权限名', props: { clearable: true }},
        {
          name: 'created_at',
          label: '时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入权限名', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入权限描述', trigger: 'blur' }
        ]
      },
      columns: {
        id: {
          label: '编号'
        },
        name: {
          label: '权限名称'
        },
        route_path: {
          label: '路由路径'
        },
        title: {
          label: '权限描述'
        },
        entity_id: {
          label: '对象编号'
        },
        entity_type: {
          label: '对象模型'
        },
        only_owned: {
          label: '属于自己'
        },
        scope: {
          label: '区域'
        },
        created_at: {
           label: '创建时间',
        },
        updated_at: {
           label: '更新时间'
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
      editDialog: false,
      formModel: {}
    }
  },
  methods: {
    handleDelete(data) {
      deletePermission(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd() {
      this.editDialog = true
      this.dialogTitle = '添加'
      this.formModel = {}
 
    },
    handleEdit(data) {
      console.log(data)
      this.editDialog = true
      this.dialogTitle = '编辑'
      // this.formModel = data
      this.$nextTick(() => {
        
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
      const method = data.id ? updatePermission : createPermission
      method(data)
        .then((res) => {
          openMessage(res).then(() => {
            this.getList()
          })
        })
        .catch((res) => {
        })
    },
    dialogOpen(val) {
      this.$nextTick(() => {
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

</style>

