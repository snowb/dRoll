<script setup>
import { Dice } from '../libs/dice-class';
import { isNumeric } from '../libs/isNumeric';
import { ref, toRaw, computed, watchPostEffect, watchEffect } from 'vue';

const props=defineProps({
    dice: Dice,
    dice_index: Number,
    force_render: Number
  });

const emit=defineEmits(["explode"])

let showExplodeOptions=ref(false);
// let showFilterOptions=ref(false);
// let showDropOptions=ref(false);

let target_explode_on="max";

const updateExplode=(_event)=>{
  target_explode_on=_event.target.value;
  if(explode_emitted.value){
    emit("explode", target_explode_on, explode_on_value.value);
  }
};

let explode_on_value=ref(null);
const editValue=(_event)=>{
  if(_event.key=="Enter"){
    _event.preventDefault();
  }
  if(!isNumeric(_event.target.innerText)){
    _event.target.innerText=explode_on_value.value;
    return undefined;
  }
  explode_on_value.value=+_event.target.innerText;
  if(explode_emitted.value){
    emit("explode", target_explode_on, explode_on_value.value);
  }
};

let explode_emitted=ref(false);
const emitExplode=()=>{
  emit("explode",target_explode_on,explode_on_value.value);
  explode_emitted.value=true;
};

watchEffect(()=>{
  props.dice;
  props.force_render;
  if(props.dice===undefined){
    explode_on_value.value="";
  } else if(explode_on_value.value===null){
    explode_on_value.value=toRaw(props.dice).getMaximum();
  }
});
</script>

<template>
  <div>
    <div class="small bold"><input type="checkbox" v-model="showExplodeOptions" :checked="false"/>Explode Dice</div>
    <div v-if="showExplodeOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="explode_on" value="max" :checked="true" @change="updateExplode"/>On Max</span>&nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  value="min" :checked="false" @change="updateExplode"/>On Min</span> &nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  value="value" :checked="false" @change="updateExplode"/>On Value: <span class="editable" contenteditable @keydown.enter="editValue" @blur="editValue">{{ explode_on_value }}</span></span>
      <br><br>
      <span style="display: flex; flex-direction: row;">
        <span>
          &nbsp;&nbsp;Added Dice
          <br>
          <!-- IMPLEMENT THIS SECTION -->
          <span><input type="radio" name="explode_dice" :checked="true"/>d<span class="editable" contenteditable>X</span></span>&nbsp;&nbsp;
          <span><input type="radio" name="explode_dice" :checked="false"/><span class="editable" contenteditable>X</span> to <span class="editable" contenteditable>Y</span></span>
        </span>
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;Explosion Limit: <span class="editable" contenteditable>1</span>
        </span>
      </span>
      <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
        <span style="visibility: hidden;" class="explode_button">button</span>
        <span class="explode_button" style="position: absolute; right: 0em;" @click="emitExplode">Explode</span>
      </div>
    </div>
    <!-- THESE POOL FILTERS NOT DICE FILTERS, DOH -->
    <!-- <div class="small bold"><input type="checkbox" v-model="showFilterOptions" :checked="false"/>Filter</div>
    <div v-if="showFilterOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="filter_on" :checked="true"/>Equal To: <span class="editable" contenteditable>9</span></span>&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false"/>Equal To Or Above: <span class="editable" contenteditable>9</span></span>&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false"/>Equal To Or Below: <span class="editable" contenteditable>9</span></span>
      <br>
      <span><input type="radio" name="filter_on" :checked="false"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="filter_on" :checked="false"/>Odd</span>
    </div>
    <div class="small bold"><input type="checkbox" v-model="showDropOptions" :checked="false"/>Drop Dice</div>
    <div v-if="showDropOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="drop_on" :checked="true"/>Lowest</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false"/>Highest</span>
      <br>
      <span><input type="radio" name="drop_on" :checked="false"/>Equal To: <span class="editable" contenteditable>9</span></span>
      <span><input type="radio" name="drop_on" :checked="false"/>Above: <span class="editable" contenteditable>9</span></span>
      <span><input type="radio" name="drop_on" :checked="false"/>Below: <span class="editable" contenteditable>9</span></span>
      <br>
      <span><input type="radio" name="drop_on" :checked="false"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false"/>Odd</span>
    </div> -->
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
    border:thin solid white; 
    padding:0em 0.2em; 
    background-color: rgb(120, 255, 101); 
    color:#242424;
    font-weight: bold;
  }
  .explode_button{
    border:thin solid white; 
    padding:0em 0.5em 0em 0.5em; 
    border-radius: 0.4em;
    box-shadow: 2px 2px 1px 0px #dbdbdb;
    cursor: pointer;
  }
  .explode_button:hover {
    background-color: rgb(46, 100, 39);
  }
  .explode_button:active {
    box-shadow: 0px 0px 0px 0px #dbdbdb;
    transform: translate(2px,2px);
  }
</style>