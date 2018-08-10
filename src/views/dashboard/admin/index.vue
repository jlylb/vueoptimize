<template>
  <div class="dashboard-editor-container">

    <panel-group ></panel-group>

     <el-row style='margin-bottom:30px;'>
      <my-line :style='{width:"100%", height: "200px"}'></my-line>
    </el-row>

    <el-row :gutter="20">
      <el-col :lg='9'>
            <div class="chart-wrapper" style="height:800px;">
              <radar-chart></radar-chart>
            </div>
      </el-col>
      <el-col :lg='15'>
        <div class="chart-wrapper" style="height:800px">
          <map-chart id='map'  width='100%' height='100%'></map-chart>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>


<script>
import PanelGroup from "./components/PanelGroup";

import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";
import MapChart from "@/components/Charts/map";
import MyLine from "./components/Line";
import RadarChart from "./components/RadarChart";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};

export default {
  name: "dashboard-admin",
  components: {
    PanelGroup,
    MyLine,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    MapChart,
    RadarChart
  },
  data() {
    function getData() {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data[i] = Math.ceil(Math.random() * 1000);
      }
      return data;
    }
    return {
      lineChartData: lineChartData.newVisitis,
      hours: getData()
    };
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 0 20px 32px;
  background-color: rgb(48, 65, 86);
  .chart-wrapper {
    background: rgb(40, 49, 60);
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
