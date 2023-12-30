<script setup>
  import { defineProps, toRaw, watchEffect, ref, computed} from 'vue';
  import DiceComponent from './DiceComponent.vue';
  import PoolMetricsComponent from './PoolMetricsComponent.vue';

  const props=defineProps({
    pool: Object,
    pool_index: Number,
    force_render: Number
  });

  const emit=defineEmits(['addDice']);
  const addDice=()=>{
    emit('addDice', {pool_index:props.pool_index, min:1, max:6, modifier:0});
  };

  const toggleMetrics=()=>{showPoolMetrics.value=!showPoolMetrics.value;}
  let showPoolMetrics=ref(false);
  let showPoolMetricsText=computed(()=>{return showPoolMetrics.value ? "Hide" : "Show"});
  let refPoolStringFullResults=ref("test1");
  let count=0;
  watchEffect(()=>{
    // console.log("watchEffect 1",props.pool)
    // console.log("watchEffect 2",unref(props.pool))
    props.pool;
    props.force_render
    //let unrefPool=unref(props.pool.value);
    //console.log(unrefPool)
    refPoolStringFullResults.value=props.pool.getMetrics();//unrefPool[props.pool_index].getMetrics();//JSON.stringify(rawPoolFullResults);
    count++;
    });
</script>

<template>
  <div style="margin: 0.2em;">
    <span style="display:inline-block; box-shadow: 0px 0px 5px 0px inset #242424; background-color: #e7e7e7; color:black; padding:0.2em;">
      <div>
        <span style="padding: 0em 0.5em 0em 0.5em; font-weight: bold;">
          Pool#{{ pool_index }}
        </span>
        <span style="border:thin solid black; border-radius: 0.2em; padding: 0em 0.5em 0em 0.5em"
          @click="addDice">
          Add Dice
        </span>
        <span style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em;"
          @click="toggleMetrics">
          {{showPoolMetricsText}} Metrics
        </span>
      </div>
      <div style="display: flex; flex-direction: row;">
        <DiceComponent v-for="(dice,dice_index) in props.pool.getFullRollResults()" 
          :key="'pool'+props.pool_index+'dice'+dice_index" :dice="dice" :dice_index="dice_index" 
          :force_render="props.force_render"
          ></DiceComponent>
      </div>
      <!-- <div v-if="showPoolMetrics">{{ refPoolStringFullResults }}</div> -->
      <!-- PoolMetricsComponent -->
      <PoolMetricsComponent v-if="showPoolMetrics" :metrics="refPoolStringFullResults"></PoolMetricsComponent>
    </span>
  </div>
  
</template>

<style scoped>
  #container {
    border: thin solid pink;
  }
</style>