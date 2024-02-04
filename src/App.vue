<script setup>
import { ref } from 'vue';
import PoolsContainer from './components/PoolsContainer.vue';

let showInformation=ref(false);
const toggleInformation=()=>{
  showInformation.value=!showInformation.value;
};

const datetime = new Date(__BUILD_DATETIME__).toJSON();
</script>

<template>
  <div class="margin-10px">
    <span class="bold info_button" @click="toggleInformation" v-if="!showInformation">Show Information</span>
    <span class="shown_info" v-if="showInformation">
      <span class="bold info_button" @click="toggleInformation">Hide Information</span><br>
      <span style="font-size:xx-small">Updated: {{datetime}}</span><br>
      This is dRoll, the Dice Roll Simulator. A large number <span class="smaller">(default 10,000)</span> of values are 'rolled' via a cryptographically strong random value generator.<br>
      This is not a purely statistical output simulator. Although higher iteration values will approach the statistically accurate values, it is meant to capture a more realistic feel.<br> 
      <br>
      <span class="green_box bold">Green Boxes</span> are editable.<br>
      Click <span class="add_pool button_shape">Add Pool</span> to add a Pool.<br>
      <span style="margin-left: 1em;">Change the number in the <span class="bold">Iterations</span> box for the number of rolls to model. <span class="smaller">(Updates on Enter, Tab or focus change EXCEPT for Explode Dice settings)</span></span><br>
      <span style="margin-left: 1em;">Click <v-icon name="bi-arrow-repeat" scale="1" fill="#242424" style="background-color:#dbdbdb"></v-icon> to re-roll the entire Pool.</span><br>
      <span style="margin-left: 2em;">Click "Delete Pool" to delete the Pool.</span><br>
      <span style="margin-left: 2em;">Click <v-icon name="bi-gear-fill" scale="1" fill="#242424" style="background-color: #dbdbdb;"></v-icon> to show or hide Pool options.</span><br>
      <span style="margin-left: 3em;">Click <span style="font-weight: bold; font-size: small; color:#242424; background-color:#dbdbdb"><input type="checkbox" checked="true"/>Filter By Dice Value </span>&nbsp;to filter Pools by the Value of its Dice.</span><br>
      <span style="margin-left: 4em;">Select <span style="font-weight: bold; font-size: small; color:#242424; background-color:#dbdbdb">Keep Only Dice ...</span>&nbsp;to filter out Dice with non-matching values.</span><br>
      <span style="margin-left: 4em;">Select <span style="font-weight: bold; font-size: small; color:#242424; background-color:#dbdbdb">Keep Pools With Dice ...</span>&nbsp;to filter out Pools without at least 1 matching value.</span><br>
      <span style="margin-left: 3em;">Click <span style="font-weight: bold; font-size: small; color:#242424; background-color:#dbdbdb"><input type="checkbox" checked="true"/>Pool Operation </span>&nbsp;to apply an Operation <span class="smaller">(in display order) </span>and/or Function to the Pool results.</span><br>
      <span style="margin-left: 3em;">Click <span style="font-weight: bold; font-size: small; color:#242424; background-color:#dbdbdb"><input type="checkbox" checked="true"/>Filter By Pool Value </span>&nbsp;and select to filter out Pools with non-matching totals.</span><br>
      <span style="margin-left: 3em;">Click <span class="filter_button">Filter</span> to apply the filter.</span><br>
      <br>
      Click <span class="add_dice button_shape">Add Dice</span> to add a Dice <span class="smaller">(default 1D6)</span>.<br>
      <span style="margin-left: 1em;">Change value in the <span class="green_box bold">Green Box</span> to the desired dice-size.</span><br>
      <span style="margin-left: 1em;">Click <v-icon name="fa-exchange-alt" scale="1" fill="#dbdbdb"></v-icon> to switch from dX mode <span class="smaller">(d6, d10, etc)</span> to X-to-Y mode <span style="font-size: smaller;">(-6 to 6, etc)</span>.</span><br>
      <span style="margin-left: 1em;">Click <v-icon name="bi-arrow-repeat" scale="1" fill="#dbdbdb"></v-icon> to re-roll the individual Dice.</span><br>
      <span style="margin-left: 1em;">Click <v-icon name="io-close-circle" scale="1" fill="#dbdbdb"></v-icon> to drop the individual Dice from the Pool.</span><br>
      <span style="margin-left: 1em;">Click <v-icon name="bi-gear-fill" scale="1" fill="#dbdbdb" style="background-color: #242424;"></v-icon> to show or hide Dice options.</span><br>
      <span style="margin-left: 2em;">Click <span style="font-weight: bold; font-size: small; color:#dbdbdb; background-color:#242424;"><input type="checkbox" checked="true"/>Explode Dice </span>&nbsp;to show Explode Dice options.</span><br>
      <span style="margin-left: 2em; border:thin solid white; padding:0em 0.5em 0em 0.5em; border-radius: 0.4em; box-shadow: 2px 2px 1px 0px #dbdbdb; font-size:small;">Explode</span> to apply options and Explode the Die.<br>

      <span class="bold info_button" @click="toggleInformation">Hide Information</span>
    </span>
    <br>
    <br>
    <PoolsContainer></PoolsContainer>
  </div>
</template>

<style scoped>
.margin-10px{
  margin-left:10px;
}
.shown_info{
  text-align: left;
}
.info_button{
  color:rgb(154, 154, 255); 
  text-decoration: underline; 
  cursor: pointer;
}
.green_box{
  color: rgb(120, 255, 101);
}
.button_shape{
  padding:0em 0.5em 0em 0.5em; 
  border-radius: 0.2em;
}
.add_pool{
  border:thin solid white; 
  
}
.add_dice{
  display:inline-block; 
  border:thin solid black; 
  background-color: #dbdbdb; 
  color:#242424
}
.bold{
  font-weight: bold;
}
.smaller{
  font-size: smaller;
}
.filter_button {
  border:thin solid black; 
  padding:0em 0.5em 0em 0.5em; 
  border-radius: 0.4em;
  box-shadow: 2px 2px 1px 0px #242424;
  cursor: pointer;
  display:inline-block; 
  color: #242424;
  background-color: #dbdbdb;
  font-size: small;
}
</style>
