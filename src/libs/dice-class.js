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
 * @property {undefined|function} modifier - modifier function for modifying results
 * @property {string} additional_text - additional text to be available to outside libs/apps
 */
export class Dice {
  #iterations=10000;
  #results;
  #minimum_value=1;
  #maximum_value=1;
  #modifier=undefined;
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
    if(!isNumeric(_maximum_value) || _maximum_value <= _minimum_value) {
      console.error("dice-class.js: Invalid maximum value.");
    } else { 
      this.#maximum_value = +_maximum_value;
      this.#modifier=_modifier;
    }
  };
  /**
   * @param {number} _value - value to set iterations too
   */
  setIterations (_value) {
    if(!isNumeric(_value)){
      console.warn("dice-class.js: Invalid value passed to setIterations, doing nothing.")
    }
    this.#iterations = +_value;
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
  getModifier () {return this.#modifier;}//get modifier
  /**
   * @returns {function} - returns modifier function
   */
  getModifierFunction () {
    let modifierFunction;
    if(isNumeric(this.#modifier)){
      modifierFunction=(_value)=>{return _value + +this.#modifier};
    } else if (typeof this.#modifier==="function"){
      modifierFunction=this.#modifier;
    } else {
      modifierFunction=(_value)=>{return _value};
    }
    return modifierFunction;
  }//get modifier
  /**
   * @returns {Dice} - returns a new Dice object with the same min, max, and modifiers
   */
  getClone() {return new Dice(this.#minimum_value, this.#maximum_value, this.#modifier)};//return new Dice with same arguments
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
    let iterations;
    if(!isNumeric(_iterations) || _iterations===undefined){
      console.warn("dice-class.js: Invalid iteration value, using current value: "+this.#iterations+".");
      iterations = this.#iterations;
    }
    this.#results = Array(iterations).fill(null).map((_element, _index)=>{
      //create an array equal to iterations, fill with 0s, map to object with index and random integer between minimum and maximum values
      return {index:_index, value:getRandomInt(this.#minimum_value,this.#maximum_value)};
    });
    if(isNumeric(this.#modifier)) {
      //modifier is numeric, assume a simple add/subtract modifier
      this.modifyValues((_value)=>{ return _value + +this.#modifier });
    } else if (typeof this.#modifier==="function"){
      this.modifyValues(this.#modifier);
    }
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
    if(isNumeric(this.#modifier)) {
      //modifier is numeric, assume a simple add/subtract modifier
      this.modifyValues((_value)=>{ return _value + +this.#modifier });
    } else if (typeof this.#modifier==="function"){
      this.modifyValues(this.#modifier);
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
    if(this.#modifier!==undefined && typeof this.#modifier=="function") {
      return this.#modifier(+_value);
    } else if(this.#modifier!==undefined && isNumeric(this.#modifier)) {
      return +_value + +this.#modifier;
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
      new_dice.setIterations(this.getIterations());
      if(explode_on_value > max_new_value || explode_on_value < min_new_value){
        //can never explode as the explode value explode_on_value is below the minimum
        //or above the maximum, alert, continue loop
        console.warn("dice-class.js: ExplodeValue is above Dice maximum or below Dice minimum, skipping iteration "+added_dice+".");
        continue;
      }
      new_dice.roll();
      new_dice.setAdditionalText("Exploding");
      let filtered_dice = explosion_dice_source.getResults().filter((_element)=>{
        return _element.value!=explode_on_value;
      });
      filtered_dice.forEach((_roll)=>{
        new_dice.dropValueAtIndex(_roll.index);
      });
      explosion_dice.push(new_dice);
      explosion_dice_source=new_dice;
    }

    return explosion_dice;
  };
  /**
   * Update values in #results with new values
   * @param {Number[]} _values_array - array of numbers to replace/update in #results
   * @returns {undefined - on error}
   */
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
  };

  /**
 * returns all values above the input value
 * @param {string|number} _value - value to match
 * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
 */
  getAbove (_value) {//get all values above _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getAbove requires a number for input.");return undefined;}
    let above_results = this.getResults().filter((_element)=>{return _element.value>+_value;});
    return {count:above_results.length, values:above_results};
  };
  /**
   * returns all values below the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getBelow (_value) {//get all values below _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getBelow requires a number for input.");return undefined;}
    let below_results = this.getResults().filter((_element)=>{return _element.value<+_value;});
    return {count:below_results.length, values:below_results};
  };
  /**
   * returns all values equal to the input value
   * @param {string|number} _value - value to match
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getEqual (_value) {//get all values equal to _value
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getEqual requires a number for input.");return undefined;}
    let equal = this.getResults().filter((_element)=>{return _element.value==+_value;});
    return {count:equal.length, values:equal};
  };
  /**
   * returns all values within the to the input range, inclusive
   * @param {string|number} _min_value - starting value to compare
   * @param {string|number} _max_value - ending value to compare
   * @returns {Object[]} - {count: number, values: Object[{index:index, value:value}]}
   */
  getWithinRange (_min_value, _max_value) {//return all values within the specified range, inclusive
    if(!isNumeric(_min_value) || !isNumeric(_max_value)){console.error("metrics-dice-class.js: getWithinRange requires a number for Minimum and Maximum values.");return undefined;}
    let range = this.getResults().filter((_element)=>{return _element.value>=+_value && _element.value<=+_value;});
    return {count:equal.length, values:range};
  };
  /**
   * Returns Even values from Dice object
   * @returns {Object} - object with count and Array of values
   */
  getEven(){
    let even = this.getResults().filter((_element)=>{return _element.value%2==0;});
    return {count:even.length, values:even};
  };
  /**
   * Returns Odd values from Dice object
   * @returns {Object} - object with count and Array of values
   */
  getOdd(){
    let odd = this.getResults().filter((_element)=>{return _element.value%2==1;});
    return {count:odd.length, values:odd};
  };
  /**
   * runs all getAbove/Below/Equal/etc functions
   * returns all generated results
   * also returns the private properties of average and results
   * @param {string|number} _value - value to match
   * @returns {Object}
   */
  getAllForValue (_value) {//get above, below, equal, average, and all results
    if(!isNumeric(_value)){console.error("metrics-dice-class.js: getAllForValue requires a number for input.");return undefined;}
    let allForValue={};
    allForValue["Above_"+_value]=this.getAbove(_value);
    allForValue["Below_"+_value]=this.getBelow(_value);
    allForValue["Equal_To_"+_value]=this.getEqual(_value);
    allForValue["All_Results"]=this.getResults();
    return allForValue;
  };
};