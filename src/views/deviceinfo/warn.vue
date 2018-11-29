<template>
  <div>
    <table-list
      :custom-columns="columns"
      :form-columns="searchColumns"
      :table-data="data"
      :table-props="formProps"
      :table-on-events="tableEvents"
      :total="total"
      :search-data="search"
      @list-data="getList"
      :hide-action="true"
      :is-export="false"
      :show-expand="false"
    >
      <template slot="add_search_button">
        <el-button type="primary" icon="el-icon-circle-check-outline" @click="handleSave">保存</el-button>
      </template>

      <template slot-scope="{ data }" slot="area">{{ data.area ? data.area.AreaName: '' }}</template>

      <template slot-scope="{ data }" slot="sms">
        <el-checkbox v-model="data.sms" @change="selectCheckbox(data, $event, 'sms')"></el-checkbox>
      </template>

      <template slot-scope="{ data }" slot="email">
        <el-checkbox v-model="data.email" @change="selectCheckbox(data, $event, 'email')"></el-checkbox>
      </template>

      <template slot-scope="{ data }" slot="audio">
        <el-checkbox v-model="data.audio" @change="selectCheckbox(data, $event, 'audio')"></el-checkbox>
      </template>
    </table-list>
  </div>
</template>

<script>
import tableList from '../common/components/tableList'
import { fetchList } from '@/api/deviceinfo'
import { saveWarnSetting } from '@/api/warnuser'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList },
  props: {
    uid: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      data: [],
      sms: false,
      email: false,
      audio: false,
      fields: {
        sms: 1,
        email: 2,
        audio: 4
      },
      formColumns: [],
      searchColumns: [
        { name: 'pdi_code', label: '设备编号', props: { clearable: true }}
      ],

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
        area: {
          label: '区域名称',
          columnKey: 'area',
          filters: []
        },
        sms: {
          label: '短信',
          columnKey: 'sms',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        email: {
          label: '邮箱',
          columnKey: 'email',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        audio: {
          label: '语音',
          columnKey: 'audio',
          renderHeader: (h, { column }) => {
            return this.render(h, column)
          }
        },
        action: {
          'min-width': '150',
          label: '操作'
        }
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      tableEvents: {
        'filter-change': this.filterArea
      },
      areaName: null,
      saveData: []
    }
  },
  watch: {
    areaName(newVal) {
      console.log(newVal, 'watch newVal.....')
    },
    saveData: {
      handler(newVal) {
        console.log(newVal, 'watch save data.....')
      }
    }
  },
  methods: {
    filterArea(c) {
      this.search = Object.assign({}, this.search, c)
      this.getList()
    },
    getList(query) {
      this.reset()
      fetchList(query || this.search)
        .then(res => {
          this.data = this.formatData(res.data.data.data)
          this.total = res.data.data.total
          if (!this.areaName) {
            this.areaName = res.data.areaName
            const columns = this.columns
            columns.area.filters = this.areaName
            this.columns = columns
          }
        })
        .catch(res => {})
    },
    formatColumn(field) {
      this.data = this.data.map(item => {
        item[field] = this[field]
        return item
      })
    },
    selectCheckbox(data, bVal, field) {
      const index = this.data.indexOf(data)
      const curData = [...this.data]
      curData[index][field] = bVal
      this.data = curData
      const selectedLength = this.data.filter(item => item[field] > 0)

      this[field] = this.data.length === selectedLength.length
    },
    handleSave() {
      const data = this.data.map(item => {
        const { pdi_index, sms = false, email = false, audio = false } = item
        return { pdi_index, type: { sms, email, audio }}
      })
      this.$confirm('是否保存告警设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          saveWarnSetting({ data, uid: this.uid }).then(res => {
            openMessage(res)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        })
    },
    reset() {
      for (const field in this.fields) {
        this[field] = false
      }
      this.data = []
    },
    render(h, column) {
      const field = column.property
      const vm = this
      return h(
        'el-checkbox',
        {
          props: {
            value: vm[field]
          },
          on: {
            change: function(bVal, ev) {
              vm.$emit('change', bVal)
              vm[field] = bVal
              vm.formatColumn(field)
            }
          }
        },
        column.label
      )
    },
    formatData(data) {
      if (data.length === 0) return []
      const fieldLen = {}
      data = data.map(item => {
        const val = +item.Wn_notifytype
        for (const field in this.fields) {
          fieldLen[field] = fieldLen[field] || 0
          const isBool = (val & this.fields[field]) > 0
          item[field] = isBool
          if (isBool) fieldLen[field] += 1
        }
        return item
      })
      const total = data.length
      for (const field in this.fields) {
        this[field] = fieldLen[field] === total
      }
      console.log(this.sms, this.email, this.audio, 'formating ....')
      return data
    }
  },
  created() {
    this.search = Object.assign({}, this.search, this.$route.params, {
      uid: this.uid
    })
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

