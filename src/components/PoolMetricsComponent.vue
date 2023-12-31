<script setup>
//Component for displaying metrics of associated Pool object
import MetricsGraphComponent from './MetricsGraphComponent.vue';

  const props=defineProps({
    metrics: Array,
    force_render: Number
  });
</script>

<template>
  <MetricsGraphComponent :metrics="props.metrics" :force_render="props.force_render"></MetricsGraphComponent>
</template>

<style scoped>
</style>