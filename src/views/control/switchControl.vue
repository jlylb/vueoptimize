<template>
<div>
  <el-switch 
        v-model="item.bStatus"
        :disabled="item.bStatus || !isAuto" 
        class='switch-margin'
        v-for='(item, index) in data'
        :active-text="data.length>2?three[index]:two[index]"
        @change='changeControl($event, item, index)'
        :key='item.tu_Warnid'>
  </el-switch>
</div>
</template>

<script>
import { saveCommand } from '@/api/control'
export default {
    data() {
        return {
            two: ['开', '关'],
            three: ['起', '落', '停']
        }
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      pdi: {
        type: [String, Number],
        required: true
      },
      isAuto: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      changeControl(val, current, index) {
        console.log(val)
        if(val) {
          let loading = this.$loading({
            target: this.$parent.$el,
            lock: true,
            text: '正在处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
          })
          const { tu_Warnid: dpId } = current
          saveCommand({ status: 1, dp_id: dpId, pdi_index: this.pdi })
          .then((res) => {
            this.data = this.data.map((item)=>{
              if(item.tu_Warnid != dpId) {
                item.bStatus = false
              }
              return item
            })
            loading.close()
            this.$message({
                type: 'success',
                message: res.data.msg
            }); 
          }).catch(() => {
                current.bStatus = !val
                loading.close()
                this.$message({
                    type: 'info',
                    message: '已取消更改'
                });          
          })
        }
      }
    },
    created() {

    }
}
</script>

<style lang='scss' scoped>
.switch-margin {
  &.is-disabled {
    opacity: 1;
  }
  margin-bottom: 5px;
  /deep/ .el-switch__label {
    color: #ccc;
    &.is-active {
      color: #fff;
    }
  }
}
</style>
