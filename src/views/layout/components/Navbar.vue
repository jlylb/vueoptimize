<template>
  <el-menu class="navbar" mode="horizontal" >
    <div class='sub-navbar'>

 <div class='layout-left'>
    <el-tooltip effect="dark" :content="'隐藏菜单'" placement="bottom">
      <hamburger class="short-cut-menu" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </el-tooltip>

    <short-cut class="short-cut-left"></short-cut>
 </div>  
    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->

    <!-- <div class='system-name'>{{ companyName }}</div> -->

    <div class='layout-right'>

    <div class="right-menu short-cut-right">
      <!-- <error-log class="errLog-container right-menu-item"></error-log> -->

  
        <div class='short-cut-item'>
        <screenfull class="short-cut-icon"></screenfull>
        <span class='short-cut-title'>{{ $t('navbar.screenfull') }}</span>
        </div>

        <div class='short-cut-item'>
          <lang-select class="international"></lang-select>
          <span class='short-cut-title'>语言切换</span>
        </div>

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
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
    </div>
    </div>
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

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    ShortCut
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

@import "src/styles/variables.scss";
%cut {
  .short-cut-item{
    width: 64px;
    margin: 13px 16px;
    cursor: pointer;
  }
  /deep/ .svg-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto;
    display: block;
    color: #fff;
  }
  .short-cut-icon {
    height: 32px;
    width: 32px;
    color: #fff;
    margin: 0 auto;
    display: block;
  }
  .short-cut-title {
    display: block;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    margin-top: 6px;
  }
}
.short-cut-right{
  @extend %cut
}
.short-cut-left {
  float: left;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  /deep/ {
    @extend %cut 
  }
}

  .sub-navbar{
    background-color: $baseColor;
    height: 80px;
    background-image: none;
    // padding-left: 20px;
    display: flex;
    @media screen and ( max-width: 768px ){
      .short-cut{
        transform: translate3d(-360px,0,0)
      }
      .layout-left{
        display: inline-block;
      }
    }
  }
  .layout-right{
    display: flex;
    justify-content: flex-end;
    width: 30%;
  }
  .layout-left{
    display: flex;
    width: 70%;
  }
  .short-cut-menu {
    height: 48px;
    width:48px;
    color: #fff;
    margin: 16px;
  }
.navbar {
  height: 80px;
  line-height: 50px;
  border-radius: 0px !important;
  background-color: $baseColor;
  color: #fff;
  border-bottom: none;
  margin-bottom: 20px;
  padding: 0 20px;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
    color: #fff;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    // height: 100%;
    display: flex;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      // display: inline-block;
      // margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
      display: block;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      // height: 50px;
      // margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
