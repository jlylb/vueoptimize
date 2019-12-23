<template>
  <ve-histogram
    :data="chartData"
    :after-config="afterConfig"
    height="700px"
    :extend="echartsData"
  ></ve-histogram>
</template>

<script>
import { getDataValue } from "@/utils";

export default {
  components: {},
  data() {
    return {
      echartsData: {},
      xfield: [],
      timeField: [],
      yfield: [],
      legend: [],
      series: [],
      optonsData: [],
      colors: ["#5793f3", "#d14a61", "#675bba"],
      chart: null,
      chartData: {}
    };
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {};
      }
    }
  },
  watch: {
    data: {
      handler(newval) {
        console.log(newval, "newval", Object.keys(newval));
        this.handlerData(newval);
      }
    }
  },
  methods: {
    afterConfig(options) {
      // return this.getData()
      return options;
    },
    getXField(data) {
      const names = [];
      for (let x in data.surfix) {
        names.push(data.surfix[x]);
      }
      return names;
    },
    getFields(data) {
      this.yfield = [];
      this.series = [];
      this.legend = [];
      this.xfield = [];
      this.optonsData = [];
      const colors = this.colors;
      const keys = Object.keys(data.surfix);

      for (const key in data.surfix) {
        let item = {};
        let name = data.surfix[key];
        item.title = { text: name, show: false };

        item.yAxis = {
          type: "value",
          name: name,
          // min: 'dataMin',
          max: value => {
            return value.max + 10;
          },
          position: "left",
          axisLabel: {
            formatter: "{value} " + data.unit[key]
          },
          axisLine: {
            show: true,
            lineStyle: {
              // color: colors[xkey%3]
            }
          }
        };
        item.series = [];
        item.legend = { data: [] };
        const dataItems = getDataValue(data.items, [key], []);
        for (let dataItem in dataItems) {
          let curData = dataItems[dataItem];
          this.xfield = Object.keys(curData)
            .sort()
            .reverse();
          let itemData = this.xfield.map(xkey => {
            return curData[xkey];
          });
          let idx = dataItem.replace(key, "");
          item.legend.data.push(name + idx);
          item.series.push({
            name: name + idx,
            type: "bar",
            barWidth: "20%",
            // yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: colors[(idx - 1) % 3]
              }
            },
            data: itemData
          });
        }
        this.optonsData.push(item);
      }
    },
    handlerData(data) {
      if (Object.keys(data).length === 0) {
        this.xfield = [];
        this.timeField = [];
        this.yfield = [];
        this.legend = [];
        this.series = [];
        if (this.chart) this.chart.clear();
      } else {
        this.timeField = this.getXField(data);
        this.getFields(data);
      }

      this.echartsData = this.getData();
    },
    getData() {
      const option = {
        baseOption: {
          timeline: {
            data: this.timeField,
            left: "10%",
            right: "10%",
            // top: '5%',
            bottom: "10%",
            height: 50,
            axisType: "category",
            show: true,
            autoPlay: false,
            playInterval: 1000,
            checkpointStyle: {
              color: "#04a5f1",
              borderColor: "rgba(4, 165, 261, .5)"
            },
            label: {
              normal: {
                formatter: function(v) {
                  var _txt = v.replace(/\//gim, "\n");
                  return _txt;
                },
                // rotate:-30, //角度
                position: "bottom"
              }
            },
            itemStyle: {
              normal: {
                color: "#04a5f1"
              },
              emphasis: {
                color: "#04a5f1"
              }
            },
            lineStyle: {
              color: "#ddd"
            },
            controlStyle: {
              show: false
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "rgba(255,255,255,0.8)",
                extraCssText: "box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);",
                textStyle: {
                  color: "#666"
                }
              }
            },
            backgroundColor: "rgba(255,255,255,0.8)",
            extraCssText: "box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);",
            textStyle: {
              color: "#666"
            }
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {
                show: true,
                type: ["bar", "line"]
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          // legend: {
          //   data: this.legend
          // },
          grid: [
            {
              left: "3%",
              right: "3%",
              top: "8%",
              height: "72%",
              bottom: "20%",
              containLabel: true
            }
          ],
          xAxis: [],
          dataZoom: [],
          yAxis: [
            {
              type: "value",
              // min: 'dataMin',
              max: value => {
                return value.max + 10;
              },
              position: "left",

              axisLine: {
                show: true,
                lineStyle: {
                  // color: colors[xkey]
                }
              }
            }
          ],
          //series: this.series
          series: [
            {
              type: "bar",
              barWidth: "20%"
            }
          ]
        },

        options: [...this.optonsData]
      };

      if (this.xfield.length > 0) {
        option.baseOption.xAxis = [
          {
            type: "category",
            data: this.xfield,
            axisLabel: {
              // 坐标轴刻度标签的相关设置。
              interval: 0, // 设置为 1，表示『隔一个标签显示一个标签』
              // rotate:-30,
              textStyle: {
                color: "#666",
                fontStyle: "normal"
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            axisLine: {
              // 坐标轴轴线相关设置
              show: true,
              lineStyle: {
                color: "#666",
                opacity: 1
              }
            },
            splitLine: {
              // 坐标轴在 grid 区域中的分隔线。
              show: false
            }
          }
        ];
        option.baseOption.dataZoom = [
          {
            type: "inside",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 35
          },
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: "50%",
            handleSize: 8,
            bottom: 0,
            left: "10%",
            right: "10%",
            handleColor: "#ddd",
            fillerColor: "#5793f3",
            // labelFormatter: (value) => {
            //   console.log(value)
            //   return this.xfield[value].replace(/\s/, '\n');
            // },
            handleStyle: {
              borderColor: "#cacaca",
              borderWidth: "1",
              shadowBlur: 2,
              background: "#ddd",
              shadowColor: "#ddd"
            }
          }
        ];
      } else {
        option.baseOption.xAxis = [];
        option.baseOption.dataZoom = [];
      }
      console.log(option, "option");
      return option;
    }
  },
  created() {},
  mounted() {
    console.log(this.data, "mounted chart2.....");
    this.handlerData(this.data);
  },
  destroyed() {
    this.chart = null;
  }
};
</script>

<style></style>
