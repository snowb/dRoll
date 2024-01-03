<script setup>
import { ref } from 'vue';
import PoolsContainer from './components/PoolsContainer.vue';

let showInformation=ref(false);
const toggleInformation=()=>{
  showInformation.value=!showInformation.value;
}
</script>

<template>
  <div>
    <div @click="toggleInformation" v-if="!showInformation" style="margin-left:10px; color:rgb(154, 154, 255); font-weight: bold; text-decoration: underline; cursor: pointer;">Show Information</div>
    <div v-if="showInformation" style="margin-left:10px; text-align: left; align-self: flex-start;">
      <span @click="toggleInformation" style="color:rgb(154, 154, 255); font-weight: bold; text-decoration: underline; cursor: pointer;">Hide Information</span><br>
      <span style="color: rgb(120, 255, 101);">Green Boxes</span> are editable.<br>
      Click <span class="button pointer" style="border:thin solid white; padding:0em 0.5em 0em 0.5em; border-radius: 0.2em;">Add Pool</span> to add a Pool.<br>
      &nbsp;&nbsp;&nbsp;&nbsp; Change the number in the <span style="font-weight: bold;">Iterations</span> box for the number of rolls to model.<br>
      &nbsp;&nbsp;&nbsp;&nbsp; Click <img style="background-color: #dbdbdb; width:1em; height:1em;" src="./assets/black-redo.svg"/> to re-roll the entire Pool.<br>
      &nbsp;&nbsp;&nbsp;&nbsp; Click "Delete Pool" to delete the Pool.<br><br>

      Click <span class="button pointer" style="display:inline-block; border:thin solid black; border-radius: 0.2em; padding: 0em 0.5em 0em 0.5em; background-color: #dbdbdb; color:#242424">Add Dice</span> to add a Dice <span style="font-size: smaller;">(default 1D6)</span>.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Change value in the <span style="color: rgb(120, 255, 101);">Green Box</span> to the desired dice-size.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <img style="width:1em; height:1em;" src="./assets/white-gear.svg"/> to switch from dX mode <span style="font-size: smaller;">(d6, d10, etc)</span> to X-to-Y mode <span style="font-size: smaller;">(-6 to 6, etc)</span>.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <img style="width:1em; height:1em;" src="./assets/white-redo.svg"/> to re-roll the individual Dice.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <img style="width:1em; height:1em;" src="./assets/white-close-circle.svg"/> to drop the individual Dice from the Pool.<br>
      <br>
      <span @click="toggleInformation" style="color:rgb(154, 154, 255); font-weight: bold; text-decoration: underline; cursor: pointer;">Hide Information</span>
    </div>
    <br>
    <PoolsContainer></PoolsContainer>
  </div>
</template>

<style scoped>
</style>
