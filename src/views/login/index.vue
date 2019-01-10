<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      v-if="passwordLogin"
    >
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <!-- <lang-select class="set-language"></lang-select> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          :placeholder="$t('login.username')"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          name="password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          :placeholder="$t('login.password')"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>

      <el-button
        type="success"
        class="login-btn"
        style="width:100%;margin-bottom:30px;"
        :loading="loading"
        @click.native.prevent="handleLogin"
      >{{$t('login.logIn')}}</el-button>
      <div class="tips">
        <span @click="qrcodeSign">二维码登录</span>
      </div>
    </el-form>

    <div class="login-form login-qrcode" v-if="qrcodeLogin">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
      </div>
      <div class="qrimg">
        <img :src="qrcodeImg" class="qrcode">
        <div class="qrimg-cover" v-if="expireText">
          <div class="qrimg-cover-content">
            <p class="qrimg-tips">二维码已失效</p>
            <p>
              <el-button
                type="success"
                size="small"
                @click="qrcodeSign"
                :style="{ width: '96px'}"
              >刷新</el-button>
            </p>
          </div>
        </div>
      </div>
      <div class="tips">
        <span @click="passwordSign">密码登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
// import LangSelect from '@/components/LangSelect'
import openMessage from "@/utils/message.js";
import { loginByUsername } from "@/api/login";
import { getQrcode, checkQrcode } from "@/api/qrcode1";
import { setToken } from "@/utils/auth";
import { getImageUrl } from "@/utils";

export default {
  components: {},
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不得少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "Cynthia Lindgren",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      qrcodeImg: null,
      passwordLogin: true,
      qrcodeLogin: false,
      expireText: false,
      timerId: null,
      timeLimit: 120
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(res => {
              this.loading = false;
              this.$router.push({ path: "/" });
            })
            .catch(res => {
              // console.log(res,'login catch ......')
              openMessage(res);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    afterQRScan() {},
    passwordSign() {
      this.passwordLogin = true;
      this.qrcodeLogin = false;
    },
    qrcodeSign() {
      this.passwordLogin = false;
      this.qrcodeLogin = true;
      clearInterval(this.timerId);
      this.expireText = false;
      getQrcode().then(res => {
        const { status, msg, s } = res.data;
        console.log(res, "qrcode......");
        if (status == 1) {
          this.qrcodeImg = getImageUrl(msg);
          this.checkQruuid(s);
        }
      });
    },
    checkQruuid(uuid) {
      // let timeLimit = 120;
      this.timerId = setInterval(() => {
        checkQrcode({ s: uuid })
          .then(res => {
            const { status, data } = res.data;
            if (status == 1) {
              this.$store.dispatch("ScanLogin", data).then(() => {
                this.$router.push({ path: "/", replace: true });
              });
              clearInterval(this.timerId);
            } else {
              if (this.timeLimit > 1) {
                this.timeLimit -= 1;
              } else {
                this.timeLimit = 120;
                this.expireText = true;
                clearInterval(this.timerId);
              }
            }
          })
          .catch(() => {
            this.timeLimit = 120;
            clearInterval(this.timerId);
          });
      }, 1000);
    }
  },
  created() {},
  destroyed() {},
  mounted() {}
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
#canvascontainer {
  position: absolute;
  top: 0px;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #78a126;
$dark_gray: #889aa4;
$light_gray: #eee;
$login-btn-color: darken($bg, 10%);

body {
  height: 100%;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .login-qrcode {
    text-align: center;
  }
  .qrimg {
    margin-bottom: 30px;
    display: inline-block;
    position: relative;
    height: 200px;
  }
  .qrimg-cover {
    display: inline-block;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .qrimg-cover-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .qrimg-tips {
    color: #fff;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    text-align: center;
    span {
      cursor: pointer;
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  /deep/ .login-btn {
    background-color: $login-btn-color;
    border-color: $login-btn-color;
  }
}
</style>
