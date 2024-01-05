import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { IoCloseCircle, 
  GiCrownedExplosion, 
  BiArrowRepeat, 
  BiGearFill,
  BiDice6Fill,
  GiCardBurn,
  FaDiceD20 } from "oh-vue-icons/icons";

addIcons(IoCloseCircle, 
  GiCrownedExplosion, //for exploding dice 
  BiArrowRepeat,      //for re-roll 
  BiGearFill,         //for setting change ... switch to   FaExchangeAlt?
  BiDice6Fill,        //for Add Dice (maybe)
  GiCardBurn,         //for Add Deck (maybe, need to modify Path)
                      // combined icon for show/hide Sets?
                      // combined icon for show/hide Sequences?
                      // {FcCancel | FaSlash | FaSlashSolid | BiSlashLg | BiSlash} to combine with Sets/Sequences ... other?
                      // HiSolidFilter for filtering
                      // Below X - BiArrowBarDown, FaLessThan
                      // Above X - BiArrowBarUp, FaGreaterThan
                      // Equal to X - FaEquals
  FaDiceD20);         //for D20 ... Add Dice?

const app=createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');