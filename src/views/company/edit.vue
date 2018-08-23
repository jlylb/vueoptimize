<template>
    <div class='table-layout'>
        <div class='table-layout-inner'>
            <my-form
                class="company-form"
                ref='dialogForm'
                @do-form='saveData'
                :form-rules='formRules'
                :default-files='logo'
                :pform-model='formModel'
                :pform-columns='formColumns'>
            </my-form>
        </div>
    </div> 
</template>

<script>

import MyForm from '../common/components/myform'
import { updateCompany } from '@/api/company'
import { getImageUrl } from '@/utils'
import { mapGetters } from 'vuex'
import openMessage from '@/utils/message.js'

export default {
  components: {  MyForm },
  data() {
    return {
      logo: [],
      formColumns: [
        { name: 'Co_Name', label: '公司名' },
        {
          name: 'logo',
          label: '上传LOGO',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'Co_Logo',
            data: {
              field: 'Co_Logo'
            }
          },
          default: []
        },
        { name: 'Co_ConnectionsNumber', label: '联系电话', hidden: true },

      ],
      formRules: {
        Co_Name: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ]
      },

      formModel: {

      }
    }
  },
  computed: {
    ...mapGetters([
      'company'
    ]),
  },
  methods: {
    getImageUrl,
    handleEdit(data) {
      if(data.Co_Logo){
        this.logo = [
          { url: getImageUrl(data.Co_Logo), name: 'logo' }
        ]
      }else{
        this.logo = []
      }
      this.$nextTick(() => {
        this.$refs.dialogForm.setFormModel(data)

      })
    },

    saveData(data) {
      const method = updateCompany
      method(data)
        .then((res) => {
            openMessage(res).then(() => {
                this.$store.commit('SET_COMPANY', data)
                this.$store.commit('SET_COMPANY_LOGO', data.Co_Logo)
                this.$store.commit('SET_COMPANY_NAME', data.Co_Name)
            })
         
        })
        .catch((res) => {
        })
    }
  },
  created() {
      this.handleEdit(this.company)
  }
}
</script>
<style lang="scss" scoped>
    .table-layout-inner{
        background-color: #fff;
        padding: 20px 0;
    }
    .table-layout-inner /deep/ .company-form .el-input {
        width: 30%;
    }
</style>
