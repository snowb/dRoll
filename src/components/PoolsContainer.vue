<script setup>
  import { toRaw, triggerRef, shallowRef, ref, onMounted} from 'vue';
  import PoolComponent from './PoolComponent.vue';
  import { Metrics_Pool } from '../libs/metrics-pool-class';
  
  const pools=shallowRef([]);

  const forceRender=()=>{return Math.random()};//passing non-tracked objects, needed to trigger changes

  const addPool=()=>{
    pools.value=[...pools.value, new Metrics_Pool()];
    triggerRef(pools);
  };
  const addDice=(_arguments)=>{
    toRaw(pools.value[_arguments.pool_index]).addDice(_arguments.min, _arguments.max, _arguments.modifier);
    triggerRef(pools);
  };

  const explodeDice=(_explode_dice)=>{
    dropExplodeDice(_explode_dice.pool_index);
    toRaw(pools.value[_explode_dice.pool_index]).addDice(_explode_dice.add_dice);
    triggerRef(pools);
  };

  const dropDice=(_target_pool_index, _target_dice_index, _no_pool_reroll)=>{
    toRaw(pools.value[_target_pool_index]).dropDice(_target_dice_index, _no_pool_reroll);
    triggerRef(pools);
  };

  const reRollDice=(_target_pool_index, _target_dice_index)=>{
    toRaw(pools.value[_target_pool_index]).reRollDice(_target_dice_index);
    triggerRef(pools);
  };

  const dropPool=(_target_pool_index)=>{
    toRaw(pools.value).splice(_target_pool_index,1);
    triggerRef(pools);
  };

  const resetPool=(_target_pool_index)=>{
    console.log("reset ",_target_pool_index)
    pools.value[_target_pool_index] = new Metrics_Pool();
    triggerRef(pools);
  };

  let re_roll_explodes=ref(0);

  const dropExplodeDice=(_target_pool_index)=>{
    toRaw(pools.value[_target_pool_index]).getFullRollResults().reduceRight((undefined,_dice,_dice_index)=>{
      if(_dice.getAdditionalText()=="Exploding"){
        dropDice(_target_pool_index, _dice_index, true);
      }
    },undefined);
  };

  const reRollPool=(_target_pool_index)=>{
    dropExplodeDice(_target_pool_index);
    toRaw(pools.value[_target_pool_index]).rollPool(toRaw(pools.value[_target_pool_index]).getIterations());
    triggerRef(pools);
    re_roll_explodes.value++;
  };

  const updateValue=(_value_to_update)=>{
    let new_values={
      target_dice_index: _value_to_update.target_dice_index,
      min:0, max:0, mod:0
    };
    if(["min","max","mod"].includes(_value_to_update.target_value)){
      let target_dice=pools.value[_value_to_update.target_pool_index].getFullRollResults()[_value_to_update.target_dice_index];
      new_values.min = target_dice.getMinimum();
      new_values.max = target_dice.getMaximum();
      new_values.mod = target_dice.getModifier();
    }
    let action="updateDice";
    switch(_value_to_update.target_value){
      case "min":
        new_values.min = _value_to_update.new_value;
        break;
      case "max":
        new_values.max = _value_to_update.new_value;
        break;
      case "mod":
        new_values.mod = _value_to_update.new_value;
        break;
      case "iterations":
        action="updateIterations";
        break;
    }
    switch(action){
      case "updateDice":
        pools.value[_value_to_update.target_pool_index].updateDice(new_values.target_dice_index, new_values.min, new_values.max, new_values.mod);
        break;
      case "updateIterations":
        pools.value[_value_to_update.target_pool_index].setIterations(+_value_to_update.new_value);
        reRollPool(_value_to_update.target_pool_index);
        break;
    }
    triggerRef(pools);
  };

  let sharedPools = undefined; // make ref? or keep all logic in onMounted? Probably need to pass down
  // something for exploding values ...
  onMounted(()=>{
    if(document.location.search!==""){
      let queryString=new URLSearchParams(document.location.search);
      let temp_shared_pools = queryString.getAll("p");
      let temp_shared_dice = queryString.getAll("d");

      temp_shared_pools = temp_shared_pools.map((_pool_info)=>{
        //need to handle invalid input
        let pool_object = {raw:_pool_info};
        let temp_data = _pool_info.split(";");
        pool_object.pool_id = +temp_data[0];
        pool_object.iterations = "0x"+temp_data[1];
        pool_object.iterations = +pool_object.iterations.toString("10");
        pool_object.filter = +temp_data[2].split(":")[0];

        switch(pool_object.filter){
          case 8:          case 14:          case 20:
            let temp_filter_values = temp_data[2].split(":")[1].split("-");
            pool_object.filter_value_1 = +temp_filter_values[0];
            pool_object.filter_value_2 = +temp_filter_values[1];
            break;
          case 1:          case 2:          case 5:
          case 6:          case 7:          case 11:
          case 12:         case 13:         case 17:
          case 18:         case 19:
          pool_object.filter_value_1 = +temp_data[2].split(":")[1];
            break;
          default:
            //nothing to do for filter values with Odd/Even
        }
        pool_object.dice = [];
        return pool_object;
      });

      temp_shared_pools.sort((_a, _b)=>{
        if(_a.pool_id < _b.pool_id){ return -1
        } else { return 1; }
      });
      
      temp_shared_dice = temp_shared_dice.map((_dice_info)=>{
        let dice_object = {raw:_dice_info};
        let dice_data = _dice_info.split(";");
        dice_object.pool_id = +dice_data[0];
        dice_object.exploding = +dice_data[2];
        if(dice_data[1].match("-")){
          let temp_dice_data = dice_data[1].split("-");
          dice_object.min_value = +("0x"+temp_dice_data[0]).toString("10");
          dice_object.max_value = +("0x"+temp_dice_data[1]).toString("10");
        } else {
          dice_object.min_value = 1;  
          dice_object.max_value = +("0x"+dice_data[1]).toString("10");
        }
        return dice_object;
      });

      temp_shared_dice.forEach((_dice)=>{
        let invalid_pool=true;
        if(_dice.pool_id < temp_shared_pools.length){
          temp_shared_pools.some((_pool)=>{
            if(_pool.pool_id == _dice.pool_id){
              _pool.dice.push(_dice);
              invalid_pool =  false;
              return true;
            }
          });
        }
        if(invalid_pool){
          console.warn("dRoll App: provide shared URL pool id is invalid for '"+_dice.raw+"', ignoring.");
        }
      });
      sharedPools = temp_shared_pools;
    }
    console.log(sharedPools)
  });
