<script setup>
//import HelloWorld from './components/HelloWorld.vue'
import { Dice } from './libs/dice-class-v1';
import { Pool } from './libs/pool-class-v1';
import PoolsContainer from './components/PoolsContainer.vue';

const newPool=new Pool([new Dice(1,6),new Dice(1,6)]);
</script>

<template>
  <!--div>{{newPool.getSets()}}</div>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />--->
  <div>
    <PoolsContainer></PoolsContainer>
  </div>
</template>

<style scoped>
</style>
