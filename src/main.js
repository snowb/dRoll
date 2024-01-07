import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { IoCloseCircle, 
  GiCrownedExplosion, 
  BiArrowRepeat, 
  BiGearFill,
  FaExchangeAlt,
  BiDice6Fill,
  GiCardBurn,
  OiCircleSlash,
  MdResettvRound,
  FaDiceD20 } from "oh-vue-icons/icons";

addIcons(IoCloseCircle, 
  GiCrownedExplosion, //for exploding dice 
  BiArrowRepeat,      //for re-roll 
  BiGearFill,         //for advanced setting change
  FaExchangeAlt,      //for switching between dX and X-to-Y Dikce
  BiDice6Fill,        //for Add Dice (maybe)
  GiCardBurn,         //for Add Deck (maybe, need to modify Path)
  OiCircleSlash,            // combined icon for show/hide Sets?
  MdResettvRound,
                      // combined icon for show/hide Sequences?
                      // HiSolidFilter for filtering
                      // Below X - BiArrowBarDown, FaLessThan
                      // Above X - BiArrowBarUp, FaGreaterThan
                      // Equal to X - FaEquals
  FaDiceD20);         //for D20 ... Add Dice?

const app=createApp(App);
app.component("v-icon", OhVueIcon);
app.mount('#app');