</script>

<template>
<div class="pools_container" style="">
  <div>
    <span class="pools_container_title">Pools Container</span>
  </div>
  <div style="display:flex; flex-direction: row; flex-wrap: wrap;">
    <PoolComponent v-for="(pool,pool_index) in pools" 
      :pool=pool :pool_index=pool_index :force_render="forceRender()" :re_roll_explodes="re_roll_explodes"
      @addDice="addDice" @updateValue="updateValue" @dropDice="dropDice" @dropPool="dropPool"
      @reRollPool="reRollPool" @reRollDice="reRollDice" @explodeDice="explodeDice" @resetPool="resetPool">
    </PoolComponent>
  </div>
  <div> 
    <span class="button pointer add_pool" @click="addPool()">Add Pool</span>
  </div>
</div>
</template>

<style scoped>
.pools_container_title{
  font-weight:bold; 
  border-bottom:thin solid rgba(255,255,255,0.5); 
  border-right:thin solid rgba(255,255,255,0.5); 
  border-radius: 0.2em; padding:0em 0.5em 0em 0.5em;
}
.pools_container{
  border-radius:0.2em; 
  box-shadow:inset 0px 0px 5px 0px white; 
  max-width: 99vw;
  display: inline-flex; 
  flex-direction: column; 
  align-self: flex-start;
  flex-wrap: wrap;
  padding:0.2em;
}
.add_pool{
  border:thin solid white; 
  padding:0em 0.5em 0em 0.5em; 
  border-radius: 0.2em;
}
.button:hover {
  background-color: rgb(46, 100, 39);
}
.button {
  box-shadow: 2px 2px 1px 0px #dbdbdb;
}
.button:active {
  box-shadow: 0px 0px 0px 0px #dbdbdb;
  transform: translate(2px,2px);
}
.pointer:hover{
  cursor: pointer;
}
</style>