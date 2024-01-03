<script setup>
//Component for displaying graph of data
import { computed, watchEffect } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, registerables } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
// ChartJS.defaults.font.weight="bold";
// ChartJS.defaults.font.size=12;
// ChartJS.defaults.color="#000"
//ChartJS.defaults.backgroundColor="#444"
//ChartJS.defaults.plugins.tooltip.enabled=false;

const props=defineProps({
  metrics: Object,
  force_render: Number,
  pool_maximum: Number,
  title: String,
  style: Object,
  width: String
});

let chartData=computed(()=>{
  props.force_render;
  return {
    datasets:[
      {
        label:"Occurence %",
        data:props.metrics.values ? props.metrics.values : []
      },
    ],
    labels:props.metrics.labels ? props.metrics.labels : []
  };
});

watchEffect(()=>{
  if(props.style!==undefined){
    //ChartJS.defaults.color=props.style.color;
    //ChartJS.defaults.backgroundColor=props.style.backgroundColor;
    //ChartJS.defaults.font.color=props.style.backgroundColor;
    //ChartJS.defaults.scale.grid.color=props.style.gridColor;
  }
});

let chartOptions=computed(()=>{
  let options={};
  options.responsive=true;
  options.maintainAspectRatio=false;
  options.layout={padding: 0};
  if(props.style!==undefined){
    options.scales={
      x: {
        grid:{
          color: props.style.gridColor
        },
        ticks:{
          color: props.style.backgroundColor
        }
      },
      y:{
        grid:{
          color: props.style.gridColor
        },
        ticks:{
          color: props.style.backgroundColor
        }
      }
    };
    options.backgroundColor=props.style.backgroundColor;
    options.color=props.style.backgroundColor;
  }
  return options;
});
</script>

<template>
  <div v-if="props.title!==undefined" style="font-weight: bold; margin-left:1em;">{{ props.title }}</div>
  <div v-if="props.metrics" :style="{width: props.width, position:'relative'}">
    <bar :data="chartData" :options="chartOptions"></bar>
  </div>
</template>

<style scoped>
</style>