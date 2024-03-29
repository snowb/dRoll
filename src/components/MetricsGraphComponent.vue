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
  width: String,
  no_show_average: Boolean
});

const chartData=computed(()=>{
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

const chartOptions=computed(()=>{
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
          color: props.style.backgroundColor,
          callback:function(_value){
            let label_for_value = this.getLabelForValue(_value);
            let repetition_match = label_for_value.toString(10).match(/([0-9])\1+/gi);
            if(repetition_match!==null && repetition_match[0].length > 3 ){
              repetition_match = repetition_match[0].toString(10).slice(1);
              let single_char = repetition_match[0].toString(10).slice(0,1)
              label_for_value = label_for_value.toString(10).replace(repetition_match,single_char+" .. ");
            }
            
            return label_for_value;
          }
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
           },
           /* label:(_label)=>{
            console.log(_label)
            return _label;
           } */
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

const showAverage=computed(()=>{
  return !props.no_show_average && isNumeric(props.metrics.labels[0]);
});

const pool_mean=computed(()=>{
  props.force_render;
  return Math.round(props.metrics.mean*100)/100;
});

const pool_median=computed(()=>{
  props.force_render;
  return props.metrics.median;
});

const pool_mode=computed(()=>{
  props.force_render;
  return props.metrics.mode;
});

const pool_total=computed(()=>{
  props.force_render;
  console.log(props)
  let total = props.metrics.values.reduce((_sum,_value)=>{
    return _sum+_value;
  },0);
  if(total>100){
      total = props.metrics.values.reduce((_max,_value)=>{
      if(_value > _max){return _value}
      return _max;
    },-Infinity);
  }
  return Math.round(total*100)/100;
});
</script>

<template>
  <div>
    <div v-if="props.title!==undefined" style="font-weight: bold; margin-left:1em;">{{ props.title }}</div>
    <div v-if="props.metrics" :style="{width: props.width, position:'relative'}" style="max-width:90vw;">
      <bar :data="chartData" :options="chartOptions"></bar>
    </div>
    <span style="margin-left:2em; font-size: small; font-weight: bold;" title="Total occurances.">Total Occurances: {{ pool_total }}%</span>
    <div v-if="showAverage" style="margin-left:2em; font-size: small; font-weight: bold;">
      <span title="Average of all values generated.">Pool Mean: {{ pool_mean }}</span>&nbsp;&nbsp;
      <span title="Value in the center of all generated values.">Median: {{ pool_median }}</span>&nbsp;&nbsp;
      <span title="Value with the highest occurances.">Mode: {{ pool_mode }}</span>&nbsp;&nbsp;
    </div>
  </div>
</template>

<style scoped>
</style>