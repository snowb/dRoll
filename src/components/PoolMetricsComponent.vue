<script setup>
//Component for displaying metrics of associated Pool object
import MetricsGraphComponent from './MetricsGraphComponent.vue';
import { ref, watchEffect } from 'vue';

  const props=defineProps({
    pool: Object,
    force_render: Number,
    show_set_metrics: Boolean,
    show_sequence_metrics: Boolean
  });
  let refPoolMetrics=ref([]);
  let refPoolSetMetrics=ref([]);
  let refPoolSequenceMetrics=ref([]);
  watchEffect(()=>{
    props.pool;
    props.force_render
    refPoolMetrics.value=props.pool.getMetrics().pool_metrics.reduce((_graph_values, _metric)=>{
      //format pool metrics for graphing
      _graph_values.labels.push(_metric.value);
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});

    refPoolSetMetrics.value=props.pool.getSetMetrics().reduce((_graph_values, _metric)=>{
      //format set metrics for graphing
      _graph_values.labels.push(_metric.set.toString());
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});

    refPoolSequenceMetrics.value=props.pool.getSequenceMetrics().reduce((_graph_values, _metric)=>{
      //format sequences metrics for graphing
      _graph_values.labels.push(_metric.sequence.toString());
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});
    });
</script>

<template>
  <MetricsGraphComponent v-if="refPoolMetrics.values.length>1" :metrics="refPoolMetrics" :force_render="props.force_render"
  :pool_maximum="props.pool.getMetrics().maximum_value"
  ></MetricsGraphComponent>
  <MetricsGraphComponent :metrics="refPoolSetMetrics" :force_render="props.force_render"
    v-if="refPoolSetMetrics.values.length>1"
    title="Set Metrics"
  ></MetricsGraphComponent>
  <MetricsGraphComponent :metrics="refPoolSequenceMetrics" :force_render="props.force_render"
    v-if="refPoolSequenceMetrics.values.length>1"
    title="Sequence Metrics"
  ></MetricsGraphComponent>
</template>

<style scoped>
</style>