<template>
<div class='table-layout'>
    <div class='table-layout-inner'>
        <my-form
            class='profile-form'
            ref='profileForm'
            @do-form='saveData'
            :form-rules='formRules'
            :default-files='logo'
            :pform-model='formModel'
            :pform-columns='formColumns'></my-form>
        </div>
    </div>    
</template>

<script>
import MyForm from '../common/components/myform'
import { mapGetters } from 'vuex'
import { saveUserInfo } from '@/api/login'
import { getImageUrl } from '@/utils'
export default {
  components: { MyForm },
  data() {
    return {
      data: [],
      logo: [],
      formColumns: [
        { name: 'name', label: '用户名', props: { disabled: true }},
        {
          name: 'logo',
          label: '上传头像',
          type: 'upload',
          props: {
            action: '/api/upload',
            limit: 1,
            name: 'logo',
            data: {
              field: 'logo'
            }
          }

        }
      ],
      formRules: {

      },
      formModel: {}
    }
  },
  methods: {
    saveData(data) {
      saveUserInfo(data)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$store.commit('SET_AVATAR',data.logo)
        })
        .catch((res) => {
        })
    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  created() {
    let logo
    if(this.avatar) {
      logo = [
      {
        name: this.name,
        url: getImageUrl(this.avatar)
      }
    ]
    } else {
      logo = []
    }
    this.logo = logo
    this.formModel = {
      name: this.name,
      logo: this.avatar
    }
    // this.$nextTick(() => {
    //   console.log(this.$refs)
    //   this.$refs.profileForm.setFormModel({
    //     name: this.name
    //   })
    // })
  }
}
</script>

<style lang='scss' scoped>
.table-layout-inner{
    background-color: #fff;
    padding: 20px 0;
}
.table-layout-inner /deep/ .profile-form .el-input {
    width: 30%;
}
</style>
