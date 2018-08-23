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

        <template slot-scope="{ data }" slot='area'>
            {{ data.area.AreaName }}
        </template>

        <template slot-scope="{ data }" slot='company'>
            {{ data.company.Co_Name }}
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
                <template slot='areaname' slot-scope="{ data, fmodel }">
                  <el-select 
                    v-model="fmodel[data.name]" 
                    v-on="data.events||{}"
                    v-bind='data.props||{}'>
                        <el-option-group
                          v-for="group in data.data"
                          :key="group.label"
                          :label="group.label">
                            <el-option
                            v-for="item in group.children"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </template>

                </my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createDeviceinfo, updateDeviceinfo, deleteDeviceinfo, fetchAllTypes, fetchAreas } from '@/api/deviceinfo'
import openMessage from '@/utils/message.js'
import { searchCompany } from '@/api/company'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'pdi_name', label: '设备名称' },
        { name: 'pdi_code', label: '设备编号' },
        { 
         name: 'dpt_id',
         label: '设备分类',
          type: 'select',
          props: {
            class: 'select-dropdown',
            placeholder: '请输入设备分类',
            filterable: true,
            clearable: true,
          },
          data: [] },
          { 
          name: 'coname',
          label: '公司',
          type: 'select',
          props: {
            filterable: true,
            remote: true,
            remoteMethod: this.remoteRoute,
            placeholder: '请输入公司名称',
            class: 'select-dropdown',
            clearable: true
          },
          events: {
            change: this.selectChange,
            clear: this.selectClear
          },
          data: [

          ]
        },
        { 
          name: 'areaname', 
          label: '区域', 
          type: 'select', 
          props: {
            filterable: true,
            placeholder: '请选择区域',
            class: 'select-dropdown',
            clearable: true
          },
          events: {
            change: this.areaSelectChange,
            clear: this.areaSelectClear
          },
          data: [

          ]
        },

      ],
      searchColumns: [
        { name: 'pdi_code', label: '设备编号', props: { clearable: true }},
      ],
      formRules: {
        pdi_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        pdi_code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        dpt_id: [
          { required: true, message: '请选择设备分类', trigger: 'change' }
        ],
        coname: [
          { required: true, message: '请选择所属公司', trigger: 'change' }
        ],
        areaname: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ]
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        pdi_index: {
          label: '设备索引'
        },
        pdi_name: {
          label: '设备名称'
        },
        pdi_code: {
          label: '设备编号'
        },
        dpt_id: {
          label: '设备分类'
        },
        AreaId: {
          label: '区域'
        },
        area: {
          label: '区域名称'
        },
        Co_ID: {
          label: '公司编号'
        },
        company: {
          label: '公司名称'
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
      companyId: null
    }
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true
      this.companyId = null
      this.isAdd = true
      this.dialogTitle = '添加'
      this.userFormModel = {
         dt_isenable: 1
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
      this.companyId = data.Co_ID
      data.areaname = data.area.AreaName
      data.coname = data.company.Co_Name
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
      const method = this.isAdd !== true ? updateDeviceinfo : createDeviceinfo
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
      fetchAllTypes().then((res) => {
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'dpt_id') {
            item.data = res.data.data
          }
          if (item.name == 'coname') {
            item.data = []
          }
          if (item.name == 'areaname') {
            item.data = []
          }
          return item
        })
        this.formColumns = columns
      })
      this.setArea(this.companyId)
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    remoteRoute(query) {
      searchCompany(query).then((res) => {
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'coname') {
            item.data = res.data.data
            return item
          }
        })
        this.formColumns = columns
      }).catch((res) => {
        console.log(res)
      })
    },
    selectChange(val, data) {
      console.log(val, data)
      this.companyId = val
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'Co_ID', val)
      this.$set(formModel, 'areaname', null)
      this.userFormModel = formModel
      this.setArea(val)
      this.$refs.dialogForm.validateField('areaname')
    },
    setArea(cid){
      if(!cid) {
        return
      }
      fetchAreas(cid).then((res) => {
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'areaname') {
            item.data = res.data.data
            return item
          }
        })
        this.formColumns = columns
      })
    },
    selectClear() {
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'Co_ID', null)
      this.userFormModel = formModel
    },
    areaSelectChange(val, data) {
      console.log(val, data)
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'AreaId', val)
      this.userFormModel = formModel

    },
    areaSelectClear() {
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'AreaId', null)
      this.userFormModel = formModel
    },
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">

</style>

