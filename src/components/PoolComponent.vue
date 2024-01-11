<script setup>
  import { defineProps, toRaw, watchEffect, ref, computed, reactive} from 'vue';
  import DiceComponent from './DiceComponent.vue';
  import PoolMetricsComponent from './PoolMetricsComponent.vue';
  import PoolSettingComponent from './PoolSettingComponent.vue';
  import { isNumeric } from '../libs/isNumeric';

  const props=defineProps({
    pool: Object,
    pool_index: Number,
    force_render: Number,
    re_roll_explodes: Number
  });

  const emit=defineEmits([
    'addDice', 'updateValue', 'dropDice', 'dropPool', 
    'reRollPool', 'reRollDice', 'explodeDice', 'filterPoolDice']);
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

  const reRollDice=(_target_dice_index)=>{
    emit("reRollDice", props.pool_index, _target_dice_index);
  };

  const dropPool=()=>{
    emit("dropPool", props.pool_index);
  };
  const reRollPool=()=>{  
    emit('reRollPool',props.pool_index);
  };

  const toggleMetrics=()=>{showPoolMetrics.value=!showPoolMetrics.value;}
  let showPoolMetrics=ref(true);

  const showPoolMetricsValue=computed(()=>{
    props.force_render;
    if(props.pool.getFullRollResults().length>0 && showPoolMetrics.value===true) {
      return {text:"Hide",value:true};
    }
    return {text:"Show",value:false};
  });

  const explodeDice=(_exploded_dice)=>{
    emit("explodeDice",{pool_index:props.pool_index, add_dice:_exploded_dice});
  };

  let showSettings=ref(false);

  const showSettingsToggle=()=>{
    showSettings.value=!showSettings.value;
  }

  const showDice=computed(()=>{
    props.force_render;
    return toRaw(props.pool).getFullRollResults().length>0;
  });

  let filter_options=reactive({type:'full', value:undefined, max_value:undefined});

  const filterPoolDice=(_options)=>{
    filter_options.type=_options.type;
    filter_options.value=_options.value;
    filter_options.max_value=_options.max_value;
    filter_options.type_modifier=_options.type_modifier;    
    filter_options.drop_count=_options.drop_count;    
  };

  const getFilteredMetrics=computed(()=>{
    props.force_render;
    let pool_or_dice = filter_options.type_modifier=="dice" ? "dice" : "pool";
    switch(filter_options.type){
      case "full":
        return props.pool.getMetrics();
      case "equal":
        return props.pool.getEqualMetrics(filter_options.value, pool_or_dice);
      case "above":
        return props.pool.getAboveMetrics(filter_options.value, pool_or_dice);
      case "below":
        return props.pool.getBelowMetrics(filter_options.value, pool_or_dice);
      case "even":
        return props.pool.getEvenMetrics(pool_or_dice);
      case "odd":
        return props.pool.getOddMetrics(pool_or_dice);
      case "range":
        return props.pool.getWithinRangeMetrics(filter_options.value, filter_options.max_value, pool_or_dice);
      case "highest":
        return props.pool.getHighestMetrics(filter_options.drop_count);
      case "lowest":
        return props.pool.getLowestMetrics(filter_options.drop_count);
      case "full":
      default:
        return props.pool.getMetrics();
    }
  });

  watchEffect(()=>{
    props.pool;
    props.force_render;
  });


</script>

<template>
  <div style="margin: 0.2em; max-width:99vw;">
    <span style="display:inline-block; box-shadow: 0px 0px 5px 0px inset #242424; background-color: #e7e7e7; color:black; padding:0.2em;">
      <div>
        <span style="padding: 0em 0.5em 0em 0.5em; font-weight: bold;">
          Pool#{{ pool_index+1 }}
        </span>
        <span class="pointer blue-link" style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em;"
          @click="toggleMetrics">
          {{showPoolMetricsValue.text}} Metrics</span>
        <span style="font-weight: bold;">Iterations:</span>
        <span tabindex="0" :id="props.pool_index+'_iterations'" contenteditable @blur="editValue($event,'iterations')" @keydown.enter="editValue($event,'iterations')"
        style="border:thin solid black; margin-left:0.1em; padding:0em 0.1em; background-color: rgb(120, 255, 101); color:#242424;">
          {{ props.pool.getIterations() }}
        </span>
        <v-icon class="pointer" hover animation="spin" speed="slow" @click="reRollPool" title="Re-Roll Pool" name="bi-arrow-repeat" scale="1" fill="#242424"></v-icon>
        <span class="pointer red-link" style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em; margin-left:5em; font-size:smaller;"
          @click="dropPool" tabindex="0"
        >Delete Pool</span>
      </div>
      <div style="position: relative; display: flex; flex-direction: row; margin-bottom:0.2em;">
        <span class="button pointer"
          @click="addDice">Add Dice</span>
        <v-icon class="pointer" @click="showSettingsToggle" style="position: absolute; right: 0em; align-self: center;" hover animation="spin" speed="slow" :title="(showSettings?'Hide':'Show')+' Pool Settings'">
          <v-icon name="bi-gear-fill" :scale="showSettings?0.75:1" fill="#242424"></v-icon>
          <v-icon v-if="showSettings" name="oi-circle-slash" fill="#ff0000" scale="1">
          </v-icon>
        </v-icon>
      </div>
      <div v-if="showSettings" style="border-top: thin solid #242424;">
        <PoolSettingComponent :force_render="props.force_render" :pool="props.pool"
          @filterPoolDice="filterPoolDice" :pool_index="props.pool_index"
        ></PoolSettingComponent>
      </div>
      <div v-if="showDice" class="testclass" style="display: flex; flex-direction: row; align-items: flex-start; flex-wrap: wrap; max-width:99vw; border-top: thin solid #242424;">
        <DiceComponent v-for="(dice,dice_index) in props.pool.getFullRollResults()" 
          :key="'pool'+props.pool_index+'dice'+dice_index" :dice="dice" :dice_index="dice_index" 
          :force_render="props.force_render" :re_roll_explodes="props.re_roll_explodes"
          :filter_options="filter_options"
          @updateValue="updateValue" @dropDice="dropDice" @reRollDice="reRollDice" @explodeDice="explodeDice"
          ></DiceComponent>
      </div>
      <PoolMetricsComponent v-if="showPoolMetricsValue.value"
        :pool="props.pool" :force_render="force_render" :filter_options="filter_options"
        :metrics="getFilteredMetrics" :metrics_type="filter_options.type"
      >
      </PoolMetricsComponent>
    </span>
  </div>
  
</template>

<style scoped>
  .button:hover {
    background-color: rgb(120, 255, 101);
  }
  .button {
    box-shadow: 2px 2px 1px 0px #242424;
    display:inline-block; 
    border:thin solid black; 
    border-radius: 0.2em; 
    padding: 0em 0.5em 0em 0.5em
  }
  .button:active {
    box-shadow: 0px 0px 0px 0px #242424;
    transform: translate(2px,2px);
  }
  .pointer:hover{
    cursor: pointer;
  }
  .blue-link:hover{
    color:#0000ff;
  }
  .red-link:hover{
    color:#ff0000
  }
</style>