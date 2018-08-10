<template>
  <div class='short-cut'>
    <!-- <el-tooltip effect="dark" :content="'系统设置'" placement="bottom">
      <div class='short-cut-item'>
        <svg-icon icon-class="setting" class-name="short-cut-icon" />
      </div>
    </el-tooltip> -->
      <div class='short-cut-item' v-ability='"api.permission.index"'>
        <svg-icon icon-class="privillege" class-name="short-cut-icon" @click.native='openShort("/permission/index")'/>
        <span class='short-cut-title'>权限设置</span>
      </div>


      <div class='short-cut-item' v-ability='"api.auth.modifyPassword"'>
        <svg-icon icon-class="password" class-name="short-cut-icon" @click.native='openShort("/auth/password")'/>
        <span class='short-cut-title'>修改密码</span>
      </div>


      <div class='short-cut-item' v-ability='"api.notification.index"'>
        <el-badge :value="$store.getters.notification" class="item"> 
        <svg-icon icon-class="message" class-name="short-cut-icon" @click.native='openShort("/notification/index")'/>
        <span class='short-cut-title'>消息通知</span>
        </el-badge>
      </div>

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

</style>
