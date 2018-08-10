<template>
<div>
  <my-echart v-model='echartsData' ></my-echart>
</div>
</template>

<script>
import echarts from 'echarts'
import MyEchart from '@/components/Charts/myechart'

export default {
  components: { MyEchart },
  data() {
    return {
      echartsData: this.getData()
    }
  },
  methods: {
    getData() {

      const hours = function() {
        const data = []
        for (let i = 0; i < 24; i++) {
          data[i] = i + '点'
        }
        return data
      }

      const datas = function() {
        const data = []
        for (let i = 0; i < 24; i++) {
          data[i] = Math.ceil(Math.random() * 1000)
        }
        return data
      }

      return {
        backgroundColor: 'rgb(40, 49, 60)',
        title: {
          top: 20,
          text: '每小时报警统计',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '12%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        grid: {
          top: 50,
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: hours()
        }],
        yAxis: [{
          type: 'value',
          name: '数量',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 20,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: '报警',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(255,0,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: datas()
        }]
      }

    }
  }
}
</script>
