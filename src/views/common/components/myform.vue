<template>
    <el-form  :model="formModel" class="my-form" :rules='rules'  label-width="100px"  :ref="formName" v-bind="formProps">
        <el-form-item 
        :label="myitem.label || myitem.name" 
        v-for='myitem in formColumns' 
        :key='myitem.name' 
        :prop='myitem.name'>
<slot :name='myitem.name' :data='myitem' :fmodel='formModel'>

            <el-input 
            v-model="formModel[myitem.name]" 
            v-if='(!myitem.type || myitem.type=="input") && myitem.isnumber!==true' 
            v-bind='myitem.props||{}' 
            :type='myitem.inputType||"text"'></el-input>

            <el-input 
            v-model.number="formModel[myitem.name]" 
            v-if='myitem.isnumber===true && (!myitem.type || myitem.type=="input")' 
            v-bind='myitem.props||{}' 
            :type='myitem.inputType||"text"'></el-input>

            <el-input-number
            v-model.number="formModel[myitem.name]" 
            v-if='myitem.type=="el-input-number"' 
            :controls-position='"right"'
            v-bind='myitem.props||{}'></el-input-number>

            <el-select 
            v-model="formModel[myitem.name]" 
            v-if='myitem.type=="select"' 
            v-on="myitem.events||{}"
            v-bind='myitem.props||{}'>
                <el-option
                v-for="item in myitem.data"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>

            <el-date-picker
                v-if='myitem.type=="date"'
                v-model="formModel[myitem.name]"
                :type="myitem.datetype||'daterange'"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder='开始日期'
                end-placeholder='结束日期'
                v-bind='myitem.props||{}'>
            </el-date-picker>

            <el-switch
                v-model="formModel[myitem.name]"
                v-if='myitem.type=="switch"'
                :active-value='1'
                :inactive-value='0'
                v-bind='myitem.props||{}'>
            </el-switch>

              <el-radio-group 
              v-model="formModel[myitem.name]"
              v-if='myitem.type=="radiogroup"'
              v-bind='myitem.props||{}'>
                <el-radio 
                    :label="item.value" 
                    v-for="item in myitem.data" 
                    :key='item.value'>{{ item.label }}</el-radio>
            </el-radio-group>

            <el-checkbox-group 
              v-model="formModel[myitem.name]"
              v-if='myitem.type=="checkboxgroup"'
              v-bind='myitem.props||{}'>
                <el-checkbox 
                    :label="item.value" 
                    v-for="item in myitem.data" 
                    :key='item.value'>{{ item.label }}</el-checkbox>
            </el-checkbox-group>

            <el-checkbox 
                v-model="formModel[myitem.name]"
                v-if='myitem.type=="checkbox"'
                v-bind='myitem.props||{}'></el-checkbox>

            <el-tree
              :data="myitem.data"
              :props="myitem.defaultProps"
              node-key='id'
              :ref='myitem.ref'
              accordion
              @node-click="handleNodeClick"
              v-model="formModel[myitem.name]"
              v-if='myitem.type=="tree"'
              v-bind='myitem.props||{}'>
            </el-tree>   

            <el-cascader
              :options="myitem.data"
              :ref='myitem.ref'
              v-model="formModel[myitem.name]"
              v-if='myitem.type=="cascader"'
              v-bind='myitem.props||{}'>
            </el-cascader> 

            <upload-form-column
                v-if='myitem.type=="upload"'
                @upload-success='uploadSuccess'
                @remove-success='removeSuccess'
                :file-list='pics'
                :upload-props='myitem.props || {}'>
            </upload-form-column>
            <upload-crop
                v-if='myitem.type=="uploadcrop"'
                @upload-success='uploadCrop'
                @upload-fail='uploadFail'
                :default-img='defaultCrop'
                :crop-params='myitem.props'>
            </upload-crop>
</slot>
        </el-form-item>
        <slot name='button'>
          <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </slot>
    </el-form>
</template>
<script>
import uploadFormColumn from './uploadFormColumn'
import UploadCrop from './uploadCrop'

export default {
  components: { uploadFormColumn, UploadCrop },
  data() {
    return {
      formModel: this.pformModel,
      formColumns: this.pformColumns,
      rules: this.formRules,
      pics: this.defaultFiles
    }
  },
  props: {
    pformColumns: {
      type: Array,
      default() {
        return []
      }
    },
    pformModel: {
      type: Object,
      default() {
        return {}
      }
    },
    formProps: {
      type: Object,
      default() {
        return {}
      }
    },
    formRules: {
      type: Object,
      default() {
        return {}
      }
    },
    formName: {
      type: String,
      default() {
        return 'from1'
      }
    },
    defaultFiles: {
      type: Array,
      default() {
        return []
      }
    },
    defaultCrop: {
      type: String,
      default() {
        return ''
      }
    }
  },
  watch: {
    formRules(newVal) {
      console.log(newVal, 77777777777)
      this.rules = newVal
      this.$nextTick(()=>{
        this.$refs[this.formName].fields.forEach((item)=>{
          console.log(item.getRules())
          const rules = item.getRules()
          if (rules.length || item.required !== undefined) {
            item.$on('el.form.blur', item.onFieldBlur)
            item.$on('el.form.change', item.onFieldChange)
          }
        })
      })

    },
    pformModel(newVal) {
      console.log(newVal,4444)
      this.formModel = newVal
    },
    pformColumns(newVal) {
      console.log(newVal)
      this.formColumns = newVal
    },
    defaultFiles(newVal) {
      console.log(newVal)
      this.pics = newVal
    }
  },
  methods: {
    onSubmit() {
      this.$refs[this.formName].validate((valid) => {
        if (valid) {
          console.log(this.formModel,77777)
          this.$emit('do-form', this.formModel)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs[this.formName].resetFields()
    },
    clearValidate() {
      this.$refs[this.formName].clearValidate()
    },
    validateField(field) {
      this.$refs[this.formName].validateField(field)
    },
    uploadSuccess(file, props) {
      const fieldName = props.name || 'file'
      this.formModel[fieldName] = file.data.location
    },
    uploadFail(file, field) {
      console.log(file)
    },
    uploadCrop(file, field) {
      const fieldName = field || 'file'
      this.formModel[fieldName] = file.data.location
    },
    removeSuccess(file, props) {
      const fieldName = props.name || 'file'
      this.formModel[fieldName] = ''
      this.pics = []
    },
    setFormModel(data) {
      this.formModel = Object.assign({},this.formModel, data)
    },
    getFormModel() {
      return this.formModel
    },
    getForm() {
      return this.$refs[this.formName]
    },
    setFormRules() {

    },
    handleNodeClick(data) {
      console.log(data)
      this.formModel.pid = data.id
    }
  },
  created() {
    console.log(this.$refs)
    const items = {}
    this.formColumns.forEach((item) => {
      if(!item.hidden){
        items[item.name] = item.default || ''
      }   
    })

    console.log(items, this.formModel,"before")
    this.formModel = Object.assign(items, this.formModel)
    console.log(this.formModel,"after")
    
  }
}
</script>

<style lang="scss">
.my-form {
  .el-form-item__label {
    color: #606266;
  }
  .el-input {
    width: auto;
  }
}
</style>

