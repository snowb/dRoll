<script setup>
import { Dice } from '../libs/dice-class';
import { isNumeric } from '../libs/isNumeric';
import { ref, reactive, toRaw, computed, watchEffect } from 'vue';

const props=defineProps({
    dice: Dice,
    dice_index: Number,
    force_render: Number
  });

const emit=defineEmits(["explode"]);

let explode_options=reactive({});
explode_options.target_explode_on="max";
explode_options.explode_on_value=props.dice.getMaximum();
explode_options.added_dice_minimum=1;
explode_options.added_dice_maximum=props.dice.getMaximum();
explode_options.explosion_limit=1;

let showExplodeOptions=ref(false);
// let showFilterOptions=ref(false);
// let showDropOptions=ref(false);


const updateExplode=(_event)=>{
  explode_options.target_explode_on=_event.target.value;
  if(explode_emitted.value){
    emit("explode", explode_options);
  }
};

let explode_emitted=ref(false);
const emitExplode=()=>{
  emit("explode",explode_options);
  explode_emitted.value=true;
};

const updateExplodeOption=(_event, _target_option)=>{
  if(_event.key=="Enter"){
    _event.preventDefault();
  }
  if(!isNumeric(_event.target.innerText)){
    switch(_target_option){
      case "on_value":
        _event.target.innerText = explode_options.explode_on_value;
        break;
      case "add_max":
        _event.target.innerText = explode_options.added_dice_maximum;
        break;
      case "add_min":
        _event.target.innerText = explode_options.added_dice_minimum;
        break;
      case "limit":
        _event.target.innerText = explode_options.explosion_limit;
        break;
    }
    return undefined;
  }
  switch(_target_option){
    case "on_value":
      explode_options.explode_on_value = +_event.target.innerText;
      break;
    case "add_max":
      explode_options.added_dice_maximum = +_event.target.innerText;
      break;
    case "add_min":
      explode_options.added_dice_minimum = +_event.target.innerText;
      break;
    case "limit":
      explode_options.explosion_limit = +_event.target.innerText;
      break;
  }
  if(explode_emitted.value){
    emit("explode", explode_options);
  }
};
</script>

<template>
  <div>
    <div class="small bold"><input type="checkbox" v-model="showExplodeOptions" :checked="false"/>Explode Dice</div>
    <div v-if="showExplodeOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="explode_on" value="max" :checked="true" @change="updateExplode"/>On Max</span>&nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  value="min" :checked="false" @change="updateExplode"/>On Min</span> &nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  value="value" :checked="false" @change="updateExplode"/>On Value: <span class="editable" contenteditable @keydown.enter="updateExplodeOption($event, 'on_value')" @blur="updateExplodeOption($event, 'on_value')">{{ explode_options.explode_on_value }}</span></span>
      <br><br>
      <span style="display: flex; flex-direction: row;">
        <span>
          &nbsp;&nbsp;Added Dice
          <br>
          <!-- IMPLEMENT THIS SECTION -->
          <span><input type="radio" name="explode_dice" :checked="true"/>d<span class="editable" @keydown.enter="updateExplodeOption($event, 'add_max')" @blur="updateExplodeOption($event, 'add_max')" contenteditable>{{ explode_options.added_dice_maximum }}</span></span>&nbsp;&nbsp;
          <span><input type="radio" name="explode_dice" :checked="false"/><span class="editable" @keydown.enter="updateExplodeOption($event, 'add_min')" @blur="updateExplodeOption($event, 'add_min')" contenteditable>{{ explode_options.added_dice_minimum }}</span> to <span class="editable" @keydown.enter="updateExplodeOption($event, 'add_max')" @blur="updateExplodeOption($event, 'add_max')" contenteditable>{{ explode_options.added_dice_maximum }}</span></span>
        </span>
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;Explosion Limit: <span @keydown.enter="updateExplodeOption($event, 'limit')" @blur="updateExplodeOption($event, 'limit')" class="editable" contenteditable>{{ explode_options.explosion_limit }}</span>
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