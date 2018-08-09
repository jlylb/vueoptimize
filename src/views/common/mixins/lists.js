export default {
  data() {
    return {
      search: this.searchData,
      columns: [],
      data: []
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
      }).then(() => {
        this.$emit('list-delete', row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    setColumns() {
      this.columns = []
      if (this.data.length === 0) {
        return
      }
      if (Object.keys(this.customColumns).length === 0) {
        const firstData = this.data[0]
        firstData.action = ''
        let extract
        for (const item in firstData) {
          if (this.customColumns[item]) {
            extract = this.customColumns[item]
          } else {
            extract = {}
          }
          if (extract.hidden !== true) {
            this.columns.push(
              Object.assign(
                { prop: item, label: item },
                extract
              )
            )
          }
        }
      } else {
        for (const item in this.customColumns) {
          if (this.customColumns[item].hidden !== true) {
            this.columns.push(
              Object.assign(
                { prop: item }, this.customColumns[item]
              )
            )
          }
        }
      }

      console.log(this.columns)
    },
    handleExport(columns) {
      console.log(columns)
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = columns
        const filterVal = columns
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  },
  created() {

  }
}
