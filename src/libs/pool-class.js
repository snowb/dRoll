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
      if(isNumeric(_iterations)) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined") {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
    } else if(!_dice_objects_array instanceof Array) {
      console.error("pool-class.js: Pool constructor requires an Array of Dice objects.");
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
      if(isNumeric(_iterations)) {this.#iterations=+_iterations;}
      else if(typeof _iterations!=="undefined") {
        console.warn("pool-class.js: Invalid iterations passed, assuming 10,000.");
      }
      this.#fullRollResults.forEach((_element)=>{_element.roll(this.#iterations)});
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
    if(!isNumeric(_iterations)){
      console.error("pool-class-2.js: setIterations requires a number as input.");
      return undefined;
    }
    this.#iterations=_iterations;
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
   * return sum from #secondaryResults
   * @returns {number[]}
   */
  getSumRolled () { return this.#secondaryResults.sum; };
  /**
   * return min from #secondaryResults
   * @returns {number[]}
   */
  getMinRolled () { return this.#secondaryResults.min; };
  /**
   * return max from #secondaryResults
   * @returns {number[]}
   */
  getMaxRolled () { return this.#secondaryResults.max; };
  getPoolMin(){ return this.#secondaryResults.pool_min; }
  getPoolMax(){ return this.#secondaryResults.pool_max; }
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
    this.#fullRollResults.forEach((_element)=>{_element.roll(this.#iterations)});
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
    this.#secondaryResults.min=Array(this.#iterations);
    this.#secondaryResults.max=Array(this.#iterations);
    this.#rollResults=Array(this.#iterations);
    for(let index=0;index<this.#iterations;index++){
      //generate secondary results; sums, mins, maxes, means
      this.#secondaryResults.sum[index]=0;
      let roll=0;//for determine mean in next step
      let min=null;
      let max=null;
      let temp_rolls=[];
      for(;roll<this.#fullRollResults.length;roll++){
        /* if(this.#fullRollResults[roll].getResults()===undefined){
          this.#fullRollResults[roll].roll();
        } */
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
      this.#secondaryResults.min[index]=min;
      this.#secondaryResults.max[index]=max;
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
    if(!isNumeric(_minimum_value_or_dice) && !(_minimum_value_or_dice instanceof Dice || _minimum_value_or_dice instanceof Metrics_Dice)) {
      console.warn("pool-class.js: Invalid minimum value passed to updateDice() method.");
      return undefined;
    }
    if(isNumeric(_minimum_value_or_dice) && !isNumeric(_maximum_value)) {
      console.error("pool-class.js: Invalid maximum value passed to updateDice() method.");
      return undefined
    }
    if(_target_dice===undefined && (_minimum_value_or_dice instanceof Dice || _minimum_value_or_dice instanceof Metrics_Dice)){
      this.#fullRollResults.push(_minimum_value_or_dice);
      this.#fullRollResults[this.#fullRollResults.length-1].roll();
      this.#calculateSecondaryValues();
      return;
    }
    let target_dice;
    if(_target_dice!==undefined && isNumeric(_target_dice) && _target_dice<this.#fullRollResults.length){
      this.#fullRollResults[_target_dice]=new Dice(_minimum_value_or_dice, _maximum_value, _modifier);
      target_dice = +_target_dice;
    } else {
      this.#fullRollResults.push(new Dice(_minimum_value_or_dice, _maximum_value, _modifier));
      target_dice = this.#fullRollResults.length-1;
    }
    this.#fullRollResults[target_dice].roll(this.#iterations);
    this.#calculateSecondaryValues();
    /* this.#calculateSequences();
    this.#calculateSets(); */
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
    this.#fullRollResults[_dice_index].roll(this.#iterations);
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

/*   filterOutLowestDice(){
    return this.#rollResults.reduce((_filtered_result, _roll_result)=>{
      let result={index:_roll_result.index};
      result.roll;
       //{index:0, roll:[]}
    },[]);
  }; */
  /**
   * filterOutLowestDice
   * filterToLowestDice
   * filterOutHighestDice
   * filterToHighestDice
   * filterOutValue
   * filterToValue
   * filterOutValueAbove
   * filterToValueAbove
   * filterOutValueBelow
   * filterToValueBelow
   * filterToEven
   * filterToOdd
   * 
   * 
   * getMin ... ?
   * getMax ... ?
   *  ... Above, Below, Equal, WithinRange
   * 
   *
   */
};