<script setup>
import { isNumeric } from '../libs/isNumeric';
import { Metrics_Pool } from '../libs/metrics-pool-class';
import { ref, reactive, computed, watchEffect, watch } from 'vue';

const props=defineProps({
    pool: Metrics_Pool,
    force_render: Number,
    pool_index: Number
  });

let filter_options=reactive({});
filter_options.filter_value=1;
filter_options.filter_value_max=3;
filter_options.filter_type="equal";
filter_options.filter_type_modifier="pool";
filter_options.drop_value=1;
filter_options.drop_type="lowest";
filter_options.drop_count=1;

const emit=defineEmits(["filterPoolDice","dropPoolDice"]);

let showDiceFilterOptions=ref(false);

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
  if(filter_options.filter_type=="range"){
    if(filter_options.filter_value > filter_options.filter_value_max){
      let value_swap = filter_options.filter_value;
      filter_options.filter_value = filter_options.filter_value_max;
      filter_options.filter_value_max = value_swap;
    }
    else if(filter_options.filter_value == filter_options.filter_value_max){
      filter_options.filter_value_max += 1;
    }
  }
  emit("filterPoolDice",{
    type: filter_options.filter_type, 
    type_modifier: filter_options.filter_type_modifier, 
    value: filter_options.filter_value,
    max_value: filter_options.filter_value_max,
    drop_count: filter_options.drop_count
  });
};

let showPoolFilterOptions=ref(false);

//let showExplodeOptions=ref(false);

watchEffect(()=>{
  if(showDiceFilterOptions.value==false && showPoolFilterOptions.value==false){
    emit("filterPoolDice",{type:"full"});
  }
});

watch([showDiceFilterOptions, showPoolFilterOptions], ([_new_dice_value, _new_pool_value],[_old_dice_value, _old_pool_value])=>{
  if(_new_dice_value==true && _old_dice_value==false){
    showPoolFilterOptions.value=false;
  }
  if (_new_pool_value==true && _old_pool_value==false){
    showDiceFilterOptions.value=false;
  }
});

const inputSize=computed(()=>{
  props.force_render;
  return props.pool.getPoolMax().toString().length+2;
});
</script>

<template>
  <div style="overflow:hidden;">
    <div class="small bold check_box_root"><input type="checkbox" v-model="showDiceFilterOptions" :checked="false"/>Filter By Dice Value</div>
    <Transition>
      <div v-if="showDiceFilterOptions" class="small" style="padding-left:0.5em;">
        <div style="font-weight: bold;" title="Keep only dice of matching type/value, discard others.">Keep Only Dice ...</div>
        <span title="Show Lowest Dice in the Pool."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'lowest')"/>Lowest</span>&nbsp;&nbsp;
        <span title="Show Highest Dice in the Pool."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'highest')"/>Highest <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.drop_count"/></span>&nbsp;&nbsp;&nbsp;&nbsp; 
        <span title="Show Pool with non-Even Dice removed."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'even','dice')"/>Even</span>&nbsp;&nbsp;
        <span title="Show Pool with non-Odd Dice removed."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'odd','dice')"/>Odd</span>
        <br>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'equal','dice')"/>Equal To</span>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'above','dice')"/>Above</span>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'below','dice')"/>Below: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/></span>
        <br>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'range','dice')"/>Range From: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/> To: <input type="number" id="range_max" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value_max"/></span>
        <div style="border-top: thin solid #242424; margin-top:0.2em;"></div>
        <div style="font-weight: bold;" title="At least 1 Dice of selected value is in pool">Keep Pools With Dice ...</div>
        <span title="Show Pool where at least 1 Dice is an Even value."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'even','pool')"/>Even</span>&nbsp;&nbsp;
        <span title="Show Pool where at least 1 Dice is an Odd value."><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'odd','pool')"/>Odd</span>      
        <br>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'equal','pool')"/>Equal To</span>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'above','pool')"/>Above</span>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'below','pool')"/>Below: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/></span>
        <br>
        <span><input type="radio" :name="'dice_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'range','pool')"/>Range From: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/> To: <input type="number" id="range_max" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value_max"/></span>
        <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
          <span style="visibility: hidden;" class="button">Filter</span>
          <span class="button far_right_position" @click="emitFilter">Filter</span>
        </div>
      </div>
    </Transition>
    <div class="small bold check_box_root"><input type="checkbox" v-model="showPoolFilterOptions" :checked="false"/>Filter By Pool Value</div>
    <Transition>
      <div v-if="showPoolFilterOptions" class="small" style="padding-left:0.5em;">
        <span title="Show Pool where at least 1 Dice is an Even value."><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'sum_even','pool')"/>Even</span>&nbsp;&nbsp;
        <span title="Show Pool where at least 1 Dice is an Odd value."><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event, 'sum_odd','pool')"/>Odd</span>      
        <br>
        <span><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'sum_equal','pool')"/>Equal To</span>
        <span><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'sum_above','pool')"/>Above</span>
        <span><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'sum_below','pool')"/>Below: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/></span>
        <br>
        <span><input type="radio" :name="'pool_filter_on'+props.pool_index" :checked="false" @change="updateFilterOption($event,'sum_range','pool')"/>Range From: <input type="number" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value"/> To: <input type="number" id="range_max" :size="inputSize" class="editable" @keydown.enter="updateFilterValue" @blur="updateFilterValue" v-model="filter_options.filter_value_max"/></span>
        <div style="display: flex; flex-direction: row; position: relative; margin-bottom:0.2em;">
          <span style="visibility: hidden;" class="button">Filter</span>
          <span class="button far_right_position" @click="emitFilter">Filter</span>
        </div>
      </div>
    </Transition>
    <!-- <div v-if="false" class="small bold" style="border-top:thin solid #242424;"><input type="checkbox" v-model="showExplodeOptions" :checked="false"/>Explode Pool Dice</div> -->
    <!-- <div v-if="showExplodeOptions" class="small" style="padding-left:0.5em;"> -->
      <!--

        need explode based on each Dice (max, min, value) and Pool (max, min, value) 
        maybe not Pool? Leave as individual dice option 
      -->
    <!-- </div> -->
  </div>
</template>

<style scoped>
.check_box_root{
  background-color: #e7e7e7; 
  position: relative; 
  z-index: 10;
}
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

  .v-enter-active,
  .v-leave-active {
    transition: transform 0.25s ease;
    transform: translateY(0%);
  }

  .v-enter-from,
  .v-leave-to {
    transform: translateY(-100%);
  }
</style>