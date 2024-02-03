<script setup>
//Component for displaying Dice object
  import { toRaw, ref, computed, reactive, watch } from 'vue';
  import { isNumeric } from '../libs/isNumeric';
  import MetricsGraphComponent from './MetricsGraphComponent.vue';
  import DiceSettingComponent from './DiceSettingComponent.vue';
  import { Metrics_Dice } from '../libs/metrics-dice-class';

  const props=defineProps({
    dice: Metrics_Dice,
    dice_index: Number,
    force_render: Number,
    re_roll_explodes: Number,
    //filter_options: Object
  });

  const emit=defineEmits(["updateValue","dropDice", "reRollDice", "explodeDice"]);

  const diceMetrics=computed(()=>{
    props.force_render;
    return props.dice.getMetrics().reduce((_graph_values, _metric)=>{
      _graph_values.labels.push(_metric.value);
      _graph_values.values.push(_metric.ratio*100);
      return _graph_values;
    },{labels:[],values:[]});
  });

  let showDiceMetrics=ref(false);
  const showDiceMetricsText=computed(()=>{return showDiceMetrics.value ? "Hide" : "Show"});
  let editMode=ref("basic");
  const toggleMode=()=>{editMode.value=editMode.value=="basic" ? "advanced" : "basic"};
  const toggleMetrics=()=>{showDiceMetrics.value=!showDiceMetrics.value;};

  const editValue=(_event, _value_to_update)=>{
    let updated_value=undefined;
    if(_event.key=="Enter"){
      _event.preventDefault();
    }
    switch(true){
      case ["max","min","mod"].includes(_value_to_update) && isNumeric(_event.target.value):
        updated_value = +_event.target.value;
        if(_value_to_update=="max" && updated_value < stored_values.min){
          updated_value = stored_values.min;
          _event.target.value = stored_values.min;
        }
        if(_value_to_update=="min" && updated_value > stored_values.max){
          updated_value = stored_values.max;
          _event.target.value = stored_values.max;
        }
        break;
      case ["max","min","mod"].includes(_value_to_update) && !isNumeric(_event.target.value):
        _event.target.value = saved_focus_value;
        return undefined;
    }
    console.log('here1',updated_value,previous_values[_value_to_update])
    if(updated_value != previous_values[_value_to_update]){
      console.log('here 2')
      emit("updateValue",{target_dice_index:props.dice_index, target_value:_value_to_update, new_value:updated_value});
      stored_values[_value_to_update] = updated_value;
    }
  };

  const width=computed(()=>{
    return toRaw(props.dice).getMaximum()*150/6+"px";
  });

  const dropDice=()=>{
    emit("dropDice", props.dice_index);
  };
  
  const reRollDice=()=>{
    if(!is_exploded_dice){
      //don't re-roll exploded dice
      emit("reRollDice",props.dice_index);
    }
  }
  let close_icon_hover=ref(false);
  const close_icon_color=computed(()=>{
    return close_icon_hover.value ? "#ffb4b4" : "#dbdbdb" ;
  });

  let showSettings=ref(false);
  const showSettingsToggle=()=>{
    showSettings.value=!showSettings.value;
  }

  const explodeDice=(_explode_options)=>{
    let added_dice=new Metrics_Dice(_explode_options.added_dice_minimum,_explode_options.added_dice_maximum);
    let value_to_explode_on = "max";
    if(_explode_options.target_explode_on=="min"){
      value_to_explode_on = "min";
    } else if(_explode_options.target_explode_on=="value"){
      value_to_explode_on = _explode_options.explode_on_value;
    }
    let exploded_dice=props.dice.explodeValue(value_to_explode_on,_explode_options.explosion_limit,added_dice);
    emit("explodeDice",exploded_dice);
  }

  const is_exploded_dice=computed(()=>{
    return props.dice.getAdditionalText().search(/explod/gi) !== -1; //"Exploding";
  });

  let stored_values = reactive({
    min: toRaw(props.dice).getMinimum(), 
    max: toRaw(props.dice).getMaximum(),
    mod: toRaw(props.dice).getModifier()
  });

  let previous_values = reactive({
    min: undefined, max: undefined, mod: undefined
  });

  watch(()=>stored_values.max, (_current, _previous)=>{
    previous_values.max = _previous;
  });
  watch(()=>stored_values.min, (_current, _previous)=>{
    previous_values.min = _previous;
  });
  watch(()=>stored_values.mod, (_current, _previous)=>{
    previous_values.mod = _previous;
  });

  const inputSize=computed(()=>{
    props.force_render;
    return stored_values.max.toString().length+2;
  });

