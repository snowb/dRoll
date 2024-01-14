<script setup>
import { onMounted, ref } from 'vue';
import PoolsContainer from './components/PoolsContainer.vue';

let showInformation=ref(false);
const toggleInformation=()=>{
  showInformation.value=!showInformation.value;
};

onMounted(()=>{
  let queryString=new URLSearchParams(document.location.search);
  //console.log(JSON.parse(queryString.get("pools")));
  //console.log(JSON.stringify([{f:1,t:10}])) = [{"f":1,"t":10}]
});
</script>

<template>
  <div class="margin-10px">
    <span class="bold info_button" @click="toggleInformation" v-if="!showInformation">Show Information</span>
    <span class="shown_info" v-if="showInformation">
      <span class="bold info_button" @click="toggleInformation">Hide Information</span><br>
      This is dRoll, the Dice Roll Simulator. A large number <span class="smaller">(default 10,000)</span> of values are 'rolled' via a cryptographically strong random value generator.<br>
      This is not a purely statistical output simulator. Although higher iteration values will approach the statistically accurate values, it is meant to capture a more realistic feel.<br> 
      <br>
      <span class="green_box bold">Green Boxes</span> are editable.<br>
      Click <span class="add_pool button_shape">Add Pool</span> to add a Pool.<br>
      &nbsp;&nbsp;&nbsp;&nbsp; Change the number in the <span class="bold">Iterations</span> box for the number of rolls to model. <span class="smaller">(Updates on Enter, Tab or focus change EXCEPT for Explode Dice settings)</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp; Click <v-icon name="bi-arrow-repeat" scale="1" fill="#242424" style="background-color:#dbdbdb"></v-icon> to re-roll the entire Pool.<br>
      &nbsp;&nbsp;&nbsp;&nbsp; Click "Delete Pool" to delete the Pool.<br><br>

      Click <span class="add_dice button_shape">Add Dice</span> to add a Dice <span class="smaller">(default 1D6)</span>.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Change value in the <span class="green_box bold">Green Box</span> to the desired dice-size.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <v-icon name="fa-exchange-alt" scale="1" fill="#dbdbdb"></v-icon> to switch from dX mode <span class="smaller">(d6, d10, etc)</span> to X-to-Y mode <span style="font-size: smaller;">(-6 to 6, etc)</span>.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <v-icon name="bi-arrow-repeat" scale="1" fill="#dbdbdb"></v-icon> to re-roll the individual Dice.<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Click <v-icon name="io-close-circle" scale="1" fill="#dbdbdb"></v-icon> to drop the individual Dice from the Pool.<br>
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

</style>
