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
    toRaw(pools.value[_arguments.pool_index]).addDice(_arguments.min, _arguments.max, _arguments.modifier);
    triggerRef(pools);
  };
  const dropDice=(_target_pool_index, _target_dice_index)=>{
    toRaw(pools.value[_target_pool_index]).dropDice(_target_dice_index);
    triggerRef(pools);
  };
  const updateValue=(_value_to_update)=>{
    let target_dice=pools.value[_value_to_update.target_pool_index].getFullRollResults()[_value_to_update.target_dice_index];
    let new_values={
      target_dice:_value_to_update.target_dice_index
    };
    let action="";
    switch(_value_to_update.target_value){
      case "min":
        new_values.min=_value_to_update.new_value;
        new_values.max=target_dice.getMaximum();
        new_values.modifier=target_dice.getModifier();
        action="updateDice";
        break;
      case "max":
        new_values.max=_value_to_update.new_value;
        new_values.min=target_dice.getMinimum();
        new_values.modifier=target_dice.getModifier();
        action="updateDice";
        break;
      case "iterations":
        action="updateIterations";
        break;
    }
    switch(action){
      case "updateDice":
        pools.value[_value_to_update.target_pool_index].updateDice(new_values.target_dice, new_values.min, new_values.max, new_values.modifier);
        break;
      case "updateIterations":
        pools.value[_value_to_update.target_pool_index].setIterations(+_value_to_update.new_value);
        break;
    }
    triggerRef(pools);
  };
</script>

<template>
<div style="border-radius:0.2em; box-shadow:inset 0px 0px 5px 0px white; width: 100vw; display: inline-flex; flex-direction: column; padding:0.2em;">
  <div>
    <span style="font-weight:bold; border-bottom:thin solid rgba(255,255,255,0.5); border-right:thin solid rgba(255,255,255,0.5); border-radius: 0.2em; padding:0em 0.5em 0em 0.5em;">
      Pools Container
    </span>
  </div>
  <PoolComponent v-for="(pool,pool_index) in pools" 
    :pool=pool :pool_index=pool_index :force_render="forceRender()"
    @addDice="addDice" @updateValue="updateValue" @dropDice="dropDice">
  </PoolComponent>
  <div> 
    <span style="border:thin solid white; padding:0em 0.5em 0em 0.5em; border-radius: 0.2em;" @click="addPool()">Add Pool</span>
  </div>
</div>
</template>

<style scoped>
</style>