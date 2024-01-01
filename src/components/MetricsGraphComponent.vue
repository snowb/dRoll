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
  metrics: Object,
  force_render: Number,
  pool_maximum: Number,
  title: String
});

let chartData=computed(()=>{
  props.force_render;
  return {
    datasets:[
      {
        label:"Occurance %",
        data:props.metrics.values ? props.metrics.values : []
      },
    ],
    labels:props.metrics.labels ? props.metrics.labels : []
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
  <div v-if="props.metrics" :style="{width: chartWidth, position:'relative'}">
    <bar :data="chartData" :options="chartOptions"></bar>
  </div>
</template>

<style scoped>
</style>