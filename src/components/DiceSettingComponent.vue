<script setup>
import { isNumeric } from '../libs/isNumeric';
import { ref } from 'vue';

const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

const emit=defineEmits(["explode","filter","drop"])

let showExplodeOptions=ref(false);
let showFilterOptions=ref(false);
let showDropOptions=ref(false);
</script>

<template>
  <div>
    <div class="small bold"><input type="checkbox" v-model="showExplodeOptions" :checked="false"/>Explode Dice</div>
    <div v-if="showExplodeOptions" class="small" style="padding-left:0.5em;">
      <span><input type="radio" name="explode_on" :checked="true"/>On Max</span>&nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  :checked="false"/>On Min</span> &nbsp;&nbsp;
      <span><input type="radio" name="explode_on"  :checked="false"/>On Value: <span class="editable" contenteditable>9</span></span>
      <br><br>
      <span style="display: flex; flex-direction: row;">
        <span>
          &nbsp;&nbsp;Added Dice
          <br>
          <span><input type="radio" name="explode_dice" :checked="true"/>d<span class="editable" contenteditable>X</span></span>&nbsp;&nbsp;
          <span><input type="radio" name="explode_dice" :checked="false"/><span class="editable" contenteditable>X</span> to <span class="editable" contenteditable>Y</span></span>
        </span>
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;Explosion Limit: <span class="editable" contenteditable>1</span>
        </span>
      </span>
    </div>
    <div class="small bold"><input type="checkbox" v-model="showFilterOptions" :checked="false"/>Filter</div>
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
      <span><input type="radio" name="drop_on" :checked="false"/>Equal To Or Above: <span class="editable" contenteditable>9</span></span>
      <span><input type="radio" name="drop_on" :checked="false"/>Equal To Or Below: <span class="editable" contenteditable>9</span></span>
      <br>
      <span><input type="radio" name="drop_on" :checked="false"/>Even</span>&nbsp;&nbsp;
      <span><input type="radio" name="drop_on" :checked="false"/>Odd</span>
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
    border:thin solid white; 
    padding:0em 0.2em; 
    background-color: rgb(120, 255, 101); 
    color:#242424;
    font-weight: bold;
  }
</style>