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
import { updateCarousel,  createCarousel } from '@/api/carousel'
import openMessage from '@/utils/message.js'
import MyFormitem from '../common/components/myformitem'

export default {
  components: { MyForm, MyFormitem },
  data() {
    return {
      logo: [],
      data: [],
      formColumns: [

        { name: 'name', label: '幻灯片名称', tab: 'content' },
        { name: 'height', label: '幻灯片高度', tab: 'content' },
        { name: 'initial_index', label: '幻灯片的索引', default: 0, tab: 'content' },
        { name: 'autoplay', label: '是否自动切换', default: 1, tab: 'content', type: 'switch' },
        { name: 'interval', label: '自动切换间隔', tab: 'content' },
        { 
          name: 'type', 
          label: '幻灯片类型', 
          type: 'select', 
          data: [
            { label: '默认', value: 'none'},
            { label: '卡片', value: 'card'}            
          ],
          tab: 'content' },
        { 
          name: 'indicator_position', 
          label: '指示器的位置',
          type: 'select', 
          data: [
            { label: 'none', value: 'none'},
            { label: 'outside', value: 'outside'}            
          ], 
          tab: 'content' },
        { 
          name: 'trigger', 
          label: '触发方式',
          type: 'select', 
          data: [
            { label: 'hover', value: 'hover'},
            { label: 'click', value: 'click'},
          ],
          tab: 'content'
        },
        { 
          name: 'arrow', 
          label: '箭头显示时机',
          type: 'select', 
          data: [
            { label: 'hover', value: 'hover'},
            { label: 'always', value: 'always'},
            { label: 'never', value: 'never'},
          ], 
          tab: 'content' },
        { name: 'status', label: '状态', type: 'switch', default: 1, tab: 'content' },
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
          { required: true, message: '幻灯片名称', trigger: 'blur' }
        ]
      },
      userFormModel: {},
      // isAdd: true,
      tabactive: '',
      tabLabel: {
        content: { label: '内容' },
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
          initial_index: 0,
          autoplay: 1,
          status: 1,
          interval: 3000,
          trigger: 'hover',
          arrow: 'hover',
          indicator_position: 'none',
          type: 'none',
          height: 'auto'
        }
      })
    },

    handleEdit(data) {
      this.$nextTick(() => {
        this.$refs.dialogForm.setFormModel(data)
      })
    },
    getList(query) {
      this.$router.go(-1)
    },
    saveData(data) {
      const method = this.isAdd !== true ? updateCarousel : createCarousel
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
    if (this.isAdd) {
      this.handleAdd()
    } else {
      this.handleEdit(this.$route.params)
    }

  }
}
</script>
<style lang="scss" scoped>
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
      width: 100%;
    }
</style>

