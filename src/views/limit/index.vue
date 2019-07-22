<template>
  <div class="table-layout">
    <device-filter-three ref="deviceFilter" @filter="getData" mtype="1">
      <template slot="button">
        <el-button type="success" @click="save" :disabled="disabled">保存</el-button>
      </template>
    </device-filter-three>

    <div class="table-layout-inner custom-layout" v-if="deviceData">
      <el-form ref="form" :model="form" label-width="100px" label-position="top">
        <el-tabs type="border-card" v-model="currentTab" ref="tab_card">
          <el-tab-pane
            v-for="tabitem in tabs"
            :key="tabitem"
            :name="tabitem"
            :ref="`tab_${tabitem}`"
          >
            <span slot="label">{{ tabDesc[tabitem] }}</span>
            <el-row type="flex" class="row" :gutter="10">
              <el-col :span="5" v-for="item in tabData" :key="item.dp_paramname">
                <el-form-item class="row-item" :label="getLabel(item.dp_paramname)">
                  <el-input-number
                    v-model.number="form[item.dp_paramname]"
                    :precision="2"
                    :step="0.1"
                    size="medium"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import DeviceFilterThree from "@/views/common/components/deviceFilterFive";
import { fetchDeviceData, saveCommand } from "@/api/limit";

export default {
  components: { DeviceFilterThree },
  data() {
    return {
      deviceData: null,
      pdiIndex: null,
      form: [
        {
          up: 0.0,
          down: 0.0
        }
      ],
      deviceIndex: 10,
      tabs: [],
      tabDesc: {},
      currentTab: null,
      formData: {},
      formIndex: 0,
      disabled: false,
      desc: null
    };
  },
  computed: {
    tabData() {
      let items = {};
      Object.keys(this.deviceData).forEach(item => {
        let index = item.replace(/\D+/g, "");
        if (this.checkTab(this.currentTab, item)) {
          items[index - 1] = this.deviceData[item];
        }
      });

      return items;
    }
  },

  methods: {
    getData(data) {
      const { device: pdi_index } = data;
      this.pdiIndex = pdi_index;
      fetchDeviceData({ pdi_index })
        .then(res2 => {
          this.deviceData = res2.data.params;
          this.desc = res2.data.desc;
          this.generateModel();
        })
        .catch(() => {
          this.deviceData = null;
        });
    },
    save() {
      if (!this.deviceData) return;
      this.disabled = true;
      this.formData = {};
      Object.keys(this.form).forEach(item => {
        let dpId = this.deviceData[item]["Dp_id"];
        if (this.checkTab(this.currentTab, item)) {
          this.formData[dpId] = this.form[item];
        }
      });
      const loading = this.$loading({
        target: this.$refs["tab_card"].$el,
        lock: true,
        text: "正在处理中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      let post = {
        pdi_index: this.pdiIndex,
        data: this.formData
      };
      saveCommand(post)
        .then(res => {
          this.$message({
            type: "success",
            message: res.data.msg
          });
          setTimeout(() => {
            loading.close();
            this.disabled = false;
          }, 3000);
        })
        .catch(() => {
          this.disabled = false;
          loading.close();
        });
    },
    checkTab(tabName, field) {
      return field.includes(tabName);
    },
    getLabel(field) {
      let index = field.replace(/\D+/g, "");
      let descField = field.replace(/\d+/g, "").replace(/^rd_/, "");
      return this.desc[descField].replace(/\d+/g, index);
    },
    generateModel() {
      let items = {};
      this.tabs = [];
      this.tabDesc = {};
      if (!this.deviceData) return;
      var data = this.deviceData;
      Object.keys(data).forEach(item => {
        let tabName = item.replace(/\d+/g, "");
        items[item] = data[item]["value"];

        if (!this.tabs.includes(tabName)) {
          this.tabs.push(tabName);
          let tabDesc = item.replace(/\d+/g, "").replace(/^rd_/, "");
          this.tabDesc[tabName] = this.desc[tabDesc].replace(/\d+/g, "");
        }
      });
      this.form = items;
      this.tabs = this.tabs.reverse();
      this.currentTab = this.tabs[0];
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.row {
  display: flex;
  flex-wrap: wrap;
}
.row-item {
  width: 45%;
}
</style>
<style lang="scss" scoped>
.custom-layout {
  padding: 0;
}
</style>

