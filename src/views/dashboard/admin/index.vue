<template>
  <div class="dashboard-editor-container">

    <panel-group ></panel-group>

     <el-row style='margin-bottom:30px;'>
      <my-line :style='{width:"100%", height: "200px"}'></my-line>
    </el-row>
    
  </div>
</template>


<script>
import PanelGroup from "./components/PanelGroup";
import MyLine from "./components/Line";

export default {
  name: "dashboard-admin",
  components: {
    MyLine,
    PanelGroup
  },
  data() {
    return {
 
    };
  },
  methods: {

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
