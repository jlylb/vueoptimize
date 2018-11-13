<template>
    <el-form :inline="true" :model="formModel" class="search-form">
        <el-form-item :label="myitem.label || myitem.name" v-for='myitem in formColumns' :key='myitem.name'>

            <el-input v-model="formModel[myitem.name]" v-if='!myitem.type || myitem.type=="input"' v-bind='myitem.props||{}'></el-input>

            <el-select v-model="formModel[myitem.name]" v-if='myitem.type=="select"' v-on="myitem.events||{}"  v-bind='myitem.props||{}'>
                <el-option
                v-for="item in myitem.data"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <slot :name='myitem.name' :data='item'></slot>
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
          <template v-if='isSearch'>
            <el-button type="primary" @click="onSubmit" :icon='searchIcon'>{{ searchLabel }}</el-button>
          </template>  
            <template v-if='isExport'>
              <el-button 
              type="primary" 
              icon="el-icon-download" 
              @click="handleDownload">{{$t('table.export')}}</el-button>
            </template>
        </el-form-item>
        <slot name='add_button'></slot>
    </el-form>
</template>
<script>
export default {
  data() {
    return {
      formModel: this.pformModel
    }
  },
  props: {
    formColumns: {
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
    isExport: {
      type: Boolean,
      default: true
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    searchLabel: {
      type: String,
      default: '查询'
    },
    searchIcon: {
      type: String,
      default: 'el-icon-search'
    },
  },
  watch: {
    pformModel(newval) {
      console.log(newval, 55555)
      this.formModel = newval
    }
  },
  methods: {
    onSubmit() {
      this.$emit('search-form', this.formModel)
    },
    handleDownload() {
      this.$emit('search-export')
    }
  },
  created() {
    const items = {}
    this.formColumns.forEach((item) => {
      items[item.name] = ''
    })
    this.formModel = Object.assign({}, items, this.formModel)
  }
}
</script>

