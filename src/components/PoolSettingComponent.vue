<script setup>
import { isNumeric } from '../libs/isNumeric';
import { Pool } from '../libs/pool-class';
import { ref, reactive, computed, watchEffect } from 'vue';

const props=defineProps({
    pool: Pool,
    force_render: Number
  });

let filter_options=reactive({});
filter_options.filter_value=1;
filter_options.filter_value_max=3;
filter_options.filter_type="equal";
filter_options.filter_type_modifier="with";
filter_options.drop_value=1;
filter_options.drop_type="lowest";

const emit=defineEmits(["filterPoolDice","dropPoolDice"]);

let showFitlerOptions=ref(false);

const updateFilterOption=(_event, _filter_type, _filter_type_modifier)=>{
  filter_options.filter_type=_filter_type;
  filter_options.filter_type_modifier=_filter_type_modifier;
};

const updateFilterValue=(_event)=>{
  if(_event.key=="Enter"){
    _event.preventDefault();
  }
  if(!isNumeric(_event.target.innerText)){
    if(_event.target.id=="range_max"){
      _event.target.innerText = filter_options.filter_value_max;
    } else {
      _event.target.innerText = filter_options.filter_value;
    }
    return
  }
  if(_event.target.id=="range_max"){
      filter_options.filter_value_max = +_event.target.innerText;
    } else {
      filter_options.filter_value = +_event.target.innerText;
    }
};

const emitFilter=()=>{
  emit("filterPoolDice",{
    type: filter_options.filter_type, 
    type_modifier: filter_options.filter_type_modifier, 
    value: filter_options.filter_value,
    max_value: filter_options.filter_value_max
  });
};

let showDropOptions=ref(false);

const updateDropOption=(_event, _drop_type)=>{

};

const updateDropValue=(_event)=>{
  if(_event.key=="Enter"){
    _event.preventDefault();
  }
  if(!isNumeric(_event.target.innerText)){
    _event.target.innerText = filter_options.drop_value;
    return
  }
  filter_options.drop_value = +_event.target.drop_value;
};

let showExplodeOptions=ref(false);

watchEffect(()=>{
  if(showFitlerOptions.value==false){
    emit("filterPoolDice",{type:"full"});
  }
});

const inputSize=computed(()=>{
  props.force_render;
  return props.pool.getPoolMax().toString().length+2;
});
</script>

<template>
  <div>
    <div class="small bold"><input type="checkbox" v-model="showFitlerOptions" :checked="false"/>Filter Pool Containing Dice</div>
    <div v-if="showFitlerOptions" class="small" style="padding-left:0.5em;">
      <!-- 
        needs to be in different section. Drop style filtering
      <span title="Show Lowest Dice in the Pool."><input type="radio" name="filter_on" :checked="true" @change="updateFilterOption($event, 'lowest')"/>Lowest</span>&nbsp;&nbsp;
      <span title="Show Highest Dice in the Pool."><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'highest')"/>Highest</span>&nbsp;&nbsp;&nbsp;&nbsp; 
      -->
      <span title="Show Pool where at least 1 Dice is an Even value."><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'even','with')"/>Even</span>&nbsp;&nbsp;
      <span title="Show Pool where at least 1 Dice is an Odd value."><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'odd','with')"/>Odd</span>      
      <br>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'equal','with')"/>Equal To<!--span class="editable" contenteditable @keydown.enter="updateFilterValue" @blur="updateFilterValue">{{ filter_options.filter_value }}</span--></span>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'above','with')"/>Above<!--span class="editable" contenteditable @keydown.enter="updateFilterValue" @blur="updateFilterValue">{{ filter_options.filter_value }}</span--></span>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'below','with')"/>Below: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/></span>
      <br>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'range','with')"/>Range From: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/> To: <input type="number" id="range_max" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value_max"/></span>
      
      <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
        <span style="visibility: hidden;" class="button">Filter</span>
        <span class="button far_right_position" @click="emitFilter">Filter</span>
      </div>
    </div>
    <div v-if="false" class="small bold" style="border-top:thin solid #242424;"><input type="checkbox" v-model="showDropOptions" :checked="false"/>Drop Pool Dice</div>
    <div v-if="showDropOptions" class="small" style="padding-left:0.5em;">
      <!--
        implement after filter stuff is working

        don't use actual dropDice? insted just use filtering?
      -->
      <span><input type="radio" name="drop_on" :checked="true" @change="updateDropOption($event, 'lowest')"/>Lowest</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'highest')"/>Highest</span>&nbsp;&nbsp;&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'even')"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'odd')"/>Odd</span>
      <br>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal')"/>Equal To</span>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal_above')"/>Above</span>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal_below')"/>Below: <span class="editable" contenteditable @keydown.enter="updateDropValue" @blur="updateDropValue">{{ filter_options.drop_value }}</span></span>
      <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
        <span style="visibility: hidden;" class="button">Drop</span>
        <span class="button far_right_position" @click="emitDrop">Drop</span>
      </div>
    </div>
    <div v-if="false" class="small bold" style="border-top:thin solid #242424;"><input type="checkbox" v-model="showExplodeOptions" :checked="false"/>Explode Pool Dice</div>
    <div v-if="showExplodeOptions" class="small" style="padding-left:0.5em;">
      <!--

        need explode based on each Dice (max, min, value) and Pool (max, min, value) 
        maybe not Pool? Leave as individual dice option 
      -->
    </div>
  </div>
</template>

<style scoped>
 .small{
    font-size:small;
  }
  .bold{
    font-weight: bold;
  }
  .editable{
    border:thin solid #242424; 
    padding:0em 0.2em; 
    background-color: rgb(120, 255, 101); 
    color:#000000;
    font-weight: bold;
  }
  .far_right_position{
    position: absolute; 
    right: 0em;
  }
  .button{
    border:thin solid black; 
    padding:0em 0.5em 0em 0.5em; 
    border-radius: 0.4em;
    box-shadow: 2px 2px 1px 0px #242424;
    cursor: pointer;
    display:inline-block; 
  }
  .button:hover {
    background-color: rgb(120, 255, 101);
  }
  .button:active {
    box-shadow: 0px 0px 0px 0px #242424;
    transform: translate(2px,2px);
  }
</style>