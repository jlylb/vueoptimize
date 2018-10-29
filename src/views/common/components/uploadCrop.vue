<template>
  <div class="components-container">

    <pan-thumb :image="image" @click.native='imagecropperShow=true' :style='{cursor: "pointer"}' class='pan-click'>点击更换头像</pan-thumb>

    <!-- <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">Change avatar
    </el-button> -->

    <image-cropper 
    :width="200" 
    :height="200" 
    :url="url" 
    @close='close' 
    @crop-upload-success="cropSuccess"
    @crop-upload-fail='cropFail' 
    langType="zh" 
    :key="imagecropperKey" 
    v-show="imagecropperShow"
    :field='field'
    :params='params'
    v-bind="cropParams"></image-cropper>
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { getImageUrl } from '@/utils'

export default {
  name: 'avatarUpload-demo',
  components: { ImageCropper, PanThumb },
  props: {
    url: {
      type: String,
      default: '/upload'
    },
    defaultImg: {
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: 'logo'
    },
    params: {
      type: Object,
      default(){
        return { field: "logo" }
      }
    },
    cropParams: {
      type: Object,
      default(){
        return {

        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: this.defaultImg,
      data: {
        field: 'logo',
        params: { field: "logo" }
      }
    }
  },
  methods: {
    cropSuccess(resData) {
      console.log(resData, 'resData..........')
      const { status } = resData
      const { field, params} = this
      if(status===1){
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.image = getImageUrl(resData.data.location)
        this.$emit('upload-success', resData, field, params, this.cropParams)
      }else{
        this.$emit('upload-fail', resData, field, params, this.cropParams)
      }

    },
    cropFail(err, field, ki){
      console.log(err)
      this.$emit('upload-catch', err, field, ki)
    },
    close() {
      this.imagecropperShow = false
    }
  },

}
</script>

<style lang='scss' scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.pan-click {
  cursor: pointer;
  /deep/ .pan-info {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>