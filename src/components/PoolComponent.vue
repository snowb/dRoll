<script setup>
  import { reactive, defineProps } from 'vue';
  import { Pool } from '../libs/pool-class-v1';

  const props=defineProps({
    pool: Object,
  });

  const emit=defineEmits(['addDice']);

  const testPool="nothing";
  const addDice=()=>{
    emit('addDice', {min:1, max:6, modifier:0});
  };
</script>

<template>
  <div @click="addDice">Add Dice</div>
  <div id="container">
    {{ props.pool }}
  </div>
</template>

<style scoped>
  #container {
    border: thin solid pink;
  }
</style>