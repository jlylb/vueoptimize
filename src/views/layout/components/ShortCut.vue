<template>
  <div class='short-cut'>
    <!-- <el-tooltip effect="dark" :content="'系统设置'" placement="bottom">
      <div class='short-cut-item'>
        <svg-icon icon-class="setting" class-name="short-cut-icon" />
      </div>
    </el-tooltip> -->
    <el-tooltip effect="dark" :content="'权限设置'" placement="bottom">
      <div class='short-cut-item' v-ability='"api.permission.index"'>
        <svg-icon icon-class="privillege" class-name="short-cut-icon" @click.native='openShort("/permission/index")'/>
        <!-- <span class='short-cut-title'>权限设置</span> -->
      </div>
    </el-tooltip>
      <el-tooltip effect="dark" :content="'修改密码'" placement="bottom">  
      <div class='short-cut-item' v-ability='"api.auth.modifyPassword"'>
        <svg-icon icon-class="password" class-name="short-cut-icon" @click.native='openShort("/auth/password")'/>
      </div>
     </el-tooltip> 
      <el-tooltip effect="dark" :content="'消息通知'" placement="bottom">  
      <div class='short-cut-item' v-ability='"api.notification.index"'>
        <el-badge :value="$store.getters.notification" class="item"> 
        <svg-icon icon-class="message" class-name="short-cut-icon" @click.native='openShort("/notification/index")'/>
        </el-badge>
      </div>
    </el-tooltip>   
  </div>  
</template>

<script>
import ability from '@/directive/ability/index.js'

export default{
  directives: { ability },
  methods: {
    openShort(name) {
      this.$router.push({ path: name })
    }
  }
}
</script>
<style lang='scss' scoped>

.short-cut{
  float: left;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  .short-cut-item{
    width: 48px;
    height: 48px;
    margin: 16px;
    cursor: pointer;
  }
  /deep/ .svg-icon {
      width: 48px;
      height: 48px;
  }
  .short-cut-title {
    display: block;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
  }
}
// .short-cut /deep/ .svg-icon {
//         width: 48px;
//     height: 48px;
// }
</style>
