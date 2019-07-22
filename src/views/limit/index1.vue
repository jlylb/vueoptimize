<template>
  <div class="table-layout">
    <device-filter-three ref="deviceFilter" @filter="getData" mtype="1">
      <template slot="button">
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </device-filter-three>

    <div class="table-layout-inner">
      <el-form ref="form" :model="form" label-width="100px" label-position="top">
        <div class="row" v-for="(item, index) in form" :key="index">
          <el-form-item class="row-item" :label="`上限阈值${index+1}`">
            <el-input-number
              v-model.number="form[index].up"
              :precision="2"
              :step="0.1"
              size="medium"
            ></el-input-number>
          </el-form-item>
          <el-form-item class="row-item" :label="`下限阈值${index+1}`">
            <el-input-number
              v-model.number="form[index].down"
              :precision="2"
              :step="0.1"
              size="medium"
            ></el-input-number>
          </el-form-item>
        </div>
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
      deviceIndex: 10
    };
  },
  methods: {
    getData(data) {
      const { device: pdi_index } = data;
      this.pdiIndex = pdi_index;
      fetchDeviceData({ pdi_index })
        .then(res2 => {
          this.deviceData = res2.data.devicesData;
        })
        .catch(() => {
          this.deviceData = null;
        });
    },
    save() {
      console.log(this.form, "form.............");
    }
  },
  mounted() {
    let items = [];
    for (let x = 1; x <= 10; x++) {
      items.push({
        up: 0.0,
        down: 0.0
      });
    }
    this.form = items;
  }
};
</script>

<style lang="scss">
.row {
  display: flex;
  flex-wrap: wrap;
  //justify-content: space-around;
}
.row-item {
  width: 45%;
}
// .row-item .el-input-number--medium {
//   width: 80%;
// }
</style>
