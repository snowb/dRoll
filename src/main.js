import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { IoCloseCircle, 
  GiCrownedExplosion, 
  BiArrowRepeat, 
  BiGearFill, 
  FaDiceD20 } from "oh-vue-icons/icons";

addIcons(IoCloseCircle, 
  GiCrownedExplosion, 
  BiArrowRepeat, 
  BiGearFill, 
  FaDiceD20);

const app=createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');