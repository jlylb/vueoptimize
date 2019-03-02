<template>
    <el-col  class="card-panel-col" v-bind="col">
      <div :class='`card-panel card-${name}`' @click="handleClick">
        <div :class="`card-panel-icon-wrapper icon-${name}`">
          <svg-icon :icon-class="icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{ text }}</div>
          <count-to class="card-panel-num" v-bind="countTo" ></count-to>
        </div>
      </div>
    </el-col>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
    components: {
        CountTo
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        col: {
            type: Object,
            default() {
                return {
                    xs: 12,
                    sm: 12,
                    lg: 6
                }
            }
        },
        text: {
            type: String,
            default: ''
        },
        countTo: {
            type: Object,
            default() {
                return {
                    startVal: 0,
                    endVal: 100,
                    duration: 2600,
                }
            }
        }
    },

  methods: {
    handleClick() {
      this.$emit('to', this.name)
    }
  }
}
</script>

<style lang="scss">
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    background:rgb(40, 49, 60);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        text-align: center;
        display: block;
      }
    }
  }
</style>
