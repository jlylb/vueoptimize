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
        <template slot-scope="{ data }" slot='dt_issupportext'>
            <el-tag :type='data.dt_issupportext==1?"success":"info"'> {{ data.dt_issupportext==1?'支持':'不支持' }} </el-tag>
        </template>
        <template slot-scope="{ data }" slot='dt_isenable'>
            <el-tag :type='data.dt_isenable==1?"success":"info"'> {{ data.dt_isenable==1?'是':'否' }} </el-tag>
        </template>
        <template slot-scope="{ data }" slot='actionExtra'>
          <el-button
            type="primary"
            size='mini'
            @click="openView(data,'realdata')">实时数据</el-button>
            <el-button
            type="primary"
            size='mini'
            @click="openView(data, 'historydata')">历史数据</el-button>
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
                :pform-columns='formColumns'></my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createDevicetype, updateDevicetype, deleteDevicetype } from '@/api/devicetype'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'dt_typeid', label: '设备类型编号', isnumber: true },
        { name: 'dt_typename', label: '设备名称' },
        { name: 'dt_issupportext', label: '是否支持扩展', type: 'switch' },
        { name: 'dt_isenable', label: '是否可用', type: 'switch' },
        { name: 'dt_rtdata_table', label: '实时数据表名' },
        { name: 'dt_hisdata_table', label: '历史数据表名' },
        { name: 'dt_typememo', label: '备注', }

      ],
      searchColumns: [
        { name: 'dt_typename', label: '设备名称', props: { clearable: true }},
      ],
      formRules: {
        dt_typeid: [
          { required: true, message: '请输入设备类型编号', trigger: 'blur' },
          { type: 'integer', message: '设备编号必须是数字', trigger: 'blur' }
        ],
        dt_typename: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        dt_rtdata_table: [
          { required: true, message: '请输入实时数据表名', trigger: 'blur' }
        ],
        dt_hisdata_table: [
          { required: true, message: '请输入历史数据表名', trigger: 'blur' }
        ]
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        dt_index: {
          label: '设备索引'
        },
        dt_typeid: {
          label: '设备类型'
        },
        dt_typename: {
          label: '设备名称'
        },
        dt_issupportext: {
          label: '是否支持扩展'
        },
        dt_isenable: {
           label: '是否可用'
        },
        dt_rtdata_table: {
          label: '实时数据表名'
        },
        dt_hisdata_table: {
          label: '历史数据表名'
        },
        dt_typememo: {
          label: '备注'
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
      userFormModel: {
      },
      isAdd: true,
      labels: null
    }
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true
      this.isAdd = true
      this.dialogTitle = '添加'
      this.userFormModel = {
         dt_isenable: 1
      }
      this.editId = 0

    },
    handleDelete(data) {
      deleteDevicetype(data).then((res) => {
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
      const method = this.isAdd !== true ? updateDevicetype : createDevicetype
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
    openView(data, type) {
      const table = type === 'realdata' ? data.dt_rtdata_table : data.dt_hisdata_table
      this.$router.push({ name: 'api.data.index', params: { table: table, typeid: data.dt_typeid }})
    },
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

