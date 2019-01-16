<template>
  <div class="table-layout">
    <table-list
      :custom-columns="columns"
      :form-columns="searchColumns"
      :table-data="data"
      :total="total"
      :column-length="12"
      :search-data="search"
      @list-data="getList"
      @list-edit="handleEdit"
      @list-delete="handleDelete"
    >
      <template slot="add_search_button">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </template>
      <template slot-scope="{ data }" slot="app_status">
        <el-tag :type="data.app_status==1?'success':'info'">{{ data.app_status==1?'启用':'禁用' }}</el-tag>
      </template>
      <template slot-scope="{ data }" slot="app_type">
        <el-tag :type="'warning'">{{ appTypeLabel[data.app_type] }}</el-tag>
      </template>

      <template slot-scope="{ data }" slot="app_phone">
        <el-tag :type="'primary'">{{ appPhoneLabel[data.app_phone] }}</el-tag>
      </template>

      <template slot-scope="{ data }" slot="app_update_type">
        <el-tag :type="'danger'">{{ appUpdateTypeLabel[data.app_update_type] }}</el-tag>
      </template>
    </table-list>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      @open="dialogOpen"
      :close-on-click-modal="false"
    >
      <my-form
        class="my-form"
        ref="dialogForm"
        @do-form="saveData"
        :form-rules="formRules"
        :pform-model="userFormModel"
        :form-props="formProps"
        :pform-columns="formColumns"
        :default-files="logo"
      ></my-form>
    </el-dialog>
  </div>
</template>

<script>
import tableList from "../common/components/tableList";
import MyForm from "../common/components/myform";
import { fetchList, createApk, updateApk, deleteApk } from "@/api/apk";
import openMessage from "@/utils/message.js";
import { getImageUrl } from "@/utils";

export default {
  components: { tableList, MyForm },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: "",
      formColumns: [
        { name: "app_name", label: "名称" },
        { name: "app_version", label: "版本号" },
        {
          name: "app_type",
          label: "分类",
          type: "select",
          props: {
            class: "select-dropdown",
            placeholder: "请选择分类",
            filterable: true,
            clearable: true
          },
          data: []
        },
        {
          name: "app_phone",
          label: "手机类型",
          type: "radiogroup",
          data: []
        },
        {
          name: "app_update_type",
          label: "更新方式",
          type: "radiogroup",
          data: []
        },
        {
          name: "apk",
          label: "上传本地文件",
          type: "upload",
          props: {
            action: "/api/upload",
            limit: 1,
            name: "app_path",
            listType: "text",
            data: {
              field: "app_path"
            }
          },
          default: []
        },
        {
          name: "app_http",
          label: "网络下载地址",
          props: {
            clearable: true
          }
        },
        { name: "app_status", label: "状态", type: "switch" },
        {
          name: "app_desc",
          label: "描述",
          inputType: "textarea",
          props: { rows: 3 }
        }
      ],
      searchColumns: [
        { name: "app_name", label: "名称", props: { clearable: true } },
        { name: "app_version", label: "版本号", props: { clearable: true } }
      ],
      formRules: null,
      formProps: {
        labelWidth: "120px"
      },
      columns: {
        id: {
          label: "索引"
        },
        app_name: {
          label: "包名称"
        },
        app_version: {
          label: "版本"
        },
        app_type: {
          label: "分类"
        },
        app_phone: {
          label: "手机类型"
        },
        app_update_type: {
          label: "更新方式"
        },
        app_status: {
          label: "状态"
        },
        app_http: {
          label: "网络地址"
        },
        app_path: {
          label: "本地文件"
        },
        creater_name: {
          label: "创建者"
        },
        created_at: {
          label: "创建时间"
        },
        updated_at: {
          label: "更新时间"
        },
        action: {
          "min-width": "290",
          label: "操作"
        }
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      userFormModel: {},
      isAdd: true,
      labels: null,
      appType: [],
      appTypeLabel: {},

      appPhone: [],
      appPhoneLabel: {},

      appUpdateType: [],
      appUpdateTypeLabel: {}
    };
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true;
      this.isAdd = true;
      this.dialogTitle = "添加";
      this.logo = [];
      this.userFormModel = {
        app_update_type: 2,
        app_phone: 1
      };
    },
    handleDelete(data) {
      deleteApk(data)
        .then(res => {
          openMessage(res).then(() => {
            this.getList();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleEdit(data) {
      console.log(data);
      this.isAdd = false;
      this.editDialog = true;
      this.dialogTitle = "编辑";
      if (data.app_path) {
        this.logo = [{ url: getImageUrl(data.app_path), name: data.app_name }];
      } else {
        this.logo = [];
      }
      this.$nextTick(() => {
        this.userFormModel = data;
      });
    },
    getList(query) {
      console.log(query);
      fetchList(query || this.search)
        .then(res => {
          this.data = res.data.data.data;
          this.total = res.data.data.total;
          this.appType = res.data.app_type;
          this.appTypeLabel = res.data.app_type_label;

          this.appPhone = res.data.app_phone;
          this.appPhoneLabel = res.data.app_phone_label;

          this.appUpdateType = res.data.app_update_type;
          this.appUpdateTypeLabel = res.data.app_update_type_label;

          const columns = this.formColumns;

          this.formColumns = columns.map(item => {
            if (item.name == "app_type") {
              item.data = this.appType;
            }
            if (item.name == "app_phone") {
              item.data = this.appPhone;
            }
            if (item.name == "app_update_type") {
              item.data = this.appUpdateType;
            }
            return item;
          });
        })
        .catch(res => {});
    },
    saveData(data) {
      const method = this.isAdd !== true ? updateApk : createApk;
      method(data)
        .then(res => {
          openMessage(res).then(() => {
            this.editDialog = false;
            this.getList();
          });
        })
        .catch(res => {
          console.log(res);
        });
    },
    dialogOpen(val) {
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate();
      });
    }
  },
  mounted() {
    const checkVersion = (rule, value, callback) => {
      if (/^\d+\.\d+\.\d+$/.test(value)) {
        callback();
      } else {
        callback(new Error("版本号格式不正确, eg: 1.2.0"));
      }
    };
    this.formRules = {
      app_name: [{ required: true, message: "请输入包名称", trigger: "blur" }],
      app_version: [
        { required: true, message: "请输入版本号", trigger: "blur" },
        { validator: checkVersion, trigger: "blur" }
      ],
      app_type: [{ required: true, message: "请选择分类", trigger: "blur" }],
      app_phone: [
        { required: true, message: "请选择手机类型", trigger: "blur" }
      ],
      app_update_type: [
        { required: true, message: "请选择更新方式", trigger: "blur" }
      ],
      app_path: [{ required: true, message: "请上传文件", trigger: "blur" }]
    };
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss">
</style>

