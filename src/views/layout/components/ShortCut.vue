<template>
  <div class='short-cut'>

      <div class='short-cut-item' v-ability='"api.company.edit"' v-if='companyId'>
        <svg-icon icon-class="company" class-name="short-cut-icon" @click.native='openShort("/company/" + companyId +"/edit")'/>
        <span class='short-cut-title'>公司设置</span>
      </div>
      <div class='short-cut-item' v-ability='"api.permission.index"'>
        <svg-icon icon-class="privillege" class-name="short-cut-icon" @click.native='openShort("/permission/index")'/>
        <span class='short-cut-title'>权限设置</span>
      </div>


      <div class='short-cut-item' v-ability='"api.auth.modifyPassword"'>
        <svg-icon icon-class="password" class-name="short-cut-icon" @click.native='openShort("/auth/password")'/>
        <span class='short-cut-title'>修改密码</span>
      </div>


      <div class='short-cut-item' v-ability='"api.alarm.realwarn"'>
         
        <svg-icon icon-class="message" class-name="short-cut-icon" :class='["animation2", {"animation2-pause": notification == 0 }]'  @click.native='openShort("/alarm/realwarn")'/>
        <el-badge :value="notification" class="item">
          <span class='short-cut-title'>告警通知</span>
        </el-badge>
      </div>

  </div>  
</template>

<script>

import ability from '@/directive/ability/index.js'
import { mapGetters } from 'vuex'

export default{
  directives: { ability },
  computed: {
    ...mapGetters([
      'companyId', 'notification'
    ]),
  },
  methods: {
    openShort(name) {
      this.$router.push({ path: name })
    }
  }
}
</script>
<style lang='scss' scoped>
.short-cut-item {
  .item {
    display: inherit;
    /deep/ .el-badge__content {
      border: none;
    }
  }
}
</style>
