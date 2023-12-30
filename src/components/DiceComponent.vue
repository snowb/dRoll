<script setup>
//Component for displaying Dice object
  import { toRaw } from 'vue';

  const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

  const showPool=(_dice)=>{
    console.log("showing",toRaw(_dice));
    return "showing "+toRaw(_dice).getMinimum()+"D"+toRaw(_dice).getMaximum();
  }
</script>

<template>
  <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0.5em 0em 0.5em; margin:0.2em;">
    {{ showPool(props.dice) }} at dice_index:{{ props.dice_index }}
  </div>
</template>

<style scoped>
</style>