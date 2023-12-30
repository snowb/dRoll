<script setup>
//Component for displaying metrics of associated Pool object
  const props=defineProps({
    metrics: Object,
    force_render: Number
  });
</script>

<template>
  <div>{{ props.metrics }}</div>
</template>

<style scoped>
</style>