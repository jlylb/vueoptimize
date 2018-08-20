<template>
    <div class='table-layout'>
      <my-form
          class="my-form"
          ref='dialogForm'
          @do-form='saveData'
          :form-rules='formRules'
          :default-files='logo'
          :tab-label='tabLabel'
          :pform-model='userFormModel'
          :pform-columns='formColumns'>
            <template slot='group-seo' slot-scope="{pics, formModel, column}">
              <my-formitem
                :default-files='pics' 
                :pform-model='formModel'
                :pform-columns='column'>
              </my-formitem>
            </template>
      </my-form>
    </div>
</template>

<script>
import MyForm from '../common/components/layoutform'
import { createCategory,  updateCategory, fetchEdit, fetchCategory } from '@/api/category'
import openMessage from '@/utils/message.js'
import MyFormitem from '../common/components/myformitem'

export default {
  components: { MyForm, MyFormitem },
  data() {
    return {
      logo: [],
      data: [],
      formColumns: [

        { name: 'name', label: '分类', tab: 'content' },
        { name: 'name_en', label: '分类英文', tab: 'content' },
        {
          name: 'parent_id',
          label: '父分类',
          type: 'cascader',
          ref: 'cascader1',

          props: {
            class: 'cascader-category_id',
            changeOnSelect: true
          },
          data: [

          ],
          default: [0],
          tab: 'content'
        },

        {
          name: 'action',
          type: 'formbutton',
          tab: 'content',
          buttons: {
            save: {
              label: '保存',
              events: {
                click: function() {
                  alert(1111)
                }
              }
            },
            reset: {
              label: '重置',
              events: {

              }
            }
          }
        }
      ],

      formRules: {
        name: [
          { required: true, message: '请输入分类', trigger: 'blur' }
        ],
        parent_id: [
          { required: true, message: '父分类不能为空', trigger: 'blur' }
        ],
        name_en: [
          { required: true, message: '请输入分类英文', trigger: 'blur' }
        ]
      },
      userFormModel: {},
      // isAdd: true,
      tabactive: '',
      tabLabel: {
        content: '内容',
      }
    }
  },
  props: {
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleAdd() {
      this.logo = []
      this.$nextTick(() => {
        this.userFormModel = {
          parent_id: [0]
        }
      })
    },

    handleEdit(data) {
      this.$nextTick(() => {
        console.log(data.path)
        if (data.path) {
          const pid = data.path.split('-')
          pid.pop()
          data.parent_id = pid.map((item) => +item)
        } else {
          data.parent_id = [0]
        }

        this.$refs.dialogForm.setFormModel(data)
      })
    },
    getList(query) {
      this.$router.go(-1)
    },
    saveData(data) {
      const method = this.isAdd !== true ? updateCategory : createCategory
      method(data).then((res) => {
        console.log(res)
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((res) => {
        console.log(res)
      })
    }

  },
  created() {
    const method = this.isAdd !== true ? fetchEdit : fetchCategory
    let id = this.$route.params? this.$route.params.id : null
    method(id).then((res) => {
      console.log(res)
      const cascader = [{ label: '根目录', value: 0 }]
      const columns = this.formColumns
      columns.map((item) => {
        if (item.name == 'parent_id') {
          cascader[0].children = res.data.data.parent_id
          item.data = cascader
          return item
        }
      })
      this.formColumns = columns
    })
    console.log(this.$route.params, 5666677, this.isAdd)
    if (this.isAdd) {
      this.handleAdd()
    } else {
      this.handleEdit(this.$route.params)
    }
    // this.$nextTick(() => {
    //   this.userFormModel = {
    //     category_id: [0]
    //   }
    // })
    // this.$nextTick(() => {
    //   this.$refs.dialogForm.clearValidate()
    // })
  }
}
</script>
<style lang="scss">
   .table-layout .my-form .el-input{
        width: 50%;
    }
    .cascader-category_id {
      width: 100%;
    }
    .my-form /deep/ .layout-form-bottom {
      width: 100%;
    }
    .my-form /deep/ .layout-form-default {
      width: 70%;
    }
    .my-form /deep/ .layout-form-seo {
      width: 30%;
    }
</style>

