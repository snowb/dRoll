<script setup>
//Component for displaying Dice object
  import { toRaw, ref, computed } from 'vue';
  import { isNumeric } from '../libs/isNumeric';
  import MetricsGraphComponent from './MetricsGraphComponent.vue';

  const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

  const emit=defineEmits(["updateValue","dropDice"])
  let diceMetrics=computed(()=>{
    return props.dice.getMetrics().reduce((_graph_values, _metric)=>{
      //format dice metrics for graphing
      _graph_values.labels.push(_metric.value);
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});
    });

  let showDiceMetrics=ref(false);
  let showDiceMetricsText=computed(()=>{return showDiceMetrics.value ? "Hide" : "Show"});
  let editMode=ref("basic");
  const toggleMode=()=>{editMode.value=editMode.value=="basic" ? "advanced" : "basic"};
  const toggleMetrics=()=>{showDiceMetrics.value=!showDiceMetrics.value;};

  const editValue=(_event, _value_to_update)=>{
    if(_event.key=="Enter"){
      _event.preventDefault();
    }
    if(!isNumeric(_event.target.innerText)){
      _event.target.innerText=_value_to_update=="max" ? toRaw(props.dice).getMaximum() : toRaw(props.dice).getMinimum();
      return undefined;
    }
    emit("updateValue",{target_dice_index:props.dice_index, target_value:_value_to_update, new_value:+_event.target.innerText});
  };

  let width=computed(()=>{
    return toRaw(props.dice).getMaximum()*150/6+"px";
  });

  const dropDice=()=>{
    emit("dropDice", props.dice_index);
  };
</script>

<template>
  <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0em 0.2em 0.5em; margin:0.2em;">
    <div>
      <div>
        <span style="font-weight: bold;">
          Dice#{{ dice_index+1 }}
        </span>
        <span style="text-decoration: underline; padding: 0em 0.5em;"
          @click="toggleMetrics">
          {{showDiceMetricsText}} Metrics
        </span>
        <span>
          <img title="Remove Dice from Pool" style="width:1em; margin-right: 0.2em;" src="../assets/white-close-circle.svg"
           @click="dropDice"
          >
        </span>
      </div>
      <span v-if="editMode=='basic'" style="padding: 0em 0.5em; margin-left:0.2em; font-weight: bold; border-radius: 1em; border:thin solid white;">
        d <span style="border:thin solid white; padding:0em 0.2em; background-color: rgb(120, 255, 101); color:#242424;" 
        contenteditable @keydown.enter="editValue($event,'max')" @keydown.tab="editValue($event,'max')">
          {{toRaw(props.dice).getMaximum()}}
        </span>
      </span>
      <span v-if="editMode=='advanced'" style="padding: 0em 0.5em; margin-left:0.2em; font-weight: bold; border-radius: 1em; border:thin solid white;">
        <span style="border:thin solid white; padding:0em 0.2em; background-color: rgb(120, 255, 101); color:#242424;" 
        contenteditable @keydown.enter="editValue($event,'min')" @keydown.tab="editValue($event,'min')">
          {{toRaw(props.dice).getMinimum()}}
        </span> 
        to 
        <span style="border:thin solid white; padding:0em 0.2em; background-color: rgb(120, 255, 101); color:#242424;" 
        contenteditable @keydown.enter="editValue($event,'max')" @keydown.tab="editValue($event,'max')">
          {{toRaw(props.dice).getMaximum()}}
        </span>
      </span>
      <span @click="toggleMode" style="margin-left:0.2em;" title="Toggle Advanced Mode"><img style="width:1em;" src="../assets/white-gear.svg"/></span>
    </div>
    <MetricsGraphComponent v-if="showDiceMetrics" :style="{color:'#ddd',backgroundColor:'#ddd',gridColor:'#dddddd1a'}"
      :force_render="force_render" :metrics="diceMetrics" :width="width"
    ></MetricsGraphComponent>
  </div>
  
</template>

<style scoped>
</style>