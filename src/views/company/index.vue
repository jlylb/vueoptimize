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
        <template slot-scope="{ data }" slot='logo'>
            <img :src="getImageUrl(data.logo)" class="logo-img" v-if='data.logo'>
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
                <template slot='area'>
                  <v-distpicker 
                  :province="selectarea.province" 
                  :city="selectarea.city" 
                  :area="selectarea.district"
                  @province='selectProvince'
                  @city='selectCity' 
                  @area='selectArea'
                  @selected="onSelected"></v-distpicker>
                </template>
                </my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createCompany, updateCompany, deleteCompany } from '@/api/company'
import VDistpicker from 'v-distpicker'
import { getImageUrl } from '@/utils'
export default {
  components: { tableList, MyForm, VDistpicker },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'name', label: '公司名' },
        {
          name: 'logo',
          label: '上传LOGO',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'logo',
            data: {
              field: 'logo'
            }
          },
          default: []
        },
        { name: 'area', label: '区域', hidden: true },
        { name: 'address', label: '公司地址' },
      ],
      searchColumns: [
        { name: 'name', label: '公司名', props: { clearable: true }},
        {
          name: 'created_at',
          label: '时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ]
      },
      columns: {
        id: {
          label: '编号'
        },
        name: {
          label: '公司名称'
        },
        province: {
          label: '省'
        },
        city: {
          label: '市'
        },
        district: {
          label: '区'
        },
        address: {
          label: '公司地址'
        },
        logo: {
          label: '公司logo'
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
      selectarea: {
        province: '',
        city: '',
        district: ''
      },
      area: {},
      formModel: {

      },
      editDialog: false
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
      this.setRules()
      this.editDialog = true
      this.dialogTitle = '添加'
      this.logo = []
      this.formModel = {}
      this.selectarea = { province: "", city: "", district: "" }
      this.$nextTick(() => {
        
        //this.formModel = {}  
      })
    },
    handleEdit(data) {
      this.setRules()
      this.editDialog = true
      this.dialogTitle = '编辑'
      console.log(data)
      if(data.logo){
        this.logo = [
          { url: getImageUrl(data.logo), name: 'logo' }
        ]
      }else{
        this.logo = []
      }
      let { province, city, district } = data
      this.selectarea = { province, city, district }
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
      const method = data.id ? updateCompany : createCompany
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
    },
    onSelected(data) {
      console.log(data)
      this.$refs.dialogForm.setFormModel(this.setArea(data))
    },
    setArea(data) {
      return {
        province: data.province.value,
        city: data.city.value,
        district: data.area.value,
        province_code: data.province.code,
        city_code: data.city.code,
        district_code: data.area.code
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
    selectArea(val) {
      console.log(val)
      this.selectarea.district = val.code?val.value:''
      this.$refs.dialogForm.validateField('area')
    },
    setRules() {
      console.log(this.$refs.dialogForm, 'aaa')
      var validArea = (rule, value, callback) => {
        if(!this.selectarea.province||!this.selectarea.city||!this.selectarea.district){
          callback(new Error('请选择区域'))
        }else{
          callback()
        }
        
      }
      this.formRules.area = [
        {required: true, trigger: 'blur', validator: validArea}
      ]
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss" >
   .table-layout .permission-form .el-input{
        width: 50%;
    }
    .logo-img{
      width: 100px;
      height: 100px;
    }
</style>

