<script setup>
//Component for displaying Dice object
  import { toRaw, ref, computed } from 'vue';

  const props=defineProps({
    dice: Object,
    dice_index: Number,
    force_render: Number
  });

  const showPool=(_dice)=>{
    //console.log("showing",toRaw(_dice));
    return "showing "+toRaw(_dice).getMinimum()+"D"+toRaw(_dice).getMaximum();
  }

  let showDiceMetrics=ref(false);
  let showDiceMetricsText=computed(()=>{return showDiceMetrics.value ? "Hide" : "Show"});
</script>

<template>
  <div>
    <div style="background-color: #242424; color: white; border-radius: 0.2em; padding:0em 0.5em 0.2em 0.5em; margin:0.2em;">
      <!-- {{ showPool(props.dice) }} at dice_index:{{ props.dice_index }} -->
      <div style="padding: 0.2em">
        <span style="padding: 0em 0.5em 0em 0.5em; font-weight: bold;">
          Dice#{{ dice_index+1 }}
        </span>
        <!-- <span style="border:thin solid white; border-radius: 0.2em; padding: 0em 0.5em 0em 0.5em"
          @click="editDice">
          Edit Dice
        </span> -->
        <span style="text-decoration: underline; padding: 0em 0.5em 0em 0.5em;"
          @click="toggleMetrics">
          {{showDiceMetricsText}} Metrics
        </span>
      </div>
      <span style="padding: 0em 1em 0em 1em; margin-left:1em; font-weight: bold; border-radius: 1em; border:thin solid white;">
        d {{toRaw(props.dice).getMaximum()}}
      </span>
    </div>
  </div>
  
</template>

<style scoped>
</style>