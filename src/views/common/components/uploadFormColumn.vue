<template>
<div>
  <el-upload
  :list-type="'picture-card'"
  :on-preview="handlePictureCardPreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  :on-exceed="handleExceed"
  :on-error='handleError'
  :before-upload='handleBeforeUpload'
  :file-list="fileList"
  :headers='headers'
  v-bind="uploadProps">
  <i class="el-icon-plus"></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible" append-to-body>
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>
</div>  
</template>

<script>
import { getToken } from '@/utils/auth'
  export default {
    props: {
      uploadProps: {
        type: Object,
        default() {
          return {}
        }
      },
      fileList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      }
    },
    // inject: ['pics'],
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList)
        this.$emit('remove-success', file, this.uploadProps)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleSuccess(file, fileList) {
        console.log(file, fileList)
        this.$emit('upload-success', file, this.uploadProps)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`已超出上传的文件个数`)
      },
      handleError(err, file, fileList) {
        console.log(err)
      },
      handleBeforeUpload(file) {
        // console.log(this)
        // return false
      }
    },
    created() {

    }
  }
</script>