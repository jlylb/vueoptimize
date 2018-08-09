<template>
        <el-dialog title="编辑" :visible.sync="isShowDialog">
            <my-form
                ref='dialogForm'
                :form-rules='formRules'
                :form-columns='formColumns'></my-form>
        </el-dialog>
</template>

<script>
import MyForm from './myform'
export default {
  components: { MyForm },
  data() {
    return {
      isShowDialog: false
    }
  },
  props: {
    formColumns: {
      type: Array,
      default() {
        return []
      }
    },
    formRules: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    open() {
      console.log(this.$refs['dialogForm'])
      this.$refs['dialogForm'].resetForm()
      this.isShowDialog = ture
    },
    hide() {
      this.isShowDialog = false
    }
  }
}
</script>

<style>

</style>

