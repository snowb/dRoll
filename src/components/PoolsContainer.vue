<script setup>
  import { toRaw, triggerRef, shallowRef } from 'vue';
  import PoolComponent from './PoolComponent.vue';
  import { Pool } from '../libs/pool-class-v1';
  
  const pools=shallowRef([]);
  const forceRender=()=>{return Math.random()};//passing non-tracked objects, needed to trigger changes

  const addPool=()=>{
    pools.value=[...pools.value, new Pool()];
    triggerRef(pools);
  };
  const addDice=(_arguments)=>{
    //console.log("PoolsContainer: addDice 1",toRaw(pools));
    toRaw(pools.value[_arguments.pool_index]).addDice(_arguments.min, _arguments.max, _arguments.modifier);
    //console.log("PoolsContainer: addDice 2",pools[_arguments.pool_index])
    triggerRef(pools);
  }
</script>

<template>
<div style="border-radius:0.2em; box-shadow:inset 0px 0px 5px 0px white; width: 100vw; display: inline-flex; flex-direction: column; padding:0.2em;">
  <div>
    <span style="font-weight:bold; border-bottom:thin solid rgba(255,255,255,0.5); border-right:thin solid rgba(255,255,255,0.5); border-radius: 0.2em; padding:0em 0.5em 0em 0.5em;">
      Pools Container
    </span>
  </div>
  <!-- <PoolComponent v-for="(pool,pool_index) in pools" :pool=ref(pool.getFullRollResults()) :pool_index=pool_index @addDice="addDice"></PoolComponent> -->
  <PoolComponent v-for="(pool,pool_index) in pools" 
    :pool=pool :pool_index=pool_index :force_render="forceRender()"
    @addDice="addDice"></PoolComponent>
  <div> 
    <span style="border:thin solid white; padding:0em 0.5em 0em 0.5em; border-radius: 0.2em;" @click="addPool()">Add Pool</span>
  </div>
</div>
</template>

<style scoped>
</style>