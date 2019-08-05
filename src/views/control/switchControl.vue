<template>
  <div>
    <el-switch
      v-model="item.value"
      :disabled="!isAuto"
      class="switch-margin"
      v-for="(item, index) in data"
      :active-text="index==0?(data.length>1?three[0]:two[0]):'落'"
      :inactive-text="index==0?(data.length>1?three[1]:two[1]):'停'"
      :active-value="1"
      :inactive-value="0"
      @change="changeControl($event, item, index)"
      :key="item.tu_Warnid"
    ></el-switch>
  </div>
</template>

<script>
import { saveCommand } from "@/api/control";
export default {
  data() {
    return {
      two: ["开", "关"],
      three: ["起", "停"]
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
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
      console.log(val);
      let loading = this.$loading({
        target: this.$parent.$el,
        lock: true,
        text: "正在处理中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      const { dp_id: dpId } = current;
      const params = [];
      params.push({ status: val, dp_id: dpId });
      this.data.map(item => {
        if (item.dp_id != dpId) {
          params.push({
            status: 0,
            dp_id: item.dp_id
          });
        }
      });
      saveCommand({ params, pdi_index: this.pdi })
        .then(res => {
          this.data = this.data.map(item => {
            if (item.dp_id != dpId) {
              item.value = 0;
            }
            return item;
          });
          setTimeout(() => {
            loading.close();
            this.$message({
              type: "success",
              message: res.data.msg
            });
          }, 3000);
        })
        .catch(() => {
          current.status = val == 0 ? 1 : 0;
          loading.close();
          this.$message({
            type: "info",
            message: "更改失败"
          });
        });
    }
  },
  created() {}
};
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
