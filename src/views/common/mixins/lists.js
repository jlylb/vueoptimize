import { getDataValue } from '@/utils'
export default {
  data() {
    return {
      search: this.searchData,
      columns: [],
      data: [],
      showColumns: [],
      loadingText: '数据加载中....'
      // showlength: 8
    }
  },
  methods: {
    getList() {
      this.$emit('list-data', this.search)
    },
    handleFilter(query) {
      this.search.page = 1
      this.search = Object.assign(this.search, query)
      this.getList()
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.search.page = val
      this.getList()
    },
    handleEdit(row) {
      this.$emit('list-edit', { ...row })
    },
    handleView(row) {
      this.$emit('list-view', row)
    },
    handleDelete(row) {
      this.$confirm('删除记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('list-delete', row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    setColumns() {
      this.columns = []
      this.showColumns = []

      if (Object.keys(this.customColumns).length === 0) {
        const firstData = this.data[0] || {}
        const extract = {}
        let i = 1
        for (const item in firstData) {
          const column = Object.assign(
            { prop: item, label: item },
            extract,
            getDataValue(this.labels, [item], {})
          )
          this.columns.push(column)
          if (i <= this.columnLength) {
            this.showColumns.push(column)
          }
          i++
        }
        this.addAction()
      } else {
        let i = 1
        for (const item in this.customColumns) {
          if (this.customColumns[item].hidden !== true && item !== 'action') {
            const column = Object.assign(
              { prop: item },
              this.customColumns[item],
              getDataValue(this.labels, [item], {})
            )
            this.columns.push(column)
            if (i <= this.columnLength) {
              this.showColumns.push(column)
            }
            i++
          }
        }
        this.addAction()
      }

      console.log(this.columns)
    },
    addAction() {
      if (this.hideAction === true) {
        return
      }
      const action = Object.assign(
        { prop: 'action', label: 'action' },
        this.customColumns['action'] || {}
      )
      this.columns.push(action)
      this.showColumns.push(action)
    },
    handleExport() {
      if (this.data.length === 0) return
      // const columns = Object.keys(this.data[0])
      const tHeader = []
      const filterVal = []
      this.columns.map(v => {
        const { label, prop } = v
        tHeader.push(label)
        filterVal.push(prop)
      })
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = columns
        // const filterVal = columns
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: +new Date()
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return this.showValue(v, j)
        })
      )
    },
    showValue(row, prop) {
      const attrs = prop.split('.')
      let cur
      let curValue = row
      while ((cur = attrs.shift())) {
        curValue = curValue[cur]
        if (!curValue) {
          return ''
        }
      }
      return curValue
      // return scope.row[attrs[0]] ? scope.row[attrs[0]][attrs[1]] : ''
    }
  },
  created() {}
}
