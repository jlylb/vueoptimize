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
            @click="handleAdd" v-ability='meta.edit||""'>添加</el-button>
        </template>
        <template slot-scope="{ data }" slot='status'>
            <el-tag> {{ data.status }} </el-tag>
        </template>
        <template slot-scope="{ data }" slot='actionExtra'>
              <el-button
                size="mini"
                type="success"
                @click="handleButton(data)">按钮权限</el-button>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="permission-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :pform-model='formModel'
                :pform-columns='formColumns'>
                  <template slot='meta' slot-scope='{ data, fmodel }'>
                      <el-input type="text" v-model="fmodel.meta.title" placeholder="请输入标题" class='meta' ></el-input>
                      <el-input type="text" v-model="fmodel.meta.icon" placeholder="请输入图标" class='meta'></el-input>
                  </template>
             <template slot='route_name' slot-scope='{ data, fmodel }'>
                <el-select 
                v-model="fmodel[data.name]" 
                v-if='data.type=="select"' 
                @change='selectChange($event,data.data)'
                @clear='selectClear' 
                v-bind='data.props||{}'>
                    <el-option
                    v-for="item in data.data"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </template>
                </my-form>
        </el-dialog>
        <button-form ref='buttonDialog'></button-form>

    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import ButtonForm from '../common/components/dialogButton'
import { fetchList, createMenu, updateMenu, deleteMenu, fetchAllMenu, fetchMenu } from '@/api/menu'
import { getPermissiones } from '@/api/permission'
import ability from '@/directive/ability/index.js'
import { mapGetters } from 'vuex'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm, ButtonForm },
  directives: { ability },
  computed: {
    ...mapGetters([
      'meta'
    ])
  },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'name', label: '菜单名' },
        { name: 'hidden', label: '隐藏菜单', type: 'checkbox', props: {
          trueLabel: 1, falseLabel: 0
        }},
        { name: 'always_show', label: '总是显示菜单', type: 'checkbox', props: {
          trueLabel: 1, falseLabel: 0
        }},
        {
          name: 'route_name',
          label: '路由名称',
          type: 'select',
          props: {
            filterable: true,
            remote: true,
            remoteMethod: this.remoteRoute,
            placeholder: '请输入路由名称',
            class: 'select-route_name',
            clearable: true,
            allowCreate: true
          },
          data: [

          ]
        },
        { name: 'route_path', label: '路由路径' },
        {
          name: 'component',
          label: '组件名称'
        },
        {
          name: 'redirect',
          label: '跳转路径'
        },
        {
          name: 'meta',
          label: '组件属性'
        },

        {
          name: 'pid',
          label: '父菜单',
          type: 'cascader',
          ref: 'cascader1',
          props: {
            class: 'cascader-pid',
            changeOnSelect: true
          },
          data: [

          ],
          default: []
        }

      ],
      searchColumns: [
        { name: 'route_name', label: '路由名称', props: { clearable: true }},
        {
          name: 'created_at',
          label: '创建时间',
          type: 'date'
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        route_name: [
          { required: true, message: '请输入路由名称', trigger: 'blur' }
        ],
        route_path: [
          { required: true, message: '请输入路由路径', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ]
      },
      columns: {
        id: {
          label: '编号'
        },
        name: {
          label: '菜单名称'
        },
        pid: {
          label: '上级菜单'
        },
        route_path: {
          label: '路由路径'
        },
        route_name: {
          label: '路由名称'
        },
        component: {
          label: '组件名称'
        },
        redirect: {
          label: '跳转路径'
        },
        meta: {
          label: '属性'
        },
        path: {
          hidden: true
        },
        hidden: {
          label: '隐藏菜单'
        },
        always_show: {
          label: '总是显示菜单'
        },
        buttons: {
          label: '按钮权限'
        },
        created_at: {
           label: '创建时间',
        },
        updated_at: {
           label: '更新时间'
        },
        action: {
          'min-width': '255',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      formModel: {},
      editId: 0
    }
  },
  methods: {
    handleDelete(data) {
      deleteMenu({ id: data.id }).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd() {
      this.editDialog = true
      this.dialogTitle = '添加'
      this.editId = 0
      this.$nextTick(() => {
      this.formModel = {
        pid: [0],
        meta: {
          title: '',
          icon: ''
        },
        component: 'layout/Layout'
      }
      })
    },
    handleEdit(data) {
      console.log(data, 'edit')
      this.editDialog = true
      this.dialogTitle = '编辑'
      this.editId = data.id
      this.$nextTick(() => {
        try {
          data.meta = data.meta && JSON.parse(data.meta) || this.formModel.meta
        } catch (e) {
          data.meta = data.meta
        }
        const pid = data.path.split('-')
        pid.pop()
        data.pid = pid.map((item) => +item)
        this.$refs.dialogForm.setFormModel(data)
      })
    },
    getList(query) {
      console.log(query)
      fetchList(query || this.search).then((res) => {
        this.data = res.data.data.data
        this.total = res.data.data.total
      }).catch((res) => {

      })
    },
    saveData(data) {
      const method = data.id ? updateMenu : createMenu
      method(data)
        .then((res) => {
          console.log(res, 'save data success')
          openMessage(res).then(() => {
            this.editDialog = false
            this.getList()
          })
        })
        .catch((res) => {
          console.log(res, 'save data error')
        })
    },
    dialogOpen(val) {
      const method = this.editId ? fetchMenu : fetchAllMenu
      method(this.editId).then((res) => {
        console.log(res)
        const cascader = [{ label: '根目录', value: 0 }]
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'pid') {
            cascader[0].children = res.data.data.pid
            item.data = cascader
            return item
          }
        })
        this.formColumns = columns
      })
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs.dialogForm.clearValidate()
      })
    },

    remoteRoute(query) {
      getPermissiones(query, {}).then((res) => {
        console.log(res)
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'route_name') {
            item.data = res.data.data
            return item
          }
        })
        this.formColumns = columns
      }).catch((res) => {
        console.log(res)
      })
    },
    selectChange(val, data) {
      const formModel = this.$refs.dialogForm.getFormModel()
      for (const key in data) {
        if (data[key].value == val) {
          this.$set(formModel, 'route_path', data[key].route_path)
          this.$set(formModel, 'route_name', val)
          this.formModel = formModel
          console.log(this.formModel)
          break
        }
      }
    },
    selectClear() {
      const formModel = this.$refs.dialogForm.getFormModel()
      this.$set(formModel, 'route_path', '')
      this.formModel = formModel
    },
    handleButton(data) {
      this.$refs.buttonDialog.open(true, data)
      console.log(data)
    }
  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss" >
   .table-layout .permission-form .el-input{
        width: 50%;
    }
    .meta {
      margin-bottom: 10px;  width: 30%;
    }
    .cascader-pid, .select-route_name {
      width: 100%;
    }
</style>

