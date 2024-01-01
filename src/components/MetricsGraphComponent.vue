<script setup>
//Component for displaying graph of data
import { computed } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, registerables } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
ChartJS.defaults.font.weight="bold";
ChartJS.defaults.font.size=12;
ChartJS.defaults.color="#000"
ChartJS.defaults.backgroundColor="#444"
//ChartJS.defaults.plugins.tooltip.enabled=false;

const props=defineProps({
  metrics: Array,
  force_render: Number,
  pool_minimum: Number,
  pool_maximum: Number,
  title: String
});

const getValues=()=>{
  console.log(props.metrics)
  if(props.metrics==undefined){ return {labels:[],values:[]}}
  return props.metrics.reduce((_values_arrays, _element_object)=>{
    switch(true){
      case _element_object.value!==undefined:
        _values_arrays.labels.push(_element_object.value);
        break;
      case _element_object.set!==undefined:
        _values_arrays.labels.push(_element_object.set.toString());
        break
      case _element_object.sequence!==undefined:
        _values_arrays.labels.push(_element_object.sequence.toString());
        break
    }
    _values_arrays.values.push(_element_object.ratio*100);
    return _values_arrays;
  },{labels:[],values:[]});
};

let chartData=computed(()=>{
  return {
    datasets:[
      {
        label:"Occurance %",
        data:getValues().values
      },
    ],
    labels:getValues().labels
  };
});

let chartWidth=computed(()=>{
  return (props.pool_maximum*10/6)+"vw";
});

let chartOptions={
  responsive:true,
  maintainAspectRatio:false,
  layout: {
    padding: 0
  }
};
</script>

<template>
  <div v-if="props.title!==undefined" style="font-weight: bold; margin-left:1em;">{{ props.title }}</div>
  <div v-if="props.metrics.length>1" :style="{width: chartWidth, position:'relative'}">
    <bar :data="chartData" :options="chartOptions"></bar>
  </div>
  <!-- <div>
    {{props.metrics}}
  </div> -->
</template>

<style scoped>
</style>