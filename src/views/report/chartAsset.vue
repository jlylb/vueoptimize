<template>
<div>
  <my-echart v-model='echartsData' @init='barClick'></my-echart>

</div>
</template>

<script>

import MyEchart from "@/components/Charts/myechart";

export default {
  components: { MyEchart },
  data() {
    return {
      echartsData: {},
      dataLevel: {},
    }
  },
  props: {
    title: {
      type: [String, Number],
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: [String, Number],
      default: 0
    },
  },
  watch: {
    data: {
      handler(newval) {
        this.dataLevel = this.formatWarnLevel(newval)
        this.echartsData = this.getData()
      },
      immediate: true
    }
  },
  created(){
    this.echartsData = this.getData()
  },
  methods: {
    barClick(chart) {
      chart.on('click', (params) => {

        const options = this.echartsData
        const barData = params.data
        console.log(params);

        if(params.componentSubType==='pie' || params.componentSubType==='bar') {
          let { dpt_id } = barData

          this.$router.push({ name: 'api.deviceinfo.index', params: { dpt_id } })
        }

      })
    },
    getMax() {
      return this.total
    },
    getTotal() {
       return this.total
    },


    formatWarnLevel(data) {
      let lvls = {}

      return lvls
    },
    getKeys() {
      let keys = []
      for(const keyIndex in this.data) {
        let curKey = this.data[keyIndex].name
        if(keys.indexOf(curKey) < 0) {
          keys.push(curKey)
        }      
      }
      return keys
    },

    getData() {

      const option = {

        backgroundColor: '#fff',
        legend: {
            orient: 'horizontal',
            right: '3%',
            bottom: '20%',
            width: '50%',
            data: this.data.map((item) => {
              return item.name
            })
        },
    tooltip: {
        show: true,
        trigger: 'item',
        // formatter: "{b}: {c} ({d}%)"
    },
    title: [{
        text: '设备资产统计',
        subtext: '总计 ' + this.getTotal(),
        x: '25%',
        textAlign: 'center'
    }, {
        text: '设备占比',
        subtext: '总计 ' + this.getTotal(),
        x: '75%',
        textAlign: 'center'
    }],
        xAxis: {
          type: "value",
          max: this.getMax(),
          splitLine: {
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
        width: '50%',
        // bottom: '45%',
        left: 10,
        containLabel: true
        }, {
            top: '55%',
            width: '50%',
            bottom: 0,
            left: 10,
            containLabel: true
        }
        ],
        series: [
          {
              type: 'bar',
              stack: 'chart',
              z: 3,
              label: {
                  normal: {
                      position: 'right',
                      show: true
                  }
              },
              data: this.data
            }, 
            {
              type: 'bar',
              stack: 'chart',
              silent: true,
              itemStyle: {
                  normal: {
                      color: '#eee'
                  }
              },
              data: this.data.map((item) => {
                  return this.getMax() - item.value;
              })
            },
            {
              type: 'pie',
              radius: ['35%', '50%'],
              color: ['rgba(194, 53, 49,0.9)', '#ff7e40', '#e6a23c', '#409eff'],
              center: ['75%', '35%'],
              tooltip: {
                formatter: "{b}: {c} ({d}%)"
              },
              label: {
                  normal: {
                      // position: 'inner',
                      formatter: '{b} {d}%',

                      textStyle: {
                          // color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 14
                      }
                  }
              },
              data: this.data
          }

        ]
      }
      return option
    }
  }
};
</script>

