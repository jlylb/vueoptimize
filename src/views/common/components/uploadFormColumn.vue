<template>
  <div>
    <el-upload
      :list-type="listType"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :headers="headers"
      v-bind="uploadProps"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt v-if="uploadProps.listType!='text'">
      <div v-if="uploadProps.listType=='text'">
        <p v-for="item in fileList" :key="item.name">
          <el-tag type="success">
            <a :href="item.url">点击下载{{ item.name }}</a>
          </el-tag>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  props: {
    uploadProps: {
      type: Object,
      default() {
        return {};
      }
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    listType: {
      type: String,
      default: "picture-card"
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      headers: {
        Authorization: "Bearer " + getToken()
      }
    };
  },
  // inject: ['pics'],
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.$emit("remove-success", file, this.uploadProps);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(file, fileList) {
      console.log(file, fileList);
      this.$emit("upload-success", file, this.uploadProps);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`已超出上传的文件个数`);
    },
    handleError(err, file, fileList) {
      console.log(err);
    },
    handleBeforeUpload(file) {
      // console.log(this)
      // return false
    }
  },
  created() {}
};
</script>