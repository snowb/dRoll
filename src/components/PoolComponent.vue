<script setup>
  import { defineProps, toRaw, watchEffect, ref, computed} from 'vue';
  import DiceComponent from './DiceComponent.vue';
  import PoolMetricsComponent from './PoolMetricsComponent.vue';
  import { isNumeric } from '../libs/isNumeric';

  const props=defineProps({
    pool: Object,
    pool_index: Number,
    force_render: Number
  });

  const emit=defineEmits(['addDice', 'updateValue']);
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

  const toggleMetrics=()=>{showPoolMetrics.value=!showPoolMetrics.value;}
  let showPoolMetrics=ref(true);
  let showPoolMetricsText=computed(()=>{return showPoolMetrics.value ? "Hide" : "Show"});
  let refPoolStringFullResults=ref("test1");
  let count=0;
  watchEffect(()=>{
    props.pool;
    props.force_render
    refPoolStringFullResults.value=props.pool.getMetrics();//unrefPool[props.pool_index].getMetrics();//JSON.stringify(rawPoolFullResults);
    count++;
    });
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
          {{showPoolMetricsText}} Metrics
        </span>
        <span style="font-weight: bold;">Iterations:</span>
        <span contenteditable @keydown.tab="editValue($event,'iterations')" @keydown.enter="editValue($event,'iterations')"
        style="border:thin solid black; margin-left:0.1em; padding:0em 0.1em; background-color: rgb(120, 255, 101); color:#242424;">
          {{ props.pool.getIterations() }}
        </span>
      </div>
      <div style="display: flex; flex-direction: row;">
        <DiceComponent v-for="(dice,dice_index) in props.pool.getFullRollResults()" 
          :key="'pool'+props.pool_index+'dice'+dice_index" :dice="dice" :dice_index="dice_index" 
          :force_render="props.force_render"
          @updateValue="updateValue"
          ></DiceComponent>
      </div>
      <PoolMetricsComponent v-if="showPoolMetrics" 
        :metrics="refPoolStringFullResults.pool_metrics" 
        :pool_minimum="refPoolStringFullResults.minimum_value"
        :pool_maximum="refPoolStringFullResults.maximum_value"
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