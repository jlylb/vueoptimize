<template>
    <el-form  :model="formModel" class="my-form" :rules='rules'  label-width="100px"  :ref="formName" v-bind="formProps">
    <el-tabs type="border-card" :value='tabactive'>
      <el-tab-pane :label="tabindex" :name='tabindex' v-for='(column, tabindex) in tabs' :key='tabindex'>
        <my-formitem
          :default-files='pics' 
          :pform-model='formModel'
          :pform-columns='column'>
        </my-formitem>
      </el-tab-pane>
    </el-tabs>

    <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="!isCustomButton">保存</el-button>
    </el-form-item>

    </el-form>
</template>

<script>

import uploadFormColumn from './uploadFormColumn'
import MyFormitem from './myformitem'
import FormMix from '../mixins/formmix'

export default {
  mixins: [FormMix],
  components: { uploadFormColumn, MyFormitem },
  data() {
    return {
      tabs: {}
    }
  },
  props: {
    tabactive: {
      type: String,
      default() {
        return ''
      }
    }
  },
  provide(){
    return {
      tabform: this.$refs,
      refname: this.formName
    }
    
  },
  watch: {

  },
  methods: {

  },
  created() {
    console.log(this.$refs)
    const items = {}
    const tabs = {}
    let curTab = 'default'
    this.formColumns.forEach((item) => {
      if (!item.hidden) {
        items[item.name] = item.default || ''
      }
      if (item.type === 'formbutton') {
        if (item.buttons && item.buttons.save) {
          item.buttons.save.events.click = this.onSubmit
        }
      }
      if (item.tab) {
        curTab = item.tab
      }
      if (!tabs[curTab]) {
        tabs[curTab] = []
      }
      tabs[curTab].push(item)
    })
    this.tabs = tabs
    console.log(tabs)
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
 }
</style>

