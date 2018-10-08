<template>

<div>

<div v-if='formColumns.length > 0' class="search-form-layout">
    <search-form :form-columns='formColumns' @search-form='handleFilter' @search-export='handleExport' :pform-model='search' :is-export='isExport'>
        <template slot='add_button'>
            <slot name='add_search_button'></slot>
        </template>
    </search-form>
</div>

<div v-if='data.length > 0'>
  <el-table
    :data='data' 
    stripe
    style="width: 100%"
    v-bind="tableProps">
    <el-table-column
      type="selection"
      width="55"
      v-if='showSelection'>
    </el-table-column>
    <el-table-column type="expand" v-if='showExpand'>
      <template slot-scope="scope">
        <el-form label-position="left" inline >
          <el-form-item v-for='item in columns' :key='item.prop' v-bind="item" v-if='item.prop!="action"'>
             <slot :name='"expand-"+item.prop' :data='scope.row' >
                <!-- <span> {{ scope.row[item.prop] }}</span> -->
                {{ showValue(scope.row, item.prop) }}
             </slot>
          </el-form-item>
        </el-form>
    </template>
  </el-table-column>
    <el-table-column v-for='item in showColumns' :key='item.prop' v-bind="item" >
        <template slot-scope="scope">
            <slot :name='item.prop' :data='scope.row' v-if='item.prop!="action"'>
                <!-- {{ scope.row[item.prop] }}  -->
                {{ showValue(scope.row, item.prop) }} 
            </slot>
            <slot :name='item.prop' :data='scope.row' :$index='scope.$index' v-if='item.prop=="action"'>
                <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </slot>
            <slot name='actionExtra' :data='scope.row' v-if='item.prop=="action"'>
            </slot>
      </template>
    </el-table-column>
  </el-table>
</div>


  <div class='page-container' v-if='data.length > 0'>
    <el-pagination 
    background 
    @size-change="handleSizeChange" 
    @current-change="handleCurrentChange" 
    :current-page="search.page" 
    :page-sizes="pageSizes" 
    :page-size="search.pageSize" 
    layout="total, sizes, prev, pager, next, jumper" 
    :total="total">
    </el-pagination>
   </div>

</div>  
</template>

<script>
import lists from '../mixins/lists'
import SearchForm from './searchForm'
export default {
  mixins: [lists],
  components: { SearchForm },
  props: {
    customColumns: {
      type: Object,
      default() {
        return {}
      }
    },
    labels: {
      type: Object,
      default() {
        return {}
      }
    },
    tableProps: {
      type: Object,
      default() {
        return {}
      }
    },
    formColumns: {
      type: Array,
      default() {
        return []
      }
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default() {
        return 0
      }
    },
    columnLength: {
      type: Number,
      default() {
        return 8
      }
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    searchData: {
      type: Object,
      default() {
        return {
          page: 1,
          pageSize: 10
        }
      }
    },
    hideAction: {
      type: Boolean,
      default: false
    },
    showExpand: {
      type: Boolean,
      default: true
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    isExport: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    tableData(newval) {
      console.log(newval, 'table list ....')
      this.data = newval
      this.setColumns()
    },
    searchData(newval) {
      this.search = newval
      console.log(this.search, 'muted search')
    }
  }
}
</script>
<style lang="scss">
.page-container {
  margin: 15px 0 0 0;
  background-color: #fff;
  padding: 10px;
}
.not-found {
  display: inline-block;
  font-size: 24px;
  & i {
    color: #e6a23c;
    margin-right: 10px;
  }
}
</style>