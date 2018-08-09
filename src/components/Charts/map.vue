<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { debounce } from '@/utils'

export default {

  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      //       this.chart = echarts.init(document.getElementById(this.id))

      // this.chart.setOption(option)
      const vm = this
      var GDEcharts = function(options) {
        this.container = document.getElementById(options.containerId)
        this.adcode = options.adcode ? options.adcode : 100000
        this.echartOption = options.echartOption
        this.timeStamp = 0

        this.geoData = {
          'type': 'FeatureCollection',
          'features': []
        }
        this.breadcrumbData = [{
          name: '全国',
          adcode: 100000
        }]
        this.testData = []

        this.echart
        this.districtExplorer

        this.init()
      }
      GDEcharts.prototype = {
        constructor: constructor,

        init: function() {
          if (!this.echart) this.initEchart()
          if (!this.districtExplorer) this.initDistrictExplorer()
          this.echart.showLoading()

          var _this = this
          setTimeout(function() {
            // 通过adcode获取下级城市数据
            _this.districtExplorer.loadAreaNode(_this.adcode, function(error, areaNode) {
              _this.geoData.features = areaNode.getSubFeatures()
              echarts.registerMap(_this.adcode, _this.geoData)

              _this.createBreadcrumb(areaNode)
              _this.createTestData()
              _this.renderChart()
            })
          }, 500)

          return this
        },

        initEchart: function() {
          this.echart = echarts.init(this.container)
          var _this = this
          _this.echart.on('georoam', function(d) {
            if (d.timeStamp != _this.timeStamp) {
              var components = _this.echart.getModel()
              components.eachComponent({
                mainType: 'series'
              }, function(componentModel) {
                var dcenter = componentModel.option.dCenter
                componentModel.option.center = _this.echart.convertToPixel('geo', dcenter)
              })

              var p = {
                componentType: 'geo',
                geoId: 'series00',
                type: 'geoRoam',
                originX: d.originX,
                originY: d.originY,
                zoom: d.zoom,
                timeStamp: d.timeStamp,
                roamType: 'zoom'
              }
              if (d.roamType == 'pan') {
                p = {
                  componentType: 'geo',
                  geoId: 'series00',
                  type: 'georoam',
                  dx: d.dx,
                  dy: d.dy,
                  timeStamp: d.timeStamp,
                  roamType: 'pan'
                }
              }

              _this.timeStamp = d.timeStamp
              _this.echart._api.dispatchAction(p)
            }
          })
          _this.echart.on('click', function(event) {
            var componentType = event.componentType
            var childrenNum = 0
            var name

            // 根据目标类型获取adocde和下级区域数量
            if (event.componentType == 'geo') {
              name = event.name

              // 通过名称从geoData获取数据
              var data = _this.geoData.features
              for (var i = 0, len = data.length; i < len; i++) {
                var properties = data[i].properties
                if (properties.name == name) {
                  childrenNum = properties.childrenNum
                  _this.adcode = properties.adcode
                  break
                }
              }
            } else {
              childrenNum = event.data.childrenNum
              _this.adcode = event.data.adcode
              name = ''
            }

            if (childrenNum > 0) {
              _this.init()
            } else {
              console.log('无下级区域！')
              console.log(event)
              vm.$router.push({ name: 'alarm_detail', params: { adcode: _this.adcode, name: name }})
            }
          })
        },

        initDistrictExplorer: function() {
          var _this = this
          if (!_this.districtExplorer) {
            AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
              _this.districtExplorer = new DistrictExplorer()
            })
          }
        },

        renderChart: function() {
          var geo = this.echartOption.geo
          geo.map = this.adcode
          switch (this.adcode) {
            case 100000: // 全国
              geo.zoom = 1.5
              geo.center = [104.114129, 34.550339]
              break
            case 460000: // 海南省
              geo.zoom = 5
              geo.center = [110.33119, 19.031971]
              break
            default:
              geo.zoom = null
              geo.center = null
              break
          }

          this.echart.hideLoading()
          this.echart.clear()
          this.echart.setOption(this.echartOption)
          this.drawPie()
        },

        createBreadcrumb: function(areaNode) {
          var props = areaNode.getProps()

          // 遍历当前导航数据，判断目标数据是否已存在，并重新构造数据
          var breadcrumbData = this.breadcrumbData
          var newBreadcrumbData = []
          var isIn = false
          for (var i = 0, len = breadcrumbData.length; i < len; i++) {
            newBreadcrumbData.push(breadcrumbData[i])
            if (breadcrumbData[i].adcode == props.adcode) {
              isIn = true
              break
            }
          }
          if (isIn) {
            this.breadcrumbData = newBreadcrumbData
          } else {
            this.breadcrumbData.push({
              name: props.name,
              adcode: props.adcode
            })
          }

          // 根据最新导航数据，构造echart option
          var graphic = []
          var concatString = ''
          breadcrumbData = this.breadcrumbData
          for (var j = 0, len = breadcrumbData.length; j < len; j++) {
            breadcrumbData[j].concatString = concatString
            graphic = graphic.concat(this.createBreadcrumbOption(breadcrumbData[j], j))
            concatString = concatString + breadcrumbData[j].name
          }

          this.echartOption.graphic = graphic
        },

        createBreadcrumbOption: function(item, index) {
          var _this = this

          var style = {
            font: '18px "Microsoft YaHei", sans-serif',
            textColor: '#fff'
          }
          var pos = {
            leftCur: 150,
            top: 50,
            separationSpace: 15,
            separatorWidth: 7,
            wordWidth: 17

          }

          // 构造分隔符(>)polyline对象
          var line = [
            [0, 0],
            [pos.separatorWidth - 1, pos.separatorWidth],
            [0, pos.separatorWidth * 2]
          ]
          var polylineLeft = pos.leftCur + (2 * index - 1) * pos.separationSpace + (item.concatString.length) * pos.wordWidth + (index - 1) * pos.separatorWidth
          var polyline = {
            type: 'polyline',
            left: polylineLeft,
            top: pos.top,
            shape: {
              points: line
            },
            silent: true,
            bounding: 'all'
          }

          // 构造名称text对象
          var textLeft = pos.leftCur + index * (2 * pos.separationSpace + pos.separatorWidth) + item.concatString.length * pos.wordWidth
          var text = {
            type: 'text',
            left: textLeft,
            top: pos.top,
            style: {
              text: item.name,
              textAlign: 'center',
              fill: style.textColor,
              font: style.font
            },
            onclick: function() {
              if (item.adcode != _this.adcode) {
                _this.adcode = item.adcode
                _this.init()
              }
            }
          }

          return (index == 0 ? [text] : [polyline, text])
        },

        createTestData: function() {
          var data = []
          var features = this.geoData.features

          for (var i = 0, len = features.length; i < len; i++) {
            var properties = features[i].properties
            var center = properties.centroid ? properties.centroid : properties.center

            // var d = {
            //     name: properties.name,
            //     center: center,
            //     data: [{
            //             value: Math.round(Math.random() * 420 + 80),
            //             name: '设备',
            //             adcode: properties.adcode,
            //             childrenNum: properties.childrenNum
            //         },
            //         {
            //             value: Math.round(Math.random() * 420 + 80),
            //             name: '故障',
            //             adcode: properties.adcode,
            //             childrenNum: properties.childrenNum
            //         }
            //     ],
            //     adcode: properties.adcode,
            //     childrenNum: properties.childrenNum
            // }

            var d = {
              name: properties.name,
              vaule: center.concat(Math.ceil(Math.random() * 1000))
            }
            data.push(d)
          }

          this.testData = data
        },

        drawPie: function() {
          var pieSeries = []
          var data = this.testData
          console.log(data)
          // for (var i = 0, len = data.length; i < len; i++) {
          //     var item = data[i];
          //     var center = this.echart.convertToPixel('geo', item.center);
          //     pieSeries.push({
          //         name: item.name,
          //         type: 'pie',
          //         radius: '15',
          //         dCenter: item.center,
          //         center: center,
          //         data: item.data.sort(function(a, b) {
          //             return a.value - b.value;
          //         }),
          //         label: {
          //             normal:{
          //               show: false
          //             }
          //         },

          //         animationType: 'scale',
          //         animationEasing: 'elasticOut',
          //         animationDelay: function(idx) {
          //             return Math.random() * 200;
          //         }
          //     });
          // }

          // this.echartOption.series = [

          // ];
          // pieSeries.push(
          //     {
          //         name: '设备3',
          //         type: 'effectScatter',
          //         coordinateSystem: 'geo',
          //         data: [{name:'北京市',value:[116.41989, 40.189913,130]},{name:'河北省',value:[114.502461, 38.045474, 443]}],
          //         symbolSize: function (val) {
          //             console.log(val)
          //             return val[2] / 10;
          //         },
          //         showEffectOn: 'render',
          //         rippleEffect: {
          //             brushType: 'stroke'
          //         },
          //         hoverAnimation: true,
          //         label: {
          //             normal: {
          //                 formatter: '{b}',
          //                 position: 'right',
          //                 show: false
          //             }
          //         },
          //         itemStyle: {
          //             normal: {
          //                 color: 'blue',
          //                 shadowBlur: 10,
          //                 shadowColor: '#333'
          //             }
          //         },
          //         zlevel: 0.5
          //     }
          // )
          this.echartOption.series = pieSeries
          this.echart.clear()
          this.echart.setOption(this.echartOption)
        }

      }
      var echartOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        geo: {
          roam: false,
          map: '',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: 'transparent',
              borderColor: '#3fdaff',
              borderWidth: 2,
              shadowColor: 'rgba(63, 218, 255, 0.5)',
              shadowBlur: 30
            },
            emphasis: {
              areaColor: '#2B91B7'
            }
          }
        },
        visualMap: {
          show: false,
          min: 80,
          max: 500,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: []
      }

      var chart = new GDEcharts({
        containerId: this.id,
        echartOption: echartOption
      })
    }
  }

}

</script>
