<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">

    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#28313c"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
    <div class='logo-container'>
        <img :src='companyLogo' class='logo' v-if='companyLogo'/>
        <img :src='logo()' v-else>
    </div>
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from '@/assets/logo/logo.png'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'companyLogo',
      'companyName'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    logo() {
      return Logo
    }
  }
}
</script>

<style lang='scss' scoped>

.logo-container{
  height: 80px;
}

</style>
