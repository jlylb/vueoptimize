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
        <template  slot='Wn_notifytype' slot-scope='{ data }'>
            <el-tag v-for='(val, index) in data.Wn_notifytype' :key='index' :type='arr[val]["type"]'>{{ arr[val]['val'] }}</el-tag>
        </template>
        </table-list>
        <el-dialog :title="dialogTitle" :visible.sync="editDialog" @open='dialogOpen' :close-on-click-modal='false'>
            <my-form
                class="my-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :pform-model='userFormModel'
                :form-props='formProps'
                :pform-columns='formColumns'>

                </my-form>
        </el-dialog>
        
    </div>
</template>

<script>
import tableList from '../common/components/tableList'
import MyForm from '../common/components/myform'
import { fetchList, createItem, updateItem, deleteItem } from '@/api/warnnotify'
import { fetchList as fetchUser } from '@/api/warnuser'
import openMessage from '@/utils/message.js'

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: '',
      formColumns: [
        { name: 'pdi_index', label: '设备编号', isnumber: true },
        { 
          name: 'wu_name',
          label: '关联用户:',
          type: 'select',
          props: {
            filterable: true,
            remote: true,
            remoteMethod: this.remoteRoute,
            placeholder: '请输入用户',
            class: 'select-dropdown',
            clearable: true
          },
          events: {
              change: this.selectChange,
              clear: this.selectClear
          },
          data: [] },
        { name: 'Wn_notifytype', label: '告警方式', type: 'checkboxgroup', data: [
          {label: '短信', value: 1 },
          {label: '语音', value: 2 },
          {label: '邮箱', value: 4 },
        ], default: []},
        // { name: 'wn_smsdes0', label: '告警短信描述', inputType: 'textarea' },
        // { name: 'wn_smsdes1', label: '取消短信描述', inputType: 'textarea'},
        // { name: 'wn_emaildes0', label: '告警E-Maill描述',  inputType: 'textarea'},
        // { name: 'wn_emaildes1', label: '取消E-Maill描述',  inputType: 'textarea'},
        // { name: 'wn_teldes0', label: '语音播放文件' },
        // { name: 'wn_teldes1', label: '取消语音播放文件' },
 
      ],
      searchColumns: [
        { name: 'pdi_index', label: '设备编号', props: { clearable: true }},
      ],
      formRules: {
        pdi_index: [
          { type:'number', required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        wu_name: [
          {  required: true, message: '关联用户不能为空', trigger: ['blur'] }
        ],
        Wn_notifytype: [
          { type:'array', min: 1, required: true, message: '请选择至少一项告警方式', trigger: ['blur','change'] }
        ],
      },
      formProps: {
        labelWidth: '120px'
      },
      columns: {
        wn_index: {
          label: '索引'
        },
        pdi_index: {
          label: '设备编号'
        },
        wu_index: {
          label: '用户编号'
        },
        Wn_notifytype: {
          label: '告警方式'
        },
        wn_smsdes0: {
          label: '告警短信描述'
        },
        wn_smsdes1: {
          label: '取消短信描述'
        },
        wn_emaildes0: {
          label: '告警E-Maill描述'
        },
        wn_emaildes1: {
          label: '取消E-Maill描述'
        },
        wn_teldes0: {
          label: '语音播放文件'
        },
        wn_teldes1: {
          label: '取消语音播放文件'
        },

        action: {
          'min-width': '150',
          label: '操作'
        },
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      userFormModel: {
      },
      isAdd: true,
      arr: {
        1: {val:'短信', type: 'primary'},
        2: {val:'邮箱', type: 'success'},
        4: {val:'语音', type: 'warning'},
      }
    }
  },
  filters: {

  },
  methods: {
    selectChange(val) {
      this.userFormModel.wu_index = val
    },
    selectClear() {

    },
    remoteRoute(query) {
      fetchUser({ Wu_name: query }).then((res) => {
        const columns = this.formColumns
        columns.map((item) => {
          if (item.name == 'wu_name') {
            const data = res.data.data.data
            let item2 = []
            data.forEach((item1)=>{
              item2.push({ label: item1.Wu_name, value: item1.wu_index })
            })
            item.data = item2
          }
          return item
        })
        this.formColumns = columns
      }).catch((res) => {
        console.log(res)
      })
    },
    handleAdd(data) {
      this.editDialog = true
      this.isAdd = true
      this.dialogTitle = '添加'
      this.userFormModel = {
        Wn_notifytype: []
      }
    },
    handleDelete(data) {
      deleteItem(data).then((res) => {
        openMessage(res).then(() => {
          this.getList()
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    handleEdit(data) {
      console.log(data)
      this.isAdd = false
      this.editDialog = true
      this.dialogTitle = '编辑'
      if(data.user) {
        data.wu_name = data.user.Wu_name
        // data.wu_index = data.user.wu_index
      }

      this.$nextTick(() => {
        this.userFormModel = data
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
      const method = this.isAdd !== true ? updateItem : createItem
      data.isAdd = this.isAdd
      method(data).then((res) => {
        openMessage(res).then(() => {
          this.editDialog = false
          this.getList()
        })
      }).catch((res) => {
        console.log(res)
      })
    },
    dialogOpen(val) {
      const columns = this.formColumns
      columns.map((item) => {
        if (item.name == 'wu_name') {
          item.data = []
        }
        return item
      })
      this.formColumns = columns
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },

  },
  created() {
    this.getList()
  }
}
</script>
<style lang="scss">
</style>

