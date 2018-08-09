<template>
    <el-form :inline="true" :model="formModel" class="search-form">
        <el-form-item :label="myitem.label || myitem.name" v-for='myitem in formColumns' :key='myitem.name'>

            <el-input v-model="formModel[myitem.name]" v-if='!myitem.type || myitem.type=="input"' v-bind='myitem.props||{}'></el-input>

            <el-select v-model="formModel[myitem.name]" v-if='myitem.type=="select"'  v-bind='myitem.props||{}'>
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

        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" icon='el-icon-search'>查询</el-button>
            <el-button 
            type="primary" 
            icon="el-icon-download" 
            @click="handleDownload">{{$t('table.export')}}</el-button>
        </el-form-item>
        <slot name='add_button'></slot>
    </el-form>
</template>
<script>
export default {
  data() {
    return {
      formModel: {}
    }
  },
  props: {
    formColumns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit('search-form', this.formModel)
    },
    handleDownload() {
      this.$emit('search-export', Object.keys(this.formModel))
    }
  },
  created() {
    const items = {}
    this.formColumns.forEach((item) => {
      items[item.name] = ''
    })
    this.formModel = items
  }
}
</script>

