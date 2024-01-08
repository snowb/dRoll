<script setup>
//Component for displaying metrics of associated Pool object
import MetricsGraphComponent from './MetricsGraphComponent.vue';
import { ref, watchEffect, computed } from 'vue';

  const props=defineProps({
    pool: Object,
    force_render: Number,
    show_set_metrics: Boolean,
    show_sequence_metrics: Boolean
  });

  const iterations=computed(()=>{
    props.force_render;
    return props.pool.getIterations();
  });

  const computedPoolEqualMetrics=computed(()=>{
    props.pool;
    props.force_render;
    let temp_metrics=props.pool.getMetrics();
    return temp_metrics.pool_metrics.reduce((_graph_values, _metric)=>{
      //format pool metrics for graphing
      _graph_values.labels.push(_metric.value);
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[], mean:temp_metrics.mean, median:temp_metrics.median, mode:temp_metrics.mode});
  });

  const computedPoolEqualAboveMetrics=computed(()=>{
    //calculate sum of values equal to above the given value 
    props.pool;
    props.force_render;
    let above_equal={};
    above_equal.labels=computedPoolEqualMetrics.value.labels;
    above_equal.values=[];
    above_equal.labels.forEach((_label, _index)=>{
      let summed_occurances = computedPoolEqualMetrics.value.values.reduce((_summed_occurance, _occurance, _value_index)=>{
        _summed_occurance+=_value_index>=_index ? _occurance : 0;
        return _summed_occurance;
      },0);
      above_equal.values.push(Math.round(summed_occurances*iterations.value)/iterations.value)
    });
    above_equal.mean=computedPoolEqualMetrics.value.mean;
    above_equal.median=computedPoolEqualMetrics.value.median;
    above_equal.mode=computedPoolEqualMetrics.value.mode;
    return above_equal;
  });

  const computedPoolEqualBelowMetrics=computed(()=>{
    //calculate sum of values equal to below the given value 
    props.pool;
    props.force_render;
    let below_equal={};
    below_equal.labels=computedPoolEqualMetrics.value.labels;
    below_equal.values=[];
    below_equal.labels.forEach((_label, _index)=>{
      let summed_occurances = computedPoolEqualMetrics.value.values.reduceRight((_summed_occurance, _occurance, _value_index)=>{
        _summed_occurance+=_value_index<=_index ? _occurance : 0;
        return _summed_occurance;
      },0);
      below_equal.values.push(Math.round(summed_occurances*iterations.value)/iterations.value)
    });
    below_equal.mean=computedPoolEqualMetrics.value.mean;
    below_equal.median=computedPoolEqualMetrics.value.median;
    below_equal.mode=computedPoolEqualMetrics.value.mode;
    return below_equal;
  });


  let poolMetricsDisplay=ref("equal");
  const setPoolMetricsDiplay=(_value)=>{
    poolMetricsDisplay.value=_value;
  };

  let computedPoolMetrics=computed(()=>{
    switch(poolMetricsDisplay.value){
      case "equal":
        return computedPoolEqualMetrics.value;
      case "equal_above":
        return computedPoolEqualAboveMetrics.value;
      case "equal_below":
        return computedPoolEqualBelowMetrics.value;
    }
  });

  const isSelectedMetricsDisplay=(_value)=>{
    return _value==poolMetricsDisplay.value;
  };

  const computedPoolSetMetrics=computed(()=>{
    props.pool;
    props.force_render;
    return props.pool.getSetMetrics().reduce((_graph_values, _metric)=>{
      //format set metrics for graphing
      _graph_values.labels.push(_metric.set.toString());
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});
  });

  const computedPoolSequenceMetrics=computed(()=>{
    props.pool;
    props.force_render;
    return props.pool.getSequenceMetrics().reduce((_graph_values, _metric)=>{
      //format sequences metrics for graphing
      _graph_values.labels.push(_metric.sequence.toString());
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});
  });

  watchEffect(()=>{
    props.pool;
    props.force_render;
  });

  const getWidth=(_array, _multipler)=>{
    let multiplier=_multipler===undefined ? 1 : +_multipler;
    return _array.length*150/6*multiplier+"px";
  };
</script>

<template>
  <div style="display:flex; flex-direction: row;" v-if="computedPoolMetrics.values.length>1" >
    <MetricsGraphComponent :metrics="computedPoolMetrics" :force_render="props.force_render"
      :pool_maximum="props.pool.getMetrics().maximum_value" :width="getWidth(computedPoolMetrics.values, 1)"
      :style="{color:'#000',backgroundColor:'#444',gridColor:'#4444441a'}" title="Pool Sums"
    ></MetricsGraphComponent>
    <span style="font-size:small; display:flex; flex-direction: column; justify-content: center; align-items: flex-start; margin-left:0.2em;">
      <!-- 

      add GreenBox to EqAbove and EqBelow
      Default is Max for EqBelow and Min for EqAbove
      Update value triggers setPoolMetricsDisplay filtering
       -->
      <span @click="setPoolMetricsDiplay('equal')" class="pointer red-link space_around" :class="{selected:isSelectedMetricsDisplay('equal')}">Equal To</span>
      <span @click="setPoolMetricsDiplay('equal_above')" class="pointer red-link space_around" :class="{selected:isSelectedMetricsDisplay('equal_above')}">Equal To Or Above</span>
      <span @click="setPoolMetricsDiplay('equal_below')" class="pointer red-link space_around" :class="{selected:isSelectedMetricsDisplay('equal_below')}">Equal To Or Below</span>
    </span>
  </div>
    
  <MetricsGraphComponent :metrics="computedPoolSetMetrics" :force_render="props.force_render"
    :style="{color:'#000',backgroundColor:'#444',gridColor:'#4444441a'}" :width="getWidth(computedPoolSetMetrics.values, 1.5)"
    v-if="computedPoolSetMetrics.values.length>1"
    title="Set Metrics"
  ></MetricsGraphComponent>
  <MetricsGraphComponent :metrics="computedPoolSequenceMetrics" :force_render="props.force_render"
    :style="{color:'#000',backgroundColor:'#444',gridColor:'#4444441a'}" :width="getWidth(computedPoolSequenceMetrics.values, 1.25)"
    v-if="computedPoolSequenceMetrics.values.length>1"
    title="Sequence Metrics"
  ></MetricsGraphComponent>
</template>

<style scoped>
.space_around{
  margin: 0.2em 0em 0.2em 0em;
}
.pointer:hover{
  cursor:pointer;
}
.red-link{
  text-decoration: underline;
  padding: 0em 0.2em;
}
.red-link:hover{
  color:#ff0000;
}
.selected{
  border:thin solid #444;
  border-radius: 0.2em;
  background-color: #444;
  color: #dbdbdb;
}
</style>