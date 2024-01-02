<script setup>
  import { defineProps, toRaw, watchEffect, ref, computed, triggerRef} from 'vue';
  import DiceComponent from './DiceComponent.vue';
  import PoolMetricsComponent from './PoolMetricsComponent.vue';
  import { isNumeric } from '../libs/isNumeric';

  const props=defineProps({
    pool: Object,
    pool_index: Number,
    force_render: Number
  });

  const emit=defineEmits(['addDice', 'updateValue', 'dropDice', 'dropPool']);
  const addDice=()=>{
    emit('addDice', {pool_index:props.pool_index, min:1, max:6, modifier:0});
  };
  const updateValue=(_value_to_update)=>{
    _value_to_update.target_pool_index=props.pool_index;
    emit("updateValue",_value_to_update);
  };
  const editValue=(_event, _value_to_update)=>{
    if(_event.key=="Enter"){
      _event.preventDefault();
    }
    if(!isNumeric(_event.target.innerText)){
      switch(_value_to_update){
        case "iterations":
          _event.target.innerText=toRaw(props.pool).getIterations();
          break;
      }
      return undefined;
    }
    updateValue({target_value:_value_to_update, new_value:+_event.target.innerText});
  };

  const dropDice=(_target_dice_index)=>{
    emit("dropDice", props.pool_index, _target_dice_index);
  };

  const dropPool=()=>{
    emit("dropPool", props.pool_index);
  };

  const toggleMetrics=()=>{showPoolMetrics.value=!showPoolMetrics.value;}
  let showPoolMetrics=ref(true);
  let showPoolMetricsText=computed(()=>{return showPoolMetrics.value ? "Hide" : "Show"});
  watchEffect(()=>{
    props.pool;
    props.force_render
    });
    /**
     * 
     * add Re-Roll capability
     * 
     */
</script>

<template>
  <div style="margin: 0.2em;">
    <span style="display:inline-block; box-shadow: 0px 0px 5px 0px inset #242424; background-color: #e7e7e7; color:black; padding:0.2em;">
      <div>
        <span style="padding: 0em 0.5em 0em 0.5em; font-weight: bold;">
          Pool#{{ pool_index+1 }}
        </span>
        <span style="border:thin solid black; border-radius: 0.2em; padding: 0em 0.5em 0em 0.5em"
          @click="addDice">
          Add Dice
        </span>
        <span style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em;"
          @click="toggleMetrics">
          {{showPoolMetricsText}} Metrics</span>
        <span style="font-weight: bold;">Iterations:</span>
        <span contenteditable @keydown.tab="editValue($event,'iterations')" @keydown.enter="editValue($event,'iterations')"
        style="border:thin solid black; margin-left:0.1em; padding:0em 0.1em; background-color: rgb(120, 255, 101); color:#242424;">
          {{ props.pool.getIterations() }}
        </span>
        <span style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em; margin-left:5em; font-size:smaller;"
          @click="dropPool"
        >Delete Pool</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: flex-start;">
        <DiceComponent v-for="(dice,dice_index) in props.pool.getFullRollResults()" 
          :key="'pool'+props.pool_index+'dice'+dice_index" :dice="dice" :dice_index="dice_index" 
          :force_render="props.force_render"
          @updateValue="updateValue" @dropDice="dropDice"
          ></DiceComponent>
      </div>
      <PoolMetricsComponent v-if="props.pool!==undefined && showPoolMetrics"
        :pool="props.pool" :force_render="force_render"
      >
      </PoolMetricsComponent>
    </span>
  </div>
  
</template>

<style scoped>
  #container {
    border: thin solid pink;
  }
</style>