<script setup>
import { isNumeric } from '../libs/isNumeric';
import { Pool } from '../libs/pool-class';
import { ref, reactive, toRaw, computed, watchEffect } from 'vue';

const props=defineProps({
    pool: Pool,
    force_render: Number
  });

let filter_options=reactive({});
filter_options.filter_value=Math.floor(props.pool.getPoolMean());
filter_options.filter_type="lowest";
filter_options.drop_value=Math.floor(props.pool.getPoolMean());
filter_options.drop_type="lowest";

const emit=defineEmits([]);

let showFitlerOptions=ref(false);

const updateFilterOption=(_event, _filter_type)=>{
  if(["lowest","highest","even","odd"].includes(_filter_type)){
    //filter_options.filter_value=null;
  }
  else {
    //code to clean and correct _event.target.innerText
    //or assign it
  }
};

const updateFilterValue=(_event)=>{
  if(_event.key=="Enter"){
    _event.preventDefault();
  }
  if(!isNumeric(_event.target.innerText)){
    _event.target.innerText = filter_options.filter_value;
    return
  }
  filter_options.filter_value = +_event.target.innerText;
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

</script>

<template>
  <div>
    <div class="small bold"><input type="checkbox" v-model="showFitlerOptions" :checked="false"/>Filter Pool Dice</div>
    <div v-if="showFitlerOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="filter_on" :checked="true" @change="updateFilterOption($event, 'lowest')"/>Lowest</span>&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'highest')"/>Highest</span>&nbsp;&nbsp;&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'even')"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event, 'odd')"/>Odd</span>      
      <br>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'equal')"/>Equal To<!--span class="editable" contenteditable @keydown.enter="updateFilterValue" @blur="updateFilterValue">{{ filter_options.filter_value }}</span--></span>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'equal_above')"/>Equal or Above<!--span class="editable" contenteditable @keydown.enter="updateFilterValue" @blur="updateFilterValue">{{ filter_options.filter_value }}</span--></span>
      <span><input type="radio" name="filter_on" :checked="false" @change="updateFilterOption($event,'equal_below')"/>Equal or Below: <span class="editable" contenteditable @keydown.enter="updateFilterValue" @blur="updateFilterValue">{{ filter_options.filter_value }}</span></span>
      <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
        <span style="visibility: hidden;" class="button">Filter</span>
        <span class="button far_right_position" @click="emitExplode">Filter</span>
      </div>
    </div>
    <div class="small bold" style="border-top:thin solid #242424;"><input type="checkbox" v-model="showDropOptions" :checked="false"/>Drop Pool Dice</div>
    <div v-if="showDropOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="drop_on" :checked="true" @change="updateDropOption($event, 'lowest')"/>Lowest</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'highest')"/>Highest</span>&nbsp;&nbsp;&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'even')"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'odd')"/>Odd</span>
      <br>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal')"/>Equal To<!-- span class="editable" contenteditable @keydown.enter="updateDropValue" @blur="updateDropValue">{{ filter_options.drop_value }}</span --></span>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal_above')"/>Above<!-- span class="editable" contenteditable @keydown.enter="updateDropValue" @blur="updateDropValue">{{ filter_options.drop_value }}</span --></span>
      <span><input type="radio" name="drop_on" :checked="false" @change="updateDropOption($event, 'equal_below')"/>Below: <span class="editable" contenteditable @keydown.enter="updateDropValue" @blur="updateDropValue">{{ filter_options.drop_value }}</span></span>
      <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
        <span style="visibility: hidden;" class="button">Drop</span>
        <span class="button far_right_position" @click="emitDrop">Drop</span>
      </div>
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