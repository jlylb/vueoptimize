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
        <template slot-scope="{ data }" slot='parent_area_name'>
            {{ data.parent_area_name ? data.parent_area_name.AreaName : '' }}
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false' class='dialog'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :form-props='formProps'
                :pform-columns='formColumns'>
                  <template slot='area'>
                    <v-distpicker
                    :only-province='onlyProvince'
                    :hide-area='hideArea' 
                    :province="selectarea.province" 
                    :city="selectarea.city"
                    :disabled='areaDisabled' 
                    @province='selectProvince'
                    @city='selectCity' 
                    @selected="onSelected"></v-distpicker>
                  </template>

                  <template slot='coname' slot-scope='{ data, fmodel }'>
                    <el-select 
                    v-model="fmodel[data.name]" 
                    @change='selectChange($event,data.data)'
                    @clear='selectClear'
                    :disabled='companyDisabled' 
                    v-bind='data.props||{}'>
                        <el-option
                        v-for="item in data.data"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </template>

                </my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createArea, updateArea, deleteArea } from '@/api/area'
import openMessage from '@/utils/message.js'
import VDistpicker from 'v-distpicker'
import { searchCompany } from '@/api/company'

export default {
  components: { tableList, MyForm, VDistpicker },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
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
          data: [

          ]
        },
        { name: 'area', label: '区域名称', hidden: true },
        { name: 'area_manager', label: '管理者' },
        { name: 'connect_phone', label: '联系电话' },
      ],
      searchColumns: [
        { name: 'AreaName', label: '区域名称', props: { clearable: true }},
      ],
      formRules: {
        coname: [
          {required: true, trigger: 'change', message: '请输入公司'}
        ]
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        AreaId: {
          label: '区域编号'
        },
        Fid: {
          label: '上级编号'
        },
        parent_area_name: {
          label: '上级区域'
        },
        AreaName: {
          label: '区域名称'
        },
        area_manager: {
           label: '管理者'
        },
        connect_phone: {
          label: '联系电话'
        },
        Co_ID: {
          label: '公司编号'
        },
        Co_Name: {
          label: '公司'
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
      selectarea: {
        province: '',
        city: '',
      },
      onlyProvince: false,
      hideArea: true,
      areaDisabled: false,
      companyDisabled: false
    }
  },
  methods: {
    handleAdd(data) {
      this.setRules()
      this.editDialog = true
     // this.onlyProvince = true
      this.isAdd = true
      this.dialogTitle = '添加'
      // this.areaDisabled = false
      // this.companyDisabled = false
      const columns = this.formColumns
      columns.map((item) => {
        if (item.name == 'coname') {
          item.data = []
          return item
        }
      })
      this.formColumns = columns

      this.userFormModel = {
        Fid: null,
        Co_ID: null
      }
      this.selectarea = { province: "", city: "" }
    },
    handleDelete(data) {
      deleteArea(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      console.log(data)
      this.setRules()
      this.isAdd = false
      this.editDialog = true
      this.dialogTitle = '编辑'
      // this.areaDisabled = true
      // this.companyDisabled = true
      data.coname = data.Co_Name

      let { AreaName } = data
      let province
      if(data.parent_area_name) {
         province = data.parent_area_name.AreaName
      }else{
        province = AreaName
        AreaName = ''
      }
      

      this.selectarea = { province, city: AreaName }
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
      const method = this.isAdd !== true ? updateArea : createArea
      let postData = {...data}
      console.log(this.selectarea)
      let { province, city} = this.selectarea
      postData.AreaName = city||province
      postData.province = province
      method(postData).then((res) => {
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
    onSelected(data) {
      console.log(data)
      this.$refs.dialogForm.setFormModel(this.setArea(data))
    },
    setArea(data) {
      return {
        province: data.province.code ? data.province.value : '' ,
        city: data.city.code ? data.city.value : '',
      }
    },
    selectProvince(val) {
      console.log(val)
      this.selectarea.province = val.code?val.value:''
      this.$refs.dialogForm.validateField('area')
    },
    selectCity(val) {
      console.log(val)
      this.selectarea.city = val.code?val.value:''
      this.$refs.dialogForm.validateField('area')
    },
    setRules() {
      var validArea = (rule, value, callback) => {
        console.log(this.selectarea)
        if(this.selectarea.province || this.selectarea.city){
          callback()
        } else {
          callback(new Error('请选择区域'))
        }
        
      }
      this.formRules.area = [
        {required: true, trigger: 'blur', validator: validArea}
      ]
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
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'Co_ID', val)
      this.userFormModel = formModel
    },
    selectClear() {
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'Co_ID', null)
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

