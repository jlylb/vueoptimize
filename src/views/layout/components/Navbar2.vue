<template>
  <el-menu class="navbar" mode="horizontal" background-color="#28313c">

    <el-menu-item index="0">
      <el-tooltip effect="dark" :content="'隐藏菜单'" placement="bottom">
        <nav-item>
          <hamburger class="ham-menu" 
            :toggleClick="toggleSideBar" 
            :isActive="sidebar.opened" 
            slot="icon">
          </hamburger>
        </nav-item>
    </el-tooltip>
    </el-menu-item>

    <el-menu-item index="1">
      <nav-item title="权限设置" icon="privillege" url="/permission/index"></nav-item>
    </el-menu-item>

    <el-menu-item index="2">
      <nav-item title="修改密码" icon="password" url="/auth/password"></nav-item>
    </el-menu-item>

    <el-menu-item index="3">
      <nav-item title="消息通知" icon="message" url="/notification/index"></nav-item>
    </el-menu-item>
<div class="right-menu">
    <el-menu-item index="4">
      <nav-item :title="$t('navbar.screenfull')">
        <screenfull slot="icon" class="screen-menu"></screenfull>
      </nav-item>
    </el-menu-item>

    <el-menu-item index="5">
      <nav-item title="语言切换">
        <lang-select slot="icon" class="screen-menu"></lang-select>
      </nav-item>
    </el-menu-item>

    <el-menu-item index="6">
      <nav-item>
        <el-dropdown class="avatar-container right-menu-item" trigger="click" slot="icon">
          <div class="avatar-wrapper short-cut-menu">
            <img class="user-avatar" :src="getAvatar+'?imageView2/1/w/80/h/80'">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/auth/userinfo" v-if='checkAbility("api.auth.getUserInfo")'>
              <el-dropdown-item>
                {{$t('navbar.profile')}}
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </nav-item>
    </el-menu-item>
</div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ShortCut from './ShortCut'
import { getImageUrl } from '@/utils'
import { checkAbility } from '@/utils/permission'
import NavItem from './navItem'

export default {
  components: {
    NavItem,
    Hamburger,
    Screenfull,
    LangSelect
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'companyLogo',
      'companyName'
    ]),
    getAvatar() {
      return this.getImageUrl(this.avatar)
    }
  },
  methods: {
    checkAbility,
    getImageUrl,
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>
<style lang='css'>

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar{
  border-bottom: none;
  margin-bottom: 10px;
  height: 80px;
  overflow: hidden;
  /deep/ .ham-menu{
    height: 54px;
    svg{
      vertical-align: top;
    }
  }
  /deep/ .screen-menu{
    height: 32px;
    display: block;
    svg{
      vertical-align: top;
    }
  }
 .el-menu-item {
  height: auto;
  color: #fff;
  border-bottom: none;
  &:not(.is-disabled):hover{
    color: #fff;
  }
  &:not(.is-disabled):focus{
    color: #fff;
  }
  &.is-active {
    border-bottom: none;
  }
}
.avatar-wrapper {
  img {
    height: 54px;
    width: 54px;
  }
}
.right-menu{
  display: flex;
  justify-content: flex-end;
}
}
</style>
