<template>
    <el-form  
    :model="formModel" 
    class="my-form" 
    :rules='rules'  
    label-width="100px"  
    :ref="formName" 
    v-bind="formProps">

<div class='layout-form'> 
  <div 
    v-for='(groups, layout) in tabs'
    :class='"layout-form-item layout-form-" + layout' 
    :key='layout'>
      <form-box 
      v-for='(column, tabindex) in groups'
      :class='tabindex + " box-card"' 
      :key='tabindex'>
        <template slot="headerTitle">
          <span>{{ tabLabel[tabindex]||tabindex }}</span>
        </template>
        <slot :name='"group-" + tabindex' :pics='pics' :form-model='formModel' :column='column'>
          <my-formitem
            :default-files='pics' 
            :pform-model='formModel'
            :pform-columns='column'>
          </my-formitem>
        </slot>
      </form-box>
  </div>
</div>

    </el-form>
</template>
<script>
import uploadFormColumn from './uploadFormColumn'
import MyFormitem from './myformitem'
import FormBox from './formbox'
import FormMix from '../mixins/formmix'
export default {
  mixins: [FormMix],
  components: { uploadFormColumn, MyFormitem, FormBox },
  data() {
    return {
      tabs: {}
    }
  },
  props: {

  },
  watch: {

  },
  methods: {

  },
  created() {
    console.log(this.$refs)
    const items = {}
    const tabs = {}
    const layouts = {}
    let curTab = 'default'
    let curLayout = 'default'
    this.formColumns.map((item) => {
      if (!item.hidden || item.type !== 'formbutton') {
        items[item.name] = item.default || ''
      }
      if (item.type === 'formbutton') {
        if (item.buttons && item.buttons.save) {
          item.buttons.save.events.click = this.onSubmit
        }
      }
      if (item.layout) {
        curLayout = item.layout
      } else {
        curLayout = 'default'
      }
      if (item.tab) {
        curTab = item.tab
      } else {
        curTab = 'default'
      }
      if (!tabs[curLayout]) {
        tabs[curLayout] = {}
      }
      if (!tabs[curLayout][curTab]) {
        tabs[curLayout][curTab] = []
      }
      tabs[curLayout][curTab].push(item)
      return item
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
 .layout-form {
   display: flex;
   flex-wrap: wrap;
 }
.layout-form-item {
    width: 50%
  }
</style>

