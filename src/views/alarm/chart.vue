<template>
  <div>
    <my-echart v-model='echartsData' @init='barClick'></my-echart>
</div>
</template>

<script>

import MyEchart from "@/components/Charts/myechart";
import { getDataValue } from '@/utils'

export default {
  components: { MyEchart },
    data() {
    return {
      echartsData: {},
      xfield: [],
      timeField: [],
      yfield: [],
      legend: [],
      series: [],
      optonsData: [],
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
    },
  },
  watch: {
    data: {
      handler(newval) {
        console.log(newval, 'newval', Object.keys(newval))
        this.handlerData(newval)
      },

    }
  },
  methods: {
    barClick(chart) {
      this.chart = chart
      chart.on('click', (params) => {
        console.log(params)
      })
    },
    getXField(data){
      let name = data.name
      let num = data.num
      let names = []
      for(let i=1; i<= num; i++) {
        names.push(name+i)
      }
      return names
    },
    getFields(data){
      this.yfield = []
      this.series = []
      this.xfield = []
      this.optonsData = []
      const colors = this.colors;
      const keys = data.fields;
      const items = getDataValue(data, ['items']);
      const num = data.num;
      let fieldDesc = []

      items.forEach((item, i) => {
        let seriesItem = {}
        seriesItem.title = { text: data.name + (i+1), show: false}
        seriesItem.series = []
        let dataItem = []
        let dataItem1 = {}
        fieldDesc = []
        keys.forEach((field) => {
          let hwarn = getDataValue(item, [field, 'hwarn_name']).replace(/\d+/,'');
          let lwarn = getDataValue(item, [field, 'lwarn_name']).replace(/\d+/,'');
          fieldDesc.push(hwarn)
          fieldDesc.push(lwarn)
          dataItem1[hwarn] = getDataValue(item, [field, 'hwarn_value'])
          dataItem1[lwarn] = getDataValue(item, [field, 'lwarn_value'])
        })

        let consta = getDataValue(item, ['consta', 'consta_name'])
        fieldDesc.push(consta)
         dataItem1[consta] = getDataValue(item, ['consta', 'consta_value'])
        // dataItem.map((item)=>{
        //   seriesItem.series.push({
        //     data: [item]
        //   })
        // })
seriesItem.series.push({
  data: Object.values(dataItem1)
})

seriesItem.series.push({
  data: Object.values(dataItem1).map((item)=>{
    return 1-item
  })
})



        this.yfield = {
          type: "category",
          data: fieldDesc
        }
        this.optonsData.push(seriesItem)
      })

      fieldDesc.forEach((item, xkey) => {
            this.series.push({
               // name: item,
                stack: 'chart',
                z:3,
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    align: 'center',
                    formatter: function(v) {
                        var val = v.data;
                        let str=''
                        if(v.name.indexOf('下限')>-1){
                          str=val==0?'':'过低'
                        }else if(v.name.indexOf('上限')>-1){
                          str=val==0?'':'过高'
                        }else{
                          str=val==0?'':'断线'
                        }
                        return str
                    },
                    color: '#fff'
                },
                },
                itemStyle: {
                  normal: {
                      color:  '#F56C6C'
                  }
                }
            })
            this.series.push({
                // name: item,
                stack: 'chart',
                type: 'bar',
                silent: true,
                label: {
                  normal: {
                    show: true,
                    align: 'center',
                    formatter: function(v) {
                        var val = v.data;
                        let str=''
                        if(v.name.indexOf('下限')>-1){
                          str=val==1?'正常':''
                        }else if(v.name.indexOf('上限')>-1){
                          str=val==1?'正常':''
                        }else{
                          str=val==1?'正常':''
                        }
                        return str
                    },
                    color: '#fff'
                },
                },
                itemStyle: {
                  normal: {
                      color:  '#67C23A'
                  }
                },
            })
      })

console.log(this.series,this.optonsData,'fielddes...')

    },
    handlerData(data) {
        if(Object.keys(data).length === 0) {
           this.xfield = [];
           this.timeField = [];
           this.yfield = [];
           this.legend = [];
           this.series = [];
           if(this.chart) this.chart.clear()
        }else{
          this.timeField = this.getXField(data)
          this.getFields(data)
        }

        this.echartsData = this.getData()
    },
    getData() {

let option = {
  baseOption: {
    timeline: {
        data: this.timeField,
        left:'10%',
        right:'10%',
        // top: '5%',
        bottom: 0,
        height:50,
        axisType: 'category',
        show: true,
        autoPlay: false,
        playInterval: 1000,
        checkpointStyle: {
            color: '#04a5f1',
            borderColor: 'rgba(4, 165, 261, .5)'
        },
        label:{
          normal:{
            formatter: function(v) {
              var _txt = v.replace(/\//igm, '\n');
              return _txt;
            }, 
            // rotate:-30, //角度
            position:'bottom'
          }
        },
        itemStyle: {
            normal: {
                color: '#04a5f1'
            },
            emphasis: {
                color: '#04a5f1'
            }
        },
        lineStyle: {
            color: '#ddd'
        },
        controlStyle:{
                show: false,
              },
    },
 

        grid: {
          left: '3%',
          right: '3%',
          // top: '8%',
          // height: '72%',
          // bottom: '20%',
          containLabel: true
         },

        xAxis: [
        ],
        yAxis: this.yfield,
        series: this.series, 
  },

    options: [
    ...this.optonsData
  ]   
};
this.xfield = [1]
if(this.xfield.length > 0) {
  option.baseOption.xAxis = [
    {
        type: 'value',
        // show: false,
        splitNumber: 1,
        data: [1],
        axisLabel: { 
				interval: 0,
			    //rotate:-30,
				textStyle: {
					color: '#666',
					fontStyle: 'normal',
				}
      },
      axisLabel: {
          show: false
        },
      axisLine:{//坐标轴轴线相关设置
          lineStyle:{
            color:'#666',
            opacity:1
          }
        },
      splitLine: { //坐标轴在 grid 区域中的分隔线。
          show: false,
        }
      }
  ] 

}else{
  option.baseOption.xAxis = []

}
console.log(option , 'option')
      return option
    }
  },
  created() {

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
