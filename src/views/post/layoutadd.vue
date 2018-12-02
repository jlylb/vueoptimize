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
import { createPost, updatePost } from '@/api/post'
import { fetchCategory } from '@/api/category'
import { getImageUrl } from '@/utils'
import openMessage from '@/utils/message.js'
import MyFormitem from '../common/components/myformitem'

export default {
  components: { MyForm, MyFormitem },
  data() {
    return {
      logo: [],
      data: [],
      formColumns: [

        { name: 'title', label: '标题', tab: 'content' },
        { name: 'author', label: '作者', tab: 'content' },
        {
          name: 'category_id',
          label: '分类',
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
        { name: 'content', label: '内容', type: 'richtext', tab: 'content' },

        { name: 'comment_status', label: '是否允许评论', type: 'switch', tab: 'content' },


        {
          name: 'action',
          type: 'formbutton',
          tab: 'action',
          layout: 'seo',
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

        },
        {
          name: 'first_img',
          label: '',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'first_img',
            data: {
              field: 'first_img'
            }
          },
          tab: 'first_img',
          layout: 'seo',
          formitem: {
            labelWidth: '0'
          }
        },
        { name: 'seo_title', label: 'seo标题', tab: 'seo', layout: 'addseo' },
        { name: 'seo_keyword', label: 'seo关键字', tab: 'seo', layout: 'addseo' },
        { name: 'seo_desc', label: 'seo描述', tab: 'seo', layout: 'addseo' },
      ],

      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '分类不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      userFormModel: {},
      // isAdd: true,
      tabactive: '',
      tabLabel: {
        action: { label: '发布' },
        content: { label: '内容' },
        seo: { label: 'seo优化', collapse: false },
        first_img: { label: '封面图' }
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
    getImageUrl,
    handleAdd() {
      this.logo = []
      this.$nextTick(() => {
        this.userFormModel = {
          category_id: [0]
        }
      })
    },

    handleEdit(data) {
      if (data.first_img) {
        this.logo = [
          { url: getImageUrl(data.first_img), name: 'first_img' }
        ]
      } else {
        this.logo = []
      }
      this.$nextTick(() => {
        console.log(data.path)
        if (data.path) {
          const pid = data.path.split('-')
          data.category_id = pid.map((item) => +item)
        } else {
          data.category_id = [0]
        }

        this.$refs.dialogForm.setFormModel(data)
      })
    },
    getList(query) {
      this.$router.go(-1)
    },
    saveData(data) {
      const method = this.isAdd !== true ? updatePost : createPost
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
    fetchCategory().then((res) => {
      console.log(res)
      const cascader = [{ label: '根目录', value: 0 }]
      const columns = this.formColumns
      columns.map((item) => {
        if (item.name == 'category_id') {
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
  .table-layout {
    overflow: hidden;
  }

   .table-layout .my-form .el-input{
        width: 50%;
    }
    .cascader-category_id {
      width: 100%;
    }
    .my-form /deep/ .layout-form {
      display: block;
      width: 100%;
    }
    .my-form /deep/ .form-box-first_img {
      text-align: center;
    }
    .my-form /deep/ .layout-form-bottom {
      width: 100%;
    }
    .my-form /deep/ .layout-form-default {
      width: 70%;
      float: left;
    }
    .my-form /deep/ .layout-form-addseo {
      width: 70%;
      float: left;
    }
    .my-form /deep/ .layout-form-seo {
      width: 30%;
      float: right;
    }
</style>

