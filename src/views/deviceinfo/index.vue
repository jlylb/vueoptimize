<template>
  <div class="table-layout">
    <table-list
      :custom-columns="columns"
      :form-columns="searchColumns"
      :table-data="data"
      :total="total"
      :search-data="search"
      @list-data="getList"
      @list-edit="handleEdit"
      :show-expand="false"
      @list-delete="handleDelete"
    >
      <template slot="add_search_button">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </template>
      <template slot-scope="{ data }" slot="dt_issupportext">
        <el-tag
          :type="data.dt_issupportext==1?'success':'info'"
        >{{ data.dt_issupportext==1?'支持':'不支持' }}</el-tag>
      </template>
      <template slot-scope="{ data }" slot="dt_isenable">
        <el-tag :type="data.dt_isenable==1?'success':'info'">{{ data.dt_isenable==1?'是':'否' }}</el-tag>
      </template>
    </table-list>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      @open="dialogOpen"
      :close-on-click-modal="false"
      ref="refform"
    >
      <my-form
        class="my-form"
        ref="dialogForm"
        @do-form="saveData"
        :form-rules="formRules"
        :pform-model="userFormModel"
        :form-props="formProps"
        :pform-columns="formColumns"
      >
        <template slot="areaname" slot-scope="{ data, fmodel }">
          <el-select v-model="fmodel[data.name]" v-on="data.events||{}" v-bind="data.props||{}">
            <el-option-group v-for="group in data.data" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.children"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-option-group>
          </el-select>
        </template>
      </my-form>
    </el-dialog>
  </div>
</template>

<script>
import tableList from "../common/components/tableList";
import MyForm from "../common/components/myform";
import {
  fetchList,
  createDeviceinfo,
  updateDeviceinfo,
  deleteDeviceinfo,
  fetchAllTypes,
  fetchAreas
} from "@/api/deviceinfo";
import openMessage from "@/utils/message.js";
import { searchCompany } from "@/api/company";
import { mapGetters } from "vuex";
import { Loading } from "element-ui";

