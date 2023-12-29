<script setup>
  import { reactive } from 'vue';
  import PoolComponent from './PoolComponent.vue';
  import { Pool } from '../libs/pool-class-v1';
  
  const pools=reactive([]);

  const addPool=()=>{
    pools.push(new Pool());
  };
  const addDice=(_arguments)=>{
    console.log("addDice", _arguments)
  }
</script>

<template>
<div style="border-radius:0.2em; box-shadow:inset 0px 0px 5px 0px white; width: 100vw; display: flex; flex-direction: column; padding:0.2em;">
  <div>
    <span style="font-weight:bold; border-bottom:thin solid rgba(255,255,255,0.5); border-right:thin solid rgba(255,255,255,0.5); border-radius: 0.2em; padding:0em 0.5em 0em 0.5em;">
      Pools Container
    </span>
  </div>
  <div> 
    <span style="border:thin solid white; padding:0em 0.5em 0em 0.5em; border-radius: 0.2em;" @click="addPool()">Add Pool</span>
  </div>
  <PoolComponent v-for="pool in pools" :pool=pool @addDice="addDice"></PoolComponent>
</div>
</template>

<style scoped>
</style>