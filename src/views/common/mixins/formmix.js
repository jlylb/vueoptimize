export default {
    data() {
      return {
        formModel: this.pformModel,
        formColumns: this.pformColumns,
        rules: this.formRules,
        pics: this.defaultFiles,
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
      formProps: {
        type: Object,
        default() {
          return {}
        }
      },
      formRules: {
        type: Object,
        default() {
          return {}
        }
      },
      formName: {
        type: String,
        default() {
          return 'from1'
        }
      },
      defaultFiles: {
        type: Array,
        default() {
          return []
        }
      },
      tabLabel: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    watch: {
      formRules(newVal) {
        this.rules = newVal
        this.$nextTick(()=>{
          this.$refs[this.formName].fields.forEach((item)=>{
            console.log(item.getRules())
            const rules = item.getRules()
            if (rules.length || item.required !== undefined) {
              item.$on('el.form.blur', item.onFieldBlur)
              item.$on('el.form.change', item.onFieldChange)
            }
          })
        })
  
      },
      pformModel(newVal) {
        console.log(newVal,7777777777)
        this.formModel = newVal
      },
      pformColumns(newVal) {
        this.formColumns = newVal
      },
      defaultFiles(newVal) {
        this.pics = newVal
      }
    },
    methods: {
      onSubmit() {
        this.$refs[this.formName].validate((valid) => {
          if (valid) {
            this.$emit('do-form', this.formModel)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm() {
        this.$refs[this.formName].resetFields()
      },
      clearValidate() {
        this.$refs[this.formName].clearValidate()
      },
      validateField(field) {
        this.$refs[this.formName].validateField(field)
      },
      uploadSuccess(file, props) {
        const fieldName = props.name || 'file'
        this.formModel[fieldName] = file.data.location
      },
      removeSuccess(file, props) {
        const fieldName = props.name || 'file'
        this.formModel[fieldName] = ''
        this.pics = []
      },
      setFormModel(data) {
        this.formModel = Object.assign({},this.formModel, data)
      },
      getFormModel() {
        return this.formModel
      },
      getForm() {
        return this.$refs[this.formName]
      },
      setFormRules() {
  
      },
      handleNodeClick(data) {
        console.log(data)
        this.formModel.pid = data.id
      }
    }
  }