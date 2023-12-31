<script setup>
//Component for displaying graph of data
defineProps({
  metrics: Array,
  iterations: Number,
  force_render: Number
});
</script>

<template>
  <div>
    {{metrics}}
  </div>
</template>

<style scoped>
</style>