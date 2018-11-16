<template>
  <div class="dashboard-editor-container">

    <panel-group :dapeng='dapengTotal' :device='deviceTotal' :warn='warnTotal'></panel-group>

    <el-row :gutter="20" :style="{ position: 'relative' }">
      <el-col :lg='9'>
          <ve-pie :data="chartData1" :settings="chartSettings1" ref='chart1' height='600px' :extend="extend1" :events="chartEvents1"></ve-pie>
      </el-col>
      <el-col :lg='15'>
        <ve-map :data="chartData3" :settings="chartSettings3" ref='chart3' height='600px' :extend="extend3" :events="chartEvents3" :after-config='afterConfig'></ve-map>
      </el-col>
    </el-row>
    
  </div>
</template>


<script>
import PanelGroup from './components/PanelGroup'
import { fetchList } from '@/api/dashboard'

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup
  },
  data() {
    this.chartSettings1 = {
      radius: 200,
      offsetY: 300,
      roseType: 'area',
      labelMap: {
        lvl: '告警等级',
        num: '告警数量'
      }
    }
    this.extend1 = {
      color: ['#C03639', '#ff9900', '#19be6b', '#2db7f5']
    }
    this.chartSettings3 = {
      position: 'china',
      label: false,
      itemStyle: {
        normal: {
          areaColor: '#36a3f7',
          borderColor: '#fff',
          color: '#C03639'
        },
        emphasis: {
          areaColor: '#0c60a0',
          borderWidth: 0,
          label: {
            show: false,
            color: '#fff'
          }
        }
      },
      labelMap: {
        label: '大棚区域分布',
        num: '大棚'
      },
      zoom: 1.2
    }
    this.extend3 = {
      color: ['#19be6b', '#C03639', '#ff9900', '#2db7f5']
    }

    return {
      chartData1: {},
      chartData3: {},
      dapengTotal: 0,
      deviceTotal: 0,
      warnTotal: 0,
      chartEvents3: {},
      dapeng: [],
      warns: []
    }
  },
  methods: {
    afterConfig(options) {
      console.log(options, 'charts ....')
      return options
    }
  },
  mounted() {

  },
  created() {
    this.chartEvents1 = {
      click: (v) => {
        let lvl = null
        const { name } = v.data
        this.warns.forEach((item) => {
          if (item.lvl === name) {
            lvl = item.plvl
            return
          }
        })

        v.value > 0 && this.$router.push({ name: 'api.realwarn.index', params: { lvl }})
      }
    }
    this.chartEvents3 = {
      click: (v) => {
        let aid = null
        const { name } = v.data
        this.dapeng.forEach((item) => {
          if (item.label === name) {
            aid = item.aid
            return
          }
        })

        aid && this.$router.push({ name: 'api.area.index', params: { aid }})
      }
    }
    fetchList().then((res) => {
      const { dpTotal, warnTotal, deviceTotal, warns, dapeng } = res.data
      this.chartData1 = {
        columns: ['lvl', 'num'],
        rows: warns
      }
      this.chartData3 = {
        columns: ['label', 'num'],
        rows: dapeng
      }
      this.dapeng = dapeng
      this.warns = warns
      this.dapengTotal = dpTotal
      this.warnTotal = warnTotal
      this.deviceTotal = deviceTotal
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 0 20px 32px;
  .chart-wrapper {
    background: $subMenuBg;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
