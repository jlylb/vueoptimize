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
        <template slot-scope="{ data }" slot='company'>
             {{ data.company && data.company.name ||'' }}
        </template>
          <template slot-scope="{ data }" slot='avatar'>
            <img :src="getImageUrl(data.avatar)" v-if='data.avatar' :style='{width: "100px", height: "100px"}'/>
        </template>
        <template slot='actionExtra' slot-scope="{ data }">
                <el-button
                size="mini"
                type="success"
                @click="handleRole(data)">授权</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="addDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :pform-model='userFormModel'
                :pform-columns='formColumns'></my-form>
        </el-dialog>
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createPost, updatePost, deletePost } from '@/api/post'
import { fetchCategory } from '@/api/category'
import axios from 'axios'
import { getImageUrl } from '@/utils'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      formColumns: [
        { name: 'title', label: '标题' },
        { name: 'author', label: '作者' },
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
          default: []
        },
        { name: 'content', label: '内容', inputType: 'textarea', type: 'input' },
        {
          name: 'first_img',
          label: '封面图',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'logo',
            data: {
              field: 'logo'
            }
          }
        },
        { name: 'comment_status', label: '是否允许评论', type: 'switch' },
        { name: 'seo_title', label: 'seo标题' },
        { name: 'seo_keyword', label: 'seo关键字' },
        { name: 'seo_desc', label: 'seo描述' }
      ],
      searchColumns: [
        { name: 'title', label: '标题', props: { clearable: true }},
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
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

      columns: {
        id: {
          label: '编号'
        },
        title: {
          label: '标题'
        },
        category_name: {
          label: '分类'
        },
        author: {
          label: '作者'
        },
        content: {
          hidden: true
        },
        first_img: {
          hidden: true
        },
        comment_status: {
          label: '是否允许评论'
        },
        seo_title: {
          label: 'seo标题'
        },
        seo_keyword: {
          label: 'seo关键字'
        },
        seo_desc: {
          label: 'seo描述'
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
      isAdd: true
    }
  },
  methods: {
    getImageUrl,
    handleAdd(data) {
      this.addDialog = true
      this.dialogTitle = '添加'
      this.isAdd = true
      this.logo = []
      this.userFormModel = {}
    },
    handleDelete(data) {
      deletePost(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      this.editDialog = true
      this.dialogTitle = '编辑'
      this.isAdd = false
      if (data.first_img) {
        this.logo = [
          { url: getImageUrl(data.first_img), name: 'first_img' }
        ]
      } else {
        this.logo = []
      }
      // this.editUserFormModel = data
      this.$nextTick(() => {
        const pid = data.path.split('-')
        data.category_id = pid.map((item) => +item)
        this.$refs.dialogForm.setFormModel(data)
      })
    },
    getList(query) {
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },
    saveData(data) {
      const method = this.isAdd !== true ? updatePost : createPost
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
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    }

  },
  created() {
    this.getList()
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
</style>

