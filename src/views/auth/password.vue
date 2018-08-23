<template>
<div class='table-layout'>
    <div class='table-layout-inner'>
        <my-form
            class='profile-form'
            ref='profileForm'
            @do-form='saveData'
            :form-rules='formRules'
            :form-props='formProps'
            :pform-columns='formColumns'></my-form>
        </div>
    </div>    
</template>

<script>

import MyForm from '../common/components/myform'
import { modifyPassword } from '@/api/login'
import { mapGetters } from 'vuex'
import openMessage from '@/utils/message.js'

export default {
  components: { MyForm },
  data() {
    return {
      data: [],
      formColumns: [
        {
          name: 'password',
          label: '原密码',
          type: 'input',
          inputType: 'password'
        },
        {
          name: 'new_password',
          label: '新密码',
          type: 'input',
          inputType: 'password'
        },
        {
          name: 'new_password_confirmation',
          label: '确认新密码',
          type: 'input',
          inputType: 'password'
        }
      ],
      formRules: {
      },
      formProps: {
        validateOnRuleChange: false
      }
    }
  },
  methods: {
    saveData(data) {
      modifyPassword(data)
      .then((res) => {
          openMessage(res).then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
                this.$router.push({path:'/login'})
              })
          })
      })
      .catch((res) => {
      })
    }
  },
  computed: {

  },
  created() {

  },

  mounted() {
    console.log(this.$refs.profileForm)
      const form = this.$refs.profileForm
      const model = form.getFormModel()
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (model.new_password !== '') {
            form.validateField('new_password_confirmation')
          }
          callback();
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认新密码'));
        } else if (value !== model.new_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }

      this.formRules =  {
        password: [
          { required: true, message: '请输入密码', trigger: ['blur','change'] }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        new_password_confirmation: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
  },
  beforeCreate() {
    this.$nextTick(() => {
      
    })
  }
}
</script>

<style lang='scss'>
.table-layout-inner{
    background-color: #fff;
    padding: 20px 0;
}
.table-layout-inner .profile-form .el-input {
    width: 30%;
}
</style>
