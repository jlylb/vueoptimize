<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#76a025"
      text-color="#fff"
      active-text-color="#6fed07"
    >
      <div class="logo-container">
        <img :src="getImageUrl(companyLogo)" class="logo" v-if="companyLogo">
        <img :src="logo()" v-else>
      </div>
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.name"
        :item="route"
        :base-path="route.path"
      ></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import Logo from "@/assets/logo/logo.png";
import { getImageUrl } from "@/utils";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      "permission_routers",
      "sidebar",
      "companyLogo",
      "companyName"
    ]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  methods: {
    getImageUrl,
    logo() {
      return Logo;
    }
  },
  created() {
    console.log(this.permission_routers, "left menu.............");
  }
};
</script>

<style lang='scss' scoped>
.logo-container {
  height: 80px;
  & img {
    height: 80px;
    width: 180px;
  }
}
</style>
