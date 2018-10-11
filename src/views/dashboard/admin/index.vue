<template>
  <div class="dashboard-editor-container">

    <panel-group ></panel-group>

     <el-row style='margin-bottom:30px;'>
      <ve-line :data="chartData" :legend-visible='false' :settings="chartSettings" ></ve-line>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg='9'>
          <ve-radar :data="chartData1"></ve-radar>
      </el-col>
      <el-col :lg='15'>
        <ve-map :data="chartData3" :settings="chartSettings3"></ve-map>
      </el-col>
    </el-row>
    
  </div>
</template>


<script>
import PanelGroup from "./components/PanelGroup";
import MyLine from "./components/Line";
import RadarChart from "./components/RadarChart";

export default {
  name: "dashboard-admin",
  components: {
    PanelGroup,
    RadarChart
  },
  data() {
    function getData() {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({ hour: i, alarm: Math.ceil(Math.random() * 1000) });
      }
      return data;
    }
    this.chartSettings = {
        labelMap: {
          alarm: '报警数',
        },
    }
    this.chartSettings3 = {
        position: 'china',
        label: false,
        itemStyle: {
          normal: {
            borderColor: '#00f'
          }
        },
        zoom: 1.2
      }
    return {
      hours: getData(),
      chartData: {
          columns: ['hour', 'alarm'],
          rows: getData()
      },
      chartData1: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        },
        chartData3: {
          columns: ['位置', '人口'],
          rows: [
            { '位置': '吉林', '人口': 123 },
            { '位置': '北京', '人口': 1223 },
            { '位置': '上海', '人口': 2123 },
            { '位置': '浙江', '人口': 4123 }
          ]
        }
    }
  },
  methods: {

  }
};
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
