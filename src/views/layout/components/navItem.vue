<template>
    <div class='short-cut-item' v-ability='auth' @click='openShort'>

        <slot name="icon">
            <svg-icon :icon-class="icon" class-name="short-cut-icon" v-if="icon"/>
        </slot>

        <slot>
            <span class='short-cut-title' v-if="title">{{ title }}</span>
        </slot>

    </div>
</template>

<script>
import ability from "@/directive/ability/index.js";
export default {
  directives: { ability },
  props: {
    auth: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  },
  methods: {
    openShort() {
      if (!this.url) {
        return;
      }
      this.$router.push({ path: this.url });
    }
  }
};
</script>

<style lang='scss' scoped>
.short-cut-item {
  width: 64px;
  margin: 13px 16px;
  cursor: pointer;
  /deep/ .svg-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto;
    display: block;
    color: #fff;
  }
}

.short-cut-title {
  display: block;
  line-height: 16px;
  font-size: 12px;
  text-align: center;
  margin-top: 6px;
}
</style>
