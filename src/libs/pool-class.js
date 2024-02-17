import { isNumeric } from "./isNumeric.js";
import { Metrics_Dice } from "./metrics-dice-class.js";
import { Dice } from "./dice-class.js";

/**
 * Pool object an Array of Dice objects and an optional iterations counts 
 * Generates calls .roll() on the provided Dice objects and stores the results
 * Generate minimal secondary, and abbreviated results as well
 * @typedef {Object} Pool - The Pool object
 * @property {number} iterations - number of iterations
 * @property {Object[]} fullRollResults - Array of objects containing Dice objects
 * @property {Object[]} rollResults - Array of objects containing abbreviated data [{index:number, roll:number[]}]
 * @property {Object} secondaryResults - Contains sum, mean, min, and max values for all roll
 */
export class Pool {
  #iterations=10000;
  #fullRollResults=null;
  #rollResults=null;

  #secondaryResults={
    sum:[],
    dice_min:[],dice_max:[],
    pool_max:null,pool_min:null
  }; 
  #modifiedResults={
    results:[], modified_max:null, modified_min:null, last_operation:"none"
  }
  /**
   * Populates private properties and rolls the Dice object provided
   * @class
   * @param {Dice[]|Metrics_Dice[]} _dice_objects_array - array of Dice objects to roll and generate data
   * @param {string|number} [_iterations=10_000] - number of iterations to roll
   */
  constructor (_dice_objects_array, _iterations) {
    //input: array of Dice objects
    if(_dice_objects_array===undefined) {
      //empty new Pool() call, create empty array and calculate nothing
      //needs addDice() to stuff
      this.#fullRollResults=[];
      if(isNumeric(_iterations) && _iterations>=1) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined" || _iterations<1) {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
    } else if(!Array.isArray(_dice_objects_array)) {
      console.error("pool-class.js: Pool constructor requires an Array of Dice objects. Returning empty Pool.");
    } else {
      this.#fullRollResults = _dice_objects_array.reduce((_dice_array, _element)=>{
        if(_element instanceof Dice || _element instanceof Metrics_Dice) {_dice_array.push(_element);}
        return _dice_array;
      },[]);
      let all_dice_objects=this.#fullRollResults.length==_dice_objects_array.length;
      if (this.#fullRollResults.length==0) {
        console.error("pool-class.js: No valid Dice/Metrics_Dice objects passed to constructor.");
      } else if(this.#fullRollResults.length>0 && !all_dice_objects) {
        console.warn("pool-class.js: Not all objects are Dice/Metrics_Dice objects, reducing to valid Dice/Metrics_Dice objects.");
      }
      if(isNumeric(_iterations) && _iterations>=1) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined" || _iterations<1) {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
      this.#fullRollResults.forEach((_element)=>{
        _element.setIterations(this.#iterations);
        _element.roll();
      });
      this.#calculateSecondaryValues();
    }
  };

  /**
   * returns iterations value
   * @returns {number} - pool's iterations
   */
  getIterations () {
    return this.#iterations;
  }
  /**
   * update iterations and re-roll;
   * @param {number} _iterations 
   */
  setIterations (_iterations) {
    if(!isNumeric(_iterations) || _iterations<1){
      console.error("pool-class-2.js: setIterations requires a number greater than 0 as input.");
      return undefined;
    }
    this.#iterations=+_iterations;
    this.rollPool();
  }
  /**
   * return #fullRollResults private property
   * @returns {Dice[]}
   */
  getFullRollResults () { return this.#fullRollResults; };
  /**
   * return #rollResults private property
   * @returns {Object[]} - [{index:number, roll:number[]}]
   */
  getRollResults () { return this.#rollResults; };
  /**
   * return minimum dice rolled from #secondaryResults
   * @returns {number[]}
   */
  getMinRolled () { return this.#secondaryResults.dice_min; };
  /**
   * return maximum dice rolled from #secondaryResults
   * @returns {number[]}
   */
  getMaxRolled () { return this.#secondaryResults.dice_max; };
  /** 
   *  return lowest pool value from #secondaryResults
   * @returns {Number}
   */
  getPoolMin(){ return this.#secondaryResults.pool_min; };
  /**
   * return highest pool value from #secondaryResults
   * @returns {Number}
   */
  getPoolMax(){ return this.#secondaryResults.pool_max; };
  /**
   * return array of numbers of current #modifiedResults.results
   * @returns {Number[]}
   */
  getModifiedResults(){ return this.#modifiedResults.results; };
  /**
   * 
   * @returns {Number} - minimum pool value of all iterations
   */
  getModifiedMinimum(){ return this.#modifiedResults.modified_min; };
  /**
   * 
   * @returns {Number} - maximum pool value of all iterations
   */
  getModifiedMaximum(){ return this.#modifiedResults.modified_max; };
  /**
   * return name of last operation
   * @returns {string|function} - name of last operation or functin of custom operation
   */
  getLastOperation(){ return this.#modifiedResults.last_operation;};
  /**
   * Resets the modifiedResults object to empty
   */
  resetModifiedResults(){ 
    this.#modifiedResults.results=[];
    this.#modifiedResults.modified_max=null;
    this.#modifiedResults.modified_min=null;
   };
  /**
   * @returns {number} - length/size of pool
   */
  getPoolSize(){
    return this.#fullRollResults.length;
  };
  /**
   * rolls all Dice in the Pool, calculates secondary values
   */
  rollPool () {
    this.#fullRollResults.forEach((_element)=>{
      _element.setIterations(this.#iterations);
      _element.roll();
      //_element.roll(this.#iterations);
    });
    //this.#calculatePoolOtherValues();
    this.#calculateSecondaryValues();
  };
  /**
   * private property
   * calculates secondary values; sum, mean, min, max and stores in #secondaryResults private prop
   * calculates abbreviated and sorted roll data and stores in #rollResults private prop
   */
  #calculateSecondaryValues () {
    this.#secondaryResults.sum=Array(this.#iterations);
    // this.#secondaryResults.mean=Array(this.#iterations);
    this.#secondaryResults.dice_min=Array(this.#iterations);
    this.#secondaryResults.dice_max=Array(this.#iterations);
    this.#rollResults=Array(this.#iterations);
    this.poolOperation("add");
    for(let index=0;index<this.#iterations;index++){
            //generate secondary results; sums, mins, maxes, means
      this.#secondaryResults.sum[index]=0;  
      let roll=0;//for determine mean in next step
      let min=null;
      let max=null;
      let temp_rolls=[];
      for(;roll<this.#fullRollResults.length;roll++){
        let roll_result_value=this.#fullRollResults[roll].getResults()[index].value;
        this.#secondaryResults.sum[index]+=roll_result_value===undefined ? 0 : roll_result_value;
        if(min === null || min > roll_result_value) {
          min = roll_result_value;
        }
        if(max === null || max < roll_result_value) {
          max = roll_result_value;
        }
        temp_rolls.push(roll_result_value);
      }
      this.#secondaryResults.dice_min[index]=min;
      this.#secondaryResults.dice_max[index]=max;
      this.#rollResults[index]={index:index,roll:temp_rolls.sort((_a, _b)=>{return +_a > +_b ? 1 : -1})};
    }
    this.#secondaryResults.pool_min=this.#rollResults.reduce((_min, _values_array)=>{
      let values_sum=_values_array.roll.reduce((_sum, _value)=>{
        return _sum + (_value===undefined ? 0 : _value);
      },0);
      if(values_sum<_min){return values_sum}
      return _min;
    },Infinity);
    this.#secondaryResults.pool_max=this.#rollResults.reduce((_max, _values_array)=>{
      let values_sum=_values_array.roll.reduce((_sum, _value)=>{
        return _sum + (_value===undefined ? 0 : _value);
      },0);
      if(values_sum>_max){return values_sum}
      return _max;
    },-Infinity);
  }
  /**
   * Core method that iterations through roll results and sends dropValue(index) to Dice object
   * Setting the found index in Dice to undefined
   * 
   * @param {string} _target_drop - the operation to execute (lowest, highest, specific value)
   * @param {string|number} [_drop_count=1] - maximum number of Dice to drop, defaults to 1
   * @param {string|number} _drop_value - the specific value to drop
   * @returns {undefined} - on error
   * 
   * TODO: actually use _drop_count, currently only does the 1st 
   */
  #dropValue (_target_drop, _drop_count, _drop_value) {
    //drops value from all pools according to _target_drop argument (DropLowestValue, DropHighestValue, DropValue)
    //recalculates secondaries
    if(!["dropLowestValue","dropHighestValue","dropValue","dropValueAbove","dropValueBelow","dropEven","dropOdd"].includes(_target_drop)) {
      // already at 1 Dice in Pool, error
      console.error("pool-class.js: "+_target_drop+"() is not a valid method.");
      return undefined;
    } else if(this.#fullRollResults.length===1) {
      //not a valid action
      console.error("pool-class.js: "+_target_drop+"(), already at 1 Dice in Pool.");
      return undefined;
    }
    let drop_count = _drop_count===undefined || !isNumeric(_drop_count) ? 1 : +_drop_count ;
    for(let iteration=0;iteration<this.#iterations;iteration++) {
      let target_value=_drop_value;
      let found_dice=[];
      for(let dice=0; dice<=drop_count && dice<this.#fullRollResults.length;dice++){
        let results=this.#fullRollResults[dice].getResults();
        switch(true){
          //abuse JS switch fall-thru to capture target values
          case (target_value === undefined):
          case (_target_drop=="dropLowestValue" && results[iteration].value < target_value):
          case (_target_drop=="dropHighestValue" && results[iteration].value > target_value):
          case (_target_drop=="dropValueAbove" && results[iteration].value > target_value):
          case (_target_drop=="dropValueBelow" && results[iteration].value < target_value):
          case (_target_drop=="dropEven" && results[iteration].value%2 == 0):
          case (_target_drop=="dropOdd" && results[iteration].value%2 == 1):
            if(target_value !== undefined && ["dropLowestValue","dropHighestValue"].includes(_target_drop)){
              found_dice.pop();//remove previously pushed value from this iteration for dropHigh/Low
            }
            target_value=results[iteration].value;
            found_dice.push({iteration:iteration, dice:dice});
            break;
          case (_target_drop=="dropValue" && results[iteration].value == _drop_value):
            found_dice.push({iteration:iteration, dice:dice});
            break;
        }
      }
      found_dice.forEach((_found_dice)=>{
        this.#fullRollResults[_found_dice.dice].dropValueAtIndex(_found_dice.iteration);
      });
    }
    this.#calculateSecondaryValues();
    //this.#calculatePoolOtherValues();
  };
  /**
   * calls dropValue for dropLowestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropLowestValue (_drop_count) {
    this.#dropValue("dropLowestValue", _drop_count)
  };
  /**
   * calls dropValue for dropHighestValue with specified drop count
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropHighestValue (_drop_count) {
    this.#dropValue("dropHighestValue", _drop_count)
  };
  /**
   * calls dropValue for dropValue with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValue (_drop_value, _drop_count) {
    //drops first occurance of _drop_value in roll
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValue() method.");
    }
    this.#dropValue("dropValue", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropValueBelow with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueBelow(_drop_value, _drop_count){
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValueBelow() method.");
    }
    this.#dropValue("dropValueBelow", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropValueAbove with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropValueAbove(_drop_value, _drop_count){
    if(_drop_value===undefined || !isNumeric(_drop_value)){
      console.warn("pool-class.js: Invalid value passed to dropValueAbove() method.");
    }
    this.#dropValue("dropValueAbove", _drop_count, _drop_value);
  };
  /**
   * calls dropValue for dropEven with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropEven(_drop_count){
    this.#dropValue("dropEven", _drop_count);
  };
  /**
   * calls dropValue for dropOdd with specified drop value and count
   * @param {string|number} _drop_value - specific value to drop
   * @param {string|number} _drop_count - number of dice to drop, default of 1
   */
  dropOdd(_drop_count){
    this.#dropValue("dropOdd", _drop_count);
  };
  /**
   * drops specific index Dice from Pool and re-rolls
   * @param {Number} _dice_index - index of the specified Dice
   * @param {Boolean} _no_pool_reroll - whether to NOT re-roll the pool, defaults to False (do re-roll)
   * @returns {undefined} - if error
   */
  dropDice(_dice_index, _no_pool_reroll) {
    if(!isNumeric(_dice_index) || _dice_index >= this.#fullRollResults.length) {
      console.warn("pool-class.js: Invalid value passed to dropDice() method.");
      return undefined;
    }
    this.#fullRollResults.splice(_dice_index,1);
    if(!_no_pool_reroll){
      this.rollPool();
    } else {
      this.#calculateSecondaryValues();
      //this.#calculatePoolOtherValues();
    }
  };
  /**
   * calls updateDice and passes arguments to add a dice to pool
   * @param {string|number|Dice} _minimum_value_or_dice - minimum value or Dice object to generate and add, if Array of Dice objects loop and add all
   * @param {string|number} _maximum_value - maximum value of Dice, required if minimum value is non-Dice object
   * @param {undefined|number|function} [_modifier] - modifier to roll
   */
  addDice(_minimum_value_or_dice, _maximum_value, _modifier) {
    if(Array.isArray(_minimum_value_or_dice)){
      _minimum_value_or_dice.forEach((_dice)=>{
        _dice.setIterations(this.#iterations);
        if(_dice instanceof Dice || _dice instanceof Metrics_Dice){
          this.updateDice(undefined, _dice);
        }
      });
    } else {
      this.updateDice(undefined, _minimum_value_or_dice, _maximum_value, _modifier);
    }
  };
  /**
   * Updates Dice array with provide data, including adding dice if _target_dice is not valid
   * @param {*} _target_dice 
   * @param {string|number|Dice} _minimum_value_or_dice - minimum value or Dice object to generate and add
   * @param {string|number} _maximum_value - maximum value of Dice, required if minimum value is non-Dice object
   * @param {undefined|number|function} [_modifier] - modifier to roll
   * @returns {undefined} - on error
   */
  updateDice(_target_dice, _minimum_value_or_dice, _maximum_value, _modifier){
    if(!isNumeric(_minimum_value_or_dice) && !(_minimum_value_or_dice instanceof Dice)) {
      console.warn("pool-class.js: Invalid minimum value passed to updateDice() method.");
      return undefined;
    }
    if(isNumeric(_minimum_value_or_dice) && !isNumeric(_maximum_value)) {
      console.error("pool-class.js: Invalid maximum value passed to updateDice() method.");
      return undefined
    }
    if(_target_dice===undefined && (_minimum_value_or_dice instanceof Dice)){
      _minimum_value_or_dice.setIterations(this.#iterations);
      this.#fullRollResults.push(_minimum_value_or_dice);
      //this.#fullRollResults[this.#fullRollResults.length-1].roll();
      this.#calculateSecondaryValues();
      return;
    }
    let target_dice;
    if(isNumeric(_target_dice) && _target_dice<this.#fullRollResults.length){
      target_dice = +_target_dice;
      if(_minimum_value_or_dice instanceof Dice){
        this.#fullRollResults[target_dice]=_minimum_value_or_dice;
      } else {
        this.#fullRollResults[target_dice]=new Dice(_minimum_value_or_dice, _maximum_value, _modifier);
      }
      this.#fullRollResults[target_dice].setIterations(this.#iterations);
    } else {
      this.#fullRollResults.push(new Dice(_minimum_value_or_dice, _maximum_value, _modifier));
      target_dice = this.#fullRollResults.length-1;
      this.#fullRollResults[target_dice].setIterations(this.#iterations);
    }
    //this.#fullRollResults[target_dice].roll(this.#iterations);
    this.#fullRollResults[target_dice].roll();
    this.#calculateSecondaryValues();
  };
  /**
   * re-rolls the Dice object at the specified index
   * @param {Number} _dice_index - index of Dice object to re-roll
   * @returns {undefined} - if error
   */
  reRollDice(_dice_index){
    if(!isNumeric(_dice_index) || _dice_index>=this.#fullRollResults.length) {
      console.warn("pool-class.js: Invalid value passed to reRollDice() method.");
      return undefined;
    }
    //this.#fullRollResults[_dice_index].roll(this.#iterations);
    this.#fullRollResults[_dice_index].roll();
    this.#calculateSecondaryValues();
    /* this.#calculateSequences();
    this.#calculateSets(); */
  };
  /**
   * add additional Dice to the roll if a value occurs in the results
   * @param {string|number} [_value_to_explode_on="max"] - value that triggers adding dice, 'max', 'min', or specific value 
   * @param {string|number} _explode_limit - limit to how many additional Dice can be added
   * @param {Dice} _additional_dice - Dice object that will be cloned and added
   * @returns {undefined} - on error
   */
  explodeValue(_value_to_explode_on, _explode_limit, _additional_dice) {
    //loop over each Dice object, calling explodeValue on each.
    //append new Dice arrays to this.#fullRollResults
    //recalc secondaries, etc
    if(![undefined,"max","min"].includes(_value_to_explode_on) && !isNumeric(_value_to_explode_on)){
      console.error("pool-class.js: Invalid ExplodingValue passed to explodeValue() method.; must be blank; 'max', 'min' or a number.");
      return undefined;
    }
    if(_explode_limit!==undefined && !isNumeric(_explode_limit)) {
      console.error("pool-class.js: Invalid ExplodeLimit passed to explodeValue() method; must be a number.");
      return undefined;
    }
    if(_additional_dice!==undefined && !(_additional_dice instanceof Dice || _additional_dice instanceof Metric_Dice)) {
      console.error("pool-class.js: Invalid AdditionalDice passed to explodeValue() method; must be a Dice object.");
      return undefined;
    }
    let pool_explosion_results=[];
    this.#fullRollResults.forEach((_dice, _index)=>{
      let exploded_dice=_dice.explodeValue(_value_to_explode_on, _explode_limit, _additional_dice);
      exploded_dice.forEach((_exploded_dice)=>{
        _exploded_dice.setAdditionalText("#"+(_index+1)+" Explode");
      });
      pool_explosion_results=[...pool_explosion_results,...exploded_dice];
    });
    pool_explosion_results.forEach((_new_dice)=>{
      this.addDice(_new_dice);
    });
    this.#calculateSecondaryValues();
    /* this.#calculateSequences();
    this.#calculateSets(); */
  };

  /**
   * core function for retrieving roll result comparison data for the Sum of all rolls
   * @param {string} [_operation="equal"] - operaton to execute
   * @param {number} _first_value - first value to compare, or Array of values if getEqual
   * @param {number} [_second_value] - second value for range compare
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  //#getModifiedOperation (_operation, _first_value, _second_value) {
  #getModifiedOperation (_target_array, _operation, _first_value, _second_value) {
    let target_array = this.#secondaryResults.sum;
    if(_target_array=="modified"){
      if(this.#modifiedResults.results.length==0){
        console.warn("pool-class.js: modifiedResults.results is empty, using Sum data.")
      } else {
        target_array = this.#modifiedResults.results;
      }
    }
    return target_array.reduce((_operation_result, _sum_value, _index)=>{
      let is_keep=false;
      switch(_operation) {
        case "even":
          is_keep = _sum_value%2 == 0? true : false;
          break;
        case "odd":
          is_keep = _sum_value%2 == 1 ? true : false;
          break;
        case "above":
          is_keep = _sum_value > _first_value ? true : false;
          break;
        case "below":
          is_keep = _sum_value < _first_value ? true : false;
          break;
        case "range":
          is_keep = _sum_value >= _first_value && _sum_value <= _second_value ? true : false;
          break;
        case "equal":
        default:
          if(Array.isArray(_first_value)){
            let cleaned_array = _first_value.filter((_value)=>{return isNumeric(_value)}).map((_value)=>{return +_value});
            is_keep = cleaned_array.includes(+_sum_value) ? true : false;
          }
          else{
            is_keep = _sum_value == +_first_value ? true : false;
          }          
          break;
      }
      if(is_keep) {
        _operation_result.push({index:_index, values:[_sum_value]});
      }
      return _operation_result;
    },[]);    
  };
/**
 * @returns {Object[]} - even results from Modified data
 */
getModifiedEven(){
  return this.#getModifiedOperation("modified","even"); 
};
/**
 * @returns {Object[]} - odd results from Modified data
 */
getModifiedOdd(){
  return this.#getModifiedOperation("modified","odd"); 
};
/**
* returns roll Modified above the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getModifiedAbove (_value) {//return Modified with values above _value
  if(!isNumeric(_value)){console.error("pool-class.js: getAbove requires a number for _value.");return undefined;}
  return this.#getModifiedOperation("modified","above",+_value);
};
/**
* returns roll Modified below the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getModifiedBelow (_value) {//return Modified with values below _value
  if(!isNumeric(_value)){console.error("pool-class.js: getBelow requires a number for _value.");return undefined;}
  return this.#getModifiedOperation("modified","below",+_value);
};
/**
* returns roll Modified equal to the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getModifiedEqual (_value) {//return Modified with values equal to _value
let is_invalid_array = Array.isArray(_value) ? _value.some((_value)=>{return !isNumeric(_value)}) : false;
let is_invalid_number = !Array.isArray(_value) && !isNumeric(_value) ? true : false;
if(is_invalid_array || is_invalid_number){
  console.error("pool-class.js: getEqual requires a Number or an Array of Numbers for input");
  return undefined;
} 
return this.#getModifiedOperation("modified","equal",_value);
};
/**
 * returns roll Modified within the specified range, inclusive
 * @param {string|number} _min_value 
 * @param {string|number} _max_value 
 * @returns {Object[]} - [{index:number, values:number[]}]
 */
getModifiedWithinRange (_min_value, _max_value) {//return Modified with values within range of _min_value and _max_value, inclusive
  if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
  return this.#getModifiedOperation("modified","range",+_min_value,+_max_value);
};
/**
 * @returns {Object[]} - even results from Sum data
 */
getSumEven(){
  return this.#getModifiedOperation("sum","even"); 
};
 /**
 * @returns {Object[]} - odd results from Summed data
 */
getSumOdd(){
  return this.#getModifiedOperation("sum","odd"); 
};
/**
* returns roll sums above the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getSumAbove (_value) {//return Sums with values above _value
  if(!isNumeric(_value)){console.error("pool-class.js: getAbove requires a number for _value.");return undefined;}
  return this.#getModifiedOperation("sum","above",+_value);
};
/**
* returns roll sums below the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getSumBelow (_value) {//return Sums with values below _value
  if(!isNumeric(_value)){console.error("pool-class.js: getBelow requires a number for _value.");return undefined;}
  return this.#getModifiedOperation("sum","below",+_value);
};
/**
* returns roll sums equal to the provided value
* @param {string|number} _value - numeric for value to compare
* @returns {Object[]} - [{index:number, values:number[]}]
*/
getSumEqual (_value) {//return Sums with values equal to _value
  let is_invalid_array = Array.isArray(_value) ? _value.some((_value)=>{return !isNumeric(_value)}) : false;
  let is_invalid_number = !Array.isArray(_value) && !isNumeric(_value) ? true : false;
  if(is_invalid_array || is_invalid_number){
    console.error("pool-class.js: getEqual requires a Number or an Array of Numbers for input");
    return undefined;
  } 
  return this.#getModifiedOperation("sum","equal",_value);
  };
  /**
   * returns roll sums within the specified range, inclusive
   * @param {string|number} _min_value 
   * @param {string|number} _max_value 
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  getSumWithinRange (_min_value, _max_value) {//return Sums with values within range of _min_value and _max_value, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getModifiedOperation("sum","range",+_min_value,+_max_value);
  };
  /**
  * returns numbers above the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getAbove (_value) {//return Rolls with values above _value
    if(!isNumeric(_value)){console.error("pool-class.js: getAbove requires a number for _value.");return undefined;}
    return this.#getOperation("above",+_value);
  };
  /**
  * returns numbers below the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getBelow (_value) {//return Rolls with values below _value
    if(!isNumeric(_value)){console.error("pool-class.js: getBelow requires a number for _value.");return undefined;}
    return this.#getOperation("below",+_value);
  };
  /**
  * returns numbers equal to the provided value
  * @param {string|number} _value - numeric for value to compare
  * @returns {Object[]} - [{index:number, values:number[]}]
  */
  getEqual (_value) {//return Rolls with values equal to _value
    let is_invalid_array = Array.isArray(_value) ? _value.some((_value)=>{return !isNumeric(_value)}) : false;
    let is_invalid_number = !Array.isArray(_value) && !isNumeric(_value) ? true : false;
    if(is_invalid_array || is_invalid_number){
      console.error("pool-class.js: getEqual requires a Number or an Array of Numbers for input");
      return undefined;
    } 
    return this.#getOperation("equal",_value);
  };
  /**
   * returns numbers within the specified range, inclusive
   * @param {string|number} _min_value 
   * @param {string|number} _max_value 
   * @returns {Object[]} - [{index:number, values:number[]}]
   */
  getWithinRange (_min_value, _max_value) {//return Rolls with values within range of _min_value and _max_value, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("pool-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    return this.#getOperation("range",+_min_value,+_max_value);
  };
  /**
   * @returns {Dice[]} - Pools with Even results within Dice
   */
  getEven(){
    return this.#getOperation("even"); 
  };
  /**
   * @returns {Dice[]} - odd results
   */
  getOdd(){
    return this.#getOperation("odd"); 
  };
  /**
   * @param {String} _operation - operation to perform
   * @param {Number} _first_value - value or first value in Range op
   * @param {Number|undefined} _second_value - undefined or second value in Range op
   * @returns {Object[]} - [{index:Number, values:Number}]
   */
  #getOperation (_operation, _first_value, _second_value) {
    let operation_result=[];
    const rolls=this.getFullRollResults().length;
    for(let index=0;index < this.#iterations;index++){
      let dice_results=[];
      let is_keep=false;
      for(let roll=0;roll<rolls;roll++){
        let dice_value=this.getFullRollResults()[roll].getResults()[index].value;
        dice_results.push(dice_value);
        switch(_operation) {
          case "even":
            is_keep = dice_value%2 == 0 ? true : is_keep;
            break;
          case "odd":
            is_keep = dice_value%2 == 1 ? true : is_keep;
            break;
          case "above":
            is_keep = dice_value > _first_value ? true : is_keep;
            break;
          case "below":
            is_keep = dice_value < _first_value ? true : is_keep;
            break;
          case "range":
            is_keep = dice_value >= _first_value && dice_value <= _second_value ? true : is_keep;
            break;
          case "equal":
          default:
            if(Array.isArray(_first_value)){
              let cleaned_array = _first_value.filter((_value)=>{return isNumeric(_value)}).map((_value)=>{return +_value});
              is_keep = cleaned_array.includes(dice_value) ? true : is_keep;
            }
            else{
              is_keep = dice_value == +_first_value ? true : is_keep;
            }
          }
      }
      if(is_keep) {
        operation_result.push({index:index, values:dice_results});
      }
    }
    return operation_result;
  };
  modifiedGetOperation(_operation, _first_value, _second_value){

  };
  /**
   * Perform operation with Pool and store in modifiedResults.results
   * @param {String|Function} _operation - String for name of builtin operation or Function, Function will be passed 1 argument; an Array of Arrays of Numbers [[1,2],[3,4]] and return an Array of Numbers
   * @param {Number[]} _op_order_array - array of indices in order to perform operation on
   */
  poolOperation(_operation, _op_order_array){
    let modified_max = -Infinity;
    let modified_min = Infinity;
    let ordered_results=[];
    let flattened_results=Array(this.#iterations);
    if(_op_order_array!==undefined){
      _op_order_array.forEach((_index)=>{
        ordered_results.push(this.#fullRollResults[_index].getResults());
      });
    } else {
      this.#fullRollResults.forEach((_result)=>{
        ordered_results.push(_result.getResults());
      });
    }
    for(let _index=0; _index<this.#iterations; _index++){
      flattened_results[_index]=[];
      ordered_results.forEach((_result)=>{
        flattened_results[_index].push(_result[_index].value);
      });
    }
    if(typeof _operation!=="function"){
      let operation_function=undefined;
      switch(_operation){
        case "subtract":
          operation_function = (_value_1, _value_2)=>{
            let val_1 = _value_1===undefined ? 0 : _value_1;
            let val_2 = _value_2===undefined ? 0 : _value_2;
            return (val_1 - val_2);
          };
          this.#modifiedResults.last_operation = "subtract";
          break;
        case "multiply":
          operation_function = (_value_1, _value_2)=>{
            let val_1 = _value_1===undefined ? 1 : _value_1;
            let val_2 = _value_2===undefined ? 1 : _value_2;
            return (val_1 * val_2);
          };
          this.#modifiedResults.last_operation = "multiply";
          break;
        case "divide":
          operation_function = (_value_1, _value_2)=>{
            let val_1 = _value_1===undefined ? 1 : _value_1;
            let val_2 = _value_2===undefined ? 1 : _value_2;
            return (val_1 / val_2);
          };
          this.#modifiedResults.last_operation = "divide";
          break;
        case "add":
        default:
          operation_function = (_value_1, _value_2)=>{
            let val_1 = _value_1===undefined ? 0 : _value_1;
            let val_2 = _value_2===undefined ? 0 : _value_2;
            return (val_1 + val_2);
          };
          this.#modifiedResults.last_operation = "add";
          if(_operation!="add"){
            console.warn("pool-class.js: invalid operation name passed to poolOperation, returning 'add' operation");
          }
          break;
      }
      this.#modifiedResults.results = flattened_results.reduce((_new_array, _values_array)=>{
        let reduced_value = _values_array.reduce((_reduce_value, _value)=>{
          if(_reduce_value===undefined){
            return _value;
          }
          return operation_function(_reduce_value, _value);
        },undefined);
        _new_array.push(reduced_value);
        if(reduced_value < modified_min){modified_min = reduced_value;}
        if(reduced_value > modified_max){modified_max = reduced_value;}
        return _new_array;
      },[]);
    } else {
      this.#modifiedResults.last_operation = _operation;
      this.#modifiedResults.results = _operation(flattened_results);
      this.#modifiedResults.results.forEach((_value)=>{
        if(_value < modified_min){modified_min = _value;}
        if(_value > modified_max){modified_max = _value;}
      });
    }
    this.#modifiedResults.modified_max = modified_max;
    this.#modifiedResults.modified_min = modified_min;
  };
  /**
   * Modify whatever results are in modifiedResults.results
   * @param {String|Function} _operation - Valid String of operation or Function that will be calld within an Array.Map() over #modifiedResults.results generated by poolOperation
   *  #modifiedResults.results = Number[]
   * @returns {Number[]} - mutates #modifiedResults.results and returns array of values
  */
  modifyPoolOperation(_modification){
    let operation_order
    if(this.#modifiedResults.results.length==0){
      //no poolOperation has been run yet. Run "add" in standard order
      operation_order = this.#fullRollResults.map((_array, _index)=>{
        return _index;
      });
      this.poolOperation("add",operation_order);
    }
    let modifier_fuction = undefined;
    let modified_max = -Infinity;
    let modified_min = Infinity;
    if(typeof _modification!=="function"){
      switch(_modification){ 
        case "absolute":
          modifier_fuction = (_value)=>{return Math.abs(_value)};
          break;
        case "negate":
          modifier_fuction = (_value)=>{return -1*_value};
          break;
        case "none":
          this.poolOperation(this.#modifiedResults.last_operation,operation_order);
          modifier_fuction = (_value)=>{return _value};
          break;
        default:
          console.warn("pool-class.js: invalid modification name passed to modifyPoolOperation, no changes made.");
          break;
      }
    } else {
      modifier_fuction = _modification;
    }
    this.#modifiedResults.results = this.#modifiedResults.results.map((_value)=>{
      let modified_value = modifier_fuction(_value);
      if(modified_value < modified_min){modified_min = modified_value;}
      if(modified_value > modified_max){modified_max = modified_value;}
      return modified_value;
    });

    this.#modifiedResults.modified_max = modified_max;
    this.#modifiedResults.modified_min = modified_min;
  };
  
};