/*   let diceSign = ref("positive");

  const changeSign=(_dice_sign)=>{
    diceSign.value = _dice_sign;
  };

  watchPostEffect(()=>{
    props.force_render;
    console.log(diceSign.value)
    if(editMode.value == "basic" && 
    diceSign.value != "negative" &&
    toRaw(props.dice).getMinimum() < -1 && 
    toRaw(props.dice).getMaximum() == -1){
      changeSign("negative");
    }
  }); */
</script>

<template>
  <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0.2em 0em 0.2em; margin:0.2em;">
    <div>
      <div style="position: relative; display: flex; flex-direction: row; align-items: center;">
        <v-icon v-if="is_exploded_dice" title="Additional/Explode Dice" name="gi-crowned-explosion" scale="1" fill="orange"></v-icon>
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
      <div style="display: flex; flex-direction: row; align-items: center; position:relative; margin-bottom:0.2em;"> 
        <span v-if="editMode=='basic'" style="display:inline-flex; padding: 0em 0.5em; margin-left:0.2em; border-radius: 1em; border:thin solid white;">
          <span style="font-weight: bold;">d</span>&nbsp;<input title="Die Size" :class="{green:!is_exploded_dice}" type="number" :disabled="is_exploded_dice" :size="inputSize" class="box" @keydown.enter="editValue($event,'max')" @blur="editValue($event,'max')" @change="editValue($event,'max')" v-model="stored_values.max"/>
          &nbsp;+/-&nbsp;<input title="Simple +/- Modifier" :class="{green:!is_exploded_dice}" type="number" :disabled="is_exploded_dice" :size="inputSize" class="box" @keydown.enter="editValue($event,'mod')" @blur="editValue($event,'mod')" @change="editValue($event,'mod')" v-model="stored_values.mod"/>
        </span>
        <span v-if="editMode=='advanced'" style="display:inline-flex; padding: 0em 0.5em; margin-left:0.2em; font-weight: bold; border-radius: 1em; border:thin solid white;">
          <input title="Range of roll starting value, inclusive" :class="{green:!is_exploded_dice}" type="number" :disabled="is_exploded_dice" :size="inputSize" class="box" @keydown.enter="editValue($event,'min')" @blur="editValue($event,'min')" @change="editValue($event,'min')" v-model="stored_values.min"/>
          &nbsp;to&nbsp;
          <input title="Range of roll ending value, inclusive" :class="{green:!is_exploded_dice}" type="number" :disabled="is_exploded_dice" :size="inputSize" class="box" @keydown.enter="editValue($event,'max')" @blur="editValue($event,'max')" @change="editValue($event,'max')" v-model="stored_values.max"/>
        </span>
        <v-icon class="pointer" style="padding:0.1em;" hover animation="pulse" speed="slow" @click="toggleMode" title="Toggle Input Mode" name="fa-exchange-alt" scale="1" fill="#dbdbdb"></v-icon> 
        <v-icon class="pointer" style="margin-right:2em;" hover animation="spin" speed="slow" @click="reRollDice" title="Re-Roll Dice" name="bi-arrow-repeat" scale="1" fill="#dbdbdb"></v-icon>
        <v-icon v-if="!is_exploded_dice" class="pointer" @click="showSettingsToggle" style="position: absolute; right: 0em;" hover animation="spin" speed="slow" :title="(showSettings?'Hide':'Show')+' Dice Settings'">
          <v-icon name="bi-gear-fill" :scale="showSettings?0.75:1" fill="#dbdbdb"></v-icon>
          <v-icon v-if="showSettings" name="oi-circle-slash" fill="#ff0000" scale="1"></v-icon>
        </v-icon>
      </div>
      <div v-if="showSettings" style="border-top: thin solid #dbdbdb;">
        <!-- <DiceSettingComponent @explode="explodeDice" @changeSign="changeSign" :re_roll_explodes="props.re_roll_explodes"
          :dice="props.dice" :force_render="props.force_render" :edit_mode="editMode"
        ></DiceSettingComponent> -->
        <DiceSettingComponent @explode="explodeDice" :re_roll_explodes="props.re_roll_explodes"
          :dice="props.dice" :force_render="props.force_render" :edit_mode="editMode"
        ></DiceSettingComponent>
      </div>
    </div>
    <div v-if="showDiceMetrics" style="border-top: thin solid #dbdbdb;">
      <MetricsGraphComponent :style="{color:'#ddd',backgroundColor:'#ddd',gridColor:'#dddddd1a'}"
        :force_render="force_render" :metrics="diceMetrics" :width="width" title="Roll Values"
        :no_show_average="true"
      ></MetricsGraphComponent>
    </div>
  </div>
  
</template>

<style scoped>
  .pointer:hover{
      cursor: pointer;
    }
  .blue-link:hover{
    color:rgb(130, 130, 255);
  }
  .box {
    border:thin solid white; 
    padding:0em 0.2em; 
    font-weight: bold;
  }
  .green{
    background-color: rgb(120, 255, 101);  
    color:#242424;
  }
</style>