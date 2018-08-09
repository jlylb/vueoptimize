<template>
        <el-dialog :title="title+'按钮权限设置'" :visible.sync="isShowDialog" @open='handleOpen'>
          <div class='button-top'>
          <el-button
              type="primary"
              @click="handleAdd">添加</el-button>
          <el-button
              type="success"
              @click="handleSave">保存</el-button>
          </div>
          <el-form  :model="formModel" class="button-form"  label-width="50px"  ref="buttonForm">
            <div class='button-form-item' v-for='(item,key) in formModel.button' :key='key'>
              <el-form-item label='名称'>
                <el-input v-model="formModel.button[key]['label']"  type='text'></el-input>
              </el-form-item>
              <el-form-item label='权限'>
                <el-input v-model="formModel.button[key]['value']"  type='text'></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" @click="handleDel(key)">删除</el-button>
              </el-form-item>
            </div>  
          </el-form>
        </el-dialog>
</template>

<script>
import { createButtons } from '@/api/menu'
export default {
  data() {
    return {
      isShowDialog: false,
      formModel: {
        button: [
          { label: '', value: '' }
        ]
      },
      id: null,
      title: null
    }
  },
  methods: {
    open(bool, data) {
      this.isShowDialog = bool
      this.id = data.id
      this.title = data.name
      if (data.buttons) {
        this.formModel.button = this.getFormatData(data)
      } else {
        this.formModel.button = [
          { label: '', value: '' }
        ]
      }
    },
    handleAdd() {
      this.formModel.button.push({
        label: '', value: ''
      })
    },
    handleDel(key) {
      console.log(key)
      this.formModel.button.splice(key, 1)
    },
    handleSave() {
      this.$refs.buttonForm.validate((valid) => {
        if (valid) {
          // this.$emit('do-button-form', this.formModel)
          createButtons(this.id, this.formModel).then((res) => {
            console.log(res)
            this.isShowDialog = false
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            const meta = this.formatModel(this.formModel.button)
            this.$store.commit('SET_META', meta)
            this.$parent.getList()
            console.log(this.$parent)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatModel(data) {
      const result = {}
      data.forEach((item) => {
        if (item.label && item.value) {
          result[item.label] = item.value
        }
      })
      return result
    },
    getFormatData(data) {
      let buttons = []
      try {
        if (data.buttons) {
          const result = JSON.parse(data.buttons)
          for (const k in result) {
            buttons.push({ label: k, value: result[k] })
          }
        } else {
          buttons = this.formModel.button
        }
      } catch (e) {
        buttons = this.formModel.button
      }
      return buttons
    },
    handleOpen() {}
  }
}
</script>

<style lang='scss' scoped>
  .button-form {
    .el-form-item{
      display: inline-block;
    }
    .el-input {
      width: auto
    }
  }
  .button-top {
    margin-bottom: 20px;
  }

</style>

