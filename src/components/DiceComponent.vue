<script setup>
//Component for displaying Dice object
  import { toRaw, ref, computed } from 'vue';
  import { isNumeric } from '../libs/isNumeric';
  import MetricsGraphComponent from './MetricsGraphComponent.vue';
  import DiceSettingComponent from './DiceSettingComponent.vue';

  const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

  const emit=defineEmits(["updateValue","dropDice", "reRollDice"])
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
  
  const reRollDice=()=>{
    emit("reRollDice",props.dice_index);
  }
  let close_icon_hover=ref(false);
  const close_icon_color=computed(()=>{
    return close_icon_hover.value ? "#ffb4b4" : "#dbdbdb" ;
  });

  let showSettings=ref(false);
  const showSettingsToggle=()=>{
    showSettings.value=!showSettings.value;
  }
</script>

<template>
  <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0.2em 0em 0.2em; margin:0.2em;">
    <div>
      <div style="position: relative; display: flex; flex-direction: row; align-items: center;">
        <span style="font-weight: bold;">
          Dice#{{ dice_index+1 }}
        </span> 
        <span class="blue-link pointer" style="text-decoration: underline; padding: 0em 0.5em;"
          @click="toggleMetrics">
          {{showDiceMetricsText}} Metrics
        </span> 
        <v-icon @click="dropDice" class="pointer" style="position: absolute; right: 0em; color:#ffb4b4" name="io-close-circle" scale="1" @mouseover="close_icon_hover=true" @mouseout="close_icon_hover=false" :fill="close_icon_color"></v-icon>
        <v-icon style="visibility: hidden;" name="io-close-circle" scale="1" fill="#00000000"></v-icon>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; position:relative"> 
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
        <v-icon class="pointer" style="padding:0.1em;" hover animation="pulse" speed="slow" @click="toggleMode" title="Toggle Input Mode" name="fa-exchange-alt" scale="1" fill="#dbdbdb"></v-icon> 
        <v-icon class="pointer" hover animation="spin" speed="slow" @click="reRollDice" title="Re-Roll Dice" name="bi-arrow-repeat" scale="1" fill="#dbdbdb"></v-icon>
        <v-icon class="pointer" @click="showSettingsToggle" style="position: absolute; right: 0em;" hover animation="spin" speed="slow" :title="(showSettings?'Hide':'Show')+' Settings'">
          <v-icon name="bi-gear-fill" :scale="showSettings?0.75:1" fill="#dbdbdb"></v-icon>
          <v-icon v-if="showSettings" name="oi-circle-slash" fill="#ff0000" scale="1"></v-icon>
        </v-icon>
      </div>
      <div style="border-top: thin solid #dbdbdb; margin-top: 0.2em;">
        <DiceSettingComponent v-if="showSettings"></DiceSettingComponent>
      </div>
    </div>
    <MetricsGraphComponent v-if="showDiceMetrics" :style="{color:'#ddd',backgroundColor:'#ddd',gridColor:'#dddddd1a'}"
      :force_render="force_render" :metrics="diceMetrics" :width="width" title="Roll Values"
    ></MetricsGraphComponent>
  </div>
  
</template>

<style scoped>
.pointer:hover{
    cursor: pointer;
  }
  .blue-link:hover{
    color:rgb(130, 130, 255);
  }
</style>