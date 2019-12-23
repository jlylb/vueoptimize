<template>
  <ve-histogram
    :after-config="afterConfig"
    height="500px"
    :data="chartData"
    :settings="chartSettings"
  ></ve-histogram>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      colors: ["#5793f3", "#d14a61", "#675bba"],
      chartData: {},
      sourceData: this.inputData,
      chartSettings: {}
    };
  },
  props: {
    inputData: {
      type: [Object, Array],
      default() {
        return {};
      }
    },
    first: {
      type: String,
      default: null
    }
  },
  watch: {
    inputData: {
      handler(newval) {
        console.log(newval, "newval......");
        this.sourceData = newval;
        this.getCurrentData();
      }
      // deep: true,
      // immediate: true
    },
    first(nval) {
      if (!nval) return;
      this.getCurrentData();
    }
  },
  methods: {
    afterConfig(options) {
      return options;
    },
    getCurrentData() {
      if (!this.sourceData.items) return;
      if (!this.first) return;
      const field = this.first;
      const columns = [`${field}_name`, `${field}_value`];
      this.chartSettings = {
        labelMap: {
          [`${field}_value`]: this.sourceData.fieldDesc[field]
        },
        yAxisName: [this.sourceData.unit[field]]
      };
      const rows = this.sourceData.items[field];
      this.chartData = { columns, rows };
    }
  },
  created() {},
  mounted() {
    this.getCurrentData();
  },
  destroyed() {}
};
</script>

<style></style>
