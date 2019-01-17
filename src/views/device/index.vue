<template>
  <div class="table-layout">
    <div class="table-layout-inner">
      <el-row>
        <el-col :span="21">
          <div style="position: relative">
            <img class="device_img" :src="bg" @click="details($event)">
          </div>
        </el-col>
        <el-col :span="3">
          <ul class="device-tag">
            <li class="device-item">
              <el-alert center title="实时数据" :closable="false" type="warning"></el-alert>
            </li>
            <li class="device-item" v-for="(item, index) in data" :key="item.label">
              <el-tag class="device-item-tag" :type="item.type">{{ item.label }} {{ values[index] }}</el-tag>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import BgImage from "@/assets/yz.png";
export default {
  data() {
    return {
      bg: BgImage,
      data: {
        andan: { label: "氨氮", type: "" },
        cod: { label: "COD", type: "success" },
        ll: { label: "流量", type: "info" },
        zl: { label: "总磷", type: "warning" },
        ph: { label: "PH", type: "danger" }
      },
      values: {
        andan: 100,
        cod: 200,
        ll: 300,
        zl: 400,
        ph: 500
      },
      classMaps: {}
    };
  },
  methods: {
    details(e) {
      this.$router.push({ name: "device_detail" });
    }
  },
  created() {
    if (timer) {
      clearInterval(timer);
    }
    const timer = setInterval(() => {
      this.values = {
        andan: Math.random().toFixed(2),
        cod: Math.random().toFixed(2),
        ll: Math.random().toFixed(2),
        zl: Math.random().toFixed(2),
        ph: Math.random().toFixed(2)
      };
    }, 1000);
  }
};
</script>

<style lang='scss' scoped>
.device_img {
  width: 100%;
}
.device-tag {
  list-style: none;
  margin-top: 0;
  & .device-item {
    width: 100%;
    margin-bottom: 10px;
    text-align: center;
  }
  & .device-item-tag {
    width: 100%;
  }
}
.el-alert__content {
  margin: 0 auto;
}
.aaa {
  background-color: #000;
}
</style>