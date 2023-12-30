<script setup>
  import { defineProps, toRaw, watchEffect, ref, unref, watch, shallowReactive} from 'vue';

  const props=defineProps({
    pool: Object,
    pool_index: Number
  });

  const emit=defineEmits(['addDice']);
  const addDice=()=>{
    emit('addDice', {pool_index:props.pool_index, min:1, max:6, modifier:0});
  };
  const showPool=(_dice)=>{
    console.log("showing",toRaw(_dice));
    return "showing "+toRaw(_dice).getMinimum()+"D"+toRaw(_dice).getMaximum();
  }

  let rawPoolFullResults=null;
  let refPoolStringFullResults=ref("test1");
  let count=0;
  watchEffect(()=>{
    //let pool=props.pool;
    console.log("watchPostEffect 1",props.pool)
    console.log("watchPostEffect 2",unref(props.pool))
    //let pool=props.pool.value;
    //rawPoolFullResults=toRaw(pool); 
    //rawPoolFullResults==pool; 
    //console.log("PoolComponent : watchPostEffect",rawPoolFullResults);
    refPoolStringFullResults.value="test"+count;//JSON.stringify(rawPoolFullResults);
    count++;
    });
  watch(props.pool, (_pool, _old_pool)=>{
    console.log("pool changed")
  });
</script>

<template>
  <span>
    <span style="border:thick solid red; border-radius: 0.2em; padding: 0em 0.5em 0em 0.5em" @click="addDice">Add Dice</span>
    <div v-for="(dice,dice_index) in unref(props.pool)">{{ showPool(dice) }} at dice_idnex:{{ dice_index }}</div>
    <div>{{ refPoolStringFullResults }}</div>
  </span>
  
</template>

<style scoped>
  #container {
    border: thin solid pink;
  }
</style>