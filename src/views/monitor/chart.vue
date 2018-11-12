<template>
  <ve-histogram :data="chartData" :settings="chartSettings" :extend='chartExtend' :after-config='afterConfig' height='500px'></ve-histogram>
</template>

<script>

export default {
  components: {  },
    data() {
    return {
      chartData: {},
      chartSettings: {},
      chartExtend: {},
      colors: ['#5793f3', '#d14a61', '#675bba']
    }
  },
  props: {
    data: {
      type: [Object, Array],
      default() {
        return {}
      }
    },
  },
  watch: {
    data: {
      handler(newval) {
        console.log(newval, 'watch newval')
        this.handlerData()
      },
     // deep: true,
    // immediate: true
    }
  },
  methods: {
    afterConfig (options) {
      console.log(options, 'charts ....')
       const { fields, unit, fieldDesc } = this.data
       fields.map((field, index) => {

          if(index > 1) {
            options.series[index].yAxisIndex = index;

            options.yAxis[index] = {
              min: 0,
              max: 100,
              position: 'right',
              offset: 80,
              show: true,
              type: 'value',
              name: fieldDesc[field] +' '+ unit[field],
              axisTick: {show: true},
            }
          }
          options.yAxis[index].axisLine = {
              show: true,
              lineStyle: {
                  color: this.colors[index]
              }
          }
       })
       options.tooltip = {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
        }
      console.log(options, 'charts .... after')
      return options
    },
    handlerData() {
      const { items, name, fields, unit, fieldDesc } = this.data
      const  rows = []
      const yAxisType = [], xAxisType = [ 'category' ], yAxisName = []
      items.forEach((item, index) => {
        let cur = { name: `${name}${index + 1}` }
        fields.forEach((field) => {
          cur[field] = item[field][field + '_value'];
        })
        rows.push(cur)
      })

      
      let columns = [], labelMap = fieldDesc, right = [], axisSite = {}
      let min = [], max = [], series = [], yAxis = []

      fields.map((field, index) => {
        min.push(0)
        max.push(100)
        yAxisType.push('value')
        columns.push(field)
        yAxisName.push(fieldDesc[field] +' '+ unit[field])
        if(index > 0) {
          right.push(field)
        }
      })
      axisSite = { right }

      columns = ['name'].concat(columns)

      this.chartData = {
        columns, rows
      }

      this.chartSettings = {
        yAxisType, xAxisType, labelMap, min, max,  yAxisName, axisSite,
      }

      this.series = series

      this.yAxis = yAxis

      this.chartExtend = {
        color: this.colors,
        grid: {
           left: '2%',
           right: '8%'
        },
      }
    }

  },
  created() {
    console.log('chart created....', this.data)
  },
  mounted() {
    this.handlerData()
  },
  destroyed() {

  }
}
</script>

<style>
</style>
