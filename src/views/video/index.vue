<template>
  <div class="table-layout">
    <f-button content="+" direction="lb" class="pb" :radius="80" ref="target_1">
      <div class="my-icon-button indexicon icon-popup" @click="sub_log(4)">4屏</div>
      <div class="my-icon-button indexicon icon-popup" @click="sub_log(8)">8屏</div>
    </f-button>
    <div class="table-inner">
      <div class="video">
        <div v-cloak v-nvideo="item" v-for="(item, index) in data" :key="index" class="video-item"></div>
      </div>
    </div>
  </div>
</template>

<script>
import nvideo from "@/directive/video";
import fButton from "@/views/common/components/flatbutton";
import { fetchList } from "@/api/video";

export default {
  components: { fButton },
  directives: { nvideo },
  data() {
    return {
      data: [],
      prefix: "gd_",
      initData: []
    };
  },
  methods: {
    sub_log(val) {
      this.data = this.formatUrl(val);
      this.$refs.target_1.collapse();
    },
    formatUrl(num = 4) {
      const widths = { 4: "49%", 8: "24%" };
      let width = widths[num];
      const emptyPair = { url: "", width: width };
      let data = this.initData;
      let len = data.length;
      data = data.map(item => {
        item.width = width;
        return item;
      });
      for (let $i = num - len; $i > 0; $i--) {
        data.push(emptyPair);
      }
      return data;
    }
  },
  created() {
    fetchList().then(res => {
      this.initData = res.data.data;
      this.data = this.formatUrl();
    });
  }
};
</script>

<style lang="scss" scoped>
.table-inner {
  width: 100%;
  position: relative;
  // background-color: rgb(8, 8, 8);
}
.video {
  text-align: center;
  // padding: 10px 0;
  // background-color: rgb(8, 8, 8);
  // display: flex;
  // align-items: center;
  // justify-content: flex-start;
  // flex-wrap: wrap;
}
.pb {
  width: 60px;
  height: 60px;
  line-height: 60px;
  color: #fff;
  position: absolute;
  top: 20px;
  right: 10px;
  cursor: pointer;
  z-index: 9999;
  /deep/ .mint-main-button {
    background-color: $baseColor;
  }
}
.my-icon-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: $baseColor;
  color: #fff;
  line-height: 40px;
  text-align: center;
}
.mint-main-button {
  color: #000;
  background-color: #26a2ff;
}
</style>
<style>
.video-item {
  margin-bottom: 10px;
  margin-right: 10px;
  display: inline-block;
}
</style>

