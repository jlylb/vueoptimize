<template>
  <div class="table-layout">
    <div class="table-layout-inner">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label">
            <svg-icon icon-class="email" class-name="tab-icon"/>邮箱配置
          </span>
          <my-form
            class="my-form email-form"
            ref="roleForm"
            @do-form="saveData"
            :form-rules="formRules"
            :pform-model="formModel"
            :pform-columns="columns"
          >
            <template slot="extra_button">
              <el-button type="danger" @click="send" :loading="loading">发送测试邮件</el-button>
            </template>
          </my-form>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label">
            <svg-icon icon-class="message" class-name="tab-icon"/>短信配置
          </span>
          <my-form
            class="my-form email-form"
            ref="smsForm"
            @do-form="saveSmsData"
            :form-rules="formSmsRules"
            :pform-model="formSmsModel"
            :pform-columns="smsColumns"
            :form-props="formProps"
          >
            <template slot="extra_button">
              <el-popover
                placement="right"
                width="400"
                title="发送测试短信"
                trigger="click"
                v-model="visible"
              >
                <my-form
                  class="my-form"
                  ref="sms2Form"
                  @do-form="sendSms"
                  :form-rules="testRules"
                  :pform-model="testModel"
                  :pform-columns="testColumns"
                  :button-text="'发送'"
                  v-loading.lock="loading"
                ></my-form>
                <el-button slot="reference" type="danger" :loading="loading">发送测试短信</el-button>
              </el-popover>
            </template>
          </my-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyForm from "../common/components/myform";
import { fetchList, saveEmail, sendEmail, saveSms, sendSms } from "@/api/email";
import openMessage from "@/utils/message.js";
export default {
  components: { MyForm },
  data() {
    return {
      formProps: {
        labelWidth: "120px"
      },
      visible: false,
      columns: [
        {
          name: "driver",
          label: "邮箱驱动"
        },
        {
          name: "host",
          label: "邮箱服务器"
        },
        {
          name: "port",
          label: "端口"
        },
        {
          name: "encryption",
          label: "加密"
        },
        {
          name: "username",
          label: "邮箱用户"
        },
        {
          name: "password",
          label: "邮箱密码",
          inputType: "password"
        },
        {
          name: "to",
          label: "测试邮箱"
        }
      ],
      formModel: {},
      formRules: {
        driver: [
          { required: true, message: "请输入邮箱驱动", trigger: "blur" }
        ],
        host: [
          { required: true, message: "请输入邮箱服务器", trigger: "blur" }
        ],
        port: [
          { required: true, message: "请输入端口", trigger: "blur" },
          { pattern: /^\d{2,5}$/, message: "端口格式不正确", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入邮箱用户", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        to: [
          { required: true, message: "请输入测试邮箱", trigger: "blur" },
          { type: "email", message: "测试邮箱不正确", trigger: "blur" }
        ]
      },
      loading: false,
      smsColumns: [
        {
          name: "url",
          label: "短信服务地址"
        },
        {
          name: "username",
          label: "短信服务商账号"
        },
        {
          name: "userpass",
          label: "短信服务商密码",
          inputType: "password"
        },
        {
          name: "sender",
          label: "发送者"
        }
      ],
      formSmsRules: {
        url: [
          { required: true, message: "短信服务地址不能为空", trigger: "blur" },
          { type: "url", message: "短信服务地址格式不正确", trigger: "blur" }
        ]
      },
      formSmsModel: {},
      testRules: {
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[35789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ]
      },
      testModel: {},
      testColumns: [
        {
          name: "phone",
          label: "手机号"
        }
      ]
    };
  },
  methods: {
    saveData(data) {
      saveEmail(data).then(res => {
        console.log(res);
        openMessage(res);
      });
    },
    send() {
      this.loading = true;
      sendEmail()
        .then(res => {
          openMessage(res);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveSmsData(data) {
      saveSms(data).then(res => {
        console.log(res);
        openMessage(res);
      });
    },
    sendSms(data) {
      this.loading = true;
      sendSms(data)
        .then(res => {
          openMessage(res);
          this.loading = false;
          this.visible = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    smsPopup() {
      this.visible = !this.visible;
    }
  },
  created() {
    fetchList().then(res => {
      console.log(res.data, "config......");
      const { sms, email } = res.data;
      this.formModel = email;
      this.formSmsModel = sms;
    });
  }
};
</script>

<style lang="scss" scoped>
.table-layout-inner {
  padding: 0;
}
.table-layout-inner /deep/ .email-form .el-input {
  width: 30%;
}
.tab-icon {
  margin-right: 5px;
}
</style>
