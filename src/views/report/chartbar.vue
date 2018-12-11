<template>
  <ve-histogram
    :after-config="afterConfig"
    height="100vh"
    :events="chartEvents"
    :extend="echartsData"
  ></ve-histogram>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      echartsData: {},
      chartData: {},
      dataLevel: {},
      chartEvents: {},
      levelTxt: {
        1: "一级告警",
        2: "二级告警",
        3: "三级告警",
        4: "四级告警"
      }
    };
  },
  props: {
    title: {
      type: [String, Number],
      default: ""
    },
    warn: {
      type: Array,
      default() {
        return [];
      }
    },
    level: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    warn: {
      handler(newval) {
        console.log(newval, "warn ..............");
        this.dataLevel = this.formatWarnLevel(newval);
        this.echartsData = this.getData();
      },
      immediate: true
    }
  },
  mounted() {
    this.chartEvents = {
      click: params => {
        this.barClick(params);
      }
    };
    // this.echartsData = this.getData()
  },
  methods: {
    afterConfig(options) {
      // console.log(this.getData(), 'after config.......1111111111111')
      return this.echartsData;
    },
    barClick(params) {
      const options = this.echartsData;
      const barData = params.data;
      console.log(params);
      if (params.componentSubType === "bar") {
        let { pdi_index: pdiIndex } = barData;
        options.title[1].text = "设备: " + pdiIndex + " 告警等级占比";
        options.title[1].subtext = "总计 " + params.value;
        let pdiItem = this.formatKeys()[pdiIndex];
        let pdiLevel = this.formatWarnLevel(pdiItem);
        console.log(pdiItem, pdiLevel);
        options.series[2]["data"] = Object.values(pdiLevel).map(function(item) {
          return {
            name: item.name,
            value: +item.num,
            pdi_index: pdiIndex,
            lvl: item.lvl
          };
        });
        console.log(options);
        this.echartsData = options;
      }
      if (params.componentSubType === "pie") {
        let { pdi_index, lvl } = barData;

        this.$router.push({
          name: "api.report.index",
          params: { lvl: lvl, pdi_index }
        });
      }
    },
    getMax() {
      return Math.max(...Object.values(this.getNum()));
    },
    getTotal() {
      let nums = this.getNum();
      return Object.keys(nums).reduce((all, item) => {
        return all + nums[item];
      }, 0);
    },
    getNum() {
      let nums = {};
      for (const keyIndex in this.warn) {
        let curKey = this.warn[keyIndex].pdi_index;
        let curVal = this.warn[keyIndex].value;
        if (!nums[curKey]) {
          nums[curKey] = +curVal;
        } else {
          nums[curKey] += +curVal;
        }
      }
      return nums;
    },
    formatWarn() {
      let nums = {};
      for (const keyIndex in this.warn) {
        let curKey = this.warn[keyIndex].pdi_index;
        let curVal = this.warn[keyIndex].value;
        let lvl = this.warn[keyIndex].wd_level0;

        if (!nums[curKey]) {
          nums[curKey] = {
            value: curVal,
            pdi_index: curKey,
            name: this.warn[keyIndex].name
          };
        } else {
          nums[curKey]["vaule"] += curVal;
        }
      }
      return nums;
    },
    formatWarnLevel(data) {
      let lvls = {};
      for (const keyIndex in data) {
        let curVal = +data[keyIndex].value;
        let lvl = data[keyIndex].wd_level0;

        if (!lvls[lvl]) {
          lvls[lvl] = { num: curVal, lvl: lvl, name: this.levelTxt[lvl] };
        } else {
          lvls[lvl]["num"] += curVal;
        }
      }
      return lvls;
    },
    getKeys() {
      let keys = [];
      for (const keyIndex in this.warn) {
        let curKey = this.warn[keyIndex].pdi_index;
        if (keys.indexOf(curKey) < 0) {
          keys.push(curKey);
        }
      }
      return keys;
    },
    formatKeys() {
      let items = {};
      for (const keyIndex in this.warn) {
        let curKey = this.warn[keyIndex].pdi_index;
        if (!items[curKey]) {
          items[curKey] = [];
        }
        items[curKey].push(this.warn[keyIndex]);
      }
      return items;
    },
    getData() {
      const option = {
        // backgroundColor: '#dfefbd',
        backgroundColor: "#fff",
        legend: {
          orient: "vertical",
          right: 10,
          top: 20,
          data: Object.values(this.levelTxt)
        },
        tooltip: {
          show: true,
          trigger: "item"
          // formatter: "{b}: {c} ({d}%)"
        },
        title: [
          {
            text: "历史告警统计",
            subtext: "总计 " + this.getTotal(),
            x: "25%",
            textAlign: "center"
          },
          {
            text: "告警等级占比",
            subtext: "总计 " + this.getTotal(),
            x: "75%",
            textAlign: "center"
          }
        ],
        xAxis: {
          type: "value",
          max: this.getMax() + 20,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
          // data: times
        },
        yAxis: {
          type: "category",
          data: this.getKeys(),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        grid: [
          {
            top: 50,
            width: "50%",
            // bottom: '45%',
            left: 10,
            containLabel: true
          },
          {
            top: "55%",
            width: "50%",
            bottom: 0,
            left: 10,
            containLabel: true
          }
        ],
        series: [
          {
            type: "bar",
            stack: "chart",
            // barWidth:20,
            z: 3,
            label: {
              normal: {
                position: "right",
                show: true
              }
            },
            data: Object.values(this.formatWarn())
          },
          {
            type: "bar",
            stack: "chart",
            silent: true,
            itemStyle: {
              normal: {
                color: "#eee"
              }
            },
            data: Object.values(this.formatWarn()).map(item => {
              return this.getMax() + 20 - item.value;
            })
          },
          {
            type: "pie",
            radius: ["35%", "50%"],
            color: ["rgba(194, 53, 49,0.9)", "#ff7e40", "#e6a23c", "#409eff"],
            center: ["75%", "35%"],
            tooltip: {
              formatter: "{b}: {c} ({d}%)"
            },
            label: {
              normal: {
                // position: 'inner',
                formatter: "{b} {d}%",

                textStyle: {
                  // color: '#fff',
                  fontWeight: "bold",
                  fontSize: 14
                }
              }
            },
            data: Object.values(this.dataLevel).map(function(item) {
              return {
                name: item.name,
                value: +item.num,
                lvl: item.lvl
              };
            })
          }
        ]
      };
      return option;
    }
  }
};
</script>

