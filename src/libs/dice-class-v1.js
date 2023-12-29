import { getRandomInt } from "./getRandomInt.js";
import { isNumeric } from "./isNumeric.js";
/**
 * Dice object takes in a minimum and maximum number, and optional modifier. 
 * Generates results between minimum and maximum values (inclusive), modifies values and stores results in results private property.
 * @typedef {Object} Dice - The Dice object
 * @property {number} iterations - number of iterations
 * @property {Object[]} results - Array of objects containing {index, value}
 * @property {number} average - Average of all numbers generated
 * @property {number} minimum_value - Minimum value passed to Dice constructor
 * @property {number} maximum_value - Maximum value passed to Dice constructor
 * @property {undefined|function} modifer - modifier function for modifying results
 */
export class Dice {
  #iterations=10000;
  #results;
  #average;
  #minimum_value=1;
  #maximum_value=1;
  #modifer=undefined;
  /**
   * Checks inputs and sets private properties. Does not auto-run roll().
   * @class
   * @param {string|number} [_minimum_value=1] - minimum number for generating, default 1
   * @param {string|number} _maximum_value - maximum number for generating, required
   * @param {undefined|number|function} _modifier - function to modify generating numbers
   */
  constructor(_minimum_value, _maximum_value, _modifier) {
    if(!isNumeric(_minimum_value)) {
      console.warn("dice-class-v1.js: Invalid minimum value, assuming 1.");
    } else { this.#minimum_value = +_minimum_value; }
    if(!isNumeric(_maximum_value)) {
      console.error("dice-class-v1.js: Invalid maximum value.");
    } else { 
      this.#maximum_value = +_maximum_value;
      this.#modifer=_modifier;
    }
  };
  /**
   * Returns the #average private property
   * @returns {number}
   */
  getAverage () {return this.#average};//get average, Number
  getIterations () {return this.#iterations;}//get number of iterations
  getMinimum () {return this.#minimum_value;}//get unmodified minimum value
  getMaximum () {return this.#maximum_value;}//get unmodified maximum value
  getModifier () {return this.#modifer;}//get modifier
  getClone() {return new Dice(this.#minimum_value, this.#maximum_value, this.#modifer)};//return new Dice with same arguments
  /**
   * calculates values between minimum and maximum values, applies modifier for number of provided iterations
   * stores values in #results
   * @param {string|number} _iterations - number of iterations to run 
   */
  roll (_iterations) {
    //mutating method to enable re-rolling
    if(!isNumeric(_iterations) && typeof _iterations!=="undefined"){
      console.warn("dice-class-v1.js: Invalid iteration value, assuming 10,000.");
      this.#iterations=10000;
    }
    this.#iterations=isNumeric(_iterations) ? +_iterations : this.#iterations;
    this.#results = Array(this.#iterations).fill(null).map((_element, _index)=>{
    //create an array equal to iterations, fill with 0s, map to object with index and random integer between minimum and maximum values
    return {index:_index, value:getRandomInt(this.#minimum_value,this.#maximum_value)};
    });
    if(this.#modifer!==undefined && isNumeric(this.#modifer)) {
      //modifier is numeric, assume a simple add/subtract modifier
      this.modifyValues((_value)=>{ return _value + +this.#modifer });
    } else if (this.#modifer!==undefined && typeof this.#modifer==="function"){
      this.modifyValues(this.#modifer);
    } else {
      this.#average = this.#results.reduce((_avg,_element)=>{
      //calculate average of all generated values
      return _avg+=_element.value;
      },0)/this.#iterations;
    }
  };
  /**
   * returns all values above the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getAbove (_value) {//get all values above _value
    if(!isNumeric(_value)){console.error("dice-class-v1.js: getAbove requires a number for input.");return undefined;}
    let above_results = this.#results.filter((_element)=>{return _element.value>+_value;});//.map((_element)=>{return _element.value});
    return {count:above_results.length, values:above_results};
  };
  /**
   * returns all values below the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getBelow (_value) {//get all values below _value
    if(!isNumeric(_value)){console.error("dice-class-v1.js: getBelow requires a number for input.");return undefined;}
    let below_results = this.#results.filter((_element)=>{return _element.value<+_value;});//.map((_element)=>{return _element.value});
    return {count:below_results.length, values:below_results};
  };
  /**
   * returns all values equal to the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getEqual (_value) {//get all values equal to _value
    if(!isNumeric(_value)){console.error("dice-class-v1.js: getEqual requires a number for input.");return undefined;}
    let equal = this.#results.filter((_element)=>{return _element.value==+_value;});//.map((_element)=>{return _element.value});
    return {count:equal.length, values:equal};
  };
  /**
   * returns the results Array
   * @returns {Object[]}
   */
  getResults () {//return raw results
    return this.#results;
  };
  /**
   * returns all values within the to the input range, inclusive
   * @param {string|number} _min_value - starting value to compare
   * @param {string|number} _max_value - ending value to compare
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getWithinRange (_min_value, _max_value) {//return all values within the specified range, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("dice-class-v1.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    let range = this.#results.filter((_element)=>{return _element.value>=+_value && _element.value<=+_value;});//.map((_element)=>{return _element.value});
    return {count:equal.length, values:range};
  };
  /**
   * runs all getAbove/Below/Equal/etc functions
   * returns all generated results
   * also returns the private properties of average and results
   * @param {string|number} _value - value to match
   * @returns {Object}
   */
  getAllForValue (_value) {//get above, below, equal, average, and all results
    if(!isNumeric(_value)){console.error("dice-class-v1.js: getAllForValue requires a number for input.");return undefined;}
    let allForValue={};
    allForValue["Above_"+_value]=this.getAbove(_value);
    allForValue["Below_"+_value]=this.getBelow(_value);
    allForValue["Equal_To_"+_value]=this.getEqual(_value);
    allForValue["Average"]=this.#average;
    allForValue["All_Results"]=this.#results;
    return allForValue;
  };
  /**
   * modifies all values within #results private property, 
   * updates #averge private property
   * @param {function} _function - function to modify generated values
   */
  modifyValues (_function) {
    //pass a function to modify all values within and recalculate average
    this.#results=this.#results.map((_element)=>{
      return {index:_element.index, value:_function(_element.value)};
    });
    this.#average = this.#results.reduce((_avg,_element)=>{
      return _avg+=_element.value;
    },0)/this.#iterations;
  };
  /**
   * modifies a single value using the #modifier private property
   * @param {string|number} _value - value to modified
   * @returns {number}
   */
  modifySingleValue (_value) {
    if(this.#modifer!==undefined && typeof this.#modifer=="function") {
      return this.#modifer(+_value);
    } else if(this.#modifer!==undefined && isNumeric(this.#modifer)) {
      return +_value + +this.#modifer;
    }
    return +_value;
  }
  /**
   * generates output of all possible modified values,
   * then counts how many actual occurances of that value,
   * and provides ratio
   * @returns {Object[]} - [{value:{number}, count:{number}, ratio:{number}}]
   */
  getMetrics (){
    //return all possible values, the occurance count, and the ratio of occurance
    let metrics=[];
    let localModifyValue;
    if(isNumeric(this.#modifer)){
      localModifyValue=(_value)=>{return _value + +this.#modifer};
    } else if (typeof this.#modifer==="function"){
      localModifyValue=this.#modifer;
    } else {
      localModifyValue=(_value)=>{return _value};
    }
    for(let value=this.#minimum_value; value<=this.#maximum_value; value++) {
      let modifiedValue=localModifyValue(value);
      let count=this.getEqual(modifiedValue).count;
      let ratio=count/this.#iterations;
      metrics.push({value:modifiedValue, count:count, ratio:ratio});
    }
    return metrics;
  };
  /**
   * sets the value at the specified index to undefined
   * @param {string|number} _index - index of value to undefine
   */
  dropValueAtIndex(_index){
    //drop value at _index, setting to undefined
    this.#results[_index].value=undefined;
  }
  /**
   * 
   * @param {(undefined|string|number)} [_value_to_explode_on="max"] - the value trigger additional Dice, defaults to "max" which is the maximum value a Dice object can generate
   * @param {(undefined|string|number)} [_explode_limit=1] - the maximum number of additional Dice
   * @param {Dice} [_additional_dice=this] - the specific Dice to use, defaults to this/self
   * @returns {Dice[]} - returns an array of Dice objects
   */
  explodeValue(_value_to_explode_on, _explode_limit, _additional_dice) {
    //explode dice (add more dice) based on puts
    //returns a Dice object with calculated values for iterations that explode
    if(![undefined,"max","min"].includes(_value_to_explode_on) && !isNumeric(_value_to_explode_on)){
      console.error("dice-class-v1.js: Invalid ExplodingValue passed to explodeValue() method.; must be blank; 'max', 'min' or a number.");
      return undefined;
    }
    if(_explode_limit!==undefined && !isNumeric(_explode_limit)) {
      console.error("dice-class-v1.js: Invalid ExplodeLimit passed to explodeValue() method; must be a number.");
      return undefined;
    }
    if(_additional_dice!==undefined && !(_additional_dice instanceof Dice)) {
      console.error("dice-class-v1.js: Invalid AdditionalDice passed to explodeValue() method; must be a Dice object.");
      return undefined;
    }
    //loop over this.#results, 
    //set as undefined where this.#results value is not explode value
    //repeat loop for _explode_limit
    //return array of new Dice objects
    
    let explode_on_value;
    switch(_value_to_explode_on){
      case "min":
        explode_on_value = this.modifySingleValue(this.#minimum_value);
        break;
      case undefined:
      case "max":
        explode_on_value = this.modifySingleValue(this.#maximum_value);
        break;
      default:
        explode_on_value = +_value_to_explode_on;
        break;
    }
    let explode_dice_limit = _explode_limit===undefined ? 1 : +_explode_limit;
    let explosion_dice=[];
    let explosion_dice_source=this;
    for(let added_dice=0;added_dice<explode_dice_limit;added_dice++){
      //create array of new Dice objects of length equal to _explode_limit
      //generate values, iterations must equal explosion source dice
      //remove values for non-exploding previous Dice (source) roll
      let new_dice=_additional_dice!==undefined ? _additional_dice.getClone() : this.getClone();
      let max_new_value=new_dice.modifySingleValue(new_dice.getMaximum());
      let min_new_value=new_dice.modifySingleValue(new_dice.getMinimum());
      if(explode_on_value > max_new_value || explode_on_value < min_new_value){
        //can never explode as the explode value explode_on_value is below the minimum
        //or above the maximum, alert, continue loop
        console.warn("dice-class-v1.js: ExplodeValue is above Dice maximum or below Dice minimum, skipping iteration "+added_dice+".");
        continue;
      }
      new_dice.roll(this.getIterations());
      explosion_dice_source.getResults().filter((_element)=>{
        return _element.value!=explode_on_value;
      }).forEach((_roll)=>{
        new_dice.dropValueAtIndex(_roll.index);
      });
      explosion_dice.push(new_dice);
      explosion_dice_source=new_dice;
    }

    return explosion_dice;
  };
};