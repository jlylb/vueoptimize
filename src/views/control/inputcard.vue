<template>
  <device-component :status="status" v-loading="loading" :icon-name="icon">
    <template slot="params">
      <slot>
        <p v-if="hasMenu">
          <el-dropdown @command="handlerCommand" trigger="click">
            <span class="el-dropdown-link">
              {{ selectText }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="disabled"
                :command="subItem"
                :class="{'active-menu': 
                  activeIndex==subItem.ts_typeid }"
                v-for="(subItem, index) in menuData"
                :key="index"
              >{{ subItem.ts_TypeMo }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
        <p v-if="hasMenu">
          <el-popover v-model="visible" trigger="click">
            <el-input v-model="inputText" :placeholder="originTitle" :style="{ width: 'auto' }"></el-input>
            <el-button
              type="danger"
              icon="el-icon-close"
              circle
              :style="{ 'margin-left': '10px' }"
              @click="cancelName"
            ></el-button>
            <el-button type="success" icon="el-icon-check" circle @click="changeName"></el-button>
            <p slot="reference">{{ title }}</p>
          </el-popover>
        </p>
      </slot>
      <p>
        <slot name="append"></slot>
      </p>
    </template>
  </device-component>
</template>

<script>
import DeviceComponent from "@/components/deviceComponent";
export default {
  components: { DeviceComponent },
  props: {
    status: {
      type: String,
      default: "success"
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    originTitle: {
      type: String,
      default: ""
    },
    menus: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    menuDefault: {
      type: String,
      default: "选择类型"
    },
    selectMenu: {
      type: [String, Number],
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    typeIcon: {
      type: String,
      default: "control"
    }
  },
  computed: {
    menuData() {
      return [this.first].concat(this.menus);
    },
    hasMenu() {
      return this.menus.length > 0;
    }
  },
  data() {
    return {
      selectText: this.menuDefault,
      icon: this.typeIcon,
      first: {
        ts_TypeMo: "选择类型",
        ts_Icon: "control",
        tu_SubTypeId: 0
      },
      selectItem: null,
      activeIndex: this.selectMenu,
      inputText: this.title,
      visible: false
    };
  },
  methods: {
    handlerCommand(item) {
      console.log(item, "command.......");
      this.selectText = item.ts_TypeMo;
      this.icon = item.ts_Icon;
      this.selectItem = item;
      this.activeIndex = item.ts_typeid;
      this.$emit("select-menu", item);
    },
    changeName() {
      this.$emit("save-name", { item: this.selectItem, desc: this.inputText });
      this.visible = false;
    },
    cancelName() {
      this.visible = false;
      this.inputText = this.title;
    }
  },
  created() {
    this.menuData.forEach(item => {
      if (item.ts_typeid == this.activeIndex) {
        this.selectItem = item;
        this.selectText = item.ts_TypeMo;
        this.icon = item.ts_Icon;
      }
    });
    // this.activeIndex = item.ts_typeid
  }
};
</script>

<style scoped>
.el-dropdown-link {
  color: #fff;
}
.active-menu {
  background-color: #ecf5ff;
  color: #66b1ff;
}
</style>
