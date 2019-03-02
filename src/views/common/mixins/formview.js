import openMessage from '@/utils/message.js'

export default {
    data() {
        return {
          data: [],
          logo: [],
          total: 0,
          search: {
            page: 1,
            pageSize: 10
          },
          isAdd: true,
          dialogTitle: '',
          tabactive: '',
          refForm: 'dialogForm',
        }
    },
    methods: {
        getForm() {
          return this.$refs[this.refForm];
        },
        getFormMethod(verb) {
          const formMethod = this.$options.form;
          if(!formMethod) return;
          let fMethod = formMethod[verb] || null;
          return fMethod instanceof Promise ? fMethod : new Promise((resolve)=>{ resolve() })
        },
        handleAdd(data) {
          this.addDialog = true
          this.dialogTitle = '添加'
          this.isAdd = true
          this.logo = []
          this.tabactive = 'content'
          
        },
        handleDelete(data) {
          const deleteMethod = this.getFormMethod('delete')
          deleteMethod(data).then((res) => {
            openMessage(res).then(() => {
              this.getList()
            })
          }).catch((err) => {
            console.log(err)
          })
        },
        handleEdit(data) {
          this.addDialog = true
          this.dialogTitle = '编辑'
          this.isAdd = false
          this.tabactive = 'content'

          this.$nextTick(() => {
            this.getForm().setFormModel(data)
          })
        },
        getList(query) {
          const listMethod = this.getFormMethod('list')
          listMethod(query || this.search).then((res) => {
            this.data = res.data.data
            this.total = res.data.total
          })
        },
        saveData(data) {
          const method = this.isAdd !== true ? this.getFormMethod('update') : this.getFormMethod('create')
          method(data).then((res) => {
            console.log(res)
            openMessage(res).then(() => {
              this.addDialog = false
              this.getList()
            })
          })
        },
        dialogOpen(val) {
          this.$nextTick(() => {
            this.getForm().clearValidate()
          })
        },
        dialogClose() {
          this.tabactive = ''
        }
    
      },
      created() {
        this.getList()
      }
}