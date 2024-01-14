//modify constructor to allow for input of an array of numbers
//constructor(_minimum_value, _maximum_value, _modifier) 
//or
//constructor(_array_of_numbers, _modifier)
// -- min and max values are read from Array
// -- array need not be in a specific order
import { getRandomInt } from "./getRandomInt.js";
import { isNumeric } from "./isNumeric.js";
/**
 * Dice object takes in a minimum and maximum number, and optional modifier. 
 * Generates results between minimum and maximum values (inclusive), modifies values and stores results in results private property.
 * @typedef {Object} Dice - The Dice object
 * @property {number} iterations - number of iterations
 * @property {Object[]} results - Array of objects containing {index, value}
 * @property {number} minimum_value - Minimum value passed to Dice constructor
 * @property {number} maximum_value - Maximum value passed to Dice constructor
 * @property {undefined|function} modifer - modifier function for modifying results
 * @property {string} additional_text - additional text to be available to outside libs/apps
 */
export class Dice {
  #iterations=10000;
  #results;
  #minimum_value=1;
  #maximum_value=1;
  #modifer=undefined;
  #additional_text="";
  /**
   * Checks inputs and sets private properties. Does not auto-run roll().
   * @class
   * @param {string|number} [_minimum_value=1] - minimum number for generating, default 1
   * @param {string|number} _maximum_value - maximum number for generating, required
   * @param {undefined|number|function} _modifier - function to modify generating numbers
   */
  constructor(_minimum_value, _maximum_value, _modifier) {
    if(!isNumeric(_minimum_value)) {
      console.warn("dice-class.js: Invalid minimum value, assuming 1.");
    } else { this.#minimum_value = +_minimum_value; }
    if(!isNumeric(_maximum_value)) {
      console.error("dice-class.js: Invalid maximum value.");
    } else { 
      this.#maximum_value = +_maximum_value;
      this.#modifer=_modifier;
    }
  };
  /**
   * @param {number|string} _iterations - number of iterations for Dice to roll
   * @returns {undefined} - on bad input
   */
  setIterations (_iterations) {
    if(!isNumeric(_iterations)){
      console.warn("dice-class.js: setIterations requires a number as input. No changes made.");
      return;
    }
    this.#iterations = +_iterations;
  }
  /**
   * @returns {number} - returns number of iterations
   */
  getIterations () {return this.#iterations;}//get number of iterations
  /**
   * @returns {number} - returns unmodified minimum value
   */
  getMinimum () {return this.#minimum_value;}//get unmodified minimum value
  /**
   * @returns {number} - returns unmodified maximum value
   */
  getMaximum () {return this.#maximum_value;}//get unmodified maximum value
  /**
   * @returns {undefined|number|function} - returns modifier value
   */
  getModifier () {return this.#modifer;}//get modifier
  /**
   * @returns {function} - returns modifier function
   */
  getModifierFunction () {
    let modifierFunction;
    if(isNumeric(this.#modifer)){
      modifierFunction=(_value)=>{return _value + +this.#modifer};
    } else if (typeof this.#modifer==="function"){
      modifierFunction=this.#modifer;
    } else {
      modifierFunction=(_value)=>{return _value};
    }
    return modifierFunction;
  }//get modifier
  /**
   * @returns {Dice} - returns a new Dice object with the same min, max, and modifiers
   */
  getClone() {return new Dice(this.#minimum_value, this.#maximum_value, this.#modifer)};//return new Dice with same arguments
  /**
   * 
   * @param {string} _text - input of number or text to be stored for outside lib/app use
   */
  setAdditionalText(_text){
    if(typeof _text !== "string" && typeof _text !== "number") {
      console.warn("dice-class.js: Non-text/non-number passed to setAdditionalText() method. Setting to empty string.");
      this.#additional_text="";
    } else {
      this.#additional_text=_text;
    }
  }
  /**
   * @returns {text|number} - returns additional_text property
   */
  getAdditionalText(){
    return this.#additional_text;
  }
  /**
   * calculates values between minimum and maximum values, applies modifier for number of provided iterations
   * stores values in #results
   * @param {string|number} _iterations - number of iterations to run 
   */
  roll (_iterations) {
    //mutating method to enable re-rolling
    /* if(!isNumeric(_iterations) || _iterations===undefined){
      console.warn("dice-class.js: Invalid iteration value, assuming 10,000.");
      this.#iterations=10000;
    }
    this.#iterations=isNumeric(_iterations) ? +_iterations : this.#iterations; */
    this.#results = Array(this.#iterations).fill(null).map((_element, _index)=>{
      //create an array equal to iterations, fill with 0s, map to object with index and random integer between minimum and maximum values
      return {index:_index, value:getRandomInt(this.#minimum_value,this.#maximum_value)};
    });
    if(this.#modifer!==undefined && isNumeric(this.#modifer)) {
      //modifier is numeric, assume a simple add/subtract modifier
      this.modifyValues((_value)=>{ return _value + +this.#modifer });
    } else if (this.#modifer!==undefined && typeof this.#modifer==="function"){
      this.modifyValues(this.#modifer);
    } /* else {
      this.#average = this.#results.reduce((_avg,_element)=>{
      //calculate average of all generated values
      return _avg+=_element.value;
      },0)/this.#iterations;
    } */
  };
  /**
   * Re-roll a value at a specific index
   * @param {string|number} _index - re-rolls the value at the specific index
   * @returns {undefined} - on error
   */
  reRoll(_index){
    if(!isNumeric(_index) || _index==undefined){
      console.error("dice-class.js: Invalid value passed to reRoll() method.");
      return undefined;
    }
    this.#results[_index].value=getRandomInt(this.#minimum_value,this.#maximum_value);
    if(this.#modifer!==undefined && isNumeric(this.#modifer)) {
      //modifier is numeric, assume a simple add/subtract modifier
      this.modifyValues((_value)=>{ return _value + +this.#modifer });
    } else if (this.#modifer!==undefined && typeof this.#modifer==="function"){
      this.modifyValues(this.#modifer);
    }/*  else {
      this.#average = this.#results.reduce((_avg,_element)=>{
      //calculate average of all generated values
      return _avg+=_element.value;
      },0)/this.#iterations;
    } */
  }
  /**
   * returns the results Array
   * @returns {Object[]}
   */
  getResults () {//return raw results
    return this.#results;
  };
  modifyValues (_function) {
    //pass a function to modify all values within and recalculate average
    this.#results=this.#results.map((_element)=>{
      return {index:_element.index, value:_function(_element.value)};
    });
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
      console.error("dice-class.js: Invalid ExplodingValue passed to explodeValue() method.; must be blank; 'max', 'min' or a number.");
      return undefined;
    }
    if(_explode_limit!==undefined && !isNumeric(_explode_limit)) {
      console.error("dice-class.js: Invalid ExplodeLimit passed to explodeValue() method; must be a number.");
      return undefined;
    }
    if(_additional_dice!==undefined && !(_additional_dice instanceof Dice)) {
      console.error("dice-class.js: Invalid AdditionalDice passed to explodeValue() method; must be a Dice object.");
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
        console.warn("dice-class.js: ExplodeValue is above Dice maximum or below Dice minimum, skipping iteration "+added_dice+".");
        continue;
      }
      new_dice.setIterations(this.#iterations);
      new_dice.roll();
      new_dice.setAdditionalText("Exploding");
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

  updateValues(_values_array){
    if(!Array.isArray(_values_array)){
      console.error("dice-class.js: updateValues requires an Array as input.");
      return
    }
    if(_values_array.length==this.#iterations){
      this.#results=_values_array;
    } else if(_values_array.length>this.#iterations){
      console.warn("dice-class.js: updateValues passed array that is longer than current iterations, reducing to iterations length.");
      this.#results = _values_array.toSpliced(0,this.#iterations);
    } else if(_values_array.length<this.#iterations){
      console.warn("dice-class.js: updateValues passed array that is shoter than current iterations, padding with undefined.");
      this.#results = _values_array.toSpliced(0);
      this.#results.fill(undefined,_values_array.length);
    }
  }
};