<template>
     <div class='table-layout'>
        <div class='table-layout-inner'>
            <el-row style='margin-bottom: 20px;' :gutter="20">
                <el-col :span='10' style='height: 500px;'>
                    <yibiaopan ></yibiaopan>
                </el-col>
                <el-col :span='14' style='height: 500px;'>
                    <chart-component id='chart3' :options='option1'></chart-component>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24' style='height: 500px;'>
                    <chart-component id='chart2' :options='option'></chart-component>
                </el-col>
            </el-row>
        </div>
    </div> 
</template>

<script>
import yibiaopan from '@/components/Charts/yibiaopan'
import chartComponent from '@/components/Charts/chartComponent'

function getCategory() {
  var category = []
  for (var i = 0; i < 24; i++) {
    category.push(i + '点')
  }
  return category
}

function getData() {
  const data = []
  for (var i = 0; i < 24; i++) {
    data.push(Math.random().toFixed(3))
  }
  return data
}

function setSeries(title) {
  const series = []
  for (let i = 1; i < 6; i++) {
    series.push({
      name: i + '# ' + (title || 'A'),
      type: 'line',
      smooth: true,
      showAllSymbol: true,
      showSymbol: false,
      symbol: 'emptyCircle',
      symbolSize: 5,
      data: getData()
    })
  }
  return series
}

export default {
  components: { yibiaopan, chartComponent },
  data() {
    return {
      timer: null,
      option: {
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['1# A', '2# A', '3# A', '4# A', '5# A'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: getCategory(),
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: setSeries()
      },

      option1: {
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['1# HZ', '2# HZ', '3# HZ', '4# HZ', '5# HZ'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: getCategory(),
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        series: setSeries('HZ')
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  created() {
    this.timer = setInterval(() => {
      const options = this.option
      options.series = setSeries()
      this.option = options
      const options1 = this.option1
      options1.series = setSeries('HZ')
      this.option1 = options1
    }, 2000)
  }

}
</script>

<style lang='scss'>

</style>
