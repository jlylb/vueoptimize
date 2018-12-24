<template>
    <div class='table-layout'>
        <table-list
        :custom-columns='columns'
        :form-columns='searchColumns'
        :table-data='data'
        :total='total'
        :search-data='search'
        @list-data='getList'
        @list-edit='handleEdit'
        @list-delete='handleDelete'>
        <template  slot='add_search_button'>
            <el-button
            type="primary"
            icon='el-icon-circle-plus-outline'
            @click="handleAdd">添加</el-button>
        </template>
        <template slot-scope="{ data }" slot='status'>
            <el-tag> {{ data.status }} </el-tag>
        </template>

        </table-list>
        <el-dialog 
        :title="dialogTitle" 
        :visible.sync="addDialog" 
        @close='dialogClose'
        @open='dialogOpen' 
        :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :tab-label='tabLabel'
                :tabactive='tabactive'
                :is-custom-button="true"
                :pform-model='userFormModel'
                :pform-columns='formColumns'>
            </my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/tabform'
import { fetchList, createComment, updateComment, deleteComment } from '@/api/comment'

import { getImageUrl } from '@/utils'
import openMessage from '@/utils/message.js'
import MyFormitem from '../common/components/myformitem'

export default {
  components: { tableList, MyForm, MyFormitem },
  data() {
    return {
      data: [],
      logo: [],
      carouselsId: null,
      formColumns: [

        { name: 'content', label: '内容', inputType: 'textarea',  tab: 'content' },

         { name: 'status', label: '状态', type: 'switch', tab: 'content' },
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

        },
      ],
      searchColumns: [
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],
      formRules: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
      },

      columns: {
        id: {
          label: '编号'
        },
        user_id: {
          label: '用户'
        },
        commentable_id: {
          label: '评论对像编号'
        },

        commentable_type: {
          label: '评论对像'
        },
        status: {
          label: '状态'
        },
        created_at: {
          label: '创建时间'
        },
        updated_at: {
          label: '更新时间'
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
      addDialog: false,
      userFormModel: {},
      dialogTitle: '',
      isAdd: true,
      tabactive: '',
      tabLabel: {
        content: { label: '内容' },
      }
    }
  },
  methods: {
    getImageUrl,
    handleAdd(data) {
      this.addDialog = true
      this.dialogTitle = '添加'
      this.isAdd = true
      this.tabactive = 'content'
      this.logo = []
      // this.tabactive = 'content'
      this.$nextTick(() => {
        this.userFormModel = {
          commentable_id: this.$route.params.postid
        }
      })
      // this.$router.push({ name: 'api.post.layoutadd' })
    },
    handleDelete(data) {
      deleteComment(data).then((res) => {
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
    //   this.tabactive = 'content'
      if(data.path){
        this.logo = [
          { url: getImageUrl(data.path), name: 'path' }
        ]
      }else{
        this.logo = []
      }
    //  // this.editUserFormModel = data
      this.$nextTick(() => {
        this.$refs.dialogForm.setFormModel(data)
      })
     // this.$router.push({ name: 'api.post.layoutedit', params: { ...data }})
    },
    getList(query) {
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }).catch((res) => {

      })
    },
    saveData(data) {
      console.log(data, 'saving...........')
      const method = this.isAdd === true ? createComment : updateComment
      method(data).then((res) => {
        console.log(res)
        openMessage(res).then(() => {
          this.addDialog = false
          this.getList()
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    dialogOpen(val) {
// const columns = this.formColumns
// this.formColumns = columns
      this.$nextTick(() => {
        
        this.$refs.dialogForm.clearValidate()
      })
    },
    dialogClose() {
      this.tabactive = ''
    }

  },
  created() {

    const { cid = null } = this.$route.params
    this.carouselsId = cid
    this.search = Object.assign({}, this.search, { cid })
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
   .my-form  /deep/ {
     .layout-form-item{
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
   }

</style>