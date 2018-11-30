<template>
  <!-- <div>
    <my-echart v-model='echartsData' @init='barClick'></my-echart>
  </div>-->
  <ve-histogram :after-config="afterConfig" height="500px" :extend="echartsData"></ve-histogram>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      echartsData: {},
      xfield: [],
      yfield: [],
      legend: [],
      series: [],
      colors: ['#5793f3', '#d14a61', '#675bba'],
      chart: null
    }
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    }
  },
  watch: {
    data: {
      handler(newval) {
        console.log(newval, 'newval', Object.keys(newval))
        this.handlerData(newval)
      }
      // deep: true,
      // immediate: true
    }
  },
  methods: {
    afterConfig(options) {
      // console.log(this.getData(), 'after config.......1111111111111')
      return this.echartsData
    },
    barClick(chart) {
      this.chart = chart
      chart.on('click', params => {
        console.log(params)
      })
    },
    getXField(data) {
      const name = data.name
      const num = data.num
      const names = []
      for (let i = 1; i <= num; i++) {
        names.push(name + i)
      }
      return names
    },
    getFields(data) {
      const itemField = {}
      // data.items = data.items||[]
      data.items.forEach((item, key) => {
        for (const fieldKey in item) {
          if (!itemField[fieldKey] && fieldKey !== 'consta') {
            itemField[fieldKey] = {}
            itemField[fieldKey]['data'] = []
          }
          if (fieldKey !== 'consta') {
            itemField[fieldKey].name = item[fieldKey][fieldKey + '_name']
            itemField[fieldKey].data.push(item[fieldKey][fieldKey + '_value'])
          }
        }
      })
      console.log(itemField)
      const colors = this.colors
      const postions = ['left', 'right']
      const keys = Object.keys(itemField)
      this.yfield = []
      this.series = []
      this.legend = []
      for (const xkey in keys) {
        const curKey = keys[xkey]
        this.yfield.push({
          type: 'value',
          name: itemField[curKey].name,
          min: 'dataMin',
          max: 'dataMax',
          position: xkey > 0 ? 'right' : 'left',
          offset: xkey > 1 ? 70 : 0,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[xkey]
            }
          },
          axisLabel: {
            formatter: '{value} ' + data.unit[curKey]
          }
        })
        this.legend.push(itemField[curKey].name)
        this.series.push({
          ...itemField[curKey],
          yAxisIndex: xkey,
          type: 'bar'
        })
      }
      console.log(this.yfield)
      console.log(this.series)
      // return itemField;
    },
    handlerData(data) {
      if (Object.keys(data).length === 0) {
        this.xfield = []
        this.yfield = []
        this.legend = []
        this.series = []
        if (this.chart) this.chart.clear()
      } else {
        this.xfield = this.getXField(data)
        this.getFields(data)
      }

      this.echartsData = this.getData()
    },
    getData() {
      const option = {
        color: this.colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: this.legend
        },
        grid: {
          // right: '15%'
        },
        xAxis: [],
        yAxis: this.yfield,
        series: this.series
      }
      if (this.xfield.length > 0) {
        option.xAxis = [
          {
            type: 'category',
            data: this.xfield,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          }
        ]
      } else {
        option.xAxis = []
      }

      return option
    }
  },
  created() {
    console.log('chart created....', this.data)
  },
  mounted() {
    this.handlerData(this.data)
  },
  destroyed() {
    this.chart = null
  }
}
</script>

<style>
</style>
