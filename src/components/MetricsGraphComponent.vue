<script setup>
//Component for displaying graph of data
import { computed, watchEffect } from 'vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, registerables } from 'chart.js'
import { isNumeric } from '../libs/isNumeric';
// import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, zoomPlugin);
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
//need to add in Average somewhere
watchEffect(()=>{
  if(props.style!==undefined){
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
    options.plugins={
      tooltip:{
        callbacks:{
          title:(_tooltip)=>{
            return "Value: "+_tooltip[0].label;
           }
        }
      },
      // zoom: {
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true
      //     },
      //     mode: 'xy',
      //   },
      //   limits:{
      //     y:{min:0,max:100}
      //   }
      // },
    };
  }
  return options;
});

let showAverage=computed(()=>{
  return isNumeric(props.metrics.labels[0]);
});
let average=computed(()=>{
  let sum = props.metrics.labels.reduce((_sum, _value)=>{
    return _sum+_value;
  },0);
  return sum/props.metrics.labels.length;
});
</script>

<template>
  <div>
    <div v-if="props.title!==undefined" style="font-weight: bold; margin-left:1em;">{{ props.title }}</div>
    <div v-if="props.metrics" :style="{width: props.width, position:'relative'}" style="max-width:90vw;">
      <bar :data="chartData" :options="chartOptions"></bar>
    </div>
    <div v-if="showAverage" style="margin-left:2em; font-size: small; font-weight: bold;">Average: {{ average }}</div>
  </div>
</template>

<style scoped>
</style>