export default {
  components: { tableList, MyForm },
  computed: {
    ...mapGetters({
      isSuper: "isSuper",
      companyName: "companyName",
      cid: "companyId"
    })
  },
  data() {
    return {
      data: [],
      logo: [],
      dialogTitle: "",
      formColumns: [],
      searchColumns: [
        { name: "pdi_code", label: "设备编号", props: { clearable: true } }
      ],
      formRules: {
        pdi_name: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        pdi_code: [
          { required: true, message: "请输入设备编号", trigger: "blur" }
        ],
        dpt_id: [
          { required: true, message: "请选择设备分类", trigger: "change" }
        ],
        coname: [
          { required: true, message: "请选择所属公司", trigger: "change" }
        ],
        areaname: [{ required: true, message: "请选择区域", trigger: "change" }]
      },
      formProps: {
        labelWidth: "120px"
      },
      columns: {
        pdi_index: {
          label: "设备索引"
        },
        pdi_name: {
          label: "设备名称"
        },
        pdi_code: {
          label: "设备编号"
        },
        dpt_id: {
          label: "设备分类"
        },
        AreaId: {
          label: "区域"
        },
        "area.AreaName": {
          label: "区域名称"
        },
        Co_ID: {
          label: "公司编号"
        },
        "company.Co_Name": {
          label: "公司名称"
        },
        action: {
          "min-width": "150",
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
      companyId: null,
      loading: false
    };
  },
  methods: {
    handleAdd(data) {
      this.editDialog = true;
      this.companyId = null;
      this.isAdd = true;
      this.dialogTitle = "添加";
      this.userFormModel = {
        dt_isenable: 1,
        dpt_id: 0
      };
      this.editId = 0;
      if (!this.isSuper) {
        this.companyId = this.cid;
        const data = {
          coname: this.companyName,
          dt_isenable: 1,
          dpt_id: 0
        };
        this.$nextTick(() => {
          this.userFormModel = data;
        });
      }
    },
    handleDelete(data) {
      deleteDeviceinfo(data)
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
      this.companyId = data.Co_ID;
      data.areaname = data.area.AreaName;
      data.coname = data.company.Co_Name;
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
        })
        .catch(res => {});
    },
    saveData(data) {
      const method = this.isAdd !== true ? updateDeviceinfo : createDeviceinfo;
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
      const loading = Loading.service({
        target: this.$refs.refform.$el.querySelector(".el-dialog"),
        fullscreen: false
      });
      console.log(
        "loading start......",
        loading,
        this.$refs.refform.$el.querySelector(".el-dialog")
      );
      fetchAllTypes().then(res => {
        const columns = this.formColumns;
        columns.map(item => {
          if (item.name == "dpt_id") {
            item.data = res.data.data;
          }
          if (item.name == "coname") {
            item.data = [];
          }
          if (item.name == "areaname") {
            item.data = [];
          }
          return item;
        });
        this.formColumns = columns;
      });
      this.setArea(this.companyId).then(() => {
        setTimeout(() => {
          loading.close();
        }, 1000);
      });

      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate();
      });
    },
    remoteRoute(query) {
      searchCompany(query)
        .then(res => {
          const columns = this.formColumns;
          columns.map(item => {
            if (item.name == "coname") {
              item.data = res.data.data;
              return item;
            }
          });
          this.formColumns = columns;
        })
        .catch(res => {
          console.log(res);
        });
    },
    selectChange(val, data) {
      console.log(val, data);
      const loading = Loading.service({
        target: this.$refs.refform.$el.querySelector(".el-dialog")
      });
      this.companyId = val;
      const formModel = this.$refs.dialogForm.getFormModel();
      this.$set(formModel, "Co_ID", val);
      this.$set(formModel, "areaname", null);
      this.userFormModel = formModel;
      this.setArea(val).then(() => {
        setTimeout(() => {
          loading.close();
        }, 200);
      });
      this.$refs.dialogForm.validateField("areaname");
    },
    setArea(cid) {
      console.log(cid, "area......");
      if (cid == null || cid == undefined) {
        return new Promise(resolve => {
          resolve();
        });
      }

      return fetchAreas(cid).then(res => {
        const columns = this.formColumns;
        columns.map(item => {
          if (item.name == "areaname") {
            item.data = res.data.data;
            return item;
          }
        });
        this.formColumns = columns;
      });
    },
    selectClear() {
      const formModel = this.$refs.dialogForm.getFormModel();
      this.$set(formModel, "Co_ID", null);
      this.userFormModel = formModel;
    },
    areaSelectChange(val, data) {
      console.log(val, data);
      const formModel = this.$refs.dialogForm.getFormModel();
      this.$set(formModel, "AreaId", val);
      this.userFormModel = formModel;
    },
    areaSelectClear() {
      const formModel = this.$refs.dialogForm.getFormModel();
      this.$set(formModel, "AreaId", null);
      this.userFormModel = formModel;
    },
    handleWarn() {}
  },
  created() {
    this.search = Object.assign({}, this.search, this.$route.params);
    this.formColumns = [
      { name: "pdi_name", label: "设备名称" },
      { name: "pdi_code", label: "设备编号" },
      {
        name: "dpt_id",
        label: "设备分类",
        type: "select",
        props: {
          class: "select-dropdown",
          placeholder: "请输入设备分类",
          filterable: true,
          clearable: true
        },
        data: []
      },
      {
        name: "coname",
        label: "公司",
        type: "select",
        props: {
          filterable: true,
          remote: true,
          remoteMethod: this.remoteRoute,
          placeholder: "请输入公司名称",
          class: "select-dropdown",
          clearable: true,
          disabled: !this.isSuper
        },
        events: {
          change: this.selectChange,
          clear: this.selectClear
        },
        data: []
      },
      {
        name: "areaname",
        label: "区域",
        type: "select",
        props: {
          filterable: true,
          placeholder: "请选择区域",
          class: "select-dropdown",
          clearable: true
        },
        events: {
          change: this.areaSelectChange,
          clear: this.areaSelectClear
        },
        data: []
      }
    ];
    this.getList();
  }
};
</script>
<style lang="scss">
</style>

