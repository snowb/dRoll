<script setup>
//Component for displaying Dice object
  import { toRaw, ref, computed } from 'vue';
  import { isNumeric } from '../libs/isNumeric';

  const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

  const emit=defineEmits(["updateValue"])

  let showDiceMetrics=ref(false);
  let showDiceMetricsText=computed(()=>{return showDiceMetrics.value ? "Hide" : "Show"});
  let editMode=ref("basic");
  const toggleMode=()=>{editMode.value=editMode.value=="basic" ? "advanced" : "basic"};

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
</script>

<template>
  <div>
    <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0em 0.2em 0.5em; margin:0.2em;">
      <div style="">
        <span style="font-weight: bold;">
          Dice#{{ dice_index+1 }}
        </span>
        <span style="text-decoration: underline; padding: 0em 0.5em;"
          @click="toggleMetrics">
          {{showDiceMetricsText}} Metrics
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
      <!-- <span style="margin-left:0.2em;" title="Edit Dice"><img style="width:1em;" src="../assets/white-edit-pencil.svg"/></span> -->
      <span @click="toggleMode" style="margin-left:0.2em;" title="Toggle Advanced Mode"><img style="width:1em;" src="../assets/white-gear.svg"/></span>
    </div>
  </div>
  
</template>

<style scoped>
</style>