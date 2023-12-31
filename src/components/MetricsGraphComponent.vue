<script setup>
//Component for displaying graph of data
const props=defineProps({
  metrics: Array,
  force_render: Number,
  pool_minimum: Number,
  pool_maximum: Number
});
const tableFormat=()=>{
  let graph_width=props.pool_maximum-props.pool_minimum+1;
  let graph_height=11;//excludes horiz or vert labels
  let data_array=Array(graph_height).fill(null).map((_row_value, _row_index)=>{
    return Array(graph_width).fill(null).map((_col_value, _col_index)=>{
      return {
        value:props.pool_minimum+_col_index,
        row:_row_index+1,//may not need
        col:_col_index+1//may not need
      };
    });
  });
  let horizontal_label=Array(graph_height).fill(null).map((_value, _index)=>{
    return (11-_index-1)*10+"%";
  });
  let table_object={
    horizontal_label:horizontal_label,
    data_array:data_array
  };
  return table_object;
};
const highlightGraph=(_col_value, _row_index)=>{
  //console.log(_col_value, _row_index);
  let ratio;
  props.metrics.some((_object)=>{
    if(_object.value==_col_value){
      ratio=_object.ratio;
      return true;
    }
  });
  //console.log((11-_row_index-1)/10, ratio, (11-_row_index-1)/10/ratio)
  console.log("ratio",ratio, "comp", (11-_row_index-1)/10);
  let target_ratio=(11-_row_index-1)/10;
  if((ratio >= target_ratio || target_ratio-ratio<0.1)) {
    return true;
  }
  return false;
};

const percentToFill=(_col_value, _row_index)=>{
  let ratio;
  props.metrics.some((_object)=>{
    if(_object.value==_col_value){
      ratio=_object.ratio;
      return true;
    }
  });
  console.log("ratio",ratio,"comp",(11-_row_index-1)/10);
  if(ratio>=(11-_row_index-1)/10){
    return {height: "100%"};
  } else {
    return {
      height: (((11-_row_index-1)/10)-ratio)*1000+"%",
  };
  }
  //return {height:((11-_row_index-1)/10/ratio)+"em"};
};
</script>

<template>
  <div>
    {{props.metrics}}
  </div>
  <span style="display:inline-flex; border:thin solid black;">
    <!-- 

      kjust switch to 3rd party chart lib?

      https://github.com/apertureless/vue-chartjs - https://vue-chartjs.org/guide/

        https://github.com/chartjs/Chart.js - https://www.chartjs.org/docs/latest/

      npm i vue-chartjs chart.js

      
     -->
    <!-- <span style="height:200px; writing-mode: sideways-lr; text-align: center; font-weight: bold;">Occurance</span> -->
    <!-- <span style="height:200px; text-align: center;">Occurance</span> -->
    <!-- <span style="margin-left:2em; margin-top: 0.5em;">
      <div style="border-top:black thin solid; font-size: 0.70em; font-weight: bold; width:1em;" v-for="tick in 11">
        <div style="position: relative; top:-0.75em; left:-1.5em;">
          {{ 11-tick }}
        </div>
      </div>
    </span>
    <span style="margin-left:1em; align-self: end; margin-bottom:1em;">
      <span style=" border-left:thin solid black; font-size: 0.70em; font-weight: bold; width:1em;" v-for="metric in props.metrics">
        <span style="display:inline-block; position: relative; top:1.5em; left: -0.2em; width:1.5em;">
          {{ metric.value }}
        </span>
      </span>
    </span> -->
    <!-- try a table here-->
    <table style="margin-top:1em; display: inline-block; border: thin solid black; border-collapse: collapse; border-spacing: 0px; padding:0px">
      <tr>
        <td rowspan="13">
          <span style="width:1.5em; writing-mode: sideways-lr; text-align: center; font-weight: bold;">
            Occurance
          </span>
        </td>
      </tr>
      <!---
      create function for TD v-for to be explicit about what to render
      
      change number and dash. put dash at top and leave there, adjust number span to up.
      push all of graph down to account for number moved

      -->
      <tr v-for="(row, row_index) in tableFormat().horizontal_label" >
        <td style="border:none; padding:0px; border-spacing: 0px;">
          <span style="font-size: 0.70em; font-weight: bold; position: relative; top:-1.5em; display: inline-block; width:2.5em;">
            {{ row }}
          </span>
          <span style="border-top:2px solid black;">
            &nbsp;
          </span>
        </td>
        <td style="position: relative; border:none; border-spacing: 0px; padding:0 0 0 0.25em; " v-for="(col) in tableFormat().data_array[row_index]">
          <div v-if="highlightGraph(col.value, row_index)" style="width:1em; margin:0px;">
            <div style="background-color: #ff0000; width: 0.5em;" :style="percentToFill(col.value, row_index)">
              &nbsp;
            </div>
          </div>
          <span v-else>
            {{  col.value }}
          </span>
        </td>
      </tr>
    </table>
  </span>
</template>

<style scoped>
</style>