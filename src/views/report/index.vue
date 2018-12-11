<template>
  <div class="table-layout">
    <table-list
      :custom-columns="columns"
      :form-columns="searchColumns"
      :table-data="data"
      :total="total"
      :search-data="search"
      :column-length="12"
      :hide-action="true"
      @list-data="getList"
    >
      <template slot="wd_level0" slot-scope="{ data }">
        <el-tag :class="warnClass(data.wd_level0)">{{ data.wd_level0|warnTxt }}</el-tag>
      </template>
    </table-list>
  </div>
</template>

<script>
import tableList from "../common/components/tableList";
import { fetchList } from "@/api/report";
import { warnLevel, warnClass } from "@/utils/config";

export default {
  components: { tableList },
  data() {
    return {
      data: [],

      searchColumns: [
        { name: "pdi_index", label: "设备编号", props: { clearable: true } },
        { name: "wd_index", label: "告警编号", props: { clearable: true } },
        {
          name: "rs_updatetime",
          label: "发送时间",
          type: "date"
        }
      ],
      searchModel: {},

      columns: {
        rs_updatetime: {
          label: "时间"
        },
        hw_index: {
          label: "索引"
        },
        pdi_index: {
          label: "设备编号"
        },
        wd_index: {
          label: "告警编号"
        },
        pdi_code: {
          label: "设备编码"
        },
        Wc_classname: {
          label: "告警名称"
        },
        wd_warndesc: {
          label: "告警描述"
        },
        Rs_status: {
          label: "告警状态"
        },
        wd_level0: {
          label: "告警等级"
        },
        pdi_name: {
          label: "设备名称"
        },
        dt_typememo: {
          label: "告警备注"
        }
      },
      total: 0,
      search: {
        page: 1,
        pageSize: 10
      },
      detailData: {},
      wdIndex: null
    };
  },
  watch: {},
  methods: {
    warnClass,
    getList(query) {
      console.log(query);
      fetchList(query || this.search)
        .then(res => {
          this.data = res.data.data.data;
          this.total = res.data.data.total;
        })
        .catch(res => {});
    },
    detail(item) {
      this.wdIndex = item.wd_index;
    }
  },
  filters: {
    warnTxt(val) {
      return warnLevel()[val] ? warnLevel()[val]["lvl"] : "无";
    }
  },
  created() {
    this.search = Object.assign({}, this.search, this.$route.params);
    // this.searchModel = { pdi_index: pdiIndex };
    this.getList();
  }
};
</script>
<style lang="scss" scoped>
.show-detail .el-form-item {
  margin-bottom: 0;
}
</style>

