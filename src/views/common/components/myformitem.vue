<template>

<div>
      <el-form-item 
      :label="getLabel(myitem.label, myitem.name, myitem.type)" 
      v-for='myitem in formColumns'
      v-if='myitem.type!=="formbutton"' 
      :key='myitem.name'
      :class='"form-box-item form-box-" + myitem.name' 
      :prop='myitem.name' v-bind='myitem.formitem||{}'>

      <slot 
      :name='myitem.name' 
      :data='myitem' 
      :fmodel='formModel'>

            <el-input 
            v-model="formModel[myitem.name]" 
            v-if='!myitem.type || myitem.type=="input"' 
            v-bind='myitem.props||{}' 
            :type='myitem.inputType||"text"'>
            </el-input>

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

            <el-button 
            v-if='myitem.type=="button"'
            v-on='myitem.events||{}'
            type="primary"
            v-bind='myitem.props||{}'>
            {{ myitem.label||myitem.name }}
            </el-button>

            <tinymce
            v-if='myitem.type=="richtext"'
            :ref='myitem.ref||"tinymce1"'
            v-model="formModel[myitem.name]"
            v-on='myitem.events||{}'
            v-bind='myitem.props||{}'>
            </tinymce>            
        </slot>
      </el-form-item>

      <div v-if='formButtons.type=="formbutton"' class='form-button'>
        <el-button 
        v-for='(button, buttonKey) in formButtons.buttons'
        :key='buttonKey'
        v-on='button.events||{}'
        type="primary"
        v-bind='button.props||{}'>
        {{ button.label||button.name }}
        </el-button>  
      </div>

</div>

</template>
<script>
import uploadFormColumn from './uploadFormColumn'
import Tinymce from '@/components/Tinymce'
export default {
  components: { uploadFormColumn, Tinymce },
  data() {
    return {
      formModel: this.pformModel,
      formColumns: this.pformColumns,
      pics: this.defaultFiles,
      formButtons: {}
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

    defaultFiles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    pformModel(newVal) {
      this.formModel = newVal
    },
    pformColumns(newVal) {
      this.formColumns = newVal
    },
    defaultFiles(newVal) {
      this.pics = newVal
    }
  },
  inject: ['tabform', 'refname'],
  methods: {
    uploadSuccess(file, props) {
      const fieldName = props.name || 'file'
      console.log(file)
      console.log('upload......', this.tabform, this.refname)
      this.formModel[fieldName] = file.data.location
      if(this.tabform) {
        this.tabform[this.refname].validateField(fieldName)
      }
    },
    removeSuccess(file, props) {
      const fieldName = props.name || 'file'
      this.formModel[fieldName] = ''
      this.pics = []
      if(this.tabform) {
        this.tabform[this.refname].validateField(fieldName)
      }
    },
    setFormModel(data) {
      this.formModel = Object.assign({}, this.formModel, data)
    },
    getFormModel() {
      return this.formModel
    },
    getLabel(label, name, type) {
      if (type !== 'button' || type !== 'formbutton') {
        return label
      }
      return ''
    }
  },
  created() {
    const items = {}
    console.log(this.formColumns, 'created', this.tabform)
    this.formColumns.forEach((item) => {
      if (!item.hidden || item.type !== 'formbutton') {
        items[item.name] = item.default || ''
      }
      if (item.type === 'formbutton') {
        this.formButtons = item
      }
    })
    this.formModel = Object.assign(items, this.formModel)
  }
}
</script>

<style lang="scss">
 .my-form {
     .el-form-item__label {
        color: #606266
     }
     .el-input {
         width: auto;
     }
     .form-button {
       text-align: center
     }

 }
</style>

